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

	return CommonController.extend("ZUI5_HR_FreeWorkReportDaily.List", {

		PAGEID: "ZUI5_HR_FreeWorkReportDailyList",
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
				
			// gDtfmt = $.app.getModel("session").getData().Dtfmt;
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
						Pernr : oController.getSessionInfoByKey("Pernr"),
						Orgeh : "",
						Ename : oController.getSessionInfoByKey("Ename"),
						Bukrs : oController.getSessionInfoByKey("Bukrs3"),
						Molga : oController.getSessionInfoByKey("Molga"),
						Langu : oController.getSessionInfoByKey("Langu"),
						Werks : oController.getSessionInfoByKey("Persa"),
						Chief : oController.getSessionInfoByKey("Chief")
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_FreeWorkReportDaily.List");
			var oController = oView.getController();
		
			sap.ui.getCore().getEventBus().publish("nav", "to", {
			      id : oController._ListCondJSonModel.getProperty("/Data/FromPageId"),
			      data : {
			    	  FromPageId : "ZUI5_HR_FreeWorkReportDaily.List",
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_FreeWorkReportDaily.List");
			var oController = oView.getController();
			
			var oData = oController._ListCondJSonModel.getProperty("/Data");
			
			if(!oData.Begda || !oData.Endda){
				sap.m.MessageBox.error(oBundleText.getText("MSG_64001")); // 대상기간을 입력하여 주십시오.
				return;
			}
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table"),
				oJSONModel = oTable.getModel(),
				vData = {Data : []};
			
			var col_info = [];
			
			// 2021-08-13 기초/첨단 구분하여 table column 재생성
			oTable.destroyColumns();
			if(oData.Bukrs == "A100"){ // 첨단
							// 근무일자, 사번, 성명, 부서, 유형, 요일
				col_info = [{id: "Begda", label: "{i18n>LABEL_64013}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width : "110px"},
							{id: "Pernr", label: "{i18n>LABEL_00191}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "110px"},
							{id: "Ename", label: "{i18n>LABEL_00121}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "110px"},
							{id: "Orgtx", label: "{i18n>LABEL_00155}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Rtext", label: "{i18n>LABEL_64014}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Day", label: "{i18n>LABEL_64015}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							// 입문시간, 출문시간, 재근시간, 소명, 연장
							{id: "Entbg", label: "{i18n>LABEL_64030}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							{id: "Enten", label: "{i18n>LABEL_64031}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							{id: "Norwk", label: "{i18n>LABEL_64018}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							{id: "PrchkW", label: "{i18n>LABEL_64035}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							{id: "OtchkW", label: "{i18n>LABEL_64036}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							// 근태명, 근태인정시간, 비근무항목(조/중/석/야/웰리스), 비근무시간,
							{id: "Absence", label: "{i18n>LABEL_64020}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Comtm", label: "{i18n>LABEL_64021}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
							{id: "MeWe", label: "{i18n>LABEL_64032}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
							{id: "Brktm1", label: "{i18n>LABEL_64034}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
							// 휴게시간, 재근시간기준, 근무시간, 정상여부, 비고
							{id: "Brktm2", label: "{i18n>LABEL_64033}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
							{id: "Workt2", label: "{i18n>LABEL_64037}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
							{id: "Workt", label: "{i18n>LABEL_64026}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							{id: "Error", label: "{i18n>LABEL_64027}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "60px"},
							{id: "Reqrn", label: "{i18n>LABEL_64028}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, align : "Begin"}];
			} else { // 기초
							// 근무일자, 사번, 성명, 부서, 유형, 요일
				col_info = [{id: "Begda", label: "{i18n>LABEL_64013}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width : "110px"},
							{id: "Pernr", label: "{i18n>LABEL_00191}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "110px"},
							{id: "Ename", label: "{i18n>LABEL_00121}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "110px"},
							{id: "Orgtx", label: "{i18n>LABEL_00155}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Rtext", label: "{i18n>LABEL_64014}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Day", label: "{i18n>LABEL_64015}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							// 출근시간, 퇴근시간, 재근시간, 소명시간
							{id: "Entbg", label: "{i18n>LABEL_64016}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							{id: "Enten", label: "{i18n>LABEL_64017}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							{id: "Norwk", label: "{i18n>LABEL_64018}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							{id: "PrchkW", label: "{i18n>LABEL_64019}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							// 근태명, 근태인정시간, 추가인정시간, 비근무시간(PC OFF), 추가비근무시간
							{id: "Absence", label: "{i18n>LABEL_64020}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
							{id: "Comtm", label: "{i18n>LABEL_64021}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
							{id: "Etctt", label: "{i18n>LABEL_64022}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
							{id: "Nonwt2", label: "{i18n>LABEL_64023}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
							{id: "Brktm1", label: "{i18n>LABEL_64024}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "85px"},
							// 법정휴게시간, 근무시간, 정상여부, 비고
							{id: "Brktm2", label: "{i18n>LABEL_64025}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "70px"},
							{id: "Workt3", label: "{i18n>LABEL_64026}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
							{id: "Error", label: "{i18n>LABEL_64027}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "60px"},
							{id: "Reqrn", label: "{i18n>LABEL_64028}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, align : "Begin"}];
			}
			
			common.makeTable.makeColumn(oController, oTable, col_info);
			
			var search = function(){
				var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : gDtfmt});
				
				var oModel = $.app.getModel("ZHR_FLEX_TIME_SRV");
				var createData = {FreeWorkRptNav : []};
					createData.IBukrs = oData.Bukrs;
					createData.ILangu = oData.Langu;
					createData.IMolga = oData.Molga;
					createData.IBegda = "\/Date(" + common.Common.getTime(new Date(oData.Begda)) + ")\/";
					createData.IEndda = "\/Date(" + common.Common.getTime(new Date(oData.Endda)) + ")\/";
					createData.IOrgeh = oData.Orgeh;
					createData.IPernr = oData.Pernr;

				oModel.create("/FreeWorkReportSet", createData, {
					success: function(data, res){
						if(data){
							if(data.FreeWorkRptNav && data.FreeWorkRptNav.results){
								var data1 = data.FreeWorkRptNav.results;
								
								for(var i=0; i<data1.length; i++){
									data1[i].Begda = data1[i].Begda ? new Date(common.Common.setTime(data1[i].Begda)) : null;
									
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
			var oView = sap.ui.getCore().byId("ZUI5_HR_FreeWorkReportDaily.List");
			var oController = oView.getController();
			
			var initData = {
                Percod: oController.getSessionInfoByKey("Percod"),
                Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                Langu: oController.getSessionInfoByKey("Langu"),
                Molga: oController.getSessionInfoByKey("Molga"),
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
		
		getLastDate : function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;
	
			return last[m];
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			// return new JSONModelHelper({name: "20180126"});
			// return new JSONModelHelper({name: "20130126"});
			return new JSONModelHelper({name: "20060040"});
		} : null
		
	});

});