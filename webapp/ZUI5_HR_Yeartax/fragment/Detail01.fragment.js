sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail01", {
	/** 종합안내 **/
	createContent : function(oController) {
		
		var oHtml = new sap.ui.core.HTML();
	   	var request = $.ajax({ 
			  url: "ZUI5_HR_Yeartax/guide/guide.html",
			  cache: false,
			  async: false
		});
	   	request.done(function( html ) {
			oHtml.setContent(html);
	   	});
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["2rem", "", "2rem"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oHtml]
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					})]
		});
		
		return oMatrix;
	}

});
