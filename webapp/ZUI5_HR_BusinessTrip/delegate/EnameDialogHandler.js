sap.ui.define([
	"common/Common",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	JSONModel
) {
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

		this.oModel.setProperty("/Ename",     initData.ename || "");
		this.oModel.setProperty("/EnameList", initData.list || []);

		oController.EnameDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "EnameDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.EnameDialog",
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
			Ename = oModel.getProperty("/Ename"),
			EnameList = oModel.getProperty("/EnameList");
	
			EnameList.forEach(function(data) {
				data.selected = (data.Innam === Ename);
			});
			oModel.setProperty("/EnameList", EnameList);
		}.bind(this));
	},

	onSearch: function(oEvent) {

		oEvent.getParameter("itemsBinding").filter([
			new sap.ui.model.Filter("Innam", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("value"))
		]);
	},

	onConfirm: function(oEvent) {

		if (this.callback) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			this.callback(!oSelectedItem ? {
				Ename: "",
				Pernr: ""
			} : {
				Ename: oSelectedItem.getBindingContext().getProperty().Innam || "",
				Pernr: oSelectedItem.getBindingContext().getProperty().Inper || ""
			});
		}
	}

};

return Handler;

});