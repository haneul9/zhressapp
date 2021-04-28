/* global EmployeePortlet NoticePortlet QuickLinkPortlet FavoriteMenuPortlet CalendarPortlet HiTalkTalkPortlet EvalGoalPortlet EvalGoalProgressingPortlet*/
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
		'P101': EmployeePortlet,			// 개인정보
		'P102': NoticePortlet,				// 공지사항
		'P105': CalendarPortlet,			// 팀 달력
		'P106': HiTalkTalkPortlet,			// 하이톡톡
		'P107': EvalGoalPortlet	,			// 목표관리
		'P108': EvalGoalProgressingPortlet	// 팀원 목표 진척율
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
					paramMap.pernr = this._gateway.parameter('pernr') || sessionStorage.getItem('ehr.sf-user.name');
				}
				this._gateway.openWindow({ // openPopup openWindow
					url: 'indexMobileTest.html?' + $.param(paramMap),
					name: popupMenuUrl.replace(/[^a-zA-Z0-9]/g, ''),
					width: screen.availWidth,
					height: screen.availHeight
				});
			} else {
				this._gateway.alert({
					title: '오류', html: ['<p>', '</p>'].join('이동할 URL 정보가 없습니다.')
				});
			}
		}.bind(this));
},

changeLocale: function() {

	setTimeout(function() {
		this.generate();
	}.bind(this), 0);
},

changeState: function(restore) {

	setTimeout(function() {
		if (restore) {
			if ($('.portlet-masonry-wrapper').length) {
				return;
			}

			this.generate(); // Portlet 설정 조회 및 생성
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

			this.items.sort(function(item1, item2) {
				return item1.position() - item2.position();
			});

			$.map(this.items, function(item) {
				if (item.use()) {
					item.appendTo('.portlet-col', true); // Portlet UI rendering
				}
			});
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
				'같은 문제가 반복될 경우 HR 시스템 담당자에게 문의하세요.</p>'
			].join('<br />') });
		}.bind(this),
		complete: function() {
			this._gateway.spinner(false);
		}.bind(this)
	});
}

});