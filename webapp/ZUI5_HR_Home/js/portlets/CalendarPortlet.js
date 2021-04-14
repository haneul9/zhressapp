/* global AbstractPortlet */
function CalendarPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.pattern = null;
	this.yearMonth = null;
	this.calendarMap = null;
	this.selectedDate = null;
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
				'<div class="d-flex">',
					'<h6 class="portlet-calendar-date">Today</h6>',
					'<button type="button" class="btn btn-sm btn-outline-dark button-today">',
						'<span aria-hidden="true">Today</span>',
					'</button>',
				'</div>',
				'<div class="portlet-calendar-daily-report list-group list-group-horizontal flex-wrap">',
					'<li class="list-group-item" data-type="vacation">',
						'<h6>휴가</h6>',
						'<span class="count">0</span>',
						'<span class="unit"></span>',
					'</li>',
					'<li class="list-group-item" data-type="education">',
						'<h6>교육</h6>',
						'<span class="count">0</span>',
						'<span class="unit"></span>',
					'</li>',
					'<li class="list-group-item" data-type="biztrip">',
						'<h6>출장</h6>',
						'<span class="count">0</span>',
						'<span class="unit"></span>',
					'</li>',
					'<li class="list-group-item" data-type="telecommuting">',
						'<h6>재택근무</h6>',
						'<span class="count">0</span>',
						'<span class="unit"></span>',
					'</li>',
					'<li class="list-group-item" data-type="birthday">',
						'<h6>생일</h6>',
						'<span class="count">0</span>',
						'<span class="unit"></span>',
					'</li>',
				'</div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
onceBefore: function() {

	this.initI18n();

	this.yearMonth = moment().format('YYYYMM');
	this.calendarMap = {};

	this.initCalendar();
	this.initPopover();
},
fill: function() {

	var url = 'ZHR_COMMON_SRV/MainContentsCalSet',
	loginInfo = this._gateway.loginInfo();

	return this._gateway.post({
		url: url,
		data: {
			IPernr: this._gateway.pernr(),
			IBukrs: loginInfo.Bukrs,
			ILangu: loginInfo.Langu,
			IMonth: this.yearMonth,
			IDatum: Date.toODataString(true),
			TableIn1: [],	// 달력 : 일자/요일키/휴일flag(근무 일정상 휴일)/휴무(2001)정보 여부 flag
			TableIn2: []	// 본인 근태 : 휴무유형명, 시작일, 종료일
		},
		success: function(data) {
			this._gateway.prepareLog('CalendarPortlet.fill ${url} success'.interpolate(url), arguments).log();

			var results = this._gateway.odataResults(data),
			pattern = this.pattern.moment;

			/*
				this.calendarMap = {
					20210401: {
						holiday: false,
						absence: false,
						absenceStart: false,
						absenceBetween: false,
						absenceEnd: false,
						vacation: [],
						education: [],
						biztrip: [],
						telecommuting: [],
						birthday: []
					},
					...,
					20210430: {
						holiday: false,
						absence: false,
						absenceStart: false,
						absenceBetween: false,
						absenceEnd: false,
						vacation: [],
						education: [],
						biztrip: [],
						telecommuting: [],
						birthday: []
					}
				};
			*/
			var calendarMap = this.calendarMap = {};
			$.map(results.TableIn1, function(o) {
				calendarMap[moment(Number.fromODataDate(o.Datum)).format(pattern)] = {
					holiday: o.HolFlag === 'X',
					absence: false, // o.P2001Flag === 'X',
					absenceStart: false,
					absenceBetween: false,
					absenceEnd: false,
					vacation: [],
					education: [],
					biztrip: [],
					telecommuting: [],
					birthday: []
				};
			});

			$.map(results.TableIn2, function(o) { // 본인 근태
				this.setAbsence(o);
			}.bind(this));

			this.calendar().datepicker('refresh');

			var today = moment();
			if (this.yearMonth === today.format('YYYYMM')) {
				this.retrieveDailyReport(today.format(pattern));
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'CalendarPortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
setAbsence: function(o) {

	var calendarMap = this.calendarMap,
	dateTextArray = this.toDateTextArray(o.Begda, o.Endda),
	length = dateTextArray.length;
	$.map(dateTextArray, function(dateText, i) {
		var dayData = calendarMap[dateText];
		if (!dayData) {
			return;
		}
		dayData.absenceName = o.AwartTxt || '';
		dayData.absence = true;
		if (i > 0 && i < length - 1) {
			dayData.absenceBetween = true;
		}
	});

	if (length > 1) {
		(calendarMap[dateTextArray[0]] || {}).absenceStart = true;
		(calendarMap[dateTextArray[length - 1]] || {}).absenceEnd = true;
	}
},
toDateTextArray: function(begda, endda) {

	begda = !begda ? moment() : moment(Number.fromODataDate(begda));
	endda = !endda ? moment() : moment(Number.fromODataDate(endda));

	var pattern = this.pattern.moment;
	return $.map(new Array(moment.duration(endda.diff(begda)).days() + 1), function(n, i) {
		return begda.clone().add(i, 'days').format(pattern);
	});
},
retrieveDailyReport: function(dateText) {

	var url = 'ZHR_COMMON_SRV/MainContentsCalSet',
	loginInfo = this._gateway.loginInfo(),
	calendarMap = this.calendarMap[dateText];

	return this._gateway.post({
		url: url,
		data: {
			IPernr: this._gateway.pernr(),
			IBukrs: loginInfo.Bukrs,
			ILangu: loginInfo.Langu,
			IMonth: this.yearMonth,
			IDatum: Date.toODataString(dateText, true),
			TableIn3: [], // 부서 휴가 인원 : 이름/직위명/휴가명/기간
			TableIn4: [], // 부서 교육 인원 : 이름/직위명/기간
			TableIn5: [], // 부서 출장 인원 : 이름/직위명/기간
			TableIn6: [], // 부서 재택 인원 : 이름/직위명/기간
			TableIn7: []  // 부서 생일 인원 : 이름/직위명/양음력 표기
		},
		success: function(data) {
			this._gateway.prepareLog('CalendarPortlet.retrieveDailyReport ${url} success'.interpolate(url), arguments).log();

			var results = this._gateway.odataResults(data);

			calendarMap.vacation = results.TableIn3;		// 휴가
			calendarMap.education = results.TableIn4;		// 교육
			calendarMap.biztrip = results.TableIn5;			// 출장
			calendarMap.telecommuting = results.TableIn6;	// 재택
			calendarMap.birthday = results.TableIn7;		// 생일

			this.renderDailyReport(dateText);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'CalendarPortlet.retrieveDailyReport ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
renderDailyReport: function(dateText) {

	var unit = this.countUnit,
	dayData = this.calendarMap[dateText] || {};

	this.selectedDate = dateText;

	var mDate = moment(dateText, this.pattern.moment);
	$('.portlet-calendar-date').text([mDate.format(this.pattern.report), moment().format(this.pattern.moment) === dateText ? '(Today)' : ''].join(' '));

	$.map('vacation,education,biztrip,telecommuting,birthday'.split(','), function(type) {
		$('.list-group-item[data-type="${type}"]'.interpolate(type))
			.find('.count').text((dayData[type] || []).length).end()
			.find('.unit').text(unit);
	});
},
calendar: function() {

	return $('.portlet-calendar-inline');
},
initCalendar: function() {

	this.calendar().datepicker(this.i18n({
		showOtherMonths: true,
		selectOtherMonths: true,
		changeMonth: true,
		changeYear: true,
		beforeShowDay: function(date) {

			var dateText = moment(date).format(this.pattern.moment),
			dayData = this.calendarMap[dateText] || {},
			classes = [];

			if (!dayData) {
				return [false, '', ''];
			}

			if (dayData.holiday) {
				classes.push('holiday');
			}
			if (dayData.absence) {
				classes.push('absence');
			}
			if (dayData.absenceStart) {
				classes.push('absence-start');
			} else if (dayData.absenceBetween) {
				classes.push('absence-between');
			} else if (dayData.absenceEnd) {
				classes.push('absence-end');
			}

			return [true, classes.join(' '), dayData.absenceName || ''];
		}.bind(this),
		onSelect: function(dateText) {

			this.retrieveDailyReport(dateText);
		}.bind(this),
		onChangeMonthYear: function(year, month) {

			this.yearMonth = [year, String.lpad(month, 2, '0')].join('');
			this.fill();
		}.bind(this)
	}));

	$(document).on('click', '.button-today', function() {
		var dateText = moment().format(this.pattern.moment);
		this.calendar().datepicker('setDate', dateText);
		this.retrieveDailyReport(dateText);
	}.bind(this));
},
initPopover: function() {

	var portlet = this,
	template = [
		'<div class="tooltip" role="tooltip">',
			'<div class="arrow"></div>',
			'<div class="tooltip-inner"></div>',
		'</div>'
	].join('');

	$('.portlet-calendar .list-group-item[data-type="vacation"]') // 휴가 인원 목록
		.tooltip({
			html: true,
			sanitize: false,
			container: '.portlet-calendar',
			placement: 'top',
			template: template,
			title: function() {
				var tooltipBody = portlet.tooltipBody(portlet.selectedDate, $(this).data('type'));
				if (!tooltipBody.length) {
					return '해당 인원이 없습니다.';
				}
				return [
					'<table class="portlet-calendar-tooltip">',
						'<colgroup>',
							'<col style="width:100px" /><col style="width:100px" /><col style="width:100px" /><col style="width:100px" />',
						'</colgroup>',
						'<thead>',
							'<tr><th>이름</th><th>직위</th><th>휴가명</th><th>기간</th></tr>',
						'</thead>',
						'<tbody>',
							tooltipBody,
						'</tbody>',
					'</table>'
				].join('');
			}
		});

	$([
		'.portlet-calendar .list-group-item[data-type="education"]',	// 교육 인원 목록
		'.portlet-calendar .list-group-item[data-type="biztrip"]',		// 출장 인원 목록
		'.portlet-calendar .list-group-item[data-type="telecommuting"]'	// 재택근무 인원 목록
	].join(','))
		.tooltip({
			html: true,
			sanitize: false,
			container: '.portlet-calendar',
			placement: 'top',
			template: template,
			title: function() {
				var tooltipBody = portlet.tooltipBody(portlet.selectedDate, $(this).data('type'));
				if (!tooltipBody.length) {
					return '해당 인원이 없습니다.';
				}
				return [
					'<table class="portlet-calendar-tooltip">',
						'<colgroup>', 
							'<col style="width:100px" /><col style="width:100px" /><col style="width:100px" />',
						'</colgroup>',
						'<thead>',
							'<tr><th>이름</th><th>직위</th><th>기간</th></tr>',
						'</thead>',
						'<tbody>',
							tooltipBody,
						'</tbody>',
					'</table>'
				].join('');
			}
		});

	$('.portlet-calendar .list-group-item[data-type="birthday"]') // 생일 인원 목록
		.tooltip({
			html: true,
			sanitize: false,
			container: '.portlet-calendar',
			placement: 'top',
			template: template,
			title: function() {
				var tooltipBody = portlet.tooltipBody(portlet.selectedDate, $(this).data('type'));
				if (!tooltipBody.length) {
					return '해당 인원이 없습니다.';
				}
				return [
					'<table class="portlet-calendar-tooltip">',
						'<colgroup>',
							'<col style="width:100px" /><col style="width:100px" /><col style="width:100px" />',
						'</colgroup>',
						'<thead>',
							'<tr><th>이름</th><th>직위</th><th>양음</th></tr>',
						'</thead>',
						'<tbody>',
							tooltipBody,
						'</tbody>',
					'</table>'
				].join('');
			}
		});
},
tooltipBody: function(dateText, type) {

	var list = (this.calendarMap[dateText] || {})[type] || [];
	if (type === 'vacation') {
		return $.map(list, function(o) { // 휴가
			return [
				'<tr>',
					'<td>', o.Ename || '', '</td>',
					'<td>', o.ZtitleTxt || '', '</td>',
					'<td>', o.AwartTxt || '', '</td>',
					'<td>', this.period(o), '</td>',
				'</tr>'
			].join('');
		}.bind(this)).join('');
	}
	if ($.inArray(type, 'education,biztrip,telecommuting'.split(',')) > -1) {
		return $.map(list, function(o) { // 교육, 출장, 재택근무
			return [
				'<tr>',
					'<td>', o.Ename || '', '</td>',
					'<td>', o.ZtitleTxt || '', '</td>',
					'<td>', this.period(o), '</td>',
				'</tr>'
			].join('');
		}.bind(this)).join('');
	}
	if (type === 'birthday') {
		return $.map(list, function(o) { // 생일
			return [
				'<tr>',
					'<td>', o.Ename || '', '</td>',
					'<td>', o.ZtitleTxt || '', '</td>',
					'<td>', o.Zzclass === '2' ? '음력' : '양력', '</td>',
				'</tr>'
			].join('');
		}).join('');
	}
	return '';
},
period: function(o) {

	if (!o.Begda && !o.Endda) {
		return '';
	}

	var result = [];
	if (o.Begda) {
		result.push(moment(Number.fromODataDate(o.Begda)).format(this.pattern.period));
	}
	if (o.Endda && o.Endda !== o.Begda) {
		result.push(moment(Number.fromODataDate(o.Endda)).format(this.pattern.period));
	}
	return result.join(' ~ ');
},
i18n: function(defaults) {

	return $.extend(true, defaults || {}, $.datepicker.regional[this.locale]);
},
initI18n: function() {

	setTimeout(function () {
		$('.portlet-calendar .list-group-item[data-type="vacation"] h6').text(this._gateway.i18n('home.text.portlets.calendar.vacation'));
		$('.portlet-calendar .list-group-item[data-type="education"] h6').text(this._gateway.i18n('home.text.portlets.calendar.education'));
		$('.portlet-calendar .list-group-item[data-type="biztrip"] h6').text(this._gateway.i18n('home.text.portlets.calendar.biztrip'));
		$('.portlet-calendar .list-group-item[data-type="telecommuting"] h6').text(this._gateway.i18n('home.text.portlets.calendar.telecommuting'));
		$('.portlet-calendar .list-group-item[data-type="birthday"] h6').text(this._gateway.i18n('home.text.portlets.calendar.birthday'));
	}.bind(this), 0);

	var ko = this._gateway.locale() === 'ko_KR';

	this.locale = ko ? 'ko_KR' : 'en_US';
	this.countUnit = ko ? '명': '';
	this.pattern = {
		datepicker: 'yymmdd',
		moment: 'YYYYMMDD',
		report: ko ? 'YYYY년 MM월 DD일' : 'MM/DD/YYYY',
		period: ko ? 'DD일' : 'DD'
	};

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
		dateFormat: this.pattern.datepicker,
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
		dateFormat: this.pattern.datepicker,
		yearSuffix: ''
	});
},
changeLocale: function() {

	this.spinner(true);

	this.initI18n();
	this.calendar().datepicker('option', this.i18n());

	this.fill();
}

});