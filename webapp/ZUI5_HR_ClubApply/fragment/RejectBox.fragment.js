sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsfragment("ZUI5_HR_ClubApply.fragment.RejectBox", {
		createContent: function (oController) {
			var rjectBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							// 반려사유
							new sap.m.Label({ 
								text: "{i18n>LABEL_10027}",
								design: "Bold",
								required: true,
								width: "5em" 
							}),
							new sap.m.Input(oController.PAGEID + "_RjectInput", { 
								value: "{Rject}",
								width: "600px",
								placeholder: "{i18n>MSG_10008}"
							})
						]
					})
					.addStyleClass("sapMFlexBox")
				]
			})
			.addStyleClass("sapMBarLeft mt-6px ml-8px")
			.setModel(oController.RejectModel)
			.bindElement("/Data");
	
			var oDialog = new sap.m.Dialog(oController.PAGEID + "_RejectBox_Dialog", {
				title: "{i18n>LABEL_10029}", //반려 입력창
				contentWidth: "700px",
				contentHeight: "80px",
				buttons: [
					new sap.m.Button({
						press: oController.onPressRejectBtn,
						text: "{i18n>LABEL_10021}" //반려
					}),
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_10019}" // 취소
					})
				],
				content: [rjectBox]
			});
		return oDialog;
		}
	});
});