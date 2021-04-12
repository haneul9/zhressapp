jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/AttachFileAction",
    "../common/SearchOrg",
    "../common/SearchUser1",
    "../common/OrgOfIndividualHandler",
    "../common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_WorkScheduleBasic.List", {

		PAGEID: "ZUI5_HR_WorkScheduleBasicList",
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
						Pernr : $.app.getModel("session").getData().Pernr,
						Langu : $.app.getModel("session").getData().Langu,
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkScheduleBasic.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_WorkScheduleBasic.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkScheduleBasic.List");
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkScheduleBasic.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Layout6");
				oLayout.destroyContent();
				oLayout.addContent(sap.ui.jsfragment("ZUI5_HR_WorkScheduleBasic.fragment.Calendar", oController));
			
			var search = function(){
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var createData = {WScheduleBasicNav : []};
					createData.IPernr = oData.Pernr;
					createData.ILangu = oData.Langu;
					createData.IYear = oData.Zyymm.substring(0,4);
					createData.IMonth = oData.Zyymm.substring(4,6);
				
				oModel.create("/WorkScheduleBasicSet", createData, null,
					function(data, res){
						if(data){
							if(data.WScheduleBasicNav && data.WScheduleBasicNav.results){
								var data1 = data.WScheduleBasicNav.results;
								
								var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
								var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "MM/dd"});
								
								var oRow, oCell;
								
								var makeData = function(title, time){
									time = time.substring(0,2) + ":" + time.substring(2,4);
									oRow = new sap.ui.commons.layout.MatrixLayoutRow({
											   height : "30px",
											   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
															content : [new sap.m.Text({text : title + " " + time})],
															hAlign : "Center",
															vAlign : "Middle"
														})]
											});
											
									return oRow;
								}
								
								for(var i=0; i<data1.length; i++){
									var oBegda = new Date(common.Common.getTime(data1[i].Begda));
									var oControl = sap.ui.getCore().byId(oController.PAGEID + "_" + dateFormat.format(oBegda));
									
									if(oControl){
										var title = new sap.m.Text({text : dateFormat2.format(oBegda)}).addStyleClass("font-bold");
										if(data1[i].Tagty == "1"){
											title.addStyleClass("color-signature-red");
										}
										
										var oMatrix = new sap.ui.commons.layout.MatrixLayout({
														  columns : 1,
														  width : "100%",
														  rows : [new sap.ui.commons.layout.MatrixLayoutRow({
																  	  height : "30px",
																  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		  	  	   content : [title],
																		  	  	   hAlign : "Center",
																		  	  	   vAlign : "Middle"
																		  	   })] 
																  }).addStyleClass("calendar-datum")]
													  });
										
										// 입문
										if(data1[i].Entbg != ""){
											oMatrix.addRow(makeData(oBundleText.getText("LABEL_60042"), data1[i].Entbg));
										}
										
										// 출문
										if(data1[i].Enten != ""){
											oMatrix.addRow(makeData(oBundleText.getText("LABEL_60043"), data1[i].Enten));
										}
										
										// 재근
										if(data1[i].Norwk != "" && data1[i].Norwk != "0000"){
											oMatrix.addRow(makeData(oBundleText.getText("LABEL_60044"), data1[i].Norwk));
										}
													  
										oControl.addContent(oMatrix);
									}
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