sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		_colModel: [
			{id: "Begda",	 	label: "{i18n>LABEL_08005}" /* 신청일 */,	 plabel: "", resize: true, span: 0, type: "date",	 sort: true,  filter: true,  width: "auto"},
			{id: "TypeTxt", 	label: "{i18n>LABEL_08006}" /* 경조유형 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "170px"},
			{id: "Zname", 		label: "{i18n>LABEL_08007}" /* 대상자 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
			{id: "StartDate", 	label: "{i18n>LABEL_08008}" /* 경조일 */,	 plabel: "", resize: true, span: 0, type: "date",	 sort: true,  filter: true,  width: "auto"},
			{id: "Zarea", 		label: "{i18n>LABEL_08009}" /* 경조지역 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
			{id: "BasicT",		label: "{i18n>LABEL_08010}" /* 기본급 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Rate",		label: "{i18n>LABEL_08011}" /* 경조율 */,	 plabel: "", resize: true, span: 0, type: "template",  sort: false, filter: false, width: "auto", templateGetter: "getStatusTxt"},
			{id: "AmountT", 	label: "{i18n>LABEL_08012}" /* 경조금액 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: false, filter: false, width: "auto", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Zbigo",		label: "{i18n>LABEL_08015}" /* 비고 */,		 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
			{id: "StatusText", 	label: "{i18n>LABEL_08016}" /* 처리결과 */,	 plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "auto", templateGetter: "getVisibleBotton"}
		],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_08020}" 							
							})
							.addStyleClass("sub-title") // 신청 현황
						]
					}).addStyleClass("info-field-group"),
					
					new sap.m.FlexBox({
						items: [
							new sap.m.Button({
								press: oController.onPressNew,
								text: "{i18n>LABEL_08001}", // 신청
							}).addStyleClass("button-light")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("info-box"); 
			
			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				width: "100%", 
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-10px")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
			
			return new PageHelper({
				contentItems: [				
					infoBox,
					oTable
				]
			});
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_BENEFIT_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
