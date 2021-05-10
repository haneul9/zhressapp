sap.ui.define(
    [
        "common/Common", //
        "common/PageHelper",
        "common/ZHR_TABLES",
        "./delegate/OvertimeWork"
    ],
    function (Common, PageHelper, ZHR_TABLES, OvertimeWork) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();

                var PageHandler = oController.getPageHandler.call(oController);

                return new PageHelper({
                    contentItems: [
                        new sap.m.VBox({
                            items: [
                                this.buildSearchBox(oController, PageHandler), //
                                this.buildInfoBox(PageHandler),
                                this.buildTable(oController, PageHandler)
                            ]
                        })
                    ]
                }).setModel(PageHandler.Model());
            },

            buildSearchBox: function(oController, PageHandler) {
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
                                            valueHelpRequest: PageHandler.searchOrgehPernr.bind(oController)
                                        }),
                                        new sap.m.Label({text: "{i18n>LABEL_32007}"}), // 대상기간
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
                                            selectedKey: "{Status1}",
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
                                            press: PageHandler.search.bind(PageHandler),
                                            text: "{i18n>LABEL_00100}" // 조회
                                        }).addStyleClass("button-search")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        })
                    ]
                })
                .addStyleClass("search-box search-bg pb-7px mt-24px")
                .bindElement("/SearchConditions");
            },

            buildInfoBox: function(PageHandler) {
                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.End,
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
                                new sap.m.Label({ text: "{i18n>LABEL_00196}" }).addStyleClass("custom-legend-item"), // 미결재
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                                new sap.m.Label({ text: "{i18n>LABEL_00197}" }).addStyleClass("custom-legend-item"), // 결재중
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-purple"),
                                new sap.m.Label({ text: "{i18n>LABEL_00201}" }).addStyleClass("custom-legend-item"), // 담당자확인
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                                new sap.m.Label({ text: "{i18n>LABEL_00198}" }).addStyleClass("custom-legend-item"), // 반려
                                new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
                                new sap.m.Label({ text: "{i18n>LABEL_00199}" }).addStyleClass("custom-legend-item") // 결재완료
                            ]
                        }).addStyleClass("custom-legend-group"),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    press: PageHandler.pressExcelDownloadBtn.bind(PageHandler),
                                    text: "{i18n>LABEL_00129}", // Excel
                                    enabled: "{/IsPossibleExcelButton}"
                                }).addStyleClass("button-light"),
                                new sap.m.Button({
                                    press: PageHandler.pressChangeApprovalBtn.bind(PageHandler),
                                    text: "{i18n>LABEL_31006}" // 신청
                                }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");
            },

            buildTable: function(oController, PageHandler) {
                var oTable = new sap.ui.table.Table("ApprovalTable", {
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
                                    case OvertimeWork.Approval.IN_MANAGER:
                                        return sap.ui.core.IndicationColor.Indication05;
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
                                    PageHandler.pressSelectRowDetail.call(PageHandler, oEvent.getSource().getBindingContext().getProperty());
                                }
                            })
                        ]
                    }),
                    cellClick: function (oEvent) {
                        PageHandler.pressSelectRowDetail.call(PageHandler, oEvent.getParameters().rowBindingContext.getProperty());
                    }
                })
                .addStyleClass("mt-15px row-link")
                .bindRows("/List");

                ZHR_TABLES.makeColumn(oController, oTable, this.getColumnModel.call(PageHandler));

                return oTable;
            },

            getColumnModel: function() {
                return [
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Begda", label: "{i18n>LABEL_32009}" /* 근무일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "10%" },
                    { id: "Beguz", label: "{i18n>LABEL_32010}" /* 시작 시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "10%" },
                    { id: "Enduz", label: "{i18n>LABEL_32011}" /* 종료 시간 */, plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width: "10%" },
                    { id: "Jobco", label: "{i18n>LABEL_32012}" /* 작업내용 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto", align: sap.ui.core.HorizontalAlign.Begin },
                    { id: "Stext1", label: "{i18n>LABEL_32008}" /* 진행상태 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "15%", templateGetter: "getSmoinLink", templateGetterOwner: this },
                    { id: "Stext", label: "{i18n>LABEL_32013}" /* 결재상태(담당부서) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" }
                ];
            },

            loadModel: function () {
                $.app.setModel("ZHR_WORKTIME_APPL_SRV");
                $.app.setModel("ZHR_WORKSCHEDULE_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
