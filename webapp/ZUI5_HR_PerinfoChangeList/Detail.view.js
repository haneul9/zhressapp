sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/PickOnlyDatePicker",
    "../delegate/ViewTemplates"
], function (Common, PageHelper, PickOnlyDatePicker, ViewTemplates) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "Apply-",
                title: "{i18n>LABEL_66001}", // 개인정보 변경 신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
                            press: oController.navBack.bind(oController),
                            text: "{i18n>LABEL_660015}", // 목록,
                        }).addStyleClass("button-light"),
					]
				}).addStyleClass("app-nav-button-right"),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.ApplyingBox(oController),
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/Data")
		},
		
		getTable: function(oController) {

			var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				busyIndicatorDelay: 0,
				visibleRowCount: 1,
				showOverlay: false,
				showNoData: true,
				width: "100%",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}",
			})
			.addStyleClass("mt-10px")
			.setModel(oController._ApplyJSonModel)
			.bindRows("/Data");
	
			ZHR_TABLES.makeColumn(oController, oTable, [
				{ id: "Idx",      label: "{i18n>LABEL_66008}"/* 번호     */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "8%" },
				{ id: "ColName",  label: "{i18n>LABEL_66009}"/* 컬럼명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "33%" },
				{ id: "AppBefore",  label: "{i18n>LABEL_66016}"/* 신청전 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "33%" },
				{ id: "AppAfter",  label: "{i18n>LABEL_66017}"/* 신청후     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "33%" }
			]);
	
			return oTable;
		}
	});
});