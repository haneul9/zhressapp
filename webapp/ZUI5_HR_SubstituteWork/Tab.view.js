sap.ui.define(
    [
        "common/PageHelper",  //
        "./delegate/SubstituteWork"
    ],
    function (PageHelper, SubstituteWork) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();

                var tabBox = new sap.m.IconTabBar("TabContainer", {
                    select: oController.selectIconTabBar.bind(oController),
                    selectedKey: SubstituteWork.Tab.STATUS,
                    expandable: false,
                    items: [
                        new sap.m.IconTabFilter({
                            key: SubstituteWork.Tab.STATUS,
                            text: "{i18n>LABEL_31002}", // 현황
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, SubstituteWork.Tab.STATUS].join(".fragment."), oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: SubstituteWork.Tab.APPROVAL,
                            text: "{i18n>LABEL_31003}", // 신청내역
                            visible: "{= ${/Bukrs} === 'A100' || ${/Zflag} === 'X' || ${/Zfxck} !== 'X' ? false : true }",
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, SubstituteWork.Tab.APPROVAL].join(".fragment."), oController)]
                        })
                    ]
                })
                .addStyleClass("tab-group mt-26px")
                .setModel(oController.oModel);
        
                return new PageHelper({
                    contentItems: [tabBox]
                });
            },

            loadModel: function () {
                $.app.setModel("ZHR_WORKSCHEDULE_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
