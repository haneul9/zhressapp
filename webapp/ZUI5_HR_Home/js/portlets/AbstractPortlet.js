function AbstractPortlet(_gateway, o) {
/*
	Colno: '1',
	Seqno: '01',
	Htall: '2',
	Fixed: 'X',
	HideName: 'X',
	Zhide: 'X',
	Iconid: 'fas fa-user',
	LinkMenid1: '',
	LinkMenid2: '',
	LinkUrl1: 'FamilyApply.html',
	LinkUrl2: '',
	Mocat: '',
	Odataid: 'MainContents',
	Potid: 'P101',
	Potnm: '개인정보',
	TooltipTx: '개인정보_tooltip_Person Info'
*/
	this._gateway = _gateway;
	this._o = o;
	this._key = o.Potid;
	this._mobile = $('html').attr('device') === 'mobile';

	this.position(this._mobile ? Number(o.MSeq || 0) : Number(o.Colno || 0), Number(o.Seqno || 0))
		.size(Number(o.Htall || 1))
		.icon(o.Iconid || null)
		.title(o.Potnm || null)
		.tooltip(o.TooltipTx || null)
		.url(this._mobile ? (o.LinkUrl2 || null) : (o.LinkUrl1 || null))
		.mid(this._mobile ? (o.LinkMenid2 || null) : (o.LinkMenid1 || null))
		.use(o.Zhide !== 'X')
		.popup(o.Mepop === 'X')
		.carousel(o.Mocat === 'A')
		.switchable(o.Fixed !== 'X')
		.hideTitle(o.HideName === 'X');
}

$.extend(AbstractPortlet.prototype, {

key: function() {

	return this._key;
},
mobile: function() {

	return this._mobile;
},
position: function(column, row) {

	if (typeof column !== 'undefined' && typeof row !== 'undefined') {
		if (this._mobile) {
			this._position = Number(column || 0);
		} else {
			this._position = {
				column: Number(column || 0),
				row: Number(row || 0)
			};
		}
		return this;
	}
	return this._mobile ? this._position : $.extend(true, {}, this._position);
},
size: function(size) {

	if (typeof size !== 'undefined') {
		this._size = Number(size || 1);
		return this;
	}
	return this.carousel() ? this._size : (this.mobile() ? 0 : this._size);
},
icon: function(icon) {

	if (typeof icon !== 'undefined') {
		this._icon = icon || '';
		return this;
	}
	return this._icon;
},
title: function(title) {

	if (typeof title !== 'undefined') {
		this._title = title || '';
		return this;
	}
	return this._title;
},
tooltip: function(tooltip) {

	if (typeof tooltip !== 'undefined') {
		this._tooltip = !tooltip ? '' : ' title="${}"'.interpolate(tooltip);
		return this;
	}
	return this._tooltip;
},
url: function(url) {

	if (typeof url !== 'undefined') {
		this._url = url || '';
		return this;
	}
	return this._url;
},
mid: function(mid) {

	if (typeof mid !== 'undefined') {
		this._mid = mid || '';
		return this;
	}
	return this._mid; // || this._gateway.mid(this._url);
},
use: function(use) {

	if (typeof use !== 'undefined') {
		this._use = use || false;
		return this;
	}
	if (this._switchable === false) {
		return true;
	}
	return this._use;
},
popup: function(popup) {

	if (typeof popup !== 'undefined') {
		this._popup = popup || false;
		return this;
	}
	return this._popup;
},
carousel: function(carousel) {

	if (typeof carousel !== 'undefined') {
		this._carousel = carousel || false;
		return this;
	}
	return this._carousel;
},
switchable: function(switchable) {

	if (typeof switchable !== 'undefined') {
		this._switchable = !!switchable;
		if (this._switchable === false) {
			this.use(true);
		}
		return this;
	}
	return this._switchable;
},
hideTitle: function(hideTitle) {

	if (typeof hideTitle !== 'undefined') {
		this._hideTitle = hideTitle || false;
		return this;
	}
	return this._hideTitle;
},
scrollable: function() {

	return this.carousel() || !this.mobile();
},
column: function() {

	return this._position.column;
},
row: function() {

	return this._position.row;
},
// UI html 생성시 header의 link 버튼 또는 link 정보 html
link: function(button) {

	var attributes;
	if (this.popup()) {
		if (button) {
			attributes = [
				'<button type="button" data-popup-menu-url="${url}" data-menu-id="${menu-id}" aria-label="Link">'.interpolate(this.url(), this.mid()),
					'<span aria-hidden="true"><i class="fas fa-chevron-right" title="메뉴로 이동"></i></span>',
				'</button>'
			];
		} else {
			attributes = [
				' data-popup-menu-url="${url}"'.interpolate(this.url()),
				' data-menu-id="${menu-id}"'.interpolate(this.mid())
			]; // indexMobile.html에서 event function binding
		}
	} else {
		if (button) {
			attributes = [
				'<button type="button" data-url="${url}" data-menu-id="${menu-id}" aria-label="Link">'.interpolate(this.url(), this.mid()),
					'<span aria-hidden="true"><i class="fas fas fa-chevron-right" title="메뉴로 이동"></i></span>',
				'</button>'
			];
		} else {
			attributes = [
				' data-url="${url}"'.interpolate(this.url()),
				' data-menu-id="${menu-id}"'.interpolate(this.mid())
			];
		}
	}
	return attributes.join('');
},
// UI html 생성시 사용되는 header의 닫기 버튼 html
dismissButton: function() {

	return [
		'<button type="button" class="d-none" data-dismiss="portlet" aria-label="Close">',
			'<span aria-hidden="true" title="숨기기"><i class="fas fa-times"></i></span>',
		'</button>'
	].join('');
},
cardBody: function() {

	return $('[data-key="${key}"].portlet .card-body'.interpolate(this.key()));
},
// Portlet 단독 spinner
spinner: function(onoff) {

	if (typeof onoff === 'boolean') {
		setTimeout(function() {
			$('[data-key="${key}"].portlet .portlet-spinner-background'.interpolate(this.key()))[onoff ? 'show' : 'hide']();
		}.bind(this), 0);
	} else {
		return [
			'<div class="portlet-spinner-background">',
				'<div class="spinner portlet-spinner"></div>',
			'</div>'
		].join('');
	}
},
// parent의 첫번째 element로 추가
prependTo: function(parent, fill) {

	parent = (typeof parent === 'string' || parent instanceof String) ? $(parent) : parent;
	parent.prepend(this.ui());

	setTimeout(function() {
		if (typeof this.onceBefore === 'function') {
			this.onceBefore(); // UI에 event handler들을 bind 하는 function
		}
	}.bind(this), 0);

	setTimeout(function() {
		if (fill) {
			this.fill()
				.then(function() {
					if (typeof this.onceAfter === 'function') {
						this.onceAfter();
					}
				}.bind(this));
		}
	}.bind(this), 0);
},
// parent의 마지막 element로 추가
appendTo: function(parent, fill) {

	parent = (typeof parent === 'string' || parent instanceof String) ? $(parent) : parent;
	parent.append(this.mobile() && this.carousel() ? ['<div class="carousel-item">', this.ui(), '</div>'].join('') : this.ui());

	setTimeout(function() {
		if (typeof this.onceBefore === 'function') {
			this.onceBefore(); // UI에 event handler들을 bind 하는 function
		}
	}.bind(this), 0);

	setTimeout(function() {
		if (fill) {
			this.fill()
				.then(function() {
					if (typeof this.onceAfter === 'function') {
						this.onceAfter();
					}
				}.bind(this));
		}
	}.bind(this), 0);
},
// 주로 사용될 jQuery object를 반환하는 function
$: function(force) {

	force = typeof force !== 'undefined' ? force : false;

	if (this.$object && !force) {
		return this.$object;
	}
	if (typeof this.$selector === 'undefined') {
		throw new Error(this._gateway.functionName(this) + '에 $selector property를 선언해야 합니다.');
	}
	if (!this.$selector) {
		throw new Error(this._gateway.functionName(this) + '의 $selector property 값이 없습니다.');
	}
	return this.$object = $(this.$selector);
},
// UI 생성을 위해 html을 반환하는 function
ui: function() {

	throw new Error(this._gateway.functionName(this) + '에 ui function이 정의되지 않았습니다.');
},
// UI에 데이터를 채워넣는 function
fill: function() {

	throw new Error(this._gateway.functionName(this) + '에 fill function이 정의되지 않았습니다.');
},
// locale이 변경되었을 때 호출되는 function
changeLocale: function() {

	throw new Error(this._gateway.functionName(this) + '에 changeLocale function이 정의되지 않았습니다.');
},
// Portlet을 갱신할 필요가 있을 때 호출되는 function
update: function() {

	throw new Error(this._gateway.functionName(this) + '에 update function이 정의되지 않았습니다.');
},
backup: function(backup) {

	if (backup) {
		this._backup = {
			key: this.key(),
			column: this.column(),
			row: this.row(),
			use: this.use()
		};
	} else {
		this._backup = null;
	}
	return this;
},
restore: function() {

	var o = this._backup;
	if (o) {
		this.key(o.key);
		this.position(o.column, o.row);
		this.use(o.use);
		this.backup(false);
	}
	return this;
},
dto: function() {

	return {
		Potid: this.key(),
		PCol: String(this.column()),
		PSeq: String(this.row()),
		Zhide: this.use() ? '' : 'X'
	};
},
rendered: function() {

	return !!$('[data-key="${key}"].portlet'.interpolate(this.key())).length;
},
// Portlet이 제거될 때 호출되는 function
destroy: function() {

	var doneClear;
	if (typeof this.clearResource !== 'function') {
		this._gateway.log(this._gateway.functionName(this) + '에 clearResource function이 정의되지 않았습니다.');
	} else {
		doneClear = this.clearResource();
	}

	if (doneClear && (doneClear.promise === 'function' || doneClear instanceof Promise)) {
		doneClear.then(function() {
			setTimeout(function() {
				$('[data-key="${key}"].portlet'.interpolate(this.key())).remove();
				this.$object = null;
			}.bind(this), 0);
		}.bind(this));
	} else {
		setTimeout(function() {
			$('[data-key="${key}"].portlet'.interpolate(this.key())).remove();
			this.$object = null;
		}.bind(this), 0);
	}
}

});