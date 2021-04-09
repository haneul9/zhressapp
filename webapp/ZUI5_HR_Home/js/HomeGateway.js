function HomeGateway() {}

$.extend(HomeGateway.prototype, {

homeBasis: function(_basis) {

	this._basis = _basis;
	this.ODataDestination = _basis.ODataDestination;

	$.extend(HomeGateway.prototype, {
		prepareLog: _basis.prepareLog.bind(_basis),
		log: _basis.log.bind(_basis),
		functionName: _basis.functionName.bind(_basis),
		parameter: _basis.parameter.bind(_basis),
		parameterMap: _basis.parameterMap.bind(_basis),
		isLOCAL: _basis.isLOCAL.bind(_basis),
		isDEV: _basis.isDEV.bind(_basis),
		isQAS: _basis.isQAS.bind(_basis),
		isPRD: _basis.isPRD.bind(_basis),
		s4hanaURL: _basis.s4hanaURL.bind(_basis),
		s4hanaDestination: _basis.s4hanaDestination.bind(_basis),
		post: _basis.post.bind(_basis),
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
		pernr: _session.pernr.bind(_session),
		locale: _session.locale.bind(_session),
		loginInfo: _session.loginInfo.bind(_session),
		confirmADPW: _session.confirmADPW.bind(_session),
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
		mid: _menu.mid.bind(_menu),
		urlData: _menu.urlData.bind(_menu),
		menuUrl: _menu.menuUrl.bind(_menu),
		handleUrl: _menu.handleUrl.bind(_menu),
		handleMissingMenuId: _menu.handleMissingMenuId.bind(_menu),
		handleUnauthorized: _menu.handleUnauthorized.bind(_menu),
		handleAuthCancel: _menu.handleAuthCancel.bind(_menu)
	});
},
homePortlet: function(_portlet) {

	this._portlet = _portlet;

	$.extend(HomeGateway.prototype, {
		updatePortlet: _portlet.updatePortlet.bind(_portlet)
	});
},

isPopup: function() {

	return !!this._basis.parameter('popup');
},

restorePreviousMenu: function() {


},

restoreHome: function() {

	if (this.isPopup()) {
		return;
	}

	// TODO : 메뉴 이탈 하시겠습니까?

	$(document).attr('title', 'Lotte Chemical e-HR');
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