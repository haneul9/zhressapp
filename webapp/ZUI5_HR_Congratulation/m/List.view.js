sap.ui.define(
    [
        "common/Common", //
        "common/PageHelper"
    ],
    function (Common, PageHelper) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();

                var infoBox = new sap.m.FlexBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    alignContent: sap.m.FlexAlignContent.End,
                    alignItems: sap.m.FlexAlignItems.End,
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({
                                    text: "{i18n>LABEL_08020}"
                                }).addStyleClass("sub-title") // 신청 현황
                            ]
                        }),

                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressNew,
                                    text: "{i18n>LABEL_08001}" // 신청
                                }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");

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
                            width: "50%",
                            hAlign: "Begin"
                        }),
                        new sap.m.Column({
                            width: "auto",
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
                                            // 신청일
                                            textAlign: "Begin",
                                            text: {
                                                path: "Begda",
                                                formatter: function (v) {
                                                    return v ? Common.DateFormatter(v) : "";
                                                }
                                            }
                                        }).addStyleClass("L2P13Font font-14px")
                                    ]
                                }),
                                new sap.m.VBox({
                                    items: [
                                        new sap.m.Text({
                                            text: "{TypeTxt}",
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px"),
                                        new sap.m.Text({
                                            text: "{StatusText}",
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
                    contentItems: [infoBox, oTable]
                });
            },

            loadModel: function () {
                // Model 선언
                $.app.setModel("ZHR_BENEFIT_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
