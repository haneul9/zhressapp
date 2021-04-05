/* eslint-disable no-mixed-spaces-and-tabs */
sap.ui.define(
    [
        "../common/Common", //
        "../common/CommonController",
        "../common/JSONModelHelper",
        "./delegate/PageHandler"
    ],
    function (Common, CommonController, JSONModelHelper, PageHandler) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Page",

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );

                Common.log("onInit session", this.getView().getModel("session").getData());
            },

            getHandler: function () {
                if (!this.PageHandler) {
                    this.PageHandler = PageHandler.initialize(this);
                }

                return this.PageHandler;
            },

            onBeforeShow: function () {
                this.PageHandler.load();
            },

            onAfterShow: function () {
                this.PageHandler.search();
            },

            onESSelectPerson: function(data) {
                return this.PageHandler.setSelectionTagets(data);
            },

            displayMultiOrgSearchDialog: function(oEvent) {
                return $.app.getController().PageHandler.openOrgSearchDialog(oEvent);
            },

            getLocalSessionModel: Common.isLOCAL() ? function () {
                return $.app.getAuth() === "H" 
                    ? new JSONModelHelper({ name: "20090028" })
                    : new JSONModelHelper({ name: "20140099" });
            } : null
        });
    }
);
