sap.ui.define(
    [
        "common/makeTable" //
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Guarantee", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var col_info;
                var vIndex = -1;
                // 번호, 보증구분, 보증금액, 보증기간, 보증인/보험회사, 관계, 주소
                col_info = [
                    { id: "Idx", label: "{i18n>LABEL_13005}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Stext", label: "{i18n>LABEL_37067}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "GuarAmtT", label: "{i18n>LABEL_37068}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Period", label: "{i18n>LABEL_37069}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "GcompText", label: "{i18n>LABEL_37070}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Relat", label: "{i18n>LABEL_37071}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Locat", label: "{i18n>LABEL_00168}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true }
                ];

                var oTable = new sap.ui.table.Table(oController.PAGEID + "_GuaranteeTable", {
                    selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly,
                    selectionMode: sap.ui.table.SelectionMode.Single,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    columnHeaderHeight: 38,
                    rowHeight: 38,
                    showOverlay: false,
                    showNoData: true,
                    noData: "{i18n>LABEL_00901}" // No data found
                });

                oTable.attachEvent("cellClick", function (oEvent) {
                    oTable.clearSelection();
                    vIndex = -1;
                    vIndex = oEvent.getParameters().rowIndex;
                });

                oTable.attachBrowserEvent("dblclick", function () {
                    oTable.clearSelection();
                    oTable.addSelectionInterval(vIndex, vIndex);
                });

                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");

                MakeTable.makeColumn(oController, oTable, col_info);

                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns: 1,
                    widths: [""],
                    width: "100%",
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            content: [
                                                new sap.m.Text({ text: "{i18n>LABEL_37072}" }).addStyleClass("sub-title"), // 신용보증
                                                new sap.m.ToolbarSpacer()
                                            ]
                                        })
                                            .setModel(oController._ListCondJSonModel)
                                            .bindElement("/Data")
                                            .addStyleClass("toolbarNoBottomLine"),
                                        new sap.ui.core.HTML({ content: "<div style='height:5px' />" })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [oTable],
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                })
                            ]
                        })
                    ]
                });

                return oMatrix;
            }
        });
    }
);
