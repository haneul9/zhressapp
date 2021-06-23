sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("fragment.ApprovalLinesM", {
        createContent: function (oController) {
            var ApprovalLinesHandler = oController.getApprovalLinesHandler();

            return new sap.m.Dialog({
                showHeader: true,
                title: "결재자 정보",
                // contentWidth: "98%",
                draggable: true,
                verticalScrolling: false,
                content: [this.buildApprovalLineTable(ApprovalLinesHandler)],
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

        buildApprovalLineTable: function (ApprovalLinesHandler) {
            var oTable = new sap.m.Table("approvalLinesTable", {
                inset: false,
                rememberSelections: false,
                noDataText: "{i18n>LABEL_00901}",
                growing: false,
                mode: sap.m.ListMode.SingleSelectMaster,
                columns: [
                    new sap.m.Column({
                        width: "40%",
                        hAlign: sap.ui.core.TextAlign.Begin
                    }),
                    new sap.m.Column({
                        width: "50%",
                        hAlign: sap.ui.core.TextAlign.Begin
                    }),
                    new sap.m.Column({
                        hAlign: sap.ui.core.TextAlign.End
                    })
                ],
                items: {
                    path: "/List",
                    template: new sap.m.ColumnListItem({
                        type: sap.m.ListType.Active,
                        counter: 5,
                        cells: [
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "[{AprsqTx}]" }).addStyleClass("bold-700"), new sap.m.Text({ text: "{Apnam}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Aporx}" }), new sap.m.Text({ text: "{Ztitletx}" })]
                            }),
                            new sap.m.FlexBox({
                                justifyContent: "End",
                                items: [
                                    new sap.m.Button({
                                        press: ApprovalLinesHandler.onLineDelete.bind(ApprovalLinesHandler),
                                        icon: "sap-icon://delete",
                                        enabled: "{EditFlag}"
                                    }).addStyleClass("button-default")
                                ]
                            })
                        ]
                    })
                }
            });

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
                                        // new sap.m.Button({
                                        // 	press: ApprovalLinesHandler.onLineUp.bind(ApprovalLinesHandler),
                                        // 	icon: "sap-icon://arrow-top"
                                        // })
                                        // .addStyleClass("button-light-sm"),
                                        // new sap.m.Button({
                                        // 	press: ApprovalLinesHandler.onLineDown.bind(ApprovalLinesHandler),
                                        // 	icon: "sap-icon://arrow-bottom"
                                        // })
                                        // .addStyleClass("button-light-sm")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        }).addStyleClass("mb-5px"),
                        oTable.addStyleClass("mb-10px")
                    ]
                })
            }).addStyleClass("custom-panel mt-6px px-10px");
        }
    });
});
