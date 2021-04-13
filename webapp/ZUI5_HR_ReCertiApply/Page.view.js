sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES",
	"../common/EmpBasicInfoBox"
], function (Common, Formatter, PageHelper, ZHR_TABLES, EmpBasicInfoBox) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			// 시작
			this.loadModel();
			oController.setupView.call(oController);

			var oScrollContainer = new sap.m.ScrollContainer({
				vertical : true,
				content : [ sap.ui.jsfragment("fragment.OrgOfIndividualForEP", oController) ]	
			});
		
			var oSplitContainer = new sap.m.SplitContainer(oController.PAGEID + "_SplitContainer", {
				mode : "ShowHideMode" , //: "HideMode" ,
				detailPages : [sap.ui.jsfragment("ZUI5_HR_ReCertiApply.fragment.Main", oController)],
				masterPages : [oScrollContainer]
			});
		
			return new PageHelper({
				contentContainerStyleClass: "app-content-container-wide",
				contentItems: [
					oSplitContainer,
				]
			});
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_CERTI_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
