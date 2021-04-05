sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/JSONModelHelper",
	"../../common/JSONModelRequest"
], function(Common, Formatter, JSONModelHelper, JSONModelRequest) {
"use strict";

return { // 업적&역량 평가 functions

	retrieveExceptionSettings: function(oController) {

		return new Promise(function(resolve, reject) {
			var worker = new Worker("common/AjaxWorker.js"); // Worker instance 생성
			worker.onmessage = function(event) { // Worker로 조회한 결과를 받는 callback binding
				Common.log("exception-settings success", event);
				setTimeout(function() {
					var workerMessage = event.data;
					if (workerMessage.success) {
						var settings = ((workerMessage.response || {}).d || {}).results,
						currentYear = new Date().getFullYear();

						$.each(settings, function(i, o) {
							if (Number(o.year || 0) === currentYear) {
								oController.SearchModel.setProperty("/EvalExceptType", o.code);
								if (o.code) { // 로그인한 평가자가 평가 예외 유형으로 설정되어 있는 경우 조직 ComboBox를 보여줌
									$.app.byId("EvalExceptTypeComboBox").setVisible(true);
								}
								return false;
							}
						});
						resolve();
					} else {
						Common.log("exception-settings fail", event);
						reject();
					}
				}, 0);

				worker.terminate();
				worker = undefined;
			};
			worker.postMessage({ // Worker 작업 실행
				url: "/odata/v2/Background_EvalException",
				data: new JSONModelRequest()
					.filter("userId eq '${oController.LoginUserId}'".interpolate(oController.LoginUserId))
					.getEncodedQueryString()
			});
		});
	},

	retrieveGroupingCriteria: function(oController) {

		return new JSONModelHelper()
			.url("./${$.app.CONTEXT_PATH}/grouping-criteria.json".interpolate($.app.CONTEXT_PATH))
			.attachRequestCompleted(function() {
				oController.GroupingCriteriaMap = this.getResult();
			})
			.attachRequestFailed(function() {
				Common.log("grouping-criteria fail", arguments);
			})
			.load()
			.promise();
	},

	initSearchModel: function() {

		var minYear = 2020,
		suffix = this.getBundleText("LABEL_00143"), // 년
		comboBoxItems = $.map(new Array(new Date().getFullYear() - minYear + 1), function(v, i) {
			var value = String(minYear + i);
			return {value: value, text: value + suffix};
		});

		this.SearchModel.setData({
			EvalYears: comboBoxItems,
			Groups: null
		});
	},

	initCountModel: function() {

		this.CountModel.setData({
			Criterion: {A: 0, BC: 0, T: 0},
			Selected: {A: 0, B: 0, C: 0},
			Ratio: {A: 0, B: 0, C: 0}
		});
	},

	initEvalGradeComboModel: function() {

		this.EvalGradeComboModel.setData({
			Grades: [
				{value: "A", text: "A"},
				{value: "B", text: "B"},
				{value: "C", text: "C"}
			]
		});
		this.getView().setModel(this.EvalGradeComboModel, "EvalGradeComboModel");
	},

	initMessagePopover: function() {

		this.MessagePopover = new sap.m.MessagePopover("async-messages", {
			placement: sap.m.VerticalPlacementType.Bottom,
			items: {
				path: "/Messages",
				template: new sap.m.MessageItem({
					type: "{type}",
					title: "{title}"
				})
			}
		})
		.addStyleClass("custom-async-messagepopover")
		.setModel(new sap.ui.model.json.JSONModel());
	},

	getInitGroup: function() {

		return {
			"S":        {count: 0, appraiseeList: []}, // 임원/수석
			"M":        {count: 0, appraiseeList: []}, // 책임
			"S+M":      {count: 0, appraiseeList: []}, // 임원/수석 + 책임
			"SA":       {count: 0, appraiseeList: []}, // 대리
			"A":        {count: 0, appraiseeList: []}, // 사원
			"SA+A":     {count: 0, appraiseeList: []}, // 대리 + 사원
			"사무영업": {count: 0, appraiseeList: []}
		};
	},

	// 조직 combobox items reset
	resetOrgComboBoxItems: function(orgSet) {

		this.SearchModel.setProperty("/Orgs", orgSet);

		var combobox = $.app.byId("OrgComboBox");
		if (orgSet.length) {
			combobox.setSelectedKey(orgSet[0].value);
		}
		combobox.setEnabled(true);
	},

	// 그룹 combobox items reset
	resetGroupComboBoxItems: function(groupMap, orgCode) {

		if (groupMap.All.count === 0) {
			this.SearchModel.setProperty("/Groups", null);
			return;
		}

		orgCode = orgCode || "X";

		var group = groupMap[orgCode], items = [], selectedKey;
		if ((0 < group.S.count && group.S.count < 3) || (0 < group.M.count && group.M.count < 3)) {
			if (group.S.count > 0 && group.M.count > 0) {
				selectedKey = "S+M";
				items.push({value: "S+M", text: "S + M"});
				group["S+M"].appraiseeList = (group.S.appraiseeList || []).concat(group.M.appraiseeList || []);
				group["S+M"].count = group["S+M"].appraiseeList.length;
			} else {
				if (group.S.count > 0) {
					selectedKey = selectedKey || "S";
					items.push({value: "S", text: "S"});
				}
				if (group.M.count > 0) {
					selectedKey = selectedKey || "M";
					items.push({value: "M", text: "M"});
				}
			}
		} else {
			if (group.S.count > 0) {
				selectedKey = selectedKey || "S";
				items.push({value: "S", text: "S"});
			}
			if (group.M.count > 0) {
				selectedKey = selectedKey || "M";
				items.push({value: "M", text: "M"});
			}
		}
		if ((0 < group.SA.count && group.SA.count < 3) || (0 < group.A.count && group.A.count < 3)) {
			if (group.SA.count > 0 && group.A.count > 0) {
				selectedKey = selectedKey || "SA+A";
				items.push({value: "SA+A", text: "SA + A"});
				group["SA+A"].appraiseeList = (group.SA.appraiseeList || []).concat(group.A.appraiseeList || []);
				group["SA+A"].count = group["SA+A"].appraiseeList.length;
			} else {
				if (group.SA.count > 0) {
					selectedKey = selectedKey || "SA";
					items.push({value: "SA", text: "SA"});
				}
				if (group.A.count > 0) {
					selectedKey = selectedKey || "A";
					items.push({value: "A", text: "A"});
				}
			}
		} else {
			if (group.SA.count > 0) {
				selectedKey = selectedKey || "SA";
				items.push({value: "SA", text: "SA"});
			}
			if (group.A.count > 0) {
				selectedKey = selectedKey || "A";
				items.push({value: "A", text: "A"});
			}
		}
		if (group["사무영업"].count > 0) {
			selectedKey = selectedKey || "사무영업";
			items.push({value: "사무영업", text: "사무영업"});
		}

		this.SearchModel.setProperty("/Groups", items);

		$.app.byId("GroupComboBox").setSelectedKey(selectedKey).setEnabled(true);
	},

	startGridTableUpdating: function(on, oController) {

		if (on) {
			oController.GridTableUpdateInterval = setInterval(function() {
				$.app.byId("GroupComboBox").fireChange();
			}, 300);
		} else {
			clearInterval(oController.GridTableUpdateInterval);
		}
	},

	// 본인 업적평가 항목 조회
	retrieveSelfAchievementItems: function(list, oController) {

		return new Promise(function(resolve, reject) {
			var worker = new Worker("common/AjaxWorker.js"); // Worker instance 생성
			worker.onmessage = function(event) { // Worker로 조회한 결과를 받는 callback binding
				Common.log("SelfAchievementItems success", event);
				setTimeout(function() {
					var workerMessage = event.data;
					if (workerMessage.success) {
						$.map(workerMessage.responses || [], function(o) {
							var result = o.d || {}, results = result.results || [], selfAchievementItemMap = {};

							$.app.LOG.DATA[o.pUserId]["05 본인 업적평가 항목 조회"] = {success: o, results: results};
							$.app.LOG.DATA[o.pUserId]["07 본인 업적평가 점수 조회"] = {};

							// 본인 업적평가 항목별 점수 조회
							$.map(results, function(p) {
								var uri = p.othersRatingComment.__deferred.uri.replace(/^.+\/odata\//, "/odata/");

								selfAchievementItemMap[uri.replace(/\//g, "")] = p;
								oController.SelfAchievementRatingsRequests.push(oController.getSelfRatingsRequestParams(uri, o.pUserId));
							});

							oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfAchievementItems".interpolate(o.pUserId), results);
							oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfAchievementItemMap".interpolate(o.pUserId), selfAchievementItemMap);
						});

						resolve();
					} else {
						Common.log("SelfAchievementItems fail", event);
						reject();
					}
				}, 0);

				worker.terminate();
				worker = undefined;
			};
			worker.postMessage(list);
		});
	},

	// 본인 업적평가 점수 조회
	retrieveSelfAchievementRatings: function(list, oController) {

		return new Promise(function(resolve, reject) {
			var worker = new Worker("common/AjaxWorker.js"); // Worker instance 생성
			worker.onmessage = function(event) { // Worker로 조회한 결과를 받는 callback binding
				Common.log("SelfAchievementRatings success", event);
				setTimeout(function() {
					var workerMessage = event.data;
					if (workerMessage.success) {
						$.map(workerMessage.responses || [], function(o) {
							var result = o.d || {}, results = result.results || [];

							$.app.LOG.DATA[o.pUserId]["07 본인 업적평가 점수 조회"][o.keyUri] = {success: o};

							var data = $.map(results, function(p) { if (p.userId === o.pUserId) { return p; } })[0] || {};

							$.app.LOG.DATA[o.pUserId]["07 본인 업적평가 점수 조회"][o.keyUri].result = data;

							$.extend(true, oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfAchievementItemMap/${keyUri}".interpolate(o.pUserId, o.keyUri)), data);
						});

						resolve();
					} else {
						Common.log("SelfAchievementRatings fail", event);
						reject();
					}
				}, 0);

				worker.terminate();
				worker = undefined;
			};
			worker.postMessage(list);
		});
	},

	// 본인 역량평가 항목 조회
	retrieveSelfCompetencyItems: function(list, oController) {

		return new Promise(function(resolve, reject) {
			var worker = new Worker("common/AjaxWorker.js"); // Worker instance 생성
			worker.onmessage = function(event) { // Worker로 조회한 결과를 받는 callback binding
				Common.log("SelfCompetencyItems success", event);
				setTimeout(function() {
					var workerMessage = event.data;
					if (workerMessage.success) {
						$.map(workerMessage.responses || [], function(o) {
							var result = o.d || {}, results = result.results || [], selfCompetencyItemMap = {};

							$.app.LOG.DATA[o.pUserId]["06 본인 역량평가 항목 조회"] = {success: o, results: results};
							$.app.LOG.DATA[o.pUserId]["08 본인 역량평가 점수 조회"] = {};

							// 본인 역량평가 항목별 점수 조회
							$.map(results, function(p) {
								var uri = p.othersRatingComment.__deferred.uri.replace(/^.+\/odata\//, "/odata/");

								selfCompetencyItemMap[uri.replace(/\//g, "")] = p;
								oController.SelfCompetencyRatingsRequests.push(oController.getSelfRatingsRequestParams(uri, o.pUserId));
							});

							oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfCompetencyItems".interpolate(o.pUserId), results);
							oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfCompetencyItemMap".interpolate(o.pUserId), selfCompetencyItemMap);
						});

						resolve();
					} else {
						Common.log("SelfCompetencyItems fail", event);
						reject();
					}
				}, 0);

				worker.terminate();
				worker = undefined;
			};
			worker.postMessage(list);
		});
	},

	// 본인 역량평가 점수 조회
	retrieveSelfCompetencyRatings: function(list, oController) {

		return new Promise(function(resolve, reject) {
			var worker = new Worker("common/AjaxWorker.js"); // Worker instance 생성
			worker.onmessage = function(event) { // Worker로 조회한 결과를 받는 callback binding
				Common.log("SelfCompetencyRatings success", event);
				setTimeout(function() {
					var workerMessage = event.data;
					if (workerMessage.success) {
						$.map(workerMessage.responses || [], function(o) {
							var result = o.d || {}, results = result.results || [];

							$.app.LOG.DATA[o.pUserId]["08 본인 역량평가 점수 조회"][o.keyUri] = {success: arguments, model: this};

							var data = $.map(results, function(p) { if (p.userId === o.pUserId) { return o; } })[0] || {};

							$.app.LOG.DATA[o.pUserId]["08 본인 역량평가 점수 조회"][o.keyUri].result = data;

							$.extend(true, oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfCompetencyItemMap/${keyUri}".interpolate(o.pUserId, o.keyUri)), data);
						});

						resolve();
					} else {
						Common.log("SelfCompetencyRatings fail", event);
						reject();
					}
				}, 0);

				worker.terminate();
				worker = undefined;
			};
			worker.postMessage(list);
		});
	},

	// 1차 평가 점수, 등급 조회
	retrieveTalentRatings: function(list, oController) {

		return new Promise(function(resolve, reject) {
			var worker = new Worker("common/AjaxWorker.js"); // Worker instance 생성
			worker.onmessage = function(event) { // Worker로 조회한 결과를 받는 callback binding
				Common.log("TalentRatings success", event);
				setTimeout(function() {
					var workerMessage = event.data;
					if (workerMessage.success) {
						$.map(workerMessage.responses || [], function(o) {
							var result = o.d || {}, results = result.results || [];

							$.app.LOG.DATA[o.pUserId]["09 1차 평가 점수, 등급 조회"] = {success: o, results: results};

							var data = {};
							$.map(results, function(p) {
								if (p.feedbackType === 8) { // 평가등급, feedbackRatingLabel
									data.evaluationGrade = p.feedbackRatingLabel;
								} else if (p.feedbackType === 10) { // 역량점수, feedbackRating
									data.firstCompetency = Math.max(p.feedbackRating, 0);
								} else if (p.feedbackType === 11) { // 업적점수, feedbackRating
									data.firstAchievement = Math.max(p.feedbackRating, 0);
								}
							});

							$.extend(true, oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap/${pUserId}".interpolate(o.pUserId)), data);
						});

						resolve();
					} else {
						Common.log("TalentRatings fail", event);
						reject();
					}
				}, 0);

				worker.terminate();
				worker = undefined;
			};
			worker.postMessage(list);
		});
	}

};

});