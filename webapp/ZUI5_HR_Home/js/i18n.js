function Internationalization(_gateway) {

	this._gateway = _gateway;
	_gateway.homeI18n(this);

	this.i18n = {
		home: {
			text: {},
			button: {}
		}
	};

	this.init();

	this._gateway.addLocaleChangeCallbackOwner(this);
}

$.extend(Internationalization.prototype, {

init: function() {

	this.set('home.text.hialimee', {
		KO: '열린도움방',
		EN: 'Hi Alimee',
		ZH: 'Hi Alimee'
	});
	this.set('home.text.portlets.personalization', {
		KO: '설정',
		EN: 'Portlets',
		ZH: 'Portlets'
	});
	this.set('home.text.portlets.calendar.vacation', {
		KO: '휴가',
		EN: 'Vacation',
		ZH: 'Vacation'
	});
	this.set('home.text.portlets.calendar.education', {
		KO: '교육',
		EN: 'Education',
		ZH: 'Education'
	});
	this.set('home.text.portlets.calendar.biztrip', {
		KO: '출장',
		EN: 'Trip',
		ZH: 'Trip'
	});
	this.set('home.text.portlets.calendar.telecommuting', {
		KO: '재택근무',
		EN: 'Telecommuting',
		ZH: 'Telecommuting'
	});
	this.set('home.text.portlets.calendar.birthday', {
		KO: '생일',
		EN: 'Birthday',
		ZH: 'Birthday'
	});
},

set: function(code, textMap) {

	var i18n = this.i18n;
	$.map(code.split(/\./), function(v) {
		if (i18n[v]) {
			i18n = i18n[v];
		} else {
			i18n = i18n[v] = {};
		}
	});

	i18n.KO = textMap.KO;
	i18n.EN = textMap.EN;
	i18n.ZH = textMap.ZH;
},

get: function(code, args) {

	if (!code) {
		return code;
	}

	var i18n = this.i18n;
	$.map(code.split(/\./), function(v) {
		i18n = i18n[v];
		if (!i18n) {
			throw new Error('');
		}
	});

	i18n = i18n[this._gateway.loginInfo('Langu') || 'KO'];

	if (args && args.legnth) {
		$.map(args, function(v) {
			i18n = i18n.interpolate(v);
		});
	}
	return i18n;
},

changeLocale: function() {

	setTimeout(function() {
		$('#text-hi-alimee').text(this.get('home.text.hialimee'));
	}.bind(this), 0);
	setTimeout(function() {
		$('#text-portlet-personalization').text(this.get('home.text.portlets.personalization'));
	}.bind(this), 0);
}

});