sap.ui.define(
    [
        "common/Common", //
        "common/PageHelper",
        "../delegate/ViewTemplates"
    ],
    function (Common, PageHelper, ViewTemplates) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "Apply"].join($.app.getDeviceSuffix());

        sap.ui.jsview(SUB_APP_ID, {
            getControllerName: function () {
                return SUB_APP_ID;
            },

            createContent: function (oController) {
                return new PageHelper({
                    idPrefix: "Apply-",
                    // title: "{i18n>LABEL_65001}", // 제증명 신청
                    showNavButton: true,
                    navBackFunc: oController.navBack,
                    headerButton: new sap.m.HBox({
                        items: [
                            new sap.m.Button({
                                press: oController.onDialogApplyBtn.bind(oController),
                                text: "{i18n>LABEL_38044}" // 신청,
                            }).addStyleClass("button-light")
                        ]
                    }).addStyleClass("app-nav-button-right"),
                    contentStyleClass: "sub-app-content",
                    contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                    contentItems: [
                        this.ApplyingBox(oController)
                        // this.oInfoBox(oController)
                    ]
                })
                .setModel(oController.ApplyModel)
                .bindElement("/Data");
            },

            ApplyingBox: function (oController) {
                var oZformType = new sap.m.ComboBox({
                    //구분
                    width: "100%",
                    items: [
                        new sap.ui.core.ListItem({ key: "01", text: "{i18n>LABEL_65013}" }), //
                        new sap.ui.core.ListItem({ key: "02", text: "{i18n>LABEL_65014}" }),
                        new sap.ui.core.ListItem({ key: "03", text: "{i18n>LABEL_65015}" }),
                        new sap.ui.core.ListItem({ key: "04", text: "{i18n>LABEL_65016}" })
                    ],
                    selectedKey: "{ZformType}",
                    editable: {
                        // 재신청일 경우 수정 불가
                        path: "actmode",
                        formatter: function (v) {
                            if (v && v === "X") return false;
                            return true;
                        }
                    },
                    change : oController.onChangeZformType.bind(this)
                });

                // 키보드 입력 방지
                oZformType.addDelegate(
                    {
                        onAfterRendering: function () {
                            oZformType.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oZformType
                );

                var oAptyp = new sap.m.ComboBox({
                    //수령방법
                    width: "100%",
                    items: [
                        // new sap.ui.core.ListItem(oController.PAGEID + "_AptypItem", { key: "1", text: "{i18n>LABEL_65011}" }), //
                        new sap.ui.core.ListItem({ key: "2", text: "{i18n>LABEL_65012}" }),
                        new sap.ui.core.ListItem({ key: "3", text: "{i18n>LABEL_65020}" })
                    ],
                    selectedKey: "{Aptyp}"
                });

                // 키보드 입력 방지
                oAptyp.addDelegate(
                    {
                        onAfterRendering: function () {
                            oAptyp.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oAptyp
                );

                var oZLang = new sap.m.ComboBox({
                    width: "100%",
                    items: [
                        new sap.ui.core.ListItem({ key: "1", text: "{i18n>LABEL_65018}" }), //
                        new sap.ui.core.ListItem({ key: "2", text: "{i18n>LABEL_65019}" })
                    ],
                    selectedKey: "{Zlang}",
                    editable: {
                        // 재신청일 경우 수정 불가
                        path: "actmode",
                        formatter: function (v) {
                            if (v && v === "X") return false;
                            return true;
                        }
                    }
                });

                // 키보드 입력 방지
                oZLang.addDelegate(
                    {
                        onAfterRendering: function () {
                            oZLang.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oZLang
                );

                return new sap.m.VBox({
                    items: [
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_65002}", "105px", "Left", true), // 구분
                                oZformType
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_65003}", "105px", "Left", true), // 언어
                                oZLang
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_65004}", "105px", "Left", true), // 기준년도
                                new sap.m.Input({
                                    width: "50%",
                                    value: "{Zyear}",
                                    textAlign: "Begin",
                                    editable: {
				                        // 재신청일 경우 수정 불가
				                        path: "actmode",
				                        formatter: function (v) {
				                            if (v && v === "X") return false;
				                            return true;
				                        }
				                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_65006}", "105px", "Left", true), // 용도
                                new sap.m.Input({
                                    width: "100%",
                                    value: "{Zuse}",
                                    textAlign: "Begin",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Zuse", false)
                                })
                            ],
                            visible: {
                                // 재신청일 경우 보이지 않음.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return false;
                                    return true;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Text({
                                    width: "100%",
                                    text: "{i18n>MSG_65007}",
                                    textAlign: "Begin"
                                }).addStyleClass("pl-105px lineHeight24 mt--6px")
                            ],
                            visible: {
                                // 재신청일 경우 보이지 않음.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return false;
                                    return true;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_65005}", "105px", "Left", true), // 제출처
                                new sap.m.Input({
                                    width: "100%",
                                    value: "{Zsubmit}",
                                    textAlign: "Begin",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 })
                                })
                            ],
                            visible: {
                                // 재신청일 경우 보이지 않음.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return false;
                                    return true;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            // height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Text({
                                    width: "100%",
                                    text: "{i18n>MSG_65008}",
                                    textAlign: "Begin"
                                }).addStyleClass("pl-105px lineHeight24 mt--6px")
                            ],
                            visible: {
                                // 재신청일 경우 보이지 않음.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return false;
                                    return true;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_65007}", "105px", "Left", true), // 수량
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    width: "50%",
                                    maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Zcount", false),
                                    value: "{Zcount}"
                                })
                            ],
                            visible: {
                                // 재신청일 경우 보이지 않음.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return false;
                                    return true;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_65010}", "105px", "Left"), // 비고
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Zcomment", false),
                                    value: "{Zcomment}"
                                })
                            ],
                            visible: {
                                // 재신청일 경우 보이지 않음.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return false;
                                    return true;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_65017}", "105px", "Left", true), // 수령방법
                                oAptyp
                            ],
                            visible: {
                                // 재신청일 경우 보이지 않음.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return false;
                                    return true;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_65021}", "105px", "Left", true), // 재출력사유
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    width: "100%",
                                    maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Reasn", false),
                                    value: "{Reasn}"
                                })
                            ],
                            visible: {
                                // 재신청일 경우 보임.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return true;
                                    return false;
                                }
                            }
                        }),
                        new sap.m.VBox({
                            alignItems: sap.m.FlexAlignItems.Begin,
                            items: [
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65020}"
                                }).addStyleClass("font-medium mt-16px"),
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65021}"
                                }),
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65022}"
                                }),
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65023}"
                                }),
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65024}"
                                }).addStyleClass("font-medium"),
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65025}"
                                }).addStyleClass("lineHeight24"),
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65026}"
                                }),
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65027}"
                                }).addStyleClass("font-medium"),
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65028}"
                                }).addStyleClass("lineHeight24"),
                                new sap.m.Text({
                                    textAlign: "Begin",
                                    width: "100%",
                                    text: "{i18n>MSG_65029}"
                                }).addStyleClass("lineHeight24")
                            ],
                            visible: {
                                // 재신청일 경우 보이지 않음.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return false;
                                    return true;
                                }
                            }
                        }),
                        new sap.m.Text({
                            width: "100%",
                            text: "{i18n>MSG_65017}",
                            textAlign: "Begin",
                            visible: {
                                // 재신청일 경우 보임.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("px-20px"),
                        new sap.m.Text({
                            width: "100%",
                            text: "{i18n>MSG_65018}",
                            textAlign: "Begin",
                            visible: {
                                // 재신청일 경우 보임.
                                path: "actmode",
                                formatter: function (v) {
                                    if (v && v === "X") return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("px-20px")
                    ]
                }).addStyleClass("vbox-form-mobile");
            }
        });
    }
);
