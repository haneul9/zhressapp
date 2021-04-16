sap.ui.define([
	"common/Common",
	"common/DialogHandler",
	"./CountryDialogHandler",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	DialogHandler,
	CountryDialogHandler,
	JSONModel
) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({ Airport: {} }),
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, callback) {

		this.oController = oController;
		this.callback = callback;

		this.oModel.setProperty("/Airport/SearchList", []);

		oController.AirportDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "AirportDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.AirportDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	once: function() {

		return Common.getPromise(function() {
			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 국가 코드 목록 조회
				"/BtCodeSet",
				{
					ICodeT: "001",
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn: []
				},
				{
					success: function(oData) {
						var BtCrtList = Common.getTableInResults(oData, "TableIn");
						if (BtCrtList.length) {
							var korea;
							BtCrtList = $.map(BtCrtList, function (o) {
								if (o.Code === "KR") {
									korea = o;
									return;
								}
								return o;
							});
							if (korea) {
								BtCrtList.unshift(korea);
							}

							this.oModel.setProperty("/Airport/BtCrtList", BtCrtList);
							this.oModel.setProperty("/Airport/BtCrt", "KR");
							this.oModel.setProperty("/Airport/BtCrtTxt", "한국");
						} else {
							this.oModel.setProperty("/Airport/BtCrtList", []);
							this.oModel.setProperty("/Airport/BtCrt", "");
							this.oModel.setProperty("/Airport/BtCrtTxt", "");
						}
					}.bind(this),
					error: function(oResponse) {
						Common.log(oResponse);
					}
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

		return Common.getPromise(function() {
			$.app.byId("AirportTable").setBusy(true, 0);

			$.app.getModel("ZHR_WORKTIME_APPL_SRV").create( // 공항 코드 목록 조회
				"/BtBaseSet",
				{
					ICodeT: "005",
					ICode: this.oModel.getProperty("/Airport/Iatacode"),
					IText: this.oModel.getProperty("/Airport/IataTxt"),
					ISubCode: this.oModel.getProperty("/Airport/BtCrt"),
					ICodty: this.oModel.getProperty("/Airport/BtCityTxt"),
					IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
					ILangu: this.oController.getSessionInfoByKey("Langu"),
					TableIn01: [],
					TableIn02: [],
					TableIn03: [],
					TableIn04: [],
					TableIn05: [], // 공항 코드 목록
					TableIn06: [],
					TableIn07: [],
					TableIn08: [],
					TableIn09: []
				},
				{
					success: function(oData) {
						var TableIn05 = Common.getTableInResults(oData, "TableIn05");
						this.oModel.setProperty("/Airport/SearchList", TableIn05);

						Common.adjustVisibleRowCount($.app.byId("AirportTable").setBusy(false), 5, TableIn05.length);
					}.bind(this),
					error: function(oResponse) {
						Common.log(oResponse);

						this.oModel.setProperty("/Airport/SearchList", []);

						Common.adjustVisibleRowCount($.app.byId("AirportTable").setBusy(false), 1, 1);
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
	},

	helpCountryValue: function() {

		setTimeout(function() {
			var initData = {
				name: this.oModel.getProperty("/Airport/BtCrtTxt"),
				list: this.oModel.getProperty("/Airport/BtCrtList")
			},
			callback = function(o) {
				this.oModel.setProperty("/Airport/BtCrt", o.Code || "");
				this.oModel.setProperty("/Airport/BtCrtTxt", o.Text || "");
			}.bind(this);

			DialogHandler.open(CountryDialogHandler.get(this.oController, initData, callback));
		}.bind(this), 0);
	}

};

return Handler;

});