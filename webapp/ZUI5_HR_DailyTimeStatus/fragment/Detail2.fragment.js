sap.ui.define(
    [
        "common/makeTable" //
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail2", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table2", {
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}", // No data found
                    cellClick: oController.onPressTable2,
                    // sort : oController.onTableSort,
                    sort: common.makeTable.onTableSort,
                    extension: [
                        new sap.m.Toolbar({
                            height: "40px",
                            content: [new sap.m.Text({ text: "{i18n>LABEL_43024}" }).addStyleClass("sub-title")] // 근무시간현황
                        }).addStyleClass("toolbarNoBottomLine")
                    ]
                }).addStyleClass("mt-10px row-link");

                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");

                // 근로제도, 근무기간, 인원수
                var col_info = [
                    { id: "Wrktx", label: "{i18n>LABEL_43025}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                    { id: "Wrkprd", label: "{i18n>LABEL_43026}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                    { id: "Empcnt", label: "{i18n>LABEL_43007}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 한도시간(기본, 연장)
                    { id: "Hrs10", label: "{i18n>LABEL_43027}", plabel: "{i18n>LABEL_43028}", resize: true, span: 2, type: "string", sort: true, filter: true },
                    { id: "Hrs11", label: "{i18n>LABEL_43027}", plabel: "{i18n>LABEL_43029}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 실근로시간(기본, 연장, 소계)
                    { id: "Hrs20", label: "{i18n>LABEL_43030}", plabel: "{i18n>LABEL_43028}", resize: true, span: 3, type: "string", sort: true, filter: true },
                    { id: "Hrs21", label: "{i18n>LABEL_43030}", plabel: "{i18n>LABEL_43029}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrs22", label: "{i18n>LABEL_43030}", plabel: "{i18n>LABEL_43031}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 실근로(평일)(기본,연장,소계)
                    { id: "Hrs30", label: "{i18n>LABEL_43032}", plabel: "{i18n>LABEL_43028}", resize: true, span: 3, type: "string", sort: true, filter: true },
                    { id: "Hrs31", label: "{i18n>LABEL_43032}", plabel: "{i18n>LABEL_43029}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrs32", label: "{i18n>LABEL_43032}", plabel: "{i18n>LABEL_43031}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 실근로(휴일)(기본,연장,소계)
                    { id: "Hrs40", label: "{i18n>LABEL_43033}", plabel: "{i18n>LABEL_43028}", resize: true, span: 3, type: "string", sort: true, filter: true },
                    { id: "Hrs41", label: "{i18n>LABEL_43033}", plabel: "{i18n>LABEL_43029}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrs42", label: "{i18n>LABEL_43033}", plabel: "{i18n>LABEL_43031}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 심야
                    { id: "Hrs50", label: "{i18n>LABEL_43034}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true }
                ];

                MakeTable.makeColumn(oController, oTable, col_info);

                oTable.addEventDelegate({
                    onAfterRendering: function () {
                        MakeTable.setRowspan();

                        for (var i = 0; i < col_info.length; i++) {
                            var color = "";

                            switch (col_info[i].id) {
                                case "Hrs10":
                                case "Hrs11":
                                    color = "rgba(255, 216, 216, 0.4)";
                                    break;
                                case "Hrs22":
                                case "Hrs32":
                                case "Hrs42":
                                    color = "rgba(255, 250, 193, 0.4)";
                                    break;
                                default:
                                    color = "";
                                    break;
                            }

                            if (color == "") continue;

                            $("tr[id^='" + oController.PAGEID + "_Table2-rows'] > td[id$='col" + i + "']").css("background-color", color);
                        }
                    }
                });

                return oTable;
            }
        });
    }
);
