jQuery.sap.declare("ZUI5_HR_EssMboEval.fragment.content01");
ZUI5_HR_EssMboEval.fragment.content01={
	renderPanel : function(oController){
		var oRow,oCell;
		var c = sap.ui.commons;
		var m = sap.m;
		var oMat = new c.layout.MatrixLayout({
			columns:2,
			widths:['12%']
		});
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_35004")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : "Begin",
			content : [new sap.ui.core.HTML({preferDOM:false,content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Input(oController.PAGEID+"_1stP",{width:"15%",editable:false}),new sap.ui.core.HTML({preferDOM:false,content:"<span>&nbsp;&nbsp;</span>"}),
						new sap.m.Input(oController.PAGEID+"_1stPD",{width:"84%",editable:false})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_35005")+"</span>"})
		}).addStyleClass("LabelCell")
		oRow.addCell(oCell);
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : "Begin",
			content : [new sap.ui.core.HTML({preferDOM:false,content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Input(oController.PAGEID+"_2ndP",{width:"15%",editable:false}),new sap.ui.core.HTML({preferDOM:false,content:"<span>&nbsp;&nbsp;</span>"}),
						new sap.m.Input(oController.PAGEID+"_2ndPD",{width:"84%",editable:false})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : "Center",
			content : new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_35006")+"</span>"})
		}).addStyleClass("LabelCell")
		oRow.addCell(oCell);
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : "Begin",
			content : [new sap.ui.core.HTML({preferDOM:false,content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Input(oController.PAGEID+"_3rdP",{width:"15%",editable:false}),new sap.ui.core.HTML({preferDOM:false,content:"<span>&nbsp;&nbsp;</span>"}),
						new sap.m.Input(oController.PAGEID+"_3rdPD",{width:"84%",editable:false})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		var oPanel = new m.Panel({
			headerToolbar : [new sap.m.Toolbar({content:[new sap.m.Text(oController.PAGEID+"_ToolTxt1",{text:oBundleText.getText("LABEL_35002")}).addStyleClass("Bold Font16")]})],
			expanded:true,
			expandable:false,
			content:oMat
		});
		return oPanel;
	}
};