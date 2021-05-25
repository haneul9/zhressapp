function HomeBasis(_gateway) {

	this.ODataDestination = { SF: 'SF', S4HANA: 'S4HANA', ETC: 'ETC' };
	this.paramMap = this.parameterMap(location.search);
	this.metadataMap = {};

	this._gateway = _gateway;
	_gateway.homeBasis(this);

	this.init();
	this.readyModal();
}

$.extend(HomeBasis.prototype, {

init: function() {

	var ua = navigator.userAgent.toLowerCase(),
	isIE = /(msie) ([\w.]+)/.test(ua),
	isIE11 = /(trident)\/[\w.]+;.*rv:([\w.]+)/.test(ua);

	if (isIE) {
		$('html').attr('data-sap-ui-browser', 'ie');
	}
	if (isIE11) {
		$('html').attr('data-sap-ui-browser', 'ie11');
	}

	$.extend(String, {
		interpolate: function() {
			var args = [].slice.call(arguments), template = args.shift() || '';
			$.each(args, function(i, v) {
				template = template.replace(/\$\{[^{}]*\}/, v);
			});
			return template;
		},
		escapeHtml: function(s) {
			return (s || '').replace(/\<([^<>]*)\>/g, '');
		},
		capitalize: function(v) {
			if (!v) {
				return '';
			}
			return v.charAt(0).toUpperCase() + v.slice(1);
		},
		/**
		 * @param t target
		 * @param l length
		 * @param c character
		 * @param b force
		 */
		lpad: function(t, l, c, b) {
			t = $.trim(t);
			return (t || b) ? (t.length >= l ? t.substr(0, l) : String.lpad(c + t, l, c, b)) : '';
		},
		toCurrency: function(v) {
			if (!v) {
				return '0';
			}
			var s = String(v).replace(/[^+-\d.eE]/g, '');
			if (isNaN(s)) {
				return '0';
			}
			return String(Number(s)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		},
		toNumber: function(v) {
			if (!v) {
				return 0;
			}
			var s = String(v).replace(/[^+-\d.eE]/g, '');
			if (isNaN(s)) {
				return 0;
			}
			return Number(s);
		}
	});

	$.extend(String.prototype, {
		interpolate: function() {
			var args = [].slice.call(arguments), template = this;
			$.each(args, function(i, v) {
				template = template.replace(/\$\{[^{}]*\}/, v);
			});
			return template;
		},
		escapeHtml: function() {
			return String.escapeHtml(this);
		},
		capitalize: function() {
			return String.capitalize(this);
		},
		/**
		 * @param l length
		 * @param c character
		 * @param b force
		 */
		lpad: function(l, c, b) {
			return String.lpad(this, l, c, b);
		},
		toCurrency: function() {
			return String.toCurrency(this);
		},
		toNumber: function() {
			return String.toNumber(this);
		}
	});

	$.extend(Number, {
		fromODataDate: function(v) {
			return !v ? new Date(0).getTime() : Number(v.replace(/\D/g, ''));
		}
	});

	$.extend(Date, {
		toODataString: function(v, utcTime) {
			if (typeof v === 'undefined' || v === null || typeof v === 'boolean') {
				utcTime = typeof utcTime === 'boolean' ? utcTime : (typeof v === 'boolean' ? v : false);
				var now = new Date();
				return '/Date(${time})/'.interpolate(now.getTime() - (utcTime === true ? (now.getTimezoneOffset() * 60 * 1000) : 0));
			}
			if (v instanceof Date) {
				return '/Date(${time})/'.interpolate(v.getTime() - (utcTime === true ? (v.getTimezoneOffset() * 60 * 1000) : 0));
			}
			if (typeof v === 'number') {
				v = v - (utcTime === true ? (new Date().getTimezoneOffset() * 60 * 1000) : 0);
				if (new Date(0).getTime() <= v && v < new Date(10000, 0, 1, 0, 0, 0).getTime()) {
					return '/Date(${time})/'.interpolate(v);
				}
			}
			if (typeof v === 'string' || v instanceof String) {
				v = $.trim(v).replace(/\D/g, '');
				if (v.length >= 8) {
					return moment(v, 'YYYYMMDD').toDate().toODataString(utcTime);
				}
			}
			return null;
		},
		fromODataString: function(v) {
			return !v ? null : new Date(v.toNumber());
		}
	});
	$.extend(Date.prototype, {
		toODataString: function(utcTime) {
			return Date.toODataString(this, utcTime);
		}
	});
},
log: function() {

	var args = arguments;
	setTimeout(function() {
		if (typeof window.console !== 'undefined' && typeof window.console.log === 'function') {
			window.console.log.apply(null, [].slice.call(args));
		}
	}, 0);
},
prepareLog: function() {

	var data = [];
	$.map([].slice.call(arguments) || [], function(v) {
		if (v && v.toString() === '[object Arguments]') {
			data.concat([].slice.call(v));
		} else if (typeof v === 'function') {
			data.push(this.functionName(v));
		} else {
			data.push(v);
		}
	}.bind(this));
	return {
		log: function() {
			this.log.apply(null, data);
		}.bind(this)
	};
},
parameterMap: function(locationSearch) {

	var paramMap = {};
	$.map(locationSearch.replace(/\?/, '').split(/&/), function(v) {
		var pair = v.split(/=/);
		paramMap[pair[0]] = decodeURIComponent(pair[1]);
	});
	return paramMap;
},
parameter: function(key) {

	return this.paramMap[key];
},
mix: function(o) {

	var mid;
	if (typeof this._gateway.currentMid === 'function') {
		mid = this._gateway.currentMid();
	}
	return $.extend(o, {
		ICusrid: sessionStorage.getItem('ehr.odata.user.percod'),	// 암호화 로그인 사번
		ICusrse: sessionStorage.getItem('ehr.session.token'),		// Token
		ICusrpn: sessionStorage.getItem('ehr.sf-user.name'),		// 로그인 사번
		ICmenuid: mid || ''											// 메뉴 ID
	});
},
s4hanaURL: function(modelAndEntityName) {

	return this.s4hanaDestination() + (modelAndEntityName || '').replace(/^\//, '');
},
s4hanaDestination: function() {

	var destination = sessionStorage.getItem('ehr.odata.destination'); // HomeSession.init 에서 최초 세팅
	if (destination) {
		return destination;
	}

	if (this.isPRD()) {
		return '/s4hana/sap/opu/odata/sap/';
	}

	return ((this.parameter("s4hana") === 'legacy') ? '/s4hana' : '/s4hana-pjt') + '/sap/opu/odata/sap/';
},
getSubaccountTechnicalName: function() {

	return /^webide/i.test(location.host) ? 'webide' : ((location.host.split('.').shift() || '').split('-').pop() || '');
},
getOperationMode: function() {

	return window._basis.isPRD() ? 'PRD' : (window._basis.isQAS() ? 'QAS' : 'DEV');
},
isLOCAL: function() {

	return window._basis.getSubaccountTechnicalName() === 'webide';
},
isDEV: function() {

	return window._basis.getSubaccountTechnicalName() === 'g110bc197';
},
isQAS: function() {

	return window._basis.getSubaccountTechnicalName() === 'ziwz5jxar7';
},
isPRD: function() {

	return window._basis.getSubaccountTechnicalName() === 'yzdueo754l';
},
readyModal: function() {

	$([	'<div class="modal fade" style="display:none" aria-hidden="true" data-backdrop="static" tabindex="-1" role="dialog" id="ehr-alert-modal">',
			'<div class="modal-dialog" role="document">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<h4 class="modal-title"></h4>',
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
					'</div>',
					'<div class="modal-body"></div>',
					'<div class="modal-footer">',
						'<button type="button" class="btn btn-primary fn-confirm" data-dismiss="modal">확인</button>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('')).appendTo('body');

	$([	'<div class="modal fade" style="display:none" aria-hidden="true" data-backdrop="static" tabindex="-1" role="dialog" id="ehr-confirm-modal">',
			'<div class="modal-dialog" role="document">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<h4 class="modal-title"></h4>',
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
					'</div>',
					'<div class="modal-body"></div>',
					'<div class="modal-footer">',
						'<button type="button" class="btn btn-primary fn-confirm" data-dismiss="modal">확인</button>',
						'<button type="button" class="btn btn-light fn-cancel" data-dismiss="modal">취소</button>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('')).appendTo('body');
},
alert: function(options) {

	if (typeof options === 'string' || options instanceof String) {
		$('#ehr-alert-modal').modal(options);
		return;
	}

	var modal = $('#ehr-alert-modal')
		.off('show.bs.modal')
		.off('shown.bs.modal')
		.off('hide.bs.modal')
		.off('hidden.bs.modal')
		.find('.modal-title').text(options.title || '알림').end()
		.find('.modal-body').html(options.html).end()
		.find('.fn-confirm').off('click').end();

	if (options.show) {
		modal.on('show.bs.modal', options.show);
	}
	if (options.shown) {
		modal.on('shown.bs.modal', options.shown);
	} else {
		modal.on('shown.bs.modal', function() {
			$(this).find('.fn-confirm').focus();
		});
	}
	if (options.hide) {
		modal.on('hide.bs.modal', options.hide);
	}
	if (options.hidden) {
		modal.on('hidden.bs.modal', options.hidden);
	} else {
		modal.on('hidden.bs.modal', function() {
			$(this)
				.find('.modal-title').text('').end()
				.find('.modal-body').html('');
		});
	}
	if (options.confirm) {
		modal.find('.fn-confirm').on('click', options.confirm);
	}

	modal.modal('show');
},
confirm: function(options) {

	if (typeof options === 'string' || options instanceof String) {
		$('#ehr-confirm-modal').modal(options);
		return;
	}

	var modal = $('#ehr-confirm-modal')
		.off('show.bs.modal')
		.off('shown.bs.modal')
		.off('hide.bs.modal')
		.off('hidden.bs.modal')
		.find('button.close').show().end()
		.find('.modal-title').text(options.title || '알림').end()
		.find('.modal-body').html(options.html).end()
		.find('.fn-confirm').off('click').end()
		.find('.fn-cancel').off('click').end();

	if (options.show) {
		modal.on('show.bs.modal', options.show);
	}
	if (options.shown) {
		modal.on('shown.bs.modal', options.shown);
	} else {
		modal.on('shown.bs.modal', function() {
			$(this).find('.fn-confirm').focus();
		});
	}
	if (options.hide) {
		modal.on('hide.bs.modal', options.hide);
	}
	if (options.hidden) {
		modal.on('hidden.bs.modal', options.hidden);
	} else {
		modal.on('hidden.bs.modal', function() {
			$(this)
				.find('.modal-title').text('').end()
				.find('.modal-body').html('');
		});
	}
	if (options.confirm) {
		modal.find('.fn-confirm').on('click', options.confirm);
	}
	if (options.cancel) {
		modal
			.find('button.close').hide().end()
			.find('.fn-cancel').on('click', options.cancel);
	}

	modal.modal('show');
},
openPopup: function(o) {

	o = o || {};

	if (!o.url) {
		this.alert({ title: '오류', html: '<p>팝업 대상 URL이 없습니다.</p>' });
		return;
	}

	var w = o.width || 600,
	h = o.height || 300,
	popup = window.open(o.url, o.name || ('popup-' + new Date().getTime()), [
		'width=' + w,
		'height=' + h,
		'top=' + ((screen.availTop || 0) + (screen.availHeight / 2 - (h / 2))),
		'left=' + ((screen.availLeft || 0) + (screen.availWidth / 2 - (w / 2))),
		'menubar=0',
		'resizable=1',
		'scrollbars=1',
		'status=0',
		'titlebar=1',
		'toolbar=0'
	].join(','));

	if (!popup) {
		this.alert({ title: '오류', html: '<p>팝업 차단 기능이 실행되고 있습니다.<br />차단 해제 후 다시 실행해주세요.</p>' });
	} else {
		setTimeout(function() {
			popup.focus();
		}, 500);
	}
},
openWindow: function(o) {

	o = o || {};

	if (!o.url) {
		this.alert({ title: '오류', html: '<p>팝업 대상 URL이 없습니다.</p>' });
		return;
	}

	var popup = window.open(o.url, o.name || ('window-' + new Date().getTime()));
	if (!popup) {
		this.alert({ title: '오류', html: '<p>팝업 차단 기능이 실행되고 있습니다.<br />차단 해제 후 다시 실행해주세요.</p>' });
	} else {
		setTimeout(function() {
			popup.focus();
		}, 500);
	}
},
post: function(o) {

	o = o || {};

	if (!o.url) {
		this.alert({ title: '오류', html: '<p>대상 서비스 model 및 entity type이 명시된 URL이 없습니다.</p>' });
		return;
	}

	var async = typeof o.async !== 'undefined' ? o.async : true;
	if (async) {
		return this.postOptions(o)
			.then(function(postOptions) {
				return $.post(postOptions).promise();
			});
	} else {
		return $.post(this.postOptions(o)).promise();
	}
},
postOptions: function(o) {

	var async = typeof o.async !== 'undefined' ? o.async : true,
	namespace = (o.url || '').split('/')[0],
	headers = o.headers ? o.headers : {},
	postOptions = {
		async: async,
		url: this.s4hanaURL(o.url),
		dataType: 'json',
		contentType: 'application/json',
		headers: headers
	};

	if (o.success) {
		postOptions.success = o.success;
	}
	if (o.error) {
		postOptions.error = o.error;
	}
	if (o.complete) {
		postOptions.complete = o.complete;
	}

	if (o.data) {
		o.data = this.mix(o.data); // sync

		if (async) {
			return Promise.all([
				this.copyFields(o),
				this.odataCsrfToken(headers, namespace)
			])
			.then(function(results) {
				postOptions.data = JSON.stringify(results[0]);

				return postOptions;
			});
		} else {
			postOptions.data = JSON.stringify(this.copyFields(o));

			this.odataCsrfToken(headers, namespace, false);

			return postOptions;
		}
	} else {
		postOptions.data = JSON.stringify(this.mix({}));

		if (async) {
			return this.odataCsrfToken(headers, namespace)
				.then(function() {
					return postOptions;
				});
		} else {
			this.odataCsrfToken(headers, namespace, false);

			return postOptions;
		}
	}
},
copyFields: function(o) {

	var url = o.url.split('/'),
	async = typeof o.async !== 'undefined' ? o.async : true;

	if (async) {
		return this.metadata(url[0], url[1], async)
			.then(function(fieldNames) {
				var data = {};
				$.map(fieldNames, function(name) {
					if (typeof o.data[name] !== 'undefined') {
						data[name] = o.data[name];
					}
				});
				return data;
			});
	} else {
		var data = {};
		$.map(this.metadata(url[0], url[1], async), function(name) {
			if (typeof o.data[name] !== 'undefined') {
				data[name] = o.data[name];
			}
		});
		return data;
	}
},
metadata: function(namespace, entityType, async) {

	entityType = entityType.replace(/\(.*|\W/g, "").replace(/Set$/, '');
	async = async !== 'undefined' ? async : true;

	var metadata = this.metadataMap[namespace],
	finder = 'EntityType[Name="${entityType}"] Property,EntityType[Name="${entityType}"] NavigationProperty'.interpolate(entityType, entityType);

	if (metadata) { // 이미 조회해둔 metadata가 있는 경우
		if (async) {
			return new Promise(function(resolve) {
				resolve($.map(metadata.find(finder), function(o) {
					return o.attributes.Name.nodeValue;
				}));
			});
		} else {
			return $.map(metadata.find(finder), function(o) {
				return o.attributes.Name.nodeValue;
			});
		}
	}

	// metadata 조회
	var url = this.s4hanaURL(namespace + '/$metadata');
	if (async) {
		return $.get({
			async: async,
			url: url,
			dataType: 'xml',
			success: function() {
				this.prepareLog('HomeBasis.metadata ${url} success'.interpolate(url), arguments).log();
			}.bind(this),
			error: function(jqXHR) {
				this.handleError(this.ODataDestination.S4HANA, jqXHR, 'HomeBasis.metadata ' + url);
			}.bind(this)
		}).then(function(data) {
			var metadata = $(data);

			this.metadataMap[namespace] = metadata;

			return $.map(metadata.find(finder), function(o) {
				return o.attributes.Name.nodeValue;
			});
		}.bind(this));

	} else {
		var fieldNames;
		$.get({ // metadata 조회
			async: false,
			url: url,
			dataType: 'xml',
			success: function(data) {
				this.prepareLog('HomeBasis.metadata ${url} success'.interpolate(url), arguments).log();

				this.metadataMap[namespace] = data;

				fieldNames = $.map(data.find(finder), function(o) {
					return o.attributes.Name.nodeValue;
				});
			}.bind(this),
			error: function(jqXHR) {
				this.handleError(this.ODataDestination.S4HANA, jqXHR, 'HomeBasis.metadata ' + url);
			}.bind(this)
		});

		return fieldNames || [];

	}
},
/*
S4HANA OData 호출을 위한 CSRF token 조회
ZHR_COMMON_SRV
*/
odataCsrfToken: function(o, namespace, async) {

	return $.getJSON({
		async: typeof async !== 'undefined' ? async : true,
		cache: false, // 매우 중요
		url: this.s4hanaURL(namespace),
		headers: {
			'x-csrf-token': 'Fetch'
		},
		success: function(data, textStatus, jqXHR) {
			this.prepareLog('HomeBasis.odataCsrfToken success', arguments).log();

			o['x-csrf-token'] = jqXHR.getResponseHeader('x-csrf-token');
		}.bind(this),
		error: function(jqXHR) {
			this.handleError(this.ODataDestination.S4HANA, jqXHR, 'HomeBasis.odataCsrfToken');

			o['x-csrf-token'] = '';
		}.bind(this)
	}).promise();
},
odataResults: function(data) {

	if (!data) {
		return {};
	}
	if (typeof data.d === 'undefined') {
		return {};
	}

	if (data.d.results instanceof Array) {
		return data.d.results[0] || {};
	} else {
		var results = {};
		$.map(data.d, function(o, k) {
			if ($.isPlainObject(o)) {
				results[k] = o.results || [];
			}
		});
		return results;
	}
},
handleError: function(destination, jqXHR, loggingName, showModal) {

	this.log((loggingName || '') + ' error', destination, jqXHR, showModal);

	var message, error = (jqXHR.responseJSON || {}).error || {};
	if (destination === this.ODataDestination.SF) {
		if (jqXHR.status === 403) {
			message = '요청 정보에 오류가 있습니다.';
			window._basis.log('HomeBasis.handleError error 403', message);

		} else if (jqXHR.status === 404) {
			message = (error.message || {}).value;
			if (error.code === 'NotFoundException') {
				var rgxp = /User with key \('(\d+)'\) not found!/;
				if (rgxp.test(message)) {
					message = this.isPRD()
						? 'Successfactors에 존재하지 않는 사번(' + message.replace(rgxp, '$1') + ')입니다.'
						: '테스트 시스템입니다.';
					window._basis.log('HomeBasis.handleError error 404', message);
				}
			} else {
				window._basis.log('HomeBasis.handleError error 404', message);
			}

		} else if (jqXHR.status === 503) {
			message = '재로그인이 필요합니다.';
			window._basis.log('HomeBasis.handleError error 503', message);

		} else {
			message = message || '알 수 없는 오류가 발생하였습니다.';
			window._basis.log('HomeBasis.handleError error ' + jqXHR.status, message);

		}

	} else if (destination === this.ODataDestination.S4HANA) {
		if (jqXHR.status === 403) {
			if ($.isEmptyObject(error)) {
				message = jqXHR.responseText;
			} else {
				message = (error.message || {}).value || jqXHR.responseText;
			}
			window._basis.log('HomeBasis.handleError error 403', message);

		} else {
			message = (error.message || {}).value;
			if (message === 'An exception was raised') {
				message = (((error.innererror || {}).errordetails || [])[0] || {}).message || message;
			}
		}

	} else {
		message = (error.message || {}).value || '알 수 없는 오류가 발생하였습니다.';
		if (error.code === 'NotFoundException') {
			var rgxp = /User with key \('(\d+)'\) not found!/;
			if (rgxp.test(message)) {
				message = this.isPRD()
					? 'Successfactors에 존재하지 않는 사번(' + message.replace(rgxp, '$1') + ')입니다.'
					: '테스트 시스템입니다.';
				window._basis.log('HomeBasis.handleError error 404', message);
			}
		} else {
			window._basis.log('HomeBasis.handleError error ' + jqXHR.status, message);
		}
	}

	if (showModal === true) {
		this.alert({ title: '오류', html: ['<p>', '</p>'].join(message || '알 수 없는 오류가 발생하였습니다.') });
	}

	return { message: message };
},
functionName: function(f) {

	if (f.name) {
		return f.name;
	} else {
		return f.toString().replace(/^\s*function\s*([^(]*)(.|\s)*/, '$1') || 'anonymous';
	}
}

});