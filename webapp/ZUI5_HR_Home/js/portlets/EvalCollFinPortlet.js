/* global AbstractPortlet Chart ChartDataLabels moment */
function EvalCollFinPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '.portlet-evalcollfin-popover .popover-scroll';
	this.chart = null;
	this.items = null;
	this.popoverBodyTemplate = null;
	this.popoverBodyMap = null;
	this.clickedLabel = null;
}

EvalCollFinPortlet.prototype = Object.create(AbstractPortlet.prototype);
EvalCollFinPortlet.prototype.constructor = EvalCollFinPortlet;

$.extend(EvalCollFinPortlet.prototype, {

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
		'<div class="card portlet portlet-${size}h portlet-evalcollfin" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div style="position:relative; margin:30px auto; width:250px">',
					'<canvas id="chart-evalcollfin" style="width:250px; height:250px"></canvas>',
				'</div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
onceBefore: function() {

	this._gateway.setModel('ZHR_APPRAISAL_SRV');

	this.chart = new Chart($('#chart-evalcollfin'), {
		type: 'doughnut',
		data: {
			labels: ['S', 'A', 'B', 'C', 'D'],
			datasets: [
				{
					data: [0, 0, 0, 0, 0],
					backgroundColor: [
						'rgb(255, 148, 123)',
						'rgb(255, 180, 0)',
						'rgb(158, 208, 170)',
						'rgb(127, 202, 215)',
						'rgb(214, 173, 255)'
					]
				}
			]
		},
		options: {
			responsive: true,
			legend: {
				position: 'bottom',
				align: 'center'
			},
			fontColor: 'rgb(63, 66, 60)',
			tooltips: {
				enabled: false
			},
			events: [ 'click' ],
			onClick: function(event, points) {
				this._gateway.log('EvalCollFinPortlet chart onclick', arguments);

				if (this.popover && this.popover.hasClass('chart-popover')) {
					this.popover
						.toggleClass('chart-popover', false)
						.off('inserted.bs.popover')
						.off('hide.bs.popover')
						.popover('dispose');
				}

				if (!points.length) {
					return;
				}

				this.clickedLabel = points[0]._view.label;
				this.popover = $(event.target);
				this.popover
					.toggleClass('chart-popover', true)
					.on('inserted.bs.popover', this.popoverInserted.bind(this))
					.on('hidden.bs.popover', this.popoverHidden.bind(this))
					.popover({
						html: true,
						sanitize: false,
						container: '.portlet-evalcollfin',
						placement: 'bottom',
						trigger: 'manual',
						template: '<div class="popover portlet-evalcollfin-popover" role="tooltip"><div class="arrow"></div><div class="popover-body"></div></div>',
						content: this.popoverBodyTemplate.interpolate(this.popoverBodyMap[this.clickedLabel].join(''))
					})
					.popover('show');
			}.bind(this),
			plugins: {
				datalabels: {
					color: '#000',
					formatter: function(value, context) {
						value = parseInt(value);
						return value === 0 ? '' : (value / (this.items || []).length * 100).toFixed(1) + '%';
					}.bind(this)
				}
			}
		},
		plugins: [ChartDataLabels]
	});

	// Tooltip 외부 영역 클릭시 tooltip 숨기기
	$(document)
		.off('click', '*:not(#chart-evalcollfin.chartjs-render-monitor)')
		.on('click', '*:not(#chart-evalcollfin.chartjs-render-monitor)', function(e) {

			if ($(e.target).is('#chart-evalcollfin.chartjs-render-monitor')) {
				e.stopImmediatePropagation();
			} else {
				setTimeout(function() {
					$('.chart-popover').toggleClass('chart-popover', false).popover('dispose');
				}, 0);
			}
		});
},
fill: function() {

	var url = 'ZHR_APPRAISAL_SRV/FinalEvalResultGradeSet';

	return new Promise(function(resolve, reject) {
		this._gateway.getModel('ZHR_APPRAISAL_SRV').create('/FinalEvalResultGradeSet', {
			IAppye: String(new Date().getFullYear() - 1),
			IPernr: this._gateway.pernr(),
			TableIn: []
		}, {
			async: true,
			success: function(data) {
				this._gateway.prepareLog('EvalCollFinPortlet.fill ${url} success'.interpolate(url), arguments).log();

				this.items = data.TableIn.results;

				var currentYear = new Date().getFullYear(),
				map = this.popoverBodyMap = { S: [], A: [], B: [], C: [], D: [] };

				this.popoverBodyTemplate = [
					'<div class="popover-scroll">',
						'<table>',
							'<colgroup>',
								'<col /><col /><col /><col /><col /><col />',
							'</colgroup>',
							'<thead>',
								'<tr>',
									'<th>성명</th>',
									'<th>직급</th>',
									'<th>년차</th>',
									'<th>', --currentYear, '년</th>',
									'<th>', --currentYear, '년</th>',
									'<th>', --currentYear, '년</th>',
								'</tr>',
							'</thead>',
							'<tbody>',
								'${tbody}',
							'</tbody>',
						'</table>',
					'</div>'
				].join('');

				this.items.forEach(function(o) {
					var tr = [
						'<tr>',
							'<td>', o.Ename, '</td>',
							'<td>', o.ZpGradetx, '</td>',
							'<td>', o.ZpGradeyear, '</td>',
							'<td>', o.Pgrade1, '</td>',
							'<td>', o.Pgrade2, '</td>',
							'<td>', o.Pgrade3, '</td>',
						'</tr>'
					].join('');

					switch(o.Pgrade1) {
						case 'S':
							map.S.push(tr);
							break;
						case 'A':
							map.A.push(tr);
							break;
						case 'B':
							map.B.push(tr);
							break;
						case 'C':
							map.C.push(tr);
							break;
						case 'D':
							map.D.push(tr);
							break;
					}
				});

				this.chart.data.datasets[0].data = [
					map.S.length,
					map.A.length,
					map.B.length,
					map.C.length,
					map.D.length
				];
				this.chart.update();

				this.spinner(false);

				resolve({ data: data });

			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalCollFinPortlet.fill ' + url);

				this.spinner(false);

				reject(jqXHR);
			}.bind(this)
		});
	}.bind(this));
},
popoverInserted: function() {

	setTimeout(function() {
		this.$(true).jScrollPane({
			resizeSensor: true,
			verticalGutter: 0,
			horizontalGutter: 0
		});
	}.bind(this), 0);
},
popoverHidden: function() {

	setTimeout(function() {
		var jsp = this.$(true).data('jsp');
		if (jsp) {
			jsp.destroy();
		}
	}.bind(this), 0);
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
},
clearResource: function() {

	return new Promise(function(resolve) {
		setTimeout(function() {
			var jsp = this.$(true).data('jsp');
			if (jsp) {
				jsp.destroy();
			}
			resolve();
		}.bind(this), 0);
	}.bind(this));
}

});