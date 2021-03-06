/* global AbstractPortlet moment */
function HiTalkTalkPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-hitalktalk-list';
}

HiTalkTalkPortlet.prototype = Object.create(AbstractPortlet.prototype);
HiTalkTalkPortlet.prototype.constructor = HiTalkTalkPortlet;

$.extend(HiTalkTalkPortlet.prototype, {

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
		'<div class="card portlet portlet-${size}h portlet-bbs portlet-hitalktalk" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group" id="portlet-hitalktalk-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	var url = 'ZHR_COMMON_SRV/MainContentsSet';

	return new Promise(function(resolve, reject) {
		this._gateway.getModel('ZHR_COMMON_SRV').create('/MainContentsSet', {
			IMode: 'R',
			IConType: '6',
			IPernr: this._gateway.pernr(),
			ILangu: this._gateway.loginInfo('Langu'),
			TableIn6: []
		}, {
			async: true,
			success: function(result) {
				this._gateway.prepareLog('HiTalkTalkPortlet.fill ${url} success'.interpolate(url), arguments).log();

				var list = this.$(),
				TableIn6 = result.TableIn6.results;
				if (!TableIn6.length) {
					if (list.data('jsp')) {
						list.find('.list-group-item').remove().end()
							.data('jsp').getContentPane().prepend('<span class="list-group-item data-not-found">게시글이 없습니다.</span>');
					} else {
						list.html('<span class="list-group-item data-not-found">게시글이 없습니다.</span>');
					}

					this.spinner(false);

					return;
				}

				if (list.data('jsp')) {
					list = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
				}

				if (this.mobile()) {
					TableIn6 = TableIn6.splice(0, 8);
				}

				list.prepend($.map(TableIn6, function(o) {
					var date = moment(o.Sdate).format(this._gateway.loginInfo('Dtfmt').toUpperCase());
					o.DtfmtDate = date;
					o.Snotes = o.Snotes.replace(/(<([^>]+)>)/ig,"").replace(/&nbsp;/g, "");

					return [
						'<span class="list-group-item list-group-item-action"${url}>'.interpolate(this.itemUrl(o)),
							'<div class="portlet-bbs-item">',
								'<div class="portlet-bbs-title w-100">',
									'<span class="portlet-bbs-title-text" title="${Snotes}">${Stitle}</span>'.interpolate(o.Snotes.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), o.Stitle),
								'</div>',
								'<small class="portlet-bbs-date w-100">${date}</small>'.interpolate(date),
							'</div>',
						'</span>'
					].join('');
				}.bind(this)).join(''));

				this.spinner(false);

				resolve({ data: result });
			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'HiTalkTalkPortlet.fill ' + url);

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
itemUrl: function(o) {

	if (this.mobile()) {
		return [
			' data-url="${url}?Sdate=${DtfmtDate}&Skey=${Skey}"'.interpolate(this.url(), o.DtfmtDate, o.Skey),
			' data-menu-id="${menu-id}"'.interpolate(this.mid())
		].join('');
	} else {
		return [
			' data-popup-menu-url="${url}?Sdate=${DtfmtDate}&Skey=${Skey}"'.interpolate(this.url(), o.DtfmtDate, o.Skey),
			' data-menu-id="${menu-id}"'.interpolate(this.mid())
		].join('');
	}
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