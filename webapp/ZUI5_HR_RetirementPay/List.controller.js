jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/makeTable"], 
	function (Common, CommonController, JSONModelHelper, MakeTable) {
	"use strict";

	return CommonController.extend("ZUI5_HR_RetirementPay.List", {

		PAGEID: "ZUI5_HR_RetirementPayList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		
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
			gDtfmt = this.getSessionInfoByKey("Dtfmt");	
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Bukrs : oController.getSessionInfoByKey("Persa").substring(0,1) == "D" ? "A100" : "1000",
						Pernr : oController.getSessionInfoByKey("Pernr"),
						Orgeh : oController.getSessionInfoByKey("Orgeh"),
						Langu : oController.getSessionInfoByKey("Langu"),
						Datum : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), 1, 9))
					}
				};
				
				oController._ListCondJSonModel.setData(vData);
				
				if(vData.Data.Bukrs == "1000"){
									// 당사입사일, 퇴직금기산일, 예상퇴직일, 근속기간, 평균급여, 평균상여, 평균임금, 지급률, 예상퇴직금
					var col_info = [{id: "Dat01", label: "{i18n>LABEL_73005}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
									{id: "Dat02", label: "{i18n>LABEL_73006}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
									{id: "Dat03", label: "{i18n>LABEL_73007}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
									{id: "Workym", label: "{i18n>LABEL_73008}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
									{id: "Bet02T", label: "{i18n>LABEL_73009}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
									{id: "Bet03T", label: "{i18n>LABEL_73010}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
									{id: "Bet01T", label: "{i18n>LABEL_73011}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
									{id: "Anzhl", label: "{i18n>LABEL_73012}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
									{id: "Bet04T", label: "{i18n>LABEL_73013}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
				} else {
									// 당사입사일, 퇴직금기산일, 예상퇴직일, 근속기간, 평균급여, 평균상여, 평균임금, 예상퇴직금
					var col_info = [{id: "Dat01", label: "{i18n>LABEL_73005}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
									{id: "Dat02", label: "{i18n>LABEL_73006}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
									{id: "Dat03", label: "{i18n>LABEL_73007}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true},
									{id: "Workym", label: "{i18n>LABEL_73008}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
									{id: "Bet02T", label: "{i18n>LABEL_73009}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
									{id: "Bet03T", label: "{i18n>LABEL_73010}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
									{id: "Bet01T", label: "{i18n>LABEL_73011}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
									{id: "Bet04T", label: "{i18n>LABEL_73013}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
				}
				
				MakeTable.makeColumn(oController, sap.ui.getCore().byId(oController.PAGEID + "_Table1"), col_info);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RetirementPay.List");
			var oController = oView.getController();
		
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RetirementPay.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");

			var oTable1 = sap.ui.getCore().byId(oController.PAGEID + "_Table1");
			var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_Table2");
			var oTable3 = sap.ui.getCore().byId(oController.PAGEID + "_Table3");

			var oJSONModel = oTable1.getModel();
			var vData = {Data1 : [], Data2 : [], Data3 : []};

			for(var i=1; i<=3; i++){
				var oColumn = eval("oTable" + i + ".getColumns();");
				for(var j=0; j<oColumn.length; j++){
					oColumn[j].setFiltered(false);
					oColumn[j].setSorted(false);
				}
			}
			
			var search = function(){
				var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
				var createData = {ExpectRetirementPayTableIn1Set : [], ExpectRetirementPayTableIn2Set : [], ExpectRetirementPayTableIn3Set : []};
					createData.IConType = "1";
					createData.IBukrs = oData.Bukrs;
					createData.IPernr = oData.Pernr;
					createData.ILangu = oData.Langu;
					createData.IDatum = "\/Date(" + common.Common.getTime(oData.Datum) + ")\/";

				oModel.create("/ExpectRetirementPayHeaderSet", createData, {
					success: function(data, res){
						if(data){
							// 조회조건 재설정
							if(data.IDatum){
								var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});

								data.IDatum = new Date(common.Common.getTime(data.IDatum));
								oController._ListCondJSonModel.setProperty("/Data/Datum", dateFormat.format(data.IDatum));
							}

							// 퇴직금 정보
							if(data.ExpectRetirementPayTableIn1Set && data.ExpectRetirementPayTableIn1Set.results){
								var data1 = data.ExpectRetirementPayTableIn1Set.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Idx = i;
									
									data1[i].Dat01 = data1[i].Dat01 ? new Date(common.Common.getTime(data1[i].Dat01)) : null;
									data1[i].Dat02 = data1[i].Dat02 ? new Date(common.Common.getTime(data1[i].Dat02)) : null;
									data1[i].Dat03 = data1[i].Dat03 ? new Date(common.Common.getTime(data1[i].Dat03)) : null;
									
									vData.Data1.push(data1[i]);
								}
							}

							// 평균급여 상세내역
							if(data.ExpectRetirementPayTableIn2Set && data.ExpectRetirementPayTableIn2Set.results){
								var data2 = data.ExpectRetirementPayTableIn2Set.results;
								
								for(var i=0; i<data2.length; i++){
									data2[i].Idx = i;
									data2[i].Yyyymm = data2[i].Yyyymm != "" ? 
														data2[i].Yyyymm.indexOf(".") == -1 ? 
															data2[i].Yyyymm.substring(0,4) + "." + data2[i].Yyyymm.substring(4) : data2[i].Yyyymm
														: ""
																		
									vData.Data2.push(data2[i]);
								}
							}

							// 평균상여 상세내역
							if(data.ExpectRetirementPayTableIn3Set && data.ExpectRetirementPayTableIn3Set.results){
								var data3 = data.ExpectRetirementPayTableIn3Set.results;
								
								for(var i=0; i<data3.length; i++){
									data3[i].Idx = i;
									data3[i].Yyyymm = data3[i].Yyyymm != "" ? 
														data3[i].Yyyymm.indexOf(".") == -1 ? 
															data3[i].Yyyymm.substring(0,4) + "." + data3[i].Yyyymm.substring(4) : data3[i].Yyyymm
														: "";
																		
									vData.Data3.push(data3[i]);
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

				oTable1.bindRows("/Data1");
				oTable2.bindRows("/Data2");
				oTable3.bindRows("/Data3");

				var height = parseInt(window.innerHeight - 300);
				var count = parseInt((height - 35) / 38);

				oTable1.setVisibleRowCount(vData.Data1.length);
				oTable2.setVisibleRowCount(vData.Data2.length < count ? vData.Data2.length : count);
				oTable3.setVisibleRowCount(vData.Data3.length < count ? vData.Data3.length : count);

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
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "35122694"});
		} : null
		
	});

});