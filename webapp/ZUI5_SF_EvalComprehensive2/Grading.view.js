sap.ui.define([
	"./delegate/On",
	"./delegate/ViewTemplates",
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES",
	"sap/ui/core/dnd/DragInfo",
	"sap/f/dnd/GridDropInfo",
	"sap/f/GridContainerSettings"
], function (On, ViewTemplates, Common, Formatter, PageHelper, ZHR_TABLES, DragInfo, GridDropInfo, GridContainerSettings) {
"use strict";

var SUB_APP_ID = [$.app.CONTEXT_PATH, "Grading"].join(".");

sap.ui.jsview(SUB_APP_ID, { // 종합평가 : 수행

	getControllerName: function() {
		return SUB_APP_ID;
	},

	createContent: function(oController) {

		return new PageHelper({
			idPrefix: "grading-",
			contentStyleClass: "sub-app-content",
			contentItems: [
				this.getSearchFlexBox(oController).addStyleClass("mt-8px"),        // Button group 영역
				this.getInfoFlexBox(oController).addStyleClass("mt-8px"),          // Header 영역
				this.getAggregateTablePanel(oController).addStyleClass("mt-11px"), // 부서별 평가등급 현황 영역
				this.getTabContainer(oController).addStyleClass("pt-10px")         // Drag and Drop 및 리스트 영역
			],
			originals: {
				title: "{i18n>LABEL_11001}", // 종합평가
				showNavButton: true,
				navButtonPress: function() {
					sap.ui.getCore().getEventBus().publish("nav", "to", {
						id: [$.app.CONTEXT_PATH, "List"].join(".")
					});
				}
			}
		});
	},

	// Button group 영역
	getSearchFlexBox: function(oController) {

		return new sap.m.FlexBox({
			justifyContent: sap.m.FlexJustifyContent.End,
			fitContainer: true,
			items: [
				new sap.m.FlexBox({
					visible: "{= Number(${Evstaus} || 0) < 20 }",
					items: [
						new sap.m.Button({
							press: oController.onPressSave.bind(oController),
							text: "{i18n>LABEL_00142}" // 임시저장
						})
						.addStyleClass("button-light"),
						new sap.m.Button({
							press: oController.onPressConfirm.bind(oController),
							text: "{i18n>LABEL_11102}" // 평가완료
						})
						.addStyleClass("button-dark"),
						new sap.m.Button({
							press: oController.onPrint.bind(oController),
							text: "프린트" 
						})
						.addStyleClass("button-dark")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("search-box")
		.setModel(oController.HeaderModel)
		.bindElement("/");
	},

	// Header 영역
	getInfoFlexBox: function(oController) {

		return new sap.m.HBox({
			items: [
				new sap.m.VBox({
					width: "10%",
					items: [
						ViewTemplates.getLabel("header", "{i18n>LABEL_11203}"), // 평가위원회
						ViewTemplates.getLabel("header", "{i18n>LABEL_11207}")  // 팀 -> 평가그룹
					]
				}),
				new sap.m.VBox({
					width: "30%",
					items: [
						ViewTemplates.getLabel("cell", "{Evcomtx}").addStyleClass("text-left"), // 평가위원회
						new sap.m.HBox({
							items: [
								ViewTemplates.getLabel("cell", "{Evtgttx}").setLayoutData(new sap.m.FlexItemData({baseSize: "33.3333333%"})), // 팀 -> 평가그룹
								ViewTemplates.getLabel("header", "{i18n>LABEL_11211}").setLayoutData(new sap.m.FlexItemData({baseSize: "33.3333333%"})), // 인원수 -> 팀
								ViewTemplates.getLabel("cell", "{Teamcnt}").setLayoutData(new sap.m.FlexItemData({baseSize: "33.3333333%"})) // 인원수 -> 팀
							]
						})
					]
				}),
				new sap.m.VBox({
					width: "10%",
					items: [
						ViewTemplates.getLabel("header", "{i18n>LABEL_11204}"), // 평가연도 -> 주관부서
						ViewTemplates.getLabel("header", "{i18n>LABEL_11208}")  // 평가그룹 -> 인원수
					]
				}),
				new sap.m.VBox({
					width: "10%",
					items: [
						ViewTemplates.getLabel("cell", "{Orgtx}"), // 평가연도 -> 주관부서
						ViewTemplates.getLabel("cell", "{Empcnt}") // 평가그룹 -> 인원수
					]
				}),
				new sap.m.VBox({
					width: "10%",
					items: [
						ViewTemplates.getLabel("header", "{i18n>LABEL_11205}"), // 주관부서 -> 평가자
						ViewTemplates.getLabel("header", "{i18n>LABEL_11209}")  // Budget점수
					]
				}),
				new sap.m.VBox({
					width: "10%",
					items: [
						ViewTemplates.getLabel("cell", "{Evename}"), // 주관부서 -> 평가자
						new sap.m.Label({
							textAlign: sap.ui.core.TextAlign.Center, 
							text: {
								path: "Bgtpnt",
								formatter: function(v) { return v ? String(parseFloat(v)) : "0"; }
							}
						})
						.addStyleClass("flexbox-table-cell color-signature-blue bold-700")
					]
				}),
				new sap.m.VBox({
					width: "10%",
					items: [
						ViewTemplates.getLabel("header", "{i18n>LABEL_11206}"), // 운영자
						ViewTemplates.getLabel("header", "{i18n>LABEL_11210}")  // 평가점수
					]
				}),
				new sap.m.VBox({
					width: "10%",
					items: [
						ViewTemplates.getLabel("cell", "{Ename}"), // 운영자
						new sap.m.Label("total-evapnt", {
							textAlign: sap.ui.core.TextAlign.Center, 
							text: {
								path: "Evapnt",
								formatter: function(v) { return v ? String(parseFloat(v)) : "0"; }
							}
						})
						.addStyleClass("flexbox-table-cell color-darkgreen bold-700")
					]
				})
			]
		})
		.addStyleClass("flexbox-table")
		.setModel(oController.HeaderModel)
		.bindElement("/");
	},

	// 부서별 평가등급 현황 영역
	getAggregateTablePanel: function(oController) {

		return new sap.m.Panel({
			expanded: true,
			expandable: true,
			headerText: "{i18n>LABEL_11310}", // 부서별 평가등급 현황
			content: this.getAggregateTable(oController)
		})
		.addStyleClass("custom-panel");
	},

	getAggregateTable: function(oController) {

		var oTable = new sap.ui.table.Table("AggregateTable", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			// fixedColumnCount: 6,
			visibleRowCount: 2,
			// visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
			fixedBottomRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 29,
			columnHeaderHeight: 30,
			noData: "{i18n>LABEL_00901}"
		})
		.addStyleClass("multi-header fix-header-height-30px")
		.setModel(oController.AggregateTableModel)
		.bindRows("/Aggregate");

		oTable.addEventDelegate({
			onAfterRendering: function() {
				Common.generateRowspan({selector: this, colIndexes: [0]});
			}
		}, oTable);

		ZHR_TABLES.makeColumn(oController, oTable, [
			{id: "Sumorgtx", label: "{i18n>LABEL_11311}"/* 부서 */, plabel: "{i18n>LABEL_11311}"/* 부서     */, resize: true, span: 0, type: "string",   sort: false, filter: false, width: "16%"},
			{id: "Empcnt1",  label: "{i18n>LABEL_11312}"/* S    */, plabel: "{i18n>LABEL_11318}"/* 인원수   */, resize: true, span: 2, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Evapnt1",  label: "{i18n>LABEL_11312}"/* S    */, plabel: "{i18n>LABEL_11319}"/* 평가점수 */, resize: true, span: 0, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Empcnt2",  label: "{i18n>LABEL_11313}"/* A    */, plabel: "{i18n>LABEL_11318}"/* 인원수   */, resize: true, span: 2, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Evapnt2",  label: "{i18n>LABEL_11313}"/* A    */, plabel: "{i18n>LABEL_11319}"/* 평가점수 */, resize: true, span: 0, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Empcnt3",  label: "{i18n>LABEL_11314}"/* B    */, plabel: "{i18n>LABEL_11318}"/* 인원수   */, resize: true, span: 2, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Evapnt3",  label: "{i18n>LABEL_11314}"/* B    */, plabel: "{i18n>LABEL_11319}"/* 평가점수 */, resize: true, span: 0, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Empcnt4",  label: "{i18n>LABEL_11315}"/* C    */, plabel: "{i18n>LABEL_11318}"/* 인원수   */, resize: true, span: 2, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Evapnt4",  label: "{i18n>LABEL_11315}"/* C    */, plabel: "{i18n>LABEL_11319}"/* 평가점수 */, resize: true, span: 0, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Empcnt5",  label: "{i18n>LABEL_11316}"/* D    */, plabel: "{i18n>LABEL_11318}"/* 인원수   */, resize: true, span: 2, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Evapnt5",  label: "{i18n>LABEL_11316}"/* D    */, plabel: "{i18n>LABEL_11319}"/* 평가점수 */, resize: true, span: 0, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Empcnt6",  label: "{i18n>LABEL_11317}"/* 합계 */, plabel: "{i18n>LABEL_11318}"/* 인원수   */, resize: true, span: 2, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates},
			{id: "Evapnt6",  label: "{i18n>LABEL_11317}"/* 합계 */, plabel: "{i18n>LABEL_11319}"/* 평가점수 */, resize: true, span: 0, type: "template", sort: false, filter: false, width:  "7%", templateGetter: "getCountText", templateGetterOwner: ViewTemplates}
		]);

		return oTable;
	},

	// Drag and Drop 및 리스트 영역
	getTabContainer: function(oController) {

		return new sap.m.TabContainer({
			items: [
				new sap.m.TabContainerItem({
					key: "dnd",
					name: "{i18n>LABEL_11410}", // Card Type
					content: this.getGradingGrid(oController).addStyleClass("pt-10px")
				}),
				new sap.m.TabContainerItem({
					key: "list",
					name: "{i18n>LABEL_11411}", // List Type
					content: this.getGradingTable(oController).addStyleClass("pt-10px")
				})
			]
		})
		.addStyleClass("custom-tab-container");
	},

	getGradingGrid: function(oController) {

		return new sap.m.VBox({
			fitContainer: true,
			items: [
				new sap.m.HBox({
					fitContainer: true,
					items: [
						new sap.m.Label({text: "S", textAlign: sap.ui.core.TextAlign.Center}).addStyleClass("bg-grade-s"),
						new sap.m.Label({text: "A", textAlign: sap.ui.core.TextAlign.Center}).addStyleClass("bg-grade-a"),
						new sap.m.Label({text: "B", textAlign: sap.ui.core.TextAlign.Center}).addStyleClass("bg-grade-b"),
						new sap.m.Label({text: "C", textAlign: sap.ui.core.TextAlign.Center}).addStyleClass("bg-grade-c"),
						new sap.m.Label({text: "D", textAlign: sap.ui.core.TextAlign.Center}).addStyleClass("bg-grade-d")
					]
				})
				.addStyleClass("custom-grading-header"),
				new sap.m.HBox({
					items: [
						this.getDnDVBox("S", oController.GradeSModel),
						this.getDnDVBox("A", oController.GradeAModel),
						this.getDnDVBox("B", oController.GradeBModel),
						this.getDnDVBox("C", oController.GradeCModel),
						this.getDnDVBox("D", oController.GradeDModel)
					]
				})
				.addStyleClass("custom-grading-grid")
			]
		});
	},

	getGradingTable: function(oController) {

		var oTable = new sap.ui.table.Table("GradingTable", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			// fixedColumnCount: 6,
			// visibleRowCount: 1,
			minAutoRowCount: 10,
			visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			rowSettingsTemplate: new sap.ui.table.RowSettings({
				highlight: {
					path: "Cograde",
					formatter: function(pV) {
							 if (pV === "S") { return sap.ui.core.IndicationColor.Indication01; }
						else if (pV === "A") { return sap.ui.core.IndicationColor.Indication02; }
						else if (pV === "B") { return sap.ui.core.IndicationColor.Indication03; }
						else if (pV === "C") { return sap.ui.core.IndicationColor.Indication04; }
						else if (pV === "D") { return sap.ui.core.IndicationColor.Indication05; }
						else                 { return sap.ui.core.IndicationColor.Indication06; }
					}
				}
			})
		})
		.addStyleClass("multi-header fix-header-height-38px")
		.setModel(oController.GradeListModel)
		.bindRows("/Gradings");

		oTable.addEventDelegate({
			onAfterRendering: function() {
				Common.generateRowspan({selector: this, colIndexes: [0, 1, 2, 3, 4, 5, 13, 14]});
			}
		}, oTable);

		var EvalYear = new Date().getFullYear();
		ZHR_TABLES.makeColumn(oController, oTable, [
			{id: "No", 			label: "{i18n>LABEL_11412}"/* No.               */, plabel: "{i18n>LABEL_11412}"/* No.      */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "2%"},
			{id: "Ename",     	label: "{i18n>LABEL_11414}"/* 성명              */, plabel: "{i18n>LABEL_11414}"/* 성명     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width: "11%"},
			{id: "ZpGradetx",   label: "{i18n>LABEL_11416}"/* 직급              */, plabel: "{i18n>LABEL_11416}"/* 직급     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "7%"},
			{id: "Zposttx",    	label: "{i18n>LABEL_11417}"/* 직책              */, plabel: "{i18n>LABEL_11417}"/* 직책     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "7%"},
			{id: "Evorgtx",  	label: "{i18n>LABEL_11418}"/* 부서              */, plabel: "{i18n>LABEL_11418}"/* 부서     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width: "18%", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Cograde",     label: "{i18n>LABEL_11419}"/* 종합등급          */, plabel: "{i18n>LABEL_11419}"/* 종합등급 */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "9%", templateGetter: "getCogradeComboBox", templateGetterOwner: ViewTemplates},
			{id: "Pepnt",    	label: "{i18n>LABEL_11420}"/* 당해연도 평가결과 */, plabel: "{i18n>LABEL_11421}"/* 업적     */, resize: true, span: 4, type: "decimal",  sort: true, filter: true, width:  "5%"},
			{id: "Cepnt",     	label: "{i18n>LABEL_11420}"/* 당해연도 평가결과 */, plabel: "{i18n>LABEL_11422}"/* 역량     */, resize: true, span: 0, type: "decimal",  sort: true, filter: true, width:  "5%"},
			{id: "Mepnt",     	label: "{i18n>LABEL_11420}"/* 당해연도 평가결과 */, plabel: "{i18n>LABEL_11423}"/* 다면     */, resize: true, span: 0, type: "decimal",  sort: true, filter: true, width:  "5%"},
			{id: "Pegrade",     label: "{i18n>LABEL_11420}"/* 당해연도 평가결과 */, plabel: "{i18n>LABEL_11424}"/* 업적등급 */, resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "5%"},
			{id: "Pgrade1",     label: "{i18n>LABEL_11425}"/* 과거이력          */, plabel: String(EvalYear - 1),               resize: true, span: 3, type: "string",   sort: true, filter: true, width:  "7%"},
			{id: "Pgrade2",     label: "{i18n>LABEL_11425}"/* 과거이력          */, plabel: String(EvalYear - 2),               resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "7%"},
			{id: "Pgrade3",     label: "{i18n>LABEL_11425}"/* 과거이력          */, plabel: String(EvalYear - 3),               resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "7%"},
			{id: "Proc",     	label: "{i18n>LABEL_11426}"/* 평가결과          */, plabel: "{i18n>LABEL_11426}"/* 평가결과 */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "2.5%", templateGetter: "getEvalResultDialogIcon", templateGetterOwner: ViewTemplates},
			{id: "Proc1",     	label: "{i18n>LABEL_11427}"/* 사원정보          */, plabel: "{i18n>LABEL_11427}"/* 사원정보 */, resize: true, span: 0, type: "template", sort: true, filter: true, width:  "2.5%", templateGetter: "getEmpProfileDialogIcon", templateGetterOwner: ViewTemplates}
		]);

		return oTable;
	},

	getDnDVBox: function(gradeText, model) {

		return new sap.m.VBox({
			width: "20%",
			items: [
				new sap.m.ScrollContainer({
					layoutData: new sap.m.FlexItemData({growFactor: 1, minHeight: "100%", alignSelf: sap.m.FlexAlignSelf.Stretch}),
					horizontal: false,
					vertical: true,
					height: "100%",
					content: new sap.m.VBox({
						alignItems: sap.m.FlexAlignItems.Center,
						items: [this.getDnDGridContainer(gradeText, model)]
					})
					.addStyleClass("custom-grading-body")
				})
			]
		});
	},

	getDnDGridContainer: function(gradeText, model) {

		return new sap.f.GridContainer("GridContainer" + gradeText, {
			layoutData: new sap.m.FlexItemData({minWidth: "270px"}),
			layout: new GridContainerSettings({
				columnSize: "132px",
				rowSize: "60px",
				// columns: 1,
				gap: "6px"
			}),
			items: {
				path: "/list",
				factory: this.getEmployeeCardFactory.bind(this)
			}
		})
		.setModel(model);
	},

	getDnDConfigs: function(oView) {

		return [
			new DragInfo({
				sourceAggregation: "items"
			}),
			new GridDropInfo({
				targetAggregation: "items",
				dropIndicatorSize: function() {
					return {rows: 2, columns: 2};
				},
				dropPosition: sap.ui.core.dnd.DropPosition.OnOrBetween,
				dropLayout: sap.ui.core.dnd.DropLayout.Vertical,
				drop: On.drop.bind(oView)
			})
		];
	},

	getEmployeeCardFactory: function(sId, oContext) {

		if (oContext.getProperty("Pernr")) {
			var card = ViewTemplates.getEmployeeCard(this.getController());
			if (oContext.getProperty("styleClass")) {
				card.addStyleClass(oContext.getProperty("styleClass"));
			}
			return card;

		} else {
			return new sap.m.HBox({
				layoutData: new sap.f.GridContainerItemLayoutData({
					minRows: 2, columns: 2
				}),
				justifyContent: sap.m.FlexJustifyContent.Center,
				alignItems: sap.m.FlexAlignItems.Center,
				fitContainer: true,
				width: "270px",
				height: "126px",
				items: [
					new sap.m.Label({text: "{i18n>MSG_11001}"}) // 이곳에 카드를 끌어 놓으세요.
				]
			})
			.addStyleClass(oContext.getProperty("styleClass"));

		}
	}

});

});