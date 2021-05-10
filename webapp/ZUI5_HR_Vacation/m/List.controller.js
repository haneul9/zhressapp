jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
	"../../common/PageHelper"], 
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Vacation.m.List", {

		PAGEID: "ZUI5_HR_VacationList",
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
			gDtfmt = $.app.getModel("session").getData().Dtfmt;	
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			var oLoginData = $.app.getModel("session").getData();
		
			if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Werks : oLoginData.Bukrs3,
						Pernr : oLoginData.Pernr,
						Ename : oLoginData.Ename,
						Begda : new Date(today.getFullYear(), today.getMonth(), 1),
						Endda : new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth())))
						// Tmdat : dateFormat.format(new Date()),
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_Vacation.m.List",
			    	  Data : {}
			      }
			});
		},
		
		onChangeDate : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			oTable.removeSelections();
			
			var search = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
				
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var createData = {VacationNav : []};
					createData.IPernr = (oData.Pernr && oData.Pernr != "" ? oData.Pernr : "");
					createData.IOrgeh = (oData.Orgeh && oData.Orgeh != "" ? oData.Orgeh : "");
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda.getFullYear(), oData.Begda.getMonth(), oData.Begda.getDate())) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda.getFullYear(), oData.Endda.getMonth(), oData.Endda.getDate())) + ")\/";
					createData.IBukrs = $.app.getModel("session").getData().Bukrs;
					createData.ILangu = $.app.getModel("session").getData().Langu;

				oModel.create("/VacationListSet", createData, {
					success: function(data, res){
						if(data){
							if(data.VacationNav && data.VacationNav.results){
								for(var i=0; i<data.VacationNav.results.length; i++){   
									data.VacationNav.results[i].Begda = data.VacationNav.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.VacationNav.results[i].Begda))) : "";
									data.VacationNav.results[i].Endda = data.VacationNav.results[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data.VacationNav.results[i].Endda))) : "";
									
									data.VacationNav.results[i].Period = data.VacationNav.results[i].Begda + " ~ " + data.VacationNav.results[i].Endda;
									
									data.VacationNav.results[i].Kaltg = parseFloat(data.VacationNav.results[i].Kaltg);
									
																													  // 신규신청						   // 삭제신청
									data.VacationNav.results[i].Delapptx = data.VacationNav.results[i].Delapp == "" ? oBundleText.getText("LABEL_48045") : oBundleText.getText("LABEL_48046");
									
									vData.Data.push(data.VacationNav.results[i]);
								}
							}
						}
					},
					error: function (oError) {
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
				});
				
				oJSONModel.setData(vData);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}          
				
				oController._BusyDialog.close();
				
			}
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		onSelectTable : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.List");
			var oController = oView.getController();
		
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			console.log(oData);
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_Vacation.m.Detail",
			      data : Object.assign({FromPageId : "ZUI5_HR_Vacation.m.List", Flag : (oData.Delapp == "X" ? "D" : "")}, oData)
			});
		},
		
		onPressNew : function(oEvent){
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_Vacation.m.Detail",
			      data : {
			    	  FromPageId : "ZUI5_HR_Vacation.m.List",
			    	  Status1 : "",
			    	  Flag : ""
			      }
			});	
		},
		
		onPressDelete : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.List");
			var oController = oView.getController();
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oItems = oTable.getSelectedContexts();
			
			if(oItems.length != 1){
				sap.m.MessageBox.error(oBundleText.getText("MSG_48021")); // 삭제신청할 데이터를 선택하여 주십시오.
				return;
			}
			
			var oData = oTable.getModel().getProperty(oItems[0].sPath);
			console.log(oData);
			
			if(oData.Status1 != "99"){
				sap.m.MessageBox.error(oBundleText.getText("MSG_48022")); // 승인된 데이터만 삭제신청 가능합니다.
				return;
			} else if(oData.Delapp != ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_48023")); // 신규신청 데이터만 삭제신청 가능합니다.
				return;
			}
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_Vacation.m.Detail",
			      data : Object.assign({FromPageId : "ZUI5_HR_Vacation.m.List", Flag : "D"}, oData)
			});	
		},
		
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20060040"});
		} : null
		
	});

});