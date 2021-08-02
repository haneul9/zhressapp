/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common",
        "common/PageHelper",
        "../delegate/ViewTemplates"
    ],
    function (Common, PageHelper, ViewTemplates) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

        sap.ui.jsview(SUB_APP_ID, {
            getControllerName: function () {
                return SUB_APP_ID;
            },

            createContent: function (oController) {
                return new PageHelper({
                    idPrefix: "Detail-",
                    title: {
                        path: "Status",
                        formatter: function(v) {
                            // 급여계좌변경 신규신청 else 급여계좌변경 조회
                            return !v || v === "AA" ? oController.getBundleText("LABEL_75018") : oController.getBundleText("LABEL_75019");
                        }
                    },
                    showNavButton: true,
                    navBackFunc: oController.navBack,
                    headerButton: new sap.m.HBox({
                        items: [
                            new sap.m.Button({
                                press: oController.onDialogApplyBtn.bind(oController),
                                text: "{i18n>LABEL_74005}", // 신청
                                visible: {
                                    path: "Status",
                                    formatter: function(v) {
                                        return !v;
                                    }
                                }
                            }).addStyleClass("button-dark mr-8px"),
                            new sap.m.Button({
                                press: oController.onDialogDeleteBtn.bind(oController),
                                text: "{i18n>LABEL_74033}", // 삭제
                                visible: {
                                    path: "Status",
                                    formatter: function(v) {
                                        return v === "00";
                                    }
                                }
                            }).addStyleClass("button-dark mr-8px"),
                            new sap.m.Button({
                                text : "{i18n>LABEL_74022}", // 취소
                                press : oController.navBack
                            }).addStyleClass("button-light ml-0")
                        ]
                    }).addStyleClass("app-nav-button-right"),
                    contentStyleClass: "sub-app-content",
                    contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                    contentItems: [
                        this.ApplyingBox(oController)
                    ]
                })
                .setModel(oController.ApplyModel)
                .bindElement("/FormData");
            },

            ApplyingBox: function (oController) {

                var oBankList = new sap.m.ComboBox({ // 은행(변경후)
                    selectedKey: "{Bankl}",
                    width: "100%",
                    change: oController.getBankName.bind(oController),
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    editable: {
                        path: "Status",
                        formatter: function(v) {
                            return !v;
                        }
                    },
                    items: {
                        path: "/BankList",
                        template: new sap.ui.core.ListItem({ key: "{Bankl}", text: "{Banka}" })
                    }
                });
    
                oBankList.addDelegate({
                    onAfterRendering: function () {
                        oBankList.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                    }
                }, oBankList);

                return new sap.m.VBox({
                    items: [
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_75005}", "110px", "Left", true).addStyleClass("sub-con-title"), // 은행(변경후)
                                oBankList
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_75006}", "110px", "Left", true).addStyleClass("sub-con-title"), // 계좌번호(변경후)
                                new sap.m.Input({
                                    width: "100%",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    maxLength: Common.getODataPropertyLength("ZHR_PAY_RESULT_SRV", "BankAccountApplyTab1", "Bankn", false),
                                    editable: {
                                        path: "Status",
                                        formatter: function(v) {
                                            return !v;
                                        }
                                    },
                                    value: "{Bankn}",
                                    liveChange: oController.setAccountNumber.bind(oController)
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_75007}", "110px", "Left").addStyleClass("sub-con-title"), // 은행(변경전)
                                new sap.m.Text({
                                    width: "auto",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    textAlign: "Begin",
                                    text: "{Banka2}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_75008}", "110px", "Left").addStyleClass("sub-con-title"), // 계좌번호(변경전)
                                new sap.m.Text({
                                    width: "auto",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    textAlign: "Begin",
                                    text: "{Bankn2}"
                                })
                            ]
                        }),
                        ViewTemplates.getLabel("header", "{i18n>LABEL_75020}", "auto", "Left").addStyleClass("sub-title mt-20px"), // 신청안내
                        new sap.m.VBox({
                            width: "100%",
                            fitContainer: true,
                            items: [
                                new sap.m.Text({ text: "{i18n>MSG_75001}", textAlign: "Begin"}).addStyleClass("Bold")
                            ]
                        }).addStyleClass("MSGBox font-12px"),
                        new sap.m.HBox({
                            fitContainer: true,
                            items: [
                                fragment.COMMON_ATTACH_FILES.renderer(oController,"001")
                            ]
                        })
                    ]
                }).addStyleClass("vbox-form-mobile");
            }
        });
    }
);
