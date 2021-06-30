/* global AbstractPortlet */
function FavoriteMenuPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-favorite-menu-list';
	this.items = null;
}

FavoriteMenuPortlet.prototype = Object.create(AbstractPortlet.prototype);
FavoriteMenuPortlet.prototype.constructor = FavoriteMenuPortlet;

$.extend(FavoriteMenuPortlet.prototype, {

ui: function() {

	var cardHeader = this.hideTitle() ? '' : [
		'<div class="card-header">',
			'<h6>${title}</h6>'.interpolate(this.title()),
			'<div>',
				this.dismissButton(),
			'</div>',
		'</div>'
	].join('');

	return [
		'<div class="card portlet portlet-${size}h portlet-favorite-menu" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group" id="portlet-favorite-menu-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
onceBefore: function() {

	setTimeout(function() {
		var linkSpan = '.portlet-favorite-menu span[data-menu-id]';
		$(document)
			.off('click', linkSpan) // Home logo click시 다시 생성되므로 off 시켜줌
			.on('click', linkSpan, function(e) {
				this._gateway.redirect(this._gateway.menuUrl($(e.currentTarget).data('menuId')));
			}.bind(this));
	}.bind(this), 0);
},
fill: function() {

	var url = 'ZHR_COMMON_SRV/MainContentsSet';

	return new Promise(function(resolve, reject) {
		this._gateway.getModel('ZHR_COMMON_SRV').create('/MainContentsSet', {
			IMode: 'R',
			IConType: '4',
			IPernr: this._gateway.pernr(),
			ILangu: this._gateway.loginInfo('Langu'),
			TableIn4: []
		}, {
			async: true,
			success: function(result) {
				this._gateway.prepareLog('FavoriteMenuPortlet.fill ${url} success'.interpolate(url), arguments).log();

				this.items = result.TableIn4.results;

				var list = this.$(), jspPane; // 메뉴 즐겨찾기 추가/제거를 반복하다보면 scroll이 없어졌다가 다시 생성되어야하는 시점에 생성되지 않는 버그가 있어 따로 jspPane 변수를 사용함
				if (!this.items.length) {
					if (list.data('jsp')) {
						list.find('.list-group-item').remove().end()
							.data('jsp').getContentPane().prepend('<span class="list-group-item data-not-found">즐겨찾는 메뉴가 없습니다.</span>');
					} else {
						list.html('<span class="list-group-item data-not-found">즐겨찾는 메뉴가 없습니다.</span>');
					}

					this.spinner(false);

					return;
				}

				if (list.data('jsp')) {
					jspPane = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
				}

				if (this._gateway.isMobile()) {
					this.items = this.items.splice(0, 8);
				}

				(jspPane || list).prepend($.map(this.items, function(o) {
					return [
						'<span class="list-group-item list-group-item-action"${data-url}>'.interpolate(this.itemUrl(o)),
							'<div title="${title}">'.interpolate(o.Mname), o.Mname, '</div>',
						'</span>'
					].join('');
				}.bind(this)).join(''));

				if (list.data('jsp')) {
					list.data('jsp').reinitialise();
				}

				this.spinner(false);

				resolve({ data: result });
			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'FavoriteMenuPortlet.fill ' + url);

				this.spinner(false);

				reject(jqXHR);
			}.bind(this)
		});
	}.bind(this));
},
onceAfter: function() {

	var list = this.$();
	if (!list.data('jsp') && !this._gateway.isMobile()) {
		list.jScrollPane({
			resizeSensor: true,
			verticalGutter: 0,
			horizontalGutter: 0
		});
	}
},
update: function() {

	this.changeLocale();
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
},
itemUrl: function(o) {

	return ' data-menu-id="${menu-id}"'.interpolate(o.Menid);
},
clearResource: function() {

	return new Promise(function(resolve) {
		setTimeout(function() {
			$(document).off('click', '.portlet-favorite-menu span[data-menu-id]');
			this.$().data('jsp').destroy();
			resolve();
		}.bind(this), 0);
	}.bind(this));
}

});