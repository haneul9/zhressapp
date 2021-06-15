sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "../delegate/SubstituteWork"
    ],
    function (Common, ZHR_TABLES, SubstituteWork) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, SubstituteWork.Tab.APPROVAL].join(".fragment.");

        sap.ui.jsfragment(TAB_PAGE_ID, {
            createContent: function (oController) {
                var ApprovalHandler = oController.getApprovalHandler.call(oController);

                return new sap.m.VBox({
                    items: [
                        this.buildSearchBox(oController, ApprovalHandler), //
                        this.buildLegendBox(),
                        this.buildTable(oController, ApprovalHandler)
                    ]
                }).setModel(ApprovalHandler.Model());
            },

            buildSearchBox: function(oController, ApprovalHandler) {
                return new sap.m.HBox({
                    fitContainer: true,
                    items: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.Label({ text: "{i18n>LABEL_31004}" }), // 부서/사원
                                        new sap.m.Input({
                                            width: "140px",
                                            value: "{EnameOrOrgehTxt}",
                                            showValueHelp: true,
                                            valueHelpOnly: true,
                                            valueHelpRequest: ApprovalHandler.searchOrgehPernr.bind(oController)
                                        }),
                                        new sap.m.Label({ text: "{i18n>LABEL_31005}" }), // 근무일정
                                        new sap.m.ComboBox({
                                            width: "140px",
                                            selectedKey: "{Tprog}",
                                            items: {
                                                path: "/Tprogs",
                                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                            }
                                        }),
                                        new sap.m.Label({text: "{i18n>LABEL_31007}"}), // 대상기간
                                        new sap.m.DateRangeSelection({
                                            displayFormat: "{/Dtfmt}",
                                            dateValue: "{Begda}",
                                            secondDateValue: "{Endda}",
                                            delimiter: "~",
                                            width: "250px"
                                        }),
                                        new sap.m.Label({text: "{i18n>LABEL_31013}"}), // 결재상태
                                        new sap.m.ComboBox({
                                            width: "100px",
                                            selectedKey: "{Apstat}",
                                            items: {
                                                path: "/ApprStats",
                                                template: new sap.ui.core.ListItem({key: "{Code}", text: "{Text}"})
                                            }
                                        })
                                    ]
                                }).addStyleClass("search-field-group"),
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.CheckBox({ 
                                            text: "{i18n>LABEL_31008}",   // 하위부서 포함
                                            textAlign: sap.ui.core.TextAlign.Begin,
                                            selected: "{OrgDn}",
                                            visible: {
                                                path: "/SearchConditions/Orgeh",
                                                formatter: function(v) {
                                                    return (!Common.checkNull(v)) ? true : false;
                                                }
                                            }
                                        })
                                    ]
                                }).addStyleClass("custom-search-checkbox ml-77px")
                            ]
                        }),
                        new sap.m.VBox({
                            items: [
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.Button({
                                            press: ApprovalHandler.search.bind(ApprovalHandler),
                                            text: "{i18n>LABEL_00100}" // 조회
                                        }).addStyleClass("button-search")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        })
                    ]
                })
                .addStyleClass("search-box search-bg pb-7px")
                .bindElement("/SearchConditions");
            },

            buildLegendBox: function () {

                return new sap.m.FlexBox({
                    justifyContent: sap.m.FlexJustifyContent.End,
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
                }).addStyleClass("mt-30px");
            },

            buildTable: function(oController, ApprovalHandler) {
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
                                    case SubstituteWork.Approval.NONE:
                                        return sap.ui.core.IndicationColor.Indication01;
                                    case SubstituteWork.Approval.IN_PROCESS:
                                        return sap.ui.core.IndicationColor.Indication02;
                                    case SubstituteWork.Approval.REJECT:
                                        return sap.ui.core.IndicationColor.Indication03;
                                    case SubstituteWork.Approval.DONE:
                                        return sap.ui.core.IndicationColor.Indication04;
                                    default:
                                        return null;
                                }
                            }
                        }
                    })
                })
                .addStyleClass("mt-15px")
                .bindRows("/List");

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Orgtx", label: "{i18n>LABEL_00155}" /* 부서 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto", align: sap.ui.core.HorizontalAlign.Begin },
                    { id: "PGradeTxt", label: "{i18n>LABEL_00124}" /* 직급 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "7%" },
                    { id: "Begda", label: "{i18n>LABEL_31011}" /* 시작일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "9%" },
                    { id: "Endda", label: "{i18n>LABEL_31012}" /* 종료일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "9%" },
                    { id: "Ttext", label: "{i18n>LABEL_31010}" /* 대체근무일정 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "16%", align: sap.ui.core.HorizontalAlign.Begin },
                    { id: "Status1Txt", label: "{i18n>LABEL_31014}" /* 진행상태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "Appkey1", label: "{i18n>LABEL_31015}" /* 결재번호 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "14%", templateGetter: "getAppkeyLink", templateGetterOwner: ApprovalHandler },
                    { id: "Appdt", label: "{i18n>LABEL_31016}" /* 신청일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "9%" }
                ]);

                return oTable;
            }
        });
    }
);
