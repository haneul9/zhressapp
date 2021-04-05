sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "./delegate/WorkSchedule",
        "./delegate/ApprovalHandler",
        "./delegate/HistoryHandler"
    ],
    function (Common, CommonController, JSONModelHelper, WorkSchedule, ApprovalHandler, HistoryHandler) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Tab",

            oDetailDialog: null,
            
            EmployeeSearchCallOwner: null,

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

            getApprovalHandler: function () {
                if (!this.ApprovalHandler) {
                    this.ApprovalHandler = ApprovalHandler.initialize(this);
                }

                return this.ApprovalHandler;
            },
            
            getHistoryHandler: function () {
                if (!this.HistoryHandler) {
                    this.HistoryHandler = HistoryHandler.initialize(this);
                }

                return this.HistoryHandler;
            },
            
            getOrgOfIndividualHandler: function() {

                return this.OrgOfIndividualHandler;
            },

            onBeforeShow: function () {
                this.ApprovalHandler.load();
            },

            onAfterShow: function () {
                this.ApprovalHandler.search();
            },

            selectIconTabBar: function(oEvent) {
                var sKey = oEvent.getParameter("selectedKey");

                switch(sKey) {
                    case WorkSchedule.Tab.APPROVAL:
                        if(!this.ApprovalHandler.Model().getProperty("/IsSearch")) {
                            this.ApprovalHandler.load().search();
                        }
                        break;
                    case WorkSchedule.Tab.HISTORY:
                        if(!this.HistoryHandler.Model().getProperty("/IsSearch")) {
                            this.HistoryHandler.load().search();
                        }
                        break;
                }
            },

            changeTab: function(tabkey) {
                switch(tabkey) {
                    case WorkSchedule.Tab.APPROVAL:
                        $.app.byViewId("TabContainer").setSelectedKey(WorkSchedule.Tab.APPROVAL);
                        this.ApprovalHandler.search();
                        break;
                    case WorkSchedule.Tab.HISTORY:
                        $.app.byViewId("TabContainer").setSelectedKey(WorkSchedule.Tab.HISTORY);
                        this.HistoryHandler.search();
                        break;
                }
            },

            onESSelectPerson: function(data) {
                return this.OrgOfIndividualHandler.setSelectionTagets(data);
            },

            displayMultiOrgSearchDialog: function(oEvent) {
                return $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent);
            },

            getLocalSessionModel: Common.isLOCAL() ? function () {
                return new JSONModelHelper({ name: "35126273" });
            } : null
        });
    }
);
