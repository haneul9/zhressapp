sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/Search360Review",
	"sap/m/MessageBox",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/json/JSONModel"
], function (Common, CommonController, JSONModelHelper, Search360Review, MessageBox, Spreadsheet, JSONModel) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 평가현황

	LoginUserId: null,
	ReviewDialog: null,
	MessagePopover: null,
	GridTableUpdateInterval: null,
	SearchModel: new JSONModelHelper(),
	TableModel: new JSONModelHelper(),
	DirectReportsModel: null,
	RatingsRequests: [],
	SelfRatingsRequests: [],
	EmpGradeMap: null,
	FormTemplateIdMap: {
		DEV: {"PM": "703", "360": "719"},
		QAS: {"PM": "500", "360": "502"},
		PRD: {"PM": "500", "360": "502"}
	},

	getUserId: function() {

		return this.getView().getModel("session").getData().name;
	},

	onInit: function () {
		Common.log("onInit");

		this.setupView()
			.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow,
				onAfterShow: this.onAfterShow
			}, this);

		Common.log("onInit session", this.getView().getModel("session").getData());
	},

	onBeforeShow: function(oEvent) {
		Common.log("onBeforeShow");

		this.retrieveEmpGrade(this);

		this.SearchModel.setData({
			EvalYears: [
				{value: "2020", text: "2020년"}
			]
		});

		this.TableModel.setProperty("/IconTabFilterCountMap", {
			"step0": 0, // 전체
			"step1": 0, // 본인 평가
			"step2": 0, // 부서장 평가
			"step3": 0, // 업적평가 등급결정
			"step4": 0, // 종합평가 준비
			"step5": 0, // 종합평가
			"step6": 0, // HR확인
			"step7": 0, // 결과확인
			"step8": 0  // 평가완료
		});

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
		.setModel(new sap.ui.model.json.JSONModel());
	},

	onAfterShow: function() {
		Common.log("onAfterShow");

		this.onPressSearch();
	},

	retrieveEmpGrade: function(oController) {

		new JSONModelHelper()
			.url("./${$.app.CONTEXT_PATH}/grade-map.json".interpolate($.app.CONTEXT_PATH))
			.attachRequestCompleted(function() {
				oController.EmpGradeMap = this.getResult();
			})
			.attachRequestFailed(function() {
				Common.log("EmpGrade fail", arguments);
			})
			.load();
	},

	/*
	 * Table 본인 업적/역량, 1차 업적/역량 column ProgressIndicator
	 */
	getScoreChart: function(columnInfo) {

		return new sap.m.ProgressIndicator({
			displayOnly: true,
			height: "24px",
			percentValue: "{${columnInfo.id}}".interpolate(columnInfo.id),
			displayValue: {
				path: columnInfo.id,
				formatter: function(pV) {
					var v = pV || 0;
					if (v >= 90) {
						this.toggleStyleClass("cpi-bg-signature-cyanblue", false)
							.toggleStyleClass("cpi-bg-signature-darkgreen", false)
							.toggleStyleClass("cpi-bg-signature-orange", true);
					} else if (v >= 80) {
						this.toggleStyleClass("cpi-bg-signature-cyanblue", false)
							.toggleStyleClass("cpi-bg-signature-darkgreen", true)
							.toggleStyleClass("cpi-bg-signature-orange", false);
					} else {
						this.toggleStyleClass("cpi-bg-signature-cyanblue", true)
							.toggleStyleClass("cpi-bg-signature-darkgreen", false)
							.toggleStyleClass("cpi-bg-signature-orange", false);
					}
					return v.toFixed(2);
				}
			}
		}).addStyleClass("cpi-body");
	},

	/*
	 * Table 평가등급 column TextView
	 */
	getGradeText: function(columnInfo) {

		return new sap.m.Text({
			textAlign: sap.ui.core.HorizontalAlign.Center,
			text: {
				path: "evaluationGrade",
				formatter: function(v) {
					if (v === "A") {
						this.toggleStyleClass("color-signature-orange", true);
					} else if (v === "B") {
						this.toggleStyleClass("color-signature-darkgreen", true);
					} else if (v === "C") {
						this.toggleStyleClass("color-signature-cyanblue", true);
					}
					return v;
				}
			}
		});
	},

	/*
	 * Table 역량/업적평가 문서 column icon template
	 */
	getDeepLinkIcon: function(columnInfo) {

		var oController = $.app.getController();
		return new sap.ui.core.Icon({
			press: oController.onPressDeepLinkIcon.bind(oController),
			size: "1rem",
			src: "sap-icon://generate-shortcut"
		})
		.addStyleClass("color-signature-blue");
	},

	/*
	 * Table 역량/업적평가 문서 column icon click event handler
	 */
	onPressDeepLinkIcon: function(oEvent) {
		Common.log("onPressDeepLinkIcon", oEvent.getSource().getBindingContext().getProperty());

		window.open(oEvent.getSource().getBindingContext().getProperty().evalDocDeepLink);
	},

	/*
	 * Table 다면평가 문서 column icon template
	 */
	getReview360Icon: function(columnInfo) {

		var oController = $.app.getController();
		return new sap.ui.core.Icon({
			press: oController.onPressReview360Icon.bind(oController),
			size: "1rem",
			src: "sap-icon://generate-shortcut",
			visible: {
				path: "currentStep360",
				formatter: function(v) {
					return v === "평가완료";
				}
			}
		})
		.addStyleClass("color-signature-blue");
	},

	/*
	 * Table 다면평가 문서 column icon click event handler
	 */
	onPressReview360Icon: function(oEvent) {
		Common.log("onPressReview360Icon", oEvent, oEvent.getSource().getBindingContext().getProperty());

		if (!this.ReviewDialog) {
			this.ReviewDialog = sap.ui.jsfragment("fragment.360Review", this);
			this.getView().addDependent(this.ReviewDialog);
		}

		Search360Review.oController = this;
		Search360Review.userId = oEvent.getSource().getBindingContext().getProperty().userId;

		this.ReviewDialog.open();
	},

	/*
	 * User list로부터 department Set을 생성하여 반환
	 */
	resetComboBoxItems: function(pUsers) {

		var oController = this;
		setTimeout(function() {
			var departmentMap = {}, departmentSet = [];
			$.each(pUsers, function(i, o) {
				var department = departmentMap[o.department];
				if (!department) {
					departmentMap[o.department] = true;
					departmentSet.push({value: o.department, text: o.department});
				}
			});

			setTimeout(function() {
				oController.SearchModel.setProperty("/Teams", departmentSet);
				$.app.byId("TeamsMultiCombo").setEnabled(true);
			}, 0);
		}, 0);
	},

	onChangeComboBox: function(oEvent) {

		var countMap = {
			"step0": 0, // 전체
			"step1": 0, // 본인 평가
			"step2": 0, // 부서장 평가
			"step3": 0, // 업적평가 등급결정
			"step4": 0, // 종합평가 준비
			"step5": 0, // 종합평가
			"step6": 0, // HR확인
			"step7": 0, // 결과확인
			"step8": 0  // 평가완료
		},
		keys = oEvent.getSource().getSelectedKeys(),
		Appraisees = $.map(this.DirectReportsModel.getProperty("/MergeGroupList"), function(o) {
			++countMap.step0;
			     if (o.currentStep === "본인 평가")			++countMap.step1;
			else if (o.currentStep === "부서장 평가")		++countMap.step2;
			else if (o.currentStep === "업적평가 등급결정")	++countMap.step3;
			else if (o.currentStep === "종합평가 준비")		++countMap.step4;
			else if (o.currentStep === "종합평가")			++countMap.step5;
			else if (o.currentStep === "HR확인")			++countMap.step6;
			else if (o.currentStep === "결과확인")			++countMap.step7;
			else if (o.currentStep === "평가완료")			++countMap.step8;

			if (!keys.length || $.inArray(o.department, keys) > -1) {
				return o;
			}
		});

		this.TableModel.setProperty("/IconTabFilterCountMap", countMap);
		this.TableModel.setProperty("/Appraisees", Appraisees);
	},

	onFilterSelect: function (oEvent) {

		var key = oEvent.getParameter("key"), AppraiseesTable = $.app.byId("AppraiseesTable"), binding = AppraiseesTable.getBinding();
		binding.filter(key === "All" ? null : new sap.ui.model.Filter("currentStep", sap.ui.model.FilterOperator.EQ, key));

		Common.adjustVisibleRowCount(AppraiseesTable, 10, binding.getLength());
	},

	onPressExcelDownload: function() {

		var oView = this.getView(),
		tableData = $.app.byId("AppraiseesTable").getModel().getProperty("/Appraisees");
		if (!tableData || !tableData.length) {
			MessageBox.warning(this.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
			return;
		}

		new Spreadsheet({
			worker: false,
			dataSource: tableData,
			workbook: {columns: Common.convertColumnArrayForExcel(this, oView._colModel)},
			fileName: "${fileName}-${datetime}.xlsx".interpolate(this.getBundleText("LABEL_04001"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}).format(new Date()))
		}).build();
	},

	/*
	 * 로그인한 사용자(팀장)의 directReports(피평가자) 조회
	 */
	onPressSearch: function() {
		Common.log("onPressSearch");

		$.app.spinner(true);

		this.LoginUserId = this.getUserId();

		this.MessagePopover.getModel().setProperty("/Messages", [
			{type: "Warning", title: $.app.getBundleText("MSG_04002")}, // 피평가자 목록 조회중
			{type: "Warning", title: $.app.getBundleText("MSG_04003")}, // 피평가자별 평가문서 정보 조회 대기중
			{type: "Warning", title: $.app.getBundleText("MSG_04004")}, // 피평가자별 본인평가 항목 정보 조회 대기중
			{type: "Warning", title: $.app.getBundleText("MSG_04005")}, // 피평가자별 본인평가 항목별 점수 조회 대기중
			{type: "Warning", title: $.app.getBundleText("MSG_04006")}, // 피평가자별 1차평가 결과 조회 대기중
			{type: "Warning", title: $.app.getBundleText("MSG_04007")}  // 피평가자별 다면평가 결과 조회 대기중
		]);
		this.MessagePopover.toggle($.app.byId("async-spinner"));

		var yearsCombo = $.app.byId("YearsCombo"), selectedYear = yearsCombo.getSelectedKey();
		if (!selectedYear) {
			MessageBox.warning(this.getBundleText("MSG_04001"), { // 평가연도를 선택하세요.
				onClose: function() {
					yearsCombo.focus();
				}
			});
			$.app.spinner(false);
			return;
		}

		$.app.byId("TeamsMultiCombo").setEnabled(false);

		this.RatingsRequests = [];
		this.SelfRatingsRequests = [];

		this.DirectReportsModel = new JSONModelHelper()
			.url("/odata/v2/User('${this.LoginUserId}')/directReports".interpolate(this.LoginUserId))
			.select("userId")	  // 사번
			.select("nickname")   // 성명
			.select("title")	  // 직위
			.select("custom01")   // 직급
			.select("custom04")   // 평가제외자(값이 있으면 평가제외 대상)
			.select("department") // 부서
			.attachRequestCompleted(this.successDirectReports.bind(this))
			.attachRequestFailed(function() {
				if ($.app.LOG.ENABLE_FAILURE) Common.log("DirectReports failure", arguments);
			})
			.load();
	},

	startGridTableUpdating: function(start) {

		if (start) {
			var oController = this;
			this.GridTableUpdateInterval = setInterval(function() {
				oController.TableModel.setProperty("/Appraisees", oController.DirectReportsModel.getProperty("/MergeGroupList"));
			}, 300);
		} else {
			clearInterval(this.GridTableUpdateInterval);
		}
	},

	/*
	 * 피평가자들의 평가문서 조회
	 */
	successDirectReports: function() {

		$.app.byId("async-messages").getModel().setProperty("/Messages/0", {type: "Success", title: $.app.getBundleText("MSG_04008")}); // 피평가자 목록 조회 완료

		var directReports = this.DirectReportsModel.getResults();
		if ($.app.LOG.ENABLE_SUCCESS) Common.log("DirectReports success", directReports);

		this.resetComboBoxItems(directReports);

		var oController = this,
		selectedYear = $.app.byId("YearsCombo").getSelectedKey(),
		countMap = {
			"step0": 0, // 전체
			"step1": 0, // 본인 평가
			"step2": 0, // 부서장 평가
			"step3": 0, // 업적평가 등급결정
			"step4": 0, // 종합평가 준비
			"step5": 0, // 종합평가
			"step6": 0, // HR확인
			"step7": 0, // 결과확인
			"step8": 0  // 평가완료
		},
		groupOrder = {
			S1: 5, // 임원
			S2: 4, // 수석
			M: 3,  // 책임
			SA: 2, // 대리
			A: 1   // 사원
		},
		mergeGroup = ["S1", "S2", "M", "SA", "A"],
		managerGroup = ["S1", "S2", "M"],
		reportGroup = ["SA", "A"],
		ManagerGroupMap = {},
		ReportGroupMap = {},
		MergeGroupMap = {},
		ManagerGroupList = [],
		ReportGroupList = [],
		MergeGroupList = [],
		formHeaderPMModels = [],
		formHeader360Models = [],
		goalModels = [];

		$.each(directReports, function(i, o) {
			if (o.custom04) { // 평가제외자 : custom04에 값이 있으면 제외
				return;
			}

			var empGrade = oController.EmpGradeMap[o.custom01];
			if ($.inArray(empGrade, managerGroup) > -1) {
				o.group = "간부";

				ManagerGroupMap[o.userId] = o;
				ManagerGroupList.push(o);
			}
			if ($.inArray(empGrade, reportGroup) > -1) {
				o.group = "일반";

				ReportGroupMap[o.userId] = o;
				ReportGroupList.push(o);
			}
			if ($.inArray(empGrade, mergeGroup) > -1) {
				o.goal = 0;
				o.activity = 0;
				o.result = 0;

				MergeGroupMap[o.userId] = o;
				// MergeGroupList.push(o);

				$.app.LOG.DATA[o.userId] = {};

				formHeaderPMModels.push(oController.retrieveFormHeaderPM(o.userId));
				formHeader360Models.push(oController.retrieveFormHeader360(o.userId));
				// goalModels.push(oController.retrieveGoal(o.userId));
				// goalModels.push(oController.retrieveActivity(o.userId));
				// goalModels.push(oController.retrieveAchievement(o.userId));
			}
		});

		Common.log("selectedYear", selectedYear);
		Common.log("MergeGroupMap", MergeGroupMap);
		Common.log("ManagerGroupMap", ManagerGroupMap);
		Common.log("ReportGroupMap", ReportGroupMap);

		ManagerGroupList.sort(function(o1, o2) {
			return groupOrder[oController.EmpGradeMap[o2.custom01]] - groupOrder[oController.EmpGradeMap[o1.custom01]];
		});
		ReportGroupList.sort(function(o1, o2) {
			return groupOrder[oController.EmpGradeMap[o2.custom01]] - groupOrder[oController.EmpGradeMap[o1.custom01]];
		});

		this.DirectReportsModel.setData({
			ManagerGroupMap: ManagerGroupMap,
			ReportGroupMap: ReportGroupMap,
			MergeGroupMap: MergeGroupMap,
			ManagerGroupList: ManagerGroupList,
			ReportGroupList: ReportGroupList,
			MergeGroupList: MergeGroupList
		});

		var promises = [];
		$.map(formHeaderPMModels, function(m) {
			promises.push(m.load().promise());
		});
		$.map(formHeader360Models, function(m) {
			promises.push(m.load().promise());
		});
		$.map(goalModels, function(m) {
			promises.push(m.load().promise());
		});

		this.startGridTableUpdating(true);

		Promise.all(
			promises // 개인별 평가문서, 목표 개수, 활동 개수, 실적 개수조회
		)
		.then(function() {
			$.app.byId("async-messages").getModel().setProperty("/Messages/1", {type: "Success", title: $.app.getBundleText("MSG_04009")}); // 피평가자별 평가문서 정보 조회 완료

			var i = -1;
			$.map(MergeGroupMap, function(o) {
				if (o.excluded === true) {
					return;
				}

				o.rowIndex = ++i;

				++countMap.step0;
				     if (o.currentStep === "본인 평가")			++countMap.step1;
				else if (o.currentStep === "부서장 평가")		++countMap.step2;
				else if (o.currentStep === "업적평가 등급결정")	++countMap.step3;
				else if (o.currentStep === "종합평가 준비")		++countMap.step4;
				else if (o.currentStep === "종합평가")			++countMap.step5;
				else if (o.currentStep === "HR확인")			++countMap.step6;
				else if (o.currentStep === "결과확인")			++countMap.step7;
				else if (o.currentStep === "평가완료")			++countMap.step8;

				MergeGroupList.push(o);
			});

			var AppraiseesTable = $.app.byId("AppraiseesTable");
			Common.adjustVisibleRowCount(AppraiseesTable, 10, MergeGroupList.length);

			MergeGroupList.sort(function(o1, o2) {
				return groupOrder[oController.EmpGradeMap[o2.custom01]] - groupOrder[oController.EmpGradeMap[o1.custom01]];
			});

			oController.TableModel.setProperty("/IconTabFilterCountMap", countMap);

			// 평가문서 조회 후 본인 업적평가 항목, 본인 역량평가 항목, 1차 업적평가/역량평가 점수, 다면평가 점수 조회
			return Promise.all(
				$.map(oController.RatingsRequests, function(m) {
					return m.load().promise();
				})
			);
		})
		.then(function() {
			$.app.byId("async-messages").getModel().setProperty("/Messages/2", {type: "Success", title: $.app.getBundleText("MSG_04010")}); // 피평가자별 본인평가 항목 정보 조회 완료
			$.app.byId("async-messages").getModel().setProperty("/Messages/4", {type: "Success", title: $.app.getBundleText("MSG_04012")}); // 피평가자별 1차평가 결과 조회 완료
			$.app.byId("async-messages").getModel().setProperty("/Messages/5", {type: "Success", title: $.app.getBundleText("MSG_04013")}); // 피평가자별 다면평가 결과 조회 완료

			// 본인 업적평가 점수, 본인 역량평가 점수 조회
			return Promise.all(
				$.map(oController.SelfRatingsRequests, function(m) {
					return m.load().promise();
				})
			);
		})
		.then(function() {
			oController.startGridTableUpdating(false);

			// 점수 계산
			var calculations = $.map(oController.DirectReportsModel.getData().MergeGroupList, function(o, i) {
				return new Promise(function(resolve, reject) {
					setTimeout(function() {
						$.app.LOG.DATA[o.userId]["00 성명"] = o.nickname;
						$.app.LOG.DATA[o.userId]["08 본인 업적평가 점수"] = {};
						$.app.LOG.DATA[o.userId]["09 본인 역량평가 점수"] = {};
						$.app.LOG.DATA[o.userId]["12 data"] = o;

						var AppraiseesTable = $.app.byId("AppraiseesTable");
						setTimeout(function() {
							// 본인평가 업적점수
							var selfAchievement = 0;
							$.map(o.selfAchievementItems || [], function(p, j) {
								var rating = Math.max(Number(p.rating || 0), 0), value = p.weight * rating * 0.01;
								selfAchievement += value;
								$.app.LOG.DATA[o.userId]["08 본인 업적평가 점수"][String(j)] = "${p.weight} * ${p.rating} * 0.01 = ${value}".interpolate(p.weight, rating, value);
							});
							AppraiseesTable.getModel().setProperty("/Appraisees/${i}/selfAchievement".interpolate(i), selfAchievement);
						}, 0);

						setTimeout(function() {
							// 본인평가 역량점수
							var selfCompetencySum = 0;
							$.map(o.selfCompetencyItems || [], function(p, j) {
								var rating = Math.max(Number(p.rating || 0), 0);
								selfCompetencySum += rating;
								$.app.LOG.DATA[o.userId]["09 본인 역량평가 점수"][String(j)] = rating;
							});
							AppraiseesTable.getModel().setProperty("/Appraisees/${i}/selfCompetency".interpolate(i), selfCompetencySum / ((o.selfCompetencyItems || []).length || 1));
						}, 0);

						resolve();
					}, 0);
				});
			});

			return Promise.all(calculations);
		})
		.then(function() {
			$.app.byId("async-messages").getModel().setProperty("/Messages/3", {type: "Success", title: $.app.getBundleText("MSG_04011")}); // 피평가자별 본인평가 항목별 점수 조회 완료
			$.app.byId("TeamsMultiCombo").setEnabled(true);

			setTimeout(function() {
				$.app.spinner(false);
				$.app.byId("async-messages").toggle($.app.byId("async-spinner"));
			}, 1500);
		})
		.catch(function() {
			if ($.app.LOG.DATA.ENABLE_FAILURE) Common.log("grid data retrieval error", arguments);
		});
	},

	/*
	 * 목표 개수 조회
	 */
	retrieveGoal: function(pUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/Goal_2")
			.filter("userId eq '${pUserId}'".interpolate(pUserId))
			.inlinecount()
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["01 목표 개수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap,
				ReportGroupMap = DirectReportsData.ReportGroupMap,
				userId = (this.getResults()[0] || {}).userId,
				inlinecount = this.getInlinecount() || 0;

				if (ManagerGroupMap[userId]) {
					ManagerGroupMap[userId].goal = inlinecount;
				}
				if (ReportGroupMap[userId]) {
					ReportGroupMap[userId].goal = inlinecount;
				}

				$.app.LOG.DATA[pUserId]["01 목표 개수 조회"].inlinecount = inlinecount;
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["01 목표 개수 조회"] = {failure: arguments, model: this};
			});
	},

	/*
	 * 활동 개수 조회
	 */
	retrieveActivity: function(pSubjectUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/Activity")
			.filter("subjectUserId eq '${pSubjectUserId}'".interpolate(pSubjectUserId))
			.expand("subjectUserIdNav")
			.inlinecount()
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pSubjectUserId]["02 활동 개수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap,
				ReportGroupMap = DirectReportsData.ReportGroupMap,
				subjectUserId = (this.getResults()[0] || {}).subjectUserId,
				inlinecount = this.getInlinecount() || 0;

				if (ManagerGroupMap[subjectUserId]) {
					ManagerGroupMap[subjectUserId].activity = inlinecount;
				}
				if (ReportGroupMap[subjectUserId]) {
					ReportGroupMap[subjectUserId].activity = inlinecount;
				}

				$.app.LOG.DATA[pSubjectUserId]["02 활동 개수 조회"].inlinecount = inlinecount;
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pSubjectUserId]["02 활동 개수 조회"] = {failure: arguments, model: this};
			});
	},

	/*
	 * 실적 개수 조회
	 */
	retrieveAchievement: function(pSubjectUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/Achievement")
			.filter("subjectUserId eq '${pSubjectUserId}'".interpolate(pSubjectUserId))
			.expand("subjectUserIdNav")
			.inlinecount()
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pSubjectUserId]["03 실적 개수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap,
				ReportGroupMap = DirectReportsData.ReportGroupMap,
				subjectUserId = (this.getResults()[0] || {}).subjectUserId,
				inlinecount = this.getInlinecount() || 0;

				if (ManagerGroupMap[subjectUserId]) {
					ManagerGroupMap[subjectUserId].result = inlinecount;
				}
				if (ReportGroupMap[subjectUserId]) {
					ReportGroupMap[subjectUserId].result = inlinecount;
				}

				$.app.LOG.DATA[pSubjectUserId]["03 실적 개수 조회"].inlinecount = inlinecount;
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pSubjectUserId]["03 실적 개수 조회"] = {failure: arguments, model: this};
			});
	},

	/*
	 * 업적/역량평가 문서 조회
	 */
	retrieveFormHeaderPM: function(pFormSubjectId) {

		return new JSONModelHelper()
			.url("/odata/v2/FormHeader")
			.select("currentStep")
			.select("formDataId")
			.select("formDataStatus")
			.select("formSubjectId")
			.select("formAuditTrails/formContentId")
			.select("formAuditTrails/auditTrailRecipient")
			.filter("formTemplateId eq '${formTemplateId}'".interpolate(this.FormTemplateIdMap[Common.getOperationMode()].PM))
			.filter("formDataStatus ne '4'")
			.filter("formSubjectId in '${pFormSubjectId}'".interpolate(pFormSubjectId))
			.expand("formAuditTrails")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pFormSubjectId]["04 업적/역량평가 문서 조회"] = {success: arguments, model: this};

				var oController = this.getController(), results = this.getResults();
				if (!results.length) {
					oController.DirectReportsModel.setProperty("/MergeGroupMap/${result.formSubjectId}/excluded".interpolate(pFormSubjectId), true);
					return;
				}

				var DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap,
				ReportGroupMap = DirectReportsData.ReportGroupMap,
				result = results.sort(function(f1, f2) { return Number(f1.formDataId) - Number(f2.formDataId); }).pop() || {},
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
				result.result360 = 0;

				if (ManagerGroupMap[result.formSubjectId]) {
					$.extend(ManagerGroupMap[result.formSubjectId], result);
				}
				if (ReportGroupMap[result.formSubjectId]) {
					$.extend(ReportGroupMap[result.formSubjectId], result);
				}

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

	/*
	 * 다면평가 문서 조회
	 */
	retrieveFormHeader360: function(pFormSubjectId) {

		var formContentsStatus = ["3", "10"];
		return new JSONModelHelper()
			.url("/odata/v2/FormHeader")
			.select("currentStep")
			.select("formDataId")
			.select("formDataStatus")
			.select("formSubjectId")
			.select("formContents/formContentId")
			.select("formContents/status")
			.filter("formTemplateId eq '${formTemplateId}'".interpolate(this.FormTemplateIdMap[Common.getOperationMode()]["360"]))
			.filter("formDataStatus ne '4'")
			.filter("formContents/status in '${formContentsStatus}'".interpolate(formContentsStatus.join("','")))
			.filter("formSubjectId in '${pFormSubjectId}'".interpolate(pFormSubjectId))
			.expand("formContents")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pFormSubjectId]["05 다면평가 문서 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap,
				ReportGroupMap = DirectReportsData.ReportGroupMap,
				result = this.getResults().sort(function(f1, f2) { return Number(f1.formDataId) - Number(f2.formDataId); }).pop() || {},
				formContents = (result.formContents || {}).results || [];

				result.formContentId = (
					formContents.sort(function(p2, p1) {
						if ($.inArray(p1.status, formContentsStatus) === -1) {
							return 1;
						}
						if ($.inArray(p2.status, formContentsStatus) === -1) {
							return -1;
						}
						return Number(p2.formContentId) - Number(p1.formContentId);
					}).pop() || {} // 배열 우측 마지막 요소 추출 : formContentId가 가장 큰 object
				).formContentId;

				var currentStep360 = (result.currentStep || "평가완료").replace(/.+\-\s*(.+)\s*$/, "$1");

				if (ManagerGroupMap[result.formSubjectId]) {
					ManagerGroupMap[result.formSubjectId].currentStep360 = currentStep360;
				}
				if (ReportGroupMap[result.formSubjectId]) {
					ReportGroupMap[result.formSubjectId].currentStep360 = currentStep360;
				}

				$.app.LOG.DATA[pFormSubjectId]["05 다면평가 문서 조회"].result = result;
				$.app.LOG.DATA[pFormSubjectId]["05 다면평가 문서 조회"].currentStep = result.currentStep || "평가완료";

				if (result.currentStep) { // 현재 진행상태가 null인 경우 '평가완료'이므로 다면평가 정보를 조회하고 이전 상태인 경우 조회하지 않음
					return;
				}

				if (result.formContentId && result.formDataId) {
					oController.RatingsRequests.push(oController.retrieveRatings360(result.formContentId, result.formDataId, result.formSubjectId)); // 다면평가 항목 조회
				}
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pFormSubjectId]["05 다면평가 문서 조회"] = {failure: arguments, model: this};
			});
	},

	/*
	 * 본인 업적평가 항목 조회
	 */
	retrieveSelfAchievementItems: function(pFormContentId, pFormDataId, pUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/FormObjectiveSection(formContentId=${pFormContentId}L,formDataId=${pFormDataId}L,sectionIndex=1)/objectives".interpolate(pFormContentId, pFormDataId))
			.select("weight")
			.select("othersRatingComment")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["06 본인 업적평가 항목 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap[pUserId],
				ReportGroupMap = DirectReportsData.ReportGroupMap[pUserId],
				selfAchievementItemMap = {},
				results = this.getResults();

				if (ManagerGroupMap) {
					ManagerGroupMap.selfAchievementItems = results;
					ManagerGroupMap.selfAchievementItemMap = selfAchievementItemMap;
				}
				if (ReportGroupMap) {
					ReportGroupMap.selfAchievementItems = results;
					ReportGroupMap.selfAchievementItemMap = selfAchievementItemMap;
				}

				$.app.LOG.DATA[pUserId]["06 본인 업적평가 항목 조회"].results = results;
				$.app.LOG.DATA[pUserId]["08 본인 업적평가 점수 조회"] = {};

				// 본인 업적평가 항목별 점수 조회
				$.each(results, function(i, o) {
					var uri = o.othersRatingComment.__deferred.uri.replace(/^.+\/odata\//, "/odata/");

					selfAchievementItemMap[uri] = o;
					oController.SelfRatingsRequests.push(oController.retrieveSelfAchievementRatings(uri, o.weight, pUserId));
				});
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["06 본인 업적평가 항목 조회"] = {failure: arguments, model: this};
			});
	},

	/*
	 * 본인 역량평가 항목 조회
	 */
	retrieveSelfCompetencyItems: function(pFormContentId, pFormDataId, pUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/FormCompetencySection(formContentId=${pFormContentId}L,formDataId=${pFormDataId}L,sectionIndex=3)/competencies".interpolate(pFormContentId, pFormDataId))
			.select("othersRatingComment")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["07 본인 역량평가 항목 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap[pUserId],
				ReportGroupMap = DirectReportsData.ReportGroupMap[pUserId],
				selfCompetencyItemMap = {},
				results = this.getResults();

				if (ManagerGroupMap) {
					ManagerGroupMap.selfCompetencyItems = results;
					ManagerGroupMap.selfCompetencyItemMap = selfCompetencyItemMap;
				}
				if (ReportGroupMap) {
					ReportGroupMap.selfCompetencyItems = results;
					ReportGroupMap.selfCompetencyItemMap = selfCompetencyItemMap;
				}

				$.app.LOG.DATA[pUserId]["07 본인 역량평가 항목 조회"].results = results;
				$.app.LOG.DATA[pUserId]["09 본인 역량평가 점수 조회"] = {};

				// 본인 역량평가 항목별 점수 조회
				$.each(results, function(i, o) {
					var uri = o.othersRatingComment.__deferred.uri.replace(/^.+\/odata\//, "/odata/");

					selfCompetencyItemMap[uri] = o;
					oController.SelfRatingsRequests.push(oController.retrieveSelfCompetencyRatings(uri, pUserId));
				});
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["07 본인 역량평가 항목 조회"] = {failure: arguments, model: this};
			});
	},

	/*
	 * 본인 업적평가 점수 조회
	 */
	retrieveSelfAchievementRatings: function(pUri, pWeight, pUserId) {

		return new JSONModelHelper()
			.url(pUri)
			.select("userId")
			.select("rating")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["08 본인 업적평가 점수 조회"][pUri] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap[pUserId],
				ReportGroupMap = DirectReportsData.ReportGroupMap[pUserId],
				data = $.map(this.getResults(), function(o) { if (o.userId === pUserId) return o; })[0] || {};

				data.weight = Number(pWeight || 0);

				$.app.LOG.DATA[pUserId]["08 본인 업적평가 점수 조회"][pUri].result = data;

				if (ManagerGroupMap) {
					$.extend(ManagerGroupMap.selfAchievementItemMap[pUri], data);
				}
				if (ReportGroupMap) {
					$.extend(ReportGroupMap.selfAchievementItemMap[pUri], data);
				}
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["08 본인 업적평가 점수 조회"][pUri] = {failure: arguments, model: this};
			});
	},

	/*
	 * 본인 역량평가 점수 조회
	 */
	retrieveSelfCompetencyRatings: function(pUri, pUserId) {

		return new JSONModelHelper()
			.url(pUri)
			.select("userId")
			.select("rating")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["09 본인 역량평가 점수 조회"][pUri] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap[pUserId],
				ReportGroupMap = DirectReportsData.ReportGroupMap[pUserId],
				data = $.map(this.getResults(), function(o) { if (o.userId === pUserId) return o; })[0] || {};

				$.app.LOG.DATA[pUserId]["09 본인 역량평가 점수 조회"][pUri].result = data;

				if (ManagerGroupMap) {
					$.extend(ManagerGroupMap.selfCompetencyItemMap[pUri], data);
				}
				if (ReportGroupMap) {
					$.extend(ReportGroupMap.selfCompetencyItemMap[pUri], data);
				}
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["09 본인 역량평가 점수 조회"][pUri] = {failure: arguments, model: this};
			});
	},

	/*
	 * 1차 평가 점수, 등급 조회
	 */
	retrieveTalentRatings: function(pFormContentId, pFormDataId, pUserId) {

		return new JSONModelHelper()
			.url("/odata/v2/TalentRatings")
			.filter("formContentId eq ${pFormContentId}L".interpolate(pFormContentId))
			.filter("formDataId eq ${pFormDataId}L".interpolate(pFormDataId))
			.filter("feedbackType in 8,10,11")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pUserId]["10 1차 평가 점수, 등급 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap,
				ReportGroupMap = DirectReportsData.ReportGroupMap,
				results = this.getResults();

				$.app.LOG.DATA[pUserId]["10 1차 평가 점수, 등급 조회"].results = results;

				var p = {}, employeeId;
				$.each(results, function(i, o) {
					employeeId = o.employeeId;
					if (o.feedbackType === 8) { // 평가등급, feedbackRatingLabel
						p.evaluationGrade = o.feedbackRatingLabel;
					} else if (o.feedbackType === 10) { // 역량점수, feedbackRating
						p.firstCompetency = Math.max(o.feedbackRating, 0);
					} else if (o.feedbackType === 11) { // 업적점수, feedbackRating
						p.firstAchievement = Math.max(o.feedbackRating, 0);
					}
				});

				if (ManagerGroupMap[employeeId]) {
					$.extend(ManagerGroupMap[employeeId], p);
				}
				if (ReportGroupMap[employeeId]) {
					$.extend(ReportGroupMap[employeeId], p);
				}
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pUserId]["10 1차 평가 점수, 등급 조회"] = {failure: arguments, model: this};
			});
	},

	/*
	 * 다면평가 점수 조회
	 */
	retrieveRatings360: function(pFormContentId, pFormDataId, pFormSubjectId) {

		return new JSONModelHelper()
			.url("/odata/v2/Form360RaterSection(formContentId=${pFormContentId}L,formDataId=${pFormDataId}L)".interpolate(pFormContentId, pFormDataId))
			.select("formDataId")
			.select("formContentId")
			.select("form360Raters/category")
			.select("form360Raters/participantRating")
			.expand("form360Raters")
			.attachRequestCompleted(function() {
				$.app.LOG.DATA[pFormSubjectId]["11 다면평가 점수 조회"] = {success: arguments, model: this};

				var oController = this.getController(),
				DirectReportsData = oController.DirectReportsModel.getData(),
				ManagerGroupMap = DirectReportsData.ManagerGroupMap,
				ReportGroupMap = DirectReportsData.ReportGroupMap,
				results = (this.getData().d.form360Raters || {}).results || [];

				$.app.LOG.DATA[pFormSubjectId]["11 다면평가 점수 조회"].results = results;

				var score = 0,
				count = $.map(results, function(o) {
					score += Number(o.participantRating.replace(/\/[^\/]+/, "") || 0);
					return 1;
				}).length || 1;

				if (ManagerGroupMap[pFormSubjectId]) {
					ManagerGroupMap[pFormSubjectId].result360 = score / count;
				}
				if (ReportGroupMap[pFormSubjectId]) {
					ReportGroupMap[pFormSubjectId].result360 = score / count;
				}
			})
			.attachRequestFailed(function() {
				$.app.LOG.DATA[pFormSubjectId]["11 다면평가 점수 조회"] = {failure: arguments, model: this};
			});
	},

	getLocalSessionModel: Common.isLOCAL() ? function() {
		return new JSONModel({name: "35118818"}); // 
		// return new JSONModel({name: "20001003"}); // 최팀장
		// return new JSONModel({name: "20011013"}); // 조정훈
		// return new JSONModel({name: "9702574"}); // 오창엽
	} : null

});

});