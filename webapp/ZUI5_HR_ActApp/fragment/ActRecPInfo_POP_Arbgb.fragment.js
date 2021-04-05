sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Arbgb", {
	createContent: function (oController) {
		var textInputBtn = new sap.m.Button(oController.PAGEID + "_ArbgbText_Btn", {
			text: "{i18n>LABEL_02341}",
			press: oController.onDisplaySearchInputDialog,
			customData: new sap.ui.core.CustomData({ key: "SearchInputType", value: "Arbgb" })
		});
		var cancelBtn = new sap.m.Button({
			text: "{i18n>LABEL_02050}",
			press: oController.onCancelArbgb
		});

		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_POP_Arbgb_StandardListItem", {
			title: "{Arbgb}",
			info: "{Zzarbgb}"
		});

		var oList = new sap.m.List(oController.PAGEID + "_POP_Arbgb_StandardList", {
			item: {
				path: "/PrevEmployersCodeListSet",
				template: oStandardListItem
			},
			mode: "SingleSelectMaster",
			selectionChange: oController.onConfirmArbgb
		});
		oList.setModel(sap.ui.getCore().getModel("ZHRXX_JOBCHANGE_SRV"));

		oList.attachUpdateFinished(function () {
			if (oController.BusyDialog && oController.BusyDialog.isOpen()) {
				oController.BusyDialog.close();
			}
		});

		var oNotice = new sap.m.Toolbar({
			design: sap.m.ToolbarDesign.Auto,
			content: [
				new sap.ui.core.Icon({ src: "sap-icon://notification", size: "0.4rem", color: "blue" }),
				new sap.m.Label({ text: "{i18n>MSG_02139}" }).addStyleClass("L2P13Font")
			]
		}).addStyleClass("L2PToolbarNoBottomLine");

		var oSearchField = new sap.m.SearchField(oController.PAGEID + "_POP_Arbgb", {
			width: "100%",
			search: oController.onSearchArbgb,
			placeholder: "{i18n>MSG_02118}"
		}).addStyleClass("L2P13Font L2PPaddingRight8");

		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width: "100%",
			content: [oSearchField, oNotice, new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false })]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_Arbgb_Dialog", {
			title: "{i18n>LABEL_02297}",
			subHeader: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				height: "100px",
				content: [oLayout]
			}),
			content: [oList],
			buttons: [textInputBtn, cancelBtn],
			beforeOpen: oController.beforeOpenArbgb,
			contentHeight: "600px",
			contentWidth: "800px"
		});

		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
