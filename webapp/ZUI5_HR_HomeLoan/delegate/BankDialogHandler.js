sap.ui.define(
    [
        "common/Common", //
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oDialog: null,
            oModel: new JSONModel({ Bank: {} }),
            callback: null,

            // DialogHandler 호출 function
            get: function (oController, initData, callback) {
                this.oController = oController;
                this.initData = initData;
                this.callback = callback;

                this.oModel.setProperty("/Bank/List", this.initData.List || []);

                oController.BankDialogHandler = this;

                return this;
            },

            // DialogHandler 호출 function
            getLoadingProperties: function () {
                return {
                    id: "BankDialog",
                    name: "ZUI5_HR_HomeLoan.fragment.BankDialog",
                    type: "JS",
                    controller: this.oController
                };
            },

            // DialogHandler 호출 function
            getParentView: function () {
                return this.oController.getView();
            },

            // DialogHandler 호출 function
            getModel: function () {
                return this.oModel;
            },

            // DialogHandler 호출 function
            getDialog: function () {
                return this.oDialog;
            },

            // DialogHandler 호출 function
            setDialog: function (oDialog) {
                this.oDialog = oDialog;

                return this;
            },

            onBeforeOpen: function () {
                return Common.getPromise(
                    function () {
                        var oModel = this.getModel(),
                            BankList = oModel.getProperty("/Bank/List");

                        oModel.setProperty("/Bank/List", BankList);

                        if(this.oController._BankItemsBinding) {
                            this.oController._BankItemsBinding.filter([new sap.ui.model.Filter("Text", sap.ui.model.FilterOperator.Contains, "")]);
                        }

                        jQuery.sap.delayedCall(1000, null, function() {
                            sap.ui.getCore().byId(this.getDialog().$().find(".sapMSF")[0].id).focus();
                        }.bind(this));
                    }.bind(this)
                );
            },

            onSearch: function (oEvent) {
                this.oController._BankItemsBinding = oEvent.getParameter("itemsBinding");
                oEvent.getParameter("itemsBinding").filter([new sap.ui.model.Filter("Text", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("value"))]);
            },

            onConfirm: function (oEvent) {
                if (this.callback) {
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    this.callback(
                        !oSelectedItem
                            ? {
                                  Code: "",
                                  Text: ""
                              }
                            : oSelectedItem.getBindingContext().getProperty()
                    );
                }
            }
        };

        return Handler;
    }
);
