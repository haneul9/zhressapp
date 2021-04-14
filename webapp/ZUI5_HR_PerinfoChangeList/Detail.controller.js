sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator) {
	"use strict";

	return CommonController.extend("ZUI5_HR_PerinfoChangeList.Detail", {
		
		PAGEID: "Detail",
		
		ApplyModel: new JSONModelHelper(),
		
		onInit: function () {
			this.getView()
				.addEventDelegate({
					onBeforeShow: this.onBeforeShow,
					onAfterShow: this.onAfterShow
				}, this);
		},
		
		getUserId: function() {
			return $.app.getModel("session").getData().name;
		},
	
		
		onBeforeShow: function(oEvent) {
			if(oEvent) {
				console.log(oEvent.data.selData);
				this.ApplyModel.setData({Data : oEvent.data.selData});
			}
		
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
	      var oController = $.app.getController();
	      oController.onPressSearch();
        },
        
  //  	onPressSearch : function(){
		// 	var oController = $.app.getController();
		// 	var oModel = $.app.sgetModel("ZHR_PERS_INFO_SRV");
			
		// 	var vCondiData = oController._ListCondJSonModel.getProperty("/Data");
		// 	// var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getView().getModel("session").getData().Dtfmt});
		// 	var vData = {Data : []}; 
			
		// 	var search = function(){
		// 		var oPath = "";
		// 		var createData = {TempPayDeductionTableIn1 : []};
				
		// 		oPath = "/TempPayDeductionSet";
		// 		createData.IMode =   "L"; 
		// 		createData.IBurks =  vCondiData.Burks && vCondiData.Burks != "" ? vCondiData.Burks : oController.getView().getModel("session").getData().Burks2 ;
		// 		createData.IPernr =  vCondiData.Pernr && vCondiData.Pernr != "" ? vCondiData.Pernr : "" ;
		// 		createData.IOrgeh =  vCondiData.Orgeh && vCondiData.Orgeh != "" ? vCondiData.Orgeh : "" ;
		// 		createData.ILgart =  vCondiData.Lgart && vCondiData.Lgart != "" ? vCondiData.Lgart : "" ;
		// 		createData.ILangu =  oController.getView().getModel("session").getData().Langu;
		// 		createData.IStatus = vCondiData.Status && vCondiData.Status != "" ? vCondiData.Status : "" ;
		// 		createData.IBegda =  vCondiData.Begda && vCondiData.Begda != "" ? "\/Date(" + common.Common.getTime(new Date(vCondiData.Begda)) + ")\/" : null;
		// 		createData.IEndda =  vCondiData.Endda && vCondiData.Endda != "" ? "\/Date(" + common.Common.getTime(new Date(vCondiData.Endda)) + ")\/" : null;
				
		// 		oModel.create(oPath, createData, null,
		// 			function(data, res){
		// 				if(data){
		// 					if(data.TempPayDeductionTableIn1 && data.TempPayDeductionTableIn1.results.length > 0){
		// 						for(var i=0; i<data.TempPayDeductionTableIn1.results.length; i++){
		// 							data.TempPayDeductionTableIn1.results[i].Idx = (i+1);
									
		// 							vData.Data.push(data.TempPayDeductionTableIn1.results[i]);
		// 						}
		// 					}
		// 				}
		// 			},
		// 			function (oError) {
		// 		    	var Err = {};
		// 		    	oController.Error = "E";
							
		// 				if (oError.response) {
		// 					Err = window.JSON.parse(oError.response.body);
		// 					var msg1 = Err.error.innererror.errordetails;
		// 					if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
		// 					else oController.ErrorMessage = Err.error.message.value;
		// 				} else {
		// 					oController.ErrorMessage = oError.toString();
		// 				}
		// 			}
		// 		);
		
		// 		oController._ListJSonModel.setProperty("/Data",vData.Data);
		// 		Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
		// 		oController._BusyDialog.close();
				
		// 		if(oController.Error == "E"){
		// 			oController.Error = "";
		// 			sap.m.MessageBox.error(oController.ErrorMessage);
		// 			return;
		// 		}
				
		// 		$.app.byId(oController.PAGEID + "_Table").clearSelection();
		// 	}
		
		// 	oController._BusyDialog.open();
		// 	setTimeout(search, 100);
		// },
		
		onPressSearch : function(){
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			
			
			var search = function(){
				var vData = {Data : [ { Idx : "1" , AppDate : "2021.04.09 15:50:13",  AppType : "수정" , Status : "승인", ReqDate : "2021.04.09 15:50:13", ReqName : "학력사항",  Admin : "강미소" }]};
				$.app.byId(oController.PAGEID + "_DetailTable").getModel().setData(vData);
				Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_DetailTable"));
				oController._BusyDialog.close();
				
				$.app.byId(oController.PAGEID + "_DetailTable").clearSelection();
			}
		
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
	

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: "ZUI5_HR_PerinfoChangeList.Tabs"
            });
        },
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			var oView = sap.ui.getCore().byId("ZUI5_HR_PerinfoChangeList.Detail");
			var oController = oView.getController();
		
			
			return new JSONModelHelper({name: oController.getUserId()}); // 20001008 20190204
		} : null
	});
});