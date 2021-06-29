sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "../delegate/OvertimeWork"
    ],
    function (Common, ZHR_TABLES, OvertimeWork) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, OvertimeWork.Tab.PRIOR].join(".fragment.");

        sap.ui.jsfragment(TAB_PAGE_ID, {
            createContent: function (oController) {
                var PriorHandler = oController.getPriorHandler.call(oController);

                return new sap.m.VBox({
                    items: [
                        this.buildSearchBox(oController, PriorHandler), //
                        this.buildInfoBox(PriorHandler),
                        this.buildTable(oController, PriorHandler)
                    ]
                }).setModel(PriorHandler.Model());
            },

            buildSearchBox: function(oController, PriorHandler) {
                return new sap.m.HBox({
                    fitContainer: true,
                    items: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.Label({ text: "{i18n>LABEL_00200}" }), // 부서/사원
                                        new sap.m.Input({
                                            width: "140px",
                                            value: "{EnameOrOrgehTxt}",
                                            editable: "{= ${/SearchConditions/Bukrs3} !== 'A100' }",
                                            showValueHelp: true,
                                            valueHelpOnly: true,
                                            valueHelpRequest: PriorHandler.searchOrgehPernrByList.bind(PriorHandler)
                                        }),
                                        new sap.m.Label({text: "{i18n>LABEL_32009}"}), // 근무일
                                        new sap.m.DateRangeSelection({
                                            displayFormat: "{/Dtfmt}",
                                            dateValue: "{Begda}",
                                            secondDateValue: "{Endda}",
                                            delimiter: "~",
                                            width: "210px"
                                        })
                                    ]
                                }).addStyleClass("search-field-group")
                            ]
                        }),
                        new sap.m.VBox({
                            items: [
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.Button({
                                            press: PriorHandler.search.bind(PriorHandler),
                                            text: "{i18n>LABEL_00100}" // 조회
                                        }).addStyleClass("button-light")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        })
                    ]
                })
                .addStyleClass("search-box search-bg pb-7px mt-24px")
                .bindElement("/SearchConditions");
            },

            buildInfoBox: function(PriorHandler) {
                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.End,
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
                                new sap.m.Label({ text: "{i18n>LABEL_00196}" }).addStyleClass("custom-legend-item"), // 미결재
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
                                    press: PriorHandler.pressExcelDownloadBtn.bind(PriorHandler),
                                    text: "{i18n>LABEL_00129}", // Excel
                                    enabled: "{/IsPossibleExcelButton}"
                                }).addStyleClass("button-light"),
                                new sap.m.Button({
                                    press: PriorHandler.pressOpenApprovalBtn.bind(PriorHandler),
                                    text: "{i18n>LABEL_31006}" // 신청
                                }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");
            },

            buildTable: function(oController, PriorHandler) {
                var oTable = new sap.ui.table.Table($.app.createId("PriorTable"), {
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
                            path: "Status1",
                            formatter: function (v) {
                                switch(v) {
                                    case OvertimeWork.Approval.NONE:
                                        return sap.ui.core.IndicationColor.Indication01;
                                    case OvertimeWork.Approval.IN_PROCESS:
                                        return sap.ui.core.IndicationColor.Indication02;
                                    case OvertimeWork.Approval.REJECT:
                                        return sap.ui.core.IndicationColor.Indication03;
                                    case OvertimeWork.Approval.DONE:
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
                                    PriorHandler.pressSelectRowDetail.call(PriorHandler, oEvent);
                                }
                            })
                        ]
                    }),
                    cellClick: function (oEvent) {
                        PriorHandler.pressSelectRowDetail.call(PriorHandler, oEvent);
                    }
                })
                .addStyleClass("mt-8px row-link")
                .bindRows("/List");

                ZHR_TABLES.makeColumn(oController, oTable, this.getColumnModel.call(PriorHandler));
                PriorHandler.aColumnModel = Common.convertColumnArrayForExcel(this.oController, this.getColumnModel.call(PriorHandler));

                return oTable;
            },

            getColumnModel: function() {
                return [
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Otdat", label: "{i18n>LABEL_32009}" /* 근무일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "10%" },
                    { id: "Holick", label: "{i18n>LABEL_32021}" /* 휴일 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "8%", templateGetter: "getCheckboxTemplate", templateGetterOwner: this },
                    { id: "Otbet", label: "{i18n>LABEL_32010}" /* 시작 시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "10%" },
                    { id: "Otent", label: "{i18n>LABEL_32011}" /* 종료 시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "10%" },
                    { id: "Horex", label: "{i18n>LABEL_32022}" /* 신청사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto", align: sap.ui.core.HorizontalAlign.Begin },
                    { id: "Rjres", label: "{i18n>LABEL_32023}" /* 반려사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "13%", align: sap.ui.core.HorizontalAlign.Begin },
                    { id: "Status1T", label: "{i18n>LABEL_32024}" /* 결재상태 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "10%", templateGetter: "getLinkMimicTemplate", templateGetterOwner: this }
                ];
            }
        });
    }
);
