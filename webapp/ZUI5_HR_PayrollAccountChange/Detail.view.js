/* eslint-disable no-undef */
$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
    "./delegate/ViewTemplates",
    "../common/PageHelper",
    "../common/TMEmpBasicInfoBox"
], function ( ViewTemplates, PageHelper, TMEmpBasicInfoBox) {
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

            var oBankList = new sap.m.ComboBox({ // 은행(변경후)
                selectedKey: "{Bankl}",
                width: "250px",
                change: oController.getBankName.bind(oController),
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
                                        // 급여계좌변경 신규신청 else 급여계좌변경 조회
                                        return !v || v === "AA" ? oController.getBundleText("LABEL_75018") : oController.getBundleText("LABEL_75019") ;
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
                                    new TMEmpBasicInfoBox(oController.SearchModel).addStyleClass("ml-10px mt-15px")
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
                            ViewTemplates.getLabel("header", "{i18n>LABEL_75020}", "auto", "Left").addStyleClass("sub-title"), // 신청안내
                            new sap.m.VBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    new sap.m.Text({ text: "{i18n>MSG_75001}", textAlign: "Begin"}).addStyleClass("Bold")
                                ]
                            }).addStyleClass("MSGBox")
                        ]
                    }).addStyleClass("mt-20px"),
                    new sap.m.VBox({
                        width: "100%",
                        fitContainer: true,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_75021}", "auto","Left").addStyleClass("sub-title"), // 신청내용
                            new sap.m.HBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_75005}", "130px", "Right", true), // 은행(변경후)
                                    oBankList
                                ]
                            })
                            .addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("mt-20px"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_75006}", "130px", "Right", true), // 계좌번호(변경후)
							new sap.m.Input({
								width: "250px",
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
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_75007}", "130px", "Right"), // 은행(변경전)
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Banka2}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_75008}", "130px", "Right"), // 계좌번호(변경전)
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Bankn2}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						fitContainer: true,
						items: [
                            fragment.COMMON_ATTACH_FILES.renderer(oController,"001")
						]
					})
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox mt-16px BtNone");
		}
	});
});
