sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates"
], function (Common, ViewTemplates) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_NoticeHass.fragment.Regist", {

		createContent: function (oController) {

			var oApplyBox = new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57008}", "130px", "Right", true), // 제목
                            new sap.m.Input({
                                width: "630px",
                                value: "{Title}",
                                maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "NoticeManageTableIn2", "Title", false),
                                editable: {
									path: "/Gubun",
									formatter: function(v) {
										return v === "X";
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
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57011}", "130px", "Right"), // 등록자
                            new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: {
									path: "ApernTxt",
									formatter: function(v) {
										if(v) return v;
										else{
											var vUser1 = oController.getUserDetail("Pbtxt");
											var vUser2 = oController.getUserDetail("Btrtx");
											var vUser3 = oController.getUserDetail("HgradeT");
											var vUser4 = oController.getUserDetail("Stext");
											var vUser5 = oController.getUserDetail("Ename");
											var vUser6 = oController.getUserDetail("ZtitleT");

											return vUser1 + " " + vUser2 + " " + vUser3 + " " + vUser4 + " " + vUser5 + " " + vUser6
										}
									}
								}
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						visible: {
							path: "Sdate",
							formatter: function(v) {
								return Common.checkNull(!v);
							}
						},
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_57004}", "130px", "Right"), // 등록일
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
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57010}", "130px", "Right").addStyleClass("mr-8px"), // 최종변경일/시
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
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						visible: {
							path: "/Gubun",
							formatter: function(v) {
								return v === "X";
							}
						},
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_57012}", "130px", "Right"), // 중요항목
                            new sap.m.CheckBox({ 
								select: oController.onChangeData.bind(oController),
                                selected: {
                                    path: "Impor",
                                    formatter: function(v) {
                                        return v === "X";
                                    }
                                },
								editable: {
									path: "/Gubun",
									formatter: function(v) {
										return v === "X";
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_57016}", "130px", "Right", true), // 내용
                            new sap.m.TextArea({
                                rows: 10,
								width: "630px",
								value:"{Detail}",
								maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "NoticeManageTableIn2", "Detail", false),
								editable: {
									path: "/Gubun",
									formatter: function(v) {
										return v === "X";
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
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_57013}",    // 공지사항 상세내용
				contentWidth: "850px",
				contentHeight: "545px",
				buttons: [
                    new sap.m.Button({
						press: oController.onDialogSaveBtn.bind(oController),
						text: "{i18n>LABEL_57015}", // 임시저장
						visible: {
							path: "/Gubun",
							formatter: function(v) {
								return v === "X";
							}
						}
					}).addStyleClass("button-light"),
                    new sap.m.Button({
						press: oController.onDialogRegistBtn.bind(oController),
						text: "{i18n>LABEL_57009}", // 등록
						visible: {
							path: "/Gubun",
							formatter: function(v) {
								return v === "X";
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: oController.onDialogDeleteBtn.bind(oController),
						text: "{i18n>LABEL_57017}", // 삭제
						visible: {
							path: "/Gubun",
							formatter: function(v) {
								return v === "X";
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
                    oApplyBox
                ]
			})
			.addStyleClass("custom-dialog-popup")
			.setModel(oController.RegistModel)
			.bindElement("/FormData");

			return oDialog;
		}
	});
});