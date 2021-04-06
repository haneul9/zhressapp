sap.ui.define([
	"../../common/Common",
	"../../common/PickOnlyDateRangeSelection"
], function (Common, PickOnlyDateRangeSelection) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_LanguageTuitionApplication.fragment.TuitionApply", {

		createContent: function (oController) {
			
			var oCostCombo = new sap.m.ComboBox(oController.PAGEID + "_CostCombo", { // 원가코드
				width: "300px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/CostCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Kostl}"
			});
			
			// 키보드 입력 방지
			oCostCombo.addDelegate({
				onAfterRendering: function () {
					oCostCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oCostCombo);
            
            var oWBSCombo = new sap.m.ComboBox(oController.PAGEID + "_WBSCombo", { // WBS
				width: "250px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/WBSCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Plstx}"
			});
			
			// 키보드 입력 방지
			oWBSCombo.addDelegate({
				onAfterRendering: function () {
					oWBSCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oWBSCombo);
			
			var oReceiptDate = new sap.m.DatePicker(oController.PAGEID + "_ReceiptDate", { // 영수일자
				width: "250px",
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				dateValue: "{Caldt}",
				displayFormat: oController.getSessionInfoByKey("Dtfmt"),
				valueFormat: "yyyy-MM-dd",
				placeholder: "yyyy-mm-dd",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				}
			})
			// 키보드 입력 방지
			oReceiptDate.addDelegate({
				onAfterRendering: function () {
					oReceiptDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oReceiptDate);
			
			//FormBox 
			var inputBox = new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
						items: [
							new sap.m.VBox({
								width: "50%",
								fitContainer: true,
								items: [
								new sap.m.HBox({
									items: [
										// 원가코드
										new sap.m.Label({ text: "{i18n>LABEL_29016}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										oCostCombo
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										// 수강기간
										new sap.m.Label({ text: "{i18n>LABEL_29003}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										new PickOnlyDateRangeSelection(oController.PAGEID + "_PeriodDate", { // 수강기간
											displayFormat: oController.getSessionInfoByKey("Dtfmt"),
											change: oController.getSupPeriod.bind(oController),
											dateValue: "{Lecbe}",
											secondDateValue: "{Lecen}",
											delimiter: "~",
											width: "300px"
										})
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({									
									items: [
										// 외국어/시험명
										new sap.m.Label({ text: "{i18n>LABEL_29017}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										new sap.m.Input({
											width: "145px",
											textAlign: "Begin",
											value: "{ZlanguTxt}",
											editable: false
										})
										.addStyleClass("mr-5px"),
										new sap.m.Input({
											width: "150px",
											textAlign: "Begin",
											value: "{ZltypeTxt}",
											editable: false
										})
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										// 수강학원
										new sap.m.Label({ text: "{i18n>LABEL_29010}", required: true,  width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										new sap.m.Input({
											width: "300px",
											value: "{Zlaorg}",
											maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "LanguPayApplyTableIn", "Zlaorg", false),
											editable: {
												path: "Status",
												formatter: function(v) {
													if (!v || v === "AA") return true;
													return false;
												}
											}
										})
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										// 학원 전화번호
										new sap.m.Label({ text: "{i18n>LABEL_29018}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										new sap.m.Input({
											width: "300px",
											value: "{Latell}",
											maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "LanguPayApplyTableIn", "Latell", false),
											editable: {
												path: "Status",
												formatter: function(v) {
													if (!v || v === "AA") return true;
													return false;
												}
											}
										})
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										// 지원금액
										new sap.m.Label({ text: "{i18n>LABEL_29012}", width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										new sap.m.Input({
											width: "200px",
											textAlign: "End",
											value: {
												path: "Suport",
												formatter: function(v) {
													if(v) return common.Common.numberWithCommas(v);
													else return "0";
												}
											},
											editable: false
										})
									]
								}).addStyleClass("search-field-group")
								// new sap.m.HBox({
									//     height: "40px",
								//     items: [
									//         // 영수증
								//         new sap.m.Label({ text: "{i18n>LABEL_29020}", required: true, design: "Bold", width: "130px" }),
								//         new sap.ui.unified.FileUploader(oController.PAGEID + "_FileUpload1", {
								// 			enabled: {
								// 				path: "Status",
								// 				formatter: function(v) {
								// 					if (!v || v === "AA") return true;
								// 					return false;
								// 				}
								// 			},
								// 			icon: "sap-icon://attachment",
								// 			width: "400px",
								// 			value: {
									// 				path: "Fname",
								// 				formatter: function(v) {
								// 					if(Common.checkNull(v)) return "";
								// 					else return v;
								// 				} 
								// 			},
								// 			//change: oController.onFileChange2.bind(oController),
								// 			buttonText: "{i18n>LABEL_29033}" // 파일첨부
								// 		}),
								// 		new sap.m.Button(oController.PAGEID + "_FileDelBtn1", {
									// 			//press: oController.onFileDelBtn.bind(oController),
								// 			icon: "sap-icon://delete",
								// 			text: "{i18n>LABEL_29034}", // 삭제
								// 			enabled: {
								// 				path: "Status",
								// 				formatter: function(v) {
								// 					if (!v || v === "AA") return true;
								// 					return false;
								// 				}
								// 			}
								// 		}).addStyleClass("ml-4px mb-6px")
								//     ]
								// }).addStyleClass("search-field-group"),
								// new sap.m.HBox({
									//     height: "40px",
								//     items: [
									//         // 수강확인증
								//         new sap.m.Label({ text: "{i18n>LABEL_29021}", required: true, design: "Bold", width: "130px" }),
								//         new sap.ui.unified.FileUploader(oController.PAGEID + "_FileUpload2", {
								// 			enabled: {
								// 				path: "Status",
								// 				formatter: function(v) {
								// 					if (!v || v === "AA") return true;
								// 					return false;
								// 				}
								// 			},
								// 			icon: "sap-icon://attachment",
								// 			width: "400px",
								// 			value: {
								// 				path: "Fname",
								// 				formatter: function(v) {
									// 					if(Common.checkNull(v)) return "";
								// 					else return v;
								// 				} 
								// 			},
								// 			//hange: oController.onFileChange2.bind(oController),
								// 			buttonText: "{i18n>LABEL_29033}" // 파일첨부
								// 		}),
								// 		new sap.m.Button(oController.PAGEID + "_FileDelBtn2", {
								// 			//press: oController.onFileDelBtn.bind(oController),
								// 			icon: "sap-icon://delete",
								// 			text: "{i18n>LABEL_29034}", // 삭제
								// 			enabled: {
								// 				path: "Status",
								// 				formatter: function(v) {
								// 					if (!v || v === "AA") return true;
								// 					return false;
								// 				}
								// 			}
								// 		}).addStyleClass("ml-4px mb-6px")
								//     ]
								// }).addStyleClass("search-field-group")
							]
						}).addStyleClass("search-inner-vbox"),
						new sap.m.VBox({
							width: "auto",
							fitContainer: true,
							items: [
								new sap.m.HBox({
									items: [
										// WBS
										new sap.m.Label({ text: "{i18n>LABEL_29022}", width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										oWBSCombo
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										// 영수일자
										new sap.m.Label({ text: "{i18n>LABEL_29009}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										oReceiptDate
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({									
									items: [
										// 어학성적
										new sap.m.Label({ text: "{i18n>LABEL_29023}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										new sap.m.Input(oController.PAGEID + "_RankInput", {
											width: "100px",
											textAlign: "End",
											value: "{Acqpot}",
											editable: false,
										}).addStyleClass("mr-3px"),
										new sap.m.Text({ text: "{i18n>LABEL_29029}" }),
										new sap.m.Input({
											width: "120px",
											textAlign: "Begin",
											value: "{AcqgrdT}",
											editable: false
										}),
										new sap.m.Text({ text: "{i18n>LABEL_29030}", width: "30px" }),
										new sap.m.Button({
											press: oController.onGradeVal.bind(oController),
											text: "{i18n>LABEL_29023}", // 어학성적
											enabled: {
												path: "Status",
												formatter: function(v) {
													if (!v || v === "AA") return true;
													return false;
												}
											}
										}).addStyleClass("button-light-sm ml-10px")
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										// 수강금액
										new sap.m.Label({ text: "{i18n>LABEL_29024}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										new sap.m.Input({
											width: "200px",
											textAlign: "End",
											liveChange: oController.getSuportPrice,
											maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "LanguPayApplyTableIn", "Lecbet", false),
											value: "{Lecbet}",
											editable: {
												path: "Status",
												formatter: function(v) {
													if (!v || v === "AA") return true;
													return false;
												}
											}
										})
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										// 수강중인 어종
										new sap.m.Label({ text: "{i18n>LABEL_29011}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										new sap.m.Input({
											width: "250px",
											textAlign: "Begin",
											value: "{Zlangu2Txt}",
											editable: false
										})
									]
								}).addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										// 지원기간
										new sap.m.Label({ text: "{i18n>LABEL_29025}", width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
										new sap.m.Input({
											width: "250px",
											value: {
												parts: [
													{ path: "Supbg" }, 
													{ path: "Supen" }
												],
												formatter: function(v1, v2) {
													if(v1){
														v1 = new Date(v1);
														v2 = new Date(v2);
														return [Common.DateFormatter(v1, "yyyy-MM-dd"), Common.DateFormatter(v2, "yyyy-MM-dd")].join(" ~ ");
													}
													else{
														return "";
													}
												}
											},
											editable: false
										})
									]
								}).addStyleClass("search-field-group")
							]
						}).addStyleClass("search-inner-vbox")
					]
				})
				.setModel(oController.DetailModel)
				.bindElement("/FormData")
				.addStyleClass("mb-10px"),
				new sap.m.FlexBox(oController.PAGEID + "_FileUpload", {
					items: [
						sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
					]
				}).addStyleClass("pl-10px pr-10px")
			]
		})
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_29001}",    // 어학비신청
				contentWidth: "1050px",
				contentHeight: "470px",
				buttons: [					
					new sap.m.Button({
						press: oController.onDialogSaveBtn.bind(oController),
						text: "{i18n>LABEL_29026}", // 저장,
						visible: {
							path: "Status",
							formatter: function (v) {
								if (v === "AA") return true;
								return false;
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onDialogDelBtn.bind(oController),
						text: "{i18n>LABEL_29027}", // 삭제
						visible: {
							path: "Status",
							formatter: function (v) {
								if (v === "AA") return true;
								return false;
							}
						}
					}).addStyleClass("button-delete"),
					new sap.m.Button({
						press: oController.onDialogApplyBtn.bind(oController),
						text: "{i18n>LABEL_29044}", // 신청,
						visible: {
							path: "Status",
							formatter: function (v) {
								if (!v) return true;
								return false;
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_29028}" // 닫기
					}).addStyleClass("button-default custom-button-divide")
				],
				content: [inputBox]
			})
			.addStyleClass("custom-dialog-popup")
			.setModel(oController.DetailModel)
			.bindElement("/FormData");

			return oDialog;
		}
	});
});
