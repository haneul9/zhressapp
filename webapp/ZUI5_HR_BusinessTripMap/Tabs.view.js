sap.ui.define([
	"common/Common",
	"common/PageHelper",
	"sap/ui/model/json/JSONModel"
], function(Common, PageHelper, JSONModel) {
"use strict";

sap.ui.jsview($.app.APP_ID, { // 출장 신청/정산

	getControllerName: function() {
		return $.app.APP_ID;
	},

	// Model 선언
	loadModel: function() {

		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_WORKTIME_APPL_SRV");
		sap.ui.getCore().setModel(new JSONModel(), "EmpSearchResult");
		sap.ui.getCore().setModel(new JSONModel(), "EmpSearchCodeList");
	},

	createContent: function(oController) {

		this.loadModel();

		var tabBox = new sap.m.IconTabBar("BusinessTripTabBar", {
			select: oController.selectBusinessTripTabBar.bind(oController),
			stretchContentHeight: true,
			expandable: false,
			items: [
				new sap.m.IconTabFilter({
					key: "RequestList",
					text: "{i18n>LABEL_19002}", // 출장 신청
					content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, "fragment", "RequestList"].join("."), oController)]
				}),
				new sap.m.IconTabFilter({
					key: "SettlementList",
					text: "{i18n>LABEL_19003}", // 출장 비용 정산
					content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, "fragment", "SettlementList"].join("."), oController)]
				})
			]
		})
		.addStyleClass("tab-group mt-26px");

		return new PageHelper({
			contentItems: [tabBox]
		});
	}

});

});