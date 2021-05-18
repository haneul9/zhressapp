jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/PageHelper",
	"common/AttachFileAction",
    "common/SearchOrg",
    "common/SearchUser1",
    "common/OrgOfIndividualHandler",
    "common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_ShiftSchedule.List", {

		PAGEID: "ZUI5_HR_ShiftScheduleList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		
		onInit: function () {
			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this);
			gDtfmt = this.getSessionInfoByKey("Dtfmt");		
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Bukrs : oController.getSessionInfoByKey("Bukrs2"),
						Datum : dateFormat.format(today)
					}
				};
				
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_ShiftSchedule.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_ShiftSchedule.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_ShiftSchedule.List");
			var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_ShiftSchedule.List");
			var oController = oView.getController();
			
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Layout");
				oLayout.destroyContent();
				
			var search = function(){
				var oData = oController._ListCondJSonModel.getProperty("/Data");
				
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var oPath = "/ShiftScheduleSet?$filter=IBukrs eq '" + oData.Bukrs + "'";
					oPath += " and ICusrid eq '" + encodeURIComponent(sessionStorage.getItem('ehr.odata.user.percod')) + "'";
					oPath += " and ICusrse eq '" + encodeURIComponent(sessionStorage.getItem('ehr.session.token')) + "'";
					oPath += " and ICusrpn eq '" + encodeURIComponent(sessionStorage.getItem('ehr.sf-user.name')) + "'";
					oPath += " and ICmenuid eq '" + $.app.getMenuId() + "'";
				
				oModel.read(oPath, null, null, false,
					function(data,res){
						if(data && data.results.length){
							if(data.results[0].EUrl != ""){
								oLayout.addContent(
									new sap.ui.core.HTML({
									    content : ["<iframe id='iWorkerPDF'" +
												   "name='iWorkerPDF' src='" + data.results[0].EUrl + "'" +
												   "width='" + (window.innerWidth - 80) + "px' height='" + (parseInt(window.innerHeight - 160) + "px") + "'" +
												   "frameborder='0' border='0' scrolling='no'></>"],
										preferDOM : false
									})	
								);
							}
						}
					},
					function(Res) {
						oController.Error = "E";
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails && ErrorJSON.error.innererror.errordetails.length){
								oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
								oController.ErrorMessage = ErrorMessage;
							}
						}
					}
				);
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
			};
				
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});