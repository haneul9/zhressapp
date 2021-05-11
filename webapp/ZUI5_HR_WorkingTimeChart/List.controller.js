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

	return CommonController.extend("ZUI5_HR_WorkingTimeChart.List", {

		PAGEID: "ZUI5_HR_WorkingTimeChart",
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
			gDtfmt = $.app.getModel("session").getData().Dtfmt;		
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(oEvent){
			var oController = this;
			var oLoginData = $.app.getModel("session").getData();
			
			// 인사영역
			var oWerks = sap.ui.getCore().byId(oController.PAGEID + "_Werks");
				oWerks.destroyItems();
			
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var oPath = "/WerksListAuthSet?$filter=Percod eq '" + encodeURIComponent(oLoginData.Percod) + "' and Bukrs eq '" + oLoginData.Bukrs3 + "'";
				oPath += " and ICusrid eq '" + encodeURIComponent(sessionStorage.getItem('ehr.odata.user.percod')) + "'";
				oPath += " and ICusrse eq '" + encodeURIComponent(sessionStorage.getItem('ehr.session.token')) + "'";
				oPath += " and ICusrpn eq '" + encodeURIComponent(sessionStorage.getItem('ehr.sf-user.name')) + "'";
				oPath += " and ICmenuid eq '" + $.app.getMenuId() + "'";
			
			oModel.read(oPath, null, null, false,
						function(data, oResponse) {
							if(data && data.results.length) {
								for(var i=0; i<data.results.length; i++){
									oWerks.addItem(new sap.ui.core.Item({key : data.results[i].Persa, text : data.results[i].Pbtxt}));
								}					
							}
						},
						function(Res) {
							oController.Error = "E";
							if(Res.response.body){
								ErrorMessage = Res.response.body;
								var ErrorJSON = JSON.parse(ErrorMessage);
								if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
									oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
								} else {
									oController.ErrorMessage = ErrorMessage;
								}
							}
						}
			);
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
			}
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			var vData = null;
			
			if(oEvent.data.FromPageId && oEvent.data.FromPageId != ""){
				vData = {
					Data : {
						Werks : oEvent.data.Werks,
						Wrkty : oEvent.data.Wrkty,
						Tmdat : oEvent.data.Tmdat,
						Key : "1",
						Disty : oEvent.data.Disty ? oEvent.data.Disty : "1",
						Lowyn : oEvent.data.Lowyn ? oEvent.data.Lowyn : "",
						FromPageId : oEvent.data.FromPageId,
						Orgeh : oEvent.data.Orgeh ? oEvent.data.Orgeh : "",
						Chief : $.app.getModel("session").getData().Chief
					}
				};
				
			} else if(!oController._ListCondJSonModel.getProperty("/Data")){
				vData = {
					Data : {
						Werks : oLoginData.Persa,
						Tmdat : dateFormat.format(new Date()),
						Key : "1",
						Wrkty : "1",
						Disty : "1",
						Orgeh : (gAuth != "H" ? $.app.getModel("session").getData().Orgeh : ""),
						Ename : (gAuth != "H" ? $.app.getModel("session").getData().Stext : ""),
						Chief : $.app.getModel("session").getData().Chief
					}
				};
			}
			
			oController._ListCondJSonModel.setData(vData);
			
			// 기준일자로 조회조건의 시작/종료일 세팅
			var dates = oController.onTimeDatePeriod(vData.Data.Tmdat);
			if(dates && dates.length > 0){
				oController._ListCondJSonModel.setProperty("/Data/Begda", dates[0]);
				oController._ListCondJSonModel.setProperty("/Data/Endda", dates[1]);
			}
		},
		
		onAfterShow: function(oEvent){
			var oController = this;
			
			oController.onPressSearch(oEvent);
		},
		
		onBack : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_WorkingTimeChart.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
		
			var oScrollContainer = sap.ui.getCore().byId(oController.PAGEID + "_ScrollContainer");
			var oChart = sap.ui.getCore().byId(oController.PAGEID + "_Chart");
			var oScrollContainer2 = sap.ui.getCore().byId(oController.PAGEID + "_ScrollContainer2");
			
			switch(oController._ListCondJSonModel.getProperty("/Data/Key")){
				case "2":
					var height = parseInt(window.innerHeight - 220);
					oScrollContainer.setHeight(height + "px");
					oChart.setHeight((height - 40) + "px");
					
					break;
				case "3":
					var height = parseInt(window.innerHeight - 240);
					oScrollContainer2.setHeight(height + "px");
					
					var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
					var count = parseInt((height - 75) / 38);
					var oData = oTable.getModel().getProperty("/Data");
					
					if(!oData)
						oTable.setVisibleRowCount(1);
					else {
						if(oData.length < count)
							oTable.setVisibleRowCount(oData.length);
						else
							oTable.setVisibleRowCount(count);
							
						// oTable.setFixedBottomRowCount(1);
					}
					
					oTable.bindRows("/Data");
					
					break;
				case "1":
				default : 
					var height = parseInt((window.innerHeight - 210) / 2);
					
					oScrollContainer.setHeight(height + "px");
					oChart.setHeight((height - 40) + "px");
					oScrollContainer2.setHeight((height - 20) + "px");
	
					var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
					var count = parseInt((height - 95) / 38);
					var oData = oTable.getModel().getProperty("/Data");
					
					if(!oData)
						oTable.setVisibleRowCount(1);
					else {
						if(oData.length < count)
							oTable.setVisibleRowCount(oData.length);
						else
							oTable.setVisibleRowCount(count);
					
						// oTable.setFixedBottomRowCount(1);
					}
					
					oTable.bindRows("/Data");
			}	
		},
		
		onChangeDate : function(oEvent){
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oBundleText.getText(""));
				oEvent.getSource().setValue("");
				oController._ListCondJSonModel.setProperty("/Data/Endda", "");
				return;
			}
			
			// 시작,종료일 세팅
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
		
			var dates = oController.onTimeDatePeriod(oEvent.getSource().getValue());
		
			oController._ListCondJSonModel.setProperty("/Data/Begda", dates[0]);
			oController._ListCondJSonModel.setProperty("/Data/Endda", dates[1]);
		},
		
		onPressSegmentedButton : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
		
			oController._ListCondJSonModel.setProperty("/Data/Key", oEvent.getSource().getKey());
			oController.SmartSizing();
		},
		
		onPressSearch : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
			
			if(oController.setTable() == ""){
				return;
			};
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oChart = sap.ui.getCore().byId(oController.PAGEID + "_Chart");
			var oJSONModel = oChart.getModel();
			var vData = {Data : []};
			
			var search = function(){
				var oPath = "";
				var createData = {WorkingTimeHisNav : []};
					createData.IEmpid = $.app.getModel("session").getData().Pernr;
					createData.ILangu = $.app.getModel("session").getData().Langu;
					createData.IAusty = gAuth;
					createData.IWerks = oData.Werks;
					createData.IBukrs = oData.Werks;
					createData.IWrkty = oData.Wrkty;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
					createData.IOrgeh = oData.Orgeh;
				
				var oModel = $.app.getModel("ZHR_WORKSCHEDULE_SRV");
				oModel.create("/WorkingTimeHistorySet", createData, {
					success: function(data, res){
						if(data){
							if(data.WorkingTimeHisNav && data.WorkingTimeHisNav.results){
								for(var i=0; i<data.WorkingTimeHisNav.results.length; i++){
									data.WorkingTimeHisNav.results[i].Bashr = parseFloat(data.WorkingTimeHisNav.results[i].Bashr);
									data.WorkingTimeHisNav.results[i].Addhr = parseFloat(data.WorkingTimeHisNav.results[i].Addhr);
									
									vData.Data.push(data.WorkingTimeHisNav.results[i]);
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
		
		setTable : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
			
			var oScrollContainer = sap.ui.getCore().byId(oController.PAGEID + "_ScrollContainer2");
				oScrollContainer.destroyContent();
				
			var oTable = sap.ui.jsfragment("ZUI5_HR_WorkingTimeChart.fragment.Table", oController);
				oScrollContainer.addContent(oTable);

			// // 데이터 조회
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			if(!oData.Werks){
				sap.m.MessageBox.error(oBundleText.getText("MSG_46001")); // 인사영역을 선택하여 주십시오.
				return "";
			} else if(!oData.Wrkty){
				sap.m.MessageBox.error(oBundleText.getText("MSG_46002")); // 근무구분을 선택하여 주십시오.
				return "";
			} else if(!oData.Begda){
				sap.m.MessageBox.error(oBundleText.getText("MSG_46003")); // 조회일자를 입력하여 주십시오.
				return "";
			}
			
			var oJSONModel = oTable.getModel();
			var vData = {Data : []};
			
			var oModel = $.app.getModel("ZHR_WORKSCHEDULE_SRV");
			var createData = {WorkingTimeStatNav : []};
				createData.IEmpid = $.app.getModel("session").getData().Pernr;
				createData.ILangu = $.app.getModel("session").getData().Langu;
				createData.IAusty = gAuth;
				createData.IWerks = oData.Werks;
				createData.IBukrs = oData.Werks;
				createData.IWrkty = oData.Wrkty;
				createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
				createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
				createData.IDisty = oData.Disty;
				createData.IOrgeh = oData.Orgeh;
			
			var field = ["Empcnt", "Hrs10", "Hrs11", "Hrs20", "Hrs21", "Hrs22", "Hrs30", "Hrs31", "Hrs32", "Hrs40", "Hrs41", "Hrs42", "Hrs50"];
			
			oModel.create("/WorkingTimeStatusSet", createData, {
				success: function(data, res){
					if(data){
						if(data.WorkingTimeStatNav && data.WorkingTimeStatNav.results){
							for(var i=0; i<data.WorkingTimeStatNav.results.length; i++){
								data.WorkingTimeStatNav.results[i].Idx = i+1;
								
								for(var j=0; j<field.length; j++){
									eval("data.WorkingTimeStatNav.results[i]." + field[j] + 
											" = parseFloat(data.WorkingTimeStatNav.results[i]." + field[j] + ") == 0 ? '-' : parseFloat(data.WorkingTimeStatNav.results[i]." + field[j] + ");");
								}
								
								// if(i == data.WorkingTimeStatNav.results.length - 1){
								// 	data.WorkingTimeStatNav.results[i].Idx = "";
								// 	data.WorkingTimeStatNav.results[i].Orgeh = "";
								// 	data.WorkingTimeStatNav.results[i].Pernr = "";
								// 	data.WorkingTimeStatNav.results[i].Ename = "";
								// }
								
								vData.Data.push(data.WorkingTimeStatNav.results[i]);
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
			
			oController.SmartSizing();
			
			if(oController.Error == "E"){
				oController.Error = "";
				sap.m.MessageBox.error(oController.ErrorMessage);
				return;
			}
		},
		
		onTimeDatePeriod : function(tmdat){
			if(!tmdat || tmdat == ""){
				return ["", ""];
			} 
			
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			var oModel = sap.ui.getCore().getModel("ZHR_WORKSCHEDULE_SRV");
			var oPath = "/TimeDatePeriodSet?$filter=Wrkty eq '" + oData.Wrkty + "'";
				oPath += " and Begda eq datetime'" + tmdat + "T00:00:00'";
				
			var dates = ["", ""];
				
			oModel.read(oPath, null, null, false,
					function(data, oResponse) {
						if(data && data.results.length) {
							dates = [dateFormat.format(new Date(common.Common.setTime(data.results[0].Begda))),
									 dateFormat.format(new Date(common.Common.setTime(data.results[0].Endda)))];
						}
					},
					function(Res) {
						oController.Error = "E";
						if(Res.response.body){
							ErrorMessage = Res.response.body;
							var ErrorJSON = JSON.parse(ErrorMessage);
							if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
								oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
							} else {
								oController.ErrorMessage = ErrorMessage;
							}
						}
					}
			);
			
			return dates;
		},
		
		onExport : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			
			var filename = oBundleText.getText("LABEL_46007"); // 근무시간 상세현황
			
			var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: filename + ".xlsx"
			};
	
			var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
				oSpreadsheet.build();		
		},
		
		// 대상자 검색
		onSearchUser : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
			
			SearchUser1.oController = oController;
            SearchUser1.dialogContentHeight = 480;

            if (!oController.oAddPersonDialog) {
                oController.oAddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
                oView.addDependent(oController.oAddPersonDialog);
            }

            oController.oAddPersonDialog.open();
		},
		
		// 소속부서 검색
		displayMultiOrgSearchDialog : function (oEvent) {
        	var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
			
				SearchOrg.oController = oController;
	            SearchOrg.vCallControlId = oEvent.getSource().getId();
	            
			if(oEvent.getSource().getId() == oController.PAGEID + "_Orgeh"){
	            SearchOrg.vActionType = "Single";
	            SearchOrg.vCallControlType = "MultiInput";
			} else {
	            SearchOrg.vActionType = "Multi";
	            SearchOrg.vCallControlType = "MultiInput";
			}

            if (!oController.oOrgSearchDialog) {
               oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
               oView.addDependent(oController.oOrgSearchDialog);
            }

            oController.oOrgSearchDialog.open();
        },
        
        // 대상자 선택
        onESSelectPerson : function(data){
        	var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
		
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
			var oJSONModel = oTable.getModel();
			var oIndices = oTable.getSelectedIndices();
			
			if(oIndices.length == 0){
				sap.m.MessageBox.error(oBundleText.getText("MSG_02050")); // 대상자를 선택해 주시기 바랍니다.
				return;
			} else if(oIndices.length != 1){
				sap.m.MessageBox.error(oBundleText.getText("MSG_00068")); // 대상자를 한명만 선택하여 주십시오.
				return;
			}
			
			var oEname = sap.ui.getCore().byId(oController.PAGEID + "_Ename");
				oEname.destroyTokens();
			
			for(var i=0; i<oIndices.length; i++){
				var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
				var detail = oJSONModel.getProperty(sPath);
				
				oEname.addToken(
					new sap.m.Token({
						key : detail.Pernr,
						text : detail.Ename
					})
				);
			}
			
			oController.oAddPersonDialog.close();
        },
		
		handleIconTabBarSelect : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
			var oController = oView.getController();
			
			var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
		},
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_WorkingTimeChart.List");
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
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20125009"});
			return new JSONModelHelper({name: "20200115"});
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});