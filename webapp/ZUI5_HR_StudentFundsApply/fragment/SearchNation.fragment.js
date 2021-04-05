sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES",
    "../delegate/ViewTemplates"
], function (Common, Formatter, PageHelper, ZHR_TABLES, ViewTemplates) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_StudentFundsApply.fragment.SearchNation", {

		createContent: function (oController) {
			
            return  new sap.m.SelectDialog({
                contentHeight: "50%",
                title: oController.getBundleText("{i18n>LABEL_38050}"), // 국가 검색
                search: oController.onSearchNationBtn.bind(oController),
                confirm: oController.onConfirmNationBtn.bind(oController),
                draggable: true,
                resizable: true,
                growing: false,
                items: {
                    path: "/Data",
                    template: new sap.m.StandardListItem({
                        title: "({Code})",
                        description: "{Text}",
                        type: sap.m.ListType.Active
                    })
                }
            })
            .setModel(oController.NationModel);

            // var oSearchField = new sap.m.HBox({
            //     width: "100%",
            //     fitContainer: true,
            //     items: [
            //         new sap.m.HBox({
            //             items: [
            //                 ViewTemplates.getLabel("header", "{i18n>LABEL_38032}", "150px", "Right"), // 국가
            //                 new sap.m.Input(oController.PAGEID + "_NationInput", {
            //                     textAlign: "Begin",
            //                     width: "150px",
            //                 })
            //             ]
            //         })
            //         .addStyleClass("search-field-group"),
            //         new sap.m.HBox({
            //             items: [
            //                 new sap.m.Button({
            //                     press: oController.onSearchNationBtn.bind(oController),
            //                     text: "{i18n>LABEL_00100}" // 조회
            //                 })
            //                 .addStyleClass("button-search")
            //             ]
            //         })
            //         .addStyleClass("button-group")
            //     ]
            // })
            // .addStyleClass("search-box search-bg pb-7px");

			// var oNationTable = new sap.ui.table.Table(oController.PAGEID + "_NationTable", {
			// 	selectionMode: sap.ui.table.SelectionMode.None,
			// 	enableColumnReordering: false,
			// 	enableColumnFreeze: false,
			// 	enableBusyIndicator: true,
			// 	visibleRowCount: 5,
			// 	showOverlay: false,
			// 	showNoData: true,
			//     width: "auto",
			// 	noData: "{i18n>LABEL_00901}"
			// })
			// .setModel(oController.NationModel)
			// .bindRows("/Data")
			
			// ZHR_TABLES.makeColumn(oController, oNationTable, this._colModel);
			
			// var oDialog = new sap.m.Dialog({
			// 	title: "{i18n>LABEL_38050}",
			// 	contentWidth: "600px",
			// 	contentHeight: "400px",
			// 	buttons: [
			// 		new sap.m.Button({
			// 			press: function () {
			// 				oDialog.close();
			// 			},
			// 			text: "{i18n>LABEL_25018}", // 닫기
			// 		})
            //         .addStyleClass("button-default"),
			// 	],
			// 	content: [
            //         oSearchField,
			// 		oNationTable
			// 	]
			// })
            // .addStyleClass("custom-dialog-popup");
			
			// return oDialog;
		}
	});
});
