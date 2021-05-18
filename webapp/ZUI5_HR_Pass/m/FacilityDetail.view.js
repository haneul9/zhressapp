sap.ui.define([
	"common/Common",
	"common/PageHelper"
], function (Common, PageHelper) {
    "use strict";
    
    var SUB_APP_ID = [$.app.CONTEXT_PATH, "FacilityDetail"].join($.app.getDeviceSuffix());

    sap.ui.jsview(SUB_APP_ID, {
        getControllerName: function () {
			return SUB_APP_ID;
        },
        
        createContent: function(oController) {

			var FacilityHandler = oController.getFacilityHandler();

            return new PageHelper({
                idPrefix: "FacilityDetail-",
                // title: "{i18n>LABEL_09064}",    // 시설이용
                showNavButton: true,
				navBackFunc: FacilityHandler.navBack,
				headerButton: new sap.m.FlexBox({
					items: [
						new sap.m.Button({
                            text: "{i18n>LABEL_09023}", // 신청
                            press: FacilityHandler.onPressApprovalBtn.bind(FacilityHandler),
                            visible: {
                                path: "isNew",
                                formatter: function(v) {
                                    if(v === true) return true;
                                    else return false;
                                }
                            }
						}).addStyleClass("button-dark"),
						new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            press: FacilityHandler.onPressSaveBtn.bind(FacilityHandler),
                            visible: {
                                parts: [
                                    {path: "isNew"},
                                    {path: "Status"}
                                ],
                                formatter: function(v1, v2) {
                                    if(v1 === false && v2 === "AA") return true;
                                    else return false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00119}", // 취소
                            press: FacilityHandler.onPressCancelBtn.bind(FacilityHandler),
                            visible: {
                                parts: [
                                    {path: "isNew"},
                                    {path: "Status"}
                                ],
                                formatter: function(v1, v2) {
                                    if(v1 === false && v2 === "AA") return true;
                                    else return false;
                                }
                            }
                        }).addStyleClass("button-light")
					]
				}).addStyleClass("app-nav-button-right"),
                contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                contentItems: [
                    this.getInputBox()	// Input 영역
                ]
			})
			.setModel(FacilityHandler.Model())
            .bindElement("/Detail");
        },

        getInputBox: function() {
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "42px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09011}" }).addStyleClass("sub-con-title"), // 이용시설
							new sap.m.Input({
								width: "100%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								editable: false,
								value: "{FactyT}"
							})
						],
						visible: {
							path: "isNew",
							formatter: function (v) {
								if (v) return false;
								else return true;
							}
						}
					}),
					new sap.m.HBox({
						height: "42px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09001}" }).addStyleClass("sub-con-title"), // 사용일
							new sap.m.Input({
								width: "100%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								editable: false,
								value: {
									path: "Usday",
									formatter: function (v) {
										return Common.DateFormatter(v);
									}
								}
							})
						]    
					}),
					new sap.m.HBox({
						height: "42px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09002}", required: true }).addStyleClass("sub-con-title"), // 신청매수
							new sap.m.Input({
								width: "30%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								value: "{Reqno}",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "FacilityApplyTableIn", "Reqno"),
								liveChange: Common.setOnlyDigit
							})
						]
					}),
					new sap.m.HBox({
						height: "42px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09003}" }).addStyleClass("sub-con-title"), // 예약매수
							new sap.m.Input({
								width: "30%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								editable: false,
								value: "{Resno}"
							})
						],    
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v) return false;
								else return true;
							}
						}
					}),
					new sap.m.HBox({
						height: "42px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09026}", required: true }).addStyleClass("sub-con-title"), // 휴대전화번호
							new sap.m.Input({
								width: "100%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								value: "{Cellp}",
								placeholder: "010-1111-1111",
								liveChange: Common.changeCellphoneFormat
							})
						]
					}),
					new sap.m.HBox({
						height: "42px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09027}", required: true }).addStyleClass("sub-con-title"), // E-Mail
							new sap.m.Input({
								width: "100%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								value: "{Email}",
								maxLength : Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "FacilityApplyTableIn", "Email")
							})
						]
					}),
					new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09028}" }).addStyleClass("sub-con-title"), // 비고
							new sap.m.TextArea({
								width: "100%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								value: "{Zbigo}",
								rows: 5,
								maxLength : Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "FacilityApplyTableIn", "Zbigo")
							})
						]
					}),
					new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_09005}" }).addStyleClass("sub-con-title"), // 회신사항
							new sap.m.TextArea({
								width: "100%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								editable: false,
								value: "{Rettx}",
								rows: 5
							})
						],
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v) return false;
								else return true;
							}
						}
					})
				]
			})
			.bindElement("/Detail")
			.addStyleClass("vbox-form-mobile");
        }
	});
});