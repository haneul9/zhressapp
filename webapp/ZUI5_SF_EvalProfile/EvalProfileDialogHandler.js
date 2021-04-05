/* global Promise:true */
sap.ui.define([
	"../common/Common",
	"../common/EmployeeModel",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/export/Spreadsheet"
], function (Common, EmployeeModel, JSONModelHelper, MessageBox, Spreadsheet) {
"use strict";

var EvalProfileHandler = { // 평가이력

	oDialog: null,
	EmployeeModel: new EmployeeModel(),
	EvalProfileModel: new JSONModelHelper({
		MostRecentEvalResults: [],
		Before2020EvalResults: []
	}),

	// DialogHandler 호출 function
	get: function(oController, AppraiseeId) {

		this.oController = oController;
		this.AppraiseeId = AppraiseeId;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "EvalProfilePopup",
			name: "ZUI5_SF_EvalProfile.EvalProfileDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	getParentView: function() {

		return this.oController.getView();
	},

	// DialogHandler 호출 function
	getModel: function() {

		return this.EvalProfileModel;
	},

	// DialogHandler 호출 function
	getDialog: function() {

		return this.oDialog;
	},

	// DialogHandler 호출 function
	setDialog: function(oDialog) {

		this.oDialog = oDialog;

		return this;
	},

	getEmployeeModel: function() {

		return this.EmployeeModel;
	},

	setColModel: function(name, colModel) {

		this[name] = colModel;
	},

	// DialogHandler 호출 function
	onBeforeOpen: function() {
		Common.log("Evaluation profile dialog handler.onBeforeOpen"); // 사용자의 평가이력 조회

		this.EmployeeModel.retrieve(this.AppraiseeId);

		var handler = this;
		return Promise.all([
			new JSONModelHelper()
				.url("/odata/v2/Background_EvalResult")
				.filter("userId eq '${this.AppraiseeId}'".interpolate(this.AppraiseeId))
				.attachRequestCompleted(function() {
					var results = [
						{year: 2020, type: "조직", score: 92, grade: "A", comment: "조직 의견입니다.\n조직 의견입니다.\n조직 의견입니다."},
						{year: 2020, type: "업적", score: 78, grade: "A", comment: "업적 의견입니다.\n업적 의견입니다.\n업적 의견입니다."},
						{year: 2020, type: "역량", score: 84, grade: "B", comment: "역량 의견입니다.\n역량 의견입니다.\n역량 의견입니다."},
						{year: 2020, type: "다면", score: 88, grade: "B", comment: "다면 의견입니다.\n다면 의견입니다.\n다면 의견입니다."},
						{year: 2020, type: "종합", score: 83, grade: "C", comment: "종합 의견입니다.\n종합 의견입니다.\n종합 의견입니다."}
					];

					Common.adjustVisibleRowCount($.app.byId("MostRecentEvalResultsTable").setBusy(false), 10, results.length);

					$.map(results, function(o, i) {
						setTimeout(function() {
							handler.EvalProfileModel.setProperty("/MostRecentEvalResults/" + i, o);
						}, Math.random() * 1500);
					});
				})
				.attachRequestFailed(function() {
					Common.log("Background_EvalResult fail", arguments);

					$.app.byId("MostRecentEvalResultsTable").setBusy(false);
				})
				.load()
				.promise(),
			new JSONModelHelper()
				.url("/odata/v2/Background_EvalResult")
				.filter("userId eq '${this.AppraiseeId}'".interpolate(this.AppraiseeId))
				.attachRequestCompleted(function() {
					var results = this.getResults();
					results.sort(function(o1, o2) { return o2.year - o1.year; }); // 연도별 내림차순 정렬

					handler.EvalProfileModel.setProperty("/Before2020EvalResults", results);

					Common.adjustVisibleRowCount($.app.byId("Before2020EvalResultsTable").setBusy(false), 10, results.length);
				})
				.attachRequestFailed(function() {
					Common.log("Background_EvalResult fail", arguments);

					$.app.byId("Before2020EvalResultsTable").setBusy(false);
				})
				.load()
				.promise()
		]);
	},

	onPressExcelDownload1: function() {

		var tableData = $.app.byId("MostRecentEvalResultsTable").getModel().getProperty("/MostRecentEvalResults");
		if (!tableData || !tableData.length) {
			MessageBox.warning(this.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
			return;
		}

		new Spreadsheet({
			worker: false,
			dataSource: tableData,
			workbook: {columns: Common.convertColumnArrayForExcel(this, EvalProfileHandler._colModel1)},
			fileName: "${fileName}-${datetime}.xlsx".interpolate(this.getBundleText("LABEL_07001"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyyMMdd-HHmmss"}).format(new Date()))
		}).build();
	},

	onPressExcelDownload2: function() {

		var tableData = $.app.byId("Before2020EvalResultsTable").getModel().getProperty("/Before2020EvalResults");
		if (!tableData || !tableData.length) {
			MessageBox.warning(this.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
			return;
		}

		new Spreadsheet({
			worker: false,
			dataSource: tableData,
			workbook: {columns: Common.convertColumnArrayForExcel(this, EvalProfileHandler._colModel2)},
			fileName: "${fileName}-${datetime}.xlsx".interpolate(this.getBundleText("LABEL_07002"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyyMMdd-HHmmss"}).format(new Date()))
		}).build();
	}

};

return EvalProfileHandler;

});