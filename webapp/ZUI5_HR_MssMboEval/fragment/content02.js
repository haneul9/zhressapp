jQuery.sap.declare("ZUI5_HR_MssMboEval.fragment.content02");
ZUI5_HR_MssMboEval.fragment.content02={
	renderPanel : function(oController,vApprc,vPage){
		var oRow,oCell;
		var c = sap.ui.commons;
		var m = sap.m;

		var mTable1 = new c.layout.MatrixLayout(oController.PAGEID+"_"+vPage+"_mTable1",{
			columns:22,
			width : "100%"
		});
		var width1=new Array();
		for(var i=0;i<22;i++){
			width1.push("");
		}
		mTable1.setWidths(width1);
		var oLabels=new Array();
		for(var i=0;i<=3;i++){			
			if(i>=2){
				oLabels.push({Label:"LABEL_3601"+i,rowspan:1,colspan:1});
			}else{
				oLabels.push({Label:"LABEL_3601"+i,rowspan:2,colspan:1});
			}
		}
		for(var i=14;i<=22;i++){
			oLabels.push({Label:"LABEL_360"+i,rowspan:1,colspan:2});
		}
		for(var i=2;i<=5;i++){
			oLabels.push({Label:"LABEL_3605"+i,rowspan:1,colspan:1});
		}
		oLabels.push({Label:"LABEL_36053",rowspan:1,colspan:1});
		oLabels.push({Label:"LABEL_36054",rowspan:1,colspan:1});
		for(var i=0;i<7;i++){
			oLabels.push({Label:"LABEL_36023",rowspan:1,colspan:1});
			oLabels.push({Label:"LABEL_36024",rowspan:1,colspan:1});
		}
		oRow = new c.layout.MatrixLayoutRow();
		for(var i=0;i<13;i++){
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Center",
				rowSpan : oLabels[i].rowspan,
				colSpan : oLabels[i].colspan,
				content : new sap.m.Text({text:oBundleText.getText(oLabels[i].Label)}).addStyleClass("Bold")
			}).addStyleClass("TableLabelCell"); 
			oRow.addCell(oCell);
		}
		mTable1.addRow(oRow);
		oRow = new c.layout.MatrixLayoutRow();
		for(var i=13;i<33;i++){
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Center",
				rowSpan : oLabels[i].rowspan,
				colSpan : oLabels[i].colspan,
				content : new sap.m.Text({text:oBundleText.getText(oLabels[i].Label)}).addStyleClass("Bold")
			}).addStyleClass("TableLabelCell"); 
			oRow.addCell(oCell);
		}
		mTable1.addRow(oRow);
		var mCol1 = new c.layout.MatrixLayout(oController.PAGEID+"_"+vPage+"_mCol1",{
			columns:22,
			layoutFixed:true
		});
		var width1=new Array();
		for(var i=0;i<22;i++){
			width1.push("");
		}
		mCol1.setWidths(width1);

		var mScr = new sap.m.ScrollContainer(oController.PAGEID+"_"+vPage+"_Scroll",{
			vertical:true,
			width : "100%",
			height : "120px",
			content : mCol1
		});
		oRow = new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell(oController.PAGEID+"_"+vPage+"_ContentCell",{
			colSpan : 22,
			content : mScr
		});
		oRow.addCell(oCell);
		mTable1.addRow(oRow);

		var oPanel = new m.Panel({
			headerToolbar : [new sap.m.Toolbar({content:[new sap.m.Text({text:oBundleText.getText("LABEL_36051")}).addStyleClass("Bold Font16")]})],
			expanded:true,
			expandable:false,
			content:mTable1
		});

		var gTable=new c.layout.MatrixLayout(oController.PAGEID+"_"+vPage+ "_gTable",{
			columns : 11
		});
		var oLabels2=new Array();
		for(var i=57;i<68;i++){
			if(i<=58){
				oLabels2.push({Label:"LABEL_360"+i,rowspan:1,colspan:1});
			}else if(i==59){
				oLabels2.push({Label:"LABEL_360"+i,rowspan:1,colspan:1});
			}else{
				oLabels2.push({Label:"LABEL_360"+i,rowspan:1,colspan:1});
			}
		}
		oRow=new c.layout.MatrixLayoutRow();
		for(var i=0;i<oLabels2.length;i++){
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Center",
				rowSpan : oLabels2[i].rowspan,
				colSpan : oLabels2[i].colspan,
				content : new sap.m.Text({text:oBundleText.getText(oLabels2[i].Label)}).addStyleClass("Bold")
			}).addStyleClass("TableLabelCell"); 
			oRow.addCell(oCell);
		}
		gTable.addRow(oRow);

		var gCol=new c.layout.MatrixLayout(oController.PAGEID+"_"+vPage+ "_gCol",{
			columns : 11,
			widths:['90px','65px','100px']
		});
		var oScrCon=new sap.m.ScrollContainer({
			content : [gCol],
			width:"100%",
			vertical : true,
			height:"350px"
		});
		oRow=new c.layout.MatrixLayoutRow();
		oCell=new c.layout.MatrixLayoutCell(oController.PAGEID+"_"+vPage+"_gContentCell",{
			colSpan:11,
			content:oScrCon
		});
		oRow.addCell(oCell);
		gTable.addRow(oRow);

		var bMat=new c.layout.MatrixLayout();
		oRow=new c.layout.MatrixLayoutRow();
		oCell=new c.layout.MatrixLayoutCell({
			hAlign : "Right",
			content: [new sap.m.Button(oController.PAGEID+"_"+vPage+"_SaveFin",{
				icon : "sap-icon://save",
				visible : false,
				text : oBundleText.getText("LABEL_35021"),
				press : function(){oController.onSaveFin();}
			}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),
			new sap.m.Button(oController.PAGEID+"_"+vPage+"_Fin",{
				icon : "sap-icon://task",
				visible : false,
				text : oBundleText.getText("LABEL_36068"),
				press : function(){oController.onFin();}
			}).addStyleClass("button-dark")]
		});
		oRow.addCell(oCell);
		bMat.addRow(oRow);
		

		var oPanel2 = new m.Panel({
			headerToolbar : [new sap.m.Toolbar({content:[new sap.m.Text({text:oBundleText.getText("LABEL_36056")}).addStyleClass("Bold Font16")]})],
			expanded:true,
			expandable:false,
			content:[new sap.ui.core.Icon({size:"14px",src:"sap-icon://message-information",color:"green"}),
			new sap.ui.core.HTML({content:"<span style='line-height:33px;font-size:14px;color:red;'>&nbsp;"+oBundleText.getText("LABEL_36069")+"</span>"}),gTable,new sap.ui.core.HTML({content:"<div style='height:5px;' />"})]
		});
		
		var oContents3=[oPanel,oPanel2,bMat];
		var oFinalMat=new c.layout.MatrixLayout();
		oContents3.forEach(function(e){
			oRow=new c.layout.MatrixLayoutRow();
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Begin",
				content : e
			});
			oRow.addCell(oCell);
			oFinalMat.addRow(oRow);
		});
		return oFinalMat;
	}
};