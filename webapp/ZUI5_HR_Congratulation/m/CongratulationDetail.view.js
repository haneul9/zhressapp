sap.ui.define(
    [
        "common/PageHelper" //
    ],
    function (PageHelper) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "CongratulationDetail"].join($.app.getDeviceSuffix());

        sap.ui.jsview(SUB_APP_ID, {
            getControllerName: function () {
                return SUB_APP_ID;
            },

            createContent: function (oController) {
                return new PageHelper({
                    idPrefix: "CongratulationDetail-",
                    title: "{i18n>LABEL_08022}", // 경조금신청
                    showNavButton: true,
                    navBackFunc: oController.navBack,
                    headerButton: new sap.m.FlexBox({
                        items: [
                            new sap.m.Button({
                                press: $.proxy(oController.onPressSave, oController),
                                text: "{i18n>LABEL_08002}", // 저장
                                visible: {
                                    path: "Status",
                                    formatter: function (v) {
                                        if (v === "AA") return true;
                                        return false;
                                    }
                                }
                            }).addStyleClass("button-light"),
                            new sap.m.Button({
                                press: $.proxy(oController.onPressApply, oController),
                                text: "{i18n>LABEL_08001}", // 신청
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
                                text: "{i18n>LABEL_08003}", // 삭제
                                visible: {
                                    path: "Status",
                                    formatter: function (v) {
                                        if (v === "AA") return true;
                                        return false;
                                    }
                                }
                            }).addStyleClass("button-light")
                        ]
                    })
                        .addStyleClass("app-nav-button-right")
                        .setModel(oController.DetailModel)
                        .bindElement("/FormData"),
                    contentStyleClass: "sub-app-content",
                    contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                    contentItems: [this.getApplyInputBox(oController)]
                });
            },

            getApplyInputBox: function (oController) {
                var vBukrs = oController.getUserGubun();
                var oStartDatePicker = new sap.m.DatePicker(oController.PAGEID + "_StartDatePicker", {
                    width: "80%",
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    dateValue: "{StartDate}",
                    displayFormat: "{Dtfmt}",
                    valueFormat: "yyyy-MM-dd",
                    placeholder: "yyyy-mm-dd",
                    change: $.proxy(oController.onSelectBox, oController),
                    editable: {
                        path: "Status",
                        formatter: function (v) {
                            if (!v || v === "AA") return true;
                            return false;
                        }
                    }
                });

                // 키보드 입력 방지
                oStartDatePicker.addDelegate(
                    {
                        onAfterRendering: function () {
                            oStartDatePicker.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oStartDatePicker
                );

                var oTypeComboBox = new sap.m.ComboBox(oController.PAGEID + "_Type", {
                    width: "100%",
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    selectedKey: "{Type}",
                    change: $.proxy(oController.onSelectBox, oController),
                    items: {
                        path: "/MultiBoxData",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    editable: {
                        path: "Status",
                        formatter: function (v) {
                            if (!v || v === "AA") return true;
                            return false;
                        }
                    }
                });

                // 키보드 입력 방지
                oTypeComboBox.addDelegate(
                    {
                        onAfterRendering: function () {
                            oTypeComboBox.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oTypeComboBox
                );

                var oBirthDayDate = new sap.m.DatePicker(oController.PAGEID + "_BirthDay", {
                    width: "80%",
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    dateValue: "{Fgbdt}",
                    displayFormat: "{Dtfmt}",
                    valueFormat: "yyyy-MM-dd",
                    placeholder: "yyyy-mm-dd",
                    editable: {
                        path: "Status",
                        formatter: function (v) {
                            if (!v || v === "AA") return true;
                            return false;
                        }
                    }
                });

                // 키보드 입력 방지
                oBirthDayDate.addDelegate(
                    {
                        onAfterRendering: function () {
                            oBirthDayDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oBirthDayDate
                );

                return new sap.m.VBox({
                    items: [
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08005}" }).addStyleClass("sub-con-title"), // 신청일
                                new sap.m.DatePicker({
                                    width: "80%",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    displayFormat: "{Dtfmt}",
                                    editable: false,
                                    dateValue: "{Begda}",
                                    valueFormat: "yyyy-MM-dd",
                                    placeholder: "yyyy-mm-dd"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08008}", required: true }).addStyleClass("sub-con-title"), // 경조일
                                oStartDatePicker
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08007}", required: true }).addStyleClass("sub-con-title"), // 대상자
                                new sap.m.Input({
                                    width: "100%",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    value: "{Zname}",
                                    editable: {
                                        path: "Status",
                                        formatter: function (v) {
                                            if (!v || v === "AA") return true;
                                            return false;
                                        }
                                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                // 안내 메세지
                                new sap.m.FlexBox({
                                    alignItems: sap.m.FlexAlignItems.Start,
                                    items: [
                                        new sap.ui.core.Icon({
                                            // 경고 문자
                                            src: "sap-icon://information",
                                            size: "1.0rem"
                                            //	color: "#F45757"
                                        }).addStyleClass("color-icon-blue"),
                                        new sap.m.Text(oController.PAGEID + "_IconText", {})
                                    ]
                                }).addStyleClass("vbox-form-infotext")
                            ]
                        }),
                        new sap.m.HBox(oController.PAGEID + "_BirthDayBox", {
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", required: true, text: "{i18n>LABEL_08029}" }).addStyleClass("sub-con-title"), // 생년 월일
                                oBirthDayDate
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08006}", required: true }).addStyleClass("sub-con-title"), // 경조 유형
                                oTypeComboBox
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "" }).addStyleClass("sub-con-title"), // Empty
                                new sap.m.CheckBox(oController.PAGEID + "_TypeCheck", {
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    text: "{i18n>LABEL_08026}", //상조도우미 사용
                                    select: $.proxy(oController.onCheckPress, oController),
                                    selected: {
                                        path: "Fmaid",
                                        formatter: function (v) {
                                            if (v === "X") return true;
                                            return false;
                                        }
                                    }
                                })
                            ],
                            visible: {
                                parts: [{ path: "isVisibleType" }, { path: vBukrs }],
                                formatter: function (v1, v2) {
                                    if (v1 === true && vBukrs !== "A100") return true;
                                    else return false;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "" }), // Empty
                                new sap.m.CheckBox(oController.PAGEID + "_VehicleCheck", {
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    text: "{i18n>LABEL_08028}", //차량지원 사용
                                    select: $.proxy(oController.onCheckPress, oController),
                                    selected: {
                                        path: "Caaid",
                                        formatter: function (v) {
                                            if (v === "X") return true;
                                            return false;
                                        }
                                    }
                                }).addStyleClass("custom-support")
                            ],
                            visible: {
                                parts: [{ path: "isVisibleVehicle" }, { path: vBukrs }],
                                formatter: function (v1, v2) {
                                    if (v1 === true && vBukrs !== "A100") return true;
                                    else return false;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08010}" }).addStyleClass("sub-con-title"), // 기본급
                                new sap.m.Text({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    text: "{BasicT}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08011}" }).addStyleClass("sub-con-title"), // 경조율
                                new sap.m.Text({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    text: {
                                        path: "Rate",
                                        formatter: function (v) {
                                            if (v) {
                                                return Number(v) + "%";
                                            } else {
                                                return;
                                            }
                                        }
                                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08012}" }).addStyleClass("sub-con-title"), // 경조 금액
                                new sap.m.Text({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    text: "{AmountT}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08009}" }).addStyleClass("sub-con-title"), // 경조 지역
                                new sap.m.Input({
                                    width: "100%",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    value: "{Zarea}",
                                    editable: {
                                        path: "Status",
                                        formatter: function (v) {
                                            if (!v || v === "AA") return true;
                                            return false;
                                        }
                                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08015}" }).addStyleClass("sub-con-title"), // 비고
                                new sap.m.Input({
                                    width: "100%",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    value: "{Zbigo}",
                                    editable: {
                                        path: "Status",
                                        formatter: function (v) {
                                            if (!v || v === "AA") return true;
                                            return false;
                                        }
                                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "42px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({ width: "105px", text: "{i18n>LABEL_08016}" }).addStyleClass("sub-con-title"), // 처리결과
                                new sap.m.Text({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    text: "{StatusText}"
                                })
                            ],
                            visible: {
                                path: "Status",
                                formatter: function (v) {
                                    if (v) return true;
                                    return false;
                                }
                            }
                        }),
                        new sap.m.HBox({
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)]
                        })
                    ]
                })
                    .addStyleClass("vbox-form-mobile")
                    .setModel(oController.DetailModel)
                    .bindElement("/FormData");
            }

            // getApplyInputBox: function(oController) {
            // 	var vBukrs = oController.getUserGubun();

            // 	return new sap.m.VBox({
            // 		items: [
            // 			new sap.m.HBox({
            // 				items: [
            // 					new sap.m.VBox({
            // 						width: "30%",
            // 						items: [
            // 							new sap.m.Label({
            // 								// 신청일
            // 								text: "{i18n>LABEL_08005}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								textAlign: "Begin"
            // 							}),
            // 							new sap.m.Label(oController.PAGEID + "_StartD", {
            // 								// 경조일
            // 								text: "{i18n>LABEL_08008}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								required: true,
            // 								textAlign: "Begin"
            // 							}),
            // 							new sap.m.Label({
            // 								//빈공간
            // 							}),
            // 							new sap.m.Label({
            // 								//대상자
            // 								text: "{i18n>LABEL_08007}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								required: true,
            // 								textAlign: "Begin"
            // 							}),
            // 							new sap.m.Label({
            // 								// 경조 유형
            // 								text: "{i18n>LABEL_08006}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								required: true,
            // 								textAlign: "Begin"
            // 							}),
            // 							new sap.m.Label(oController.PAGEID + "_EmptyLabel", {
            // 								//빈공간
            // 								visible: {
            // 									path: "EmptyLabel",
            // 									formatter: function (v){
            // 										if(v === true) return true;
            // 										else return false;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.Label({
            // 								// 기본급
            // 								text: "{i18n>LABEL_08010}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								textAlign: "Begin",
            // 								visible: {
            // 									path: vBukrs,
            // 									formatter: function () {
            // 										if(vBukrs === "A100") return false;
            // 										return true;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.Label({
            // 								// 경조율
            // 								text: "{i18n>LABEL_08011}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								textAlign: "Begin",
            // 								visible: {
            // 									path: vBukrs,
            // 									formatter: function () {
            // 										if(vBukrs === "A100") return false;
            // 										return true;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.Label({
            // 								// 경조 금액
            // 								text: "{i18n>LABEL_08012}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								textAlign: "Begin",
            // 								visible: {
            // 									path: vBukrs,
            // 									formatter: function () {
            // 										if(vBukrs === "A100") return false;
            // 										return true;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.Label({
            // 								text: "{i18n>LABEL_08013}", // 회사 경조금
            // 								design: "Bold",
            // 								width: "100px",
            // 								textAlign: "End",
            // 								visible: {
            // 									path: vBukrs,
            // 									formatter: function () {
            // 										if(vBukrs === "A100") return true;
            // 										return false;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.Label({
            // 								// 경조 지역
            // 								text: "{i18n>LABEL_08009}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								textAlign: "Begin"
            // 							}),
            // 							new sap.m.Label({
            // 								// 비고
            // 								text: "{i18n>LABEL_08015}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								textAlign: "Begin"
            // 							}),
            // 							new sap.m.Label({
            // 								// 처리결과
            // 								text: "{i18n>LABEL_08016}",
            // 								design: "Bold",
            // 								width: "75px",
            // 								textAlign: "Begin",
            // 								visible: {
            // 									path: "Status",
            // 									formatter: function (v) {
            // 										if (v) return true;
            // 										return false;
            // 									}
            // 								}
            // 							}),
            // 						]
            // 					}).addStyleClass("info-field-group"),
            // 					new sap.m.VBox({
            // 						width: "70%",
            // 						items: [
            // 							new sap.m.DatePicker(oController.PAGEID + "_ADate", {
            // 								dateValue: "{AppDate}",
            // 								width: "170px",
            // 								//displayFormat: oController.getSessionInfoByKey("Dtfmt"),
            // 								valueFormat: "yyyy-MM-dd",
            // 								placeholder:"yyyy-mm-dd",
            // 								editable: false,
            // 								textAlign: "Begin"
            // 							}),
            // 							new sap.m.DatePicker(oController.PAGEID + "_StartDatePicker", {
            // 								change: $.proxy(oController.onSelectBox, oController),
            // 								dateValue: "{StartDate}",
            // 								width: "170px",
            // 								valueFormat: "yyyy-MM-dd",
            // 								textAlign: "Begin",
            // 								placeholder:"yyyy-mm-dd",
            // 								//displayFormat: oController.getSessionInfoByKey("Dtfmt"),
            // 								editable: {
            // 									path: "Status",
            // 									formatter: function (v) {
            // 										if (!v || v === "AA") return true;
            // 										return false;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.FlexBox({
            // 								direction: "Column",
            // 								items: [
            // 									new sap.m.FlexBox({
            // 										fitContainer: true,
            // 										items: [
            // 											new sap.ui.core.Icon({
            // 												src: "sap-icon://alert",
            // 												color: "#da291c",
            // 											})
            // 											.addStyleClass("info-text-red mt-18px ml-25px"),
            // 											new sap.m.Text(oController.PAGEID + "_IconText", {
            // 												// 경고 문자
            // 												textAlign: "Begin"
            // 											})
            // 											.addStyleClass("font-13px line-height")
            // 										]
            // 									}),
            // 									new sap.m.Input(oController.PAGEID + "_Zname", {
            // 										value: "{Zname}",
            // 										width: "170px",
            // 										textAlign: "Begin",
            // 										editable: {
            // 											path: "Status",
            // 											formatter: function (v) {
            // 												if (!v || v === "AA") return true;
            // 												return false;
            // 											}
            // 										}
            // 									})
            // 								]
            // 							}),
            // 							new sap.m.FlexBox({
            // 								direction: "Column",
            // 								items: [
            // 									new sap.m.ComboBox(oController.PAGEID + "_Type", {
            // 										change: $.proxy(oController.onSelectBox, oController),
            // 										items: {
            // 											path: "/MultiBoxData",
            // 											template: new sap.ui.core.ListItem({
            // 												key: "{Code}",
            // 												text: "{Text}"
            // 											})
            // 										},
            // 										selectedKey: "{Type}",
            // 										width: "170px",
            // 										textAlign: "Begin",
            // 										editable: {
            // 											path: "Status",
            // 											formatter: function (v) {
            // 												if (!v || v === "AA") return true;
            // 												return false;
            // 											}
            // 										}
            // 									}),
            // 									new sap.m.CheckBox(oController.PAGEID + "_TypeCheck", {
            // 										text: "{i18n>LABEL_08026}", //상조도우미 사용
            // 										select : $.proxy(oController.onCheckPress, oController),
            // 										selected: {
            // 											path: "Fmaid",
            // 											formatter: function(v) {
            // 												if(v === "X") return true;
            // 												return false;
            // 											}
            // 										},
            // 										visible: {
            // 											parts: [
            // 												{path: "isVisibleType"},
            // 												{path: vBukrs}
            // 											],
            // 											formatter: function (v1, v2) {
            // 												if(v1 === true && vBukrs !== "A100") return true;
            // 												else return false;
            // 											}
            // 										}
            // 									})
            // 									.addStyleClass("font-12px"),
            // 									new sap.m.CheckBox(oController.PAGEID + "_VehicleCheck", {
            // 										text: "{i18n>LABEL_08028}", //차량지원 사용
            // 										selected: {
            // 											path: "Caaid",
            // 											formatter: function(v) {
            // 												if(v === "X") return true;
            // 												return false;
            // 											}
            // 										},
            // 										visible: {
            // 											parts: [
            // 												{path: "isVisibleVehicle"},
            // 												{path: vBukrs}
            // 											],
            // 											formatter: function (v1, v2) {
            // 												if(v1 === true && vBukrs !== "A100") return true;
            // 												else return false;
            // 											}
            // 										}
            // 									})
            // 									.addStyleClass("font-12px")
            // 								]
            // 							})
            // 							.addStyleClass("margin-left"),
            // 							new sap.m.Text(oController.PAGEID + "_BasicT", {
            // 								text: "{BasicT}",
            // 								textAlign: "End",
            // 								width: "200px",
            // 								visible: {
            // 									path: vBukrs,
            // 									formatter: function () {
            // 										if(vBukrs === "A100") return false;
            // 										return true;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.Text(oController.PAGEID + "_Rate", {
            // 								text: {
            // 									path: "Rate",
            // 									formatter: function (v) {
            // 										if (v) {
            // 											return Number(v) + "%";
            // 										} else {
            // 											return;
            // 										}
            // 									}
            // 								},
            // 								visible: {
            // 									path: vBukrs,
            // 									formatter: function () {
            // 										if(vBukrs === "A100") return false;
            // 										return true;
            // 									}
            // 								},
            // 								textAlign: "Begin",
            // 								width: "200px"
            // 							}),
            // 							new sap.m.Text(oController.PAGEID + "_AmountT", {
            // 								text: "{AmountT}",
            // 								textAlign: "Begin",
            // 								width: "200px",
            // 								visible: {
            // 									path: vBukrs,
            // 									formatter: function () {
            // 										if(vBukrs === "A100") return false;
            // 										return true;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.Text(oController.PAGEID + "_CopayT", {
            // 								text: "{CopayT}",
            // 								textAlign: "Begin",
            // 								width: "200px",
            // 								visible: {
            // 									path: vBukrs,
            // 									formatter: function () {
            // 										if(vBukrs === "A100") return true;
            // 										return false;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.FlexBox({
            // 								items: [
            // 									new sap.ui.core.Icon({
            // 										// 경고 문자
            // 										src: "sap-icon://alert",
            // 										size: "1.0rem",
            // 										color: "#da291c"
            // 									})
            // 									.addStyleClass("info-text-red"),
            // 									new sap.m.Text(oController.PAGEID + "_CopayTMsg", {
            // 										text: ""
            // 									})
            // 									.addStyleClass("font-13px")
            // 								],
            // 								visible: {
            // 									path: vBukrs,
            // 									formatter: function () {
            // 										if(vBukrs !== "A100") return false;
            // 										return true;
            // 									}
            // 								}
            // 							}).addStyleClass("ml-3px mb-13px"),
            // 							new sap.m.Input(oController.PAGEID + "_Zarea", {
            // 								value: "{Zarea}",
            // 								textAlign: "Begin",
            // 								width: "200px",
            // 								editable: {
            // 									path: "Status",
            // 									formatter: function (v) {
            // 										if (!v || v === "AA") return true;
            // 										return false;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.Input(oController.PAGEID + "_Zbigo", {
            // 								value: "{Zbigo}",
            // 								textAlign: "Begin",
            // 								width: "240px",
            // 								editable: {
            // 									path: "Status",
            // 									formatter: function (v) {
            // 										if (!v || v === "AA") return true;
            // 										return false;
            // 									}
            // 								}
            // 							}),
            // 							new sap.m.Text(oController.PAGEID + "_StatusText", {
            // 								text: "{StatusText}",
            // 								width: "100px",
            // 								textAlign: "Begin",
            // 								visible: {
            // 									path: "Status",
            // 									formatter: function (v) {
            // 										if (v) return true;
            // 										return false;
            // 									}
            // 								}
            // 							})
            // 						]
            // 					}).addStyleClass("info-field-group")
            // 				]
            // 			}),
            // 			new sap.m.FlexBox({
            // 				items: [
            // 					sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
            // 				]
            // 			}).addStyleClass("pl-10px pr-10px")
            // 		]
            // 	})
            // 	.addStyleClass("info-box-mobile")
            // 	.setModel(oController.DetailModel)
            // 	.bindElement("/FormData");
            // }
        });
    }
);
