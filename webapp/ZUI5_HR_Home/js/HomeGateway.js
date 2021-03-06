function HomeGateway() {}

$.extend(HomeGateway.prototype, {

homeI18n: function(_i18n) {

	this._i18n = _i18n;

	$.extend(HomeGateway.prototype, {
		i18n: _i18n.get.bind(_i18n)
	});
},
homeBasis: function(_basis) {

	this._basis = _basis;
	this.ODataDestination = _basis.ODataDestination;

	$.extend(HomeGateway.prototype, {
		prepareLog: _basis.prepareLog.bind(_basis),
		log: _basis.log.bind(_basis),
		setModel: _basis.setModel.bind(_basis),
		getModel: _basis.getModel.bind(_basis),
		functionName: _basis.functionName.bind(_basis),
		parameter: _basis.parameter.bind(_basis),
		parameterMap: _basis.parameterMap.bind(_basis),
		mix: _basis.mix.bind(_basis),
		isLOCAL: _basis.isLOCAL.bind(_basis),
		isDEV: _basis.isDEV.bind(_basis),
		isQAS: _basis.isQAS.bind(_basis),
		isPRD: _basis.isPRD.bind(_basis),
		s4hanaURL: _basis.s4hanaURL.bind(_basis),
		s4hanaDestination: _basis.s4hanaDestination.bind(_basis),
		odataCsrfToken: _basis.odataCsrfToken.bind(_basis),
		metadata: _basis.metadata.bind(_basis),
		copyFields: _basis.copyFields.bind(_basis),
		post: _basis.post.bind(_basis),
		getJSON: $.getJSON,
		odataResults: _basis.odataResults.bind(_basis),
		handleError: _basis.handleError.bind(_basis),
		alert: _basis.alert.bind(_basis),
		confirm: _basis.confirm.bind(_basis),
		openPopup: _basis.openPopup.bind(_basis),
		openWindow: _basis.openWindow.bind(_basis)
	});
},
homeSession: function(_session) {

	this._session = _session;

	$.extend(HomeGateway.prototype, {
		logout: _session.logout.bind(_session),
		pernr: _session.pernr.bind(_session),
		locale: _session.locale.bind(_session),
		loginInfo: _session.loginInfo.bind(_session),
		usePrivateLog: _session.usePrivateLog.bind(_session),
		confirmADPW: _session.confirmADPW.bind(_session),
		checkNewEmp2: _session.checkNewEmp2.bind(_session),
		addLocaleChangeCallbackOwner: _session.addLocaleChangeCallbackOwner.bind(_session),
		removeLocaleChangeCallbackOwner: _session.removeLocaleChangeCallbackOwner.bind(_session)
	});
},
homeMenu: function(_menu) {

	this._menu = _menu;

	$.extend(HomeGateway.prototype, {
		spinner: _menu.spinner.bind(_menu),
		redirect: _menu.redirect.bind(_menu),
		toggleMenu: _menu.toggleMenu.bind(_menu),
		currentMid: _menu.currentMid.bind(_menu),
		currentUrl: _menu.currentUrl.bind(_menu),
		mid: _menu.mid.bind(_menu),
		urlData: _menu.urlData.bind(_menu),
		menuUrl: _menu.menuUrl.bind(_menu),
		menuParam: _menu.menuParam.bind(_menu),
		handleUrl: _menu.handleUrl.bind(_menu),
		handleMissingMenuId: _menu.handleMissingMenuId.bind(_menu),
		handleUnauthorized: _menu.handleUnauthorized.bind(_menu),
		handleAuthCancel: _menu.handleAuthCancel.bind(_menu),
		// handleNewEmpCancel: _menu.handleNewEmpCancel.bind(_menu)
	});
},
homePortlet: function(_portlet) {

	this._portlet = _portlet;

	$.extend(HomeGateway.prototype, {
		updatePortlet: _portlet.updatePortlet.bind(_portlet)
	});
},
isMobile: function() {

	return $('html').attr('device') === 'mobile';
},
isPopup: function() {

	return !!this._basis.parameter('popup');
},
restoreHome: function() {

	if (this.isPopup()) {
		return;
	}

	$(document).attr('title', 'Hi HR');
	this._menu.changeState(false, true);
	this._portlet.changeState(true);
	this.addLocaleChangeCallbackOwner(this._portlet);
},
successAppPrefilter: function() {

	if (this.isPopup()) {
		return;
	}

	this._menu.changeState(false, false);
	this._portlet.changeState(false);
	this.removeLocaleChangeCallbackOwner(this._portlet);
}

});