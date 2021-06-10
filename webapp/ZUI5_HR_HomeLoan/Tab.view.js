sap.ui.define(
    [
        "common/PageHelper",  //
        "./delegate/HomeLoan"
    ],
    function (PageHelper, HomeLoan) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {

                var tabBox = new sap.m.IconTabBar($.app.createId("TabContainer"), {
                    select: oController.selectIconTabBar.bind(oController),
                    selectedKey: HomeLoan.Tab.APPROVAL,
                    expandable: false,
                    items: [
                        new sap.m.IconTabFilter({
                            key: HomeLoan.Tab.APPROVAL,
                            text: "신청내역",
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, HomeLoan.Tab.APPROVAL].join(".fragment."), oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: HomeLoan.Tab.HISTORY,
                            text: "대출내역",
                            content: [sap.ui.jsfragment([$.app.CONTEXT_PATH, HomeLoan.Tab.HISTORY].join(".fragment."), oController)]
                        })
                    ]
                })
                .addStyleClass("tab-group mt-26px");
        
                return new PageHelper({
                    contentItems: [tabBox]
                });
            }
        });
    }
);
