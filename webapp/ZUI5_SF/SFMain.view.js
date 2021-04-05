sap.ui.jsview($.app.APP_SFMAIN_ID, {

	getControllerName: function() {
		if (window._init_sequence_logging) {
			$.app.log("SFMain.view.getControllerName called.");
		}
		return $.app.APP_SFMAIN_ID;
	},

	createContent: function(oController) {
		if (window._init_sequence_logging) {
			$.app.log("SFMain.view.createContent called.");
		}

		this.setDisplayBlock(true);

		var pageId = $.app.APP_ID;

		this.app = new sap.m.App({autoFocus: false}).addPage(sap.ui.jsview(pageId, pageId)); // SFMain.controller 에서 this.app 변수 사용

		return this.app;
	}

});