/* global moment:true */
sap.ui.define([
	"../../common/Common",
	"../../common/moment-with-locales",
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
	oModel: new JSONModel({ Currency: {} }),
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, callback) {

		this.oController = oController;
		this.callback = callback;

		this.oModel.setProperty("/Currency/SearchList", []);

		oController.CurrencyDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "CurrencyDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.CurrencyDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	once: function() {

		return Common.getPromise(function() {
			this.oModel.setProperty("/Currency/IDatum", moment().startOf("date").toDate());
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

	// DialogHandler 호출 function
	getDialog: function() {

		return this.oDialog;
	},

	// DialogHandler 호출 function
	setDialog: function(oDialog) {

		this.oDialog = oDialog;

		return this;
	},

	onBeforeOpen: function() {

		$.app.byId("CurrencyTable").setBusy(true, 0);

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 통화 코드 목록 조회
				"/BtBaseSet",
				{
					ICodeT: "007",
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					IDatum: Common.adjustGMTOdataFormat(this.oModel.getProperty("/Currency/IDatum")),
					TableIn01: [],
					TableIn02: [],
					TableIn03: [],
					TableIn04: [],
					TableIn05: [],
					TableIn06: [],
					TableIn07: [], // 통화 코드 목록 조회
					TableIn08: [],
					TableIn09: []
				},
				{
					success: function(oData) {
						var TableIn07 = Common.getTableInResults(oData, "TableIn07");
						this.oModel.setProperty("/Currency/SearchList", TableIn07);

						Common.adjustVisibleRowCount($.app.byId("CurrencyTable").setBusy(false), 5, TableIn07.length);
					}.bind(this),
					error: function(oResponse) {
						Common.log(oResponse);

						this.oModel.setProperty("/Currency/SearchList", []);

						Common.adjustVisibleRowCount($.app.byId("CurrencyTable").setBusy(false), 1, 1);
					}
				}
			);
		}.bind(this));
	},

	clickTableCell: function(oEvent) {

		var p = oEvent.getParameter("rowBindingContext").getProperty();
		return Common.getPromise(function() {
			if (this.callback) {
				this.callback(p);
			}
		}.bind(this))
		.then(function() {
			this.oDialog.close();
		}.bind(this));
	}

};

return Handler;

});