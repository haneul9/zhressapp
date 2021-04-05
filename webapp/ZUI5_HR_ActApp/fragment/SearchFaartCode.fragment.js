sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.SearchFaartCode", {
	createContent: function (oController) {
		var clearBtn = new sap.m.Button({
			text: "{i18n>LABEL_02342}",
			press: oController.onClearSelectedFaartCode
		});

		var cancelBtn = new sap.m.Button({
			text: "{i18n>LABEL_02050}",
			press: oController.onCancelFaartCode
		});

		var oStandardListItem = new sap.m.StandardListItem(oController.PAGEID + "_POP_FaartCode_StandardListItem", {
			title: "{Etext}",
			info: "{Ecode}"
		});

		var oList = new sap.m.List(oController.PAGEID + "_POP_FaartCode_StandardList", {
			item: {
				path: "/FaartCodeListSet",
				template: oStandardListItem
			},
			mode: "SingleSelectMaster",
			selectionChange: oController.onConfirmFaartCode
		});
		oList.setModel(sap.ui.getCore().getModel("FaartCodeList"));

		oList.attachUpdateFinished(function () {
			oController.BusyDialog.close();
		});

		var oSearchField = new sap.m.SearchField(oController.PAGEID + "_POP_Faart", {
			width: "100%",
			search: oController.onSearchFaartCode
		}).addStyleClass("L2P13Font L2PPaddingRight8");

		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width: "100%",
			content: [oSearchField]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_POP_FaartCode_Dialog", {
			subHeader: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				height: "40px",
				content: [
					new sap.m.ToolbarSpacer({ width: "5px" }), 
					oLayout, 
					new sap.m.ToolbarSpacer({ width: "5px" })
				]
			}),

			content: [oList],
			buttons: [clearBtn, cancelBtn],

			contentHeight: "600px",
			contentWidth: "800px"
		});

		if (!jQuery.support.touch) {
			// apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
