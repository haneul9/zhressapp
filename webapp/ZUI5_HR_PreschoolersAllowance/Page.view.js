sap.ui.define(["../common/PageHelper"], function (PageHelper) {
	"use strict";

	sap.ui.jsview($.app.APP_ID, {
		// 미취학

		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
            $.app.setModel("ZHR_COMMON_SRV");
            $.app.setModel("ZHR_BENEFIT_SRV");

			return new PageHelper({
				contentItems: sap.ui.jsfragment($.app.APP_ID, oController)
			});
		}
	});
});
