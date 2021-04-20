jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.export.Spreadsheet");

sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/AttachFileAction",
    "../common/SearchOrg",
    "../common/SearchUser1",
    "../common/OrgOfIndividualHandler",
    "../common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_FlexworktimeStatus.List", {

		PAGEID: "ZUI5_HR_FlexworktimeStatusList",
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
				
			// this.getView().addStyleClass("sapUiSizeCompact");
			this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			var oLoginData = $.app.getModel("session").getData();
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Werks : $.app.getModel("session").getData().Persa,
						Bukrs : $.app.getModel("session").getData().Bukrs,
						Pernr : $.app.getModel("session").getData().Pernr,
						Zyymm : today.getFullYear() + (today.getMonth() + 1 < 10 ? ("0" + (today.getMonth()+1)) : (today.getMonth()+1))
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_FlexworktimeStatus.List",
			    	  Data : {}
			      }
			});
		},
		
		onChangeDate : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
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
				
				var oModel = sap.ui.getCore().getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FlexWorktime1Nav : [], FlexWorktime2Nav : []};
					createData.Werks = oData.Werks;
					createData.Pernr = oData.Pernr;
					createData.Zyymm = oData.Zyymm;
					createData.Prcty = "1";

				oModel.create("/FlexworktimeSummarySet", createData, null,
					function(data, res){
						if(data){
							if(data.FlexWorktime1Nav && data.FlexWorktime1Nav.results){
								var data1 = data.FlexWorktime1Nav.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Idx = i;
									data1[i].Datum = data1[i].Datum ? new Date(common.Common.setTime(data1[i].Datum)) : null;
									
									vData.Data.push(data1[i]);
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
				
				oJSONModel.setData(vData);
				oTable.bindRows("/Data");
				
				var row = parseInt((window.innerHeight - 200) / 37);
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_FlexworktimeStatus.List");
			var oController = oView.getController();
			
			var initData = {
                Percod: $.app.getModel("session").getData().Percod,
                Bukrs: $.app.getModel("session").getData().Bukrs2,
                Langu: $.app.getModel("session").getData().Langu,
                Molga: $.app.getModel("session").getData().Molga,
                Datum: new Date(),
                Mssty: "",
            },
            callback = function(o) {
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
		
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		},
		
		onChangeTime : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_48017")); // 잘못된 시간형식입니다.
				oEvent.getSource().setValue("");
				return;
			}
		},
		
		makeTable : function(oController, oTable, col_info){
			
			for(var i=0; i<col_info.length; i++){
				var oColumn = new sap.ui.table.Column({
					flexible : false,
		        	autoResizable : true,
		        	resizable : true,
					showFilterMenuEntry : true,
					filtered : false,
					sorted : false,
					hAlign : (col_info[i].align && col_info[i].align != "" ? col_info[i].align : "Center"),
					width : (col_info[i].width && col_info[i].width != "" ? col_info[i].width : ""),
					multiLabels : [new sap.ui.commons.TextView({text : col_info[i].label, textAlign : "Center", width : "100%"}).addStyleClass("L2PFontFamily")]
				});
				
				if(col_info[i].plabel != ""){
					oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].plabel, textAlign : "Center", width : "100%"}).addStyleClass("L2PFontFamily"));
					oColumn.setHeaderSpan([col_info[i].span, 1]);
				}
				
				var oTemplate;
				
				switch(col_info[i].type){
					case "date":
						oTemplate = new sap.ui.commons.TextView({
										text : {
											path : col_info[i].id, 
											type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
										},
										textAlign : "Center",
										tooltip : " "
									}).addStyleClass("FontFamily");
						break;
					case "timepicker":
						oTemplate = new sap.m.TimePicker({
										valueFormat : "HHmm",
										 displayFormat : "HH:mm",
							        	 value : "{" + col_info[i].id + "}",
							        	 minutesStep : 10,
							        	 width : "100%", 
							        	 textAlign : "Begin",
	                                	 editable : {
	                                    	path : "Offyn",
	                                    	formatter : function(fVal){
	                                    		return fVal == "" ? true : false;
	                                    	}
	                                	 },
	                                	 customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
	                                	 change : oController.onChangeTime
									});
						break;
					case "combobox":
						oTemplate = new sap.m.ComboBox({
										selectedKey : "{" + col_info[i].id + "}",
										width : "100%",
										items : [new sap.ui.core.Item({key : "1", text : "01:00"}),
												 new sap.ui.core.Item({key : "2", text : "00:30"})],
										editable : {
											path : "Offyn",
											formatter : function(fVal){
												return fVal == "" ? true : false;
											}
										}
									});
						break;
					case "time":
						oTemplate = new sap.ui.commons.TextView({
										text : {
											path : col_info[i].id,
											formatter : function(fVal){
												return (!fVal || fVal == "") ? "" : (fVal.substring(0,2) + ":" + fVal.substring(2,4));
											}
										},
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
										tooltip : " "
									});
						break;
					default:
						oTemplate = new sap.ui.commons.TextView({
										text : "{" + col_info[i].id + "}",
										textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center",
										tooltip : " "
									});
				}
				
				oColumn.setTemplate(oTemplate);
				oTable.addColumn(oColumn);
			}	
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20060040"});
		} : null
		
	});

});