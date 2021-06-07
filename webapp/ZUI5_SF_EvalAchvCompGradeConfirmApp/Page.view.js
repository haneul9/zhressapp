sap.ui.define([
	"./delegate/On",
	"./delegate/ViewTemplates",
	"common/Common",
	"common/CustomProgressIndicator",
	"common/Formatter",
	"common/PageHelper",
	"common/ZHR_TABLES"
], function (
	On,
	ViewTemplates,
	Common,
	CustomProgressIndicator,
	Formatter,
	PageHelper,
	ZHR_TABLES
) {
"use strict";

sap.ui.jsview($.app.APP_ID, { // 업적&역량 평가

	_colModel: [
		{id: "currentStep",      label: "{i18n>LABEL_03301}"/* 진행상태 */, plabel: "{i18n>LABEL_03301}"/* 진행상태 */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "8%", align: sap.ui.core.HorizontalAlign.Left},
		{id: "group",            label: "{i18n>LABEL_03302}"/* 그룹     */, plabel: "{i18n>LABEL_03302}"/* 그룹     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "4%"},
		{id: "userId",           label: "{i18n>LABEL_03303}"/* 사번     */, plabel: "{i18n>LABEL_03303}"/* 사번     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "5%"},
		{id: "nickname",         label: "{i18n>LABEL_03304}"/* 성명     */, plabel: "{i18n>LABEL_03304}"/* 성명     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "8%"},
		{id: "title",            label: "{i18n>LABEL_03305}"/* 직위     */, plabel: "{i18n>LABEL_03305}"/* 직위     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "3%"},
		{id: "custom01",         label: "{i18n>LABEL_03306}"/* 직급     */, plabel: "{i18n>LABEL_03306}"/* 직급     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "5%"},
		{id: "department",       label: "{i18n>LABEL_03307}"/* 부서     */, plabel: "{i18n>LABEL_03307}"/* 부서     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width: "11%", align: sap.ui.core.HorizontalAlign.Left},
		{id: "goal",             label: "{i18n>LABEL_03308}"/* 목표     */, plabel: "{i18n>LABEL_03309}"/* 수립     */, resize: true, span: 3, type: "string",   sort: true, filter: true, width:  "3%"},
		{id: "activity",         label: "{i18n>LABEL_03308}"/* 목표     */, plabel: "{i18n>LABEL_03310}"/* 활동     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "3%"},
		{id: "result",           label: "{i18n>LABEL_03308}"/* 목표     */, plabel: "{i18n>LABEL_03311}"/* 실적     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "3%"},
		{id: "selfAchievement",  label: "{i18n>LABEL_03312}"/* 본인     */, plabel: "{i18n>LABEL_03313}"/* 업적     */, resize: true, span: 2, type: "template", sort: true, filter: true, width:  "9%", templateGetter: "getScoreChart", templateGetterOwner: ViewTemplates},
		{id: "selfCompetency",   label: "{i18n>LABEL_03312}"/* 본인     */, plabel: "{i18n>LABEL_03314}"/* 역량     */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "9%", templateGetter: "getScoreChart", templateGetterOwner: ViewTemplates},
		{id: "firstAchievement", label: "{i18n>LABEL_03315}"/* 1차      */, plabel: "{i18n>LABEL_03313}"/* 업적     */, resize: true, span: 3, type: "template", sort: true, filter: true, width:  "9%", templateGetter: "getScoreChart", templateGetterOwner: ViewTemplates},
		{id: "firstCompetency",  label: "{i18n>LABEL_03315}"/* 1차      */, plabel: "{i18n>LABEL_03314}"/* 역량     */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "9%", templateGetter: "getScoreChart", templateGetterOwner: ViewTemplates},
		{id: "evaluationGrade",  label: "{i18n>LABEL_03315}"/* 1차      */, plabel: "{i18n>LABEL_03316}"/* 등급     */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "5%", templateGetter: "getEvalGradeComboBox", templateGetterOwner: ViewTemplates},
		{id: "evalDocDeepLink",  label: "{i18n>LABEL_03317}"/* 문서     */, plabel: "{i18n>LABEL_03317}"/* 문서     */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "3%", templateGetter: "getDeepLinkIcon", templateGetterOwner: ViewTemplates},
		{id: "evalProfilePopup", label: "{i18n>LABEL_03318}"/* 평가이력 */, plabel: "{i18n>LABEL_03318}"/* 평가이력 */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "3%", templateGetter: "getPopupIcon", templateGetterOwner: ViewTemplates}
	],

	getControllerName: function() {
		return $.app.APP_ID;
	},

	createContent: function(oController) {

		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_APPRAISAL_SRV");

		var oSearchFlexBox = new sap.m.FlexBox({
			fitContainer: true,
			items: [
				new sap.m.FlexBox({ // 검색
					direction: sap.m.FlexDirection.Column,
					items: [
						new sap.m.FlexBox({
							items: [
								new sap.m.Label({width: "60px", text: "{i18n>LABEL_03101}"}), // 평가연도
								new sap.m.ComboBox("YearComboBox", {
									change: oController.onAfterShow.bind(oController),
									width: "250px",
									items: {
										path: "/EvalYears",
										template: new sap.ui.core.ListItem({key: "{value}", text: "{text}"})
									},
									selectedKey: "{/EvalYear}"
								})
								.setModel(oController.SearchModel)
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.FlexBox("FilterComboBox", {
							visible: false,
							items: [
								new sap.m.Label({width: "60px", text: "{i18n>LABEL_03102}"}), // 조직
								new sap.m.ComboBox("OrgComboBox", {
									selectionChange: On.changeOrg.bind(oController),
									change: On.changeOrg.bind(oController),
									enabled: false,
									width: "250px",
									items: {
										path: "/Orgs",
										template: new sap.ui.core.ListItem({key: "{value}", text: "{text}"})
									}
								})
								.setModel(oController.SearchModel)
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.FlexBox({
							items: [
								new sap.m.FlexBox({
									items: [
										new sap.m.Label({width: "60px", text: "{i18n>LABEL_03103}"}), // 그룹
										new sap.m.ComboBox("GroupComboBox", {
											selectionChange: On.changeGroup.bind(oController),
											change: On.changeGroup.bind(oController),
											enabled: false,
											width: "250px",
											items: {
												path: "/Groups",
												template: new sap.ui.core.ListItem({key: "{value}", text: "{text}"})
											}
										})
										.setModel(oController.SearchModel)
									]
								})
								.addStyleClass("search-field-group"),
								new sap.m.FlexBox({
									items: [
										new sap.m.Button({
											press: On.pressSearch.bind(oController),
											// icon: "sap-icon://search",
											text: "{i18n>LABEL_00100}" // 조회
										})
										.addStyleClass("button-search")
									]
								})
								.addStyleClass("button-group")
							]
						})
					//	.addStyleClass("mt-8px")
					]
				}), // 검색
				new sap.m.FlexBox({
					items: [
						new CustomProgressIndicator({
							id: "PI-A",
							width: "220px",
							height: "24px",
							title: "{i18n>LABEL_03201}", // A 등급
							percentValue: "{/Ratio/A}",
							displayValue: "{/Ratio/A}%",
							percentStyleClass: "cpi-bg-signature-orange",
							infoValue: {
								parts: [{value: "LABEL_03204"}, {path:"/Selected/A"}], // {0}명
								formatter: ViewTemplates.formatInfoText.bind(oController)
							},
							infoValueStyleClass: "color-signature-orange",
							infoText: {
								parts: [{value: "LABEL_03205"}, {path:"/Criterion/A"}], // 기준 {0}명 기준율 20%
								formatter: ViewTemplates.formatInfoText.bind(oController)
							}
						}),
						new CustomProgressIndicator({
							id: "PI-B",
							width: "220px",
							height: "24px",
							title: "{i18n>LABEL_03202}", // B 등급
							percentValue: "{/Ratio/B}",
							displayValue: "{/Ratio/B}%",
							percentStyleClass: "cpi-bg-signature-darkgreen",
							infoValue: {
								parts: [{value: "LABEL_03204"}, {path:"/Selected/B"}], // {0}명
								formatter: ViewTemplates.formatInfoText.bind(oController)
							},
							infoValueStyleClass: "color-signature-darkgreen",
							infoText: {
								parts: [{value: "LABEL_03206"}, {path:"/Criterion/BC"}], // 기준 {0}명 &nbsp; (B, C 합계)
								formatter: ViewTemplates.formatInfoText.bind(oController)
							}
						}),
						new CustomProgressIndicator({
							id: "PI-C",
							width: "220px",
							height: "24px",
							title: "{i18n>LABEL_03203}", // C 등급
							percentValue: "{/Ratio/C}",
							displayValue: "{/Ratio/C}%",
							percentStyleClass: "cpi-bg-signature-cyanblue",
							infoValue: {
								parts: [{value: "LABEL_03204"}, {path:"/Selected/C"}], // {0}명
								formatter: ViewTemplates.formatInfoText.bind(oController)
							},
							infoValueStyleClass: "color-signature-cyanblue"
						})
					]
				})
				.addStyleClass("ml-100px flex-items-between-30px")
				.setModel(oController.CountModel)
			]
		})
		.addStyleClass("search-box search-bg pb-7px mt-26px h-auto");

		var oInfoFlexBox = new sap.m.FlexBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			fitContainer: true,
			items: [
				new sap.m.FlexBox({
					items: [
						new sap.m.MessageStrip({
							text: "{i18n>MSG_03001}", // 각 그룹의 인원이 3명 미만일 경우, 통합하여 평가 진행
							customIcon: "sap-icon://information",
							showIcon: true,
							type: sap.ui.core.MessageType.Information
						})
					]
				})
				.addStyleClass("info-field-group message-strip"),
				new sap.m.FlexBox({
					items: [
						new sap.m.FlexBox({
							items: [
								new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
								new sap.m.Label({text: "90이상"}).addStyleClass("custom-legend-item"),
								new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
								new sap.m.Label({text: "80이상"}).addStyleClass("custom-legend-item"),
								new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
								new sap.m.Label({text: "80미만"}).addStyleClass("custom-legend-item")
							]
						})
						.addStyleClass("custom-legend-group pt-15px"),
						new sap.m.Button({
							press: On.pressExcelDownload.bind(oController),
							// icon: "sap-icon://search",
							text: "{i18n>LABEL_00129}" // Excel
						})
						.addStyleClass("button-light ml-40px"),
						new sap.m.Button({
							press: On.pressSave.bind(oController),
							// icon: "sap-icon://search",
							text: "{i18n>LABEL_00101}" // 저장
						})
						.addStyleClass("button-light"),
						new sap.m.Button({
							press: On.pressConfirm.bind(oController),
							// icon: "sap-icon://search",
							text: "{i18n>LABEL_00105}" // 확정
						})
						.addStyleClass("button-dark")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("info-box");

		var oTable = new sap.ui.table.Table("AppraiseesTable", {
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
			noData: "{i18n>LABEL_00901}"
		})
		.addStyleClass("multi-header custom-progress-indicator mt-10px")
		.setModel(oController.TableModel)
		.bindRows("/Appraisees");

		oTable.addEventDelegate({
			onAfterRendering: function() {
				Common.generateRowspan({
					selector: this,
					colIndexes: [0, 1, 2, 3, 4, 5, 6, 15, 16]
				});
			}
		}, oTable);

		ZHR_TABLES.makeColumn(oController, oTable, this._colModel);

		return new PageHelper({
			contentItems: [
				oSearchFlexBox,
				oInfoFlexBox,
				oTable
			]
		});
	}

});

});