sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsfragment("ZUI5_HR_ClubApply.fragment.ApplyClub", {
		createContent: function (oController) {
			var inputBox = new sap.m.FlexBox({
				fitContainer: true,
				direction: "Column",
				items: [
					new sap.m.FlexBox({
						items: [
							// 동호회
							new sap.m.Label({ 
								text: "{i18n>LABEL_10002}",
								design: "Bold", 
								width: "8em" 
							}),
							new sap.m.Select(oController.PAGEID + "_Type", {
								change: $.proxy(oController.onSelectBox, oController),
								items: {
									path: "/MultiBoxData",
									template: new sap.ui.core.ListItem({
										key: "{Dongho}", 
										text: "{Donghotx}"
									})
								},
								width: "250px"
							})
						]
					})
					.addStyleClass("sapMFlexBox"),
					
					new sap.m.FlexBox({
						items: [
							// 월 회비
							new sap.m.Label({ 
								text: "{i18n>LABEL_10007}", 
								design: "Bold", 
								width: "8em" 
							}),
							new sap.m.Text(oController.PAGEID + "_Betrgtx", { 
								text: {
									path: "Betrgtx",
									formatter: function(v) {
										return (v) +" 원";
									}
								},
								textAlign: "End",
								width: "250px"
							})
						]
					})
					.addStyleClass("sapMFlexBox")
				]
			})
			.addStyleClass("sapMBarLeft mt-8px ml-8px")
			.setModel(oController.ApplyClubModel)
			.bindElement("/MultiBoxData");
	
			var oDialog = new sap.m.Dialog(oController.PAGEID + "_ApplyClub_Dialog", {
				title: "{i18n>LABEL_10024}", //동호회 가입신청
				contentWidth: "500px",
				contentHeight: "150px",
				buttons: [
					new sap.m.Button({
						press: oController.onPressApplyBtn,
						text: "{i18n>LABEL_10026}" // 신청
					}),
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_10019}" // 취소
					})
				],
				content: [inputBox]
			});
		return oDialog;
		}
	});
});