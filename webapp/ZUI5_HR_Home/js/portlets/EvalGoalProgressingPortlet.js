/* global AbstractPortlet moment */
function EvalGoalProgressingPortlet() {

	AbstractPortlet.apply(this, arguments);

	this.$selector = '.portlet-evalgoal-progress .list-group';
	this.photoMap = null;
	this.goalDataMap = null;
	this.targetList = [];
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

	return new Promise(function(resolve, reject) {
		$.getJSON({ // GoalPlanTemplate id 조회
			url: url,
			success: function(data) {
				this.getTargetReports(this._gateway.odataResults(data).id || '', resolve);
			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url);
				this.spinner(false);
				reject();
			}.bind(this)
		});
	}.bind(this));
},
getTargetReports: function(goalId, resolve) { // 평가대상 확인여부
	var url = 'ZHR_COMMON_SRV/CommonCodeListHeaderSet';

	this._gateway.getModel('ZHR_COMMON_SRV').create('/CommonCodeListHeaderSet', {
		ICodeT : '066',
		NavCommonCodeList : []
	}, {
		async: true,
		success: function(result) {
			this._gateway.prepareLog('EvalGoalProgressingPortlet.fill ${url} success'.interpolate(url), arguments).log();
			var oTargetList = result.NavCommonCodeList.results;
			this.targetList = oTargetList;
			this.retrieveDirectReports(goalId, resolve);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url);
			this.spinner(false);
		}.bind(this)
	});
},
retrieveDirectReports: function(goalId, resolve) { // 평가사원들 조회

	var url2 = "/odata/v2/User('${pernr}')/directReports?$select=userId,nickname,custom01,custom07,custom04".interpolate(this._gateway.pernr());

	$.getJSON({ // 평가 대상자 조회 : 조회한 사원번호의 평가대상자를 조회
		url: url2,
		success: function(data) {
			var oEmpDataList = data.d.results,
				empDataList = [],
				exEmpDataList = [],
				list = this.$();

			oEmpDataList.forEach(function(e) {
				if (this.checkNull(!e.custom04)) {
					this.targetList.forEach(function(ele) {
						if (ele.Code === e.custom07) {
							e.Seqnr = ele.Seqnr;
							exEmpDataList.push(e);
						}
					});

					exEmpDataList.sort(function(a, b) {
						if (a.Seqnr === b.Seqnr) {
							var x = a.nickname.toLowerCase();
							var y = b.nickname.toLowerCase();
							return x < y ? -1 : x > y ? 1 : 0;
						}
						return a.Seqnr - b.Seqnr;
					});
				}else {
					this.targetList.forEach(function(ele) {
						if (ele.Code === e.custom07) {
							e.Seqnr = ele.Seqnr;
							empDataList.push(e);
						}
					});

					empDataList.sort(function(a, b) {
						if (a.Seqnr === b.Seqnr) {
							var x = a.nickname.toLowerCase();
							var y = b.nickname.toLowerCase();
							return x < y ? -1 : x > y ? 1 : 0;
						}
						return a.Seqnr - b.Seqnr;
					});
				}
			}.bind(this));

			empDataList = empDataList.concat(exEmpDataList);

			if (!empDataList.length) {
				$('.portlet-evalgoal-progress .evalgoal-legend').toggleClass('d-none', true);

				if (list.data('jsp')) {
					list.find('.evalgoal-area,list-group-item').remove().end()
						.data('jsp').getContentPane().prepend('<span class="list-group-item data-not-found">평가대상이 없습니다.</span>');
				} else {
					list.html('<span class="list-group-item data-not-found">평가대상이 없습니다.</span>');
				}

				setTimeout(function() {
					this.spinner(false);
					resolve();
				}.bind(this), 0);

				return;
			}

			if (list.data('jsp')) {
				list = list.find('.evalgoal-area,list-group-item').remove().end().data('jsp').getContentPane();
			}

			this.photoMap = {};
			this.goalDataMap = {};

			$.map(empDataList, function(e, i) {
				this.goalDataMap[e.userId] = {
					nickname: e.nickname,
					position: e.custom01 ? e.custom01.split('(')[0] : ''
				};

				list.append([
					'<div class="evalgoal-area i${i}">'.interpolate(i),
						'<img src="images/photoNotAvailable.gif" style="width:40px; height:50px" />',
						'<div class="evalgoal-info">',
							'<div class="person">',
								'<div class="name">', e.nickname, '</div>',
								'<div class="position">', e.custom01, '</div>',
							'</div>',
							'<div class="evalgoal-statusBar">',
								'<div class="progress">',
									'<div style="height:auto" style="width:0" class="progress-bar i${i}"'.interpolate(i),
										' role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				].join(''));
			}.bind(this));

			setTimeout(function() {
				resolve();
			}, 0);

			setTimeout(function() {
				Promise.all(
					$.map(empDataList, function(e, i) {
						return Promise.all([
							this.retrievePhoto(e.userId),
							this.retrieveGoalData(e.userId, goalId, i)
						]).then(function() {
							var goalData = this.goalDataMap[e.userId],
							score = parseInt((goalData.score || 0).toFixed()),
							area = $('.evalgoal-area.i' + i);

							area.find('img').attr('src', this.photoMap[e.userId]);

							if ($('.evalgoal-area').length === 1) {
								setTimeout(function() {
									resolve();
								}, 0);
							}

							if (score > 0) {
								area.find('.progress-bar.i' + i)
									.addClass(goalData.groundColor)
									.animate({
										width: score + '%'
									}, 2e3, 'linear', function() {
										$(this).text(score + '%');
									});
							}
						}.bind(this));
					}.bind(this))
				).then(function() {
					if (!$('.evalgoal-area').length) {
						$('.portlet-evalgoal-progress .evalgoal-legend').toggleClass('d-none', true);

						if (list.data('jsp')) {
							list.data('jsp').getContentPane().prepend('<span class="list-group-item data-not-found">평가대상이 없습니다.</span>');
						} else {
							list.html('<span class="list-group-item data-not-found">평가대상이 없습니다.</span>');
						}
					} else {
						$('.portlet-evalgoal-progress .evalgoal-legend').toggleClass('d-none', false);
					}

					this.spinner(false);
				}.bind(this));
			}.bind(this), 0);
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url2);
			this.spinner(false);
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

	if(this.checkNull(goalId)){
		this.goalDataMap[pernr].score = 0;
		this.goalDataMap[pernr].groundColor = 'bg-danger';
	}else {
		var url4 = "/odata/v2/Goal_${goalId}?$select=name,done&$filter=userId eq '${pernr}'".interpolate(goalId, pernr);

		return $.getJSON({ // 목표조회
			url: url4,
			success: function(data) {
				var oDetailData = data.d.results;

				var vDetailIndex = oDetailData.length,
				oGroundColor = '',
				vScore = 0,
				oBackGround = [
					'bg-danger',    /* bg-lcc-signature-red */
					'bg-warning',   /* bg-signature-orange */
					'bg-info',      /* bg-lcc-signature-green */
					'bg-success'    /* bg-lcc-signature-blue */
				];

				if (vDetailIndex !== 0) {
					for (var i = 0; i < vDetailIndex; i++) {
						vScore += parseFloat(oDetailData[i].done);
					}
					vScore = vScore / vDetailIndex;
				}

				if (parseFloat(vScore) > 80) {
					oGroundColor= oBackGround[3];
				} else if (parseFloat(vScore) > 60) {
					oGroundColor= oBackGround[2];
				} else if (parseFloat(vScore) > 30) {
					oGroundColor= oBackGround[1];
				} else {
					oGroundColor= oBackGround[0];
				}

				this.goalDataMap[pernr].score = vScore;
				this.goalDataMap[pernr].groundColor = oGroundColor;
			}.bind(this),
			error: function(jqXHR) {
				this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'EvalGoalProgressingPortlet.fill ' + url4);
			}.bind(this)
		}).promise();
	}

},
checkNull: function (v) {
	return v === undefined || v === null || v == '' ? true : false;
},
onceAfter: function() {

	var list = this.$();
	if (!list.data('jsp') && this.scrollable() && list.find('.evalgoal-area').length > 1) {
		list.jScrollPane({
			resizeSensor: true,
			verticalGutter: 0,
			horizontalGutter: 0
		});
	}
},
onSlide: function() {

	setTimeout(function() {
		var list = this.$();
		if (list.data('jsp')) {
			list.data('jsp').reinitialise();
		}
	}.bind(this), 300);
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