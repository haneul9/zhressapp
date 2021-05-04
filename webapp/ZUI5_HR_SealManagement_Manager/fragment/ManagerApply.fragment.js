sap.ui.define([
	"common/Common",	//
	"common/EmpBasicInfoBox"
], function (Common, EmpBasicInfoBox) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_SealManagement_Manager.fragment.ManagerApply", {
		createContent: function (oController) {

			var oEmpBasicInfoBox = new EmpBasicInfoBox(oController.EmployeeModel);

			var oYongdoBox = new sap.m.ComboBox({ //용도
				width: "250px",
				selectedKey: "{Sitype}",
				editable: false,
				items: {
					path: "/UseMultiBox",
					template: new sap.ui.core.ListItem({
						key: "{Sitype}",
						text: "{Utext}"
					})
				}
			});
			
			oYongdoBox.addDelegate({
				onAfterRendering: function () {
					oYongdoBox.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oYongdoBox);

			//FormBox 
			var inputBox = new sap.m.HBox({
				items: [
					new sap.m.VBox({
						width: {
							path: "/Img",
							formatter: function(v) {
								return Common.checkNull(v) ? "100%" : "79%";
							}
						},
						fitContainer: true,
						items: [
							new sap.m.HBox({
								items: [
									// 신청일
									new sap.m.Label({ text: "{i18n>LABEL_23001}",  width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
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
									new sap.m.Label({ text: "{i18n>LABEL_23002}", required: true,  width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
									new sap.m.Input({
										width: "250px",
										editable: false,
										value: "{Sitxt}"
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
							//	height: "40px",
								items: [
									new sap.m.FlexBox({
										items: [
										//	new sap.ui.core.Icon({
										//		src: "sap-icon://information",
										//		color: "#da291c"
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
									}).addStyleClass("ml-5px mb-3px")
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
										width: "620px",
										editable: false,
										value: "{Sidoc}"
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									// 제출처
									new sap.m.Label({ text: "{i18n>LABEL_23005}", required: true, width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
									new sap.m.Input({
										width: "620px",
										editable: false,
										value: "{Sito}"
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
												width: "620px",
												editable: false,
												layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
												rows: 3,
												value: "{Sireqtxt}"
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
										return v || "";
									}
								},
								width: "170px",
								height: "170px"
							})
						]
					})
				]
			})			
			.addStyleClass("search-inner-vbox-line mt-20px")
			.setModel(oController.DetailModel)
			.bindElement("/Data");

			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_23019}",	// 인장 날인 신청
				contentWidth: "1000px",
				contentHeight: "526px",
				buttons: [
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_00133}" // 닫기
					}).addStyleClass("button-default	")
				],
				content: [
					oEmpBasicInfoBox,
					inputBox
				]
			}).addStyleClass("custom-dialog-popup");			

			return oDialog;
		}
	});
});
