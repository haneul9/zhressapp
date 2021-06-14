sap.ui.define([], function () {
    "use strict";

    var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "BankDialog"].join(".fragment.");

    sap.ui.jsfragment(DIALOG_DETAIL_ID, {
        createContent: function (oController) {
            var BankDialogHandler = oController.BankDialogHandler;

            return new sap.m.SelectDialog({
                contentHeight: "50%",
                title: "은행",
                search: BankDialogHandler.onSearch.bind(BankDialogHandler),
                confirm: BankDialogHandler.onConfirm.bind(BankDialogHandler),
                draggable: true,
                resizable: true,
                growing: false,
                items: {
                    path: "/Bank/List",
                    template: new sap.m.StandardListItem({
                        selected: "{selected}",
                        title: "{Text}",
                        type: sap.m.ListType.Active
                    }),
                    sorter: {
                        path: "Text",
                        descending: false
                    }
                }
            }).setModel(BankDialogHandler.getModel());
        }
    });
});
