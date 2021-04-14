/* eslint-disable no-undef */
sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates",
	"../../common/ZHR_TABLES",
	"../../common/PickOnlyDateRangeSelection",
    "../../common/PickOnlyDatePicker"
], function (Common, ViewTemplates, ZHR_TABLES, PickOnlyDateRangeSelection, PickOnlyDatePicker) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ResultReport", {

		createContent: function (oController) {
			
            var oEduCombo = new sap.m.ComboBox({ // 교육구분
				width: "250px",
				editable: false,
				items: {
					path: "/EduCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Zgtype}"
			});
			
			// 키보드 입력 방지
			oEduCombo.addDelegate({
				onAfterRendering: function () {
					oEduCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oEduCombo);

            var oTypeCombo = new sap.m.ComboBox({ // 교육유형
				width: "250px",
				editable: false,
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
				editable: false,
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
				editable: false,
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

            var oTimeCombo = new sap.m.ComboBox({ // 학습시간 (시)
				width: "70px",
				editable: false,
				items: {
					path: "/TimeCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{hTime}"
			});
			
			// 키보드 입력 방지
			oTimeCombo.addDelegate({
				onAfterRendering: function () {
					oTimeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oTimeCombo);

            var oTimeCombo2 = new sap.m.ComboBox({ // 학습시간 (분)
				width: "70px",
				editable: false,
				items: {
					path: "/TimeCombo2",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{mTime}"
			});
			
			// 키보드 입력 방지
			oTimeCombo2.addDelegate({
				onAfterRendering: function () {
					oTimeCombo2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oTimeCombo2);

            var oSatisCombo = new sap.m.ComboBox({ // 학습자만족도
				width: "250px",
				editable: {
					parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
					formatter: function(v1, v2, v3) {
						return Common.checkNull(v3) && v1 === "99" && v2 === "1";
					}
				},
				items: {
					path: "/SatisCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Trnfb}"
			});
			
			// 키보드 입력 방지
			oSatisCombo.addDelegate({
				onAfterRendering: function () {
					oSatisCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oSatisCombo);

            var oEduEffectCombo = new sap.m.ComboBox({ // 교육효과평가
				width: "250px",
				editable: {
					parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
					formatter: function(v1, v2, v3) {
						return Common.checkNull(v3) && v1 === "99" && v2 === "1";
					}
				},
				items: {
					path: "/EduEffectCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Evtfb}"
			});
			
			// 키보드 입력 방지
			oEduEffectCombo.addDelegate({
				onAfterRendering: function () {
					oEduEffectCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oEduEffectCombo);

			var oAttTable2 = new sap.ui.table.Table(oController.PAGEID + "_AttTable2", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 5,
				showOverlay: false,
				showNoData: true,
				width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("thead-cell-border tbody-cell-border fix-header-height-38px mt-8px")
			.setModel(oController.AttModel)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oAttTable2, [
				{id: "Stext1",	    label: "{i18n>LABEL_40030}" /* 부서명 */,  	plabel: "",  resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
				{id: "PGradeTxt",   label: "{i18n>LABEL_40031}" /* 직급 */,     plabel: "",  resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
				{id: "Ename", 		label: "{i18n>LABEL_40032}" /* 성명 */,		plabel: "" , resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"}
			]);
            
            var oApplyBox = new sap.m.VBox({
                items: [
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40024}", "150px", "Right", true ), // 교육과정
                                    new sap.m.Input({
                                        textAlign: "Begin",
                                        width: "704px",
                                        maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "Edkaj", false),
                                        editable: false,
                                        value: "{Edkaj}"
                                    })
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
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_40025}", "150px", "Right", true ),  // 교육구분
                                    oEduCombo
								]
							}).addStyleClass("search-field-group mr-30px"),
                            new sap.m.HBox({
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_40058}", "150px", "Right", true ),  // 교육유형
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
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_40026}", "150px", "Right", true ),  // 필수/선택
                                    oSelectCombo
								]
							}).addStyleClass("search-field-group mr-30px"),
                            new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40027}", "150px", "Right", true ),  // 법정/일반
									oNomalCombo
								]
							}).addStyleClass("search-field-group")
                        ]
                    })
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_40028}", "150px", "Right", true ), // 참석자
							new sap.m.VBox({
								items: [
									new sap.m.HBox({
										alignContent: sap.m.FlexAlignContent.End,
										alignItems: sap.m.FlexAlignItems.End,
										items: [
											new sap.m.Button({
												icon: "sap-icon://add",
												press: oController.onPressAddRow.bind(oController),
												text: "{i18n>LABEL_40034}", // 추가
												visible: false
											}).addStyleClass("button-light-sm mr-5px"),
											new sap.m.Button({
												icon: "sap-icon://less",
												press: oController.onPressDelRow.bind(oController),
												text: "{i18n>LABEL_40011}", // 삭제
												visible: false
											}).addStyleClass("button-light-sm")
										]
									})
									.addStyleClass("mt-6px"),
									oAttTable2
								]
							})
                        ]
                    })
                    .addStyleClass("search-field-group h-auto"),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							new sap.m.HBox({
								width: "100%",
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40035}", "150px", "Right", true), // 학습기간
									new PickOnlyDateRangeSelection({
										width: "250px",
										displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
										delimiter: "~",
										dateValue: "{Begdhb}",
										secondDateValue: "{Enddhe}",
                                        editable: false
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								width: "100%",
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40036}", "150px", "Right", true), // 학습시간
									oTimeCombo,
									new sap.m.Text({ text: " : " }).addStyleClass("ml-15px mr-5px"),
									oTimeCombo2
								]
							})
							.addStyleClass("search-field-group")
                        ]
                    })
                    .addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_40037}", "150px", "Right", true ), // 학습장소
							new sap.m.Input({
								textAlign: "Begin",
								width: "443px",
								maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "Edrom", false),
								editable: false,
								value: "{Edrom}"
							}),
							new sap.m.RadioButtonGroup({
								layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
								width: "250px",
								editable: false,
								columns: 2,
								select: oController.onChangeRadio.bind(oController),
								selectedIndex: 0,
								buttons: [
									new sap.m.RadioButton({
										text: "{i18n>LABEL_40038}", // 국내교육
										width: "auto",
										selected: {
											path: "Natio",
											formatter: function(v) {
												return v === "1";
											}
										}
									}),
									new sap.m.RadioButton({
										text: "{i18n>LABEL_40039}", // 해외교육
										width: "auto",
										selected: {
											path: "Natio",
											formatter: function(v) {
												return v === "2";
											}
										}
									})
								]
							})
                        ]
                    })
                    .addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_40040}", "150px", "Right", true ), // 교육기관
							new sap.m.Input({
								textAlign: "Begin",
								width: "704px",
								maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "EdstaObjid", false),
								editable: false,
								value: "{Edsta}"
							})
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_40063}", "94px", "Right" ).addStyleClass("mr-0"), // 전달교육
                            new sap.m.VBox({
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            ViewTemplates.getLabel("header", "{i18n>LABEL_40047}", "40px", "Right" ), // 대상
                                            new sap.m.Input({
                                                textAlign: "Begin",
                                                width: "250px",
                                                maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "Pltgt", false),
                                                editable: {
                                                    parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
													formatter: function(v1, v2, v3) {
														return Common.checkNull(v3) && v1 === "99" && v2 === "1";
													}
                                                },
                                                value: "{Pltgt}"
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        items: [
                                            ViewTemplates.getLabel("header", "{i18n>LABEL_40045}", "40px", "Right" ), // 일시
                                            new PickOnlyDatePicker({
                                                width: "250px",
                                                dateValue: "{Pldat}",
                                                displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                                valueFormat: "yyyy-MM-dd",
                                                placeholder: "yyyy-mm-dd",
                                                editable: {
                                                    parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
													formatter: function(v1, v2, v3) {
														return Common.checkNull(v3) && v1 === "99" && v2 === "1";
													}
                                                }
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        items: [
                                            ViewTemplates.getLabel("header", "{i18n>LABEL_40046}", "40px", "Right" ), // 장소
                                            new sap.m.Input({
                                                textAlign: "Begin",
                                                width: "250px",
                                                maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "Plloc", false),
                                                editable: {
                                                    parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
													formatter: function(v1, v2, v3) {
														return Common.checkNull(v3) && v1 === "99" && v2 === "1";
													}
                                                },
                                                value: "{Plloc}"
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group")
                                ]
                            })
						]
					})
					.addStyleClass("search-field-group h-auto"),
					new sap.m.HBox({
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_40064}", "150px", "Right", true ), // 전달교육 내용요약
                            new sap.m.VBox({
                                items: [
                                    new sap.m.TextArea({
                                        rows: 3,
                                        width: "704px",
                                        value:"{Plcon}",
                                        editable: {
                                            parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
											formatter: function(v1, v2, v3) {
												return Common.checkNull(v3) && v1 === "99" && v2 === "1";
											}
                                        }
                                    }),
                                    fragment.COMMON_ATTACH_FILES.renderer(oController,"001")
                                ]
                            })
						]
					})
					.addStyleClass("search-field-group h-auto"),
					new sap.m.HBox({
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_40065}", "150px", "Right", true ), // 직무개선 방안요약
                            new sap.m.VBox({
                                items: [
                                    new sap.m.TextArea({
                                        rows: 3,
                                        width: "704px",
                                        value:"{Plimp}",
                                        editable: {
                                            parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
											formatter: function(v1, v2, v3) {
												return Common.checkNull(v3) && v1 === "99" && v2 === "1";
											}
                                        }
                                    }),
                                    fragment.COMMON_ATTACH_FILES.renderer(oController,"002")
                                ]
                            })
						]
					})
					.addStyleClass("search-field-group h-auto"),
					new sap.m.HBox({
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_40049}", "150px", "Right"), // 이수시간
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({text: "{i18n>MSG_40027}", width: "auto", textAlign: "Begin"}),
                                    new sap.m.Text({text: "{i18n>MSG_40028}", width: "auto", textAlign: "Begin"}),
                                    new sap.m.Text({text: "{i18n>MSG_40029}", width: "auto", textAlign: "Begin"}),
                                    fragment.COMMON_ATTACH_FILES.renderer(oController,"003")
                                ]
                            })
						]
					})
					.addStyleClass("search-field-group h-auto"),
                    new sap.m.HBox({
						items: [
                            new sap.m.HBox({
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_40067}", "150px", "Right"), // 학습자만족도
                                    oSatisCombo
                                ]
                            })
                            .addStyleClass("search-field-group"),
                            new sap.m.HBox({
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_40068}", "150px", "Right"), // 교육효과평가
                                    oEduEffectCombo
                                ]
                            })
                            .addStyleClass("search-field-group")
                        ]
                    })
                    .addStyleClass("search-field-group"),
                    new sap.m.HBox({
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_40048}", "150px", "Right"), // 이수기준
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
									ViewTemplates.getLabel("header", "{i18n>LABEL_40049}", "150px", "Right"), // 이수시간
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
									ViewTemplates.getLabel("header", "{i18n>LABEL_40050}", "150px", "Right"), // 이수점수
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
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.HBox({
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40051}", "150px", "Right"), // 선행자격요건
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
									ViewTemplates.getLabel("header", "{i18n>LABEL_40052}", "150px", "Right"), // 선행교육과정
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
									ViewTemplates.getLabel("header", "{i18n>LABEL_40053}", "150px", "Right"), // 관련자격요견
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
									ViewTemplates.getLabel("header", "{i18n>LABEL_40054}", "150px", "Right"), // 관련자격숙련도
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_40056}", "150px", "Right"), // 기타사항
							new sap.m.TextArea({
								rows: 3,
								width: "704px",
								value:"{Othtx}",
								editable: {
									parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
									formatter: function(v1, v2, v3) {
										return Common.checkNull(v3) && v1 === "99" && v2 === "1";
									}
								}
							})
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
								text: "{i18n>MSG_40001}",
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
								text: "{i18n>MSG_40002}",
								textAlign: "Begin"
							})
						]
					})
					.addStyleClass("mt-3px"),
					new sap.m.HBox({
						items: [
							new sap.ui.core.Icon({
								src: "sap-icon://information"
							})
							.addStyleClass("color-icon-blue mr-5px pt-5px"),
							new sap.m.Text({
								text: "{i18n>MSG_40003}",
								textAlign: "Begin"
							})
						]
					})
					.addStyleClass("mt-3px")
				]
			})
			.addStyleClass("mt-5px");
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_40001}",    // 사외위탁교육 신청
				contentWidth: "980px",
				contentHeight: "650px",
				buttons: [
					new sap.m.Button({
						press: oController.onDialogResultBtn.bind(oController),
						text: "{i18n>LABEL_40060}", // 신청
						visible: {
							parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
							formatter: function(v1, v2, v3) {
								return Common.checkNull(v3) && v1 === "99" && v2 === "1";
							}
						}
					}).addStyleClass("button-dark"),
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