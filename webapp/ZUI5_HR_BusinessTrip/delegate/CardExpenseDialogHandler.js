/* global moment:true */
sap.ui.define([
	"common/Common",
	"common/moment-with-locales",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	momentjs,
	MessageBox,
	JSONModel
) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({
		CorpCardSelectList: null,
		CorpCardUsedList: null,
		CorpCardUsed: null
	}),
	stagedCardApprNoMap: null,
	callback: null,

	// DialogHandler 호출 function
	get: function (oController, stagedCardApprNoMap, callback) {

		this.oController = oController;
		this.stagedCardApprNoMap = stagedCardApprNoMap || {};
		this.callback = callback;

		oController.CardExpenseDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "CardExpenseDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.CardExpenseDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	once: function() {

		this.oModel.setProperty("/CorpCardUsed", {
			IBegda: moment().startOf("date").subtract(1, "months").add(1, "days").toDate(),
			IEndda: moment().startOf("date").toDate(),
			IClDmtr: "1"
		});

		return Common.getPromise(true, function(resolve) {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 법인카드 코드 목록 조회
				"/BtCorpCardListSet",
				{
					IPernr: this.getParentModelProperty("/Header/Pernr"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn: []
				},
				{
					success: function(oData) {
						var CorpCardSelectList = Common.getTableInResults(oData, "TableIn");
						if (CorpCardSelectList.length > 1) {
							CorpCardSelectList.unshift({ CardComNm: this.oController.getBundleText("LABEL_00181") }); // - 선택 -
						}

						this.oModel.setProperty("/CorpCardSelectList", CorpCardSelectList);

						setTimeout(resolve, 500);
					}.bind(this),
					error: function(oResponse) {
						Common.log(oResponse);
						
						this.oModel.setProperty("/CorpCardSelectList", []);

						resolve();
					}.bind(this)
				}
			);
		}.bind(this));
	},

	// DialogHandler 호출 function
	getParentView: function() {

		return this.oController.getView();
	},

	// DialogHandler 호출 function
	getModel: function() {

		return this.oModel;
	},

	getParentModel: function() {

		return this.oController.SettlementDetailDialogHandler.getModel();
	},

	getParentModelProperty: function(path) {

		return this.getParentModel().getProperty(path);
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
		Common.log("Business trip card expense dialog handler.onBeforeOpen");

		$.app.byId("CorpCardUsedTable").setBusy(true, 0);

		var CorpCardUsed = this.oModel.getProperty("/CorpCardUsed"),
		IBegda = CorpCardUsed.IBegda,
		IEndda = CorpCardUsed.IEndda;

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 출장 비용 정산 - 카드사용내역 조회
				"/BtCorpCardUseListSet",
				{
					IPernr: this.getParentModelProperty("/Header/Pernr"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					IBegda: IBegda ? Common.adjustGMTOdataFormat(IBegda) : "",
					IEndda: IEndda ? Common.adjustGMTOdataFormat(IEndda) : "",
					ICardNo: CorpCardUsed.ICardNo || "",
					IClDmtr: CorpCardUsed.IClDmtr,
					IApprNo: CorpCardUsed.IApprNo || "",
					TableIn: []
				},
				{
					success: function(oData) {
						var CorpCardUsedList = $.map(Common.getTableInResults(oData, "TableIn"), function(p) {
							if (!this.stagedCardApprNoMap[p.ApprNo]) {
								p.ExpensCurr = "KRW";
								return p;
							}
						}.bind(this));

						this.oModel.setProperty("/CorpCardUsedList", CorpCardUsedList);

						Common.adjustVisibleRowCount($.app.byId("CorpCardUsedTable").setBusy(false), 5, CorpCardUsedList.length);
					}.bind(this),
					error: function(oResponse) {
						Common.log(oResponse);

						this.oModel.setProperty("/CorpCardUsedList", []);

						Common.adjustVisibleRowCount($.app.byId("CorpCardUsedTable").setBusy(false), 1, 1);
					}.bind(this)
				}
			);
		}.bind(this));
	},

	// 국내외 radio button 선택
	selectClDmtrRadioButton: function(oEvent) {

		this.oModel.setProperty("/CorpCardUsed/IClDmtr", oEvent.getSource().getSelectedButton().data("selectedClDmtr"));
	},

	clickTableCell: function(oEvent) {

		var p = oEvent.getParameter("rowBindingContext").getProperty();
		return Common.getPromise(function() {
			if (this.callback) {
				var cardExpenseData = $.extend(p, {
					AppDate: moment(p.UsedDate, "YYYY.MM.DD").toDate(),
					ZtcWaers: p.UsedCurr,
					ZscWaers: p.UsedCurr,
					BtTaxTr: p.Surtax,
					IndExpdTr: 0,
				});

				// 국내 결제
				if (p.AbroadFlag === "N") {
					this.callback($.extend(cardExpenseData, {
						PayAmtTr: p.UsedAmt,
						BtExpenseTr: p.UsedAmt,
						BtTaxbaseTr: p.OriginAmt,
						Mwskz: Common.toNumber(p.Surtax) > 0 ? "IM" : "IP"
					}));
				}
				// 해외 결제
				else {
					this.callback($.extend(cardExpenseData, {
						PayAmtTr: p.UsedForAmt,
						BtExpenseTr: p.UsedForAmt,
						BtTaxbaseTr: p.UsedForAmt,
						Mwskz: "IP"
					}));
				}
			}
		}.bind(this))
		.then(function() {
			this.oDialog.close();
		}.bind(this));
	}

};

return Handler;

});