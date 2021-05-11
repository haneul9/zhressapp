jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.export.Spreadsheet");

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

	return CommonController.extend("ZUI5_HR_LeaveUseChart.List", {

		PAGEID: "ZUI5_HR_LeaveUseChart",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		
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
				}, this);
			gDtfmt = $.app.getModel("session").getData().Dtfmt;	
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			var oLoginData = $.app.getModel("session").getData();
			
			// 조회조건 초기화
			// 인사영역
			var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
				oWerks.destroyItems();
			
			var oModel = $.app.getModel("ZHR_COMMON_SRV");

			oModel.read("/WerksListAuthSet", {
				async: false,
				filters: [
					new sap.ui.model.Filter("ICusrid", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.odata.user.percod')),
					new sap.ui.model.Filter("ICusrse", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.session.token')),
					new sap.ui.model.Filter("ICusrpn", sap.ui.model.FilterOperator.EQ, sessionStorage.getItem('ehr.sf-user.name')),
					new sap.ui.model.Filter("ICmenuid", sap.ui.model.FilterOperator.EQ, $.app.getMenuId()),
					new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oLoginData.Percod),
					new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oLoginData.Bukrs3)
				],
				success: function(data, oResponse) {
					if(data && data.results.length) {
						for(var i=0; i<data.results.length; i++){
							oWerks.addItem(new sap.ui.core.Item({key : data.results[i].Persa, text : data.results[i].Pbtxt}));
						}					
					}
				},
				error: function(Res) {
					oController.Error = "E";
					if(Res.response.body){
						ErrorMessage = Res.response.body;
						var ErrorJSON = JSON.parse(ErrorMessage);
						if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
							oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
						} else {
							oController.ErrorMessage = ErrorMessage;
						}
					}
				}
			});

			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
			}
			
			// // 소속부서
			// sap.ui.getCore().byId(oController.PAGEID + "_Orgeh").destroyTokens();
			// // 대상자
			// sap.ui.getCore().byId(oController.PAGEID + "_Ename").destroyTokens();
			
			if(!oController._ListCondJSonModel.getProperty("/Data")){
				var oZyymm = new Date().getFullYear() + ((new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1));
				
				var vData = {
					Data : {
						Werks : oLoginData.Persa,
						Zyymm : oZyymm,
						Key : "1",
						Disty : "1",
						Pernr : "",
						Chief : $.app.getModel("session").getData().Chief
					}
				};
				
				if(gAuth == "M"){
					// sap.ui.getCore().byId(oController.PAGEID + "_Orgeh").addToken(
					// 	new sap.m.Token({
					// 		key : $.app.getModel("session").getData().Orgeh,
					// 		text : $.app.getModel("session").getData().Stext
					// 	})	
					// );
					vData.Data.Orgeh = $.app.getModel("session").getData().Orgeh;
					vData.Data.Ename = $.app.getModel("session").getData().Stext;
				}
				
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onChangeDate : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
		
			var oScrollContainer = sap.ui.getCore().byId(oController.PAGEID + "_ScrollContainer");
			var oChart = sap.ui.getCore().byId(oController.PAGEID + "_Chart");
			var oScrollContainer2 = sap.ui.getCore().byId(oController.PAGEID + "_ScrollContainer2");
			
			switch(oController._ListCondJSonModel.getProperty("/Data/Key")){
				case "2":
					var height = parseInt(window.innerHeight - 220);
					oScrollContainer.setHeight(height + "px");
					oChart.setHeight((height - 40) + "px");
					
					break;
				case "3":
					var height = parseInt(window.innerHeight - 240);
					oScrollContainer2.setHeight(height + "px");
					
					var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
					var count = parseInt((height - 75) / 38);
					var oData = oTable.getModel().getProperty("/Data");
					
					if(!oData)
						oTable.setVisibleRowCount(1);
					else {
						if(oData.length < count)
							oTable.setVisibleRowCount(oData.length);
						else
							oTable.setVisibleRowCount(count);
							
						oTable.setFixedBottomRowCount(1);
					}
					
					oTable.bindRows("/Data");
					
					break;
				case "1":
				default : 
					var height = parseInt((window.innerHeight - 210) / 2);
					
					oScrollContainer.setHeight(height + "px");
					oChart.setHeight((height - 40) + "px");
					oScrollContainer2.setHeight((height - 20) + "px");
	
					var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
					var count = parseInt((height - 95) / 38);
					var oData = oTable.getModel().getProperty("/Data");
					
					if(!oData)
						oTable.setVisibleRowCount(1);
					else {
						if(oData.length < count)
							oTable.setVisibleRowCount(oData.length);
						else
							oTable.setVisibleRowCount(count);
					
						oTable.setFixedBottomRowCount(1);
					}
					
					oTable.bindRows("/Data");
			}	
		},
		
		onPressSegmentedButton : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
		
			oController._ListCondJSonModel.setProperty("/Data/Key", oEvent.getSource().getKey());
			oController.SmartSizing();
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
			if(oController.setTable() == ""){
				return;
			};
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oChart = sap.ui.getCore().byId(oController.PAGEID + "_Chart");
			var oJSONModel = oChart.getModel();
			var vData = {Data : []};
			
			var search = function(){
				var oPath = "";
				var createData = {LeaveuseHistoryNav : []};
					createData.IEmpid = $.app.getModel("session").getData().Pernr;
					createData.IActty = gAuth;
					createData.IWerks = oData.Werks;
					createData.IZyymm = oData.Zyymm;
					createData.IBukrs = oData.Werks;
					createData.IPernr = oData.Pernr;
					createData.IOrgeh = oData.Orgeh;
					
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				oModel.create("/LeaveUseHistorySet", createData, {
					success: function(data, res){
						if(data){
							if(data.LeaveuseHistoryNav && data.LeaveuseHistoryNav.results){
								for(var i=0; i<data.LeaveuseHistoryNav.results.length; i++){
									data.LeaveuseHistoryNav.results[i].Zyymm = data.LeaveuseHistoryNav.results[i].Zyymm.substring(0,4) + "." + data.LeaveuseHistoryNav.results[i].Zyymm.substring(4,6);
									data.LeaveuseHistoryNav.results[i].Cumrte = parseFloat(data.LeaveuseHistoryNav.results[i].Cumrte);
									data.LeaveuseHistoryNav.results[i].Monrte = parseFloat(data.LeaveuseHistoryNav.results[i].Monrte);
									
									vData.Data.push(data.LeaveuseHistoryNav.results[i]);
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
		
		setTable : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
			var oScrollContainer = sap.ui.getCore().byId(oController.PAGEID + "_ScrollContainer2");
				oScrollContainer.destroyContent();
				
			var oTable = sap.ui.jsfragment("ZUI5_HR_LeaveUseChart.fragment.Table", oController);
				oScrollContainer.addContent(oTable);
				
			// 데이터 조회
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			if(oData.Zyymm.length != 6){
				sap.m.MessageBox.error(oBundleText.getText("MSG_41001")); // 조회연월을 입력하여 주십시오.
				return "";
			}
			
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
			var createData = {LeaveuseBoardNav : []};
				createData.IEmpid = $.app.getModel("session").getData().Pernr;
				createData.IActty = gAuth;
				createData.IWerks = oData.Werks;
				createData.IZyymm = oData.Zyymm;
				createData.IBukrs = oData.Werks;
				createData.IDisty = oData.Disty;
				createData.IPernr = oData.Pernr;
				createData.IOrgeh = oData.Orgeh;
			
			// var oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename");
			// if(oEname.getTokens().length > 0){
			// 	createData.IPernr = oEname.getTokens()[0].getKey();
			// }
			
			// var oOrgeh = sap.ui.getCore().byId(oController.PAGEID + "_Orgeh");
			// if(oOrgeh.getTokens().length > 0){
			// 	createData.IOrgeh = oOrgeh.getTokens()[0].getKey();
			// }
			
			var field = ["Cur01", "Cur02", "Cur03", "Cur04", "Cur05", "Cur06", "Cum01", "Cum02", "Cum03", "Cum04", "Cum05", "Cum06",
						 "Usecnt01", "Usecnt02", "Usecnt03", "Usecnt04", "Usecnt05", "Usecnt06", "Usecnt07", "Usecnt08", "Usecnt09", "Usecnt10", "Usecnt11", "Usecnt12",
						 "Crecnt", "Usecnt", "Balcnt", "Userte"];
			
			oModel.create("/LeaveUseBoardSet", createData, {
				success: function(data, res){
					if(data){
						if(data.LeaveuseBoardNav && data.LeaveuseBoardNav.results){
							for(var i=0; i<data.LeaveuseBoardNav.results.length; i++){
								data.LeaveuseBoardNav.results[i].Idx = i+1;
								
								for(var j=0; j<field.length; j++){
									eval("data.LeaveuseBoardNav.results[i]." + field[j] + 
											" = parseFloat(data.LeaveuseBoardNav.results[i]." + field[j] + ") == 0 ? '-' : parseFloat(data.LeaveuseBoardNav.results[i]." + field[j] + ");");
								}
								
								if(i == data.LeaveuseBoardNav.results.length - 1){
									data.LeaveuseBoardNav.results[i].Idx = "";
									data.LeaveuseBoardNav.results[i].Orgeh = "";
									data.LeaveuseBoardNav.results[i].Pernr = "";
									data.LeaveuseBoardNav.results[i].Ename = "";
								}
								
								vData.Data.push(data.LeaveuseBoardNav.results[i]);
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
			
			oController.SmartSizing();
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
		},
		
		onPressDetail : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			if(oData.Orgeh == "" && oData.Pernr == "") return;
			
			var oId = oEvent.getSource().getCustomData()[1].getValue();
			
			if(oController._ListCondJSonModel.getProperty("/Data/Disty") == "2"){
				oController.onPressPersDetail(oEvent);
				return;
			}
			
			if(!oController._DetailDialog){
				oController._DetailDialog = sap.ui.jsfragment("ZUI5_HR_LeaveUseChart.fragment.Detail", oController);
				oView.addDependent(oController._DetailDialog);
			}
			
			// 데이터 조회
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_DetailTable");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			// filter, sort 제거
			var oColumn = oTable.getColumns();
			for(var i=0; i<oColumn.length; i++){
				oColumn[i].setFiltered(false);
				oColumn[i].setSorted(false);
			}
			
			var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
			
			var createData = {LeaveuseBoardNav : []};
				createData.IWerks = oData.Werks;
				createData.IOrgeh = oData.Orgeh;
				createData.IZyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm");
				createData.IEmpid = $.app.getModel("session").getData().Pernr;
				createData.IDisty = "3";
				createData.IActty = gAuth;
				
				switch(oId){
					case "Cur01": // 경영관리직
					case "Cum01":
						createData.IZhgrade = "02";
						break;
					case "Cur02": // 연구전문직
					case "Cum02":
						createData.IZhgrade = "03";
						break;
					case "Cur03": // 사무지원직
					case "Cum03":
						createData.IZhgrade = "05";
						break;
					case "Cur04": // 전문직
					case "Cum04":
						createData.IZhgrade = "06";
						break;
					case "Cur05": // 기타
					case "Cum05":
						createData.IZhgrade = "99";
						break;
					default:
				}
				
			var field = ["Crecnt", "Curcnt", "Currte", "Usecnt", "Userte", "Balcnt"];
			
			oModel.create("/LeaveUseBoardSet", createData, {
				success: function(data, res){
					if(data){
						if(data.LeaveuseBoardNav && data.LeaveuseBoardNav.results){
							for(var i=0; i<data.LeaveuseBoardNav.results.length; i++){
								data.LeaveuseBoardNav.results[i].Idx = i+1;
								
								for(var j=0; j<field.length; j++){
									eval("data.LeaveuseBoardNav.results[i]." + field[j] + 
											" = parseFloat(data.LeaveuseBoardNav.results[i]." + field[j] + ") == 0 ? '-' : parseFloat(data.LeaveuseBoardNav.results[i]." + field[j] + ");");
								}
								
								if(i == data.LeaveuseBoardNav.results.length - 1){
									data.LeaveuseBoardNav.results[i].Idx = "";
									data.LeaveuseBoardNav.results[i].Orgeh = "";
									data.LeaveuseBoardNav.results[i].Pernr = "";
									data.LeaveuseBoardNav.results[i].Ename = "";
								}
								
								vData.Data.push(data.LeaveuseBoardNav.results[i]);
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
			oTable.setVisibleRowCount((vData.Data.length >= 10 ? 10 : vData.Data.length));
			oTable.setFixedBottomRowCount(1);
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
			
			oController._DetailDialog.open();
		},
		
		onPressPersDetail : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			if(oData.Orgeh == "" && oData.Pernr == "") return;
			
			var oId = oEvent.getSource().getCustomData()[1].getValue();
			
			if(!oController._PersDetailDialog){
				oController._PersDetailDialog = sap.ui.jsfragment("ZUI5_HR_LeaveUseChart.fragment.PersDetail", oController);
				oView.addDependent(oController._PersDetailDialog);
			}
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_PersDetailTable");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			// filter, sort 제거
			var oColumn = oTable.getColumns();
			for(var i=0; i<oColumn.length; i++){
				oColumn[i].setFiltered(false);
				oColumn[i].setSorted(false);
			}
			
			var oZyymm = "", oDisty = "";
			if(oController._ListCondJSonModel.getProperty("/Data/Disty") == "2"){
				oZyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm").substring(0,4) + (oId == "Usecnt" ? "12" : oId.substring(6,8));
				oDisty = (oId == "Usecnt" ? "2" : "1");
			} else {
				oZyymm = oController._ListCondJSonModel.getProperty("/Data/Zyymm").substring(0,4) + 
						 (oId == "Curcnt" || oId == "Currte" ? oController._ListCondJSonModel.getProperty("/Data/Zyymm").replace(".", "").substring(4,6) : "12");
				oDisty = (oId == "Curcnt" || oId == "Currte" ? "1" : "2");
			}
			
			var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
			var createData = {PersLeaveuseListNav : []};
				createData.IWerks = oData.Werks;
				createData.IBukrs = oData.Werks;
				createData.IZyymm = oZyymm;
				createData.IDisty = oDisty;
				createData.IPernr = oData.Pernr;
			
			oModel.create("/PersLeaveUseListSet", createData, {
				success: function(data, res){
					if(data){
						if(data.PersLeaveuseListNav && data.PersLeaveuseListNav.results){
							for(var i=0; i<data.PersLeaveuseListNav.results.length; i++){
								data.PersLeaveuseListNav.results[i].Idx = i+1;

								data.PersLeaveuseListNav.results[i].Datum = data.PersLeaveuseListNav.results[i].Datum ? new Date(common.Common.setTime(data.PersLeaveuseListNav.results[i].Datum)) : null;
								
								data.PersLeaveuseListNav.results[i].Beguz = data.PersLeaveuseListNav.results[i].Beguz == "" ? data.PersLeaveuseListNav.results[i].Beguz : 
																				data.PersLeaveuseListNav.results[i].Beguz.substring(0,2) + ":" + data.PersLeaveuseListNav.results[i].Beguz.substring(2,4);
								data.PersLeaveuseListNav.results[i].Enduz = data.PersLeaveuseListNav.results[i].Enduz == "" ? data.PersLeaveuseListNav.results[i].Enduz : 
																				data.PersLeaveuseListNav.results[i].Enduz.substring(0,2) + ":" + data.PersLeaveuseListNav.results[i].Enduz.substring(2,4);
								
								// if(i == data.PersLeaveuseListNav.results.length - 1){
								// 	data.PersLeaveuseListNav.results[i].Idx = "";
								// 	data.PersLeaveuseListNav.results[i].Orgeh = "";
								// 	data.PersLeaveuseListNav.results[i].Pernr = "";
								// 	data.PersLeaveuseListNav.results[i].Ename = "";
								// }
								
								vData.Data.push(data.PersLeaveuseListNav.results[i]);
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
			oTable.setVisibleRowCount((vData.Data.length >= 10 ? 10 : vData.Data.length));
			// oTable.setFixedBottomRowCount(1);
			
			oController._PersDetailDialog.open();
		},
		
		onExport : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			
			var filename = "";
			if(oController._ListCondJSonModel.getProperty("/Data/Disty") == "1"){
				filename = oBundleText.getText("LABEL_41039"); // 부서별 연차사용현황
			} else {
				filename = oBundleText.getText("LABEL_41040"); // 개인별 연차사용현황
			}
			
			var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: filename + ".xlsx"
			};
	
			var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
				oSpreadsheet.build();		
		},
		
		// 대상자 검색
		onSearchUser : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
			SearchUser1.oController = oController;
            SearchUser1.dialogContentHeight = 480;

            if (!oController.oAddPersonDialog) {
                oController.oAddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
                oView.addDependent(oController.oAddPersonDialog);
            }

            oController.oAddPersonDialog.open();
		},
		
		// 소속부서 검색
		displayMultiOrgSearchDialog : function (oEvent) {
        	var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
				SearchOrg.oController = oController;
	            SearchOrg.vCallControlId = oEvent.getSource().getId();
	            
			if(oEvent.getSource().getId() == oController.PAGEID + "_Orgeh"){
	            SearchOrg.vActionType = "Single";
	            SearchOrg.vCallControlType = "MultiInput";
			} else {
	            SearchOrg.vActionType = "Multi";
	            SearchOrg.vCallControlType = "MultiInput";
			}

            if (!oController.oOrgSearchDialog) {
               oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
               oView.addDependent(oController.oOrgSearchDialog);
            }

            oController.oOrgSearchDialog.open();
        },
        
        // 대상자 선택
        onESSelectPerson : function(data){
        	var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
			var oJSONModel = oTable.getModel();
			var oIndices = oTable.getSelectedIndices();
			
			if(oIndices.length == 0){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02050")); // 대상자를 선택해 주시기 바랍니다.
				return;
			} else if(oIndices.length != 1){
				sap.m.MessageBox.error(oBundleText.getText("MSG_00068")); // 대상자를 한명만 선택하여 주십시오.
				return;
			}
			
			var oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename");
				oEname.destroyTokens();
			
			for(var i=0; i<oIndices.length; i++){
				var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
				var detail = oJSONModel.getProperty(sPath);
				
				oEname.addToken(
					new sap.m.Token({
						key : detail.Pernr,
						text : detail.Ename
					})
				);
			}
			
			oController.oAddPersonDialog.close();
        },
		
		handleIconTabBarSelect : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
			var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
		},
		
		onTableSort : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oEvent.getParameters().id);
			var oData = oTable.getModel().getProperty("/Data");
			var total = oData[oData.length-1];
			
			var oColumn = oEvent.getParameters().column;
			var oSortOrder = oEvent.getParameters().sortOrder;
			
			oEvent.preventDefault();
			for(var i=0; i<oTable.getColumns().length; i++){
				oTable.getColumns()[i].setSorted(false);
			}
			
			oColumn.setSorted(true);
			oColumn.setSortOrder(oSortOrder);
			
			var newData = [];
			for(var i=0; i<oData.length-1; i++){
				newData.push(oData[i]);
			}
			
			newData.sort(function(a,b){
				var item1 = eval("a." + oColumn.getSortProperty());
				var item2 = eval("b." + oColumn.getSortProperty());
				
					item1 = item1 == "-" ? 0 : item1;
					item2 = item2 == "-" ? 0 : item2;
				
				if(oEvent.getParameters().sortOrder == "Ascending"){
					if(item1 > item2){
						return 1;
					} else if(item1 < item2){
						return -1;
					} else {
						return 0;
					}
					
				} else {
					if(item1 > item2){
						return -1;
					} else if(item1 < item2){
						return 1;
					} else {
						return 0;
					}
				}
			});
			
			newData.push(total);
			
			oTable.getModel().setData({Data : newData});
			oTable.bindRows("/Data");
		},
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_LeaveUseChart.List");
			var oController = oView.getController();
			
			var initData = {
                Percod: $.app.getModel("session").getData().Percod,
                Bukrs: $.app.getModel("session").getData().Bukrs2,
                Langu: $.app.getModel("session").getData().Langu,
                Molga: $.app.getModel("session").getData().Molga,
                Datum: new Date(),
                Mssty: ($.app.APP_AUTH == "M" ? $.app.APP_AUTH : "")
            },
            callback = function(o) {
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
		
		/**
         * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
         */
		displayMultiOrgSearchDialog: function (oEvent) {
			SearchOrg.oController = this.oController;
			SearchOrg.vActionType = "Multi";
			SearchOrg.vCallControlId = oEvent.getSource().getId();
			SearchOrg.vCallControlType = "MultiInput";

			if (!this.oOrgSearchDialog) {
				this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this.oController);
				$.app.getView().addDependent(this.oOrgSearchDialog);
			}

			this.oOrgSearchDialog.open();
		},

		onESSelectPerson : function(data){
			var oController = $.app.getController();

			oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
			oController._ListCondJSonModel.setProperty("/Data/Pernr", data.Pernr);
			oController._ListCondJSonModel.setProperty("/Data/Ename", data.Ename);

			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20125009"});
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});