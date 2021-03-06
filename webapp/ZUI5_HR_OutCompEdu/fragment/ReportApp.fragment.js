/* eslint-disable no-undef */
sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates",
	"../../common/ZHR_TABLES",
	"../../common/PickOnlyDateRangeSelection"
], function (Common, ViewTemplates, ZHR_TABLES, PickOnlyDateRangeSelection) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ReportApp", {

		createContent: function (oController) {
			
            var oEduCombo = new sap.m.ComboBox(oController.PAGEID + "_EduCombo", { // 교육구분
				width: "250px",
				editable: {
					parts: [{path: "Status1"}, {path: "/TraningCheck"}],
					formatter: function(v1, v2) {
						return (!v1 || v1 === "AA") && v2 === "Y";
					}
				},
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

            var oTypeCombo = new sap.m.ComboBox(oController.PAGEID + "_TypeCombo", { // 교육유형
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

            var oSelectCombo = new sap.m.ComboBox(oController.PAGEID + "_SelectCombo", { // 필수/선택
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
            
            var oNomalCombo = new sap.m.ComboBox(oController.PAGEID + "_NomalCombo", { // 법정/일반
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

			var oAttTable = new sap.ui.table.Table(oController.PAGEID + "_AttTable", {
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
			
			ZHR_TABLES.makeColumn(oController, oAttTable, [
				{id: "Pchk", 		label: ""				   /* CheckBox */,	plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true, width: "50px", templateGetter:"getDCheckBox"},
				{id: "Stext1",		label: "{i18n>LABEL_40030}" /* 부서명 */,  	plabel: "",  resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
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
                                    new sap.m.Input(oController.PAGEID + "TrainingInput", {
                                        textAlign: "Begin",
                                        width: "550px",
                                        maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "Edkaj", false),
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
									new sap.m.Text({ text: "{i18n>LABEL_40072}", textAlign: "Begin" })
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
												visible: {
													path: "Status1",
													formatter: function(v1) {
														return !v1 || v1 === "AA";
													}
												}
											}).addStyleClass("button-light-sm mr-5px"),
											new sap.m.Button({
												icon: "sap-icon://less",
												press: oController.onPressDelRow.bind(oController),
												text: "{i18n>LABEL_40011}", // 삭제
												visible: {
													path: "Status1",
													formatter: function(v1) {
														return !v1 || v1 === "AA";
													}
												}
											}).addStyleClass("button-light-sm")
										]
									})
									.addStyleClass("mt-6px"),
									oAttTable
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
										editable: {
											path: "Status1",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										},
										dateValue: "{Begdhb}",
										secondDateValue: "{Enddhe}"
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								width: "100%",
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40036}", "150px", "Right", true), // 학습시간
									new sap.m.Input({
										textAlign: "Begin",
										width: "250px",
										maxLength: 6,
										liveChange: oController.getAttTime.bind(oController),
										editable: {
											path: "Status1",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										},
										value: "{Trtim}"
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_40037}", "150px", "Right", true ), // 학습장소
							new sap.m.Input({
								textAlign: "Begin",
								width: "443px",
								maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "Edrom", false),
								editable: {
									path: "Status1",
									formatter: function(v1) {
										return !v1 || v1 === "AA";
									}
								},
								value: "{Edrom}"
							}),
							new sap.m.RadioButtonGroup(oController.PAGEID + "_RadioGroup", {
								layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
								width: "250px",
								editable: {
									path: "Status1",
									formatter: function(v1) {
										return !v1 || v1 === "AA";
									}
								},
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
												return v === "01";
											}
										}
									}),
									new sap.m.RadioButton({
										text: "{i18n>LABEL_40039}", // 해외교육
										width: "auto",
										selected: {
											path: "Natio",
											formatter: function(v) {
												return v === "02";
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
								maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "Edsta", false),
								editable: {
									path: "Status1",
									formatter: function(v1) {
										return !v1 || v1 === "AA";
									}
								},
								value: "{Edsta}"
							})
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						items: [
							new sap.m.HBox({
                                items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40041}", "150px", "Right", true ), // 인당교육비
									new sap.m.Input({
										textAlign: "End",
										width: "250px",
										maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "Costp", false),
										liveChange: oController.getMoneyComma1.bind(oController),
										editable: {
											path: "Status1",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										},
										value: {
											path: "Costp",
											formatter: function(v) {
												if(v) return Common.numberWithCommas(v);
												else return "0";
											}
										}
									})
								]
							})
							.addStyleClass("search-field-group mr-30px"),
							new sap.m.HBox({
                                items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40042}", "150px", "Right" ), // 부가세
									new sap.m.Input({
										textAlign: "End",
										width: "250px",
										maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOutApplyTableIn1", "Vatax", false),
										liveChange: oController.getMoneyComma2.bind(oController),
										editable: {
											path: "Status1",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										},
										value: {
											path: "Vatax",
											formatter: function(v) {
												if(v) return Common.numberWithCommas(v);
												else return "0";
											}
										}
									})
								]
							})
							.addStyleClass("search-field-group")
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_40044}", "150px", "Right", true ), // 전담교육 실시계획
							new sap.m.TextArea({
								rows: 3,
								width: "704px",
								value:"{Planx}",
								editable: {
									path: "Status1",
									formatter: function(v1) {
										return !v1 || v1 === "AA";
									}
								}
							})
						]
					})
					.addStyleClass("search-field-group h-auto"),
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
										text: "{Times}",
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_40055}", "150px", "Right"), // 보고서필수
							new sap.m.Text({
								text: "{Rptyn}",
								textAlign: "Begin"
							})
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
									path: "Status1",
									formatter: function(v1) {
										return !v1 || v1 === "AA";
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
					.addStyleClass("mt-3px")
				]
			})
			.addStyleClass("mt-5px");

			var oFlexBox = new sap.m.HBox(oController.PAGEID + "_FileFlexBox", {
				fitContainer: true,
				items: [
					fragment.COMMON_ATTACH_FILES.renderer(oController,"001")
				]
			});
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_40001}",    // 사외위탁교육 신청
				contentWidth: "980px",
				contentHeight: "650px",
				beforeOpen: oController.onBeforeReportDialog.bind(oController),
				afterOpen: oController.onAfterReportDialog.bind(oController),
				buttons: [
					new sap.m.Button({
						press: oController.onDialogApplyBtn.bind(oController),
						text: "{i18n>LABEL_40022}", // 신규저장,
						visible: {
							path: "Status1",
							formatter: function(v) {
								return !v;
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onDialogSaveBtn.bind(oController),
						text: "{i18n>LABEL_40022}", // 저장,
						visible: {
							path: "Status1",
							formatter: function (v) {
								return v === "AA";
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onDialogDelBtn.bind(oController),
						text: "{i18n>LABEL_40011}", // 삭제
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
					oTextBox,
					oFlexBox
                ]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
			.addStyleClass("custom-dialog-popup");

			return oDialog;
		}
	});
});