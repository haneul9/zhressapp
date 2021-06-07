/* global AbstractPortlet Chart moment */
function EvalCollFinPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '.portlet-evalcollfin .list-group';
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
				'<div class="list-group"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	var url = 'ZHR_APPRAISAL_SRV/FinalEvalResultGradeSet';

	return this._gateway.post({
		url: url,
		data: {
			IAppye: String(new Date().getFullYear() - 1),
			IPernr: this._gateway.pernr(),
			TableIn: []
		},
		success: function(data) {

			var list = this.$(),
			TableIn = this._gateway.odataResults(data).TableIn;
			if (!TableIn.length) {
				if (list.data('jsp')) {
					list.find('.list-group-item').remove().end()
						.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action data-not-found">결과조회가 없습니다.</a>');
				} else {
					list.html('<a href="#" class="list-group-item list-group-item-action data-not-found">결과조회가 없습니다.</a>');
				}
				return;
			}

			if (list.data('jsp')) {
				list = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
			}

			list.prepend($.map(TableIn, function(o) {
				return [
					'<canvas id="vacChart" class="ChartClass"></canvas>',
					'<div class="portlet-detail-popover list-group-item">',
					'</div>'
				].join('');
			}.bind(this)).join(''));

			var vChartId = document.getElementById('vacChart').getContext('2d');
			var oLabel = {};
				oLabel.S = 0,
				oLabel.A = 0,
				oLabel.B = 0,
				oLabel.C = 0,
				oLabel.D = 0;
			
			TableIn.forEach(function(e) {

				switch(e.Pgrade1) {
					case "S" :	oLabel.S = oLabel.S + 1; break;
					case "A" :	oLabel.A = oLabel.A + 1; break;
					case "B" :	oLabel.B = oLabel.B + 1; break;
					case "C" :	oLabel.C = oLabel.C + 1; break;
					case "D" :	oLabel.D = oLabel.D + 1; break;
				}
			});

			Chart.defaults.global.defaultFontColor = 'black';
			var chart = new Chart(vChartId, { // type : 'doughnut'
                type: 'doughnut',
                data: { 
                    datasets: [{
						data: [oLabel.S, oLabel.A, oLabel.B, oLabel.C, oLabel.D],
						backgroundColor: [
							'rgb(255, 148, 123)', 
							'rgb(255, 180, 0)',   
							'rgb(158, 208, 170)',
							'rgb(127, 202, 215)',
							'rgb(214, 173, 255)'
						]
					}],
					labels: ["S", "A", "B", "C", "D"]
                },
                options: {
                    fontColor: "rgb(63,66,60)",
					plugins: {
						legend: {
						  position: 'top'
						}
					},
					events: ['click'],
					onClick: function(oEvent) {
						$('.portlet-detail-popover').empty();

						$('.portlet-detail-popover').append([
							'<div class="toplabel" style="display: flex;; border: 1px solid; justify-content: space-between;">',
								'<div>',
									"이름",
								'</div>',
								'<div>',
									"직급",
								'</div>',
								'<div>',
									"년차",
								'</div>',
								'<div>',
									String(new Date().getFullYear() - 1) + "년",
								'</div>',
								'<div>',
									String(new Date().getFullYear() - 2) + "년",
								'</div>',
								'<div>',
									String(new Date().getFullYear() - 3) + "년",
								'</div>',
							'</div>'
						].join(''));

						TableIn.forEach(function(e) {
							$('.portlet-detail-popover .toplabel').prepend([
								'<div style="display: flex; flex-direction: column; justify-content: space-between;">',
									'<div>',
										e.Ename,
									'</div>',
									'<div>',
										e.ZpGradetx,
									'</div>',
									'<div>',
										e.ZpGradeyear,
									'</div>',
									'<div>',
										e.Pgrade1,
									'</div>',
									'<div>',
										e.Pgrade2,
									'</div>',
									'<div>',
										e.Pgrade3,
									'</div>',
								'</div>'
							].join(''));
						});
					}
                }
            });

            $('.ChartClass').append([chart]);

		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'evalcollfin.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
onceAfter: function() {

	var list = this.$();
	if (!list.data('jsp') && this.scrollable()) {
		list.jScrollPane({
			resizeSensor: true,
			verticalGutter: 0,
			horizontalGutter: 0
		});
	}
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
},
clearResource: function() {

	return new Promise(function(resolve) {
		setTimeout(function() {
			var jsp = this.$().data('jsp');
			if (jsp) {
				jsp.destroy();
			}
			resolve();
		}.bind(this), 0);
	}.bind(this));
}

});