sap.ui.define([
	"../delegate/OnRequest"
], function(
	OnRequest
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTripMap.fragment.RequestDetailDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19002"), // 출장 신청
			contentWidth: "1600px",
			contentHeight: "96%",
			content: sap.ui.jsfragment("ZUI5_HR_BusinessTripMap.fragment.RequestDetail", oController),
			draggable: true,
			buttons: [
				new sap.m.Button({
					text: "{i18n>LABEL_00154}", // 재작성
					enabled: "{/Header/Btact}",
					visible: "{= ${/Header/Edtfg} && ${/Header/Status1} === '88' }", // 반려 상태
					press: OnRequest.pressRevise.bind(oController)
				})
				.addStyleClass("button-light"),
				new sap.m.Button({
					text: "{i18n>LABEL_00103}", // 삭제
					enabled: "{/Header/Btact}",
					visible: "{= ${/Header/Edtfg} && (${/Header/Status1} === 'AA' || ${/Header/Status1} === 'JJ') }", // 미결재 상태
					press: OnRequest.pressRemove.bind(oController)
				})
				.addStyleClass("button-delete"),
				new sap.m.Button({
					text: "{i18n>LABEL_00101}", // 저장
					enabled: "{/Header/Btact}",
					visible: "{= ${/Header/Edtfg} && (!${/Header/Status1} || ${/Header/Status1} === 'AA' || ${/Header/Status1} === 'JJ') }", // 신규, 미결재 상태
					press: OnRequest.pressSave.bind(oController)
				})
				.addStyleClass("button-light"),
				new sap.m.Button({
					text: "{i18n>LABEL_00152}", // 신청
					enabled: "{/Header/Btact}",
					visible: "{= ${/Header/Edtfg} && (!${/Header/Status1} || ${/Header/Status1} === 'AA' || ${/Header/Status1} === 'JJ') }", // 신규, 미결재 상태
					press: OnRequest.pressRequest.bind(oController)
				})
				.addStyleClass("button-dark"),					
				new sap.m.Button({
					type: sap.m.ButtonType.Default,
					text: oController.getBundleText("LABEL_00133"), // 닫기
					press: function() {
						oDialog.close();
					}
				})
				.addStyleClass("button-default custom-button-divide")
			]
		})
		.setModel(oController.RequestDetailDialogHandler.getModel())
		.addStyleClass("custom-dialog-popup");

		if (screen.availWidth <= 1280) {
			oDialog.setContentWidth("1280px");
		}

		return oDialog;
	}

});

});