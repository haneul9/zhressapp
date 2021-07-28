/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/PageHelper",
        "../delegate/ViewTemplates",
        "common/PickOnlyDateRangeSelection"
    ],
    function (PageHelper, ViewTemplates, PickOnlyDateRangeSelection) {
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
                            // N = 숙박비 지원 신규신청 else 숙박비 지원 조회
                            return !v || v === "AA" ? oController.getBundleText("LABEL_74031") : oController.getBundleText("LABEL_74032") ;
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

                return new sap.m.VBox({
                    items: [
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_74014}", "105px", "Left", true).addStyleClass("sub-con-title"), // 숙박기간
                                new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
                                    width: "100%",
                                    editable: {
                                        path: "Status",
                                        formatter: function(v) {
                                            return !v;
                                        }
                                    },
                                    change: oController.setPicker.bind(oController),
                                    displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                    delimiter: "~",
                                    dateValue: "{Begda}",  
                                    secondDateValue: "{Endda}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            justifyContent: sap.m.FlexJustifyContent.End,
                            alignItems: sap.m.FlexAlignItems.Center,
                            visible: {
                                path: "Status",
                                formatter: function(v) {
                                    return !v;
                                }
                            },
                            items: [
                                new sap.m.Button({
                                    text : "{i18n>LABEL_74025}", // 계산
                                    press : oController.onDateRange.bind(oController)
                                }).addStyleClass("button-light-sm")
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_74024}", "105px", "Left").addStyleClass("sub-con-title"), // 연차
                                new sap.m.Text(oController.PAGEID + "_VacText", {
                                    width: "auto",
                                    textAlign: "Begin",
                                    text: "{Vacprd}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_74026}", "105px", "Left").addStyleClass("sub-con-title"), // 힐링휴가
                                new sap.m.Text(oController.PAGEID + "_HelText", {
                                    width: "auto",
                                    textAlign: "Begin",
                                    text: {
                                        path: "Healdup",
                                        formatter: function(v) {
                                            if(v === undefined || v === null) return "";
    
                                            if(v === "X")
                                                return oController.getBundleText("LABEL_74037");
                                            else
                                                return oController.getBundleText("LABEL_74038");
                                        }
                                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_74027}", "105px", "Left").addStyleClass("sub-con-title"), // 콘도사용
                                new sap.m.Text({
                                    width: "auto",
                                    textAlign: "Begin",
                                    text: "{Restxt}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_74028}", "105px", "Left").addStyleClass("sub-con-title"), // 숙박일수
                                new sap.m.Text({
                                    width: "auto",
                                    textAlign: "Begin",
                                    text: "{Ngtcnt}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_74029}", "105px", "Left").addStyleClass("sub-con-title"), // 잔여한도
                                new sap.m.Text(oController.PAGEID + "_AvaText", {
                                    width: "auto",
                                    textAlign: "Begin",
                                    text: "{Avacnt}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            visible: {
                                path: "Status",
                                formatter: function(v) {
                                    return !v;
                                }
                            },
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_74035}", "105px", "Left").addStyleClass("sub-con-title"), // 지원일수
                                new sap.m.Text({
                                    width: "auto",
                                    textAlign: "Begin",
                                    text: "{Supcnt}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_74030}", "105px", "Left").addStyleClass("sub-con-title"), // 지원금액
                                new sap.m.Text({
                                    width: "auto",
                                    textAlign: "Begin",
                                    text: "{Supamttx}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            visible: {
                                path: "Status",
                                formatter: function(v) {
                                    return v === "00";
                                }
                            },
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_74036}", "105px", "Left").addStyleClass("sub-con-title"), // 진행상태
                                new sap.m.Text({
                                    width: "auto",
                                    textAlign: "Begin",
                                    text: "{Statust}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            fitContainer: true,
                            items: [
                                fragment.COMMON_ATTACH_FILES.renderer(oController, "001")
                            ]
                        }),
                        new sap.m.VBox({
                            width: "100%",
                            fitContainer: true,
                            items: [
                                new sap.m.Text({ text: "{i18n>MSG_74001}", textAlign: "Begin"}).addStyleClass("Bold"),
                                new sap.m.Text({ text: "{i18n>MSG_74002}", textAlign: "Begin"}).addStyleClass("Bold"),
                                new sap.m.Text({ text: "{i18n>MSG_74003}", textAlign: "Begin"}).addStyleClass("ml-10px"),
                                new sap.m.Text({ text: "{i18n>MSG_74004}", textAlign: "Begin"}).addStyleClass("info-text-red Bold")
                            ]
                        }).addStyleClass("MSGBox mt-20px font-12px")
                    ]
                }).addStyleClass("vbox-form-mobile");
            }
        });
    }
);
