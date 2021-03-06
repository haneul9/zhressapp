sap.ui.define([
	"../delegate/OnSettlement"
], function(
	OnSettlement
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.SettlementDetailDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19003"), // 출장 비용 정산
			contentWidth: "1600px",
			contentHeight: "96%",
			content: sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.SettlementDetail", oController),
			draggable: true,
			buttons: [
				new sap.m.Button({
					text: "{i18n>LABEL_00154}", // 재작성
					enabled: "{/Header/Btact}",
					visible: "{= ${/Header/Edtfg} && ${/Header/Status1} === '88' }", // 반려 상태
					press: OnSettlement.pressRevise.bind(oController)
				})
				.addStyleClass("button-light"),
				new sap.m.Button({
					text: "{i18n>LABEL_00103}", // 삭제
					enabled: "{/Header/Btact}",
					visible: "{= ${/Header/Edtfg} && (${/Header/Status1} === 'AA' || ${/Header/Status1} === 'JJ') }", // 미결재, 상신취소 상태
					press: OnSettlement.pressRemove.bind(oController)
				})
				.addStyleClass("button-delete"),
				new sap.m.Button({
					text: "{i18n>LABEL_00101}", // 저장
					enabled: "{/Header/Btact}",
					visible: "{= ${/Header/Edtfg} && (!${/Header/Status1} || ${/Header/Status1} === 'AA' || ${/Header/Status1} === 'JJ') }", // 신규, 미결재, 상신취소 상태
					press: OnSettlement.pressSave.bind(oController)
				})
				.addStyleClass("button-light"),
				new sap.m.Button({
					text: "{i18n>LABEL_00152}", // 신청
					enabled: "{/Header/Btact}",
					visible: "{= ${/Header/Edtfg} && (!${/Header/Status1} || ${/Header/Status1} === 'AA' || ${/Header/Status1} === 'JJ') }", // 신규, 미결재, 상신취소 상태
					press: OnSettlement.pressRequest.bind(oController)
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
		.setModel(oController.SettlementDetailDialogHandler.getModel())
		.addStyleClass("custom-dialog-popup");

		if (screen.availWidth <= 1280) {
			oDialog.setContentWidth("1280px");
		}

		return oDialog;
	}

});

});