sap.ui.define([
	"../../common/Common"
], function (Common) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_PreschoolersAllowance.fragment.PreschoolersAllowanceDetail", {
		createContent: function (oController) {
			
			var inputBox = new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
						items: [
							// 신청일
							new sap.m.Label({ text: "{i18n>LABEL_22009}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: {
									path: "Begda",
									formatter: function (v) {
										return (v) ? Common.DateFormatter(v) : "";
									}
								}
							})
						]
					}).addStyleClass("search-field-group search-inner-vbox"),
					new sap.m.HBox({   
						items: [
							// 자녀명
							new sap.m.Label({ text: "{i18n>LABEL_22010}", required: true, width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.ComboBox(this.createId("Zname"), {
								width: "250px",
								selectedKey: "{Zname}",
								change: oController.onChangeZname.bind(oController),
								items: {
									path: "/ChildTableIn2",
									template: new sap.ui.core.ListItem({
										key: "{Zname}",
										text: "{Zname}"
									})
								},
								editable: {
									parts: [
										{path: "isNew"},
										{path: "Status"},
									],
									formatter: function(v1, v2) {
										if(v1 === true || !v2 || v2 === "" || v2 === "AA") return true;
										else return false;
									}
								}
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						height: "40px",
						items: [
							// empty
							new sap.m.Label({ text: "", width: "9.7em" }),
							new sap.ui.core.Icon({
								src: "sap-icon://information",								
								color: "#da291c"
							})
							.addStyleClass("color-icon-blue ml-5px pt-8px"),
							new sap.m.Text({
								text: "{i18n>MSG_22002}"
							}).addStyleClass("ml-5px mr-8px"),
							new sap.m.Link({
								text: "{i18n>LABEL_22023}",
								press: oController.redirect
							}).addStyleClass("mt-7px"),
							new sap.m.Text({
								text: "{i18n>MSG_22010}"
							}).addStyleClass("ml-2px")
							// new sap.m.Text({
							// 	// 경고 문자
							// 	text: "{i18n>MSG_22002}",
							// 	textAlign: "Begin"
							// }).addStyleClass("ml-5px")
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							// 생년월일
							new sap.m.Label({ text: "{i18n>LABEL_22011}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: {
									path: "Fgbdt",
									formatter: function (v) {
										return (v) ? Common.DateFormatter(v) : "";
									}
								}
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							// 지원기간
							new sap.m.Label({ text: "{i18n>LABEL_22012}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: {
									parts: [
										{path: "Zbegym"},
										{path: "Zendym"}
									],
									formatter: function (v1, v2) {
										if(!v1 || !v2) return "";
										
										v1 = new Date(parseInt(v1.substr(0, 4)), parseInt(v1.substr(4)) - 1, 1);
										v2 = new Date(parseInt(v2.substr(0, 4)), parseInt(v2.substr(4)) - 1, 1);

										return [Common.DateFormatter(v1, "yyyy년 MM월"), Common.DateFormatter(v2, "yyyy년 MM월")].join(" ~ ");
									}
								}
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							// 월 지원금액(원)
							new sap.m.Label({ text: "{i18n>LABEL_22013}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: {
									path: "Zpaymm",
									formatter: function (v) {
										return (v) ? Common.numberWithCommas(v) : "";
									}
								}
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							// 총 지원금액(원)
							new sap.m.Label({ text: "{i18n>LABEL_22014}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: {
									path: "Zpaytt",
									formatter: function (v) {
										return (v) ? Common.numberWithCommas(v) : "";
									}
								}
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						height: "40px",
						items: [
							// 결재상태
							new sap.m.Label({ text: "{i18n>LABEL_22015}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "95%",
								editable: false,
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								value: "{StatusT}"
							}).addStyleClass("input-to-text")
						],
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v === true) return false;
								else return true;
							}
						}
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						height: "40px",
						items: [
							// 반려사유
							new sap.m.Label({ text: "{i18n>LABEL_22016}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "95%",
								editable: false,
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								value: "{Notes}"
							}).addStyleClass("input-to-text")
						],
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v === true) return false;
								else return true;
							}
						}
					}).addStyleClass("search-field-group")
				]
			});

			var oDialog = new sap.m.Dialog(this.createId("DetailDialog"), {
				title: "{i18n>LABEL_22017}",	// 미취학자녀 학자금 신청
				contentWidth: "700px",
				contentHeight: "300px",
				afterOpen: oController.onDetailDialogAfter.bind(oController),
				buttons: [
					new sap.m.Button({
						press: oController.onPressRequestCompleteBtn.bind(oController),
						text: "{i18n>LABEL_00152}", // 신청
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v === true) return true;
								else return false;
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: oController.onPressModifyCompleteBtn.bind(oController),
						text: "{i18n>LABEL_00101}", // 저장
						visible: {
							parts: [
								{path: "isNew"},
								{path: "Status"},
							],
							formatter: function(v1, v2) {
								if(v1 === false && v2 === "AA") return true;
								else return false;
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onPressModifyDeleteBtn.bind(oController),
						text: "{i18n>LABEL_00103}", // 삭제
						visible: {
							parts: [
								{path: "isNew"},
								{path: "Status"},
							],
							formatter: function(v1, v2) {
								if(v1 === false && v2 === "AA") return true;
								else return false;
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
				.setModel(oController.DetailModel)
				.bindElement("/Data")
				.addStyleClass("custom-dialog-popup");		

			return oDialog;
		}
	});
});
