jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.export.Spreadsheet");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper"], 
	function (Common, CommonController, JSONModelHelper) {
	"use strict";

	return CommonController.extend("ZUI5_SF_EvalHistory.List", {
	
		PAGEID: "EvalHistoryList",
		_BusyDialog : new sap.m.BusyDialog(),
		
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : null, 
		
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
				
			this.getView().addStyleClass("sapUiSizeCompact");
		},

		onBeforeShow: function(){
			// var oController = this;
			
			// var vData = {
			// 	Data : {
			// 		Appye : new Date().getFullYear() + "",
			// 		Pernr : oController.getView().getModel("session").getData().Pernr
			// 	}
			// };
			
			// oController._ListCondJSonModel.setData(vData);
			
			common.SearchEvalHistory.onBeforeOpen();
		},
		
		onAfterShow: function(){
			// var oController = this;
			
			// oController.onSearchUser(oEvent);
			// oController.onPressSearch(oEvent);
			
			common.SearchEvalHistory.onAfterOpen();
		},
		
		/** 2020-12-16 공통 로직 처리로 인해 이하 로직 사용안함 **/
		
		SmartSizing : function(){
			// var oView = sap.ui.getCore().byId("ZUI5_SF_EvalHistory.List");
			// var oController = oView.getController();
		},
		
		onSearchUser : function(){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalHistory.List");
			var oController = oView.getController();
			
			var userId = oController._ListCondJSonModel.getProperty("/Data/Pernr");
			var oData = {};
			
			new JSONModelHelper().url("/odata/v2/User('" + userId + "')")
								 .select("userId")
								 .select("nickname")
								 .select("title")
								 .select("custom01")
								 .select("department")
								 .select("division")
								 .select("jobCode")
								 .select("custom01")
								 .select("custom02")
								 .select("custom04")
								 .setAsync(false)
								 .attachRequestCompleted(function(){
										var data = this.getData().d;
										
										if(data){
											data.Appye = oController._ListCondJSonModel.getProperty("/Data/Appye");
											
											oData = data;
										}
								 })
								 .attachRequestFailed(function() {
										sap.m.MessageBox.error(arguments);
										return;
								 })
								 .load();

				new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + userId + "' and photoType eq '1'")
									 .select("photo")
									 .setAsync(false)
									 .attachRequestCompleted(function(){
											var data = this.getData().d;
											
											if(data && data.results.length){
												oData.photo = "data:text/plain;base64," + data.results[0].photo;
											} else {
												oData.photo = "images/male.jpg";
											}
									 })
									 .attachRequestFailed(function() {
											sap.m.MessageBox.error(arguments);
											return;
									 })
									 .load();
				 
				oController._ListCondJSonModel.setProperty("/Data", oData);
		},
		
		onPressSearch : function(){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalHistory.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			// filter, sort 제거
			var oColumn = oTable.getColumns();
			for(var i=0; i<oColumn.length; i++){
				oColumn[i].setSorted(false);
				oColumn[i].setFiltered(false);
			}
			
			var search = function(){
				var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");
				
				var createData = {TableIn : []};
					createData.IEmpid = oData.userId;
					createData.IAppye = oData.Appye;
					createData.IConType = "3";
					
				oModel.create("/EvalResultsSet", createData, {
					success: function(data){
						if(data && data.TableIn) {
							if(data.TableIn.results && data.TableIn.results.length){
								for(var i=0; i<data.TableIn.results.length; i++){
									data.TableIn.results[i].Idx = (i+1);
									
									vData.Data.push(data.TableIn.results[i]);
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
				
				oTable.setVisibleRowCount((vData.Data.length >= 10 ? 10 : vData.Data.length));
				oJSONModel.setData(vData);
				oTable.bindRows("/Data");
				
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
		
		onCellClick : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalHistory.List");
			var oController = oView.getController();
			
			var sPath = oEvent.getParameters().rowBindingContext.sPath;
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oData = oTable.getModel().getProperty(sPath);
			
			if(oData.Appye && (parseFloat(oData.Appye) >= 2020)){
				if(!oController._DetailDialog){
					oController._DetailDialog = sap.ui.jsfragment("fragment.EvalResultAgree", oController);
					oView.addDependent(oController._DetailDialog);
				}
				
				common.SearchEvalResultAgree.Appye = oData.Appye;
				common.SearchEvalResultAgree.userId = oData.Pernr;
				common.SearchEvalResultAgree.Flag = "X";
				
				oController._DetailDialog.setTitle(oController.getBundleText("LABEL_07001")); // 평가이력
				
				oController._DetailDialog.open();
			}
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20023133"});
			// return new JSONModelHelper({name: "20060040"});
			return new JSONModelHelper({name: "9000566"});
		} : null
	});

});