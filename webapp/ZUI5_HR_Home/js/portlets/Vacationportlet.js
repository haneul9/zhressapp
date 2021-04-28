/* eslint-disable no-undef */
/* global AbstractPortlet moment */
function Vacationportlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-vacationportlet-list';
}

Vacationportlet.prototype = Object.create(AbstractPortlet.prototype);
Vacationportlet.prototype.constructor = Vacationportlet;

$.extend(Vacationportlet.prototype, {

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
		'<div class="card portlet portlet-${size}h portlet-bbs" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group" id="portlet-vacationportlet-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},

getTime: function (d) {
    if (d == null || d == "") return 0;

    if (d.length > 8 && d.indexOf("-") < 0) {
        d = d.replace(/[^\d]/g, "-");
    } else if (d.length == 8) {
        d = d.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3");
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
    return v === undefined || v === null || v == "" ? true : false;
},

fill: function() {

	var url = 'ZHR_LEAVE_APPL_SRV/VacationQuotaSet';
    var oEmpInfo = this._gateway.loginInfo();

	return this._gateway.post({
		url: url,
		data: {
			IPernr : oEmpInfo.Pernr,
            IBukrs : oEmpInfo.Bukrs,
            ILangu : oEmpInfo.Langu,
            IMolga : oEmpInfo.Molga,
            IDatum : "\/Date(" + this.getTime(new Date()) + ")\/",
            ICorre : "X",
            VacationQuotaNav : []
		},
		success: function(data) {
			this._gateway.prepareLog('Vacationportlet.fill ${url} success'.interpolate(url), arguments).log();

			var list = this.$(),
                oVacationData = this._gateway.odataResults(data).VacationQuotaNav;

            if (!oVacationData.length) {
                if (list.data('jsp')) {
                    list.find('.list-group-item').remove().end()
                        .data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action text-center">휴가사용 현황 데이터가 없습니다..</a>');
                } else {
                    list.html('<a href="#" class="list-group-item list-group-item-action text-center">휴가사용 현황 데이터가 없습니다..</a>');
                }
                return;
            }

            if (list.data('jsp')) {
                list = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
            }

            
			list.append([
                '<canvas id="vacChart" class="ChartClass"></canvas>',
                '<div style="display: flex; justify-content: space-between; padding: 8px; background-color: rgb(241 241 241); margin-top: 20px;">',
                    '<div style="font-size: 14px; font-weight: bold; position: absolute;">',
                        "구분",
                    '</div>',
                    '<div style="font-size: 14px; font-weight: bold; margin-left: 26%; position: relative; width: 20%; text-align: end;">',
                        "발생",
                    '</div>',
                    '<div style="font-size: 14px; font-weight: bold; position: relative; width: 25%; text-align: end;">',
                        "사용",
                    '</div>',
                    '<div style="font-size: 14px; font-weight: bold; position: relative; width: 30%; text-align: end;">',
                        "잔여",
                    '</div>',
                '</div>',
                '<div class="vacationTable" style="display: flex; flex-direction: column; padding: 8px;"></div>'
            ].join(''));

            var vChartId = document.getElementById('vacChart').getContext('2d');
            var vList1 = [],
                vList2 = [],
                vList3 = [];
            
            oVacationData.forEach(function(e, i) {
                var vKtext = e.Ktext, // 구분
                    vAnzhl = parseInt(e.Anzhl), // 발생
                    vKverb = parseInt(e.Kverb), // 사용
                    vReman = parseInt(e.Reman); // 잔여

                $('.vacationTable').append([
                '<div style="display: flex; margin-bottom: 5px;">',
                    '<div style="font-size: 14px; font-weight: bold; position: absolute; width: 30%; display: inline-block;">',
                        vKtext,
                    '</div>',
                    '<div style="font-size: 14px; font-weight: bold; margin-left: 26%; position: relative; width: 20%; text-align: end;">',
                        vAnzhl,
                    '</div>',
                    '<div style="font-size: 14px; font-weight: bold; position: relative; width: 25%; text-align: end;">',
                        vKverb,
                    '</div>',
                    '<div style="font-size: 14px; font-weight: bold; position: relative; width: 30%; text-align: end;">',
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
                            backgroundColor: 'rgb(130,235,55)', 
                            borderColor: 'rgb(255, 99, 132)',
                            data: vList2
                        },
                        { 
                            label: '잔여',
                            backgroundColor: 'rgb(50,118,234)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: vList3
                        }
                    ] 
                },
                options: {
                    categoryPercentage: 0.1
                }
            });

            $('.ChartClass').append([chart]);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'Vacationportlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
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
},
clearResource: function() {

	return new Promise(function(resolve) {
		setTimeout(function() {
			this.$().data('jsp').destroy();
			resolve();
		}.bind(this), 0);
	}.bind(this));
}

});