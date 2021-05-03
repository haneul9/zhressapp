/* global FavoriteMenuPortlet */
function MenuMegaDropdown(_gateway, parentSelector) {

	this.parentSelector = parentSelector;
	this.menuIframeName = 'content-iframe';
	this.menuIframeSelector = 'iframe[name="${content-iframe}"]'.interpolate(this.menuIframeName);
	this.menuFormName = 'menu-form';
	this.menuFavorites = null;
	this.menuUrlMap = null;
	this.menuDataMap = null;

	this._gateway = _gateway;
	_gateway.homeMenu(this);

	this.init();
}

$.extend(MenuMegaDropdown.prototype, {

init: function() {

	this.ul = '<ul class="navbar-nav flex-wrap">${li-list}</ul>';
	this.items = null;
	this.templates = {
		topMenuItem: [
			'<li class="nav-item text-nowrap${has-mega-menu}${style-classes}">',
				'<a class="nav-link" href="${href}"${url}${menu-id}>${title}</a>',
				'${mega-menu-layer}',
			'</li>'
		].join(''),
		megaMenuLayer: [
			'<div class="dropdown-menu mega-menu" role="menu">',
				'<div class="row col-10 mx-auto px-0 col-count-${count} ehr-snb">',
					'${sub-menu-blocks}',
				'</div>',
			'</div>'
		].join(''),
		subMenuBlock: [
			'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">',
				'<div class="col-mega-menu">',
					'<a class="nav-link" href="${href}"${url}${menu-id}>${title}</a>',
					'${menu-items}',
				'</div>',
			'</div>'
		].join(''),
		menuItems: [
			'<ul class="list-unstyled">',
				'${menu-items}',
			'</ul>'
		].join(''),
		menuItem: '<li><i class="${favorite-icon-class} fa-star"></i> <a href="${href}"${url}${menu-id}>${title}</a></li>'
	};

	this._gateway.addLocaleChangeCallbackOwner(this);
},

spinner: function(on) {

	setTimeout(function() {
		$('.ehr-header .menu-spinner-wrapper,.ehr-body .menu-spinner-wrapper').toggleClass('d-none', !on);
	}, 0);
},

handleMissingMenuId: function(message, hidden) {

	message = typeof message === 'function' ? '메뉴 ID 누락\nMissing menu ID.' : (message || '알 수 없는 오류가 발생하였습니다.');
	hidden = hidden || (typeof message === 'function' ? message : null);

	this._gateway.restorePreviousMenu();
	this._gateway.alert({ title: '오류', html: ['<p>', '</p>'].join(message), hidden: hidden });
	this.spinner(false);
},

handleUnauthorized: function(message, hidden) {

	message = typeof message === 'function' ? '접근 권한이 없습니다.' : (message || '알 수 없는 오류가 발생하였습니다.');
	hidden = hidden || (typeof message === 'function' ? message : null);

	this._gateway.restorePreviousMenu();
	this._gateway.alert({ title: '오류', html: ['<p>', '</p>'].join(message), hidden: hidden });
	this.spinner(false);
},

handleAuthCancel: function(message, hidden) {

	message = typeof message === 'function' ? '비밀번호 입력이 취소되었습니다.' : (message || '알 수 없는 오류가 발생하였습니다.');
	hidden = hidden || (typeof message === 'function' ? message : null);

	this._gateway.restorePreviousMenu();
	this._gateway.alert({ title: '알림', html: ['<p>', '</p>'].join(message), hidden: hidden });
	this.spinner(false);
},

redirect: function(menuUrl) {

	var menuId = this.menuUrlMap[menuUrl];
	if (!menuId) {
		this._gateway.alert({ title: '오류', html: ['<p>', '</p>'].join('해당 메뉴의 ID를 찾을 수 없어 이동할 수 없습니다.') });
		return;
	}
	$(this.parentSelector + ' a[data-menu-id="${menu-id}"]'.interpolate(menuId)).click();
},

changeState: function(toggle, restore) {

	setTimeout(function() {
		if (restore) {
			$(this.parentSelector + ' .active').toggleClass('active', false);
			$('.ehr-body').toggleClass('menu-loaded', false);

			var menuIframe = $(this.menuIframeSelector);
			if (menuIframe.length) {
				menuIframe.hide(0, function() {
					$(this).remove();
				});
			}
		}
		if (toggle) {
			this.toggleMenu(restore);
		}
	}.bind(this), 0);

	this.spinner(false);
},

changeLocale: function() {

	setTimeout(function() {
		$('.ehr-header .menu-spinner-wrapper').toggleClass('d-none', false);
	}, 0);
	setTimeout(function() {
		var parentSelector = this.parentSelector;
		this.generate(true).then(function() {
			setTimeout(function() {
				$(parentSelector + ' a[data-menu-id="${menu-id}"]'.interpolate($('form#${menu-form} input[name="mid"]'.interpolate(this.menuFormName)).val()))
					.toggleClass('active', true) // 선택된 메뉴 표시
					.parents('.mega-menu').toggleClass('d-block', false) // mega dropdown 닫기
					.parents('li.nav-item').toggleClass('active', true); // 선택된 대메뉴 표시
			}, 0);
		});
	}.bind(this), 0);

	var menuIframe = $(this.menuIframeSelector);
	if (menuIframe.length) {
		try {
			menuIframe[0].contentWindow.sap.ui.getCore().getConfiguration().setLanguage(this._gateway.loginInfo('Langu'));
		} catch(e) {
			this._gateway.log(e);
		}
		$('form#' + this.menuFormName).submit();
	}
},

toggleMenu: function(show) {

	$('.header-toggle-up')[show ? 'show' : 'hide'](0);
	$('.header-toggle-down')[show ? 'hide' : 'show'](0);
	$(this.parentSelector)[show ? 'slideDown' : 'slideUp'](200, function() {
		$(window).resize(); // .ehr-body resizing --> scrollbar resizing
	});
},

setupFavorites: function() {

	$(document).on('click', this.parentSelector + ' .fa-star', function(e) {
		var t = $(e.currentTarget),
		toBeFavorite = t.hasClass('far'),
		menuAnchor = t.siblings('a[data-menu-id]');

		if (toBeFavorite && this.menuFavorites.length >= 10) {
			this._gateway.alert({ title: '안내', html: '<p>최대 10개까지만 등록 가능합니다.<br />등록된 항목을 해제하고 재선택 하시기 바랍니다</p>' });
			return;
		}

		t.toggleClass('far', !toBeFavorite).toggleClass('fas', toBeFavorite);

		if (!menuAnchor.length) {
			return;
		}

		var menuId = menuAnchor.data('menuId');
		if (!menuId) {
			return;
		}

		menuId = String(menuId);

		if (toBeFavorite) {
			this.menuFavorites.push(menuId);
		} else {
			var index = $.inArray(menuId, this.menuFavorites);
			if (index > -1) {
				this.menuFavorites.splice(index, 1);
			}
		}

		this.saveFavorites(menuId, toBeFavorite);
	}.bind(this));
},

saveFavorites: function(menuId, toBeFavorite) {

	var url = 'ZHR_COMMON_SRV/MenuFavoriteSet',
	menu = this.menuDataMap[menuId];

	return this._gateway.post({
		url: url,
		data: {
			IPernr: this._gateway.pernr(),
			IMnid1: menu.Mnid1,
			IMnid2: menu.Mnid2,
			IMnid3: menu.Mnid3,
			IMenid: menuId,
			IFavor: toBeFavorite ? 'X' : '',
			ILangu: this._gateway.loginInfo('Langu'),
			Export: []
		},
		success: function() {
			this._gateway.prepareLog('MenuMegaDropdown.saveFavorites ${url} success'.interpolate(url), arguments).log();

			this._gateway.updatePortlet(FavoriteMenuPortlet);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'MenuMegaDropdown.saveFavorites ' + url);

			$(this.parentSelector + ' a[data-menu-id="${menu-id}"]'.interpolate(menuId)).siblings('i').toggleClass('far', toBeFavorite).toggleClass('fas', !toBeFavorite);
		}.bind(this)
	});
},

currentMid: function() {

	return $('form#${menu-form} input[name="mid"]'.interpolate(this.menuFormName)).val();
},

currentUrl: function() {

	return $('form#${menu-form}'.interpolate(this.menuFormName)).attr('action');
},

mid: function(url) {

	return this.menuUrlMap[url] || '';
},

menuUrl: function(menuId) {

	return (this.menuDataMap[menuId] || {}).url || '';
},

menuParam: function() {

	var args = [].slice.call(arguments);
	if (!args.length) {
		return '';
	}

	var paramMap = {};
	$.map(args, function(o) {
		var map = {};
		if ((typeof o === 'string' || o instanceof String) && o.indexOf('?') > -1) { // URL에서 queryString을 분리하여 parameter map 생성
			$.map(o.replace(/[^?]*\?/, '').split(/&/), function(v) {
				var pair = v.split(/=/);
				map[pair[0]] = decodeURIComponent(pair[1]);
			});
		} else if ($.isPlainObject(o)) {
			map = o;
		}
		$.extend(true, paramMap, map);
	});

	return paramMap;
},

goToLink: function(menuId, url) {

	var menuIframe = $(this.menuIframeSelector);
	if (!menuIframe.length) {
		var container = $('.ehr-body .container-fluid');
		if (container.data('jsp')) {
			container.data('jsp').destroy(); // destroy 후에는 container 변수의 jQuery function들이 제대로 동작하지 않으므로 새로 객체를 만들어야함
		}
		$('.ehr-body .container-fluid').append('<iframe name="${content-iframe}"></iframe>'.interpolate(this.menuIframeName));
	}

	var form = $('form#' + this.menuFormName);
	if (!form.length) {
		form = $('<form id="${menu-form}" method="GET" target="${content-iframe}"><input type="hidden" name="mid" /></form>'.interpolate(this.menuFormName, this.menuIframeName)).appendTo('body');
	}

	if (!this._gateway.isPRD()) {
		var pernr = this._gateway.parameter('pernr');
		if (pernr) {
			if (!form.find('input[name="pernr"]').val(pernr).length) {
				$('<input type="hidden" name="pernr" value="${pernr}" />'.interpolate(pernr)).appendTo(form);
			}
		}
		var s4hana = this._gateway.parameter('s4hana');
		if (s4hana) {
			if (!form.find('input[name="s4hana"]').val(s4hana).length) {
				$('<input type="hidden" name="s4hana" value="${s4hana}" />'.interpolate(s4hana)).appendTo(form);
			}
		}
	}
	if (/\?/.test(url)) {
		var splitted = url.split('?');
		url = splitted.shift();

		splitted.push('');
		$.map(this._gateway.parameterMap(splitted.join('?')), function(value, name) {
			if (name === 'hc_orionpath') {
				return;
			}
			if (!form.find('input[name="${name}"]'.interpolate(name)).val(value).length) {
				$('<input type="hidden" name="${name}" value="${value}" />'.interpolate(name, value)).appendTo(form);
			}
		});
	}

	form.find('input[name="mid"]').val(menuId).end()
		.attr('action', url).submit();
},

handleUrl: function(e) {
	e.stopImmediatePropagation();

	var anchor = $(e.currentTarget), url = anchor.data('url'), menuId = anchor.data('menuId') || this.menuUrlMap[url];
	if (!menuId) {
		this._gateway.log('메뉴 ID가 없습니다 : ' + anchor.text());
		return;
	}

	this.spinner(true);

	if (this.menuDataMap[menuId].isPopup) {
		this.spinner(false);

		if (/^http/.test(url)) {
			this._gateway.openWindow({
				url: url,
				name: url.replace(/[^a-zA-Z0-9]/g, '')
			});
		} else {
			var params = {
				popup: url,
				mid: menuId
			};
			if (!this._gateway.isPRD()) {
				params.pernr = this._gateway.parameter('pernr');
			}
			this._gateway.openWindow({
				url: 'index.html?' + $.param(params),
				name: url.replace(/[^a-zA-Z0-9]/g, '')
			});
		}

		setTimeout(function() {
			anchor.parents('.mega-menu').toggleClass('d-block', false); // mega dropdown 닫기
		}, 0);

	} else {
		this.goToLink(menuId, url);

		setTimeout(function() {
			$(this.parentSelector + ' .active').toggleClass('active', false);
			$('.ehr-body').toggleClass('menu-loaded', true);

			anchor.toggleClass('active', true) // 선택된 메뉴 표시
				.parents('.mega-menu').toggleClass('d-block', false) // mega dropdown 닫기
				.parents('li.nav-item').toggleClass('active', true); // 선택된 대메뉴 표시
		}.bind(this), 0);

	}
},

urlData: function(url) {

	if (!url) {
		return {
			getScript: function() {
				return 'javascript:;';
			},
			getUrl: function() {
				return '';
			}
		};
	}
	if (/^javascript/.test(url)) {
		return {
			getScript: function() {
				return url;
			},
			getUrl: function() {
				return '';
			}
		};
	}
	if (this._gateway.isLOCAL()) {
		return {
			getScript: function() {
				return 'javascript:;';
			},
			getUrl: function() {
				if (/^http/.test(url)) {
					return ' data-url="' + url + '"';
				} else {
					return ' data-url="/webapp/' + url.replace(/^\//, '') + (/\?/.test(url) ? '&' : '?') + 'hc_orionpath=%2FDI_webide_di_workspaceiwil0nuxhaqnmtpv%2Fzhressapp"';
				}
			}
		};
	} else {
		return {
			getScript: function() {
				return 'javascript:;';
			},
			getUrl: function() {
				return ' data-url="' + url.replace(/^\//, '') + '"';
			}
		};
	}
},

menuData: function() {

	return $.extend(true, {}, this.items);
},

// Top menu item에 대한 html 생성
topMenuItem: function(top) {

	var layer = this.megaMenuLayer(top), urlData = this.urlData(top.url);
	return this.templates.topMenuItem
		.replace(/\$\{href\}/, urlData.getScript())
		.replace(/\$\{url\}/, urlData.getUrl())
		.replace(/\$\{menu-id\}/, !top.menuId ? '' : ' data-menu-id="${menu-id}"'.replace(/\$\{menu-id\}/, top.menuId))
		.replace(/\$\{title\}/, top.title)
		.replace(/\$\{has-mega-menu\}/, layer ? ' has-mega-menu' : '')
		.replace(/\$\{style-classes\}/, top.styleClasses ? top.styleClasses : '')
		.replace(/\$\{mega-menu-layer\}/, layer);
},

// Top menu item의 하위 menu들에 대한 mega-dropdown layer html 생성
megaMenuLayer: function(top) {

	if (!top.children || !top.children.length) {
		return '';
	}

	return this.templates.megaMenuLayer
		.replace(/\$\{count\}/, top.children.length)
		.replace(/\$\{sub-menu-blocks\}/, this.getSubMenuBlocks(top.children));
},

// Mega-dropdown layer 내의 하위 menu block들의 html 생성
getSubMenuBlocks: function(subList) {

	return $.map(subList, function(sub) {
		var urlData = this.urlData(sub.url);
		return this.templates.subMenuBlock
			.replace(/\$\{href\}/, urlData.getScript())
			.replace(/\$\{url\}/, urlData.getUrl())
			.replace(/\$\{menu-id\}/, !sub.menuId ? '' : ' data-menu-id="${menu-id}"'.replace(/\$\{menu-id\}/, sub.menuId))
			.replace(/\$\{title\}/, sub.title)
			.replace(/\$\{menu-items\}/, this.getMenuItems(sub.children));
	}.bind(this)).join('');
},

// Menu block 내의 menu item list html 생성
getMenuItems: function(menuList) {

	if (!menuList || !menuList.length) {
		return '';
	}

	var menuItems = $.map(menuList, function(menu) {
		var urlData = this.urlData(menu.url);
		return this.templates.menuItem
			.replace(/\$\{favorite-icon-class\}/, $.inArray(menu.menuId, this.menuFavorites) > -1 ? 'fas' : 'far')
			.replace(/\$\{href\}/, urlData.getScript())
			.replace(/\$\{url\}/, urlData.getUrl())
			.replace(/\$\{menu-id\}/, !menu.menuId ? '' : ' data-menu-id="${menu-id}"'.replace(/\$\{menu-id\}/, menu.menuId))
			.replace(/\$\{title\}/, menu.title);
	}.bind(this)).join('');

	return this.templates.menuItems
		.replace(/\$\{menu-items\}/, menuItems);
},

getMenuTree: function(data) {

	var results = this._gateway.odataResults(data),
	level1SubMenuMap = {},
	level2SubMenuMap = {},
	menuUrlMap = this.menuUrlMap = {},
	menuDataMap = this.menuDataMap = {},
	menuFavorites = this.menuFavorites = [];

	$.map(results.TableIn4, function(o) {
		menuUrlMap[o.Meurl] = o.Menid;
		menuDataMap[o.Menid] = {
			menuId: o.Menid,
			// title: o.Mentx,
			url: o.Meurl
		};
	});
	$.map(results.TableIn3, function(o) { // Level 2 메뉴의 하위 메뉴 목록 생성
		if (o.Hide === 'X') {
			return;
		}
		if (o.Favor === 'X') {
			menuFavorites.push(o.Menid);
		}
		if (o.Mepop === 'X') {
			(menuDataMap[o.Menid] || {}).isPopup = true;
		}
		var menu = menuDataMap[o.Menid] || {};
		menu.title = o.Mnnm3;
		menu.Mnid1 = o.Mnid1;
		menu.Mnid2 = o.Mnid2;
		menu.Mnid3 = o.Mnid3;

		if (level2SubMenuMap[o.Mnid2]) {
			level2SubMenuMap[o.Mnid2].push(menu);
		} else {
			level2SubMenuMap[o.Mnid2] = [menu];
		}
	});
	$.map(results.TableIn2, function(o) { // Level 1 메뉴의 하위 메뉴 목록 생성
		if (o.Hide === 'X') {
			return;
		}
		if (o.Favor === 'X') {
			menuFavorites.push(o.Menid);
		}
		if (o.Mepop === 'X') {
			(menuDataMap[o.Menid] || {}).isPopup = true;
		}
		var menu = {
			menuId: o.Menid,
			Mnid2: o.Mnid2,
			title: o.Mnnm2,
			url: !o.Menid ? '' : menuDataMap[o.Menid].url,
			children: level2SubMenuMap[o.Mnid2]
		};
		if (level1SubMenuMap[o.Mnid1]) {
			level1SubMenuMap[o.Mnid1].push(menu);
		} else {
			level1SubMenuMap[o.Mnid1] = [menu];
		}
	});

	return $.map(results.TableIn1, function(o) {
		if (o.Hide === 'X') {
			return;
		}
		if (o.Favor === 'X') {
			menuFavorites.push(o.Menid);
		}
		if (o.Mepop === 'X') {
			(menuDataMap[o.Menid] || {}).isPopup = true;
		}
		return {
			menuId: o.Menid,
			Mnid1: o.Mnid1,
			title: o.Mnnm1,
			url: !o.Menid ? '' : menuDataMap[o.Menid].url,
			children: level1SubMenuMap[o.Mnid1],
			styleClasses: o.Mnid1 === '10000' ? ' menu-mss' : (o.Mnid1 === '20000' ? ' menu-hass' : '')
		};
	});
},

generate: function(reload) {

	var url = 'ZHR_COMMON_SRV/GetMnlvSet',
	loginInfo = this._gateway.loginInfo();

	return this._gateway.post({
		// url: 'ZUI5_HR_Home/menu.json',
		url: url,
		data: {
			IPernr: this._gateway.pernr(),
			IBukrs: loginInfo.Bukrs,
			ILangu: loginInfo.Langu,
			IDevice: '',
			TableIn1: [],
			TableIn2: [],
			TableIn3: [],
			TableIn4: []
		},
		success: function(data) {
			this._gateway.prepareLog('MenuMegaDropdown.generate ${url} success'.interpolate(url), arguments).log();

			this.items = this.getMenuTree(data);

			if (!this.items.length) {
				this.items = [{ title: '조회된 메뉴 목록이 없습니다.' }];
			}

			$(this.parentSelector).html(
				this.ul.replace(/\$\{[^{}]*\}/, $.map(this.items, function(top) {
					return this.topMenuItem(top);
				}.bind(this)).join(''))
			);

			if (reload) {
				return;
			}

			$(document).on('click', this.parentSelector + ' .dropdown-menu', function(e) {
				e.stopImmediatePropagation();
			});
			$(document).on('click', this.parentSelector + ' a[data-url]', this.handleUrl.bind(this));
			$(document).on('mouseover', this.parentSelector + ' .has-mega-menu', function(e) {
				var li = $(e.currentTarget), offsetTop = li.offset().top - li.parent().offset().top;
				li.find('.mega-menu')
					.toggleClass('d-block', true)
					.css({
						top: (offsetTop + li.height()) + 'px',
						maxHeight: 'calc(100vh - ' + $('.ehr-header').height() + 'px - 1rem)'
					});
			});
			$(document).on('mouseout', this.parentSelector + ' .has-mega-menu', function(e) {
				$(e.currentTarget).find('.mega-menu').toggleClass('d-block', false);
			});
		}.bind(this),
		error: function(jqXHR) {
			var message = this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'MenuMegaDropdown.generate ' + url).message;

			this.items = [{ title: '조회된 메뉴 목록이 없습니다.' }];
			$(this.parentSelector).html(
				this.ul.replace(/\$\{[^{}]*\}/, $.map(this.items, function(top) {
					return this.topMenuItem(top);
				}.bind(this)).join(''))
			);

			this._gateway.alert({ title: '오류', html: [
				'<p>메뉴를 조회하지 못했습니다.',
				'화면을 새로고침 해주세요.<br />',
				'같은 문제가 반복될 경우 HR 시스템 담당자에게 문의하세요.',
				'시스템 오류 메세지 : ' + message,
				'</p>'
			].join('<br />') });
		}.bind(this),
		complete: function() {
			setTimeout(function() {
				$('.ehr-header .menu-spinner-wrapper').toggleClass('d-none', true);
			}, 0);
		}
	});
}

});