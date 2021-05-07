/* eslint-disable no-undef */
sap.ui.define([
	"common/Common",
    "./ODataService",
	"sap/ui/model/json/JSONModel"
], function(Common, ODataService, JSONModel) {
"use strict";

    var Handler = {

        oController: null,
        oDialog: null,
        oModel: new JSONModel({ SearchConditions: {}, List: []}),
        dialogTitle: null,
        callback: null,

        // DialogHandler 호출 function
        get: function(oController, initData, callback) {

            this.oController = oController;
            this.dialogTitle = initData.DialogTitle;
            this.callback = callback;

            this.oModel.setProperty("/SearchConditions/Pernr",     initData.Pernr || "");
            this.oModel.setProperty("/SearchConditions/Begda",     initData.Begda || "");
            this.oModel.setProperty("/SearchConditions/Tmtyp",     initData.Tmtyp || "");
            this.oModel.setProperty("/List", []);

            oController.MealDialogHandler = this;

            return this;
        },

        // DialogHandler 호출 function
        getLoadingProperties: function() {

            return {
                id: "MealDialog",
                name: "ZUI5_HR_OvertimeWorkTech.fragment.mealDialog",
                type: "JS",
                controller: this.oController
            };
        },

        // DialogHandler 호출 function
        getParentView: function() {

            return this.oController.getView();
        },

        // DialogHandler 호출 function
        getModel: function() {

            return this.oModel;
        },

        // DialogHandler 호출 function
        getDialog: function() {

            return this.oDialog;
        },

        // DialogHandler 호출 function
        setDialog: function(oDialog) {

            this.oDialog = oDialog;

            return this;
        },

        onBeforeOpen: function() {

            $.app.byViewId("MealTable").setBusy(true, 0);

            this.oDialog.setTitle(this.oController.getBundleText("LABEL_32046", this.dialogTitle || " ")); // {0} 이용내역

            return Common.getPromise(function() {
                this.oModel.setProperty(
                    "/List",
                    ODataService.RecorderTimeInfoSet.call(
                        this.oController,
                        this.oModel.getProperty("/SearchConditions")
                    ).map(function(elem) {
                        return $.extend(true, elem, {
                            BegdaTx: moment(elem.Begda).format("YYYY-MM-DD"),
                            BeguzTx: moment(elem.Beguz.ms).subtract(9, "hours").format("HH:mm")
                        });
                    })
                );

                $.app.byViewId("MealTable").setBusy(false);
            }.bind(this));
        },

        onConfirm: function(oEvent) {

            if (this.callback) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                this.callback(!oSelectedItem ? {
                    time: "",
                    minute: ""
                } : {
                    time: "",
                    minute: ""
                });
            }
        }

    };

    return Handler;

});