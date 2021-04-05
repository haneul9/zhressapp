sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Rehire_DataSelect", {
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fragment.ActRecPInfo_Rehire_DataSelect
	 */

	createContent: function (oController) {
		var oPeridLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_Rehire_DataSelect_Layout", {
			width: "100%",
			layoutFixed: false,
			columns: 2,
			widths: ["50%", "50%"]
		});

		var oNotice1 = new sap.m.Toolbar({
			design: sap.m.ToolbarDesign.Auto,
			content: [new sap.m.Label({ text: "{i18n>MSG_02140}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PToolbarNoBottomLine");

		var oNotice2 = new sap.m.Toolbar({
			design: sap.m.ToolbarDesign.Auto,
			content: [new sap.m.Label({ text: "{i18n>MSG_02141}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PToolbarNoBottomLine");

		var oNotice3 = new sap.m.Toolbar({
			design: sap.m.ToolbarDesign.Auto,
			content: [new sap.m.Label({ text: "{i18n>MSG_02142}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PToolbarNoBottomLine");

		var oPeridPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			content: [
				new sap.m.Label({ text: "{i18n>MSG_02143}" }).addStyleClass("L2PFontFamily"),
				oNotice1,
				oNotice2,
				oNotice3,
				oPeridLayout
			]
		});

		var oDialog = new sap.m.Dialog({
			title: "Rehire Information Copy",
			showHeader: true,
			contentWidth: "500px",
			contentHeight: "380px",
			content: [oPeridPanel],
			afterClose: oController.onAfterCloseRehireDataSelect,
			beforeOpen: oController.onBeforeOpenRehireDataSelect,
			beginButton: new sap.m.Button({
				text: "{i18n>LABEL_02053}",
				press: oController.onConfirmRehireDataSelect
			}),
			endButton: new sap.m.Button({
				text: "{i18n>LABEL_02048}",
				press: oController.onCancelRehireDataSelect
			})
		});

		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
