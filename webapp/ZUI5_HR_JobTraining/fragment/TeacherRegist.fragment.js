sap.ui.define([
    "../../common/ZHR_TABLES"
], function (ZHR_TABLES) {
"use strict";

    sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.TeacherRegist", {

        _colModel: [
			{id: "Stext1", 	    label: "{i18n>LABEL_70042}"/* 부서명 */,plabel: "", resize: true, span: 2, type: "string",  sort: true,  filter: true, width: "auto"},
			{id: "Stext2", 	    label: "{i18n>LABEL_70042}"/* 부서명 */,plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "auto"},
			{id: "PGradeTxt", 	label: "{i18n>LABEL_70043}"/* 직급 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "20%"},
			{id: "Pernr", 		label: "{i18n>LABEL_70044}"/* 사번 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "20%"},
			{id: "Ename",   	label: "{i18n>LABEL_70045}"/* 성명 */,  plabel: "", resize: true, span: 0, type: "string", 	sort: true,  filter: true, width: "20%"}
		],

		createContent: function (oController) {

            var oTraningBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				fitContainer: true,
				items: [
					new sap.m.HBox({
						items: [
							new sap.m.Label({ text: "{i18n>LABEL_70045}" }), // 성명
                            new sap.m.Input(oController.PAGEID + "DTeacherInput", {
                                textAlign: "Begin",
                                width: "450px"
                            })
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [							
							new sap.m.Button({
								press: oController.onTeacherSearch.bind(oController),
								text: "{i18n>LABEL_70007}" // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
            })
			.addStyleClass("search-box search-bg pb-7px mt-16px");

            var oTeacherTable2 = new sap.ui.table.Table(oController.PAGEID + "_TeacherTable", {
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
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-30px")
			.setModel(oController.TeacherModel)
			.attachCellClick(oController.onSelectedTeacherRow)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oTeacherTable2, this._colModel); 

			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_70046}",    // 강사 검색
				contentWidth: "850px",
				contentHeight: "560px",
				buttons: [
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_29028}" // 닫기
					}).addStyleClass("button-default")
				],
				content: [
                    oTraningBox,
                    oTeacherTable2
                ]
            })
			.addStyleClass("custom-dialog-popup");

			return oDialog;
		}
	});
});
