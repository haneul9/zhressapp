sap.ui.define(
    [
        "common/Common", //
        "common/Formatter",
        "common/makeTable",
        "common/PageHelper"
    ],
    function (Common, Formatter, makeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_DayWorkSchedule.List", {
            getControllerName: function () {
                return "ZUI5_HR_DayWorkSchedule.List";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_DASHBOARD_SRV");

                var oFilter = new sap.m.FlexBox({
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            // 검색
                            items: [
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Label({ text: "{i18n>LABEL_60008}" }), // 대상기간
                                        new sap.m.DatePicker({
                                            valueFormat: "yyyy-MM-dd",
                                            displayFormat: gDtfmt,
                                            value: "{Begda}",
                                            width: "200px",
                                            textAlign: "Begin",
                                            change: oController.onChangeDate.bind(oController)
                                        }),
                                        new sap.m.DatePicker({
                                            valueFormat: "yyyy-MM-dd",
                                            displayFormat: gDtfmt,
                                            value: "{Endda}",
                                            width: "200px",
                                            textAlign: "Begin",
                                            change: oController.onChangeDate.bind(oController)
                                        }).addStyleClass("pl-5px"),
                                        new sap.m.Label({
                                            text: "{i18n>LABEL_48002}", // 부서/사원
                                            visible: {
                                                path: "Werks",
                                                formatter: function (fVal) {
                                                    if (fVal && fVal.substring(0, 1) != "D") {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }
                                            }
                                        }),
                                        new sap.m.Input({
                                            width: "200px",
                                            value: "{Ename}",
                                            showValueHelp: true,
                                            valueHelpOnly: true,
                                            valueHelpRequest: oController.searchOrgehPernr,
                                            visible: {
                                                path: "Werks",
                                                formatter: function (fVal) {
                                                    if (fVal && fVal.substring(0, 1) != "D") {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }
                                            }
                                        })
                                    ]
                                }).addStyleClass("search-field-group"),
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Button({
                                            press: oController.onPressSearch,
                                            text: "{i18n>LABEL_00100}" // 조회
                                        }).addStyleClass("button-search")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        })
                    ]
                }).addStyleClass("search-box search-bg pb-7px mt-16px");

                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    noData: "{i18n>LABEL_00901}", // No data found
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    extension: [
                        new sap.m.Toolbar({
                            height: "40px",
                            content: [
                                new sap.m.MessageStrip({
                                    type: "Success",
                                    text: "{i18n>MSG_60002}" // ○ : 종일 휴가, ◑ : 전반부 반차, ◐ : 후반부 반차
                                })
                            ]
                        }).addStyleClass("toolbarNoBottomLine")
                    ]
                }).addStyleClass("mt-10px");

                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");

                // 성명, 부서, 근무일정, 일자, 요일, 공휴일, 교육/출장, 휴가, 일일근무일정, 근무시작, 근무종료, 비근무시간
                var col_info = [
                    { id: "Ename", label: "{i18n>LABEL_60013}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Orgtx", label: "{i18n>LABEL_60019}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "SchkzTx", label: "{i18n>LABEL_60020}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "15%" },
                    { id: "Datum", label: "{i18n>LABEL_60009}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "Dtext", label: "{i18n>LABEL_60021}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Holck", label: "{i18n>LABEL_60022}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Attck", label: "{i18n>LABEL_60023}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Absck", label: "{i18n>LABEL_60024}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "TprogTx", label: "{i18n>LABEL_60025}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Beguz", label: "{i18n>LABEL_60026}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Enduz", label: "{i18n>LABEL_60027}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Abtim", label: "{i18n>LABEL_60028}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true }
                ];

                makeTable.makeColumn(oController, oTable, col_info);

                var oPage = new PageHelper({
                    idPrefix: oController.PAGEID,
                    contentItems: [oFilter, oTable]
                });
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");

                return oPage;
            }
        });
    }
);
