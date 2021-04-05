$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");

sap.ui.jsview("ZUI5_HR_TMDashboard.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_TMDashboard.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_DASHBOARD_SRV");
		
		var oIcontabbar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
			expandable : false,
			expanded : true,
			backgroundDesign : "Transparent",
			items : [new sap.m.IconTabFilter({
						 key : "1",
						 text : oBundleText.getText("LABEL_60002"), // 근무일정조회
						 design : "Vertical",
						 content : [sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Detail01", oController)]
					 }),
					 new sap.m.IconTabFilter({
						 key : "2",
						 text : oBundleText.getText("LABEL_60003"), // 교대근무자현황
						 design : "Vertical",
						 content : [sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Detail02", oController)]
					 }),
					 new sap.m.IconTabFilter({
						 key : "3",
						 text : oBundleText.getText("LABEL_60004"), // 대체근무조회
						 design : "Vertical",
						 content : [sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Detail03", oController)]
					 }),
					 new sap.m.IconTabFilter({
						 key : "4",
						 text : oBundleText.getText("LABEL_60005"), // 근무일정현황
						 design : "Vertical",
						 content : [sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Detail04", oController)]
					 }),
					 new sap.m.IconTabFilter({
						 key : "5",
						 text : oBundleText.getText("LABEL_60006"), // 근무시간현황
						 design : "Vertical",
						 content : [sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Detail05", oController)]
					 }),
					 new sap.m.IconTabFilter({
						 key : "6",
						 text : oBundleText.getText("LABEL_60007"), // 제조근무시간조회
						 design : "Vertical",
						 content : [sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Detail06", oController)]
					 })],
			select : oController.handleIconTabBarSelect,
			content : []
		}).addStyleClass("tab-group mt-16px");	
		
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oIcontabbar]
			        });
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});