/* eslint-disable no-undef */
sap.ui.define([
	"common/Common",	//
	"common/PickOnlyDateRangeSelection",
	"../delegate/ViewTemplates",
	"common/HoverIcon",
	"sap/m/InputBase"
], function (Common, PickOnlyDateRangeSelection, ViewTemplates, HoverIcon, InputBase) {
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
			});

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
										new sap.m.Label({ text: "{i18n>LABEL_29016}", width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
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
											editable: false
										}).addStyleClass("mr-3px"),
										new sap.m.Text({ text: "{i18n>LABEL_29029}" }),
										new sap.m.Input({
											width: "120px",
											textAlign: "Begin",
											value: "{AcqgrdT}",
											editable: false
										}),
										new sap.m.Text({ text: "{i18n>LABEL_29030}", width: "30px" }),
										new HoverIcon({
											src: "sap-icon://information",
											hover: function(oEvent) {
												Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_29022")); // 어학성적 버튼을 클릭하여 수강하시고자하는 유효한 어학성적을 선택하시기 바랍니다.
											},
											leave: function(oEvent) {
												Common.onPressTableHeaderInformation.call(oController, oEvent);
											}
										})
										.addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue"),
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
										}).addStyleClass("button-light-sm")
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
													if(v1 && v2){
														return [moment(v1).format("YYYY-MM-DD"), moment(v2).format("YYYY-MM-DD")].join(" ~ ");
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
				new sap.m.VBox("filePanel", {
					width: "100%",
					height: "210px",
					fitContainer: true,
					items: [
						new sap.m.HBox({
							items: [
								ViewTemplates.getLabel("header", "{i18n>LABEL_59021}", "70px", "Left").addStyleClass("sub-title mt-10px"), // 첨부파일
								new sap.m.HBox({
									items: [
										new sap.ui.core.Icon({
											src: "sap-icon://information"
										})
										.addStyleClass("color-icon-blue mr-5px pt-5px"),
										new sap.m.Text({ text: "{i18n>MSG_29020}", textAlign: "Begin" })
									]
								}).addStyleClass("mt-10px")
							]
						}),
						new sap.m.VBox({
							items: [
								fragment.COMMON_ATTACH_FILES.renderer(oController,"001"),
								fragment.COMMON_ATTACH_FILES.renderer(oController,"002")
							]
						}).addStyleClass("custom-multiAttach-file")
					]
				})
				.addStyleClass("/*search-field-group*/")
			]
		});
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_29001}",    // 어학비신청
				contentWidth: "1050px",
				// contentHeight: "470px",
				afterOpen: oController.onAfterApply.bind(oController),
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
