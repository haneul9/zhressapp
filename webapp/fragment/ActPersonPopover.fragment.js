jQuery.sap.require("common.Formatter");
jQuery.sap.require("common.Common");

sap.ui.jsfragment("fragment.ActPersonPopover", {
	createContent: function (oController) {
		var oList = new sap.m.List(oController.PAGEID + "_AP_List", {
			items: {
				path: "/ActionEmpSummaryListSet",
				template: new sap.m.StandardListItem(oController.PAGEID + "_AP_ListItem", {
					icon: "{Photo}",
					iconDensityAware: false,
					iconInset: false,
					title: {
						parts: [{ path: "Ename" }, { path: "Pernr" }],
						formatter: function (fVal1, fVal2) {
							if (fVal1 != null && fVal2 != null) return fVal1 + " (" + fVal2 + ")";
							else return "";
						}
					},
					description: "{ZpGradetx}" + " / " + "{Zposttx}" + "," + "{Orgtx}"
				})
			}
		});
		oList.setModel(sap.ui.getCore().getModel("ZHR_ACTIONAPP_SRV"));

		var oPopover = new sap.m.Popover(oController.PAGEID + "_AP_Popover", {
			title: "{i18n>LABEL_02007}",
			placement: sap.m.PlacementType.Auto,
			content: oList,
			contentWidth: "300px",
			beforeOpen: oController.onBeforeOpenPopoverActPerson,
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
