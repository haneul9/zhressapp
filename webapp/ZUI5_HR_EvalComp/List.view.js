$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_EvalComp.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_EvalComp.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_APPRAISAL2_SRV");
		
		var oIcontabbar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
			expandable : false,
			expanded : true,
			backgroundDesign : "Transparent",
			items : [new sap.m.IconTabFilter({
						 key : "1",
						 text : "{i18n>LABEL_26001}", // 역량평가(1차)
						 design : "Vertical",
						 content : [sap.ui.jsfragment("ZUI5_HR_EvalComp.fragment.content01", oController)]
					 }),
					 new sap.m.IconTabFilter({
						 key : "2",
						 text : "{i18n>LABEL_26002}", // 역량평가(2차)
						 design : "Vertical",
						 content : [sap.ui.jsfragment("ZUI5_HR_EvalComp.fragment.content02", oController)]
					 })],
			select : oController.handleIconTabBarSelect,
			content : []
		}).addStyleClass("tab-group mt-10px");	
		
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [oIcontabbar]
			        });
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});