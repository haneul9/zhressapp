sap.ui.jsfragment("fragment.ProductAreaSearch", {
	createContent: function (oController) {
		var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_PAS_StandardList", {
			title: "{Etext}",
			info: "{Ecode}"
		});

		var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_PAS_Dialog", {
			title: "{i18n>LABEL_00171}",	// 제품지역
			contentWidth: "350px",
			search: common.SearchPrdArea.onSearchPrdArea,
			confirm: common.SearchPrdArea.onConfirmPrdArea,
			cancel: common.SearchPrdArea.onCancelPrdArea,
			items: {
				path: "/PrdAreaCodeListSet",
				template: oStandardList
			}
		});
		oDialog.setModel(sap.ui.getCore().getModel("ProductAreaModel"));

		return oDialog;
	}
});
