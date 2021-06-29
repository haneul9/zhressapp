sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates"
], function (Common, ViewTemplates) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_LeaveReinstatement.fragment.Apply", {

		createContent: function (oController) {
			var vBukrs = oController.getUserGubun();

            var oReinDate = new sap.m.DatePicker(oController.PAGEID + "_ReinDate", { // 복직(예정)일
				width: "220px",
				dateValue: "{Zrhsdt}",
				change: oController.getLeaveTerm.bind(oController),
				displayFormat: oController.getSessionInfoByKey("Dtfmt"),
				valueFormat: "yyyy-MM-dd",
				placeholder: "yyyy-mm-dd",
				editable: {
					path: "Status1",
					formatter: function(v) {
						if (v === "AA") return true;
						return false;
					}
				}
			});

			// 키보드 입력 방지
			oReinDate.addDelegate({
				onAfterRendering: function () {
					oReinDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oReinDate);

            var oBabyDate = new sap.m.DatePicker({ // 출산예정일
				width: "220px",
				dateValue: "{Zexbdt}",
				displayFormat: oController.getSessionInfoByKey("Dtfmt"),
				valueFormat: "yyyy-MM-dd",
				placeholder: "yyyy-mm-dd",
				editable: {
					path: "Status1",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				}
			});

			// 키보드 입력 방지
			oBabyDate.addDelegate({
				onAfterRendering: function () {
					oBabyDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oBabyDate);

            var oBirthDate = new sap.m.DatePicker({ // 생년월일
				width: "220px",
				dateValue: "{Zfgbdt}",
				displayFormat: oController.getSessionInfoByKey("Dtfmt"),
				valueFormat: "yyyy-MM-dd",
				placeholder: "yyyy-mm-dd",
				editable: {
					path: "Status1",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				}
			});

			// 키보드 입력 방지
			oBirthDate.addDelegate({
				onAfterRendering: function () {
					oBirthDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oBirthDate);

            var oAdmissionDate = new sap.m.DatePicker({ // 입학일
				width: "220px",
				dateValue: "{Zentdt}",
				displayFormat: oController.getSessionInfoByKey("Dtfmt"),
				valueFormat: "yyyy-MM-dd",
				placeholder: "yyyy-mm-dd",
				editable: {
					path: "Status1",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				}
			});

			// 키보드 입력 방지
			oAdmissionDate.addDelegate({
				onAfterRendering: function () {
					oAdmissionDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oAdmissionDate);

            var oLeaveDate = new sap.m.DateRangeSelection(oController.PAGEID + "_LeaveDate", { // 휴직기간
                displayFormat: oController.getSessionInfoByKey("Dtfmt"),
				change: oController.getReinTerm.bind(oController),
				placeholder: "yyyy-mm-dd ~ yyyy-mm-dd",
                editable: {
					path: "Status1",
					formatter: function(v) {
						if (v === "AA") return true;
						return false;
					}
				},
                width: "220px",
                delimiter: "~",
                dateValue: "{Zlowbd}",
                secondDateValue: "{Zlowed}"
            });

			oLeaveDate.addDelegate({
				onAfterRendering: function () {
					oLeaveDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oLeaveDate);

            var oTypeCombo = new sap.m.ComboBox({ // 휴/복직 구분
				width: "220px",
				change: oController.changeType.bind(oController),
				editable: {
					path: "Status1",
					formatter: function(v) {
						if (!v) return true;
						return false;
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

            var oRelationCombo = new sap.m.ComboBox({ // 관계
				width: "220px",
				editable: {
					path: "Status1",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
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

            var oUsedTypeCombo = new sap.m.ComboBox(oController.PAGEID + "_UsedTypeCombo", { // 휴/복직 사유
				width: "220px",
                change: oController.changeUsedType.bind(oController),
				editable: {
					path: "Status1",
					formatter: function(v) {
						if (v === "AA") return true;
						return false;
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

			var oApplyBox = new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
						alignContent: sap.m.FlexAlignContent.End,
						alignItems: sap.m.FlexAlignItems.End,
						items: [
							new sap.m.HBox({
								width: "100%",
								fitContainer: true,
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_42004}", "160px", "Right"), // 신청일
									new sap.m.Text({
										width: "220px",
										text: {
											path: "Reqdt",
											formatter: function(v) {
												if(v) return Common.DateFormatter(v);
												else {
													var rDate = new Date().setDate(new Date().getDate());
													return Common.DateFormatter(rDate);	
												}
											}
										},
										textAlign: "Begin"
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.Button({
								press: oController.onLeaveReinHistory.bind(oController),
								text: "{i18n>LABEL_42012}" // 휴/복직 이력
							})
							.addStyleClass("button-light-sm")
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_42013}", "160px", "Right", true), // 휴/복직 구분
							oTypeCombo,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42014}", "160px", "Right", true).addStyleClass("mr-8px"), // 휴/복직 사유
                            oUsedTypeCombo
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_42007}", "160px", "Right", true), // 휴직기간
                            oLeaveDate,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42008}", "160px", "Right", true).addStyleClass("mr-8px"), // 복직(예정)일
							oReinDate
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_42016}", "160px", "Right", true), // 세부사유
                            new sap.m.TextArea({
                                rows: 3,
								width: "674px",
								value:"{Zdtlrs}",
								maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zdtlrs", false),
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								editable: {
									path: "Status1",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								}
							})
						]
					})
					.addStyleClass("search-field-group h-90px"),
                    new sap.m.HBox({
						width: "100%",
						height: "auto",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_42017}", "160px", "Right"), // 증빙서류안내
							new sap.m.Text({
								width: "auto",
								text: "{/InfoText}",
                                textAlign: "Begin"
							})
						]
					})
					.addStyleClass("search-field-group h-60px"),
                    new sap.m.HBox(oController.PAGEID + "_BabyDateBox", {
                        visible: true,
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_42018}", "160px", "Right", true), // 출산예정일
							oBabyDate
						]
					})
					.addStyleClass("search-field-group")
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
			.addStyleClass("search-inner-vbox");

            var oFamilyInfoBox = new sap.m.VBox({ // 가족정보
				fitContainer: true,
				items: [
					new sap.m.HBox({
                        width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42020}", "160px", "Right", true), // 성명
                            new sap.m.Input({
                                textAlign: "Begin",
                                width: "220px",
                                maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zfmlnm", false),
                                value: "{Zfmlnm}",
                                editable: {
                                    path: "Status1",
                                    formatter: function(v) {
                                        if (!v || v === "AA") return true;
                                        return false;
                                    }
                                }
                                }),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42021}", "160px", "Right", true).addStyleClass("mr-8px"), // 생년월일
                            oBirthDate
                        ]
                    })
                    .addStyleClass("search-field-group"),
                    new sap.m.HBox(oController.PAGEID + "_MidBox", {
                        width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42022}", "160px", "Right", true), // 초등학교 명
                            new sap.m.Input({
                                textAlign: "Begin",
                                width: "220px",
                                maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zelmnm", false),
                                value: "{Zelmnm}",
                                editable: {
                                    path: "Status1",
                                    formatter: function(v) {
                                        if (!v || v === "AA") return true;
                                        return false;
                                    }
                                }
                            }),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42023}", "160px", "Right", true).addStyleClass("mr-8px"), // 입학일
                            oAdmissionDate
                        ]
                    })
                    .addStyleClass("search-field-group"),
                    new sap.m.HBox(oController.PAGEID + "_BotBox", {
                        width: "100%",
						fitContainer: true,
						items: [
							new sap.m.HBox(oController.PAGEID + "_RelationCombo", {
								width: "100%",
								fitContainer: true,
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_42024}", "160px", "Right", true), // 관계
									oRelationCombo
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox(oController.PAGEID + "_Partner", {
								width: "100%",
								fitContainer: true,
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_42025}", "160px", "Right", true).addStyleClass("mr-8px"), // 배우자 육아휴직 신청여부
									oPartnerCheckCombo
								]
							}).addStyleClass("search-field-group")
                        ]
                    })
                    .addStyleClass("search-field-group")
                ]
            })
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox");

            var oSickInfoBox = new sap.m.VBox({ // 질병정보
				fitContainer: true,
				items: [
					new sap.m.HBox({
                        width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42027}", "160px", "Right", true), // 질병 명
                            new sap.m.Input({
								textAlign: "Begin",
								width: "664px",
								maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zdsase", false),
                                value: "{Zdsase}",
								editable: {
									path: "Status1",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
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
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42028}", "160px", "Right", true), // 의사 소견 (요약)
                            new sap.m.Input({
								textAlign: "Begin",
								width: "664px",
								maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zdtopn", false),
                                value: "{Zdtopn}",
								editable: {
									path: "Status1",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								}
						 	})
                        ]
                    })
                    .addStyleClass("search-field-group")
                ]
            })   
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox");

            var oPaymentBox =  new sap.m.VBox({
                width: "100%",
                fitContainer: true,
                items: [
                    new sap.m.HBox({ // 결재선 안내
                        fitContainer: true,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_42029}", "160px", "Right"), // 결재선
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
                                    }),
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
                                    }),
                                    new sap.m.Text({
										visible: {
											path: vBukrs,
											formatter: function() {
												return vBukrs === "A100";
											}
										},
                                        width: "auto",
                                        text: "{i18n>MSG_42030}",
                                        textAlign: "Begin"
                                    }),
                                    new sap.m.Text({
										visible: {
											path: vBukrs,
											formatter: function() {
												return vBukrs === "A100";
											}
										},
                                        width: "auto",
                                        text: "{i18n>MSG_42031}",
                                        textAlign: "Begin"
                                    })
                                ]
                            })
                        ]
                    })
                    .addStyleClass("search-field-group h-auto")
                ]
            })
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox mt--1px");
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_42002}",    // 휴/복직 신청
				contentWidth: "928px",
				contentHeight: "620px",
				beforeOpen: oController.onBeforeDialog.bind(oController),
				afterOpen: oController.onAfterDialog.bind(oController),
				buttons: [
					new sap.m.Button({
						press: oController.onDialogSaveBtn.bind(oController),
						text: "{i18n>LABEL_42031}", // 저장,
						visible: {
							path: "Status1",
							formatter: function (v) {
								if (!v || v === "AA") return true;
								return false;
							}
						}
					}).addStyleClass("button-light"),
                    new sap.m.Button({
						press: oController.pressApprovalBtn.bind(oController),
						text: "{i18n>LABEL_42030}", // 신청,
						visible: {
							path: "Status1",
							formatter: function (v) {
								if (!v || v === "AA") return true;
								return false;
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: oController.onDialogDelBtn.bind(oController),
						text: "{i18n>LABEL_42032}", // 삭제
						visible: {
							path: "Status1",
							formatter: function (v) {
								if (v === "AA") return true;
								return false;
							}
						}
					}).addStyleClass("button-delete"),
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_00133}" // 닫기
					}).addStyleClass("button-default custom-button-divide")
				],
				content: [
					oApplyBox,
                    new sap.m.VBox(oController.PAGEID + "_FamilyInfoBox" ,{
						fitContainer: true,
						items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_42019}" // 가족정보                                
                            })
                            .addStyleClass("sub-title"),
                            oFamilyInfoBox
                        ]
                    })
                    .addStyleClass("mt-20px"),
                    new sap.m.VBox(oController.PAGEID + "_SickInfoBox" ,{
						fitContainer: true,
						items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_42026}" // 질병정보                                
                            })
                            .addStyleClass("sub-title"),
                            oSickInfoBox
                        ]
                    })
                    .addStyleClass("mt-20px"),
                    oPaymentBox,
                    new sap.m.HBox(oController.PAGEID + "_FileBox", {
						fitContainer: true,
						items: [
                            sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
					})
                ]
			})
			.addStyleClass("custom-dialog-popup")
			.setModel(oController.ApplyModel)
			.bindElement("/FormData");

			return oDialog;
		}
	});
});