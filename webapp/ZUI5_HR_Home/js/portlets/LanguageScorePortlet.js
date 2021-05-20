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

	var url = 'ZHR_PERS_INFO_SRV/LanguScoreSet';

	return this._gateway.post({
		url: url,
		data: {
			IPernr: this._gateway.pernr(),
			IDatum: Date.toODataString(true),
			IBukrs: this._gateway.loginInfo('Bukrs2'),
			IMolga: this._gateway.loginInfo('Molga'),
			ILangu: "3",
			TableIn: []
		},
		success: function(data) {
			this._gateway.prepareLog('LanguageScore.fill ${url} success'.interpolate(url), arguments).log();

			var list = this.$(),
				TableIn = this._gateway.odataResults(data).TableIn;

			if (!TableIn.length) {
				if (list.data('jsp')) {
					list.find('.list-group-item').remove().end()
						.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action data-not-found">어학성적 데이터가 없습니다.</a>');
				} else {
					list.html('<a href="#" class="list-group-item list-group-item-action data-not-found">어학성적 데이터가 없습니다.</a>');
				}
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
			if(window._menu.ownMenuDataMap["1720"]) {
				this.url(window._menu.ownMenuDataMap["1720"]);
				this.mid("1720");

				this.$().parent().parent().find('.card-header :button').eq(1)
					.attr('data-url', this.url())
					.attr('data-menu-id', this.mid());
			}

			TableIn.filter(function(elem) {
				return moment(Number((elem.Endda || '0').replace(/\/Date\((\d+)\)\//, '$1'))).isAfter(moment());
			})
			.sort(function(a, b) {
				return moment(Number((b.Endda || '0').replace(/\/Date\((\d+)\)\//, '$1'))) - moment(Number((a.Endda || '0').replace(/\/Date\((\d+)\)\//, '$1')));
			})
			.forEach(function(e) {
				var date = moment(Number((e.Endda || '0').replace(/\/Date\((\d+)\)\//, '$1'))).format(this._gateway.loginInfo('Dtfmt').toUpperCase());

                $('.languageTable').append([
					'<div class="table-body">',
						'<div style="width: 55%;">',
							e.ZlanguTxt + " " + e.ZltypeTxt,
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
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'LanguageScore.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
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