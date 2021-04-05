sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "../delegate/OvertimeWork"
    ],
    function (Common, ZHR_TABLES, OvertimeWork) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, OvertimeWork.Tab.HISTORY].join(".fragment.");

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
                                        new sap.m.Label({text: "{i18n>LABEL_32009}"}), // 근무일
                                        new sap.m.DateRangeSelection({
                                            displayFormat: "{/Dtfmt}",
                                            dateValue: "{Begda}",
                                            secondDateValue: "{Endda}",
                                            delimiter: "~",
                                            width: "210px"
                                        }),
                                        new sap.m.Label({text: "{i18n>LABEL_32008}"}), // 진행상태
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
                var oTable = new sap.ui.table.Table($.app.createId("HistoryTable"), {
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 5,
                    fixedColumnCount: 6,
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
                                    case OvertimeWork.Approval.SAVE:
                                        return sap.ui.core.IndicationColor.Indication01;
                                    case OvertimeWork.Approval.REQUEST:
                                        return sap.ui.core.IndicationColor.Indication02;
                                    case OvertimeWork.Approval.REJECT:
                                        return sap.ui.core.IndicationColor.Indication03;
                                    case OvertimeWork.Approval.APPROVE:
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
                    { id: "StatusT", label: "{i18n>LABEL_32024}" /* 결재상태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Status1T", label: "{i18n>LABEL_32052}" /* 결재상태(최종) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "Otdat", label: "{i18n>LABEL_32009}" /* 근무일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "100px" },
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "HgradeT", label: "{i18n>LABEL_02273}" /* 직급 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Holick", label: "{i18n>LABEL_32021}" /* 휴일 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "80px", templateGetter: "getCheckboxTemplate", templateGetterOwner: this },
                    { id: "Entbg", label: "{i18n>LABEL_32057}" /* 입문시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "100px" },
                    { id: "Enten", label: "{i18n>LABEL_32058}" /* 출문시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "100px" },
                    { id: "Otbet", label: "{i18n>LABEL_32010}" /* 시작시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "100px" },
                    { id: "Otent", label: "{i18n>LABEL_32011}" /* 종료시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "100px" },
                    { id: "MealbW", label: "{i18n>LABEL_32059}" /* 조식 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "80px" },
                    { id: "MealdW", label: "{i18n>LABEL_32060}" /* 석식 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "80px" },
                    { id: "WelldW", label: "{i18n>LABEL_32045}" /* 웰리스 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "80px" },
                    { id: "Brkhm1W", label: "{i18n>LABEL_32061}" /* 제외시간(식사) */, plabel: "", resize: true, span: 0, type: "time", sort: false, filter: false, width: "120px" },
                    { id: "Brkhm2W", label: "{i18n>LABEL_32062}" /* 제외시간(웰리스) */, plabel: "", resize: true, span: 0, type: "time", sort: false, filter: false, width: "120px" },
                    { id: "Brkhm3W", label: "{i18n>LABEL_32063}" /* 제외시간(기타) */, plabel: "", resize: true, span: 0, type: "time", sort: false, filter: false, width: "120px" },
                    { id: "ComtmW", label: "{i18n>LABEL_32027}" /* 근태인정시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "120px" },
                    { id: "TottmW", label: "{i18n>LABEL_32029}" /* 총근로시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "120px" },
                    { id: "MottmW", label: "{i18n>LABEL_32053}" /* 월누적연장근로 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "Horex", label: "{i18n>LABEL_32054}" /* 사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "200px", align: sap.ui.core.HorizontalAlign.Begin },
                    { id: "Rjres", label: "{i18n>LABEL_32023}" /* 반려사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "200px", align: sap.ui.core.HorizontalAlign.Begin }
                ];
            }
        });
    }
);
