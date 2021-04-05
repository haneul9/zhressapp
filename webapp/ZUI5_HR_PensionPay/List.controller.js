jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper"], 
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_PensionPay.List", {
	
		PAGEID: "PensionPayList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
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
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			
			var oContent = sap.ui.getCore().byId(oController.PAGEID + "_Content");
				oContent.destroyContent();
				
			// var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
			// var vEmpLoginInfo = mEmpLoginInfo.getProperty("/Data");

			var oModel = sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");
				
			var createData = {BukrsExport : []};
				// createData.Pernr = vEmpLoginInfo.Pernr;
				createData.Pernr = oController.getView().getModel("session").getData().Pernr;
				
			 oModel.create("/BukrsImportSet", createData, null,
			 		function(data,res){
			 			if(data.BukrsExport){
			 				if(data.BukrsExport.results && data.BukrsExport.results.length){
			 					oController._Bukrs = data.BukrsExport.results[0].Bukrs;
			 					
			 					if(data.BukrsExport.results[0].Bukrs == "A100"){			 						
		 							oContent.addContent(sap.ui.jsfragment("ZUI5_HR_PensionPay.fragment.Detail2", oController)); // 첨단
			 					} else {
			 						oContent.addContent(sap.ui.jsfragment("ZUI5_HR_PensionPay.fragment.Detail1", oController)); // 기초
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
				 
				 oContent.addContent(sap.ui.jsfragment("ZUI5_HR_PensionPay.fragment.Detail1", oController));
				 return;
			}				
		},
		
		onAfterShow: function(oEvent){
			this.onPressSearch1();
		},
		
		onPressSearch1 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_PensionPay.List");
			var oController = oView.getController();

			var search = function(){
				// 연도별 불입 내역
				var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var oJSONModel1 = oTable1.getModel();
				var vData1 = {Data : []};
				
				for(var i=0; i<oTable1.getColumns().length; i++){
					oTable1.getColumns()[i].setFiltered(false);
					oTable1.getColumns()[i].setSorted(false);
				}
				
				// 기본정보
				var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
				if(oTable2){
					var oJSONModel2 = oTable2.getModel();
					var vData2 = {Data : []};
					
					for(var i=0; i<oTable2.getColumns().length; i++){
						oTable2.getColumns()[i].setFiltered(false);
						oTable2.getColumns()[i].setSorted(false);
					}
				}
				
				// var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
				// var vEmpLoginInfo = mEmpLoginInfo.getProperty("/Data");
					
				var createData = {PensionPayTableInSet : [], PensionPayTableIn2Set : []};
					createData.IPernr = oView.getModel("session").getData().Pernr;
					createData.IBukrs = oController._Bukrs;
					createData.IConType = "H";
					
				var oModel = sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");
				 oModel.create("/PensionPaySet", createData, null,
				 		function(data,res){
				 			if(data && data.PensionPayTableInSet){
				 				if(data.PensionPayTableInSet.results && data.PensionPayTableInSet.results.length){
				 					for(var i=0; i<data.PensionPayTableInSet.results.length; i++){
				 						vData2.Data.push(data.PensionPayTableInSet.results[i]);
				 					}
				 				}
				 			}
				 			
				 			if(data && data.PensionPayTableIn2Set){
				 				if(data.PensionPayTableIn2Set.results && data.PensionPayTableIn2Set.results.length){
				 					for(var i=0; i<data.PensionPayTableIn2Set.results.length; i++){
				 						vData1.Data.push(data.PensionPayTableIn2Set.results[i]);
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
				 oTable1.bindRows("/Data");
				 oTable1.setVisibleRowCount(vData1.Data.length);
				 
				 if(oTable2){
					 oJSONModel2.setData(vData2);
					 oTable2.bindRows("/Data");
					 oTable2.setVisibleRowCount((vData2.Data.length >= 5 ? 5 : vData2.Data.length));
				 }
				 
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
		
		onPressSearch2 : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_PensionPay.List");
			var oController = oView.getController();

			var search = function(){
				// var mEmpLoginInfo = sap.ui.getCore().getModel("EmpLoginInfo");
				// var vEmpLoginInfo = mEmpLoginInfo.getProperty("/Data");
				
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
				
				var createData = {PensionPayTableInSet : [], PensionPayTableIn2Set : []};
					createData.IPernr = oView.getModel("session").getData().Pernr;
					createData.IBukrs = oController._Bukrs;
					createData.IConType = "0";
					
				var vData = {Data : {}};
					
				var oModel = sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");
				oModel.create("/PensionPaySet", createData, null,
				 		function(data,res){
				 			if(data && data.PensionPayTableInSet){
				 				if(data.PensionPayTableInSet.results && data.PensionPayTableInSet.results.length){
				 					data.PensionPayTableInSet.results[0].AppBeg = data.PensionPayTableInSet.results[0].AppBeg ? 
				 																		dateFormat.format(new Date(data.PensionPayTableInSet.results[0].AppBeg)) : null;
				 																		
									data.PensionPayTableInSet.results[0].AppEnd = data.PensionPayTableInSet.results[0].AppEnd ? 
																						dateFormat.format(new Date(data.PensionPayTableInSet.results[0].AppEnd)) : null;
																						
									// 신청구분
									if(data.PensionPayTableInSet.results[0].Etpay == ""){
										data.PensionPayTableInSet.results[0].Etpay = 0;
									} else {
										data.PensionPayTableInSet.results[0].Etpay = data.PensionPayTableInSet.results[0].Etpay == "1" ? 0 : 1;
									}
									
									// 증감액이 0이면 표기안함
									data.PensionPayTableInSet.results[0].DeamtT = data.PensionPayTableInSet.results[0].DeamtT == "0" ? "" : data.PensionPayTableInSet.results[0].DeamtT;
									
									// 변겅후금액
									data.PensionPayTableInSet.results[0].SelfAmtAT2 = data.PensionPayTableInSet.results[0].SelfAmtAT;
									data.PensionPayTableInSet.results[0].SuppAmtAT2 = data.PensionPayTableInSet.results[0].SuppAmtAT;
									data.PensionPayTableInSet.results[0].TotalAmtAT2 = data.PensionPayTableInSet.results[0].TotalAmtAT;
				 					
				 					vData.Data = data.PensionPayTableInSet.results[0];
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
				
				oController._ListCondJSonModel.setData(vData);
				
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
		
		onSelectIcontabar : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_PensionPay.List");
			var oController = oView.getController();

			var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
			eval("oController.onPressSearch" + sKey + "();");
		},
		
		// 신청금액 변경
		onChangeDeamtT : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_PensionPay.List");
			var oController = oView.getController();

			var value = (oEvent.getParameters().value.replace(/,/g, "")) * 1;
			if(isNaN(value) == true){
				oController._ListCondJSonModel.setProperty("/Data/DeamtT", "");
				oEvent.getSource().setValue("");
				sap.m.MessageBox.error(oBundleText.getText("MSG_17014")); // 숫자만 입력하여 주십시오.
				return;
			}
			
			if(value == 0){
				oController._ListCondJSonModel.setProperty("/Data/DeamtT", "");
				oController._ListCondJSonModel.setProperty("/Data/SelfAmtAT", "");
				oController._ListCondJSonModel.setProperty("/Data/TotalAmtAT", "");
			}
			
			oController._ListCondJSonModel.setProperty("/Data/DeamtT", common.Common.numberWithCommas(value));
			
			if(oController._ListCondJSonModel.getProperty("/Data/Etpay") != -1){
				oController.onChangeData();
			}
		},
		
		onChangeData : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_PensionPay.List");
			var oController = oView.getController();

			var oEtpay = oController._ListCondJSonModel.getProperty("/Data/Etpay");
			if(oEtpay == -1) return;
			
			// 증감액
			var oDeamtT = oController._ListCondJSonModel.getProperty("/Data/DeamtT").replace(/,/g, "") * 1;
			if(oDeamtT == 0){
				return;
			}
			
			// 변경 전 금액
			var oSelfAmtT = oController._ListCondJSonModel.getProperty("/Data/SelfAmtT").replace(/,/g, "") * 1; // 개인부담금
			var oSuppAmtT = oController._ListCondJSonModel.getProperty("/Data/SuppAmtT").replace(/,/g, "") * 1; // 회사지원금
			var oTotalAmtT = oController._ListCondJSonModel.getProperty("/Data/TotalAmtT").replace(/,/g, "") * 1; // 합계
			
			// 에러 시 증감액, 변경후 개인부담금, 변경 후 합계 초기화
			var resetData = function(){
				oController._ListCondJSonModel.setProperty("/Data/DeamtT", "");
				oController._ListCondJSonModel.setProperty("/Data/SelfAmtAT", "");
				oController._ListCondJSonModel.setProperty("/Data/TotalAmtAT", "");
			};
			
			// validation check
			if(oEtpay == 0){ // 증액
				
				oDeamtT = oDeamtT + oSelfAmtT;
				
				if(oSelfAmtT + oDeamtT + oSuppAmtT > 990000){
					sap.m.MessageBox.error(oBundleText.getText("MSG_17015"), { // 합계는 99만원을 초과할 수 없습니다. 다시 입력하시기 바랍니다.
						onClose : resetData
					});
					
					return;
				}
			} else { // 감액
				if(oSelfAmtT < oDeamtT){
					sap.m.MessageBox.error(oBundleText.getText("MSG_17017"), { // 개인부담금이 0보다 작을 수는 없습니다. 다시 입력하시기 바랍니다.
						onClose : resetData
					});
					
					return;
				} else if((oSelfAmtT - oDeamtT) < oSuppAmtT){
					sap.m.MessageBox.error(oBundleText.getText("MSG_17016"), { // 회사지원금이 개인부담금을 초과할 수 없습니다. 다시 입력하시기 바랍니다.
						onClose : resetData
					});
					
					return;
				}
				
				oDeamtT = oSelfAmtT - oDeamtT;				
			}
			
			oController._ListCondJSonModel.setProperty("/Data/SelfAmtAT", (common.Common.numberWithCommas(oDeamtT))); // 변경 후 개인부담금
			oController._ListCondJSonModel.setProperty("/Data/TotalAmtAT", common.Common.numberWithCommas(oDeamtT + oSuppAmtT)); // 변경 후 합계
		},
		
		onPressSave : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_PensionPay.List");
			var oController = oView.getController();

			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			// validation check
			if(oData.Etpay == -1){
				sap.m.MessageBox.error(oBundleText.getText("MSG_17011")); // 신청구분을 선택하여 주십시오.
				return;
			} else if(!oData.DeamtT || oData.DeamtT.trim() == "" || oData.SelfAmtAT == ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_17012")); // 증/감액을 입력하여 주십시오.
				return;
			} else if(!oData.Checkbox || oData.Checkbox == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_17013")); // 동의해 주시기 바랍니다.
				return;
			}
			
			var onProcess = function(){
				var createData = {PensionPayTableInSet : [], PensionPayTableIn2Set : []};
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oController._Bukrs;
					createData.IConType = "3";
				
				var detail = {};
					detail.Pernr = oData.Pernr;
					detail.Etpay = oData.Etpay == 0 ? "1" : "2";
					detail.DeamtT = oData.DeamtT.replace(/,/g, "");
					detail.AppBeg = "\/Date(" + common.Common.getTime(new Date(oData.AppBeg)) + ")\/";
					detail.AppEnd = "\/Date(" + common.Common.getTime(new Date(oData.AppEnd)) + ")\/";
					
					createData.PensionPayTableInSet.push(detail);
					
				var oModel = sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");
				oModel.create("/PensionPaySet", createData, null,
				 		function(data,res){
				 			
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
				
				sap.m.MessageBox.success(oBundleText.getText("MSG_17004"), { // 신청되었습니다.
					onClose : oController.onSelectIcontabar
				});				
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			sap.m.MessageBox.confirm(oBundleText.getText("MSG_17003"), { // 신청하시겠습니까?
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35132261"}); // 첨단
			return new JSONModelHelper({name : "981014"}); // 기초
		} : null
		
	});

});