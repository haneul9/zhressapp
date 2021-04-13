$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/PickOnlyDatePicker",
    "../delegate/ViewTemplates"
], function (Common, PageHelper, PickOnlyDatePicker, ViewTemplates) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "BaseApply"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "BaseApply-",
                title: "{i18n>LABEL_38001}", // 학자금 신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
                            press: oController.onDialogSaveBtn.bind(oController),
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
                            press: oController.onDialogApplyBtn.bind(oController),
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
                            press: oController.onDialogDelBtn.bind(oController),
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
					this.ApplyingBox(oController),
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
		},
		
		ApplyingBox: function(oController) {

            var oNameCombo = new sap.m.ComboBox({ //성명
				width: "200px",
				change: oController.changeRelation.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/NameCombo",
					template: new sap.ui.core.ListItem({
						key: "{Fname}",
						text: "{Fname}"
					})
				},
				selectedKey: "{NameKor}"
			});
			
			// 키보드 입력 방지
			oNameCombo.addDelegate({
				onAfterRendering: function () {
					oNameCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oNameCombo);

            var oGubunCombo = new sap.m.ComboBox({ // 구분
				width: "200px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/GubunCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{SGubun}"
			});
			
			// 키보드 입력 방지
			oGubunCombo.addDelegate({
				onAfterRendering: function () {
					oGubunCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oGubunCombo);

            var oSchoolCombo = new sap.m.ComboBox({ // 학교구분
				width: "200px",
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

            var oYearCombo = new sap.m.ComboBox({ // 등록년도
				width: "200px",
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

            var oGradeCombo = new sap.m.ComboBox({ // 학년
				width: "200px",
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

            var oSemesterCombo = new sap.m.ComboBox({ // 등록학기/분기
				width: "200px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/SemesterCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Quart}"
			});
			
			// 키보드 입력 방지
			oSemesterCombo.addDelegate({
				onAfterRendering: function () {
					oSemesterCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oSemesterCombo);
            
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38003}", "105px", "Left"), // 신청일
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38005}", "105px", "Left", true), // 성명
							oNameCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38004}", "105px", "Left", true), // 관계
							new sap.m.Text({
								width: "200px",
								text: "{RelationTx}",
                                textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38013}", "105px", "Left", true), // 구분
							oGubunCombo
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
								width: "200px",
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38014}", "105px", "Left"), // 등록년도
							oYearCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38015}", "105px", "Left"), // 등록학기/분기
							oSemesterCombo
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38016}", "105px", "Left", true), // 납부일자
							new PickOnlyDatePicker(oController.PAGEID + "_AppDate", {
                                width: "200px",
                                dateValue: "{Paydt}",
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38017}", "105px", "Left"), // 입학금
							new sap.m.Input({
								textAlign: "End",
								width: "200px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "EreqAmt", false),
								liveChange: oController.getCost1.bind(oController),
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
								width: "200px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "FreqAmt", false),
								liveChange: oController.getCost2.bind(oController),
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38019}", "105px", "Left"), // 육성회비
							new sap.m.Input({
								textAlign: "End",
								width: "200px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "UreqAmt", false),
								liveChange: oController.getCost3.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "UreqAmt",
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38021}", "105px", "Left"), // 학교운영지원비
							new sap.m.Input({
								textAlign: "End",
								width: "200px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "DreqAmt", false),
								liveChange: oController.getCost4.bind(oController),
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38022}", "105px", "Left"), // 학생회비
							new sap.m.Input({
								textAlign: "End",
								width: "200px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "SreqAmt", false),
								liveChange: oController.getCost5.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "SreqAmt",
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38023}", "105px", "Left"), // 자율학습비
							new sap.m.Input({
								textAlign: "End",
								width: "200px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "SsreqAmt", false),
								liveChange: oController.getCost6.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "SsreqAmt",
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38024}", "105px", "Left"), // 보충수업
							new sap.m.Input({
								textAlign: "End",
								width: "200px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "AreqAmt", false),
								liveChange: oController.getCost7.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "AreqAmt",
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
						visible: false,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38025}", "105px", "Left"), // 기타1
							new sap.m.Input({
								textAlign: "End",
								width: "200px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "ReqAmt1", false),
								liveChange: oController.getCost8.bind(oController),
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
								width: "200px",
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
								width: "200px",
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
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34021}", "105px", "Left", true), // 비고
							new sap.m.Input({
								textAlign: "Begin",
								width: "200px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "Remark", false),
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
							fragment.COMMON_ATTACH_FILES.renderer(oController,"1")
                        ]
                    })
				]
			})
			.addStyleClass("vbox-form-mobile");
		}
	});
});