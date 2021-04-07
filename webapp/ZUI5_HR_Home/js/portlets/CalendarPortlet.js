/* global AbstractPortlet */
function CalendarPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.yearMonth = null;
	this.dailyReportMap = null;
}

CalendarPortlet.prototype = Object.create(AbstractPortlet.prototype);
CalendarPortlet.prototype.constructor = CalendarPortlet;

$.extend(CalendarPortlet.prototype, {

ui: function() {

	return [
		'<div class="card portlet portlet-${size}h portlet-calendar" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			'<div class="card-header">',
				'<h6>${title}</h6>'.interpolate(this.title()),
				'<div>',
					this.dismissButton(),
				'</div>',
			'</div>',
			'<div class="card-body">',
				'<div class="portlet-calendar-inline"></div>',
				'<h6 class="portlet-calendar-date">Today</h6>',
				'<div class="portlet-calendar-daily-report list-group list-group-horizontal flex-wrap">',
					'<li class="list-group-item vacation">',
						'<h6>휴가</h6>',
						'<span class="count">5</span>',
						'<span class="unit">명</span>',
					'</li>',
					'<li class="list-group-item education">',
						'<h6>교육</h6>',
						'<span class="count">10</span>',
						'<span class="unit">명</span>',
					'</li>',
					'<li class="list-group-item biztrip">',
						'<h6>출장</h6>',
						'<span class="count">100</span>',
						'<span class="unit">명</span>',
					'</li>',
					'<li class="list-group-item telecommuting">',
						'<h6>재택근무</h6>',
						'<span class="count">50</span>',
						'<span class="unit">명</span>',
					'</li>',
					'<li class="list-group-item birthday">',
						'<h6>생일</h6>',
						'<span class="count">3</span>',
						'<span class="unit">명</span>',
					'</li>',
				'</div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
onceBefore: function() {

	this.yearMonth = moment().format('YYYYMM');
	this.dailyReportMap = {};

	this.initI18n();

	$('.portlet-calendar-inline').datepicker(this.i18n({
		showOtherMonths: true,
		selectOtherMonths: true,
		changeMonth: true,
		changeYear: true,
		beforeShowDay: function(date) {

			var classes = [],
			mDate = moment(date).format(this._gateway.loginInfo('Dtfmt').toUpperCase()),
			dailyReport = this.dailyReportMap[mDate];
			if (mDate === '2021-04-06') {
				classes.push('absence absence-start');
			}
			else if (mDate === '2021-04-07') {
				classes.push('absence absence-between');
			}
			else if (mDate === '2021-04-08') {
				classes.push('absence absence-end');
			}
			else if (mDate === '2021-04-27') {
				classes.push('absence');
			}
			if (dailyReport.holiday) {
				classes.push('holiday');
			}
			return [true, classes.join(' '), ''];
		}.bind(this),
		onSelect: function(dateText) {

			this.renderDailyReport(dateText);
		}.bind(this),
		onChangeMonthYear: function(year, month) {

			this.yearMonth = [year, String.lpad(month, 2, '0')].join('');
			this.fill();
		}.bind(this)
	}));

	$('.portlet-calendar .list-group-item')
		.popover({
			html: true,
			container: 'body',
			placement: 'top',
			template: [
				'<div class="popover" role="tooltip">',
					'<div class="arrow"></div>',
					'<h6 class="popover-header"></h6>',
					'<div class="popover-body"></div>',
				'</div>'
			].join(''),
			content: function() {
				var item = $(this), colgroup, thead, tbody;
				// 휴가
				if (item.hasClass('vacation')) {
					colgroup = '<col /><col /><col /><col />';
					thead = '';
				}
				// 교육 / 출장 / 재택근무
				else if (item.hasClass('education') || item.hasClass('biztrip') || item.hasClass('telecommuting')) {
					colgroup = '<col /><col /><col />';
					thead = '';
				}
				// 생일
				else {
					colgroup = '<col /><col /><col />';
					thead = '';
				}
				return [
					'<table class="portlet-calendar-popover">',
						'<colgroup>', colgroup, '</colgroup>',
						'<thead>', thead, '</thead>',
						'<tbody>', tbody, '</tbody>',
					'</table>'
				].join('');
			}
		})
		.on('show.bs.popover', function() {
			
		});
		// .on('hidden.bs.popover', function() {
		// 	$(this).remove();
		// });
},
fill: function() {

	var url = this.odataUrl(), // ZHR_COMMON_SRV/MainContentsCalSet
	loginInfo = this._gateway.loginInfo();

	return this._gateway.post({
		url: url,
		data: {
			IPernr: this._gateway.pernr(),
			IBukrs: loginInfo.Bukrs,
			ILangu: loginInfo.Langu,
			IMonth: this.yearMonth,
			IDatum: Date.toODataString(),
			TableIn1: [], // 달력 : 일자/요일키/휴일flag(근무 일정상 휴일)/휴무(2001)정보 여부 flag
			TableIn2: [], // 본인 근태 : 휴무유형명, 시작일, 종료일
			TableIn3: [], // 부서 휴가 인원 : 이름/직위명/휴가명/기간
			TableIn4: [], // 부서 교육 인원 : 이름/직위명/기간
			TableIn5: [], // 부서 출장 인원 : 이름/직위명/기간
			TableIn6: [], // 부서 재택 인원 : 이름/직위명/기간
			TableIn7: []  // 부서 생일 인원 : 이름/직위명/양음력 표기
		},
		success: function(data) {
			this._gateway.prepareLog('CalendarPortlet.fill ${url} success'.interpolate(url), arguments).log();

			var results = this._gateway.odataResults(data),
			Dtfmt = this._gateway.loginInfo('Dtfmt').toUpperCase();

			var dailyReportMap = this.dailyReportMap = {};
			$.map(results.TableIn1, function(o) {
				dailyReportMap[moment(Number.fromODataDate(o.Datum)).format(Dtfmt)] = {
					holiday: o.HolFlag === 'X',
					absence: o.P2001Flag === 'X'
				};
			});
			$.map(results.TableIn2, function(o) { // 본인 근태
				this.addDailyReport(o, 'self');
			});

			results.TableIn3 = [
				{ Begda: '/Date(1617548400000)/', Endda: '/Date(1617721200000)/' }, // 0405 - 0407
				{ Begda: '/Date(1617634800000)/', Endda: '/Date(1617721200000)/' }, // 0406 - 0407
				{ Begda: '/Date(1618326000000)/', Endda: '/Date(1618412400000)/' }, // 0414 - 0415
				{ Begda: '/Date(1618758000000)/', Endda: '/Date(1618844400000)/' }  // 0419 - 0420
			];
			$.map(results.TableIn3, function(o) { // 휴가
				this.addDailyReport(o, 'vacation');
			}.bind(this));
			$.map(results.TableIn4, function(o) { // 교육
				this.addDailyReport(o, 'education');
			}.bind(this));
			$.map(results.TableIn5, function(o) { // 출장
				this.addDailyReport(o, 'biztrip');
			}.bind(this));
			$.map(results.TableIn6, function(o) { // 재택
				this.addDailyReport(o, 'telecommuting');
			}.bind(this));
			$.map(results.TableIn7, function(o) { // 생일
				this.addDailyReport(o, 'birthday');
			}.bind(this));
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'CalendarPortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
addDailyReport: function(o, type) {

	$.map(this.toDateArray(o.Begda, o.Endda), function(date) {
		var array = this.dailyReportMap[date][type];
		if (array) {
			array.push(o);
		} else {
			this.dailyReportMap[date][type] = [o];
		}
	}.bind(this));
},
toDateArray: function(begda, endda) {

	begda = !begda ? moment() : moment(Number.fromODataDate(begda));
	endda = !endda ? moment() : moment(Number.fromODataDate(endda));

	var Dtfmt = this._gateway.loginInfo('Dtfmt').toUpperCase();
	return $.map(new Array(moment.duration(endda.diff(begda)).days() + 1), function(n, i) {
		return begda.clone().add(i, 'days').format(Dtfmt);
	});
},
renderDailyReport: function(dateText) {

	var ko = this._gateway.locale() === 'ko_KR',
	unit = ko ? '명' : '',
	pattern = ko ? 'YYYY년 MM월 DD일' : 'MM/DD/YYYY',
	dailyReport = this.dailyReportMap[dateText];

	$('.portlet-calendar-date').text(moment(dateText.replace(/\D/g, ''), 'YYYYMMDD').format(pattern));

	$.map('vacation,education,biztrip,telecommuting,birthday'.split(','), function(key) {
		$('.list-group-item.${key} .count'.interpolate(key)).text((dailyReport[key] || []).length + unit);
	});
},
changeLocale: function() {

	this.spinner(true);

	$('.portlet-calendar-inline').datepicker('option', this.i18n());

	this.fill();
	this.renderDailyReport();
},
i18n: function(defaults) {

	return $.extend(true, defaults || {}, $.datepicker.regional[this._gateway.locale() === 'ko_KR' ? 'ko_KR' : 'en_US']);
},
initI18n: function() {

	var Dtfmt = this._gateway.loginInfo('Dtfmt').toLowerCase().replace(/yyyy/, 'yy');

	$.datepicker.regional.ko_KR = {
		closeText: '닫기',
		prevText: '이전달',
		nextText: '다음달',
		currentText: '오늘',
		monthNames: [ '1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월' ],
		monthNamesShort: [ '1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월' ],
		dayNames: [ '일요일','월요일','화요일','수요일','목요일','금요일','토요일' ],
		dayNamesShort: [ '일','월','화','수','목','금','토' ],
		dayNamesMin: [ '일','월','화','수','목','금','토' ],
		weekHeader: '주',
		dateFormat: Dtfmt,
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: '<span>년</span>'
	};
	$.datepicker.regional.en_US = $.extend(true, {}, $.datepicker.regional[''], {
		monthNames: [ '1','2','3','4','5','6','7','8','9','10','11','12' ],
		monthNamesShort: [ '1','2','3','4','5','6','7','8','9','10','11','12' ],
		dayNamesShort: [ 'S','M','T','W','T','F','S' ], // 'Sun','Mon','Tue','Wed','Thu','Fri','Sat'
		dayNamesMin: [ 'S','M','T','W','T','F','S' ], // 'Su','Mo','Tu','We','Th','Fr','Sa'
		dateFormat: Dtfmt,
		yearSuffix: ''
	});
}

});