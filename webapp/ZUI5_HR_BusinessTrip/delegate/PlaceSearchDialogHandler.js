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
	oModel: new JSONModel({
		PlaceName: null,
		PlaceList: null
	}),
	callback: null,
	search: null,

	// DialogHandler 호출 function
	get: function(oController, dialogTitle, search, callback) {

		this.oController = oController;
		this.callback = callback;
		this.search = search;
		this.dialogTitle = dialogTitle;

		oController.PlaceSearchDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "PlaceSearchDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.PlaceSearchDialog",
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
			this.oDialog.setTitle(this.dialogTitle);
			this.oModel.setData({
				PlaceName: null,
				PlaceList: null
			});
		}.bind(this));
	},

	onSearch: function(oEvent) {

		var value = oEvent.getParameter("value");
		setTimeout(function() {
			this.search({
				keyword: value,
				callback: function(PlaceList) {
					this.oModel.setProperty("/PlaceList", PlaceList);
				}.bind(this)
			});
		}.bind(this), 0);
	},

	onConfirm: function(oEvent) {

		if (this.callback) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			this.callback(!oSelectedItem ? {} : oSelectedItem.getBindingContext().getProperty());
		}
	}

};

return Handler;

});