sap.ui.jsfragment("ZUI5_SF_EvalResultAgree.fragment.Detail03", {
	
	createContent: function(oController) {
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "99.9%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells :  [new sap.ui.commons.layout.MatrixLayoutCell({
									  content : [new sap.m.Toolbar({
									 				 height : "44px",
												 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_12113")}).addStyleClass("Font18 Font700")] // 업적평가 1차평가자 의견
												 }).addStyleClass("toolbarNoBottomLine padding0")],
									  hAlign : "Begin",
									  vAlign : "Middle"
								  })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.FormattedText({htmlText : "{Comment1}"}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data paddingTop10 paddingBottom10")]
					})]
		});
		
		return oMatrix;
	}
});
     