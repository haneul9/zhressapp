$.sap.require("common.PickOnlyDatePicker");
sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.popup", {
    createContent: function (oController) {
        var oRow,oCell,oMat,c=sap.ui.commons;
        for(var i=17;i<56;i++) { 
            window["oLabel"+(i-17)] = oController.getTxt("LABEL_470"+i,i);
        }
        var oLabel39=oController.getTxt("LABEL_47087",56);
        var oSelector1=new sap.m.Select(oController.PAGEID+"_dSel1",{width:"80%",selectedKey:"{PatiName}",change:oController.changeSel,editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})
        ,oSelector2=new sap.m.Select(oController.PAGEID+"_dSel2",{width:"80%",selectedKey:"{HospType}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }},change:oController.changeSel2});
        var oMat=new sap.ui.commons.layout.MatrixLayout({
            columns:6
        });
        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel0}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new common.PickOnlyDatePicker({width:"90%",
        displayFormat: gDtfmt,
        placeholder: gDtfmt,
        value : {
            path : "MedDate", 
            type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
        },
        valueFormat: "yyyy-MM-dd",editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel1}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oSelector1}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel2}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"80%",editable:false,maxLength:13,value:"{RelationTx}",
                                                          customData:new sap.ui.core.CustomData({key:"Rel",value:"{Relation}"}),editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel3}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:oSelector2}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel4}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({showValueHelp: true,
                                            width:"80%",
                                            valueHelpOnly: true,
                                            value:"{HospName}",
                                            valueHelpRequest: oController.onSearchMed,editable:{parts:[{path:"Close"},{path:"Status"}],
                                            formatter:function(fVal,fVal2){
                                                if(fVal2==""){
                                                    return fVal=="X"?false:true;
                                                }else{
                                                    return false;
                                                }
                                            }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel5}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.m.Input({width:"80%",editable:false,maxLength:13,value:"{Comid}",editable:false})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel6}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:3,content:new sap.m.Input({width:"80%",value:"{DiseName}",maxLength:50,editable:{parts:[{path:"Close"},{path:"Status"}],
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
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",content:new sap.ui.commons.TextView({
            text : {
                path : "Begda", 
                type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
            },
            textAlign : "Center"
        }).addStyleClass("FontFamily")}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        
        var miniMat=new sap.ui.commons.layout.MatrixLayout({
            columns:2,
            widths:['20%']
        }); 
        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({
            content:new sap.m.CheckBox(oController.PAGEID+"_Chk1",{selected:"{Chk1}",select:oController.onChk1,editable:{parts:[{path:"Close"},{path:"Status"},{path:"Relation"}],
            formatter:function(fVal,fVal2,fVal3){
                if(fVal2==""){
                    return fVal3!="01"&&fVal3!="02"?false:true;
                    return fVal=="X"?false:true;
                }else{
                    return false;
                }
            }}})
        });
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({
            content:fragment.COMMON_ATTACH_FILES.renderer(oController,"001")
        });
        oRow.addCell(oCell);
        miniMat.addRow(oRow);

        var miniMat2=new sap.ui.commons.layout.MatrixLayout({
            columns:2,
            widths:['20%']
        }); 
        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({
            content:new sap.m.CheckBox(oController.PAGEID+"_Chk2",{selected:"{Chk2}",select:oController.onChk2,editable:{parts:[{path:"Close"},{path:"Status"},{path:"Relation"}],
                    formatter:function(fVal,fVal2,fVal3){
                        if(fVal2==""){
                            return fVal3!="01"&&fVal3!="02"?false:true;
                            return fVal=="X"?false:true;
                        }else{
                            return false;
                        }
                    }}})
        });
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({
            content:fragment.COMMON_ATTACH_FILES.renderer(oController,"002")
        });
        oRow.addCell(oCell);
        miniMat2.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:[new HoverIcon({            
            src: "sap-icon://information",
            hover: function(oEvent) {
                common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47002"));
            },
            leave: function(oEvent) {
                common.Common.onPressTableHeaderInformation.call(oController, oEvent);
            }
        })
        .addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue"),oLabel8]}).addStyleClass("LabelCell");
        oRow.addCell(oCell);

        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:2,content:[miniMat]}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:[new HoverIcon({            
            src: "sap-icon://information",
            hover: function(oEvent) {
                common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47003"));
            },
            leave: function(oEvent) {
                common.Common.onPressTableHeaderInformation.call(oController, oEvent);
            }
        }).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue"),oLabel9]}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:2,content:miniMat2}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Right",content:oLabel10}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Begin",colSpan:5,content:new sap.m.Input({width:"90%",value:"{Remark}",maxLength:100,editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        var oPanel1 = new sap.m.Panel({
			expanded:true,
			expandable:false,
			content:oMat
		});

        var oMat2=new sap.ui.commons.layout.MatrixLayout({
            columns:10,
            widths:['140px']
        });

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel13,rowSpan:2}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel14,colSpan:2}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel15,colSpan:7}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel16,colSpan:2}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel17,colSpan:4}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel18,colSpan:3}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel19}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel20}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel39}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel21}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel22}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel23}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel24}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel25}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel26}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel27}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel28}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input(oController.PAGEID+"_Inp1",{width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zkibbm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input(oController.PAGEID+"_Inp2",{width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zkijbm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input(oController.PAGEID+"_Inp3",{width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znijcm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input(oController.PAGEID+"_Inp4",{width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zniiwm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input(oController.PAGEID+"_Inp5",{width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znisdm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input(oController.PAGEID+"_Inp6",{width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znoctm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input(oController.PAGEID+"_Inp7",{width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znomrm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input(oController.PAGEID+"_Inp8",{width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znocum}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input(oController.PAGEID+"_Inp9",{width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Znobcm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel29}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",editable:false,maxLength:13,value:"{Zkiobd}"})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",editable:false,maxLength:13,value:"{Zkijbd}"})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",editable:false,maxLength:13,value:"{Znijcd}"})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",editable:false,maxLength:13,value:"{Zniiwd}"})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",editable:false,maxLength:13,value:"{Znisdd}"})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",editable:false,maxLength:13,value:"{Znoctd}"})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",editable:false,maxLength:13,value:"{Znomrd}"})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",editable:false,maxLength:13,value:"{Znocud}"})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",editable:false,maxLength:13,value:"{Znobcd}"})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

        // oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        // oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel30}).addStyleClass("LabelCell");
        // oRow.addCell(oCell);
        // oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",colSpan:2,content:fragment.COMMON_ATTACH_FILES.renderer(oController,"003")}).addStyleClass("DataCell");
        // oRow.addCell(oCell);
        // oCell=new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("DataCell");
        // oRow.addCell(oCell);
        // oCell=new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("DataCell");
        // oRow.addCell(oCell);
        // oCell=new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("DataCell");
        // oRow.addCell(oCell);
        // oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"004")}).addStyleClass("DataCell");
        // oRow.addCell(oCell);
        // oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"005")}).addStyleClass("DataCell");
        // oRow.addCell(oCell);
        // oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"006")}).addStyleClass("DataCell");
        // oRow.addCell(oCell);
        // oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:fragment.COMMON_ATTACH_FILES.renderer(oController,"007")}).addStyleClass("DataCell");
        // oRow.addCell(oCell);
        // oMat2.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel31}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",
        editable:false,maxLength:13,value:{path:"Mycharge",formatter:function(fVal){
            if(fVal!=""&&fVal!=null){
                return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
            }else{
                return fVal;
            }
        },editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);

        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:
        new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oController.getBundleText("LABEL_47118")+"</span>"})}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",liveChange:oController.onLiveMoney,maxLength:13,value:"{Zdsctm}",editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);

        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel32}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",
        editable:false,maxLength:13,value:{path:"BaseAmt",formatter:function(fVal){
            if(fVal!=""&&fVal!=null){
                return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
            }
        },editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);

        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel33}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",
        editable:false,maxLength:13,value:{path:"SuppAmt",formatter:function(fVal){
            if(fVal!=""&&fVal!=null){
                return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
            }
        },editable:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({colSpan:2}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);
 
        var oMat3=new sap.ui.commons.layout.MatrixLayout({
            columns:9,
            widths:['140px']
        });
        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Button({text:oBundleText.getText("LABEL_47051"),
            press:function(){oController.onCal("1000")},visible:{parts:[{path:"Close"},{path:"Status"}],
        formatter:function(fVal,fVal2){
            if(fVal2==""){
                return fVal=="X"?false:true;
            }else{
                return false;
            }
        }}}).addStyleClass("button-light")});
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel35}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",
        editable:false,maxLength:13,value:{path:"Zmedrl",formatter:function(fVal){
            if(fVal!=""&&fVal!=null){
                return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel36}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",
        editable:false,maxLength:13,value:{path:"Zfvcrl",formatter:function(fVal){
            if(fVal!=""&&fVal!=null){
                return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel37}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",
        editable:false,maxLength:13,value:{path:"Ziftrl",formatter:function(fVal){
            if(fVal!=""&&fVal!=null){
                return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:oLabel38}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",content:new sap.m.Input({width:"90%",textAlign:"Right",
        editable:false,maxLength:13,value:{path:"Zdbcrl",formatter:function(fVal){
            if(fVal!=""&&fVal!=null){
                return common.Common.numberWithCommas(fVal.replace(/\,/g,"")).trim()
            }
        }}})}).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat3.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({
            colSpan:9,
            content:new sap.ui.core.HTML({content:"<div style='height:8px;'></div>"})
        });
        oRow.addCell(oCell);
        oMat3.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({ 
            colSpan:9,
            content:new sap.ui.core.HTML({content:"<div style='height:3px;'></div><span style='color:red;font-size:14px;'>"+oController.getBundleText("MSG_47038")+"<br/>"+oController.getBundleText("MSG_47039")+"</span>"})
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat3.addRow(oRow);

        oRow=new sap.ui.commons.layout.MatrixLayoutRow();
        oCell=new sap.ui.commons.layout.MatrixLayoutCell({hAlign:"Center",colSpan:9,content:fragment.COMMON_ATTACH_FILES.renderer(oController,"009")});
        oRow.addCell(oCell);
        oMat3.addRow(oRow);

        var oPanel2 = new sap.m.Panel({
			headerToolbar : [new sap.m.Toolbar({content:[new sap.ui.core.HTML({content:"<span style='font-size:16px;font-weight:bold;'>"+oBundleText.getText("LABEL_47028")+"</span>"}),
                            new sap.m.ToolbarSpacer({width:"20px"}),new sap.ui.core.HTML({content:"<span style='font-size:14px;color:red;'>"+oBundleText.getText("LABEL_47029")+"</span>"})]})],
			expanded:true,
			expandable:false,
			content:[oMat2,new sap.ui.core.HTML({content:"<div style='height:5px;'/>"}),oMat3]
		});

        var oVert=new sap.ui.commons.layout.VerticalLayout({
            content:[oPanel1,oPanel2]
        });

        var oContent = new sap.m.FlexBox({
            justifyContent: "Center",
            fitContainer: true,
            items: [oVert]
        }).addStyleClass("paddingbody");

        var oDialog = new sap.m.Dialog(oController.PAGEID+"_Dialog",{
            content: [oContent],
            title: oBundleText.getText("LABEL_47001"),
            buttons: [
                new sap.m.Button({
                    press: function(){oController.onSave("1000")},
                    text: "{i18n>LABEL_47006}" // 신청
                    ,visible:{parts:[{path:"Close"},{path:"Status"}],
                    formatter:function(fVal,fVal2){
                        if(fVal2==""){
                            return fVal=="X"?false:true;
                        }else{
                            return false;
                        }
                    }}}).addStyleClass("button-search"),
                new sap.m.Button({text:oBundleText.getText("LABEL_00133"),press:oController.onClose}).addStyleClass("button-delete")],
            contentWidth: "1700px",
            afterOpen : oController.onAfterOpen
        }).setModel(oController._DataModel);	

        return oDialog;
}});