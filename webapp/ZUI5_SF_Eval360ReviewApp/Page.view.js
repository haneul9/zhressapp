sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

sap.ui.jsview($.app.APP_ID, { // 평가현황

	_colModel: [
		{id: "currentStep",      label: "{i18n>LABEL_04301}"/* 진행상태  */, plabel: "{i18n>LABEL_04302}"/* 업적/역량 */, resize: true, span: 2, type: "string",   sort: true, filter: true, width:  "8%", align: sap.ui.core.HorizontalAlign.Left},
		{id: "currentStep360",   label: "{i18n>LABEL_04301}"/* 진행상태  */, plabel: "{i18n>LABEL_04303}"/* 다면      */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "6%", align: sap.ui.core.HorizontalAlign.Left},
		{id: "userId",           label: "{i18n>LABEL_04304}"/* 사번      */, plabel: "{i18n>LABEL_04304}"/* 사번      */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "6%"},
		{id: "nickname",         label: "{i18n>LABEL_04305}"/* 성명      */, plabel: "{i18n>LABEL_04305}"/* 성명      */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "6%"},
		{id: "title",            label: "{i18n>LABEL_04306}"/* 직위      */, plabel: "{i18n>LABEL_04306}"/* 직위      */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "3%"},
		{id: "custom01",         label: "{i18n>LABEL_04307}"/* 직급      */, plabel: "{i18n>LABEL_04307}"/* 직급      */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "5%"},
		{id: "department",       label: "{i18n>LABEL_04308}"/* 부서      */, plabel: "{i18n>LABEL_04308}"/* 부서      */, resize: true, span: 0, type: "string",   sort: true, filter: true, width: "13%", align: sap.ui.core.HorizontalAlign.Left},
		// {id: "goal",             label: "{i18n>LABEL_04309}"/* 목표      */, plabel: "{i18n>LABEL_04310}"/* 수립      */, resize: true, span: 3, type: "string",   sort: true, filter: true, width:  "3%"},
		// {id: "activity",         label: "{i18n>LABEL_04309}"/* 목표      */, plabel: "{i18n>LABEL_04311}"/* 활동      */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "3%"},
		// {id: "result",           label: "{i18n>LABEL_04309}"/* 목표      */, plabel: "{i18n>LABEL_04312}"/* 실적      */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "3%"},
		{id: "selfAchievement",  label: "{i18n>LABEL_04313}"/* 본인      */, plabel: "{i18n>LABEL_04314}"/* 업적      */, resize: true, span: 2, type: "template", sort: true, filter: true, width:  "7%", templateGetter: "getScoreChart"},
		{id: "selfCompetency",   label: "{i18n>LABEL_04313}"/* 본인      */, plabel: "{i18n>LABEL_04315}"/* 역량      */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "7%", templateGetter: "getScoreChart"},
		{id: "firstAchievement", label: "{i18n>LABEL_04316}"/* 1차       */, plabel: "{i18n>LABEL_04314}"/* 업적      */, resize: true, span: 3, type: "template", sort: true, filter: true, width:  "7%", templateGetter: "getScoreChart"},
		{id: "firstCompetency",  label: "{i18n>LABEL_04316}"/* 1차       */, plabel: "{i18n>LABEL_04315}"/* 역량      */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "7%", templateGetter: "getScoreChart"},
		{id: "evaluationGrade",  label: "{i18n>LABEL_04316}"/* 1차       */, plabel: "{i18n>LABEL_04317}"/* 등급      */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "3%", templateGetter: "getGradeText"},
		{id: "result360",        label: "{i18n>LABEL_04318}"/* 다면평가  */, plabel: "{i18n>LABEL_04318}"/* 다면평가  */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "7%", templateGetter: "getScoreChart"},
		{id: "evalDocDeepLink",  label: "{i18n>LABEL_04319}"/* 문서      */, plabel: "{i18n>LABEL_04320}"/* 업적      */, resize: true, span: 2, type: "template", sort: true, filter: true, width:"3.1%", templateGetter: "getDeepLinkIcon"},
		{id: "review360",        label: "{i18n>LABEL_04319}"/* 문서      */, plabel: "{i18n>LABEL_04303}"/* 다면      */, resize: true, span: 0, type: "template", sort: true, filter: true, width:"2.9%", templateGetter: "getReview360Icon"}
	],

	getControllerName: function() {
		return $.app.APP_ID;
	},

	createContent: function(oController) {

		$.app.setModel("ZHR_COMMON_SRV");

		var oSearchFlexBox = new sap.m.FlexBox({
			items: [
				new sap.m.FlexBox({
					items: [
						new sap.m.Label({text: "{i18n>LABEL_04101}"}), // 평가연도
						new sap.m.ComboBox("YearsCombo", {
							width: "250px",
							items: {
								path: "/EvalYears",
								template: new sap.ui.core.ListItem({key: "{value}", text: "{text}"})
							},
							selectedKey: {
								path: "/EvalYears/0/value"
							}
						})
						.setModel(oController.SearchModel),
						new sap.m.Label({text: "{i18n>LABEL_04102}"}), // 팀
						new sap.m.MultiComboBox("TeamsMultiCombo", {
							selectionChange: oController.onChangeComboBox.bind(oController),
							selectionFinish: oController.onChangeComboBox.bind(oController),
							enabled: false,
							width: "250px",
							items: {
								path: "/Teams",
								template: new sap.ui.core.Item({key: "{value}", text: "{text}"})
							}
						})
						.setModel(oController.SearchModel)
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.FlexBox({
					items: [
						new sap.m.Button({
							press: oController.onPressSearch.bind(oController),
							// icon: "sap-icon://search",
							text: "{i18n>LABEL_00100}" // 조회
						})
						.addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("search-box search-bg pb-7px mt-26px");

		var oInfoFlexBox = new sap.m.FlexBox({
			justifyContent: sap.m.FlexJustifyContent.End,
			fitContainer: true,
			items: [
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
							press: oController.onPressExcelDownload.bind(oController),
							// icon: "sap-icon://search",
							text: "{i18n>LABEL_00129}" // Excel
						})
						.addStyleClass("button-light ml-40px")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("mt-20px");

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
		.bindRows("/Appraisees")
		.setRowSettingsTemplate(new sap.ui.table.RowSettings({
			highlight: {
				path: "currentStep",
				formatter: function(pV) {
					if (pV === "본인 평가") {
						return sap.ui.core.MessageType.None;
					} else if (pV === "부서장 평가" || pV === "업적평가 등급결정") {
						return sap.ui.core.MessageType.Information;
					} else if (pV === "종합평가 준비" || pV === "종합평가" || pV === "HR확인") {
						return sap.ui.core.MessageType.Warning;
					} else if (pV === "결과확인" || pV === "평가완료") {
						return sap.ui.core.MessageType.Error;
					} else {
						return sap.ui.core.MessageType.Success;
					}
				}
			}
		}));

		oTable.addEventDelegate({
			onAfterRendering: function() {
				Common.generateRowspan({
					selector: this,
					colIndexes: [2, 3, 4, 5, 6, 12]
				});
			}
		}, oTable);

		ZHR_TABLES.makeColumn(oController, oTable, this._colModel);

		var oIconTabBar = new sap.m.IconTabBar({
			select: oController.onFilterSelect.bind(oController),
			selectedKey: "All",
			backgroundDesign: sap.m.BackgroundDesign.Transparent,
			applyContentPadding: false,
			// showAll: true,
			content: [
				oInfoFlexBox,
				oTable
			],
			items: [
				new sap.m.IconTabFilter({
					icon: "sap-icon://documents",
					count: "{/IconTabFilterCountMap/step0}",
					text: "{i18n>LABEL_04201}", // 전체
					key: "All"
				}),
				new sap.m.IconTabSeparator(),
				new sap.m.IconTabFilter({
					icon: "sap-icon://user-edit",
					iconColor: sap.ui.core.IconColor.Neutral,
					count: "{/IconTabFilterCountMap/step1}",
					text: "{i18n>LABEL_04202}", // 본인 평가 1
					key: "{i18n>LABEL_04202}"
				}), 
				new sap.m.IconTabSeparator({icon: "sap-icon://navigation-right-arrow"}),
				new sap.m.IconTabFilter({
					icon: "sap-icon://write-new-document",
					iconColor: sap.ui.core.IconColor.Default,
					count: "{/IconTabFilterCountMap/step2}",
					text: "{i18n>LABEL_04203}", // 부서장 평가 2
					key: "{i18n>LABEL_04203}"
				}),
				new sap.m.IconTabSeparator({icon: "sap-icon://navigation-right-arrow"}),
				new sap.m.IconTabFilter({
					icon: "sap-icon://filter-analytics",
					iconColor: sap.ui.core.IconColor.Default,
					count: "{/IconTabFilterCountMap/step3}",
					text: "{i18n>LABEL_04204}", // 업적평가 등급결정 2
					key: "{i18n>LABEL_04204}"
				}),
				new sap.m.IconTabSeparator({icon: "sap-icon://navigation-right-arrow"}),
				new sap.m.IconTabFilter({
					icon: "sap-icon://inspection",
					iconColor: sap.ui.core.IconColor.Critical,
					count: "{/IconTabFilterCountMap/step4}",
					text: "{i18n>LABEL_04205}", // 종합평가 준비 3
					key: "{i18n>LABEL_04205}"
				}),
				new sap.m.IconTabSeparator({icon: "sap-icon://navigation-right-arrow"}),
				new sap.m.IconTabFilter({
					icon: "sap-icon://request",
					iconColor: sap.ui.core.IconColor.Critical,
					count: "{/IconTabFilterCountMap/step5}",
					text: "{i18n>LABEL_04206}", // 종합평가 3
					key: "{i18n>LABEL_04206}"
				}),
				new sap.m.IconTabSeparator({icon: "sap-icon://navigation-right-arrow"}),
				new sap.m.IconTabFilter({
					icon: "sap-icon://detail-view",
					iconColor: sap.ui.core.IconColor.Critical,
					count: "{/IconTabFilterCountMap/step6}",
					text: "{i18n>LABEL_04207}", // HR확인 3
					key: "{i18n>LABEL_04207}"
				}),
				new sap.m.IconTabSeparator({icon: "sap-icon://navigation-right-arrow"}),
				new sap.m.IconTabFilter({
					icon: "sap-icon://form",
					iconColor: sap.ui.core.IconColor.Negative,
					count: "{/IconTabFilterCountMap/step7}",
					text: "{i18n>LABEL_04208}", // 결과확인 4
					key: "{i18n>LABEL_04208}"
				}),
				new sap.m.IconTabSeparator({icon: "sap-icon://navigation-right-arrow"}),
				new sap.m.IconTabFilter({
					icon: "sap-icon://complete",
					iconColor: sap.ui.core.IconColor.Positive,
					count: "{/IconTabFilterCountMap/step8}",
					text: "{i18n>LABEL_04209}", // 평가완료 5
					key: "{i18n>LABEL_04209}"
				})
			]
		})
		.setModel(oController.TableModel)
		.addStyleClass("custom-icon-tab-bar mt-30px");

		return new PageHelper({
			contentItems: [
				oSearchFlexBox,
				oIconTabBar,
				oInfoFlexBox,
				oTable
			]
		});
	}

});

});