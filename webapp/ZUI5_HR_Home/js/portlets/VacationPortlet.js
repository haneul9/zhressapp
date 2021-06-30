/* global AbstractPortlet Chart ChartDataLabels moment */
function VacationPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-vacationportlet-list';
}

VacationPortlet.prototype = Object.create(AbstractPortlet.prototype);
VacationPortlet.prototype.constructor = VacationPortlet;

$.extend(VacationPortlet.prototype, {

ui: function() {

	var cardHeader = this.hideTitle() ? '' : [
		'<div class="card-header">',
			'<h6>${title}</h6>'.interpolate(this.title()),
			'<div>',
				this.dismissButton(),
				this.link(true),
			'</div>',
		'</div>'
	].join('');

	return [
		'<div class="card portlet portlet-${size}h portlet-vacation" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group" id="portlet-vacationportlet-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},

getTime: function (d) {
    if (d == null || d == '') return 0;

    if (d.length > 8 && d.indexOf('-') < 0) {
        d = d.replace(/[^\d]/g, '-');
    } else if (d.length == 8) {
        d = d.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    } else if (d.length < 8) {
        return 0;
    }
    var vTmp1 = new Date(d);
    if (vTmp1.getTimezoneOffset() < 0) {
        vTmp1.setTime(vTmp1.getTime() - vTmp1.getTimezoneOffset() * 60000);
    } else {
        vTmp1.setTime(vTmp1.getTime() + vTmp1.getTimezoneOffset() * 60000);
    }
    return vTmp1.getTime();
},

checkNull: function (v) {
    return v === undefined || v === null || v == '' ? true : false;
},

fill: function() {

    this._gateway.setModel('ZHR_LEAVE_APPL_SRV');

    return new Promise(function (resolve, reject) {
		var url = 'ZHR_LEAVE_APPL_SRV/VacationQuotaSet',
        oEmpInfo = this._gateway.loginInfo();

        this._gateway.getModel('ZHR_LEAVE_APPL_SRV').create('/VacationQuotaSet', {
			IPernr : oEmpInfo.Pernr,
            IBukrs : oEmpInfo.Bukrs,
            ILangu : oEmpInfo.Langu,
            IMolga : oEmpInfo.Molga,
            IDatum : moment().hours(9).toDate(),
            ICorre : 'X',
            VacationQuotaNav : []
		}, {
			async: true,
			success: function(result) {
				this._gateway.prepareLog('VacationPortlet.fill ${url} success'.interpolate(url), arguments).log();

                var list = this.$(),
                    oVacationData = result.VacationQuotaNav.results;

                if (!oVacationData.length) {
                    list.html('<a href="#" class="list-group-item data-not-found">휴가사용 현황 데이터가 없습니다.</a>');

                    this.spinner(false);

                    return;
                }

                list.append([
                    '<canvas id="vacChart" class="ChartClass"></canvas>',
                    '<div class="vac-header">',
                        '<div style="width:40%">구분</div>',
                        '<div style="width:20%; text-align:right">발생</div>',
                        '<div style="width:20%; text-align:right">사용</div>',
                        '<div style="width:20%; text-align:right">잔여</div>',
                    '</div>',
                    '<div class="vacationTable" class="vac-body"></div>'
                ].join(''));

                var vChartId = document.getElementById('vacChart').getContext('2d');
                var vList1 = [],
                    vList2 = [],
                    vList3 = [];

                oVacationData.forEach(function(e, i) {
                    if(i > 2) return;

                    var vKtext = e.Ktext, // 구분
                        vAnzhl = parseFloat(e.Anzhl), // 발생
                        vKverb = parseFloat(e.Kverb), // 사용
                        vReman = parseFloat(e.Reman); // 잔여

                    $('.vacationTable').append([
                    '<div class="vac-body">',
                        '<div style="width:40%">',
                            vKtext,
                        '</div>',
                        '<div style="width:20%; text-align:right">',
                            vAnzhl,
                        '</div>',
                        '<div style="width:20%; text-align:right">',
                            vKverb,
                        '</div>',
                        '<div style="width:20%; text-align:right">',
                            vReman,
                        '</div>',
                    '</div>'
                    ].join(''));

                    vList1.push(vKtext);
                    vList2.push(vKverb);
                    vList3.push(vReman);
                });

                var chart = new Chart(vChartId, { // type : 'bar' = 막대차트를 의미합니다.
                    type: 'bar',
                    data: {
                        labels: vList1,
                        datasets: [
                            {
                                label: '사용',
                                // maxBarThickness: '40px',
                                // barPercentage: 0.6,
                                // categoryPercentage: 0.6,
                                barThickness: oVacationData.length === 1 ? 40 : 20,
                                backgroundColor: 'rgb(141, 198, 63)',
                                data: vList2
                            },
                            {
                                label: '잔여',
                                // maxBarThickness: '40px',
                                // barPercentage: 0.6,
                                // categoryPercentage: 0.6,
                                barThickness: oVacationData.length === 1 ? 40 : 20,
                                backgroundColor: 'rgb(221, 238, 197)',
                                data: vList3
                            }
                        ]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    fontColor : 'rgb(153, 153, 153)',
                                    fontSize : 8,
                                    beginAtZero: true
                                }
                            }]
                        },
                        plugins: {
                            datalabels: {
                                color: '#064975'
                            }
                        }
                    },
                    plugins: [ChartDataLabels]
                });

                $('.ChartClass').append([chart]);

                this.spinner(false);

				resolve({ data: result });
			}.bind(this),
			error: function(jqXHR) {
                this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'VacationPortlet.fill ' + url);

                this.spinner(false);

				reject(jqXHR);
			}.bind(this)
		});
	}.bind(this));
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
},
itemUrl: function(o) {

	return [
		' data-popup-menu-url="${url}?Sdate=${Sdate}&Skey=${Skey}"'.interpolate(this.url(), o.Sdate, o.Skey),
		' data-menu-id="${menu-id}"'.interpolate(this.mid())
	].join('');
}

});