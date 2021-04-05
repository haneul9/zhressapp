sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content05", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "10px", "", "10px", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height: "45px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
												 	content : [new sap.m.Text({text : "95.1"}).addStyleClass("Font20 FontBold FontWhite paddingTop22")]
												}).addStyleClass("grade_ess1")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 rowSpan : 3
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
												 	content : [new sap.m.Text({text : "84.3"}).addStyleClass("Font20 FontBold FontWhite paddingTop22")]
												}).addStyleClass("grade_ess2")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 rowSpan : 3
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
												 	content : [new sap.m.Text({text : "79.5"}).addStyleClass("Font20 FontBold FontWhite paddingTop22")]
												}).addStyleClass("grade_ess3")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "업적평가"}).addStyleClass("Font13")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "역량평가"}).addStyleClass("Font13")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "다면평가"}).addStyleClass("Font13")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 })]
					})]
		});

		var oScrollContainer = new sap.m.ScrollContainer({
			horizontal : false,
			vertical : false,
			width : "",
			height : "175px",
			content : [oMatrix]
		});
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.Toolbar({
						   content : [new sap.m.Text({text : "평가현황(점수)"}).addStyleClass("Font15 FontBold")]
					   }).addStyleClass("toolbarNoBottomLine"),
					   oScrollContainer]
		}).addStyleClass("overviewlayout");
		
		return oContent;
	}
});
