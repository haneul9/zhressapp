sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/PickOnlyDateRangeSelection",
    "../../common/PickOnlyDatePicker",
    "../delegate/ViewTemplates"
], function (Common, PageHelper, PickOnlyDateRangeSelection, PickOnlyDatePicker, ViewTemplates) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "LanguageApply"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "LanguageApply-",
                title: "{i18n>LABEL_29001}", // 어학비 신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button(oController.PAGEID + "_SaveBtn", {
                            press: oController.onPressSave.bind(oController),
							text: "{i18n>LABEL_29026}", // 저장
							visible: {
                                path: "Status",
								formatter: function(v) {
                                    if(v === "AA") return true;
									else return false; 
								}
							}
						}).addStyleClass("button-light"),
                        new sap.m.Button(oController.PAGEID + "_RequestBtn", {
                            press: oController.onPressReq.bind(oController),
                            text: "{i18n>LABEL_29044}", // 신청
                            visible: {
                                path: "Status",
                                formatter: function(v) {
                                    if(!v) return true;
                                    else return false; 
                                }
                            }
                        }).addStyleClass("button-dark"),
						new sap.m.Button(oController.PAGEID + "_DeleteBtn", {
							press: oController.onPressDelete.bind(oController),
							text: "{i18n>LABEL_29027}", // 삭제
							visible: {
								path: "Status",
								formatter: function(v) {
									if(v === "AA") return true;
									else return false; 
								}
							}
						}).addStyleClass("button-light")
					]
				}).addStyleClass("app-nav-button-right"),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.ApplyingBox(oController),
					this.fileUpload(oController)
				]
			})
			.setModel(oController.DetailModel)
			.bindElement("/FormData")
		},
		
		ApplyingBox: function(oController) {

            var oCostCombo = new sap.m.ComboBox(oController.PAGEID + "_CostCombo", { // 원가코드
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/CostCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Kostl}"
			});
			
			// 키보드 입력 방지
			oCostCombo.addDelegate({
				onAfterRendering: function () {
					oCostCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oCostCombo);

            var oWBSCombo = new sap.m.ComboBox(oController.PAGEID + "_WBSCombo", { // WBS
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/WBSCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Plstx}"
			});
			
			// 키보드 입력 방지
			oWBSCombo.addDelegate({
				onAfterRendering: function () {
					oWBSCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oWBSCombo);

			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_29016}", "105px", "Left", true), // 원가코드
							oCostCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29022}", "105px", "Left"), // WBS
							oWBSCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29003}", "105px", "Left", true), // 수강기간
							new PickOnlyDateRangeSelection(oController.PAGEID + "_PeriodDate", {
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								delimiter: "~",
								dateValue: "{Lecbe}",
								secondDateValue: "{Lecen}",
                                displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
								change: oController.getSupPeriod.bind(oController),
                                editable: {
                                    path: "Status",
                                    formatter: function(v) {
                                        if (!v || v === "AA") return true;
                                        return false;
                                    }
                                }
							}),
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
						ViewTemplates.getLabel("header", "{i18n>LABEL_29009}", "105px", "Left", true), // 영수일자
							new PickOnlyDatePicker({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                dateValue: "{Caldt}",
                                displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                valueFormat: "yyyy-MM-dd",
                                placeholder: "yyyy-mm-dd",
                                editable: {
                                    path: "Status",
                                    formatter: function(v) {
                                        if (!v || v === "AA") return true;
                                        return false;
                                    }
                                }
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29008}", "105px", "Left", true), // 외국어
							new sap.m.Input({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								textAlign: "Begin",
								value: "{ZlanguTxt}",
								editable: false
							}),
							new sap.m.Button({
								press: oController.onGradeVal.bind(oController),
								text: "{i18n>LABEL_29023}", // 어학성적
								enabled: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								}
							}).addStyleClass("button-light-sm ml-10px")
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29047}", "105px", "Left", true), // 시험명
							new sap.m.Input({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								textAlign: "Begin",
								value: "{ZltypeTxt}",
								editable: false
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29031}", "105px", "Left", true), // 어학성적
                            new sap.m.Input(oController.PAGEID + "_RankInput", {
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                textAlign: "End",
                                value: "{Acqpot}",
                                editable: false
                            }).addStyleClass("mr-3px"),
                            new sap.m.Text({ text: "{i18n>LABEL_29029}" }).addStyleClass("mr-7px"),
							new sap.m.Input({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								textAlign: "Begin",
								value: "{AcqgrdT}",
								editable: false
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29010}", "105px", "Left", true), // 수강학원
							new sap.m.Input({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                value: "{Zlaorg}",
                                maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "LanguPayApplyTableIn", "Zlaorg", false),
                                editable: {
                                    path: "Status",
                                    formatter: function(v) {
                                        if (!v || v === "AA") return true;
                                        return false;
                                    }
                                }
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29024}", "105px", "Left", true), // 수강금액
							new sap.m.Input({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                textAlign: "Begin",
                                liveChange: oController.getSuportPrice.bind(oController),
                                maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "LanguPayApplyTableIn", "Lecbet", false),
                                value: {
                                    path: "Lecbet",
                                    formatter: function(v) {
                                        if(v) return Common.numberWithCommas(v);
                                        else return 0;
                                    }
                                },
                                editable: {
                                    path: "Status",
                                    formatter: function(v) {
                                        if (!v || v === "AA") return true;
                                        return false;
                                    }
                                }
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29018}", "105px", "Left", true), // 학원 전화번호
							new sap.m.Input({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                value: "{Latell}",
                                maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "LanguPayApplyTableIn", "Latell", false),
                                editable: {
                                    path: "Status",
                                    formatter: function(v) {
                                        if (!v || v === "AA") return true;
                                        return false;
                                    }
                                }
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29011}", "105px", "Left", true), // 수강중인 어종
							new sap.m.Input({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								textAlign: "Begin",
								value: "{Zlangu2Txt}",
								editable: false
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29019}", "105px", "Left"), // 지원금액
							new sap.m.Input({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                textAlign: "Begin",
                                value: {
                                    path: "Suport",
                                    formatter: function(v) {
                                        if(v) return common.Common.numberWithCommas(v);
                                        else return "0";
                                    }
                                },
                                editable: false
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_29025}", "105px", "Left"), // 지원기간
							new sap.m.Input({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                value: {
                                    parts: [
                                        { path: "Supbg" }, 
                                        { path: "Supen" }
                                    ],
                                    formatter: function(v1, v2) {
                                        if(v1){
                                            v1 = new Date(v1);
                                            v2 = new Date(v2);
                                            return [Common.DateFormatter(v1, "yyyy-MM-dd"), Common.DateFormatter(v2, "yyyy-MM-dd")].join(" ~ ");
                                        }
                                        else{
                                            return "";
                                        }
                                    }
                                },
                                editable: false
                            })
						]
					})
				]
			})
			.addStyleClass("vbox-form-mobile");
		},
		
		fileUpload: function(oController) {
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						items: [
							new sap.ui.core.Icon({
								src: "sap-icon://information"
							})
							.addStyleClass("color-icon-blue mr-5px pt-5px"),
							new sap.m.Text({ text: "{i18n>MSG_29020}", textAlign: "Begin" })
						]
					}),
					fragment.COMMON_ATTACH_FILES.renderer(oController,"001"),
					fragment.COMMON_ATTACH_FILES.renderer(oController,"002")
				]
			})
		}
	});
});