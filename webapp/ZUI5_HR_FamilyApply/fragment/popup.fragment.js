
sap.ui.jsfragment("ZUI5_HR_FamilyApply.fragment.popup", {
    createContent: function (oController) {
        var oRow,oCell,oMat,c=sap.ui.commons;
		var oLabel1="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36041")+"</span>";
        for(var i=15;i<30;i++){
            eval("var oLabel"+(i-14)+"=oController.getTxt('LABEL_440"+i+"',"+i+");");
        }
        var oLabel16=oController.getTxt("LABEL_44034",30);
        var oSelect1=new sap.m.Select(oController.PAGEID+"_Sel1",{width:"80%",change:oController.onChange,selectedKey:"{Famsa}",editable:{path:"Opener",formatter:function(fVal){
            return fVal=="X"?true:false;
        }}});
        var oSelect2=new sap.m.Select(oController.PAGEID+"_Sel2",{width:"80%",selectedKey:"{Kdsvh}",editable:{path:"Opener",formatter:function(fVal){
            return fVal=="X"?true:false;
        }}});
        var oSelect3=new sap.m.Select(oController.PAGEID+"_Sel3",{width:"80%",selectedKey:"{Fanat}",editable:{path:"Opener",formatter:function(fVal){
            return fVal=="X"?true:false;
        }}});
        var oSelect4=new sap.m.Select(oController.PAGEID+"_Sel4",{width:"253px",selectedKey:"{Fgbld}",editable:{path:"Opener",formatter:function(fVal){
            return fVal=="X"?true:false;
        }}});
        var oSelect5=new sap.m.Select(oController.PAGEID+"_Sel5",{width:"80%",selectedKey:"{Fasar}",editable:{path:"Opener",formatter:function(fVal){
            return fVal=="X"?true:false;
        }}});
        var oRegNo=new sap.m.Input(oController.PAGEID+"_Regno",{width:"80%",value:"{Regno}",maxLength:14,liveChange:oController.onAutoInputReg,editable:{path:"Opener",formatter:function(fVal){
            return fVal=="X"?true:false;
        }}});
        var oTxt=new sap.m.Text({ text:{path: "Fgbdt",
                                type: new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})}});
        oMat=new c.layout.MatrixLayout({
            columns:6,
            widths:['9%','','9%','','9%','']
        });
        oRow=new c.layout.MatrixLayoutRow();
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel1})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:oSelect1
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel2})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:oSelect2
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel3})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:[new sap.m.Input(oController.PAGEID+"_Lnmhg",{placeholder:oBundleText.getText("LABEL_44040"),width:"30%",value:"{Lnmhg}",editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}}),new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.Input(oController.PAGEID+"_Fnmhg",{placeholder:oBundleText.getText("LABEL_44041"),width:"60%",value:"{Fnmhg}",editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}})]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new c.layout.MatrixLayoutRow();
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel4})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:oRegNo
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel5})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:oTxt
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel6})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:[new sap.m.DatePicker({width:"70%",
            valueFormat : "yyyy-MM-dd",
            minDate:new Date(1900,1,1),
            maxDate:new Date(),
            displayFormat : gDtfmt,
            editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }},
            value:{path: "Zzbdate",
            type: new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})}}),
            new sap.m.CheckBox(oController.PAGEID+"_Zzclass",{text:oBundleText.getText("LABEL_44033"),selected:{path:"Zzclass",formatter:function(fVal){
                if(fVal&&fVal=="2"){
                    return true;
                }else{
                    return false;
                }
            }},editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}})]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new c.layout.MatrixLayoutRow();
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel7})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:oSelect3
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel8})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            colSpan:3,
            content:oSelect4
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new c.layout.MatrixLayoutRow();
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel9})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:oSelect5
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel10})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            colSpan:3,
            content:new sap.m.Input({maxLength: 20,width:"444px",value:"{Fasin}",editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}})
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new c.layout.MatrixLayoutRow();
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel11})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:new sap.m.CheckBox(oController.PAGEID+"_Dptid",{selected:{path:"Dptid",formatter:function(fVal){
                if(fVal&&fVal=="X"){
                    return true;
                }else{
                    return false;
                }
            }},editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}})
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel12})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:new sap.m.CheckBox(oController.PAGEID+"_Livid",{selected:{path:"Livid",formatter:function(fVal){
                if(fVal&&fVal=="X"){
                    return true;
                }else{
                    return false;
                }
            }},editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}})
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel13})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            content:new sap.m.CheckBox(oController.PAGEID+"_Helid",{selected:{path:"Helid",formatter:function(fVal){
                if(fVal&&fVal=="X"){
                    return true;
                }else{
                    return false;
                }
            }},editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}})
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new c.layout.MatrixLayoutRow();
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel14})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            colSpan:5,
            content:new sap.m.Input({maxLength: 100,width:"894px",value:"{Notes}",editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}})
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new c.layout.MatrixLayoutRow(oController.PAGEID+"_ModLine");
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Right",
            content:new sap.ui.core.HTML({content:oLabel16})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            colSpan:5,
            content:new sap.m.Input({width:"894px",maxLength:40,value:"{Reqrs}",editable:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}})
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new c.layout.MatrixLayoutRow(oController.PAGEID+"_ModLine2");
        // oCell=new c.layout.MatrixLayoutCell({
        //     hAlign:"Right",
        //     content:new sap.ui.core.HTML({content:oLabel15})
        // }).addStyleClass("LabelCell");
        // oRow.addCell(oCell);

        var oFileUploader = sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController);

        oCell=new c.layout.MatrixLayoutCell({
            hAlign:"Begin",
            colSpan:6,
            content:[oFileUploader]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        var oContent = new sap.m.FlexBox({
            justifyContent: "Center",
            fitContainer: true,
            items: [oMat]
        }).addStyleClass("paddingbody");

        oController.getSelector();
        var oDialog = new sap.m.Dialog(oController.PAGEID+"_Dialog",{
            content: [oContent],
            buttons: [
            new sap.m.Button(oController.PAGEID+"_Re",{text:oBundleText.getText("LABEL_44035"),press:function(){oController.onRe()},visible:{path:"Status",formatter:function(fVal){
                return fVal=="88"?true:false;
            }}}).addStyleClass("button-dark"),
            new sap.m.Button({text:oBundleText.getText("LABEL_44031"),press:function(){oController.onSave()},visible:{path:"Opener",formatter:function(fVal){
                return fVal=="X"?true:false;
            }}}).addStyleClass("button-dark"),new sap.m.Button({text:oBundleText.getText("LABEL_00133"),press:oController.onClose}).addStyleClass("button-delete")],
            contentWidth: "1366px",
            afterOpen:function(){oController.onAfterOpen(oDialog)}
        });	

        return oDialog;
}});