sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail03_PDF", {
	
	createContent : function(oController) {
		
		var oPanel = new sap.m.Panel(oController.PAGEID + "_Detail3Panel", {
			expandable : false,
			expanded : true,
			content : []
		});
	
		var oDialog = new sap.m.Dialog({
			contentWidth : "1200px",
			title : "",
			content : [oPanel],
			endButton : [new sap.m.Button({text : "닫기", type : "Emphasized", press : function(){oDialog.close();}})]	
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		
		return oDialog;
	}

});