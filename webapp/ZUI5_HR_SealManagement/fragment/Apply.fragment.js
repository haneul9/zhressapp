sap.ui.define([
	"../../common/Common"
], function (Common) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_SealManagement.fragment.Apply", {
		createContent: function (oController) {
			
			var oInGamBox1 = new sap.m.ComboBox(oController.PAGEID + "_ComboBox1", { //인감구분
				width: "250px",
				change: oController.onInGamCombo.bind(oController),
				selectedKey: "{Sigbn}",
				editable: {
					path: "Status1",
					formatter: function (v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/MultiBoxData",
					template: new sap.ui.core.ListItem({
						key: "{Sigbn}",
						text: "{Sitxt}"
					})
				}
			});
			
			var oYongdoBox = new sap.m.ComboBox({
				width: "250px",
				selectedKey: "{Sitype}",
				editable: {
					path: "Status1",
					formatter: function (v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/MultiBoxData2",
					template: new sap.ui.core.ListItem({
						key: "{Sitype}",
						text: "{Utext}"
					})
				}
			});
			
			// 키보드 입력 방지
			oInGamBox1.addDelegate({
				onAfterRendering: function () {
					oInGamBox1.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oInGamBox1);
			
			oYongdoBox.addDelegate({
				onAfterRendering: function () {
					oYongdoBox.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oYongdoBox);
			
			//FormBox 
			var inputBox = new sap.m.HBox({
				items: [
					new sap.m.VBox({
						width: "79%",
						fitContainer: true,
						items: [
							new sap.m.HBox({
								items: [
									// 신청일
									new sap.m.Label({ text: "{i18n>LABEL_23001}", width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
									new sap.m.Input({
										width: "250px",
										editable: false,
										value: {
											path: "Appdt",
											formatter: function (v) {
												return (v) ? Common.DateFormatter(v) : Common.DateFormatter(new Date());
											}
										}
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									// 인감구분
									new sap.m.Label({ text: "{i18n>LABEL_23002}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
									oInGamBox1
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
							//	height: "40px",
								visible: {
									path:"Sigbn",
									formatter: function(v) {
										if(v) return true;
										else return false;
									}
								},
								items: [
									new sap.m.FlexBox({
										items: [
										//	new sap.ui.core.Icon({
										//		src: "sap-icon://information"
										//	})
										//	.addStyleClass("color-icon-blue mr-5px mt-15px"),
											// 결재경로
											new sap.m.Label({ text: "{i18n>LABEL_23021}", width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) })
										]
									}),
									new sap.m.Text({
										text: {
											path: "Sigbn",
											formatter: function(v) {
												if(v === "C11") return oController.getBundleText("MSG_23004");
												else return oController.getBundleText("MSG_23005");
											}
										},
										textAlign: "Begin"
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									// 용도
									new sap.m.Label({ text: "{i18n>LABEL_23003}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
									oYongdoBox
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									// 문서명
									new sap.m.Label({ text: "{i18n>LABEL_23004}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
									new sap.m.Input({
										width: "527px",
										value: "{Sidoc}",
										maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "RegalsealRTableIn1", "Sidoc", false),
										editable: {
											path: "Status1",
											formatter: function (v) {
												if (!v || v === "AA") return true;
												return false;
											}
										}
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									// 제출처
									new sap.m.Label({ text: "{i18n>LABEL_23005}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
									new sap.m.Input({
										width: "527px",
										value: "{Sito}",
										maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "RegalsealRTableIn1", "Sito", false),
										editable: {
											path: "Status1",
											formatter: function (v) {
												if (!v || v === "AA") return true;
												return false;
											}
										}
									})
					 			]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
								height: "116px",
								items: [
									// 신청사유
									new sap.m.Label({ text: "{i18n>LABEL_23017}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
									new sap.m.VBox({
										fitContainer: true,
										items: [
											new sap.m.TextArea({
												width: "527px",
												value: "{Sireqtxt}",
												layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
												maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "RegalsealRTableIn1", "Sireqtxt", false),
												rows: 3,
												editable: {
													path: "Status1",
													formatter: function (v) {
														if (!v || v === "AA") return true;
														return false;
													}
												}
											}),
											new sap.m.FlexBox({
												items: [
													new sap.ui.core.Icon({
														src: "sap-icon://information"
													})
													.addStyleClass("color-icon-blue mr-5px pt-5px"),
													new sap.m.Text({ text: "{i18n>MSG_23016}", textAlign: "Begin" })
												]
											}).addStyleClass("mt-6px")
										]
									})
								]
							}).addStyleClass("search-field-group noLine-bottom")
						]
					}),
					new sap.m.FlexBox({
						width: "21%",
						visible:{
							path: "/Img",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						},
						items: [
							new sap.m.Image(oController.PAGEID + "_IngamIMG", {
								src: {
									path: "/Img",
									formatter: function(v) {
										return v || "images/photoNotAvailable.gif";
									}
								},
								width: "170px",
								height: "170px"
							})
						]
					})
				]
			}).addStyleClass("search-inner-vbox-line");

			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_23019}",	// 인장 날인 신청
				contentWidth: "1000px",
				contentHeight: "440px",
				buttons: [
					new sap.m.Button({
						press: oController.onDialogSaveBtn.bind(oController),
						text: "{i18n>LABEL_00101}", // 저장
						visible: {
							path: "Status1",
							formatter: function (v) {
								if (!v || v === "AA") return true;
								return false;
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onDialogRequestBtn.bind(oController),
						text: "{i18n>LABEL_00152}", // 신청,
						visible: {
							path: "Status1",
							formatter: function (v) {
								if (!v || v === "AA") return true;
								return false;
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: oController.onDialogDelBtn.bind(oController),
						text: "{i18n>LABEL_38047}", // 삭제
						visible: {
							path: "Status1",
							formatter: function (v) {
								if (v === "AA") return true;
								return false;
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
				content: [inputBox]
			})
			.addStyleClass("custom-dialog-popup")
			.setModel(oController.DetailModel)
			.bindElement("/Data");

			return oDialog;
		}
	});
});
