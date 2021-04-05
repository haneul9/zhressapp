sap.ui.define([
	"common/Common",
	"common/PageHelper"
], function (Common, PageHelper) {
    "use strict";
    
    var SUB_APP_ID = [$.app.CONTEXT_PATH, "CondoDetail"].join($.app.getDeviceSuffix());

    sap.ui.jsview(SUB_APP_ID, {
        getControllerName: function () {
			return SUB_APP_ID;
        },
        
        createContent: function(oController) {

            var CondoHandler = oController.getCondoHandler();

            return new PageHelper({
                idPrefix: "CondoDetail-",
                title: "{i18n>LABEL_09032}",    // 콘도 신청
                showNavButton: true,
                navBackFunc: CondoHandler.navBack.bind(null, false),
                headerButton: new sap.m.FlexBox({
                    items: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_09023}", // 신청
                            press: CondoHandler.onPressCondoRequestCompleteBtn.bind(CondoHandler),
                            visible: {
                                path: "isNew",
                                formatter: function(v) {
                                    if(v === true) return true;
                                    else return false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            press: CondoHandler.onPressCondoModifyCompleteBtn.bind(CondoHandler),
                            visible: {
                                parts: [
                                    {path: "isNew"},
                                    {path: "Statu"}
                                ],
                                formatter: function(v1, v2) {
                                    if(v1 === false && v2 === "W") return true;
                                    else return false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00119}", // 취소
                            press: CondoHandler.onPressCondoRequestCancelBtn.bind(CondoHandler),
                            visible: {
                                parts: [
                                    {path: "isNew"},
                                    {path: "Statu"}
                                ],
                                formatter: function(v1, v2) {
                                    if(v1 === false && v2 === "W") return true;
                                    else return false;
                                }
                            }
                        }).addStyleClass("button-light ml-14px"),
                    ]
                }),
                contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile",
                contentItems: [
                    this.getInputBox(oController)	// Input 영역
                ]
            })
            .setModel(CondoHandler.Model())
            .bindElement("/Detail/Data");
        },

        getInputBox: function(oController) {
            
            var CondoHandler = oController.getCondoHandler();

            return new sap.m.VBox({
				items: [
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09033}", design: "Bold" }), // 콘도
							new sap.m.Input({
                                width: "80%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								editable: false,
								value: "{Contx}"
							})
						]
					}),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09034}", design: "Bold" }), // 위치
							new sap.m.Input({
                                width: "80%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								editable: false,
								value: "{Loctx}"
							})
						]
					}),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09053}", design: "Bold" }), // 성수기
							new sap.m.Input({
                                width: "80%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								editable: false,
								value: "{SeasnT}"
							})
						]
					}),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09055}", design: "Bold", required: true }), // 입/퇴실일
							new sap.m.DateRangeSelection("BegdaRange", {
                                width: "80%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                delimiter: "~",
                                displayFormat: "{Dtfmt}",
                                minDate: "{minDate}",
								maxDate: "{maxDate}",
                                dateValue: "{Begda}",
                                secondDateValue: "{Endda}",
                                specialDates: new sap.ui.unified.DateTypeRange({
                                    type: sap.ui.unified.CalendarDayType.Type03,
                                    startDate: "{Sbegda}",
                                    endDate: "{Sendda}"
                                }),
                                change: CondoHandler.handleDrsChange.bind(CondoHandler),
                                editable: {
                                    parts: [
                                        {path: "isNew"},
                                        {path: "Statu"}
                                    ],
                                    formatter: function(v1, v2) {
                                        if (v1 === true || v2 === "W") return true;
                                        else return false;
                                    }
                                }
                            }).addDelegate({
                                onAfterRendering: function () {
                                    Common.disableKeyInput($.app.byId("BegdaRange"));
                                }
                            })
						]
					}),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.FlexBox({
                                alignItems: sap.m.FlexAlignItems.Center,
								items: [
									new sap.ui.core.Icon({
										// 경고 문자
										src: "sap-icon://alert",
										size: "1.0rem",
										color: "#da291c"
									}).addStyleClass("mt-6px"),
									new sap.m.Text({
										text: {
											parts: [{ path: "Sbegda" }, { path: "Sendda" }],
											formatter: function (v1, v2) {
												if (v1 && v2) {
													return oController
														.getBundleText("MSG_09015")
														.interpolate(Common.DateFormatter(v1, "yyyy.MM.dd"), Common.DateFormatter(v2, "yyyy.MM.dd"));
												} else {
													return "";
												}
											}
										}
									}).addStyleClass("ml-8px")
								]
                            })  // 성수기안내
                            .addStyleClass("vbox-form-infotext")
                        ],
                        visible: {
                            path: "Sbegda",
                            formatter: function (v) {
                                if (v) return true;
                                else return false;
                            }
                        }
					}),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09066}", design: "Bold", required: true }), // 객실수
							new sap.m.ComboBox({
                                width: "30%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								selectedKey: "{Romno}",
								items: {
									path: "/Rooms",
									template: new sap.ui.core.ListItem({
										key: "{Code}",
										text: "{Text}"
									})
								},
								editable: {
									parts: [{ path: "isNew" }, { path: "Statu" }],
									formatter: function (v1, v2) {
										if (v1 === true || v2 === "W") return true;
										else return false;
									}
								}
							})
						]
					}),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09067}", design: "Bold", required: true }), // 사용인원
							new sap.m.Input({
                                width: "40%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                value: "{Usepn}",
                                description: "{i18n>LABEL_09068}",   // 명
								liveChange: Common.setOnlyDigit,
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CondoUseRequestIt", "Usepn"),
								editable: {
									parts: [{ path: "isNew" }, { path: "Statu" }],
									formatter: function (v1, v2) {
										if (v1 === true || v2 === "W") return true;
										else return false;
									}
								}
                            })
						]
					}),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09026}", design: "Bold", required: true }), // 휴대전화번호
							new sap.m.Input({
								value: "{Comnr}",
                                width: "80%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								placeholder: "010-1111-1111",
								maxLength: common.Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CondoUseRequestIt", "Comnr"),
								liveChange: Common.changeCellphoneFormat,
								editable: {
									parts: [{ path: "isNew" }, { path: "Statu" }],
									formatter: function (v1, v2) {
										if (v1 === true || v2 === "W") return true;
										else return false;
									}
								}
							})
						]
					}),
					new sap.m.HBox({
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09028}", design: "Bold" }), // 비고
                            new sap.m.TextArea({
                                value: "{Descr}",
                                width: "95%",
                                rows: 5,
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                maxLength: common.Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CondoUseRequestIt", "Descr"),
                                editable: {
									parts: [{ path: "isNew" }, { path: "Statu" }],
									formatter: function (v1, v2) {
										if (v1 === true || v2 === "W") return true;
										else return false;
									}
								}
                            })
						]
					}),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({
                                width: "105px", 
								text: "{i18n>LABEL_09057}",
								design: "Bold"
							}), // 콘도정보
							new sap.m.Link({
								target: "_blank",
								text: "{UsridLong}",
                                href: "{UsridLong}",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 })
							})
                        ],
                        visible: {
                            path: "isNew",
                            formatter: function (v) {
                                if (v === true) return true;
                                else return false;
                            }
                        }
					}),
					new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({
                                width: "105px", 
								text: "{i18n>LABEL_09006}",
								design: "Bold"
							}), // 진행상태
							new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: {
									parts: [{ path: "Statu" }, { path: "StatusT" }],
									formatter: function (v1, v2) {
										if (v1 === "W") {
                                            this.addStyleClass("color-red");
                                            this.removeStyleClass("color-blue");
                                        } else {
                                            this.addStyleClass("color-blue");
                                            this.removeStyleClass("color-red");
                                        }

										return v2;
									}
								}
							})
                        ],
                        visible: {
                            path: "isNew",
                            formatter: function (v) {
                                if (v === true) return false;
                                else return true;
                            }
                        }
					})
				]
            })
            .addStyleClass("vbox-form-mobile");
        }
	});
});