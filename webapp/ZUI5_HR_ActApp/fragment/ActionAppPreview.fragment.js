sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionAppPreview", {
	createContent: function (oController) {
		var oHtmlPanel = new sap.m.Panel(oController.PAGEID + "_APP_HtmlPanel", {
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: []
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: []
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_AAP_Dialog", {
			content: oHtmlPanel,
			contentWidth: "800px",
			contentHeight: "600px",
			showHeader: true,
			title: "{i18n>LABEL_02199}",
			beforeOpen: oController.onBeforeOpenHtmlDialog,
			endButton: new sap.m.Button({
				text: "{i18n>LABEL_02050}",
				icon: "sap-icon://sys-cancel-2",
				press: oController.onAAPClose
			})
		});

		if (!jQuery.support.touch) {
			// apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
