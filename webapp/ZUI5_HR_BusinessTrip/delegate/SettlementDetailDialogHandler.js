/* global moment:true */
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
	oModel: new JSONModel({
		Header: null,
		BtPurpose1SelectList: null, // 출장구분 코드 목록
		EnameList: null             // 출장자 popup 목록 : 대리인 자격으로 신청시
	}),

	// DialogHandler 호출 function
	get: function(oController, oRowData) {

		this.oController = oController;
		this.oRowData = $.extend(true, {}, oRowData);

		Common.removeProperties(this.oRowData, "__metadata");

		oController.SettlementDetailDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "SettlementDetailDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.SettlementDetailDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	once: function() {

		this.oModel.setProperty("/CardPyTextMap", {
			"1": this.oController.getBundleText("LABEL_19574"), // 현금/기타
			"5": this.oController.getBundleText("LABEL_19573")  // 법인카드
		});
		this.oModel.setProperty("/CategoryTextMap", {
			"Per Diem": this.oController.getBundleText("LABEL_19552"), // 일비
			"Lodging":  this.oController.getBundleText("LABEL_19553"), // 숙박비
			"Others":   this.oController.getBundleText("LABEL_19554"), // 기타
			"Total":    this.oController.getBundleText("LABEL_19555")  // 합계
		});

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
		Common.log("Business trip settlement detail dialog handler.onBeforeOpen"); // 출장 비용 정산 상세 조회

		var IPernr;
		if (this.oRowData.isFromAbsence) {
			IPernr = this.oRowData.Btbpn;
		} else if (this.oRowData.isA100OrZtitle71) {
			IPernr = this.oController.getSessionInfoByKey("name");
		} else {
			IPernr = "";
		}

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtSettlementSet",
				{
					IConType: $.app.ConType.CHECK,
					IPernr: IPernr,
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn01", this.oRowData)],
					TableIn02: [], // 출장 Header 정보
					TableIn03: [], // 경비현황 목록
					TableIn04: [], // 출장일정 목록
					TableIn05: [], // 비용정산항목 목록
					TableIn06: []  // 코스트센터 코드 목록
				},
				{
					success: function(oData) {
						Common.log("SettlementDetailDialogHandler.onBeforeOpen success", oData);

						var TableIn02 = Common.getTableInResults(oData, "TableIn02"); // 상세 Header, 경비현황 일부 정보
						if (TableIn02.length) {
							var Header = TableIn02[0];
							if (!Header.BtPurpose1) {
								var BtPurpose1SelectList = this.oModel.getProperty("/BtPurpose1SelectList");
								Header.BtPurpose1 = BtPurpose1SelectList.length === 1 ? this.oModel.getProperty("/BtPurpose1SelectList/0/Code") : this.oModel.getProperty("/BtPurpose1SelectList/1/Code");
							}
							if (this.oRowData.isReportPopup) {
								Header.Edtfg = false;
							}

							Header.isEnameDialogAvailable = (this.oModel.getProperty("/EnameList") || []).length > 0;
							Header.isEnameEditable = typeof this.oRowData.isEnameEditable === "boolean" ? this.oRowData.isEnameEditable : true;
							Header.Btact = typeof this.oRowData.Btact === "boolean" ? this.oRowData.Btact : true;
							Header.ChkPer = Header.ChkPer === true ? Header.ChkPer : Header.BtPurpose1 === "5";
							Header.Apamt = Common.toNumber(Header.Apamt);
							Header.Olamt = Common.toNumber(Header.Olamt);
							Header.Advtot = Common.toNumber(Header.Advtot);

							this.oModel.setProperty("/Header", Header);
							this.oModel.setProperty("/SettlementTableIn02", TableIn02);
						} else {
							this.oModel.setProperty("/Header", {
								isEnameDialogAvailable: (this.oModel.getProperty("/EnameList") || []).length > 0,
								isEnameEditable: typeof this.oRowData.isEnameEditable === "boolean" ? this.oRowData.isEnameEditable : true,
								Btact: typeof this.oRowData.Btact === "boolean" ? this.oRowData.Btact : true,
								BtPurpose1: this.oModel.getProperty("/BtPurpose1SelectList/1/Code"),
								DtRqst: moment().toDate(),
								Budat: moment().toDate(),
								Edtfg: true
							});
							this.oModel.setProperty("/SettlementTableIn02", [{}]);
						}

						var TableIn03 = Common.getTableInResults(oData, "TableIn03"); // 경비현황 목록
						if (TableIn03.length) {
							var CategoryTextMap = this.oModel.getProperty("/CategoryTextMap");
							$.map(TableIn03, function(o) {
								o.CategoryT = CategoryTextMap[o.CategoryT];
							});
						}
						this.oModel.setProperty("/SettlementTableIn03", TableIn03);
						Common.adjustVisibleRowCount($.app.byId("SettlementTableIn03"), 5, TableIn03.length);

						var Dtfmt = this.oController.getSessionInfoByKey("Dtfmt"),
						TableIn04 = Common.getTableInResults(oData, "TableIn04"); // 출장일정 목록
						if (!TableIn04.length) {
							TableIn04 = [{}];
						}
						$.map(TableIn04, function(o, i) {
							if (!o.Relindex) {
								o.Relindex = Common.lpad(i, 2);
							}
							if (o.BtCity && o.BtStartdat && o.BtEnddat) {
								var oBtStartdat = moment(o.BtStartdat || ""), oBtEnddat = moment(o.BtEnddat || "");

								if (oBtStartdat.isValid() && oBtEnddat.isValid()) {
									o.BtStartdat = Common.getUTCDateTime(o.BtStartdat);
									o.BtEnddat = Common.getUTCDateTime(o.BtEnddat);

									o.BtCityKey = [o.BtCity, oBtStartdat.format(Dtfmt), oBtEnddat.format(Dtfmt)].join("");
									o.BtCityKeyText = [o.BtCityT, " (", oBtStartdat.format(Dtfmt), " ~ ", oBtEnddat.format(Dtfmt), ")"].join("");
								} else {
									o.BtCityKey = "";
									o.BtCityKeyText = "";
								}
							}
						});
						if (this.oRowData.isFromAbsence) {
							TableIn04[0].BtStartdat = Common.getUTCDateTime(this.oRowData.BtStartdat);
							TableIn04[0].BtEnddat = Common.getUTCDateTime(this.oRowData.BtEnddat);
						}
						this.oModel.setProperty("/SettlementTableIn04", TableIn04);
						Common.adjustVisibleRowCount($.app.byId("SettlementTableIn04"), 5, TableIn04.length);

						var TableIn05 = Common.getTableInResults(oData, "TableIn05"); // 비용정산항목 목록
						if (TableIn05.length) {
							var CardPyTextMap = this.oModel.getProperty("/CardPyTextMap");
							$.map(TableIn05, function(o) {
								o.CardPyT = CardPyTextMap[o.CardPy];
								o.AppDate = Common.getUTCDateTime(o.AppDate);
								o.BtStartdat = Common.getUTCDateTime(o.BtStartdat);
								o.BtEnddat = Common.getUTCDateTime(o.BtEnddat);
								o.LodgeStartdat = Common.getUTCDateTime(o.LodgeStartdat);
								o.LodgeEnddat = Common.getUTCDateTime(o.LodgeEnddat);
								o.FlStartDate = Common.getUTCDateTime(o.FlStartDate);
								o.FlEndDate = Common.getUTCDateTime(o.FlEndDate);
							});
						}
						this.oModel.setProperty("/SettlementTableIn05", TableIn05);
						Common.adjustVisibleRowCount($.app.byId("SettlementTableIn05"), 5, TableIn05.length);

						this.oModel.setProperty("/MainCostCenterList", Common.getTableInResults(oData, "TableIn06")); // 코스트센터 코드 목록
					}.bind(this),
					error: function(oResponse) {
						Common.log("SettlementDetailDialogHandler.onBeforeOpen error", oResponse);

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

	retrieveHeader: function () {

		BusyIndicator.show(0);

		return Common.getPromise(function () {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtSettlementSet",
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
						Common.log("SettlementDetailDialogHandler.retrieveHeader success", oData);

						var TableIn02 = Common.getTableInResults(oData, "TableIn02"); // 상세 Header, 경비현황 일부 정보
						if (TableIn02.length) {
							var Header = TableIn02[0];
							if (!Header.BtPurpose1) {
								var BtPurpose1SelectList = this.oModel.getProperty("/BtPurpose1SelectList");
								Header.BtPurpose1 = BtPurpose1SelectList.length === 1 ? this.oModel.getProperty("/BtPurpose1SelectList/0/Code") : this.oModel.getProperty("/BtPurpose1SelectList/1/Code");
							}
							if (this.oRowData.isReportPopup) {
								Header.Edtfg = false;
							}

							Header.Zzdocno = this.oModel.getProperty("/Header/Zzdocno");
							Header.ZzdocnoApp = this.oModel.getProperty("/Header/ZzdocnoApp");
							Header.ZzdocnoSn = this.oModel.getProperty("/Header/ZzdocnoSn");
							Header.ZzdocnoSnApp = this.oModel.getProperty("/Header/ZzdocnoSnApp");

							Header.isEnameDialogAvailable = (this.oModel.getProperty("/EnameList") || []).length > 0;
							Header.isEnameEditable = typeof this.oRowData.isEnameEditable === "boolean" ? this.oRowData.isEnameEditable : true;
							Header.Btact = typeof this.oRowData.Btact === "boolean" ? this.oRowData.Btact : true;
							Header.ChkPer = Header.ChkPer === true ? Header.ChkPer : Header.BtPurpose1 === "5";
							Header.Apamt = Common.toNumber(Header.Apamt);
							Header.Olamt = Common.toNumber(Header.Olamt);
							Header.Advtot = Common.toNumber(Header.Advtot);

							this.oModel.setProperty("/Header", Header);
							this.oModel.setProperty("/SettlementTableIn02", TableIn02);
						} else {
							this.oModel.setProperty("/Header", {
								isEnameDialogAvailable: (this.oModel.getProperty("/EnameList") || []).length > 0,
								isEnameEditable: typeof this.oRowData.isEnameEditable === "boolean" ? this.oRowData.isEnameEditable : true,
								Btact: typeof this.oRowData.Btact === "boolean" ? this.oRowData.Btact : true,
								BtPurpose1: this.oModel.getProperty("/BtPurpose1SelectList/1/Code"),
								DtRqst: moment().toDate(),
								Budat: moment().toDate(),
								Edtfg: true
							});
							this.oModel.setProperty("/SettlementTableIn02", [{}]);
						}

						this.oModel.setProperty("/MainCostCenterList", Common.getTableInResults(oData, "TableIn06")); // 코스트센터 코드 목록

						BusyIndicator.hide();
					}.bind(this),
					error: function (oResponse) {
						Common.log("SettlementDetailDialogHandler.retrieveHeader error", oResponse);

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
		Common.log("Business trip settlement detail dialog handler.calculateAmount"); // 출장 비용 계산

		var data = this.oModel.getData(),
		Header = Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn02", data.Header || {});

		if (!Header.BtPurpose1) {
			return;
		}

		var TableIn04 = $.map(data.SettlementTableIn04, function(o, i) {
			if (o.BtCity && o.BtStartdat && o.BtEnddat) {
				o.Btseq = Common.lpad(i, 2);
				this.oModel.setProperty("/SettlementTableIn04/" + i + "/Btseq", o.Btseq);
				return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn04", o);
			}
		}.bind(this));

		if (!TableIn04.length) {
			return;
		}

		var TableIn05 = $.map(data.SettlementTableIn05, function(o, i) {
			o.Btseq = Common.lpad(i, 2);
			this.oModel.setProperty("/SettlementTableIn05/" + i + "/Btseq", o.Btseq);
			return Common.copyByMetadata("ZHR_WORKTIME_APPL_SRV", "entityType", "BtSettlementTableIn05", o);
		}.bind(this));

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create(
				"/BtSettlementSet",
				{
					IConType: $.app.ConType.CHECK,
					IPernr: Header.Pernr,
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [],
					TableIn02: [Header],  // 출장 상세 정보
					TableIn03: [],        // 경비현황 목록
					TableIn04: TableIn04, // 출장 일정 목록
					TableIn05: TableIn05, // 비용정산항목 목록
					TableIn06: []         // 코스트센터 코드 목록
				},
				{
					success: function(oData) {
						Common.log("SettlementDetailDialogHandler.calculateAmount success", oData);

						var TableIn02 = Common.getTableInResults(oData, "TableIn02");
						if (TableIn02.length) {
							var Header = TableIn02[0];

							Header.isEnameEditable = typeof this.oRowData.isEnameEditable === "boolean" ? this.oRowData.isEnameEditable : true;
							Header.isEnameDialogAvailable = (this.oModel.getProperty("/EnameList") || []).length > 0;
							Header.Btact = this.oModel.getProperty("/Header/Btact");
							Header.Advtot = Common.toNumber(Header.Advtot);
							Header.Apamt = Common.toNumber(Header.Apamt);
							Header.Olamt = Common.toNumber(Header.Olamt);

							this.oModel.setProperty("/Header", Header);
							this.oModel.setProperty("/SettlementTableIn02", TableIn02);
						}

						var TableIn03 = Common.getTableInResults(oData, "TableIn03"); // 경비현황 목록
						if (TableIn03.length) {
							var CategoryTextMap = this.oModel.getProperty("/CategoryTextMap"),
							total = TableIn03.pop(), Totamt = 0;
							$.map(TableIn03, function(o) {
								o.CategoryT = CategoryTextMap[o.CategoryT];
								Totamt += Common.toNumber(o.Totamt);
							});
							total.Totamt = Common.toCurrency(Totamt);
							TableIn03.push(total);
						}
						this.oModel.setProperty("/SettlementTableIn03", TableIn03);
						Common.adjustVisibleRowCount($.app.byId("SettlementTableIn03"), 5, TableIn03.length);

						var TableIn04 = Common.getTableInResults(oData, "TableIn04"); // 출장 일정 목록
						if (TableIn04.length) {
							var TableIn04Map = {};
							$.map(TableIn04, function(o) {
								o.ExptDailyLc = Common.toNumber(o.ExptDailyLc);
								o.ExptDailyTr = Common.toNumber(o.ExptDailyTr);
								o.ExptLodgeLc = Common.toNumber(o.ExptLodgeLc);
								o.ExptLodgeTr = Common.toNumber(o.ExptLodgeTr);
								o.ExptTotAmt = Common.toNumber(o.ExptTotAmt);
								o.BtStartdat = Common.getUTCDateTime(o.BtStartdat);
								o.BtEnddat = Common.getUTCDateTime(o.BtEnddat);

								TableIn04Map[o.Btseq] = o;
							});
							TableIn04 = $.map(this.oModel.getProperty("/SettlementTableIn04"), function(o) {
								if (typeof o.Btseq !== "undefined") {
									$.extend(o, TableIn04Map[o.Btseq]);
								}
								return o;
							});
							this.oModel.setProperty("/SettlementTableIn04", TableIn04);
						}

						var TableIn05 = Common.getTableInResults(oData, "TableIn05"); // 비용정산항목 목록
						if (TableIn05.length) {
							var TableIn05Map = {};
							$.map(TableIn05, function(o) {
								TableIn05Map[o.Btseq] = o;

								o.AppDate = Common.getUTCDateTime(o.AppDate);
								o.BtStartdat = Common.getUTCDateTime(o.BtStartdat);
								o.BtEnddat = Common.getUTCDateTime(o.BtEnddat);
								o.LodgeStartdat = Common.getUTCDateTime(o.LodgeStartdat);
								o.LodgeEnddat = Common.getUTCDateTime(o.LodgeEnddat);
								o.FlStartDate = Common.getUTCDateTime(o.FlStartDate);
								o.FlEndDate = Common.getUTCDateTime(o.FlEndDate);
							});
							TableIn05 = $.map(this.oModel.getProperty("/SettlementTableIn05"), function(o) {
								if (typeof o.Btseq !== "undefined") {
									$.extend(o, TableIn05Map[o.Btseq]);
								}
								return o;
							});
							this.oModel.setProperty("/SettlementTableIn05", TableIn05);
						}
					}.bind(this),
					error: function(oResponse) {
						Common.log("SettlementDetailDialogHandler.calculateAmount error", oResponse);

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
	}

};

return Handler;

});