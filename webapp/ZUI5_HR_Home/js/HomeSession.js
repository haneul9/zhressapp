function HomeSession(_gateway, initHome) {

	/*
	sessionStorage = {
		ehr.sf-user.name
		ehr.sf-user.photo
		ehr.sf-user.locale
		ehr.odata.user
		ehr.odata.user.percod
		ehr.odata.csrf-token
		ehr.odata.destination
		ehr.menu-auth.state
		ehr.ad-pw-confirm.state
	}
	*/
	this.localeChangeCallbackOwners = [];

	this._gateway = _gateway;
	_gateway.homeSession(this);

	this.init(initHome);
}

$.extend(HomeSession.prototype, {

init: function(initHome) {

	sessionStorage.setItem('ehr.odata.destination', this._gateway.s4hanaDestination());

	Promise.all([
		this.retrieveSFUserName(),			// 사번 조회
		this.retrieveOdataCsrfToken()		// Odata CSRF token 조회
	])
	.then(function() {
		return Promise.all([
			this.retrieveSFUserPhoto(),		// SF 사진 조회
			this.retrieveSFUserLocale(),	// SF 언어 조회
			this.encodePernr()				// 암호화 사번 조회
		]);
	}.bind(this))
	.then(function() {
		return Promise.all([
			this.retrieveLoginInfo(),		// 인사정보 조회
			this.registerToken()			// Mobile token 등록
		]);
	}.bind(this))
	.catch(function(jqXHR) {
		var message = this._gateway.handleError(this._gateway.ODataDestination.ETC, jqXHR, 'HomeSession.init').message;

		$(function() {
			this._gateway.alert({
				title: '오류',
				html: ['<p>', '</p>'].join(message)
			});
		}.bind(this));
	}.bind(this))
	.then(initHome || function() {});
},

retrieveSFUserName: function() {

	if (!this._gateway.isPRD() && this._gateway.parameter("pernr")) {
		sessionStorage.setItem('ehr.sf-user.name', this._gateway.parameter("pernr"));
		return new Promise(function(v) {
			v();
		});
	}

	return $.getJSON({
		url: '/services/userapi/currentUser',
		success: function(data) {
			this._gateway.prepareLog('HomeSession.retrieveSFUserName success', arguments).log();

			sessionStorage.setItem('ehr.sf-user.name', data.name);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.SF, jqXHR, 'HomeSession.retrieveSFUserName');

			sessionStorage.removeItem('ehr.sf-user.name');
		}.bind(this)
	}).promise();
},

retrieveOdataCsrfToken: function() {

	return $.getJSON({
		url: this._gateway.s4hanaURL('ZHR_COMMON_SRV'),
		headers: {
			'x-csrf-token': 'Fetch'
		},
		success: function(data, textStatus, jqXHR) {
			this._gateway.prepareLog('HomeSession.retrieveOdataCsrfToken success', arguments).log();

			var token = jqXHR.getResponseHeader('x-csrf-token');
			if (token) {
				sessionStorage.setItem('ehr.odata.csrf-token', token);
			} else {
				sessionStorage.removeItem('ehr.odata.csrf-token');
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.retrieveOdataCsrfToken');

			sessionStorage.removeItem('ehr.odata.csrf-token');
		}.bind(this)
	}).promise();
},

retrieveSFUserPhoto: function() {

	return $.getJSON({
		url: "/odata/v2/Photo",
		data: {
			$select: 'mimeType,photo',
			$filter: "userId eq '${userId}' and photoType eq 1".interpolate(this.pernr())
		},
		success: function(data) {
			this._gateway.prepareLog('HomeSession.retrieveSFUserPhoto success', arguments).log();

			var result = this._gateway.odataResults(data);
			if (!$.isEmptyObject(result)) {
				sessionStorage.setItem('ehr.sf-user.photo', "data:${mimeType};base64,${photo}".interpolate(result.mimeType, result.photo));
			} else {
				sessionStorage.setItem('ehr.sf-user.photo', 'images/photoNotAvailable.gif');
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.SF, jqXHR, 'HomeSession.retrieveSFUserPhoto');

			sessionStorage.setItem('ehr.sf-user.photo', 'images/photoNotAvailable.gif');
		}.bind(this)
	}).promise();
},

retrieveSFUserLocale: function() {

	return $.getJSON({
		url: "/odata/v2/User('${pernr}')".interpolate(this.pernr()),
		data: {
			$select: 'defaultLocale'
		},
		success: function(data) {
			this._gateway.prepareLog('HomeSession.retrieveSFUserLocale success', arguments).log();

			if (data && data.d) {
				sessionStorage.setItem('ehr.sf-user.locale', data.d.defaultLocale);
				sessionStorage.setItem('ehr.sf-user.language', data.d.defaultLocale.replace(/^([a-zA-Z]{2}).*$/, '$1').toUpperCase());
			} else {
				var sfLocale = $('#sf-locale option:selected');
				sessionStorage.setItem('ehr.sf-user.locale', sfLocale.val());
				sessionStorage.setItem('ehr.sf-user.language', sfLocale.data('lang'));
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.SF, jqXHR, 'HomeSession.retrieveSFUserLocale');

			var sfLocale = $('#sf-locale option:selected');
			sessionStorage.setItem('ehr.sf-user.locale', sfLocale.val());
			sessionStorage.setItem('ehr.sf-user.language', sfLocale.data('lang'));
		}.bind(this)
	}).promise();
},

changeSFUserLocale: function() {

	this._gateway.spinner(true);

	return $.post({
		url: "/odata/v2/User('${pernr}')".interpolate(this.pernr()),
		data: JSON.stringify({
			defaultLocale: $('#sf-locale option:selected').val()
		}),
		contentType: 'application/json',
		headers: {
			'x-http-method': 'MERGE'
		},
		success: function() {
			this._gateway.prepareLog('HomeSession.changeSFUserLocale success', arguments).log();

			this.afterChangeLocale();
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.SF, jqXHR, 'HomeSession.changeSFUserLocale');
		}.bind(this)
	});
},

afterChangeLocale: function() {

	var sfLocale = $('#sf-locale option:selected'),
	locale = sfLocale.val(),
	language = sfLocale.data('lang');

	sessionStorage.setItem('ehr.sf-user.locale', locale);
	sessionStorage.setItem('ehr.sf-user.language', language);

	setTimeout(function() {
		$('html').attr({
			locale: locale,
			lang: language.toLowerCase()
		});
	}, 0);

	this.retrieveLoginInfo()
		.then(function() {
			var loginInfo = this.loginInfo();
			loginInfo.Langu = language;

			this.loginInfo(loginInfo);

			this._gateway.spinner(false);

			$.map(this.localeChangeCallbackOwners || [], function(callbackOwner) {
				this._gateway.prepareLog('HomeSession.afterChangeLocale', callbackOwner).log();
				callbackOwner.changeLocale();
			}.bind(this));
		}.bind(this));
},

/*
Home 화면에서 언어 변경시 언어 변경 작업을 해야하는 모듈(callbackOwner) 등록 function
callbackOwner는 반드시 changeLocale function을 구현해야함
*/
addLocaleChangeCallbackOwner: function(callbackOwner) {

	this._gateway.prepareLog('HomeSession.addLocaleChangeCallbackOwner', callbackOwner).log();

	if (!callbackOwner || typeof callbackOwner.changeLocale !== 'function') {
		this._gateway.log('HomeSession.addLocaleChangeCallbackOwner error', this._gateway.functionName(callbackOwner) + ' must implement "changeLocale" function.');
		return;
	}

	if ($.inArray(callbackOwner, this.localeChangeCallbackOwners) > -1) {
		this._gateway.log('HomeSession.addLocaleChangeCallbackOwner warning', this._gateway.functionName(callbackOwner) + ' is already added.');
		return;
	}

	this.localeChangeCallbackOwners.push(callbackOwner);
},

removeLocaleChangeCallbackOwner: function(callbackOwner) {

	this._gateway.prepareLog('HomeSession.removeLocaleChangeCallbackOwner', callbackOwner).log();

	var index = $.inArray(callbackOwner, this.localeChangeCallbackOwners);
	if (!callbackOwner || index === -1) {
		return;
	}

	this.localeChangeCallbackOwners.splice(index, 1);

	this._gateway.log('HomeSession.removeLocaleChangeCallbackOwner success', this._gateway.functionName(callbackOwner) + ' removed.');
},

locale: function() {

	return sessionStorage.getItem('ehr.sf-user.locale');
},

encodePernr: function() {

	var url = 'ZHR_COMMON_SRV/PernrEncodingSet',
	pernr = this.pernr();

	return this._gateway.post({
		url: url,
		data: {
			Pernr: pernr,
			PernrEncodeNav: [{ Pernr: pernr }]
		},
		success: function(data) {
			this._gateway.prepareLog('HomeSession.encodePernr ${url} success'.interpolate(url), arguments).log();

			if (data && data.d) {
				sessionStorage.setItem('ehr.odata.user.percod', data.d.Percod);
			} else {
				sessionStorage.removeItem('ehr.odata.user.percod');
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.encodePernr ' + url);

			sessionStorage.removeItem('ehr.odata.user.percod');
		}.bind(this)
	}).promise();
},

retrieveLoginInfo: function() {

	var Percod = sessionStorage.getItem('ehr.odata.user.percod'),
	Langu = sessionStorage.getItem('ehr.sf-user.language');

	return $.getJSON({
		url: this._gateway.s4hanaURL('ZHR_COMMON_SRV/EmpLoginInfoSet'),
		data: {
			$filter: "Lpmid eq 'HACTA' and Percod eq '${Percod}' and Langu eq '${Langu}'".interpolate(Percod, Langu)
		},
		success: function(data) {
			this._gateway.prepareLog('HomeSession.retrieveLoginInfo success', arguments).log();

			var result = this._gateway.odataResults(data);
			if (result) {
				delete result.__metadata;
				result.Dtfmt = result.Dtfmt || 'yyyy-MM-dd';
				result.Langu = sessionStorage.getItem('ehr.sf-user.language') || result.Langu;
				this.loginInfo(result);
			} else {
				sessionStorage.removeItem('ehr.odata.user');
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.retrieveLoginInfo');

			sessionStorage.removeItem('ehr.odata.user');
		}.bind(this)
	}).promise();
},

registerToken: function() {
	var url = 'ZHR_COMMON_SRV/PernrTokenSet',
		token = this._gateway.parameter("token"),
		percod = sessionStorage.getItem('ehr.odata.user.percod');

	if (token === undefined || token === null || token === '') {
		// throw new Error("Token is blank.");
		return null;
	}

	return this._gateway.post({
		url: url,
		data: {
			Percod: percod,
			Token: token
		},
		success: function() {
			this._gateway.prepareLog('HomeSession.registerToken ${token} success'.interpolate(token), arguments).log();
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.registerToken ' + url);
		}.bind(this)
	}).promise();
},

pernr: function() {

	return sessionStorage.getItem('ehr.sf-user.name');
},

loginInfo: function(loginInfo) {

	if (typeof loginInfo === 'string' || loginInfo instanceof String) {
		return (JSON.parse(sessionStorage.getItem('ehr.odata.user')) || {})[loginInfo];
	} else if ($.isPlainObject(loginInfo)) {
		sessionStorage.setItem('ehr.odata.user', JSON.stringify(loginInfo));
		return this;
	} else {
		return JSON.parse(sessionStorage.getItem('ehr.odata.user')) || {};
	}
},

authenticateADAccount: function(pw) {

	var url = 'ZHR_COMMON_SRV/PerPasswordSet';

	return this._gateway.post({
		async: false,
		url: url,
		data: {
			Empid: this._gateway.pernr(),
			Perpw: pw,
			PernrPWNav: []
		},
		success: function() {
			this._gateway.prepareLog('HomeSession.authenticateADAccount ${url} success'.interpolate(url), arguments).log();

			sessionStorage.setItem('ehr.ad-pw-confirm.state', 'ok');
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.authenticateADAccount ' + url);

			sessionStorage.removeItem('ehr.ad-pw-confirm.state');
		}.bind(this)
	});
},

confirmADPW: function(o) {

	var options = {
		title: '비밀번호 확인',
		html: [
			'<div class="form-group m-3">',
				'<label for="adpw">', o.message, '</label>',
				'<input type="password" maxlength="20" class="form-control" id="adpw" />',
				'<div class="invalid-feedback value-required">비밀번호를 입력하세요.</div>',
				'<div class="invalid-feedback value-invalid"></div>',
			'</div>'
		].join(''),
		show: function() {
			$('#adpw').keydown(function(e) {
				var key = e.keyCode || e.which;
				if (key === 13 && $.trim($(e.currentTarget).val())) {
					options.confirm();
				}
			});
		},
		confirm: function(e) {
			if (e) {
				e.stopImmediatePropagation();
			}

			var adpw = $('#adpw'),
			pw = adpw.val();
			if (!pw) {
				adpw.siblings('.value-required').show();
				return;
			} else {
				adpw.siblings('.value-required').hide();
			}

			if ((this._gateway.isDEV() && pw === '1') || (this._gateway.isQAS() && pw === '2')) {
				setTimeout(function() {
					sessionStorage.setItem('ehr.ad-pw-confirm.state', 'ok');
					this._gateway.confirm('hide');
				}.bind(this), 0);

				o.confirm();
			} else {
				this.authenticateADAccount(pw)
					.then(function() {
						this._gateway.confirm('hide');
						o.confirm();
					}.bind(this))
					.catch(function(jqXHR) {
						var errorMessage = this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.authenticateADAccount').message;

						adpw.siblings('.value-invalid').text(errorMessage).show();
					}.bind(this));
			}
		}.bind(this),
		cancel: o.cancel
	};

	this._gateway.confirm(options);
}

});