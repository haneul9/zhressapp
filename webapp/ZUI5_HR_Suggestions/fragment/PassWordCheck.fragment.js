sap.ui.define([
    "../delegate/ViewTemplates"
], function ( ViewTemplates) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_Suggestions.fragment.PassWordCheck", {

		createContent: function (oController) {

			var oApplyBox = new sap.m.HBox({
                fitContainer: true,
                items: [
                    ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "130px", "Right", true), // 비밀번호
                    new sap.m.Input({
                        width: "200px",
                        value: "{PassWord}",
                        type: sap.m.InputType.Password
                    })
                ]
            })
            .setModel(oController.PWordModel)
			.bindElement("/Data")
            .addStyleClass("search-field-group search-inner-vbox");
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_56001}",    // 케미톡톡
				contentWidth: "420px",
				contentHeight: "85px",
				buttons: [
                    new sap.m.Button({
						press: oController.onDialogPwordBtn.bind(oController),
						text: "{i18n>LABEL_56018}" // 확인
					}).addStyleClass("button-dark"),
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
			.addStyleClass("custom-dialog-popup");

			return oDialog;
		}
	});
});