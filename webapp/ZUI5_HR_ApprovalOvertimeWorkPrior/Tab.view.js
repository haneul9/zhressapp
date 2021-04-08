sap.ui.define(
    [
        "../common/PageHelper",  //
        "./delegate/OvertimeWork"
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
                    selectedKey: OvertimeWork.Tab.APPROVAL,
                    expandable: false,
                    items: [
                        new sap.m.IconTabFilter({
                            key: OvertimeWork.Tab.APPROVAL,
                            text: "{i18n>LABEL_32050}", // 결재
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, OvertimeWork.Tab.APPROVAL].join(".fragment."), oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: OvertimeWork.Tab.HISTORY,
                            text: "{i18n>LABEL_32051}", // 결재내역
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, OvertimeWork.Tab.HISTORY].join(".fragment."), oController)]
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
