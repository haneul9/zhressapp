sap.ui.define([
	"common/PageHelper",
	"common/ZHR_TABLES",
	"./delegate/OutLang"
], function (PageHelper, ZHR_TABLES, OutLang) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			var StatusListHandler = oController.getStatusListHandler.call(oController);

			return new PageHelper({
				contentItems: [
					this.buildInfoBox(StatusListHandler),
					this.buildTable(oController, StatusListHandler)
				]
			}).setModel(StatusListHandler.Model());
		},

		buildInfoBox: function(StatusListHandler) {
			return new sap.m.HBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				items: [	
					new sap.m.HBox({
						items: [		
							new sap.m.Label({
								text: "{i18n>LABEL_51005}" // 현황
							}).addStyleClass("sub-title") 
						]
					})
					.addStyleClass("info-field-group"),
					new sap.m.HBox({
						justifyContent: sap.m.FlexJustifyContent.End,
						alignItems: sap.m.FlexAlignItems.End,
						items: [
							new sap.m.HBox({
								items: [
									new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
									new sap.m.Label({ text: "{i18n>LABEL_00196}" }).addStyleClass("custom-legend-item"), // 미결재
									new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
									new sap.m.Label({ text: "{i18n>LABEL_00197}" }).addStyleClass("custom-legend-item"), // 결재중
									new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
									new sap.m.Label({ text: "{i18n>LABEL_00198}" }).addStyleClass("custom-legend-item"), // 반려
									new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
									new sap.m.Label({ text: "{i18n>LABEL_00199}" }).addStyleClass("custom-legend-item") // 결재완료
								]
							}).addStyleClass("custom-legend-group"),
							new sap.m.HBox({
								items: [
									new sap.m.Button({
										press: StatusListHandler.pressChart.bind(StatusListHandler),
										text: "{i18n>LABEL_51017}" // 어학성적 조건표
									})
									.addStyleClass("button-light"),
									new sap.m.Button({
										press: StatusListHandler.pressNew.bind(StatusListHandler),
										text: "{i18n>LABEL_00183}" // 등록
									})
									.addStyleClass("button-light")
								]
							})
							.addStyleClass("button-group") 
						]
					})
				]
			})
			.addStyleClass("info-box");
		},

		buildTable: function(oController, StatusListHandler) {
			var oTable = new sap.ui.table.Table("StatusListTable", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}",
				rowSettingsTemplate: new sap.ui.table.RowSettings({
					highlight: {
						path: "Status",
						formatter: function (v) {
							switch(v) {
								case OutLang.Approval.NONE:
									return sap.ui.core.IndicationColor.Indication01;
								case OutLang.Approval.IN_PROCESS:
									return sap.ui.core.IndicationColor.Indication02;
								case OutLang.Approval.REJECT:
									return sap.ui.core.IndicationColor.Indication03;
								case OutLang.Approval.DONE:
									return sap.ui.core.IndicationColor.Indication04;
								default:
									return null;
							}
						}
					}
				}),
				rowActionCount: 1,
				rowActionTemplate: new sap.ui.table.RowAction({
					items: [
						new sap.ui.table.RowActionItem({
							type: "Navigation",
							press: function (oEvent) {
								StatusListHandler.pressSelectRowDetail.call(StatusListHandler, oEvent.getSource().getBindingContext().getProperty());
							}
						})
					]
				}),
				cellClick: function (oEvent) {
					StatusListHandler.pressSelectRowDetail.call(StatusListHandler, oEvent.getParameters().rowBindingContext.getProperty());
				}
			})
			.addStyleClass("mt-10px row-link")
			.bindRows("/List");
			
			ZHR_TABLES.makeColumn(oController, oTable, [
				{id: "Stext",     label: "{i18n>LABEL_51019}" /* 어학구분 */,  plabel: "", resize: true, span: 0, type: "string",	 sort: true,  filter: true,  width: "8%"},
				{id: "TescdT",    label: "{i18n>LABEL_51020}" /* 시험종류 */,  plabel: "", resize: true, span: 0, type: "string",	 sort: true,  filter: true,  width: "8%"},
				{id: "Certn", 	  label: "{i18n>LABEL_51007}" /* 수험번호 */, plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "10%"},
				{id: "Evldd", 	  label: "{i18n>LABEL_51008}" /* 평가일 */,  plabel: "", resize: true, span: 0, type: "date",	 sort: true,  filter: true,  width: "8%"},
				{id: "Findd", 	  label: "{i18n>LABEL_51021}" /* 유효일자 */, plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "8%"},
				{id: "Lcsco", 	  label: "L/C",  plabel: "", resize: true, span: 0, type: "string",	 sort: true,  filter: true,  width: "6%"},
				{id: "Rcsco", 	  label: "R/C",  plabel: "", resize: true, span: 0, type: "string",	 sort: true,  filter: true,  width: "6%"},
				{id: "Wcsco", 	  label: "W/C",  plabel: "", resize: true, span: 0, type: "string",	 sort: true,  filter: true,  width: "6%"},
				{id: "Ttsco", 	  label: "{i18n>LABEL_51009}" /* 총점 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "6%"},
				{id: "Tcsco", 	  label: "{i18n>LABEL_51018}" /* 점수 */,  plabel: "", resize: true, span: 0, type: "string",	 sort: true,  filter: true,  width: "6%"},
				{id: "TesgrT",    label: "{i18n>LABEL_51010}" /* 등급 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "8%"},
				{id: "TesarT",    label: "{i18n>LABEL_51011}" /* 응시지역 */,  plabel: "", resize: true, span: 0, type: "string",  sort: false, filter: false, width: "6%"},
				{id: "StatusT",   label: "{i18n>LABEL_51012}" /* 반영상태 */, plabel: "", resize: true, span: 0, type: "string",  sort: false, filter: false, width: "8%"},
				{id: "ApplyDt",   label: "{i18n>LABEL_51013}" /* 신청일 */, plabel: "", resize: true, span: 0, type: "date", sort: false, filter: false, width: "auto"}
			]);

			return oTable;
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_BENEFIT_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
