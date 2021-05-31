/* global HomeMFA */
function HomeSession(_gateway, callback) {

	/*
	sessionStorage = {
		ehr.sf-user.name
		ehr.sf-user.photo
		ehr.sf-user.locale
		ehr.sf-user.language
		ehr.odata.user
		ehr.odata.user.percod
		ehr.odata.destination
		ehr.session.token
		ehr.mfa.done
		ehr.client.ip
		ehr.client.ip.external
		ehr.client.network
	}
	*/
	this.localeChangeCallbackOwners = [];

	this._gateway = _gateway;
	_gateway.homeSession(this);

	this.clearSessionStorage();

	this.init(callback);
}

$.extend(HomeSession.prototype, {

clearSessionStorage: function() {

	if (this.alreadyChekckedIn()) {
		return;
	}

	sessionStorage.removeItem('ehr.sf-user.name');
	sessionStorage.removeItem('ehr.sf-user.photo');
	sessionStorage.removeItem('ehr.sf-user.locale');
	sessionStorage.removeItem('ehr.sf-user.language');
	sessionStorage.removeItem('ehr.odata.user');
	sessionStorage.removeItem('ehr.odata.user.percod');
	sessionStorage.removeItem('ehr.odata.destination');
	sessionStorage.removeItem('ehr.session.token');
	sessionStorage.removeItem('ehr.mfa.done');
},

init: function(callback) {

	sessionStorage.setItem('ehr.odata.destination', this._gateway.s4hanaDestination());

	Promise.all([
		this.retrieveClientIP(),							// 접속자 IP 조회
		this.retrieveSFUserName(),							// 사번 조회
		this.retrieveSessionToken(),						// Session token 조회
		this._gateway.odataCsrfToken({}, 'ZHR_COMMON_SRV')	// 최초 CSRF token fetch 호출 이후 간헐적으로 발생하는 token validation failed 오류방지를 위해 encodePernr 호출전 미리 한 번 호출
	])
	.then(function() {
		return Promise.all([
			this.checkExternalIP(),							// 외부망 여부 확인
			this.retrieveSFUserPhoto(),						// SF 사진 조회
			this.retrieveSFUserLocale(),					// SF 언어 조회
			this.encodePernr()								// 암호화 사번 조회
		]);
	}.bind(this))
	.then(function() {
		return Promise.all([
			this.sessionToken(),							// Session token 등록
			this.registerToken()							// Mobile token 등록
		]);
	}.bind(this))
	.then(function() {
		return this.retrieveLoginInfo();					// 인사정보 조회
	}.bind(this))
	.then(function() {
		if (typeof callback === 'function') {
			callback();
		}
		// if (typeof HomeMFA === 'function') {
		// 	new HomeMFA(this._gateway).check(callback);	// Multi Factor Authentication
		// } else {
		// 	this._gateway.log('Multi Factor Authentication 모듈이 존재하지 않습니다.');
		// }
	}.bind(this))
	.catch(function(e) {
		var message = (e.message ? e.message : this._gateway.handleError(this._gateway.ODataDestination.ETC, e, 'HomeSession.init').message) || '알 수 없는 오류가 발생하였습니다.';

		$(function() {
			this._gateway.alert({
				title: '오류',
				html: ['<p>', '</p>'].join(message)
			});
		}.bind(this));
	}.bind(this));
},
alreadyChekckedIn: function() {

	return !!sessionStorage.getItem('ehr.session.token');
},
/*
1. DEV/QAS 모바일 접속시 테스트를 위해 사번 입력 popup 제공
2. PRD SF에 hpjt0857로 접속시 SM 업무를 위해 사번 입력 popup 제공
*/
dkdlTlqpfmffls: function(resolve) {

	var options = {
		title: 'Mobile : 대상자 사번 입력',
		html: [
			'<div class="form-group m-3">',
				'<label for="dkdlTl-qpfmffls">대상자 사번을 입력하세요.</label>',
				'<input type="text" maxlength="30" class="form-control" id="dkdlTl-qpfmffls" />',
				'<div class="invalid-feedback value-required">비밀번호를 입력하세요.</div>',
			'</div>'
		].join(''),
		show: function() {
			$('#dkdlTl-qpfmffls').keydown(function(e) {
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

			setTimeout(function() {
				var dkdlTlqpfmffls = $('#dkdlTl-qpfmffls'),
				pernr = dkdlTlqpfmffls.val().replace(/^0+/g, '');
				if (!pernr) {
					dkdlTlqpfmffls.siblings('.value-required').show();
					return;
				} else {
					dkdlTlqpfmffls.siblings('.value-required').hide();
				}

				sessionStorage.setItem('ehr.sf-user.name', pernr);
				resolve();
				this._gateway.confirm('hide');
			}.bind(this), 0);
		}.bind(this),
		cancel: function() {
			this._retrieveSFUserName(resolve);
		}.bind(this)
	};

	this._gateway.confirm(options);
},

retrieveClientIP: function() {

	return $.getJSON({
		url: '/essproxy/trace',
		success: function(data) {
			this._gateway.prepareLog('HomeSession.retrieveClientIP success', arguments).log();

			sessionStorage.setItem('ehr.client.ip', data.Ipadd.split(',')[0]);
			// sessionStorage.setItem('ehr.client.network', data.result);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.JAVA, jqXHR, 'HomeSession.retrieveClientIP');

			sessionStorage.removeItem('ehr.client.ip');
			sessionStorage.removeItem('ehr.client.network');
		}.bind(this)
	}).promise();
},

_retrieveSFUserName: function(resolve) {

	$.getJSON({
		url: '/services/userapi/currentUser',
		success: function(data) {
			this._gateway.prepareLog('HomeSession.retrieveSFUserName success', arguments).log();

			if (this._gateway.isPRD() && /hpjt0832/i.test(data.name)) {
				this.dkdlTlqpfmffls(resolve);
			} else {
				sessionStorage.setItem('ehr.sf-user.name', data.name);
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.SF, jqXHR, 'HomeSession.retrieveSFUserName');

			sessionStorage.removeItem('ehr.sf-user.name');

			resolve();
		}.bind(this)
	});
},
/*
SF의 사번 조회
*/
retrieveSFUserName: function() {

	var pernr = this._gateway.parameter('pernr');
	if (!this._gateway.isPRD() && pernr) {
		sessionStorage.setItem('ehr.sf-user.name', pernr);
		return new Promise(function(v) { v(); });
	}

	return new Promise(function(resolve) {

		if (!this._gateway.isPRD() && this._gateway.isMobile()) {
			this.dkdlTlqpfmffls(resolve);
		} else {
			this._retrieveSFUserName(resolve);
		}
	}.bind(this));
},
/*
S4HANA OData 호출을 위한 CSRF token 조회
*/
retrieveSessionToken: function() {

	// sessionStorage는 브라우저 창이 살아있는 동안만 유효하므로 session token이 존재한다는 것은 이미 최초에 발급을 받은 것이므로 재발급을 받으면 안됨, popup은 자식창이므로 sessionStorage를 공유
	// TODO : SF session timeout 이후에는 어떻게 해야할까?
	if (this.alreadyChekckedIn()) {
		return new Promise(function(v) { v(); });
	}

	return $.getJSON({
		url: '/essproxy/sessionkey',
		success: function(data) {
			this._gateway.prepareLog('HomeSession.retrieveSessionToken success', arguments).log();

			var token = data.result;
			if (token) {
				sessionStorage.setItem('ehr.session.token', token);
			} else {
				sessionStorage.removeItem('ehr.session.token');
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.JAVA, jqXHR, 'HomeSession.retrieveSessionToken');

			sessionStorage.removeItem('ehr.session.token');
		}.bind(this)
	}).promise();
},
checkExternalIP: function() {

	return $.getJSON({
		url: '/essproxy/check2FA',
		success: function(data) {
			this._gateway.prepareLog('HomeSession.checkExternalIP success', arguments).log();

			sessionStorage.setItem('ehr.client.ip.external', (data || {}).result === 'E');
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.JAVA, jqXHR, 'HomeSession.checkExternalIP');

			sessionStorage.removeItem('ehr.client.ip.external');
		}.bind(this)
	}).promise();
},
/*
SF의 개인 사진 조회
*/
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
/*
SF의 언어를 조회하여 Home 화면에 적용
*/
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
/*
Home 화면에서 언어 변경시 API를 통해 SF의 언어도 변경
*/
changeSFUserLocale: function() {

	this._gateway.spinner(true);

	return $.post({
		url: "/odata/fix/User('${pernr}')".interpolate(this.pernr()),
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
/*
Home 화면에서 언어 변경 후처리 작업 function
아래 addLocaleChangeCallbackOwner function으로 등록된 callbackOwner 들의 changeLocale function이 각각 호출됨
*/
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
Home 화면에서 언어 변경시 언어 변경 작업을 해야하는 모듈(callbackOwner)을 등록하는 function
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
	});
},

retrieveLoginInfo: function() {

	var Percod = sessionStorage.getItem('ehr.odata.user.percod'),
	Langu = sessionStorage.getItem('ehr.sf-user.language');

	return $.getJSON({
		url: this._gateway.s4hanaURL('ZHR_COMMON_SRV/EmpLoginInfoSet'),
		data: {
			$filter: [
				"Lpmid eq 'HACTA'",
				"Percod eq '${Percod}'",
				"Langu eq '${Langu}'",
				"ICusrid eq '${ICusrid}'",	// 암호화 로그인 사번
				"ICusrse eq '${ICusrse}'",	// Token
				"ICusrpn eq '${ICusrpn}'",	// 로그인 사번
				"ICmenuid eq ''"			// 메뉴 ID 불필요
			].join(' and ').interpolate(
				Percod,
				Langu,
				sessionStorage.getItem('ehr.odata.user.percod'),
				sessionStorage.getItem('ehr.session.token'),
				sessionStorage.getItem('ehr.sf-user.name')
			)
		},
		success: function(data) {
			this._gateway.prepareLog('HomeSession.retrieveLoginInfo success', arguments).log();

			var result = this._gateway.odataResults(data);
			if (result) {
				delete result.__metadata;
				result.Dtfmt = result.Dtfmt || 'yyyy-MM-dd';
				result.Langu = sessionStorage.getItem('ehr.sf-user.language') || result.Langu;
				result.Ipadd = sessionStorage.getItem('ehr.client.ip');
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

sessionToken: function() {

	var url = 'ZHR_COMMON_SRV/SessionInfoSet';

	return this._gateway.post({
		url: url,
		data: {
			ICusrid: sessionStorage.getItem('ehr.odata.user.percod'),	// 암호화 사번
			ICusrse: sessionStorage.getItem('ehr.session.token'),		// Token
			ILangu: sessionStorage.getItem('ehr.sf-user.language'),
			Export: []
		},
		success: function() {
			this._gateway.prepareLog('HomeSession.sessionToken ${url} success'.interpolate(url), arguments).log();
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.sessionToken ' + url);
		}.bind(this)
	});
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
	});
},

logout: function() {

	$([	'<div class="modal fade" style="display:none" aria-hidden="true" data-backdrop="static" tabindex="-1" role="dialog" id="ehr-logout-modal">',
			'<div class="modal-dialog" role="document">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<h4 class="modal-title">로그아웃 확인</h4>',
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
					'</div>',
					'<div class="modal-body">',
						'<div class="form-group my-3 text-center">',
							'로그아웃하시겠습니까?',
						'</div>',
						'<div class="form-group my-0 text-center">',
							'<button type="button" class="btn btn-primary fn-logout">',
								'<span class="spinner-border spinner-border-sm mb-2px mr-8px d-none" role="status" aria-hidden="true"></span>',
								'로그아웃',
							'</button>',
						'</div>',
						'<div class="form-group my-3 text-center d-none">',
							'<div class="feedback-message valid-feedback d-block my-0" style="font-size:100%">',
								'로그아웃 처리에 다소 시간이 소요됩니다.<br />로그아웃 될때까지 기다려 주세요.',
							'</div>',
						'</div>',
					'</div>',
					'<div class="modal-footer">',
						'<button type="button" class="btn btn-light" data-dismiss="modal">취소</button>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('')).appendTo('body')
	.on('click', '.fn-logout', function(e) {
		$(e.currentTarget)
			.prop('disabled', true)
			.find('.spinner-border').toggleClass('d-none', false);

		$('#ehr-logout-modal [data-dismiss="modal"]').prop('disabled', true);

		location.href = this.scpLogoutEndpoint();
		// if (this._gateway.isMobile()) {
		// } else {
		// 	$('#ehr-logout-modal .feedback-message').parent().toggleClass('d-none', false);

		// 	$('#ehr-logout-modal .modal-body').append([
		// 		'<iframe class="d-none" name="single-sign-out-iframe"></iframe>',
		// 		'<iframe class="d-none" name="single-sign-out-second-iframe"></iframe>',
		// 		'<iframe class="d-none" name="scp-logout-iframe"></iframe>'
		// 	]);

		// 	this.singleSignOut();
		// }
	}.bind(this))
	.on('hidden.bs.modal', function() {
		$(this).remove();
	})
	.modal();
},

singleSignOut: function() {

	$('iframe[name="single-sign-out-iframe"]').on('load', this.singleSignOutSecond.bind(this)).attr('src', this.iasLogoutEndpoint.call(this));
},

singleSignOutSecond: function() {

	setTimeout(function() {
		$('iframe[name="single-sign-out-second-iframe"]').on('load', this.scpLogout.bind(this)).attr('src', this.iasLogoutEndpoint.call(this));
	}.bind(this), 5000);
},

scpLogout: function() {

	setTimeout(function() {
		$('iframe[name="scp-logout-iframe"]').on('load', this.moveToIndexPage.bind(this)).attr('src', this.scpLogoutEndpoint.call(this));
	}.bind(this), 5000);
},

scpLogoutEndpoint: function() {

	var params = $.param({
		home: '/index${}.html'.interpolate(this._gateway.isMobile() ? 'Mobile' : ''),
		ias: this._gateway.isPRD() ? 'af0dpm2pj' : 'axs5k0vke'
	});
	return '/Logout.html?' + params;
},

moveToIndexPage: function() {

	setTimeout(function() {
		location.href = '/index${}.html'.interpolate(this._gateway.isMobile() ? 'Mobile' : '');
	}.bind(this), 5000);
},

iasLogoutEndpoint: function() {

	var ias = this._gateway.isPRD() ? 'af0dpm2pj' : 'axs5k0vke';
	return 'https://${ias}.accounts.ondemand.com/saml2/idp/slo/${ias}.accounts.ondemand.com'.interpolate(ias, ias);
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
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.authenticateADAccount ' + url);
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

			setTimeout(function() {
				var adpw = $('#adpw'),
				pw = adpw.val();
				if (!pw) {
					adpw.siblings('.value-required').show();
					return;
				} else {
					adpw.siblings('.value-required').hide();
				}

				setTimeout(function() {
					this.authenticateADAccount(pw)
						.then(function() {
							setTimeout(function() {
								this._gateway.confirm('hide');
							}.bind(this), 0);

							o.confirm();
						}.bind(this))
						.catch(function(jqXHR) {
							var errorMessage = this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.authenticateADAccount').message;

							adpw.siblings('.value-invalid').text(errorMessage).show();
						}.bind(this));
				}.bind(this), 0);
			}.bind(this), 0);
		}.bind(this),
		cancel: o.cancel
	};

	this._gateway.confirm(options);
},

usePrivateLog: function(o) {

	var url = 'ZHR_COMMON_SRV/SaveConnEhrLogSet';

	return this._gateway.post({
		url: url,
		data: {
			ILangu: sessionStorage.getItem('ehr.sf-user.language'),
			TableIn: [{
				Usrid: sessionStorage.getItem('ehr.odata.user.percod'),
				Menid: this._gateway.currentMid(),
				Pernr: o.pernr || '',
				Func: o.func || '',
				Mobile: this._gateway.isMobile() ? 'X' : ''
			}]
		},
		success: function() {
			this._gateway.prepareLog('HomeSession.usePrivateLog ${url} success'.interpolate(url), arguments).log();
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeSession.usePrivateLog ' + url);
		}.bind(this)
	});
}

});