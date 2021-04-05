jQuery.sap.declare("common.NavigationHandler");

jQuery.sap.require("jquery.sap.history");
jQuery.sap.require("sap.m.InstanceManager");

common.NavigationHandler = function (oApp, oAppConfig) {
	//add config
	this._app = oApp;
	this.config = oAppConfig;
};

common.NavigationHandler.prototype._getValue = function (sPropName) {
	var val = this[sPropName];
	if (typeof val === "string" || val instanceof String) {
		return val;
	}
	return val();
};

common.NavigationHandler.prototype.subscribe = function () {

	// handler for initial history
	var historyDefaultHandler = function (navType) {
		var pageId = this.config.getStringValue("defaultPageId");
		if (navType === jQuery.sap.history.NavType.Back) {
			this._navBack(pageId);
		}
		else {
			this._navTo(pageId, null, false);
		}
	};

	// handler for changes in browser history
	var historyPageHandler = function (params, navType) {

		if (!params || !params.id) {
			jQuery.sap.log.error("invalid parameter: " + params);
		}
		else {
			if (navType === jQuery.sap.history.NavType.Back) {
				this._navBack(params.id);
			}
			else {
				this._navTo(params.id, params.data, false);
			}
		}
	};

	// initialize the history plugin
	jQuery.sap.history({
		routes: [{
			// This handler is executed when you navigate back to the history state on the path "page"
			path: "page",
			handler: jQuery.proxy(historyPageHandler, this)
		}],
		// The default handler is executed when you navigate back to the history state with an empty hash
		defaultHandler: jQuery.proxy(historyDefaultHandler, this)
	});

	// subscribe to event bus
	var bus = sap.ui.getCore().getEventBus();
	bus.subscribe("nav", "to", this._navHandler, this);
	bus.subscribe("nav", "back", this._navHandler, this);
	bus.subscribe("nav", "virtual", this._navHandler, this);
	bus.subscribe("nav", "remove", this._navHandler, this);
};

common.NavigationHandler.prototype._navHandler = function (channelId, eventId, data) {

	if (eventId === "to") {
		//alert("1111");
		this._navTo(data.id, data.data, true);
		//this._navTo(data.id, data.data, false);
	}
	else if (eventId === "back") {
		//provide a default value for navigation,  one step back in history
		if (!data.step) {
			data.step = 1;
		}
		if (data.home) {
			jQuery.sap.history.backToHash("");
		}
		else if (data.step > 0) {
			jQuery.sap.history.back(data.step);
		}
		else {
			console.log("'nav back' event cannot be processed. At least one from [data.step, data.home] must be given with valid value");
		}
	}
	else if (eventId === "virtual") {
		jQuery.sap.history.addVirtualHistory();
	}
	else if (eventId === "remove") {
		this._navRemove(data.id, data.data, true);
	}
	else {
		jQuery.sap.log.error("'nav' event cannot be processed. There's no handler registered for event with id: " + eventId);
	}
};

common.NavigationHandler.prototype._navTo = function (id, data, writeHistory) {
	if (id === undefined) {

		// invalid id
		jQuery.sap.log.error("navTo failed due to missing id");

	}
	else {

		// close open popovers
		if (sap.m.InstanceManager.hasOpenPopover()) {
			sap.m.InstanceManager.closeAllPopovers();
		}

		// load view on demand
		var master = this.config.getBoolValue("isMaster", [id]);
		var viewType = this.config.getStringValue("viewType");
		var viewName = this.config.getStringValue("viewName", [id]);
		var transition = this.config.getStringValue("transition");

		if (this._app.getPage(id, master) === null) {
			var page = sap.ui.view({
				id: id,
				viewName: viewName,
				type: viewType
			});
			this._app.addPage(page, master);
		}

		this._app.to(id, transition, data);

		jQuery.sap.log.info("navTo - to page: " + id);
	}
};

common.NavigationHandler.prototype._navRemove = function (id, data, writeHistory) {
	if (id === undefined) {
		// invalid id
		jQuery.sap.log.error("navTo failed due to missing id");

	}
	else {

		// close open popovers
		if (sap.m.InstanceManager.hasOpenPopover()) {
			sap.m.InstanceManager.closeAllPopovers();
		}

		// load view on demand
		var master = this.config.getBoolValue("isMaster", [id]);

		if (this._app.getPage(id, master) !== null) {
			this._app.removePage(id);
		}

		console.log("navRemove - to page: " + id);
	}
};

common.NavigationHandler.prototype._navBack = function (id) {
	if (!id) {

		// invalid parameter

	}
	else {

		// close open popovers
		if (sap.m.InstanceManager.hasOpenPopover()) {
			sap.m.InstanceManager.closeAllPopovers();
		}

		// close open dialogs
		if (sap.m.InstanceManager.hasOpenDialog()) {
			sap.m.InstanceManager.closeAllDialogs();
			jQuery.sap.log.info("navBack - closed dialog(s)");
		}

		// ... and navigate back
		var currentId = (this._app.getCurrentPage()) ? this._app.getCurrentPage().getId() : null;
		if (currentId !== id) {
			this._app.backToPage(id);
		}
	}
};