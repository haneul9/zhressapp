sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Schcd", {
	createContent: function (oController) {
		var cancelBtn = new sap.m.Button({
			text: "{i18n>LABEL_02050}",
			press: oController.onCancelSchcd
		});

		// eslint-disable-next-line no-unused-vars
		var clearBtn = new sap.m.Button({
			text: "{i18n>LABEL_02342}",
			press: oController.onClearSelectedSchcd
		});

		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_POP_Schcd_StandardListItem", {
			title: "{Insti}",
			info: "{Slarttx}"
		});

		var oList = new sap.m.List(oController.PAGEID + "_POP_Schcd_StandardList", {
			item: {
				path: "/SchoolCodeSet",
				template: oStandardListItem
			},
			mode: "SingleSelectMaster",
			selectionChange: oController.onConfirmSchcd
		});
		oList.setModel(sap.ui.getCore().getModel("ZHR_COMMON_SRV"));

		oList.attachUpdateFinished(function () {
			oController.BusyDialog.close();
		});

		var oSearchField = new sap.m.SearchField(oController.PAGEID + "_POP_Schcd", {
			width: "100%",
			search: oController.onSearchSchcd
		}).addStyleClass("L2P13Font L2PPaddingRight8");

		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width: "100%",
			content: [oSearchField]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Schcd_Dialog", {
			title: "{i18n>LABEL_02166}",
			subHeader: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				height: "40px",
				content: [new sap.m.ToolbarSpacer({ width: "5px" }), oLayout, new sap.m.ToolbarSpacer({ width: "5px" })]
			}),
			search: oController.onSearchSchcd,
			content: [oList],
			buttons: [cancelBtn],
			contentHeight: "600px",
			contentWidth: "800px"
		});

		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
