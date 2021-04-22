sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/PickOnlyDateRangeSelection",
    "../../common/PickOnlyDatePicker",
    "../delegate/ViewTemplates"
], function (Common, PageHelper, PickOnlyDateRangeSelection, PickOnlyDatePicker, ViewTemplates) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "LeaveReinApp"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "LeaveReinApp-",
                title: "{i18n>LABEL_42002}", // 휴/복직 신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
                            press: oController.onDialogSaveBtn.bind(oController),
                            text: "{i18n>LABEL_42031}", // 저장,
                            visible: {
                                path: "Status1",
                                formatter: function (v) {
                                    return !v || v === "AA";
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            press: oController.onDialogApplyBtn.bind(oController),
                            text: "{i18n>LABEL_42030}", // 신청,
                            visible: {
                                path: "Status1",
                                formatter: function (v) {
                                    return !v || v === "AA";
                                }
                            }
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            press: oController.onDialogDelBtn.bind(oController),
                            text: "{i18n>LABEL_42032}", // 삭제
                            visible: {
                                path: "Status1",
                                formatter: function (v) {
                                    return v === "AA";
                                }
                            }
                        }).addStyleClass("button-light")
					]
				}).addStyleClass("app-nav-button-right"),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.ApplyingBox(oController)				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData");
		},
		
		ApplyingBox: function(oController) {
            var vBukrs = oController.getUserGubun();

            var oTypeCombo = new sap.m.ComboBox({ // 휴/복직 구분
				width: "220px",
				change: oController.changeType.bind(oController),
				editable: {
					path: "Status1",
					formatter: function(v) {
						return !v;
					}
				},
				items: {
					path: "/TypeCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Massn}"
			});
			
			// 키보드 입력 방지
			oTypeCombo.addDelegate({
				onAfterRendering: function () {
					oTypeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oTypeCombo);

            var oUsedTypeCombo = new sap.m.ComboBox(oController.PAGEID + "_UsedTypeCombo", { // 휴/복직 사유
				width: "220px",
                change: oController.changeUsedType.bind(oController),
				editable: {
					path: "Status1",
					formatter: function(v) {
						return v === "AA";
					}
				},
				items: {
					path: "/UsedTypeCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Massg}"
			});
			
			// 키보드 입력 방지
			oUsedTypeCombo.addDelegate({
				onAfterRendering: function () {
					oUsedTypeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oUsedTypeCombo);

            var oRelationCombo = new sap.m.ComboBox({ // 관계
				width: "220px",
				editable: {
					path: "Status1",
					formatter: function(v) {
						return !v || v === "AA";
					}
				},
				items: {
					path: "/RelationCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Kdsvh}"
			});
			
			// 키보드 입력 방지
			oRelationCombo.addDelegate({
				onAfterRendering: function () {
					oRelationCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oRelationCombo);

            var oPartnerCheckCombo = new sap.m.ComboBox(oController.PAGEID + "_PartnerCheckCombo", { // 배우자 신청여부
				width: "220px",
				editable: {
					path: "Status1",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/PartnerCheckCombo",
					template: new sap.ui.core.ListItem({
						key: "{Text}",
						text: "{Text}"
					})
				},
				selectedKey: "{Zspsap}"
			});
			
			// 키보드 입력 방지
			oPartnerCheckCombo.addDelegate({
				onAfterRendering: function () {
					oPartnerCheckCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oPartnerCheckCombo);

            var oSickInfoBox = new sap.m.VBox(oController.PAGEID + "_SickInfoBox", { // 질병정보
				fitContainer: true,
				items: [
                    // 질병정보                                
                    new sap.m.Label({text: "{i18n>LABEL_42026}"}).addStyleClass("sub-title"),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42027}", "105px", "Left", true).addStyleClass("sub-con-title"), // 질병 명
                            new sap.m.Input({
								textAlign: "Begin",
								width: "250px",
								maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zdsase", false),
                                value: "{Zdsase}",
								editable: {
									path: "Status1",
									formatter: function(v) {
										return !v || v === "AA";
									}
								}
						 	})
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42028}", "105px", "Left", true).addStyleClass("sub-con-title"), // 의사 소견 (요약)
                            new sap.m.Input({
								textAlign: "Begin",
								width: "250px",
								maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zdtopn", false),
                                value: "{Zdtopn}",
								editable: {
									path: "Status1",
									formatter: function(v) {
										return !v || v === "AA";
									}
								}
						 	})
                        ]
                    }).addStyleClass("mb-5px")
                ]
            });

            var FamilyInfoBox = new sap.m.VBox(oController.PAGEID + "_FamilyInfoBox", {
				items: [
                    new sap.m.Label({ text: "{i18n>LABEL_42019}" }).addStyleClass("sub-title"), // 가족정보 
                    new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42020}", "105px", "Left", true).addStyleClass("sub-con-title"), // 성명
                            new sap.m.Input({
                                textAlign: "Begin",
                                width: "250px",
                                maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zfmlnm", false),
                                value: "{Zfmlnm}",
                                editable: {
                                    path: "Status1",
                                    formatter: function(v) {
                                        return !v || v === "AA";
                                    }
                                }
                            })
						]
					}),
                    new sap.m.HBox({
                        height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42021}", "105px", "Left", true).addStyleClass("sub-con-title"), // 생년월일
                            new PickOnlyDatePicker({
                                width: "220px",
                                dateValue: "{Zfgbdt}",
                                displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                valueFormat: "yyyy-MM-dd",
                                placeholder: "yyyy-mm-dd",
                                editable: {
                                    path: "Status1",
                                    formatter: function(v) {
                                        return !v || v === "AA";
                                    }
                                }
                            })
						]
					}),
                    new sap.m.VBox(oController.PAGEID + "_MidBox", {
                        items: [
                            new sap.m.HBox({
                                height: "40px",
                                alignItems: sap.m.FlexAlignItems.Center,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_42022}", "105px", "Left", true).addStyleClass("sub-con-title"), // 초등학교 명
                                    new sap.m.Input({
                                        textAlign: "Begin",
                                        width: "250px",
                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zelmnm", false),
                                        value: "{Zelmnm}",
                                        editable: {
                                            path: "Status1",
                                            formatter: function(v) {
                                                return !v || v === "AA";
                                            }
                                        }
                                    })
                                ]
                            }),
                            new sap.m.HBox({
                                height: "40px",
                                alignItems: sap.m.FlexAlignItems.Center,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_42023}", "105px", "Left", true).addStyleClass("sub-con-title"), // 입학일
                                    new PickOnlyDatePicker({
                                        width: "220px",
                                        dateValue: "{Zentdt}",
                                        displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                        valueFormat: "yyyy-MM-dd",
                                        placeholder: "yyyy-mm-dd",
                                        editable: {
                                            path: "Status1",
                                            formatter: function(v) {
                                                return !v || v === "AA";
                                            }
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                    .addStyleClass("mt-5px"),
                    new sap.m.VBox(oController.PAGEID + "_BotBox", {
						items: [
                            new sap.m.HBox(oController.PAGEID + "_RelationCombo", {
                                height: "40px",
                                alignItems: sap.m.FlexAlignItems.Center,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_42024}", "105px", "Left", true).addStyleClass("sub-con-title"), // 관계
                                    oRelationCombo
                                ]
                            }),
                            new sap.m.HBox(oController.PAGEID + "_Partner", {
                                height: "40px",
                                alignItems: sap.m.FlexAlignItems.Center,
                                items: [
                                    new sap.m.Label({ // 배우자 육아휴직 신청여부
                                        text: "{i18n>LABEL_42025}",
                                        width: "105px",
                                        textAlign: "Left",
                                        required: true,
                                        wrapping: true
                                    }),
                                    oPartnerCheckCombo
                                ]
                            })
                        ]
                    })
                    .addStyleClass("mt-5px")
                ]
            });
            
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42004}", "105px", "Left").addStyleClass("sub-con-title"), // 신청일
                            new sap.m.Text({
								width: "200px",
								text: {
									path: "Begda",
									formatter: function(v) {
										if(v) return Common.DateFormatter(v);
										else return Common.DateFormatter(new Date());	
									}
								},
                                textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_42013}", "105px", "Left", true).addStyleClass("sub-con-title"), // 휴/복직 구분
							oTypeCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_42014}", "105px", "Left", true).addStyleClass("sub-con-title"), // 휴/복직 사유
							oUsedTypeCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_42007}", "105px", "Left", true).addStyleClass("sub-con-title"), // 휴직기간
							new PickOnlyDateRangeSelection(oController.PAGEID + "_LeaveDate", {
								width: "250px",
								displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                change: oController.getReinTerm.bind(oController),
                                placeholder: "yyyy-mm-dd ~ yyyy-mm-dd",
                                editable: {
                                    path: "Status1",
                                    formatter: function(v) {
                                        return v === "AA";
                                    }
                                },
                                delimiter: "~",
                                dateValue: "{Zlowbd}",
                                secondDateValue: "{Zlowed}"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42008}", "105px", "Left", true).addStyleClass("sub-con-title"), // 복직예정일
							new PickOnlyDatePicker(oController.PAGEID + "_ReinDate", {
                                width: "220px",
                                dateValue: "{Zrhsdt}",
                                change: oController.getLeaveTerm.bind(oController),
                                displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                valueFormat: "yyyy-MM-dd",
                                placeholder: "yyyy-mm-dd",
                                editable: {
                                    path: "Status1",
                                    formatter: function(v) {
                                        return !v || v === "AA";
                                    }
                                }
                            })
						]
					}),
					new sap.m.HBox({
						height: "auto",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42016}", "105px", "Left", true).addStyleClass("sub-con-title"), // 세부사유
							new sap.m.TextArea({
                                rows: 3,
								width: "250px",
								value:"{Zdtlrs}",
								maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zdtlrs", false),
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								editable: {
									path: "Status1",
									formatter: function(v) {
										return !v || v === "AA";
									}
								}
							})
						]
					}).addStyleClass("mb-5px"),
					new sap.m.HBox(oController.PAGEID + "_BabyDateBox", {
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_42018}", "105px", "Left", true).addStyleClass("sub-con-title"), // 출산예정일
							new PickOnlyDatePicker({
                                width: "220px",
                                dateValue: "{Zexbdt}",
                                displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                valueFormat: "yyyy-MM-dd",
                                placeholder: "yyyy-mm-dd",
                                editable: {
                                    path: "Status1",
                                    formatter: function(v) {
                                        return !v || v === "AA";
                                    }
                                }
                            })
						]
					}),
                    FamilyInfoBox,
                    oSickInfoBox,
                    new sap.m.HBox({
                        height: "auto",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42029}", "105px", "Left"), // 결재선 안내
                            new sap.m.VBox({
                                fitContainer: true,
                                items: [
                                    new sap.m.Text({
                                        width: "auto",
                                        text: {
                                            path: vBukrs,
                                            formatter: function() {
                                                if(vBukrs !== "A100"){
                                                    return oController.getBundleText("MSG_42007");
                                                }else {
                                                    return oController.getBundleText("MSG_42009");
                                                }
                                            }
                                        },
                                        textAlign: "Begin"
                                    }).addStyleClass("line-height-24"),
                                    new sap.m.Text({
                                        width: "auto",
                                        text: {
                                            path: vBukrs,
                                            formatter: function() {
                                                if(vBukrs !== "A100"){
                                                    return oController.getBundleText("MSG_42008");
                                                }else {
                                                    return oController.getBundleText("MSG_42010");
                                                }
                                            }
                                        },
                                        textAlign: "Begin"
                                    }).addStyleClass("line-height-24")
                                ]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "auto",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42017}", "105px", "Left"), // 증빙서류 안내
                            new sap.m.Text({
                                width: "auto",
                                text: "{/InfoText}",
                                textAlign: "Begin"
                            }).addStyleClass("line-height-24")
                        ]
                    }),
                    sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
                ]
			})
			.addStyleClass("vbox-form-mobile");
		}
	});
});  