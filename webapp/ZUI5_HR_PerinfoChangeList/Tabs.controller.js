/* global moment:true */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/moment-with-locales",
    "../common/SearchUser1",
    "../common/SearchOrg",
    "../common/DialogHandler",
    "../common/OrgOfIndividualHandler",
	"sap/base/util/UriParameters",
	"sap/ui/model/json/JSONModel"
], function(Common, CommonController, momentjs, SearchUser1, SearchOrg, DialogHandler, OrgOfIndividualHandler, UriParameters, JSONModel) {
"use strict";

return CommonController.extend($.app.APP_ID, { // 출장

	PAGEID: "",
	_ListCondJSonModel : new JSONModel(),
	_ListJSonModel : new JSONModel(),
	_ApplyJSonModel : new JSONModel(),
	_UploadTableJSonModel : new JSONModel(),
	_BusyDialog : new sap.m.BusyDialog(),
	
	onInit: function() {
		this.setupView()
			.getView().addEventDelegate({
				onBeforeShow: this.onBeforeShow,
				onAfterShow: this.onAfterShow
			}, this);
	},

	onBeforeShow: function() {
		var oController = $.app.getController();
		var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getView().getModel("session").getData().Dtfmt}),
		curDate = new Date(),
		IBegda = new Date(curDate.getFullYear(), curDate.getMonth(), 1),
		IEndda = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
		
		oController._ListCondJSonModel.setProperty("/Data",{Begda : IBegda, Endda : IEndda, Status : "0" });
		oController._ApplyJSonModel.setProperty("/Data",[]);
		oController.onPressSearch();
	},
	
	onAfterShow: function() {
	},

	onPressSearch : function(){
		var oController = $.app.getController();
		var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
		
		var vCondiData = oController._ListCondJSonModel.getProperty("/Data");
		// var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getView().getModel("session").getData().Dtfmt});
		var vData = {Data : []}; 
		
		var search = function(){
			var oPath = "";
			var createData = {TempPayDeductionTableIn1 : []};
			
			oPath = "/TempPayDeductionSet";
			createData.IMode =   "L"; 
			createData.IBurks =  vCondiData.Burks && vCondiData.Burks != "" ? vCondiData.Burks : oController.getView().getModel("session").getData().Burks2 ;
			createData.IPernr =  vCondiData.Pernr && vCondiData.Pernr != "" ? vCondiData.Pernr : "" ;
			createData.IOrgeh =  vCondiData.Orgeh && vCondiData.Orgeh != "" ? vCondiData.Orgeh : "" ;
			createData.ILgart =  vCondiData.Lgart && vCondiData.Lgart != "" ? vCondiData.Lgart : "" ;
			createData.ILangu =  oController.getView().getModel("session").getData().Langu;
			createData.IStatus = vCondiData.Status && vCondiData.Status != "" ? vCondiData.Status : "" ;
			createData.IBegda =  vCondiData.Begda && vCondiData.Begda != "" ? "\/Date(" + common.Common.getTime(new Date(vCondiData.Begda)) + ")\/" : null;
			createData.IEndda =  vCondiData.Endda && vCondiData.Endda != "" ? "\/Date(" + common.Common.getTime(new Date(vCondiData.Endda)) + ")\/" : null;
			
			oModel.create(oPath, createData, null,
				function(data, res){
					if(data){
						if(data.TempPayDeductionTableIn1 && data.TempPayDeductionTableIn1.results.length > 0){
							for(var i=0; i<data.TempPayDeductionTableIn1.results.length; i++){
								data.TempPayDeductionTableIn1.results[i].Idx = (i+1);
								
								vData.Data.push(data.TempPayDeductionTableIn1.results[i]);
							}
						}
					}
				},
				function (oError) {
			    	var Err = {};
			    	oController.Error = "E";
						
					if (oError.response) {
						Err = window.JSON.parse(oError.response.body);
						var msg1 = Err.error.innererror.errordetails;
						if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
						else oController.ErrorMessage = Err.error.message.value;
					} else {
						oController.ErrorMessage = oError.toString();
					}
				}
			);

			oController._ListJSonModel.setProperty("/Data",vData.Data);
			Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
			oController._BusyDialog.close();
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			$.app.byId(oController.PAGEID + "_Table").clearSelection();
		}
	
		oController._BusyDialog.open();
		setTimeout(search, 100);
	},
	
	// onPressSearch : function(){
	// 	var oController = $.app.getController();
	// 	var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
		
		
	// 	var search = function(){
	// 		var vData = {Data : [ { Idx : "1" , AppDate : "2021.04.09 15:50:13",  AppType : "수정" , Status : "승인", ReqDate : "2021.04.09 15:50:13", ReqName : "학력사항",  Admin : "강미소" }]};
	// 		$.app.byId(oController.PAGEID + "_Table").getModel().setData(vData);
	// 		Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
	// 		oController._BusyDialog.close();
			
	// 		$.app.byId(oController.PAGEID + "_Table").clearSelection();
	// 	}
	
	// 	oController._BusyDialog.open();
	// 	setTimeout(search, 100);
	// },
	
	
	onPressDetail : function(){
		var oView = $.app.getView();
		var oController = $.app.getController(),
		vSelectedIndex = $.app.byId(oController.PAGEID + "_Table").getSelectedIndices(),
		vSelectedData = $.app.byId(oController.PAGEID + "_Table").getModel().getProperty("/Data/" + vSelectedIndex);
		console.log(vSelectedData);
        
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : "ZUI5_HR_PerinfoChangeList.Detail",
		      data : {
		    	  FromPageId : "ZUI5_HR_PerinfoChangeList.Tabs",
		    	  selData :  vSelectedData
		      }
		});
	},
    
	getLocalSessionModel: Common.isLOCAL() ? function() {
		return new JSONModel({name: "20140099"}); // 
		// return new JSONModel({name: "35132258"}); // 첨단
		// return new JSONModel({name: "35132259"}); // 첨단
		// return new JSONModel({name: "35132260"}); // 첨단
		// return new JSONModel({name: "35132261"}); // 첨단
		// return new JSONModel({name: "981014"}); // 기초
		// return new JSONModel({name: "991002"}); // 기초
		// return new JSONModel({name: "991004"}); // 기초
		// return new JSONModel({name: "8900366"}); // 기초
		// return new JSONModel({name: "8903376"}); // 기초
		// return new JSONModel({name: "9000290"}); // 기초
	} : null

});

});