jQuery.sap.require("common.Formatter");
jQuery.sap.require("common.Common");

sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ReceiveAuthPopover", {
	
	createContent: function (oController) {
		var oInfoMatrix = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 2,
			widths: ["50%", "50%"]
		});
		
		oInfoMatrix.createRow(
			new sap.m.Text({ text: "{Pgtxt}" }).addStyleClass("L2PFontFamily"),
			new sap.m.Text({ text: "{Zzjobgrtx}" }).addStyleClass("L2PFontFamily")
		);

		// eslint-disable-next-line no-unused-vars
		var oCustomListItem = new sap.m.CustomListItem(oController.PAGEID + "_RA_ListItem", {
			content: oInfoMatrix
		});

		var oList = new sap.m.List(oController.PAGEID + "_RA_List", {
			width: "100%",
			showNoData: true,
			noDataText: "{i18n>MSG_02137}",
			mode: sap.m.ListMode.None
		});
		oList.setModel(sap.ui.getCore().getModel("ZHR_ACTIONAPP_SRV"));

		var oPopover = new sap.m.Popover(oController.PAGEID + "_RA_Popover", {
			title: "{i18n>LABEL_02205}",
			placement: sap.m.PlacementType.Auto,
			content: oList,
			contentWidth: "300px",
			beforeOpen: oController.onBeforeOpenPopoverReveiveAuth,
			endButton: new sap.m.Button({
				icon: "sap-icon://sys-cancel-2",
				press: function (oEvent) {
					oEvent.getSource().getParent().getParent().close();
				}
			})
		});

		if (!jQuery.support.touch) {
			// apply compact mode if touch is not supported
			oPopover.addStyleClass("sapUiSizeCompact");
		}

		return oPopover;
	}
});
