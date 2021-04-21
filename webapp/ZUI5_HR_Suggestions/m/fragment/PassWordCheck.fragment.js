sap.ui.define([
    "../../delegate/ViewTemplates"
], function ( ViewTemplates) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_Suggestions.m.fragment.PassWordCheck", {

		createContent: function (oController) {

			var oApplyBox = new sap.m.HBox({
                width: "245px",
                fitContainer: true,
                items: [
                    ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "80px", "Right", true), // 비밀번호
                    new sap.m.Input({
                        width: "140px",
                        value: "{PassWord}",
                        type: sap.m.InputType.Password
                    })
                ]
            })
            .addStyleClass("search-field-group search-inner-vbox")
            .setModel(oController.PWordModel)
			.bindElement("/Data");
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_56001}",    // Hi톡톡
				contentWidth: "300px",
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