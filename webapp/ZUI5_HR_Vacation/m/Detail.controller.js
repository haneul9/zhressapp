jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
    "common/OrgOfIndividualHandler",
    "common/DialogHandler",
	"common/ApprovalLinesHandler"], 
	function (Common, CommonController, JSONModelHelper, OrgOfIndividualHandler, DialogHandler, ApprovalLinesHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Vacation.m.Detail", {

		PAGEID: "ZUI5_HR_VacationDetail",
		_BusyDialog : new sap.m.BusyDialog(),
		_DetailJSonModel : new sap.ui.model.json.JSONModel(),
		_Extryn : "",
		
		EmployeeSearchCallOwner: null,

		getApprovalLinesHandler: function() {
			return this.ApprovalLinesHandler;
		},

		onESSelectPerson: function(data) {
			return this.EmployeeSearchCallOwner 
					? this.EmployeeSearchCallOwner.setSelectionTagets(data)
					: null;
		},

		displayMultiOrgSearchDialog: function(oEvent) {
			return $.app.getController().EmployeeSearchCallOwner 
					? $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent)
					: null;
		},

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
			
			this._Extryn = Common.isExternalIP() === true ? "X" : "";
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
		
			var oData = {
				Data : {
					FromPageId : oEvent.data.FromPageId,
					Status1 : oEvent.data.Status1,
					ListStatus : oEvent.data.Status1,
					Bukrs : oController.getSessionInfoByKey("Bukrs3"),
					Persa : oController.getSessionInfoByKey("Werks"),
					Pernr : (oEvent.data.Pernr ? oEvent.data.Pernr : oController.getSessionInfoByKey("Pernr")),
					Flag : (oEvent.data.Flag ? oEvent.data.Flag : ""),
					Molga : oController.getSessionInfoByKey("Molga"),
					Langu : oController.getSessionInfoByKey("Langu"),
					Delapp : oEvent.data.Delapp ? oEvent.data.Delapp : ""
				}
			};
			
			if(oEvent.data.Status1 != ""){
				oData.Data.Begda = oEvent.data.Begda;
				oData.Data.Endda = oEvent.data.Endda;
				oData.Data.Awart = oEvent.data.Awart;
				oData.Data.Subty = oEvent.data.Subty;
				oData.Data.Pernr = oEvent.data.Pernr;
				oData.Data.Delapp = oEvent.data.Delapp;
				oData.Data.Seqnr = oEvent.data.Seqnr;
				oData.Data.Sprps = oEvent.data.Sprps;
			}
			
			if(oEvent.data.Delapp != ""){
				oData.Data.ListAppkey = oEvent.data.Appkey;
				oData.Data.ListAppkey1 = oEvent.data.Appkey1;
			}
			
			oController._DetailJSonModel.setData(oData);
			oController.onPressSearch(oEvent);
		},
		
		onAfterShow: function(){
			
		},
		
		onBack : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_Vacation.m.Detail",
			    	  Data : {}
			      }
			});
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // ????????? ?????????????????????.
				oEvent.getSource().setValue("");
				return;
			}
			
			// ????????????, ???????????? ?????????
			oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
			oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
			oController._DetailJSonModel.setProperty("/Data/Holyt", "");
			// ???????????? ????????????
			oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
		},
		
		onChangeTime2 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48017")); // ????????? ?????????????????????.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel2 = oTable2.getModel();
			var vData2 = {Data : []};
			
			var oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3");
			var oJSONModel3 = oTable3.getModel();
			var vData3 = {Data : []};
			
			var search = function(){
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var oData = oController._DetailJSonModel.getProperty("/Data");
				
				if(oData.Status1 == ""){
					// ???????????? ????????????
					oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
				} else {
					// ????????? ??????
					var createData = {VacationApply1Nav : [], VacationApply2Nav : []};
						createData.IEmpid = oData.Pernr;
						createData.IBukrs = oData.Bukrs;
						createData.ILangu = oController.getSessionInfoByKey("Langu");
						createData.IMolga = oData.Molga;
						createData.IDatum = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
						createData.IConType = "1";
						
					var detail = {};
						detail.Pernr = oData.Pernr;
						detail.Begda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
						detail.Endda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
						detail.Awart = oData.Awart;
						detail.Subty = oData.Subty; 
						detail.Seqnr = oData.Seqnr;
						detail.Sprps = oData.Sprps;
						
						createData.VacationApply1Nav.push(detail);
						
					oModel.create("/VacationApplySet", createData, {
						success: function(data){
							if(data){
								// ????????????
								if(data.VacationApply1Nav && data.VacationApply1Nav.results){
									var data1 = data.VacationApply1Nav.results[0];
									
									if(data1){
										var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
										
										data1.Begda = dateFormat.format(data1.Begda);
										data1.Endda = dateFormat.format(data1.Endda);
										
										data1.Kaltg = parseFloat(data1.Kaltg) == 0 ? "" : parseFloat(data1.Kaltg);
										data1.Hldtg = parseFloat(data1.Hldtg) == 0 ? "" : parseFloat(data1.Hldtg);
										data1.Kjdate = parseFloat(data1.Kjdate) == 0 ? "" : parseFloat(data1.Kjdate);
										
										if(data1.Holyt != ""){
											data1.Holyt = "(" + data1.Holyt + ")";              
										} else {
											data1.Holyt = "";
										}
										
										oController._DetailJSonModel.setProperty("/Data", Object.assign(oController._DetailJSonModel.getProperty("/Data"), data1));
									} else {
										sap.m.MessageBox.error(oController.getBundleText("MSG_48015"), { // ????????? ?????? ??? ????????? ?????????????????????.
											onClose : oController.onBack
										});
										return;
									}
								}
								
								// ????????????
								if(data.VacationApply2Nav && data.VacationApply2Nav.results){
									var data2 = data.VacationApply2Nav.results;
									
									if(data2.length == 0){
										oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
									} else {
										oController._DetailJSonModel.setProperty("/Data/Panel2Visible", true);
										
										for(var i=0; i<data2.length; i++){
											data2[i].Idx = i;
											data2[i].Datum = new Date(common.Common.getTime(data2[i].Datum));
											
											data2[i].Awper = parseFloat(data2[i].Awper) == 0 ? "" : data2[i].Awper;
											
											data2[i].Ovtim = parseFloat(data2[i].Ovtim) == 0 ? "-" : data2[i].Ovtim;
											data2[i].Wt40 = parseFloat(data2[i].Wt40) == 0 ? "-" : data2[i].Wt40;
											data2[i].Wt12 = parseFloat(data2[i].Wt12) == 0 ? "-" : data2[i].Wt12;
											data2[i].Wtsum = parseFloat(data2[i].Wtsum) == 0 ? "-" : data2[i].Wtsum;
											
											if(data2[i].Offck == "X"){
												data2[i].Status1 = "ZZ";
											} else {
												data2[i].Status1 = oController._DetailJSonModel.getProperty("/Data/Status1");
											}
											
											data2[i].Flag = data2[i].Flag == "" ? "X" : data2[i].Flag;
											
											vData2.Data.push(data2[i]);
										}
										
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
					
					oJSONModel2.setData(vData2);

					if(oController.Error == "E"){
						oController._BusyDialog.close();
						oController.Error = "";
						sap.m.MessageBox.error(oController.ErrorMessage, {
							onClose : oController.onBack
						});
						return;
					}
				}
				
				// 2021-05-11 ????????? ????????? ??????
				// 2021-06-15 ?????? ?????? ??????
				oData = oController._DetailJSonModel.getProperty("/Data");
				// var oRow = sap.ui.getCore().byId(oController.PAGEID + "_AppNameRow");
				// var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
				// 	oAppName.destroyItems();
				// 	oAppName.setValue("");
				
				// var oModel2 = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
				// var createData2 = {ApprlistNav : []};
				// 	createData2.IPernr = oData.Pernr;
				// 	createData2.IExtryn = oController._Extryn;
				// 	createData2.IZappSeq = "11";
				// 	createData2.IBukrs = oData.Bukrs;
				// 	createData2.IMobyn = "X";
				// 	createData2.IAppkey = (oData.Appkey ? oData.Appkey : "");
	
				// if(oData.Status1 == "" || oData.Status1 == "AA" || oData.Status1 == "JJ"){
				// 	createData2.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
				// 	createData2.IPrcty = "1";
				// } else {
				// 	createData2.IDatum = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
				// 	createData2.IPrcty = "2";
				// }
	
				// oModel2.create("/ApprListSet", createData2, {
				// 	success: function(data, res){
				// 		if(data){
				// 			if(data.ApprlistNav && data.ApprlistNav.results){
				// 					var data1 = data.ApprlistNav.results;
									
				// 					if(data1){
				// 						for(var i=0; i<data1.length; i++){
				// 							oAppName.addItem(
				// 								new sap.ui.core.Item({
				// 									key : data1[i].AppName,
				// 									text : data1[i].AppText
				// 								})
				// 							);
	
				// 							if(data1[i].Defyn == "X"){
				// 								oController._DetailJSonModel.setProperty("/Data/AppName", data1[i].AppName);
				// 							}
				// 						}
				// 					}
				// 				}
				// 		}
				// 	},
				// 	error: function (oError) {
				// 		var Err = {};
				// 		oController.Error = "E";
								
				// 		if (oError.response) {
				// 			Err = window.JSON.parse(oError.response.body);
				// 			var msg1 = Err.error.innererror.errordetails;
				// 			if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
				// 			else oController.ErrorMessage = Err.error.message.value;
				// 		} else {
				// 			oController.ErrorMessage = oError.toString();
				// 		}
				// 	}
				// });
	
				// if(oController.Error == "E"){
				// 	oController.Error = "";
				// 	sap.m.MessageBox.error(oController.ErrorMessage);
				// }
	
				// // ???????????? ???????????? ????????? ????????? row??? invisible ????????????.
				// if(oAppName.getItems().length == 0){
				// 	oController._DetailJSonModel.setProperty("/Data/AppName", "");
				// 	oRow.addStyleClass("displayNone");
				// } else {
				// 	oRow.removeStyleClass("displayNone");
				// }	
				
				// ???????????? ?????????
				var oAwart = sap.ui.getCore().byId(oController.PAGEID + "_Awart");
					oAwart.destroyItems();
				var createData = {VacationTypeNav : []};
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IMolga = oData.Molga;
				
				oModel.create("/VacationTypePeSet", createData, {
					success: function(data){
						if(data){
							if(data.VacationTypeNav && data.VacationTypeNav.results){
								for(var i=0; i<data.VacationTypeNav.results.length; i++){   
									// 2021-05-21 ???????????? ???????????? ???????????? ??????
									if(data.VacationTypeNav.results[i].Subty == "1615" || data.VacationTypeNav.results[i].Subty == "1LA1"){
										continue;
									}
									
									oAwart.addItem(
										new sap.ui.core.Item({
											key : data.VacationTypeNav.results[i].Subty,
											text : data.VacationTypeNav.results[i].Stext,
											customData : [new sap.ui.core.CustomData({key : "", value : data.VacationTypeNav.results[i]})]
										})
									);
									
									if(oData && oData.Awart != ""){
										if(oData.Awart == data.VacationTypeNav.results[i].Subty){
											oController._DetailJSonModel.setProperty("/Data/Halfc", data.VacationTypeNav.results[i].Halfc);
										}
									}
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
				
				if(oController.Error == "E"){
					oController._BusyDialog.close();
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				// ????????? ?????? ??? ??????????????? ?????? ?????? ??????
				if(oData.Status1 != ""){
					oController.onChangeAwart();
				}
				
				// ??????????????????
				var createData2 = {VacationQuotaNav : []};
					createData2.IPernr = oData.Pernr;
					createData2.IBukrs = oData.Bukrs;
					createData2.ILangu = oData.Langu;
					createData2.IMolga = oData.Molga;
					createData2.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
					createData2.ICorre = "X";
		
				oModel.create("/VacationQuotaSet", createData2, {
					success: function(data){
						if(data){
							if(data.VacationQuotaNav && data.VacationQuotaNav.results){
								for(var i=0; i<data.VacationQuotaNav.results.length; i++){   
									
									data.VacationQuotaNav.results[i].Anzhl = parseFloat(data.VacationQuotaNav.results[i].Anzhl);
									data.VacationQuotaNav.results[i].Kverb = parseFloat(data.VacationQuotaNav.results[i].Kverb);
									data.VacationQuotaNav.results[i].Reman = parseFloat(data.VacationQuotaNav.results[i].Reman);
									
									vData3.Data.push(data.VacationQuotaNav.results[i]);
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
				
				oJSONModel3.setData(vData3);
			
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				oController._BusyDialog.close();
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 50);
		},
		
		// ???????????? ??????
		onChangeAwart : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
						
			var oMessage = sap.ui.getCore().byId(oController.PAGEID + "_MessageRow");
				oMessage.addStyleClass("displayNone");
			
			if(oEvent){
				oController._DetailJSonModel.setProperty("/Data/Half", "");
				// ????????????, ???????????? ?????????
				oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
				oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
				oController._DetailJSonModel.setProperty("/Data/Holyt", "");
				// ???????????? ????????????
				oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
				// ???????????? ?????????
				oController._DetailJSonModel.setProperty("/Data/Beguz", "");
				oController._DetailJSonModel.setProperty("/Data/Enduz", "");
			}
			
			if(oController._DetailJSonModel.getProperty("/Data/Awart")){
				var oData = oController._DetailJSonModel.getProperty("/Data");
				
				if(oEvent){
					var vData = oEvent.getSource().getSelectedItem().getCustomData()[0].getValue();
					
					oController._DetailJSonModel.setProperty("/Data/Halfc", vData.Halfc);
					
					// ????????????
					if(vData.Congt == "X"){
						oController._DetailJSonModel.setProperty("/Data/Kjdate", vData.Maxtg);
					} else {
						oController._DetailJSonModel.setProperty("/Data/Kjdate", "");
					}
					
					// ??????????????????
					oController._DetailJSonModel.setProperty("/Data/Encard", "");
				}
				
				switch(oData.Awart){
					case "1511": // ????????????, ?????????????????? ?????? ???????????? ?????? ????????? ??????
					case "1GF":
						oMessage.removeStyleClass("displayNone");
						break;
					case "1700": // ???????????? ?????? ??? ????????? ??????
					case "1705":
					case "1715":
					case "1720":
						sap.m.MessageBox.information(oController.getBundleText("MSG_48004"), { // ?????????????????? '????????????'?????? ??????????????? ?????????. ??????????????? ?????? ???????????????.
							title : oController.getBundleText("LABEL_00149")
						});
						break;
					case "1424": // ??????(???????????????) ?????? ??? ?????????????????? ????????? ??????
						var oEncard = sap.ui.getCore().byId(oController.PAGEID + "_Encard");
							oEncard.destroyItems();
							
						var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
						var createData = {BztrCodeListNav : []};
							createData.IPernr = oData.Pernr;
							createData.IBukrs = oData.Bukrs;
							createData.ILangu = oController.getSessionInfoByKey("Langu");
							createData.IMolga = oData.Molga;
							createData.IInpType = "04";
						
						oModel.create("/BztrCodeTextSet", createData, {
							success: function(data){
								if(data){
									if(data.BztrCodeListNav && data.BztrCodeListNav.results){
										for(var i=0; i<data.BztrCodeListNav.results.length; i++){   
											oEncard.addItem(
												new sap.ui.core.Item({
													key : data.BztrCodeListNav.results[i].Code,
													text : data.BztrCodeListNav.results[i].Text
												})
											);
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
						
						if(oController.Error == "E"){
							oController.Error = "";
							sap.m.MessageBox.error(oController.ErrorMessage);
						}

						break;
					default:
				}
			} else {
				oController._DetailJSonModel.setProperty("/Data/Halfc", "");
			}
		},
		
		onChangeHalf : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
		
			var oAwart = sap.ui.getCore().byId(oController.PAGEID + "_Awart");
			var vData = oAwart.getSelectedItem().getCustomData()[0].getValue();
			
			if(vData == undefined){
				vData = {Beguz1 : "",
						 Enduz1 : "",
						 Beguz2 : "",
						 Enduz2 : ""};
			}
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			// ????????????, ???????????? ?????????
			oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
			oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
			oController._DetailJSonModel.setProperty("/Data/Holyt", "");
			// ???????????? ????????????
			oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
		
			if(oData.Halfc == "X"){
				if(oData.Half == "1"){ // ??????
					oController._DetailJSonModel.setProperty("/Data/Beguz", vData.Beguz1);
					oController._DetailJSonModel.setProperty("/Data/Enduz", vData.Enduz1);
				} else if(oData.Half == "2"){ // ??????
					oController._DetailJSonModel.setProperty("/Data/Beguz", vData.Beguz2);
					oController._DetailJSonModel.setProperty("/Data/Enduz", vData.Enduz2);
				} else {
					oController._DetailJSonModel.setProperty("/Data/Beguz", "");
					oController._DetailJSonModel.setProperty("/Data/Enduz", "");
				}
			} else {
				oController._DetailJSonModel.setProperty("/Data/Beguz", "");
				oController._DetailJSonModel.setProperty("/Data/Enduz", "");
			}
		},
		
		// ???????????? - ??????
		onPressOvertimePe : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			// validation check
			if(!oData.Awart || oData.Awart == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48005")); // ??????????????? ???????????? ????????????.
				return;
			} else if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48006")); // ??????????????? ???????????? ????????????.
				return;
			} else if(oData.Begda > oData.Endda){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48018")); // ???????????? ????????? ???????????????. ????????? ???????????? ????????????.
				return;
			}
			
			var search = function(){
				// ????????????, ???????????? ?????????
				oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
				oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
				oController._DetailJSonModel.setProperty("/Data/Holyt", "");
				// ???????????? ????????????
				oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
				
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var createData = {OvertimePe1Nav : [], OvertimePe2Nav : []};
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/"; 
					createData.IAwart = oData.Awart;
				
				oModel.create("/OvertimePeSet", createData, {
					success: function(data){
						if(data){
							// ????????????
							oController._DetailJSonModel.setProperty("/Data/Kaltg", (parseFloat(data.EKaltg) + ""));
							
							// ????????????
							oController._DetailJSonModel.setProperty("/Data/Hldtg", (parseFloat(data.EAbwtg) + ""));
							
							if(data.OvertimePe1Nav && data.OvertimePe1Nav.results){
								var data1 = data.OvertimePe1Nav.results;
								
								var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
								var oHolyt = "";
								
								for(var i=0; i<data1.length; i++){
									if(i==0){
										oHolyt = "(";
									} else {
										oHolyt += ", ";
									}
									
									oHolyt += dateFormat.format(new Date(common.Common.getTime(data1[i].Mldda)));
								}
								
								oHolyt = (oHolyt == "" ? "" : oHolyt + ")");
								
								oController._DetailJSonModel.setProperty("/Data/Holyt", oHolyt);
							}
							
							if(data.OvertimePe2Nav && data.OvertimePe2Nav.results){
								var data2 = data.OvertimePe2Nav.results;
								if(data2.length > 0){ // ???????????? ?????????
									oController._DetailJSonModel.setProperty("/Data/Panel2Visible", true);
									
									var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
									var oJSONModel = oTable.getModel();
									var vData = {Data : []};
									
									for(var i=0; i<data2.length; i++){
										data2[i].Idx = i;
										data2[i].Datum = new Date(common.Common.getTime(data2[i].Datum));
										data2[i].Flag = "A";
										
										data2[i].Awper = parseFloat(data2[i].Awper) == 0 ? "" : data2[i].Awper;
										
										data2[i].Ovtim = parseFloat(data2[i].Ovtim) == 0 ? "-" : data2[i].Ovtim;
										data2[i].Wt40 = parseFloat(data2[i].Wt40) == 0 ? "-" : data2[i].Wt40;
										data2[i].Wt12 = parseFloat(data2[i].Wt12) == 0 ? "-" : data2[i].Wt12;
										data2[i].Wtsum = parseFloat(data2[i].Wtsum) == 0 ? "-" : data2[i].Wtsum;
										
										if(data2[i].Offck == "X"){
											data2[i].Status1 = "ZZ";
										} else {
											data2[i].Status1 = oController._DetailJSonModel.getProperty("/Data/Status1");
										}
										
										vData.Data.push(data2[i]);
									}
									
									oJSONModel.setData(vData);
									
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
		
		// ???????????? - ??????
		onPressCheckAbsence : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			// validation check
			if(!oData.Awart || oData.Awart == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48005")); // ??????????????? ???????????? ????????????.
				return;
			} else if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48006")); // ??????????????? ???????????? ????????????.
				return;
			} else if(oData.Begda > oData.Endda){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48018")); // ???????????? ????????? ???????????????. ????????? ???????????? ????????????.
				return;
			} 
				
			var search = function(){
				// ????????????, ???????????? ?????????
				oController._DetailJSonModel.setProperty("/Data/Kaltg", "");
				oController._DetailJSonModel.setProperty("/Data/Hldtg", "");
				oController._DetailJSonModel.setProperty("/Data/Holyt", "");
				// ???????????? ????????????
				oController._DetailJSonModel.setProperty("/Data/Panel2Visible", false);
				// ?????????????????? ?????????
				oController._DetailJSonModel.setProperty("/Data/EAbshr", "");
				oController._DetailJSonModel.setProperty("/Data/EAbsmm", "");
				
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var createData = {ChkAbsenceNav : [], ChkAbsence2Nav : []};
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/"; 
					createData.IAwart = oData.Awart;
					createData.IBeguz = oData.Beguz;
					createData.IEnduz = oData.Enduz;
					createData.IVtken = oData.Vtken ? oData.Vtken : false;
				
				oModel.create("/CheckAbsenceSet", createData, {
					success: function(data){
						if(data){
							// ????????????
							oController._DetailJSonModel.setProperty("/Data/Kaltg", (parseFloat(data.EKaltg) + ""));
							
							// ????????????
							oController._DetailJSonModel.setProperty("/Data/Hldtg", (parseFloat(data.EAbwtg) + ""));
							
							// ????????????????????????
							if(data.EAbshr == "00" && data.EAbsmm == "00"){
								// Empty block
							} else {
								oController._DetailJSonModel.setProperty("/Data/EAbshr", data.EAbshr);
								oController._DetailJSonModel.setProperty("/Data/EAbsmm", data.EAbsmm);
							}
							
							if(data.ChkAbsence2Nav && data.ChkAbsence2Nav.results){
								var data1 = data.ChkAbsence2Nav.results;
								
								var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
								var oHolyt = "";
								
								for(var i=0; i<data1.length; i++){
									if(i==0){
										oHolyt = "(";
									} else {
										oHolyt += ", ";
									}
									
									oHolyt += dateFormat.format(new Date(common.Common.getTime(data1[i].Mldda)));
								}
								
								oHolyt = (oHolyt == "" ? "" : oHolyt + ")");
								
								oController._DetailJSonModel.setProperty("/Data/Holyt", oHolyt);
							}
							
							if(data.ChkAbsenceNav && data.ChkAbsenceNav.results){
								var data2 = data.ChkAbsenceNav.results;
								if(data2.length > 0){ // ???????????? ?????????
									oController._DetailJSonModel.setProperty("/Data/Panel2Visible", true);
									
									var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
									var oJSONModel = oTable.getModel();
									var vData = {Data : []};
									
									for(var i=0; i<data2.length; i++){
										data2[i].Idx = i;
										data2[i].Datum = new Date(common.Common.getTime(data2[i].Datum));
										data2[i].Flag = "A";
										
										data2[i].Awper = parseFloat(data2[i].Awper) == 0 ? "" : data2[i].Awper;
										
										data2[i].Ovtim = parseFloat(data2[i].Ovtim) == 0 ? "-" : data2[i].Ovtim;
										data2[i].Wt40 = parseFloat(data2[i].Wt40) == 0 ? "-" : data2[i].Wt40;
										data2[i].Wt12 = parseFloat(data2[i].Wt12) == 0 ? "-" : data2[i].Wt12;
										data2[i].Wtsum = parseFloat(data2[i].Wtsum) == 0 ? "-" : data2[i].Wtsum;
										
										if(data2[i].Offck == "X"){
											data2[i].Status1 = "ZZ";
										} else {
											data2[i].Status1 = oController._DetailJSonModel.getProperty("/Data/Status1");
										}
										
										vData.Data.push(data2[i]);
									}
									
									oJSONModel.setData(vData);
									
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
		
		// ????????????
		onPressVacationCover : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			var vData = oController._DetailJSonModel.getProperty("/Data");
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel = oTable.getModel();
			var oData = oJSONModel.getProperty("/Data");
			var oData2 = {Data : []};
			
			// validation check
			for(var i=0; i<oData.length; i++){
				if(oData[i].Offck == "" && oData[i].Cntgb != "0"){
					if(!oData[i].Awper || oData[i].Awper == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48002")); // ???????????? ?????? ??????????????????.
						return;
					} else if(!oData[i].Beguz || !oData[i].Enduz){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48014")); // OT????????? ???????????? ????????????.
						return;
					}
				}
			}
			
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var createData = {VacationCovNav : []};
					createData.IProType = "2";
					createData.IPernr = vData.Pernr;
					createData.IAwart = vData.Awart;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(vData.Begda)) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(vData.Endda)) + ")\/"; 
					createData.IBukrs = vData.Bukrs;
					createData.IMolga = vData.Molga;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					
				for(var i=0; i<oData.length; i++){
					var detail = {};
						detail.Datum = "\/Date(" + common.Common.getTime(new Date(oData[i].Datum)) + ")\/"; 
						detail.Offck = oData[i].Offck;
						detail.Awper = oData[i].Awper;
						detail.Awtxt = oData[i].Awtxt;
						detail.Beguz = oData[i].Beguz;
						detail.Enduz = oData[i].Enduz;
						detail.Cntgb = oData[i].Cntgb;
						detail.Flag = oData[i].Flag;
						
					createData.VacationCovNav.push(detail);
				}
				
				oModel.create("/VacationCoverSet", createData, {
					success: function(data){
						if(data){
							if(data.VacationCovNav && data.VacationCovNav.results){
								var datas = data.VacationCovNav.results;
								
								for(var i=0; i<datas.length; i++){
									datas[i].Idx = i;
									datas[i].Datum = new Date(common.Common.getTime(datas[i].Datum));
									
									datas[i].Ovtim = parseFloat(datas[i].Ovtim) == 0 ? "-" : datas[i].Ovtim;
									datas[i].Wt40 = parseFloat(datas[i].Wt40) == 0 ? "-" : datas[i].Wt40;
									datas[i].Wt12 = parseFloat(datas[i].Wt12) == 0 ? "-" : datas[i].Wt12;
									datas[i].Wtsum = parseFloat(datas[i].Wtsum) == 0 ? "-" : datas[i].Wtsum;
									
									if(datas[i].Offck == "X"){
										datas[i].Status1 = "ZZ";
									} else {
										datas[i].Status1 = oController._DetailJSonModel.getProperty("/Data/Status1");
									}
									
									oData2.Data.push(datas[i]);
								}
								
							}
							
							oJSONModel.setData(oData2);
							
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
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_48001"), { // ???????????? ???????????????????
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
			
		},
		
		onChangeCntgb : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oJSONModel = oTable.getModel();
			var oData = oJSONModel.getProperty("/Data");
		
			var vData = oEvent.getSource().getCustomData()[0].getValue();
			
			// ?????? ?????? ??? ???????????? ????????? ?????????
			oJSONModel.setProperty("/Data/" + vData.Idx + "/Ligbn", "");
			oJSONModel.setProperty("/Data/" + vData.Idx + "/LigbnTx", "");
			
			if(vData.Cntgb == "2"){ // 2??? ?????? ??? ????????? ?????? ?????????
				var oNewData = {Data : []};
				
				var tmp = "";
				for(var i=0; i<oData.length; i++){
					var detail = Object.assign(oData[i]);
						detail.Idx = oNewData.Data.length;
					oNewData.Data.push(detail);
					
					if(tmp == "" && (oData[i].Idx == vData.Idx)){
						tmp = "X";
						
						var detail2 = {};
							detail2.Idx = oNewData.Data.length;
							detail2.Datum = oData[i].Datum;
							detail2.Offck = oData[i].Offck;
							detail2.Awtxt = "";
							detail2.Awper = "";
							detail2.Beguz = oData[i].Beguz;
							detail2.Enduz = oData[i].Enduz;
							detail2.Ovtim = "";
							detail2.Wt40 = "";
							detail2.Wt12 = "";
							detail2.Wtsum = "";
							detail2.Ligbn = "";
							detail2.LigbnTx = "";
							detail2.Cntgb = "";
							detail2.Flag = "X";
							detail2.Status1 = oData[i].Status1;
						oNewData.Data.push(detail2);
					}
				}
				
				oJSONModel.setData(oNewData);
			} else {
				if(vData.Cntgb == "0"){ // ?????? ?????? ??? ?????? ?????? ????????? clear
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Awtxt", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Awper", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Beguz", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Enduz", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Ovtim", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Wt40", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Wt12", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Wtsum", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/Ligbn", "");
					oJSONModel.setProperty("/Data/" + vData.Idx + "/LigbnTx", "");
				}
				
				// ????????? ????????? ?????? ????????? Flag ??? X??? ?????? ?????????
				if(oJSONModel.getProperty("/Data/" + (vData.Idx + 1) + "/Flag") == "X"){
					var oNewData = {Data : []};
					for(var i=0; i<oData.length; i++){
						if(i == (vData.Idx + 1)){
							continue;
						}
						
						var detail = Object.assign(oData[i]);
							detail.Idx = oNewData.Data.length;
						oNewData.Data.push(detail);
					}
					
					oJSONModel.setData(oNewData);
				}
			}
		},
		
		// OT?????? ?????? ??? ?????????????????? ?????????
		onChangeTime : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			if(oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_48017")); // ????????? ?????????????????????.
				oEvent.getSource().setValue("");
			}
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel();
				oJSONModel.setProperty("/Data/" + oData.Idx + "/Ligbn", "");
				oJSONModel.setProperty("/Data/" + oData.Idx + "/LigbnTx", "");
				
		}, 

		onRequest: function(oEvent, Flag) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();

			// validation check
			var oData = oController._DetailJSonModel.getProperty("/Data");

			if(Flag == "C" && oData.Flag == ""){
				if(oData.Delapp == ""){
					if(!oData.Awart || oData.Awart == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48005")); // ??????????????? ???????????? ????????????.
						return;
					} else if(oData.Halfc == "H" && !oData.Half){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48008")); // ??????/?????? ????????? ???????????? ????????????.
						return;
					} else if(oData.Halfc == "X" && (oData.Beguz == "" || oData.Enduz == "")){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48024")); // ??????????????? ???????????? ????????????.
						return;
					} else if(!oData.Begda || !oData.Endda){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48006")); // ??????????????? ???????????? ????????????.
						return;
					} else if(oData.Kaltg == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48007")); // ?????? ??????????????? ??????????????? ????????????.
						return;
					} else if(!oData.Telnum || oData.Telnum.trim() == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48009")); // ???????????? ???????????? ????????????.
						return;
					} else if(!oData.Desti || oData.Desti.trim() == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48010")); // ???????????? ???????????? ????????????.
						return;
					}
				}
			} else if(Flag == "C" && oData.Flag == "D"){
				if(oData.Awart == "1615" || oData.Awart == "1LA1"){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48027")); // ??????????????? ??????????????? ???????????????.
					return;
				}
			}
			
			// ????????????
			if(oData.Panel2Visible == true){
				var oData2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel().getProperty("/Data");
				
				for(var i=0; i<oData2.length; i++){
					if(oData2[i].Offck == ""){
						if(oData2[i].Ligbn == "" && oData2[i].Cntgb != "0"){
							sap.m.MessageBox.error(oController.getBundleText("MSG_48011")); // ?????? ??????????????? ??????????????? ????????????.
							return;
						} else if(oData2[i].Cntgb != "0"){
							if(!oData2[i].Awper){
								sap.m.MessageBox.error(oController.getBundleText("MSG_48002")); // ???????????? ?????? ??????????????????.
								return;
							} else if(!oData2[i].Beguz || !oData2[i].Enduz){
								sap.m.MessageBox.error(oController.getBundleText("MSG_48014")); // OT????????? ???????????? ????????????.
								return;
							}
						}
					}
				}
			}

			setTimeout(function() {
				var initData = {
					Mode: "M",
					Pernr: oController._DetailJSonModel.getProperty("/Data/Pernr"),
					Empid: oController.getSessionInfoByKey("Pernr"),
					Bukrs: oController._DetailJSonModel.getProperty("/Data/Bukrs"),
					ZappSeq: "11"
				},
				callback = function(o) {
					oController.onPressSave.call(oController, Flag, o);
				};
		
				oController.ApprovalLinesHandler = ApprovalLinesHandler.get(oController, initData, callback);
				DialogHandler.open(oController.ApprovalLinesHandler);
			}, 0);
		},
		
		// ?????? (Flag : C ??????, D ??????)
		onPressSave : function(Flag, vAprdatas){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
		
			var oData = oController._DetailJSonModel.getProperty("/Data");
			var oData2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel().getProperty("/Data");
			
			var createData = {VacationApply1Nav : [], VacationApply2Nav : [], VacationApply3Nav : (vAprdatas ? vAprdatas : [])};
			
			// validation check
			if(Flag == "C" && oData.Flag == ""){
				if(oData.Delapp == ""){
					if(!oData.Awart || oData.Awart == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48005")); // ??????????????? ???????????? ????????????.
						return;
					} else if(oData.Halfc == "H" && !oData.Half){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48008")); // ??????/?????? ????????? ???????????? ????????????.
						return;
					} else if(oData.Halfc == "X" && (oData.Beguz == "" || oData.Enduz == "")){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48024")); // ??????????????? ???????????? ????????????.
						return;
					} else if(!oData.Begda || !oData.Endda){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48006")); // ??????????????? ???????????? ????????????.
						return;
					} else if(oData.Kaltg == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48007")); // ?????? ??????????????? ??????????????? ????????????.
						return;
					} else if(!oData.Telnum || oData.Telnum.trim() == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48009")); // ???????????? ???????????? ????????????.
						return;
					} else if(!oData.Desti || oData.Desti.trim() == ""){
						sap.m.MessageBox.error(oController.getBundleText("MSG_48010")); // ???????????? ???????????? ????????????.
						return;
					}

					// 2021-05-11 ????????? ???????????? ?????? ?????? ????????? ?????? ?????? ??????
					// var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
					// if(oAppName.getItems().length != 0){
					// 	if(!oData.AppName){
					// 		sap.m.MessageBox.error(oController.getBundleText("MSG_48026")); // ???????????? ???????????? ????????????.
					// 		return;
					// 	}
					// }
				}
			} else if(Flag == "C" && oData.Flag == "D"){
				if(oData.Awart == "1615" || oData.Awart == "1LA1"){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48027")); // ??????????????? ??????????????? ???????????????.
					return;
				}
			}
			
			// ????????????
			if(oData.Panel2Visible == true){
				for(var i=0; i<oData2.length; i++){
					if(oData2[i].Offck == ""){
						if(oData2[i].Ligbn == "" && oData2[i].Cntgb != "0"){
							sap.m.MessageBox.error(oController.getBundleText("MSG_48011")); // ?????? ??????????????? ??????????????? ????????????.
							return;
						} else if(oData2[i].Cntgb != "0"){
							if(!oData2[i].Awper){
								sap.m.MessageBox.error(oController.getBundleText("MSG_48002")); // ???????????? ?????? ??????????????????.
								return;
							} else if(!oData2[i].Beguz || !oData2[i].Enduz){
								sap.m.MessageBox.error(oController.getBundleText("MSG_48014")); // OT????????? ???????????? ????????????.
								return;
							}
						}
					}
					
					var detail = {};
						detail.Datum = "\/Date(" + common.Common.getTime(oData2[i].Datum) + ")\/"; 
						detail.Offck = oData2[i].Offck;
						detail.Awper = oData2[i].Awper;
						detail.Beguz = oData2[i].Beguz;
						detail.Enduz = oData2[i].Enduz;
						detail.Ovtim = oData2[i].Ovtim == "" || oData2[i].Ovtim == "-" ? "0" : oData2[i].Ovtim;
						detail.Wt40 = oData2[i].Wt40 == "" || oData2[i].Wt40 == "-" ? "0" : oData2[i].Wt40;
						detail.Wt12 = oData2[i].Wt12 == "" || oData2[i].Wt12 == "-" ? "0" : oData2[i].Wt12;
						detail.Wtsum = oData2[i].Wtsum == "" || oData2[i].Wtsum == "-" ? "0" : oData2[i].Wtsum;
						detail.Ligbn = oData2[i].Ligbn;
						detail.Cntgb = oData2[i].Cntgb;
						detail.Flag = oData2[i].Flag;
					
					createData.VacationApply2Nav.push(detail);
				}
			}
			
			var confirmMessage = "", successMessage = "";
			var onProcess = function(){
				var oUrl = "";

				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				
					createData.IEmpid = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IMolga = oData.Molga;
					createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
					createData.IExtryn = oController._Extryn;
					
					// ?????????????????? ?????? ????????? ??????
					// ???????????? 3, ?????? 4, ???????????? 5
					if(oData.Flag == "D" && Flag == "C"){
						createData.IConType = "5";
					} else if(Flag == "C"){
						createData.IConType = "3";
					} else {
						createData.IConType = "4";
					}
				
				var detail = {};
					detail.Pernr = oData.Pernr;
					detail.Awart = oData.Awart;
					detail.Subty = oData.Subty ? oData.Subty : oData.Awart;
					detail.Half = oData. Half ? oData.Half : "";
					detail.Begda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					detail.Endda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/"; 
					detail.Beguz = oData.Beguz ? oData.Beguz : "";
					detail.Enduz = oData.Enduz ? oData.Enduz : "";
					detail.Kaltg = oData.Kaltg ? oData.Kaltg + "" : "0";
					detail.Hldtg = oData.Hldtg ? oData.Hldtg + "" : "0";
					detail.Kjdate = oData.Kjdate ? oData.Kjdate + "" : "0";
					detail.Telnum = oData.Telnum;
					detail.Desti = oData.Desti;
					detail.Encard = oData.Encard;
					detail.Bigo = oData.Bigo;
					detail.Seqnr = oData.Seqnr;
					detail.Sprps = oData.Sprps;
					detail.AppName1 = oData.AppName; // 2021-05-11 ????????? ??????
					
					if(oData.Delapp != "" && Flag == "D"){
						detail.Appkey = oData.ListAppkey;
						detail.Appkey1 = oData.ListAppkey1;
					} else {
						detail.Appkey = oData.Appkey ? oData.Appkey : "";
						detail.Appkey1 = oData.Appkey1 ? oData.Appkey1 : "";
					}
				
					createData.VacationApply1Nav.push(detail);
				
				oModel.create("/VacationApplySet", createData, {
					success: function(data){
						if(data){
							// 2021-05-04 ????????? ????????? ??????
							if(data.VacationApply1Nav.results && data.VacationApply1Nav.results.length){
								oController._DetailJSonModel.setProperty("/Data/Appkey", data.VacationApply1Nav.results[0].Appkey);
								oController._DetailJSonModel.setProperty("/Data/Appkey1", data.VacationApply1Nav.results[0].Appkey1);
							}

							oUrl = data.EUrl;
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

				// ?????? ??? ???????????? ?????? ?????? ??? ?????? ???????????? ??????				
				if(Flag == "C" && oUrl != ""){ //  && vExtyn == "" // 2021-05-07 ?????? url??? ????????? ????????? ???????????? ????????? ??????
					if(common.Common.openPopup.call(oController, oUrl) == false){
						return;
					}
				}
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				// if(oData.Flag == "" && Flag == "C"){
				// 	switch(oData.Awart){
				// 		case "1501": // ????????????
				// 		case "1502": // ????????????
				// 		case "1511": // ????????????
				// 		case "1512": // ???????????????
				// 		case "1513": // ????????????
				// 		case "1514": // ????????????
				// 		case "1515": // ????????? ????????????
				// 		case "1516": // ????????? ????????????
				// 		case "1517": // ????????????
				// 		case "1519": // ????????????
				// 		case "1520": // ????????????
				// 		case "1521": // ?????????????????????
				// 		case "1522": // ?????????????????????
				// 		case "1530": // ?????????
				// 		case "1537": // ????????????
				// 		case "1538": // ????????????
				// 		case "1539": // ???????????????????????????
				// 		case "1541": // ?????????
				// 		case "1542": // ?????????
				// 		case "1552": // ??????(???)
				// 		case "1553": // ??????(???)
				// 		case "1554": // ??????(????????????)
				// 		case "1555": // ??????(????????????)
				// 		case "1557": // ???????????????
				// 		case "1558": // ???????????????
				// 			sap.m.MessageBox.success(oController.getBundleText("MSG_48020"), { // ?????????????????????. ????????? ????????? ?????? ?????? ???????????? ?????????????????????????
				// 				actions : ["YES", "NO"],
				// 				onClose : function(fVal){
				// 					if(fVal && fVal == "YES"){
				// 						setTimeout(function(){parent._gateway.redirect("Congratulation.html");}, 100);
				// 					} else {
				// 						oController.onBack();
				// 					}
				// 				}
				// 			});
							
				// 			return;
				// 			break;
				// 	}
				// }
				
				sap.m.MessageBox.success(successMessage, {
					onClose : oController.onBack
				});
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			if(oData.Flag == "" && Flag == "C"){
				confirmMessage = oController.getBundleText("MSG_00060"); // ?????????????????????????
				successMessage = oController.getBundleText("MSG_48013"); // ?????????????????????.
			} else if(oData.Flag == "D" && Flag == "C"){
				confirmMessage = oController.getBundleText("MSG_48019"); // ???????????? ???????????????????
				successMessage = oController.getBundleText("MSG_48013"); // ?????????????????????.
			} else {
				confirmMessage = oController.getBundleText("MSG_00059"); // ?????????????????????????
				successMessage = oController.getBundleText("MSG_00021"); // ?????????????????????.
			}
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		searchOrgehPernr : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			if(Flag && Flag == "X"){
				oController.oData = oEvent.getSource().getCustomData()[0].getValue();
			} else {
				oController.oData = null;
			}
			
			var initData = {
                Percod: oController.getSessionInfoByKey("Percod"),
                Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                Langu: oController.getSessionInfoByKey("Langu"),
                Molga: oController.getSessionInfoByKey("Molga"),
                Datum: new Date(),
                Mssty: "",
                autoClose : false
            },
            callback = function(o) {
				var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
				var oController = oView.getController();
				
				if(o.Otype == "O"){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48016")); // ???????????? ???????????? ????????????.
					return;
				}
			
    			if(oController.oData){ // ???????????? - ????????? ??????
    				var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table2").getModel();
	    				oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/Awper", o.Objid);
	    				oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/Awtxt", o.Stext);
	    				oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/Ligbn", ""); // ???????????? ?????? ?????????
	    				oJSONModel.setProperty("/Data/" + oController.oData.Idx + "/LigbnTx", "");
    			} else { // ????????? ??????
    				oController.onPressSearch(null, o.Objid);
    			}
    			
    			oController.OrgOfIndividualHandler.getDialog().close();
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
        
		// ???????????? ??????
		onPressSchedule : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			if(!oController._WorkScheduleDialog){
				oController._WorkScheduleDialog = sap.ui.jsfragment("ZUI5_HR_Vacation.fragment.WorkSchedule", oController);
				oView.addDependent(oController._WorkScheduleDialog);
			}
			
			var oData = oController._DetailJSonModel.getProperty("/Data");
			
			var date = oData.Begda ? new Date(oData.Begda) : new Date();
			
			var vData = {Data : {Pernr : oData.Pernr, Bukrs : oData.Bukrs, Molga : oData.Molga, Year : date.getFullYear(), Month : date.getMonth() + 1}};
			
			oController._WorkScheduleDialog.getModel().setData(vData);
			if(oController.addCalendar() == false) return;
			
			oController._WorkScheduleDialog.open();
		},
		
		onSetYearMonth : function(value){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			var year = oController._WorkScheduleDialog.getModel().getProperty("/Data/Year");
			var month = oController._WorkScheduleDialog.getModel().getProperty("/Data/Month");
				month = month + value;
				
			if(month < 1){
				year = year - 1;
				month = 12;
			} else if(month > 12){
				year = year + 1;
				month = 1;
			}
			
			oController._WorkScheduleDialog.getModel().setProperty("/Data/Year", year);
			oController._WorkScheduleDialog.getModel().setProperty("/Data/Month", month);
			
			oController.addCalendar();
		},
		
		addCalendar : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Vacation.m.Detail");
			var oController = oView.getController();
			
			var oData = oController._WorkScheduleDialog.getModel().getProperty("/Data");
			
			oController._WorkScheduleDialog.destroyContent();
			oController._WorkScheduleDialog.addContent(sap.ui.jsfragment("ZUI5_HR_Vacation.fragment.Calendar", oController));
			
			var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
			var createData = {PerScheduleNav : []};
				createData.IPernr = oData.Pernr;
				createData.IBukrs = oData.Bukrs;
				createData.ILangu = oController.getSessionInfoByKey("Langu");
				createData.IMolga = oData.Molga;
				createData.IYear = oData.Year + "";
				createData.IMonth = (oData.Month >= 10 ? (oData.Month + "") : ("0" + oData.Month));
			
			oModel.create("/PernrScheduleSet", createData, {
				success: function(data){
					if(data){
						if(data.PerScheduleNav && data.PerScheduleNav.results){
							var data1 = data.PerScheduleNav.results;
							
							var month = (oData.Month >= 10 ? (oData.Month + "") : ("0" + oData.Month));
							
							for(var i=0; i<data1.length; i++){
								var id = oController.PAGEID + "_" + (oData.Year + month + data1[i].Indate);
								
								var oControl = sap.ui.getCore().byId(id);
								if(oControl == undefined) continue;
								
								var style = (data1[i].Tpr0a == "OFF" || data1[i].Tpr0a.substring(data1[i].Tpr0a.length-1) == "O") ? "color-info-red font-bold" : "color-darkgreen font-bold";
								
								var oMatrix = new sap.ui.commons.layout.MatrixLayout({
									columns : 1,
									width : "100%",
									rows : [new sap.ui.commons.layout.MatrixLayoutRow({
												height : "30px",
												cells : [new sap.ui.commons.layout.MatrixLayoutCell({
															 content : [new sap.m.Text({text : parseInt(data1[i].Indate)})],
															 hAlign : "Center",
															 vAlign : "Middle"
														 })]
											}),
											new sap.ui.commons.layout.MatrixLayoutRow({
												height : "30px",		
												cells : [new sap.ui.commons.layout.MatrixLayoutCell({
															 content : [new sap.m.Text({text : data1[i].Tpr0a}).addStyleClass(style)],
															 hAlign : "Center",
															 vAlign : "Middle"
														 })]
											})]
								});
								
								oControl.addContent(oMatrix);
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
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return false;
			}

		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20060040"});
		} : null
		
	});

});