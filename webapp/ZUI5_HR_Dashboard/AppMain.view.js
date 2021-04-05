jQuery.sap.require("common.Common");
jQuery.sap.require("common.makeTable");
jQuery.sap.require("common.JSONModelHelper");

sap.ui.jsview("ZUI5_HR_Dashboard.AppMain", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_Dashboard.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {
		this.loadModel();
		
		this.getUserInfo();
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);

		this.app = new sap.m.App({initialPage: "ZUI5_HR_Dashboard.DashboardList", autoFocus : false});		
		this.app.addPage(sap.ui.jsview("ZUI5_HR_Dashboard.DashboardList", "ZUI5_HR_Dashboard.DashboardList"));
		
		return new sap.m.Shell({
			title : "목표/평가 Dashboard",
			showLogout : false,
			app : this.app,
			appWidthLimited : false,
			homeIcon : {
				'phone' : 'img/57_iPhone_Desktop_Launch.png',
				'phone@2' : 'img/114_iPhone-Retina_Web_Clip.png',
				'tablet' : 'img/72_iPad_Desktop_Launch.png',
				'tablet@2' : 'img/144_iPad_Retina_Web_Clip.png',
				'favicon' : 'img/favicon.ico',
				'precomposed': false
			}
		});
	},
	
	// 로그인 정보 조회
	getUserInfo : function(){
		var mEmpLoginInfo =  new sap.ui.model.json.JSONModel();
		var vEmpLoginInfo = { EmpLoginInfoSet : []};
		
		var oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData("/services/userapi/currentUser");
        oModel.attachRequestCompleted(function onCompleted(oEvent) {
                  if (oEvent.getParameter("success")) {  
                        vEmpLoginInfo.EmpLoginInfoSet.push(this.getData());
                  } else {
                         var msg = oEvent.getParameter("errorObject").textStatus;
                         if (msg) {
                                    this.setData("status", msg);
                         } else {
                                    this.setData("status", "Unknown error retrieving user info");
                         }
                  }
                  $.userInfo = oEvent.getSource().getData().name;
        });
        
        oModel.loadData("/services/userapi/attributes");
        oModel.attachRequestCompleted(function onCompleted(oEvent) {
                  if (oEvent.getParameter("success")) {  
                        vEmpLoginInfo.EmpLoginInfoSet.push(this.getData());
                  } else {
                         var msg = oEvent.getParameter("errorObject").textStatus;
                         if (msg) {
                                    this.setData("status", msg);
                         } else {
                                    this.setData("status", "Unknown error retrieving user info");
                         }
                  }
                  $.userInfo = oEvent.getSource().getData().name;
        });
        
		mEmpLoginInfo.setData(vEmpLoginInfo);
		sap.ui.getCore().setModel(mEmpLoginInfo, "EmpLoginInfo");
		
		// var param = $.map(location.search.replace(/\?/, "").split(/&/), function(p) {
		// 		var pair = p.split(/=/);
		// 		if (pair[0] === "s4hana") { return pair[1]; }
		// 	})[0],
		// 	destination = (common.Common.isPRD() || param === "legacy") ? "/s4hana" : "/s4hana-pjt";
			
		// var oModel = new sap.ui.model.odata.ODataModel(destination + "/sap/opu/odata/sap/ZHR_APPRAISAL_SRV/", true, undefined, undefined, undefined, undefined, undefined, false);
		// 	oModel.setCountSupported(false);
		// 	oModel.setRefreshAfterChange(false);
			
		// sap.ui.getCore().setModel(oModel, "ZHR_APPRAISAL_SRV");
	},
	
	loadModel : function() {
// 		var lang = jQuery.sap.getUriParameters().get("sap-ui-language");
// 		if(!lang || lang == "") lang = "ko";
		
		// var oServiceURL = this.getUrl("/sap/opu/odata/sap/ZHR_COMMON_SRV/");
		// var oModel = new sap.ui.model.odata.ODataModel(oServiceURL, true, undefined, undefined, undefined, undefined, undefined, false);
		// //oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		// oModel.setCountSupported(false);
		// oModel.setRefreshAfterChange(false);
		// sap.ui.getCore().setModel(oModel, "ZHR_COMMON_SRV");

		var oServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHR_APPRAISAL_SRV/");
		var oModel2 = new sap.ui.model.odata.ODataModel(oServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
		oModel2.setCountSupported(false);
		oModel2.setRefreshAfterChange(false);
		sap.ui.getCore().setModel(oModel2, "ZHR_APPRAISAL_SRV");
	},
	
	getUrl : function(sUrl) {
		var param = $.map(location.search.replace(/\?/, "").split(/&/), function(p) {
			var pair = p.split(/=/);
			if (pair[0] === "s4hana") { return pair[1]; }
		})[0];

		var destination = (common.Common.isPRD() || param === "legacy") ? "/s4hana" : "/s4hana-pjt";
		
		return (destination + sUrl);
	}
});