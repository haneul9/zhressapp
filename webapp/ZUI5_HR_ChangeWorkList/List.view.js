sap.ui.define(
    [
        "common/makeTable", //
        "common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_ChangeWorkList.List", {
            getControllerName: function () {
                return "ZUI5_HR_ChangeWorkList.List";
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
                                            change: oController.onChangeDate
                                        }),
                                        new sap.m.DatePicker({
                                            valueFormat: "yyyy-MM-dd",
                                            displayFormat: gDtfmt,
                                            value: "{Endda}",
                                            width: "200px",
                                            textAlign: "Begin",
                                            change: oController.onChangeDate
                                        }).addStyleClass("pl-5px"),
                                        new sap.m.Label({ text: "{i18n>LABEL_48002}" }), // 부서/사원
                                        new sap.m.Input({
                                            width: "200px",
                                            value: "{Ename}",
                                            showValueHelp: true,
                                            valueHelpOnly: true,
                                            valueHelpRequest: oController.searchOrgehPernr
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
                    columnHeaderHeight: 38
                }).addStyleClass("mt-10px");

                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");

                // 부, 과, 사번, 성명, 시작일, 종료일, 계획근무, 대체근문
                var col_info = [
                    { id: "Stext", label: "{i18n>LABEL_60010}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Stext1", label: "{i18n>LABEL_60011}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Pernr", label: "{i18n>LABEL_60012}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Ename", label: "{i18n>LABEL_60013}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Begda", label: "{i18n>LABEL_60014}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "Endda", label: "{i18n>LABEL_60015}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "Tprog", label: "{i18n>LABEL_60016}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Tprog1", label: "{i18n>LABEL_60017}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true }
                ];

                MakeTable.makeColumn(oController, oTable, col_info);

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
