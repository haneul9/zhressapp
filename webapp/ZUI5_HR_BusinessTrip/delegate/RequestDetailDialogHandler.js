/* global moment:true Promise:true */
sap.ui.define([
	"common/Common",
	"common/moment-with-locales",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	momentjs,
	MessageBox,
	BusyIndicator,
	JSONModel
) {
"use strict";

var Handler = {

	oController: null,
	oRowData: null,
	oDialog: null,
	//대근자
	dArr: new Array(),
	//
	oModel: new JSONModel({
		Header: null,
		BtPurpose1SelectList: null, // 출장구분 코드 목록
		SubtySelectList: null,      // 근태유형 코드 목록
		EncardSelectList: null,     // 출입카드 신청 코드 목록
		EnameList: null             // 출장자 popup 목록 : 대리인 자격으로 신청시
	}),

	// DialogHandler 호출 function
	get: function(oController, oRowData) {

		this.oController = oController;
		this.oRowData = $.extend(true, {}, oRowData);

		Common.removeProperties(this.oRowData, "__metadata");

		oController.RequestDetailDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "RequestDetailDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.RequestDetailDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	once: function() {

		var Pernr = this.oController.getSessionInfoByKey("name"),
			Bukrs = this.oController.getSessionInfoByKey("Bukrs"),
		    Langu = this.oController.getSessionInfoByKey("Langu");

		return Promise.all([
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 출장자 popup 목록 조회
					"/DelegateCheckSet",
					{
						IPernr: Pernr,
						IEmpid: Pernr,
						IBukrs: Bukrs,
						ILangu: Langu,
						IVolma: "9300",
						TableIn: []
					},
					{
						success: function(oData) {
							this.oModel.setProperty("/EnameList", Common.getTableInResults(oData, "TableIn"));
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);
						}
					}
				);
			}.bind(this)),
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 출장구분 코드 목록 조회
					"/BtCodeSet",
					{
						ICodeT: "004",
						IBukrs: Bukrs,
						ILangu: Langu,
						TableIn: []
					},
					{
						success: function(oData) {
							var BtPurpose1SelectList = Common.getTableInResults(oData, "TableIn");
							if (BtPurpose1SelectList.length > 1) {
								BtPurpose1SelectList.unshift({ Text: this.oController.getBundleText("LABEL_00181") }); // - 선택 -
							}
							this.oModel.setProperty("/BtPurpose1SelectList", BtPurpose1SelectList);
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);
						}
					}
				);
			}.bind(this)),
			Common.getPromise(function() {
				$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 출입카드 신청지역 코드 목록 조회
					"/BtCodeSet",
					{
						ICodeT: "007",
						IBukrs: Bukrs,
						ILangu: Langu,
						TableIn: []
					},
					{
						success: function(oData) {
							var EncardSelectList = Common.getTableInResults(oData, "TableIn");
							if (EncardSelectList.length) {
								EncardSelectList.unshift({ Text: this.oController.getBundleText("LABEL_00181") }); // - 선택 -
							}
							this.oModel.setProperty("/EncardSelectList", EncardSelectList);
						}.bind(this),
						error: function(oResponse) {
							Common.log(oResponse);
						}
					}
				);
			}.bind(this))
		]);
	},

	// DialogHandler 호출 function
	getParentView: function() {

		return this.oController.getView();
	},

	// DialogHandler 호출 function
	getModel: function() {

		return this.oModel;
	},

	// DialogHandler 호출 function
	getDialog: function() {

		return this.oDialog;
	},

	// DialogHandler 호출 function
	setDialog: function(oDialog) {

		this.oDialog = oDialog;

		return this;
	},

	// DialogHandler 호출 function
	onBeforeOpen: function() {
		Common.log("Business trip request detail dialog handler.onBeforeOpen"); // 출장 신청 상세 조회

		var IPernr;

		// SAP Report에서 상세 조회시
		if (this.oRowData.isReportPopup) {
			IPernr = "";
		}
		// 신청 버튼 클릭시
		else if (typeof this.oRowData.Btbpn === "undefined") {
			IPernr = this.oController.getSessionInfoByKey("name");
		}
		// 신청현황 목록 클릭시
		else {
			IPernr = this.oRowData.Btbpn;
		}

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtRequestSet",
				{
					IConType: $.app.ConType.CHECK,
					IPernr: IPernr,
					// IPernr: typeof this.oRowData.Btbpn === "undefined" ? this.oController.getSessionInfoByKey("name") : "",
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn01", this.oRowData)],
					TableIn02: [], // 출장 Header 정보
					TableIn03: [], // 출장 일정 목록
					TableIn04: [], // 동반출장자 목록
					TableIn05: [], // 코스트센터 소속부서
					TableIn06: []  // 근태유형 코드 목록
				},
				{
					success: function(oData) {
						Common.log("RequestDetailDialogHandler.onBeforeOpen success", oData);

						var SubtyUseynMap = {},
						SubtySelectList = $.map(Common.getTableInResults(oData, "TableIn06"), function(o) { // 근태유형 코드 목록
							SubtyUseynMap[o.Subty] = o.Useyn;
							return o;
						});
						if (SubtySelectList.length > 1) {
							SubtySelectList.unshift({ Subtx1: this.oController.getBundleText("LABEL_00181") }); // - 선택 -
						}
						this.oModel.setProperty("/SubtySelectList", SubtySelectList);
						this.oModel.setProperty("/SubtyUseynMap", SubtyUseynMap);

						var TableIn02 = Common.getTableInResults(oData, "TableIn02");
						if (TableIn02.length) { // Header, 출장비 합계 정보
							var Header = TableIn02[0];
							if (!Header.BtPurpose1) {
								var BtPurpose1SelectList = this.oModel.getProperty("/BtPurpose1SelectList");
								Header.BtPurpose1 = BtPurpose1SelectList.length === 1 ? this.oModel.getProperty("/BtPurpose1SelectList/0/Code") : this.oModel.getProperty("/BtPurpose1SelectList/1/Code");
							}
							if (this.oRowData.isReportPopup) {
								Header.Edtfg = false;
							}

							Header.EventFiredOnAdvtot = false; // 가지급금 초과 경고 MessageBox 표시 여부
							Header.SubtyUseyn = SubtyUseynMap[Header.Subty]; // 근태유형이 출장 유형이면 true
							Header.isEnameDialogAvailable = (this.oModel.getProperty("/EnameList") || []).length > 0;
							Header.Btact = typeof this.oRowData.Btact === "boolean" ? this.oRowData.Btact : true;
							Header.ExptTotDaily = Common.toNumber(Header.ExptTotDaily);
							Header.ExptTotLodge = Common.toNumber(Header.ExptTotLodge);
							Header.ExptTotTotAmt = Common.toNumber(Header.ExptTotTotAmt);
							Header.Advtot = Common.toNumber(Header.Advtot);
							Header.BtAdvanceLc = Header.Advtot;

							this.oModel.setProperty("/Header", Header);
							this.oModel.setProperty("/TableIn02", TableIn02);
						} else {
							this.oModel.setProperty("/Header", {
								isEnameDialogAvailable: (this.oModel.getProperty("/EnameList") || []).length > 0,
								Btact: typeof this.oRowData.Btact === "boolean" ? this.oRowData.Btact : true,
								BtPurpose1: this.oModel.getProperty("/BtPurpose1SelectList/1/Code"),
								DtRqst: moment().toDate(),
								Budat: moment().toDate(),
								EventFiredOnAdvtot: false,
								SubtyUseyn: "N",
								Edtfg: true
							});
							this.oModel.setProperty("/TableIn02", [{
								// ExptTotTotAmt: "0",
								// ExptTotDaily: "0",
								// Advtot: "0",
								// ExptTotLodge: "0",
								// Difamt: "0",
								// ZlcWaers: ""
							}]);
						}

						var TableIn03 = Common.getTableInResults(oData, "TableIn03"); // 출장 일정 목록
						if (TableIn03.length) {
							$.map(TableIn03, function(o) {
								o.ExptDailyLc = Common.toNumber(o.ExptDailyLc);
								o.ExptDailyTr = Common.toNumber(o.ExptDailyTr);
								o.ExptLodgeLc = Common.toNumber(o.ExptLodgeLc);
								o.ExptLodgeTr = Common.toNumber(o.ExptLodgeTr);
								o.ExptTotAmt = Common.toNumber(o.ExptTotAmt);
							});
							this.oModel.setProperty("/TableIn03", TableIn03);
	//						this.onShow.call(this);
						} else {
							this.oModel.setProperty("/TableIn03", [{}]);
	//						this.initAdded.call(this.oController);
						}
						Common.adjustVisibleRowCount($.app.byId("TableIn03"), 5, TableIn03.length);

						var TableIn04 = Common.getTableInResults(oData, "TableIn04"); // 동반출장자 목록
						if (TableIn04.length) {
							$.map(TableIn04, function(o) {
								o.Difamt = Common.toNumber(o.Difamt);
								o.BtAdvanceLc = Common.toNumber(o.BtAdvanceLc);
								o.ExptTotDaily = Common.toNumber(o.ExptTotDaily);
								o.ExptTotLodge = Common.toNumber(o.ExptTotLodge);
								o.ExptTotTotAmt = Common.toNumber(o.ExptTotTotAmt);
							});
						}
						this.oModel.setProperty("/TableIn04", TableIn04);
						Common.adjustVisibleRowCount($.app.byId("TableIn04"), 5, TableIn04.length);

						this.oModel.setProperty("/MainCostCenterList", Common.getTableInResults(oData, "TableIn05")); // 코스트센터 소속부서

						this.toggleAdvanceAmtState(); // 가지급금 입력 활성화 여부 결정
					}.bind(this),
					error: function(oResponse) {
						Common.log("RequestDetailDialogHandler.onBeforeOpen error", oResponse);

						var errData = Common.parseError(oResponse);
						if (errData.Error && errData.Error === "E") {
							MessageBox.error(errData.ErrorMessage, {
								title: this.oController.getBundleText("LABEL_09029") // 확인
							});
						}
					}.bind(this)
				}
			);
		}.bind(this));
	},

	toggleButtonsState: function(enabled) {

		this.getModel().setProperty("/Header/Btact", enabled);
	},

	// 가지금급 입력 필드 활성화 여부 결정 및 비활성화시 값 초기화
	toggleAdvanceAmtState: function() {

		var oModel = this.getModel(),
		enabled = oModel.getProperty("/Header/Edtfg") && this.oController.getSessionInfoByKey("Bukrs2") !== "1000";
		if (enabled) {
			oModel.setProperty("/Header/EnableAdvtot", true);
			return;
		}

		var domesticSchedules = $.map(oModel.getProperty("/TableIn03") || [], function (o) {
			if (o.ClDmtr === "1") {
				return 1;
			}
		});

		enabled = domesticSchedules.length === 0;
		oModel.setProperty("/Header/EnableAdvtot", enabled);

		var Advtot = Common.toNumber(oModel.getProperty("/Header/Advtot") || 0);
		if (!enabled && Advtot != 0) {
			oModel.setProperty("/Header/Advtot", 0);

			this.calculateAmount();
		}
	},

	retrieveHeader: function() {

		BusyIndicator.show(0);

		return Common.getPromise(function () {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtRequestSet",
				{
					IConType: $.app.ConType.CHECK,
					IPernr: this.oModel.getProperty("/Header/Pernr"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [{}],
					TableIn02: [] // 출장 Header 정보
				},
				{
					success: function (oData) {
						Common.log("RequestDetailDialogHandler.retrieveHeader success", oData);

						var TableIn02 = Common.getTableInResults(oData, "TableIn02");
						if (TableIn02.length) { // Header, 출장비 합계 정보
							var Header = TableIn02[0];
							if (!Header.BtPurpose1) {
								var BtPurpose1SelectList = this.oModel.getProperty("/BtPurpose1SelectList");
								Header.BtPurpose1 = BtPurpose1SelectList.length === 1 ? this.oModel.getProperty("/BtPurpose1SelectList/0/Code") : this.oModel.getProperty("/BtPurpose1SelectList/1/Code");
							}

							Header.Zzdocno = this.oModel.getProperty("/Header/Zzdocno");
							Header.ZzdocnoAcc = this.oModel.getProperty("/Header/ZzdocnoAcc");
							Header.SubtyUseyn = this.oModel.getProperty("/Header/SubtyUseyn");

							Header.EventFiredOnAdvtot = false; // 가지급금 초과 경고 MessageBox 표시 여부
							Header.isEnameDialogAvailable = (this.oModel.getProperty("/EnameList") || []).length > 0;
							Header.Btact = typeof this.oRowData.Btact === "boolean" ? this.oRowData.Btact : true;
							Header.ExptTotDaily = Common.toNumber(Header.ExptTotDaily);
							Header.ExptTotLodge = Common.toNumber(Header.ExptTotLodge);
							Header.ExptTotTotAmt = Common.toNumber(Header.ExptTotTotAmt);
							Header.Advtot = Common.toNumber(Header.Advtot);
							Header.BtAdvanceLc = Header.Advtot;

							this.oModel.setProperty("/Header", Header);
							this.oModel.setProperty("/TableIn02", TableIn02);
						} else {
							this.oModel.setProperty("/Header", {
								isEnameDialogAvailable: (this.oModel.getProperty("/EnameList") || []).length > 0,
								Btact: typeof this.oRowData.Btact === "boolean" ? this.oRowData.Btact : true,
								BtPurpose1: this.oModel.getProperty("/BtPurpose1SelectList/1/Code"),
								DtRqst: moment().toDate(),
								Budat: moment().toDate(),
								EventFiredOnAdvtot: false,
								SubtyUseyn: "N",
								Edtfg: true
							});
							this.oModel.setProperty("/TableIn02", [{
								// ExptTotTotAmt: "0",
								// ExptTotDaily: "0",
								// Advtot: "0",
								// ExptTotLodge: "0",
								// Difamt: "0",
								// ZlcWaers: ""
							}]);
						}

						this.oModel.setProperty("/MainCostCenterList", Common.getTableInResults(oData, "TableIn05")); // 코스트센터 소속부서

						this.toggleAdvanceAmtState(); // 가지급금 입력 활성화 여부 결정

						BusyIndicator.hide();
					}.bind(this),
					error: function (oResponse) {
						Common.log("RequestDetailDialogHandler.retrieveHeader error", oResponse);

						var errData = Common.parseError(oResponse);
						if (errData.Error && errData.Error === "E") {
							MessageBox.error(errData.ErrorMessage, {
								title: this.oController.getBundleText("LABEL_09029") // 확인
							});
						}

						BusyIndicator.hide();
					}.bind(this)
				}
			);
		}.bind(this));
	},

	calculateAmount: function() {
		Common.log("Business trip request detail dialog handler.calculateAmount"); // 출장 비용 계산

		var data = this.oModel.getData(),
		Header = Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn02", data.Header || {});

		if (!Header.BtPurpose1) {
			return;
		}

		var TableIn03 = $.map(data.TableIn03, function(o, i) {
			if (o.BtCity && o.BtStartdat && o.BtEnddat) {
				o.Btseq = Common.lpad(i, 2);
				this.oModel.setProperty("/TableIn03/" + i + "/Btseq", o.Btseq);
				return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn03", o);
			}
		}.bind(this));

		if (!TableIn03.length) {
			return;
		}

		var TableIn04 = $.map(data.TableIn04, function(o, i) {
			if (o.Pernr) {
				o.Btseq = Common.lpad(i, 2);
				this.oModel.setProperty("/TableIn04/" + i + "/Btseq", o.Btseq);
				return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn04", o);
			}
		}.bind(this));

		Header.Accfg = TableIn04.length > 0;

		return Common.getPromise(function () {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtRequestSet",
				{
					IConType: $.app.ConType.CHECK,
					IPernr: this.oModel.getProperty("/Header/Pernr"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [],
					TableIn02: [Header],  // 출장 Header 정보
					TableIn03: TableIn03, // 출장 일정 목록
					TableIn04: TableIn04, // 동반출장자 목록
					TableIn05: [], // 코스트센터 소속부서
					TableIn06: []  // 근태유형 코드 목록
				},
				{
					success: function(oData) {
						Common.log("RequestDetailDialogHandler.calculateAmount success", oData);

						var TableIn02 = Common.getTableInResults(oData, "TableIn02");
						if (TableIn02.length) {
							var SubtyUseynMap = this.oModel.getProperty("/SubtyUseynMap"),
							Header = TableIn02[0];
							Header.isEnameDialogAvailable = (this.oModel.getProperty("/EnameList") || []).length > 0;
							Header.EventFiredOnAdvtot = this.oModel.getProperty("/Header/EventFiredOnAdvtot");
							Header.Btact = this.oModel.getProperty("/Header/Btact");
							Header.SubtyUseyn = SubtyUseynMap[Header.Subty] || "N";

							Header.ExptTotDaily = Common.toNumber(Header.ExptTotDaily);
							Header.ExptTotLodge = Common.toNumber(Header.ExptTotLodge);
							Header.ExptTotTotAmt = Common.toNumber(Header.ExptTotTotAmt);
							Header.Advtot = Common.toNumber(Header.Advtot);
							Header.BtAdvanceLc = Header.Advtot;

							this.oModel.setProperty("/Header", Header);
							this.oModel.setProperty("/TableIn02", TableIn02);

							if (Header.IfAdv && Header.EventFiredOnAdvtot) {
								MessageBox.warning(this.oController.getBundleText("MSG_19017"), { // 가지급금이 한도액(일비)를 초과했습니다.
									onClose: function() {
										this.getModel().setProperty("/Header/EventFiredOnAdvtot", false);
									}.bind(this)
								});
							}
						}

						var TableIn03 = Common.getTableInResults(oData, "TableIn03");
						if (TableIn03.length) {
							var TableIn03Map = {};
							$.map(TableIn03, function(o) {
								o.ExptDailyLc = Common.toNumber(o.ExptDailyLc);
								o.ExptDailyTr = Common.toNumber(o.ExptDailyTr);
								o.ExptLodgeLc = Common.toNumber(o.ExptLodgeLc);
								o.ExptLodgeTr = Common.toNumber(o.ExptLodgeTr);
								o.ExptTotAmt = Common.toNumber(o.ExptTotAmt);

								TableIn03Map[o.Btseq] = o;
							});
							TableIn03 = $.map(this.oModel.getProperty("/TableIn03"), function(o) {
								if (typeof o.Btseq !== "undefined") {
									$.extend(o, TableIn03Map[o.Btseq]);
								}
								return o;
							});
							this.oModel.setProperty("/TableIn03", TableIn03);
						}

						var TableIn04 = Common.getTableInResults(oData, "TableIn04");
						if (TableIn04.length) {
							var TableIn04Map = {};
							$.map(TableIn04, function(o) {
								o.Difamt = Common.toNumber(o.Difamt);
								o.BtAdvanceLc = Common.toNumber(o.BtAdvanceLc);
								o.ExptTotDaily = Common.toNumber(o.ExptTotDaily);
								o.ExptTotLodge = Common.toNumber(o.ExptTotLodge);
								o.ExptTotTotAmt = Common.toNumber(o.ExptTotTotAmt);

								TableIn04Map[o.Btseq] = o;
							});
							TableIn04 = $.map(this.oModel.getProperty("/TableIn04"), function(o) {
								if (typeof o.Btseq !== "undefined") {
									$.extend(o, TableIn04Map[o.Btseq]);
								}
								return o;
							});
							this.oModel.setProperty("/TableIn04", TableIn04);
						}

						this.toggleAdvanceAmtState(); // 가지급금 입력 필드 활성화 여부 결정
					}.bind(this),
					error: function(oResponse) {
						Common.log("RequestDetailDialogHandler.calculateAmount error", oResponse);

						var errData = Common.parseError(oResponse);
						if (errData.Error && errData.Error === "E") {
							MessageBox.error(errData.ErrorMessage, {
								title: this.oController.getBundleText("LABEL_09029") // 확인
							});
						}
					}.bind(this)
				}
			);
		}.bind(this));
	},

	
	//대근자 지정 관련
	sizingAdded : function(oController,oMat,dLength){
		var c=sap.ui.commons;
		var oRow,oCell;
		var oCnt1=11;
		var oCnt2=10;
		if(dLength>8){
			var width1=new Array();
			for(var i=0;i<10;i++){
				width1.push("");
			}
			width1.push("13px");
			oMat.setWidths(width1);
			oMat.setColumns(oCnt1);
			$.app.byId(oController.PAGEID+"_Cell").setColSpan(oCnt1);
		}else{
			var width1=new Array();
			for(var i=0;i<10;i++){
				width1.push("");
			}
			oMat.setWidths(width1);
			oMat.setColumns(oCnt2);
			$.app.byId(oController.PAGEID+"_Cell").setColSpan(oCnt2);
		}
	},

	initAdded : function(){ 
		var oRow,oCell;
		var c=sap.ui.commons,oCol=$.app.byId(this.PAGEID+"_Col");
		oCol.removeAllRows();
		oRow=new c.layout.MatrixLayoutRow();
		oCell=new c.layout.MatrixLayoutCell({
			colSpan:10,
			hAlign:"Center",
			content:[new sap.ui.core.HTML({preferDOM:false,content:"<div style='height:5px;'>"}),
			new sap.m.Text({text:this.getBundleText("MSG_05001")}),
			new sap.ui.core.HTML({preferDOM:false,content:"<div style='height:5px;'>"})]
		}).addStyleClass("UnderBar");
		oRow.addCell(oCell);
		oCol.addRow(oRow);
	},

	renderAdded : function(oController,pData){
		var Dtfmt = oController.getSessionInfoByKey("Dtfmt"),c=sap.ui.commons,
		oRow,oCell,oMat=$.app.byId(oController.PAGEID+"_Col"),oFields=["Ename","Datum","Awtxt","Beguzenduz","Ovtim","Wt40","Wt12","Wtsum","LigbnTx","Cntgb"];
		oMat.removeAllRows();	
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
		for(var i=0;i<100;i++){
			var oId=$.app.byId(oController.PAGEID+"_Row_"+i);
			for(var j=0;j<100;j++){
				var oId2=$.app.byId(oController.PAGEID+"_Cell_"+j+"_"+i);
				if(oId2){
					oId2.destroy();
				}
			}
			if(oId){
				oId.destroy();
			}
		}

		for(var j=0;j<pData.length;j++){
			oRow=new c.layout.MatrixLayoutRow(oController.PAGEID+"_Row_"+j);	
			for(var i=0;i<10;i++){
				if(pData[j].Awtxt=="휴일"){
					oCell=new c.layout.MatrixLayoutCell(oController.PAGEID+"_Cell_"+j+"_"+i,{hAlign:"Center"}).addStyleClass("datacell");
					oRow.addCell(oCell);
					switch (i) {
						case 0:
							oCell.addContent(new sap.m.Text({text:pData[j].Ename}));
							break;
						case 1:
							oCell.addContent(new sap.ui.core.HTML({preferDOM:false,content:"<span style='font-weight:bold;color:red;font-size:14px;'>"+dateFormat.format(pData[j].Datum)+"</span>"}));
							break;
						case 2:
							oCell.addContent(new sap.ui.core.HTML({preferDOM:false,content:"<span style='font-weight:bold;color:red;font-size:14px;'>"+pData[j].Awtxt+"</span>"}));
							break;
						default:
							break;
					}
				}else{
					oCell=new c.layout.MatrixLayoutCell(oController.PAGEID+"_Cell_"+j+"_"+i,{hAlign:"Center"}).addStyleClass("datacell");
					oRow.addCell(oCell);
					switch (i) {
						case 1:
							oCell.addContent(
								new sap.m.Text({
									text: dateFormat.format(pData[j].Datum)
								})						
							);
						break;
						case 2:
							oCell.addContent();
							break;
						case 3:
							oCell.addContent();
						break;
						case oFields.length-1:
							oCell.addContent();
						break;
						default:
							eval("oCell.addContent(new sap.m.Text({text:pData[j]."+oFields[i]+"}))");
						break;
					}
				}
			}
			oMat.addRow(oRow);
		}
		this.sizingAdded(oController,$.app.byId(oController.PAGEID+"_Mat"),pData.length,$.app.byId(oController.PAGEID+"_Cell"),$.app.byId(oController.PAGEID+"_Col"));
		if(pData.length==0){
			this.initAdded.call(oController);
		}
	},

	onShow : function(){
		var jModel=this.oModel;
		var oModel=$.app.getModel("ZHR_WORKTIME_APPL_SRV");
		var oData3=this.oModel.getProperty("/TableIn03");
		var oData4=this.oModel.getProperty("/TableIn04");
		var tArr=new Array();
		var dArr=new Array();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
		function chkCover(vStrs){
			for(var i=0;i<vStrs.length;i++){
				var _Awchk="";
				var vData={
					IBegda: new Date(dateFormat.format(vStrs[i].IBegda)+"T09:00:00"),
					IEndda: new Date(dateFormat.format(vStrs[i].IEndda)+"T09:00:00"),
					IPernr: vStrs[i].IPernr,
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					Export: []
				};
				oModel.create("/VacationCoverTargetSet", vData, null,
					function(data,res){
						if(data&&data.Export.results.length){
							_Awchk=data.Export.results[0].Awchk;
						}				
						if(_Awchk!=""){
							dArr.push(vStrs[i]);
						}
					},
					function (oError) {
						var Err = {};						
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
							else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
						} else {
							sap.m.MessageBox.alert(oError.toString());
						}
					}
				);
			}
		}
		if(oData3&&oData3.length){
			if(oData3.length>0){
				for(var i=0;i<oData3.length;i++){
					tArr.push({IPernr:this.oController.getSessionInfoByKey("Pernr"),IBegda:oData3[i].BtStartdat,IEndda:oData3[i].BtEnddat});
					if(oData4&&oData4.length){
						for(var j=0;j<oData4.length;j++){
							tArr.push({IPernr:oData4[j].Pernr,IBegda:oData3[i].BtStartdat,IEndda: oData3[i].BtEnddat});
						}
					}
				}				
			}
		}
		var oArray=new Array();
		if(tArr&&tArr.length){
			for(var i=0;i<tArr.length;i++){
				oArray.push(tArr[i].IPernr);
			}
		}
		var fArray=new Array();
		oArray=Array.from(new Set(oArray));
		for(var i=0;i<oArray.length;i++){
			for(var j=0;j<tArr.length;j++){
				if(oArray[i]==tArr[j].IPernr){
					fArray.push(tArr[j]);
				}
			}
		}
		chkCover.call(this,fArray);
		var oModel=$.app.getModel("ZHR_WORKTIME_APPL_SRV");
		var oDatas=new Array();
		for(var i=0;i<dArr.length;i++){
			var vData={IConType: "1",
					IAwart: this.oModel.getProperty("/Header").BtPurpose1,
					IProType : "1",
					IBegda: new Date(dateFormat.format(dArr[i].IBegda)+"T09:00:00"),
					IEndda: new Date(dateFormat.format(dArr[i].IEndda)+"T09:00:00"),
					IPernr: dArr[i].IPernr,
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn: []};
			oModel.create("/VacationCoverSet", vData, null,
				function(data,res){
					if(data&&data.TableIn.results.length){
						for(var j=0;j<data.TableIn.results.length;j++){
							oDatas.push(data.TableIn.results[j]); 
						}					
					}				
				},
				function (oError) {
					var Err = {};						
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
						else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
					} else {
						sap.m.MessageBox.alert(oError.toString());
					}
				}
			);
		}
		this.renderAdded.call(this,this.oController,oDatas);
	},

	onLimit : function(){
		
	}

};

return Handler;

});