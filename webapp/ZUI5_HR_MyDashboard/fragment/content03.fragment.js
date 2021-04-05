sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content03", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Content3", {
			horizontal : false,
			vertical : true,
			width : "",
			height : "460px",
			content : [] 
		});
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.Toolbar({
						   content : [new sap.m.Text({text : "조직 목표"}).addStyleClass("Font15 FontBold")]
					   }).addStyleClass("toolbarNoBottomLine"),
					   oScrollContainer]
		}).addStyleClass("overviewlayout");
		
		return oContent;
	}
});
