jQuery.sap.require("common.BaseAppController");

common.BaseAppController("ZUI5_HR_Dashboard.AppMain", {
	
	onInit : function () {		
		// Any of the strings can be replaced with a function, that returns a string
		var oAppConfig = {
				
				defaultPageId : "ZUI5_HR_Dashboard.DashboardList",
				
				isMaster : function (sPageId) {
					return ("Detail" !== sPageId && "LineItem" !== sPageId);
				},
				
				viewName : function (sPageId) {
					return sPageId;
				},
				
				viewType : "JS",
				
				transition : "slide"
			};
		
		this.configureApplication(this.getView().app, oAppConfig);
	}	
	
});