/* global moment Promise */
sap.ui.define([
	"common/Common",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"../../common/SearchUser1"
], function(
	Common,
	MessageBox,
	BusyIndicator,
	JSONModel,
	SearchUser1
) {
"use strict";

return {

	oController: null,
	oRowData: null,
	oDialog: null,
	oSubstituteDialog: null,
	aTripperList: null,
	isSubstituteAdding: false,
	isCheckedSubstituteAvailability: false,
	oModel: new JSONModel({
		Header: null,
		BtPurpose1SelectList: null,	// 출장구분 코드 목록
		SubtySelectList: null,		// 근태유형 코드 목록
		EncardSelectList: null,		// 출입카드 신청 코드 목록
		EnameList: null				// 출장자 popup 목록 : 대리인 자격으로 신청시
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

		var minuteStep = 5,
		HourSelectList = [{ value: "", text: "HH" }], MinuteSelectList = [{ value: "", text: "mm" }]; // 이동시간 Select
		$.each(new Array(24), function(hour) {
			hour = Common.lpad(hour, 2);
			HourSelectList.push({ value: hour, text: hour });
		});
		$.each(new Array(60 / minuteStep), function(minute) {
			minute = Common.lpad(minute * minuteStep, 2);
			MinuteSelectList.push({ value: minute, text: minute });
		});
		this.oModel.setProperty("/HourSelectList", HourSelectList);
		this.oModel.setProperty("/MinuteSelectList", MinuteSelectList);

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
							this.oModel.setProperty("/EnameList", []);
						}.bind(this)
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
							this.oModel.setProperty("/BtPurpose1SelectList", []);
						}.bind(this)
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
							this.oModel.setProperty("/EncardSelectList", []);
						}.bind(this)
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
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn01", this.oRowData)],
					TableIn02: [], // 출장 Header 정보
					TableIn03: [], // 출장 일정 목록
					TableIn04: [], // 동반출장자 목록
					TableIn05: [], // 코스트센터 소속부서
					TableIn06: [], // 근태유형 코드 목록
					TableIn07: []  // 대근자 목록
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
							if (!Header.Subty) {
								Header.Subty = this.oModel.getProperty("/SubtySelectList/0/Subty");
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
						} else {
							this.oModel.setProperty("/TableIn03", [{}]);
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

						var TableIn07 = Common.getTableInResults(oData, "TableIn07"); // 대근자 목록
						if (TableIn07.length) {
							this.setSubstituteSchedule(TableIn07);
						} else {
							this.changeSubstituteData("onBeforeOpen");
						}
					}.bind(this),
					error: function(oResponse) {
						Common.log("RequestDetailDialogHandler.onBeforeOpen error", oResponse);

						var errData = Common.parseError(oResponse);
						if (errData.Error && errData.Error === "E") {
							MessageBox.error(errData.ErrorMessage);
						}
					}
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
					error: function(oResponse) {
						Common.log("RequestDetailDialogHandler.retrieveHeader error", oResponse);

						var errData = Common.parseError(oResponse);
						if (errData.Error && errData.Error === "E") {
							MessageBox.error(errData.ErrorMessage);
						}

						BusyIndicator.hide();
					}
				}
			);
		}.bind(this));
	},

	calculateAmount: function() {
		Common.log("Business trip request detail dialog handler.calculateAmount"); // 출장 비용 계산

		var data = this.oModel.getData(),
		Header = Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn02", data.Header || {});

		if (!Header.BtPurpose1) {
			return new Promise(function(resolve, reject) { reject(); });
		}

		var TableIn03 = $.map(data.TableIn03, function(o, i) {
			if (o.BtCity && o.BtStartdat && o.BtEnddat) {
				o.Btseq = Common.lpad(i, 2);
				this.oModel.setProperty("/TableIn03/" + i + "/Btseq", o.Btseq);
				return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn03", o);
			}
		}.bind(this));

		if (!TableIn03.length) {
			return new Promise(function(resolve, reject) { reject(); });
		}

		var TableIn04 = $.map(data.TableIn04, function(o, i) {
			if (o.Pernr) {
				o.Btseq = Common.lpad(i, 2);
				this.oModel.setProperty("/TableIn04/" + i + "/Btseq", o.Btseq);
				return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtRequestTableIn04", o);
			}
		}.bind(this));

		Header.Accfg = TableIn04.length > 0;

		return Common.getPromise(true, function(resolve, reject) {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtRequestSet",
				{
					IConType: $.app.ConType.CHECK,
					IPernr: this.oModel.getProperty("/Header/Pernr"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [],
					TableIn02: [Header],	// 출장 Header 정보
					TableIn03: TableIn03,	// 출장 일정 목록
					TableIn04: TableIn04,	// 동반출장자 목록
					TableIn05: [],			// 코스트센터 소속부서
					TableIn06: []			// 근태유형 코드 목록
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
								MessageBox.alert(this.oController.getBundleText("MSG_19017"), { // 가지급금이 한도액(일비)를 초과했습니다.
									title: this.oController.getBundleText("LABEL_00149"), // 안내
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

						resolve();
					}.bind(this),
					error: function(oResponse) {
						Common.log("RequestDetailDialogHandler.calculateAmount error", oResponse);

						var errData = Common.parseError(oResponse);
						if (errData.Error && errData.Error === "E") {
							MessageBox.error(errData.ErrorMessage, {
								onClose: function() {
									reject();
								}
							});
						}
					}
				}
			);
		}.bind(this));
	},

	searchSubstitute: function(oEvent) {

		var oEventSource = oEvent.getSource(),
		targetPath = oEventSource.data("targetPath"),
		rowIndex = oEventSource.getParent().getIndex();

		SearchUser1.oController = this;
		SearchUser1.searchAuth = "A";
		SearchUser1.dialogContentHeight = 480;
		SearchUser1.targetPath = targetPath + rowIndex;

		this.RequestDetailDialogHandler.isSubstituteAdding = true;

		if (!this._AddPersonDialog) {
			this._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this);
			this.getView().addDependent(this._AddPersonDialog);
		}
		this._AddPersonDialog.open();
	},

	changeSubstitueCount: function(oEvent) {

		var oEventSource = oEvent.getSource();
		setTimeout(function() {
			var TableIn07 = this.oModel.getProperty("/TableIn07"),
			iCurrRowIndex = parseInt(oEventSource.data("RowIndex")),
			iNextRowIndex = iCurrRowIndex + 1,
			oCurrRowData = this.oModel.getProperty("/TableIn07/" + iCurrRowIndex),
			oNextRowData = this.oModel.getProperty("/TableIn07/" + iNextRowIndex) || {},
			oDefaultData = {
				Awper: "",
				Awtxt: "",
				Beguz: null,
				BeguzHour: null,
				BeguzMinute: null,
				Cntgb: "",
				Datum: null,
				Ename: "",
				Enduz: null,
				EnduzHour: null,
				EnduzMinute: null,
				Flag: "X",
				Ligbn: "",
				LigbnTx: "",
				Lttim: "",
				Offck: "",
				Ovtim: "",
				Pernr: "",
				Seqnr: "",
				Sobeg: null,
				Soend: null,
				Tprog: "",
				Wt12: "",
				Wt40: "",
				Wtsum: ""
			};

			switch (oEventSource.getSelectedKey()) {
				case "0":
					if (oNextRowData.Flag === "X") {
						TableIn07.splice(iNextRowIndex, 1);
					}

					oDefaultData.Pernr = oCurrRowData.Pernr;
					oDefaultData.Ename = oCurrRowData.Ename;
					oDefaultData.Cntgb = oCurrRowData.Cntgb;
					oDefaultData.Datum = oCurrRowData.Datum;
					oDefaultData.Offck = oCurrRowData.Offck;
					oDefaultData.Flag = oCurrRowData.Flag;

					this.oModel.setProperty("/TableIn07/" + iCurrRowIndex, oDefaultData);
					break;
				case "1":
					if (oNextRowData.Flag === "X") {
						TableIn07.splice(iNextRowIndex, 1);
					}
					break;
				case "2":
					oDefaultData.Pernr = oCurrRowData.Pernr;
					oDefaultData.Ename = oCurrRowData.Ename;
					oDefaultData.Datum = oCurrRowData.Datum;
					oDefaultData.Offck = oCurrRowData.Offck;
					oDefaultData.Sobeg = oCurrRowData.Sobeg;
					oDefaultData.Soend = oCurrRowData.Soend;

					TableIn07.splice(iNextRowIndex, 0, oDefaultData);
					break;
				default:
					break;
			}

			this.setSubstituteSchedule(TableIn07);
		}.bind(this), 0);
	},

	// 대근자 OT 시간 변경 event handler
	changeSubstitueOT: function(oEvent) {

		var oEventSource = oEvent.getSource(),
		oEventSourceColumnId = oEventSource.getBindingInfo("selectedKey").binding.sPath, // BeguzHour, BeguzMinute, EnduzHour, EnduzMinute
		iCurrRowIndex = parseInt(oEventSource.data("RowIndex"));

		setTimeout(function() {
			var oCurrRowData = this.oModel.getProperty("/TableIn07/" + iCurrRowIndex),
				oCurrRowSobeg = moment(oCurrRowData.Datum).subtract(9, "hours").millisecond(oCurrRowData.Sobeg.ms),
				oCurrRowBeguz,
				oCurrRowEnduz;

			if (oCurrRowData.BeguzHour && oCurrRowData.BeguzMinute) {
				oCurrRowBeguz = moment(oCurrRowData.Datum).set({ hour: parseInt(oCurrRowData.BeguzHour), minute: parseInt(oCurrRowData.BeguzMinute) });
				if (oCurrRowSobeg.isAfter(oCurrRowBeguz)) {
					oCurrRowBeguz.add(1, "days");
				}
				setTimeout(function() {
					this.oModel.setProperty("/TableIn07/${}/Beguz".interpolate(iCurrRowIndex), oCurrRowBeguz.toDate());
				}.bind(this), 0);
			}
			if (oCurrRowData.EnduzHour && oCurrRowData.EnduzMinute) {
				oCurrRowEnduz = moment(oCurrRowData.Datum).set({ hour: parseInt(oCurrRowData.EnduzHour), minute: parseInt(oCurrRowData.EnduzMinute) });
				if (oCurrRowSobeg.isAfter(oCurrRowEnduz)) {
					oCurrRowEnduz.add(1, "days");
				}
				if (oCurrRowBeguz && oCurrRowBeguz.isSameOrAfter(oCurrRowEnduz)) {
					oCurrRowEnduz.add(1, "days");
				}
				setTimeout(function() {
					this.oModel.setProperty("/TableIn07/${}/Enduz".interpolate(iCurrRowIndex), oCurrRowEnduz.toDate());
				}.bind(this), 0);
			}
			this.oModel.setProperty("/TableIn07/${}/Ligbn".interpolate(iCurrRowIndex), "");
			this.oModel.setProperty("/TableIn07/${}/LigbnTx".interpolate(iCurrRowIndex), this.oController.getBundleText("LABEL_19819")); // 한도체크 필요

			if (!oCurrRowBeguz || !oCurrRowEnduz) {
				return;
			}

			// 동일 일자 대근자가 2명인 경우 OT 시간이 겹치는지 확인
			var existOT, inputOT = { Beguz: oCurrRowBeguz, Enduz: oCurrRowEnduz };

			// 동일 일자 두번째 대근자의 OT 입력인 경우
			if (oCurrRowData.Flag === "X") {
				var oPrevRowData = this.oModel.getProperty("/TableIn07/" + (iCurrRowIndex - 1)) || {}; // 동일 일자 첫번째 대근자의 OT 정보
				if (!oPrevRowData.BeguzHour || !oPrevRowData.BeguzMinute || !oPrevRowData.EnduzHour || !oPrevRowData.EnduzMinute) {
					return;
				}

				existOT = this.getOtMoments(oPrevRowData);
			}
			// 동일 일자 첫번째 대근자의 OT 입력인 경우
			else {
				var oNextRowData = this.oModel.getProperty("/TableIn07/" + (iCurrRowIndex + 1)) || {}; // 동일 일자 두번째 대근자의 OT 정보
				if (oNextRowData.Flag !== "X" || !oNextRowData.BeguzHour || !oNextRowData.BeguzMinute || !oNextRowData.EnduzHour || !oNextRowData.EnduzMinute) {
					return;
				}

				existOT = this.getOtMoments(oNextRowData);
			}

			if (   (existOT.Beguz.isSameOrBefore(inputOT.Beguz) && inputOT.Beguz.isBefore(existOT.Enduz)      )	// OT 시작 시각이 기입력된 OT 시간대 중간에 있는 경우
				|| (      existOT.Beguz.isBefore(inputOT.Enduz) && inputOT.Enduz.isSameOrBefore(existOT.Enduz))	// OT 종료 시각이 기입력된 OT 시간대 중간에 있는 경우
				|| (inputOT.Beguz.isSameOrBefore(existOT.Beguz) && existOT.Enduz.isSameOrBefore(inputOT.Enduz))	// 입력 OT 시간대가 기입력된 OT 시간대를 포함하는 경우
			) {
				var Dtfmt = this.oController.getSessionInfoByKey("Dtfmt").toUpperCase(),
				Datum = moment(oCurrRowData.Datum).format(Dtfmt);

				MessageBox.alert(this.oController.getBundleText("MSG_19050", Datum), { // {0} 일자 대근자들의 OT 시간이 겹칩니다. 다시 입력해주세요.
					title: this.oController.getBundleText("LABEL_00149"), // 안내
					onClose: function() {
						this.oModel.setProperty("/TableIn07/${}/${}".interpolate(iCurrRowIndex, oEventSourceColumnId), null);
						this.oModel.setProperty("/TableIn07/${}/${}".interpolate(iCurrRowIndex, oEventSourceColumnId.replace(/^(.{5}).+/, "$1")), null);
					}.bind(this)
				});
			}
		}.bind(this), 0);
	},

	getOtMoments: function(rowData) {

		if (!rowData.BeguzHour || !rowData.BeguzMinute || !rowData.EnduzHour || !rowData.EnduzMinute) {
			return null;
		}

		var Sobeg = moment(rowData.Datum).subtract(9, "hours").millisecond(rowData.Sobeg.ms),
			Beguz = moment(rowData.Datum).set({ hour: parseInt(rowData.BeguzHour), minute: parseInt(rowData.BeguzMinute) }),
			Enduz = moment(rowData.Datum).set({ hour: parseInt(rowData.EnduzHour), minute: parseInt(rowData.EnduzMinute) });

		if (Sobeg.isAfter(Beguz)) { // 출장 일자 대근자의 기본 근무시작 시각보다 입력된 OT시작 시각이 이전이면 하루를 더함
			Beguz.add(1, "days");
		}
		if (Sobeg.isSameOrAfter(Enduz)) { // 출장 일자 대근자의 기본 근무시작 시각보다 입력된 OT종료 시각이 같거나 이전이면 하루를 더함
			Enduz.add(1, "days");
		}
		if (Beguz.isSameOrAfter(Enduz)) {
			Enduz.add(1, "days");
		}

		return { Beguz: Beguz, Enduz: Enduz };
	},

	changeSubstituteData: function(trigger, contextDataList) {

		BusyIndicator.show(0);

		if (trigger === "pressRemoveSchedule") { // 출장 일정 삭제시 - 해당 대근자 목록 삭제
			var removedScheduleMap = {};
			$.map(contextDataList, function(o) {
				var BtStartdat = moment(o.BtStartdat).startOf("date"),
				BtEnddat = moment(o.BtEnddat).startOf("date");

				removedScheduleMap[BtStartdat.format("YYYYMMDD")] = true;

				$.map(new Array(BtEnddat.diff(BtStartdat, "days")), function() {
					removedScheduleMap[BtStartdat.add(1, "days").format("YYYYMMDD")] = true;
				});
			});

			var currentSubstituteList = this.oModel.getProperty("/TableIn07") || [],
			list = $.map(currentSubstituteList, function(o) {
				if (!removedScheduleMap[moment(o.Datum).format("YYYYMMDD")]) {
					return o;
				}
			});

			this.setSubstituteSchedule(list);

			if (currentSubstituteList.length !== list.length) {
				MessageBox.alert(this.oController.getBundleText("MSG_19042"), { // 출장 일정 변경에 따라 대근자 목록이 변경되었습니다. 확인하시기 바랍니다.
					title: this.oController.getBundleText("LABEL_00149"), // 안내
					onClose: function() {
						BusyIndicator.hide();
					}
				});
			} else {
				BusyIndicator.hide();
			}

		} else if (trigger === "pressRemoveAccompanier") { // 동반출장자 삭제시 - 해당 대근자 목록 삭제
			var removedAccompanierMap = {};
			$.map(contextDataList, function(o) {
				removedAccompanierMap[o.Pernr] = true;
			});

			var currentSubstituteList = this.oModel.getProperty("/TableIn07") || [],
			list = $.map(currentSubstituteList, function(o) {
				if (!removedAccompanierMap[o.Pernr]) {
					return o;
				}
			});

			this.setSubstituteSchedule(list);

			if (currentSubstituteList.length !== list.length) {
				MessageBox.alert(this.oController.getBundleText("MSG_19043"), { // 동반출장자 변경에 따라 대근자 목록이 변경되었습니다. 확인하시기 바랍니다.
					title: this.oController.getBundleText("LABEL_00149"), // 안내
					onClose: function() {
						BusyIndicator.hide();
					}
				});
			} else {
				BusyIndicator.hide();
			}

		} else {
			var tripperScheduleList = this.getTripperScheduleList(), // 화면 상의 출장자, 동반출장자 목록 취합
			substituteNeedTripperList = [];

			Promise.all(
				$.map(tripperScheduleList, function(o) {
					return this.checkSubstituteNeed(o, substituteNeedTripperList); // 대근자 필요여부 확인
				}.bind(this))
			)
			.then(function() {
				Common.log("substituteNeedTripperList", substituteNeedTripperList);
				if (!substituteNeedTripperList.length) {
					return;
				}

				return this.retrieveSubstituteSchedule(substituteNeedTripperList);
			}.bind(this))
			.then(function(substituteScheduleList) {
				Common.log("substituteScheduleList", substituteScheduleList);

				var currentSubstituteList = this.oModel.getProperty("/TableIn07") || [],
				currentSubstituteDataMap = {}, // 기존 대근자 전체 정보
				secondSubstituteDataMap = {}, // 기존 대근자 정보중 동일 일자 2번째 대근자 정보
				newTableIn07 = [],
				isChanged = false;

				$.map(currentSubstituteList, function(o) {
					var key = [o.Pernr, moment(o.Datum).format("YYYYMMDD"), o.Flag].join(",");
					currentSubstituteDataMap[key] = o;

					if (o.Flag === "X") {
						secondSubstituteDataMap[key] = o; // 2번째 대근자 정보는 나중에 따로 끼워넣기 위해 저장해둠
					}
				});

				Common.log("currentSubstituteDataMap", currentSubstituteDataMap);
				Common.log("secondSubstituteDataMap", secondSubstituteDataMap);

				// 새로 조회된 대근자 목록은 기본값으로 세팅된 정보만 조회되므로 기존에 입력된 대근자 정보로 덮어씀
				$.map(substituteScheduleList, function(o) {
					var sDatum = moment(o.Datum).format("YYYYMMDD"),
					currentSubstituteData = currentSubstituteDataMap[[o.Pernr, sDatum, "A"].join(",")];

					Common.log("currentSubstituteData", currentSubstituteData);

					if (currentSubstituteData) { // 기존 입력된 대근자 정보가 존재하는 경우
						$.extend(o, currentSubstituteData);
					} else {
						isChanged = true; // 기존 입력된 대근자 정보가 존재하지 않으면 대근자 목록이 변경된 것이므로 메세지를 보여줌
					}

					newTableIn07.push(o);

					var secondSubstituteData = secondSubstituteDataMap[[o.Pernr, sDatum, "X"].join(",")];
					if (secondSubstituteData) { // 동일 일자 두번째 대근자 끼워넣기
						newTableIn07.push(secondSubstituteData);
					}
				});

				if (newTableIn07.length !== currentSubstituteList.length) {
					isChanged = true; // 기존 입력된 일부 대근자 정보만 삭제되는 경우에는 substituteScheduleList에 해당 정보가 없어 위 로직에서 isChanged flag를 true로 만들어 주지못함
				}

				Common.log("newTableIn07", newTableIn07);
				Common.log("isChanged", isChanged);

				if (isChanged) {
					this.isCheckedSubstituteAvailability = false;

					this.setSubstituteSchedule(newTableIn07);

					if (trigger === "changeScheduleDate") {
						MessageBox.alert(this.oController.getBundleText("MSG_19042"), { // 출장 일정 변경에 따라 대근자 목록이 변경되었습니다. 확인하시기 바랍니다.
							title: this.oController.getBundleText("LABEL_00149"), // 안내
							onClose: function() {
								BusyIndicator.hide();
							}
						});

					} else if (trigger === "setAccompanier") {
						MessageBox.alert(this.oController.getBundleText("MSG_19043"), { // 동반출장자 변경에 따라 대근자 목록이 변경되었습니다. 확인하시기 바랍니다.
							title: this.oController.getBundleText("LABEL_00149"), // 안내
							onClose: function() {
								BusyIndicator.hide();
							}
						});

					} else if (trigger === "changeBtPurpose") {
						MessageBox.alert(this.oController.getBundleText("MSG_19044"), { // 출장구분 변경에 따라 대근자 목록이 변경되었습니다. 확인하시기 바랍니다.
							title: this.oController.getBundleText("LABEL_00149"), // 안내
							onClose: function() {
								BusyIndicator.hide();
							}
						});

					} else { // onBeforeOpen
						BusyIndicator.hide();
					}
				} else {
					BusyIndicator.hide();
				}
			}.bind(this));

		}
	},

	// 대근자 필요여부 확인용 출장자 목록 및 출장자별 출장 일정 목록 취합
	getTripperScheduleList: function() {

		var IPernr = this.oModel.getProperty("/Header/Pernr"), // 출장자
		IBukrs = this.oController.getSessionInfoByKey("Bukrs"),
		tripperList = [];

		$.map(this.oModel.getProperty("/TableIn03") || [], function(o) {
			if (o.BtCity && o.BtStartdat && o.BtEnddat) {
				tripperList.push({ IPernr: IPernr, IBukrs: IBukrs, IBegda: o.BtStartdat, IEndda: o.BtEnddat }); // 출장자 및 출장자의 출장일정

				$.map(this.oModel.getProperty("/TableIn04") || [], function(p) { // 동반출장자 및 동반출장자의 출장일정
					if (p.Pernr) {
						tripperList.push({ IPernr: p.Pernr, IBukrs: IBukrs, IBegda: o.BtStartdat, IEndda: o.BtEnddat });
					}
				});
			}
		}.bind(this));

		return tripperList;
	},

	// 대근자 필요여부 확인
	checkSubstituteNeed: function(o, substituteNeedTripperList) {

		var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");

		return Common.getPromise(true, function(resolve, reject) {
			oModel.create(
				"/VacationCoverTargetSet",
				{
					IPernr: o.IPernr,
					IBukrs: o.IBukrs,
					IBegda: moment(o.IBegda).startOf("date").add(9, "hours").toDate(),
					IEndda: moment(o.IEndda).startOf("date").add(9, "hours").toDate(),
					Export: []
				},
				{
					success: function(oData) {
						if (((((oData || {}).Export || {}).results || [{}])[0] || {}).Awchk) {
							substituteNeedTripperList.push(o);
						}
						resolve();
					},
					error: function(oResponse) {
						Common.log("RequestDetailDialogHandler.checkSubstituteNeed error", oResponse);

						var errData = Common.parseError(oResponse);
						if (errData.Error && errData.Error === "E") {
							MessageBox.error(errData.ErrorMessage, {
								onClose: function() {
									reject();
								}
							});
						}
					}
				}
			);
		});
	},

	// 대근자 목록 정보 model binding
	setSubstituteSchedule: function(TableIn07) {

		// 실제 response로 받는 시간 형식은 PT##H##M##S 형식이지만 ODataModel class에서 ms가 들어있는 JSON object로 변환해줌
		var sPrevRowCntgb;
		TableIn07.forEach(function(o, i) {
			if ($.isPlainObject(o.Beguz) && typeof o.Beguz.ms === "number") {
				var mBeguz = moment(o.Beguz.ms).subtract(9, "hours");
				o.BeguzHour = mBeguz.format("HH");
				o.BeguzMinute = mBeguz.format("mm");
			}

			if ($.isPlainObject(o.Enduz) && typeof o.Enduz.ms === "number") {
				var mEnduz = moment(o.Enduz.ms).subtract(9, "hours");
				o.EnduzHour = mEnduz.format("HH");
				o.EnduzMinute = mEnduz.format("mm");
			}

			if (sPrevRowCntgb === "2") {
				o.Flag = "X";
			}
			sPrevRowCntgb = o.Cntgb;

			o.RowIndex = i;
		});

		this.oModel.setProperty("/TableIn07", TableIn07);
		Common.adjustVisibleRowCount($.app.byId("TableIn07"), 10, TableIn07.length);
	},

	retrieveSubstituteSchedule: function(substituteNeedTripperList) {

		var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV"),
		BtPurpose1 = this.oModel.getProperty("/Header/BtPurpose1"),
		Bukrs = this.oController.getSessionInfoByKey("Bukrs"),
		Langu = this.oController.getSessionInfoByKey("Langu"),
		substituteScheduleList = [];

		return Promise.all(
			$.map(substituteNeedTripperList, function(p) {
				return Common.getPromise(true, function(resolve, reject) {
					oModel.create(
						"/VacationCoverSet",
						{
							IConType: "1",
							IProType: "1",
							IAwart: BtPurpose1,
							IBegda: moment(p.IBegda).startOf("date").add(9, "hours").toDate(),
							IEndda: moment(p.IEndda).startOf("date").add(9, "hours").toDate(),
							IPernr: p.IPernr,
							IBukrs: Bukrs,
							ILangu: Langu,
							TableIn: []
						},
						{
							success: function(oData) {
								$.map(Common.getTableInResults(oData, "TableIn"), function(o, i) {
									o.Flag = "A";
									o.RowIndex = i;

									substituteScheduleList.push(o);
								});

								resolve();
							},
							error: function(oResponse) {
								Common.log("RequestDetailDialogHandler.retrieveSubstituteSchedule error", oResponse);

								var errData = Common.parseError(oResponse);
								if (errData.Error && errData.Error === "E") {
									MessageBox.error(errData.ErrorMessage, {
										onClose: function() {
											reject();
										}
									});
								}
							}
						}
					);
				});
			})
		).then(function() {
			return substituteScheduleList;
		});
	}

};

});