jQuery.sap.declare("ZUI5_HR_MssMboEval.fragment.content01");

ZUI5_HR_MssMboEval.fragment.content01={
	renderPanel : function(oController,vApprc,vPage){
		var oRow,oCell;
		var c = sap.ui.commons;
		var m = sap.m;
		var oMat = new c.layout.MatrixLayout({
			columns:4,
			widths:['12%','','12%','']
		});
		// oRow = new c.layout.MatrixLayoutRow({height:"50px"});
		// oCell = new c.layout.MatrixLayoutCell({
		// 	hAlign : "Center",
		// 	content : new sap.m.Text({text:oBundleText.getText("LABEL_36007")}).addStyleClass("Bold")
		// }).addStyleClass("LabelCell");
		// oRow.addCell(oCell);
		// oCell = new c.layout.MatrixLayoutCell({
		// 	hAlign : "Begin",
		// 	content : [new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Select(oController.PAGEID+"_"+vPage+"_Sel1",{width:"50%"})]
		// }).addStyleClass("DataCell");
		// oRow.addCell(oCell);
		// oCell = new c.layout.MatrixLayoutCell({
		// 	hAlign : "Center",
		// 	content : new sap.m.Text({text:oBundleText.getText("LABEL_36010")}).addStyleClass("Bold")
		// }).addStyleClass("LabelCell");
		// oRow.addCell(oCell);
		// oCell = new c.layout.MatrixLayoutCell({
		// 	hAlign : "Begin",
		// 	content : [new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Select(oController.PAGEID+"_"+vPage+"_Sel2",{width:"50%"}),
		// 	new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),
		// 	new sap.m.Button({
        //         icon : "sap-icon://search",
        //         text : oBundleText.getText("LABEL_00100"),
        //         press : function(){oController.onSearch1(oController,"4"+vPage);}
        //     }).addStyleClass("button-search")]
		// }).addStyleClass("DataCell");
		// oRow.addCell(oCell);
		// oMat.addRow(oRow);

		var oHeader = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_36007}", // 진료일								
							}),							
							new sap.m.Select(oController.PAGEID+"_"+vPage+"_Sel1",{width:"180px"}),
							new sap.m.Label({
								text: "{i18n>LABEL_36070}", // 평가직군				
							}),
                            new sap.m.Select(oController.PAGEID+"_"+vPage+"_Sel3",{width:"180px"}),
							new sap.m.Label({
								text: "{i18n>LABEL_36071}", // 직급			
							}),
                            new sap.m.Select(oController.PAGEID+"_"+vPage+"_Sel2",{width:"180px"})
						]
                    }).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.Button({	
								press : function(){oController.onSearch1(oController,"4"+vPage);},	
								text: "{i18n>LABEL_00100}", // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
			}).addStyleClass("search-box search-bg pb-7px")

		var oTable1 = new sap.ui.table.Table(oController.PAGEID+"_"+vPage+ "_Table1", {
			selectionMode: sap.ui.table.SelectionMode.Single,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "auto",
			selectionBehavior:sap.ui.table.SelectionBehavior.RowOnly,
			noData: "{i18n>MSG_05001}"
		}).addStyleClass("mt-8px").attachCellClick(function(oEvent){oController.onSelectedRow(oEvent,vPage)});

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
			oLabels.push({Label:"LABEL_3601"+i,rowspan:2,colspan:1});
		}
		for(var i=14;i<=22;i++){
			oLabels.push({Label:"LABEL_360"+i,rowspan:1,colspan:2});
		}
		for(var i=0;i<9;i++){
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
		for(var i=13;i<31;i++){
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
			columns:22
		});
		var width1=new Array();
		for(var i=0;i<22;i++){
			width1.push("");
		}
		mCol1.setWidths(width1);

		var mScr = new sap.m.ScrollContainer(oController.PAGEID+"_"+vPage+"_Scroll1",{
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
			headerToolbar : [new sap.m.Toolbar({content:[new sap.m.Text({text:oBundleText.getText("LABEL_36009")}).addStyleClass("Bold Font16")]})],
			expanded:true,
			expandable:false,
			content:mTable1
		});

		var oPanel2 = new m.Panel({
			headerToolbar : [new sap.m.Toolbar({content:[new sap.ui.core.HTML(oController.PAGEID+"_"+vPage+"_CurTxt",{preferDOM:false}).addStyleClass("Bold Font16")]})],
			expanded:true,
			expandable:false,
			content:oTable1
		});		

		var oContents=[oHeader,new sap.ui.core.HTML({content:"<div style='height:7px;'/>"}),oPanel,new sap.ui.core.HTML({content:"<div style='height:10px;'/>"}),
		oPanel2
		];
		var oTotMat1=new c.layout.MatrixLayout(oController.PAGEID+"_"+vPage+"_Mat1_1");
		oContents.forEach(function(e){
			oRow=new c.layout.MatrixLayoutRow();
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Begin",
				content : e
			});
			oRow.addCell(oCell);
			oTotMat1.addRow(oRow);
		});

		var oMat2 = new c.layout.MatrixLayout({
			columns:3,
			widths:['','','200px']
        });
        oRow = new c.layout.MatrixLayoutRow();
        oCell = new c.layout.MatrixLayoutCell({
            colSpan : 3,
            hAlign : "End",
            content : new sap.ui.core.HTML({content:"<div style='height:10px;' />"})
        });
        oRow.addCell(oCell);
        oMat2.addRow(oRow);
        oRow = new c.layout.MatrixLayoutRow({height:"33px"});
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Center",
            content : new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_35019")+"</span>"})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Center",
            content : new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_35020")+"</span>"})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Center",
            content : new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_35018")+"</span>"})
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);
        oRow = new c.layout.MatrixLayoutRow();
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Begin",
            content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_"+vPage+"_TextA1_2",{width:"99%",rows:4,editable:false})]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Begin",
            content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_"+vPage+"_TextA1_22",{width:"99%",rows:4,editable:false})]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Begin",
            content : [new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Select(oController.PAGEID+"_"+vPage+"_Sel1_2",{width:"90%",enabled:false}).addStyleClass("L2PFontFamily")]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat2.addRow(oRow);

		var oMat3 = new c.layout.MatrixLayout({
			columns:3,
			widths:['','','200px']
        });
		oRow = new c.layout.MatrixLayoutRow();
        oCell = new c.layout.MatrixLayoutCell({
            colSpan : 3,
            hAlign : "End",
            content : new sap.ui.core.HTML({content:"<div style='height:10px;' />"})
        });
        oRow.addCell(oCell);
		oMat3.addRow(oRow);

		var redStar="<span style='color:red;font-weight:bold;font-size:14px;'>*</span>";
		var oMsg1="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36041")+"</span>";
		var oMsg2="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36042")+"</span>";
		var oMsg3="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36043")+"</span>";
		var oMsg4="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36041")+"</span>";
		var oMsg5="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36042")+"</span>";
		var oMsg6="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36046")+"</span>";
		var oMsg7="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36041")+"</span>";
		var oMsg8="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36042")+"</span>";
		var oMsg9="<span style='font-weight:bold;font-size:14px;'>"+oBundleText.getText("LABEL_36050")+"</span>";

		for(var i=1;i<=9;i++){
			eval("var oHTML"+i+"=new sap.ui.core.HTML({preferDOM:false});");
		}
		if(vPage=="1"){
			oMsg1=oMsg1+=redStar;
			oMsg2=oMsg2+=redStar;
			oMsg3=oMsg3+=redStar;
		}else if(vPage=="2"){
			oMsg4=oMsg4+=redStar;
			oMsg5=oMsg5+=redStar;
			oMsg6=oMsg6+=redStar;
		}else if(vPage=="3"){
			oMsg7=oMsg7+=redStar;
			oMsg8=oMsg8+=redStar;
			oMsg9=oMsg9+=redStar;
		}
		for(var i=1;i<=9;i++){
			eval("oHTML"+i+".setContent(oMsg"+i+");");
		}
		
        oRow = new c.layout.MatrixLayoutRow({height:"33px"});
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Center",
            content : oHTML1}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Center",
            content : oHTML2
        }).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Center",
            content :oHTML3}).addStyleClass("LabelCell");
        oRow.addCell(oCell);
        oMat3.addRow(oRow);
        oRow = new c.layout.MatrixLayoutRow();
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Begin",
            content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_"+vPage+"_TextA1_3",{width:"99%",rows:4})]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Begin",
            content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_"+vPage+"_TextA1_32",{width:"99%",rows:4})]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oCell = new c.layout.MatrixLayoutCell({
            hAlign : "Begin",
            content : [new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Select(oController.PAGEID+"_"+vPage+"_Sel1_3",{width:"90%"}).addStyleClass("L2PFontFamily")]
        }).addStyleClass("DataCell");
        oRow.addCell(oCell);
        oMat3.addRow(oRow);
		if(vPage=="1"){
			oRow = new c.layout.MatrixLayoutRow();
			oCell = new c.layout.MatrixLayoutCell({
				colSpan : 3,
				hAlign : "End",
				content : [new sap.ui.core.HTML({content:"<div style='height:5px;'/>"})]
			});
			oRow.addCell(oCell);
			oMat3.addRow(oRow);
			oRow = new c.layout.MatrixLayoutRow();
			oCell = new c.layout.MatrixLayoutCell({
				colSpan : 3,
				hAlign : "End",
				content : [new sap.m.Button(oController.PAGEID+"_"+vPage+"_Save1_2",{
					icon : "sap-icon://save",
					text : oBundleText.getText("LABEL_35021"),
					press : function(){oController.onSave("S");}
				}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Button(oController.PAGEID+"_"+vPage+"_Finish1_2",{
					icon : "sap-icon://complete",
					text : oBundleText.getText("LABEL_35022"),
					press : function(){oController.onSave("F");}
				}).addStyleClass("button-dark"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Button({
					icon : "sap-icon://arrow-left",
					text : oBundleText.getText("LABEL_36040"),
					press : oController.onBack
				}).addStyleClass("button-light")]
			});
			oRow.addCell(oCell);
			oMat3.addRow(oRow);
		}
		var oBtnMat=new c.layout.MatrixLayout();
		oRow=new c.layout.MatrixLayoutRow();
		oCell=new c.layout.MatrixLayoutCell({
			hAlign:"Right",
			content:[new sap.m.Button({
				icon : "sap-icon://message-information",
				text : oBundleText.getText("LABEL_36037"),
				press : function(){oController.onOpenImg("1");}
			}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Button({
				icon : "sap-icon://message-information",
				text : oBundleText.getText("LABEL_36038"),
				press : function(){oController.onOpenImg("2");}
			}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Button({
				icon : "sap-icon://message-information",
				text : oBundleText.getText("LABEL_36039"),
				press : function(){oController.onOpenImg("3");}
			}).addStyleClass("button-light")]
		});
		oRow.addCell(oCell);
		oBtnMat.addRow(oRow);

        var oPagePanel2 = new m.Panel({
			expanded:true,
            expandable:false,
			headerToolbar : [new sap.m.Toolbar({content:[new sap.m.Text({text:oBundleText.getText("LABEL_36034")}).addStyleClass("Bold Font16")
						]}),
			],
            content:[oMat2]
        });

		var oPagePanel3 = new m.Panel({
			headerToolbar : [new sap.m.Toolbar({content:[new sap.m.Text({text:oBundleText.getText("LABEL_36036")}).addStyleClass("Bold Font16")]})],
			expanded:true,
            expandable:false,
            content:[oMat3]
		});
		
		var oHeader=new c.layout.MatrixLayout();
		oRow=new c.layout.MatrixLayoutRow({height:"45px"});
		oCell=new c.layout.MatrixLayoutCell(oController.PAGEID+"_"+vPage+"_HoriArea");
		oRow.addCell(oCell);
		oHeader.addRow(oRow);
		var oContents2=[oHeader,new sap.ui.core.HTML({
			content:"<div style='height:10px;' />"
		}),oBtnMat,oPagePanel2,oPagePanel3];	

		var oPagePanel4;
		if(vPage=="2"||vPage=="3"){
			var oMat4 = new c.layout.MatrixLayout({
				columns:3,
				widths:['','','200px']
			});
			oRow = new c.layout.MatrixLayoutRow();
			oCell = new c.layout.MatrixLayoutCell({
				colSpan : 3,
				hAlign : "End",
				content : new sap.ui.core.HTML({content:"<div style='height:10px;' />"})
			});
			oRow.addCell(oCell);
			oMat4.addRow(oRow);
			oRow = new c.layout.MatrixLayoutRow({height:"33px"});
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Center",
				content : oHTML4}).addStyleClass("LabelCell");
			oRow.addCell(oCell);
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Center",
				content : oHTML5
			}).addStyleClass("LabelCell");
			oRow.addCell(oCell);
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Center",
				content :oHTML6}).addStyleClass("LabelCell");
			oRow.addCell(oCell);
			oMat4.addRow(oRow);
			oRow = new c.layout.MatrixLayoutRow();
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Begin",
				content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_"+vPage+"_TextA2_3",{width:"99%",rows:4})]
			}).addStyleClass("DataCell");
			oRow.addCell(oCell);
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Begin",
				content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_"+vPage+"_TextA2_32",{width:"99%",rows:4})]
			}).addStyleClass("DataCell");
			oRow.addCell(oCell);
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Begin",
				content : [new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Select(oController.PAGEID+"_"+vPage+"_Sel2_3",{width:"90%"}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("DataCell");
			oRow.addCell(oCell);
			oMat4.addRow(oRow);
			if(vPage=="2"){
				oRow = new c.layout.MatrixLayoutRow();
				oCell = new c.layout.MatrixLayoutCell({
					colSpan : 3,
					hAlign : "End",
					content : [new sap.ui.core.HTML({content:"<div style='height:5px;'/>"})]
				});
				oRow.addCell(oCell);
				oMat4.addRow(oRow);
				oRow = new c.layout.MatrixLayoutRow();
				oCell = new c.layout.MatrixLayoutCell({
					colSpan : 3,
					hAlign : "End",
					content : [new sap.m.Button(oController.PAGEID+"_"+vPage+"_Save1_2",{
						icon : "sap-icon://save",
						text : oBundleText.getText("LABEL_35021"),
						press : function(){oController.onSave("S");}
					}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Button({
						icon : "sap-icon://arrow-left",
						text : oBundleText.getText("LABEL_36040"),
						press : oController.onBack
					}).addStyleClass("button-light")]
				});
				oRow.addCell(oCell);
				oMat4.addRow(oRow);
			}
			oPagePanel4 = new m.Panel({
				headerToolbar : [new sap.m.Toolbar({content:[new sap.m.Text({text:oBundleText.getText("LABEL_36045")}).addStyleClass("Bold Font16")]})],
				expanded:true,
				expandable:false,
				content:[oMat4]
			});
			oContents2.push(oPagePanel4);
		}

		if(vPage=="3"){
			var oMat5 = new c.layout.MatrixLayout({
				columns:3,
				widths:['','','200px']
			});
			oRow = new c.layout.MatrixLayoutRow();
			oCell = new c.layout.MatrixLayoutCell({
				colSpan : 3,
				hAlign : "End",
				content : new sap.ui.core.HTML({content:"<div style='height:10px;' />"})
			});
			oRow.addCell(oCell);
			oMat5.addRow(oRow);
			oRow = new c.layout.MatrixLayoutRow({height:"33px"});
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Center",
				content : oHTML7}).addStyleClass("LabelCell");
			oRow.addCell(oCell);
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Center",
				content : oHTML8
			}).addStyleClass("LabelCell");
			oRow.addCell(oCell);
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Center",
				content :oHTML9}).addStyleClass("LabelCell");
			oRow.addCell(oCell);
			oMat5.addRow(oRow);
			oRow = new c.layout.MatrixLayoutRow();
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Begin",
				content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_"+vPage+"_TextA3_3",{width:"99%",rows:4})]
			}).addStyleClass("DataCell");
			oRow.addCell(oCell);
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Begin",
				content : [new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),new sap.m.TextArea(oController.PAGEID+"_"+vPage+"_TextA3_32",{width:"99%",rows:4})]
			}).addStyleClass("DataCell");
			oRow.addCell(oCell);
			oCell = new c.layout.MatrixLayoutCell({
				hAlign : "Begin",
				content : [new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Select(oController.PAGEID+"_"+vPage+"_Sel3_3",{width:"90%"}).addStyleClass("L2PFontFamily")]
			}).addStyleClass("DataCell");
			oRow.addCell(oCell);
			oMat5.addRow(oRow);
			if(vPage=="3"){
				oRow = new c.layout.MatrixLayoutRow();
				oCell = new c.layout.MatrixLayoutCell({
					colSpan : 3,
					hAlign : "End",
					content : [new sap.ui.core.HTML({content:"<div style='height:5px;'/>"})]
				});
				oRow.addCell(oCell);
				oMat5.addRow(oRow);
				oRow = new c.layout.MatrixLayoutRow();
				oCell = new c.layout.MatrixLayoutCell({
					colSpan : 3,
					hAlign : "End",
					content : [new sap.m.Button(oController.PAGEID+"_"+vPage+"_Save1_2",{
						icon : "sap-icon://save",
						text : oBundleText.getText("LABEL_35021"),
						press : function(){oController.onSave("S");}
					}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Button({
						icon : "sap-icon://arrow-left",
						text : oBundleText.getText("LABEL_36040"),
						press : oController.onBack
					}).addStyleClass("button-light")]
				});
				oRow.addCell(oCell);
				oMat5.addRow(oRow);
			}
			var oPagePanel5 = new m.Panel({
				headerToolbar : [new sap.m.Toolbar({content:[new sap.m.Text({text:oBundleText.getText("LABEL_36049")}).addStyleClass("Bold Font16")]})],
				expanded:true,
				expandable:false,
				content:[oMat5]
			});
			oContents2.push(oPagePanel4);
			oContents2.push(oPagePanel5);
		}



		var oTotMat2=new c.layout.MatrixLayout(oController.PAGEID+"_"+vPage+"_Mat1_2",{visible:false});
		var vScr=new sap.m.ScrollContainer({
			vertical:true,
			height:"642px"
		});
		oContents2.forEach(function(e,i){
			if(i<3){
				oRow=new c.layout.MatrixLayoutRow();
				oCell = new c.layout.MatrixLayoutCell({
					hAlign : "Begin",
					content : e
				});
				oRow.addCell(oCell);
				oTotMat2.addRow(oRow);
			}else{
				vScr.addContent(e);
			}
		});
		oRow=new c.layout.MatrixLayoutRow();
		oCell = new c.layout.MatrixLayoutCell({
			hAlign : "Begin",
			content : vScr
		});
		oRow.addCell(oCell);
		oTotMat2.addRow(oRow);
		var oContents3=[oTotMat1,oTotMat2];
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