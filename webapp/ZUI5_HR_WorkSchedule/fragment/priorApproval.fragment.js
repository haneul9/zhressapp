sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "../delegate/WorkSchedule"
    ],
    function (Common, ZHR_TABLES, WorkSchedule) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, WorkSchedule.Tab.PRIOR].join(".fragment.");

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
                                            editable: "{= ${/Auth} === 'H' }",
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
                                        }),
                                        new sap.m.Label({text: "{i18n>LABEL_55002}"}), // 진행상태
                                        new sap.m.ComboBox({
                                            width: "150px",
                                            selectedKey: "{Apsta}",
                                            items: {
                                                path: "/ApprStats",
                                                template: new sap.ui.core.ListItem({key: "{Code}", text: "{Text}"})
                                            }
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
                                new sap.m.Label({ text: "{i18n>LABEL_00101}" }).addStyleClass("custom-legend-item"), // 저장
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                                new sap.m.Label({ text: "{i18n>LABEL_00152}" }).addStyleClass("custom-legend-item"), // 신청
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                                new sap.m.Label({ text: "{i18n>LABEL_00198}" }).addStyleClass("custom-legend-item"), // 반려
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
                                new sap.m.Label({ text: "{i18n>LABEL_00203}" }).addStyleClass("custom-legend-item") // 승인
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
                                    text: "{i18n>LABEL_00152}" // 신청
                                }).addStyleClass("button-light"),
                                new sap.m.Button({
                                    press: PriorHandler.pressBatchApply.bind(PriorHandler),
                                    visible : (Common.getOperationMode() == "DEV" && $.app.getAuth() == $.app.Auth.HASS ? true : false),
                                    text: "{i18n>LABEL_55051}" // 일괄신청
                                }).addStyleClass("button-light"),
                                new sap.m.Button({
                                    press: PriorHandler.pressOpenApprovalCancelBtn.bind(PriorHandler),
                                    text: "{i18n>LABEL_55037}" // 결재취소
                                }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");
            },

            buildTable: function(oController, PriorHandler) {
                var oTable = new sap.ui.table.Table($.app.createId("PriorTable"), {
                    selectionMode: sap.ui.table.SelectionMode.MultiToggle,
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
                                    case WorkSchedule.Approval.NONE:
                                        return sap.ui.core.IndicationColor.Indication01;
                                    case WorkSchedule.Approval.IN_PROCESS:
                                        return sap.ui.core.IndicationColor.Indication02;
                                    case WorkSchedule.Approval.REJECT:
                                        return sap.ui.core.IndicationColor.Indication03;
                                    case WorkSchedule.Approval.DONE:
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
                                    PriorHandler.pressSelectRowDetail.call(PriorHandler, oEvent.getSource().getBindingContext().getProperty());
                                }
                            })
                        ]
                    }),
                    cellClick: function (oEvent) {
                        PriorHandler.pressSelectRowDetail.call(PriorHandler, oEvent.getParameters().rowBindingContext.getProperty());
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
                    { id: "TmstaT", label: "{i18n>LABEL_55002}" /* 진행상태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "5%" },
                    { id: "Schda", label: "{i18n>LABEL_55003}" /* 근무일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "5%" },
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "5%" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "5%" },
                    { id: "Rtext", label: "{i18n>LABEL_55004}" /* 근무조 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "5%" },
                    { id: "Atext", label: "{i18n>LABEL_55005}" /* 근태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "5%" },
                    { id: "TprogT", label: "{i18n>LABEL_55006}" /* 일근유형 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "5%" },
                    { id: "PlanTime", label: "{i18n>LABEL_55007}" /* 계획근무 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "6%" },
                    { id: "InoutTime", label: "{i18n>LABEL_55008}" /* 입/출문 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "6%" },
                    { id: "WorkTime", label: "{i18n>LABEL_55009}" /* 근무시간 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "6%" },
                    { id: "AddTime1", label: "{i18n>LABEL_55010}" /* 추가시간1 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "6%" },
                    { id: "AddTime2", label: "{i18n>LABEL_55035}" /* 추가시간2 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "6%" },
                    { id: "FaprsT", label: "{i18n>LABEL_55011}" /* 사유구분 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%", align: "Begin" },
                    { id: "Ovres", label: "{i18n>LABEL_55012}" /* 사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "7%", align: "Begin" },
                    { id: "Tim00", label: "{i18n>LABEL_55013}" /* 정상 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "4%" },
                    { id: "Tim01", label: "{i18n>LABEL_55014}" /* 연장 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "4%" },
                    { id: "Tim07", label: "{i18n>LABEL_55015}" /* 심야 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "4%" },
                    { id: "Tim05", label: "{i18n>LABEL_55016}" /* 휴일 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "4%" },
                    { id: "Tim02", label: "{i18n>LABEL_55017}" /* 주휴 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "4%" }
                ];
            }
        });
    }
);
