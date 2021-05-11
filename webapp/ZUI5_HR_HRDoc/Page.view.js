sap.ui.define(
    [
        "../common/ZHR_TABLES", //
        "../common/PageHelper",
        "./delegate/HRDoc"
    ],
    function (ZHR_TABLES, PageHelper, HRDoc) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();

                var oModel = oController.getHandler.call(oController).Model();

                return new PageHelper({
                    contentItems: [
                        this.buildSearchBox(oController), //
                        this.buildActionButtons(oController),
                        this.buildTable(oController)
                    ]
                }).setModel(oModel);
            },

            buildSearchBox: function (oController) {
                var PageHandler = oController.PageHandler,
                    Auth = $.app.getAuth();

                return new sap.m.FlexBox({
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            // 검색
                            items: [
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Label({
                                            text: "{i18n>LABEL_27002}",
                                            visible: "{/IsHassView}"
                                        }), // 인사영역
                                        new sap.m.ComboBox({
                                            width: "200px",
                                            selectedKey: "{Persa}",
                                            items: {
                                                path: "/Persas",
                                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                            },
                                            visible: "{/IsHassView}"
                                        }),
                                        new sap.m.Label({
                                            text: "{i18n>LABEL_27003}"
                                        }).addStyleClass(Auth === "H" ? "" : "ml-0"), // HR서류
                                        new sap.m.ComboBox({
                                            width: "250px",
                                            selectedKey: "{Hrdoc}",
                                            items: {
                                                path: "/Hrdocs",
                                                template: new sap.ui.core.ListItem({ key: "{Hrdoc}", text: "{Hrdoctx}" })
                                            }
                                        }),
                                        new sap.m.Label({
                                            text: "{i18n>LABEL_27004}",
                                            visible: "{/IsHassView}"
                                        }), // 제목
                                        new sap.m.Input({
                                            width: "250px",
                                            value: "{Doctl}",
                                            visible: "{/IsHassView}"
                                        }),
                                        new sap.m.Label({
                                            text: "{i18n>LABEL_27005}",
                                            visible: "{/IsHassView}"
                                        }), // 발송일
                                        new sap.m.DateRangeSelection({
                                            displayFormat: "{/Dtfmt}",
                                            dateValue: "{Reqbeg}",
                                            secondDateValue: "{Reqend}",
                                            delimiter: "~",
                                            width: "250px",
                                            visible: "{/IsHassView}"
                                        })
                                    ]
                                }).addStyleClass("search-field-group"),
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Button({
                                            press: PageHandler.search.bind(PageHandler),
                                            text: "{i18n>LABEL_00100}" // 조회
                                        }).addStyleClass("button-search")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        }) // 검색
                    ]
                })
                .addStyleClass("search-box search-bg pb-7px mt-16px")
                .bindElement("/SearchConditions");
            },

            buildActionButtons: function (oController) {
                var PageHandler = oController.PageHandler;

                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.End,
                    items: [
                        this.buildLegend(),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    text: "{i18n>LABEL_27017}", // 신규발송
                                    visible: "{/IsHassView}",
                                    press: PageHandler.pressMakeNewDocument.bind(PageHandler)
                                }).addStyleClass("button-light"),
                                // new sap.m.Button({
                                //     text: "Test",
                                //     press: PageHandler.pressTest.bind(PageHandler)
                                // }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");
            },

            buildLegend: function () {
                var legends = [];

                if ($.app.getAuth() === "H") {
                    legends = [
                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
                        new sap.m.Label({ text: "{i18n>LABEL_27031}" }).addStyleClass("custom-legend-item"), // 미발송
                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                        new sap.m.Label({ text: "{i18n>LABEL_27032}" }).addStyleClass("custom-legend-item") // 발송완료
                    ];
                } else {
                    legends = [
                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
                        new sap.m.Label({ text: "{i18n>LABEL_27020}" }).addStyleClass("custom-legend-item") // 제출요청
                    ];
                }

                legends = legends.concat(legends, [
                    new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                    new sap.m.Label({ text: "{i18n>LABEL_27033}" }).addStyleClass("custom-legend-item"), // 제출지연
                    new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
                    new sap.m.Label({ text: "{i18n>LABEL_27034}" }).addStyleClass("custom-legend-item") // 제출완료
                ]);

                return new sap.m.FlexBox({
                    items: legends
                }).addStyleClass("custom-legend-group");
            },

            buildTable: function (oController) {
                var PageHandler = oController.PageHandler;
                var oTable = new sap.ui.table.Table(this.createId("Table"), {
                    width: "auto",
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 38,
                    noData: "{i18n>LABEL_00901}",
                    rowSettingsTemplate: new sap.ui.table.RowSettings({
                        highlight: {
                            path: "Docst",
                            formatter: function (v) {
                                switch(v) {
                                    case HRDoc.DocumentStatus.NOT_SEND:
                                        return sap.ui.core.IndicationColor.Indication01;
                                    case HRDoc.DocumentStatus.SEND_COMPLETED:
                                        return sap.ui.core.IndicationColor.Indication02;
                                    case HRDoc.DocumentStatus.SUBMISSION_DELAY:
                                        return sap.ui.core.IndicationColor.Indication03;
                                    case HRDoc.DocumentStatus.SUBMISSION_COMPLETED:
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

                var ESSColumnModels = [
                    { id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "5%" },
                    { id: "Hrdoctx", label: "{i18n>LABEL_27003}" /* HR서류 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%", align: "Begin" },
                    { id: "Doctl", label: "{i18n>LABEL_27004}" /* 제목 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto", align: "Begin" },
                    { id: "Smbda", label: "{i18n>LABEL_27008}" /* 제출기간 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "18%", templateGetter: "getDateRangeText", templateGetterOwner: PageHandler },
                    { id: "Reqda", label: "{i18n>LABEL_27018}" /* 요청일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "10%" },
                    { id: "Rmdda", label: "{i18n>LABEL_27013}" /* 최종 Remind */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "10%" },
                    { id: "Smtda", label: "{i18n>LABEL_27019}" /* 제출일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "10%" }
                ];

                var HASSColumnModels = [
                    { id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "5%" },
                    { id: "Pbtxt", label: "{i18n>LABEL_27002}" /* 인사영역 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Hrdoctx", label: "{i18n>LABEL_27007}" /* 문서명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "12%", align: "Begin" },
                    { id: "Doctl", label: "{i18n>LABEL_27004}" /* 제목 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto", align: "Begin" },
                    { id: "Smbda", label: "{i18n>LABEL_27008}" /* 제출기간 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "16%", templateGetter: "getDateRangeText", templateGetterOwner: PageHandler },
                    { id: "Rqcnt", label: "{i18n>LABEL_27009}" /* 발송건수 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Smcnt", label: "{i18n>LABEL_27010}" /* 제출건수 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Prrte", label: "{i18n>LABEL_27011}" /* 진행률 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "10%", templateGetter: "getProcessChart", templateGetterOwner: PageHandler },
                    { id: "Reqda", label: "{i18n>LABEL_27012}" /* 발송일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "8%" },
                    { id: "Rmdda", label: "{i18n>LABEL_27013}" /* 최종 Remind */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "8%" },
                    { id: "Cplda", label: "{i18n>LABEL_27014}" /* 완료일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "8%" }
                ];

                ZHR_TABLES.makeColumn(oController, oTable, $.app.getAuth() === "H" ? HASSColumnModels : ESSColumnModels);

                return oTable;
            },

            loadModel: function () {
                $.app.setModel("ZHR_HRDOC_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
