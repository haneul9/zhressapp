﻿/* global AbstractPortlet moment */
function EvalGoalPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-evalGoalPortlet-list';
}

EvalGoalPortlet.prototype = Object.create(AbstractPortlet.prototype);
EvalGoalPortlet.prototype.constructor = EvalGoalPortlet;

$.extend(EvalGoalPortlet.prototype, {

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
				'<div class="list-group" id="portlet-evalGoalPortlet-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	var url = '/odata/v2/GoalPlanTemplate?$select=id,defaultTemplate&$filter=defaultTemplate eq true&$format=json';
	
	return $.getJSON({
		url: url,
		success: function(data) {
			var oDataId = data.d.results[0].id;
			var url2 = '/odata/v2/Goal_' + oDataId + "?$select=name,done&$filter=userId eq '" + this._gateway.pernr() + "'&$format=json";
			$.getJSON({
				url: url2,
				success: function(data) {
					var oDetailData = data.d.results;
					var list = this.$();
					var oBackGround = [
						"bg-danger",
						"bg-warning",
						"bg-info",
						"bg-success"
					];

					if (!oDetailData.length) {
						if (list.data('jsp')) {
							list.find('.list-group-item').remove().end()
								.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action text-center">평가목표가 없습니다.</a>');
						} else {
							list.html('<a href="#" class="list-group-item list-group-item-action text-center">평가목표가 없습니다.</a>');
						}
						return;
					}

					if (list.data('jsp')) {
						list = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
					}

					$.map(oDetailData, function(v, i) {
						var oGroundColor = "";
						
						if(parseFloat(v.done) > 80)
							oGroundColor= oBackGround[3];
						else if(parseFloat(v.done) > 60)
							oGroundColor= oBackGround[2];
						else if(parseFloat(v.done) > 30)
							oGroundColor= oBackGround[1];
						else 
							oGroundColor= oBackGround[0];

						setTimeout(function() {
							list.append([
								'<div style="height: auto; margin-bottom: 15px; display: flex; flex-direction: column">',
									'<div style="font-size: 14px; height: 25px;">',
										i + 1 + '.' + v.name,
									'</div>',
									'<div style="display: flex; justify-content: flex-end">',
										'<div class="progress" style="height: 20px; width: 50%; display: flex;">',
											'<div style="height: auto;" class="progress-bar i' + i + ' ' + oGroundColor + ' ' +'" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
												parseFloat(v.done) + '%',
											'</div>',
										'</div>',
									'</div>',
								'</div>'
							].join(''));

							$('.progress-bar.i' + i).animate({ width: parseFloat(v.done) + '%' }, 2000);
						}, 0);
					});
				}.bind(this),
				error: function(jqXHR) {
					this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url);
				}.bind(this),
				complete: function() {
					this.spinner(false);
				}.bind(this)
			});
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},
onceAfter: function() {

	var list = this.$();
	if (!list.data('jsp')) {
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
itemUrl: function(o) {

	return [
		' data-popup-menu-url="${url}?Sdate=${Sdate}&Seqnr=${Seqnr}"'.interpolate(this.url(), o.Sdate, o.Seqnr),
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