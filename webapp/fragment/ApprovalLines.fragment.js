sap.ui.define(["common/ZHR_TABLES"], function (ZHR_TABLES) {
    "use strict";

    sap.ui.jsfragment("fragment.ApprovalLines", {
        createContent: function (oController) {
            var ApprovalLinesHandler = oController.getApprovalLinesHandler();

            return new sap.m.Dialog({
                showHeader: true,
                title: "결재자 정보",
                contentWidth: "1000px",
                draggable: true,
                verticalScrolling: false,
                content: [this.buildApprovalLineTable(oController, ApprovalLinesHandler)],
                buttons: [
                    new sap.m.Button({
                        text: "{i18n>LABEL_09023}", // 신청
                        press: ApprovalLinesHandler.onRequest.bind(ApprovalLinesHandler)
                    }).addStyleClass("button-dark"),
                    new sap.m.Button({
                        type: sap.m.ButtonType.Default,
                        text: "{i18n>LABEL_09025}", // 닫기
                        press: function () {
                            ApprovalLinesHandler.getDialog().close();
                        }
                    }).addStyleClass("button-default custom-button-divide")
                ]
            }).setModel(ApprovalLinesHandler.getModel());
        },

        buildApprovalLineTable: function (oController, ApprovalLinesHandler) {
            var oTable = new sap.ui.table.Table("CommonApprovalLineTable", {
                width: "100%",
                selectionMode: "None",
                enableColumnReordering: false,
                enableColumnFreeze: false,
                enableBusyIndicator: true,
                visibleRowCount: 5,
                showOverlay: false,
                showNoData: true,
                rowHeight: 38,
                columnHeaderHeight: 38,
                noData: "{i18n>LABEL_00901}",
                layoutData: new sap.m.FlexItemData({ maxWidth: "100%" })
            })
                .addStyleClass("mt-8px")
                .bindRows("/List");

            ZHR_TABLES.makeColumn(oController, oTable, [
                { id: "AprsqTx", label: "결재단계", plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "24%", templateGetter: "getApprovalLineFunc", templateGetterOwner: this },
                { id: "Apper", label: "사번", plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "14%" },
                { id: "Apnam", label: "성명", plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "14%" },
                { id: "Aporx", label: "부서명", plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "16%" },
                { id: "ApgrdT", label: "직급", plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "14%" }
            ]);

            return new sap.m.Panel({
                layoutData: new sap.m.FlexItemData({ minWidth: "100%" }),
                expanded: true,
                expandable: false,
                content: new sap.m.VBox({
                    width: "100%",
                    items: [
                        new sap.m.HBox({
                            justifyContent: sap.m.FlexJustifyContent.End,
                            items: [
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.Button({
                                            press: ApprovalLinesHandler.onLineAdd.bind(ApprovalLinesHandler),
                                            icon: "sap-icon://add",
                                            text: "추가"
                                        }).addStyleClass("button-light-sm")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        }),
                        oTable
                    ]
                })
            }).addStyleClass("custom-panel mt-6px px-10px");
        },

        getApprovalLineFunc: function (columnInfo, oController) {
            var ApprovalLinesHandler = oController.getApprovalLinesHandler();

            return new sap.m.FlexBox({
                justifyContent: "Center",
                alignItems: sap.m.FlexAlignItems.Center,
                items: [
                    new sap.ui.commons.TextView({
                        text: "{" + columnInfo.id + "}",
                        textAlign: "Center"
                    }).addStyleClass("FontFamily"),
                    new sap.m.Button({
                        press: ApprovalLinesHandler.onLineModify.bind(ApprovalLinesHandler),
                        text: "변경", // 변경
                        visible: "{EditFlag}"
                    }).addStyleClass("ml-10px"),
                    new sap.m.Button({
                        press: ApprovalLinesHandler.onLineDelete.bind(ApprovalLinesHandler),
                        text: "삭제", // 삭제
                        visible: "{EditFlag}"
                    }).addStyleClass("ml-10px")
                ]
            });
        }
    });
});
