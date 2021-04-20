sap.ui.define(
    [
        "common/makeTable" //
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail4", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table4", {
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
                    sort: oController.onTableSort,
                    extension: [
                        new sap.m.Toolbar({
                            height: "40px",
                            content: [new sap.m.Text({ text: "{i18n>LABEL_43045}" }).addStyleClass("sub-title")] // 개인별 근무시간 현황
                        }).addStyleClass("toolbarNoBottomLine")
                    ]
                }).addStyleClass("mt-10px");

                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");

                // No, 사번, 성명, 직군, 직급, 소속부서
                var col_info = [
                    { id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Wrktx", label: "{i18n>LABEL_00191}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Wrkprd", label: "{i18n>LABEL_00121}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrpcnt", label: "{i18n>LABEL_00110}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrpcnt", label: "{i18n>LABEL_00124}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrpcnt", label: "{i18n>LABEL_00122}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 근태일자(일자, 요일)
                    { id: "Hrs10", label: "{i18n>LABEL_43046}", plabel: "{i18n>LABEL_43047}", resize: true, span: 2, type: "string", sort: true, filter: true },
                    { id: "Hrs11", label: "{i18n>LABEL_43046}", plabel: "{i18n>LABEL_43048}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 근무일정(From, To, 시간, 구분)
                    { id: "Hrs20", label: "{i18n>LABEL_43049}", plabel: "From", resize: true, span: 4, type: "string", sort: true, filter: true },
                    { id: "Hrs21", label: "{i18n>LABEL_43049}", plabel: "To", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrs22", label: "{i18n>LABEL_43049}", plabel: "{i18n>LABEL_43050}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrs22", label: "{i18n>LABEL_43049}", plabel: "{i18n>LABEL_43051}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 근태(유형, 시간)
                    { id: "Hrs30", label: "{i18n>LABEL_43052}", plabel: "{i18n>LABEL_43053}", resize: true, span: 2, type: "string", sort: true, filter: true },
                    { id: "Hrs31", label: "{i18n>LABEL_43052}", plabel: "{i18n>LABEL_43054}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 법정근로(소계, 기본, 연장)
                    { id: "Hrs40", label: "{i18n>LABEL_43055}", plabel: "{i18n>LABEL_43031}", resize: true, span: 3, type: "string", sort: true, filter: true },
                    { id: "Hrs41", label: "{i18n>LABEL_43055}", plabel: "{i18n>LABEL_43028}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrs42", label: "{i18n>LABEL_43055}", plabel: "{i18n>LABEL_43029}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 소정근로(소계, 평일, 휴일)
                    { id: "Hrs40", label: "{i18n>LABEL_43056}", plabel: "{i18n>LABEL_43031}", resize: true, span: 3, type: "string", sort: true, filter: true },
                    { id: "Hrs41", label: "{i18n>LABEL_43056}", plabel: "{i18n>LABEL_43057}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrs42", label: "{i18n>LABEL_43056}", plabel: "{i18n>LABEL_43023}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 연장근로(소계, 평일, 휴일, 휴일연장)
                    { id: "Hrs40", label: "{i18n>LABEL_43058}", plabel: "{i18n>LABEL_43031}", resize: true, span: 4, type: "string", sort: true, filter: true },
                    { id: "Hrs41", label: "{i18n>LABEL_43058}", plabel: "{i18n>LABEL_43057}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrs42", label: "{i18n>LABEL_43058}", plabel: "{i18n>LABEL_43023}", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Hrs42", label: "{i18n>LABEL_43058}", plabel: "{i18n>LABEL_43059}", resize: true, span: 0, type: "string", sort: true, filter: true },
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

                            $("tr[id^='" + oController.PAGEID + "_Table4-rows'] > td[id$='col" + i + "']").css("background-color", color);
                        }
                    }
                });

                return oTable;
            }
        });
    }
);
