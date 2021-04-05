$.sap.require("common.PickOnlyDatePicker");
sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.minipop", {
    createContent: function (oController) {
        var oRow,oCell,oMat,c=sap.ui.commons,oSel=new sap.m.Select(oController.PAGEID+"_mSel",{width:"180px",change:oController.onChange});
        oSel.addItem(new sap.ui.core.Item({key:"1",text:oBundleText.getText("LABEL_47059")}));
        oSel.addItem(new sap.ui.core.Item({key:"2",text:oBundleText.getText("LABEL_47060")}));
        oSel.setSelectedKey("1");

        oMat=new c.layout.MatrixLayout();
        oRow=new c.layout.MatrixLayoutRow();
        oCell=new c.layout.MatrixLayoutCell({
           content:[oSel,new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.Input(oController.PAGEID+"_mInput",{width:"300px",
           submit: oController.onMiniSearch}),new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.Button({
            press: oController.onMiniSearch,
            text: "{i18n>LABEL_23010}", // 조회
        }).addStyleClass("button-search btn-margin"),new sap.m.Button({
            press: oController.onMiniAdd,
            text: "{i18n>LABEL_00153}", // 추가
        }).addStyleClass("button-search righter btn-margin")]
        });
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        oRow=new c.layout.MatrixLayoutRow();
        oCell=new c.layout.MatrixLayoutCell({
           content:[new sap.ui.core.HTML({content:"<div style='height:2px;'/>"})]
        });
        oRow.addCell(oCell);
        oMat.addRow(oRow);
        var oJSON=new sap.ui.model.json.JSONModel();
        var oTable = new sap.ui.table.Table(oController.PAGEID+"_dTable", {
			selectionMode: "Single",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
            selectionBehavior:sap.ui.table.SelectionBehavior.RowOnly,
			width: "auto",
			noData: "{i18n>MSG_05001}"
		}).setModel(oJSON).addStyleClass("mt-8px");

        var oFields=["HospName","Comid"];			
        var oWidths=['',''];			
        var oLabels=new Array();
        for(var i=59;i<61;i++){
            i<10?i="0"+i:null;
            oLabels.push({Label:"LABEL_470"+i,Width:oWidths[i-59],Align:"Center"});
        }
        oLabels.forEach(function(e,i){
            var oCol=new sap.ui.table.Column({
                flexible : false,
                autoResizable : true,
                resizable : true,
                showFilterMenuEntry : true,
                filtered : false,
                sorted : false
            });
            oCol.setWidth(e.Width);
            oCol.setHAlign(e.Align);
            oCol.setLabel(new sap.m.Text({text:oBundleText.getText(e.Label),textAlign:e.Align}));				
            oCol.setTemplate(new sap.ui.commons.TextView({text:"{"+oFields[i]+"}",textAlign:"Center"}).addStyleClass("FontFamily"));			
            oTable.addColumn(oCol);
        });

        oRow=new c.layout.MatrixLayoutRow(oController.PAGEID+"_TableRow");
        oCell=new c.layout.MatrixLayoutCell({
           content:[oTable]
        });
        oRow.addCell(oCell);
        oMat.addRow(oRow);

        var oNotice=new sap.ui.core.HTML({preferDOM:false,
            content:"<div style='border:1px solid rgb(140,140,140);background-color:rgb(240,240,240);border-radius:10px;padding:15px;'><span style='color:black;font-size:13px;'>"+
            oBundleText.getText("MSG_47005")+"</span>"
            +"<br/><button id='"+oController.PAGEID+"_NoticeBtn' style='width:180px;display:inline-block;' class='sapMBtnBase sapMBtn button-delete sapMBarChild'>"
            +"<span class='sapMBtnInner sapMBtnHoverable sapMFocusable sapMBtnText sapMBtnDefault' style='line-height:33px;'>"+oBundleText.getText("LABEL_47062")+"</span>"+
            "</button><br/><span style='color:black;font-size:13px;'><br/>"+
            oBundleText.getText("MSG_47006")+"</span></div>"
        });$(document).on("click","#"+oController.PAGEID+"_NoticeBtn",oController.clickNotice);

        oRow=new c.layout.MatrixLayoutRow(oController.PAGEID+"_NewRow");
        oCell=new c.layout.MatrixLayoutCell({
           content:[oNotice]
        });
        oRow.addCell(oCell);
        oMat.addRow(oRow);
		
        var oContent = new sap.m.FlexBox({
            justifyContent: "Center",
            fitContainer: true,
            items: [oMat]
        }).addStyleClass("paddingbody");

        var oDialog = new sap.m.Dialog(oController.PAGEID+"_miniDialog",{
            title : oBundleText.getText("LABEL_47056"),
            content: [oContent],
            buttons: [new sap.m.Button({text:oBundleText.getText("LABEL_00133"),press:oController.onCloseMini}).addStyleClass("button-delete")],
            contentWidth: "660px",
            beforeOpen : oController.onMini,
            afterOpen : oController.onFocusMini
        });	

        return oDialog;
}});