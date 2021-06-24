sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail03_PDF", {
	
	createContent : function(oController) {
		
		var oPanel = new sap.m.Panel(oController.PAGEID + "_Detail3Panel", {
			expandable : false,
			expanded : true,
			content : [
				// new sap.m.PDFViewer({
				// 	displayType: sap.m.PDFViewerDisplayType.Embedded,
				// 	source: "{Url}"
				// })
			]
		});
	
		var oDialog = new sap.m.Dialog({
			contentWidth : "1200px",
			title : "",
			content : [oPanel],
			endButton : [new sap.m.Button({text : "닫기", press : function(oEvent){oDialog.close();}}).addStyleClass("button-default")]	
		});
		
		oDialog.addStyleClass("custom-dialog-popup");
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
