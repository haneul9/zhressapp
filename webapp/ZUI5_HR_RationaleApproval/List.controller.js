jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/PageHelper"], 
	function (Common, CommonController, JSONModelHelper, PageHelper) {
	"use strict";

	return CommonController.extend("ZUI5_HR_RationaleApproval.List", {

		PAGEID: "ZUI5_HR_RationaleApprovalList",
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
						Bukrs : oController.getSessionInfoByKey("Bukrs3"),
						Pernr : oController.getSessionInfoByKey("Pernr"),
						Orgeh : oController.getSessionInfoByKey("Orgeh"),
						Langu : oController.getSessionInfoByKey("Langu")
					}
				};
				
				oController._ListCondJSonModel.setData(vData);
				
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				
				if(oController.getSessionInfoByKey("Persa").substring(0,1) != "D"){
									// No,  상태, 근무일자, 사번, 성명, 근무형태
					var col_info = [{id: "No", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
									{id: "Status", label: "{i18n>LABEL_67004}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "160px"},
									{id: "Begda", label: "{i18n>LABEL_67005}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width : "100px"},
									{id: "Pernr", label: "{i18n>LABEL_00191}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
									{id: "Ename", label: "{i18n>LABEL_00121}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
									{id: "Rtext", label: "{i18n>LABEL_67006}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "160px"},
									// 출근시간, 퇴근시간, 법정휴게, 추가휴게
									{id: "Enfbg", label: "{i18n>LABEL_67011}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									{id: "Enfen", label: "{i18n>LABEL_67012}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									{id: "Lnctm", label: "{i18n>LABEL_67021}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									{id: "Break", label: "{i18n>LABEL_67022}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									//  반려사유
									{id: "Retrn", label: "{i18n>LABEL_67014}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "30%"}];
				} else {
									// No,  상태, 근무일자, 사번, 성명, 근무형태
					var col_info = [{id: "No", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
									{id: "Status", label: "{i18n>LABEL_67004}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "160px"},
									{id: "Begda", label: "{i18n>LABEL_67005}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width : "100px"},
									{id: "Pernr", label: "{i18n>LABEL_00191}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
									{id: "Ename", label: "{i18n>LABEL_00121}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
									{id: "Rtext", label: "{i18n>LABEL_67006}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "160px"},
									// 입문시간, 출문시간, 근태여부, 신청유형
									{id: "Entbg", label: "{i18n>LABEL_67007}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									{id: "Enten", label: "{i18n>LABEL_67008}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									{id: "Tprog1", label: "{i18n>LABEL_67009}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
									{id: "Tprog1", label: "{i18n>LABEL_67010}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
									// 출근시간, 퇴근시간
									{id: "Enfbg", label: "{i18n>LABEL_67011}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									{id: "Enfen", label: "{i18n>LABEL_67012}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									// 인정시간, 비근무시간, 반려사유
									{id: "Lnctm", label: "{i18n>LABEL_67013}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									{id: "Break", label: "{i18n>LABEL_67023}", plabel: "", resize: true, span: 0, type: "time", sort: true, filter: true, width : "85px"},
									{id: "Retrn", label: "{i18n>LABEL_67014}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "30%"}];
				}
				
				common.makeTable.makeColumn(oController, oTable, col_info);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_RationaleApproval.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
		
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
			
			oController._ListCondJSonModel.setProperty("/Data/Count", 0);
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");

			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			// filter, sort 제거
			var oColumn = oTable.getColumns();
			for(var i=0; i<oColumn.length; i++){
				oColumn[i].setFiltered(false);
				oColumn[i].setSorted(false);
			}
			
			var search = function(){
				var oModel = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
				var createData = {RationaleAppNav : []};
					createData.IConType = "1";
					createData.IBukrs = oData.Bukrs;
					createData.IMolga = oData.Molga;
					createData.IPernr = oData.Pernr;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(1800, 0, 1)) + ")\/";
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(9999, 11, 31)) + ")\/";
					createData.ILangu = oData.Langu;
					createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/";

				oModel.create("/RationaleApprovalSet", createData, {
					success: function(data, res){
						if(data){
							if(data.RationaleAppNav && data.RationaleAppNav.results){
								var data1 = data.RationaleAppNav.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Idx = i;
									data1[i].No = i+1;
									
									data1[i].Begda = new Date(common.Common.getTime(data1[i].Begda));
									
									// 법정휴게
									data1[i].Lnctm = (data1[i].Combg != "" && data1[i].Comen != "" ) ? (data1[i].Combg + data1[i].Comen) : "";
									data1[i].Lnctm = data1[i].Lnctm == "0000" ? "" : data1[i].Lnctm;
									// 추가휴게
									data1[i].Break = (data1[i].Brkbg != "" && data1[i].Brken != "") ? (data1[i].Brkbg + data1[i].Brken) : "";
									data1[i].Break = data1[i].Break == "0000" ? "" : data1[i].Break;
									
									// 2021-05-07 기본값 '승인'으로 세팅
									data1[i].Status = "99";
									
									vData.Data.push(data1[i]);
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
				
				var height = parseInt(window.innerHeight - 175);
				var count = parseInt((height - 35) / 38);
				
				oTable.setVisibleRowCount(vData.Data.length < count ? vData.Data.length : count);
				
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
		
		onChangeStatus : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();
			
			var oJSONModel = sap.ui.getCore().byId(oController.PAGEID + "_Table").getModel();
				oJSONModel.setProperty("/Data/" + oData.Idx + "/Retrn", "");
		},
		
		// 테이블 행 선택 시 결재건수 계산하여 세팅
		onSelectionChange : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var count = oTable.getSelectedIndices().length;
			
			oController._ListCondJSonModel.setProperty("/Data/Count", count);
		},
		
		// 결재
		onPressSave : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_RationaleApproval.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			
			var oIndices = oTable.getSelectedIndices();
			
			if(oIndices.length == 0){
				sap.m.MessageBox.error(oController.getBundleText("MSG_67001")); // 일괄결재 대상 데이터를 선택하여 주십시오.
				return;
			}
			
			var oModel = $.app.getModel("ZHR_BATCHAPPROVAL_SRV");
			var createData = {RationaleAppNav : []};
			
			// validation check
			for(var i=0; i<oIndices.length; i++){
				var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
				
				var data = oJSONModel.getProperty(sPath);
				if(!data.Status || data.Status == "" || data.Status == "00"){
					sap.m.MessageBox.error(oController.getBundleText("MSG_67002")); //상태를 선택하여 주십시오.
					return;
				} else if(data.Status == "88" && (!data.Retrn || data.Retrn.trim() == "")){
					sap.m.MessageBox.error(oController.getBundleText("MSG_67003")); // 반려인 경우 반려사유를 입력하여 주십시오.
					return;
				}
				
				createData.RationaleAppNav.push(common.Common.copyByMetadata(oModel, "RationaleApprovalTab", data));
			}
			
			var process = function(){
				createData.IConType = "2";
				createData.IBukrs = oData.Bukrs;
				createData.IMolga = oData.Molga;
				createData.IPernr = oData.Pernr;
				createData.IBegda = "\/Date(" + common.Common.getTime(new Date(1800, 0, 1)) + ")\/";
				createData.IEndda = "\/Date(" + common.Common.getTime(new Date(9999, 11, 31)) + ")\/";
				createData.ILangu = oData.Langu;
				createData.IDatum = "\/Date(" + common.Common.getTime(new Date()) + ")\/";
				
				oModel.create("/RationaleApprovalSet", createData, {
					success: function(data, res){
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
				
				sap.m.MessageBox.success(oController.getBundleText("MSG_67005"), { // 일괄결재가 완료되었습니다.
					onClose : oController.onPressSearch
				});
			};
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_67004"), { // 일괄결재하시겠습니까?
				actions : ["YES", "NO"],
				onClose : function(fVal){
					if(fVal && fVal == "YES"){
						oController._BusyDialog.open();
						setTimeout(process, 100);
					}
				}
			});
		},
        
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "35122694"});
		} : null
		
	});

});