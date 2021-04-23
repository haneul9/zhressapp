/* global moment:true Promise:true */
sap.ui.define([
	"common/Common",
	"common/moment-with-locales",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"../../common/SearchUser1"
], function(
	Common,
	momentjs,
	MessageBox,
	BusyIndicator,
	JSONModel,
	SearchUser1
) {
"use strict";

var Handler = {

	oController: null,
	oRowData: null,
	oDialog: null,
	//대근자
	flag : "",
	_dArr: new Array(),
	_AddPersonDialog:null,
	_addDatas:{id:""},
	oDatas: null,
	_Peridx:0,
	_Daegun:"",
	_Hando:"",
	//
	oModel: new JSONModel({
		Header: null,
		BtPurpose1SelectList: null, // 출장구분 코드 목록
		SubtySelectList: null,      // 근태유형 코드 목록
		EncardSelectList: null,     // 출입카드 신청 코드 목록
		EnameList: null,             // 출장자 popup 목록 : 대리인 자격으로 신청시
		addData: new Array()		// 대근자 목록
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
					TableIn06: [],  // 근태유형 코드 목록
					TableIn07: []   // 대근자 목록
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

						var TableIn07 = Common.getTableInResults(oData, "TableIn07"); // 대근자 
						this.oModel.getProperty("/Header").Status1=="AA"?TableIn07=new Array():null;
						this._dArr=TableIn07;					
						this.renderAdded.call(this,$.app.getController(),TableIn07);
						this.onShow.call(this,TableIn07);
						this.oModel.getProperty("/Header").Status1!="AA"?this.afterTable(TableIn07):null;
						$.app.byId($.app.getController().PAGEID+"_aTable").getModel().setProperty("/addData", TableIn07);
						Common.adjustVisibleRowCount($.app.byId($.app.getController().PAGEID+"_aTable"), 10, TableIn07.length);
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

	openPersonDial: function(oEvent) {
		var oEventSource = oEvent.getSource();
		var target = oEventSource.data("target");
		this.RequestDetailDialogHandler.flag="5";
		var rowIndex = oEventSource.getParent().getParent().getIndex();
		SearchUser1.oController = this;
		SearchUser1.searchAuth = "A";
		SearchUser1.dialogContentHeight = 480;
		SearchUser1.oTargetPaths = {
			pernr: target.pernr.interpolate(rowIndex),
			ename: target.ename.interpolate(rowIndex)
		};

		if (!this._AddPersonDialog) {
			this._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this);
			this.getView().addDependent(this._AddPersonDialog);
		}
		this._AddPersonDialog.open();
	},

	changeSel : function(oEvent){
		var oController=$.app.getController();
		var oEventSource = oEvent.getSource();
		var oId=oEventSource.getId();
		var s=oEventSource.getSelectedKey();
		var idx=oEventSource.getCustomData()[0].getValue("Seqno");
		var oTable=$.app.byId(oController.PAGEID+"_aTable");
		var oModel=this.RequestDetailDialogHandler.oModel;
		var aData=oModel.getProperty("/addData");
		var selData={
			Awper: "",
			Awtxt: "",
			Beguz: null,
			Beguzenduz: "",
			Cntgb: "",
			Datum: null,
			Ename: "",
			Enduz: null,
			Flag: "X",
			IOdkey: "",
			Ligbn: "",
			LigbnTx: "",
			Lttim: "",
			Offck: "",
			Ovtim: "",
			Pernr: "",
			Seqnr: "",
			Tprog: "",
			Wt12: "",
			Wt40: "",
			Wtsum: ""
		}
		var sData=null;

		switch (s) {
			case "0":
				if(aData[idx+1].Flag=="X"){
					aData.splice(parseInt(idx)+1,1);
				}
				aData[parseInt(idx)].Awper="";
				aData[parseInt(idx)].Awtxt="";
				aData[parseInt(idx)].Beguz=null;
				aData[parseInt(idx)].Enduz=null;
				aData[parseInt(idx)].Flag="A";
				aData[parseInt(idx)].IOdkey="";
				aData[parseInt(idx)].Ligbn="";
				aData[parseInt(idx)].LigbnTx="";
				aData[parseInt(idx)].Lttim="";
				aData[parseInt(idx)].Offck="";
				aData[parseInt(idx)].Ovtim="";
				aData[parseInt(idx)].Tprog="";
				aData[parseInt(idx)].Wt12="";
				aData[parseInt(idx)].Wt40="";
				aData[parseInt(idx)].Wtsum="";
				break;
			case "1":
				if(aData[idx+1].Flag=="X"){
					aData.splice(parseInt(idx)+1,1);
				}
				break;
			case "2":
				selData.Pernr=aData[parseInt(idx)].Pernr;
				selData.Ename=aData[parseInt(idx)].Ename;
				selData.Datum=aData[parseInt(idx)].Datum;
				aData.splice(parseInt(idx)+1,0,selData);
			break;
			default:
				break;
		}
		var oPro=oModel.getProperty("/addData");
		this.RequestDetailDialogHandler.afterTable(oPro);
		this.oDatas=oPro;
		oModel.refresh();
		var oFficialLength=10;
		oPro.length>oFficialLength?oTable.setVisibleRowCount(oFficialLength):oTable.setVisibleRowCount(oPro.length);
	},

	renderAdded : function(oController,pData){
		var	oController = $.app.getController();
		var c=sap.ui.commons;
		var oTable=$.app.byId(oController.PAGEID+"_aTable");
		oTable.destroyColumns();
		var oFields=["Ename","Datum","Ename","Beguzenduz","Ovtim","Wt40","Wt12","Wtsum","LigbnTx","Cntgb"];
		var oWidths=['','','','240px','','','','','',''];			
		var oLabels=new Array();
		var oFficialLength=10;
		pData.length>oFficialLength?oTable.setVisibleRowCount(oFficialLength):oTable.setVisibleRowCount(pData.length);
		for(var i=3;i<13;i++){
			i<10?i="0"+i:null;
			oLabels.push({Label:"LABEL_198"+i,Width:oWidths[i-3],Align:"Center"});
		}
		oLabels.forEach(function(e,i){
			var oCol=new sap.ui.table.Column({
				flexible : false,
				autoResizable : true,
				resizable : true,
				showFilterMenuEntry : true,
				filtered : false,
				sorted : false
			});
			oCol.setWidth(e.Width);
			oCol.setHAlign(e.Align);
			oCol.setLabel(new sap.m.Text({text:oController.getBundleText(e.Label),textAlign:e.Align}));
			
			switch (i) {
				case 0:
					var oText=new sap.m.Text({
						text:"{"+oFields[i]+"}",
						textAlign : "Center"
					}).addStyleClass("FontFamily")
					oCol.setTemplate(oText);
					break;
				case 1:
					var oText1=new sap.m.Text({
						text : {
							path : oFields[i], 
							type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
						},
						visible:{path:"Offck",formatter:function(fVal){
							return fVal=="X"?false:true;
						}},
						textAlign : "Center"
					}).addStyleClass("FontFamily");
					var oText2=new sap.m.Text({
						text : {
							path : oFields[i], 
							type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
						},
						visible:{path:"Offck",formatter:function(fVal){
							return fVal=="X"?true:false;
						}},
						textAlign : "Center"
					}).addStyleClass("Red Bold");		
					var oHori=new sap.ui.commons.layout.HorizontalLayout({
						content:[oText1,oText2]
					});
					oCol.setTemplate(oHori);
					break;
				case 2:
					var oText=new sap.m.Text({
						text:"{Awtxt}",
						visible:{parts:[{path:"Offck"},{path:"Cntgb"}],formatter:function(fVal,fVal2){
							if(fVal=="X"){
								return true;									
							}else{
								return false;
							}
						}}
					}).addStyleClass("Red Bold");
					var oInput = new sap.m.Input({
						valueHelpRequest: function(oEvent){oController.RequestDetailDialogHandler.openPersonDial.call(oController,oEvent);},
						editable: "{/Header/Edtfg}",
						customData: new sap.ui.core.CustomData({
							key: "target",
							value: {
								pernr: "/addData/${rowIndex}/Awper",
								ename: "/addData/${rowIndex}/Awtxt"
							}
						}),
						value: "{Awtxt}",
						valueHelpOnly: true,
						visible:{parts:[{path:"Offck"},{path:"Cntgb"}],formatter:function(fVal,fVal2){
							if(fVal!="X"){
								return fVal2=="0"?false:true;
							}else{
								return false;
							}
						}},
						showValueHelp: true,
						width: "100%"
					});			
					var oHori=new sap.ui.commons.layout.HorizontalLayout({
						content:[oText,oInput]
					});
					oCol.setTemplate(oHori);
					break;

				case 3:
				var oBeguz=new sap.m.TimePicker({
					valueFormat : "HHmm",
					displayFormat : "HH:mm",
					value : "{Beguz}",
					minutesStep : 10,
					editable: "{/Header/Edtfg}",
					width : "100px", 
					textAlign : "Begin",
					visible:{parts:[{path:"Offck"},{path:"Cntgb"}],formatter:function(fVal,fVal2){
						if(fVal!="X"){
							return fVal2=="0"?false:true;
						}else{
							return false;
						}
					}}
				}).addStyleClass("pl-5px");
				var oEnduz = new sap.m.TimePicker({
					valueFormat : "HHmm",
					displayFormat : "HH:mm",
					value : "{Enduz}",
					editable: "{/Header/Edtfg}",
					minutesStep : 10,
					width : "100px", 
					textAlign : "Begin",
					visible:{parts:[{path:"Offck"},{path:"Cntgb"}],formatter:function(fVal,fVal2){
						if(fVal!="X"){
							return fVal2=="0"?false:true;
						}else{
							return false;
						}
					}}
				}).addStyleClass("pl-5px");			
				var oHori=new sap.ui.commons.layout.HorizontalLayout({
					content:[oBeguz,oEnduz]
				});
				oCol.setTemplate(oHori);
				break;

				case oFields.length-1:
					var oSel=new sap.m.Select({change: function(oEvent){oController.RequestDetailDialogHandler.changeSel.call(oController,oEvent);},
					visible:{parts:[{path:"Offck"},{path:"Flag"}],
					formatter:function(fVal,fVal2){
						if(fVal2=="A"){
							return fVal=="X"?false:true;
						}else{
							return false;
						}
					}},selectedKey:"{"+oFields[i]+"}",customData : new sap.ui.core.CustomData({value:"{Seqno}",key:"Seqno"}),
					editable: "{/Header/Edtfg}"});
					oSel.addItem(new sap.ui.core.Item({
						text:'',
						key:''
					}));
					oSel.addItem(new sap.ui.core.Item({
						text:oController.getBundleText('LABEL_19814'),
						key:'0'
					}));
					oSel.addItem(new sap.ui.core.Item({
						text:oController.getBundleText('LABEL_19815'),
						key:'1'
					}));
					oSel.addItem(new sap.ui.core.Item({
						text:oController.getBundleText('LABEL_19816'),
						key:'2'
					}));
					oCol.setTemplate(oSel);
					break;
			
				default:
					oCol.setTemplate(new sap.ui.commons.TextView({text:"{"+oFields[i]+"}",textAlign:"Center",visible:{path:"Offck",formatter:function(fVal){
						return fVal=="X"?false:true;
					}}}).addStyleClass("FontFamily"));
					break;
			}			
			
			oTable.addColumn(oCol);
		});
		this.bindAdded.call(oController,pData);
	}, 

	bindAdded : function(pData){
		function timeForm(time){
			time="PT"+time.substring(0,2)+"H"+time.substring(2,4)+"M00S";
			return time;
		}
		var	oController = $.app.getController();
		var c=sap.ui.commons;
		var oTable=$.app.byId(oController.PAGEID+"_aTable");
		var oJSON=this.RequestDetailDialogHandler.oModel;
		var aData=oJSON.getData().addData=new Array();
		pData.forEach(function(e){
			aData.push(e);
		});
		oJSON.refresh();
		oTable.setModel(null);
		oTable.setModel(oJSON);
		oTable.bindRows("/addData");
	},

	onShow : function(oPro,vSig){
//		sap.m.MessageBox.alert($.app.getController().getBundleText("MSG_19042"));
		this._Hando="";
		var jModel=this.oModel;
		var oController=$.app.getController();
		var oModel=$.app.getModel("ZHR_WORKTIME_APPL_SRV");
		var oData3=this.oModel.getProperty("/TableIn03");
		var oData4=this.oModel.getProperty("/TableIn04");
		var tArr=new Array();
		var dArr=new Array();
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
		var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm"});
		var oTable=$.app.byId(oController.PAGEID+"_aTable");
		var oPro=this.oModel.getProperty("/addData");
		function timeForm(time){
			time="PT"+time.substring(0,2)+"H"+time.substring(2,4)+"M00S";
			return time;
		}
		//대근자 체크
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
					if(oData3[i].BtStartdat!=undefined){
						tArr.push({IPernr:this.oController.getSessionInfoByKey("Pernr"),IBegda:oData3[i].BtStartdat,IEndda:oData3[i].BtEnddat});
						if(oData4&&oData4.length){
							for(var j=0;j<oData4.length;j++){
								if(oData4[j].Pernr!=undefined){
									tArr.push({IPernr:oData4[j].Pernr,IBegda:oData3[i].BtStartdat,IEndda: oData3[i].BtEnddat});
								}
							}
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
		var vArr=new Array();
		var vArr2=new Array();
		var vTmps=new Array();
		var vSame="";
		if(this._dArr.length!=0){
			if(dArr.length<this._dArr.length){
				vSame="D";
				for(var i=0;i<this._dArr.length;i++){
					var vTmp=false;
					for(var j=0;j<dArr.length;j++){
						if((this._dArr[i].IBegda==dArr[j].IBegda)&&(this._dArr[i].IEndda==dArr[j].IEndda)&&(this._dArr[i].IPernr==dArr[j].IPernr)){
							vTmp=true;
							break;
						}
					}
					if(!vTmp){
						vArr.push(this._dArr[i]);
					}
				}
			}else if(dArr.length>this._dArr.length){
				vSame="A";
				for(var i=0;i<dArr.length;i++){
					var vTmp=false;
					for(var j=0;j<this._dArr.length;j++){
						if((dArr[i].IBegda==this._dArr[j].IBegda)&&(dArr[i].IEndda==this._dArr[j].IEndda)&&(dArr[i].IPernr==this._dArr[j].IPernr)){
							vTmp=true;
							break;
						}
					}
					if(!vTmp){
						vArr.push(dArr[i]);
					}
				}
			}else if(dArr.length==this._dArr.length){
				vSame="M";
				for(var i=0;i<dArr.length;i++){
					var vTmp=false;
					for(var j=0;j<this._dArr.length;j++){
						if((dArr[i].IBegda==this._dArr[j].IBegda)&&(dArr[i].IEndda==this._dArr[j].IEndda)&&(dArr[i].IPernr==this._dArr[j].IPernr)){
							vTmp=true;
							break;
						}
					}
					if(!vTmp){
						vArr.push(dArr[i]);
					}
				}
				for(var i=0;i<this._dArr.length;i++){
					var vTmp=false;
					for(var j=0;j<dArr.length;j++){
						if((dArr[j].IBegda==this._dArr[i].IBegda)&&(dArr[j].IEndda==this._dArr[i].IEndda)&&(dArr[j].IPernr==this._dArr[i].IPernr)){
							vTmp=true;
							break;
						}
					}
					if(!vTmp){
						vArr2.push(this._dArr[i]);
					}
				}
			}
			if(vArr.length!=0){
				if(vSame=="A"){
					var vStructure=this.onSearchDG.call(this,vArr,vSame);
					vStructure.forEach(function(e){
						oPro.push(e);
					});				
					this.afterTable(oPro);
				}else if(vSame=="M"){
					if(vSig=="S"){
						vTmps=new Array();
						for(var i=0;i<oPro.length;i++){
							var vSignal=false;
							for(var j=0;j<vArr2.length;j++){
								if(new Date(oPro[i].Datum).getTime()>=new Date(vArr2[j].IBegda).getTime()&&new Date(oPro[i].Datum).getTime()<=new Date(vArr2[j].IEndda).getTime()){
									vSignal=true;
									break;
								}
							}
							if(!vSignal){
								vTmps.push(oPro[i]);
							}
						}
					}else if(vSig=="X"){
						vTmps=new Array();
						for(var i=0;i<oPro.length;i++){
							var vSignal=false;
							for(var j=0;j<vArr2.length;j++){
								if(oPro[i].Pernr==vArr2[j].IPernr){
									vSignal=true;
									break;
								}
							}
							if(!vSignal){
								vTmps.push(oPro[i]);
							}
						}
					}
					var vStructure=this.onSearchDG.call(this,vArr,vSame);
					vStructure.forEach(function(e){
						vTmps.push(e);
					});				
					this.afterTable(vTmps);
				}else if(vSame=="D"){
					if(vSig=="D1"){
						vTmps=new Array();
						for(var i=0;i<oPro.length;i++){
							var vSignal=false;
							for(var j=0;j<vArr.length;j++){
								if(new Date(oPro[i].Datum).getTime()>=new Date(vArr[j].IBegda).getTime()&&new Date(oPro[i].Datum).getTime()<=new Date(vArr[j].IEndda).getTime()){
									vSignal=true;
									break;
								}
							}
							if(!vSignal){
								vTmps.push(oPro[i]);
							}
						}
					}else if(vSig=="D2"){
						vTmps=new Array();
						for(var i=0;i<oPro.length;i++){
							var vSignal=false;
							for(var j=0;j<vArr.length;j++){
								if(oPro[i].Pernr==vArr[j].IPernr){
									vSignal=true;
									break;
								}
							}
							if(!vSignal){
								vTmps.push(oPro[i]);
							}
						}
					}
					this.afterTable(vTmps);
				}
			}
		}else{
			this.onSearchDG.call(this,dArr,vSig);
		}
		this._dArr=dArr;
	},

	afterTable : function(oDatas){
		function timeDec(fValue) {
			if(typeof(fValue)!="string"){
				if (fValue) {			
					var date = new Date(fValue.ms);			
					var timeinmiliseconds = date.getTime();			
					var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({			
					pattern: "kk:mm"});			
					var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;			
					var timeStr = timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));			
					return timeStr;			
				}else{			
					return fValue;		
				}
			}else{
				return fValue;
			}
		};
		var oController=$.app.getController();
		var oTable=$.app.byId(oController.PAGEID+"_aTable");
		if(oDatas.length>0){
			oDatas.sort(function(a,b){
				return a.Datum < b.Datum ? -1 : a.Datum > b.Datum ? 1 : 0;
			});
		}
		oDatas.forEach(function(e,i){
			e.Beguz=timeDec(e.Beguz);
			e.Enduz=timeDec(e.Enduz);
			e.Seqno=i;
		});
		this.oDatas=oDatas;
		var oFficialLength=10;
		oDatas.length>oFficialLength?oTable.setVisibleRowCount(oFficialLength):oTable.setVisibleRowCount(oDatas.length);
		this.bindAdded.call(oController,oDatas);
		this.oModel.refresh();
	},

	onSearchDG : function(dArr,vSig){
		var jModel=this.oModel;
		var oController=$.app.getController();
		var oModel=$.app.getModel("ZHR_WORKTIME_APPL_SRV");
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
		function timeForm(time){
			time="PT"+time.substring(0,2)+"H"+time.substring(2,4)+"M00S";
			return time;
		}
		var oModel=$.app.getModel("ZHR_WORKTIME_APPL_SRV");
		var oDatas=new Array();
		var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm"});
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
							data.TableIn.results[j].Flag="A";
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
		
		if(vSig=="A"||vSig=="M"){
			return oDatas;
		}else{
			oDatas.sort(function(a,b){
				return a.Datum < b.Datum ? -1 : a.Datum > b.Datum ? 1 : 0;
			});
			oDatas.forEach(function(e,i){
				e.Seqno=i;
			});
			this.oDatas=oDatas;
			this.bindAdded.call(this.oController,oDatas);
			this.afterTable(oDatas);
		}
	}
};

return Handler;

});