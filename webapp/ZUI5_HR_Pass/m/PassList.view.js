sap.ui.define([
	"common/PageHelper"
], function (PageHelper) {
	"use strict";

	sap.ui.jsview($.app.APP_ID, {
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			var tabBox = new sap.m.IconTabBar({
				expandable: false,
				select: oController.handleTabBarSelect.bind(oController),
				selectedKey: "Facility",
				items: [
					new sap.m.IconTabFilter(oController.PAGEID + "_Facility", {
						key: "Facility",
						text: "{i18n>LABEL_09060}",
						content: [sap.ui.jsfragment("ZUI5_HR_Pass.m.fragment.FacilityList", oController)]
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_Condo", {
						key: "Condo",
						text: "{i18n>LABEL_09033}",
						content: [sap.ui.jsfragment("ZUI5_HR_Pass.m.fragment.CondoList", oController)]
					})
				]
			}).addStyleClass("tab-group");

			return new PageHelper({
				contentContainerStyleClass: "app-content-container-mobile",
				contentItems: [tabBox]
			});
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_BENEFIT_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
