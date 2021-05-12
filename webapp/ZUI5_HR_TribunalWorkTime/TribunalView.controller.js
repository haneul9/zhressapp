/* eslint-disable no-undef */
jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/ui/core/BusyIndicator",
	"common/OrgOfIndividualHandler",
    "common/DialogHandler"], 
	function (Common, CommonController, JSONModelHelper, BusyIndicator,OrgOfIndividualHandler,DialogHandler) {
	"use strict";

	return CommonController.extend("ZUI5_HR_TribunalView.TribunalView", {

		PAGEID: "TribunalView",
		BusyDialog : new sap.m.BusyDialog().addStyleClass("centerAlign"),
		_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
		_DataModel : new sap.ui.model.json.JSONModel(),
		_SessionData : {},
		_DataSet : null,
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
		},

		onBeforeShow : function(oEvent){
			var oController = this;
			this._ListCondJSonModel.setData({Data:oController.getView().getModel("session").getData()});
			oController._SessionData=oController.getView().getModel("session").getData();
			var oSessionData=oController._SessionData;
			$.app.byId(oController.PAGEID+"_searchOrgPer").setValue(oSessionData.Stext);
			$.app.byId(oController.PAGEID+"_searchOrgPer").addCustomData(new sap.ui.core.CustomData({
				key:"Pernr",
				value:oSessionData.Orgeh
			}));
			oController._DataSet={Pernr:oSessionData.Pernr,Orgeh:oSessionData.Orgeh,Type:"O"};
			oController.onSearch();
		},

		onSearch : function(){
			var oController=$.app.getController();
			var oSessionData=oController._SessionData;
			var vData={IConType:"1",IBukrs:oSessionData.Bukrs3,ILangu:"3",IMolga:"41",IFrym:$.app.byId(oController.PAGEID + "_Date1").getValue(),
			IToym:$.app.byId(oController.PAGEID + "_Date2").getValue(),FreeWorkReport:[]};
			oController._DataSet.Type=="P"?vData.IPernr=oController._DataSet.Pernr:vData.IOrgeh=oController._DataSet.Orgeh;
			var oModel = $.app.getModel("ZHR_WORKSCHEDULE_SRV");
			var oTable = $.app.byId(oController.PAGEID+"_Table");
			var oJSON = new sap.ui.model.json.JSONModel();
			var aData = {Datas:[]};
			BusyIndicator.show(0);
			setTimeout(function(){				
				oModel.create("/FreeWorkReportHeaderSet", vData,
					{success:function(data,res){
						data.FreeWorkReport.results.forEach(function(e){
							aData.Datas.push(e);
						});
						oJSON.setData(aData);
						data.FreeWorkReport.results.length>10?oTable.setVisibleRowCount(10):oTable.setVisibleRowCount(data.FreeWorkReport.results.length);
					},
					error:function (oError) {
						var Err = {};						
						if (oError.response) {
							Err = window.JSON.parse(oError.response.body);
							var msg1 = Err.error.innererror.errordetails;
							if(msg1 && msg1.length) sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
							else sap.m.MessageBox.alert(Err.error.innererror.errordetails[0].message);
						} else {
							sap.m.MessageBox.alert(oError.toString());
						}
					}
				});	
				oTable.setModel(oJSON);
				oTable.bindRows("/Datas");
				BusyIndicator.hide();
			},10);
			
		},

		onESSelectPerson : function(Data){
			this._DataSet.Type="P";
			$.app.byId(this.PAGEID+"_searchOrgPer").setValue(Data.Ename);
			$.app.byId(this.PAGEID+"_searchOrgPer").addCustomData(new sap.ui.core.CustomData({value:Data.Pernr,key:"Pernr"}));
			this._DataSet.Pernr=Data.Pernr;
			sap.ui.getCore().byId(common.SearchUser1.oController.PAGEID + "_ES_Dialog").close();
			this.OrgOfIndividualHandler.getDialog().close();
		},

		displayMultiOrgSearchDialog: function(oEvent) {
			return !$.app.getController().EmployeeSearchCallOwner 
					? $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent)
					: $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
		},

		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },

		searchOrgehPernr : function(oEvent){
			var oController=this;
			var oId=oEvent.getSource().getId();
			$.app.byId(oId).setValue();
			$.app.byId(oId).removeAllCustomData();
			var initData = {
				Percod: $.app.getModel("session").getData().Percod,
				Bukrs: $.app.getModel("session").getData().Bukrs3,
				Langu: $.app.getModel("session").getData().Langu,
				Molga: $.app.getModel("session").getData().Molga,
				Datum: new Date(),
				Mssty: "",
				autoClose : false
			};
			var callback = function(o) {
				o.Otype=="P"?oController._DataSet.Pernr=o.Objid:oController._DataSet.Orgeh=o.Objid;
				oController._DataSet.Type=o.Otype;
				$.app.byId(oId).setValue(o.Stext);
				$.app.byId(oId).addCustomData(new sap.ui.core.CustomData({value:o.Objid,key:"Pernr"}));
				oController._vPernr=o.Objid;
				oController.OrgOfIndividualHandler.getDialog().close();
			};

			this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);	
			DialogHandler.open(this.OrgOfIndividualHandler);
		},
		
		getUrl : function(sUrl) {
			var param = $.map(location.search.replace(/\?/, "").split(/&/), function(p) {
				var pair = p.split(/=/);
				if (pair[0] === "s4hana") { return pair[1]; }
			})[0];
			var destination = (common.Common.isPRD() || param === "legacy") ? "/s4hana" : "/s4hana-pjt";
			
			return (destination + sUrl);
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "991004"});
		} : null
	});
});