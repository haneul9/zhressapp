jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
	"../../common/PageHelper"], 
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_FlexworktimeStatus.m.List", {

		PAGEID: "ZUI5_HR_FlexworktimeStatusList",
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
						Werks : $.app.getModel("session").getData().Persa,
						Bukrs : $.app.getModel("session").getData().Bukrs,
						Pernr : $.app.getModel("session").getData().Pernr,
						Ename : $.app.getModel("session").getData().Ename,                                                                                                           
						Langu : $.app.getModel("session").getData().Langu,
						Zyymm : today.getFullYear() + (today.getMonth() + 1 < 10 ? ("0" + (today.getMonth()+1)) : (today.getMonth()+1)),
						Year : today.getFullYear(),
						Month : (today.getMonth() + 1)
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_FlexworktimeStatus.m.List",
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oCalendar = sap.ui.getCore().byId(oController.PAGEID + "_Calendar");
				oCalendar.destroyContent();
				oCalendar.addContent(sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.Calendar", oController));
			
			var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
			var oJSONModel1 = oTable1.getModel();
			var vData1 = {Data : []};
			
			var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel2 = oTable2.getModel();
			var vData2 = {Data : []};
			
			var oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
			var oJSONModel3 = oTable3.getModel();
			var vData3 = {Data : []};
			
			var search = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
				var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "MM/dd"});
				var today = new Date();
				
				var vData = [];
				
				var oModel = sap.ui.getCore().getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : [], FlexWorktime2Nav : [], FlexWorktime3Nav : [], FlexWorktime4Nav : []};
					createData.Werks = oData.Werks;
					createData.Pernr = oData.Pernr;
					createData.Zyymm = (oData.Year + (oData.Month < 10 ? ("0"+oData.Month) : (oData.Month + "")));
					createData.Langu = oData.Langu;
					createData.Prcty = "1";

				oModel.create("/FlexworktimeSummarySet", createData, null,
					function(data, res){
						if(data){
							// 자율출퇴근 현황
							var oField = [{text : oBundleText.getText("LABEL_69026"), field : "Ctrnm"},	// 소정근로시간 한도
										  {text : oBundleText.getText("LABEL_69027"), field : "Ctrex"},	// 연장근로시간 한도
										  {text : oBundleText.getText("LABEL_69028"), field : "Wrktm"},	// 평일근로시간
										  {text : oBundleText.getText("LABEL_69029"), field : "Exttm"},	// 연장근로시간
										  {text : oBundleText.getText("LABEL_69030"), field : "Holtm"},	// 휴일근로시간
										  {text : oBundleText.getText("LABEL_69031"), field : "Tottm"}]; // 근로시간 합계
										  
							for(var i=0; i<oField.length; i++){ 
								vData3.Data.push({Text : oField[i].text, Value : eval("data." + oField[i].field)});
							}
							
							if(data.FlexWorktime1Nav && data.FlexWorktime1Nav.results){
								var data1 = data.FlexWorktime1Nav.results;
								
								for(var i=0; i<data1.length; i++){
									var oDatum = new Date(common.Common.getTime(data1[i].Datum));
									var oControl = sap.ui.getCore().byId(oController.PAGEID + "_" + dateFormat.format(oDatum));
									
									if(data1[i].Offyn == ""){
										// 일자가 현재일 이전인 경우 OFFYN을 변경해서 데이터 선택이 불가능하게 변경한다.
										if((dateFormat.format(data1[i].Datum) * 1) < (dateFormat.format(today) * 1)){
											data1[i].Offyn = "1";
										} else if((dateFormat.format(data1[i].Datum) * 1) == (dateFormat.format(today) * 1)){
											data1[i].Offyn = "2"; // 현재일인 경우 시작시간만 변경 불가능
										}
									}
									
									if(oControl){
										var title = new sap.m.Text({text : dateFormat2.format(oDatum)}).addStyleClass("font-bold");
										
										if(data1[i].Offyn == "X"){
											title.addStyleClass("color-info-red");
										}
										
										var oMatrix = new sap.ui.commons.layout.MatrixLayout({
														  columns : 1,
														  width : "100%",
														  rows : [new sap.ui.commons.layout.MatrixLayoutRow({
																  	  height : "20px",
																  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		  	  	   content : [title],
																		  	  	   hAlign : "Center",
																		  	  	   vAlign : "Middle"
																		  	   })] 
																  }).addStyleClass("calendar-datum"),
																  new sap.ui.commons.layout.MatrixLayoutRow({
																  	  height : "20px",
																  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		  	  	   content : [new sap.m.Text({
																					  	  		  text : (data1[i].Offyn == "X" ? "OFF" : 
																					  	  					data1[i].Beguz == "" ? "" : (data1[i].Beguz.substring(0,2) + ":" + data1[i].Beguz.substring(2,4)))
																					  	  	  })],
																		  	  	   hAlign : "Center",
																		  	  	   vAlign : "Middle"
																		  	   })]
																  }),
																  new sap.ui.commons.layout.MatrixLayoutRow({
																  	  height : "20px",
																  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		  	  	   content : [new sap.m.Text({
																					  	  		  text : (data1[i].Offyn == "X" ? "" : 
																					  	  					data1[i].Enduz == "" ? "" : (data1[i].Enduz.substring(0,2) + ":" + data1[i].Enduz.substring(2,4)))
																					  	  	  })],
																		  	  	   hAlign : "Center",
																		  	  	   vAlign : "Middle"
																		  	   })]
																  }),
																  new sap.ui.commons.layout.MatrixLayoutRow({
																  	  height : "20px",
																  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		  	  	   content : [new sap.m.Text({
																					  	  	   	  text : data1[i].Atext, 
																					  	  	   	  maxLines : 1
																				  	  	      }).addStyleClass("font-12px font-bold color-signature-blue")],
																		  	  	   hAlign : "Center",
																		  	  	   vAlign : "Middle"
																		  	   })]
																  })]
													  });
													  
										oControl.addContent(oMatrix);
										
										var oJSONModel = new sap.ui.model.json.JSONModel();
											oJSONModel.setData({Data : data1[i]});
											
										oControl.setModel(oJSONModel);
										oControl.attachBrowserEvent("click", oController.onSelectDate);
									}
									
								}
							}
							
							if(data.FlexWorktime2Nav && data.FlexWorktime2Nav.results){
								var data2 = data.FlexWorktime2Nav.results;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Datum = data2[i].Datum ? new Date(common.Common.setTime(data2[i].Datum)) : null;
									
									vData.push(data2[i]);
								}
							}
							
							if(data.FlexWorktime3Nav && data.FlexWorktime3Nav.results){
								var data3 = data.FlexWorktime3Nav.results;
								
								for(var i=0; i<data3.length; i++){
									vData1.Data.push(data3[i]);
								}
							}
							
							if(data.FlexWorktime4Nav && data.FlexWorktime4Nav.results){
								var data4 = data.FlexWorktime4Nav.results;
								
								for(var i=0; i<data4.length; i++){
									vData2.Data.push(data4[i]);
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
				
				oJSONModel1.setData(vData1);
				oJSONModel2.setData(vData2);
				oJSONModel3.setData(vData3);
				
				oController._ListCondJSonModel.setProperty("/Data2", vData);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}          
				
				oController._BusyDialog.close();
				
			}
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		onSelectDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.List");
			var oController = oView.getController();	
			
			var oControl = sap.ui.getCore().byId(oEvent.currentTarget.id);
			if(oControl == undefined) return;
			
			var oJSONModel = oControl.getModel();
			var oData = oJSONModel.getProperty("/Data");
			console.log(oData);
			
			var breakdata = oController._ListCondJSonModel.getProperty("/Data2"), oData2 = [];
			console.log(breakdata);
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			for(var i=0; i<breakdata.length; i++){
				if(dateFormat.format(breakdata[i].Datum) == dateFormat.format(oData.Datum)){
					oData2.push(breakdata[i]);
				}
			}
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_FlexworktimeStatus.m.Detail",
			      data : {
			    	  FromPageId : "ZUI5_HR_FlexworktimeStatus.m.List",
			    	  Data : oData,
			    	  Data2 : oData2
			      }
			});
		},
		
		onSetYearMonth : function(value){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.m.List");
			var oController = oView.getController();
			
			var year = oController._ListCondJSonModel.getProperty("/Data/Year");
			var month = oController._ListCondJSonModel.getProperty("/Data/Month");
				month = month + value;
				
			if(month < 1){
				year = year - 1;
				month = 12;
			} else if(month > 12){
				year = year + 1;
				month = 1;
			}
			
			oController._ListCondJSonModel.setProperty("/Data/Year", year);
			oController._ListCondJSonModel.setProperty("/Data/Month", month);
			
			oController.onPressSearch();
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20060040"});
		} : null
		
	});

});