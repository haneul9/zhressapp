sap.ui.define([], function () {
	"use strict";

	var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "Notice"].join(".fragment.");

	sap.ui.jsfragment(DIALOG_DETAIL_ID, {
		createContent: function(oController) {

			var oDialog = new sap.m.Dialog({
				showHeader: false,
				content: [
					new sap.m.Image({
						decorative: false,
						src: $.app.CONTEXT_PATH + "/img/HiTalkTalkPopupNotice210511.png"
					})
				],
				beginButton: new sap.m.CheckBox("SUGGESTIONS_NOTICE_CONFIRMED", {
					text: "{i18n>MSG_00075}" // 다시 열지 않기
				})
				.addStyleClass("custom-checkbox"),
				endButton: new sap.m.Button({
					text: oController.getBundleText("LABEL_00133"), // 닫기
					press: function() {
						if ($.app.byId("SUGGESTIONS_NOTICE_CONFIRMED").getSelected()) {
							localStorage.setItem("ehr.suggestions.notice.confirmed", "Y");
						}
						oDialog.close();
					}
				}).addStyleClass("button-default")
			})
			.addStyleClass("custom-dialog-popup");

			return oDialog;
		}
	});
});
