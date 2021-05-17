/* global AbstractPortlet moment */
function EvalGoalPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '.portlet-evalgoal .list-group';
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
		'<div class="card portlet portlet-${size}h portlet-evalgoal" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	var url = '/odata/v2/GoalPlanTemplate?$select=id,defaultTemplate&$filter=defaultTemplate eq true';

	return $.getJSON({
		url: url,
		success: function(data) {

			var list = this.$();
			var results = data.d.results;
			if (!results || !results.length) {
				if (list.data('jsp')) {
					list.find('.list-group-item').remove().end()
						.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action border-0 data-not-found">평가목표가 없습니다.</a>');
				} else {
					list.html('<a href="#" class="list-group-item list-group-item-action border-0 data-not-found">평가목표가 없습니다.</a>');
				}
				return;
			}

			var oDataId = results[0].id;
			var url2 = '/odata/v2/Goal_' + oDataId + "?$select=name,done&$filter=userId eq '" + this._gateway.pernr() + "'";
			$.getJSON({
				url: url2,
				success: function(data) {
					var oDetailData = data.d.results;
					var oBackGround = [
						"bg-danger",
						"bg-warning",
						"bg-info",
						"bg-success"
					];

					if (!oDetailData.length) {
						if (list.data('jsp')) {
							list.find('.list-group-item').remove().end()
								.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action border-0 data-not-found">평가목표가 없습니다.</a>');
						} else {
							list.html('<a href="#" class="list-group-item list-group-item-action border-0 data-not-found">평가목표가 없습니다.</a>');
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
								'<div class="my-evalgoal-info">',
									'<pre class="mylist">',
										// i + 1 + '.' + v.name,
										(v.name || '').split(/\n/)[0],
									'</pre>',
									'<div class="evalgoal-statusBar">',
										'<div class="progress">',
											'<div style="height: auto;" class="progress-bar i' + i + ' ' + oGroundColor + ' ' +'" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
												parseInt(v.done) + '%',
											'</div>',
										'</div>',
									'</div>',
								'</div>'
							].join(''));

							$('.progress-bar.i' + i).animate({ width: parseInt(v.done) + '%' }, 2000);
						}, 0);
					});
				}.bind(this),
				error: function(jqXHR) {
					this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalPortlet.fill ' + url2);
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