sap.ui.define([
	"../common/Common"
], function(Common) {
"use strict";

sap.ui.jsfragment($.app.CONTEXT_PATH + ".Popup", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_07001"), // 평가 프로파일
			contentWidth: "1280px",
			// contentHeight: "1500px",
			content: sap.ui.jsfragment("ZUI5_SF_EvalProfile.Page", oController),
			// beforeOpen: common.Search360Review.onBeforeOpen,
			// afterOpen: common.Search360Review.onAfterOpen,
			endButton: [
				new sap.m.Button({
					type: sap.m.ButtonType.Default,
					text: oController.getBundleText("LABEL_00133"), // 닫기
					press: function() {
						oDialog.close();
					}
				})
			]
		})
		.addStyleClass("custom-dialog-popup");
		// .addEventDelegate({
		// 	onAfterRendering: function() {
		// 		oLayout.setWidth(oDialog.getContentWidth());
		// 	}
		// });

		return oDialog;
	}

});

});