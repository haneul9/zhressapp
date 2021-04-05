sap.ui.define([
	"../../common/Common"
], function (Common) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_Donate.fragment.DonateApply", {
		createContent: function (oController) {
			
			//FormBox 
			var inputBox = new sap.m.VBox({
				items: [
					new sap.m.FlexBox({
                        justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                        alignContent: sap.m.FlexAlignContent.End,
                        alignItems: sap.m.FlexAlignItems.End,
						width: "auto",
						fitContainer: true,
						items: [
							new sap.m.HBox({
								width: "50%",
								items: [
									// 참여자
									new sap.m.Label({ text: "{i18n>LABEL_33012}", width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" })	}),
									new sap.m.Input({
										width: "200px",
                                        editable: false,
                                        textAlign: "End",
										value: {
											path: "Dopcn",
											formatter: function (v) {
												return (v) ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
											}
										}
                                    }),
                                    new sap.m.Text({ textAlign: "Begin", text: "{i18n>LABEL_33016}" }).addStyleClass("ml-6px")
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
								width: "50%",
								items: [
									// 기부금
									new sap.m.Label({ text: "{i18n>LABEL_33013}", width: "130px", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }) }),
									new sap.m.Input({
                                        width: "250px",
                                        textAlign: "End",
										editable: false,
										value: {
											path: "Dotbt",
											formatter: function (v) {
												return (v) ? Common.numberWithCommas(v) : "0";
											}
										}
                                    }),
                                    new sap.m.Text({ textAlign: "Begin", text: "{i18n>LABEL_33017}" }).addStyleClass("ml-6px")
								]
							}).addStyleClass("search-field-group")
						]
					}).addStyleClass("search-inner-vbox"),
					new sap.m.FormattedText(oController.PAGEID + "_TopText", {
                        htmlText: oController.getTopText()
                    }).addStyleClass("custom-donate-info"),
                    new sap.m.VBox({
                        width: "auto",
                        items: [
                            new sap.m.Text({ width: "auto", text: "{i18n>MSG_33002}" }).addStyleClass("mb-7px"),
                            new sap.m.Text({ width: "auto", text: "{i18n>MSG_33003}" }).addStyleClass("mb-7px"),
                            new sap.m.Text({ width: "auto", text: "{i18n>MSG_33004}" }).addStyleClass("mb-7px"),
                            new sap.m.Text({ width: "auto", text: "{i18n>MSG_33005}" }).addStyleClass("mb-10px")
                        ]
                    }).addStyleClass("custom-OpenHelp-msgBox mt-0"),
                    new sap.m.VBox({
						width: "auto",
						items: [
							new sap.m.FormattedText(oController.PAGEID + "_MidText", {
								htmlText: oController.getMidText()
							}),
                            new sap.m.HBox({
                                width: "auto",
								items: [
                                    new sap.m.FormattedText(oController.PAGEID + "_BotText", {
                                        htmlText: oController.getBotText()
                                    }),
                                    new sap.m.Button(oController.PAGEID + "_ApplyBtn", {
                                        press: oController.onDialogApply.bind(oController),
										text: "{i18n>LABEL_33015}", // 약정합니다
									//	height: "60px",
										visible:{
											path: "Status",
											formatter: function(v) {
												if(!v || v === "00") return true;
												else return false;
											}
										}
                                    }).addStyleClass("ml-5px button-dark")
                                ]
                            }),
                            new sap.m.Text({ width: "auto", text: "{i18n>MSG_33008}" }),
						]
					}).addStyleClass("custom-msgBox-default"),
					new sap.m.VBox({
						width: "auto",
						items: [
							new sap.m.HBox({
								items: [
									// 기부금
									new sap.m.Label({ text: "{i18n>LABEL_33013}", width: "9.7em", layoutData: new sap.m.FlexItemData({ maxHeight: "44px" })  }),
									new sap.m.Input({
                                        width: "250px",
                                        textAlign: "End",
                                        liveChange: oController.getDonation,
										value: {
											path: "DoamtT",
											formatter: function (v) {
												return (v) ? v : "0";
											}
										},
										editable:{
											path: "Status",
											formatter: function(v) {
												if(!v || v === "00") return true;
												else return false;
											}
										}
                                    }),
                                    new sap.m.Text({ textAlign: "Begin", text: "{i18n>LABEL_33017}" }).addStyleClass("ml-6px")
								]
							}).addStyleClass("search-field-group")
						]
					}).addStyleClass("search-inner-vbox mt-20px")
				]
			})
			.setModel(oController.DetailModel)
			.bindElement("/Data");

			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_33001}",	// 사회공헌
				contentWidth: "1000px",
				contentHeight: "564px",
				buttons: [
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_33014}" // 닫기
					}).addStyleClass("button-default")
				],
				content: [inputBox]
			})
			.addStyleClass("custom-dialog-popup");

			return oDialog;
		}
	});
});
