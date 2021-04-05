jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("jquery.sap.resources");

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

	return CommonController.extend("ZUI5_HR_TMDashboard.List", {

		PAGEID: "ZUI5_HR_TMDashboard",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		UploadFileModel: new JSONModelHelper(),
		_Bukrs : "",
		
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
				
			this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			
			if(!oController._ListCondJSonModel.getProperty("/Data")){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
				var today = new Date();
				
				var vData = {
					Data : {},
					Data1 : { // 근무일정조회
						Bukrs : $.app.getModel("session").getData().Bukrs2,
						Langu : $.app.getModel("session").getData().Langu,
						Zyymm : today.getFullYear() + "." + (today.getMonth() + 1 >= 10 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1))
					},
					Data2 : { // 교대근무자현황
						Bukrs : $.app.getModel("session").getData().Bukrs2,
						Datum : dateFormat.format(today)
					},
					Data3 : { // 대체근무조회
						Bukrs : $.app.getModel("session").getData().Bukrs2,
						Pernr : "",
						Orgeh : $.app.getModel("session").getData().Orgeh,
						Ename : $.app.getModel("session").getData().Stext,
						Langu : $.app.getModel("session").getData().Langu,
						Begda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), 1)),
						Endda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth())))),
					},
					Data4 : { // 근무일정현황
						Bukrs : $.app.getModel("session").getData().Bukrs2,
						Pernr : "",
						Orgeh : $.app.getModel("session").getData().Orgeh,
						Ename : $.app.getModel("session").getData().Stext,
						Begda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), 1)),
						Endda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth())))),
					},
					Data5 : { // 근무시간현황
						Bukrs : $.app.getModel("session").getData().Bukrs2,
						Pernr : $.app.getModel("session").getData().Pernr,
						Orgeh : "",
						Ename : $.app.getModel("session").getData().Ename,
						Molga : $.app.getModel("session").getData().Molga,
						Langu : $.app.getModel("session").getData().Langu,
						Begda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), 1)),
						Endda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth())))),
						Type : "1"
					},
					Data6 : { // 제조근무시간조회
						Pernr : $.app.getModel("session").getData().Pernr,
						Langu : $.app.getModel("session").getData().Langu,
						Zyymm : today.getFullYear() + "." + (today.getMonth() + 1 >= 10 ? today.getMonth() + 1 : "0" + (today.getMonth() + 1))
					}
				};
				
				oController._ListCondJSonModel.setData(vData);
			}
			
			sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").setSelectedKey("1");
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch1(oEvent);
		},
		
		smartSizing : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
			var oController = oView.getController();
			
			var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table" + sKey);
			var oData = oTable.getModel().getProperty("/Data");
			
			var height = 0, count = 0;
			
			switch(sKey){
				case "1":
					height = parseInt(window.innerHeight - 230);
					count = parseInt((height - 75) / 38);
					break;
				case "4":
					height = parseInt(window.innerHeight - 270);
					count = parseInt((height - 35) / 38);
					break;
				default:
					height = parseInt(window.innerHeight - 230);
					count = parseInt((height - 35) / 38);
			}
			
			if(oData){
				oTable.setVisibleRowCount(oData.length < count ? oData.length : count);
			} else {
				oTable.setVisibleRowCount(1);
			}
		},
		
		onChangeDate : function(oEvent, field){
			if(oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047")); // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		// 근무일정조회
		onPressSearch1 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data1");
			
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
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var createData = {WorkSchedule1Nav : [], WorkSchedule2Nav : []};
					createData.IYear = oData.Zyymm.split(".")[0];
					createData.IMonth = oData.Zyymm.split(".")[1];
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oData.Langu;
					
				oModel.create("/WorkScheduleSet", createData, null,
					function(data, res){
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
				
				oJSONModel.setData(vData);
				oTable.bindRows("/Data");
				oController.smartSizing();
				
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
		
		// 교대근무자현황
		onPressSearch2 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
			var oController = oView.getController();
			
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Layout2");
				oLayout.destroyContent();
				
			var search = function(){
				var oData = oController._ListCondJSonModel.getProperty("/Data2");
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var oPath = "/ShiftScheduleSet?$filter=IBukrs eq '" + oData.Bukrs + "'";
				
				oModel.read(oPath, null, null, false,
					function(data,res){
						if(data && data.results.length){
							if(data.results[0].EUrl != ""){
								oLayout.addContent(
									new sap.ui.core.HTML({
									    content : ["<iframe id='iWorkerPDF'" +
												   "name='iWorkerPDF' src='" + data.results[0].EUrl + "'" +
												   "width='" + (window.innerWidth - 80) + "px' height='" + (parseInt(window.innerHeight - 230) + "px") + "'" +
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
		
		// 대체근무조회
		onPressSearch3 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data3");
			if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oBundleText.getText("MSG_60001")); // 대상기간을 입력하여 주십시오.
				return;
			}
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			// filter, sort 제거
			var oColumn = oTable.getColumns();
			for(var i=0; i<oColumn.length; i++){
				oColumn[i].setFiltered(false);
				oColumn[i].setSorted(false);
			}
			
			var search = function(){
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var createData = {ChangeWorkNav : []};
					createData.IBukrs = oData.Bukrs;
					createData.IPernr = oData.Pernr;
					createData.IOrgeh = oData.Orgeh;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/"; 
					createData.ILangu = oData.Langu;

				oModel.create("/ChangeWorkListSet", createData, null,
					function(data, res){
						if(data){
							if(data.ChangeWorkNav && data.ChangeWorkNav.results){
								var data1 = data.ChangeWorkNav.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Begda = new Date(common.Common.getTime(data1[i].Begda));
									data1[i].Endda = new Date(common.Common.getTime(data1[i].Endda));
									
									vData.Data.push(data1[i]);
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
				
				oJSONModel.setData(vData);
				oTable.bindRows("/Data");
				oController.smartSizing();
				
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
		
		// 근무일정현황
		onPressSearch4 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data4");
			if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oBundleText.getText("MSG_60001")); // 대상기간을 입력하여 주십시오.
				return;
			}
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table4");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			var column = oTable.getColumns();
			for(var i=0; i<column.length; i++){
				column[i].setSorted(false);
				column[i].setFiltered(false);
			}
			
			var search = function(){
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var createData = {DWorkScheduleNav : []};
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oData.Langu;
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
					createData.IOrgeh = oData.Orgeh;
					createData.IEmpid = oData.Pernr;
				
				oModel.create("/DayWorkScheduleSet", createData, null,
					function(data, res){
						if(data){
							if(data.DWorkScheduleNav && data.DWorkScheduleNav.results){
								var data1 = data.DWorkScheduleNav.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Datum = new Date(common.Common.getTime(data1[i].Datum));
									
									data1[i].Beguz = data1[i].Beguz != "" ? (data1[i].Beguz.substring(0,2) + ":" + data1[i].Beguz.substring(2,4)) : "";
									data1[i].Enduz = data1[i].Enduz != "" ? (data1[i].Enduz.substring(0,2) + ":" + data1[i].Enduz.substring(2,4)) : "";
									
									vData.Data.push(data1[i]);
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
				
				oJSONModel.setData(vData);
				oTable.bindRows("/Data");
				oController.smartSizing();
				
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
		
		// 근무시간현황
		onPressSearch5 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data5");
			
			if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oBundleText.getText("MSG_60001")); // 대상기간을 입력하여 주십시오.
				return;
			} else if(!oData.Type){
				sap.m.MessageBox.error(oBundleText.getText("MSG_60003")); // 조회구분을 선택하여 주십시오.
				return;
			}
			
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Layout5");
				oLayout.destroyContent();
				
			var vData = [];
			
			var search = function(){
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var createData = {};
				eval('createData.Worktime' + oData.Type + "Nav = [];");
				
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oData.Langu;
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
					createData.IOrgeh = oData.Orgeh;
					createData.IEmpid = oData.Pernr;
				
				oModel.create("/WorktimeListSet", createData, null,
					function(data, res){
						if(data){
							var data1 = eval("data.Worktime" + oData.Type + "Nav");
							
							if(data1 && data1.results){
								var field = [];
								switch(oData.Type){
									case "1":
										field = ["Wtm01", "Wtm02", "Wtm03", "Wtm04", "Wtm05", "Wtm06", "Wtm07", "Wtsum", "Wtsum2"];
										break;
									case "2":
										field = ["Wtm40", "Wtm12", "Wtsum"];
										break;
									case "3":
										field = ["Wtm40", "Wtm12", "Wtsum", "Wta40", "Wta12", "Wtavg"];
										break;
								}
								
								for(var i=0; i<data1.results.length; i++){
									for(var j=0; j<field.length; j++){
										eval("data1.results[i]." + field[j] + " = parseFloat(data1.results[i]." + field[j] + ") == 0 ? '' : parseFloat(data1.results[i]." + field[j] + ");");
									}
									
									vData.push(data1.results[i]);
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
					
				eval("oController.makeContent" + oData.Type + "(oController, oLayout, vData);");

				oController._BusyDialog.close();
				
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		// 근무시간현황 - 일별
		makeContent1 : function(oController, oLayout, oData){
			var height = parseInt(window.innerHeight - 280), count = parseInt((height - 35) / 38);
			var column_length = 0, flag = "";
			
			if(oData.length < count){
				column_length = oData.length;
			} else {
				column_length = count;
				flag = "X";
			}
			
			var oRow, oCell;
			
			// header
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				width : "100%",
				rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})]
			});
								// 사번, 성명, 부서명, 직급, 일자, 근무, 구분
			var header_title = ["LABEL_60012", "LABEL_60013", "LABEL_60033", "LABEL_00124", "LABEL_60009", "LABEL_60038", "LABEL_60039",
								// 월, 화, 수, 목, 금, 토, 일
								"LABEL_48057", "LABEL_48058", "LABEL_48059", "LABEL_48060", "LABEL_48061", "LABEL_48062", "LABEL_48056",
								// 구분계, 근무계
								"LABEL_60040", "LABEL_60041"];
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
			
			var oWidths = [], oWidths2 = [];
			for(var i=0; i<header_title.length; i++){
				if(i>6){
					oWidths.push("100px");
					oWidths2.push("100px");
				} else {
					oWidths.push("");
					oWidths2.push("");
				}
				
				var title = eval("oBundleText.getText('" + header_title[i] + "');");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : [new sap.m.Label({text : title})],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Label3");
				
				oRow.addCell(oCell);
			}
			
			if(flag == "X"){
				oWidths.push("13px");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : [],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Label3");
			
				oRow.addCell(oCell);
			}
			
			oMatrix.setWidths(oWidths);
			oMatrix.addRow(oRow);
			
			// content
			if(oData.length == 0){
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "38px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_00901")})], // No data found
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : oWidths.length
								 }).addStyleClass("Data")]
					})
				);
			} else {
				var oSpan = [], detail = {};
				for(var i=0; i<oData.length; i++){
					if(i==0){
						detail = {Idx : i, Length : 1};
					} else {
						if(oData[i].Pernr == oData[i-1].Pernr){
							detail.Length = detail.Length + 1;
						} else {
							oSpan.push(detail);
							
							detail = {Idx : i, Length : 1};
						}
						
						if(i == oData.length - 1){
							detail.Length = detail.Length + 1;
							oSpan.push(detail);
						}
					}
				}
				
				var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
								   columns : header_title.length,
								   width : "100%"
							   });
				oMatrix2.setWidths(oWidths2);
				
				var field = ["WtgbnTx", "Wtm01", "Wtm02", "Wtm03", "Wtm04", "Wtm05", "Wtm06", "Wtm07", "Wtsum", "Wtsum2"];
				var tmp = 0, tmp2 = 0, oRow = null, style = "";
				
				for(var i=0; i<oData.length; i++){
					for(var j=0; j<oSpan.length; j++){
						if(i == oSpan[j].Idx){
							tmp = oSpan[j].Length;
							oRow = new sap.ui.commons.layout.MatrixLayoutRow({
									   height : "38px",
									   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Pernr})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Ename})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Orgtx})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].ZpGradeTx})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2")]
								   });
							break;
						}
					}
					
					if(oRow == null){
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
					}
					
					style = oData[i].Wtgrp == "3" ? "Label3" : "Data2";
					
					// 일자
					if(i % 6 == 0){
						oRow.addCell(
							new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Text({text : oData[i].BeEn, textAlign : "Center"})],
								hAlign : "Center",
								vAlign : "Middle",
								rowSpan : 6
							}).addStyleClass("Data2")
						);
					}
					
					// 근무
					if(i == 0 || (i != 0 && (oData[i].Wtgrp != oData[i-1].Wtgrp))){
						var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
										content : [new sap.m.Label({text : oData[i].WtgrpTx})],
										hAlign : "Center",
										vAlign : "Middle"
									}).addStyleClass(style);
									
						switch(oData[i].Wtgrp){
							case "1":
								oCell.setRowSpan(3);
								break;
							case "2":
								oCell.setRowSpan(2);
								break;
							case "3":
								oCell.setColSpan(2);
								break;
						}
						
						oRow.addCell(oCell);
					}
					
					// 구분 ~ 근무계
					for(var a=0; a<field.length; a++){
						if(oData[i].Wtgrp == "3" && a == 0) continue;
						
						var oText = eval("oData[i]." + field[a]);
						oRow.addCell(
							new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Label({text : oText})],
								hAlign : "Center",
								vAlign : "Middle"
							}).addStyleClass(style)
						);
					}
					
					oMatrix2.addRow(oRow);
					
					oRow = null;
				}
				
				var oScrollContainer = new sap.m.ScrollContainer({
					horizontal : false,
					vertical : true,
					height : height + "px",
					content : [oMatrix2]
				});
				
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oScrollContainer],
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : oWidths.length
								 })]
					})
				);
			}
			
			oLayout.addContent(oMatrix);
		},
		
		// 근무시간현황 - 주별
		makeContent2 : function(oController, oLayout, oData){
			var height = parseInt(window.innerHeight - 280), count = parseInt((height - 35) / 38);
			var column_length = 0, flag = "";
			
			if(oData.length < count){
				column_length = oData.length;
			} else {
				column_length = count;
				flag = "X";
			}
			
			var oRow, oCell;
			
			// header
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				width : "100%",
				rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})]
			});
								// 사번, 성명, 부서명, 직급, 일자
			var header_title = ["LABEL_60012", "LABEL_60013", "LABEL_60033", "LABEL_00124", "LABEL_60009", 
								// 주40시간, 주12시간, 계
								"LABEL_60045", "LABEL_60046", "LABEL_60047"];
			
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
			
			var oWidths = [], oWidths2 = [];
			for(var i=0; i<header_title.length; i++){
				oWidths.push("");
				oWidths2.push("");
				
				var title = eval("oBundleText.getText('" + header_title[i] + "');");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : [new sap.m.Label({text : title})],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Label3");
				
				oRow.addCell(oCell);
			}
			
			if(flag == "X"){
				oWidths.push("13px");
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : [],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Label3");
			
				oRow.addCell(oCell);
			}
			
			oMatrix.setWidths(oWidths);
			oMatrix.addRow(oRow);
			
			// content
			if(oData.length == 0){
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "38px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_00901")})], // No data found
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : oWidths.length
								 }).addStyleClass("Data")]
					})
				);
			} else {
				var oSpan = [], detail = {};
				for(var i=0; i<oData.length; i++){
					if(i==0){
						detail = {Idx : i, Length : 1};
					} else {
						if(oData[i].Pernr == oData[i-1].Pernr){
							detail.Length = detail.Length + 1;
						} else {
							oSpan.push(detail);
							
							detail = {Idx : i, Length : 1};
						}
						
						if(i == oData.length - 1){
							detail.Length = detail.Length + 1;
							oSpan.push(detail);
						}
					}
				}
				
				var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
								   columns : header_title.length,
								   width : "100%"
							   });
				oMatrix2.setWidths(oWidths2);
				
				var field = ["BeEn", "Wtm40", "Wtm12", "Wtsum"];
				var tmp = 0, tmp2 = 0, oRow = null, style = "";
				
				for(var i=0; i<oData.length; i++){
					for(var j=0; j<oSpan.length; j++){
						if(i == oSpan[j].Idx){
							tmp = oSpan[j].Length;
							oRow = new sap.ui.commons.layout.MatrixLayoutRow({
									   height : "38px",
									   cells : [new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Pernr})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Ename})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].Orgtx})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2"),
												new sap.ui.commons.layout.MatrixLayoutCell({
													content : [new sap.m.Text({text : oData[i].ZpGradeTx})],
													hAlign : "Center",
													vAlign : "Middle",
													rowSpan : oSpan[j].Length
												}).addStyleClass("Data2")]
								   });
							break;
						}
					}
					
					if(oRow == null){
						oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "38px"});
					}
					
					// 일자 ~ 계
					for(var a=0; a<field.length; a++){
						if(oData[i].Wtgrp == "3" && a == 0) continue;
						
						var oText = eval("oData[i]." + field[a]);
						oRow.addCell(
							new sap.ui.commons.layout.MatrixLayoutCell({
								content : [new sap.m.Label({text : oText})],
								hAlign : "Center",
								vAlign : "Middle"
							}).addStyleClass("Data2")
						);
					}
					
					oMatrix2.addRow(oRow);
					
					oRow = null;
				}
				
				var oScrollContainer = new sap.m.ScrollContainer({
					horizontal : false,
					vertical : true,
					height : height + "px",
					content : [oMatrix2]
				});
				
				oMatrix.addRow(
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oScrollContainer],
									 hAlign : "Center",
									 vAlign : "Middle",
									 colSpan : oWidths.length
								 })]
					})
				);
			}
			
			oLayout.addContent(oMatrix);
		},
		
		// 근무시간현황 - 평균
		makeContent3 : function(oController, oLayout, oData){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			
			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table5", {
				selectionMode: "None",
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 1,
				showOverlay: false,
				showNoData: true,
				noData: oBundleText.getText("LABEL_00901"), // No data found
				rowHeight: 37,
				columnHeaderHeight: 38
			}).addStyleClass("mt-10px");
			
			oTable.setModel(oJSONModel);
			oJSONModel.setData({Data : oData});
			oTable.bindRows("/Data");
			
							// 사번, 성명, 부서명, 직급, 일자, 주
			var col_info = [{id: "Pernr", label: oBundleText.getText("LABEL_60012"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Ename", label: oBundleText.getText("LABEL_60013"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Orgtx", label: oBundleText.getText("LABEL_60033"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "ZpGradeTx", label: oBundleText.getText("LABEL_00124"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "BeEn", label: oBundleText.getText("LABEL_60009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "15%"},
							{id: "Wkcnt", label: oBundleText.getText("LABEL_60034"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							// 합계(주40시간), 합계(주12시간), 총합계
							{id: "Wtm40", label: oBundleText.getText("LABEL_60035"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wtm12", label: oBundleText.getText("LABEL_60036"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wtsum", label: oBundleText.getText("LABEL_60037"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							// 합계(주40시간), 합계(주12시간), 평균
							{id: "Wta40", label: oBundleText.getText("LABEL_60035"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wta12", label: oBundleText.getText("LABEL_60036"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Wtavg", label: oBundleText.getText("LABEL_60032"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
			
			common.makeTable.makeColumn(oController, oTable, col_info);
			
			oLayout.addContent(oTable);
			oController.smartSizing();
		},
		
		// 제조근무시간조회
		onPressSearch6 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data6");
			var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Layout6");
				oLayout.destroyContent();
				oLayout.addContent(sap.ui.jsfragment("ZUI5_HR_TMDashboard.fragment.Calendar", oController));
			
			var search = function(){
				var oModel = sap.ui.getCore().getModel("ZHR_DASHBOARD_SRV");
				var createData = {WScheduleBasicNav : []};
					createData.IPernr = oData.Pernr;
					createData.ILangu = oData.Langu;
					createData.IYear = oData.Zyymm.split(".")[0];
					createData.IMonth = oData.Zyymm.split(".")[1];
				
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
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
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
            	var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
				var oController = oView.getController();
			
			    var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
                var data = "Data" + sKey;
               
                oController._ListCondJSonModel.setProperty("/" + data + "/Pernr", "");
				oController._ListCondJSonModel.setProperty("/" + data + "/Orgeh", "");
               
                if(o.Otype == "P"){
                	oController._ListCondJSonModel.setProperty("/" + data + "/Pernr", o.Objid);
                } else if(o.Otype == "O"){
                	oController._ListCondJSonModel.setProperty("/" + data + "/Orgeh", o.Objid);
                }
                
                oController._ListCondJSonModel.setProperty("/" + data + "/Ename", o.Stext);
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
		
		handleIconTabBarSelect : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_TMDashboard.List");
			var oController = oView.getController();
			
			var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
			eval("oController.onPressSearch" + sKey + "();");
		},
		
		getUserId: function() {
			return $.app.getModel("session").getData().Pernr;
		},
		
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20060057"});
			// return new JSONModelHelper({name: "20130185"}); 
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});