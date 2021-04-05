sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "./delegate/OvertimeWork",
        "./delegate/PageHandler",
        "./delegate/ApprovalHandler"
    ],
    function (Common, CommonController, JSONModelHelper, OvertimeWork, PageHandler, ApprovalHandler) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Page",

            oDetailDialog: null,

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

            getPageHandler: function () {
                if (!this.PageHandler) {
                    this.PageHandler = PageHandler.initialize(this);
                }

                return this.PageHandler;
            },
            
            getApprovalHandler: function () {
                if (!this.ApprovalHandler) {
                    this.ApprovalHandler = ApprovalHandler.initialize(this);
                }

                return this.ApprovalHandler;
            },

            getOrgOfIndividualHandler: function() {

                return this.OrgOfIndividualHandler;
            },

            onBeforeShow: function () {
                this.PageHandler.load();
            },

            onAfterShow: function () {
                this.PageHandler.search();
            },

            onESSelectPerson: function(data) {
                return this.OrgOfIndividualHandler.setSelectionTagets(data);
            },

            displayMultiOrgSearchDialog: function(oEvent) {
                return $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent);
            },

            getLocalSessionModel: Common.isLOCAL() ? function () {
                return new JSONModelHelper({ name: "20060040" });
            } : null
        });
    }
);
