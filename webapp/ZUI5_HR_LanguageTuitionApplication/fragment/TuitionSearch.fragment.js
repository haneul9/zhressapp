sap.ui.define([
    "common/ZHR_TABLES"	//
], function (ZHR_TABLES) {
"use strict";

    sap.ui.jsfragment("ZUI5_HR_LanguageTuitionApplication.fragment.TuitionSearch", {

        _colModel: [
			{id: "ZlanguTxt", 	label: "{i18n>LABEL_29036}"/* 어학종류 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "auto"},
			{id: "ZltypeTxt", 	label: "{i18n>LABEL_29037}"/* 시험종류 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "auto"},
			{id: "Acqpot", 		label: "{i18n>LABEL_29038}"/* 취득점수 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "auto"},
			{id: "Appdat",  	label: "{i18n>LABEL_29039}"/* 응시일자 */,  plabel: "", resize: true, span: 0, type: "date",  	sort: true,  filter: true, width: "auto"},
			{id: "Endda",		label: "{i18n>LABEL_29040}"/* 유효일자 */,  plabel: "", resize: true, span: 0, type: "date",  	sort: true,  filter: true,  width: "auto"}, 
			{id: "TargetcT",	label: "{i18n>LABEL_29041}"/* 이수여부 */,  plabel: "", resize: true, span: 0, type: "string",  sort: false, filter: false, width: "auto"}
		],

		createContent: function (oController) {
			var oCell = null,
				oRow = null;

            var oGubunCombo = new sap.m.ComboBox(oController.PAGEID + "_GubunCombo", { // 어학구분
				width: "130px",
                change: oController.onDialogGubun.bind(oController),
				items: {
					path: "/LanguCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Zlangu}"
			});

			// 키보드 입력 방지
			oGubunCombo.addDelegate({
				onAfterRendering: function () {
					oGubunCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oGubunCombo);
			
            var oExamCombo = new sap.m.ComboBox(oController.PAGEID + "_ExamCombo", { // 시험종류
				width: "180px",
				items: {
					path: "/TestCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},  
				selectedKey: "{Zltype}"
			});

			// 키보드 입력 방지
			oExamCombo.addDelegate({
				onAfterRendering: function () {
					oExamCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oExamCombo);
            
            var oCompleteCombo = new sap.m.ComboBox(oController.PAGEID + "_CompleteCombo", { // 이수여부
				width: "90px",
				items: {
					path: "/CompleteCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{ITepas}"
			});

			// 키보드 입력 방지
			oCompleteCombo.addDelegate({
				onAfterRendering: function () {
					oCompleteCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oCompleteCombo);

            var oLayout = new sap.ui.commons.layout.MatrixLayout({
				columns : 6,
				width : "100%",
				widths : ["80px", "", "80px", "", "80px", ""]
            }).addStyleClass("search-box search-bg");
            
            oRow = new sap.ui.commons.layout.MatrixLayoutRow();

            oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Middle,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_29042}" })] //어학구분
			});
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Middle,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oGubunCombo
			});
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Middle,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_29037}"  })] //시험종류
			});
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Middle,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: oExamCombo
			});
            oRow.addCell(oCell);
            
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Middle,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label({ text: "{i18n>LABEL_29041}" })] //유효/만료
			});
			oRow.addCell(oCell);

			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Middle,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [
					new sap.m.FlexBox({
						items: [
							oCompleteCombo,
							new sap.m.Button({
								press: oController.onDialogSearchBtn.bind(oController),
								text: "{i18n>LABEL_29007}" // 조회
							}).addStyleClass("button-search ml-20px mt-4px")
						]
					})
				]
			});
			oRow.addCell(oCell);

			oLayout.addRow(oRow);

            var inputTable = new sap.ui.table.Table(oController.PAGEID + "_GradeTable", {
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
			.addStyleClass("mt-30px row-link")
			.setModel(oController.GradeModel)
			.attachCellClick(oController.onSelectedGradeRow)
			.bindRows("/TableData");
			
			ZHR_TABLES.makeColumn(oController, inputTable, this._colModel); 

			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_29001}",    // 어학비신청
				contentWidth: "980px",
				contentHeight: "560px",
				afterOpen: oController.onAfterSearchDialog.bind(oController),
				buttons: [
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_29028}" // 닫기
					}).addStyleClass("button-default")
				],
				content: [
                    oLayout.bindElement("/Data"),
                    inputTable
                ]
            })
			.addStyleClass("custom-dialog-popup")
            .setModel(oController.GradeModel);

			return oDialog;
		}
	});
});
