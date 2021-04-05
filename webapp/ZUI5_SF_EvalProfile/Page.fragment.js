sap.ui.define([
	"../common/Common",
	"../common/EmpBasicInfoBox",
	"../common/Formatter",
	"../common/ZHR_TABLES"
], function (Common, EmpBasicInfoBox, Formatter, ZHR_TABLES) {
"use strict";

sap.ui.jsfragment("ZUI5_SF_EvalProfile.Page", { // 평가이력

	_colModel1: [
		{id: "year",    label: "{i18n>LABEL_07301}"/* 평가연도    */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "15%"},
		{id: "type",    label: "{i18n>LABEL_07302}"/* 평가구분    */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "15%"},
		{id: "score",   label: "{i18n>LABEL_07303}"/* 점수        */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "25%", templateGetter: null},
		{id: "grade",   label: "{i18n>LABEL_07304}"/* 등급        */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "15%", templateGetter: null},
		{id: "comment", label: "{i18n>LABEL_07305}"/* 평가자 의견 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "30%", align: sap.ui.core.HorizontalAlign.Left}
	],

	_colModel2: [
		{id: "year",   label: "{i18n>LABEL_07301}"/* 평가연도 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%"},
		{id: "grade4", label: "{i18n>LABEL_07306}"/* 조직 */,     plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%"},
		{id: "grade1", label: "{i18n>LABEL_07307}"/* 업적 */,     plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%"},
		{id: "grade2", label: "{i18n>LABEL_07308}"/* 역량 */,     plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%"},
		{id: "grade3", label: "{i18n>LABEL_07309}"/* 종합 */,     plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%"}
	],

	createContent: function(oController) {

		var EvalProfileHandler = oController.getEvalProfileDialogHandler();
		// Excel download를 위하여 column 정보를 연결해줌
		EvalProfileHandler.setColModel("_colModel1", this._colModel1);
		EvalProfileHandler.setColModel("_colModel2", this._colModel2);

		var oEmpBasicInfoBox = new EmpBasicInfoBox(EvalProfileHandler.getEmployeeModel());

		var oInfoFlexBox1 = new sap.m.FlexBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			fitContainer: true,
			items: [
				new sap.m.Text().addStyleClass("sub-title"),
				new sap.m.FlexBox({
					items: [
						new sap.m.Button({
							press: EvalProfileHandler.onPressExcelDownload1.bind(oController),
							// icon: "sap-icon://search",
							text: "{i18n>LABEL_00129}" // Excel
						})
						.addStyleClass("button-light")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("info-box");

		var oMostRecentEvalResultsTable = new sap.ui.table.Table("MostRecentEvalResultsTable", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			// fixedColumnCount: 6,
			visibleRowCount: 1,
			// visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
			showOverlay: false,
			showNoData: true,
		    width: "100%",
		    rowHeight: 74,
		    columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			busy: true
		})
		.addStyleClass("mt-10px")
		.setModel(EvalProfileHandler.getModel())
		.bindRows("/MostRecentEvalResults");

		oMostRecentEvalResultsTable.addEventDelegate({
			onAfterRendering: function() {
				Common.adjustRowSpan({
					table: oMostRecentEvalResultsTable,
					colIndices: [0]
				});
			}
		}, oMostRecentEvalResultsTable);

		this._colModel1[2].templateGetter = this.getScoreChart;
		this._colModel1[3].templateGetter = this.getGradeText;

		ZHR_TABLES.makeColumn(oController, oMostRecentEvalResultsTable, this._colModel1);

		var oInfoFlexBox2 = new sap.m.FlexBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			fitContainer: true,
			items: [
				new sap.m.Text({text: "{i18n>LABEL_07202}"}).addStyleClass("sub-title"), // 이전 eHR 시스템 평가이력(2019년 이전)
				new sap.m.FlexBox({
					items: [
						new sap.m.Button({
							press: EvalProfileHandler.onPressExcelDownload2.bind(oController),
							// icon: "sap-icon://search",
							text: "{i18n>LABEL_00129}" // Excel
						})
						.addStyleClass("button-light")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("info-box");

		var oBefore2020EvalResultsTable = new sap.ui.table.Table("Before2020EvalResultsTable", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			// fixedColumnCount: 6,
			visibleRowCount: 1,
			// visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
			showOverlay: false,
			showNoData: true,
		    width: "100%",
		    rowHeight: 37,
		    columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			busy: true
		})
		.addStyleClass("mt-10px")
		.setModel(EvalProfileHandler.getModel())
		.bindRows("/Before2020EvalResults");

		ZHR_TABLES.makeColumn(oController, oBefore2020EvalResultsTable, this._colModel2);

		return [
			oEmpBasicInfoBox,
			// oInfoFlexBox1,
			// oMostRecentEvalResultsTable,
			oInfoFlexBox2,
			oBefore2020EvalResultsTable
		];
	},

	getScoreChart: function(columnInfo) {

		return new sap.m.ProgressIndicator({
			height: "24px",
			state: sap.ui.core.ValueState.Information,
			percentValue: "{${columnInfo.id}}".interpolate(columnInfo.id),
			displayValue: {
				path: columnInfo.id,
				formatter: function(pV) {
					return (pV || 0).toFixed(2);
				}
			}
		});
	},

	getGradeText: function(columnInfo) {

		return new sap.ui.commons.TextView({
			textAlign: sap.ui.core.HorizontalAlign.Center,
			text: {
				path: "grade",
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
	}

});

});