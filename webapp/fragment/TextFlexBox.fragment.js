sap.ui.define([
	"../common/Common", 
	"../common/AttachFileAction", 
	"../control/ODataFileUploader", 
	"sap/ui/unified/FileUploader"
], function (Common, AttachFileAction, ODataFileUploader) {
	"use strict";

	sap.ui.jsfragment("fragment.TextFlexBox", {
		createContent: function (oController) {
			
			var oDialog = new sap.m.Dialog({
				showHeader: false,
				contentWidth: "400px",
				contentHeight: "auto",
				horizontalScrolling: false,
				content: [
					new sap.m.FlexBox(oController.PAGEID + "_TextFlexBox", {
						fitContainer: true,
						width: "auto",
						direction: "Column",
						items: []
					})
					.addStyleClass("memo-background")
				],
				buttons: [
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_21011}", // 닫기
					}).addStyleClass("button-default custom-button-divide")
				]
			})

			return oDialog;
		}
	});
});
