/* global AbstractPortlet */
/* 개인정보 */
function EmployeePortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '[data-key="${key}"].portlet'.interpolate(this.key());
}

EmployeePortlet.prototype = Object.create(AbstractPortlet.prototype);
EmployeePortlet.prototype.constructor = EmployeePortlet;

$.extend(EmployeePortlet.prototype, {

ui: function() {

	var loginInfo = this._gateway.loginInfo(),
	pernr = [this._gateway.pernr()],
		photo = sessionStorage.getItem('ehr.sf-user.photo'),
	photoNotAvailable = !photo || /photoNotAvailable/.test(photo);

	if (loginInfo.PGradeTxt) {
		pernr.push(loginInfo.PGradeTxt);
	}
	if (loginInfo.ZtitleT) {
		pernr.push(loginInfo.ZtitleT);
	}

	return [
		'<div class="card portlet portlet-2h portlet-employee" data-key="${key}"${link}${tooltip}>'.interpolate(this.key(), this.link(), this.tooltip()),
			'<div class="d-flex flex-column">',
				'<div class="employee-information">',
					'<div data-ename class="employee-name">${ename}</div>'.interpolate(loginInfo.Ename),
					'<div data-stext>${stext}</div>'.interpolate(loginInfo.Stext),
					'<div data-pernr>${pernr}</div>'.interpolate(pernr.join(' / ')),
				'</div>',
				'<div class="employee-d-day">',
					'<div class="title">My D-Day</div>',
					'<h6 data-company>${company}</h6>'.interpolate((loginInfo.Langu === '3' || loginInfo.Langu === 'KO') ? '롯데케미칼' : 'LOTTE Chemical'),
					'<div>',
						'<span class="d-day color-lcc-signature-blue" id="cdays">0</span>',
						'<span class="color-lcc-signature-blue">days</span>',
					'</div>',
					'<h6 data-stext>${stext}</h6>'.interpolate(loginInfo.Stext),
					'<div>',
						'<span class="d-day color-lcc-signature-green" id="odays">0</span>',
						'<span class="color-lcc-signature-green">days</span>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="employee-photo${nobody}">'.interpolate(photoNotAvailable ? ' nobody': ''),
				'<img src="${src}" />'.interpolate(photoNotAvailable ? 'images/photoNotAvailable.gif' : photo),
				'<svg viewBox="0 0 64 64">',
					'<path stroke="#064975" stroke-width=".5" fill="#064975" d="M0 0 H64 V32 H63 Q63 28 60 25 L39 4 Q36 1 32 1 Q28 1 25 4 L4 25 Q1 28 1 32 H0 Z" />',
					'<path stroke="#cccccc" stroke-width=".5" fill="#ffffff" d="M0 64 H64 V32 H63 Q63 36 60 39 L39 60 Q36 63 32 63 Q28 63 25 60 L4 39 Q1 36 1 32 H0 Z" />',
				'</svg>',
			'</div>',
			'<div class="portlet-spinner-background">',
				'<div class="spinner portlet-spinner"></div>',
			'</div>',
		'</div>'
	].join('');
},
fill: function() {

	var url = this.odataUrl(), // ZHR_COMMON_SRV/MainContentsSet
	loginInfo = this._gateway.loginInfo();

	loginInfo = $.isEmptyObject(loginInfo) ? { Pernr: '20209999', Ename: '---', Stext: '---', PGradeTxt: '---', ZtitleT: '---', Langu: 'KO' } : loginInfo;

	setTimeout(function() {
		var pernr = [this._gateway.pernr()],
			photo = sessionStorage.getItem('ehr.sf-user.photo'),
		photoNotAvailable = !photo || /photoNotAvailable/.test(photo);

		if (loginInfo.PGradeTxt) {
			pernr.push(loginInfo.PGradeTxt);
		}
		if (loginInfo.ZtitleT) {
			pernr.push(loginInfo.ZtitleT);
		}

		this.$()
			.find('.employee-photo').toggleClass('nobody', photoNotAvailable).end()
			.find('img').attr('src', photoNotAvailable ? 'images/photoNotAvailable.gif' : photo).end()
			.find('[data-ename]').text(loginInfo.Ename).end()
			.find('[data-stext]').text(loginInfo.Stext).end()
			.find('[data-company]').text((loginInfo.Langu === '3' || loginInfo.Langu === 'KO') ? '롯데케미칼' : 'LOTTE Chemical').end()
			.find('[data-pernr]').text(pernr.join(' / '));
	}.bind(this), 0);

	return this._gateway.post({
		url: url, // ZHR_COMMON_SRV/MainContentsSet
		data: {
			IMode: 'R',
			IConType: '1',
			IPernr: this._gateway.pernr(),
			ILangu: loginInfo.Langu,
			TableIn1: []
		},
		success: function(data) {
			this._gateway.prepareLog('EmployeePortlet.fill ${} success'.interpolate(url), arguments).log();

			var TableIn1 = this._gateway.odataResults(data).TableIn1[0] || {};
			this.$()
				.find('#cdays').text(String.toCurrency(TableIn1.Cdays)).end()
				.find('#odays').text(String.toCurrency(TableIn1.Oddays));
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EmployeePortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
}

});