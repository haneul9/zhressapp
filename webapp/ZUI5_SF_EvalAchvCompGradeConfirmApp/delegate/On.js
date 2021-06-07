sap.ui.define([
	"../../ZUI5_SF_EvalProfile/EvalProfileDialogHandler",
	"common/Common",
	"common/DialogHandler",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/export/Spreadsheet"
], function(
	EvalProfileDialogHandler,
	Common,
	DialogHandler,
	MessageBox,
	BusyIndicator,
	Spreadsheet
) {
"use strict";

var On = { // 업적&역량 평가 event handler

	// 검색 영역 조직 combobox change event handler
	changeOrg: function(oEvent) {
		BusyIndicator.show(0);

		var org = oEvent.getSource().getSelectedKey();
		if (!org) {
			BusyIndicator.hide();
			return;
		}

		On.filter.call(this, $.app.byId("GroupComboBox").getSelectedKey(), org);

		BusyIndicator.hide();
	},

	// 검색 영역 그룹 combobox change event handler
	changeGroup: function(oEvent) {
		BusyIndicator.show(0);

		var groupCode = oEvent.getSource().getSelectedKey();
		if (!groupCode) {
			BusyIndicator.hide();
			return;
		}

		var FilterComboBoxType = this.SearchModel.getProperty("/FilterComboBoxType");
		On.filter.call(this, groupCode, FilterComboBoxType ? $.app.byId("OrgComboBox").getSelectedKey() : null);

		BusyIndicator.hide();
	},

	filter: function(groupCode, org) {

		var appraiseeList = this.DirectReportsModel.getProperty("/GroupMap/${groupCode}/appraiseeList".interpolate(groupCode)),
		A = 0, B = 0, C = 0;

		appraiseeList = $.map(appraiseeList, function(o) {
			if (o.excluded === true) {
				return;
			}
			if (!org || o.division === org) {
				if (o.evaluationGrade === "A") ++A;
				if (o.evaluationGrade === "B") ++B;
				if (o.evaluationGrade === "C") ++C;

				return o;
			}
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

		var selectedYear = this.SearchModel.getProperty("/EvalYear");
		if (!selectedYear) {
			MessageBox.warning(this.getBundleText("MSG_03002"), { // 평가연도를 선택하세요.
				onClose: function() {
					$.app.byId("YearComboBox").focus();
				}
			});
			$.app.spinner(false);
			return;
		}

		this.RatingsRequests = [];
		this.SelfRatingsRequests = [];

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
		Common.log("onChangeGrade", oEvent.getParameters(), oEvent.getSource());

		BusyIndicator.show(0);

		var rowIndex = oEvent.getSource().getCustomData()[0].getValue();
		this.TableModel.setProperty("/Appraisees/${rowIndex}/evaluationGrade".interpolate(rowIndex), oEvent.getParameters().value);

		var A = 0, B = 0, C = 0;
		$.each(this.TableModel.getProperty("/Appraisees"), function(i, o) {
				 if (o.evaluationGrade === "A") ++A;
			else if (o.evaluationGrade === "B") ++B;
			else if (o.evaluationGrade === "C") ++C;
		});

		var total = this.CountModel.getProperty("/Criterion/T");
		this.CountModel.setProperty("/Selected", {A: A, B: B, C: C});
		this.CountModel.setProperty("/Ratio", {A: (A / total * 100).toFixed(2), B: (B / total * 100).toFixed(2), C: (C / total * 100).toFixed(2)});

		BusyIndicator.hide();
	},

	// Table 문서 column icon click event handler
	pressDeepLinkIcon: function(oEvent) {
		Common.log("onPressDeepLinkIcon", oEvent.getSource().getBindingContext().getProperty());

		window.open(oEvent.getSource().getBindingContext().getProperty().evalDocDeepLink);
	},

	// Table 프로필 column icon click event handler
	pressPopupIcon: function(oEvent) {
		Common.log("onPressPopupIcon", oEvent.getSource().getBindingContext().getProperty());

		// // 2020-12-10 평가이력 dialog 변경
		var oController = this;
		var oView = oController.getView();

		if (!oController._HistoryDialog) {
			oController._HistoryDialog = sap.ui.jsfragment("fragment.EvalHistory", oController);
			oView.addDependent(oController._HistoryDialog);

			oController._HistoryDialog.setTitle(oController.getBundleText.getText("LABEL_07001")); // 평가이력
		}

		common.SearchEvalHistory.userId = oEvent.getSource().getBindingContext().getProperty().userId;

		oController._HistoryDialog.open();

		// var userId = oEvent.getSource().getBindingContext().getProperty().userId;
		// setTimeout(function() {
		// 	this.EvalProfileDialogHandler = EvalProfileDialogHandler.get(this, userId);
		// 	DialogHandler.open(this.EvalProfileDialogHandler);
		// }.bind(this), 0);
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

		BusyIndicator.show(0);

		var Appraisees = this.TableModel.getProperty("/Appraisees");
		if (!Appraisees.length) {
			BusyIndicator.hide();
			MessageBox.information(this.getBundleText("MSG_00015")); // 저장할 데이터가 없습니다.
			return;
		}

		var isValidCurrentSteps = $.map(Appraisees, function(o) {
			if (o.currentStep !== "업적평가 등급결정") {
				return 1;
			}
		}).length === 0;
		if (!isValidCurrentSteps) {
			BusyIndicator.hide();
			MessageBox.error(this.getBundleText("MSG_03003")); // 모든 진행상태가 '업적평가 등급결정'이 아닐 경우 1차 등급 저장 및 확정을 할 수 없습니다.
			return;
		}

		Promise.all([
			new Promise(function(resolve, reject) {
				this.submitBatch(Appraisees, resolve, reject);
			}.bind(this)),
			new Promise(function(resolve, reject) {
				this.sendResultToS4Hana(Appraisees, resolve, reject);
			}.bind(this))
		])
		.then(function() {
			if (typeof sendToNextStep === "function") {
				this.sendToNextStep.call(this);
			} else {
				BusyIndicator.hide();
				MessageBox.success(this.getBundleText("MSG_00017")); // 저장되었습니다.
			}
		}.bind(this));
	},

	// 확정 button click event handler
	pressConfirm: function() {

		BusyIndicator.show(0);

		var Appraisees = this.TableModel.getProperty("/Appraisees"), total = Appraisees.length;

		if (total < 1) {
			BusyIndicator.hide();
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
			BusyIndicator.hide();
			MessageBox.error(this.getBundleText("MSG_03020")); // 등급은 모두 필수 입력 항목입니다.
			return;
		}
		if (total < 3) {
			if (A > 1) {
				BusyIndicator.hide();
				MessageBox.error(this.getBundleText("MSG_03021")); // 선택된 그룹의 인원이 2명 이하인 경우 A등급은 1명까지만 부여가능합니다.
				return;
			}
		} else {
			if ((A / total * 100 > 20) && A > Math.round(total * 0.2)) {
				BusyIndicator.hide();
				MessageBox.error(this.getBundleText("MSG_03005")); // A등급은 선택된 그룹 인원의 20%를 초과하여 부여할 수 없으며\n5명 이하 그룹의 경우 1명까지만 부여가능합니다.
				return;
			}
		}

		var oController = this;
		MessageBox.confirm(this.getBundleText("MSG_03023"), { // 1차 평가등급을 확정하시겠습니까?
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					On.pressSave.call(oController, oController.sendToNextStep);
				} else {
					BusyIndicator.hide();
				}
			}
		});
	}

};

return On;

});