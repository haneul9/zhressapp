sap.ui.define([
    "../../common/ZHR_TABLES"
], function (ZHR_TABLES) {
"use strict";

    sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.TraningRegist", {

        _colModel: [
			{id: "ZgtypeTxt", 	label: "{i18n>LABEL_40025}"/* 교육구분 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "20%"},
			{id: "Gstext", 	    label: "{i18n>LABEL_40074}"/* 교육그룹 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "20%"},
			{id: "Stext", 		label: "{i18n>LABEL_40015}"/* 교육과정 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "auto"},
			{id: "OrgStext",  	label: "{i18n>LABEL_40018}"/* 교육기관 */,  plabel: "", resize: true, span: 0, type: "string", 	sort: true,  filter: true, width: "25%"}
		],

		createContent: function (oController) {

            var oTraningBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				fitContainer: true,
				items: [
					new sap.m.HBox({
						items: [
							new sap.m.Label({ text: "{i18n>LABEL_40024}" }), // 교육과정
                            new sap.m.Input(oController.PAGEID + "DTrainingInput", {
                                textAlign: "Begin",
                                width: "450px"
                            })
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [							
							new sap.m.Button({
								press: oController.onTraningSearch.bind(oController),
								text: "{i18n>LABEL_40007}" // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
            })
			.addStyleClass("search-box search-bg pb-7px mt-16px");

            var oTraningTable2 = new sap.ui.table.Table(oController.PAGEID + "_TraningTable2", {
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
			.setModel(oController.TraningModel)
			.attachCellClick(oController.onSelectedTraningRow)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oTraningTable2, this._colModel); 

			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_40073}",    // 교육과정 검색
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
                    oTraningTable2
                ]
            })
			.addStyleClass("custom-dialog-popup");

			return oDialog;
		}
	});
});
