function Internationalization(_gateway) {

	this._gateway = _gateway;
	_gateway.homeI18n(this);

	this.i18n = {
		home: {
			text: {
				"hi-alimee": {
					"KO": "열린도움방",
					"EN": "Hi Alimee",
					"ZH": "Hi Alimee"
				},
				"portlet-personalization": {
					"KO": "설정",
					"EN": "Portlets",
					"ZH": "Portlets"
				}
			},
			button: {

			}
		}
	};

	this._gateway.addLocaleChangeCallbackOwner(this);
}

$.extend(Internationalization.prototype, {

get: function(code, args) {

	if (!code) {
		return code;
	}

	var splitted = code.split(/\./), result = this.i18n;
	$.map(splitted, function(v) {
		result = result[v];
		if (!result) {
			throw new Error('');
		}
	});

	result = result[this._gateway.loginInfo('Langu') || 'KO'];

	if (args && args.legnth) {
		$.map(args, function(v) {
			result = result.interpolate(v);
		});
	}
	return result;
},

changeLocale: function() {

	setTimeout(function() {
		$('#text-hi-alimee').text(this.get('home.text.hi-alimee'));
	}, 0);
	setTimeout(function() {
		$('#text-portlet-personalization').text(this.get('home.text.portlet-personalization'));
	}, 0);
}

});