jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.export.Spreadsheet");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/PageHelper",
	"common/AttachFileAction",
    "common/SearchOrg",
    "common/SearchUser1",
    "common/OrgOfIndividualHandler",
    "common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_OvertimeReport.List", {

		PAGEID: "ZUI5_HR_OvertimeReportList",
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
						Begda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), 1)),
						Endda : dateFormat.format(new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth())))),
						Bukrs : oController.getSessionInfoByKey("Bukrs3"), // 2021-05-07 Bukrs2
						Langu : oController.getSessionInfoByKey("Langu"),
						Persa : oController.getSessionInfoByKey("Persa")
					}
				};
				
				if(oController.getSessionInfoByKey("Persa").substring(0,1) == "D"){
					vData.Data.Pernr = oController.getSessionInfoByKey("Pernr");
					vData.Data.Ename = oController.getSessionInfoByKey("Ename");
				} else {
					vData.Data.Orgeh = oController.getSessionInfoByKey("Orgeh");
					vData.Data.Ename = oController.getSessionInfoByKey("Stext");
				}
				
				oController._ListCondJSonModel.setData(vData);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeReport.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_OvertimeReport.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeReport.List");
			var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeReport.List");
			var oController = oView.getController();
			
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // // ????????? ?????????????????????.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeReport.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oController.getBundleText("MSG_61001")); // ??????????????? ???????????? ????????????.
				return;
			}
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			var column = oTable.getColumns();
			for(var i=0; i<column.length; i++){
				column[i].setSorted(false);
				column[i].setFiltered(false);
			}
			
			var search = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
				
				var oModel = $.app.getModel("ZHR_DASHBOARD_SRV");
				var createData = {OvertimeRepNav : []};
					createData.IPernr = (oData.Pernr && oData.Pernr != "" ? oData.Pernr : "");
					createData.IOrgeh = (oData.Orgeh && oData.Orgeh != "" ? oData.Orgeh : "");
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oData.Langu;

				oModel.create("/OvertimeReportSet", createData, {
					success: function(data, res){
						if(data){
							if(data.OvertimeRepNav && data.OvertimeRepNav.results){
								var data1 = data.OvertimeRepNav.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Begda = data1[i].Begda ? new Date(common.Common.getTime(data1[i].Begda)) : null;
									data1[i].Beguz = data1[i].Beguz == "" ? "" : data1[i].Beguz.substring(0,2) + ":" + data1[i].Beguz.substring(2,4);
									data1[i].Enduz = data1[i].Enduz == "" ? "" : data1[i].Enduz.substring(0,2) + ":" + data1[i].Enduz.substring(2,4);
									
									data1[i].Stdaz = parseFloat(data1[i].Stdaz) == 0 ? "" : data1[i].Stdaz;
									data1[i].Ovtim = parseFloat(data1[i].Ovtim) == 0 ? "" : data1[i].Ovtim;
									data1[i].Ngtim = parseFloat(data1[i].Ngtim) == 0 ? "" : data1[i].Ngtim;
									
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
				
				var row = parseInt((window.innerHeight - 260) / 37);
				oTable.setVisibleRowCount(vData.Data.length < row ? vData.Data.length : row);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}          
				
				oController._BusyDialog.close();
				
			}
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeReport.List");
			var oController = oView.getController();
			
			var initData = {
                Percod: oController.getSessionInfoByKey("Percod"),
                Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                Langu: oController.getSessionInfoByKey("Langu"),
                Molga: oController.getSessionInfoByKey("Molga"),
                Datum: new Date(),
                Mssty: "",
            },
            callback = function(o) {
                // oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                // oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                // oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
               
                oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
				oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
               
                if(o.Otype == "P"){
                	oController._ListCondJSonModel.setProperty("/Data/Pernr", o.Objid);
                } else if(o.Otype == "O"){
                	oController._ListCondJSonModel.setProperty("/Data/Orgeh", o.Objid);
                }
                
                oController._ListCondJSonModel.setProperty("/Data/Ename", o.Stext);
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
        
        /**
         * @brief ??????-???????????? > ???????????? ?????? ?????? event handler
         */
		displayMultiOrgSearchDialog: function (oEvent) {
			var oController = $.app.getController();

			SearchOrg.oController = oController;
			SearchOrg.vActionType = "Multi";
			SearchOrg.vCallControlId = oEvent.getSource().getId();
			SearchOrg.vCallControlType = "MultiInput";

			if (!oController.oOrgSearchDialog) {
				oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
				$.app.getView().addDependent(oController.oOrgSearchDialog);
			}

			oController.oOrgSearchDialog.open();
		},

		onESSelectPerson : function(data){
			var oController = $.app.getController();
			
			oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
			oController._ListCondJSonModel.setProperty("/Data/Pernr", data.Pernr);
			oController._ListCondJSonModel.setProperty("/Data/Ename", data.Ename);

			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},
        
        onExport : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_OvertimeReport.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			
			var filename = oController.getBundleText("LABEL_61001"); // ????????????
			
			var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: filename + ".xlsx"
			};
	
			var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
				oSpreadsheet.build();		
		},
        
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20140255"});
		} : null
		
	});

});