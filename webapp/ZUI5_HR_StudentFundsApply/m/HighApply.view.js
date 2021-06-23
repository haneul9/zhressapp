sap.ui.define([
	"common/Common",
	"common/PageHelper",
	"../delegate/ViewTemplates",
	"fragment/COMMON_ATTACH_FILES"
], function (Common, PageHelper, ViewTemplates, FileHandler) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "HighApply"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "HighApply-",
                // title: "{i18n>LABEL_38001}", // 학자금 신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
                            press: oController.onHighDialogSaveBtn.bind(oController),
                            text: "{i18n>LABEL_38048}", // 저장,
                            visible: {
                                path: "Status",
                                formatter: function (v) {
                                    if (v === "AA") return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            press: oController.onHighDialogApplyBtn.bind(oController),
                            text: "{i18n>LABEL_38044}", // 신청,
                            visible: {
                                path: "Status",
                                formatter: function (v) {
                                    if (!v) return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            press: oController.onHighDialogDelBtn.bind(oController),
                            text: "{i18n>LABEL_38047}", // 삭제
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
					this.ApplyingBox(oController)
				]
			})
			.setModel(oController.HighApplyModel)
			.bindElement("/FormData");
		},
		
		ApplyingBox: function(oController) {

            var oSchoolCombo = new sap.m.ComboBox({ // 학교구분
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
                change: oController.getSupportList.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/SchoolCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{SchoolType}"
			});
			
			// 키보드 입력 방지
			oSchoolCombo.addDelegate({
				onAfterRendering: function () {
					oSchoolCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oSchoolCombo);

            var oSupportCombo = new sap.m.ComboBox({ // 지원유형
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
                change: oController.onChangeSupport.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/SupportCombo",
					template: new sap.ui.core.ListItem({
						key: "{Schsb}",
						text: "{SchsbT}"
					})
				},
				selectedKey: "{SGubun}"
			});
			
			// 키보드 입력 방지
			oSupportCombo.addDelegate({
				onAfterRendering: function () {
					oSupportCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oSupportCombo);

            var oGradeCombo = new sap.m.ComboBox({ // 학년
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
					path: "/GradeCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Grade}"
			});
			
			// 키보드 입력 방지
			oGradeCombo.addDelegate({
				onAfterRendering: function () {
					oGradeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oGradeCombo);

            var oGradeCombo2 = new sap.m.ComboBox(oController.PAGEID + "_GradeCombo2", { // 학년제
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/GradeCombo2",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Grdrl}"
			});
			
			// 키보드 입력 방지
			oGradeCombo2.addDelegate({
				onAfterRendering: function () {
					oGradeCombo2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oGradeCombo2);

            var oYearCombo = new sap.m.ComboBox({ // 수혜주기(년도)
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
					path: "/YearCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Zyear}"
			});
			
			// 키보드 입력 방지
			oYearCombo.addDelegate({
				onAfterRendering: function () {
					oYearCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oYearCombo);

            var oCycleCombo = new sap.m.ComboBox({ // 수혜주기(분기)
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "95%",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/CycleCombo",
					template: new sap.ui.core.ListItem({
						key: "{Reccl}",
						text: "{RecclT}"
					})
				},
				selectedKey: "{Reccl}"
			})
            .addStyleClass("ml-5px");
			
			// 키보드 입력 방지
			oCycleCombo.addDelegate({
				onAfterRendering: function () {
					oCycleCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oCycleCombo);
            
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38003}", "105px", "Left"), // 신청일
                            new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38053}", "105px", "Left"), // 성명/관계
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								text: {
                                    parts: [{path: "NameKor"}, {path: "RelationTx"}],
                                    formatter: function(v1, v2) {
                                        return v1 ? v1 + "/" + v2 : "";
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38006}", "105px", "Left", true), // 학교구분
							oSchoolCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38031}", "105px", "Left", true), // 지원유형
							oSupportCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38032}", "105px", "Left", true), // 국가
							new sap.m.Input({ // 국가 Input
								textAlign: "Begin",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "SchcoT", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								showValueHelp: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: "{SchcoT}",
								valueHelpOnly: true,
								valueHelpRequest: oController.onSearchNation.bind(oController)
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38008}", "105px", "Left", true), // 학년
							oGradeCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38007}", "105px", "Left", true), // 학교명
							new sap.m.Input({
								textAlign: "Begin",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "SchoolName", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: "{SchoolName}"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38034}", "105px", "Left", true), // 전공명
							new sap.m.Input(oController.PAGEID + "_MajorInput", {
								textAlign: "Begin",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "Majcd", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (v === "AA") return true;
										return false;
									}
								},
								value: "{Majcd}"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38033}", "105px", "Left", true), // 학년제
							oGradeCombo2
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38035}", "105px", "Left"), // 수혜횟수
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								text: "{Reccn}",
                                textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38036}", "105px", "Left"), // 수혜주기
							new sap.m.HBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    oYearCombo,
                                    oCycleCombo
                                ]
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38017}", "105px", "Left"), // 입학금
							new sap.m.Input({
								textAlign: "End",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "EreqAmt", false),
								liveChange: oController.getHighCost1.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "EreqAmt",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38018}", "105px", "Left"), // 수업료
							new sap.m.Input({
								textAlign: "End",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "FreqAmt", false),
								liveChange: oController.getHighCost2.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "FreqAmt",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38037}", "105px", "Left"), // 운영회비
							new sap.m.Input({
								textAlign: "End",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "DreqAmt", false),
								liveChange: oController.getHighCost3.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "DreqAmt",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38038}", "105px", "Left"), // 장학금
							new sap.m.Input({
								textAlign: "End",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "Scham", false),
                                liveChange: oController.getScholarship.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "Scham",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(String(parseInt(v)));
										else return "0";
									}
								}
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38039}", "105px", "Left"), // 기타금액
							new sap.m.Input({
								textAlign: "End",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "ReqAmt1", false),
                                liveChange: oController.getExcepAmount.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "ReqAmt1",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38009}", "105px", "Left", true), // 신청금액
							new sap.m.Input({
								textAlign: "End",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "ReqSum", false),
								editable: false,
								value: {
									path: "ReqSum",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38010}", "105px", "Left"), // 지원금액
							new sap.m.Input({
								textAlign: "End",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "AdmSum", false),
								editable: false,
								value: {
									path: "AdmSum",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							})
						]
					}),
					new sap.m.HBox({
					alignItems: sap.m.FlexAlignItems.Center,
                        items: [
							FileHandler.renderer(oController,"002")
                        ]
                    })
				]
			})
			.addStyleClass("vbox-form-mobile");
		}
	});
});