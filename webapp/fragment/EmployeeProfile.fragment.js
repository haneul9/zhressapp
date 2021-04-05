sap.ui.jsfragment("fragment.EmployeeProfile", {
	createContent: function (oController) {
		//		var oBasicInfoLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_BasicInfoLayout",  {
		//			width : "100%",
		//			content : [new sap.m.Text({text:"asfddsaf"})]
		//		});
		////
		//		var oMasterTabMenuLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_MasterTabMenuLayout",  {
		//			width : "100%",
		//			content : []
		//		}).addStyleClass("L2PDisplayBlock");
		//
		//		var oSubTabMenuLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_SubTabMenuLayout",  {
		//			width : "100%",
		//			visible : false,
		//			content : []
		//		});
		//
		////		var oPersonListToolbar = new sap.m.Toolbar(oController.PAGEID + "_DHtmlxTableToolBar", {
		////			width : "100%",
		////			content : [new sap.m.Button({
		////							icon : "sap-icon://full-screen",
		////							press : oController.onFullScreen
		////						})],
		////	    }).addStyleClass("L2PToolbarNoBottomLine");
		//
		//		var oSubLayout = new sap.m.Toolbar({
		//			width : "100%",
		//			content : [oSubTabMenuLayout,
		//			           new sap.m.ToolbarSpacer(),
		//			           new sap.m.Button(oController.PAGEID + "_DHtmlxTableToolBar",{
		//							icon : "sap-icon://full-screen",
		////							press : oController.onFullScreen
		//						})],
		//	    }).addStyleClass("L2PToolbarNoBottomLine");
		//
		//		var oDHtmlxTable = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_DHtmlxTable",  {
		//			width : "100%",
		//		});
		//
		//		var oDataSetLayout = new sap.m.ScrollContainer(oController.PAGEID + "_DataSetLayout",  {
		//			width : "100%",
		//			vertical : true,
		//			height : (window.innerHeight - 430) + "px"
		//		});
		//
		//		var oDetailInfoLayout = new sap.m.Panel(oController.PAGEID + "_DetailInfoLayout",  {
		//			expandable : false,
		//			expanded : false,
		//			content : [oSubLayout,
		//			           new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
		//			           oDHtmlxTable,
		//			           oDataSetLayout]
		//		});
		//
		//		var oEmployeeLayout = new sap.m.Panel(oController.PAGEID + "_EmployeeLayout", {
		//			expandable : false,
		//			expanded : false,
		//			content : [oBasicInfoLayout,
		//			           new sap.ui.core.HTML({content : "<div style='height:5px'> </div>",	preferDOM : false}),
		//			           oMasterTabMenuLayout,
		//			           oDetailInfoLayout]
		//		});
		//
		//

		// 기본 정보
		var oHeaderMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns: 5,
			widths: ["100px", "1px", "230px", "300px", "350px"],
			width: "110%"
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height: "10px" });
		oHeaderMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Image({
				src: "{Ephotourl}",
				height: "175px",
				visible: {
					path: "Ephotourl",
					formatter: function (fVal) {
						if (fVal && fVal != "") return true;
						else return false;
					}
				}
			}).addStyleClass("L2PEmployeePic"),
			hAlign: "Center",
			rowSpan: 6,
			vAlign: "Bottom"
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "", width: "1px" }),
			hAlign: "Center",
			rowSpan: 6,
			vAlign: "Bottom"
		});
		oRow.addCell(oCell);

		var oHorizontalLayout = new sap.ui.layout.HorizontalLayout({
			allowWrapping: true
		});

		oHorizontalLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content: [new sap.m.Text({ text: "{Head1}" }).addStyleClass("L2P18FontBold L2PFontGray")]
			}).addStyleClass("L2PFilterItem")
		);

		//		oHorizontalLayout.addContent(
		//				new sap.ui.layout.VerticalLayout({
		//					content : [ new sap.m.Text({text : "{Head2}"}).addStyleClass("L2P15Font L2PFontGray")]
		//				}).addStyleClass("L2PFilterItem")
		//		);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: oHorizontalLayout
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Line1",
					formatter: function (fVal) {
						return "소속부서 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray"),
			vAlign: "Bottom"
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datt1",
					formatter: function (fVal) {
						return "그룹입사일 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray"),
			vAlign: "Bottom"
		});
		oRow.addCell(oCell);

		oHeaderMatrix.addRow(oRow);

		//1
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datl1",
					formatter: function (fVal) {
						return fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Line2",
					formatter: function (fVal) {
						return "직무 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datt2",
					formatter: function (fVal) {
						return "회사입사일 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow);

		//2
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datl2",
					formatter: function (fVal) {
						return fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Line3",
					formatter: function (fVal) {
						return "직계/직급 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datt3",
					formatter: function (fVal) {
						return "소속배치일 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow);

		//3
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datl3",
					formatter: function (fVal) {
						return fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Line4",
					formatter: function (fVal) {
						return "직급명칭 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datt4",
					formatter: function (fVal) {
						return "직급진급일 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow);

		//4
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datl4",
					formatter: function (fVal) {
						return fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Line5",
					formatter: function (fVal) {
						return "직책 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);

		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			content : new sap.m.Text({text : { path : "Line5" ,
		//					formatter : function(fVal){
		//						return "학교/학위 : " + fVal ;
		//					}
		//				}
		//			}).addStyleClass("L2P15Font L2PFontGray")
		//		});
		//		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datt5",
					formatter: function (fVal) {
						return "직책임용일 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow);

		//5

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({});

		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			content : new sap.m.Text({text:""}),
		//			hAlign : "Center" ,
		//			colSpan : 1 ,
		//			vAlign : "Bottom" ,
		//		});
		//		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datl5",
					formatter: function (fVal) {
						return fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		}).addStyleClass("L2PPaddingLeft20");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Line6",
					formatter: function (fVal) {
						return "학교/학위 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({
				text: {
					path: "Datt6",
					formatter: function (fVal) {
						return "P.G  승급일 : " + fVal;
					}
				}
			}).addStyleClass("L2P15Font L2PFontGray")
		});
		oRow.addCell(oCell);
		oHeaderMatrix.addRow(oRow);

		oHeaderMatrix.setModel(oController.HeaderModel).bindElement("/Data");

		var oObjectPageHeader = new sap.uxap.ObjectPageHeader({
			objectImageURI: "{Ephotourl}",
			//			objectTitle : "Denise Smith",
			objectImageShape: "Circle",
			isObjectIconAlwaysVisible: false,
			isObjectTitleAlwaysVisible: false,
			isObjectSubtitleAlwaysVisible: false
		})
			.setModel(oController.HeaderModel)
			.bindElement("/Data");

		var oHeaderContent = new sap.uxap.ObjectPageHeaderContent({
			content: oHeaderMatrix
		});

		var oSectionLayout = new sap.uxap.ObjectPageLayout(oController.PAGEID + "_SectionLayout", {
			enableLazyLoading: false,
			showTitleInHeaderContent: false,
			alwaysShowContentHeader: true,
			//			headerTitle : oObjectPageHeader,
			headerContent: oHeaderContent,
			sections: []
		});
		oSectionLayout.addStyleClass("sapUiSizeCompact");
		return oSectionLayout;
	}
});
