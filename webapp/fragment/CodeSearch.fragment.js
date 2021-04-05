sap.ui.jsfragment("fragment.CodeSearch", {
    createContent: function (oController) {
        var oStandardList = new sap.m.StandardListItem(oController.PAGEID + "_FCS_StandardList", {
            title: "{Etext}",
            info: "{Ecode}"
        });

        var oDialog = new sap.m.SelectDialog(oController.PAGEID + "_FCS_Dialog", {
            title: "",
            contentWidth: "550px",
            search: common.SearchCode.onSearchCode,
            confirm: common.SearchCode.onConfirmCode,
            cancel: common.SearchCode.onCancelCode,
            items: {
                path: "/EmpCodeListSet",
                template: oStandardList
            }
        });
        oDialog.setModel(sap.ui.getCore().getModel("CodeListModel"));

        return oDialog;
    }
});