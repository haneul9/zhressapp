jQuery.sap.declare("ZUI5_HR_EssMboEval.fragment.content02");
ZUI5_HR_EssMboEval.fragment.content02={
    renderPanel : function(oController){
        var oRow,oCell;
        var c = sap.ui.commons;
        var m = sap.m;
        var oMat = new c.layout.MatrixLayout({
			columns:3,
			widths:['','','200px']
        });
        oRow = new c.layout.MatrixLayoutRow();
        oCell = new c.layout.MatrixLayoutCell({
            colSpan : 3,
            hAlign : "End",
            content : [new sap.m.Button(oController.PAGEID+"_Save",{
                icon : "sap-icon://save",
                text : oBundleText.getText("LABEL_35021"),
                press : function(){oController.onSave("S");}
            }).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Button(oController.PAGEID+"_Finish",{
                icon : "sap-icon://complete",
                text : oBundleText.getText("LABEL_35022"),
                press : function(){oController.onSave("F");}
            }).addStyleClass("button-dark")]
        });
        oRow.addCell(oCell);
        oMat.addRow(oRow);
        oRow = new c.layout.MatrixLayoutRow();
        oCell = new c.layout.MatrixLayoutCell({
            colSpan : 3,
            hAlign : "End",
            content : new sap.ui.core.HTML({content:"<div style='height:10px;' />"})
        });
        oRow.addCell(oCell);
        oMat.addRow(oRow);
        oRow = new c.layout.MatrixLayoutRow({height:"33px"});
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Center",
            content : new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_35019")+"<span style='color:red;font-weight:bold;font-size:14px;'>*</span></span>"})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Center",
            content : new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_35020")+"</span>"})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Center",
            content : new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_35018")+"<span style='color:red;font-weight:bold;font-size:14px;'>*</span></span>"})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);
        oRow = new c.layout.MatrixLayoutRow();
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Begin",
            content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_TextA1",{width:"99%",rows:4})]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Begin",
            content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_TextA2",{width:"99%",rows:4})]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Begin",
            content : [new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Select(oController.PAGEID+"_Sel1",{width:"90%"}).addStyleClass("L2P13Font")]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        var oPanel1 = new m.Panel({
			expanded:true,
            expandable:false,
            content:oMat
        });
        return oPanel1;
    }
};