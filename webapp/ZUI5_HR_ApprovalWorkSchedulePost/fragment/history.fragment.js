sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "../delegate/WorkSchedule"
    ],
    function (Common, ZHR_TABLES, WorkSchedule) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, WorkSchedule.Tab.HISTORY].join(".fragment.");

        sap.ui.jsfragment(TAB_PAGE_ID, {
            createContent: function (oController) {
                var HistoryHandler = oController.getHistoryHandler.call(oController);

                return new sap.m.VBox({
                    items: [
                        this.buildSearchBox(HistoryHandler), //
                        this.buildInfoBox(HistoryHandler),
                        this.buildTable(oController, HistoryHandler)
                    ]
                }).setModel(HistoryHandler.Model());
            },

            buildSearchBox: function(HistoryHandler) {
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
                                            showValueHelp: true,
                                            valueHelpOnly: true,
                                            valueHelpRequest: HistoryHandler.searchOrgehPernrByList.bind(HistoryHandler)
                                        }),
                                        new sap.m.Label({text: "{i18n>LABEL_55003}"}), // 근무일
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
                                                path: "/Apstas",
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
                                            press: HistoryHandler.search.bind(HistoryHandler),
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

            buildInfoBox: function(HistoryHandler) {
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
                                new sap.m.Label({ text: "{i18n>LABEL_00203}" }).addStyleClass("custom-legend-item")  // 승인
                            ]
                        }).addStyleClass("custom-legend-group"),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    press: HistoryHandler.pressExcelDownloadBtn.bind(HistoryHandler),
                                    text: "{i18n>LABEL_00129}", // Excel
                                    enabled: "{/IsPossibleExcelButton}"
                                }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");
            },

            buildTable: function(oController, HistoryHandler) {
                var oTable = new sap.ui.table.Table("HistoryTable", {
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 5,
                    fixedColumnCount: 8,
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
                                    case WorkSchedule.Approval.SAVE:
                                        return sap.ui.core.IndicationColor.Indication01;
                                    case WorkSchedule.Approval.REQUEST:
                                        return sap.ui.core.IndicationColor.Indication02;
                                    case WorkSchedule.Approval.REJECT:
                                        return sap.ui.core.IndicationColor.Indication03;
                                    case WorkSchedule.Approval.APPROVE:
                                        return sap.ui.core.IndicationColor.Indication04;
                                    default:
                                        return null;
                                }
                            }
                        }
                    })
                })
                .addStyleClass("mt-8px")
                .bindRows("/List");

                ZHR_TABLES.makeColumn(oController, oTable, this.getColumnModel.call(HistoryHandler));
                HistoryHandler.aColumnModel = Common.convertColumnArrayForExcel(this.oController, this.getColumnModel.call(HistoryHandler));

                return oTable;
            },

            getColumnModel: function() {
                return [
                    { id: "TmstaT", label: "{i18n>LABEL_55045}" /* 결재상태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "StatusT1", label: "{i18n>LABEL_55046}" /* 결재상태(최종) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "Schda", label: "{i18n>LABEL_55003}" /* 근무일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "120px" },
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Rtext", label: "{i18n>LABEL_55004}" /* 근무조 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Atext", label: "{i18n>LABEL_55005}" /* 근태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "TprogT", label: "{i18n>LABEL_55006}" /* 일근유형 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "PlanTime", label: "{i18n>LABEL_55007}" /* 계획근무 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "InoutTime", label: "{i18n>LABEL_55008}" /* 입/출문 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "WorkTime", label: "{i18n>LABEL_55009}" /* 근무시간 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "AddTime1", label: "{i18n>LABEL_55010}" /* 추가시간1 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "AddTime2", label: "{i18n>LABEL_55035}" /* 추가시간2 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "FaprsT", label: "{i18n>LABEL_55011}" /* 사유구분 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "140px", align: "Begin" },
                    { id: "Ovres", label: "{i18n>LABEL_55012}" /* 사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "180px", align: "Begin" },
                    { id: "Tim00", label: "{i18n>LABEL_55013}" /* 정상 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Tim01", label: "{i18n>LABEL_55014}" /* 연장 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Tim07", label: "{i18n>LABEL_55015}" /* 심야 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Tim05", label: "{i18n>LABEL_55016}" /* 휴일 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Tim02", label: "{i18n>LABEL_55017}" /* 주휴 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" }
                ];
            }
        });
    }
);
