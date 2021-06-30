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
	if (this.mobile()) {
		return [
			'<div class="card portlet portlet-1h portlet-employee" data-key="${key}"${link}>'.interpolate(this.key(), this.link()),
				'<div class="d-flex">',
					'<div class="employee-photo${nobody}">'.interpolate(photoNotAvailable ? ' nobody': ''),
						'<img src="${src}" />'.interpolate(photoNotAvailable ? 'images/photoNotAvailable.gif' : photo),
						'<svg viewBox="0 0 64 96">',
							'<path stroke="#064975" stroke-width=".5" fill="#064975" d="M0 0H64H15Q0 0 0 15V96Z" />',
							'<path stroke="#064975" stroke-width=".5" fill="#064975" d="M64 100V0V81Q64 96 49 96H0Z" />',
						'</svg>',
					'</div>',
					'<div class="employee-information">',
						'<div data-ename class="employee-name">${ename}</div>'.interpolate(loginInfo.Ename),
						'<div data-stext>${stext}</div>'.interpolate(loginInfo.Stext),
						'<div data-pernr>${pernr}</div>'.interpolate(pernr.join(' / ')),
					'</div>',
				'</div>',
				'<div class="portlet-spinner-background">',
					'<div class="spinner portlet-spinner"></div>',
				'</div>',
			'</div>'
		].join('');
	} else {
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
						'<div id="cdays" class="cdays"></div>',
						'<h6 data-stext>${stext}</h6>'.interpolate(loginInfo.Stext),
						'<div id="odays" class="odays"></div>',
					'</div>',
				'</div>',
				'<div class="employee-photo${nobody}">'.interpolate(photoNotAvailable ? ' nobody': ''),
					'<img src="${src}" />'.interpolate(photoNotAvailable ? 'images/photoNotAvailable.gif' : photo),
					'<svg viewBox="0 0 64 96">',
						'<path stroke="#064975" stroke-width=".5" fill="#064975" d="M0 0H64H15Q0 0 0 15V96Z" />',
						'<path stroke="#cccccc" stroke-width=".5" fill="#ffffff" d="M64 96V0V81Q64 96 49 96H0Z" />',
					'</svg>',
				'</div>',
				'<div class="portlet-spinner-background">',
					'<div class="spinner portlet-spinner"></div>',
				'</div>',
			'</div>'
		].join('');
	}
},
fill: function() {

	var url = 'ZHR_COMMON_SRV/MainContentsSet',
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

	if (this.mobile()) {
		this.spinner(false);
		return new Promise(function(v) { v(); });
	}

	return new Promise(function(resolve, reject) {
		this._gateway.getModel('ZHR_COMMON_SRV').create('/MainContentsSet', {
			IMode: 'R',
			IConType: '1',
			IPernr: this._gateway.pernr(),
			ILangu: loginInfo.Langu,
			TableIn1: []
		}, {
			async: true,
			success: function(result) {
				this._gateway.prepareLog('EmployeePortlet.fill ${} success'.interpolate(url), arguments).log();

				var TableIn1 = result.TableIn1.results[0] || {},
					CdaysYy = String.toNumber(TableIn1.CdaysYy), CdaysMm = String.toNumber(TableIn1.CdaysMm), CdaysDd = String.toNumber(TableIn1.CdaysDd),
					OddaysYy = String.toNumber(TableIn1.OddaysYy), OddaysMm = String.toNumber(TableIn1.OddaysMm), OddaysDd = String.toNumber(TableIn1.OddaysDd);

				this.$()
					.find('#cdays').html([
						CdaysYy === 0 ? '' : '<span class="d-day">${CdaysYy}</span><span>년</span>'.interpolate(CdaysYy),
						CdaysMm === 0 ? '' : '<span class="d-day">${CdaysMm}</span><span>개월</span>'.interpolate(CdaysMm),
						CdaysDd === 0 ? '' : '<span class="d-day">${CdaysDd}</span><span>일</span>'.interpolate(CdaysDd)
					].join('')).end()
					.find('#odays').html([
						OddaysYy === 0 ? '' : '<span class="d-day">${OddaysYy}</span><span>년</span>'.interpolate(OddaysYy),
						OddaysMm === 0 ? '' : '<span class="d-day">${OddaysMm}</span><span>개월</span>'.interpolate(OddaysMm),
						OddaysDd === 0 ? '' : '<span class="d-day">${OddaysDd}</span><span>일</span>'.interpolate(OddaysDd)
					].join(''));

				this.spinner(false);

				resolve({ data: result });
			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EmployeePortlet.fill ' + url);

				this.spinner(false);

				reject(jqXHR);
			}.bind(this)
		});
	}.bind(this));
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
}

});