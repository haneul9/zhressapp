jQuery.sap.require("common.Common");

sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub22", {
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 *
	 * 어학 능력
	 *
	 * @memberOf fragment.ActRecPInfo_Sub22
	 */
	createContent: function (oController) {
		// eslint-disable-next-line no-unused-vars
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub22_COLUMNLIST", {
			type: sap.m.ListType.None,
			counter: 10,
			cells: [
				new sap.m.Text({
					text: "{Qualitx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Ausprtx}"
				}).addStyleClass("L2PFontFamily")
			]
		});

		var oTable = new sap.m.Table(oController.PAGEID + "_Sub22_TABLE", {
			inset: false,
			fixedLayout: false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText: "{i18n>MSG_02004}",
			columns: [
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02262}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Text({ text: "{i18n>LABEL_02295}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin
				})
			]
		});
		oTable.setModel(sap.ui.getCore().getModel("ZHR_ACTIONAPP_SRV"));

		var oTablePanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [new sap.m.Label({ text: "{i18n>LABEL_02282}", design: "Bold" }).addStyleClass("L2PFontFamily"), new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oTable]
		});

		var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_Sub22_LAYOUT", {
			width: "100%",
			content: [oTablePanel]
		});

		return oLayout;
	}
});
