jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/DialogHandler",
	"common/ApprovalLinesHandler"
], 
	function (Common, CommonController, JSONModelHelper, DialogHandler, ApprovalLinesHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Workhome.m.Detail", {

		PAGEID: "ZUI5_HR_WorkhomeDetail",
		_BusyDialog : new sap.m.BusyDialog(),
		_DetailJSonModel : new sap.ui.model.json.JSONModel(),
		oData : null,

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
		},

		onBeforeShow: function(oEvent){
			var oController = this;
		
			var oData = {
				Data : {
					FromPageId : oEvent.data.FromPageId,
					Status : oEvent.data.Status,
					Werks : oController.getSessionInfoByKey("Persa"),
					Bukrs : oController.getSessionInfoByKey("Bukrs3"),
					Molga : oController.getSessionInfoByKey("Molga"),
					Pernr : oController.getSessionInfoByKey("Pernr")
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

			// 2021-05-13 결재자 리스트
			// 2021-06-17 결재라인 공통 로직 처리
			// var oRow = sap.ui.getCore().byId(oController.PAGEID + "_AppNameRow");
			// var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
			// 	oAppName.destroyItems();
			// 	oAppName.setValue("");
			
			// var oModel = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
			// var createData = {ApprlistNav : []};
			// 	createData.IPernr = oData.Data.Pernr;
			// 	createData.IExtryn = "X";
			// 	createData.IZappSeq = "39";
			// 	createData.IBukrs = oData.Data.Bukrs;
			// 	createData.IMobyn = "X";
			// 	createData.IAppkey = "";
			// 	createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/"; 
			// 	createData.IPrcty = "1";

			// oModel.create("/ApprListSet", createData, {
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

			// // 리스트가 존재하지 않으면 결재자 row를 invisible 처리한다.
			// if(oAppName.getItems().length == 0){
			// 	oController._DetailJSonModel.setProperty("/Data/AppName", "");
			// 	oRow.addStyleClass("displayNone");
			// } else {
			// 	oRow.removeStyleClass("displayNone");
			// }	
		},
		
		onAfterShow: function(){
			
		},
		
		onBack : function(){
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

		onRequest: function() {
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.Detail");
			var oController = oView.getController();
			
			// validation check
			var oData = oController._DetailJSonModel.getProperty("/Data"),
				vData = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel().getProperty("/Data"),
				validationData = [];

			for(var i=0; i<vData.length; i++){
				if(vData[i].Begda != ""){
					var detail = {
						Begda : "\/Date(" + common.Common.getTime(new Date(vData[i].Begda)) + ")\/"
					};

					if(validationData.length > 0){
						for(var j=0; j<validationData.length; j++){
							if(validationData[j].Begda == detail.Begda){
								sap.m.MessageBox.error(oController.getBundleText("MSG_53012")); // 동일일자 신청은 불가합니다.
								return;
							}
						}
					}

					validationData.push(detail);
				}
			}
			
			if(validationData.length == 0){
				sap.m.MessageBox.error(oController.getBundleText("MSG_53006")); // 재택근무일을 하나 이상 입력하여 주십시오.
				return;
			} else if(!oData.Telnum || oData.Telnum.trim() == ""){
				sap.m.MessageBox.error(oController.getBundleText("MSG_53007")); // 연락처를 입력하여 주십시오.
				return;
			}

			setTimeout(function() {
				var initData = {
					Mode: "M",
					Pernr: oData.Pernr,
					Empid: oData.Pernr,
					Bukrs: oData.Bukrs,
					ZappSeq: "39"
				},
				callback = function(o) {
					this.onPressSave.call(this, "C", o);
				}.bind(this);
		
				this.ApprovalLinesHandler = ApprovalLinesHandler.get(this, initData, callback);
				DialogHandler.open(this.ApprovalLinesHandler);
			}.bind(this), 0);
		},
		
		// 신청 (Flag : C 신청, D 삭제)
		onPressSave : function(Flag, vAprdatas){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.m.Detail");
			var oController = oView.getController();
		
			var oData = oController._DetailJSonModel.getProperty("/Data");
			var vData = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel().getProperty("/Data");
			
			var createData = {WorkhomeNav : [], WorkhomeTabNav : (vAprdatas ? vAprdatas : [])};

			Common.log(vAprdatas);
			
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
						detail.AppName = oData.AppName ? oData.AppName : "";

					if(createData.WorkhomeNav.length > 0){
						for(var j=0; j<createData.WorkhomeNav.length; j++){
							if(createData.WorkhomeNav[j].Begda == detail.Begda){
								sap.m.MessageBox.error(oController.getBundleText("MSG_53012")); // 동일일자 신청은 불가합니다.
								return;
							}
						}
					}

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

			// 2021-05-13 결재자 리스트가 있는 경우 결재자 선택 여부 체크
			// var oAppName = sap.ui.getCore().byId(oController.PAGEID + "_AppName");
			// if(oAppName.getItems().length != 0){
			// 	if(!oData.AppName){
			// 		sap.m.MessageBox.error(oController.getBundleText("MSG_48026")); // 결재자를 선택하여 주십시오.
			// 		return;
			// 	}
			// }
			
			var confirmMessage = "", successMessage = "";
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				var oExtryn = Common.isExternalIP() === true ? "X" : "";
				
				oController._DetailJSonModel.setProperty("/Data/Extryn", oExtryn);
				
					createData.IPernr = oData.Pernr;
					createData.IEmpid = oController.getSessionInfoByKey("Pernr");
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IConType = Flag == "C" ? "3" : "4";
					createData.IExtryn = oExtryn;
					
				oModel.create("/WorkhomeApplySet", createData, {
					success: function(data){
						if(data){
							if(Flag == "C"){
								if(!oController._ImageDialog){
									oController._ImageDialog = sap.ui.jsfragment("ZUI5_HR_Workhome.fragment.Image", oController);
									oView.addDependent(oController._ImageDialog);
									oController._ImageDialog.getContent()[0].setWidth("100%");
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
			
			oController._ImageDialog.close();
		
			// 2021-05-07 결재url이 리턴된 경우에만 결재창 오픈
			// if(oExtryn == ""){
			if(oUrl != ""){
				if(common.Common.openPopup.call(oController, oUrl) == false){
					return;
				}
			}
				
			sap.m.MessageBox.success(oController.getBundleText("MSG_00061"), { // 신청되었습니다.
				onClose : oController.onBack
			});
		}
		
	});

});