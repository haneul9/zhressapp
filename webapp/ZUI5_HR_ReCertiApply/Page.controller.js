sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/EmployeeModel",
	"../common/OrgOfIndividualHandler",
    "../common/DialogHandler",
	], 
	function (Common, CommonController, JSONModelHelper, PageHelper, EmployeeModel,OrgOfIndividualHandler,DialogHandler) {
	"use strict";

	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		_ListCondJSonModel: new JSONModelHelper(),
		 _TableModel: new JSONModelHelper(),
        EmployeeModel: new EmployeeModel(),
		_BusyDialog : new sap.m.BusyDialog(),
		
		onInit: function () {

			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this)
		},
		
		onBeforeShow: function() {
			var oController = $.app.getController();
			var curDate = new Date();
			oController._ListCondJSonModel.setProperty("/Data",{Begda : new Date(curDate.getFullYear(), curDate.getMonth(), 1), 
																Endda : new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate())});
		},
		
		onAfterShow: function() {
			var oController = $.app.getController();
			var OrgOfIndividualHandler = oController.getOrgOfIndividualHandler();
			OrgOfIndividualHandler.autoClose = false;
			OrgOfIndividualHandler.onBeforeOpen();
        },
		
		onPressSearch: function() {
			var oView = $.app.getView();
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table"),
				oJSONModel = oTable.getModel(),
				vData = oController._ListCondJSonModel.getProperty("/Data");
		
			var oData = {Data : []};
		
			var search = function(){
				var oPath = "";
				var sendObject = {};
				
				// Header
				oPath = "/CertiReSet";
				sendObject.IPernr =  vData.Pernr;
				sendObject.IConType ="1";
				sendObject.ILangu =  oController.getView().getModel("session").getData().Langu,
				sendObject.IOrgeh = vData.Orgeh;
				sendObject.IEmpid =  oController.getView().getModel("session").getData().Pernr,
				sendObject.IBegda = vData.Begda;
				sendObject.IEndda = vData.Endda;
				
				// Navigation property
				sendObject.TableIn = [];

				var oModel = sap.ui.getCore().getModel("ZHR_CERTI_SRV");
				oModel.create(oPath, sendObject, null,
					function(data, res){
						if(data){
							if(data.TableIn && data.TableIn.results){
								for(var i=0; i<data.TableIn.results.length; i++){
									data.TableIn.results[i].Idx = (i+1);
									oData.Data.push(data.TableIn.results[i]);
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
				
				oJSONModel.setData(oData);
				oTable.bindRows("/Data");
				Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
			}
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		onPressSer: function() { //조회
			var oController = $.app.getController();
			
			oController.onTableSearch();
		},
		
		 /**
         * @brief [공통]부서/사원 조직도호출
         */
		searchOrgehPernr: function(oController) {
		  	var oController = $.app.getController();
		  	var oModel = oController._ListCondJSonModel;
			var initData = {
				   Percod: this.getSessionInfoByKey("Percod"),
				   Bukrs: this.getSessionInfoByKey("Bukrs2"),
				   Langu: this.getSessionInfoByKey("Langu"),
				   Molga: this.getSessionInfoByKey("Molga"),
				   Datum: new Date(),
				   Mssty: "",
			   },
			   callback = function(o) {
				   oModel.setProperty("/Data/Pernr", o.Otype === "P" ? o.Objid : "");
				   oModel.setProperty("/Data/Orgeh", o.Otype === "O" ? o.Objid : "");
				   oModel.setProperty("/Data/EnameOrOrgehTxt", o.Stext || "");
			   };
   
			   this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
	    },
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
				
	
		onESSelectPerson: function(data) {
			return !this.EmployeeSearchCallOwner 
					? this.OrgOfIndividualHandler.setSelectionTagets(data)
					: this.EmployeeSearchCallOwner.setSelectionTagets(data);
		},
	
		displayMultiOrgSearchDialog: function(oEvent) {
			return !$.app.getController().EmployeeSearchCallOwner 
					? $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent)
					: $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20140099"}); // 20140099
		} : null
	});
});