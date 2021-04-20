sap.ui.define(
    [
        "common/PageHelper",  //
        "./delegate/Shift"
    ],
    function (PageHelper, Shift) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();

                var tabBox = new sap.m.IconTabBar("TabContainer", {
                    select: oController.selectIconTabBar.bind(oController),
                    selectedKey: Shift.Tab.STATUS,
                    expandable: false,
                    items: [
                        new sap.m.IconTabFilter({
                            key: Shift.Tab.STATUS,
                            text: "{i18n>LABEL_30002}", // 현황
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, Shift.Tab.STATUS].join(".fragment."), oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: Shift.Tab.APPROVAL,
                            text: "{i18n>LABEL_30003}", // 변경신청내역
                            visible: "{= ${/Bukrs} === 'A' || ${/Zflag} === 'X' ? false : true }",
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, Shift.Tab.APPROVAL].join(".fragment."), oController)]
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
