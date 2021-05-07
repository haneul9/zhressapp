jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/PageHelper"], 
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Workhome.m.List", {

		PAGEID: "ZUI5_HR_WorkhomeList",
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
				
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Begda : new Date(today.getFullYear(), today.getMonth(), 1),
						Endda : new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth()))),
						Persa : $.app.getModel("session").getData().Persa,
						Pernr : $.app.getModel("session").getData().Pernr
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
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");

				oController._ListCondJSonModel.setProperty("/Data/Begda", "");
				oController._ListCondJSonModel.setProperty("/Data/Endda", "");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
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
					createData.IBukrs = $.app.getModel("session").getData().Bukrs;
					createData.ILangu = $.app.getModel("session").getData().Langu;
					createData.IConType = "1";

				oModel.create("/WorkhomeApplySet", createData, {
					success: function(data, res){
						if(data){
							if(data.WorkhomeNav && data.WorkhomeNav.results){
								for(var i=0; i<data.WorkhomeNav.results.length; i++){  
									var data1 = data.WorkhomeNav.results[i];
									data1.Begda = data1.Begda ? dateFormat.format(new Date(common.Common.setTime(data1.Begda))) : "";
									data1.Endda = data1.Endda ? dateFormat.format(new Date(common.Common.setTime(data1.Endda))) : "";
									
									// 구분
									if(data1.Cancl == ""){
										data1.Cancltx = oController.getBundleText("LABEL_53012"); // 신규
									} else {
										data1.Cancltx = oController.getBundleText("LABEL_53013"); // 취소
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
				
			}
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		onPressNew : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_Workhome.m.Detail",
			      data : {
			    	  FromPageId : "ZUI5_HR_Workhome.m.List",
			    	  Status : ""
			      }
			});	
		},
		
		// D 삭제 E 취소
		onPressDelete : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.List");
			var oController = oView.getController();
		
			if(oEvent){
				var oData = oEvent.getSource().getCustomData()[0].getValue();
			} else {
				var oData = oController._CancelDialog.getModel().getProperty("/Data");
				
				// validation check
				if(oData.Bigo == "" || oData.Bigo.trim() == ""){
					sap.m.MessageBox.error(oController.getBundleText("MSG_53010")); // 취소사유를 입력하여 주십시오.
					return;
				}
			}
			
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				var oExtryn = Common.isExternalIP() === true ? "X" : "";
				
				var createData = {WorkhomeNav : []};
					createData.IPernr = oData.Pernr;
					createData.IEmpid = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = $.app.getModel("session").getData().Langu;
					createData.IConType = Flag == "D" ? "4" : "9";
					createData.IExtryn = oExtryn;
					
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
					success: function(data, res){
						if(data){
							if(data.EUrl != "" && oExtryn == ""){
								setTimeout(function() {
				                    var width = 1000, height = screen.availHeight * 0.9,
				                    left = (screen.availWidth - width) / 2,
				                    top = (screen.availHeight - height) / 2,
				                    popup = window.open(data.EUrl, "smoin-approval-popup", [
				                        "width=" + width,
				                        "height=" + height,
				                        "left=" + left,
				                        "top=" + top,
				                        "status=yes,resizable=yes,scrollbars=yes"
				                    ].join(","));
				
				                    setTimeout(function() {
				                        popup.focus();
				                    }, 500);
				                }, 0);
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
			
			var confirmMessage = "", successMessage = "";
			if(Flag == "D"){
				confirmMessage = oController.getBundleText("MSG_00059"); // 삭제하시겠습니까?
				successMessage = oController.getBundleText("MSG_00021"); // 삭제되었습니다.
			} else {
				confirmMessage = oController.getBundleText("MSG_53008"); // 취소하시겠습니까?
				successMessage = oController.getBundleText("MSG_53009"); // 취소신청되었습니다.
			}
			
			var confirm = function(){
				sap.m.MessageBox.confirm(confirmMessage, {
					actions : ["YES", "NO"],
					onClose : beforeSave
				});	
			}
			
			if(oEvent && Flag == "E") {
				if(!oController._CancelDialog){
					oController._CancelDialog = sap.ui.jsfragment("ZUI5_HR_Workhome.fragment.Cancel", oController);
					oView.addDependent(oController._CancelDialog);
				}
				
				var oJSONModel = oController._CancelDialog.getModel();
				var vData = Object.assign({}, oData, {Bigo : ""});
				
				oJSONModel.setData({Data : vData});
				
				oController._CancelDialog.open();
			} else {
				confirm();
			}
		},
		
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		},
		
	});

});