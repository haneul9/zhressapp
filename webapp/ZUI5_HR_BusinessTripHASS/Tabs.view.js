sap.ui.define([
	"common/PageHelper",
	"sap/ui/model/json/JSONModel"
], function(
	PageHelper,
	JSONModel
) {
"use strict";

sap.ui.jsview($.app.APP_ID, { // 출장 관리 HASS

	getControllerName: function() {
		return $.app.APP_ID;
	},

	// Model 선언
	loadModel: function(oController) {

		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_WORKTIME_APPL_SRV");
		sap.ui.getCore().setModel(new JSONModel(), "EmpSearchResult");
		sap.ui.getCore().setModel(new JSONModel(), "EmpSearchCodeList");

		oController.setupView(); // $.app.setModel("ZHR_COMMON_SRV") 호출 후에 setupView 호출 가능
	},

	createContent: function(oController) {

		this.loadModel(oController);

		return new PageHelper({
			contentItems: [
				new sap.m.IconTabBar("BusinessTripTabBar", {
					select: oController.selectBusinessTripTabBar.bind(oController),
					stretchContentHeight: true,
					expandable: false,
					items: [
						new sap.m.IconTabFilter({
							key: "RequestList",
							text: "{i18n>LABEL_19002}", // 출장 신청
							content: sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.RequestList", oController)
						}),
						new sap.m.IconTabFilter({
							key: "SettlementList",
							text: "{i18n>LABEL_19003}", // 출장 비용 정산
							content: sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.SettlementList", oController)
						})
					]
				})
				.addStyleClass("tab-group mt-26px")
			]
		});
	}

});

});