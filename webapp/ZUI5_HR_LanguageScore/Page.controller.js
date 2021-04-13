sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/EmployeeModel",
	"../common/OrgOfIndividualHandler",
    "../common/DialogHandler",
	], 
	function (Common, CommonController, JSONModelHelper, PageHelper, EmployeeModel,OrgOfIndividualHandler,DialogHandler) {
	"use strict";

	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		_ListCondJSonModel: new JSONModelHelper(),
		 _TableModel: new JSONModelHelper(),
        EmployeeModel: new EmployeeModel(),
		_BusyDialog : new sap.m.BusyDialog(),
		
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
		},
		
		onBeforeShow: function() {
			var oController = $.app.getController();
			oController._ListCondJSonModel.setProperty("/Ltype",[{Code : "0" , Text: oController.getBundleText("LABEL_68012")}]);
			oController._ListCondJSonModel.setProperty("/Data",{});
			
			Promise.all([
				common.Common.getPromise(function() {
					$.app.getModel("ZHR_COMMON_SRV").create("/CommonCodeListHeaderSet",    //어학종류
				  	{
						IBukrs: oController.getView().getModel("session").getData().Bukrs2,
						IMolga: oController.getView().getModel("session").getData().Molga,
						ILangu: oController.getView().getModel("session").getData().Langu,
						IPernr: oController.getView().getModel("session").getData().Pernr,
						IDatum : "\/Date("+ common.Common.getTime(new Date())+")\/",
					    ICodeT: "055",
						NavCommonCodeList : []	
					 },
					 {
	                    async: true,
	                    success: function (data) {
	                        var vData = [];
	                        if(data.NavCommonCodeList && data.NavCommonCodeList.results){
								Object.assign(vData, data.NavCommonCodeList.results);
						    }
						    vData.unshift({Code : "0" , Text: oController.getBundleText("LABEL_68012") });
	                	    oController._ListCondJSonModel.setProperty("/Langu",vData);
						},
	                    error: function (oResponse) {
	                        common.Common.log(oResponse);
	                    }
	                })
				}.bind(this)),
				common.Common.getPromise(function() {
					$.app.getModel("ZHR_COMMON_SRV").create("/CommonCodeListHeaderSet",    //유효/만료
				  	{
						IBukrs: oController.getView().getModel("session").getData().Bukrs2,
						IMolga: oController.getView().getModel("session").getData().Molga,
						ILangu: oController.getView().getModel("session").getData().Langu,
						IPernr: oController.getView().getModel("session").getData().Pernr,
						IDatum : "\/Date("+ common.Common.getTime(new Date())+")\/",
					    ICodeT: "004",
					    ICodty:"ZHRD_TEPAS",
						NavCommonCodeList : []	
					 },
					 {
	                    async: true,
	                    success: function (data) {
	                        var vData = [];
	                        if(data.NavCommonCodeList && data.NavCommonCodeList.results){
								Object.assign(vData, data.NavCommonCodeList.results);
							}
							vData.unshift({Code : "0" , Text: oController.getBundleText("LABEL_68012") });
	                	    oController._ListCondJSonModel.setProperty("/Tepas",vData);
						},
	                    error: function (oResponse) {
	                        common.Common.log(oResponse);
	                    }
	                })
				}.bind(this)),
			]);		
		},
		
		onAfterShow: function() {
			var oController = $.app.getController();
			if(gAuth == "E"){
				this.EmployeeModel.retrieve(oController.getView().getModel("session").getData().Pernr);
				oController._ListCondJSonModel.setProperty("/Data",{Pernr : oController.getView().getModel("session").getData().Pernr, Langu : "0", Tepas : "0", Ltype : "0"});
				oController.onPressSearch();
			}
			if( gAuth == "M"){
				oController._ListCondJSonModel.setProperty("/Data",{Langu : "0", Tepas : "0", Ltype : "0", Orgeh : oController.getView().getModel("session").getData().Orgeh,
																    EnameOrOrgehTxt : oController.getView().getModel("session").getData().Stext
				});
				var OrgOfIndividualHandler = oController.getOrgOfIndividualHandler();
				OrgOfIndividualHandler.autoClose = false;
				OrgOfIndividualHandler.onBeforeOpen();
			}
        },
		
		onPressSearch: function() {
			var oView = $.app.getView();
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table"),
				oJSONModel = oTable.getModel(),
				vData = oController._ListCondJSonModel.getProperty("/Data");
		
			var oData = {Data : []};
		
			var search = function(){
				var oPath = "";
				var sendObject = {};
				
				// Header
				oPath = "/LanguScoreImportSet";
				sendObject.IDatum = "\/Date("+ common.Common.getTime(new Date())+")\/";
				sendObject.IBukrs = vData.Bukrs;
				sendObject.IZlangu = vData.Langu == "0" ? "" : vData.Langu;
				sendObject.IZltype = vData.Ltype == "0" ? "" : vData.Ltype;
				sendObject.IOrgeh = vData.Orgeh;
				sendObject.IPernr = vData.Pernr;
				sendObject.ITepas = vData.Tepas == "0" ? "" : vData.Tepas;
				
				// Navigation property
				sendObject.LanguScoreTableIn = [];

				var oModel = sap.ui.getCore().getModel("ZHR_BENEFIT_SRV");
				oModel.create(oPath, sendObject, null,
					function(data, res){
						if(data){
							if(data.LanguScoreTableIn && data.LanguScoreTableIn.results){
								for(var i=0; i<data.LanguScoreTableIn.results.length; i++){
									data.LanguScoreTableIn.results[i].Idx = (i+1);
									oData.Data.push(data.LanguScoreTableIn.results[i]);
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
				
				oJSONModel.setData(oData);
				oTable.bindRows("/Data");
				Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
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

		onChangeLangu : function(){
			var oController = $.app.getController();
			var vLangu = oController._ListCondJSonModel.getProperty("/Data/Langu");
			var vData = [];
			if(vLangu && vLangu != ""){
				var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
				var sendObject = {};
				// Header
				sendObject.IPernr = oController.getView().getModel("session").getData().Pernr,
				sendObject.IDatum = new Date();
				sendObject.ICodeT = "056";
				sendObject.IBukrs = oController.getView().getModel("session").getData().Bukrs2,
				sendObject.ICodty = vLangu;
				// Navigation property
				sendObject.NavCommonCodeList = [];

				oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 
					success: function(data, oResponse) {
						if(data.NavCommonCodeList && data.NavCommonCodeList.results){
							Object.assign(vData, data.NavCommonCodeList.results);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			}
			vData.unshift({Code : "0" , Text: oController.getBundleText("LABEL_68012") });
			oController._ListCondJSonModel.setProperty("/Ltype",vData);
		},
		
		onPressSer: function() { //조회
			var oController = $.app.getController();
			
			oController.onTableSearch();
		},
		
		pressChart: function() {
			var oController = $.app.getController();
            if (!oController.oChartDialog) {
				oController.oChartDialog = sap.ui.jsfragment("ZUI5_HR_LanguageScore.fragment.ScoreChart", oController);
				$.app.getView().addDependent(oController.oChartDialog);
            }
            
            oController.oChartDialog.open();
        },
		
		 /**
         * @brief [공통]부서/사원 조직도호출
         */
		searchOrgehPernr: function(oController) {
		  	var oController = $.app.getController();
		  	var oModel = oController._ListCondJSonModel;
			var initData = {
				   Percod: this.getSessionInfoByKey("Percod"),
				   Bukrs: this.getSessionInfoByKey("Bukrs2"),
				   Langu: this.getSessionInfoByKey("Langu"),
				   Molga: this.getSessionInfoByKey("Molga"),
				   Datum: new Date(),
				   Mssty: "",
			   },
			   callback = function(o) {
				   oModel.setProperty("/Data/Pernr", o.Otype === "P" ? o.Objid : "");
				   oModel.setProperty("/Data/Orgeh", o.Otype === "O" ? o.Objid : "");
				   oModel.setProperty("/Data/EnameOrOrgehTxt", o.Stext || "");
			   };
   
			   this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
	    },
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
				
	
		onESSelectPerson: function(data) {
			return !this.EmployeeSearchCallOwner 
					? this.OrgOfIndividualHandler.setSelectionTagets(data)
					: this.EmployeeSearchCallOwner.setSelectionTagets(data);
		},
	
		displayMultiOrgSearchDialog: function(oEvent) {
			return !$.app.getController().EmployeeSearchCallOwner 
					? $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent)
					: $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20140099"}); // 20140099
		} : null
	});
});