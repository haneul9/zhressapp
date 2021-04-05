sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates"
], function (Common, ViewTemplates) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_RetireInterview.fragment.Apply", {

		createContent: function (oController) {

			var oApplyBox = new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_45003}", "130px", "Right"), // 신청일
                            new sap.m.Text({
                                width: "200px",
                                text: {
                                    path: "Reqdt",
                                    formatter: function(v) {
                                        if(v) return Common.DateFormatter(v);
                                    }
                                },
                                textAlign: "Begin"
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_45014}", "130px", "Right"), // 신청자
							new sap.m.Text({
                                width: "200px",
                                text: "{Ename}",
                                textAlign: "Begin"
                            }),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_45005}", "130px", "Right"), // 부서
                            new sap.m.Text({
                                width: "200px",
                                text: "{Stext}",
                                textAlign: "Begin"
                            }).addStyleClass("ml-8px")
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_45015}", "130px", "Right", true), // 신청내역
                            new sap.m.TextArea({
                                rows: 10,
								width: "612px",
								value:"{Zdtlrs}",
								maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "RtrintRequestTableIn1", "Zdtlrs", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "A") return true;
										return false;
									}
								}
							}).addStyleClass("mt-8px mb-8px")
						]
					})
					.addStyleClass("search-field-group h-auto")
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox");
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_45013}",    // 면담신청내역
				contentWidth: "850px",
				contentHeight: "375px",
				buttons: [
					new sap.m.Button({
						press: oController.onDialogSaveBtn.bind(oController),
						text: "{i18n>LABEL_45017}", // 임시저장,
						visible: {
							path: "Status",
							formatter: function (v) {
								if (!v || v === "A") return true;
								return false;
							}
						}
					}).addStyleClass("button-light"),
                    new sap.m.Button({
						press: oController.onDialogApplyBtn.bind(oController),
						text: "{i18n>LABEL_45016}", // 신청,
						visible: {
							path: "Status",
							formatter: function (v) {
								if (!v || v === "A") return true;
								return false;
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: oController.onDialogDelBtn.bind(oController),
						text: "{i18n>LABEL_45018}", // 삭제
						visible: {
							path: "Status",
							formatter: function (v) {
								if (v === "A") return true;
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
				content: [
                    oApplyBox
                ]
			})
			.addStyleClass("custom-dialog-popup")
			.setModel(oController.ApplyModel)
			.bindElement("/FormData");

			return oDialog;
		}
	});
});