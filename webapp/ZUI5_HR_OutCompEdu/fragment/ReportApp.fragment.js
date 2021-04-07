$.sap.require("fragment.COMMON_ATTACH_FILES");
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
				width: "150px",
				editable: {
					path: "Status",
					formatter: function(v1) {
						return !v1 || v1 === "AA";
					}
				},
				items: {
					path: "/EduCombo",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zfwkps}"
			});
			
			// 키보드 입력 방지
			oEduCombo.addDelegate({
				onAfterRendering: function () {
					oEduCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oEduCombo);

            var oTypeCombo = new sap.m.ComboBox(oController.PAGEID + "_TypeCombo", { // 교육유형
				width: "150px",
				editable: {
					path: "Status",
					formatter: function(v1) {
						return !v1 || v1 === "AA";
					}
				},
				items: {
					path: "/TypeCombo",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zfwkps}"
			});
			
			// 키보드 입력 방지
			oTypeCombo.addDelegate({
				onAfterRendering: function () {
					oTypeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oTypeCombo);

            var oSelectCombo = new sap.m.ComboBox(oController.PAGEID + "_SelectCombo", { // 필수/선택
				width: "150px",
				editable: {
					path: "Status",
					formatter: function(v1) {
						return !v1 || v1 === "AA";
					}
				},
				items: {
					path: "/SelectCombo",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zfwkps}"
			});
			
			// 키보드 입력 방지
			oSelectCombo.addDelegate({
				onAfterRendering: function () {
					oSelectCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oSelectCombo);
            
            var oNomalCombo = new sap.m.ComboBox(oController.PAGEID + "_NomalCombo", { // 법정/일반
				width: "150px",
				editable: {
					path: "Status",
					formatter: function(v1) {
						return !v1 || v1 === "AA";
					}
				},
				items: {
					path: "/NomalCombo",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zfwkps}"
			});
			
			// 키보드 입력 방지
			oNomalCombo.addDelegate({
				onAfterRendering: function () {
					oNomalCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oNomalCombo);

            var oTimeCombo = new sap.m.ComboBox(oController.PAGEID + "_TimeCombo", { // 학습시간 (시)
				width: "70px",
				editable: {
					path: "Status",
					formatter: function(v1) {
						return !v1 || v1 === "AA";
					}
				},
				items: {
					path: "/TimeCombo",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zfwkps}"
			});
			
			// 키보드 입력 방지
			oTimeCombo.addDelegate({
				onAfterRendering: function () {
					oTimeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oTimeCombo);

            var oTimeCombo2 = new sap.m.ComboBox(oController.PAGEID + "_TimeCombo2", { // 학습시간 (분)
				width: "70px",
				editable: {
					path: "Status",
					formatter: function(v1) {
						return !v1 || v1 === "AA";
					}
				},
				items: {
					path: "/TimeCombo2",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zfwkps}"
			});
			
			// 키보드 입력 방지
			oTimeCombo2.addDelegate({
				onAfterRendering: function () {
					oTimeCombo2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oTimeCombo2);

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
				{id: "Pchk", 	label: ""				   /* CheckBox */,	plabel: "", resize: true, span: 0, type: "Checkbox",  sort: true,  filter: true, width: "auto"},
				{id: "Zssamt",  label: "{i18n>LABEL_40030}" /* 부서명 */,  	plabel: "",  resize: true, span: 0, type: "currency",  sort: true,  filter: true,  width: "auto"},
				{id: "Ztramt",  label: "{i18n>LABEL_40031}" /* 직급 */,     plabel: "",  resize: true, span: 0, type: "currency", sort: true,  filter: true,  width: "auto"},
				{id: "Zcoamt", 	label: "{i18n>LABEL_40032}" /* 성명 */,		plabel: "" , resize: true, span: 0, type: "currency", sort: true,  filter: true,  width: "auto"}
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
                                        width: "715px",
                                        maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "DispatchApplyTableIn1", "Zadres", false),
                                        editable: {
                                            path: "Status",
                                            formatter: function(v1) {
                                                return !v1 || v1 === "AA";
                                            }
                                        },
                                        value: "{Zadres}"
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
							}).addStyleClass("search-field-group"),
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_40028}", "150px", "Right", true ), // 참석자
							new sap.m.VBox({
								items: [
									new sap.m.HBox({
										alignContent: sap.m.FlexAlignContent.End,
										alignItems: sap.m.FlexAlignItems.End,
										items: [
											new sap.m.Button({
												icon: "sap-icon://add",
												press: oController.onPressAddRow,
												text: "{i18n>LABEL_40034}", // 추가
												visible: {
													path: "Status",
													formatter: function(v1) {
														return !v1 || v1 === "AA";
													}
												}
											}).addStyleClass("button-light-sm"),
											new sap.m.Button({
												icon: "sap-icon://less",
												press: oController.onPressDelRow,
												text: "{i18n>LABEL_40011}", // 삭제
												visible: {
													path: "Status",
													formatter: function(v1) {
														return !v1 || v1 === "AA";
													}
												}
											}).addStyleClass("button-light-sm")
										]
									}),
									oAttTable
								]
							})
                        ]
                    })
                    .addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_40035}", "150px", "Right", true), // 학습기간
							new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
								width: "250px",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: "{Begdhb}",
								secondDateValue: "{Enddhe}"
							}),
							ViewTemplates.getLabel("header", "{i18n>LABEL_40036}", "150px", "Right", true), // 학습시간
							oTimeCombo,
							new sap.m.Text({ text: " : " }),
							oTimeCombo2
                        ]
                    })
                    .addStyleClass("search-field-group"),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_59016}", "150px", "Right" ), // 학습장소
							new sap.m.Input({
								textAlign: "Begin",
								width: "715px",
								maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "DispatchApplyTableIn1", "Remark", false),
								editable: {
									path: "Status",
									formatter: function(v1) {
										return !v1 || v1 === "AA";
									}
								},
								value: "{Remark}"
							}),
							new sap.m.RadioButtonGroup(oController.PAGEID + "_RadioGroup", {
								layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
								width: "250px",
								editable: {
									path: "Status",
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
											path: "Zmuflg",
											formatter: function(v) {
												return v === "1";
											}
										}
									}),
									new sap.m.RadioButton({
										text: "{i18n>LABEL_40039}", // 해외교육
										width: "auto",
										selected: {
											path: "Zmuflg",
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
								width: "715px",
								maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "DispatchApplyTableIn1", "Remark", false),
								editable: {
									path: "Status",
									formatter: function(v1) {
										return !v1 || v1 === "AA";
									}
								},
								value: "{Remark}"
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
										textAlign: "Begin",
										width: "250px",
										maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "DispatchApplyTableIn1", "Remark", false),
										editable: {
											path: "Status",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										},
										value: "{Remark}"
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
                                items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40042}", "150px", "Right", true ), // 부가세
									new sap.m.Input({
										textAlign: "Begin",
										width: "250px",
										maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "DispatchApplyTableIn1", "Remark", false),
										editable: {
											path: "Status",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										},
										value: "{Remark}"
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
                                items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40044}", "150px", "Right", true ), // 전달교육 실시계획
									new sap.m.TextArea({
										rows: 3,
										width: "715px",
										value:"{Detail}",
										editable: {
											path: "Status",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										}
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
                                items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_59009}", "150px", "Right", true ), // 이수기준
									new sap.m.Input({
										textAlign: "Begin",
										width: "250px",
										maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "DispatchApplyTableIn1", "Remark", false),
										editable: {
											path: "Status",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										},
										value: "{Remark}"
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
                                items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_59009}", "150px", "Right", true ), // 이수점수
									new sap.m.Input({
										textAlign: "Begin",
										width: "250px",
										maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "DispatchApplyTableIn1", "Remark", false),
										editable: {
											path: "Status",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										},
										value: "{Remark}"
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
                                items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_59009}", "150px", "Right", true ), // 보고서필수
									new sap.m.Input({
										textAlign: "Begin",
										width: "250px",
										maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "DispatchApplyTableIn1", "Remark", false),
										editable: {
											path: "Status",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										},
										value: "{Remark}"
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
                                items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_40056}", "150px", "Right"), // 기타사항
									new sap.m.TextArea({
										rows: 3,
										width: "715px",
										value:"{Detail}",
										editable: {
											path: "Status",
											formatter: function(v1) {
												return !v1 || v1 === "AA";
											}
										}
									})
								]
							})
							.addStyleClass("search-field-group")
						]
					})
					.addStyleClass("search-field-group")
                ]
            })
			.addStyleClass("search-inner-vbox");

			var oTextBox = new sap.m.VBox({
				width: "100%",
				fitContainer: true,
				items: [
					new sap.m.Text({
						text: "{i18n>MSG_40001}",
						textAlign: "Begin"
					}),
					new sap.m.Text({
						text: "{i18n>MSG_40002}",
						textAlign: "Begin"
					}),
					new sap.m.Text({
						text: "{i18n>MSG_40003}",
						textAlign: "Begin"
					})
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
				buttons: [
					new sap.m.Button({
						press: oController.onDialogApplyBtn.bind(oController),
						text: "{i18n>LABEL_40060}", // 신청,
						visible: {
							path: "Status",
							formatter: function(v) {
								return !v;
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: oController.onDialogSaveBtn.bind(oController),
						text: "{i18n>LABEL_40022}", // 저장,
						visible: {
							path: "Status",
							formatter: function (v) {
								return v === "AA";
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onDialogDelBtn.bind(oController),
						text: "{i18n>LABEL_40011}", // 삭제
						visible: {
							path: "Status",
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