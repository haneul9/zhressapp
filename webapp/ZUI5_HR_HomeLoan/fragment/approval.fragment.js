sap.ui.define(
    [
        "common/ZHR_TABLES",	//
        "../delegate/HomeLoan"
    ],
    function (ZHR_TABLES, HomeLoan) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, HomeLoan.Tab.APPROVAL].join(".fragment.");

        sap.ui.jsfragment(TAB_PAGE_ID, {
            createContent: function (oController) {
                var ApprovalHandler = oController.getApprovalHandler.call(oController);

                return new sap.m.VBox({
                    items: [
                        this.buildInfoBox(ApprovalHandler),	//
                        this.buildTable(oController, ApprovalHandler)
                    ]
                }).setModel(ApprovalHandler.Model());
            },

            buildInfoBox: function(ApprovalHandler) {
                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.End,
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
                                new sap.m.Label({ text: "{i18n>LABEL_00196}" }).addStyleClass("custom-legend-item"), // 미결재
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-purple"),
                                new sap.m.Label({ text: "{i18n>LABEL_00201}" }).addStyleClass("custom-legend-item"), // 담당자확인
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                                new sap.m.Label({ text: "{i18n>LABEL_00197}" }).addStyleClass("custom-legend-item"), // 결재중
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                                new sap.m.Label({ text: "{i18n>LABEL_00198}" }).addStyleClass("custom-legend-item"), // 반려
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
                                new sap.m.Label({ text: "{i18n>LABEL_00199}" }).addStyleClass("custom-legend-item") // 결재완료
                            ]
                        }).addStyleClass("custom-legend-group"),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    press: ApprovalHandler.pressOpenApprovalBtn.bind(ApprovalHandler),
                                    text: "{i18n>LABEL_31006}", // 신청
                                    visible: "{/isVisibleApprovalBtn}"
                                }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");
            },

            buildTable: function(oController, ApprovalHandler) {
                var oTable = new sap.ui.table.Table($.app.createId("ApprovalTable"), {
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 5,
                    showOverlay: false,
                    showNoData: true,
                    width: "100%",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}",
                    rowSettingsTemplate: new sap.ui.table.RowSettings({
                        highlight: {
                            path: "Status",
                            formatter: function (v) {
                                switch(v) {
                                    case HomeLoan.Approval.NONE:
                                        return sap.ui.core.IndicationColor.Indication01;
                                    case HomeLoan.Approval.IN_MANAGER:
                                        return sap.ui.core.IndicationColor.Indication05;
                                    case HomeLoan.Approval.IN_PROCESS:
                                        return sap.ui.core.IndicationColor.Indication02;
                                    case HomeLoan.Approval.REJECT:
                                        return sap.ui.core.IndicationColor.Indication03;
                                    case HomeLoan.Approval.DONE:
                                        return sap.ui.core.IndicationColor.Indication04;
                                    default:
                                        return null;
                                }
                            }
                        }
                    }),
                    rowActionCount: 1,
                    rowActionTemplate: new sap.ui.table.RowAction({
                        items: [
                            new sap.ui.table.RowActionItem({
                                type: "Navigation",
                                press: function (oEvent) {
                                    ApprovalHandler.pressSelectRowDetail.call(ApprovalHandler, oEvent.getSource().getBindingContext().getProperty());
                                }
                            })
                        ]
                    }),
                    cellClick: function (oEvent) {
                        ApprovalHandler.pressSelectRowDetail.call(ApprovalHandler, oEvent.getParameters().rowBindingContext.getProperty());
                    }
                })
                .addStyleClass("mt-8px row-link")
                .bindRows("/List");

                ZHR_TABLES.makeColumn(oController, oTable, this.getColumnModel.call(ApprovalHandler));

                return oTable;
            },

            getColumnModel: function() {
                return [
                    { id: "Begda", label: "신청일", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "15%" },
                    { id: "ZhltypTxt", label: "대출유형", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" },
                    { id: "Zhlrat", label: "대출신청금액", plabel: "", resize: true, span: 0, type: "money", sort: true, filter: true, width: "15%", align: sap.ui.core.HorizontalAlign.End },
                    { id: "Zhlcat", label: "대출확정금액", plabel: "", resize: true, span: 0, type: "money", sort: true, filter: true, width: "15%", align: sap.ui.core.HorizontalAlign.End },
                    { id: "BanklTxt", label: "지급은행", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" },
                    { id: "Bankn", label: "지급계좌번호", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" },
                    { id: "StatusTxt", label: "결재상태", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto" }
                ];
            }
        });
    }
);
