/* global AbstractPortlet moment */
function EvalGoalProgressingPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '#portlet-evalGoalProgressingPortlet-list';
}

EvalGoalProgressingPortlet.prototype = Object.create(AbstractPortlet.prototype);
EvalGoalProgressingPortlet.prototype.constructor = EvalGoalProgressingPortlet;

$.extend(EvalGoalProgressingPortlet.prototype, {

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
		'<div class="card portlet portlet-${size}h portlet-bbs" datakey="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="list-group" id="portlet-evalGoalProgressingPortlet-list"></div>',
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	var url = '/odata/v2/GoalPlanTemplate?$filter=defaultTemplate eq true&$format=json&$select=id, defaultTemplate';
	
	return $.getJSON({
		url: url,
		success: function(data) {
			var oDataId = data.d.results[0].id;
			var url2 = "/odata/v2/User('" + this._gateway.pernr() +"')/directReports?$select=userId,nickname,custom02&$format=json";
            
			$.getJSON({
				url: url2,
				success: function(data) {
					var oEmpData = data.d.results;
					
					oEmpData.forEach(function(e) {
						var url3 = "/v2/Photo?$filter=userId eq '" + e.userId + "' and photoType eq '1' &$select=photo&format=json";
						$.getJSON({
							url: url3,
							success: function(d) {
								var oDetailData = d.poto;
								
								
							}.bind(this),
							error: function(jqXHR) {
								this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url);
							}.bind(this),
							complete: function() {
								
							}.bind(this)
						});

						url3 = "/v2/Goal_" + oDataId +"?$select=name,done&$filter=userId eq '" + e.userId + "'&$format=json";
						$.getJSON({
							url: url3,
							success: function(data) {
								var oDetailData = data.d.results;
								
								
							}.bind(this),
							error: function(jqXHR) {
								this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url);
							}.bind(this),
							complete: function() {
								
							}.bind(this)
						});
					});


				}.bind(this),
				error: function(jqXHR) {
					this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url);
				}.bind(this),
				complete: function() {
					this.spinner(false);
				}.bind(this)
			});
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url);
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