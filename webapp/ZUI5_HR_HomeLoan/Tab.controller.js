sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "./delegate/HomeLoan",
        "./delegate/ApprovalHandler",
        "./delegate/HistoryHandler"
    ],
    function (Common, CommonController, JSONModelHelper, HomeLoan, ApprovalHandler, HistoryHandler) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Tab",

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

            onBeforeShow: function () {
                this.ApprovalHandler.load();
            },

            onAfterShow: function () {
                this.ApprovalHandler.search();
            },

            selectIconTabBar: function (oEvent) {
                var sKey = oEvent.getParameter("selectedKey");

                switch (sKey) {
                    case HomeLoan.Tab.APPROVAL:
                        if (!this.ApprovalHandler.Model().getProperty("/IsSearch")) {
                            this.ApprovalHandler.load().search();
                        }
                        break;
                    case HomeLoan.Tab.HISTORY:
                        if (!this.HistoryHandler.Model().getProperty("/IsSearch")) {
                            this.HistoryHandler.load().search();
                        }
                        break;
                }
            },

            changeTab: function (tabkey) {
                switch (tabkey) {
                    case HomeLoan.Tab.APPROVAL:
                        $.app.byViewId("TabContainer").setSelectedKey(HomeLoan.Tab.APPROVAL);
                        this.ApprovalHandler.search();
                        break;
                    case HomeLoan.Tab.HISTORY:
                        $.app.byViewId("TabContainer").setSelectedKey(HomeLoan.Tab.HISTORY);
                        this.HistoryHandler.search();
                        break;
                }
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "35110041" });
                  }
                : null
        });
    }
);
