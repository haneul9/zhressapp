sap.ui.define(
    [
        "common/Common", //
        "common/PageHelper"
    ],
    function (Common, PageHelper) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "SearchUser"].join($.app.getDeviceSuffix());

        sap.ui.jsview(SUB_APP_ID, {
            getControllerName: function () {
                return SUB_APP_ID;
            },

            createContent: function () {
                return new PageHelper({
                    idPrefix: "SearchUser-",
                    title: "{i18n>LABEL_09064}", // 사원검색
                    showNavButton: false,
                    // navBackFunc: SearchUserMobile.navBack,
                    headerButton: new sap.m.Button({
                        text: "{i18n>LABEL_09023}" // 신청
                        // press: FacilityHandler.onPressApprovalBtn.bind(FacilityHandler)
                    }).addStyleClass("button-dark app-nav-button-right"),
                    contentStyleClass: "sub-app-content",
                    contentContainerStyleClass: "app-content-container-mobile",
                    contentItems: [
                        //sap.ui.jsfragment("fragment.EmployeeSearchMobile", oController)
                    ]
                });
            }
        });
    }
);
