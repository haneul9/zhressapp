sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		_colModel: [
			{id: "Begda", 		label: "{i18n>LABEL_08005}" /* 신청일 */,	 plabel: "", resize: true, span: 0, type: "date",	 sort: true,  filter: true,  width: "30%"},
			{id: "TypeTxt", 	label: "{i18n>LABEL_08006}" /* 경조유형 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "37%"},
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
							.addStyleClass("sub-title"), // 신청 현황
						]
					}),
					
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
			    width: "auto",
				rowHeight: 45,
				columnHeaderHeight: 46,   
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-8px")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
			
			return new PageHelper({
				contentContainerStyleClass: "app-content-container-mobile",
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
