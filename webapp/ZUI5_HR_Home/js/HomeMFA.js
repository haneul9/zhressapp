function HomeMFA(_gateway) {

	this._gateway = _gateway;
	this.timeoutMinutes = 5;
	this.timerCheckWaitTime = this.timeoutMinutes * 60 * 1000 - 2000;
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

	return Promise.all([
		this.isTargetIP(),		// MFA 대상 IP인지 확인
		this.isTargetPernr()	// MFA 대상 사번인지 확인
	])
	.then(function() {
		if (this._gateway.parameter('dlswmddlvlfdygkqslek') === 'true') {
			this.confirm();
		} else {
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

isTargetIP: function() {

	return $.getJSON({
		url: '/essproxy/check2FA',
		success: function(data) {
			this.targetIP = (data || {}).result === 'E';

			this._gateway.prepareLog('HomeMFA.isTargetIP success : ' + this.targetIP, arguments).log();
		}.bind(this)
	}).promise();
},

isTargetPernr: function() {

	var url = 'ZHR_COMMON_SRV/TwoFactorAuthCheckSet';

	return $.getJSON({
		url: this._gateway.s4hanaURL(url),
		data: {
			$filter: "Percod eq '${Percod}' and Device eq '${Device}'".interpolate(sessionStorage.getItem('ehr.odata.user.percod'), this._gateway.isMobile() ? 'M' : '')
		},
		success: function(data) {
			this.targetPernr = this._gateway.odataResults(data).Authyn === 'Y';

			this._gateway.prepareLog('HomeMFA.isTargetPernr success : ' + this.targetPernr, arguments).log();
		}.bind(this)
	}).promise();
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
		this.showMessage('.valid-feedback', '인증코드 발급요청을 하였습니다. 잠시 후 이메일을 확인하시기 바랍니다.');
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

		var url = 'ZHR_COMMON_SRV/TwoFactorAuthNumberSet';

		this._gateway.post({
			url: url,
			data: {
				Ttype: type,
				Cernm: code,
				Percod: sessionStorage.getItem('ehr.odata.user.percod')
			},
			success: function() {
				this._gateway.prepareLog('HomeMFA.requestCode success', arguments).log();

				this.setStatus(this.STATUS.DONE, type);
				if (type === this.CODE.CONFIRM) {
					this.done();
				}
			}.bind(this),
			error: function(jqXHR) {
				var errorMessage = this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HomeMFA.requestCode').message;

				this.showMessage('.invalid-feedback', errorMessage);
				this.setStatus(this.STATUS.ERROR, type);
			}.bind(this)
		});
	}.bind(this), 0);
},

showMessage: function(selector, message) {

	var target = $('.feedback-message' + selector);
	if (message) {
		target.text(message);
	}
	target.show().siblings().hide();
},

hideMessage: function() {

	$('.feedback-message').hide();
},

setStatus: function(status, type) {

	var INIT = status === this.STATUS.INIT,
	WAIT = status === this.STATUS.WAIT,
	DONE = status === this.STATUS.DONE,
	ERROR = status === this.STATUS.ERROR;

	if (type === this.CODE.REQUEST) {
		$('#code-mfa').prop('disabled', !DONE);
		$('.fn-code-request').prop('disabled', WAIT);
		$('.fn-code-confirm').prop('disabled', !DONE);

	} else if (type === this.CODE.CONFIRM) {
		$('#code-mfa').prop('disabled', !ERROR);
		$('.fn-code-request').prop('disabled', !ERROR);
		$('.fn-code-confirm').prop('disabled', !ERROR);

	} else {
		$('#code-mfa').prop('disabled', INIT);
		$('.fn-code-request').prop('disabled', !INIT);
		$('.fn-code-confirm').prop('disabled', INIT);

	}
},

done: function() {

	setTimeout(function() {
		$('#ehr-mfa-modal').modal('hide');
	}, 0);

	this.callback();
},

ui: function() {

	return [
		'<div class="modal fade" style="display:none" aria-hidden="true" data-backdrop="static" tabindex="-1" role="dialog" id="ehr-mfa-modal">',
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