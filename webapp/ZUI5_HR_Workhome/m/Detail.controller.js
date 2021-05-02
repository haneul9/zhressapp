jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper"], 
	function (Common, CommonController, JSONModelHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Workhome.m.Detail", {

		PAGEID: "ZUI5_HR_WorkhomeDetail",
		_BusyDialog : new sap.m.BusyDialog(),
		_DetailJSonModel : new sap.ui.model.json.JSONModel(),
		oData : null,

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
		
			var oData = {
				Data : {
					FromPageId : oEvent.data.FromPageId,
					Status : oEvent.data.Status,
					Werks : $.app.getModel("session").getData().Persa,
					Bukrs : $.app.getModel("session").getData().Bukrs,
					Molga : $.app.getModel("session").getData().Molga,
					Pernr : $.app.getModel("session").getData().Pernr
				}
			};
			
			oController._DetailJSonModel.setData(oData);
			
			// 재택근무일 5개까지 신청 가능
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};

			for(var i=0; i<5; i++){
				vData.Data.push({
					Idx : i, 
					Begda : "", 
					Title : oController.getBundleText("LABEL_53002") + (i+1),
					Status : oData.Data.Status
				});
			}
			
			oJSONModel.setData(vData);
		},
		
		onAfterShow: function(oEvent){
			
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.Detail");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._DetailJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_Workhome.m.Detail",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.Detail");
			var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.Detail");
			var oController = oView.getController();
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
			
			// 현재일 이전 일자 선택 시 에러 처리
            var value = oEvent.getParameters().value, today = new Date();
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyyMMdd"});

            if(parseFloat(dateFormat.format(new Date(value))) < parseFloat(dateFormat.format(today))){
            	sap.m.MessageBox.error(oController.getBundleText("MSG_53011")); // 현재일 이전 일자는 선택할 수 없습니다.
            	oEvent.getSource().setValue("");
            	return;
            }
		},
		
		// 일자 삭제
		onDeleteDate : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.Detail");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();

			var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel();
				oJSONModel.setProperty("/Data/" + oData.Idx + "/Begda", "");
		},
		
		// 신청 (Flag : C 신청, D 삭제)
		onPressSave : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.Detail");
			var oController = oView.getController();
		
			var oData = oController._DetailJSonModel.getProperty("/Data");
			var vData = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel().getProperty("/Data");
			
			var createData = {WorkhomeNav : []};
			
			// validation check
			for(var i=0; i<vData.length; i++){
				if(vData[i].Begda != ""){
					var detail = {};
						detail.Pernr = oData.Pernr;
						detail.Bukrs = oData.Bukrs;
						detail.Begda = "\/Date(" + common.Common.getTime(new Date(vData[i].Begda)) + ")\/"; 
						detail.Endda = "\/Date(" + common.Common.getTime(new Date(vData[i].Begda)) + ")\/"; 
						detail.Telnum = oData.Telnum;
						detail.Bigo = oData.Bigo;

					createData.WorkhomeNav.push(detail);
				}
			}
			
			if(createData.WorkhomeNav.length == 0){
				sap.m.MessageBox.error(oController.getBundleText("MSG_53006")); // 재택근무일을 하나 이상 입력하여 주십시오.
				return;
			} else if(!oData.Telnum || oData.Telnum.trim() == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_53007")); // 연락처를 입력하여 주십시오.
				return;
			}
			
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				var oExtryn = Common.isExternalIP() === true ? "X" : "";
				
				oController._DetailJSonModel.setProperty("/Data/Extryn", oExtryn);
				
					createData.IPernr = oData.Pernr;
					createData.IEmpid = $.app.getModel("session").getData().Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = $.app.getModel("session").getData().Langu;
					createData.IConType = Flag == "C" ? "3" : "4";
					createData.IExtryn = oExtryn;
					console.log(createData);
				oModel.create("/WorkhomeApplySet", createData, {
					success: function(data, res){
						if(data){
							if(Flag == "C"){
								if(!oController._ImageDialog){
									oController._ImageDialog = sap.ui.jsfragment("ZUI5_HR_Workhome.fragment.Image", oController);
									oView.addDependent(oController._ImageDialog);
								}
								
								oController._ImageDialog.getModel().setData({Data : {Url : data.EUrl}});
								
								oController._ImageDialog.open();
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
				
				if(Flag != "C"){
					sap.m.MessageBox.success(successMessage, {
						onClose : oController.onBack
					});
				}
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			var confirmMessage = "", successMessage = "";
			if(Flag == "C"){
				confirmMessage = oController.getBundleText("MSG_00060"); // 신청하시겠습니까?
				successMessage = oController.getBundleText("MSG_00061"); // 신청되었습니다.
			} else {
				confirmMessage = oController.getBundleText("MSG_00059"); // 삭제하시겠습니까?
				successMessage = oController.getBundleText("MSG_00021"); // 삭제되었습니다.
			}
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		openSMOIN : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.Detail");
			var oController = oView.getController();
			
			var oUrl = oController._ImageDialog.getModel().getProperty("/Data/Url");
			var oExtryn = oController._DetailJSonModel.getProperty("/Data/Extryn");
			
			oController._ImageDialog.close();
		
			if(oExtryn == ""){
				setTimeout(function() {
					var width = 1000, height = screen.availHeight * 0.9,
					left = (screen.availWidth - width) / 2,
					top = (screen.availHeight - height) / 2,
					popup = window.open(oUrl, "smoin-approval-popup", [
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
				
			sap.m.MessageBox.success(oController.getBundleText("MSG_00061"), { // 신청되었습니다.
				onClose : oController.onBack
			});
		},
		
	});

});