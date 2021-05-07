sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/unified/library",
		"../../common/SearchEvalSurvey",
	],
	function (Common, CommonController, JSONModelHelper, BusyIndicator, MessageBox, unifiedLibrary, SearchEvalSurvey) {
		"use strict";

		return CommonController.extend($.app.APP_ID, {
			PAGEID: "List",
			Appye : "", 
			Pernr : "",
			_ResultModel: new JSONModelHelper(), // 평가 결과
			_TResultModel: new JSONModelHelper(), // 평가 결과(임시 보관용)
			_BusyDialog : new sap.m.BusyDialog(),
			
			getUserId: function() {

				return this.getView().getModel("session").getData().name;
			},

			onInit: function () {
				this.setupView();

				this.getView()
					.addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);

				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function (oEvent) {
				var	oController = $.app.getController();
				oController.Appye = "2020";
				// oController.Pernr = this.getView().getModel("session").getData().Pernr;
				oController.Pernr = "20140099"; 
				oController.onSetContent();
				oController.onSearchEvalResult();
			},

			onAfterShow: function (oEvent) {
				// this.onTableSearch();
				// this.onClubMemberSearch(); 
			},
			
			onSetContent : function(oEvent){
				var	oController = $.app.getController();
				var vData = { Data : {} };
				
				var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");
				var createData = {TableIn2 : []};
					createData.IConType = "3";
					createData.IAppye = oController.Appye;
					createData.IEmpid = oController.Pernr;
					
				oModel.create("/EvaResultAgreeSet", createData, {
					success: function(data,res){
						if(data && data.TableIn2) {
							if(data.TableIn2.results && data.TableIn2.results.length){
								Object.assign(vData.Data, data.TableIn2.results[0]);         
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
				
				vData.Data.Appye = oController.Appye;
				oController._ResultModel.setData(vData);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return false;
				}
				
				var oYearText = sap.ui.getCore().byId(oController.PAGEID + "_YearText");
				oYearText.setText(vData.Data.Appye + oController.getBundleText("LABEL_16005"));
				// oController.onSearchEvalResult();
			},
			
					// 평가결과
			onSearchEvalResult : function(oEvent){
				var	oController = $.app.getController();
				var vData = {Data : {}},
				    vOData = oController._ResultModel.getData();
				
				var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");
				var createData = {TableIn : []};
					createData.IConType = "2";
					createData.IAppye = oController.Appye;
					createData.IEmpid = oController.Pernr;
					
				oModel.create("/EvaResultAgreeSet", createData, {
					success: function(data,res){
						if(data && data.TableIn) {
							if(data.TableIn.results && data.TableIn.results.length){
								data.TableIn.results[0].Pepnt = parseFloat(data.TableIn.results[0].Pepnt) == 0 ? "-" : parseFloat(data.TableIn.results[0].Pepnt); 
								data.TableIn.results[0].Cepnt = parseFloat(data.TableIn.results[0].Cepnt) == 0 ? "-" : parseFloat(data.TableIn.results[0].Cepnt); 
								data.TableIn.results[0].Mepnt = parseFloat(data.TableIn.results[0].Mepnt) == 0 ? "-" : parseFloat(data.TableIn.results[0].Mepnt); 
								data.TableIn.results[0].Pegrade = data.TableIn.results[0].Pegrade == "" ? "-" : data.TableIn.results[0].Pegrade;
								data.TableIn.results[0].Cograde = data.TableIn.results[0].Cograde == "" ? "-" : data.TableIn.results[0].Cograde;
								Object.assign(vData.Data, data.TableIn.results[0]);
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
				
				$.extend(true, vOData.Data, vData.Data);
				oController._ResultModel.setData(vOData);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return false;
				}
				
				if(vOData.Data.Evstaus == "20"){ // 평가상태가 20(평가완료) 인 경우, 설문 dialog를 먼저 열어준다.
					oController.onSetSurveyContent();
				}
			},
			
			onSetSurveyContent : function(oEvent){
				var oController = $.app.getController();
				var oContent = sap.ui.getCore().byId(oController.PAGEID + "_Content");
				
				SearchEvalSurvey.oController = oController;
				SearchEvalSurvey.userId = oController.Pernr;
				SearchEvalSurvey.Appye = oController.Appye;
			
			
				var vData = {Data : []};
				var createData = {TableIn : []};
					createData.IConType = "2";
					createData.IAppye = oController.Appye;
					createData.IEmpid = oController.Pernr;        
					
				var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");
				oModel.create("/EvaSurveySet", createData, {
					success: function(data,res){
						if(data && data.TableIn) {
							if(data.TableIn.results && data.TableIn.results.length){
								for(var i=0; i<data.TableIn.results.length; i++){
									vData.Data.push(data.TableIn.results[i]);
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
				    
				if(vData.Data.length == 0){ 
					sap.m.MessageBox.error(oController.getBundleText("MSG_16004"), { // 설문 데이터가 존재하지 않습니다. 
					});
					return;
				}
				
				// 항목별로 데이터를 생성해서 바인딩함
				var oData = {Data : []};
				var survey = [];
				
				var pushData = function(vData, survey){
					var detail = {};
						detail.Appye = vData.Appye;
						detail.Pernr = vData.Pernr;
						detail.Svygrp = vData.Svygrp;
						detail.Svyty = vData.Svyty;
						detail.Result = (vData.Svyty == "1" ? -1 : "");
						detail.Svyno = vData.Svyno;	  // 설문항목
						detail.Svyitm = vData.Svyitm; // 설문항목 text
						detail.Mandyn = vData.Mandyn; // 필수여부
						detail.Etctxtyn = vData.Etctxtyn ? vData.Etctxtyn : "";
						detail.Survey = survey;
			
					oData.Data.push(detail);
				}
				
				var check = "";
				for(var i=0; i<vData.Data.length; i++){
					if((i!=0 && (vData.Data[i].Svyno != vData.Data[i-1].Svyno))){
						check = "X";
						pushData(vData.Data[i-1], survey);
					}
					
					if(check == "X"){
						check = "";
						survey = [];
					}
					
					survey.push({key : vData.Data[i].Svyselno, text : vData.Data[i].Svyseltx});
				}
				
				// 마지막 데이터 추가
				pushData(vData.Data[(vData.Data.length-1)], survey);
				
				var oContent = sap.ui.getCore().byId(oController.PAGEID + "_Content");
					oContent.addItem(SearchEvalSurvey.makeMobileContent(oData));
				
				SearchEvalSurvey._JSONModel.setData(oData);
				// oContent.setModel(SearchEvalSurvey._JSONModel);
				// oContent.bindElement("/Data"); 
			},
			
			// 결과합의, 이의제기
			onPressSave : function(oEvent, vEvstaus){
				var oController = $.app.getController();
				var oIsstxt = oController._ResultModel.getProperty("/Data/Isstxt");
				// validation check
				if(vEvstaus == "40" && (!oIsstxt || oIsstxt.trim() == "")){
					sap.m.MessageBox.error(oController.getBundleText("MSG_15013")); // 이의제기 사유는 필수입력입니다.
					return;
				}
				
				var onProcess = function(){
					var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");
					var createData = {TableIn : []};
						createData.IConType = "1";
						createData.IAppye = oController._ResultModel.getProperty("/Data/Appye");
						createData.IEmpid = oController.Pernr;
						createData.IEvstaus = vEvstaus;
						
					if(vEvstaus == "40"){
						createData.TableIn.push({Isstxt : oIsstxt});
					}
					
					oModel.create("/EvaResultAgreeSet", createData, {
						success: function(data,res){
							if(data) {
								
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
						onClose : function(){
							var check = oController.onSearchEvalResult();
							
							if(check == false){
								oController.Error = "";
								sap.m.MessageBox.error(oController.ErrorMessage);
								return;
							}
						}
					});
				};
				
				var onBeforeSave = function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(onProcess, 100);
					}
				};
				
				var confirmMessage = "", successMessage = "";
				if(vEvstaus == "40"){
					confirmMessage = oController.getBundleText("MSG_15014"); // 이의제기 하시겠습니까?
					successMessage = oController.getBundleText("MSG_15015"); // 이의제기 완료되었습니다.
				} else {
					confirmMessage = oController.getBundleText("MSG_15016"); // 결과확인 하시겠습니까?   // 2020-01-06 결과합의→결과확인 텍스트 변경
					successMessage = oController.getBundleText("MSG_15017"); // 결과확인 완료되었습니다.
				}
				
				sap.m.MessageBox.confirm(confirmMessage, {
					actions : ["YES", "NO"],
					onClose : onBeforeSave
				});
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "20140099"});//9104340 ㅡ 20120137 ㅡ 20001003 ㅡ 20140299
			} : null
		});
	}
);
