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
                $.app.setModel("ZHR_BENEFIT_SRV");
                $.app.setModel("ZHR_COMMON_SRV");

                var oDateYearCombo = new sap.m.ComboBox({ // 대상년도
                    selectedKey: "{Zyear}",
                    width: "150px",
                    items: {
                        path: "/Zyears",
                        template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                    }
                })
                .addStyleClass("mr-5px");
    
                oDateYearCombo.addDelegate({
                    onAfterRendering: function () {
                        oDateYearCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                    }
                }, oDateYearCombo);

                var oSearchBox = new sap.m.HBox({
                    fitContainer: true,
                    items: [
                        new sap.m.HBox({
                            items: [
                                oDateYearCombo
                            ]
                        })
                        .addStyleClass("search-field-group pr-0"),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressSer.bind(oController),
                                    icon: "sap-icon://search"
                                }).addStyleClass("button-search")
                            ]
                        }).addStyleClass("button-group pl-0")
                    ]
                })
                .setModel(oController.SearchModel)
                .bindElement("/User")
                .addStyleClass("search-box-mobile h-auto");

                var oInfoBox = new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    fitContainer: true,
                    items: [
                        // 신청현황
                        new sap.m.Label({ text: "{i18n>LABEL_74043}", design: "Bold" }).addStyleClass("sub-title"),
                        new sap.m.Button({
                            // 신청
                            press: oController.onPressReq.bind(oController),
                            text: "{i18n>LABEL_74005}"
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
                            width: "20%",
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
                                            // 숙박기간
                                            text: "{Ngtprd}",
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px"),
                                        new sap.m.Text({
                                            // 지원금액
                                            text: {
                                                path: "Supamttx",
                                                formatter: function(v) {
                                                    return Common.checkNull(v) ? "0원" : v + "원";
                                                }
                                            },
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px")
                                    ]
                                }),
                                new sap.m.VBox({
                                    items: [
                                        new sap.m.Text({
                                            // 숙박일수
                                            text: {
                                                path: "Ngtcnt",
                                                formatter: function(v) {
                                                    return Common.checkNull(v) ? "숙박 0박" : "숙박 " + v + "박";
                                                }
                                            },
                                            textAlign: "Begin"
                                        }).addStyleClass("L2P13Font font-14px"),
                                        new sap.m.Text({
                                            // 지원일수
                                            text: {
                                                path: "Supcnt",
                                                formatter: function(v) {
                                                    return Common.checkNull(v) ? "지원 0박" : "지원 " + v + "박";
                                                }
                                            },
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
