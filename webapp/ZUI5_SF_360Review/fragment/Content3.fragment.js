sap.ui.jsfragment("ZUI5_SF_360Review.fragment.Content3", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	// 강점,보완점
	createContent : function(oController) {
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["15%", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "30px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "평가자"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "강점"}).addStyleClass("FontFamily")],
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "보완점"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							parts : [{path : "Description1_1"}, {path : "Description1_2"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 && fVal1.indexOf("\n") != -1) || (fVal2 && fVal2.indexOf("\n") != -1)){
									return "";
								} else {
									return "35px";
								}
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "상사"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description1_1}"}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description1_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							parts : [{path : "Description2_1"}, {path : "Description2_2"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 && fVal1.indexOf("\n") != -1) || (fVal2 && fVal2.indexOf("\n") != -1)){
									return "";
								} else {
									return "35px";
								}
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "동료(팀내)"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description2_1}"}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description2_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							parts : [{path : "Description3_1"}, {path : "Description3_2"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 && fVal1.indexOf("\n") != -1) || (fVal2 && fVal2.indexOf("\n") != -1)){
									return "";
								} else {
									return "35px";
								}
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "동료(팀외)"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description3_1}"}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description3_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : {
							parts : [{path : "Description4_1"}, {path : "Description4_2"}],
							formatter : function(fVal1, fVal2){
								if((fVal1 && fVal1.indexOf("\n") != -1) || (fVal2 && fVal2.indexOf("\n") != -1)){
									return "";
								} else {
									return "35px";
								}
							}
						},
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "부하"}).addStyleClass("FontFamily")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description4_1}"}).addStyleClass("FontFamily")],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText({htmlText : "{Description4_2}"}).addStyleClass("FontFamily")],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					})]
		});
		
		oMatrix.setModel(oController._ListCondJSonModel);
		oMatrix.bindElement("/Data/3");
		
		return oMatrix;
	}
});
