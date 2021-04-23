﻿/* eslint-disable no-irregular-whitespace */
sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/HoverIcon",
    "../delegate/ViewTemplates",
    "sap/m/InputBase"
], function (Common, PageHelper, HoverIcon, ViewTemplates, InputBase) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Regist"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "Regist-",
                title: "{i18n>LABEL_56011}", // 상세내용
                showNavButton: true,
				navBackFunc: oController.navBack,
                headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
                            press: oController.onDialogReBtn.bind(oController),
                            text: "{i18n>LABEL_56013}", // 수정
                            visible: {
                                parts: [{path: "Sdate"}, {path: "/Gubun"}],
                                formatter: function(v1, v2) {
                                    return Common.checkNull(!v1) && Common.checkNull(v2);
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            press: oController.onDialogRegistBtn.bind(oController),
                            text: "{i18n>LABEL_56005}", // 등록
                            visible: {
                                parts: [{path: "Sdate"}, {path: "/Gubun"}],
                                formatter: function(v1, v2) {
                                    return !v1 || v2 === "X";
                                }
                            }
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            press: oController.onDialogDeleteBtn.bind(oController),
                            text: "{i18n>LABEL_56014}", // 삭제
                            visible: {
                                parts: [{path: "Sdate"}, {path: "/Gubun"}],
                                formatter: function(v1, v2) {
                                    return Common.checkNull(!v1) && Common.checkNull(v2);
                                }
                            }
                        }).addStyleClass("button-light")
					]
				}).addStyleClass("app-nav-button-right"),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.ApplyingBox(oController)
                ]
			})
			.setModel(oController.RegistModel)
			.bindElement("/FormData");
		},
		
		ApplyingBox: function(oController) {
            var oCommentBox = new sap.m.VBox({
                visible: {
                    path: "/HideComment",
                    formatter: function(v) {
                        return v !== "X";
                    }
                },
				fitContainer: true,
				items: [
                    new sap.m.HBox({
						height: "40px",
						justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
						items: [
                            new sap.m.HBox({
								fitContainer: true,
								items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_56015}", "105px", "Left"), // 댓글
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function(oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_56006")); // ※ 알파벳,숫자,특수기호를 포함해 6~10자리로 입력하세요.
                                        },
                                        leave: function(oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    })
                                    .addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue"),
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "105px", "Left", true).addStyleClass("mr-5px"), // 비밀번호
                                    new sap.m.Input({
										width: "150px",
										value: "{Pword}",
										type: sap.m.InputType.Password
									})
                                ]
                            })
						]
					}),
					new sap.m.VBox(oController.PAGEID + "_CommentBox", {
						fitContainer: true,
						items: []
					}),
                    new sap.m.HBox({
						fitContainer: true,
						items: [
							new sap.m.TextArea({
								rows: 3,
								width: "315px",
								value:"{Detail}",
								maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "SuggestionBoxTableIn3", "Detail", false)
							}).addStyleClass("mt-15px mr-8px"),
							new sap.m.Button({
								press: oController.onDialogSaveBtn.bind(oController),
								text: "{i18n>LABEL_56016}" // 저장
							}).addStyleClass("button-light h-101px")
						]
					})
				]
			})
			.setModel(oController.CommentModel)
			.bindElement("/Data");


			return new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_56006}", "105px", "Left", true), // 제목
                            new sap.m.Input({
                                width: "250px",
                                value: "{Title}",
                                maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "SuggestionBoxTableIn2", "Title", false),
                                editable: {
									parts: [{path: "Sdate"}, {path: "/Gubun"}],
									formatter: function(v1, v2) {
										return !v1 || v2 === "X";
									}
								}
                            })
						]
					}),
					new sap.m.VBox(oController.PAGEID + "_RegistDateBox", {
                        fitContainer: true,
						items: [
                            new sap.m.HBox({
                                height: "40px",
                                alignItems: sap.m.FlexAlignItems.Center,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_56003}", "105px", "Left"), // 등록일
                                    new sap.m.Text({
                                        width: "auto",
                                        textAlign: "Begin",
                                        text: {
                                            path: "Sdate",
                                            formatter: function(v) {
                                                return v ? Common.DateFormatter(v) : "";
                                            }
                                        }
                                    })
                                ]
                            }),
                            new sap.m.HBox({
                                height: "40px",
                                alignItems: sap.m.FlexAlignItems.Center,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_56008}", "105px", "Left"), // 최종변경일/시
                                    new sap.m.Text({
                                        width: "250px",
                                        textAlign: "Begin",
                                        text : {
                                            parts: [{path: "Aedtm"}, {path: "Aetim"}],
                                            formatter: function(v1, v2) {
                                                if(v1 && v2){
                                                    v1 = Common.DateFormatter(v1);
                                                    v2 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" }).format(new Date(v2.ms), true);
                                                }
                                                return v1 + " " + v2; 
                                            }
                                        }
                                    })
                                ]
                            })
                        ]
					}),
                    new sap.m.VBox(oController.PAGEID + "_IsHideBox", {
                        fitContainer: true,
                        visible: {
							path: "/Gubun",
							formatter: function(v) {
								return v === "X";
							}
						},
						items: [
                            new sap.m.HBox({
                                height: "40px",
                                alignItems: sap.m.FlexAlignItems.Center,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_56009}", "105px", "Left").addStyleClass("mr-8px"), // 비공개
                                    new sap.m.CheckBox({ 
                                        select: oController.onChangeData.bind(oController),
                                        selected: {
                                            path: "Hide",
                                            formatter: function(v) {
                                                return v === "X";
                                            }
                                        },
                                        editable: {
                                            parts: [{path: "Sdate"}, {path: "/Gubun"}],
                                            formatter: function(v1, v2) {
                                                return !v1 || v2 === "X";
                                            }
                                        }
                                    })
                                ]
                            }),
                            new sap.m.HBox({
                                height: "40px",
                                alignItems: sap.m.FlexAlignItems.Center,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "105px", "Left", true), // 비밀번호
                                    new sap.m.Input({
                                        width: "150px",
                                        value: "{Pword}",
                                        type: sap.m.InputType.Password,
                                        editable: {
                                            parts: [{path: "Sdate"}, {path: "/Gubun"}],
                                            formatter: function(v1, v2) {
                                                return !v1 || v2 === "X";
                                            }	
                                        }
                                    }).addStyleClass("mr-8px"),
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function(oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_56006")); // ※ 알파벳,숫자,특수기호를 포함해 6~10자리로 입력하세요.
                                        },
                                        leave: function(oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    })
                                    .addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue")
                                ]
                            })
                        ]
                    }),
                    new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_56010}", "105px", "Left", true), // 내용
                            new sap.m.TextArea({
                                rows: 10,
								width: "250px",
								value:"{Detail}",
                                maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "SuggestionBoxTableIn2", "Detail", false),
								editable: {
									parts: [{path: "Sdate"}, {path: "/Gubun"}],
									formatter: function(v1, v2) {
										return !v1 || v2 === "X";
									}
								}
							}).addStyleClass("mt-8px mb-8px")
						]
					}),
					new sap.m.HBox({
						items: [
                            sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
					}),
                    oCommentBox
				]
			})
			.addStyleClass("vbox-form-mobile")
			.setModel(oController.RegistModel)
			.bindElement("/FormData");
		}
	});
});