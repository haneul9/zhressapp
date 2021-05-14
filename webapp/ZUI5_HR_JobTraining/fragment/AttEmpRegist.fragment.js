sap.ui.define([
    "../../common/ZHR_TABLES"
], function (ZHR_TABLES) {
"use strict";

    sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.AttEmpRegist", {

        _colModel: [
			{id: "Orgtx1", 	    label: "{i18n>LABEL_70055}"/* 부서 */,plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true, width: "25%", templateGetter:"getDeft"},
			{id: "ZpGradeTxt", 	label: "{i18n>LABEL_70043}"/* 직급 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "25%"},
			{id: "Pernr", 		label: "{i18n>LABEL_70044}"/* 사번 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "25%"},
			{id: "Ename",   	label: "{i18n>LABEL_70045}"/* 성명 */,  plabel: "", resize: true, span: 0, type: "string", 	sort: true,  filter: true, width: "25%"}
		],

		createContent: function (oController) {

            var oAttTypeCombo = new sap.m.ComboBox({ // 교육효과평가
				width: "100px",
				items: {
					path: "/AttTypeCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{AttType}"
			});
			
			// 키보드 입력 방지
			oAttTypeCombo.addDelegate({
				onAfterRendering: function () {
					oAttTypeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oAttTypeCombo);

            var oAttSerchBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				fitContainer: true,
				items: [
					new sap.m.HBox({
						items: [
							new sap.m.Label({ text: "{i18n>LABEL_70056}" }), // 검색
                            oAttTypeCombo,
                            new sap.m.Input({
                                textAlign: "Begin",
                                width: "450px",
                                value: "{EmpValue}"
                            })
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [							
							new sap.m.Button({
								press: oController.onAttSearch.bind(oController),
								text: "{i18n>LABEL_70007}" // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
            })
            .setModel(oController.AttSearchModel)
			.bindElement("/SearchData")
			.addStyleClass("search-box search-bg pb-7px mt-16px");

            var oAttTable = new sap.ui.table.Table(oController.PAGEID + "_AttTable2", {
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
			.setModel(oController.AttDetailModel)
			.attachCellClick(oController.onSelectedAttRow)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oAttTable, this._colModel); 

			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_70057}",    // 사원 검색
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
                    oAttSerchBox,
                    oAttTable
                ]
            })
			.addStyleClass("custom-dialog-popup");

			return oDialog;
		}
	});
});
