function MenuHamburger(_gateway, parentSelector) {

	this.parentSelector = parentSelector;
	this.menuFavorites = null;
	this.menuUrlMap = null;
	this.menuDataMap = null;

	this._gateway = _gateway;
	_gateway.homeMenu(this);

	this.init();
}

$.extend(MenuHamburger.prototype, {

init: function() {

	this.ul = '<ul class="navbar-nav flex-wrap">${li-list}</ul>';
	this.items = null;

	this._gateway.addLocaleChangeCallbackOwner(this);
},

spinner: function(on) {

	setTimeout(function() {
		$('.ehr-body .menu-spinner-wrapper').toggleClass('d-none', !on);
	}, 0);
},

handleMissingMenuId: function(message) {

	this._gateway.restorePreviousMenu();
	this._gateway.alert({ title: '오류', html: ['<p>', '</p>'].join(message || '메뉴 ID 누락\nMissing menu ID.') });
	this.spinner(false);
},

handleUnauthorized: function(message) {

	this._gateway.restorePreviousMenu();
	this._gateway.alert({ title: '오류', html: ['<p>', '</p>'].join(message || '접근 권한이 없습니다.') });
	this.spinner(false);
},

handleAuthCancel: function(message) {

	this._gateway.restorePreviousMenu();
	this._gateway.alert({ title: '알림', html: ['<p>', '</p>'].join(message || '비밀번호 입력이 취소되었습니다.') });
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

			var iframe = $('iframe[name="content-iframe"]');
			if (iframe.length) {
				iframe.hide(0, function() {
					$(this).remove();
				});
			}
		}
	}, 0);

	this.spinner(false);
},

changeLocale: function() {

	setTimeout(function() {
		this.generate(true).then(function() {
			setTimeout(function() {
				$(this.parentSelector + ' a[data-menu-id="${}"]'.interpolate($('form#menu-form input[name="mid"]').val()))
					.toggleClass('active', true) // 선택된 메뉴 표시
					// .parents(this.parentSelector).hide() // dropdown 닫기
					.parents('li.nav-item').toggleClass('active', true); // 선택된 대메뉴 표시
			}, 0);
		});
	}.bind(this), 0);

	var iframe = $('iframe[name="content-iframe"]');
	if (iframe.length) {
		$('form#menu-form').submit();
	}
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
		if (typeof o === 'string' || o instanceof String) {
			$.map(o.replace(/[^?]*\?/, '').split(/&/), function(v) {
				var pair = v.split(/=/);
				map[pair[0]] = pair[1];
			});
		} else if ($.isPlainObject(o)) {
			map = o;
		}
		$.extend(true, paramMap, map);
	});

	return paramMap;
},

goToLink: function(menuId, url) {

	var iframe = $('iframe[name="content-iframe"]');
	if (!iframe.length) {
		var container = $('.ehr-body .container-fluid');
		if (container.data('jsp')) {
			container.data('jsp').destroy(); // destroy 후에는 container 변수의 jQuery function들이 제대로 동작하지 않으므로 새로 객체를 만들어야함
		}
		$('.ehr-body .container-fluid').append('<iframe name="content-iframe"></iframe>');
	}

	var form = $('form#menu-form');
	if (!form.length) {
		form = $('<form id="menu-form" method="GET" target="content-iframe"><input type="hidden" name="mid" /></form>').appendTo('body');
	}

	if (!window._basis.isPRD()) {
		var pernr = window._basis.parameter('pernr');
		if (pernr) {
			if (!form.find('input[name="pernr"]').val(pernr).length) {
				$('<input type="hidden" name="pernr" />').val(pernr).appendTo(form);
			}
		}
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
			$('[data-target="${}"]'.interpolate(this.parentSelector)).click();
		}.bind(this), 0);

	} else {
		setTimeout(function() {
			$('[data-target="${}"]'.interpolate(this.parentSelector)).click();
			$('.ehr-body').toggleClass('menu-loaded', true);
		}.bind(this), 0);

		this.goToLink(menuId, url);
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

// Top menu item html 생성
topMenuItem: function(top) {

	var subMenuBlock = this.subMenuBlock(top);
	if (subMenuBlock) {
		return [
			'<li class="nav-item dropdown">',
				'<a class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${title}</a>'.interpolate(top.title),
				subMenuBlock,
			'</li>'
		].join('');
	} else {
		var urlData = this.urlData(top.url);
		return [
			'<li class="nav-item">',
				'<a class="nav-link" href="${href}"${url}${menu-id}>${title}</a>'.interpolate(
					urlData.getScript(),
					urlData.getUrl(),
					!top.menuId ? '' : ' data-menu-id="${menu-id}"'.interpolate(top.menuId),
					top.title
				),
			'</li>'
		].join('');
	}
},

// 하위 menu block html 생성
subMenuBlock: function(menu) {

	if (!menu.children || !menu.children.length) {
		return '';
	}

	var menuItems = $.map(menu.children, function(item) {
		var subMenuBlock = this.subMenuBlock(item);
		if (subMenuBlock) {
			return [
				'<li class="dropdown-item dropdown">',
					'<a class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${title}</a>'.interpolate(item.title),
					subMenuBlock,
				'</li>'
			].join('');
		} else {
			var urlData = this.urlData(item.url);
			return [
				'<li class="dropdown-item">',
					'<a href="${href}"${url}${menu-id}>${title}</a>'.interpolate(
						urlData.getScript(),
						urlData.getUrl(),
						!item.menuId ? '' : ' data-menu-id="${menu-id}"'.interpolate(item.menuId),
						item.title
					),
				'</li>'
			].join('');
		}
	}.bind(this)).join('');

	return [
		'<ul class="dropdown-menu">',
			menuItems,
		'</ul>'
	].join('');
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
			children: level1SubMenuMap[o.Mnid1]
		};
	});
},

generate: function() {

	var url = 'ZHR_COMMON_SRV/GetMnlvSet',
	loginInfo = this._gateway.loginInfo();

	return this._gateway.post({
		url: url,
		data: {
			IPernr: this._gateway.pernr(),
			IBukrs: loginInfo.Bukrs,
			ILangu: loginInfo.Langu,
			IDevice: 'M',
			TableIn1: [],
			TableIn2: [],
			TableIn3: [],
			TableIn4: []
		},
		success: function(data) {
			this._gateway.prepareLog('MenuHamburger.generate ${url} success'.interpolate(url), arguments).log();

			this.items = this.getMenuTree(data);

			if (!this.items.length) {
				this.items = [{ title: '조회된 메뉴 목록이 없습니다.' }];
			}

			$(this.parentSelector).html(
				this.ul.replace(/\$\{[^{}]*\}/, $.map(this.items, function(top) {
					return this.topMenuItem(top);
				}.bind(this)).join(''))
			)
			.find('.dropdown-item').on('click', function(e) {
				var t = $(this),
				toggle = t.children('.dropdown-toggle');
				if (!toggle.length) {
					return;
				}

				e.preventDefault();
				e.stopPropagation();

				var block = toggle.offsetParent('.dropdown-menu');
				if (block.hasClass('show')) {
					block.removeClass('show');
					toggle.next().removeClass('show');
				} else {
					block.parent().find('.show').removeClass('show');
					block.addClass('show');
					toggle.next().addClass('show');
				}
			}).end()
			.find('a[data-url]').on('click', this.handleUrl.bind(this));

			$('.navbar .dropdown').on('hidden.bs.dropdown', function() {
				$(this).find('li.dropdown,ul.dropdown-menu').removeClass('show open');
			});
		}.bind(this),
		error: function(jqXHR) {
			var message = this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'MenuHamburger.generate ' + url).message;

			this.items = [{ title: '조회된 메뉴 목록이 없습니다.' }];
			$(this.parentSelector).html(
				this.ul.replace(/\$\{[^{}]*\}/, $.map(this.items, function(top) {
					return this.topMenuItem(top);
				}.bind(this)).join(''))
			);

			this._gateway.alert({ title: '오류', html: [
				'<p>메뉴를 조회하지 못했습니다.',
				'화면을 새로고침 해주세요.<br />',
				'같은 문제가 반복될 경우 eHR 시스템 담당자에게 문의하세요.',
				'시스템 오류 메세지 : ' + message,
				'</p>'
			].join('<br />') });
		}.bind(this)
	});
},

toggleMenu: function() {}/* HomeGateway undefined 방지 */

});