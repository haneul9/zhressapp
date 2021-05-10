sap.ui.define(
    [
        "common/makeTable" //
    ],
    function (MakeTable) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Passport", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var col_info;
                var vIndex = -1;
                // 번호, 유형, 우편번호, 주소, 전화번호, 핸드폰번호, 내선번호
                col_info = [
                    { id: "Idx", label: "{i18n>LABEL_13005}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "DocTypeT", label: "{i18n>LABEL_37043}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Landx", label: "{i18n>LABEL_02165}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Begda", label: "{i18n>LABEL_18046}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "Endda", label: "{i18n>LABEL_18047}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true }
                ];

                var oTable = new sap.ui.table.Table(oController.PAGEID + "_PassportTable", {
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
                    oController.onPassportDblClick("1"); // only display mode
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
                                                new sap.m.Text({ text: "{i18n>LABEL_37044}" }).addStyleClass("sub-title"), // 여권/비자관리
                                                new sap.m.ToolbarSpacer(),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_37042}", // 신규
                                                    press: function () {
                                                        oController.onPassportDblClick("3");
                                                    },
                                                    visible: {
                                                        parts: [{ path: "Auth" }],
                                                        formatter: function (v1) {
                                                            if (v1 == "E") return true;
                                                            else return false;
                                                        }
                                                    }
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_00102}", // 수정
                                                    press: function () {
                                                        oController.onPassportDblClick("2");
                                                    },
                                                    visible: {
                                                        parts: [{ path: "Auth" }],
                                                        formatter: function (v1) {
                                                            if (v1 == "E") return true;
                                                            else return false;
                                                        }
                                                    }
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_00103}", // 삭제
                                                    press: function () {
                                                        oController.onPassportDblClick("4");
                                                    },
                                                    visible: {
                                                        parts: [{ path: "Auth" }],
                                                        formatter: function (v1) {
                                                            if (v1 == "E") return true;
                                                            else return false;
                                                        }
                                                    }
                                                }).addStyleClass("button-light")
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
