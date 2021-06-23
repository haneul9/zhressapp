sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "./delegate/WorkSchedule",
        "./delegate/PriorHandler",
        "./delegate/PostHandler"
    ],
    function (Common, CommonController, JSONModelHelper, WorkSchedule, PriorHandler, PostHandler) {
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

            getPriorHandler: function () {
                if (!this.PriorHandler) {
                    this.PriorHandler = PriorHandler.initialize(this);
                }

                return this.PriorHandler;
            },
            
            getPostHandler: function () {
                if (!this.PostHandler) {
                    this.PostHandler = PostHandler.initialize(this);
                }

                return this.PostHandler;
            },
            
            getOrgOfIndividualHandler: function() {

                return this.OrgOfIndividualHandler;
            },
            
            getApprovalLinesHandler: function() {

                return this.ApprovalLinesHandler;
            },

            onBeforeShow: function () {
                this.PriorHandler.load();
            },

            onAfterShow: function (oEvent) {
                if(oEvent.data.Key){
                    switch(oEvent.data.Key) {
                        case WorkSchedule.Tab.PRIOR:
                            this.PriorHandler.load().search();
                            break;
                        case WorkSchedule.Tab.POST:
                            this.PostHandler.load().search();
                            break;
                    }
                } else {
                    this.PriorHandler.search();
                }                
            },

            selectIconTabBar: function(oEvent) {
                var sKey = oEvent.getParameter("selectedKey");

                switch(sKey) {
                    case WorkSchedule.Tab.PRIOR:
                        if(!this.PriorHandler.Model().getProperty("/IsSearch")) {
                            this.PriorHandler.load().search();
                        }
                        break;
                    case WorkSchedule.Tab.POST:
                        if(!this.PostHandler.Model().getProperty("/IsSearch")) {
                            this.PostHandler.load().search();
                        }
                        break;
                }
            },

            changeTab: function(tabkey) {
                switch(tabkey) {
                    case WorkSchedule.Tab.PRIOR:
                        $.app.byViewId("TabContainer").setSelectedKey(WorkSchedule.Tab.PRIOR);
                        this.PriorHandler.search();
                        break;
                    case WorkSchedule.Tab.POST:
                        $.app.byViewId("TabContainer").setSelectedKey(WorkSchedule.Tab.POST);
                        this.PostHandler.search();
                        break;
                }
            },

            onESSelectPerson: function(data) {
                return this.EmployeeSearchCallOwner 
                        ? this.EmployeeSearchCallOwner.setSelectionTagets(data)
                        : null;
            },

            displayMultiOrgSearchDialog: function(oEvent) {
                return !$.app.getController().EmployeeSearchCallOwner 
                        ? $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent)
                        : $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
            },

            getLocalSessionModel: Common.isLOCAL() ? function () {
                return new JSONModelHelper({ name: "35110494" });
            } : null
        });
    }
);
