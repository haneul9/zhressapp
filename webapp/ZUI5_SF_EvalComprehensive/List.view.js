sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

sap.ui.jsview($.app.APP_ID, { // 종합평가 : 평가연도별 목록

	getControllerName: function () {
		return $.app.APP_ID;
	},

	createContent: function (oController) {

		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_APPRAISAL_SRV");

		var oSearchFlexBox = new sap.m.FlexBox({
			fitContainer: true,
			items: [
				new sap.m.FlexBox({
					items: [
						new sap.m.Label({ width: "60px", text: "{i18n>LABEL_03101}" }), // 평가연도
						new sap.m.ComboBox("YearComboBox", {
							width: "100px",
							selectedKey: "{/IAppye}",
							items: {
								path: "/EvalYears",
								template: new sap.ui.core.ListItem({ key: "{value}", text: "{text}" })
							}
						})
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

		var oTable = new sap.ui.table.Table("ListTable", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			// fixedColumnCount: 6,
			// visibleRowCount: 1,
			minAutoRowCount: 10,
			visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
			// visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Interactive,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			rowActionCount: 1,
			rowActionTemplate: new sap.ui.table.RowAction({
				items: [
					new sap.ui.table.RowActionItem({
						type: "Navigation",
						press: function(oEvent) {
							var vData = oEvent.getSource().getBindingContext().getProperty();
								vData.Empcnt = String(vData.Empcnt);
								vData.Bgtpnt = String(vData.Bgtpnt);
								vData.Evapnt = String(vData.Evapnt);

							sap.ui.getCore().getEventBus().publish("nav", "to", {
								id: [$.app.CONTEXT_PATH, "Grading"].join("."),
								data: vData
							});
						}
					})
				]
			}),
			rowSettingsTemplate: new sap.ui.table.RowSettings({
				highlight: {
					path: "Evstaus",
					formatter: function(EVSTATUS) {
						if (EVSTATUS === "10") {
							return sap.ui.core.MessageType.Success;
						} else if (EVSTATUS === "20") {
							return sap.ui.core.MessageType.Information;
						} else {
							return sap.ui.core.MessageType.Warning;
						}
					}
				}
			}),
			cellClick: function(oEvent) {
				var vData = oEvent.getParameters().rowBindingContext.getProperty();
					vData.Empcnt = String(vData.Empcnt);
					vData.Bgtpnt = String(vData.Bgtpnt);
					vData.Evapnt = String(vData.Evapnt);

				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "Grading"].join("."),
					data: vData
				});
			}
		})
		.addStyleClass("mt-30px row-link")
		.bindRows("/Data");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{id: "No",        label: "{i18n>LABEL_11201}"/* No.        */, plabel: "", resize: true, span: 0, type: "string",  sort: true, filter: true, width:  "3%"},
			{id: "Evstaustx", label: "{i18n>LABEL_11202}"/* 상태       */, plabel: "", resize: true, span: 0, type: "string",  sort: true, filter: true, width:  "7%"},
			{id: "Evcomtx",   label: "{i18n>LABEL_11203}"/* 평가위원회 */, plabel: "", resize: true, span: 0, type: "string",  sort: true, filter: true, width: "31%", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Orgtx",     label: "{i18n>LABEL_11204}"/* 주관부서   */, plabel: "", resize: true, span: 0, type: "string",  sort: true, filter: true, width: "15%"},
			{id: "Evename",   label: "{i18n>LABEL_11205}"/* 평가자     */, plabel: "", resize: true, span: 0, type: "string",  sort: true, filter: true, width: "10%"},
			{id: "Ename",     label: "{i18n>LABEL_11206}"/* 운영자     */, plabel: "", resize: true, span: 0, type: "string",  sort: true, filter: true, width: "10%"},
			{id: "Evtgttx",   label: "{i18n>LABEL_11207}"/* 평가그룹   */, plabel: "", resize: true, span: 0, type: "string",  sort: true, filter: true, width:"6.5%"},
			{id: "Empcnt",    label: "{i18n>LABEL_11208}"/* 인원수     */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "6%"},
			{id: "Bgtpnt",    label: "{i18n>LABEL_11209}"/* Budget점수 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "9%"},
			{id: "Evapnt",    label: "{i18n>LABEL_11210}"/* 평가점수   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:"6.5%"}
		]);

		return new PageHelper({
			contentItems: [
				oSearchFlexBox,
				oTable
			]
		})
		.setModel(oController._ComprehensiveModel);
	}

});

});