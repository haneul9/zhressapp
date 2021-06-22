/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/PageHelper" //
    ],
    function (PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_FamilyApply.FamilyApply", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf controller.main
             */
            getControllerName: function () {
                return "ZUI5_HR_FamilyApply.FamilyApply";
            },

            /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
             * Since the Controller is given to this method, its event handlers can be attached right away.
             * @memberOf controller.main
             */
            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_BENEFIT_SRV");

                var oRow, oCell, oMat;

                oMat = new sap.ui.commons.layout.MatrixLayout();

                oRow = new sap.ui.commons.layout.MatrixLayoutRow();
                oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                    content: new sap.ui.core.HTML({ content: "<div style='height:16px;'/>" })
                });
                oRow.addCell(oCell);
                oMat.addRow(oRow);

                oRow = new sap.ui.commons.layout.MatrixLayoutRow();
                oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                    hAlign: "Right",
                    content: [
                        new sap.m.Button({
                            text: oBundleText.getText("LABEL_00153"),
                            press: function () {
                                oController.onDialog("N");
                            }
                        }).addStyleClass("button-light"),
                        new sap.ui.core.HTML({ content: "<span>&nbsp;&nbsp;</span>" }),
                        new sap.m.Button({ text: oBundleText.getText("LABEL_44042"), press: oController.onModLines }).addStyleClass("button-light"),
                        new sap.ui.core.HTML({ content: "<span>&nbsp;&nbsp;</span>" }),
                        new sap.m.Button({ text: oBundleText.getText("LABEL_00103"), press: oController.onDeleteLines }).addStyleClass("button-delete")
                    ]
                });
                oRow.addCell(oCell);
                oMat.addRow(oRow);

                oRow = new sap.ui.commons.layout.MatrixLayoutRow();
                oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                    content: new sap.ui.core.HTML({ content: "<div style='height:5px;'/>" })
                });
                oRow.addCell(oCell);
                oMat.addRow(oRow);

                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
                    selectionMode: "MultiToggle",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
					enableBusyIndicator: true,
					enableSelectAll: false,
                    visibleRowCount: 15,
                    showOverlay: false,
                    showNoData: true,
                    width: "auto",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                    .addStyleClass("mt-10px row-link")
                    .attachCellClick(oController.onSelectedRow);

                oRow = new sap.ui.commons.layout.MatrixLayoutRow();
                oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                    content: oTable
                });
                oRow.addCell(oCell);
                oMat.addRow(oRow);

                oController.oTableInit();

                oMat.setModel(oController._ListCondJSonModel);
                oMat.bindElement("/Data");

                return new PageHelper({
                    contentItems: [oMat]
                });
            }
        });
    }
);
