/* global Promise:true */
sap.ui.define([
	"./delegate/Goal",
	"./delegate/On",
	"./delegate/OwnFunctions",
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/JSONModelRequest",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(Goal, On, OwnFunctions, Common, CommonController, JSONModelHelper, JSONModelRequest, MessageBox, JSONModel) {
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
	SelfAchievementItemsRequests: [],
	SelfCompetencyItemsRequests: [],
	SelfAchievementRatingsRequests: [],
	SelfCompetencyRatingsRequests: [],
	TalentRatingsRequests: [],
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

		setTimeout(OwnFunctions.initMessagePopover.bind(this), 0);
		setTimeout(OwnFunctions.initSearchModel.bind(this), 0);
		setTimeout(OwnFunctions.initCountModel.bind(this), 0);
		setTimeout(OwnFunctions.initEvalGradeComboModel.bind(this), 0);
		setTimeout(function() {
			this.FormTemplateId = this.FormTemplateIdMap[Common.getOperationMode()];
		}.bind(this), 0);
	},

	onAfterShow: function() {
		Common.log("onAfterShow");

		this.LoginUserId = this.getUserId();

		Promise.all([
			OwnFunctions.retrieveExceptionSettings(this),
			OwnFunctions.retrieveGroupingCriteria(this)
		])
		.then(
			On.pressSearch.bind(this)
		);
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
		if ($.app.LOG.ENABLE_SUCCESS) {
			Common.log("DirectReports success", directReports);
		}

		var oController = this,
		// selectedYear = $.app.byId("YearComboBox").getSelectedKey(),
		allGroups = ["S", "M", "SA", "A", "사무영업"],
		formHeaderModels = [],
		appraiseeMap = {},
		groupMap = {
			All: {count: 0, appraiseeList: [], appraiseeMap: appraiseeMap} // All
		};

		this.DirectReportsModel.setProperty("/GroupMap", groupMap);

		$.map(directReports, function(o) {
			if (o.custom04 || o.userId === "20090028") { // 평가제외자 : custom04에 값이 있으면 제외, 김태형 책임님은 SF에서 직접 등급부여를 하므로 제외
				return;
			}

			var groupCode = oController.GroupingCriteriaMap[o.custom07];
			if ($.inArray(groupCode, allGroups) > -1) {
				$.app.LOG.DATA[o.userId] = {};

				appraiseeMap[o.userId] = o;

				formHeaderModels.push(oController.retrieveFormHeader(o.userId));
			}
		});

		Promise.all($.map(formHeaderModels, function(m) {
			return m.load().promise(); // 개인별 평가문서 조회
		}))
		.then(function() {
			var EvalExceptType = this.SearchModel.getProperty("/EvalExceptType"),
			isEvalExceptTypeA = EvalExceptType === "A", // 예외설정 : 부문별 평가 진행
			orgSet = [], orgMap = {},
			goalModels = [];

			if (!isEvalExceptTypeA) {
				groupMap.X = OwnFunctions.getInitGroup();
			}
	
			$.map(this.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap"), function(o) {
				var division;
				if (isEvalExceptTypeA) { // 예외설정 : 부문별 평가 진행
					division = o.division.replace(/\//, "");
					if (!orgMap[division]) {
						orgSet.push({value: division, text: o.division});
						orgMap[division] = true;
						groupMap[division] = OwnFunctions.getInitGroup();
					}
				} else {
					division = "X";
				}
	
				var groupCode = oController.GroupingCriteriaMap[o.custom07],
				group = groupMap[division][groupCode];
				if (groupCode && group) {
					o.group = groupCode;
					group.count++;
					group.appraiseeList.push(o);
				}
	
				o.goal = 0;
				o.activity = 0;
				o.result = 0;
	
				groupMap.All.count++;
				groupMap.All.appraiseeList.push(o);
				groupMap.All.appraiseeMap[o.userId] = o;
	
				goalModels.push(Goal.retrieveGoal(o.userId));
				goalModels.push(Goal.retrieveActivity(o.userId));
				goalModels.push(Goal.retrieveAchievement(o.userId));
			});
	
			setTimeout(function() {
				Goal.retrieve(goalModels);
			}, 0);
	
			// 조직 combobox items reset
			var orgCode;
			if (isEvalExceptTypeA) { // 예외설정 : 부문별 평가 진행
				orgSet.sort(function(o1, o2) {
					return o2.text > o1.text ? -1 : 1; // 부문명으로 오름차순 정렬
				});
				orgCode = orgSet[0].value;
			} else {
				orgCode = "X";
			}
			setTimeout(function() {
				OwnFunctions.resetOrgComboBoxItems.bind(this)(orgSet);
			}.bind(this), 0);
	
			// 그룹 combobox items reset
			setTimeout(function() {
				OwnFunctions.resetGroupComboBoxItems.bind(this)(groupMap, orgCode);
			}.bind(this), 0);
	
			setTimeout(function() {
				Common.log("groupMap", groupMap);
			}, 0);
	
			setTimeout(function() {
				groupMap.All.appraiseeList.sort(function(p1, p2) {
					return Number(p2.custom07) - Number(p1.custom07);
				});
	
				$.each(groupMap.All.appraiseeList, function(i, o) { o.rowIndex = i; });

				if (isEvalExceptTypeA) {
					$.map(orgMap, function(i, k) { // 조직
						$.map(groupMap[k], function(o) { // 그룹
							o.appraiseeList.sort(function(p1, p2) {
								return Number(p2.custom07) - Number(p1.custom07);
							});
							$.each(o.appraiseeList, function(j, p) {
								p.groupRowIndex = j;
							});
						});
					});
				} else {
					$.map(groupMap.X, function(o) { // 등급
						o.appraiseeList.sort(function(p1, p2) {
							return Number(p2.custom07) - Number(p1.custom07);
						});
						$.each(o.appraiseeList, function(j, p) {
							p.groupRowIndex = j;
						});
					});
				}
	
				this.DirectReportsModel.setProperty("/GroupMap", groupMap);
			}.bind(this), 0);
		}.bind(this))
		.then(function() {
			setTimeout(function() {
				OwnFunctions.startGridTableUpdating(true, oController);
			}, 0);

			$.app.byId("async-messages").getModel().setProperty("/Messages/1", {type: "Success", title: $.app.getBundleText("MSG_03015")}); // 피평가자별 평가문서 정보 조회 완료

			// 평가문서 조회 후 본인 업적평가 항목, 본인 역량평가 항목, 1차 업적평가/역량평가 점수 조회
			return Promise.all([
				OwnFunctions.retrieveSelfAchievementItems(oController.SelfAchievementItemsRequests, oController),
				OwnFunctions.retrieveSelfCompetencyItems(oController.SelfCompetencyItemsRequests, oController),
				OwnFunctions.retrieveTalentRatings(oController.TalentRatingsRequests, oController)
			]);
		})
		.then(function() {
			$.app.byId("async-messages").getModel().setProperty("/Messages/3", {type: "Success", title: $.app.getBundleText("MSG_03017")}); // 피평가자별 본인평가 항목 정보 조회 완료
			$.app.byId("async-messages").getModel().setProperty("/Messages/5", {type: "Success", title: $.app.getBundleText("MSG_03019")}); // 피평가자별 1차평가 결과 조회 완료

			// 본인 업적평가 점수, 본인 역량평가 점수 조회
			return Promise.all([
				OwnFunctions.retrieveSelfAchievementRatings(oController.SelfAchievementRatingsRequests, oController),
				OwnFunctions.retrieveSelfCompetencyRatings(oController.SelfCompetencyRatingsRequests, oController)
			]);
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
				if (!results.length) { // 평가 문서 생성이 안된 인원 제외
					var m = oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap");
					if (m[pFormSubjectId]) {
						delete m[pFormSubjectId];
					}
					return;
				}

				var result = results.sort(function(f1, f2) { return Number(f1.formDataId) - Number(f2.formDataId); }).pop() || {},
				formContents = (result.formAuditTrails || {}).results || [];

				result.formContentId = (
					([].concat(formContents)).sort(function(p1, p2) {
						return Number(p1.formContentId) - Number(p2.formContentId); /* 오름차순 정렬 */
					}).pop() || {} // 배열 마지막 요소 추출 : formContentId가 가장 큰 object
				).formContentId;
				result.evalDocFormContentId = (
					$.map(([].concat(formContents)), function(p) {
						if (p.auditTrailRecipient === oController.LoginUserId) {
							return p;
						}
					})
					.sort(function(p1, p2) {
						return Number(p1.formContentId) - Number(p2.formContentId); /* 오름차순 정렬 */
					}).pop() || {}
				).formContentId;

				result.currentStep = (result.currentStep || "").replace(/.+\-\s*(.+)\s*$/, "$1");
				result.evalDocDeepLink = Common.getSFOrigin(oController) + "/sf/openMyForm?fcid=${result.evalDocFormContentId}".interpolate(result.evalDocFormContentId);
				result.selfAchievement = 0;
				result.selfAchievementItems = null;
				result.selfCompetency = 0;
				result.selfCompetencyItems = null;
				result.firstAchievement = 0;
				result.firstCompetency = 0;

				$.extend(true, oController.DirectReportsModel.getProperty("/GroupMap/All/appraiseeMap/${result.formSubjectId}".interpolate(result.formSubjectId)), result);

				$.app.LOG.DATA[pFormSubjectId]["04 업적/역량평가 문서 조회"].result = result;

				if (result.formContentId && result.formDataId) {
					oController.SelfAchievementItemsRequests.push(oController.getSelfAchievementItemsRequestParams(result.formContentId, result.formDataId, result.formSubjectId)); // 본인 업적평가 항목 조회
					oController.SelfCompetencyItemsRequests.push(oController.getSelfCompetencyItemsRequestParams(result.formContentId, result.formDataId, result.formSubjectId));   // 본인 역량평가 항목 조회
					oController.TalentRatingsRequests.push(oController.getTalentRatingsRequestParams(result.formContentId, result.formDataId, result.formSubjectId));               // 1차 업적평가/역량평가 점수 조회
				}
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pFormSubjectId]["04 업적/역량평가 문서 조회"] = {failure: arguments, model: this};
			});
	},

	// 본인 업적평가 항목 조회 ajax parameter 생성
	getSelfAchievementItemsRequestParams: function(pFormContentId, pFormDataId, pUserId) {

		return {
			url: "/odata/v2/FormObjectiveSection(formContentId=${pFormContentId}L,formDataId=${pFormDataId}L,sectionIndex=1)/objectives".interpolate(pFormContentId, pFormDataId),
			data: new JSONModelRequest().select("weight").select("othersRatingComment").getEncodedQueryString(),
			callbackData: {
				pUserId: pUserId
			}
		};
	},

	// 본인 역량평가 항목 조회 ajax parameter 생성
	getSelfCompetencyItemsRequestParams: function(pFormContentId, pFormDataId, pUserId) {

		return {
			url: "/odata/v2/FormCompetencySection(formContentId=${pFormContentId}L,formDataId=${pFormDataId}L,sectionIndex=3)/competencies".interpolate(pFormContentId, pFormDataId),
			data: new JSONModelRequest().select("othersRatingComment").getEncodedQueryString(),
			callbackData: {
				pUserId: pUserId
			}
		};
	},

	// 본인 업적평가/역량평가 점수 조회 ajax parameter 생성
	getSelfRatingsRequestParams: function(pUri, pUserId) {

		var keyUri = pUri.replace(/\//g, "");
		return {
			url: pUri,
			data: new JSONModelRequest().select("userId").select("rating").getEncodedQueryString(),
			callbackData: {
				keyUri: keyUri,
				pUserId: pUserId
			}
		};
	},

	// 1차 평가 점수, 등급 조회 ajax parameter 생성
	getTalentRatingsRequestParams: function(pFormContentId, pFormDataId, pUserId) {

		return {
			url: "/odata/v2/TalentRatings",
			data: new JSONModelRequest()
				.filter("formContentId eq ${pFormContentId}L".interpolate(pFormContentId))
				.filter("formDataId eq ${pFormDataId}L".interpolate(pFormDataId))
				.filter("feedbackType in 8,10,11")
				.getEncodedQueryString(),
			callbackData: {
				pUserId: pUserId
			}
		};
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
					sendToNextStep.bind(oController)();
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
				EvalExceptType = oController.SearchModel.getProperty("/EvalExceptType"),
				orgCode = EvalExceptType ? $.app.byId("OrgComboBox").getSelectedKey() : "X",
				isEvalExceptTypeA = EvalExceptType === "A",
				groupCode = $.app.byId("GroupComboBox").getSelectedKey(),
				messages = [oController.getBundleText("MSG_03006")]; // 확정되었습니다.

				$.map(oController.DirectReportsModel.getProperty("/GroupMap/" + orgCode), function(o, k) {
					if (isEvalExceptTypeA) { // 예외설정 : 부문별 평가 진행
						$.each(o.appraiseeList, function(i, p) {
							if ($.inArray(p.currentStep, oController.PreviousSteps) > -1 && orgCode !== p.division) {
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
		return new JSONModel({name: "936001"}); // 
		// return new JSONModel({name: "951002"}); // 
		// return new JSONModel({name: "991004"}); // 김해철 팀장
		// return new JSONModel({name: "951002"}); // 정승원 상무, 부문별
		// return new JSONModel({name: "9702574"}); // 오창엽
		// return new JSONModel({name: "20001003"}); // 최팀장
		// return new JSONModel({name: "20011013"}); // 조정훈
		// return new JSONModel({name: "35118818"}); // 
	} : null

});

});