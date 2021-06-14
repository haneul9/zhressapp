sap.ui.define(
    [
        "common/ZHR_TABLES", //
        "../delegate/HomeLoan"
    ],
    function (ZHR_TABLES, HomeLoan) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, HomeLoan.Tab.HISTORY].join(".fragment.");

        sap.ui.jsfragment(TAB_PAGE_ID, {
            createContent: function (oController) {
                var HistoryHandler = oController.getHistoryHandler.call(oController);

                return new sap.m.VBox({
                    items: [
                        this.buildTable(oController, HistoryHandler) //
                    ]
                }).setModel(HistoryHandler.Model());
            },

            buildTable: function (oController, HistoryHandler) {
                var oTable = new sap.ui.table.Table($.app.createId("HistoryTable"), {
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
                    noData: "{i18n>LABEL_00901}"
                })
                    .addStyleClass("mt-8px")
                    .bindRows("/List");

                ZHR_TABLES.makeColumn(oController, oTable, this.getColumnModel.call(HistoryHandler));

                return oTable;
            },

            getColumnModel: function () {
                return [
                    { id: "ZhltypTxt", label: "대출유형", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                    { id: "ZhldivTxt", label: "대출구분", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                    { id: "Begda", label: "대출일", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "10%" },
                    { id: "Zhlcat", label: "대출금액", plabel: "", resize: true, span: 0, type: "money", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.End },
                    { id: "Zrpsdt", label: "상환시작일", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "10%" },
                    { id: "Zarpat", label: "월 상환금액", plabel: "", resize: true, span: 0, type: "money", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.End },
                    { id: "Ztrpat", label: "총 상환금액", plabel: "", resize: true, span: 0, type: "money", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.End },
                    { id: "Zhlbat", label: "대출잔액", plabel: "", resize: true, span: 0, type: "money", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.End },
                    { id: "Endda", label: "대출종료일", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "10%" },
                    { id: "Zlrpdt", label: "최근상환일", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "auto" }
                ];
            }
        });
    }
);
