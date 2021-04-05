sap.ui.jsview("ZUI5_SF_360Review.360ReviewList", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_SF_360Review.360ReviewList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			// title: "{i18n>LABEL_03101}",
			title : "다면평가 결과",
			showHeader : false,
			content: [new sap.ui.jsfragment("fragment.360Review").getContent()],
			footer : []
		});
		
		oPage.addStyleClass("WhiteBackground");
		oPage.setModel(common.Search360Review._JSONModel);
		
		return oPage;
	}

});