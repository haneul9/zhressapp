jQuery.sap.require("sap.m.MessageBox") ;
sap.ui.controller("ZUI5_SF_360Review.360ReviewList", {
	PAGEID : "ReviewList",
	_ListCondJSonModel : new sap.ui.model.json.JSONModel(),
	
	_BusyDialog : new sap.m.BusyDialog(),
	
	onInit : function(){
		this.getView().addStyleClass("sapUiSizeCompact");
		this.getView().setModel(new sap.ui.model.resource.ResourceModel({bundleUrl: "i18n/i18n.properties"}), "i18n");
		
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
		
		common.Search360Review.onBeforeOpen();
	},
	
	onAfterShow : function(oEvent){
		common.Search360Review.onAfterOpen();
	},
	
	SmartSizing : function(oEvent){
		
	}
});