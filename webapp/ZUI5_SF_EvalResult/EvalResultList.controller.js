jQuery.sap.require("sap.m.MessageBox") ;
sap.ui.controller("ZUI5_SF_EvalResult.EvalResultList", {
	PAGEID : "EvalResultList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	
	_BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function(){
		this.getView().addStyleClass("sapUiSizeCompact");
		
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});

		this.getView().addEventDelegate({
			onAfterShow : jQuery.proxy(function(evt) {
				this.onAfterShow(evt);
			}, this)
		});

//		var bus = sap.ui.getCore().getEventBus();
//		bus.subscribe("app", "OpenWindow", this.SmartSizing, this);

		var bus2 = sap.ui.getCore().getEventBus();
		bus2.subscribe("app", "ResizeWindow", this.SmartSizing, this);
		
	},
	
	onBeforeShow : function(oEvent){
		var oController = this;
		
		common.SearchEvalResult.onBeforeOpen();
	},
	
	onAfterShow : function(oEvent){
		common.SearchEvalResult.onAfterOpen();
	},
	
	SmartSizing : function(oEvent){
		
	},
	
	onOpenEvalResult : function(oEvent){
		var oView = sap.ui.getCore().byId("ZUI5_SF_EvalResult.EvalResultList");
		var oController = oView.getController();
		jQuery.sap.require("common.SearchEvalResult")
		common.SearchEvalResult.oController = oController;
		
		if(!oController._EvalResultDialog){
			oController._EvalResultDialog = sap.ui.jsfragment("fragment.EvalResult", oController);
			oView.addDependent(oController._EvalResultDialog);
		}
		
		oController._EvalResultDialog.open();
	}
});