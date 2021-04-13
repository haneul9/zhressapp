$.sap.require("common.PickOnlyDatePicker");
sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.popup2", {
    createContent: function (oController) {
        var oRow,oCell,oMat,c=sap.ui.commons;
        for(var i=63;i<87;i++) { 
            window["oLabel"+(i-63)] = oController.getTxt("LABEL_470"+i,i);
        }
        var oMat=new sap.ui.commons.layout.MatrixLayout({
            columns:6,
            widths:['15%','','15%','','15%']
        });
        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel0}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new common.PickOnlyDatePicker({width:"99%",
        displayFormat: gDtfmt,
        placeholder: gDtfmt,
        value : {
            path : "MedDate", 
            type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
        },
        valueFormat: "yyyy-MM-dd",editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel3}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Select(oController.PAGEID+"_dSel5",{width:"99%",change:oController.onChange5,selectedKey:"{Relation}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel4}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Select(oController.PAGEID+"_dSel6",{width:"99%",selectedKey:"{PatiName}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel5}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new common.PickOnlyDatePicker({width:"99%",
        displayFormat: gDtfmt,
        placeholder: gDtfmt,
        value : {
            path : "Inpdt", 
            type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
        },
        valueFormat: "yyyy-MM-dd",editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
        formatter : function(fVal1, fVal2, fVal3){
            if(fVal1=="X"){
                return false;
            }else{
                if(fVal3==""){
                    if(fVal2=="C"||fVal2=="D"){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel1}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Select(oController.PAGEID+"_dSel3",{width:"99%",change:oController.onChange3,selectedKey:"{Gtz51}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel2}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Select(oController.PAGEID+"_dSel4",{width:"99%",selectedKey:"{Gtz51s}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel6}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:3,content:new sap.m.Input({width:"99%",value:"{HospName}",maxLength:50,editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel7}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",value:"{Recno}",maxLength:20,editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:[oLabel8]}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:3,content:new sap.m.Input({width:"99%",value:"{DiseName}",maxLength:50,editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:[oLabel9]}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",value:"{Pdcnt}",maxLength:3,editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel10}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:3,content:new sap.m.Input({width:"99%",value:"{Remark}",maxLength:100,editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:[oLabel11]}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Text({text:{path:"Begda",type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        var oPanel1 = new sap.m.Panel({
			expanded:true,
			expandable:false,
			content:oMat
		});

        var oMat2=new sap.ui.commons.layout.MatrixLayout({
            columns:6,
            widths:['15%','','15%','','15%']
        });
//1
        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel12}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Ptamt}",
        editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
        formatter : function(fVal1, fVal2, fVal3){
            if(fVal1=="X"){
                return false;
            }else{
                if(fVal3==""){
                    if(fVal2=="C"||fVal2=="D"){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel13}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Medsp}",
        editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
        formatter : function(fVal1, fVal2, fVal3){
            if(fVal1=="X"){
                return false;
            }else{
                if(fVal3==""){
                    if(fVal2=="D"){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel14}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Oiamt}",
        editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
        formatter : function(fVal1, fVal2, fVal3){
            if(fVal1=="X"){
                return false;
            }else{
                if(fVal3==""){
                    if(fVal2=="C"||fVal2=="D"){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);
//2
        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel15}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znobcm}"
        ,editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
        formatter : function(fVal1, fVal2, fVal3){
            if(fVal1=="X"){
                return false;
            }else{
                if(fVal3==""){
                    if(fVal2!="C"){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel16}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Medpp}",
        editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
        formatter : function(fVal1, fVal2, fVal3){
            if(fVal1=="X"){
                return false;
            }else{
                if(fVal3==""){
                    if(fVal2=="C"){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel17}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Insnp}",
        editable:{parts : [{path : "Close"}, {path : "Gtz51"}, {path:"Status"}],
        formatter : function(fVal1, fVal2, fVal3){
            if(fVal1=="X"){
                return false;
            }else{
                if(fVal3==""){
                    if(fVal2=="C"||fVal2=="D"){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);
//3
        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel18}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znobcd}",editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel19}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Medmp}",editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel20}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Inspp}",editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);
//4
        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:[new HoverIcon({            
            src: "sap-icon://information",
            hover: function(oEvent) {
                common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47009"));
            },
            leave: function(oEvent) {
                common.Common.onPressTableHeaderInformation.call(oController, oEvent);
            }
        })
        .addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue"),oLabel21]}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zdbcrl}",editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:[new HoverIcon({            
            src: "sap-icon://information",
            hover: function(oEvent) {
                common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47010"));
            },
            leave: function(oEvent) {
                common.Common.onPressTableHeaderInformation.call(oController, oEvent);
            }
        })
        .addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue"),oLabel22]}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Ziftrl}",editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel23}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"99%",textAlign:"End",liveChange:oController.onLiveMoney,maxLength:13,value:"{Framt}",editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({colSpan:6,content:new sap.ui.core.HTML({content:"<div style='height:3px;'></div><span style='color:red;font-size:12px;'>"+oController.getBundleText("MSG_47039")+"</span>"})});
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({colSpan:6,content:new sap.ui.core.HTML({content:"<div style='height:10px;' />"})});
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({colSpan:6,content:fragment.COMMON_ATTACH_FILES.renderer(oController,"008")});
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

        var oPanel2 = new sap.m.Panel({
			headerToolbar : [new sap.m.Toolbar({content:[new sap.ui.core.HTML({content:"<span style='font-size:16px;font-weight:bold;'>"+oBundleText.getText("LABEL_47028")+"</span>"})]})],
			expanded:true,
			expandable:false,
			content:oMat2
		});

        var oVert=new sap.ui.commons.layout.VerticalLayout({
            content:[oPanel1,oPanel2]
        });

        var oContent = new sap.m.FlexBox({
            justifyContent: "Center",
            fitContainer: true,
            items: [oVert]
        }).addStyleClass("paddingbody");

        var oDialog = new sap.m.Dialog(oController.PAGEID+"_Dialog2",{
            content: [oContent],
            title : oBundleText.getText("LABEL_47001"),
            buttons: [new sap.m.Button({
                press: function(){oController.onSave("A100")},
                text: "{i18n>LABEL_47006}" // 신청
                ,visible:{parts:[{path:"Close"},{path:"Status"}],
                formatter:function(fVal,fVal2){
                    if(fVal2==""){
                        return fVal=="X"?false:true;
                    }else{
                        return false;
                    }
                }}}).addStyleClass("button-search"),new sap.m.Button({text:oBundleText.getText("LABEL_00133"),press:oController.onClose2}).addStyleClass("button-delete")],
            contentWidth: "1600px",
            afterOpen : oController.onAfterOpen2
        }).setModel(oController._DataModel);	

        return oDialog;
}});