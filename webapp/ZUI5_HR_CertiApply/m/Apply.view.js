sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/PickOnlyDatePicker",
    "../delegate/ViewTemplates"
], function (Common, PageHelper, PickOnlyDatePicker, ViewTemplates) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Apply"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "Apply-",
                title: "{i18n>LABEL_64001}", // 제증명 신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
                            press: oController.onDialogApplyBtn.bind(oController),
                            text: "{i18n>LABEL_38044}", // 신청,
                        }).addStyleClass("button-light"),
					]
				}).addStyleClass("app-nav-button-right"),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.ApplyingBox(oController),
					// this.oInfoBox(oController)
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/Data")
		},
		
		ApplyingBox: function(oController) {
			var oZformType = new sap.m.ComboBox({ //구분
				width: "180px",
				items: [
					new sap.ui.core.ListItem({ key: "01", text: "{i18n>LABEL_64013}"}),
					new sap.ui.core.ListItem({ key: "02", text: "{i18n>LABEL_64014}"}),
					new sap.ui.core.ListItem({ key: "03", text: "{i18n>LABEL_64015}"}),
					new sap.ui.core.ListItem({ key: "04", text: "{i18n>LABEL_64016}"})
				],
				selectedKey: "{ZformType}",
			});
			
			// 키보드 입력 방지
			oZformType.addDelegate({
				onAfterRendering: function () {
					oZformType.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oZformType);
            
			var oAptyp = new sap.m.ComboBox({ //구분
				width: "180px",
				items: [
					new sap.ui.core.ListItem(oController.PAGEID + "_AptypItem",{ key: "1", text: "{i18n>LABEL_64011}"}),
					new sap.ui.core.ListItem({ key: "2", text: "{i18n>LABEL_64012}"}),
					new sap.ui.core.ListItem({ key: "3", text: "{i18n>LABEL_64020}"})
				],
				selectedKey: "{Aptyp}"
			});
		
			// 키보드 입력 방지
			oAptyp.addDelegate({
				onAfterRendering: function () {
					oAptyp.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oAptyp);
            
			 var oZLang = new sap.m.ComboBox({
				width: "150px",
				items : [
					new sap.ui.core.ListItem({ key : "1" ,text : "{i18n>LABEL_64018}" }),
					new sap.ui.core.ListItem({ key : "2" ,text : "{i18n>LABEL_64019}" })
				],
				selectedKey: "{Zlang}"
			});
			
			// 키보드 입력 방지
			oZLang.addDelegate({
				onAfterRendering: function () {
					oZLang.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oZLang);
            
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_64002}", "105px", "Left", true), // 구분
                            oZformType
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_64003}", "105px", "Left", true), // 언어
							oZLang
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_64004}", "105px", "Left", true), // 기준년도
							new sap.m.Input({
								width: "180px",
								value: "{Zyear}",
                                textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_64006}", "105px", "Left", true), // 용도
							new sap.m.Input({
								width: "180px",
								value: "{Zuse}",
                                textAlign: "Begin",
                                maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Zuse", false),
							})
						]
					}),
					new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Text({
								width: "100%",
								text: "{i18n>MSG_64007}",
                                textAlign: "Begin"
							}).addStyleClass("px-20px lineHeight30")
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_64005}", "105px", "Left", true), // 제출처
							new sap.m.Input({
								width: "180px",
								value: "{Zsubmit}",
                                textAlign: "Begin"
							}),
						]
					}),
					new sap.m.HBox({
						// height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Text({
								width: "100%",
								text: "{i18n>MSG_64008}",
                                textAlign: "Begin"
							}).addStyleClass("px-20px")
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_64007}", "105px", "Left", true), // 수량
							new sap.m.Input({
								textAlign: "Begin",
								width: "120px",
								maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Zcount", false),
								value: "{Zcount}"
							}),
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_64010}", "105px", "Left"), // 비고
							new sap.m.Input({
								textAlign: "Begin",
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Zcomment", false),
								value: "{Zcomment}"
							}),
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_64017}", "105px", "Left", true), // 수령방법
							oAptyp
						]
					}),
					new sap.m.Text({
						textAlign: "Begin",
						width: "100%",
						text: "{i18n>MSG_64001}"
					}),
					new sap.m.Text({
						textAlign: "Begin",
						width: "100%",
						text: "{i18n>MSG_64002}"
					}).addStyleClass("px-20px"),
					new sap.m.Text({
						textAlign: "Begin",
						width: "100%",
						text: "{i18n>MSG_64003}"
					}),
					new sap.m.Text({
						textAlign: "Begin",
						width: "100%",
						text: "{i18n>MSG_64004}"
					}),
					new sap.m.Text({
						textAlign: "Begin",
						width: "100%",
						text: "{i18n>MSG_64005}"
					}).addStyleClass("px-20px"),
					new sap.m.Text({
						textAlign: "Begin",
						width: "100%",
						text: "{i18n>MSG_64006}"
					}).addStyleClass("px-20px"),
				]
			})
			.addStyleClass("vbox-form-mobile");
		},
	});
});