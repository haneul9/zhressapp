sap.ui.define([], function() {
"use strict";

sap.ui.jsfragment("ZUI5_SF_EvalProfile.EvalProfileDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_07001"), // 평가이력
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