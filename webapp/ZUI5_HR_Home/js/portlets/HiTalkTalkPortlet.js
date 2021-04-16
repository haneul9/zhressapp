/* global AbstractPortlet moment */
function HiTalkTalkPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-hitalktalk-list';
}

HiTalkTalkPortlet.prototype = Object.create(AbstractPortlet.prototype);
HiTalkTalkPortlet.prototype.constructor = HiTalkTalkPortlet;

$.extend(HiTalkTalkPortlet.prototype, {

ui: function() {

	return [
		'<div class="card portlet portlet-${size}h portlet-bbs portlet-hitalktalk" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			'<div class="card-header">',
				'<h6>${title}</h6>'.interpolate(this.title()),
				'<div>',
					this.dismissButton(),
					this.link(true),
				'</div>',
			'</div>',
			'<div class="card-body">',
				'<div class="list-group" id="portlet-hitalktalk-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	var url = 'ZHR_COMMON_SRV/MainContentsSet';

	return this._gateway.post({
		url: url,
		data: {
			IMode: 'R',
			IConType: '6',
			IPernr: this._gateway.pernr(),
			ILangu: this._gateway.loginInfo('Langu'),
			TableIn6: []
		},
		success: function(data) {
			this._gateway.prepareLog('HiTalkTalkPortlet.fill ${url} success'.interpolate(url), arguments).log();

			var list = this.$(),
			TableIn6 = this._gateway.odataResults(data).TableIn6;
			if (!TableIn6.length) {
				if (list.data('jsp')) {
					list.find('.list-group-item').remove().end()
						.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action text-center">게시글이 없습니다.</a>');
				} else {
					list.html('<a href="#" class="list-group-item list-group-item-action text-center">게시글이 없습니다.</a>');
				}
				return;
			}

			if (list.data('jsp')) {
				list = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
			}

			list.prepend($.map(TableIn6, function(o) {
				var date = moment(Number((o.Sdate || '0').replace(/\/Date\((\d+)\)\//, '$1'))).format(this._gateway.loginInfo('Dtfmt').toUpperCase());
				return [
					'<a href="#" class="list-group-item list-group-item-action"${url}>'.interpolate(this.itemUrl(o)),
						'<div class="portlet-bbs-item">',
							'<div class="portlet-bbs-title">',
								'<span class="portlet-bbs-title-text" title="${Snotes}">${Stitle}</span>'.interpolate(o.Snotes, o.Stitle),
							'</div>',
							'<small class="portlet-bbs-date">${date}</small>'.interpolate(date),
						'</div>',
					'</a>'
				].join('');
			}.bind(this)).join(''));
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HiTalkTalkPortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
onceAfter: function() {

	var list = this.$();
	if (!list.data('jsp')) {
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
itemUrl: function(o) {

	return [
		' data-popup-menu-url="${url}?Sdate=${Sdate}&Skey=${Skey}"'.interpolate(this.url(), o.Sdate, o.Skey),
		' data-menu-id="${url}"'.interpolate(this.mid())
	].join('');
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