sap.ui.define([
	"common/Common",
	"sap/ui/model/json/JSONModel"
], function(Common, JSONModel) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel(),
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, initData, callback) {

		this.oController = oController;
		this.callback = callback;

		this.oModel.setProperty("/Country",     initData.name || "");
		this.oModel.setProperty("/CountryList", initData.list || []);

		oController.CountryDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "CountryDialog",
			name: "ZUI5_HR_BusinessTripMap.fragment.CountryDialog",
			type: "JS",
			controller: this.oController
		};
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
			var oModel = this.getModel(),
			Country = oModel.getProperty("/Country"),
			CountryList = oModel.getProperty("/CountryList");
	
			CountryList.forEach(function(data) {
				data.selected = (data.Text === Country);
			});
			oModel.setProperty("/CountryList", CountryList);
		}.bind(this));
	},

	onSearch: function(oEvent) {

		oEvent.getParameter("itemsBinding").filter([
			new sap.ui.model.Filter("Text", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("value"))
		]);
	},

	onConfirm: function(oEvent) {

		if (this.callback) {
			this.callback(oEvent.getParameter("selectedItem").getBindingContext().getProperty());
		}
	}

};

return Handler;

});