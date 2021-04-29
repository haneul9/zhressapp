jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper"], 
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_RationaleApproval.List", {

		PAGEID: "ZUI5_HR_RationaleApprovalList",
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
				
			// this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			var oLoginData = $.app.getModel("session").getData();
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Bukrs : $.app.getModel("session").getData().Bukrs,
						Pernr : $.app.getModel("session").getData().Pernr,
						Orgeh : $.app.getModel("session").getData().Orgeh,
						Langu : $.app.getModel("session").getData().Langu
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_RationaleApproval.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
			
			oController._ListCondJSonModel.setProperty("/Data/Count", 0);
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");

			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			// filter, sort 제거
			var oColumn = oTable.getColumns();
			for(var i=0; i<oColumn.length; i++){
				oColumn[i].setFiltered(false);
				oColumn[i].setSorted(false);
			}
			
			var search = function(){
				var oModel = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
				var createData = {RationaleAppNav : []};
					createData.IConType = "1";
					createData.IBukrs = oData.Bukrs;
					createData.IMolga = oData.Molga;
					createData.IPernr = oData.Pernr;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(1800, 0, 1)) + ")\/";
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(9999, 11, 31)) + ")\/";
					createData.ILangu = oData.Langu;
					createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/";

				oModel.create("/RationaleApprovalSet", createData, {
					success: function(data, res){
						if(data){
							if(data.RationaleAppNav && data.RationaleAppNav.results){
								var data1 = data.RationaleAppNav.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Idx = i;
									data1[i].No = i+1;
									
									data1[i].Begda = new Date(common.Common.getTime(data1[i].Begda));
									
									vData.Data.push(data1[i]);
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
				oTable.bindRows("/Data");
				
				var height = parseInt(window.innerHeight - 175);
				var count = parseInt((height - 35) / 38);
				
				oTable.setVisibleRowCount(vData.Data.length < count ? vData.Data.length : count);
				
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
		
		onChangeStatus : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel();
				oJSONModel.setProperty("/Data/" + oData.Idx + "/Retrn", "");
		},
		
		// 테이블 행 선택 시 결재건수 계산하여 세팅
		onSelectionChange : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var count = oTable.getSelectedIndices().length;
			
			oController._ListCondJSonModel.setProperty("/Data/Count", count);
		},
		
		// 결재
		onPressSave : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			
			var oIndices = oTable.getSelectedIndices();
			
			if(oIndices.length == 0){
				sap.m.MessageBox.error(oBundleText.getText("MSG_67001")); // 일괄결재 대상 데이터를 선택하여 주십시오.
				return;
			}
			
			var oModel = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
			var createData = {RationaleAppNav : []};
			
			// validation check
			for(var i=0; i<oIndices.length; i++){
				var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
				
				var data = oJSONModel.getProperty(sPath);
				if(!data.Status || data.Status == "" || data.Status == "00"){
					sap.m.MessageBox.error(oBundleText.getText("MSG_67002")); //상태를 선택하여 주십시오.
					return;
				} else if(data.Status == "88" && (!data.Retrn || data.Retrn.trim() == "")){
					sap.m.MessageBox.error(oBundleText.getText("MSG_67003")); // 반려인 경우 반려사유를 입력하여 주십시오.
					return;
				}
				
				createData.RationaleAppNav.push(common.Common.copyByMetadata(oModel, "RationaleApprovalTab", data));
			}
			
			var process = function(){
				createData.IConType = "2";
				createData.IBukrs = oData.Bukrs;
				createData.IMolga = oData.Molga;
				createData.IPernr = oData.Pernr;
				createData.IBegda = "\/Date(" + common.Common.getTime(new Date(1800, 0, 1)) + ")\/";
				createData.IEndda = "\/Date(" + common.Common.getTime(new Date(9999, 11, 31)) + ")\/";
				createData.ILangu = oData.Langu;
				createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/";
				
				oModel.create("/RationaleApprovalSet", createData, {
					success: function(data, res){
						if(data){
							
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
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				sap.m.MessageBox.success(oBundleText.getText("MSG_67005"), { // 일괄결재가 완료되었습니다.
					onClose : oController.onPressSearch
				});
			};
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_67004"), { // 일괄결재하시겠습니까?
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(process, 100);
					}
				}
			});
		},
        
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "35122694"});
		} : null
		
	});

});