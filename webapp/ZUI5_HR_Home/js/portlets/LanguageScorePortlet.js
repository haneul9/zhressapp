/* global AbstractPortlet moment */
function LanguageScorePortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-languagescore-list';
}

LanguageScorePortlet.prototype = Object.create(AbstractPortlet.prototype);
LanguageScorePortlet.prototype.constructor = LanguageScorePortlet;

$.extend(LanguageScorePortlet.prototype, {

ui: function() {

	var cardHeader = this.hideTitle() ? '' : [
		'<div class="card-header">',
			'<h6>${title}</h6>'.interpolate(this.title()),
			'<div>',
				this.dismissButton(),
				this.link(true),
			'</div>',
		'</div>'
	].join('');

	return [
		'<div class="card portlet portlet-${size}h portlet-languagescore" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group" id="portlet-languagescore-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	this._gateway.setModel('ZHR_PERS_INFO_SRV');

	return new Promise(function (resolve, reject) {
		var url = 'ZHR_PERS_INFO_SRV/LanguScoreSet';

		this._gateway.getModel('ZHR_PERS_INFO_SRV').create('/LanguScoreSet', {
			IPernr: this._gateway.pernr(),
			IDatum: moment().hours(9).toDate(),
			IBukrs: this._gateway.loginInfo('Bukrs2'),
			IMolga: this._gateway.loginInfo('Molga'),
			ILangu: '3',
			TableIn: []
		}, {
			async: true,
			success: function(result) {
				this._gateway.prepareLog('LanguageScore.fill ${url} success'.interpolate(url), arguments).log();

				var list = this.$(),
					TableIn = result.TableIn.results;

				if (!TableIn.length) {
					if (list.data('jsp')) {
						list.find('.list-group-item').remove().end()
							.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item data-not-found">어학성적 데이터가 없습니다.</a>');
					} else {
						list.html('<a href="#" class="list-group-item data-not-found">어학성적 데이터가 없습니다.</a>');
					}

					this.spinner(false);

					return;
				}

				list.append([
					'<div class="table-header">',
						'<div style="width:55%;">',
							"어종/평가구분",
						'</div>',
						'<div style="width: 30%;">',
							"만료예정일",
						'</div>',
						'<div style="width: 15%;">',
							"성적",
						'</div>',
					'</div>',
					'<div class="languageTable" class="table-body"></div>'
				].join(''));

				if (list.data('jsp')) {
					list = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
				}

				// MSS 권한 -> MSS 링크로 변경
				try {
					if(window._menu.ownMenuDataMap && window._menu.ownMenuDataMap['1720']) {
						this.url(window._menu.menuDataMap['1720'].url);
						this.mid('1720');

						this.$().parent().parent().find('.card-header :button').eq(1)
							.attr('data-url', this.url())
							.attr('data-menu-id', this.mid());
					}
				} catch(e) {
					// skip
				}

				TableIn.filter(function(elem) {
					return moment(elem.Endda).isAfter(moment());
				})
				.sort(function(a, b) {
					return moment(b.Endda) - moment(a.Endda);
				})
				.forEach(function(e) {
					var date = moment(e.Endda).format(this._gateway.loginInfo('Dtfmt').toUpperCase());

					$('.languageTable').append([
						'<div class="table-body">',
							'<div style="width: 55%;">',
								e.ZlanguTxt + ' ' + e.ZltypeTxt,
							'</div>',
							'<div style="width: 30%;">',
								date,
							'</div>',
							'<div style="width: 15%;">',
								e.Acqpot,
							'</div>',
						'</div>'
					].join(''));
				}.bind(this));

				this.spinner(false);

				resolve({ data: result });
			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'LanguageScore.fill ' + url);

				this.spinner(false);

				reject(jqXHR);
			}.bind(this)
		});
	}.bind(this));
},
onceAfter: function() {

	var list = this.$();
	if (!list.data('jsp') && this.scrollable()) {
		list.jScrollPane({
			resizeSensor: true,
			verticalGutter: 0,
			horizontalGutter: 0
		});
	}
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
},
clearResource: function() {

	return new Promise(function(resolve) {
		setTimeout(function() {
			this.$().data('jsp').destroy();
			resolve();
		}.bind(this), 0);
	}.bind(this));
}

});