sap.ui.define([
	"../../common/Common",
	"../../common/DialogHandler",
	"../../common/JSONModelHelper",
	"../../ZUI5_SF_EvalProfile/EvalProfileDialogHandler",
	"./OwnFunctions",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/export/Spreadsheet"
], function(Common, DialogHandler, JSONModelHelper, EvalProfileDialogHandler, OwnFunctions, MessageBox, Fragment, Spreadsheet) {
"use strict";

var On = { // 업적&역량 평가 event handler

	// 검색 영역 조직 combobox change event handler
	changeOrg: function(oEvent) {
		this.getView().setBusy(true);

		var orgCode = oEvent.getSource().getSelectedKey();
		if (!orgCode) {
			this.getView().setBusy(false);
			return;
		}

		OwnFunctions.resetGroupComboBoxItems.bind(this)(this.DirectReportsModel.getProperty("/GroupMap"), orgCode);
		On.filter.bind(this)($.app.byId("GroupComboBox").getSelectedKey(), orgCode);

		this.getView().setBusy(false);
	},

	// 검색 영역 그룹 combobox change event handler
	changeGroup: function(oEvent) {
		this.getView().setBusy(true);

		var groupCode = oEvent.getSource().getSelectedKey();
		if (!groupCode) {
			this.getView().setBusy(false);
			return;
		}

		var EvalExceptType = this.SearchModel.getProperty("/EvalExceptType");
		On.filter.bind(this)(groupCode, EvalExceptType ? $.app.byId("OrgComboBox").getSelectedKey() : "X");

		this.getView().setBusy(false);
	},

	filter: function(groupCode, org) {

		var appraiseeList = this.DirectReportsModel.getProperty("/GroupMap/${org}/${groupCode}/appraiseeList".interpolate(org, groupCode)),
		A = 0, B = 0, C = 0;

		appraiseeList = $.map(appraiseeList, function(o) {
				 if (o.evaluationGrade === "A") { ++A; }
			else if (o.evaluationGrade === "B") { ++B; }
			else if (o.evaluationGrade === "C") { ++C; }

			return o;
		});

		var total = appraiseeList.length || 1,
		maxA = total < 3 ? 1 : Math.round(total * 0.2),
		maxBC = total - maxA;

		this.TableModel.setProperty("/Appraisees", appraiseeList);
		this.CountModel.setProperty("/Criterion", {A: maxA, BC: maxBC, T: total});
		this.CountModel.setProperty("/Selected", {A: A, B: B, C: C});
		this.CountModel.setProperty("/Ratio", {A: (A / total * 100).toFixed(2), B: (B / total * 100).toFixed(2), C: (C / total * 100).toFixed(2)});

		Common.adjustVisibleRowCount($.app.byId("AppraiseesTable"), 10, appraiseeList.length);
	},

	// 조회 button click event handler : 로그인한 사용자(팀장)의 directReports(팀원) 조회
	pressSearch: function() {
		Common.log("onPressSearch");

		$.app.spinner(true);

		this.MessagePopover.getModel().setProperty("/Messages", [
			{type: "Warning", title: this.getBundleText("MSG_03008")}, // 피평가자 목록 조회중
			{type: "Warning", title: this.getBundleText("MSG_03009")}, // 피평가자별 평가문서 정보 조회 대기중
			{type: "Warning", title: this.getBundleText("MSG_03010")}, // 피평가자별 목표 항목 정보 조회 대기중
			{type: "Warning", title: this.getBundleText("MSG_03011")}, // 피평가자별 본인평가 항목 정보 조회 대기중
			{type: "Warning", title: this.getBundleText("MSG_03012")}, // 피평가자별 본인평가 항목별 점수 조회 대기중
			{type: "Warning", title: this.getBundleText("MSG_03013")}  // 피평가자별 1차평가 결과 조회 대기중
		]);
		this.MessagePopover.toggle($.app.byId("async-spinner"));

		var YearComboBox = $.app.byId("YearComboBox"), selectedYear = YearComboBox.getSelectedKey();
		if (!selectedYear) {
			MessageBox.warning(this.getBundleText("MSG_03002"), { // 평가연도를 선택하세요.
				onClose: function() {
					YearComboBox.focus();
				}
			});
			$.app.spinner(false);
			return;
		}

		this.SelfAchievementItemsRequests = [];
		this.SelfAchievementRatingsRequests = [];
		this.SelfCompetencyItemsRequests = [];
		this.SelfCompetencyRatingsRequests = [];
		this.TalentRatingsRequests = [];

		// this.SearchModel.setProperty("/Orgs", []);
		// this.SearchModel.setProperty("/Groups", []);
		this.CountModel.setProperty("/Criterion", {A: 0, BC: 0, T: 0});
		this.CountModel.setProperty("/Selected", {A: 0, B: 0, C: 0});
		this.CountModel.setProperty("/Ratio", {A: (0).toFixed(2), B: (0).toFixed(2), C: (0).toFixed(2)});
		// this.TableModel.setProperty("/Appraisees", []);

		$.app.byId("OrgComboBox").setEnabled(false);
		$.app.byId("GroupComboBox").setEnabled(false);

		this.retrieveDirectReports();
	},

	// Table 등급 column combobox change event handler
	changeGrade: function(oEvent) {
		Common.log("changeGrade", oEvent.getParameters(), oEvent.getSource());

		this.getView().setBusy(true);

		var groupRowIndex = oEvent.getSource().getCustomData()[0].getValue();
		this.TableModel.setProperty("/Appraisees/${groupRowIndex}/evaluationGrade".interpolate(groupRowIndex), oEvent.getParameters().value);

		var A = 0, B = 0, C = 0;
		$.each(this.TableModel.getProperty("/Appraisees"), function(i, o) {
				 if (o.evaluationGrade === "A") { ++A; }
			else if (o.evaluationGrade === "B") { ++B; }
			else if (o.evaluationGrade === "C") { ++C; }
		});

		var total = this.CountModel.getProperty("/Criterion/T");
		this.CountModel.setProperty("/Selected", {A: A, B: B, C: C});
		this.CountModel.setProperty("/Ratio", {A: (A / total * 100).toFixed(2), B: (B / total * 100).toFixed(2), C: (C / total * 100).toFixed(2)});

		this.getView().setBusy(false);
	},

	// Table 문서 column icon click event handler
	pressDeepLinkIcon: function(oEvent) {
		Common.log("pressDeepLinkIcon", oEvent.getSource().getBindingContext().getProperty());

		window.open(oEvent.getSource().getBindingContext().getProperty().evalDocDeepLink);
	},

	// Table 평가이력 column icon click event handler
	pressPopupIcon: function(oEvent) {
		Common.log("pressPopupIcon", oEvent.getSource().getBindingContext().getProperty());

		var userId = oEvent.getSource().getBindingContext().getProperty().userId;
		setTimeout(function() {
			this.EvalProfileDialogHandler = EvalProfileDialogHandler.get(this, userId);
			DialogHandler.open(this.EvalProfileDialogHandler);
		}.bind(this), 0);
	},

	// Excel button click event handler
	pressExcelDownload: function() {

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
			fileName: "${fileName}-${datetime}.xlsx".interpolate(this.getBundleText("LABEL_03001"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}).format(new Date()))
		}).build();
	},

	// 저장 button click event handler
	pressSave: function(sendToNextStep) {

		this.getView().setBusy(true);

		var Appraisees = this.TableModel.getProperty("/Appraisees");
		if (!Appraisees.length) {
			this.getView().setBusy(false);
			MessageBox.information(this.getBundleText("MSG_00015")); // 저장할 데이터가 없습니다.
			return;
		}

		var isValidCurrentSteps = $.map(Appraisees, function(o) {
			if (o.currentStep !== "업적평가 등급결정") {
				return 1;
			}
		}).length === 0;
		if (!isValidCurrentSteps) {
			this.getView().setBusy(false);
			MessageBox.error(this.getBundleText("MSG_03003")); // 모든 진행상태가 '업적평가 등급결정'이 아닐 경우 1차 등급 저장 및 확정을 할 수 없습니다.
			return;
		}

		this.submitBatch(Appraisees, sendToNextStep);
	},

	// 확정 button click event handler
	pressConfirm: function() {

		this.getView().setBusy(true);

		var Appraisees = this.TableModel.getProperty("/Appraisees"), total = Appraisees.length;

		if (total < 1) {
			this.getView().setBusy(false);
			MessageBox.information(this.getBundleText("MSG_03004")); // 확정할 데이터가 없습니다.
			return;
		}

		// 등급 배분율 확인
		var isGradeRequired = false,
		A = $.map(Appraisees, function(o) {
			if (!o.evaluationGrade) {
				isGradeRequired = true;
				return false;
			}
			if (o.evaluationGrade === "A") {
				return 1;
			}
		}).length;

		if (isGradeRequired) {
			this.getView().setBusy(false);
			MessageBox.error(this.getBundleText("MSG_03020")); // 등급은 모두 필수 입력 항목입니다.
			return;
		}
		if (total < 3) {
			if (A > 1) {
				this.getView().setBusy(false);
				MessageBox.error(this.getBundleText("MSG_03021")); // 선택된 그룹의 인원이 2명 이하인 경우 A등급은 1명까지만 부여가능합니다.
				return;
			}
		} else {
			if ((A / total * 100 > 20) && A > Math.round(total * 0.2)) {
				this.getView().setBusy(false);
				MessageBox.error(this.getBundleText("MSG_03005")); // A등급은 선택된 그룹 인원의 20%를 초과하여 부여할 수 없으며\n5명 이하 그룹의 경우 1명까지만 부여가능합니다.
				return;
			}
		}

		var oController = this;
		MessageBox.confirm(this.getBundleText("MSG_03023"), { // 1차 평가등급을 확정하시겠습니까?
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					On.onPressSave.bind(oController)(oController.sendToNextStep);
				} else {
					oController.getView().setBusy(false);
				}
			}
		});
	}

};

return On;

});