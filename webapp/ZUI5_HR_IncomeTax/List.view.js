sap.ui.define([
	"../common/Common",
	"../common/PageHelper",
	"sap/ui/model/json/JSONModel",
	"../common/EmpBasicInfoBox",
], function(Common, PageHelper, JSONModel, EmpBasicInfoBox) {
"use strict";

sap.ui.jsview($.app.APP_ID, { 

	getControllerName: function() {
		return $.app.APP_ID;
	},

	// Model 선언
	loadModel: function() {

		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_PAY_RESULT_SRV");
		sap.ui.getCore().setModel(new JSONModel(), "EmpSearchResult");
		sap.ui.getCore().setModel(new JSONModel(), "EmpSearchCodeList");
	},

	createContent: function(oController) {

		this.loadModel();

		return new PageHelper({
			contentItems: [
				new EmpBasicInfoBox(oController.EmployeeModel).addStyleClass("ml-10px mt-15px"),
				sap.ui.jsfragment([$.app.CONTEXT_PATH, "fragment", "List"].join("."), oController)]
		});
	}

});

});