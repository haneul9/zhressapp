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
				oCalendar.destroyItems();
				oCalendar.addItem(sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.Calendar", oController));
			
			oController._ListCondJSonModel.setProperty("/Data/CtrnmHH", "0");
			oController._ListCondJSonModel.setProperty("/Data/Tottmtx", "-");
			var check = ""; // 총근로시간 > 소정근로시간 = X
			
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
				
				var vData = [], vData5 = [];
				
				var oModel = $.app.getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : [], FlexWorktime2Nav : [], FlexWorktime3Nav : [], FlexWorktime4Nav : [], FlexWorktime5Nav : []};
					createData.Werks = oData.Werks;
					createData.Pernr = oData.Pernr;
					createData.Zyymm = (oData.Year + (oData.Month < 10 ? ("0"+oData.Month) : (oData.Month + "")));
					createData.Langu = oData.Langu;
					createData.Prcty = "1";

				oModel.create("/FlexworktimeSummarySet", createData, {
					success: function(data, res){
						if(data){
							// 근무시간 현황
							var oField = [{text : oBundleText.getText("LABEL_69026"), field : "Ctrnm"},	// 소정근로시간 한도
										  {text : oBundleText.getText("LABEL_69027"), field : "Ctrex"},	// 연장근로시간 한도
										  {text : oBundleText.getText("LABEL_69028"), field : "Wrktm"},	// 평일근로시간
										  {text : oBundleText.getText("LABEL_69029"), field : "Exttm"},	// 연장근로시간
										  {text : oBundleText.getText("LABEL_69030"), field : "Holtm"},	// 휴일근로시간
										  /*{text : oBundleText.getText("LABEL_69031"), field : "Tottm"}*/]; // 근로시간 합계
										  
							for(var i=0; i<oField.length; i++){ 
								vData3.Data.push({Text : oField[i].text, Value : eval("data." + oField[i].field)});
							}
							
							// 총근로시간
							oController._ListCondJSonModel.setProperty("/Data/CtrnmHH", data.Ctrnm.split(":")[0]);
							$('.progress-bar').animate({ width: ((parseInt(data.Tottm.split(":")[0]) / parseInt(data.Ctrnm.split(":")[0])) * 80) + '%' }, 2000);
							
							if(parseInt(data.Tottm.split(":")[0]) > parseInt(data.Ctrnm.split(":")[0])){
								check = "X";
							}
							
							oController._ListCondJSonModel.setProperty("/Data/Tottmtx", 
								data.Tottm == "" ? "-" :
									data.Tottm.split(":")[0] + oBundleText.getText("LABEL_69052") + " " + data.Tottm.split(":")[1] + oBundleText.getText("LABEL_69053")
																//	시간															 // 분
							);
							
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
									
									// 종일여부 필드값이 true 인 경우 해당 라인 비활성화 + 점심시간 코드값 0 으로 변경
									if(data1[i].Alldf == true){
										data1[i].Offyn = "1";
										data1[i].Lnctm = "0";
									}
									
									if(oControl){
										var title = new sap.m.Text({text : dateFormat2.format(oDatum)}).addStyleClass("font-11px font-bold calendar-text");
										
										if(data1[i].Offyn == "X"){
											title.addStyleClass("color-info-red");
										}
										
										var titleStyle = "";
										switch(data1[i].Status){
											case "99": // 결재완료
												titleStyle = "calendar-background-blue";
												break;
											case "88": // 반려
												titleStyle = "calendar-background-orange";
												break;
											case "00": // 결재중
												titleStyle = "calendar-background-green";
												break;
											default:
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
																		  	   }).addStyleClass(titleStyle)] 
																  }),
																  new sap.ui.commons.layout.MatrixLayoutRow({
																  	  height : "20px",
																  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		  	  	   content : [new sap.m.Text({
																					  	  		  text : (data1[i].Offyn == "X" ? "OFF" : 
																					  	  					data1[i].Beguz == "" ? "" : (data1[i].Beguz.substring(0,2) + ":" + data1[i].Beguz.substring(2,4)))
																					  	  	  }).addStyleClass("font-11px calendar-text")],
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
																					  	  	  }).addStyleClass("font-11px calendar-text")],
																		  	  	   hAlign : "Center",
																		  	  	   vAlign : "Middle"
																		  	   })]
																  }),
																  new sap.ui.commons.layout.MatrixLayoutRow({
																  	  height : "20px",
																  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																		  	  	   content : [new sap.m.Text({
																					  	  	   	  text : data1[i].Atext, 
																					  	  	   	  width : "100%",
																					  	  	   	  textAlign : "Center",
																					  	  	   	  maxLines : 1
																				  	  	      }).addStyleClass((data1[i].Atext == "" ? 
																				  	  	    		"font-11px FontWhite calendar-text" :
																				  	  	    		"font-11px FontWhite calendar-background-atext calendar-text"))],
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
							
							// 추가휴게
							if(data.FlexWorktime2Nav && data.FlexWorktime2Nav.results){
								var data2 = data.FlexWorktime2Nav.results;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Datum = data2[i].Datum ? new Date(common.Common.setTime(data2[i].Datum)) : null;
									
									vData.push(data2[i]);
								}
							}
							
							// 휴가쿼터 현황
							if(data.FlexWorktime3Nav && data.FlexWorktime3Nav.results){
								var data3 = data.FlexWorktime3Nav.results;
								var oKtext = [], oCrecnt = [], oUsecnt = [], oBalcnt = [];

								for(var i=0; i<data3.length; i++){
									oKtext.push(data3[i].Ktext);
									oCrecnt.push(parseFloat(data3[i].Crecnt));
									oUsecnt.push(parseFloat(data3[i].Usecnt));
									oBalcnt.push(parseFloat(data3[i].Balcnt));
									
									vData1.Data.push(data3[i]);
								}
								
								Chart.defaults.global.defaultFontColor = 'rgb(153, 153, 153)';
							    Chart.defaults.scale.gridLines.color = 'rgb(242, 242, 242)';
							    Chart.defaults.global.legend.labels.boxWidth = 20;
							    Chart.defaults.global.legend.align = 'end';
							    
								var chart = new Chart(document.getElementById('vacChart').getContext('2d'), {
					                type: 'bar',
					                data: { 
					                    labels: oKtext, 
					                    datasets: [
					                        { 
					                            label: '사용',
					                            barPercentage: 0.6,
					                            categoryPercentage: 0.6,
					                            barThickness: oKtext.length == 1 ? 40 : 20,
					                            backgroundColor: "rgb(141, 198, 63)",
					                            data: oUsecnt
					                        },
					                        {
					                            label: '잔여',
					                            barPercentage: 0.6,
					                            categoryPercentage: 0.6,
					                            barThickness: oKtext.length == 1 ? 40 : 20,
					                            backgroundColor: "rgb(221, 238, 197)",
					                            data: oBalcnt
					                        }
					                    ]
					                },
					                options: {
					                     scales: {
					                        yAxes: [{
					                            ticks: {
					                                fontColor : "rgb(153, 153, 153)"
					                            }
					                        }]
					                    }
					                }
					            });
					            
					            $('.ChartClass').append([chart]);
					            
					            if(check == "X"){
					            	$("#bar").addClass("bg-error");
					            }
							}
							
							if(data.FlexWorktime4Nav && data.FlexWorktime4Nav.results){
								var data4 = data.FlexWorktime4Nav.results;
								
								for(var i=0; i<data4.length; i++){
									vData2.Data.push(data4[i]);
								}
							}
							
							// 추가휴게 신청내역
							if(data.FlexWorktime5Nav && data.FlexWorktime5Nav.results){
								var data5 = data.FlexWorktime5Nav.results;
								
								for(var i=0; i<data5.length; i++){
									vData5.push(data5[i]);
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
				
				oJSONModel1.setData(vData1);
				oJSONModel2.setData(vData2);
				oJSONModel3.setData(vData3);
				
				oController._ListCondJSonModel.setProperty("/Data2", vData);
				oController._ListCondJSonModel.setProperty("/Data5", vData5);
				
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
			
			if(oData.Alldf == true || oData.Offyn == "X") return;
			
			var breakdata = null;
			if(oData.Status == "00"){ // 결재중 데이터의 경우 추가휴게신청내역 데이터에서 선택일과 동일한 일자 데이터 검색
				breakdata = oController._ListCondJSonModel.getProperty("/Data5");
			} else {
				breakdata = oController._ListCondJSonModel.getProperty("/Data2");
			}
			
			var oData2 = [];
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			for(var i=0; i<breakdata.length; i++){
				if(dateFormat.format(breakdata[i].Datum) == dateFormat.format(oData.Datum)){
					oData2.push(breakdata[i]);
				}
			}
			
			var oData1;
			if(oData.Status == "00"){
				oData1 = Object.assign({}, oData, {Beguz : oData.Beguz2, Enduz : oData.Enduz2, Lnctm : oData.Lnctm2}, oController._ListCondJSonModel.getProperty("/Data"));
 			} else {
 				oData1 = Object.assign({}, oData, oController._ListCondJSonModel.getProperty("/Data"));
 			}
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_FlexworktimeStatus.m.Detail",
			      data : {
			    	  FromPageId : "ZUI5_HR_FlexworktimeStatus.m.List",
			    	  Data : oData1,
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