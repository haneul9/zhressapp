sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub24", {
	
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * 은행 정보
	 * @memberOf fragment.ActRecPInfo_Sub23
	 */
	createContent: function (oController) {
		jQuery.sap.require("common.Common");

		var oTablePanel = new sap.m.Panel(oController.PAGEID + "_Sub24_RequestPanel", {
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02284}", design: "Bold" }).addStyleClass("L2PFontFamily")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: []
		});

		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub24_LAYOUT", {
			width: "100%",
			content: [oTablePanel]
		});

		return oLayout;
	}
});
