function AppPrefilter() {

	// 그랜드 오픈 이후 AppPrefilter를 적용하므로 그전까지 운영은 bypass 로직 적용
	if ((location.host.split('.').shift() || '').split('-').pop() === 'yzdueo754l') {
		try {
			if (parent && parent._gateway) {
				parent._gateway.successAppPrefilter();
			}
		} catch(e) {
			// SF에서 평가 메뉴 접속시
		}
		window._menu_prefilter = this;
		this._menu_authorized = true;

		document.addEventListener("DOMContentLoaded", function() {
			window.startAppInit();
		});

		return this;
	}

	try {
		if (!parent || !parent._gateway) {
			alert("잘못된 메뉴 접속입니다.\nHome 화면에서 접속해주시기 바랍니다.");

			var indexPage = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : '';
			if (/^webide/i.test(location.host)) {
				location.href = "/webapp/index" + indexPage + ".html?hc_orionpath=%2FDI_webide_di_workspaceiwil0nuxhaqnmtpv%2Fzhressapp";
			} else {
				location.href = "/index" + indexPage + ".html";
			}
		}
	} catch(e) {
		// SF에서 평가 메뉴 접속시
		window._menu_prefilter = this;
		this._menu_authorized = true;

		document.addEventListener("DOMContentLoaded", function () {
			window.startAppInit();
		});

		return this;
	}

	window._menu_prefilter = this;

	this._menu_authorized = false;
	this._gateway = parent._gateway;
	this.parameterMap = this._gateway.parameterMap(location.search);

	this.init();
}

AppPrefilter.prototype.init = function() {

	this.toggleInitSequenceLogging(this.parameterMap.logging === "true");

	try {
		this.checkMenuId();						// mid parameter 존재 확인
		var result = this.checkMenuAuthority();	// mid에 해당하는 메뉴 권한 및 비밀번호 재확인 필요 메뉴인지 확인
		setTimeout(function() {
			window._use_emp_info_box = result.EPinfo === "X"; // EmpBasicInfoBox 표시 여부
		}, 0);
		this.confirmADPW(result);				// 개인정보 노출 메뉴인 경우 비밀번호 재확인(MOIN 비밀번호, 최초 1회만 확인)

	} catch(e) {
		if (e.message === "error.missing.mid") {
			this._gateway.handleMissingMenuId(this.errorHandler.bind(this));

		} else if (e.message === "error.unauthorized") {
			var message = this._gateway.handleError(this._gateway.ODataDestination.S4HANA, e, "common.AppPrefilter.checkMenuAuthority").message;
			this._gateway.handleUnauthorized(message, this.errorHandler.bind(this));

		} else {
			this._gateway.alert({ title: "오류", html: ["<p>", "</p>"].join(e), hidden: this.errorHandler.bind(this) });

		}

		this._gateway.restoreHome();
	}
};

AppPrefilter.prototype.isMenuAuthorized = function() {

	return this._menu_authorized;
};

AppPrefilter.prototype.toggleInitSequenceLogging = function(on) {

	window._init_sequence_logging = on;
};

AppPrefilter.prototype.checkMenuId = function() {

	if (!this.parameterMap.mid) {
		throw new Error("error.missing.mid");
	}
};

AppPrefilter.prototype.checkMenuAuthority = function() {

	var result = { hasMenuAuthority: true },
	loginInfo = this._gateway.loginInfo();

	this._gateway.post({
		async: false,
		url: "ZHR_COMMON_SRV/GetMenuidRoleSet",
		data: {
			IPernr: loginInfo.Pernr,
			IBukrs: loginInfo.Bukrs,
			IMenid: this.parameterMap.mid,
			IMobile: this._gateway.isMobile() ? 'X' : '',
			Export: []
		},
		success: function(data) {
			this._gateway.prepareLog("common.AppPrefilter.checkMenuAuthority success.", arguments).log();

			// ERole !== 'X' 이면 권한이 없는 것이지만 권한이 없으면 아래 error function으로 처리됨
			var ExportResult = (((((data || {}).d || {}).Export || {}).results || [])[0] || {});
			result.EPinfo = ExportResult.EPinfo; // EmpBasicInfoBox 표시 여부

			if (/^webide/i.test(location.host)) {
				result.ECheckPw = "";
			} else {
				result.ECheckPw = ExportResult.ECheckPw; // 비밀번호 재확인이 필요한 메뉴인지 여부
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, "common.AppPrefilter.checkMenuAuthority");

			if (/^webide/i.test(location.host)) {
				result.hasMenuAuthority = true;
				result.ECheckPw = ""; // 비밀번호 재확인이 필요한 메뉴인지 여부
				result.EPinfo = "X"; // EmpBasicInfoBox 표시 여부
			} else {
				result.hasMenuAuthority = false;
				result.jqXHR = jqXHR;
			}
		}.bind(this)
	});

	if (!result.hasMenuAuthority) {
		result.jqXHR.message = "error.unauthorized";
		throw result.jqXHR;
	}

	return result;
};

AppPrefilter.prototype.confirmADPW = function(result) {

	if (result.ECheckPw === "X") {
		this._gateway.spinner(false);

		this._gateway.confirmADPW({
			message: "개인/민감정보 조회를 위해 MOIN 비밀번호를 입력하시기 바랍니다.",
			confirm: function() {
				setTimeout(function() {
					this._gateway.successAppPrefilter(); // 메뉴 iframe 정상 로딩시 Home 화면 후속 처리
				}.bind(this), 0);
				this._menu_authorized = true;

				setTimeout(function() {
					window.startAppInit();
				}, 300);
			}.bind(this),
			cancel: function() {
				setTimeout(function() {
					this._gateway.handleAuthCancel(this.errorHandler.bind(this));
					this._gateway.restoreHome();
				}.bind(this), 0);
			}.bind(this)
		});

	} else {
		setTimeout(function() {
			this._gateway.successAppPrefilter(); // 메뉴 iframe 정상 로딩시 Home 화면 후속 처리
		}.bind(this), 0);
		this._menu_authorized = true;

		document.addEventListener("DOMContentLoaded", function() {
			setTimeout(function() {
				window.startAppInit();
			}, 0);
		});

	}
};

AppPrefilter.prototype.errorHandler = function() {

	if (this._gateway.isPopup()) {
		location.href = "Error.html";
	}
};

new AppPrefilter();