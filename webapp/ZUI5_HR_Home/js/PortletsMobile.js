/* global EmployeePortlet NoticePortlet QuickLinkPortlet FavoriteMenuPortlet CalendarPortlet TempPortlet */
function PortletsMobile(_gateway) {

	this._gateway = _gateway;
	_gateway.homePortlet(this);

	this.init();
}

$.extend(PortletsMobile.prototype, {

init: function() {

	this.items = null;
	this.itemMap = null;
	this.portletTypeMap = {
		'P101': EmployeePortlet,	// 개인정보
		'P105': CalendarPortlet		// 팀 달력
	};

	// $(document)
	// 	.off('click', '.portlet-masonry [data-url]')
	// 	.on('click', '.portlet-masonry [data-url]', this._gateway.handleUrl);

	// $(document)
	// 	.off('click', '.portlet-masonry [data-popup-menu-url]')
	// 	.on('click', '.portlet-masonry [data-popup-menu-url]', function(e) {
	// 		var anchor = $(e.currentTarget), popupMenuUrl = anchor.data('popupMenuUrl');
	// 		if (popupMenuUrl) {
	// 			var paramMap = this._gateway.menuParam(popupMenuUrl, {
	// 				popup: popupMenuUrl.replace(/([^?]*)\?.*/, ''),
	// 				mid: anchor.data('menuId') || this._gateway.mid(popupMenuUrl)
	// 			});
	// 			if (!this._gateway.isPRD()) {
	// 				paramMap.pernr = this._gateway.parameter('pernr');
	// 			}
	// 			this._gateway.openWindow({ // openPopup openWindow
	// 				url: 'index.html?' + $.param(paramMap),
	// 				name: popupMenuUrl.replace(/[^a-zA-Z0-9]/g, ''),
	// 				width: 1280,
	// 				height: 800
	// 			});
	// 		} else {
	// 			this._gateway.alert({
	// 				title: '오류', html: ['<p>', '</p>'].join('이동할 URL 정보가 없습니다.')
	// 			});
	// 		}
	// 	}.bind(this));

	// $(document)
	// 	.off('mouseover', '.portlet .card-header')
	// 	.on('mouseover', '.portlet .card-header', function(e) {
	// 		$(e.currentTarget).find('[data-dismiss="portlet"]').toggleClass('d-none', false);
	// 	});

	// $(document)
	// 	.off('mouseout', '.portlet .card-header')
	// 	.on('mouseout', '.portlet .card-header', function(e) {
	// 		$(e.currentTarget).find('[data-dismiss="portlet"]').toggleClass('d-none', true);
	// 	});

	// $(document)
	// 	.off('click', '[data-dismiss="portlet"]')
	// 	.on('click', '[data-dismiss="portlet"]', function(e) {
	// 		e.stopImmediatePropagation();

	// 		this.dismiss($(e.currentTarget).toggleClass('d-none', true));
	// 	}.bind(this));

	this._gateway.addLocaleChangeCallbackOwner(this);
},

changeLocale: function() {

	setTimeout(function() {
		// var container = $('.ehr-body .container-fluid');
		// if (container.data('jsp')) {
		// 	container.data('jsp').destroy(); // destroy 후에는 container 변수의 jQuery function들이 제대로 동작하지 않으므로 새로 객체를 만들어야함
		// }

		this.generate()
			.then(function() {
				// $('.ehr-body .container-fluid').jScrollPane({ // Portlet rendering이 완료되어 .ehr-body 높이가 확정되면 scrollbar 생성
				// 	resizeSensor: true,
				// 	verticalGutter: 0,
				// 	horizontalGutter: 0
				// });
			});
	}.bind(this), 0);
},

changeState: function(restore) {

	setTimeout(function() {
		if (restore) {
			if ($('.portlet-masonry-wrapper').length) {
				return;
			}

			// this.generate() // Portlet 설정 조회 및 생성
			// 	.then(function() {
			// 		// $('[data-target="#portlet-personalization"]').parent().show();
			// 		// $('.ehr-body .container-fluid').jScrollPane({ // Portlet rendering이 완료되어 .ehr-body 높이가 확정되면 scrollbar 생성
			// 		// 	resizeSensor: true,
			// 		// 	verticalGutter: 0,
			// 		// 	horizontalGutter: 0
			// 		// });
			// 	});

		} else {
			this.itemMap = null;
			this.items = null;
			$('.portlet-masonry-wrapper').remove(); // portlet 영역 삭제

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

generate: function() {

	var url = 'ZHR_COMMON_SRV/PortletInfoSet',
	loginInfo = this._gateway.loginInfo();

	return this._gateway.post({
		url: url,
		data: {
			IMode: 'M',
			IPernr: this._gateway.pernr(),
			IBukrs: loginInfo.Bukrs,
			ILangu: loginInfo.Langu,
			IDatum: Date.toODataString(),
			TableIn1: [],
			TableIn2: []
		},
		success: function(data) {
			this._gateway.prepareLog('PortletsMobile.generate ${url} success'.interpolate(url), arguments).log();

			$('.ehr-body .container-fluid').html([
				'<div class="portlet-masonry-wrapper mx-auto">',
					'<div class="row portlet-masonry">',
						'<div class="col portlet-col"></div>',
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
					$('.portlet-masonry-wrapper').html('<div class="portlet-data-not-found"><span>조회된 Portlet 정보가 없습니다.</span></div>');
				}
			}, 0);

			// $.map(this.items, function(item) {
			// 	if (item.use()) {
			// 		item.appendTo('[data-position="${column}"].portlet-col'.interpolate(item.column()), true); // Portlet UI rendering
			// 	}
			// });

			$(document).on('click', '.portlet [data-url]', this._gateway.handleUrl);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'PortletsMobile.generate ' + url);

			$('.ehr-body .container-fluid').html([
				'<div class="portlet-masonry-wrapper mx-auto">',
					'<div class="portlet-data-not-found"><span>조회된 Portlet 정보가 없습니다.</span></div>',
				'</div>'
			].join(''));

			this._gateway.alert({ title: '오류', html: [
				'<p>Protlet 정보를 조회하지 못했습니다.',
				'화면을 새로고침 해주세요.<br />',
				'같은 문제가 반복될 경우 eHR 시스템 담당자에게 문의하세요.</p>'
			].join('<br />') });
		}.bind(this),
		complete: function() {
			this._gateway.spinner(false);
		}.bind(this)
	});
}

});