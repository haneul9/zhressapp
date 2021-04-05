sap.ui.define([
	"../common/BaseAppController"
], function (BaseAppController) {
	"use strict";

	if (window._init_sequence_logging) {
		$.app.log("SFMain.controller definition.");
	}

	return BaseAppController($.app.APP_SFMAIN_ID, {

		onInit: function() {
			if (window._init_sequence_logging) {
				$.app.log("BaseAppController.onInit called.");
			}

			this.configureApplication(this.getView().app, {
				defaultPageId: $.app.APP_SFMAIN_ID,
				viewType: "JS",
				transition: "slide",
				isMaster: function(sPageId) {
					return (sPageId !== "Detail" && sPageId !== "LineItem");
				},
				viewName: function(sPageId) {
					return sPageId;
				}
			});
		}

	});

});