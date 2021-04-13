sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates",
	"../../common/ZHR_TABLES"
], function (Common, ViewTemplates, ZHR_TABLES) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_CertiApply.fragment.Apply", {

		createContent: function (oController) {
			
            var ZformType = new sap.m.RadioButtonGroup(oController.PAGEID + "_RadioGroup1", {
				layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
				selectedIndex: 1,
				width: "100%",
				columns: 4,
				select: oController.onChangeZformType,
				buttons: [
					new sap.m.RadioButton({
						text: "{i18n>LABEL_65013}", // 재직
						width: "auto",
						selected: {
							path: "ZformType",
							formatter: function(v) {
								return v === "01";
							}
						},
					}),
					new sap.m.RadioButton({
						text: "{i18n>LABEL_65014}", // 경력
						width: "auto",
						selected: {
							path: "ZformType",
							formatter: function(v) {
								return v === "02";
							}
						},
					}),
					new sap.m.RadioButton({
						text: "{i18n>LABEL_65015}", // 갑근세납세필
						width: "auto",
						selected: {
							path: "ZformType",
							formatter: function(v) {
								return v === "04";
							}
						},
					}),
					new sap.m.RadioButton({
						text: "{i18n>LABEL_65016}", // 원천징수영수증
						width: "auto",
						selected: {
							path: "ZformType",
							formatter: function(v) {
								return v === "05";
							}
						},
					}),
				],
				editable: {  // 재신청일 경우 수정 불가
					path: "actmode",  
					formatter: function(v) {
						if (v && v === "X") return false;
						return true;
					}
				}
			}).addStyleClass("mr-10px");
			
			var oAptyp = new sap.m.RadioButtonGroup(oController.PAGEID + "_RadioGroup2", {
				layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
				width: "100%",
				columns: 3,
				selectedIndex: 1,
				select: oController.onChangeAptyp,
				buttons: [
					new sap.m.RadioButton({
						text: "{i18n>LABEL_65011}", // ESS 출력
						width: "auto",
						selected: {
							path: "Aptyp",
							formatter: function(v) {
								return v === "1";
							}
						},
						visible: {  // 경력증명서 인 경우 담당자 결재 후 출력 가능 
							path: "ZformType",
							formatter: function(v) {
								if (v && v === "02") return false;
								return true;
							}
						}, 
					}),
					new sap.m.RadioButton({
						text: "{i18n>LABEL_65012}", // 인사팀 발행
						width: "auto",
						selected: {
							path: "Aptyp",
							formatter: function(v) {
								return v === "2";
							}
						},
					}),
					new sap.m.RadioButton({
						text: "{i18n>LABEL_65020}", // 메일발송
						width: "auto",
						selected: {
							path: "Aptyp",
							formatter: function(v) {
								return v === "3";
							}
						},
					}),
				]
			}).addStyleClass("mr-10px");
	
			 var oZLang = new sap.m.ComboBox({
				width: "150px",
				items : [
					new sap.ui.core.ListItem({ key : "1" ,text : "{i18n>LABEL_65018}" }),
					new sap.ui.core.ListItem({ key : "2" ,text : "{i18n>LABEL_65019}" }),
				],
				selectedKey: "{Zlang}",
				editable: {  // 재신청일 경우 수정 불가
					path: "actmode",  
					formatter: function(v) {
						if (v && v === "X") return false;
						return true;
					}
				}
			});
			
				// 키보드 입력 방지
			oZLang.addDelegate({
				onAfterRendering: function () {
					oZLang.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oZLang);
            
			var oApplyBox = new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_65002}", "150px", "Right"), // 구분
							ZformType,
                        ]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_65003}", "150px", "Right", true), // 언어
							oZLang,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_65004}", "150px", "Right", true).addStyleClass("mr-8px"), // 기준년도
                            new sap.m.Input({
								width: "180px",
								value: "{Zyear}",
                                textAlign: "Begin",
                				editable: {  // 재신청일 경우 수정 불가
									path: "actmode",  
									formatter: function(v) {
										if (v && v === "X") return false;
										return true;
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_65006}", "150px", "Right", false), // 용도
							new sap.m.Input({
								width: "180px",
								value: "{Zuse}",
                                textAlign: "Begin",
                                maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Zuse", false),
							}),
							new sap.m.Text({
								width: "100%",
								text: "{i18n>MSG_65007}",
                                textAlign: "Begin"
							}).addStyleClass("px-20px"),
						],
						visible: {  // 재신청일 경우 보이지 않음
							path: "actmode",  
							formatter: function(v) {
								if (v && v === "X") return false;
								return true;
							}
						}
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_65005}", "150px", "Right", false), // 제출처
							new sap.m.Input({
								width: "180px",
								value: "{Zsubmit}",
                                textAlign: "Begin"
							}),
							new sap.m.Text({
								width: "100%",
								text: "{i18n>MSG_65008}",
                                textAlign: "Begin"
							}).addStyleClass("px-20px")
						],
						visible: {  // 재신청일 경우 보이지 않는다. 
							path: "actmode",
							formatter: function(v) {
								if (v && v === "X") return false;
								return true;
							}
						}
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_65007}", "150px", "Right", true), // 수량
                        	new sap.m.Input({
								textAlign: "Begin",
								width: "120px",
								maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Zcount", false),
								value: "{Zcount}"
							}),
						],
						visible: {  // 재신청일 경우 보이지 않는다. 
							path: "actmode",
							formatter: function(v) {
								if (v && v === "X") return false;
								return true;
							}
						}
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_65010}", "150px", "Right", false), // 비고
                        	new sap.m.Input({
                        		layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								textAlign: "Begin",
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Zcomment", false),
								value: "{Zcomment}"
							}),
						],
						visible: {  // 재신청일 경우 보이지 않는다. 
							path: "actmode",
							formatter: function(v) {
								if (v && v === "X") return false;
								return true;
							}
						}
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_65017}", "150px", "Right", true), // 수령방법
                        	oAptyp
						],
						visible: {  // 재신청일 경우 보이지 않는다. 
							path: "actmode",
							formatter: function(v) {
								if (v && v === "X") return false;
								return true;
							}
						}
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_65021}", "150px", "Right", false), // 재출력사유
                        	new sap.m.Input({
                        		layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								textAlign: "Begin",
								width: "100%",
								maxLength: Common.getODataPropertyLength("ZHR_CERTI_SRV", "CertiAppTableIn", "Reasn", false),
								value: "{Reasn}"
							}),
						],
						visible: {  // 재신청일 경우 보임.
							path: "actmode",
							formatter: function(v) {
								if (v && v === "X") return true;
								return false;
							}
						}
					})
					.addStyleClass("search-field-group")
					
					
					
				]
			})
			.addStyleClass("search-inner-vbox tableMargin5");
			
			var oInfoBox = new sap.m.VBox({
				fitContainer: true,
				items: [ 
						new sap.m.Text({
							textAlign: "Begin",
							width: "100%",
							text: "{i18n>MSG_65001}"
						}).addStyleClass("lineHeight30 font-14px"),
						new sap.m.Text({
							textAlign: "Begin",
							width: "100%",
							text: "{i18n>MSG_65002}"
						}).addStyleClass("px-20px lineHeight30 font-14px"),
						new sap.m.Text({
							textAlign: "Begin",
							width: "100%",
							text: "{i18n>MSG_65003}"
						}).addStyleClass("lineHeight30 font-14px"),
						new sap.m.Text({
							textAlign: "Begin",
							width: "100%",
							text: "{i18n>MSG_65004}"
						}).addStyleClass("lineHeight30 font-14px"),
						new sap.m.Text({
							textAlign: "Begin",
							width: "100%",
							text: "{i18n>MSG_65005}"
						}).addStyleClass("px-20px lineHeight30 font-14px"),
						new sap.m.Text({
							textAlign: "Begin",
							width: "100%",
							text: "{i18n>MSG_65006}"
						}).addStyleClass("px-20px lineHeight30 font-14px"),
					
					],
				visible: {  // 재신청일 경우 보이지 않음
					path: "actmode",
					formatter: function(v) {
						if (v && v === "X") return false;
						return true;
					}
				}
			}).addStyleClass("tableMargin5 px-20px");
			
			var oInfoBox2 = new sap.m.VBox({
				fitContainer: true,
				items: [ 
						new sap.m.Text({
							textAlign: "Begin",
							width: "100%",
							text: "{i18n>MSG_65017}"
						}).addStyleClass("lineHeight30 font-14px"),
						new sap.m.Text({
							textAlign: "Begin",
							width: "100%",
							text: "{i18n>MSG_65018}"
						}).addStyleClass("px-20px lineHeight30 font-14px"),
					],
				visible: {  // 재신청일 경우 보임
					path: "actmode",
					formatter: function(v) {
						if (v && v === "X") return true;
						return false;
					}
				}
			}).addStyleClass("tableMargin5 px-20px");
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_65001}",    // 제증명 신청
				contentWidth: "1000px",
				contentHeight: "640px",
				buttons: [
					new sap.m.Button({
						press: oController.onDialogApplyBtn.bind(oController),
						text: "{i18n>LABEL_38044}", // 신청,
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_38046}" // 닫기
					}).addStyleClass("button-default custom-button-divide")
				],   
				content: [
					oApplyBox,
					oInfoBox,
					oInfoBox2
                ]
			})
			.addStyleClass("custom-dialog-popup")
			.setModel(oController.ApplyModel)
			.bindElement("/Data");

			return oDialog;
		}
	});
});