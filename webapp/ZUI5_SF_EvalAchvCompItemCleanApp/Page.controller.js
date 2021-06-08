/* global Promise */
sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/JSONModelRequest",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/json/JSONModel"
], function(Common, CommonController, JSONModelHelper, JSONModelRequest, MessageBox, BusyIndicator, Spreadsheet, JSONModel) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 평가 항목생성

	LoginUserId: null,
	RemovalTargetItemCount: 0,
	RemovalSuccessItemCount: 0,
	SearchModel: new JSONModelHelper(),
	CountModel: new JSONModelHelper(),
	TableModel: new JSONModelHelper(),
	EvalItemFilterModel: null,
	HrReportsModel: null,
	RankCodeModel: null,
	FormHeaderModel: null,
	RemovalModelMap: null,

	getUserId: function() {

		return this.getSessionInfoByKey("name");
	},

	onInit: function () {
		Common.log("onInit");

		this.setupView()
			.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow
			}, this);

		Common.log("onInit session", this.getSessionModel().getData());
	},

	onBeforeShow: function(oEvent) {
		Common.log("onBeforeShow");

		this.SearchModel.setProperty("/FormTemplates", []);

		var currentYear = new Date().getFullYear();
		Promise.all([
			this.getFormTemplateModelPromise("Review",	"${year}년 업적%".interpolate(currentYear),		0),
			this.getFormTemplateModelPromise("360",		"${year}년 다면%".interpolate(currentYear),		1),
			this.getFormTemplateModelPromise("Review", 	"${year}년 업적%".interpolate(currentYear - 1),	2),
			this.getFormTemplateModelPromise("360",		"${year}년 다면%".interpolate(currentYear - 1),	3)
		])
		.then(function() {
			this.SearchModel.getProperty("/FormTemplates").sort(function(o1, o2) {
				return o1.SortOrder - o2.SortOrder;
			});
			this.SearchModel.refresh();
		}.bind(this));

		this.EvalItemFilterModel = new JSONModelHelper()
			.url("./${$.app.CONTEXT_PATH}/item-map.json".interpolate($.app.CONTEXT_PATH))
			.attachRequestCompleted(this.successEvalItemFilter)
			.attachRequestFailed(function() {
				Common.log("EvalItemFilter fail", arguments);
			})
			.load();

		this.CountModel.setData({
			Count: {appraiseeTotalCount: 0, appraiseeDiffCount: 0}
		});
	},

	getFormTemplateModelPromise: function(formTemplateType, formTemplateName, sortOrder) {

		return new JSONModelHelper()
			.url("/odata/v2/FormTemplate")
			.select("formTemplateId")
			.select("formTemplateName")
			.filter("formTemplateType eq '${formTemplateType}'".interpolate(formTemplateType))
			.filter("formTemplateName like '${formTemplateName}'".interpolate(formTemplateName))
			.attachRequestCompleted(function() {
				Common.log("FormTemplate complete : ${}, ${}".interpolate(formTemplateType, formTemplateName), arguments, this);

				var results = this.getResults();
				if (results && results.length) {
					var o = results.pop();
					o.SortOrder = sortOrder;
					o.formTemplateType = formTemplateType;

					this.getController().SearchModel.getProperty("/FormTemplates").push(o);
				}
			})
			.attachRequestFailed(function() {
				Common.log("FormTemplate fail : ${}, ${}".interpolate(formTemplateType, formTemplateName), arguments);
			})
			.load()
			.promise();
	},

	successEvalItemFilter: function() {
		Common.log("successEvalItemFilter", this.getResult());

		var result = this.getResult(), map = {};
		$.map(result.mappings, function(o) {
			map[[o.formTemplateType, o.group, o.itemId].join(",")] = true;
		});

		this.setData({
			dutyCodes: result.dutyCodes,
			dutyGroup: result.dutyGroup,
			rankGroup: result.rankGroup,
			evalItemFilterMap: map
		});
	},

	onChangeComboBox: function(oEvent) {
		Common.log("onChangeComboBox", arguments);

		var sEventSourceId = oEvent.getSource().getId();
		setTimeout(function() {
			if (sEventSourceId === "FormsComboBox") {
				this.onPressSearch();
			} else {
				BusyIndicator.show(0);
				this.setTableData();
			}
		}.bind(this), 0);
	},

	onPressExcelDownload: function() {

		var tableData = $.app.byId("AppraiseesTable").getModel().getProperty("/Appraisees");
		if (!tableData || !tableData.length) {
			MessageBox.warning(this.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
			return;
		}

		new Spreadsheet({
			worker: false,
			dataSource: tableData,
			workbook: {columns: Common.convertColumnArrayForExcel(this, this.getView().getColumnModel())},
			fileName: "${fileName}-${datetime}.xlsx".interpolate(this.getBundleText("LABEL_01001"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: this.getSessionInfoByKey("Dtfmt")}).format(new Date()))
		}).build();
	},

	/*
	 * 로그인한 사용자(담당자)의 hrReports(전체 피평가자) 조회
	 */
	onPressSearch: function(oEvent) {
		Common.log("onPressSearch");

		this.LoginUserId = this.getUserId();

		var selectedFormTemplateId = $.app.byId("FormsComboBox").getSelectedKey();
		if (!selectedFormTemplateId) {
			this.SearchModel.setProperty("/Divisions", []);
			this.SearchModel.setProperty("/Teams", []);
			this.TableModel.setProperty("/Appraisees", []);
			this.CountModel.setData({
				Count: {appraiseeTotalCount: 0, appraiseeDiffCount: 0}
			});

			if (oEvent) {
				MessageBox.warning(this.getBundleText("MSG_01001"), { // 평가문서를 선택하세요.
					onClose : function() {
						$.app.byId("FormsComboBox").focus();
					}
				});
			}

			return;

		} else {
			if (!oEvent) { // 검색 버튼 클릭이 아니면 조회하지 않음
				return;
			}

		}

		BusyIndicator.show(0);

		$.app.byId("AppraiseesTable").clearSelection();
		$.app.byId("DivisionsMultiComboBox").setEnabled(false);
		$.app.byId("TeamsMultiComboBox").setEnabled(false);

		this.HrReportsModel = this.getHrReportsModelHelper();

		Promise.all([
			this.HrReportsModel.load().promise(),	// 전체 HR Reports 조회
			new Promise(function(resolve, reject) {
				setTimeout(function() {
					return $.app.getModel("ZHR_COMMON_SRV").create(
						"/CommonCodeListHeaderSet",	// 직급 코드 조회 : 피평가자 filtering 기준
						{
							ICodeT: "066",
							NavCommonCodeList: []
						},
						{
							success: function(oData) {
								this.RankCodeModel = new JSONModelHelper();

								var NavCommonCodeList = Common.getTableInResults(oData, "NavCommonCodeList"),
								rankCodeMap = {};
								$.map(NavCommonCodeList, function(o) {
									rankCodeMap[o.Code] = true;
								});

								this.RankCodeModel.setProperty("/RankCodeMap", rankCodeMap);

								resolve();
							}.bind(this),
							error: function() {
								Common.log("rankCode fail", arguments);

								reject();
							}
						}
					);
				}.bind(this), 0);
			}.bind(this))
		])
		.then(function() {
			var formTemplateId = $.app.byId("FormsComboBox").getSelectedKey(),
			rankCodeMap = this.RankCodeModel.getProperty("/RankCodeMap"),
			hrReportsAll = this.HrReportsModel.getResults(),
			hrReportsAllMap = {},
			appraiseeIds = $.map(hrReportsAll, function(o) {
				if (o.custom04 || !rankCodeMap[o.custom07]) { // 평가제외자 : 값이 있으면 평가에서 제외
					return;
				}
				hrReportsAllMap[o.userId] = $.extend(o, { allocatingItemCount: 0, poolItemCount: 0, diffItemCount: 0, currentStep: "", formDataId: "" });
				return o.userId;
			});

			this.HrReportsModel.setProperty("/hrReportsAllMap", hrReportsAllMap);

			Common.log("hrReports", formTemplateId, hrReportsAll, appraiseeIds);

			var appraiseeIdCount = appraiseeIds.length,
			requests = this.getRequestFormHeader(formTemplateId, appraiseeIds);

			if (appraiseeIdCount > 1000 || requests.isMultipleRequest()) { // $filter in 절 조건값이 1000개를 넘거나 요청 URL 문자열의 길이가 8192 bytes를 초과하는 경우 요청을 분리하여 호출함
				var oController = this,
					requestCount = Math.max(Math.ceil(appraiseeIdCount / 1000), requests.getEstimatedRequestCount()), // $filter 조건값 개수로 산정된 요청 횟수와 URL 길이로 산정된 요청 횟수 중 큰 값으로 호출 횟수를 정함
					spliceLength = Math.ceil(appraiseeIdCount / requestCount); // 선택된 호출 횟수로 $filter 조건값을 분리

				Common.log("FormHeader is multiple requests.", "requestCount: " + requestCount, "spliceLength: " + spliceLength);

				requests = $.map(new Array(requestCount), function () {
					return oController.getRequestFormHeader(formTemplateId, appraiseeIds.splice(spliceLength)); // 각각의 요청 URL 생성
				});
			}

			// 피평가자들의 평가문서 조회
			this.FormHeaderModel = new JSONModelHelper()
				.requests(requests) // JSONModelHelper 내부에서 각 요청들을 Promise.all로 호출하여 결과 데이터를 취합해줌
				.attachRequestCompleted(this.successFormHeader.bind(this))
				.attachRequestFailed(function () {
					Common.log("FormHeader fail", arguments);
					BusyIndicator.hide();
				})
				.load();

		}.bind(this));

		this.RemovalModelMap = {};
	},

	getHrReportsModelHelper: function() {

		return new JSONModelHelper()
			.url("/odata/v2/User('${this.LoginUserId}')/hrReports".interpolate(this.LoginUserId))
			.select("userId")          // 사번
			.select("nickname")        // 성명
			.select("defaultFullName") // 성명
			.select("title")	       // 직위
			.select("custom01")        // 직급명 rank
			.select("custom02")        // 조직
			.select("custom04")        // 평가제외자(값이 있으면 평가제외 대상)
			.select("custom07")        // 직급코드 rank
			.select("custom08")        // 직책코드 duty
			.select("division")        // 부문
			.select("department")      // 부서
			.attachRequestFailed(function () {
				Common.log("hrReports fail", arguments);
				BusyIndicator.hide();
			});
	},

	getRequestFormHeader: function(formTemplateId, appraiseeIds) {

		return new JSONModelRequest()
			.url("/odata/v2/FormHeader")
			.select("currentStep")
			.select("formDataId")
			.select("formDataStatus")
			.select("formSubjectId")
			.select("formAuditTrails/formContentId")
			.select("formAuditTrails/auditTrailRecipient")
			.filter("formTemplateId eq '${formTemplateId}'".interpolate(formTemplateId))
			.filter("formDataStatus ne '4'")
			.filter("formSubjectId in '${appraiseeIds}'".interpolate(appraiseeIds.join("','")))
			.expand("formAuditTrails")
			.orderby("currentStep,formSubjectId,formDataId desc");
	},

	/*
	 * 평가문서 유형별 평가항목 수 count
	 */
	successFormHeader: function() {

		var loginUserId = this.LoginUserId,
		hrReportsAllMap = this.HrReportsModel.getData().hrReportsAllMap,
		hrReportsMap = {},
		FormCompetencySectionMap = {},
		FormHeaderResults = this.FormHeaderModel.getResults();

		Common.log("successFormHeader", FormHeaderResults);

		$.each(FormHeaderResults, function(i, o) {
			$.each((o.formAuditTrails || {}).results || [], function(j, p) {
				if (p.auditTrailRecipient === loginUserId) {
					var model = new JSONModelHelper()
						.url("/odata/v2/FormCompetencySection(formContentId=${p.formContentId}L,formDataId=${o.formDataId}L,sectionIndex=3)/competencies".interpolate(p.formContentId, o.formDataId))
						.select("formContentId")
						.select("formDataId")
						.select("itemId")
						.attachRequestCompleted(function() {

							var oController = this.getController(),
							results = this.getResults(),
							formTemplateType = $.app.byId("FormsComboBox").getSelectedItem().getBindingContext().getProperty("formTemplateType"),
							poolItemCount = results.length,
							allocatingItemCount = 0,

							evalItemFilterData = oController.EvalItemFilterModel.getData(),
							dutyCodes = evalItemFilterData.dutyCodes,
							dutyGroup = evalItemFilterData.dutyGroup,
							rankGroup = evalItemFilterData.rankGroup,
							evalItemFilterMap = evalItemFilterData.evalItemFilterMap,
							hrReport = hrReportsMap[o.formSubjectId] = hrReportsAllMap[o.formSubjectId],
							removalModels = oController.RemovalModelMap[o.formSubjectId];

							if (!removalModels) {
								removalModels = oController.RemovalModelMap[o.formSubjectId] = [];
							}

							$.map(results, function(item) {
								var group = $.inArray(hrReport.custom08, dutyCodes) > -1 ? dutyGroup[hrReport.custom08] : rankGroup[hrReport.custom07];
								var k = [formTemplateType, group, item.itemId].join(",");
								if (evalItemFilterMap[k]) { // 대상자 직위에 해당하는 평가항목인 경우
									++allocatingItemCount;
								} else {
									oController.readyRemovalModel(removalModels, item);
								}
							});

							hrReport.currentStep = (o.currentStep || "").replace(/.+\-\s*(.+)\s*$/, "$1");
							hrReport.formDataId = o.formDataId;
							hrReport.allocatingItemCount = allocatingItemCount;
							hrReport.poolItemCount = poolItemCount;
							hrReport.diffItemCount = poolItemCount - allocatingItemCount;
						})
						.attachRequestFailed(function() {
							Common.log("FormCompetencySection[formContentId: ${p.formContentId}, formDataId: ${o.formDataId}] fail".interpolate(p.formContentId, o.formDataId), arguments);
						});

					FormCompetencySectionMap[o.formSubjectId] = model;

					return false;
				}
			});
		});

		var oController = this,
		FormCompetencySectionPromises = $.map(FormCompetencySectionMap, function(model) {
			return model.load().promise();
		});

		Promise.all(FormCompetencySectionPromises)
			.then(function() {
				Common.log("FormCompetencySectionMap", FormCompetencySectionMap);

				oController.resetComboBoxItems(hrReportsMap);
				oController.HrReportsModel.setProperty("/hrReportsMap", hrReportsMap);
				oController.setTableData();
			});
	},

	/*
	 * User list로부터 division Set, department Set을 생성하여 반환
	 */
	resetComboBoxItems: function(usersMap) {

		var oController = this;
		setTimeout(function() {
			var divisionMap = {}, departmentMap = {}, divisionSet = [], departmentSet = [];
			$.map(usersMap, function(o, k) {
				Common.log("resetComboBoxItems", k, o);

				var division = divisionMap[o.division], department = departmentMap[o.department];
				if (!division) {
					divisionMap[o.division] = true;
					divisionSet.push({value: o.division, text: o.division});
				}
				if (!department) {
					departmentMap[o.department] = true;
					departmentSet.push({value: o.department, text: o.department});
				}
			});

			setTimeout(function() {
				oController.SearchModel.setProperty("/Divisions", divisionSet);
				$.app.byId("DivisionsMultiComboBox").setEnabled(true);
			}, 0);

			setTimeout(function() {
				oController.SearchModel.setProperty("/Teams", departmentSet);
				$.app.byId("TeamsMultiComboBox").setEnabled(true);
			}, 0);
		}, 0);
	},

	setTableData: function() {

		var hrReportsMap = this.HrReportsModel.getData().hrReportsMap || {},
		CountModel = this.CountModel,
		divisionSet = $.app.byId("DivisionsMultiComboBox").getSelectedKeys(),
		departmentSet = $.app.byId("TeamsMultiComboBox").getSelectedKeys(),
		appraiseeTotalCount = 0,
		appraiseeDiffCount = 0,
		Appraisees, AppraiseesMap = {};

		if (divisionSet.length && departmentSet.length) {
			Appraisees = $.map(hrReportsMap, function(o) {
				if ($.inArray(o.division, divisionSet) > -1 && $.inArray(o.department, departmentSet) > -1) {
					++appraiseeTotalCount;

					var p = $.extend({}, o);
					if (p.diffItemCount > 0) {
						++appraiseeDiffCount;
					}

					AppraiseesMap[p.userId] = p;
					return p;
				}
			});
		} else if (divisionSet.length) {
			Appraisees = $.map(hrReportsMap, function(o) {
				if ($.inArray(o.division, divisionSet) > -1) {
					++appraiseeTotalCount;

					var p = $.extend({}, o);
					if (p.diffItemCount > 0) {
						++appraiseeDiffCount;
					}

					AppraiseesMap[p.userId] = p;
					return p;
				}
			});
		} else if (departmentSet.length) {
			Appraisees = $.map(hrReportsMap, function(o) {
				if ($.inArray(o.department, departmentSet) > -1) {
					++appraiseeTotalCount;

					var p = $.extend({}, o);
					if (p.diffItemCount > 0) {
						++appraiseeDiffCount;
					}

					AppraiseesMap[p.userId] = p;
					return p;
				}
			});
		} else {
			Appraisees = $.map(hrReportsMap, function(o) {
				++appraiseeTotalCount;

				var p = $.extend({}, o);
				if (p.diffItemCount > 0) {
					++appraiseeDiffCount;
				}

				AppraiseesMap[p.userId] = p;
				return p;
			});
		}

		CountModel.setProperty("/Count/appraiseeTotalCount", appraiseeTotalCount);
		CountModel.setProperty("/Count/appraiseeDiffCount",  appraiseeDiffCount);

		this.TableModel.setProperty("/Appraisees", Appraisees);
		this.TableModel.setProperty("/AppraiseesMap", AppraiseesMap);

		Common.adjustAutoVisibleRowCount.call($.app.byId("AppraiseesTable"));

		BusyIndicator.hide();
	},

	readyRemovalModel: function(removalModels, o) {

		var url = "/odata/v2/FormCompetency(formContentId=${o.formContentId}L,formDataId=${o.formDataId}L,itemId=${o.itemId}L,sectionIndex=3)".interpolate(o.formContentId, o.formDataId, o.itemId);
		removalModels.push({
			url: url,
			type: "DELETE",
			dataType: "text",
			success: function(data, textStatus, jqXHR) {
				var oController = $.app.getController();

				++oController.RemovalSuccessItemCount;

				if (removalModels && removalModels.length) {
					$.ajax(removalModels.shift());
				} else {
					oController.checkCount();
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				if ($.app.LOG.ENABLE_FAILURE) Common.log("Fail " + url, arguments);

				var oController = $.app.getController();
				BusyIndicator.hide();

				var message;
				if (jqXHR.responseJSON) {
					message = (((jqXHR.responseJSON || {}).error || {}).message || {}).value;
				} else if (errorThrown) {
					message = errorThrown.message;
				}
				MessageBox.error(message || oController.getBundleText("MSG_01007")); // 설정 실행중 오류가 발생하였습니다.
			}
		});
	},

	/*
	 * Table에서 선택된 피평가자들의 평가제외 항목들을 삭제
	 * 각 피평가자별로 평가제외 항목 삭제요청을 하나씩 요청
	 * 
	 *                 ┌─> 선택된 피평가자1 ─> 항목삭제 요청1 ─> 항목삭제 요청2 ... 항목삭제 요청n ─┐
	 * onPressRemoval ─┼─> 선택된 피평가자2 ─> 항목삭제 요청1 ─> 항목삭제 요청2 ... 항목삭제 요청n ─┼─> onRemoveSuccess
	 *                 ├─> ...                                                                     ─┤
	 *                 └─> 선택된 피평가자n ─> 항목삭제 요청1 ─> 항목삭제 요청2 ... 항목삭제 요청n ─┘
	 */
	onPressRemoval: function() {
		Common.log("onPressRemoval");

		var oController = this,
		selectedIndices = $.app.byId("AppraiseesTable").getSelectedIndices();

		if (!selectedIndices.length) {
			MessageBox.warning(this.getBundleText("MSG_01004")); // 설정 실행 대상자들을 선택하세요.
		} else {
			MessageBox.confirm(this.getBundleText("MSG_01006"), { // 설정 실행하시겠습니까?
				onClose: function(oAction) {
					if (sap.m.MessageBox.Action.OK === oAction) {
						oController.RemovalTargetItemCount = 0;
						oController.RemovalSuccessItemCount = 0;

						oController.runRemoval();
					}
				}
			});
		}
	},

	runRemoval: function() {

		BusyIndicator.show(0);

		var oController = this,
		AppraiseesTable = $.app.byId("AppraiseesTable"),
		selectedIndices = AppraiseesTable.getSelectedIndices();

		var callCount = $.map(selectedIndices, function(i) {
			var AppraiseeData = AppraiseesTable.getContextByIndex(i).getProperty(),
			removalModels = oController.RemovalModelMap[AppraiseeData.userId];

			Common.log("onPressRemoval AppraiseeData.userId", AppraiseeData.userId, removalModels);

			if (removalModels && removalModels.length) {
				oController.RemovalTargetItemCount += removalModels.length;
				$.ajax(removalModels.shift()); // removalModels의 나머지 item들은 requestCompleted callback에서 순차적으로 처리
				return 1;
			}
		}).length;

		if (!callCount) {
			BusyIndicator.hide();

			MessageBox.information(this.getBundleText("MSG_01005")); // 설정 실행이 필요한 대상자가 아닙니다.
		}
	},

	checkCount: function() {

		if (this.RemovalTargetItemCount === this.RemovalSuccessItemCount) {
			MessageBox.success(this.getBundleText("MSG_01002")); // 설정 실행이 완료되었습니다.

			Common.log("평가항목 삭제 개수", this.RemovalSuccessItemCount);

			this.onRemoveSuccess();
		}
	},

	onRemoveSuccess: function() {
		Common.log("onRemoveSuccess", arguments);

		var oController = this,
		AppraiseesTable = $.app.byId("AppraiseesTable"),
		promises = $.map(AppraiseesTable.getSelectedIndices(), function(i) {
			var o = AppraiseesTable.getContextByIndex(i).getProperty();

			Common.log("Eval items removal success appraisee data", o);

			return new JSONModelHelper()
				.url("/odata/v2/sendToNextStep?formDataId=${o.formDataId}L".interpolate(o.formDataId))
				.attachRequestCompleted(function() {
					if ($.app.LOG.ENABLE_SUCCESS) Common.log("sendToNextStep(formDataId:${o.formDataId}) complete".interpolate(o.formDataId), arguments);
				})
				.attachRequestFailed(function() {
					if ($.app.LOG.ENABLE_FAILURE) Common.log("sendToNextStep(formDataId:${o.formDataId}) fail".interpolate(o.formDataId), arguments, this);
				})
				.load()
				.promise();
		});

		Promise.all(promises)
			.then(function() {
				if ($.app.LOG.ENABLE_SUCCESS) Common.log("sendToNextStep complete", arguments);

				BusyIndicator.hide();

				oController.onPressSearch.call(oController, true);
			})
			.catch(function() {
				if ($.app.LOG.ENABLE_FAILURE) Common.log("sendToNextStep error", arguments);

				BusyIndicator.hide();

				MessageBox.error(oController.getBundleText("MSG_01003")); // 다음 단계로 평가단계를 전송하던중 오류가 발생하였습니다.
			});
	},

	getLocalSessionModel: Common.isLOCAL() ? function() {
		// return new JSONModel({name: "35132012"}); // 김지혜
		return new JSONModel({name: "20140099"}); // 최내봄
		// return new JSONModel({name: "20170084"}); // 윤현주
	} : null

});

});