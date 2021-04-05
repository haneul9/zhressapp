sap.ui.define([
	"../common/Common", 
	"../common/AttachFileAction", 
	"../control/ODataFileUploader", 
	"sap/ui/unified/FileUploader"
], function (Common, AttachFileAction, ODataFileUploader) {
	"use strict";

	sap.ui.jsfragment("fragment.TextFlexBox", {
		createContent: function (oController) {
			
			return new sap.m.Dialog({
				showHeader: false,
				contentWidth: "400px",
				contentHeight: "200px",
				horizontalScrolling: false,
				content: [
					new sap.m.FlexBox(oController.PAGEID + "_TextFlexBox", {
						fitContainer: true,
						width: "auto",
						direction: "Column",
						items: []
					})
					.addStyleClass("memo-background")
				]
			})
		}
	});
});
