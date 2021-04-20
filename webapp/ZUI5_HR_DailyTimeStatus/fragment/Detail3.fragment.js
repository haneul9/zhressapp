sap.ui.define(
    [
        "common/makeTable" //
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_DailyTimeStatus.fragment.Detail3", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table3", {
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
                    extension: [
                        new sap.m.Toolbar({
                            height: "40px",
                            content: [
                                new sap.m.Text({ text: "{i18n>LABEL_43035}" }).addStyleClass("sub-title") // 연장근로현황(주단위 평균)
                                /*new sap.m.ToolbarSpacer(),
										new sap.m.MessageStrip({
											text : "{i18n>LABEL_43044}" + " : " + "{Period}", // 대상기간
											type : "Success"
										})*/
                            ]
                        }).addStyleClass("toolbarNoBottomLine")
                    ]
                }).addStyleClass("mt-10px");

                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");

                // 0hr,0hr 초과 ~ 2hr 미만,2hr 이상 ~ 4hr 미만,4hr 이상 ~ 6hr 미만,6hr 이상 ~ 8hr 미만,8hr 이상 ~ 10hr 미만,10hr 이상 ~ 12hr 미만,12hr 이상
                var col_info = [
                    { id: "Cnt01", label: "{i18n>LABEL_43036}", plabel: "", resize: true, span: 0, type: "link", sort: false, filter: false },
                    { id: "Cnt02", label: "{i18n>LABEL_43037}", plabel: "", resize: true, span: 0, type: "link", sort: false, filter: false },
                    { id: "Cnt03", label: "{i18n>LABEL_43038}", plabel: "", resize: true, span: 0, type: "link", sort: false, filter: false },
                    { id: "Cnt04", label: "{i18n>LABEL_43039}", plabel: "", resize: true, span: 0, type: "link", sort: false, filter: false },
                    { id: "Cnt05", label: "{i18n>LABEL_43040}", plabel: "", resize: true, span: 0, type: "link", sort: false, filter: false },
                    { id: "Cnt06", label: "{i18n>LABEL_43041}", plabel: "", resize: true, span: 0, type: "link", sort: false, filter: false },
                    { id: "Cnt07", label: "{i18n>LABEL_43042}", plabel: "", resize: true, span: 0, type: "link", sort: false, filter: false },
                    { id: "Cnt08", label: "{i18n>LABEL_43043}", plabel: "", resize: true, span: 0, type: "link", sort: false, filter: false }
                ];

                MakeTable.makeColumn(oController, oTable, col_info);

                oTable.addEventDelegate({
                    onAfterRendering: function () {
                        MakeTable.setRowspan();

                        for (var i = 0; i < col_info.length; i++) {
                            var color = "";

                            switch (col_info[i].id) {
                                case "Cnt07":
                                case "Cnt08":
                                    color = "rgba(255, 216, 216, 0.4)";
                                    break;
                                case "Cnt06":
                                    color = "rgba(255, 250, 193, 0.4)";
                                    break;
                                case "Cnt01":
                                    color = "rgba(186, 238, 154, 0.4)";
                                    break;
                                default:
                                    color = "";
                                    break;
                            }

                            if (color == "") continue;

                            $("tr[id^='" + oController.PAGEID + "_Table3-rows'] > td[id$='col" + i + "']").css("background-color", color);
                        }
                    }
                });

                return oTable;
            }
        });
    }
);
