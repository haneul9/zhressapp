jQuery.sap.require("common.Common");
jQuery.sap.require("common.makeTable");

sap.ui.jsview("ZUI5_HR_MyDashboard.AppMain", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	getControllerName : function() {
		return "ZUI5_HR_MyDashboard.AppMain";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zhr_ui5_5000.AppMain
	*/ 
	createContent : function(oController) {
		// this.loadModel();
		
		this.getUserInfo();
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);

		this.app = new sap.m.App({initialPage: "ZUI5_HR_MyDashboard.DashboardList"});		
		this.app.addPage(sap.ui.jsview("ZUI5_HR_MyDashboard.DashboardList", "ZUI5_HR_MyDashboard.DashboardList"));
		
		return new sap.m.Shell({
			title : "Overview",
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
	},
	
	loadModel : function() {
// 		var lang = jQuery.sap.getUriParameters().get("sap-ui-language");
// 		if(!lang || lang == "") lang = "ko";
		
		// var oServiceURL = this.getUrl("https://api10preview.sapsf.com:443/odata/v2");
		// var oModel = new sap.ui.model.odata.ODataModel("/odata/v2", true, undefined, undefined, undefined, undefined, undefined, false);
		// //oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
		// oModel.setCountSupported(false);
		// oModel.setRefreshAfterChange(false);
		// sap.ui.getCore().setModel(oModel, "SF_USER");

// 		var oServiceURL2 = this.getUrl("/sap/opu/odata/sap/ZHR_CERTY_SRV/");
// 		var oModel2 = new sap.ui.model.odata.ODataModel(oServiceURL2, true, undefined, undefined, undefined, undefined, undefined, false);
// 		oModel2.setCountSupported(false);
// 		oModel2.setRefreshAfterChange(false);
// 		sap.ui.getCore().setModel(oModel2, "ZHR_CERTY_SRV"); 
		
// //		var oServiceURL3 = this.getUrl("/sap/opu/odata/sap/ZHR_LEAVEAPPL_SRV/");
// //		var oModel3 = new sap.ui.model.odata.ODataModel(oServiceURL3, true, undefined, undefined, undefined, undefined, undefined, false);
// //		oModel3.setCountSupported(false);
// //		oModel3.setRefreshAfterChange(false);
// //		sap.ui.getCore().setModel(oModel3, "ZHR_LEAVEAPPL_SRV"); 
		
// 		var oServiceURL4 = this.getUrl("/sap/opu/odata/sap/ZHR_COMMON_SRV/");
// 		var oModel4 = new sap.ui.model.odata.ODataModel(oServiceURL4, true, undefined, undefined, undefined, undefined, undefined, false);
// 		//oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
// 		oModel4.setCountSupported(false);
// 		oModel4.setRefreshAfterChange(false);
// 		sap.ui.getCore().setModel(oModel4, "ZHR_COMMON_SRV");

		
		// var mEmpLoginInfo =  new sap.ui.model.json.JSONModel();
		// var vEmpLoginInfo = { EmpLoginInfoSet : []};

		// var vScryn = "";
		// oModel.read("/EmpLoginInfoSet?$filter=Actty eq '" + _gAuth + "'",  
		// 		null, 
		// 		null, 
		// 		false,
		// 		function(data, oResponse) {					
		// 			if(data && data.results.length) {
		// 				vPersa = data.results[0].Persa;
		// 				gPersa = data.results[0].Persa;
		// 				gMolga = data.results[0].Molga;
						
		// 				gDtfmt = data.results[0].Dtfmt == "" ? gDtfmt : data.results[0].Dtfmt;
						
		// 				gDcpfm = data.results[0].Dcpfm;
		// 				gGenyn = data.results[0].Genyn;  
						
		// 				vScryn = data.results[0].Scryn;
						
		// 				vEmpLoginInfo.EmpLoginInfoSet.push(data.results[0]);
		// 			}
		// 		},
		// 		function(oResponse) {
		// 			common.Common.log(oResponse);
		// 		}
		// );	   
    	
//     	//화면 권한이 없으면 권한 없음 화면으로 이동
//     	if(vScryn == "X") {
//     		document.location.href = "/sap/bc/ui5_ui5/sap/zui5_hr_sq/NoAuth.html";
//     		return;
//     	}

//     	if(gDtfmt != "") {
// 			gDtfmt = gDtfmt.replace("YYYY", "yyyy");
// 			gDtfmt = gDtfmt.replace("DD", "dd");
// 		}
    	
// 		mEmpLoginInfo.setData(vEmpLoginInfo);
// 		sap.ui.getCore().setModel(mEmpLoginInfo, "EmpLoginInfo");

// 		var mEmpCodeList =  new sap.ui.model.json.JSONModel();
// //		var vEmpCodeList = { EmpCodeListSet : []};
// 		sap.ui.getCore().setModel(mEmpCodeList, "EmpSearchCodeList");
		
// 		var mEmpSearchResult =  new sap.ui.model.json.JSONModel();
// //		var vEmpSearchResult = { EmpSearchResultSet : []};
// 		sap.ui.getCore().setModel(mEmpSearchResult, "EmpSearchResult");

	}
});