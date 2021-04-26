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
			this.spinner(false),
		'</div>'
	].join('');
},
fill: function() {

	var url = '/odata/v2/GoalPlanTemplate?$filter=defaultTemplate eq true&$format=json&$select=id, defaultTemplate';
	
	return $.getJSON({ // Id받아옴
		url: url,
		success: function(data) {
			var oDataId = data.d.results[0].id;
			var url2 = "/odata/v2/User('" + this._gateway.pernr() +"')/directReports?$select=userId,nickname,custom01&$format=json";
            
			$.getJSON({ // 평가 대상자조회 조회한 사원번호의 평가대상자를 조회
				url: url2,
				success: function(data) {
					var oEmpData = data.d.results;
					var list = this.$();
					var oEmpPoto = "",
						vEmpName = "",
						vEmpPosition = "";
					var oBackGround = [
						"bg-danger",
						"bg-warning",
						"bg-info",
						"bg-success"
					];

					if (!oEmpData.length) {
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
					
					oEmpData.forEach(function(e) {
						var url3 = "/odata/v2/Photo?$filter=userId eq '" + e.userId + "' and photoType eq '1' &$select=photo&format=json";
						vEmpName = e.nickname;
						vEmpPosition = e.custom01;

						$.getJSON({ // 사진조회
							url: url3,
							success: function(data) {
								oEmpPoto = data.poto ? data.poto : 'images/photoNotAvailable.gif';	
							}.bind(this),
							error: function(jqXHR) {
								this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url);
							}.bind(this),
							complete: function(data) {
								oEmpPoto = data.poto ? data.poto : 'images/photoNotAvailable.gif';	
							}.bind(this)
						});

						url3 = "/odata/v2/Goal_" + oDataId +"?$select=name,done&$filter=userId eq '" + e.userId + "'&$format=json";
						$.getJSON({ // 목표조회
							url: url3,
							success: function(data) {
								var oDetailData = data.d.results;
								var vIndex = oDetailData.length;
								var oGroundColor = "",
									vScore = 0;

								if(vIndex !== 0){
									for(var i=0; i<vIndex; i++){
										vScore += parseInt(oDetailData[i].done);
									}
									vScore = vScore/vIndex;
								}
						
								$.map(oDetailData, function(v, i) {
									if(parseInt(vScore) > 80)
										oGroundColor= oBackGround[3];
									else if(parseInt(vScore) > 60)
										oGroundColor= oBackGround[2];
									else if(parseInt(vScore) > 30)
										oGroundColor= oBackGround[1];
									else 
										oGroundColor= oBackGround[0];
									
									setTimeout(function() {
										list.append([
											'<img src="${src}" style="width: 70px; height: 100px;"/>'.interpolate(oEmpPoto),
											'<div style="height: auto; margin-bottom: 15px; display: flex; flex-direction: column">',
												'<div style="font-size: 14px; height: 25px;">',
												vEmpName + vEmpPosition,
												'</div>',
												'<div style="display: flex; justify-content: flex-end">',
													'<div class="progress" style="height: 20px; width: 50%; display: flex;">',
														'<div style="height: auto;" class="progress-bar i' + i + ' ' + oGroundColor + ' ' +'" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
														vScore + '%',
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
								this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url);
							}.bind(this),
							complete: function(data) {
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