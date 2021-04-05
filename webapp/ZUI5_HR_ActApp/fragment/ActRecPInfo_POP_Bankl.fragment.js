sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Bankl", {
	createContent: function (oController) {
		var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_POP_Bankl_StandardList", {
			title: "{Banka}",
			info: "{Bankl}"
		});

		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_Bankl_Dialog", {
			title: "{i18n>LABEL_02291}",
			contentWidth: "600px",
			search: oController.onSearchBankl,
			confirm: oController.onConfirmBankl,
			cancel: oController.onCancelBankl,
			items: {
				path: "/BankCodeSet",
				template: oStandardList
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("BankCodeList"));

		return oDialog;
	}
});
