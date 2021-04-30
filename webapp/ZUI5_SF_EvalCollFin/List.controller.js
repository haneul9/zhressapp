jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.export.Spreadsheet");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper"], 
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_SF_EvalCollFin.List", {
	
		PAGEID: "EvalCollFinList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : null, 
		
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
			
			var vData = {
				Data : {
					// Appye : new Date().getFullYear() + "",
					Appye : "2020",
					Count0 : 0,	Count1 : 0, Count2 : 0, Count3 : 0, Count4 : 0
				}
			};
			
			oController._ListCondJSonModel.setData(vData);
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
				
			oController.onPressSearch();
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalCollFin.List");
			var oController = oView.getController();
			
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalCollFin.List");
			var oController = oView.getController(); 
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			if(!oData.Appye){
				sap.m.MessageBox.error(oBundleText.getText("MSG_20001")); // 평가연도를 선택하여 주십시오.
				return;
			} else if(!oView.getModel("session").getData().Pernr || oView.getModel("session").getData().Pernr == "00000000"){
				sap.m.MessageBox.error(oBundleText.getText("MSG_18001")); // 사번이 전송되지 않았습니다.
				return;
			}
			
			// 데이터 조회
			var search = function(){
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var oJSONModel = oTable.getModel();
				var vData = {Data : []};
				
				// filter, sort 제거
				var oColumns = oTable.getColumns();
				for(var i=0; i<oColumns.length; i++){
					oColumns[i].setFiltered(false);
					oColumns[i].setSorted(false);
				}
				
				// 과거연도 세팅
				sap.ui.getCore().byId(oController.PAGEID + "_Year1").setText(((oData.Appye * 1) - 1));
				sap.ui.getCore().byId(oController.PAGEID + "_Year2").setText(((oData.Appye * 1) - 2));
				sap.ui.getCore().byId(oController.PAGEID + "_Year3").setText(((oData.Appye * 1) - 3));
				
				var count1 = 0, count2 = 0, count3 = 0, count4 = 0;
				
				var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");
				
				var createData = {TableIn : []};
					createData.IConType = "1";
					createData.IEmpid = oView.getModel("session").getData().Pernr;
					createData.IAppye = oData.Appye;
					
				oModel.create("/EvaAgreeListSet", createData, {
					success: function(data,res){
						if(data){
							if(data.TableIn && data.TableIn.results.length){
								for(var i=0; i<data.TableIn.results.length; i++){
									data.TableIn.results[i].Idx = (i+1);
									data.TableIn.results[i].Appye = oData.Appye;
									
									// 2021-01-04 사번 format 변경
									data.TableIn.results[i].Pernr = (data.TableIn.results[i].Pernr * 1) + "";
									
									data.TableIn.results[i].Pepnt = data.TableIn.results[i].Pepnt == "0" ? "" : parseFloat(data.TableIn.results[i].Pepnt);
									data.TableIn.results[i].Cepnt = data.TableIn.results[i].Cepnt == "0" ? "" : parseFloat(data.TableIn.results[i].Cepnt);
									data.TableIn.results[i].Mepnt = data.TableIn.results[i].Mepnt == "0" ? "" : parseFloat(data.TableIn.results[i].Mepnt);
									
									vData.Data.push(data.TableIn.results[i]);
									
									switch(data.TableIn.results[i].Evstaus){
										case "35": // 이의제기 신청
											count1++;
											break;
										case "40": // 인정
											count3++;
											break;
										case "20": // 평가완료
											count2++;
											break;
										case "50": // 합의
											count4++;
											break;
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
				
				sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").setSelectedKey("All");
				
				oController._ListCondJSonModel.setProperty("/Data/Count0", vData.Data.length);
				oController._ListCondJSonModel.setProperty("/Data/Count1", count1);
				oController._ListCondJSonModel.setProperty("/Data/Count2", count2);
				oController._ListCondJSonModel.setProperty("/Data/Count3", count3);
				oController._ListCondJSonModel.setProperty("/Data/Count4", count4);
				
				oTable.setVisibleRowCount((vData.Data.length >= 10 ? 10 : vData.Data.length));
				oJSONModel.setData(vData);
				oTable.bindRows("/Data");
				
				oController._BusyDialog.close();
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
			}
			
			oController._BusyDialog.open();
			setTimeout(search, 300);
		},
		
		// 이의제기 사유, 확인자 의견
		onPressDetail : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalCollFin.List");
			var oController = oView.getController(); 
			
			var oData = Object.assign({}, oEvent.getSource().getCustomData()[0].getValue());
			
			if(!oController._DetailDialog){
				oController._DetailDialog = sap.ui.jsfragment("ZUI5_SF_EvalCollFin.fragment.Detail", oController);
				oView.addDependent(oController._DetailDialog);
			}
			
			oController._DetailDialog.getModel().setData({Data : oData});
			oController._DetailDialog.open();
		},
		
		// 40 : 인정, 50 : 반려
		onPressSave : function(oEvent, vPrcty){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalCollFin.List");
			var oController = oView.getController(); 
		
			var oData = oController._DetailDialog.getModel().getProperty("/Data");
			
			// validation check
			if(!oData.Rvtxt || oData.Rvtxt.trim() == ""){
				sap.m.MessageBox.error(oBundleText.getText("MSG_20002")); // 확인자 의견을 입력하여 주십시오.
				return;
			}
			
			var confirmMessage = "", successMessage = "";
			if(vPrcty == "40"){
				confirmMessage = oBundleText.getText("MSG_20005"); // 인정하시겠습니까?
				successMessage = oBundleText.getText("MSG_20006"); // 인정되었습니다.
			} else { 
				confirmMessage = oBundleText.getText("MSG_20003"); // 반려하시겠습니까?
				successMessage = oBundleText.getText("MSG_20004"); // 반려되었습니다.
			}
			
			var saveProcess = function(){
				var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");
				var createData = {TableIn : []};
					createData.IConType = "2";
					createData.IEmpid = oData.Pernr;
					createData.IAppye = oData.Appye;
					createData.IRvper = oView.getModel("session").getData().Pernr;
					createData.IRvtxt = oData.Rvtxt;
					createData.IRvdat = common.Common.adjustGMTOdataFormat(new Date());
					createData.IRvtim = common.Common.getCurrentTimeOdataFormat();
					createData.IEvstaus = vPrcty;
				
				oModel.create("/EvaAgreeListSet", createData, {
					success: function(data,res){
						if(data){
				
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
					onClose : function(oEvent){
						oController._DetailDialog.close();
						oController.onPressSearch(oEvent);
					}
				});
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					oController._BusyDialog.open();
					setTimeout(saveProcess, 100);
				}
			};
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		// 1 : 평가결과조회, 2 : 사원프로파일
		onPressUserinfo : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalCollFin.List");
			var oController = oView.getController(); 
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			if(Flag == "1"){
				 if(!oController._EvalResultDialog){
				 	oController._EvalResultDialog = sap.ui.jsfragment("fragment.EvalResult", oController);
				 	oView.addDependent(oController._EvalResultDialog);
				 }
				 
				 common.SearchEvalResult.userId = oData.Pernr;
				 common.SearchEvalResult.Year = oData.Appye;
				 
				 oController._EvalResultDialog.open();
				 
			} else if(Flag == "2"){
				 if(!oController._EmpProfileDialog){
			 		oController._EmpProfileDialog = sap.ui.jsfragment("fragment.EmpProfile", oController);
			 		oView.addDependent(oController._EmpProfileDialog);
				 }
				 
				 common.SearchEmpProfile.userId = oData.Pernr;
				 common.SearchEmpProfile.Appye = oData.Appye;
				 
				 oController._EmpProfileDialog.open();
			}
		},
		
		handleIconTabBarSelect : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalCollFin.List");
			var oController = oView.getController(); 
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"); 
		
			var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
			
			if(sKey == "All"){ 
				oTable.bindRows({path: "/Data"});
			} else {
				var oFilters = [];	
					oFilters.push(new sap.ui.model.Filter("Evstaus", "EQ", sKey));
				var combinedFilter = new sap.ui.model.Filter(oFilters);
				
				oTable.bindRows({path: "/Data", filters: combinedFilter});
			}
		},
		
		onExport : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_SF_EvalCollFin.List");
			var oController = oView.getController(); 
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			 
			// 과거이력 연도 변경
			if(oController._Columns && oController._Columns.length){
				var count = 1;
				for(var i=0; i<oController._Columns.length; i++){
					if(oController._Columns[i].label == ""){
						oController._Columns[i].label = oBundleText.getText("LABEL_20023") + "-" + ((oController._ListCondJSonModel.getProperty("/Data/Appye") * 1) - count);
						count++;
					}
				}
			}
			
			var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oBundleText.getText("LABEL_20001") + ".xlsx" // 결과조회
			};
	
			var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
				oSpreadsheet.build();		
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20115020"});
			// return new JSONModelHelper({name: "20001003"});
			// return new JSONModelHelper({name: "20090028"});
		} : null
	});

});