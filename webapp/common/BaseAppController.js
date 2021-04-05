jQuery.sap.declare("common.BaseAppController");

jQuery.sap.require("common.AppConfig");
jQuery.sap.require("common.NavigationHandler");

(function($) {

var instance = null;

if (window._init_sequence_logging) {
	$.app.log("common.BaseAppController definition.");
}

common.BaseAppController = function(sName, oControllerConfig) {
	if (instance) {
		if (sName || oControllerConfig) {
			$.sap.log.error("base appController should only be configured once!");
		}
		return instance;
	}

	$.extend(true, oControllerConfig, {
		configureApplication: function(oApp, oAppConfig) {
			// initialize global Navigation Handling
			this.navHandler = new common.NavigationHandler(oApp, new common.AppConfig(oAppConfig)).subscribe();
		}
	});

	instance = sap.ui.controller(sName, oControllerConfig);
};

}(jQuery));