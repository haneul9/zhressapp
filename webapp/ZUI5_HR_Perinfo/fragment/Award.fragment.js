sap.ui.define(
    [
        "common/makeTable" //
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Award", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var col_info;
                var vIndex = -1;
                // 번호, 포상일, 포상유형, 포상사유, 근거, 표창분류 , 표창기관
                col_info = [
                    { id: "Idx", label: "{i18n>LABEL_13005}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Begda", label: "{i18n>LABEL_37078}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Awdtx", label: "{i18n>LABEL_37079}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "CauseText", label: "{i18n>LABEL_37080}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Zzreason", label: "{i18n>ZZREASON}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Prtyp", label: "{i18n>LABEL_37082}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Prins", label: "{i18n>LABEL_37081}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true }
                ];

                var oTable = new sap.ui.table.Table(oController.PAGEID + "_AwardTable", {
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
                }).addStyleClass("row-link");

                oTable.attachEvent("cellClick", function (oEvent) {
                    oTable.clearSelection();
                    vIndex = -1;
                    vIndex = oEvent.getParameters().rowIndex;
                });

                oTable.attachBrowserEvent("dblclick", function () {
                    oTable.clearSelection();
                    oTable.addSelectionInterval(vIndex, vIndex);
                    oController.onAwardDblClick("1"); // only display mode
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
                                                new sap.m.Text({ text: "{i18n>LABEL_18010}" }).addStyleClass("sub-title"), // 포상
                                                new sap.m.ToolbarSpacer()
                                            ]
                                        })
                                            .setModel(oController._ListCondJSonModel)
                                            .bindElement("/Data")
                                            .addStyleClass("toolbarNoBottomLine h-40px"),
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
