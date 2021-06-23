/* eslint-disable no-native-reassign */
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.export.Spreadsheet");

sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
    "common/SearchOrg",
    "common/SearchUser1",
    "common/OrgOfIndividualHandler",
    "common/DialogHandler",
	"common/ApprovalLinesHandler"], 
	function (Common, CommonController, JSONModelHelper, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler, ApprovalLinesHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Workhome.List", {

		PAGEID: "ZUI5_HR_WorkhomeList",
		_BusyDialog : new sap.m.BusyDialog(),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_Columns : [],
		
		_Bukrs : "",
		oExtryn : "",

		EmployeeSearchCallOwner: null,

		getApprovalLinesHandler: function() {
			return this.ApprovalLinesHandler;
		},
			
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
		
		onInit: function () {
			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow,
					onAfterShow: this.onAfterShow
				}, this);
			
			gDtfmt = this.getSessionInfoByKey("Dtfmt");
			// this.getView().addStyleClass("sapUiSizeCompact");
			// this.getView().setModel($.app.getModel("i18n"), "i18n");
		},

		onBeforeShow: function(){
			var oController = this;

			this.oExtryn = Common.isExternalIP() === true ? "X" : "";
		
			 if(!oController._ListCondJSonModel.getProperty("/Data")){
			 	var today = new Date();
			 	
				var	vData = {
					Data : {
						Begda : new Date(today.getFullYear(), today.getMonth(), 1),
						Endda : new Date(today.getFullYear(), today.getMonth(), (oController.getLastDate(today.getFullYear(), today.getMonth()))),
						Persa : oController.getSessionInfoByKey("Persa")
						// Tmdat : dateFormat.format(new Date()),
					}
				};
				
				if(oController.getSessionInfoByKey("Persa").substring(0,1) == "D"){ // 첨단은 대상자 사번
					vData.Data.Pernr = oController.getSessionInfoByKey("Pernr");
					vData.Data.Ename = oController.getSessionInfoByKey("Ename");
				} else { // 기초는 소속부서로 default값 설정
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
		
		onBack : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_Workhome.List",
			    	  Data : {}
			      }
			});
		},
		
		SmartSizing : function(){
			// var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			// var oController = oView.getController();
		
		},
		
		onChangeDate : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();
		
			if(oEvent && oEvent.getParameters().valid == false){
				sap.m.MessageBox.error(oController.getBundleText("MSG_02047")); // // 잘못된 일자형식입니다.
				oEvent.getSource().setValue("");
				oController._ListCondJSonModel.setProperty("/Data/Endda", "");
				return;
			}
		},
		
		onPressSearch : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
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
				
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				var createData = {WorkhomeNav : []};
					createData.IEmpid = (oData.Pernr && oData.Pernr != "" ? oData.Pernr : "");
					createData.IOrgeh = (oData.Orgeh && oData.Orgeh != "" ? oData.Orgeh : "");
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda.getFullYear(), oData.Begda.getMonth(), oData.Begda.getDate())) + ")\/"; 
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda.getFullYear(), oData.Endda.getMonth(), oData.Endda.getDate())) + ")\/";
					createData.IBukrs = oController.getSessionInfoByKey("Bukrs3");
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IConType = "1";

				oModel.create("/WorkhomeApplySet", createData, {
					success: function(data){
						if(data){
							if(data.WorkhomeNav && data.WorkhomeNav.results){
								for(var i=0; i<data.WorkhomeNav.results.length; i++){   
									data.WorkhomeNav.results[i].Begda = data.WorkhomeNav.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.WorkhomeNav.results[i].Begda))) : "";
									data.WorkhomeNav.results[i].Endda = data.WorkhomeNav.results[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data.WorkhomeNav.results[i].Endda))) : "";
									
									data.WorkhomeNav.results[i].Period = data.WorkhomeNav.results[i].Begda + " ~ " + data.WorkhomeNav.results[i].Endda;
									
									// 구분
									if(data.WorkhomeNav.results[i].Cancl == ""){
										data.WorkhomeNav.results[i].Cancltx = oController.getBundleText("LABEL_53012"); // 신규
									} else {
										data.WorkhomeNav.results[i].Cancltx = oController.getBundleText("LABEL_53013"); // 취소
									}
									
									data.WorkhomeNav.results[i].Kaltg = parseFloat(data.WorkhomeNav.results[i].Kaltg);
									
									vData.Data.push(data.WorkhomeNav.results[i]);
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
				
				var row = parseInt((window.innerHeight - 450) / 37);
				oTable.setVisibleRowCount(vData.Data.length < row ? vData.Data.length : row);
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
				}          
				
				oController._BusyDialog.close();
				
			};
			
			oController._BusyDialog.open();
			setTimeout(search, 100);
		},
		
		onPressNew : function(){
			// var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			// var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_Workhome.Detail",
			      data : {
			    	  FromPageId : "ZUI5_HR_Workhome.List",
			    	  Status : ""
			      }
			});	
		},
		
		// D 삭제 E 취소
		onPressDelete : function(oEvent, Flag){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();
			var oData;
		
			if(oEvent){
				oData = oEvent.getSource().getCustomData()[0].getValue();
			} else {
				oData = oController._CancelDialog.getModel().getProperty("/Data");
				
				// validation check
				if(oData.Bigo == "" || oData.Bigo.trim() == ""){
					sap.m.MessageBox.error(oController.getBundleText("MSG_53010")); // 취소사유를 입력하여 주십시오.
					return;
				} else if(oData.AppNameyn == true && !oData.AppName){
					sap.m.MessageBox.error(oController.getBundleText("MSG_48026")); // 결재자를 선택하여 주십시오.
					return;
				}
			}
			
			if(oEvent && Flag == "E") {
				if(!oController._CancelDialog){
					oController._CancelDialog = sap.ui.jsfragment("ZUI5_HR_Workhome.fragment.Cancel", oController);
					oView.addDependent(oController._CancelDialog);
				}
				
				var oJSONModel = oController._CancelDialog.getModel();
				var vData = $.extend(true, {}, oData, {Bigo : "", AppNameyn : false});

				oJSONModel.setData({Data : vData});
				
				oController._CancelDialog.open();
			} else {

				if(Flag == "E" && Common.isExternalIP()) {   // 취소신청 + 외부망인 경우 결재라인 선택
					setTimeout(function() {
						var initData = {
							Mode: "P", // PC – P, Mobile - M
							Pernr: oData.Pernr,
							Empid: oController.getSessionInfoByKey("Pernr"),
							Bukrs: oData.Bukrs,
							ZappSeq: "40"
						},
						callback = function(o) {
							oController.onDeleteProcess.call(oController, oData, Flag, o);   // 결재선 Dialog에서 신청 버튼 클릭시 호출 되는 Function
						};
			
						oController.ApprovalLinesHandler = ApprovalLinesHandler.get(oController, initData, callback);
						DialogHandler.open(oController.ApprovalLinesHandler);
					}, 0);
				} else {
					oController.onDeleteProcess.call(oController, oData, Flag, []); // 내부망일 경우 바로 신청 Function 호출
				}

			}
		},

		onDeleteProcess : function(oData, Flag, vAprdatas){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();

			var confirmMessage = "", successMessage = "";
			var onProcess = function(){
				var oModel = $.app.getModel("ZHR_WORKTIME_APPL_SRV");
				var oExtryn = Common.isExternalIP() === true ? "X" : "", oUrl = "";

				var createData = {WorkhomeNav : [], WorkhomeTabNav : (vAprdatas ? vAprdatas : [])};
					createData.IPernr = oData.Pernr;
					createData.IEmpid = oData.Pernr;
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oController.getSessionInfoByKey("Langu");
					createData.IConType = (Flag == "D" ? "4" : "9");
					createData.IExtryn = oExtryn;
					
				var detail = {};
					detail.Pernr = oData.Pernr;
					detail.Bukrs = oData.Bukrs;
					detail.Status = oData.Status;
					detail.Begda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					detail.Endda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/"; 
					detail.Telnum = oData.Telnum;
					detail.Bigo = oData.Bigo; 
					
				createData.WorkhomeNav.push(detail);
				
				oModel.create("/WorkhomeApplySet", createData, {
					success: function(data){
						if(data){
							oUrl = data.EUrl;
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
				
				if(oUrl != ""){
					if(common.Common.openPopup.call(oController, oUrl) == false){
						return;
					}
				}
				
				if(oController.Error == "E"){
					oController.Error = "";
					sap.m.MessageBox.error(oController.ErrorMessage);
					return;
				}
				
				sap.m.MessageBox.success(successMessage, {
					onClose : oController.onPressSearch
				});
			};
			
			var beforeSave = function(fVal){
				if(fVal && fVal == "YES"){
					if(oController._CancelDialog && oController._CancelDialog.isOpen() == true){
						oController._CancelDialog.close();
					}
					
					oController._BusyDialog.open();
					setTimeout(onProcess, 100);
				}
			};
			
			if(Flag == "D"){
				confirmMessage = oController.getBundleText("MSG_00059"); // 삭제하시겠습니까?
				successMessage = oController.getBundleText("MSG_00021"); // 삭제되었습니다.
			} else {
				confirmMessage = oController.getBundleText("MSG_53008"); // 취소하시겠습니까?
				successMessage = oController.getBundleText("MSG_53009"); // 취소신청되었습니다.
			}
			
			sap.m.MessageBox.confirm(confirmMessage, {
				actions : ["YES", "NO"],
				onClose : beforeSave
			});
		},
		
		onPressTable : function(oEvent, Flag, Flag2){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();
			
			// 삭제처리, 취소처리 셀 선택 시 리턴
			if(oEvent.getParameters().columnIndex == "7" || oEvent.getParameters().columnIndex == "8"){
				return;
			}
			
			var oData = null;
			
			if(Flag && Flag == "X"){
				oData = oEvent.getSource().getCustomData()[0].getValue();
				
				if(Flag2 && Flag2 != ""){
					oData.Flag = Flag2; // D 삭제신청, E 취소신청
				}
			} else {
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
				var sPath = oEvent.getParameters().rowBindingContext.sPath;
				
				oData = oTable.getModel().getProperty(sPath);
			}
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : "ZUI5_HR_Workhome.Detail",
			      data : $.extend(true, {FromPageId : "ZUI5_HR_Workhome.List"}, oData)
			});
		},
		
		searchOrgehPernr : function(oController){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			oController = oView.getController();
			
			var initData = {
                Percod: oController.getSessionInfoByKey("Percod"),
                Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                Langu: oController.getSessionInfoByKey("Langu"),
                Molga: oController.getSessionInfoByKey("Molga"),
                Datum: new Date(),
                Mssty: ""
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
        
		/**
         * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
         */
		displayMultiOrgSearchDialog: function (oEvent) {
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();

			return !$.app.getController().EmployeeSearchCallOwner 
					? oController.openOrgSearchDialog(oEvent)
					: $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
		},

		openOrgSearchDialog : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();

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
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();

			return this.EmployeeSearchCallOwner 
					? this.EmployeeSearchCallOwner.setSelectionTagets(data)
					: oController.onSelectPerson(data);
		},

		onSelectPerson : function(data){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();

			oController._ListCondJSonModel.setProperty("/Data/Orgeh", "");
			oController._ListCondJSonModel.setProperty("/Data/Pernr", data.Pernr);
			oController._ListCondJSonModel.setProperty("/Data/Ename", data.Ename);

			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},
        
        onPressStext : function(oEvent){
        	var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();
			
			var oData = oEvent.getSource().getCustomData()[0].getValue();	

			if(oData.UrlA && oData.UrlA != ""){
				if(common.Common.openPopup.call(oController, oData.UrlA) == false){
					return;
				}
			}
        },
		
		onExport : function(){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Workhome.List");
			var oController = oView.getController();
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();
			
			var filename = oController.getBundleText("LABEL_53001"); // 재택근무 
			
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
			return new JSONModelHelper({name: "20090028"});
		} : null
		
	});

});