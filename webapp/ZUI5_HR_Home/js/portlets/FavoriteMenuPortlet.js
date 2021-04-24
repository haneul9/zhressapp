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

	var anchor = '[data-key="${key}"].portlet a[data-menu-id]'.interpolate(this.key());
	$(document)
		.off('click', anchor)
		.on('click', anchor, function(e) {
			this._gateway.redirect(this._gateway.menuUrl($(e.currentTarget).data('menuId')));
		}.bind(this));

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
		$(document).on('click', '[data-key="${key}"].portlet a[data-menu-id]'.interpolate(this.key()), function(e) {
			this._gateway.redirect(this._gateway.menuUrl($(e.currentTarget).data('menuId')));
		}.bind(this));
	}.bind(this), 0);
},
fill: function() {

	var url = 'ZHR_COMMON_SRV/MainContentsSet';

	return this._gateway.post({
		url: url,
		data: {
			IMode: 'R',
			IConType: '4',
			IPernr: this._gateway.pernr(),
			ILangu: this._gateway.loginInfo('Langu'),
			TableIn4: []
		},
		success: function(data) {
			this._gateway.prepareLog('FavoriteMenuPortlet.fill ${url} success'.interpolate(url), arguments).log();

			this.items = this._gateway.odataResults(data).TableIn4;

			var list = this.$(), jspPane; // 메뉴 즐겨찾기 추가/제거를 반복하다보면 scroll이 없어졌다가 다시 생성되어야하는 시점에 생성되지 않는 버그가 있어 따로 jspPane 변수를 사용함
			if (!this.items.length) {
				if (list.data('jsp')) {
					list.find('.list-group-item').remove().end()
						.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action text-center">즐겨찾는 메뉴가 없습니다.</a>');
				} else {
					list.html('<a href="#" class="list-group-item list-group-item-action text-center">즐겨찾는 메뉴가 없습니다.</a>');
				}
				return;
			}

			if (list.data('jsp')) {
				jspPane = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
			}

			(jspPane || list).prepend($.map(this.items, function(o) {
				return [
					'<a href="#" class="list-group-item list-group-item-action"${data-url}>'.interpolate(this.itemUrl(o)),
						'<div title="${title}">'.interpolate(o.Mname), o.Mname, '</div>',
					'</a>'
				].join('');
			}.bind(this)).join(''));

			if (list.data('jsp')) {
				list.data('jsp').reinitialise();
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'FavoriteMenuPortlet.fill ' + url);
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

	this.$().height(this.cardBody().height() + 'px'); // iPhone jScrollPane 버그 수정
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
			$(document).off('click', '[data-key="${key}"].portlet a[data-menu-id]'.interpolate(this.key()));
			this.$().data('jsp').destroy();
			resolve();
		}.bind(this), 0);
	}.bind(this));
}

});