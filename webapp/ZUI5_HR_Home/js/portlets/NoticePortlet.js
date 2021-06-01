/* global AbstractPortlet moment */
function NoticePortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-notice-list';
}

NoticePortlet.prototype = Object.create(AbstractPortlet.prototype);
NoticePortlet.prototype.constructor = NoticePortlet;

$.extend(NoticePortlet.prototype, {

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
		'<div class="card portlet portlet-${size}h portlet-bbs portlet-notice" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group" id="portlet-notice-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	var url = 'ZHR_COMMON_SRV/MainContentsSet';

	return new Promise(function (resolve, reject) {
		var oModel = this._gateway.getModel("ZHR_COMMON_SRV");
		
		oModel.create("/MainContentsSet", {
			IMode: 'R',
			IConType: '2',
			IPernr: this._gateway.pernr(),
			ILangu: this._gateway.loginInfo('Langu'),
			TableIn2: []
		}, {
			async: true,
			success: function(result) {
				this._gateway.prepareLog('NoticePortlet.fill ${url} success'.interpolate(url), arguments).log();

				var list = this.$(),
				TableIn2 = result.TableIn2.results;
				if (!TableIn2.length) {
					if (list.data('jsp')) {
						list.find('.list-group-item').remove().end()
							.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action data-not-found">공지사항이 없습니다.</a>');
					} else {
						list.html('<a href="#" class="list-group-item list-group-item-action data-not-found">공지사항이 없습니다.</a>');
					}

					this.spinner(false);
					
					return;
				}

				if (list.data('jsp')) {
					list = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
				}

				if (this.mobile()) {
					TableIn2 = TableIn2.splice(0, 8);
				}

				list.prepend($.map(TableIn2, function(o) {
					var Dtfmt = this._gateway.loginInfo('Dtfmt').toUpperCase(),
					date = moment(Number((o.Edate || '').replace(/\D/g, ''))).format(Dtfmt);
					o.DtfmtDate = moment(Number((o.Sdate || '').replace(/\D/g, ''))).format(Dtfmt);

					return [
						'<a href="#" class="list-group-item list-group-item-action"${url}>'.interpolate(this.itemUrl(o)),
							'<div class="portlet-bbs-item">',
								'<div class="portlet-bbs-title">',
									'<span class="portlet-bbs-title-text" title="${title}">${title}</span>'.interpolate(o.Title, o.Title),
									o.Newitem === 'X' ? '<span class="badge badge-primary badge-pill">N</span>' : '',
									o.Impor === 'X' ? '<i class="fas fa-exclamation-circle"></i>' : '',
								'</div>',
								'<small class="portlet-bbs-date">${date}</small>'.interpolate(date),
							'</div>',
						'</a>'
					].join('');
				}.bind(this)).join(''));

				this.spinner(false);

				resolve({ data: result });
			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'NoticePortlet.fill ' + url);

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
			' data-url="${url}?Sdate=${DtfmtDate}&Seqnr=${Seqnr}"'.interpolate(this.url(), o.DtfmtDate, o.Seqnr),
			' data-menu-id="${menu-id}"'.interpolate(this.mid())
		].join('');
	} else {
		return [
			' data-popup-menu-url="${url}?Sdate=${DtfmtDate}&Seqnr=${Seqnr}"'.interpolate(this.url(), o.DtfmtDate, o.Seqnr),
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