/* global AbstractPortlet Chart ChartDataLabels moment */
function VacationForHQPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.chart = null;
}

VacationForHQPortlet.prototype = Object.create(AbstractPortlet.prototype);
VacationForHQPortlet.prototype.constructor = VacationForHQPortlet;

$.extend(VacationForHQPortlet.prototype, {

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
		'<div class="card portlet portlet-${size}h portlet-vacation-for-hq" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="blue-banner">',
					'<div class="blue-banner-title">전체 연차 사용율</div>',
					'<div class="blue-banner-value">0%</div>',
				'</div>',
				'<canvas id="chart-vacation-for-hq" style="margin-top:15px; width:340px; height:235px"></canvas>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},

onceBefore: function() {

	this.chart = new Chart($('#chart-vacation-for-hq'), {
		type: 'horizontalBar',
		data: {
			labels: [],
			datasets: [{
				label: '연차 사용율',
				data: [],
				barPercentage: 0.6,
				backgroundColor: 'rgb(141, 198, 63)'
			}]
		},
		options: {
			scales: {
				xAxes: [{
					ticks: {
						fontColor: 'rgb(153, 153, 153)',
						fontSize: 8,
						min: 0,
						max: 100,
						stepSize: 10
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
},

fill: function() {

	this._gateway.setModel("ZHR_LEAVE_APPL_SRV");

	var url = 'ZHR_LEAVE_APPL_SRV/YeaQuotaMainSet';
	var loginInfo = this._gateway.loginInfo();

	return new Promise(function (resolve, reject) {
		var oModel = this._gateway.getModel("ZHR_LEAVE_APPL_SRV");
		
		oModel.create("/YeaQuotaMainSet", {
			IPernr: loginInfo.Pernr,
			ILangu: loginInfo.Langu,
			YeaQuotaNav: []
		}, {
			async: true,
			success: function(result) {
				this._gateway.prepareLog('VacationForHQPortlet.fill ${url} success'.interpolate(url), arguments).log();

				var YeaQuotaNav = result.YeaQuotaNav.results;

				if (!YeaQuotaNav.length) {
					this.cardBody().find('.blue-banner-value').text('0%');

					this.spinner(false);
					
					return;
				}

				var totalPercentage = YeaQuotaNav.shift();
				this.cardBody().find('.blue-banner-value').text(String.toNumber(totalPercentage.Userte) + '%');

				// this.chart.data.datasets[0].barThickness = YeaQuotaNav.length === 1 ? 40 : 20;
				$.map(YeaQuotaNav, function(o) {
					this.chart.data.labels.push(o.HgradeT);
					this.chart.data.datasets[0].data.push(String.toNumber(o.Userte));
				}.bind(this));

				this.chart.update();

				this.spinner(false);

				resolve({ data: result });
			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'VacationForHQPortlet.fill ' + url);

				this.spinner(false);
				
				reject(jqXHR);
			}.bind(this)
		});
	}.bind(this));
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
}

});