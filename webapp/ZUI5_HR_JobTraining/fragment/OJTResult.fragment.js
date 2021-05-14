﻿/* eslint-disable no-undef */
sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates",
	"../../common/PickOnlyDatePicker"
], function (Common, ViewTemplates, PickOnlyDatePicker) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.OJTResult", {

		createContent: function (oController) {

            var oTypeCombo = new sap.m.ComboBox({ // 교육유형
				width: "250px",
				editable: {
					parts: [{path: "Status1"}, {path: "/TraningCheck"}],
					formatter: function(v1, v2) {
						return (!v1 || v1 === "AA") && v2 === "Y";
					}
				},
				items: {
					path: "/TypeCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Edgub}"
			});
			
			// 키보드 입력 방지
			oTypeCombo.addDelegate({
				onAfterRendering: function () {
					oTypeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oTypeCombo);

            var oSelectCombo = new sap.m.ComboBox({ // 필수/선택
				width: "250px",
				editable: {
					parts: [{path: "Status1"}, {path: "/TraningCheck"}],
					formatter: function(v1, v2) {
						return (!v1 || v1 === "AA") && v2 === "Y";
					}
				},
				items: {
					path: "/SelectCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Optin}"
			});
			
			// 키보드 입력 방지
			oSelectCombo.addDelegate({
				onAfterRendering: function () {
					oSelectCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oSelectCombo);
            
            var oNomalCombo = new sap.m.ComboBox({ // 법정/일반
				width: "250px",
				editable: {
					parts: [{path: "Status1"}, {path: "/TraningCheck"}],
					formatter: function(v1, v2) {
						return (!v1 || v1 === "AA") && v2 === "Y";
					}
				},
				items: {
					path: "/NomalCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Rules}"
			});
			
			// 키보드 입력 방지
			oNomalCombo.addDelegate({
				onAfterRendering: function () {
					oNomalCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oNomalCombo);

            var oBTimeBox1 = new sap.m.ComboBox({ // 학습시간(시)
                selectedKey: "{BTime1}",
                width: "80px",
                items: {
                    path: "/BTime1",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-3px");

			oBTimeBox1.addDelegate({
				onAfterRendering: function () {
					oBTimeBox1.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oBTimeBox1);

            var oBTimeBox2 = new sap.m.ComboBox({ // 학습시간(분)
                selectedKey: "{BTime2}",
                width: "80px",
                items: {
                    path: "/BTime2",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            });

			oBTimeBox2.addDelegate({
				onAfterRendering: function () {
					oBTimeBox2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oBTimeBox2);

            var oETimeBox1 = new sap.m.ComboBox({ // 학습시간(시)
                selectedKey: "{ETime1}",
                width: "80px",
                items: {
                    path: "/ETime1",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-3px");

			oETimeBox1.addDelegate({
				onAfterRendering: function () {
					oETimeBox1.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oETimeBox1);

            var oETimeBox2 = new sap.m.ComboBox({ // 학습시간(분)
                selectedKey: "{ETime2}",
                width: "80px",
                items: {
                    path: "/ETime2",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            });

			oETimeBox2.addDelegate({
				onAfterRendering: function () {
					oETimeBox2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oETimeBox2);
            
            var oApplyBox = new sap.m.VBox({
                items: [
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70013}", "150px", "Right", true ), // 교육과정
                                    new sap.m.Input(oController.PAGEID + "TrainingInput", {
                                        textAlign: "Begin",
                                        width: "550px",
                                        maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOjtApplyTab1", "Edkaj", false),
                                        editable: {
                                            parts: [{path: "Status1"}, {path: "/TraningCheck"}],
                                            formatter: function(v1, v2) {
                                                return (!v1 || v1 === "AA") && v2 === "Y";
                                            }
                                        },
                                        value: "{Edkaj}"
                                    }),
									new sap.m.Button({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										icon: "sap-icon://search",
										press: oController.RegistTraning.bind(oController),
										visible: {
											parts: [{path: "Status1"}, {path: "/TraningCheck"}],
                                            formatter: function(v1, v2) {
                                                return (!v1 || v1 === "AA") && (!v2 || v2 === "X");
                                            }
										}
									}).addStyleClass("button-search-icon mx-5px"),
									new sap.m.CheckBox(oController.PAGEID + "_CheckBox", { 
                                        select: oController.onDInput.bind(oController),
										selected: {
											path: "/Checked",
											formatter: function(v) {
												return v === "X";
											}
										},
                                        layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                        editable: {
                                            path: "Status1",
                                            formatter: function(v1) {
                                                return !v1 || v1 === "AA";
                                            }
                                        }
                                    }),
									new sap.m.Text({ text: "{i18n>LABEL_70019}", textAlign: "Begin" })
								]
							})
							.addStyleClass("search-field-group")
                        ]
                    })
                    .addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
                            new sap.m.HBox({
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_70020}", "150px", "Right", true ),  // 교육구분
                                    new sap.m.Text({ text: "{i18n>LABEL_70041}", textAlign: "Begin", width: "250px" })
								]
							}).addStyleClass("search-field-group mr-30px"),
                            new sap.m.HBox({
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_70021}", "150px", "Right", true ),  // 교육유형
                                    oTypeCombo
								]
							}).addStyleClass("search-field-group")
                        ]
                    })
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
                            new sap.m.HBox({
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_70022}", "150px", "Right", true ),  // 필수/선택
                                    oSelectCombo
								]
							}).addStyleClass("search-field-group mr-30px"),
                            new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70023}", "150px", "Right", true ),  // 법정/일반
									oNomalCombo
								]
							}).addStyleClass("search-field-group")
                        ]
                    })
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							new sap.m.HBox({
								width: "40%",
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70014}", "150px", "Right", true), // 학습일자
									new PickOnlyDatePicker({
                                        width: "150px",
                                        dateValue: "{Begda}",
                                        displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                        valueFormat: "yyyy-MM-dd",
                                        placeholder: "yyyy-mm-dd",
                                        editable: {
											path: "Status1",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										}
                                    })
									.addStyleClass("mr-30px")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70015}", "150px", "Right"), // 학습시간
									oBTimeBox1,
                                    oBTimeBox2,
                                    new sap.m.Text({ text: "~" }).addStyleClass("mx-5px"),
                                    oETimeBox1,
                                    oETimeBox2
								]
							})
							.addStyleClass("search-field-group")
                        ]
                    })
                    .addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_70024}", "150px", "Right", true ), // 교육대상
							new sap.m.Input({
								textAlign: "Begin",
								width: "704px",
								maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOjtApplyTab1", "Edpeo", false),
								editable: {
									path: "Status1",
									formatter: function(v1) {
										return !v1 || v1 === "AA";
									}
								},
								value: "{Edpeo}"
							})
                        ]
                    })
                    .addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_70025}", "60px", "Right", true ).addStyleClass("pt-25px mr-0"), // 강사
                            new sap.m.VBox({
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            ViewTemplates.getLabel("header", "{i18n>LABEL_70026}", "74px", "Right" ), // 사내
                                            new sap.m.VBox(oController.PAGEID + "_InTeacherBox", {
                                                items: [
                                                ]
                                            })
											.setModel(oController.TeacherInfoModel)
											.bindElement("/InData"),
											new sap.m.HBox({
												alignContent: sap.m.FlexAlignContent.End,
												alignItems: sap.m.FlexAlignItems.Center,
												items: [
													new sap.m.Button({
														icon: "sap-icon://add",
														press: oController.onInPressAddRow.bind(oController),
														text: "{i18n>LABEL_70028}", // 추가
														visible: {
															path: "Status1",
															formatter: function(v1) {
																return !v1 || v1 === "AA";
															}
														}
													}).addStyleClass("button-light-sm mr-5px"),
													new sap.m.Button({
														icon: "sap-icon://less",
														press: oController.onInPressDelRow.bind(oController),
														text: "{i18n>LABEL_70011}", // 삭제
														visible: {
															path: "Status1",
															formatter: function(v1) {
																return !v1 || v1 === "AA";
															}
														}
													}).addStyleClass("button-light-sm")
												]
											}).addStyleClass("ml-10px")
                                        ]
                                    }),
                                    new sap.m.HBox({
                                        items: [
                                            ViewTemplates.getLabel("header", "{i18n>LABEL_70027}", "74px", "Right" ), // 사외
                                            new sap.m.VBox(oController.PAGEID + "_OutTeacherBox", {
                                                items: [
                                                ]
                                            })
											.setModel(oController.TeacherInfoModel)
											.bindElement("/OutData"),
											new sap.m.HBox({
												alignContent: sap.m.FlexAlignContent.End,
												alignItems: sap.m.FlexAlignItems.Center,
												items: [
													new sap.m.Button({
														press: oController.onDirTeacher.bind(oController),
														text: "{i18n>LABEL_70019}", // 직접입력
														visible: {
															path: "Status1",
															formatter: function(v1) {
																return !v1 || v1 === "AA";
															}
														}
													}).addStyleClass("button-light-sm ml-5px mr-10px"),
													new sap.m.Button({
														icon: "sap-icon://add",
														press: oController.onOutPressAddRow.bind(oController),
														text: "{i18n>LABEL_70028}", // 추가
														visible: {
															path: "Status1",
															formatter: function(v1) {
																return !v1 || v1 === "AA";
															}
														}
													}).addStyleClass("button-light-sm mr-5px"),
													new sap.m.Button({
														icon: "sap-icon://less",
														press: oController.onOutPressDelRow.bind(oController),
														text: "{i18n>LABEL_70011}", // 삭제
														visible: {
															path: "Status1",
															formatter: function(v1) {
																return !v1 || v1 === "AA";
															}
														}
													}).addStyleClass("button-light-sm")
												]
											})
                                        ]
                                    })
                                ]
                            })
						]
					})
					.addStyleClass("search-field-group h-auto"),
					new sap.m.HBox({
						width: "100%",
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_70032}", "150px", "Right", true ), // 학습내용
							new sap.m.VBox({
								items: [
									new sap.m.TextArea({
										rows: 3,
										width: "704px",
										value:"{Contt}",
										editable: {
											path: "Status1",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										}
									}).addStyleClass("mt-5px"),
									fragment.COMMON_ATTACH_FILES.renderer(oController,"001")
								]
							})
						]
					})
					.addStyleClass("search-field-group h-auto"),
					
                    new sap.m.HBox({
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_70033}", "150px", "Right" ), // 이수기준
                            new sap.m.Text({
                                text: "{Descr}",
                                width: "250px",
                                textAlign: "Begin"
                            })
                        ]
                    })
                    .addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70034}", "150px", "Right"), // 이수시간
									new sap.m.Text({
										text: "",
										width: "250px",
										textAlign: "Begin"
									})
								]
							})
							.addStyleClass("search-field-group mr-30px"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70035}", "150px", "Right"), // 이수점수
									new sap.m.Text({
										text: "{Totel}",
										width: "250px",
										textAlign: "Begin"
									})
								]
							})
							.addStyleClass("search-field-group")
						]
					})
					.addStyleClass("search-field-group h-auto"),
					new sap.m.HBox({
						items: [
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70036}", "150px", "Right"), // 선행자격요건
									new sap.m.Text({
										text: "{Pret1}",
										width: "250px",
										textAlign: "Begin"
									})
								]
							})
							.addStyleClass("search-field-group mr-30px"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70037}", "150px", "Right"), // 선행교육과정
									new sap.m.Text({
										text: "{Pret2}",
										width: "250px",
										textAlign: "Begin"
									})
								]
							})
							.addStyleClass("search-field-group")
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70038}", "150px", "Right"), // 관련자격요건
									new sap.m.Text({
										text: "{Pret3}",
										width: "250px",
										textAlign: "Begin"
									})
								]
							})
							.addStyleClass("search-field-group mr-30px"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_70039}", "150px", "Right"), // 관련자격숙련도
									new sap.m.Text({
										text: "{Pret4}",
										width: "250px",
										textAlign: "Begin"
									})
								]
							})
							.addStyleClass("search-field-group")
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_70040}", "150px", "Right"), // 기타사항
							new sap.m.TextArea({
								rows: 3,
								width: "704px",
								value:"{Othtx}",
								editable: {
									path: "Status1",
									formatter: function(v1) {
										return !v1 || v1 === "AA";
									}
								}
							}).addStyleClass("my-5px")
						]
					})
					.addStyleClass("search-field-group h-auto")
                ]
            })
			.addStyleClass("search-inner-vbox");

			var oTextBox = new sap.m.VBox({
				width: "100%",
				fitContainer: true,
				items: [
					new sap.m.HBox({
						items: [
							new sap.ui.core.Icon({
								src: "sap-icon://information"
							})
							.addStyleClass("color-icon-blue mr-5px pt-5px"),
							new sap.m.Text({
								text: "{i18n>MSG_70002}",
								textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						items: [
							new sap.ui.core.Icon({
								src: "sap-icon://information"
							})
							.addStyleClass("color-icon-blue mr-5px pt-5px"),
							new sap.m.Text({
								text: "{i18n>MSG_70003}",
								textAlign: "Begin"
							})
						]
					})
					.addStyleClass("mt-3px")
				]
			})
			.addStyleClass("mt-5px");
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_70001}",    // 직무교육(OJT) 신청
				contentWidth: "980px",
				contentHeight: "650px",
				buttons: [
					new sap.m.Button({
						press: oController.onDialogApplyBtn.bind(oController),
						text: "{i18n>LABEL_70047}", // 신규저장,
						visible: {
							path: "Status1",
							formatter: function(v) {
								return !v;
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onDialogSaveBtn.bind(oController),
						text: "{i18n>LABEL_70047}", // 저장,
						visible: {
							path: "Status1",
							formatter: function (v) {
								return v === "AA";
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onDialogResultBtn.bind(oController),
						text: "{i18n>LABEL_70047}", // 결과보고저장
						visible: {
							parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
							formatter: function(v1, v2, v3) {
								return Common.checkNull(v3) && ((v1 === "AA" && v2 === "2") || (v1 === "99" && v2 === "1"));
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onDialogDelBtn.bind(oController),
						text: "{i18n>LABEL_70011}", // 삭제
						visible: {
							path: "Status1",
							formatter: function (v) {
								return v === "AA";
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
					oTextBox
                ]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
			.addStyleClass("custom-dialog-popup");

			return oDialog;
		}
	});
});