sap.ui.define([
	"./delegate/On",
	"./delegate/OwnFunctions",
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (On, OwnFunctions, Common, CommonController, JSONModelHelper, MessageBox, JSONModel) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 업적&역량 평가

	LoginUserId: null,
	MessagePopover: null,
	FormTemplateId: null,
	CountModel: new JSONModelHelper(),
	TableModel: new JSONModelHelper(),
	SearchModel: new JSONModelHelper(),
	EvalGradeComboModel: new JSONModelHelper(),
	DirectReportsModel: null,
	RatingsRequests: [],
	SelfRatingsRequests: [],
	PreviousSteps: ["평가 준비", "본인 평가", "부서장 평가", "업적평가 등급결정"],
	GroupingCriteriaMap: null,
	FormTemplateIdMap: {
		DEV: "703",
		QAS: "500",
		PRD: "500"
	},

	getUserId: function() {

		return this.getView().getModel("session").getData().name;
	},

	getEvalProfileDialogHandler: function() {

		return this.EvalProfileDialogHandler;
	},

	onInit: function () {
		Common.log("onInit");

		this.setupView()
			.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow,
				onAfterShow: this.onAfterShow
			}, this);
	},

	onBeforeShow: function() {
		Common.log("onBeforeShow");

		this.LoginUserId = this.getUserId();

		OwnFunctions.retrieveExceptionSettings(this);
		OwnFunctions.retrieveGroupingCriteria(this);
		OwnFunctions.initMessagePopover(this);
		OwnFunctions.initSearchModel(this);
		OwnFunctions.initCountModel(this);
		OwnFunctions.initEvalGradeComboModel(this);

		this.FormTemplateId = this.FormTemplateIdMap[Common.getOperationMode()];
	},

	onAfterShow: function() {
		Common.log("onAfterShow");

		On.pressSearch.bind(this)();
	},

	retrieveDirectReports: function() {

		this.DirectReportsModel = new JSONModelHelper()
			.url("/odata/v2/User('${this.LoginUserId}')/directReports".interpolate(this.LoginUserId))
			.select("userId")	       // 사번
			.select("nickname")        // 성명
			.select("defaultFullName") // 성명
			.select("custom01")        // 직급명 rank
			.select("custom02")        // 조직
			.select("custom04")        // 평가제외자(값이 있으면 평가제외 대상)
			.select("custom07")        // 직급코드 rank
			.select("custom08")        // 직책코드 duty
			.select("division")        // 부문
			.select("department")      // 부서
			.attachRequestCompleted(this.successDirectReports.bind(this))
			.attachRequestFailed(function() {
				if ($.app.LOG.ENABLE_FAILURE) { Common.log("DirectReports failure", arguments); }
			})
			.load();
	},

	// 피평가자들의 평가문서 조회
	successDirectReports: function() {

		$.app.byId("async-messages").getModel().setProperty("/Messages/0", {type: "Success", title: $.app.getBundleText("MSG_03014")}); // 피평가자 목록 조회 완료

		var directReports = this.DirectReportsModel.getResults();
		if ($.app.LOG.ENABLE_SUCCESS) { Common.log("DirectReports success", directReports); }

		var oController = this,
		selectedYear = $.app.byId("YearComboBox").getSelectedKey(),
		orgSet = [], orgMap = {},
		groupMap = {
			"All":      {count: 0, appraiseeList: [], appraiseeMap: {}}, // All
			"S":        {count: 0, appraiseeList: []}, // 임원/수석
			"M":        {count: 0, appraiseeList: []}, // 책임
			"S+M":      {count: 0, appraiseeList: []}, // 임원/수석 + 책임
			"SA":       {count: 0, appraiseeList: []}, // 대리
			"A":        {count: 0, appraiseeList: []}, // 사원
			"SA+A":     {count: 0, appraiseeList: []}, // 대리 + 사원
			"사무영업": {count: 0, appraiseeList: []}
		},
		allGroups = ["S", "M", "SA", "A", "사무영업"],
		formHeaderModels = [],
		goalModels = [];

		$.each(directReports, function(i, o) {
			if (o.custom04 || o.userId === "20090028") { // 평가제외자 : custom04에 값이 있으면 제외, 김태형 책임님은 SF에서 직접 등급부여를 하므로 제외
				return;
			}

			if (!orgMap[o.division]) {
				orgSet.push({value: o.division, text: o.division});
				orgMap[o.division] = true;
			}

			var groupCode = oController.GroupingCriteriaMap[o.custom07], group = groupMap[groupCode];
			if (groupCode && group) {
				o.group = groupCode;
				group.count++;
				group.appraiseeList.push(o);
			}
			if ($.inArray(groupCode, allGroups) > -1) {
				o.goal = 0;
				o.activity = 0;
				o.result = 0;

				groupMap.All.count++;
				groupMap.All.appraiseeList.push(o);
				groupMap.All.appraiseeMap[o.userId] = o;

				$.app.LOG.DATA[o.userId] = {};

				formHeaderModels.push(oController.retrieveFormHeader(o.userId));
				goalModels.push(oController.retrieveGoal(o.userId));
				goalModels.push(oController.retrieveActivity(o.userId));
				goalModels.push(oController.retrieveAchievement(o.userId));
			}
		});

		// 조직 combobox items reset
		OwnFunctions.resetOrgComboBoxItems.bind(this)(orgSet);

		// 그룹 combobox items reset
		OwnFunctions.resetGroupComboBoxItems.bind(this)(groupMap);

		Common.log("selectedYear", selectedYear);
		Common.log("groupMap", groupMap);

		$.map(groupMap, function(o) {
			o.appraiseeList.sort(function(o1, o2) {
				return Number(o2.custom07) - Number(o1.custom07);
			});
		});

		setTimeout(function() {
			$.app.byId("OrgComboBox").setEnabled(true);
			$.app.byId("GroupComboBox").setEnabled(true);
		}, 0);

		$.each(groupMap.All.appraiseeList, function(i, o) { o.rowIndex = i; });

		this.DirectReportsModel.setProperty("/GroupMap", groupMap);

		var promises = [];
		$.map(formHeaderModels, function(m) {
			promises.push(m.load().promise());
		});
		$.map(goalModels, function(m) {
			promises.push(m.load().promise());
		});

		Promise.all(
			promises // 개인별 평가문서, 목표 개수, 활동 개수, 실적 개수조회
		)
		.then(function() {
			OwnFunctions.startGridTableUpdating(true, oController);

			$.app.byId("async-messages").getModel().setProperty("/Messages/1", {type: "Success", title: $.app.getBundleText("MSG_03015")}); // 피평가자별 평가문서 정보 조회 완료

			// 평가문서 조회 후 본인 업적평가 항목, 본인 역량평가 항목, 1차 업적평가/역량평가 점수 조회
			return Promise.all(
				$.map(oController.RatingsRequests, function(m) {
					return m.load().promise();
				})
			);
		})
		.then(function() {
			$.app.byId("async-messages").getModel().setProperty("/Messages/2", {type: "Success", title: $.app.getBundleText("MSG_03016")}); // 피평가자별 목표 항목 정보 조회 완료
			$.app.byId("async-messages").getModel().setProperty("/Messages/3", {type: "Success", title: $.app.getBundleText("MSG_03017")}); // 피평가자별 본인평가 항목 정보 조회 완료
			$.app.byId("async-messages").getModel().setProperty("/Messages/5", {type: "Success", title: $.app.getBundleText("MSG_03019")}); // 피평가자별 1차평가 결과 조회 완료

			// 본인 업적평가 점수, 본인 역량평가 점수 조회
			return Promise.all(
				$.map(oController.SelfRatingsRequests, function(m) {
					return m.load().promise();
				})
			);
		})
		.then(function() {
			OwnFunctions.startGridTableUpdating(false, oController);

			// 점수 계산
			var calculations = $.map(oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeList"), function(o) {
				return new Promise(function(resolve) {
					setTimeout(function() {
						$.app.LOG.DATA[o.userId]["00 성명"] = o.nickname;
						$.app.LOG.DATA[o.userId]["07 본인 업적평가 점수"] = {};
						$.app.LOG.DATA[o.userId]["09 본인 역량평가 점수"] = {};
						$.app.LOG.DATA[o.userId]["10 data"] = o;

						setTimeout(function() {
							// 본인평가 업적점수
							var selfAchievement = 0;
							$.map(o.selfAchievementItems || [], function(p, j) {
								var rating = Math.max(Number(p.rating || 0), 0), value = p.weight * rating * 0.01;
								selfAchievement += value;
								$.app.LOG.DATA[o.userId]["07 본인 업적평가 점수"][String(j)] = "${p.weight} * ${p.rating} * 0.01 = ${value}".interpolate(p.weight, rating, value);
							});
							o.selfAchievement = selfAchievement;
						}, 0);

						setTimeout(function() {
							// 본인평가 역량점수
							var selfCompetencySum = 0;
							$.map(o.selfCompetencyItems || [], function(p, j) {
								var rating = Math.max(Number(p.rating || 0), 0);
								selfCompetencySum += rating;
								$.app.LOG.DATA[o.userId]["09 본인 역량평가 점수"][String(j)] = rating;
							});
							o.selfCompetency = selfCompetencySum / ((o.selfCompetencyItems || []).length || 1);
						}, 0);

						resolve();
					}, 0);
				});
			});

			return Promise.all(calculations);
		})
		.then(function() {
			setTimeout(function() {
				$.app.getController().TableModel.refresh();
			}, 500);

			$.app.byId("async-messages").getModel().setProperty("/Messages/4", {type: "Success", title: $.app.getBundleText("MSG_03018")}); // 피평가자별 본인평가 항목별 점수 조회 완료

			setTimeout(function() {
				$.app.spinner(false);
				$.app.byId("async-messages").toggle($.app.byId("async-spinner"));
			}, 1500);
		})
		.catch(function() {
			if ($.app.LOG.ENABLE_FAILURE) { Common.log("grid data retrieval error", arguments); }
		});
	},

	// 목표 개수 조회
	retrieveGoal: function(pUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/Goal_2")
			.filter("userId eq '${pUserId}'".interpolate(pUserId))
			.inlinecount()
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["01 목표 개수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				inlinecount = this.getInlinecount() || 0;

				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/goal".interpolate(pUserId), inlinecount);

				$.app.LOG.DATA[pUserId]["01 목표 개수 조회"].inlinecount = inlinecount;
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["01 목표 개수 조회"] = {failure: arguments, model: this};
			});
	},

	// 활동 개수 조회
	retrieveActivity: function(pSubjectUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/Activity")
			.filter("subjectUserId eq '${pSubjectUserId}'".interpolate(pSubjectUserId))
			.expand("subjectUserIdNav")
			.inlinecount()
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pSubjectUserId]["02 활동 개수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				inlinecount = this.getInlinecount() || 0;

				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pSubjectUserId}/activity".interpolate(pSubjectUserId), inlinecount);

				$.app.LOG.DATA[pSubjectUserId]["02 활동 개수 조회"].inlinecount = inlinecount;
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pSubjectUserId]["02 활동 개수 조회"] = {failure: arguments, model: this};
			});
	},

	// 실적 개수 조회
	retrieveAchievement: function(pSubjectUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/Achievement")
			.filter("subjectUserId eq '${pSubjectUserId}'".interpolate(pSubjectUserId))
			.expand("subjectUserIdNav")
			.inlinecount()
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pSubjectUserId]["03 실적 개수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				inlinecount = this.getInlinecount() || 0;

				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pSubjectUserId}/result".interpolate(pSubjectUserId), inlinecount);

				$.app.LOG.DATA[pSubjectUserId]["03 실적 개수 조회"].inlinecount = inlinecount;
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pSubjectUserId]["03 실적 개수 조회"] = {failure: arguments, model: this};
			});
	},

	// 업적/역량평가 문서 조회
	retrieveFormHeader: function(pFormSubjectId) {

		return new JSONModelHelper()
			.url("/odata/v2/FormHeader")
			.select("currentStep")
			.select("formDataId")
			.select("formDataStatus")
			.select("formSubjectId")
			.select("formAuditTrails/formContentId")
			.select("formAuditTrails/auditTrailRecipient")
			.filter("formTemplateId eq '${formTemplateId}'".interpolate(this.FormTemplateId))
			.filter("formDataStatus ne '4'")
			.filter("formSubjectId in '${formSubjectId}'".interpolate(pFormSubjectId))
			.expand("formAuditTrails")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pFormSubjectId]["04 업적/역량평가 문서 조회"] = {success: arguments, model: this};

				var oController = this.getController(), results = this.getResults();
				if (!results.length) {
					oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${result.formSubjectId}/excluded".interpolate(pFormSubjectId), true);
					return;
				}

				var result = results.sort(function(f1, f2) { return Number(f1.formDataId) - Number(f2.formDataId); }).pop() || {},
				formContents = (result.formAuditTrails || {}).results || [];

				result.formContentId = (
					formContents.sort(function(p1, p2) { return Number(p1.formContentId) - Number(p2.formContentId); /* 오름차순 정렬 */ }).pop() || {} // 배열 마지막 요소 추출 : formContentId가 가장 큰 object
				).formContentId;

				result.currentStep = (result.currentStep || "").replace(/.+\-\s*(.+)\s*$/, "$1");
				result.evalDocDeepLink = Common.getSFOrigin(oController) + "/sf/openMyForm?fcid=${result.formContentId}".interpolate(result.formContentId);
				result.selfAchievement = 0;
				result.selfAchievementItems = null;
				result.selfCompetency = 0;
				result.selfCompetencyItems = null;
				result.firstAchievement = 0;
				result.firstCompetency = 0;

				$.extend(true, oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap/${result.formSubjectId}".interpolate(result.formSubjectId)), result);

				$.app.LOG.DATA[pFormSubjectId]["04 업적/역량평가 문서 조회"].result = result;

				if (result.formContentId && result.formDataId) {
					oController.RatingsRequests.push(oController.retrieveSelfAchievementItems(result.formContentId, result.formDataId, result.formSubjectId)); // 본인 업적평가 항목 조회
					oController.RatingsRequests.push(oController.retrieveSelfCompetencyItems(result.formContentId, result.formDataId, result.formSubjectId));  // 본인 역량평가 항목 조회
					oController.RatingsRequests.push(oController.retrieveTalentRatings(result.formContentId, result.formDataId, result.formSubjectId));        // 1차 업적평가/역량평가 점수 조회
				}
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pFormSubjectId]["04 업적/역량평가 문서 조회"] = {failure: arguments, model: this};
			});
	},

	// 본인 업적평가 항목 조회
	retrieveSelfAchievementItems: function(pFormContentId, pFormDataId, pUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/FormObjectiveSection(formContentId=${pFormContentId}L,formDataId=${pFormDataId}L,sectionIndex=1)/objectives".interpolate(pFormContentId, pFormDataId))
			.select("weight")
			.select("othersRatingComment")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["05 본인 업적평가 항목 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				selfAchievementItemMap = {},
				results = this.getResults();

				$.app.LOG.DATA[pUserId]["05 본인 업적평가 항목 조회"].results = results;
				$.app.LOG.DATA[pUserId]["07 본인 업적평가 점수 조회"] = {};

				// 본인 업적평가 항목별 점수 조회
				$.each(results, function(i, o) {
					var uri = o.othersRatingComment.__deferred.uri.replace(/^.+\/odata\//, "/odata/");

					selfAchievementItemMap[uri.replace(/\//g, "")] = o;
					oController.SelfRatingsRequests.push(oController.retrieveSelfAchievementRatings(uri, pUserId));
				});

				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfAchievementItems".interpolate(pUserId), results);
				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfAchievementItemMap".interpolate(pUserId), selfAchievementItemMap);
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["05 본인 업적평가 항목 조회"] = {failure: arguments, model: this};
			});
	},

	// 본인 역량평가 항목 조회
	retrieveSelfCompetencyItems: function(pFormContentId, pFormDataId, pUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/FormCompetencySection(formContentId=${pFormContentId}L,formDataId=${pFormDataId}L,sectionIndex=3)/competencies".interpolate(pFormContentId, pFormDataId))
			.select("othersRatingComment")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["06 본인 역량평가 항목 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				selfCompetencyItemMap = {},
				results = this.getResults();

				$.app.LOG.DATA[pUserId]["06 본인 역량평가 항목 조회"].results = results;
				$.app.LOG.DATA[pUserId]["08 본인 역량평가 점수 조회"] = {};

				// 본인 역량평가 항목별 점수 조회
				$.each(results, function(i, o) {
					var uri = o.othersRatingComment.__deferred.uri.replace(/^.+\/odata\//, "/odata/");

					selfCompetencyItemMap[uri.replace(/\//g, "")] = o;
					oController.SelfRatingsRequests.push(oController.retrieveSelfCompetencyRatings(uri, pUserId));
				});

				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfCompetencyItems".interpolate(pUserId), results);
				oController.DirectReportsModel.setProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfCompetencyItemMap".interpolate(pUserId), selfCompetencyItemMap);
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["06 본인 역량평가 항목 조회"] = {failure: arguments, model: this};
			});
	},

	// 본인 업적평가 점수 조회
	retrieveSelfAchievementRatings: function(pUri, pUserId) {

		var keyUri = pUri.replace(/\//g, "");
		return new JSONModelHelper()
			.url(pUri)
			.select("userId")
			.select("rating")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["07 본인 업적평가 점수 조회"][keyUri] = {success: arguments, model: this};

				var oController = this.getController(),
				data = $.map(this.getResults(), function(o) { if (o.userId === pUserId) { return o; } })[0] || {};

				$.app.LOG.DATA[pUserId]["07 본인 업적평가 점수 조회"][keyUri].result = data;

				$.extend(true, oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfAchievementItemMap/${keyUri}".interpolate(pUserId, keyUri)), data);
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["07 본인 업적평가 점수 조회"][keyUri] = {failure: arguments, model: this};
			});
	},

	// 본인 역량평가 점수 조회
	retrieveSelfCompetencyRatings: function(pUri, pUserId) {

		var keyUri = pUri.replace(/\//g, "");
		return new JSONModelHelper()
			.url(pUri)
			.select("userId")
			.select("rating")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["08 본인 역량평가 점수 조회"][keyUri] = {success: arguments, model: this};

				var oController = this.getController(),
				data = $.map(this.getResults(), function(o) { if (o.userId === pUserId) { return o; } })[0] || {};

				$.app.LOG.DATA[pUserId]["08 본인 역량평가 점수 조회"][keyUri].result = data;

				$.extend(true, oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap/${pUserId}/selfCompetencyItemMap/${keyUri}".interpolate(pUserId, keyUri)), data);
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["08 본인 역량평가 점수 조회"][keyUri] = {failure: arguments, model: this};
			});
	},

	// 1차 평가 점수, 등급 조회
	retrieveTalentRatings: function(pFormContentId, pFormDataId, pUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/TalentRatings")
			.filter("formContentId eq ${pFormContentId}L".interpolate(pFormContentId))
			.filter("formDataId eq ${pFormDataId}L".interpolate(pFormDataId))
			.filter("feedbackType in 8,10,11")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["09 1차 평가 점수, 등급 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				results = this.getResults();

				$.app.LOG.DATA[pUserId]["09 1차 평가 점수, 등급 조회"].results = results;

				var data = {};
				$.each(results, function(i, o) {
					if (o.feedbackType === 8) { // 평가등급, feedbackRatingLabel
						data.evaluationGrade = o.feedbackRatingLabel;
					} else if (o.feedbackType === 10) { // 역량점수, feedbackRating
						data.firstCompetency = Math.max(o.feedbackRating, 0);
					} else if (o.feedbackType === 11) { // 업적점수, feedbackRating
						data.firstAchievement = Math.max(o.feedbackRating, 0);
					}
				});

				$.extend(true, oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap/${pUserId}".interpolate(pUserId)), data);
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["09 1차 평가 점수, 등급 조회"] = {failure: arguments, model: this};
			});
	},

	submitBatch: function(Appraisees, sendToNextStep) {

		var oController = this,
		batchChangeOperations = [],
		oDataBatchModel = new sap.ui.model.odata.ODataModel("/odata/v2", {
			json: true,
			useBatch: true,
			loadMetadataAsync: true,
			loadAnnotationsJoined: false,
			skipMetadataAnnotationParsing: true,
			headers: {
				"Accept": "application/json"
			}
		})
		.attachMetadataLoaded(function() { if ($.app.LOG.ENABLE_SUCCESS) { Common.log("metadataLoaded", arguments); } })
		.attachMetadataFailed(function() { if ($.app.LOG.ENABLE_FAILURE) { Common.log("metadataFailed", arguments); } });

		$.each(Appraisees, function(i, o) {
			Common.log("save data", o);

			batchChangeOperations.push(oDataBatchModel.createBatchOperation("/upsert", "POST", {
				__metadata: {
					uri: "FormPMReviewContentDetail(formContentId=${o.formContentId}L,formDataId=${o.formDataId}L)".interpolate(o.formContentId, o.formDataId),
					type: "SFOData.FormPMReviewContentDetail"
				},
				summarySection: {
					__metadata: {
						uri: "FormSummarySection(formContentId=${o.formContentId}L,formDataId=${o.formDataId}L)".interpolate(o.formContentId, o.formDataId),
						type: "SFOData.FormSummarySection"
					},
					overallFormRating: {
						__metadata: {
							uri: "FormUserRatingComment(formContentId=${o.formContentId}L,formDataId=${o.formDataId}L,itemId=0L,ratingType='overall',sectionIndex=2,userId='')".interpolate(o.formContentId, o.formDataId),
							type: "SFOData.FormUserRatingComment"
						},
						ratingKey: "wf_sect_2_rating",
						rating: o.evaluationGrade === "A" ? "100.0" : (o.evaluationGrade === "B" ? "80.0" : (o.evaluationGrade === "C" ? "60.0" : ""))
					}
				}
			}));
		});

		oDataBatchModel.addBatchChangeOperations(batchChangeOperations);
		oDataBatchModel.submitBatch(
			function(oData) {
				if ($.app.LOG.ENABLE_SUCCESS) { Common.log("batch success", arguments); }

				var responses = oData.__batchResponses;
				if (responses && responses[0] && responses[0].response && responses[0].response.statusCode !== "200") {
					oController.getView().setBusy(false);

					MessageBox.error([oController.getBundleText("MSG_00018"), "", responses[0].message, (responses[0].response || {}).statusText].join("\n")); // 저장중 오류가 발생하였습니다.
					return;
				}

				if (typeof sendToNextStep === "function") {
					oController.sendToNextStep.bind(oController)();
				} else {
					oController.getView().setBusy(false);

					MessageBox.success(oController.getBundleText("MSG_00017")); // 저장되었습니다.
				}
			},
			function (oError) {
				if ($.app.LOG.ENABLE_FAILURE) { Common.log("batch error", arguments); }

				var msg;
				if (oError.response) {
					var error = JSON.parse(oError.response.body).error;

					msg = error.innererror.errordetails;

					if (msg && msg.length) {
						msg = error.innererror.errordetails[0].message;
					} else {
						msg = error.message.value;
					}
				} else {
					msg = oError.toString();
				}

				oController.getView().setBusy(false);

				MessageBox.error(msg);
			},
			true
		);
	},

	// 등급 확정 후 평가 다음 단계로 변경
	sendToNextStep: function() {
		Common.log("sendToNextStep", arguments);

		var promises = $.map(this.TableModel.getProperty("/Appraisees"), function(o) {
			Common.log("confirm data", o);

			return new JSONModelHelper()
				.url("/odata/v2/sendToNextStep?formDataId=${o.formDataId}L".interpolate(o.formDataId))
				.setContextData({
					formDataId: o.formDataId
				})
				.attachRequestCompleted(function() {
					if ($.app.LOG.ENABLE_SUCCESS) { Common.log("sendToNextStep(formDataId:${this.getContextData().formDataId}) complete".interpolate(this.getContextData().formDataId), arguments); }
				})
				.attachRequestFailed(function() {
					if ($.app.LOG.ENABLE_FAILURE) { Common.log("sendToNextStep(formDataId:${this.getContextData().formDataId}) fail".interpolate(this.getContextData().formDataId), arguments, this); }
				})
				.load();
		});

		var oController = this;
		Promise.all(promises)
			.then(function() {
				if ($.app.LOG.ENABLE_SUCCESS) { Common.log("sendToNextStep complete", arguments); }

				var groupNames = [],
				FilterComboBoxType = oController.SearchModel.getProperty("/FilterComboBoxType"),
				org = FilterComboBoxType ? $.app.byId("OrgComboBox").getSelectedKey() : null,
				groupCode = $.app.byId("GroupComboBox").getSelectedKey(),
				messages = [oController.getBundleText("MSG_03006")]; // 확정되었습니다.

				$.map(oController.DirectReportsModel.getProperty("/GroupMap"), function(o, k) {
					if (k !== "All") {
						if (FilterComboBoxType) {
							$.each(o.appraiseeList, function(i, p) {
								if ($.inArray(p.currentStep, oController.PreviousSteps) > -1 && org !== p.division) {
									groupNames.push(p.division);
									return false;
								}
							});
						} else {
							if (k !== groupCode) {
								$.each(o.appraiseeList, function(i, p) {
									if ($.inArray(p.currentStep, oController.PreviousSteps) > -1) {
										groupNames.push(k);
										return false;
									}
								});
							}
						}
					}
				});

				if (groupNames.length) { // 평가등급이 확정되지 않은 피평가자 그룹이 있다면 안내문을 추가로 보여줌
					messages.push(oController.getBundleText("MSG_03022", [groupNames.join(", ")])); // 평가할 그룹이 남아있습니다. 계속 평가 진행해주시기 바랍니다.\n(평가할 그룹 : {0})
				}

				oController.getView().setBusy(false);
				MessageBox.success(messages.join("\n\n"));

				setTimeout(On.pressSearch.bind(oController), 3000); // SF에서 transaction 처리 시간이 걸리므로 충분한 시간 뒤에 재조회
			})
			.catch(function() {
				if ($.app.LOG.ENABLE_FAILURE) { Common.log("sendToNextStep error", arguments); }

				oController.getView().setBusy(false);
				MessageBox.error(oController.getBundleText("MSG_03007")); // 확정 작업중 오류가 발생하였습니다.
			});
	},

	getLocalSessionModel: Common.isLOCAL() ? function() {
		// return new JSONModel({name: "991004"}); // 김해철 팀장
		// return new JSONModel({name: "951002"}); // 정승원 상무
		// return new JSONModel({name: "9702574"}); // 오창엽
		return new JSONModel({name: "20001003"}); // 최팀장
		// return new JSONModel({name: "20011013"}); // 조정훈
		// return new JSONModel({name: "35118818"}); // 
	} : null

});

});