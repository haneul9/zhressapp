/* global AbstractPortlet moment */
function CalendarPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.yearMonth = null;
	this.dailyStyleMap = null;
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
						'<span>5</span>',
						'<span class="unit">명</span>',
					'</li>',
					'<li class="list-group-item education">',
						'<h6>교육</h6>',
						'<span>10</span>',
						'<span class="unit">명</span>',
					'</li>',
					'<li class="list-group-item biztrip">',
						'<h6>출장</h6>',
						'<span>100</span>',
						'<span class="unit">명</span>',
					'</li>',
					'<li class="list-group-item telecommuting">',
						'<h6>재택근무</h6>',
						'<span>50</span>',
						'<span class="unit">명</span>',
					'</li>',
					'<li class="list-group-item birthday">',
						'<h6>생일</h6>',
						'<span>3</span>',
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
	this.dailyStyleMap = {};

	this.initI18n();

	$('.portlet-calendar-inline').datepicker(this.i18n({
		showOtherMonths: true,
		selectOtherMonths: true,
		changeMonth: true,
		changeYear: true,
		beforeShowDay: function(date) {

			var mDate = moment(date),
			dailyStyle = this.dailyStyleMap[mDate.format(this._gateway.loginInfo('Dtfmt').toUpperCase())];
			if (mDate.isSame('2021-04-07')) {
				return [true, 'absence absence-start', ''];
			}
			if (mDate.isSame('2021-04-08')) {
				return [true, 'absence absence-between', ''];
			}
			if (mDate.isSame('2021-04-09')) {
				return [true, 'absence absence-end', ''];
			}
			if (mDate.isSame('2021-04-10') || mDate.isSame('2021-04-11')) {
				return [true, 'holiday', ''];
			}
			return [true, '', ''];
		}.bind(this),
		onSelect: function(dateText) {

			this.renderDailyReport(dateText);
		}.bind(this),
		onChangeMonthYear: function(year, month) {

			this.yearMonth = [year, String.lpad(month, 2, '0')].join('');
			this.fill();
		}.bind(this)
	}));
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
			TableIn1: [], // 달력 : 일자/요일키/휴일flag(근무일정상 휴일)/휴무(2001)정보 여부 flag
			TableIn2: [], // 본인 근태 : 휴무유형명, 시작일, 종료일
			TableIn3: [], // 부서 휴가 인원 : 이름/직위명/휴가명/기간
			TableIn4: [], // 부서 교육 인원 : 이름/직위명/기간
			TableIn5: [], // 부서 출장 인원 : 이름/직위명/기간
			TableIn6: [], // 부서 재택 인원 : 이름/직위명/기간
			TableIn7: []  // 부서 생일 인원 : 이름/직위명/양음력 표기
		},
		success: function(data) {
			this._gateway.prepareLog('CalendarPortlet.fill ${url} success'.interpolate(url), arguments).log();

			this.dailyStyleMap = {};
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'CalendarPortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
renderDailyReport: function(dateText) {

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

	var Dtfmt = this._gateway.loginInfo('Dtfmt');

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