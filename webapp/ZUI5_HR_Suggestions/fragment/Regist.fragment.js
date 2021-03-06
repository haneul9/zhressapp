sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates"
], function (Common, ViewTemplates) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_Suggestions.fragment.Regist", {

		createContent: function (oController) {

			var oApplyBox = new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_56006}", "130px", "Right", true), // 제목
                            new sap.m.Input({
                                width: "630px",
                                value: "{Title}",
                                maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "SuggestionBoxTableIn2", "Title", false),
                                editable: {
									parts: [{path: "Sdate"}, {path: "/Gubun"}],
									formatter: function(v1, v2) {
										return !v1 || v2 === "X";
									}
								}
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox(oController.PAGEID + "_RegistDateBox", {
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_56003}", "130px", "Right"), // 등록일
							new sap.m.Text({
                                width: "250px",
                                textAlign: "Begin",
                                text: {
                                    path: "Sdate",
                                    formatter: function(v) {
                                        return v ? Common.DateFormatter(v) : "";
                                    }
                                }
                            }),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_56008}", "130px", "Right").addStyleClass("mr-8px"), // 최종변경일시
                            new sap.m.Text({
                                text : {
                                    parts: [{path: "Aedtm"}, {path: "Aetim"}],
                                    formatter: function(v1, v2) {
										if(v1 && v2){
                                        	v1 = Common.DateFormatter(v1);
											v2 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" }).format(new Date(v2.ms), true);
										}
										return v1 + " " + v2; 
                                    }
                                }, 
                                textAlign : "Begin"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox(oController.PAGEID + "_IsHideBox", {
						width: "100%",
						fitContainer: true,
						visible: {
							path: "/Gubun",
							formatter: function(v) {
								return v === "X";
							}
						},
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "130px", "Right", true), // 비밀번호
							new sap.m.Input({
                                width: "150px",
                                value: "{Pword}",
								type: sap.m.InputType.Password,
								maxLength: 10,
                                editable: {
									parts: [{path: "Sdate"}, {path: "/Gubun"}],
									formatter: function(v1, v2) {
										return !v1 || v2 === "X";
									}	
								}
                            }).addStyleClass("mr-8px"),
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{i18n>MSG_56006}"
                            }).addStyleClass("pt-10px")
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_56010}", "130px", "Right", true), // 내용
                            new sap.m.TextArea({
                                rows: 10,
								width: "630px",
								value:"{Detail}",
								maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "SuggestionBoxTableIn2", "Detail", false),
								editable: {
									parts: [{path: "Sdate"}, {path: "/Gubun"}],
									formatter: function(v1, v2) {
										return !v1 || v2 === "X";
									}
								}
							}).addStyleClass("mt-8px mb-8px")
						]
					})
					.addStyleClass("search-field-group h-auto"),
					new sap.m.HBox({
						fitContainer: true,
						items: [
                            sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
					})
				]
			})
			.setModel(oController.RegistModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox");

			var oCommentBox = new sap.m.VBox({
				visible: {
                    path: "/HideComment",
                    formatter: function(v) {
                        return v !== "X";
                    }
                },
				fitContainer: true,
				items: [
					new sap.m.HBox({
						justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
						fitContainer: true,
						items: [
							new sap.m.HBox({
								fitContainer: true,
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_56015}", "auto", "Left").addStyleClass("sub-title pt-9px mr-10px"), // 댓글
									new sap.m.Text({
										width: "auto",
										textAlign: "Begin",
										text: "{i18n>MSG_56006}"
									}).addStyleClass("pt-10px")
								]
							})
						]
					})
					.addStyleClass("mt-10px"),
					new sap.m.VBox(oController.PAGEID + "_CommentBox", {
						fitContainer: true,
						items: []
					}),
					new sap.m.HBox({
						justifyContent: sap.m.FlexJustifyContent.End,
						fitContainer: true,
						items: [
							new sap.m.Input({
								width: "160px",
								value: "{Pword}",
								maxLength: 10,
								type: sap.m.InputType.Password,
								placeholder: "{i18n>MSG_56013}"
							}).addStyleClass("mr-5px"),
							new sap.m.Button({
								press: oController.onDialogSaveBtn.bind(oController),
								text: "{i18n>LABEL_56016}" // 저장
							}).addStyleClass("button-dark mt-4px")
						]
					}).addStyleClass("custom-comment"),
					new sap.m.HBox({
						fitContainer: true,
						items: [
							new sap.m.TextArea({
								rows: 2,
								width: "775px",
								value:"{Detail}",
								maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "SuggestionBoxTableIn3", "Detail", false)
							})
						]
					})
				]
			})
			.setModel(oController.CommentModel)
			.bindElement("/Data");
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_56011}",    // 상세내용
				contentWidth: "850px",
				contentHeight: "640px",
				buttons: [
                    new sap.m.Button({
						press: oController.onDialogRegistBtn.bind(oController),
						text: "{i18n>LABEL_56005}", // 등록
						visible: {
							parts: [{path: "Sdate"}, {path: "/Gubun"}],
							formatter: function(v1, v2) {
								return !v1 || v2 === "X";
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: oController.onDialogReBtn.bind(oController),
						text: "{i18n>LABEL_56013}", // 수정
						visible: {
							parts: [{path: "Sdate"}, {path: "/Gubun"}],
							formatter: function(v1, v2) {
								return Common.checkNull(!v1) && Common.checkNull(v2);
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onDialogDeleteBtn.bind(oController),
						text: "{i18n>LABEL_56014}", // 삭제
						visible: {
							parts: [{path: "Sdate"}, {path: "/Gubun"}],
							formatter: function(v1, v2) {
								return Common.checkNull(!v1) && Common.checkNull(v2);
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
				content: [
                    oApplyBox,
					oCommentBox
                ]
			})
			.addStyleClass("custom-dialog-popup")
			.setModel(oController.RegistModel)
			.bindElement("/FormData");

			return oDialog;
		}
	});
});