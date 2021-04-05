$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.EmpBasicInfoBox");
sap.ui.jsview("ZUI5_HR_OutCompEdu.OutCompEdu", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_HR_OutCompEdu.OutCompEdu";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		// 사원정보
		// var oHeader = new sap.ui.commons.layout.MatrixLayout({
		// 	columns : 1,
		// 	width : "100%",
		// 	rows : [new sap.ui.commons.layout.MatrixLayoutRow({ 
		// 				cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		// 							content : [new sap.ui.layout.HorizontalLayout({
		// 											content : [new sap.m.Image({
		// 														src : "{photo}",
		// 														width : "55px",
		// 														height : "55px"
		// 													}).addStyleClass("roundImage"),
		// 													new sap.ui.layout.VerticalLayout({
		// 															content : [new sap.ui.layout.HorizontalLayout({
		// 																				content : [new sap.m.Text({text : "{Ename}"}).addStyleClass("Font20 FontBold"),
		// 																						new sap.m.Text({text : "{ZpostT}"}).addStyleClass("Font15 paddingLeft5 paddingTop5")]
		// 																		}).addStyleClass("paddingTop3"),
		// 																		new sap.m.Text({text : "{Stext} / {PGradeTxt}"}).addStyleClass("info2")]
		// 													}).addStyleClass("paddingLeft10 paddingTop3")]
		// 										})],
		// 							hAlign : "Begin",
		// 							vAlign : "Middle"
		// 						}).addStyleClass("paddingLeft10")]
		// 			})]
		// });

		var oHeader = new common.EmpBasicInfoBox(oController.EmployeeModel);

		var oRow,oCell;

		var oMat=new sap.ui.commons.layout.MatrixLayout({
			columns:8,
			widths:['','','','19%','','','','19%']
		});
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
		// 	hAlign:"Center",
		// 	content:new sap.m.Text({text:oBundleText.getText("LABEL_40013")}).addStyleClass("Bold")
		// }).addStyleClass("LabelCell");
		// oRow.addCell(oCell);
		// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
		// 	hAlign:"Begin",
		// 	content:[new sap.m.Select(oController.PAGEID+"_Sel1",{width:"95%"})]
		// }).addStyleClass("DataCell");
		// oRow.addCell(oCell);
		// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
		// 	hAlign:"Center",
		// 	content:new sap.m.Text({text:oBundleText.getText("LABEL_40002")}).addStyleClass("Bold")
		// }).addStyleClass("LabelCell");
		// oRow.addCell(oCell);
		// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
		// 	hAlign:"Begin",
		// 	content:[new sap.m.Select(oController.PAGEID+"_Year",{width:"40%"}),new sap.ui.core.HTML({content:"<span style='line-height:33px;font-size:14px;'>&nbsp;"+oBundleText.getText("LABEL_40003")+"&nbsp;</span>"}),
		// 			new sap.m.Select(oController.PAGEID+"_Month",{width:"30%"}),new sap.ui.core.HTML({content:"<span style='line-height:33px;font-size:14px;'>&nbsp;"+oBundleText.getText("LABEL_40004")+"</span>"})
		// ]
		// }).addStyleClass("DataCell");
		// oRow.addCell(oCell);
		// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
		// 	hAlign:"Center",
		// 	content:new sap.m.Text({text:oBundleText.getText("LABEL_40005")}).addStyleClass("Bold")
		// }).addStyleClass("LabelCell");
		// oRow.addCell(oCell);
		// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
		// 	hAlign:"Begin",
		// 	content:[new sap.m.Select(oController.PAGEID+"_Sel2",{width:"95%"})]
		// }).addStyleClass("DataCell");
		// oRow.addCell(oCell);
		// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
		// 	hAlign:"Center",
		// 	content:new sap.m.Text({text:oBundleText.getText("LABEL_40006")}).addStyleClass("Bold")
		// }).addStyleClass("LabelCell");
		// oRow.addCell(oCell);
		// oCell=new sap.ui.commons.layout.MatrixLayoutCell({
		// 	hAlign:"Begin",
		// 	content:[new sap.m.Select(oController.PAGEID+"_Sel3",{width:"70%"}),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.Button({
        //         icon : "sap-icon://search",
        //         text : oBundleText.getText("LABEL_40007"),
        //         press : oController.onSearch
        //     }).addStyleClass("RightZone button-search")]
		// }).addStyleClass("DataCell");
		// oRow.addCell(oCell);
		// oMat.addRow(oRow);

		var oFilter=new sap.m.FlexBox({
			fitContainer: true,
			items: [ 
				new sap.m.HBox({
					items: [
						new sap.m.Label({
							text: "{i18n>LABEL_40013}", // 진료일								
						}),							
						new sap.m.Select(oController.PAGEID+"_Sel1",{width:"200px"}),
						new sap.m.Label({
							text: "{i18n>LABEL_40002}", // 신청자 성명							
						}),
						new sap.m.Select(oController.PAGEID+"_Year",{width:"130px"}),new sap.ui.core.HTML({content:"<span style='line-height:33px;font-size:14px;'>&nbsp;"+oBundleText.getText("LABEL_40003")+"&nbsp;</span>"}),
		 				new sap.m.Select(oController.PAGEID+"_Month",{width:"120px"}),new sap.ui.core.HTML({content:"<span style='line-height:33px;font-size:14px;'>&nbsp;"+oBundleText.getText("LABEL_40004")+"</span>"}),
						new sap.m.Label({
							text: "{i18n>LABEL_40005}", // 신청자 성명							
						}),
						new sap.m.Select(oController.PAGEID+"_Sel2",{width:"200px"}),
						new sap.m.Label({
							text: "{i18n>LABEL_40006}", // 신청자 성명							
						}),
						new sap.m.Select(oController.PAGEID+"_Sel3",{width:"200px"}),
						new sap.m.Button({
							icon : "sap-icon://search",
							text : oBundleText.getText("LABEL_40007"),
							press : oController.onSearch
						}).addStyleClass("RightZone button-search")
					]
				}).addStyleClass("search-field-group"),
				new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),
				new sap.m.HBox({
					items: [
						new sap.m.Button({								
							text: "{i18n>LABEL_23010}", // 조회
						}).addStyleClass("button-search"),
						new sap.m.Button({
							press: function(){oController.onDialog("N3")},
							text: "{i18n>LABEL_47006}", // 신청
						}).addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			]
		}).addStyleClass("search-box search-bg pb-7px");
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:8,
			content:oFilter
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:8,
			content:new sap.ui.core.HTML({content:"<div style='height:10px;'/>"})
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:3,
			content:[new sap.ui.core.Icon({size:"14px",src:"sap-icon://message-information",color:"green"}),
				new sap.ui.core.HTML({content:"<span style='line-height:33px;font-size:14px;'>&nbsp;"+oBundleText.getText("LABEL_40012")+"</span>"})]
		}); 
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:5,
			hAlign : "Right",
			content:[new sap.m.Button({icon:"sap-icon://activities",text:oBundleText.getText("LABEL_40008")}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),
					new sap.m.Button({icon:"sap-icon://activities",text:oBundleText.getText("LABEL_40009")}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),
					new sap.m.Button({icon:"sap-icon://activities",text:oBundleText.getText("LABEL_40010")}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),
					new sap.m.Button({icon:"sap-icon://delete",text:oBundleText.getText("LABEL_40011"),
					press : oController.onDeleteLines
				}).addStyleClass("button-delete")]
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:8,
			content:new sap.ui.core.HTML({content:"<div style='height:5px;'/>"})
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		var oTable = new sap.ui.table.Table(oController.PAGEID+"_Table", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 15,
			showOverlay: false,
			showNoData: true,
			width: "auto",
			noData: "{i18n>MSG_05001}"
		}).addStyleClass("mt-8px").attachCellClick(oController.onSelectedRow);

		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:8,
			content:oTable
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);

		oController.getSelector();
		oController.oTableInit();

		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: sap.m.FlexDirection.Column,
						  items: [new sap.m.FlexBox({
									  alignItems: "End",
									  fitContainer: true,
									  items: [new sap.m.Text({text: oBundleText.getText("LABEL_40001")}).addStyleClass("app-title")] // 사외위탁교육 신청
								  }).addStyleClass("app-title-container"),
								  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  oHeader,
								  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  oMat
								  ]
					  }).addStyleClass("app-content-container-wide")]
		}).addStyleClass("app-content-body");
				
		/////////////////////////////////////////////////////////

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
			content: [oContent]
		}).addStyleClass("app-content");
		
		oPage.addStyleClass("WhiteBackground");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}

});