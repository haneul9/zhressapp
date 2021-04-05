sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActionReqListSort", {
	createContent: function (oController) {

		var oDialog = new sap.m.ViewSettingsDialog(oController.PAGEID + "_ARS_Dialog", {
			title: "{i18n>SORT}",
			confirm: oController.onConfirmSortDialog,
			sortItems: [
				new sap.m.ViewSettingsItem({ text: "{i18n>LABEL_02156}", key: "Statu" }),
				new sap.m.ViewSettingsItem({ text: "{i18n>LABEL_02140}", key: "Reqno" }),
				new sap.m.ViewSettingsItem({ text: "{i18n>LABEL_02187}", key: "Title" }),
				new sap.m.ViewSettingsItem({ text: "{i18n>LABEL_02128}", key: "Pbtxt" }),
				new sap.m.ViewSettingsItem({ text: "{i18n>LABEL_02139}", key: "Reqdp" }),
				new sap.m.ViewSettingsItem({ text: "{i18n>LABEL_02144}", key: "Reqnm" }),
				new sap.m.ViewSettingsItem({ text: "{i18n>LABEL_02141}", key: "Reqda" }),
				new sap.m.ViewSettingsItem({ text: "{i18n>LABEL_02014}", key: "Actda" })
			]
		});

		oDialog.addStyleClass("sapUiSizeCompact");

		return oDialog;
	}
});
