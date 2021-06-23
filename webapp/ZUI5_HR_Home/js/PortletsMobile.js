/* global Chart EmployeePortlet NoticePortlet QuickLinkPortlet FavoriteMenuPortlet CalendarPortlet HiTalkTalkPortlet EvalGoalPortlet EvalGoalProgressingPortlet WorkstimeStatusPortlet VacationPortlet VacationForHQPortlet */
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
		'P108': EvalGoalProgressingPortlet,	// 팀원 목표 진척율
		'P109': WorkstimeStatusPortlet,		// My Working Time
		'P110': VacationPortlet,			// 휴가사용현황
		'P111': VacationForHQPortlet		// 연차사용현황 : 임원용
	};

	Chart.defaults.scale.gridLines.color = 'rgb(242, 242, 242)';
	Chart.defaults.global.defaultFontColor = 'rgb(153, 153, 153)';
	Chart.defaults.global.legend.labels.boxWidth = 20;
	Chart.defaults.global.legend.align = 'end';

	$(document)
		.off('click', '.portlet-masonry [data-url]')
		.on('click', '.portlet-masonry [data-url]', this._gateway.handleUrl);

	$(document)
		.off('click', '.portlet-masonry [data-popup-menu-url]')
		.on('click', '.portlet-masonry [data-popup-menu-url]', function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();

			var anchor = $(e.currentTarget), popupMenuUrl = anchor.data('popupMenuUrl');
			if (popupMenuUrl) {
				if (/^http/.test(popupMenuUrl)) {
					this._gateway.openWindow({
						url: popupMenuUrl,
						name: popupMenuUrl.replace(/[^a-zA-Z0-9]/g, '')
					});
				} else {
					var paramMap = this._gateway.menuParam(popupMenuUrl, {
						popup: popupMenuUrl.replace(/([^?]*)\?.*/, '$1'),
						mid: anchor.data('menuId') || this._gateway.mid(popupMenuUrl)
					});
					if (!this._gateway.isPRD()) {
						paramMap.pernr = this._gateway.parameter('pernr') || sessionStorage.getItem('ehr.sf-user.name');
					}
					this._gateway.openWindow({ // openPopup openWindow
						url: 'indexMobile.html?' + $.param(paramMap),
						name: popupMenuUrl.replace(/[^a-zA-Z0-9]/g, ''),
						width: screen.availWidth,
						height: screen.availHeight
					});
				}
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

carousel: function() {

	return [
		'<div id="portlet-carousel" class="portlet-carousel carousel slide" data-ride="carousel">',
			'<ul class="nav nav-tabs">',
				// '<li class="nav-item">',
				// 	'<a class="nav-link active" href="#" data-slide="0">Active</a>',
				// '</li>',
			'</ul>',
			'<div class="carousel-inner">',
				// '<div class="carousel-item active">',
				// 	'<span>조회된 Portlet 정보가 없습니다.</span>',
				// '</div>',
				// '<div class="carousel-item">',
				// 	'<img src="..." class="d-block w-100" alt="...">',
				// '</div>',
				// '<div class="carousel-item">',
				// 	'<img src="..." class="d-block w-100" alt="...">',
				// '</div>',
			'</div>',
			'<a class="carousel-control-prev d-none" href="#portlet-carousel" role="button" data-slide="prev">',
				'<span class="carousel-control-prev-icon" aria-hidden="true"></span>',
				'<span class="sr-only">Previous</span>',
			'</a>',
			'<a class="carousel-control-next d-none" href="#portlet-carousel" role="button" data-slide="next">',
				'<span class="carousel-control-next-icon" aria-hidden="true"></span>',
				'<span class="sr-only">Next</span>',
			'</a>',
			'<ol class="carousel-indicators">',
				// '<li data-target="#portlet-carousel" data-slide-to="0" class="active"></li>',
				// '<li data-target="#portlet-carousel" data-slide-to="1"></li>',
				// '<li data-target="#portlet-carousel" data-slide-to="2"></li>',
			'</ol>',
		'</div>'
	].join('');
},

generate: function() {

	return new Promise(function (resolve, reject) {
		var oModel = this._gateway.getModel("ZHR_COMMON_SRV"),
		url = 'ZHR_COMMON_SRV/PortletInfoSet',
		loginInfo = this._gateway.loginInfo();
		
		oModel.create("/PortletInfoSet", {
			IMode: 'M',
			IPernr: this._gateway.pernr(),
			IBukrs: loginInfo.Bukrs,
			ILangu: loginInfo.Langu,
			IDatum: Date.toODataString(),
			TableIn1: [],
			TableIn2: []
		}, {
			async: true,
			success: function(result) {
				this._gateway.prepareLog('PortletsMobile.generate ${url} success'.interpolate(url), arguments).log();

				$('.ehr-body .container-fluid').html([
					'<div class="portlet-masonry-wrapper mx-auto">',
						'<div class="row portlet-masonry">',
							'<div class="col portlet-col"></div>',
						'</div>',
					'</div>'
				].join(''));

				var TableIn2Map = {},
				selected = [],
				isCarousel = false;

				$.map(result.TableIn2.results, function(o) {
					TableIn2Map[o.Potid] = o;
				});

				this.itemMap = {};
				this.items = $.map(result.TableIn1.results, function(o) {
					if (this.portletTypeMap[o.Potid]) {
						$.extend(o, TableIn2Map[o.Potid]);
						if (o.Fixed !== 'X' && o.Zhide !== 'X') {
							selected.push(1);
						}
						if (o.Mocat === 'A') {
							isCarousel = true;
						}
						return this.itemMap[o.Potid] = new this.portletTypeMap[o.Potid](this._gateway, o);
					}
				}.bind(this));

				if (!selected.length) {
					setTimeout(function() {
						$('.portlet-masonry-wrapper').html('<div class="portlet-data-not-found"><span>조회된 Portlet 정보가 없습니다.</span></div>');
					}, 0);
					return;
				}

				var $carousel, carouselIndex = 0;
				if (isCarousel) {
					$carousel = $(this.carousel());
					$carousel
						.on('slide.bs.carousel', function(e) {
							var t = $('#portlet-carousel .nav-link[data-slide="${index}"]'.interpolate(e.to)).toggleClass('active', true);
							t.parent().siblings().find('.nav-link').toggleClass('active', false);

							var item = this.itemMap[t.data('itemKey')];
							if (typeof item.onSlide === 'function') {
								item.onSlide();
							}
						}.bind(this));

					$(document).on('click', '#portlet-carousel .nav-link', function() {
						var t = $(this).toggleClass('active', true);
						t.parent().siblings().find('.nav-link').toggleClass('active', false);
						$('#portlet-carousel').carousel(t.data('slide'));
					});

					$('.portlet-col').append($carousel);
				}

				this.items.sort(function(item1, item2) {
					return item1.position() - item2.position();
				});

				$.map(this.items, function(item) {
					if (item.use()) {
						if (item.carousel()) {
							$carousel.find('.nav').append([
								'<li class="nav-item">',
									'<a class="nav-link" href="#" data-slide="${index}" data-item-key="${key}">${title}</a>'.interpolate(carouselIndex, item.key(), item.title()),
								'</li>'
							].join(''));
							$carousel.find('.carousel-indicators').append('<li data-target="#portlet-carousel" data-slide-to="${index}"></li>'.interpolate(carouselIndex++));

							item.appendTo('.carousel-inner', true); // Portlet UI rendering
						} else {
							if (item.key() === 'P101') {
								item.prependTo('.portlet-col', true); // Portlet UI rendering
							} else {
								item.appendTo('.portlet-col', true); // Portlet UI rendering
							}
						}
					}
				});

				if (isCarousel) {
					setTimeout(function() {
						$('#portlet-carousel .nav-item:first-child .nav-link,#portlet-carousel .carousel-item:first-child,#portlet-carousel .carousel-indicators li:first-child').addClass('active');
					}, 0);

					setTimeout(function() {
						$carousel.carousel({
							interval: 5000
						});
					}, 0);
				}

				this._gateway.spinner(false);

				resolve({ data: result });
			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'PortletsMobile.generate ' + url);

				$('.ehr-body .container-fluid').html([
					'<div class="portlet-masonry-wrapper mx-auto">',
						'<div class="portlet-data-not-found"><span>조회된 Portlet 정보가 없습니다.</span></div>',
					'</div>'
				].join(''));

				this._gateway.alert({ title: '오류', html: [
					'<p>Portlet 정보를 조회하지 못했습니다.',
					'화면을 새로고침 해주세요.<br />',
					'같은 문제가 반복될 경우 HR 시스템 담당자에게 문의하세요.</p>'
				].join('<br />') });

				this._gateway.spinner(false);
				
				reject(jqXHR);
			}.bind(this)
		});
	}.bind(this));
}

});