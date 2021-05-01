sap.ui.define(
    [
        "../common/ZHR_TABLES", //
        "../common/PageHelper",
        "./delegate/Language"
    ],
    function (ZHR_TABLES, PageHelper, Language) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();

                var PageHandler = oController.getHandler.call(oController);

                return new PageHelper({
                    contentItems: [
                        this.buildSearchBox(oController, PageHandler), //
                        this.buildLegendBox(),
                        this.buildTable(oController)
                    ]
                }).setModel(PageHandler.Model());
            },

            buildSearchBox: function (oController, PageHandler) {

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
                                            valueHelpRequest: PageHandler.searchOrgehPernr.bind(oController),
                                            editable: "{/isEditOrgtree}"
                                        }),
                                        new sap.m.Label({text: "{i18n>LABEL_29003}"}), // 수강기간
                                        new sap.m.DateRangeSelection({
                                            displayFormat: "{/Dtfmt}",
                                            dateValue: "{Begda}",
                                            secondDateValue: "{Endda}",
                                            delimiter: "~",
                                            width: "210px"
                                        }),
                                        new sap.m.Label({ text: "{i18n>LABEL_29046}" }), // 외국어
                                        new sap.m.ComboBox({
                                            width: "140px",
                                            selectedKey: "{Zlangu}",
                                            change: PageHandler.onChangeZlangu.bind(PageHandler),
                                            items: {
                                                path: "/Zlangus",
                                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                            }
                                        }),
                                        new sap.m.Label({ text: "{i18n>LABEL_29047}" }), // 시험명
                                        new sap.m.ComboBox({
                                            width: "140px",
                                            selectedKey: "{Zltype}",
                                            items: {
                                                path: "/Zltypes",
                                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
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

            buildLegendBox: function () {

                return new sap.m.FlexBox({
                    height: "40px",
                    justifyContent: sap.m.FlexJustifyContent.End,
                    alignItems: sap.m.FlexAlignItems.End,
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.FlexBox({
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
                                }).addStyleClass("custom-legend-group")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("mt-40px");
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
                            path: "Status",
                            formatter: function (v) {
                                switch(v) {
                                    case Language.Approval.NONE:
                                        return sap.ui.core.IndicationColor.Indication01;
                                    case Language.Approval.IN_PROCESS:
                                        return sap.ui.core.IndicationColor.Indication02;
                                    case Language.Approval.REJECT:
                                        return sap.ui.core.IndicationColor.Indication03;
                                    case Language.Approval.DONE:
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

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "Obj1t", label: "{i18n>LABEL_29048}" /* 부 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "14%", align: "Begin" },
                    { id: "Obj2t", label: "{i18n>LABEL_29049}" /* 과 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "14%", align: "Begin" },
                    { id: "Gradet", label: "{i18n>LABEL_00124}" /* 직급 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "9%" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "9%" },
                    { id: "ZlanguTxt", label: "{i18n>LABEL_29036}" /* 어학종류 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "9%" },
                    { id: "Lecbe", label: "{i18n>LABEL_29003}" /* 수강기간 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "14%", templateGetter: "getDateRangeText", templateGetterOwner: PageHandler },
                    { id: "Zlaorg", label: "{i18n>LABEL_29010}" /* 수강학원 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "14%" },
                    { id: "SuportT", label: "{i18n>LABEL_29012}" /* 지원금액 */, plabel: "", resize: true, span: 0, type: "money", sort: true, filter: true, width: "9%" },
                    { id: "StatusT", label: "{i18n>LABEL_29014}" /* 결재상태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" }
                ]);

                return oTable;
            },

            loadModel: function () {
                $.app.setModel("ZHR_BENEFIT_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
