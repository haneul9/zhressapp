sap.ui.define([
	"../common/PageHelper",
	"../ZUI5_HR_BusinessTrip/delegate/RequestDetailDialogHandler",
	"../ZUI5_HR_BusinessTrip/delegate/SettlementDetailDialogHandler",
	"sap/base/util/UriParameters"
], function(
	PageHelper,
	RequestDetailDialogHandler,
	SettlementDetailDialogHandler,
	UriParameters
) {
"use strict";

sap.ui.jsview($.app.APP_ID, { // 출장 신청/정산 상세

	getControllerName: function() {
		return $.app.APP_ID;
	},

	// Model 선언
	loadModel: function(oController) {

		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_WORKTIME_APPL_SRV");

		oController.setupView.call(oController); // $.app.setModel("ZHR_COMMON_SRV") 호출 후에 setupView 호출 가능
	},

	createContent: function(oController) {

		this.loadModel(oController);

		var tab = UriParameters.fromQuery(document.location.search).get("tab"),
		fragment;
		if (tab === "settlement") {
			SettlementDetailDialogHandler.get(oController);
			fragment = "ZUI5_HR_BusinessTrip.fragment.SettlementDetail";
		} else {
			RequestDetailDialogHandler.get(oController);
			fragment = "ZUI5_HR_BusinessTrip.fragment.RequestDetail";
		}

		return new PageHelper({
			// title: tab === "settlement" ? "{i18n>LABEL_19003}" : "{i18n>LABEL_19002}", // 출장 비용 정산 : 출장 사전 신청
			contentContainerStyleClass: "custom-app-title",
			contentItems: sap.ui.jsfragment(fragment, oController)
		});
	}

});

});