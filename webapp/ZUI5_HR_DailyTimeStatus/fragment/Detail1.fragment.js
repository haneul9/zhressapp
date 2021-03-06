sap.ui.define(
    [
        "common/makeTable" //
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail1", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table1", {
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
                    // sort : oController.onTableSort,
                    sort: MakeTable.onTableSort,
                    extension: [
                        new sap.m.Toolbar({
                            height: "40px",
                            content: [
                                new sap.m.Text({ text: "{i18n>LABEL_43004}" }).addStyleClass("sub-title"), // 근태유형그룹별 현황
                                new sap.m.ToolbarSpacer(),
                                new sap.m.MessageStrip({
                                    text: "{i18n>LABEL_43005}", // 출근인원수 : 일근태 인원수 제외 / (숫자) : 1일미만 근태 인원수 / <숫자> : 중복 근태
                                    type: "Success"
                                })
                            ]
                        }).addStyleClass("toolbarNoBottomLine")
                    ]
                }).addStyleClass("mt-10px");

                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");

                // 직군, 인원수, 출근
                var col_info = [
                    { id: "HgradeT", label: "{i18n>LABEL_43006}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "12%" },
                    { id: "Empcnt", label: "{i18n>LABEL_43007}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Attcnt", label: "{i18n>LABEL_43008}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    // 휴가(연차휴가, 저축휴가, 기타휴가)
                    { id: "Cnt01", label: "{i18n>LABEL_43009}", plabel: "{i18n>LABEL_43010}", resize: true, span: 3, type: "link", sort: true, filter: true },
                    { id: "Cnt02", label: "{i18n>LABEL_43009}", plabel: "{i18n>LABEL_43011}", resize: true, span: 0, type: "link", sort: true, filter: true },
                    { id: "Cnt03", label: "{i18n>LABEL_43009}", plabel: "{i18n>LABEL_43012}", resize: true, span: 0, type: "link", sort: true, filter: true },
                    // 근태(교육, 출장, 기타근태)
                    { id: "Cnt04", label: "{i18n>LABEL_43013}", plabel: "{i18n>LABEL_43014}", resize: true, span: 3, type: "link", sort: true, filter: true },
                    { id: "Cnt05", label: "{i18n>LABEL_43013}", plabel: "{i18n>LABEL_43015}", resize: true, span: 0, type: "link", sort: true, filter: true },
                    { id: "Cnt06", label: "{i18n>LABEL_43013}", plabel: "{i18n>LABEL_43016}", resize: true, span: 0, type: "link", sort: true, filter: true },
                    // 휴직(육아휴직, 남성육아, 사질병, 기타휴직)
                    { id: "Cnt07", label: "{i18n>LABEL_43017}", plabel: "{i18n>LABEL_43018}", resize: true, span: 4, type: "link", sort: true, filter: true },
                    { id: "Cnt08", label: "{i18n>LABEL_43017}", plabel: "{i18n>LABEL_43019}", resize: true, span: 0, type: "link", sort: true, filter: true },
                    { id: "Cnt09", label: "{i18n>LABEL_43017}", plabel: "{i18n>LABEL_43020}", resize: true, span: 0, type: "link", sort: true, filter: true },
                    { id: "Cnt10", label: "{i18n>LABEL_43017}", plabel: "{i18n>LABEL_43021}", resize: true, span: 0, type: "link", sort: true, filter: true },
                    // 대근, 휴일
                    { id: "Cnt11", label: "{i18n>LABEL_43022}", plabel: "", resize: true, span: 0, type: "link", sort: true, filter: true },
                    { id: "Cnt12", label: "{i18n>LABEL_43023}", plabel: "", resize: true, span: 0, type: "link", sort: true, filter: true }
                ];

                MakeTable.makeColumn(oController, oTable, col_info);

                oTable.addEventDelegate({
                    onAfterRendering: function () {
                        MakeTable.setRowspan();

                        for (var i = 0; i < col_info.length; i++) {
                            var color = "";

                            switch (col_info[i].id) {
                                case "Cnt11":
                                case "Cnt12":
                                    color = "rgba(255, 216, 216, 0.4)";
                                    break;
                                case "Empcnt":
                                case "Attcnt":
                                    color = "rgba(186, 238, 154, 0.4)";
                                    break;
                                default:
                                    color = "";
                                    break;
                            }

                            if (color == "") continue;

                            $("tr[id^='" + oController.PAGEID + "_Table1-rows'] > td[id$='col" + i + "']").css("background-color", color);
                        }
                    }
                });

                return oTable;
            }
        });
    }
);
