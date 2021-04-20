/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES"
    ],
    function (Common, ZHR_TABLES) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "DetailDialog"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var oDialog = new sap.m.Dialog({
                    contentWidth: "1400px",
                    contentHeight: "70vh",
                    title: "{i18n>LABEL_66018}", // 상세내용
                    content: [this.buildInfoBox(oController), this.getTable(oController)],
                    buttons: [
                        new sap.m.Button({
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-default custom-button-divide")
                    ]
                })
                    .addStyleClass("custom-dialog-popup")
                    .setModel(oController._DetailJSonModel)
                    .bindElement("/Data");

                return oDialog;
            },

            buildInfoBox: function (oController) {
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1300px" }),
                    expanded: true,
                    expandable: false,
                    content: [
                        new sap.m.HBox({
                            width: "100%",
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            items: [
                                new sap.m.VBox({
                                    width: "33.3%",
                                    items: [
                                        new sap.m.HBox({
                                            items: [
                                                this.getLabel("header", oController.getBundleText("LABEL_66009"), "200px", "Right"),
                                                new sap.m.Text({
                                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                    text: "{AppsqT}"
                                                })
                                            ]
                                        }).addStyleClass("search-field-group")
                                    ]
                                }).addStyleClass("search-inner-vbox"),
                                new sap.m.VBox({
                                    width: "33.4%",
                                    items: [
                                        new sap.m.HBox({
                                            items: [
                                                this.getLabel("header", oController.getBundleText("LABEL_66011"), "200px", "Right"),
                                                new sap.m.Text({
                                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                    text: "{ContyT}"
                                                })
                                            ]
                                        }).addStyleClass("search-field-group")
                                    ]
                                }).addStyleClass("search-inner-vbox"),
                                new sap.m.VBox({
                                    width: "33.3%",
                                    items: [
                                        new sap.m.HBox({
                                            items: [
                                                this.getLabel("header", oController.getBundleText("LABEL_66012"), "200px", "Right"),
                                                new sap.m.Text({
                                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                    text: "{ApstaT}"
                                                })
                                            ]
                                        }).addStyleClass("search-field-group")
                                    ]
                                }).addStyleClass("search-inner-vbox")
                            ]
                        }).addStyleClass("search-box h-auto p-0")
                    ]
                }).addStyleClass("custom-panel");
            },

            getLabel: function (type, labelText, wid, align, isReq) {
                if (type === "header") {
                    return new sap.m.Label({
                        layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                        textAlign: Common.checkNull(align) ? "Center" : align,
                        required: Common.checkNull(isReq) ? false : isReq,
                        text: labelText,
                        width: Common.checkNull(wid) ? "100%" : wid
                    }).addStyleClass("flexbox-table-header");
                } else {
                    // type === "cell"
                    return new sap.m.Label({
                        layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                        textAlign: Common.checkNull(align) ? "Center" : align,
                        required: Common.checkNull(isReq) ? false : isReq,
                        text: labelText,
                        width: Common.checkNull(wid) ? "auto" : wid
                    });
                }
            },

            getTable: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly,
                    selectionMode: sap.ui.table.SelectionMode.Single,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    busyIndicatorDelay: 0,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    width: "100%",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                    .addStyleClass("mt-10px")
                    .setModel(oController._DetailTableJSonModel)
                    .bindRows("/Data");

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "Idx", label: oController.getBundleText("LABEL_66008") /* 번호     */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "7%" },
                    { id: "ApfldT", label: oController.getBundleText("LABEL_66019") /* 컬럼명 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "31%", templateGetter: "getStatusTemplate", templateGetterOwner: this },
                    { id: "Binfo", label: oController.getBundleText("LABEL_66016") /* 신청전 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "31%", templateGetter: "getStatusTemplate", templateGetterOwner: this },
                    { id: "Ainfo", label: oController.getBundleText("LABEL_66017") /* 신청후     */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "31%", templateGetter: "getStatusTemplate", templateGetterOwner: this }
                ]);

                return oTable;
            },

            getStatusTemplate: function (columnInfo) {
                // return new sap.ui.commons.TextView({
                return new sap.m.Text({
                    text: {
                        parts: [{ path: columnInfo.id }, { path: "Binfo" }, { path: "Ainfo" }],
                        formatter: function (v, v2, v3) {
                            this.removeStyleClass("differ");
                            if (v2 === v3) {
                                this.removeStyleClass("differ");
                            } else {
                                this.addStyleClass("differ");
                            }
                            return v;
                        }
                    },
                    textAlign: "Center",
                    tooltip: " "
                }).addStyleClass("FontFamily");
            }
        });
    }
);
