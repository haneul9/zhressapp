jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper"], 
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_EvalApResult.List", {

		PAGEID: "EvalApResultList",
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
			
			if(!oController._ListCondJSonModel.getProperty("/Data")){
				var oPhoto = "";
				
				new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + oController.getView().getModel("session").getData().Pernr + "' and photoType eq '1'")
									 .select("photo")
									 .setAsync(false)
									 .attachRequestCompleted(function(){
											var data = this.getData().d;
											
											if(data && data.results.length){
												oPhoto = "data:text/plain;base64," + data.results[0].photo;
											} else {
												oPhoto = "images/male.jpg";
											}
									 })
									 .attachRequestFailed(function() {
											oPhoto = "images/male.jpg";
									 })
									 .load();
							 
				var vData = {
					Data : Object.assign({photo : oPhoto}, oController.getView().getModel("session").getData())
				};
				
				oController._ListCondJSonModel.setData(vData);
				
				// table column 설정
				var col_info;
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				
				if(vData.Data.Bukrs == "A100"){ // 첨단
								// 평가연도, 업적(상), 업적(하), 역량
					col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
								{id: "Apyear", label: oBundleText.getText("LABEL_07301"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "ApgrdTP1", label: oBundleText.getText("LABEL_07406"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "ApgrdTP2", label: oBundleText.getText("LABEL_07407"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "ApgrdTC1", label: oBundleText.getText("LABEL_07408"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
				} else { // 기초
								// 대상연도, 조직평가, 업적평가, 역량평가, 종합평가
					col_info = [{id: "Apyear", label: oBundleText.getText("LABEL_07401"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "ApOrgD", label: oBundleText.getText("LABEL_07402"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								// {id: "ApOrkLd", label: oBundleText.getText("LABEL_07403"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								// {id: "ApAbiD", label: oBundleText.getText("LABEL_07404"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "ApTotD", label: oBundleText.getText("LABEL_07405"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
				}
				
				common.makeTable.makeColumn(oController, oTable, col_info);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_EvalApResult.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			// filter, sort 제거
			var oColumns = oTable.getColumns();
			for(var i=0; i<oColumns.length; i++){
				oColumns[i].setFiltered(false);
				oColumns[i].setSorted(false);
			}
			
			var search = function(){
				var oPath = "";
				var createData = {TableIn : []};
				
				if(oData.Bukrs == "A100"){ // 첨단
					oPath = "/AppraisalHistorySet";
					
					createData.IConType = "1";
					createData.IPernr = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.IDatum = "\/Date("+ common.Common.getTime(new Date())+")\/";
				} else { // 기초
					oPath = "/ApResultESet";
					
					createData.IBukrs = oData.Bukrs;
					createData.IEePernr = oData.Pernr;
				}
					
				var oModel = $.app.getModel("ZHR_APPRAISAL2_SRV");
				
				oModel.create(oPath, createData, {
					success: function(data, res){
						if(data){
							if(data.TableIn && data.TableIn.results){
								for(var i=0; i<data.TableIn.results.length; i++){
									data.TableIn.results[i].Idx = (i+1);
									
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
				
				oJSONModel.setData(vData);
				oTable.bindRows("/Data");
				oTable.setVisibleRowCount((vData.Data.length >= 10) ? 10 : vData.Data.length);
				
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
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20120220"});
			// return new JSONModelHelper({name: "35132261"});
			return new JSONModelHelper({name: "991004"});
		} : null
		
	});

});