 sap.ui.jsfragment("ZUI5_SF_360Review.fragment.Header", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 5,
			width : "100%",
			widths : ["", "10px", "", "10px", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Image({
												 	src : "{photo}",
												 	height : "50px",
												 	width : "50px"
												}).addStyleClass("roundImage")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.HorizontalLayout({
											 	 	content : [new sap.m.Text({text : "{nickname}"}).addStyleClass("Font20 FontBold"),
											 	 			   new sap.m.Text({
											 	 				   text : {
											 	 				   		path : "userId",
											 	 				   		formatter : function(fVal){
											 	 				   			return fVal ? ("(" + fVal + ")") : "";
											 	 				   		}
											 	 				   }
											 	 			   }).addStyleClass("FontFamily paddingLeft10 paddingTop2"),
											 	 			   new sap.m.Text({text : "{department}"}).addStyleClass("FontFamily paddingLeft10 paddingTop2")]
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{rating}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 })]
					})]
		});
		
		oMatrix.setModel(oController._ListCondJSonModel);
		oMatrix.bindElement("/user");
		
		return oMatrix;
	}
});
