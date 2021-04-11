sap.ui.define([
	"../common/Common",
	"../common/PageHelper",
	"sap/ui/model/json/JSONModel"
], function(Common, PageHelper, JSONModel) {
"use strict";

sap.ui.jsview($.app.APP_ID, { 

	getControllerName: function() {
		return $.app.APP_ID;
	},

	// Model 선언
	loadModel: function() {

		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_PERS_RECORD_SRV");
		$.app.setModel("ZHR_PERS_INFO_SRV");
		sap.ui.getCore().setModel(new JSONModel(), "EmpSearchResult");
		sap.ui.getCore().setModel(new JSONModel(), "EmpSearchCodeList");
	},

	createContent: function(oController) {

		this.loadModel();

		return new PageHelper({
			contentItems: [sap.ui.jsfragment([$.app.CONTEXT_PATH, "fragment", "RequestList"].join("."), oController)]
		});
	}

});

});