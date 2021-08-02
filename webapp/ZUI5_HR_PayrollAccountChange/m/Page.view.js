$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define(
    [
        "common/PageHelper",
        "common/Common"
    ],
    function (PageHelper, Common) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                // Model 선언
                $.app.setModel("ZHR_PAY_RESULT_SRV");
                $.app.setModel("ZHR_COMMON_SRV");

                var oSearchBox = new sap.m.HBox({
                    fitContainer: true,
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.Text({
                                    // 급여계좌
                                    text: {
                                        parts: [{path: "IBanka"}, {path: "IBankn"}],
                                        formatter: function(v1, v2) {
                                            return !v1 ? "" : oController.getBundleText("LABEL_75024") + v1 + " " + v2;
                                        }
                                    },
                                    textAlign: "Begin"
                                })
                            ]
                        })
                        .addStyleClass("search-field-group pr-0")
                    ]
                })
                .setModel(oController.EmpModel)
                .bindElement("/User")
                .addStyleClass("search-box-mobile h-45px");

                var oInfoBox = new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    fitContainer: true,
                    items: [
                        // 신청현황
                        new sap.m.Label({ text: "{i18n>LABEL_75025}", design: "Bold" }).addStyleClass("sub-title"),
                        new sap.m.Button({
                            // 신청
                            press: oController.onPressReq.bind(oController),
                            text: "{i18n>LABEL_75012}"
                        }).addStyleClass("button-light mr-10px")
                    ]
                })
                .addStyleClass("info-box mb-10px");

                var oTable = new sap.m.Table({
                    inset: false,
                    rememberSelections: false,
                    noDataText: "{i18n>LABEL_00901}",
                    growing: true,
                    growingThreshold: 5,
                    mode: sap.m.ListMode.SingleSelectMaster,
                    itemPress: oController.onSelectedRow.bind(oController),
                    columns: [
                        new sap.m.Column({
                            width: "25%",
                            hAlign: "Begin"
                        }),
                        new sap.m.Column({
                            width: "auto",
                            hAlign: "Begin"
                        }),
                        new sap.m.Column({
                            width: "30%",
                            hAlign: "Begin"
                        })
                    ],
                    items: {
                        path: "/Data",
                        template: new sap.m.ColumnListItem({
                            type: sap.m.ListType.Active,
                            counter: 5,
                            cells: [
                                new sap.m.VBox({
                                    items: [
                                        new sap.m.Text({
                                            // 상태
                                            text: "{Statust}",
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px Bold"),
                                        new sap.m.Text({
                                            // 신청일
                                            text: {
                                                path: "Appda",
                                                formatter: function (v) {
                                                    return v ? Common.DateFormatter(v) : "";
                                                }
                                            },
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px")
                                    ]
                                }),
                                new sap.m.VBox({
                                    items: [
                                        new sap.m.Text({
                                            // 변경후
                                            text: {
                                                path: "Banka",
                                                formatter: function(v) {
                                                    return Common.checkNull(v) ? "" : oController.getBundleText("LABEL_75027") + v;
                                                }
                                            },
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px"),
                                        new sap.m.Text({
                                            // 변경전
                                            text: {
                                                path: "Banka2",
                                                formatter: function(v) {
                                                    return Common.checkNull(v) ? "" : oController.getBundleText("LABEL_75026") + v;
                                                }
                                            },
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px")
                                    ]
                                }),
                                new sap.m.VBox({
                                    items: [
                                        new sap.m.Text({
                                            // 변경후
                                            text: "{Bankn}",
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px"),
                                        new sap.m.Text({
                                            // 변경전
                                            text: "{Bankn2}",
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px")
                                    ]
                                })
                            ]
                        })
                    }
                }).setModel(oController.TableModel);

                return new PageHelper({
                    contentContainerStyleClass: "app-content-container-mobile",
                    contentItems: [oSearchBox, oInfoBox, oTable]
                });
            }
        });
    }
);
