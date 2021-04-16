sap.ui.define([
	"common/Common",
	"sap/ui/model/json/JSONModel"
], function(Common, JSONModel) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({ MainCostCenter: {} }),
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, initData, callback) {

		this.oController = oController;
		this.callback = callback;

		this.oModel.setProperty("/MainCostCenter/Code", initData.code || "");
		this.oModel.setProperty("/MainCostCenter/List", initData.list || []);

		oController.MainCostCenterDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "MainCostCenterDialog",
			name: "ZUI5_HR_BusinessTripMap.fragment.MainCostCenterDialog",
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
			Code = oModel.getProperty("/MainCostCenter/Code"),
			MainCostCenterList = oModel.getProperty("/MainCostCenter/List");

			MainCostCenterList.forEach(function(data) {
				data.selected = (data.Kostl === Code);
			});
			oModel.setProperty("/MainCostCenter/List", MainCostCenterList);
		}.bind(this));
	},

	onSearch: function(oEvent) {

		oEvent.getParameter("itemsBinding").filter([
			new sap.ui.model.Filter("Ltext", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("value"))
		]);
	},

	onConfirm: function(oEvent) {

		if (this.callback) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			this.callback(!oSelectedItem ? {
				Kostl: "",
				Ltext: "",
				Orgeh: ""
			} : oSelectedItem.getBindingContext().getProperty());
		}
	}

};

return Handler;

});