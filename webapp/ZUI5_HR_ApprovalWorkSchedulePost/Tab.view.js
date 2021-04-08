sap.ui.define(
    [
        "common/PageHelper",  //
        "./delegate/WorkSchedule"
    ],
    function (PageHelper, WorkSchedule) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();

                var tabBox = new sap.m.IconTabBar($.app.createId("TabContainer"), {
                    select: oController.selectIconTabBar.bind(oController),
                    selectedKey: WorkSchedule.Tab.APPROVAL,
                    expandable: false,
                    items: [
                        new sap.m.IconTabFilter({
                            key: WorkSchedule.Tab.APPROVAL,
                            text: "{i18n>LABEL_55041}", // 결재
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, WorkSchedule.Tab.APPROVAL].join(".fragment."), oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: WorkSchedule.Tab.HISTORY,
                            text: "{i18n>LABEL_55042}", // 결재내역
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, WorkSchedule.Tab.HISTORY].join(".fragment."), oController)]
                        })
                    ]
                })
                .addStyleClass("tab-group mt-26px");
        
                return new PageHelper({
                    contentItems: [tabBox]
                });
            },

            loadModel: function () {
                $.app.setModel("ZHR_BATCHAPPROVAL_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
