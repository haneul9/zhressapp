sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates"
], function (Common, ViewTemplates) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_SuggestionsHass.fragment.Regist", {

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
                                editable: false
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
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
                            ViewTemplates.getLabel("header", "{i18n>LABEL_56008}", "130px", "Right").addStyleClass("mr-8px"), // 최종변경일/시
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
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_56009}", "130px", "Right"), // 비공개
                            new sap.m.CheckBox({ 
                                selected: {
                                    path: "Hide",
                                    formatter: function(v) {
                                        return v === "X";
                                    }
                                },
								editable: false
                            })
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
								editable: false
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
				title: "{i18n>LABEL_56011}",    // HR 건의사항 상세내용
				contentWidth: "850px",
				contentHeight: "500px",
				buttons: [
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