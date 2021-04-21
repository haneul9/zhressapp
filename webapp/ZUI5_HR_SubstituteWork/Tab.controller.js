sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "./delegate/SubstituteWork",
        "./delegate/StatusListHandler",
        "./delegate/ApprovalHandler",
        "./delegate/DetailHandler",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, CommonController, JSONModelHelper, SubstituteWork, StatusListHandler, ApprovalHandler, DetailHandler, JSONModel) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "Tab",

            oDetailDialog: null,
            oModel: new JSONModel(),

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

            getStatusListHandler: function () {
                if (!this.StatusListHandler) {
                    this.StatusListHandler = StatusListHandler.initialize(this);
                }

                return this.StatusListHandler;
            },
            
            getApprovalHandler: function () {
                if (!this.ApprovalHandler) {
                    this.ApprovalHandler = ApprovalHandler.initialize(this);
                }

                return this.ApprovalHandler;
            },
            
            getDetailHandler: function () {
                if (!this.DetailHandler) {
                    this.DetailHandler = DetailHandler.initialize(this);
                }

                return this.DetailHandler;
            },

            getOrgOfIndividualHandler: function() {

                return this.OrgOfIndividualHandler;
            },

            onBeforeShow: function () {
                this.oModel.setData({
                    Bukrs: this.getSessionInfoByKey("Bukrs"),
                    Zfxck: this.getSessionInfoByKey("Zfxck"),
                    Zflag: this.getSessionInfoByKey("Zflag")
                });

                this.StatusListHandler.load();
            },

            onAfterShow: function () {
                this.StatusListHandler.search();
            },

            selectIconTabBar: function(oEvent) {
                var sKey = oEvent.getParameter("selectedKey");

                switch(sKey) {
                    case SubstituteWork.Tab.STATUS:
                        if(!this.StatusListHandler.Model().getProperty("/IsSearch")) {
                            this.StatusListHandler.load().search();
                        }
                        break;
                    case SubstituteWork.Tab.APPROVAL:
                        if(!this.ApprovalHandler.Model().getProperty("/IsSearch")) {
                            this.ApprovalHandler.load().search();
                        }
                        break;
                }
            },

            changeTab: function(tabkey) {
                switch(tabkey) {
                    case SubstituteWork.Tab.STATUS:
                        $.app.byId("TabContainer").setSelectedKey(SubstituteWork.Tab.STATUS);
                        this.StatusListHandler.search();
                        break;
                    case SubstituteWork.Tab.APPROVAL:
                        $.app.byId("TabContainer").setSelectedKey(SubstituteWork.Tab.APPROVAL);
                        this.ApprovalHandler.search();
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
                // return new JSONModelHelper({ name: "20090028" });
                return new JSONModelHelper({ name: "20063110" });
            } : null
        });
    }
);
