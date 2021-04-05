sap.ui.define(
    [
        "common/PageHelper",  //
        "./delegate/OvertimeWork",
    ],
    function (PageHelper, OvertimeWork) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();

                var tabBox = new sap.m.IconTabBar($.app.createId("TabContainer"), {
                    select: oController.selectIconTabBar.bind(oController),
                    selectedKey: OvertimeWork.Tab.PRIOR,
                    expandable: false,
                    items: [
                        new sap.m.IconTabFilter({
                            key: OvertimeWork.Tab.PRIOR,
                            text: "{i18n>LABEL_32003}", // 사전신청내역
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, OvertimeWork.Tab.PRIOR].join(".fragment."), oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: OvertimeWork.Tab.POST,
                            text: "{i18n>LABEL_32005}", // 사후신청내역
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, OvertimeWork.Tab.POST].join(".fragment."), oController)]
                        })
                    ]
                })
                .addStyleClass("tab-group mt-26px");
        
                return new PageHelper({
                    contentItems: [tabBox]
                });
            },

            loadModel: function () {
                $.app.setModel("ZHR_WORKTIME_APPL_SRV");
                $.app.setModel("ZHR_WORKSCHEDULE_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
