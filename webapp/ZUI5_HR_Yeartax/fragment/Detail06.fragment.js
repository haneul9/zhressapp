sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail06", {
	/** 모의실행 **/
	createContent : function(oController) {
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [new sap.ui.core.HTML({content : "<div style='height:10px'></div>"}),
					   new sap.ui.layout.VerticalLayout(oController.PAGEID + "_Detail6_PDF")]
		});
		
		oLayout.setModel(oController._DetailJSonModel);
		oLayout.bindElement("/Data");
		
		return oLayout;
	}

});
