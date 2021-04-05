sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.EducationInputField", {
	createContent: function (oController) {
		var oNotice = new sap.m.Toolbar({
			design: sap.m.ToolbarDesign.Auto,
			content: [
				new sap.ui.core.Icon({
					src: "sap-icon://notification",
					size: "0.4rem",
					color: "blue"
				}),
				new sap.m.Text(oController.PAGEID + "_POP_Input_Notice", { 
					text: "" 
				}).addStyleClass("L2P13Font")
			]
		}).addStyleClass("L2PToolbarNoBottomLine");

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_Input_Dialog", {
			content: [
				new sap.m.Input(oController.PAGEID + "_POP_Input", {}).attachBrowserEvent("keyup", oController.onKeyUp), 
				oNotice
			],
			contentWidth: "500px",
			contentHeight: "130px",
			showHeader: true,
			beginButton: new sap.m.Button({ 
				text: "{i18n>LABEL_02053}", 
				icon: "sap-icon://accept", 
				press: oController.onPressConfirmInput 
			}), //
			endButton: new sap.m.Button({ 
				text: "{i18n>LABEL_02048}", 
				icon: "sap-icon://sys-cancel-2", 
				press: oController.onCOCloseInput 
			})
		});

		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
