function HomeMFA(_gateway) {

	this._gateway = _gateway;
	this.timeoutMinutes = 5;
	this.timerCheckWaitTime = this.timeoutMinutes * 60 * 1000 - 2000; // timer를 종료시키기 위한 timerStopper 시작 대기 시간
}

$.extend(HomeMFA.prototype, {

check: function(callback) {

	this.callback = typeof callback === 'function' ? callback : function() {};
	this.CODE = {
		REQUEST: '1',
		CONFIRM: '2'
	};
	this.STATUS = {
		INIT: 1,
		WAIT: 2,
		DONE: 3,
		ERROR: 4
	};

	if (sessionStorage.getItem('ehr.mfa.done')) { // 새 창으로 뜨는 경우 다시 인증하지 않기 위해 sessionStorage에 인증여부를 저장함
		return new Promise(function(resolve) {
			setTimeout(function() {
				resolve();
			}, 0);

			if (typeof callback === 'function') {
				this.callback();
			}
		}.bind(this));
	}

	return Promise.all([
		this.isTargetPernr()	// MFA 대상 사번인지 확인
	])
	.then(function() {
		if (this._gateway.parameter('dlswmddlvlfdygkqslek') === 'true') {
			this.confirm();
		} else {
			// MFA 대상 IP인지 확인
			this.targetIP = sessionStorage.getItem('ehr.client.ip.external') === 'E';

			if (this._gateway.parameter('xptmxmwhagkrpTtmqslek') !== 'true') {
				if (this.targetIP && this.targetPernr) {
					this.confirm();
				} else {
					if (typeof callback === 'function') {
						this.callback();
					}
				}
			} else {
				if (typeof callback === 'function') {
					this.callback();
				}
			}
		}
	}.bind(this))
	.catch(function(e) {
		var message = this._gateway.handleError(this._gateway.ODataDestination.ETC, e, 'HomeMFA.check').message || '2차 인증 시도중 알 수 없는 오류가 발생하였습니다.';

		this._gateway.alert({
			title: '오류',
			html: ['<p>', '</p>'].join(message),
			hidden: function() {
				location.href = 'Error.html';
			}
		});
	}.bind(this));
},

isTargetPernr: function() {

	return new Promise(function(resolve, reject) {
		this._gateway.getModel('ZHR_COMMON_SRV').read('/TwoFactorAuthCheckSet', {
			async: true,
			filters: [
				new sap.ui.model.Filter('Percod', sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
				new sap.ui.model.Filter('Device', sap.ui.model.FilterOperator.EQ, this._gateway.isMobile() ? 'M' : '')
			],
			success: function(oData) {
				this.targetPernr = oData.results[0].Authyn === 'Y';

				this._gateway.prepareLog('HomeMFA.isTargetPernr success : ' + this.targetPernr, arguments).log();

				resolve({ data: oData });
			}.bind(this),
			error: reject
		});
	}.bind(this));
},

confirm: function() {

	this.mfaCodeTimer = null;

	$(this.ui()).appendTo('body')
		.on('click', '.fn-code-request', this.handleCodeRequest.bind(this))
		.on('click', '.fn-code-confirm', this.handleCodeConfirm.bind(this))
		.on('show.bs.modal', function() {

			this.setStatus(this.STATUS.INIT);

			$('#code-mfa').keydown(function(e) {
				var key = e.keyCode || e.which;
				if (key === 13) {
					e.stopImmediatePropagation();

					// 코드 확인 요청
					setTimeout(function() {
						this.requestCode(this.CODE.CONFIRM);
					}.bind(this), 0);
				}
			}.bind(this));
		}.bind(this))
		.on('hidden.bs.modal', function() {

			clearInterval(this.mfaCodeTimer);
			clearInterval(this.mfaCodeTimerStopper);
			$('#ehr-mfa-modal').modal('dispose').remove();
		}.bind(this))
		.modal();
},

handleCodeRequest: function(e) {
	e.preventDefault();

	clearInterval(this.mfaCodeTimer);
	clearInterval(this.mfaCodeTimerStopper);

	// 코드 발송 요청
	setTimeout(function() {
		this.showMessage('.valid-feedback', '인증코드 발급요청을 하였습니다. 잠시 후 Hi HR어플 푸시알림을 확인하시기 바랍니다.');
		this.requestCode(this.CODE.REQUEST);
	}.bind(this), 0);

	// countdown
	var future = moment().add(this.timeoutMinutes, 'minutes');
	this.mfaCodeTimer = setInterval(function() {
		$('#code-mfa-timer').val(moment(future).subtract(moment()).format('m:ss'));
	}, 200);

	// timeout -> countdown stop
	setTimeout(function() {
		this.mfaCodeTimerStopper = setInterval(function() {
			if ($('#code-mfa-timer').val() === '0:00') {
				setTimeout(function() {
					clearInterval(this.mfaCodeTimerStopper);
					clearInterval(this.mfaCodeTimer);
				}.bind(this), 0);

				setTimeout(function() {
					this.showMessage('.invalid-feedback', '인증 제한시간이 만료되었습니다. 새로운 인증코드를 발급받으시기 바랍니다.');
					this.setStatus(this.STATUS.INIT);

					setTimeout(function() {
						$('#code-mfa-timer').val('0:00');
					}, 300);
				}.bind(this), 0);
			}
		}.bind(this), 100);
	}.bind(this), this.timerCheckWaitTime);
},

handleCodeConfirm: function(e) {
	e.preventDefault();

	// 코드 확인 요청
	setTimeout(function() {
		this.requestCode(this.CODE.CONFIRM);
	}.bind(this), 0);
},

requestCode: function(type) {

	this.setStatus(this.STATUS.WAIT, type);

	var codeInput = $('#code-mfa'), code = $.trim(codeInput.val());
	if (type === this.CODE.CONFIRM) {
		if (!this.mfaCodeTimer) {
			this.showMessage('.invalid-feedback', '인증코드 발급요청을 먼저 해주세요.');
			this.setStatus(this.STATUS.ERROR, type);
			return;
		}
		if (!code) {
			this.showMessage('.invalid-feedback', '인증코드를 입력하세요.');
			this.setStatus(this.STATUS.ERROR, type);
			return;
		}

		this.hideMessage();
	}
	if (type === this.CODE.REQUEST) {
		codeInput.focus();
	}

	setTimeout(function() {
		if (type === this.CODE.CONFIRM && (((this._gateway.isLOCAL() || this._gateway.isDEV()) && code === '1') || (this._gateway.isQAS() && code === '2'))) {
			this.done();
			return;
		}

		this._gateway.getModel('ZHR_COMMON_SRV').create('/TwoFactorAuthNumberSet', {
			Ttype: type,
			Cernm: code,
			Percod: sessionStorage.getItem('ehr.odata.user.percod')
		}, {
			async: true,
			success: function(data) {
				this._gateway.prepareLog('HomeMFA.requestCode success', arguments).log();

				if (type === this.CODE.REQUEST) {
					this.sendPush(data.results, type);
				} else {
					this.setStatus(this.STATUS.DONE, type);
					this.done();
				}
			}.bind(this),
			error: function(jqXHR) {
				var errorMessage = this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeMFA.requestCode').message;

				setTimeout(function() {
					clearInterval(this.mfaCodeTimerStopper);
					clearInterval(this.mfaCodeTimer);
				}.bind(this), 0);

				setTimeout(function() {
					this.showMessage('.invalid-feedback', errorMessage);
					this.setStatus(this.STATUS.ERROR, type);

					setTimeout(function() {
						$('#code-mfa-timer').val('5:00');
					}, 300);
				}.bind(this), 0);
			}.bind(this)
		});
	}.bind(this), 0);
},

sendPush: function(notification, type) {

	$.post({
		url: '/essproxy/twofactor',
		dataType: 'text',
		data: {
			token: notification.Token,
			body: notification.Zbigo
		},
		success: function() {
			this._gateway.prepareLog('HomeMFA.sendPush success', arguments).log();

			this.setStatus(this.STATUS.DONE, type);
		}.bind(this),
		error: function(jqXHR) {
			var errorMessage = this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeMFA.requestCode').message;

			this.showMessage('.invalid-feedback', errorMessage);
			this.setStatus(this.STATUS.ERROR, type);
		}.bind(this)
	});
},

showMessage: function(selector, message) {

	setTimeout(function() {
		var target = $('.feedback-message' + selector);
		if (message) {
			target.text(message);
		}
		target.show().siblings().hide();
	}, 0);
},

hideMessage: function() {

	setTimeout(function() {
		$('.feedback-message').hide();
	}, 0);
},

setStatus: function(status, type) {

	var INIT = status === this.STATUS.INIT,
	WAIT = status === this.STATUS.WAIT,
	DONE = status === this.STATUS.DONE,
	ERROR = status === this.STATUS.ERROR,
	REQUEST = type === this.CODE.REQUEST,
	CONFIRM = type === this.CODE.CONFIRM;

	setTimeout(function() {
		if (REQUEST) {
			$('#code-mfa').prop('disabled', INIT || ERROR);	// 인증코드 발급 전 초기 상태이거나 발급 에러인 경우에 비활성
			$('.fn-code-request').prop('disabled', WAIT);	// 인증코드 발급 요청중인 경우 비활성
			$('.fn-code-confirm').prop('disabled', !DONE);	// 인증코드 발급 요청이 정상 완료되면 활성

		} else if (CONFIRM) {
			$('#code-mfa').prop('disabled', !ERROR);		// 인증코드 확인중인 경우 비활성
			$('.fn-code-request').prop('disabled', !ERROR);	// 인증코드 확인중인 경우 비활성
			$('.fn-code-confirm').prop('disabled', !ERROR);	// 인증코드 확인중인 경우 비활성

		} else {
			$('#code-mfa').prop('disabled', INIT);
			$('.fn-code-request').prop('disabled', !INIT);
			$('.fn-code-confirm').prop('disabled', INIT);

		}
	}, 0);
},

done: function() {

	setTimeout(function() {
		$('#ehr-mfa-modal').modal('hide');
		sessionStorage.setItem('ehr.mfa.done', true);
	}, 0);

	if (typeof callback === 'function') {
		this.callback();
	}
},

ui: function() {

	return [
		'<div class="modal fade" aria-hidden="true" data-backdrop="static" tabindex="-1" role="dialog" id="ehr-mfa-modal">',
			'<div class="modal-dialog" role="document">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<h4 class="modal-title">2차 인증</h4>',
					'</div>',
					'<div class="modal-body">',
						'<div class="form-group mx-1 my-3">',
							'<label for="code-mfa">2차 인증이 필요합니다. 인증코드를 발급받아 입력하세요.</label>',
						'</div>',
						'<div class="form-row mx-1">',
							'<div class="form-group mfa-input">',
								'<input type="text" maxlength="10" class="form-control" id="code-mfa" />',
							'</div>',
							'<div class="form-group mfa-timer">',
								'<input type="text" readonly="readonly" class="form-control-plaintext" value="5:00" id="code-mfa-timer" />',
							'</div>',
							'<div class="form-group mfa-button">',
								'<button type="button" class="btn btn-outline-info fn-code-request">인증코드 발급</button>',
							'</div>',
						'</div>',
						'<div class="form-group mx-1 my-3">',
							'<div class="feedback-message invalid-feedback"></div>',
							'<div class="feedback-message valid-feedback"></div>',
						'</div>',
					'</div>',
					'<div class="modal-footer">',
						'<button type="button" class="btn btn-primary fn-code-confirm mx-0">코드 확인</button>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
}

});