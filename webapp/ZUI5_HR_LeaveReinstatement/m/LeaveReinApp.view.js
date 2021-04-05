// sap.ui.define([
// 	"../../common/Common",
// 	"../../common/PageHelper",
//     "../../common/PickOnlyDateRangeSelection",
//     "../../common/PickOnlyDatePicker",
//     "../delegate/ViewTemplates"
// ], function (Common, PageHelper, PickOnlyDateRangeSelection, PickOnlyDatePicker, ViewTemplates) {
// "use strict";

// 	var SUB_APP_ID = [$.app.CONTEXT_PATH, "LeaveReinApp"].join($.app.getDeviceSuffix());
	
// 	sap.ui.jsview(SUB_APP_ID, {
		
// 		getControllerName: function () {
// 			return SUB_APP_ID;
//         },
		
// 		createContent: function (oController) {
			
// 			return new PageHelper({
// 				idPrefix: "LeaveReinApp-",
//                 title: "{i18n>LABEL_42002}", // 휴/복직 신청
//                 showNavButton: true,
// 				navBackFunc: oController.navBack,
// 				headerButton: new sap.m.HBox({
// 					items: [
//                         new sap.m.Button({
//                             press: oController.onDialogSaveBtn.bind(oController),
//                             text: "{i18n>LABEL_42031}", // 저장,
//                             visible: {
//                                 path: "Status",
//                                 formatter: function (v) {
//                                     return v === "AA";
//                                 }
//                             }
//                         }).addStyleClass("button-light"),
//                         new sap.m.Button({
//                             press: oController.onDialogApplyBtn.bind(oController),
//                             text: "{i18n>LABEL_42030}", // 신청,
//                             visible: {
//                                 path: "Status",
//                                 formatter: function (v) {
//                                     return !v;
//                                 }
//                             }
//                         }).addStyleClass("button-dark"),
//                         new sap.m.Button({
//                             press: oController.onDialogDelBtn.bind(oController),
//                             text: "{i18n>LABEL_42032}", // 삭제
//                             visible: {
//                                 path: "Status",
//                                 formatter: function (v) {
//                                     return v === "AA";
//                                 }
//                             }
//                         }).addStyleClass("button-light")
// 					]
// 				}).addStyleClass("app-nav-button-right"),
// 				contentStyleClass: "sub-app-content",
//                 contentContainerStyleClass: "app-content-container-mobile custom-title-left",
// 				contentItems: [
// 					this.ApplyingBox(oController),
//                     this.FamilyInfoBox(oController)
// 				]
// 			})
// 			.setModel(oController.ApplyModel)
// 			.bindElement("/FormData")
// 		},
		
// 		ApplyingBox: function(oController) {

//             var oTypeCombo = new sap.m.ComboBox({ // 휴/복직 구분
// 				width: "220px",
// 				change: oController.changeType.bind(oController),
// 				editable: {
// 					path: "Status1",
// 					formatter: function(v) {
// 						return !v;
// 					}
// 				},
// 				items: {
// 					path: "/TypeCombo",
// 					template: new sap.ui.core.ListItem({
// 						key: "{Code}",
// 						text: "{Text}"
// 					})
// 				},
// 				selectedKey: "{Massn}"
// 			});
			
// 			// 키보드 입력 방지
// 			oTypeCombo.addDelegate({
// 				onAfterRendering: function () {
// 					oTypeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
// 				}
//             }, oTypeCombo);

//             var oUsedTypeCombo = new sap.m.ComboBox(oController.PAGEID + "_UsedTypeCombo", { // 휴/복직 사유
// 				width: "220px",
//                 change: oController.changeUsedType.bind(oController),
// 				editable: {
// 					path: "Status1",
// 					formatter: function(v) {
// 						return v === "AA";
// 					}
// 				},
// 				items: {
// 					path: "/UsedTypeCombo",
// 					template: new sap.ui.core.ListItem({
// 						key: "{Code}",
// 						text: "{Text}"
// 					})
// 				},
// 				selectedKey: "{Massg}"
// 			});
			
// 			// 키보드 입력 방지
// 			oUsedTypeCombo.addDelegate({
// 				onAfterRendering: function () {
// 					oUsedTypeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
// 				}
//             }, oUsedTypeCombo);
            
// 			return new sap.m.VBox({
// 				items: [
// 					new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
//                             ViewTemplates.getLabel("header", "{i18n>LABEL_42004}", "105px", "Left"), // 신청일
//                             new sap.m.Text({
// 								width: "200px",
// 								text: {
// 									path: "Begda",
// 									formatter: function(v) {
// 										if(v) return Common.DateFormatter(v);
// 										else return Common.DateFormatter(new Date());	
// 									}
// 								},
//                                 textAlign: "Begin"
// 							})
// 						]
// 					}),
// 					new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
// 							ViewTemplates.getLabel("header", "{i18n>LABEL_42013}", "105px", "Left", true), // 휴/복직 구분
// 							oNameCombo
// 						]
// 					}),
// 					new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
// 							ViewTemplates.getLabel("header", "{i18n>LABEL_42014}", "105px", "Left", true), // 휴/복직 사유
// 							new sap.m.Text({
// 								width: "200px",
// 								text: "{RelationTx}",
//                                 textAlign: "Begin"
// 							})
// 						]
// 					}),
// 					new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
// 							ViewTemplates.getLabel("header", "{i18n>LABEL_42007}", "105px", "Left", true), // 휴직기간
// 							oGubunCombo
// 						]
// 					}),
// 					new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
//                             ViewTemplates.getLabel("header", "{i18n>LABEL_42008}", "105px", "Left", true), // 복직예정일
// 							new PickOnlyDatePicker({
//                                 width: "200px",
//                                 dateValue: "{Zrhsdt}",
//                                 change: oController.getLeaveTerm.bind(oController),
//                                 displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
//                                 valueFormat: "yyyy-MM-dd",
//                                 placeholder: "yyyy-mm-dd",
//                                 editable: {
//                                     path: "Status1",
//                                     formatter: function(v) {
//                                         return !v || v === "AA";
//                                     }
//                                 }
//                             })
// 						]
// 					}),
// 					new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
//                             ViewTemplates.getLabel("header", "{i18n>LABEL_42016}", "105px", "Left", true), // 세부사유
// 							new sap.m.TextArea({
//                                 rows: 3,
// 								width: "220px",
// 								value:"{Zdtlrs}",
// 								maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "OpenhelpTableIn2", "Zdtlrs", false),
//                                 layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
// 								editable: {
// 									path: "Status1",
// 									formatter: function(v) {
// 										return !v || v === "AA";
// 									}
// 								}
// 							})
// 						]
// 					}),
// 					new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
// 							ViewTemplates.getLabel("header", "{i18n>LABEL_42018}", "105px", "Left", true), // 출산예정일
// 							new PickOnlyDatePicker({
//                                 width: "200px",
//                                 dateValue: "{Zexbdt}",
//                                 displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
//                                 valueFormat: "yyyy-MM-dd",
//                                 placeholder: "yyyy-mm-dd",
//                                 editable: {
//                                     path: "Status1",
//                                     formatter: function(v) {
//                                         return !v || v === "AA";
//                                     }
//                                 }
//                             })
// 						]
// 					})
// 				]
// 			})
// 			.addStyleClass("vbox-form-mobile");
// 		},

//         FamilyInfoBox: function(oController) {

//             var oRelationCombo = new sap.m.ComboBox({ // 관계
// 				width: "220px",
// 				editable: {
// 					path: "Status1",
// 					formatter: function(v) {
// 						return !v || v === "AA";
// 					}
// 				},
// 				items: {
// 					path: "/RelationCombo",
// 					template: new sap.ui.core.ListItem({
// 						key: "{Code}",
// 						text: "{Text}"
// 					})
// 				},
// 				selectedKey: "{Kdsvh}"
// 			});
			
// 			// 키보드 입력 방지
// 			oRelationCombo.addDelegate({
// 				onAfterRendering: function () {
// 					oRelationCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
// 				}
//             }, oRelationCombo);

//             return  new sap.m.VBox(oController.PAGEID + "_FamilyInfoBox", {
// 				items: [
//                     new sap.m.Label({ text: "{i18n>LABEL_42019}" }).addStyleClass("sub-title"), // 가족정보 
//                     new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
//                             ViewTemplates.getLabel("header", "{i18n>LABEL_42020}", "105px", "Left", true), // 성명
//                             new sap.m.Input({
//                                 textAlign: "Begin",
//                                 width: "220px",
//                                 maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zfmlnm", false),
//                                 value: "{Zfmlnm}",
//                                 editable: {
//                                     path: "Status1",
//                                     formatter: function(v) {
//                                         return !v || v === "AA";
//                                     }
//                                 }
//                             })
// 						]
// 					}),
//                     new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
//                             ViewTemplates.getLabel("header", "{i18n>LABEL_42021}", "105px", "Left", true), // 생년월일
//                             new PickOnlyDatePicker({
//                                 width: "200px",
//                                 dateValue: "{Zfgbdt}",
//                                 displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
//                                 valueFormat: "yyyy-MM-dd",
//                                 placeholder: "yyyy-mm-dd",
//                                 editable: {
//                                     path: "Status1",
//                                     formatter: function(v) {
//                                         return !v || v === "AA";
//                                     }
//                                 }
//                             })
// 						]
// 					}),
//                     new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
//                             ViewTemplates.getLabel("header", "{i18n>LABEL_42022}", "105px", "Left", true), // 초등학교 명
//                             new sap.m.Input({
//                                 textAlign: "Begin",
//                                 width: "220px",
//                                 maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "TableIn1", "Zelmnm", false),
//                                 value: "{Zelmnm}",
//                                 editable: {
//                                     path: "Status1",
//                                     formatter: function(v) {
//                                         return !v || v === "AA";
//                                     }
//                                 }
//                             })
// 						]
// 					}),
//                     new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
//                             ViewTemplates.getLabel("header", "{i18n>LABEL_42023}", "105px", "Left", true), // 입학일
//                             new PickOnlyDatePicker({
//                                 width: "200px",
//                                 dateValue: "{Zentdt}",
//                                 displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
//                                 valueFormat: "yyyy-MM-dd",
//                                 placeholder: "yyyy-mm-dd",
//                                 editable: {
//                                     path: "Status1",
//                                     formatter: function(v) {
//                                         return !v || v === "AA";
//                                     }
//                                 }
//                             })
// 						]
// 					}),
//                     new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
//                             ViewTemplates.getLabel("header", "{i18n>LABEL_42024}", "105px", "Left", true), // 관계
//                             oRelationCombo
// 						]
// 					}),
//                     new sap.m.HBox({
// 						height: "40px",
// 						alignItems: sap.m.FlexAlignItems.Center,
// 						items: [
//                             ViewTemplates.getLabel("header", "{i18n>LABEL_42025}", "105px", "Left", true), // 배우자 육아휴직 신청여부
//                             new sap.m.Text({
//                                 width: "220px",
//                                 text: "{Zspsap}",
//                                 textAlign: "Begin"
//                             }),
//                             new sap.m.Button({
//                                 press: oController.getPartnerCheck.bind(oController),
//                                 text: "{i18n>LABEL_42041}", // 조회
//                                 visible: {
//                                     path: "Status1",
//                                     formatter: function (v) {
//                                         return !v || v === "AA";
//                                     }
//                                 }
//                             })
//                             .addStyleClass("button-light-sm ml-5px")
// 						]
// 					})
//                 ]
//             })
//             .addStyleClass("vbox-form-mobile");
//         }
// 	});
// });