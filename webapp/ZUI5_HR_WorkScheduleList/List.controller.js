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

	return CommonController.extend("ZUI5_HR_WorkScheduleList.List", {

		PAGEID: "ZUI5_HR_WorkScheduleListList",
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
						Langu : oController.getSessionInfoByKey("Langu"),
						Zyymm : today.getFullYear() + (today.getMonth() + 1 >= 10 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1))
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkScheduleList.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_WorkScheduleList.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkScheduleList.List");
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkScheduleList.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			if(!oData.Zyymm || oData.Zyymm == ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_60001")); // 대상기간을 입력하여 주십시오.
				return;
			}
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			oTable.destroyColumns();
			
			// filter, sort 제거
			var oColumns = oTable.getColumns();
			for(var i=0; i<oColumns.length; i++){
				oColumns[i].setFiltered(false);
				oColumns[i].setSorted(false);
			}
			
			var search = function(){
				var oModel = $.app.getModel("ZHR_DASHBOARD_SRV");
				var createData = {WorkSchedule1Nav : [], WorkSchedule2Nav : []};
					createData.IYear = oData.Zyymm.substring(0,4);
					createData.IMonth = oData.Zyymm.substring(4,6);
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oData.Langu;
					
				oModel.create("/WorkScheduleSet", createData, {
					success: function(data, res){
						if(data){
							if(data.WorkSchedule1Nav && data.WorkSchedule1Nav.results){
								var data1 = data.WorkSchedule1Nav.results[0];
								
								var array = ["A", "B", "C", "D", "E", "F", "G", "H"], tmp = 0, header = [];
								for(var i=0; i<=data1.Cnt; i++){
									var field1 = eval("data1." + array[i] + "textH");
									
									if(field1){
										if(i!=0){
											var field2 = eval("data1." + array[i-1] + "textH");
											if(field1 != field2){
												header.push({idx : (data1.Cnt - i), span : tmp});
												tmp = 0;
											}
										}
									} else {
										header.push({idx : (data1.Cnt - i), span : tmp});
									}
									
									tmp++;
								}
								
								var col_info = [{id: "Indate", label: oBundleText.getText("LABEL_60009"), plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true}];
								
								for(var i=0; i<data1.Cnt; i++){
									var title1 = eval("data1." + array[i] + "textH");
									var title2 = eval("data1." + array[i] + "text");
									var field = eval("'Tpr0" + array[i].toLowerCase() + "'");
									var span_length = 0;
									
									for(var j=0; j<header.length; j++){
										if(i == header[j].idx){
											span_length = header[j].span;
										}
									}
									
									col_info.push({id: field, label: title1, plabel: title2, resize: true, span: span_length, type: "workschedule", sort: true, filter: true});
								}
								
								common.makeTable.makeColumn(oController, oTable, col_info);
								
								oTable.addEventDelegate({
									onAfterRendering : function(){
										common.makeTable.setRowspan();
									}
								});
							}
							
							if(data.WorkSchedule2Nav && data.WorkSchedule2Nav.results){
								var data2 = data.WorkSchedule2Nav.results;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Indate = new Date(common.Common.setTime(data2[i].Indate));
									
									vData.Data.push(data2[i]);
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
				
				var height = parseInt(window.innerHeight - 150);
				var count = parseInt((height - 75) / 38);
				oTable.setVisibleRowCount(vData.Data.length < count ? vData.Data.length : count);
				
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
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});