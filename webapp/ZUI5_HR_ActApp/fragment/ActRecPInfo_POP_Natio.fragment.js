sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_POP_Natio", {
	createContent: function (oController) {
		var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_POP_Natio_StandardList", {
			title: "{Etext}",
			info: "{Ecode}"
		});

		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_POP_Natio_Dialog", {
			title: "{i18n>LABEL_02165}",
			contentWidth: "600px",
			search: oController.onSearchNatio,
			confirm: oController.onConfirmNatio,
			cancel: oController.onCancelNatio,
			items: {
				path: "/natioCode",
				template: oStandardList
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("NatioList"));

		return oDialog;
	}
});
