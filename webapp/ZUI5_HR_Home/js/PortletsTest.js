/* global EmployeePortlet NoticePortlet QuickLinkPortlet FavoriteMenuPortlet CalendarPortlet HiTalkTalkPortlet EvalGoalPortlet EvalGoalProgressingPortlet WorkstimeStatusPortlet VacationPortlet */
function Portlets(_gateway) {

	this._gateway = _gateway;
	_gateway.homePortlet(this);

	this.init();
}

$.extend(Portlets.prototype, {

init: function() {

	this.toBeUsedItemKeys = null;
	this.toBeUnusedItemKeys = null;
	this.items = null;
	this.itemMap = null;
	this.portletTypeMap = {
		'P101': EmployeePortlet,			// 개인정보
		'P102': NoticePortlet,				// 공지사항
		'P103': QuickLinkPortlet,			// 바로가기
		'P104': FavoriteMenuPortlet,		// 즐겨찾는 메뉴
		'P105': CalendarPortlet,			// 팀 달력
		'P106': HiTalkTalkPortlet,			// 하이톡톡
		'P107': EvalGoalPortlet	,			// 목표관리
		'P108': EvalGoalProgressingPortlet,	// 팀원 목표 진척율
		'P109': WorkstimeStatusPortlet,		// 자율출퇴근 관리
		'P110': VacationPortlet				// 근태신청
	};

	$(document)
		.off('click', '.portlet-masonry [data-url]')
		.on('click', '.portlet-masonry [data-url]', this._gateway.handleUrl);

	$(document)
		.off('click', '.portlet-masonry [data-popup-menu-url]')
		.on('click', '.portlet-masonry [data-popup-menu-url]', function(e) {
			var anchor = $(e.currentTarget), popupMenuUrl = anchor.data('popupMenuUrl');
			if (popupMenuUrl) {
				var paramMap = this._gateway.menuParam(popupMenuUrl, {
					popup: popupMenuUrl.replace(/([^?]*)\?.*/, '$1'),
					mid: anchor.data('menuId') || this._gateway.mid(popupMenuUrl)
				});
				if (!this._gateway.isPRD()) {
					paramMap.pernr = this._gateway.parameter('pernr');
				}
				this._gateway.openWindow({ // openPopup openWindow
					url: 'indexTest.html?' + $.param(paramMap),
					name: popupMenuUrl.replace(/[^a-zA-Z0-9]/g, ''),
					width: 1280,
					height: 800
				});
			} else {
				this._gateway.alert({
					title: '오류', html: ['<p>', '</p>'].join('이동할 URL 정보가 없습니다.')
				});
			}
		}.bind(this));

	$(document)
		.off('mouseover', '.portlet .card-header')
		.on('mouseover', '.portlet .card-header', function(e) {
			$(e.currentTarget).find('[data-dismiss="portlet"]').toggleClass('d-none', false);
		});

	$(document)
		.off('mouseout', '.portlet .card-header')
		.on('mouseout', '.portlet .card-header', function(e) {
			$(e.currentTarget).find('[data-dismiss="portlet"]').toggleClass('d-none', true);
		});

	$(document)
		.off('click', '[data-dismiss="portlet"]')
		.on('click', '[data-dismiss="portlet"]', function(e) {
			e.stopImmediatePropagation();

			this.dismiss($(e.currentTarget).toggleClass('d-none', true));
		}.bind(this));

	this._gateway.addLocaleChangeCallbackOwner(this);
},

changeLocale: function() {

	setTimeout(function() {
		var container = $('.ehr-body .container-fluid');
		if (container.data('jsp')) {
			container.data('jsp').destroy(); // destroy 후에는 container 변수의 jQuery function들이 제대로 동작하지 않으므로 새로 객체를 만들어야함
		}

		this.generate()
			.then(function() {
				$('.ehr-body .container-fluid').jScrollPane({ // Portlet rendering이 완료되어 .ehr-body 높이가 확정되면 scrollbar 생성
					resizeSensor: true,
					verticalGutter: 0,
					horizontalGutter: 0
				});
			});
	}.bind(this), 0);
},

changeState: function(restore) {

	setTimeout(function() {
		if (restore) {
			if ($('.portlet-masonry-wrapper').length) {
				$('.ehr-body .container-fluid').jScrollPane({ // Portlet rendering이 완료되어 .ehr-body 높이가 확정되면 scrollbar 생성
					resizeSensor: true,
					verticalGutter: 0,
					horizontalGutter: 0
				});
				return;
			}

			this.generate() // Portlet 설정 조회 및 생성
				.then(function() {
					$('[data-target="#portlet-personalization"]').parent().show();
					$('.ehr-body .container-fluid').jScrollPane({ // Portlet rendering이 완료되어 .ehr-body 높이가 확정되면 scrollbar 생성
						resizeSensor: true,
						verticalGutter: 0,
						horizontalGutter: 0
					});
				});

		} else {
			this.itemMap = null;
			this.items = null;
			$('.portlet-masonry-wrapper,#portlet-personalization').remove(); // portlet 영역, portlet 개인화 팝업 삭제
			$('[data-target="#portlet-personalization"]').parent().hide();   // portlet 개인화 팝업 버튼 숨김

		}
	}.bind(this), 0);
},

updatePortlet: function(type) {

	$.map(this.itemMap, function(item) {
		if (item instanceof type) {
			item.update();
		}
	});
},

dismiss: function($button) {

	var $portlet = $button.parents('.portlet').toggleClass('dismiss-target', true),
	item = this.itemMap[$portlet.data('key')].backup(true);

	this.save({
		success: function() {
			item.backup(false).destroy();
		},
		error: function(message) {
			setTimeout(function() {
				$portlet.toggleClass('dismiss-target', false);
				$button.toggleClass('d-none', false);
				item.restore();
			}, 0);
			this._gateway.alert({ title: '오류', html: ['<p>', '</p>'].join(message || '알 수 없는 오류가 발생하였습니다.') });
		}.bind(this)
	});
},

switch: function(toBeUsed, key) {

	if (toBeUsed) {
		if (!this.itemMap[key].rendered()) { // 이미 선택되어 있던 portlet을 switch off 했다가 다시 switch on 한 경우
			this.toBeUsedItemKeys.push(key);
		}
		var i = $.inArray(key, this.toBeUnusedItemKeys);
		if (i > -1) {
			this.toBeUnusedItemKeys.splice(i, 1);
		}
	} else {
		if (this.itemMap[key].rendered()) { // 이미 선택되어 있던 portlet을 switch on 했다가 다시 switch off 한 경우
			this.toBeUnusedItemKeys.push(key);
		}
		var j = $.inArray(key, this.toBeUsedItemKeys);
		if (j > -1) {
			this.toBeUsedItemKeys.splice(j, 1);
		}
	}
},

getAppendPosition: function() {

	var sorted = [
		{ column: 1, row: 0, size: 0 },
		{ column: 2, row: 0, size: 0 },
		{ column: 3, row: 0, size: 0 }
	],
	columns = {
		1: sorted[0],
		2: sorted[1],
		3: sorted[2]
	};
	$.map(this.itemMap, function(item) {
		var o = columns[item.column()];
		if (o) {
			o.row++;
			o.size += item.size(); // column에 포함된 portlet들의 높이 합산
		}
	});

	return sorted.sort(function(o1, o2) { // 높이 순으로 오름차순 정렬
		return o1.size - o2.size;
	}).shift(); // 높이가 제일 작은 position을 배열에서 빼서 반환
},

renderSwitchModal: function() {

	var items = [].concat(this.items || []);
	if (!items.length) {
		$('#portlet-personalization .modal-body').html('<div class="portlet-data-not-found"><span>조회된 Portlet 정보가 없습니다.</span></div>');
		return;
	}

	items.sort(function(item1, item2) {
		return item1.title() < item2.title() ? -1 : 1;
	});

	$('#portlet-personalization .modal-body').html('<div class="row mx-0 pb-3">' + $.map(items, function(item) {
		var key = item.key(),
		active = item.use() ? ' active' : '',
		switchable = item.switchable() ? '' : ' disabled';
		return [
			'<div class="col-4">',
				'<div class="card portlet-switch${active}${switchable}" data-key="${key}">'.interpolate(active, switchable, key),
					'<div class="card-body">',
						'<div><i class="fas ${icon}"></i>${title}</div>'.interpolate(item.icon() || 'fa-star', item.title()),
						'<div class="custom-control custom-switch custom-switch-reverse">',
							'<input type="checkbox"${switchable} class="custom-control-input" id="switch-${key}"${checked}>'
								.interpolate(switchable, key, item.use() ? ' checked="checked"' : ''),
							'<label class="custom-control-label" for="switch-${key}"></label>'.interpolate(key),
						'</div>',
					'</div>',
				'</div>',
			'</div>'
		].join('');
	}).join('') + '</div>');

	this.toBeUsedItemKeys = [];
	this.toBeUnusedItemKeys = [];

	$(document)
		.off('click', '.portlet-switch:not(.disabled)')
		.on('click', '.portlet-switch:not(.disabled)', function(e) { // switch card click event handler
			e.preventDefault();

			var t = $(e.currentTarget), toBeUsed = !t.hasClass('active');
			this.switch(toBeUsed, t.toggleClass('active').find('[type="checkbox"]').prop('checked', toBeUsed).end().data('key'));
		}.bind(this));

	$(document)
		.off('click', '.portlet-switch [type="checkbox"]:not([disabled])')
		.on('click', '.portlet-switch [type="checkbox"]:not([disabled])', function(e) { // switch click event handler
			e.preventDefault();

			var t = $(e.currentTarget), toBeUsed = !t.prop('checked');
			this.switch(toBeUsed, t.prop('checked', toBeUsed).parents('.portlet-switch').toggleClass('active', toBeUsed).data('key'));
		}.bind(this));
},

initSwitchModal: function() {

	var t = $('#portlet-personalization');
	if (t.length) {
		$(document).off('click', '.portlet-switch:not(.disabled)');
		$(document).off('click', '.portlet-switch [type="checkbox"]:not([disabled])');
		t.off('click', '.btn-primary');
		t.find('.modal-dialog').draggable('destroy');
		t.modal('dispose');
		t.remove();
	}

	$([
		'<div class="modal fade portlet-switch-modal" style="display:none" aria-hidden="true" data-backdrop="static" tabindex="-1" role="dialog" id="portlet-personalization">',
			'<div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<h4 class="modal-title">설정</h4>',
						'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>',
					'</div>',
					'<div class="modal-body"></div>',
					'<div class="modal-footer">',
						'<button type="button" class="btn btn-primary">적용</button>',
						'<button type="button" class="btn btn-light" data-dismiss="modal">취소</button>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join(''))
	.on('click', '.btn-primary', function() { // 적용 button click event handler
		this._gateway.spinner(true);

		var save = false;
		if (this.toBeUnusedItemKeys.length) { // 선택해제된 portlet data 저장
			$.map(this.toBeUnusedItemKeys, function(key) {
				this.itemMap[key].backup(true).use(false).position(null, null);
			}.bind(this));

			save = true;
		}
		if (this.toBeUsedItemKeys.length) { // 선택된 portlet data 저장
			$.map(this.toBeUsedItemKeys, function(key) {
				var item = this.itemMap[key],
				position = key === 'P101' ? item.position() : this.getAppendPosition();

				item.backup(true).use(true).position(position.column, position.row);
			}.bind(this));

			save = true;
		}
		if (save) {
			this.save({
				modal: true,
				success: function() { // save 성공시
					if (this.toBeUnusedItemKeys.length) { // 선택해제된 portlet 화면에서 제거
						$.map(this.toBeUnusedItemKeys, function(key) {
							this.itemMap[key].backup(false).destroy();
						}.bind(this));
					}
					if (this.toBeUsedItemKeys.length) { // 선택된 portlet 화면에 추가
						$.map(this.toBeUsedItemKeys, function(key) {
							var item = this.itemMap[key].backup(false);

							if (key === 'P101') {
								item.prependTo('[data-position="1"].portlet-col', true);
							} else {
								item.appendTo('[data-position="${column}"].portlet-col'.interpolate(item.column()), true); // Portlet UI rendering
							}
						}.bind(this));
					}
					setTimeout(function() {
						if (!$('.portlet-col .portlet:not(.portlet-employee)').length) {
							$('.portlet-col[data-position="2"]').html([
								'<div class="portlet-data-not-found">',
									'<div>',
										'<span>선택된 Portlet이 없습니다.</span>',
									'</div>',
									'<div class="mt-3">',
										'<a href="javascript:;" data-toggle="modal" data-target="#portlet-personalization"><i class="fas fa-user-cog"></i> 설정</a>',
										' 버튼을 클릭하여 Portlet을 선택하세요.',
									'</div>',
								'</div>'
							].join(''));
						} else {
							$('.portlet-data-not-found').remove();
						}
					}, 0);
					this._gateway.spinner(false);
					$('#portlet-personalization').modal('hide');
				}.bind(this),
				error: function(message) { // save 오류시
					this._gateway.spinner(false);
					$('#portlet-personalization').modal('hide');
					setTimeout(function() {
						if (this.toBeUnusedItemKeys.length) {
							$.map(this.toBeUnusedItemKeys, function(key) {
								this.itemMap[key].restore();
							}.bind(this));
						}
						if (this.toBeUsedItemKeys.length) {
							$.map(this.toBeUsedItemKeys, function(key) {
								this.itemMap[key].restore();
							}.bind(this));
						}
					}.bind(this), 0);
					this._gateway.alert({ title: '오류', html: ['<p>', '</p>'].join(message || '알 수 없는 오류가 발생하였습니다.') });
				}.bind(this)
			});
		} else {
			this._gateway.spinner(false);
			$('#portlet-personalization').modal('hide');
		}
	}.bind(this))
	.on('show.bs.modal', function() { // Modal이 열리기 직전
		this.renderSwitchModal();
	}.bind(this))
	.on('hidden.bs.modal', function() { // Modal이 닫힌 후
		$('#portlet-personalization .modal-body').html('');
		this.toBeUsedItemKeys = null;
		this.toBeUnusedItemKeys = null;
	}.bind(this))
	.find('.modal-dialog').draggable({
		containment: 'body',
		handle: '.modal-header'
	}).end()
	.appendTo('body');
},

save: function(o) {

	var modal = typeof o.modal === 'boolean' ? o.modal : false,
	success = typeof o.success === 'function' ? o.success : null,
	error = typeof o.error === 'function' ? o.error : null,
	loginInfo = this._gateway.loginInfo(),
	itemMap = this.itemMap,
	saveItemMap = {},
	saveItems;

	// switch modal
	if (modal) {
		saveItems = $.map(itemMap, function(item) {
			return item.dto();
		});
	}
	// drag and drop 또는 dismiss button click
	else {
		saveItems = $.map(itemMap, function(item, key) {
			item.use(false).position(null, null);
			return saveItemMap[key] = {
				Potid: key,
				PCol: null,
				PSeq: null,
				Zhide: 'X'
			};
		});

		$('.portlet-col').map(function(i, col) {
			$(col).find('.portlet').map(function(j, portlet) {
				var $portlet = $(portlet), key = $portlet.data('key');
				if ($portlet.hasClass('dismiss-target')) {
					return;
				}
				itemMap[key].use(true).position(i + 1, j + 1);
				$.extend(saveItemMap[key], {
					PCol: String(i + 1),
					PSeq: String.lpad(j + 1, 2, '0'),
					Zhide: ''
				});
			});
		});
	}

	var url = 'ZHR_COMMON_SRV/PortletInfoSet';

	this._gateway.post({
		url: url,
		data: {
			IMode: 'U',
			IPernr: this._gateway.pernr(),
			IBukrs: loginInfo.Bukrs,
			ILangu: loginInfo.Langu,
			IDatum: Date.toODataString(),
			TableIn2: saveItems
		},
		success: function(data) {
			this._gateway.prepareLog('Portlets.save ${url} success'.interpolate(url), arguments).log();

			if (typeof success === 'function') {
				success();
			} else {
				setTimeout(function() {
					if (!$('.portlet-col .portlet:not(.portlet-employee)').length) {
						$('.portlet-col[data-position="2"]').html([
							'<div class="portlet-data-not-found">',
								'<div>',
									'<span>선택된 Portlet이 없습니다.</span>',
								'</div>',
								'<div class="mt-3">',
									'<a href="javascript:;" data-toggle="modal" data-target="#portlet-personalization"><i class="fas fa-user-cog"></i> 설정</a>',
									' 버튼을 클릭하여 Portlet을 선택하세요.',
								'</div>',
							'</div>'
						].join(''));
					} else {
						$('.portlet-data-not-found').remove();
					}
				}, 0);
			}
		}.bind(this),
		error: function(jqXHR) {
			var message = this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'Portlets.save ' + url).message || '알 수 없는 오류가 발생하였습니다.';
			if (typeof error === 'function') {
				error(message);
			} else {
				this._gateway.alert({ title: '오류', html: ['<p>', '</p>'].join(message) });
			}
		}.bind(this)
	});
},

generate: function() {

	setTimeout(this.initSwitchModal.bind(this), 0);

	var url = 'ZHR_COMMON_SRV/PortletInfoSet',
	loginInfo = this._gateway.loginInfo();

	return this._gateway.post({
		url: url,
		data: {
			IMode: 'R',
			IPernr: this._gateway.pernr(),
			IBukrs: loginInfo.Bukrs,
			ILangu: loginInfo.Langu,
			IDatum: Date.toODataString(),
			TableIn1: [],
			TableIn2: []
		},
		success: function(data) {
			this._gateway.prepareLog('Portlets.generate ${url} success'.interpolate(url), arguments).log();

			$('.ehr-body .container-fluid').html([
				'<div class="portlet-masonry-wrapper mx-auto">',
					'<div class="row portlet-masonry">',
						'<div class="col-sm-12 col-md-6 col-lg-3 col-xl-3 portlet-col" data-position="1"></div>',
						'<div class="col-sm-12 col-md-6 col-lg-3 col-xl-3 portlet-col" data-position="2"></div>',
						'<div class="col-sm-12 col-md-6 col-lg-3 col-xl-3 portlet-col" data-position="3"></div>',
					'</div>',
				'</div>'
			].join(''));

			var results = this._gateway.odataResults(data),
			TableIn2Map = {},
			selected = [];

			$.map(results.TableIn2, function(o) {
				TableIn2Map[o.Potid] = o;
			});

			this.itemMap = {};
			this.items = $.map(results.TableIn1, function(o) {
				if (this.portletTypeMap[o.Potid]) {
					$.extend(o, TableIn2Map[o.Potid]);
					if (o.Fixed !== 'X' && o.Zhide !== 'X') {
						selected.push(1);
					}
					return this.itemMap[o.Potid] = new this.portletTypeMap[o.Potid](this._gateway, o);
				}
			}.bind(this));

			setTimeout(function() {
				if (!selected.length) {
					$('.portlet-col[data-position="2"]').html([
						'<div class="portlet-data-not-found">',
							'<div>',
								'<span>선택된 Portlet이 없습니다.</span>',
							'</div>',
							'<div class="mt-3">',
								'<a href="javascript:;" data-toggle="modal" data-target="#portlet-personalization"><i class="fas fa-user-cog"></i> 설정</a>',
								' 버튼을 클릭하여 Portlet을 선택하세요.',
							'</div>',
						'</div>'
					].join(''));
				}
			}, 0);

			this.items.sort(function(item1, item2) {
				return (item1.column() * 100 + item1.row()) - (item2.column() * 100 + item2.row());
			});

			$.map(this.items, function(item) {
				if (item.use()) {
					item.appendTo('[data-position="${column}"].portlet-col'.interpolate(item.column()), true); // Portlet UI rendering
				}
			});

			$('.portlet-col').sortable({
				containment: '.portlet-masonry',
				connectWith: '.portlet-col',
				items: '.portlet:not(.portlet-employee)',
				handle: '.card-header',
				revert: 'invalid',
				cursor: 'move',
				cursorAt: { top: 5 },
				tolerance: 'pointer',
				update: this.save.bind(this) // event, ui
			});

			$('.card-header').disableSelection();
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'Portlets.generate ' + url);

			$('.ehr-body .container-fluid').html([
				'<div class="portlet-masonry-wrapper mx-auto">',
					'<div class="portlet-data-not-found"><span>조회된 Portlet 정보가 없습니다.</span></div>',
				'</div>'
			].join(''));

			this._gateway.alert({ title: '오류', html: [
				'<p>Protlet 정보를 조회하지 못했습니다.',
				'화면을 새로고침 해주세요.<br />',
				'같은 문제가 반복될 경우 HR 시스템 담당자에게 문의하세요.</p>'
			].join('<br />') });
		}.bind(this),
		complete: function() {
			this._gateway.spinner(false);
		}.bind(this)
	});
}

});