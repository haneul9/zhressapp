sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/PickOnlyDatePicker",
    "../delegate/ViewTemplates",
	"../../common/HoverIcon",
	"sap/m/InputBase"
], function (Common, PageHelper, PickOnlyDatePicker, ViewTemplates, HoverIcon, InputBase) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "RelocationApply"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "RelocationApply-",
                // title: "{i18n>LABEL_34001}", // 부임이전비 신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
                            press: oController.onDialogSaveBtn.bind(oController),
                            text: "{i18n>LABEL_34026}", // 저장
                            visible: {
                                path: "Status",
                                formatter: function (v) {
                                    if (v === "AA") return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            press: oController.onDialogApplyBtn.bind(oController),
                            text: "{i18n>LABEL_34022}", // 신청
                            visible: {
                                path: "Status",
                                formatter: function (v) {
                                    if (!v) return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            press: oController.onDialogDelBtn.bind(oController),
                            text: "{i18n>LABEL_34025}", // 삭제
                            visible: {
                                path: "Status",
                                formatter: function (v) {
                                    if (v === "AA") return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("button-light")
					]
				}).addStyleClass("app-nav-button-right"),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.ApplyingBox(oController),
				]
			})
			.setModel(oController.DetailModel)
			.bindElement("/FormData")
		},
		
		ApplyingBox: function(oController) {

            var oLocationCombo1 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo1", {
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				change: oController.checkLocation1.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/LocationCombo1",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zfwkps}"
			});
			
			// 키보드 입력 방지
			oLocationCombo1.addDelegate({
				onAfterRendering: function () {
					oLocationCombo1.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oLocationCombo1);

            var oLocationCombo2 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo2", {
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				change: oController.checkLocation2.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/LocationCombo2",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Ztwkps}"
			});
			
			// 키보드 입력 방지
			oLocationCombo2.addDelegate({
				onAfterRendering: function () {
					oLocationCombo2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oLocationCombo2);
            
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_34003}", "105px", "Left", true ), // 부임지									
                            oLocationCombo1,
                            new sap.ui.core.Icon({ src: "sap-icon://arrow-right" }).addStyleClass("mx-5px"),
                            oLocationCombo2
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34006}", "105px", "Left", true ), // 발령일자
							new PickOnlyDatePicker(oController.PAGEID + "_AppDate", {
                                width: "100%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                change: oController.getCriteria.bind(oController),
                                dateValue: "{Zactdt}",
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_34004}", "105px", "Left", true ),  // 가족동반 여부
							new sap.m.RadioButtonGroup(oController.PAGEID + "_RadioGroup", {
                                width: "100%",
                                editable: {
                                    path: "Status",
                                    formatter: function(v) {
                                        if (!v || v === "AA") return true;
                                        return false;
                                    }
                                },
                                columns: 2,
                                select : oController.onChangeRadio.bind(oController),
                                selectedIndex: 0,
                                buttons: [
                                    new sap.m.RadioButton({
                                        text: "{i18n>LABEL_34008}", // 단신
                                        width: "auto",
                                        selected: {
                                            path: "Zwtfml",
                                            formatter: function(v) {
                                                if(v === "1") return true;
                                                else return false;
                                            }
                                        }
                                    }),
                                    new sap.m.RadioButton({
                                        text: "{i18n>LABEL_34009}", // 가족동반
                                        width: "auto",
                                        selected: {
                                            path: "Zwtfml",
                                            formatter: function(v) {
                                                if(v === "2") return true;
                                                else return false;
                                            }
                                        }
                                    })
                                ]
                            }),
							new HoverIcon({
								src: "sap-icon://information",
								hover: function(oEvent) {
									Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_34016")); // 부임이전비 신청은 동일한 발령일에 한번 신청이 가능합니다. 가족동반 여부를 신중히 선택하시기 바랍니다.
								},
								leave: function(oEvent) {
									Common.onPressTableHeaderInformation.call(oController, oEvent);
								}
							})
							.addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue")
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34010}", "105px", "Left"), // 6세 이상
							new sap.m.Input(oController.PAGEID + "_PersInput1", {
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								textAlign: "End",
								value: {
									path: "Zolda6",
									formatter: function(v) {
										if(v) return parseInt(v);
										else return "0";
									}
								},
								liveChange: oController.getCostSum1.bind(oController),
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Zolda6", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (v === "AA") return true;
										return false;
									}
								}
							})
							.addStyleClass("mr-3px"),
							new sap.m.Text({ // 명
								text: "{i18n>LABEL_34011}"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						visible: false,
						items: [
							new sap.ui.core.Icon({
								src: "sap-icon://alert",
								color: "#da291c"
							})
							.addStyleClass("mr-5px"),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_34013}", "105px", "Left") // 만 6세 기준
							.addStyleClass("mr-10px"),
							new sap.m.Text({
								text: {
									path: "CriAge",
									formatter: function(v) {
										if(v) return Common.DateFormatter(v);
										else return "";
									}
								}
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_34012}", "105px", "Left"), // 6세 미만
							new sap.m.Input(oController.PAGEID + "_PersInput2", {
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								textAlign: "End",
								value: {
									path: "Zunda6",
									formatter: function(v) {
										if(v) return parseInt(v);
										else return "0";
									}
								},
								liveChange: oController.getCostSum2.bind(oController),
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Zunda6", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (v === "AA") return true;
										return false;
									}
								}
							})
							.addStyleClass("mr-3px"),
							new sap.m.Text({ // 명
								text: "{i18n>LABEL_34011}"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({
								layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
								textAlign: "Left", 
								width: "105px",
								wrapping: true,
								text: {
									path: "/Bukrs",
									formatter: function(v) {
										if(v !== "A100") return oController.getBundleText("LABEL_34027");
										else return oController.getBundleText("LABEL_34014");
									}
								}
							}),
							new sap.m.Input({
								textAlign: "Begin",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Ztexme", false),
								liveChange: oController.InputTransCost2.bind(oController),
								visible: {
									path: "/Bukrs",
									formatter: function(v) {
										return v === "A100"
									}
								},
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "Ztexme",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
                                        else return 0;
									}
								}
							}),
							new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								visible: {
									path: "/Bukrs",
									formatter: function(v) {
										return v !== "A100"
									}
								},
                                text: {
									parts: [
										{path: "Ztexme"},
										{path: "Ztexo6"},
										{path: "Ztexu6"}
									],
									formatter: function(v1, v2, v3) {
										v1 = Common.checkNull(v1) ? "0" : Common.numberWithCommas(v1),
										v2 = Common.checkNull(v2) ? "0" : Common.numberWithCommas(v2),
										v3 = Common.checkNull(v3) ? "0" : Common.numberWithCommas(v3);

										return v1 + " / " + v2 + " / " + v3;
									}
								}
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34028}", "105px", "Left"), // 일비
							new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                text: {
									parts: [
										{path: "Zdexme"},
										{path: "Zdexo6"},
										{path: "Zdexu6"}
									],
									formatter: function(v1, v2, v3) {
										v1 = Common.checkNull(v1) ? "0" : Common.numberWithCommas(v1),
										v2 = Common.checkNull(v2) ? "0" : Common.numberWithCommas(v2),
										v3 = Common.checkNull(v3) ? "0" : Common.numberWithCommas(v3);

										return v1 + " / " + v2 + " / " + v3;
									}
								}
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34016}", "105px", "Left"), // 이전 준비금
							new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                text: {
									path: "Ztsrsv",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
                                        else return 0;
									}
								}
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34017}", "105px", "Left"), // 가재 운송비
							new sap.m.Input(oController.PAGEID + "_CostInput", {
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                value: {
                                    path: "Zmvcst",
                                    formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
                                        else return 0;
									}
                                },
                                maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Zmvcst", false),
                                liveChange: oController.InputTransCost.bind(oController),
                                textAlign: "Begin",
                                editable: {
                                    path: "Status",
                                    formatter: function(v) {
                                        if(!v || v === "AA") return true;
                                        else return false; 
                                    }
                                }
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34018}", "105px", "Left"), // 합계
							new sap.m.Text({
								text: {
									path: "Ztstot",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
                                        else return 0;
									}
								}
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34020}", "105px", "Left"), // 인사발령
							new sap.m.Input({
								textAlign: "Begin",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Zactnm", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: "{Zactnm}"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34021}", "105px", "Left"), // 비고
							new sap.m.Input({
								textAlign: "Begin",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Remark", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: "{Remark}"
							})
						]
					}),
                    new sap.m.HBox({
                        items: [
                            new sap.m.MessageStrip({
                                text: "{i18n>MSG_34001}", // 가족동반 부임: 주민등록 등본 첨부
                                customIcon: "sap-icon://information",										
                                showIcon: true,
                                type: sap.ui.core.MessageType.Information
                            }).addStyleClass("ml-0px")
                        ]
                    }).addStyleClass("info-field-group message-strip mb-3px mt-20px"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.MessageStrip({
                                text: "{i18n>MSG_34014}", // 가재 운송비: 주민등록 등본(실제 주소 이전 확인 용도), 거래명세서 혹은 견적서, 카드 혹은 현금영수증 증빙
                                customIcon: "sap-icon://information",
                                showIcon: true,
                                type: sap.ui.core.MessageType.Information
                            }).addStyleClass("ml-0px")
                        ]
                    }).addStyleClass("info-field-group message-strip"),
					new sap.m.HBox({
                        items: [
							sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
                        ]
                    })
				]
			})
			.addStyleClass("vbox-form-mobile");
		}
	});
});