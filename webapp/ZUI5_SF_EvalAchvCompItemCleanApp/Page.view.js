sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

sap.ui.jsview($.app.APP_ID, { // 평가 항목생성

	_colModel: [
		{id: "currentStep",         label: "{i18n>LABEL_01301}"/* 상태 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "15%", align: sap.ui.core.HorizontalAlign.Left},
		{id: "userId",              label: "{i18n>LABEL_01302}"/* 사번 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%"},
		{id: "nickname",            label: "{i18n>LABEL_01303}"/* 성명 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%"},
		{id: "title",               label: "{i18n>LABEL_01304}"/* 직위 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%"},
		{id: "custom01",            label: "{i18n>LABEL_01305}"/* 직급 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%"},
		{id: "department",          label: "{i18n>LABEL_01306}"/* 부서 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "30%", align: sap.ui.core.HorizontalAlign.Left},
		{id: "allocatingItemCount", label: "{i18n>LABEL_01308}"/* 기준 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "5%", align: sap.ui.core.HorizontalAlign.Right},
		{id: "poolItemCount",       label: "{i18n>LABEL_01309}"/* 현재 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "5%", align: sap.ui.core.HorizontalAlign.Right},
		{id: "diffItemCount",       label: "{i18n>LABEL_01310}"/* 차이 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width:  "5%", align: sap.ui.core.HorizontalAlign.Right, templateGetter: "getDiffItemCountText"}
	],

	getControllerName: function() {
		return $.app.APP_ID;
	},

	createContent: function(oController) {

		$.app.setModel("ZHR_COMMON_SRV");

		var oSearchFlexBox = new sap.m.FlexBox({
			fitContainer: true,
			items: [
				new sap.m.FlexBox({
					items: [
						new sap.m.Label({text: "{i18n>LABEL_01101}"}), // 평가문서
						new sap.m.ComboBox("FormsComboBox", {
							selectionChange: $.proxy(oController.onChangeComboBox, oController),
							change: $.proxy(oController.onChangeComboBox, oController),
							width: "250px",
							items: {
								path: "/FormTemplates",
								template: new sap.ui.core.Item({key: "{formTemplateId}", text: "{formTemplateName}"})
							}
						})
						.setModel(oController.SearchModel),
						new sap.m.Label({text: "{i18n>LABEL_01102}"}), // 부문
						new sap.m.MultiComboBox("DivisionsMultiComboBox", {
							selectionChange: $.proxy(oController.onChangeComboBox, oController),
							selectionFinish: $.proxy(oController.onChangeComboBox, oController),
							enabled: false,
							width: "250px",
							items: {
								path: "/Divisions",
								template: new sap.ui.core.Item({key: "{value}", text: "{text}"})
							}
						})
						.setModel(oController.SearchModel),
						new sap.m.Label({text: "{i18n>LABEL_01103}"}), // 팀
						new sap.m.MultiComboBox("TeamsMultiComboBox", {
							selectionChange: $.proxy(oController.onChangeComboBox, oController),
							selectionFinish: $.proxy(oController.onChangeComboBox, oController),
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
							press: $.proxy(oController.onPressSearch, oController),
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
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			fitContainer: true,
			items: [
				new sap.m.FlexBox({
					items: [
						new sap.m.FlexBox({
							items: [
								new sap.ui.core.Icon({src: "sap-icon://person-placeholder"}).addStyleClass("before-icon"),
								new sap.m.Label({text: "{i18n>LABEL_01201}"}), // 총인원
								new sap.m.Text({text: "{appraiseeTotalCount}"}).setModel(oController.CountModel).bindElement("/Count")
							]
						}),
						new sap.m.FlexBox({
							items: [
								new sap.ui.core.Icon({src: "sap-icon://person-placeholder"}).addStyleClass("before-icon").addStyleClass("color-info-red"),
								new sap.m.Label({text: "{i18n>LABEL_01202}"}).addStyleClass("color-info-red"), // 차이발생 인원
								new sap.m.Text({text: "{appraiseeDiffCount}"}).addStyleClass("color-info-red").setModel(oController.CountModel).bindElement("/Count")
							]
						})
					]
				})
				.addStyleClass("info-field-group"),
				new sap.m.FlexBox({
					items: [
						new sap.m.Button({
							press: $.proxy(oController.onPressExcelDownload, oController),
							// icon: "sap-icon://search",
							text: "{i18n>LABEL_00129}" // Excel
						})
						.addStyleClass("button-light"),
						new sap.m.Button({
							press: $.proxy(oController.onPressRemoval, oController),
							// icon: "sap-icon://initiative", // sap-icon://restart
							text: "{i18n>LABEL_01104}" // 설정 실행
						})
						.addStyleClass("button-dark")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("info-box");

		var oTable = new sap.ui.table.Table("AppraiseesTable", {
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
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
			noData: "{i18n>LABEL_00901}"
		})
		.addStyleClass("mt-10px")
		.setModel(oController.TableModel)
		.bindRows("/Appraisees");

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