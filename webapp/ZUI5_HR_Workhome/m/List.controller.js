/* eslint-disable no-native-reassign */
jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/DialogHandler",
	"common/ApprovalLinesHandler"], 
	function (Common, CommonController, DialogHandler, ApprovalLinesHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Workhome.m.List", {

		PAGEID: "ZUI5_HR_WorkhomeList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		
		_Bukrs : "",

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
					onBeforeShow : this.onBeforeShow,
					onAfterShow: this.onAfterShow
				}, this);
				
			gDtfmt = this.getSessionInfoByKey("Dtfmt");		
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(){
			var oController = this;
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Begda : new Date(today.getFullYear(), today.getMonth(), 1),
						Endda : new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth()))),
						Persa : oController.getSessionInfoByKey("Persa"),
						Pernr : oController.getSessionInfoByKey("Pernr")
					}
				};
				
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_Workhome.m.List",
			    	  Data : {}
			      }
			});
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.List");
			var oController = oView.getController();
		
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // // ????????? ?????????????????????.
				oEvent.getSource().setValue("");

				oController._ListCondJSonModel.setProperty("/Data/Begda", "");
				oController._ListCondJSonModel.setProperty("/Data/Endda", "");
				return;
			}
		},
		
		onPressSearch : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			var search = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
				
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				var createData = {WorkhomeNav : []};
					createData.IEmpid = (oData.Pernr && oData.Pernr != "" ? oData.Pernr : "");
					createData.IOrgeh = (oData.Orgeh && oData.Orgeh != "" ? oData.Orgeh : "");
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda.getFullYear(), oData.Begda.getMonth(), oData.Begda.getDate())) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda.getFullYear(), oData.Endda.getMonth(), oData.Endda.getDate())) + ")\/";
					createData.IBukrs = oController.getSessionInfoByKey("Bukrs3");
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IConType = "1";

				oModel.create("/WorkhomeApplySet", createData, {
					success: function(data){
						if(data){
							if(data.WorkhomeNav && data.WorkhomeNav.results){
								for(var i=0; i<data.WorkhomeNav.results.length; i++){  
									var data1 = data.WorkhomeNav.results[i];
									data1.Begda = data1.Begda ? dateFormat.format(new Date(common.Common.setTime(data1.Begda))) : "";
									data1.Endda = data1.Endda ? dateFormat.format(new Date(common.Common.setTime(data1.Endda))) : "";
									
									// ??????
									if(data1.Cancl == ""){
										data1.Cancltx = oController.getBundleText("LABEL_53012"); // ??????
									} else {
										data1.Cancltx = oController.getBundleText("LABEL_53013"); // ??????
									}
									
									data1.Kaltg = parseFloat(data1.Kaltg);
									
									vData.Data.push(data1);
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

				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}          
				
				oController._BusyDialog.close();
				
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		onPressNew : function(){
			// var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.List");
			// var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_Workhome.m.Detail",
			      data : {
			    	  FromPageId : "ZUI5_HR_Workhome.m.List",
			    	  Status : ""
			      }
			});	
		},
		
		// D ?????? E ??????
		onPressDelete : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.List");
			var oController = oView.getController();
			var oData;
		
			if(oEvent){
				oData = oEvent.getSource().getCustomData()[0].getValue();
			} else {
				oData = oController._CancelDialog.getModel().getProperty("/Data");
				
				// validation check
				if(oData.Bigo == "" || oData.Bigo.trim() == ""){
					sap.m.MessageBox.error(oController.getBundleText("MSG_53010")); // ??????????????? ???????????? ????????????.
					return;
				} else if(oData.AppNameyn == true && !oData.AppName){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48026")); // ???????????? ???????????? ????????????.
					return;
				}
			}

			if(oEvent && Flag == "E") {
				if(!oController._CancelDialog){
					oController._CancelDialog = sap.ui.jsfragment("ZUI5_HR_Workhome.fragment.Cancel", oController);
					oView.addDependent(oController._CancelDialog);
				}
				
				var oJSONModel = oController._CancelDialog.getModel();
				var vData = Object.assign({}, oData, {Bigo : "", AppNameyn : false});

				// 2021-05-13 ????????? ????????? ??????
				// var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
				// 	oAppName.destroyItems();
				// 	oAppName.setValue("");
				
				// var oModel = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
				// var createData = {ApprlistNav : []};
				// 	createData.IPernr = oData.Pernr;
				// 	createData.IExtryn = "X";
				// 	createData.IZappSeq = "40";
				// 	createData.IBukrs = oData.Bukrs;
				// 	createData.IMobyn = "X";
				// 	createData.IAppkey = (oData.Appkey ? oData.Appkey : "");

				// if(oData.Status1 == "" || oData.Status1 == "AA" || oData.Status1 == "JJ"){
				// 	createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
				// 	createData.IPrcty = "1";
				// } else {
				// 	createData.IDatum = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
				// 	createData.IPrcty = "2";
				// }

				// oModel.create("/ApprListSet", createData, {
				// 	success: function(data, res){
				// 		if(data){
				// 			if(data.ApprlistNav && data.ApprlistNav.results){
				// 					var data1 = data.ApprlistNav.results;
									
				// 					if(data1 && data1.length){
				// 						vData.AppNameyn = true;
				// 						for(var i=0; i<data1.length; i++){
				// 							oAppName.addItem(
				// 								new sap.ui.core.Item({
				// 									key : data1[i].AppName,
				// 									text : data1[i].AppText
				// 								})
				// 							);

				// 							if(data1[i].Defyn == "X"){
				// 								vData.AppName = data1[i].AppName;
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
				// 	return;
				// }
				
				oJSONModel.setData({Data : vData});
				
				oController._CancelDialog.open();
			} else {
				if(Flag == "E"){
					setTimeout(function() {
						var initData = {
							Mode: "M", // PC ??? P, Mobile - M
							Pernr: oData.Pernr,
							Empid: oData.Pernr,
							Bukrs: oData.Bukrs,
							ZappSeq: "40"
						},
						callback = function(o) {
							oController.onDeleteProcess.call(oController, oData, Flag, o);   // ????????? Dialog?????? ?????? ?????? ????????? ?????? ?????? Function
						};
			
						oController.ApprovalLinesHandler = ApprovalLinesHandler.get(oController, initData, callback);
						DialogHandler.open(oController.ApprovalLinesHandler);
					}, 0);
				} else {
					oController.onDeleteProcess.call(oController, oData, Flag, []); 
				}
			}
		},

		onDeleteProcess : function(oData, Flag, vAprdatas){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.List");
			var oController = oView.getController();

			var confirmMessage = "", successMessage = "";
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				
				var createData = {WorkhomeNav : [], WorkhomeTabNav : (vAprdatas ? vAprdatas : [])};
					createData.IPernr = oData.Pernr;
					createData.IEmpid = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IConType = Flag == "D" ? "4" : "9";
					createData.IExtryn = "X";
					
				var detail = {};
					detail.Pernr = oData.Pernr;
					detail.Bukrs = oData.Bukrs;
					detail.Status = oData.Status;
					detail.Begda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					detail.Endda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					detail.Telnum = oData.Telnum;
					detail.Bigo = oData.Bigo;

				createData.WorkhomeNav.push(detail);
				
				oModel.create("/WorkhomeApplySet", createData, {
					success: function(data){
						if(data){
							if(data.EUrl != ""){
								if(Common.openPopup.call(oController, data.EUrl) == false){
									oController._BusyDialog.close();
									return;
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
				
				sap.m.MessageBox.success(successMessage, {
					onClose : oController.onPressSearch
				});
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					if(oController._CancelDialog && oController._CancelDialog.isOpen() == true){
						oController._CancelDialog.close();
					}
					
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			if(Flag == "D"){
				confirmMessage = oController.getBundleText("MSG_00059"); // ?????????????????????????
				successMessage = oController.getBundleText("MSG_00021"); // ?????????????????????.
			} else {
				confirmMessage = oController.getBundleText("MSG_53008"); // ?????????????????????????
				successMessage = oController.getBundleText("MSG_53009"); // ???????????????????????????.
			}
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : beforeSave
			});	
		},
		
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		}
		
	});

});