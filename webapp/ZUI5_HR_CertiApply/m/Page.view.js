sap.ui.define(
    [
        "common/PageHelper", //
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
                $.app.setModel("ZHR_CERTI_SRV");
                $.app.setModel("ZHR_COMMON_SRV");

                return new PageHelper({
                    contentContainerStyleClass: "app-content-container-mobile",
                    contentItems: [this.MainingBox(oController)]
                });
            },

            MainingBox: function(oController) {


                return new sap.m.VBox({
                    items: [
                        new sap.m.HBox({
                            justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                            fitContainer: true,
                            items: [
                                // 신청현황
                                new sap.m.Label({ text: "{i18n>LABEL_38002}" }).addStyleClass("sub-title"),
                                new sap.m.Button({
                                    press: function(){
                                        oController.onPressReq();
                                    },
                                    text: "{i18n>LABEL_38044}" // 신청
                                }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("info-box")
                          .setModel(oController.LogModel),
        
                        new sap.m.Table({
                            inset: false,
                            rememberSelections: false,
                            noDataText: "{i18n>LABEL_00901}",
                            growing: true,
                            growingThreshold: 5,
                            mode: sap.m.ListMode.SingleSelectMaster,
                            columns: [
                                new sap.m.Column({
                                    width: "40%",
                                    hAlign: "Begin"
                                }),
                                new sap.m.Column({
                                    width: "35%",
                                    hAlign: "Begin"
                                }),
                                new sap.m.Column({
                                    width: "25%",
                                    hAlign: "End"
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
                                                new sap.m.Label({
                                                    // 신청일
                                                    textAlign: "Begin",
                                                    text: {
                                                        path: "Begda",
                                                        formatter: function (v) {
                                                            return v ? Common.DateFormatter(v) : "";
                                                        }
                                                    }
                                                }).addStyleClass("L2P13Font font-14px"),
                                                new sap.m.Label({
                                                    // 구분
                                                    text: "{Typetxt}",
                                                    textAlign: "Begin"
                                                }).addStyleClass("L2P13Font font-14px")
                                            ]
                                        }),
                                        new sap.m.VBox({
                                            items: [
                                                new sap.m.Label({
                                                    text: "{Zstatustxt}",
                                                    textAlign: "Begin"
                                                }).addStyleClass("L2P13Font font-14px"),
                                                new sap.m.Label({
                                                    // 구분
                                                    text: "{AptypT}",
                                                    textAlign: "Begin"
                                                }).addStyleClass("L2P13Font font-14px")
                                            ]
                                        }),
                                        new sap.m.VBox({
                                            items: [
                                                new sap.m.Button({
                                                    press: oController.onPressButton,
                                                    text: {
                                                        parts: [{ path: "Zstatus" }, { path: "Aptyp" }],
                                                        formatter: function (v, v2) {
                                                            if (v === "1") {
                                                                return oController.getBundleText("LABEL_65022"); // 처리중
                                                            } else if (v === "2" && v2 === "1") {
                                                                return oController.getBundleText("LABEL_65023"); // 재발급
                                                            } else if (v === "3") {
                                                                return oController.getBundleText("LABEL_65026"); // 모바일 다운불가
                                                            }
                                                        }
                                                    },
                                                    visible: {
                                                        parts: [{ path: "Zstatus" }, { path: "Aptyp" }],
                                                        formatter: function (v, v2) {
                                                            this.removeStyleClass("button-light-sm");
                                                            this.removeStyleClass("button-light-smRpw");
                                                            if(v === "3"){
                                                                this.addStyleClass("button-light-smRow");
                                                            }else{
                                                                this.addStyleClass("button-light-sm");
                                                            }
                                                            if (v === "2") {
                                                                if (v2 === "1") return true;
                                                                else return false;
                                                            } else {
                                                                return true;
                                                            }
                                                        }
                                                    }
                                                })
                                            ]
                                        })
                                    ]
                                })
                            }
                        }).setModel(oController.TableModel)
                    ]
                }).addStyleClass("vbox-form-mobile");
            }
        });
    }
);
