/* eslint-disable no-undef */
sap.ui.define([
    "./delegate/ViewTemplates",
    "../common/PageHelper",
    "../common/TMEmpBasicInfoBox",
    "../common/PickOnlyDateRangeSelection"
], function ( ViewTemplates, PageHelper, TMEmpBasicInfoBox,PickOnlyDateRangeSelection) {
	"use strict";

    var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {

            return new PageHelper({
				idPrefix: "Detail-",
                showHeader : false,
				hideEmpInfoBox: true,
                showNavButton: false,
				contentStyleClass: "app-content",
                contentContainerStyleClass: "app-content-container-wide custom-title-left",
				contentItems: [
					this.ApplyingBox(oController)
				]
			});
		},

        ApplyingBox: function(oController) {
            
			return new sap.m.VBox({
                width: "100%",
				fitContainer: true,
				items: [
                    new sap.m.HBox({
                        width : "100%",
                        justifyContent: sap.m.FlexJustifyContent.Start,
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Button({
                                icon : "sap-icon://nav-back",
                                type : "Default",
                                press : oController.navBack
                            }),
                            new sap.m.Label({
                                text : {
                                    path: "Status",
                                    formatter: function(v) {
                                        // N = 숙박비 지원 신규신청 else 숙박비 지원 조회
                                        return !v || v === "AA" ? oController.getBundleText("LABEL_74031") : oController.getBundleText("LABEL_74032") ;
                                    }
                                }
                            }).addStyleClass("app-title ml-10px")
                        ]
                    }),
					new sap.m.HBox({
                        width : "100%",
                        justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                        alignItems: sap.m.FlexAlignItems.End,
                        items: [
                            new sap.m.HBox({
                                width : "100%",
                                items: [
                                    new TMEmpBasicInfoBox($.app.getController().SearchModel).addStyleClass("ml-10px mt-15px")
                                ]
                            }),
                            new sap.m.HBox({
                                justifyContent: sap.m.FlexJustifyContent.End,
                                alignItems: sap.m.FlexAlignItems.End,
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
                                    }).addStyleClass("button-delete ml-0")
                                ]
                            }).addStyleClass("button-group pt-53px")
                        ]
                    }),
                    new sap.m.VBox({
                        width: "100%",
                        fitContainer: true,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_74021}", "auto", "Left").addStyleClass("sub-title"), // 신청안내
                            new sap.m.VBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    new sap.m.Text({ text: "{i18n>MSG_74001}", textAlign: "Begin"}).addStyleClass("Bold"),
                                    new sap.m.Text({ text: "{i18n>MSG_74002}", textAlign: "Begin"}).addStyleClass("Bold"),
                                    new sap.m.Text({ text: "{i18n>MSG_74003}", textAlign: "Begin"}).addStyleClass("ml-10px"),
                                    new sap.m.Text({ text: "{i18n>MSG_74004}", textAlign: "Begin"}).addStyleClass("info-text-red Bold")
                                ]
                            }).addStyleClass("MSGBox")
                        ]
                    }).addStyleClass("mt-20px"),
                    new sap.m.VBox({
                        width: "100%",
                        fitContainer: true,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_74023}", "auto","Left").addStyleClass("sub-title"), // 신청내용
                            new sap.m.HBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_74014}", "130px", "Right", true), // 숙박기간
                                    new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
                                        width: "250px",
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
                                    }),
                                    new sap.m.Button({
                                        text : "{i18n>LABEL_74025}", // 계산
                                        visible: {
                                            path: "Status",
                                            formatter: function(v) {
                                                return !v;
                                            }
                                        },
                                        press : oController.onDateRange.bind(oController)
                                    }).addStyleClass("resultBtn button-default ml-10px")
                                ]
                            })
                            .addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("mt-20px"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_74024}", "130px", "Right"), // 연차
							new sap.m.Text(oController.PAGEID + "_VacText", {
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Vacprd}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_74026}", "130px", "Right"), // 힐링휴가
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
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_74027}", "130px", "Right"), // 콘도사용
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Resttxt}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_74028}", "130px", "Right"), // 숙박일수
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Ngtcnt}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_74029}", "130px", "Right"), // 잔여한도
							new sap.m.Text(oController.PAGEID + "_AvaText", {
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Avacnt}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_74035}", "130px", "Right"), // 지원일수
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Supcnt}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_74030}", "130px", "Right"), // 지원금액
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Supamttx}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
                        visible: {
                            path: "Status",
                            formatter: function(v) {
                                return v === "00";
                            }
                        },
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_74036}", "130px", "Right"), // 진행상태
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Statust}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						fitContainer: true,
						items: [
                            fragment.COMMON_ATTACH_FILES.renderer(oController, "001")
						]
					})
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox mt-16px pb-50px BtNone");
		}
	});
});
