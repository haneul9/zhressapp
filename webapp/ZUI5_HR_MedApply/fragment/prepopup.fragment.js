$.sap.require("common.PickOnlyDatePicker");
sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.prepopup", {
    createContent: function (oController) {
        var oRow,oCell,oMat=new sap.ui.commons.layout.MatrixLayout({columns:2,widths:['30%']}),c=sap.ui.commons,Datum=new common.PickOnlyDatePicker({width:"50%",
        displayFormat: gDtfmt,
        placeholder: gDtfmt,
        valueFormat: "yyyy-MM-dd"});
        for(var i=89;i<90;i++) { 
            window["oLabel"+(i-89)] = oController.getTxt("LABEL_470"+i,i);
        }
		oRow=new c.layout.MatrixLayoutRow();
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"End",
            content:oLabel0
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:[Datum,new sap.m.Button({text:oBundleText.getText("LABEL_47090"),
            press:function(){oController.getBukrs(Datum);}}).addStyleClass("button-light righter")]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        var oContent = new sap.m.FlexBox({
            justifyContent: "Center",
            fitContainer: true,
            items: [oMat]
        }).addStyleClass("paddingbody");

        var oDialog = new sap.m.Dialog({
            content: [oContent],
            title: oBundleText.getText("LABEL_47088"),
            buttons: [new sap.m.Button({text:oBundleText.getText("LABEL_00133"),press:oController.onClose3}).addStyleClass("button-delete")],
            contentWidth: "630px",
            afterOpen : function(){oController.onAfterOpen3(Datum);}
        });	

        return oDialog;
}});