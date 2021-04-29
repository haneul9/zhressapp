/* eslint-disable no-undef */
sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/PickOnlyDatePicker",
    "../delegate/ViewTemplates"
], function (Common, PageHelper, PickOnlyDatePicker, ViewTemplates) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "CostApply"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "CostApply-",
                title: "{i18n>LABEL_59013}", // 파견자 생활경비 신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
							press: oController.onDialogSaveBtn.bind(oController),
							text: "{i18n>LABEL_59029}", // 저장
							visible: {
								path: "Status",
								formatter: function (v) {
									return v === "AA";
								}
							}
						}).addStyleClass("button-light"),
                        new sap.m.Button({
							press: oController.onDialogApplyBtn.bind(oController),
							text: "{i18n>LABEL_59026}", // 신청
							visible: {
								parts: [{path: "Status"}, {path: "/EarlyApp"}],
								formatter: function (v1, v2) {
									return !v1 || (v1 === "99" && v2 === "X");
								}
							}
						}).addStyleClass("button-dark"),
                        new sap.m.Button({
							press: oController.onDialogDelBtn.bind(oController),
							text: "{i18n>LABEL_59028}", // 삭제
							visible: {
								path: "Status",
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
            var oLocationCombo1 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo1", { // 파견지
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				change: oController.checkLocation1.bind(oController),
				editable: {
					parts: [{path: "Status"}, {path: "/EarlyApp"}],
					formatter: function(v1, v2) {
						if (Common.checkNull(v2) && (!v1 || v1 === "AA")) return true;
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

            var oLocationCombo2 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo2", { // 파견지
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "97%",
				change: oController.checkLocation2.bind(oController),
				editable: {
					parts: [{path: "Status"}, {path: "/EarlyApp"}],
					formatter: function(v1, v2) {
						if (Common.checkNull(v2) && (!v1 || v1 === "AA")) return true;
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

            var oLocationCombo3 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo3", { // 기준지
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				change: oController.checkLocation3.bind(oController),
				editable: {
					parts: [{path: "Status"}, {path: "/EarlyApp"}],
					formatter: function(v1, v2) {
						if (Common.checkNull(v2) && (!v1 || v1 === "AA")) return true;
						return false;
					}
				},
				items: {
					path: "/LocationCombo3",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zwkpls}"
			});
			
			// 키보드 입력 방지
			oLocationCombo3.addDelegate({
				onAfterRendering: function () {
					oLocationCombo3.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oLocationCombo3);

            var oLocationCombo4 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo4", { // 기준지
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				change: oController.checkLocation4.bind(oController),
				editable: {
					parts: [{path: "Status"}, {path: "/EarlyApp"}],
					formatter: function(v1, v2) {
						if (Common.checkNull(v2) && (!v1 || v1 === "AA")) return true;
						return false;
					}
				},
				items: {
					path: "/LocationCombo4",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zlfpls}"
			});
			
			// 키보드 입력 방지
			oLocationCombo4.addDelegate({
				onAfterRendering: function () {
					oLocationCombo4.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oLocationCombo4);

            var oRangYearsB = new sap.m.ComboBox({
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				editable: {
					parts: [{path: "Status"}, {path: "/EarlyApp"}],
					formatter: function(v1, v2) {
						if (Common.checkNull(v2) && (!v1 || v1 === "AA")) return true;
						return false;
					}
				},
				items: {
					path: "/RangYearsB",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{RangYearB}"
			});
			
			// 키보드 입력 방지
			oRangYearsB.addDelegate({
				onAfterRendering: function () {
					oRangYearsB.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oRangYearsB);

            var oRangMonthB = new sap.m.ComboBox({
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "95%",
				editable: {
					parts: [{path: "Status"}, {path: "/EarlyApp"}],
					formatter: function(v1, v2) {
						if (Common.checkNull(v2) && (!v1 || v1 === "AA")) return true;
						return false;
					}
				},
				items: {
					path: "/RangMonthB",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{RangMonthB}"
			});
			
			// 키보드 입력 방지
			oRangMonthB.addDelegate({
				onAfterRendering: function () {
					oRangMonthB.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oRangMonthB);

            var oRangYearsE = new sap.m.ComboBox({
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				editable: {
					parts: [{path: "Status"}, {path: "/EarlyApp"}],
					formatter: function(v1, v2) {
						if (Common.checkNull(v2) && (!v1 || v1 === "AA")) return true;
						return false;
					}
				},
				items: {
					path: "/RangYearsE",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{RangYearsE}"
			});
			
			// 키보드 입력 방지
			oRangYearsE.addDelegate({
				onAfterRendering: function () {
					oRangYearsE.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oRangYearsE);

            var oRangMonthE = new sap.m.ComboBox({
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "95%",
				editable: {
					parts: [{path: "Status"}, {path: "/EarlyApp"}],
					formatter: function(v1, v2) {
						if (Common.checkNull(v2) && (!v1 || v1 === "AA")) return true;
						return false;
					}
				},
				items: {
					path: "/RangMonthE",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{RangMonthE}"
			});
			
			// 키보드 입력 방지
			oRangMonthE.addDelegate({
				onAfterRendering: function () {
					oRangMonthE.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oRangMonthE);

            var oEarlyYears = new sap.m.ComboBox(oController.PAGEID + "_EarlyYears", {
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				editable: {
					path: "/EarlyApp",
					formatter: function(v) {
						if (v === "X") return true;
						return false;
					}
				},
				items: {
					path: "/EarlyYears",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{EarlyYears}"
			});
			
			// 키보드 입력 방지
			oEarlyYears.addDelegate({
				onAfterRendering: function () {
					oEarlyYears.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oEarlyYears);

            var oEarlyMonth = new sap.m.ComboBox(oController.PAGEID + "_EarlyMonth", {
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "95%",
				editable: {
					path: "/EarlyApp",
					formatter: function(v) {
						if (v === "X") return true;
						return false;
					}
				},
				items: {
					path: "/EarlyMonth",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{EarlyMonth}"
			});
			
			// 키보드 입력 방지
			oEarlyMonth.addDelegate({
				onAfterRendering: function () {
					oEarlyMonth.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oEarlyMonth);
            
            var oBotFlexBox = new sap.m.VBox(oController.PAGEID + "_FilesBox", {
				width: "100%",
				height: "280px",
				fitContainer: true,
				items: [
					ViewTemplates.getLabel("header", "{i18n>LABEL_59021}", "150px", "Left").addStyleClass("sub-title mt-10px"), // 첨부파일
					new sap.m.VBox({
						fitContainer: true,
						items: [
							fragment.COMMON_ATTACH_FILES.renderer(oController,"001"),
							fragment.COMMON_ATTACH_FILES.renderer(oController,"002"),
							fragment.COMMON_ATTACH_FILES.renderer(oController,"003"),
							fragment.COMMON_ATTACH_FILES.renderer(oController,"004")						
						]
						
					}).addStyleClass("custom-multiAttach-file")
				]
			})
			.addStyleClass("/*search-field-group*/");

			var oFlexBox = new sap.m.HBox(oController.PAGEID + "_FileFlexBox", {
				fitContainer: true,
				items: [
					fragment.COMMON_ATTACH_FILES.renderer(oController,"005")
				]
			})
			.addStyleClass("mt-8px");

			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_59005}", "105px", "Left", true).addStyleClass("sub-con-title"), // 파견지
                            oLocationCombo1,
                            new sap.ui.core.Icon({ src: "sap-icon://arrow-right" }).addStyleClass("mx-3px"),
                            oLocationCombo2
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_59011}", "105px", "Left", true).addStyleClass("sub-con-title"), // 발령일자
							new PickOnlyDatePicker(oController.PAGEID + "_AppDate", {
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                dateValue: "{Zactdt}",
                                displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                valueFormat: "yyyy-MM-dd",
                                placeholder: "yyyy-mm-dd",
                                editable: {
                                    parts: [{path: "Status"}, {path: "/EarlyApp"}],
                                    formatter: function(v1, v2) {
                                        return Common.checkNull(v2) && (!v1 || v1 === "AA");
                                    }
                                }
                            })
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_59006}", "105px", "Left", true).addStyleClass("sub-con-title"), // 기혼/미혼 여부
							new sap.m.RadioButtonGroup(oController.PAGEID + "_RadioGroup", {
								layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
								width: "100%",
								editable: {
									parts: [{path: "Status"}, {path: "/EarlyApp"}],
									formatter: function(v1, v2) {
										return Common.checkNull(v2) && (!v1 || v1 === "AA");
									}
								},
								columns: 2,
								select: oController.onChangeRadio.bind(oController),
								selectedIndex: 0,
								buttons: [
									new sap.m.RadioButton({
										text: "{i18n>LABEL_59030}", // 기혼
										width: "auto",
										selected: {
											path: "Zmuflg",
											formatter: function(v) {
												return v === "1";
											}
										}
									}),
									new sap.m.RadioButton({
										text: "{i18n>LABEL_59031}", // 미혼
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
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_59015}", "105px", "Left", true).addStyleClass("sub-con-title"), // 거주지
							new sap.m.Input({
								textAlign: "Begin",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zadres", false),
								editable: {
									parts: [{path: "Status"}, {path: "/EarlyApp"}],
									formatter: function(v1, v2) {
										return Common.checkNull(v2) && (!v1 || v1 === "AA");
									}
								},
								value: "{Zadres}"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ // 교통비 지급 기준지
								text: "{i18n>LABEL_59007}",
								width: "105px",
								textAlign: "Left",
								required: true,
								wrapping: true
							}),
							oLocationCombo3,
							new sap.ui.core.Icon({ src: "sap-icon://arrow-right" }).addStyleClass("mx-5px"),
							oLocationCombo4
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_59016}", "105px", "Left", true).addStyleClass("sub-con-title"), // 비고
							new sap.m.Input({
								textAlign: "Begin",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Remark", false),
								editable: {
									parts: [{path: "Status"}, {path: "/EarlyApp"}],
									formatter: function(v1, v2) {
										return Common.checkNull(v2) && (!v1 || v1 === "AA");
									}
								},
								value: "{Remark}"
							})
						]
					}),
					new sap.m.HBox({
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_59008}", "105px", "Left", true).addStyleClass("sub-con-title"), // 숙소 계약기간
							new sap.m.VBox({
								items: [
									new sap.m.HBox({
										height: "40px",
										alignItems: sap.m.FlexAlignItems.Center,
										items: [
											oRangYearsB,
											oRangMonthB.addStyleClass("ml-5px")
										]
									}),
									new sap.m.HBox({
										height: "40px",
										alignItems: sap.m.FlexAlignItems.Center,
										items: [
											new sap.m.Text({text: "~"}),
											oRangYearsE,
											oRangMonthE.addStyleClass("ml-5px")
										]
									})
								]
							})
						]
					}),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_59009}", "105px", "Left", true).addStyleClass("sub-con-title"), // 조기 종료월
                            oEarlyYears,
							oEarlyMonth.addStyleClass("ml-5px")
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_59018}", "105px", "Left").addStyleClass("sub-con-title"), // 숙소비
                            new sap.m.Text({
                                width: "auto",
                                text: {
									path: "Zssamt",
									formatter: function(v) {
										return v ? Common.numberWithCommas(v) : "0";
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_59019}", "105px", "Left").addStyleClass("sub-con-title"),
                            new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                text: {
									path: "Ztramt",
									formatter: function(v) {
										return v ? Common.numberWithCommas(v) : "0";
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
                            ViewTemplates.getLabel("header", "{i18n>LABEL_59010}", "105px", "Left").addStyleClass("sub-con-title"), // 회사 지원금액
                            new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								width: "100%",
                                text: {
									path: "Zcoamt",
									formatter: function(v) {
										return v ? Common.numberWithCommas(v) : "0";
									}
								},
                                textAlign: "Begin"
                            })
                        ]
                    }),
                    new sap.m.VBox({
                        height: "auto",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Text({
                                text: "{i18n>MSG_59003}",
                                textAlign: "Begin"
                            }),
                            new sap.m.Text({
                                text: "{i18n>MSG_59004}",
                                textAlign: "Begin"
                            }),
                            new sap.m.Text({
                                text: "{i18n>MSG_59005}",
                                textAlign: "Begin"
                            }),
                            new sap.m.Text({
                                text: "{i18n>MSG_59006}",
                                textAlign: "Begin"
                            }),
                            new sap.m.Text({
                                text: "{i18n>MSG_59007}",
                                textAlign: "Begin"
                            })
                        ]
                    }),
                    oBotFlexBox,
                    oFlexBox
                ]
			})
			.addStyleClass("vbox-form-mobile");
		}
	});
});