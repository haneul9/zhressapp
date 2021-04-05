sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper"
], function (Common, Formatter, PageHelper) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();
			
			return new PageHelper({
				contentContainerStyleClass: "app-content-container-mobile",
				contentItems: [
					new sap.ui.jsfragment("ZUI5_HR_EvalResultAgreeM.m.fragment.EvalResultAgree", oController),
					new sap.ui.jsfragment("ZUI5_HR_EvalResultAgreeM.m.fragment.EvalSurvey", oController)
					// new sap.ui.jsfragment("ZUI5_HR_EvalResultAgreeM.fragment.EvalResultAgree", oController).getContent(),
				]
			});
			
	
		},
		
		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_APPRAISAL_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
