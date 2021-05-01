/* global AbstractPortlet moment */
function EvalGoalProgressingPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '.portlet-evalgoal-progress .list-group';
	this.photoMap = null;
	this.goalDataMap = null;
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
		'<div class="card portlet portlet-${size}h portlet-evalgoal-progress" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			cardHeader,
			'<div class="card-body">',
				'<div class="evalgoal-legend d-none">평균진척률</div>',
				'<div class="list-group"></div>',				
			'</div>',
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	var url = '/odata/v2/GoalPlanTemplate?$filter=defaultTemplate eq true&$format=json&$select=id,defaultTemplate';

	return $.getJSON({ // Id받아옴
		url: url,
		success: function(data) {
			this.retrieveDirectReports(this._gateway.odataResults(data).id || '');
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
},

retrieveDirectReports: function(goalId) { // 평가사원들 조회

	var url2 = "/odata/v2/User('${pernr}')/directReports?$select=userId,nickname,custom01".interpolate(this._gateway.pernr());

	$.getJSON({ // 평가 대상자조회 조회한 사원번호의 평가대상자를 조회
		url: url2,
		success: function(data) {
			var oEmpData = data.d.results;
			var list = this.$();

			if (!oEmpData.length) {
				$('.portlet-evalgoal-progress .evalgoal-legend').toggleClass('d-none', true);

				if (list.data('jsp')) {
					list.find('.list-group-item').remove().end()
						.data('jsp').getContentPane().prepend('<a href="#" class="list-group-item list-group-item-action border-0 text-center">평가대상이 없습니다.</a>');
				} else {
					list.html('<a href="#" class="list-group-item list-group-item-action border-0 text-center">평가대상이 없습니다.</a>');
				}
				return;
			}

			$('.portlet-evalgoal-progress .evalgoal-legend').toggleClass('d-none', false);

			if (list.data('jsp')) {
				list = list.find('.list-group-item').remove().end().data('jsp').getContentPane();
			}

			this.photoMap = {};
			this.goalDataMap = {};

			oEmpData.forEach(function(e, i) {
				this.goalDataMap[e.userId] = {
					nickname: e.nickname,
					position: e.custom01 ? e.custom01.split("(")[0] : ""
				};

				Promise.all([
					this.retrievePhoto(e.userId),
					this.retrieveGoalData(e.userId, goalId)
				]).then(function() {
					setTimeout(function() {
						var goalData = this.goalDataMap[e.userId],
							score = parseFloat(goalData.score);

						list.append([
							'<div class="evalgoal-area">',
								'<img src="${src}" style="width:40px; height:50px"/>'.interpolate(this.photoMap[e.userId]),
								'<div class="evalgoal-info">',
									'<div class="person">',
										'<div class="name">', goalData.nickname, '</div>',
										'<div class="position">', goalData.position, '</div>',
									'</div>',
									'<div class="evalgoal-statusBar">',
										'<div class="progress">',
											'<div style="height:auto" style="width:0" class="progress-bar i${i} ${groundColor}"'.interpolate(i, goalData.groundColor),
												' role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
												score > 0 ? goalData.score + '%' : '',
											'</div>',
										'</div>',
									'</div>',
								'</div>',
							'</div>'
						].join(''));

						if (score > 0) {
							$('.progress-bar.i' + i).animate({ width: score + '%' }, 2000);
						}
					}.bind(this), 0);
				}.bind(this));
			}.bind(this));
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url2);
		}.bind(this)
	});
},

retrievePhoto: function(userId) { // 사원사진

	var url3 = "/odata/v2/Photo?$filter=userId eq '${pernr}' and photoType eq '1' &$select=photo,mimeType".interpolate(userId);

	return $.getJSON({ // 사진조회
		url: url3,
		success: function(data) {
			var result = this._gateway.odataResults(data);
			if (!$.isEmptyObject(result)) {
				this.photoMap[userId] = 'data:${mimeType};base64,${photo}'.interpolate(result.mimeType, result.photo);
			} else {
				this.photoMap[userId] = 'images/photoNotAvailable.gif';
			}
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url3);
		}.bind(this)
	}).promise();
},

retrieveGoalData: function(pernr, goalId) { // 사원목표정보

	var url4 = "/odata/v2/Goal_${goalId}?$select=name,done&$filter=userId eq '${pernr}'".interpolate(goalId, pernr);

	return $.getJSON({ // 목표조회
		url: url4,
		success: function(data) {
			var oDetailData = data.d.results;
			var vDetailIndex = oDetailData.length;
			var oGroundColor = "",
				vScore = 0;
			var oBackGround = [
				"bg-danger",    /* bg-lcc-signature-red */
				"bg-warning",   /* bg-signature-orange */
				"bg-info",      /* bg-lcc-signature-green */ 
				"bg-success"    /* bg-lcc-signature-blue */
			];

			if(vDetailIndex !== 0){
				for(var i=0; i<vDetailIndex; i++){
					vScore += parseFloat(oDetailData[i].done);
				}
				vScore = vScore/vDetailIndex;
			}
			
			if(parseFloat(vScore) > 80)
				oGroundColor= oBackGround[3];
			else if(parseFloat(vScore) > 60)
				oGroundColor= oBackGround[2];
			else if(parseFloat(vScore) > 30)
				oGroundColor= oBackGround[1];
			else 
				oGroundColor= oBackGround[0];

			this.goalDataMap[pernr].score = vScore;
			this.goalDataMap[pernr].groundColor = oGroundColor;
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url4);
		}.bind(this)
	}).promise();
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
			this.$().data('jsp').destroy();
			resolve();
		}.bind(this), 0);
	}.bind(this));
}

});