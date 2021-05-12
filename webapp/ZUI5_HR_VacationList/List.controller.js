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

	return CommonController.extend("ZUI5_HR_VacationList.List", {

		PAGEID: "ZUI5_HR_VacationList2",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		
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
				}, this);
				
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			var oLoginData = $.app.getModel("session").getData();
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Werks : oLoginData.Werks,
						Pernr : oLoginData.Pernr,
						Orgeh : "",
						Ename : oLoginData.Ename,
						Begda : new Date(today.getFullYear(), today.getMonth(), 1),
						Endda : new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth()))),
						Chief : $.app.getModel("session").getData().Chief
						// Tmdat : dateFormat.format(new Date()),
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_VacationList.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_VacationList.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_VacationList.List");
			var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02047"));
				oEvent.getSource().setValue("");
				oController._ListCondJSonModel.setProperty("/Data/Endda", "");
				return;
			}
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_VacationList.List");
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
				
				var oModel = $.app.getModel("ZHR_LEAVE_APPL_SRV");
				var createData = {VacationNav : []};
					createData.IPernr = (oData.Pernr && oData.Pernr != "" ? oData.Pernr : "");
					createData.IOrgeh = (oData.Orgeh && oData.Orgeh != "" ? oData.Orgeh : "");
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda.getFullYear(), oData.Begda.getMonth(), oData.Begda.getDate())) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda.getFullYear(), oData.Endda.getMonth(), oData.Endda.getDate())) + ")\/";
					createData.IBukrs = $.app.getModel("session").getData().Bukrs;
					createData.ILangu = $.app.getModel("session").getData().Langu;

				oModel.create("/VacationListSet", createData, {
					success: function(data, res){
						if(data){
							if(data.VacationNav && data.VacationNav.results){
								var data1 = data.VacationNav.results;
									
								for(var i=0; i<data1.length; i++){
									data1[i].Begda = data1[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data1[i].Begda))) : "";
									data1[i].Endda = data1[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data1[i].Endda))) : "";
									
									if(data1[i].Beguz != "" && data1[i].Enduz != ""){
										data1[i].Time = data1[i].Beguz.substring(0,2) + ":" + data1[i].Beguz.substring(2,4)
														+ " ~ " + data1[i].Enduz.substring(0,2) + ":" + data1[i].Enduz.substring(2,4);
									}
									
									data1[i].Period = data1[i].Begda + " ~ " + data1[i].Endda;
									
																				// 신규신청						   // 삭제신청
									data1[i].Delapptx = data1[i].Delapp == "" ? oBundleText.getText("LABEL_48045") : oBundleText.getText("LABEL_48046");
									
									data1[i].Kaltg = parseFloat(data1[i].Kaltg);
									
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
				
				var height = parseInt(window.innerHeight - 220);
				var count = parseInt((height - 35) / 38);
				oTable.setVisibleRowCount(vData.Data.length < count ? vData.Data.length : count);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}          
				
				oController._BusyDialog.close();
				
			}
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		onPressNew : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_VacationList.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_VacationList.Detail",
			      data : {
			    	  FromPageId : "ZUI5_HR_VacationList.List",
			    	  Status1 : ""
			      }
			});	
		},
		
		onPressTable : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_VacationList.List");
			var oController = oView.getController();
			
			var oData = null;
			
			if(Flag && Flag == "X"){
				oData = oEvent.getSource().getCustomData()[0].getValue();	
			} else {
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var sPath = oEvent.getParameters().rowBindingContext.sPath;
				
				oData = oTable.getModel().getProperty(sPath);
			}
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_VacationList.Detail",
			      data : Object.assign({FromPageId : "ZUI5_HR_VacationList.List"}, oData)
			});
		},
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_VacationList.List");
			var oController = oView.getController();
			
			var initData = {
                Percod: $.app.getModel("session").getData().Percod,
                Bukrs: $.app.getModel("session").getData().Bukrs2,
                Langu: $.app.getModel("session").getData().Langu,
                Molga: $.app.getModel("session").getData().Molga,
                Datum: new Date(),
                Mssty: ($.app.APP_AUTH == "M" ? $.app.APP_AUTH : "")
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
         * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
         */
        displayMultiOrgSearchDialog: function (oEvent) {
            SearchOrg.oController = this.oController;
            SearchOrg.vActionType = "Multi";
            SearchOrg.vCallControlId = oEvent.getSource().getId();
            SearchOrg.vCallControlType = "MultiInput";

            if (!this.oOrgSearchDialog) {
                this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this.oController);
                $.app.getView().addDependent(this.oOrgSearchDialog);
            }

            this.oOrgSearchDialog.open();
        },

		onESSelectPerson : function(data){
			var oController = $.app.getController();

			oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
			oController._ListCondJSonModel.setProperty("/Data/Pernr", data.Pernr);
			oController._ListCondJSonModel.setProperty("/Data/Ename", data.Ename);

			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},
        
        onPressStext : function(oEvent){
        	var oView = sap.ui.getCore().byId("ZUI5_HR_VacationList.List");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();	
			if(oData.UrlA && oData.UrlA != ""){
				setTimeout(function() {
                    var width = 1000, height = screen.availHeight * 0.9,
                    left = (screen.availWidth - width) / 2,
                    top = (screen.availHeight - height) / 2,
                    popup = window.open(oData.UrlA, "smoin-approval-popup", [
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
        },
		
		onExport : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_VacationList.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			
			var filename = oBundleText.getText("LABEL_48063"); // 근태신청내역
			
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
			return new JSONModelHelper({name: "35110335"});
			return new JSONModelHelper({name: "20180126"});
			return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});