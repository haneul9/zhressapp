jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.export.Spreadsheet");

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

	return CommonController.extend("ZUI5_HR_WorkCalendar.List", {

		PAGEID: "ZUI5_HR_WorkCalendarList",
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
						Zyymm : today.getFullYear() + (today.getMonth()+1 > 10 ? today.getMonth()+1 : "0" + (today.getMonth()+1)),
						Pernr : oLoginData.Pernr,
						Bukrs : oLoginData.Bukrs,
						Langu : oLoginData.Langu,
						Molga : oLoginData.Molga
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkCalendar.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_WorkCalendar.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkCalendar.List");
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkCalendar.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			if(!oData.Zyymm || oData.Zyymm.trim() == ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_61001")); // 대상기간을 입력하여 주십시오.
				return;
			}
			
			var oCalendar = sap.ui.getCore().byId(oController.PAGEID + "_Calendar");
				oCalendar.destroyContent();
				oCalendar.addContent(sap.ui.jsfragment("ZUI5_HR_WorkCalendar.fragment.Calendar", oController));
			
			// summary 초기화
			var field = ["Dutyt", "Workt", "Overt", "Holit", "Sumoh", "Sumtm", "Workt2", "Dutyc", "DutycT"];    
			for(var i=0; i<field.length; i++){
				eval("oController._ListCondJSonModel.setProperty('/Data/" + field[i] + "', '-');");
			}
			
			var search = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});
				var dateFormat2 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "MM/dd"});
				var dateFormat3 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
				
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var createData = {WorkCalendar1Nav : [], WorkCalendar2Nav : [], WorkCalendar3Nav : []};
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.IMolga = oData.Molga;
					createData.ILangu = oData.Langu;
					createData.IYear = oData.Zyymm.substring(0,4);
					createData.IMonth = oData.Zyymm.substring(4,6);
					createData.IWtype = "W";

				oModel.create("/WorkCalendarSet", createData, null,
					function(data, res){
						if(data){
							if(data.WorkCalendar1Nav && data.WorkCalendar1Nav.results && data.WorkCalendar1Nav.results.length){
								var data1 = data.WorkCalendar1Nav.results;
								var total = 0;
								var day = [oBundleText.getText("LABEL_63055"), // 일요일
										   oBundleText.getText("LABEL_63056"), // 월
										   oBundleText.getText("LABEL_63057"), // 화
										   oBundleText.getText("LABEL_63058"), // 수
										   oBundleText.getText("LABEL_63059"), // 목
										   oBundleText.getText("LABEL_63060"), // 금
										   oBundleText.getText("LABEL_63061")] // 토
								
								var makeData = function(title, time){
									time = time.substring(0,2) + ":" + time.substring(2,4);
											
									return new sap.ui.commons.layout.MatrixLayoutRow({
											   height : "30px",
											   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
															content : [new sap.m.Text({text : title + " " + time})],
															hAlign : "Center",
															vAlign : "Middle"
														})]
										   });
								}
								
								for(var i=0; i<data1.length; i++){
									if(data1[i].Wtype == "W"){
										var oControl = sap.ui.getCore().byId(oController.PAGEID + "_0" + total);
										var oMatrix = new sap.ui.commons.layout.MatrixLayout({
															  columns : 1,
															  width : "100%",
															  rows : [new sap.ui.commons.layout.MatrixLayoutRow({
																	  	  height : "30px",
																	  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			  	  	   content : [new sap.m.Text({text : oBundleText.getText("LABEL_63023") + " " + data1[i].Workt3W})], // 근무시간
																			  	  	   hAlign : "Center",
																			  	  	   vAlign : "Middle"
																			  	   })] 
																	  }).addStyleClass("calendar-datum"),
																	  new sap.ui.commons.layout.MatrixLayoutRow({
																	  	  height : "30px",
																	  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			  	  	   content : [new sap.m.Text({text : oBundleText.getText("LABEL_63020") + " " + data1[i].NorwkW})], // 평일재근
																			  	  	   hAlign : "Center",
																			  	  	   vAlign : "Middle"
																			  	   })] 
																	  }),
																	  new sap.ui.commons.layout.MatrixLayoutRow({
																	  	  height : "30px",
																	  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			  	  	   content : [new sap.m.Text({text : oBundleText.getText("LABEL_63021") + " " + data1[i].ComtmW})], // 근태인정
																			  	  	   hAlign : "Center",
																			  	  	   vAlign : "Middle"
																			  	   })] 
																	  }),
																	  new sap.ui.commons.layout.MatrixLayoutRow({
																	  	  height : "30px",
																	  	  cells : [new sap.ui.commons.layout.MatrixLayoutCell({
																			  	  	   content : [new sap.m.Text({text : oBundleText.getText("LABEL_63022") + " " + data1[i].BrktmW})], // 휴게시간
																			  	  	   hAlign : "Center",
																			  	  	   vAlign : "Middle"
																			  	   })] 
																	  })]
														  });
										
										oControl.addContent(oMatrix);
										total++;
									} else {
										var oBegda = new Date(common.Common.getTime(data1[i].Begda));
										var oControl = sap.ui.getCore().byId(oController.PAGEID + "_" + dateFormat.format(oBegda));
										
										if(oControl){
											var title = new sap.m.Text({text : dateFormat2.format(oBegda)}).addStyleClass("font-bold");
											if(data1[i].Tagty == "1"){
												title.addStyleClass("color-info-red");
											}
											
											// 일자에 범례 색상 표시
											var titlestyle = "calendar-datum";
											if(data1[i].Error == "Q"){ // 승인데이터
												titlestyle = "bg-signature-darkgreen";
											} else if(data1[i].Error == "X"){ // 이상데이터
												titlestyle = "bg-signature-orange";
											} else if(data1[i].Error == "A"){ // 소명신청
												titlestyle = "background-color-lightorange";
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
																	  }).addStyleClass(titlestyle)]
														  });
											
											// 입문
											if(data1[i].Entbg != "" && data1[i].Entbg != "0000"){
												oMatrix.addRow(makeData(oBundleText.getText("LABEL_63015"), data1[i].Entbg));
											}
											
											// 출문
											if(data1[i].Enten != "" && data1[i].Enten != "0000"){
												oMatrix.addRow(makeData(oBundleText.getText("LABEL_63016"), data1[i].Enten));
											}
											
											// 재근
											if(data1[i].Norwk != "" && data1[i].Norwk != "0000"){
												oMatrix.addRow(makeData(oBundleText.getText("LABEL_63017"), data1[i].Norwk));
											}
											
											// 근무
											if(data1[i].Workt != "" && data1[i].Workt != "0000"){
												oMatrix.addRow(makeData(oBundleText.getText("LABEL_63018"), data1[i].Workt));
											}			  
											
											oControl.addContent(oMatrix);
											
											// 데이터 format 변경
											data1[i].Gendt = data1[i].Gendt ? dateFormat3.format(new Date(common.Common.getTime(data1[i].Gendt))) : ""; // 연차계산일
											data1[i].Begda = data1[i].Begda ? dateFormat3.format(new Date(common.Common.getTime(data1[i].Begda))) : ""; // 일자
											data1[i].Entbg = data1[i].Entbg == "" || data1[i].Entbg == "0000" ? "" : data1[i].Entbg.substring(0,2) + ":" + data1[i].Entbg.substring(2,4); // 입문시간
											data1[i].Enten = data1[i].Enten == "" || data1[i].Enten == "0000" ? "" : data1[i].Enten.substring(0,2) + ":" + data1[i].Enten.substring(2,4); // 출문시간
											data1[i].Norwk = data1[i].Norwk == "" || data1[i].Norwk == "0000" ? "" : data1[i].Norwk.substring(0,2) + ":" + data1[i].Norwk.substring(2,4); // 평일재근
											data1[i].Brktm = data1[i].Brktm == "" || data1[i].Brktm == "0000" ? "" : data1[i].Brktm.substring(0,2) + ":" + data1[i].Brktm.substring(2,4); // 평일재근
											data1[i].Otbet = data1[i].Otbet == "" || data1[i].Otbet == "0000" ? "" : data1[i].Otbet.substring(0,2) + ":" + data1[i].Otbet.substring(2,4); // 연장신청 시작시간
											data1[i].Otent = data1[i].Otent == "" || data1[i].Otent == "0000" ? "" : data1[i].Otent.substring(0,2) + ":" + data1[i].Otent.substring(2,4); // 연장신청 종료시간
											data1[i].Workt2 = data1[i].Workt2 == "" || data1[i].Workt2 == "0000" ? "" : data1[i].Workt2.substring(0,2) + ":" + data1[i].Workt2.substring(2,4); // 제근시간기준
											data1[i].Workt3 = data1[i].Workt3 == "" || data1[i].Workt3 == "0000" ? "" : data1[i].Workt3.substring(0,2) + ":" + data1[i].Workt3.substring(2,4); // 근태인정시간
											data1[i].Mealb = data1[i].Mealb == true ? "Y" : "N"; // 조
											data1[i].Meall = data1[i].Meall == true ? "Y" : "N"; // 중
											data1[i].Meald = data1[i].Meald == true ? "Y" : "N"; // 석
											data1[i].Mealn = data1[i].Mealn == true ? "Y" : "N"; // 야
											data1[i].Welld = data1[i].Welld == true ? "Y" : "N"; // 팰리스
											data1[i].Day = day[oBegda.getDay()]; // 요일
											
											
											var oJSONModel = new sap.ui.model.json.JSONModel();
												oJSONModel.setData({Data : data1[i]});
											
											oControl.setModel(oJSONModel);
											oControl.addStyleClass("cursor-pointer");
											oControl.attachBrowserEvent("click", oController.onSelectDate);
										}
									}
								}
							}
							
							if(data.WorkCalendar3Nav && data.WorkCalendar3Nav.results && data.WorkCalendar3Nav.results.length){
								var data3 = data.WorkCalendar3Nav.results[0];
								
								for(var i=0; i<field.length; i++){
									var tmp = eval("data3." + field[i]);
									if(field[i] == "Dutyc" || field[i] == "DutycT"){ // 비고 제외
										
									} else {
										tmp = tmp == "00000" ? "-" : tmp.substring(0,3) + ":" + tmp.substring(3,5);
									}
									
									eval("oController._ListCondJSonModel.setProperty('/Data/" + field[i] + "', tmp);");
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkCalendar.List");
			var oController = oView.getController();
			
			var oControl = sap.ui.getCore().byId(oEvent.currentTarget.id);
			if(oControl == undefined) return;
			
			var oData = oControl.getModel().getProperty("/Data");
			
			if(!oController._DetailDialog){
				oController._DetailDialog = sap.ui.jsfragment("ZUI5_HR_WorkCalendar.fragment.Detail", oController);
				oView.addDependent(oController._DetailDialog);
			}
			
			oController._DetailDialog.getModel().setData({Data : (Object.assign({}, oData, $.app.getModel("session").getData()))});
			
			// 근태 table
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			var column = oTable.getColumns();
			for(var i=0; i<column.length; i++){
				column[i].setFiltered(false);
				column[i].setSorted(false);
			}
			
			var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
			var oFilter = oController._ListCondJSonModel.getProperty("/Data");
			var createData = {WorkCalendar2Nav : []};
				createData.IPernr = oFilter.Pernr;
				createData.IBukrs = oFilter.Bukrs;
				createData.IMolga = oFilter.Molga;
				createData.ILangu = oFilter.Langu;
				createData.IYear = oFilter.Zyymm.substring(0,4);
				createData.IMonth = oFilter.Zyymm.substring(4,6);
				// createData.IReqdt = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
				createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
				createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
				createData.IWtype = "";

			oModel.create("/WorkCalendarSet", createData, null,
				function(data, res){
					if(data){
						if(data.WorkCalendar2Nav && data.WorkCalendar2Nav.results && data.WorkCalendar2Nav.results.length){
							var data2 = data.WorkCalendar2Nav.results;
							
							for(var i=0; i<data2.length; i++){
								data2[i].Idx = (i+1);
								
								data2[i].Begda = data2[i].Begda ? new Date(common.Common.setTime(data2[i].Begda)) : null;
								data2[i].Endda = data2[i].Endda ? new Date(common.Common.setTime(data2[i].Endda)) : null;
								
								data2[i].Beguz = data2[i].Beguz == "" ? "" : data2[i].Beguz.substring(0,2) + ":" + data2[i].Beguz.substring(2,4);
								data2[i].Enduz = data2[i].Enduz == "" ? "" : data2[i].Enduz.substring(0,2) + ":" + data2[i].Enduz.substring(2,4);
								data2[i].Comtm = data2[i].Comtm == "" || data2[i].Comtm == "0000" ? "" : data2[i].Comtm.substring(0,2) + ":" + data2[i].Comtm.substring(2,4);
								
								vData.Data.push(data2[i]);
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
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			oJSONModel.setData(vData);
			oTable.bindRows("/Data");
			oTable.setVisibleRowCount((vData.Data.length > 5 ? 5 : vData.Data.length));
			
			oController._DetailDialog.open();
		},
		
		 // 비근무시간 저장
		 onPressSave : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkCalendar.List");
			var oController = oView.getController();
		
			var oData = oController._DetailDialog.getModel().getProperty("/Data");
			console.log(oData);
			
			// validation check
			if(!oData.Brkbg || !oData.Brken){
				sap.m.MessageBox.error(oBundleText.getText("MSG_63008")); // 비근무시간을 입력하시기 바랍니다.
				return;
			} else if(!oData.Reqrn || oData.Reqrn.trim() == ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_63007")); // 요청사유를 입력하시기 바랍니다.
				return;
			} 
			
			var process = function(){
			
				oController._BusyDialog.close();
				sap.m.MessageBox.success(oBundleText.getText("MSG_00017"), { // 저장되었습니다.
					onClose : function(){
						oController._DetailDialog.close();
						oController.onPressSearch();
					}
				});
			};
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_00058"), { // 저장하시겠습니까?
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(process, 100);
					}
				}
			});
		 },
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkCalendar.List");
			var oController = oView.getController();
			
			var initData = {
                Percod: $.app.getModel("session").getData().Percod,
                Bukrs: $.app.getModel("session").getData().Bukrs2,
                Langu: $.app.getModel("session").getData().Langu,
                Molga: $.app.getModel("session").getData().Molga,
                Datum: new Date(),
                Mssty: "",
            },
            callback = function(o) {
                // oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                // oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                // oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
               
                oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
				oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
               
                if(o.Otype == "P"){
                	oController._ListCondJSonModel.setProperty("/Data/Pernr", o.Objid);
                } else if(o.Otype == "O"){
                	oController._ListCondJSonModel.setProperty("/Data/Orgeh", o.Objid);
                }
                
                oController._ListCondJSonModel.setProperty("/Data/Ename", o.Stext);
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
        
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "35110749"});
			return new JSONModelHelper({name: "35128158"});
		} : null
		
	});

});