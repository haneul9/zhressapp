$.sap.require("fragment.COMMON_ATTACH_FILES");

sap.ui.define([
    "common/makeTable",
    "common/PageHelper"
], function (makeTalbe, PageHelper) {
    "use strict";
    
    sap.ui.jsview("ZUI5_HR_PerinfoNewEmp.List", {
        getControllerName: function () {
            return "ZUI5_HR_PerinfoNewEmp.List";
        },
    
        createContent: function (oController) {
            $.app.setModel("ZHR_COMMON_SRV");
            $.app.setModel("ZHR_PERS_INFO_SRV");
            // $.app.setModel("ZHR_PERS_RECORD_SRV");
            // $.app.setModel("ZHR_APPRAISAL_SRV");
    
            var oObjectPageLayout = new sap.uxap.ObjectPageLayout(oController.PAGEID + "_ObjectPageLayout", {
                enableLazyLoading: false,
                showTitleInHeaderContent: false,
                showHeaderContent: false,
                alwaysShowContentHeader: false,
                sections: [
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_76002}", // 인적사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail01", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_76003}", // 입사서류
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail02", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_76004}", // 주소정보
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail03", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_76005}", // 학력사항
                        showTitle: false,
                        subSections: [
                             new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail04", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_76006}", // 경력사항
                        showTitle: false,
                        subSections: [
                             new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail05", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_76007}", // 병역사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail06", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_76008}", // 보훈사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail07", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_76009}", // 장애사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail08", oController)]
                            })
                        ]
                    })
                ]
            }).addStyleClass("sapUiSizeCompact tab-group mt-26px");
            
             var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
                customHeader: [],
                showHeader: false,
                enableScrolling: false,
                content: [
                    new sap.m.FlexBox({
                        direction: sap.m.FlexDirection.Column,
                        items: [
                            new sap.m.FlexBox({
                                alignItems: "End",
                                fitContainer: true,
                                items: [new sap.m.Text({text : oController.getBundleText("LABEL_76001")}).addStyleClass("app-title")] // 신규입사자정보 입력
                            }).addStyleClass("app-title-container mb-16px")
                        ]
                    }).addStyleClass("app-content-container-wide"),
                    oObjectPageLayout
                ]
            }).addStyleClass("app-content");

            oPage.setModel(oController._ListCondJSonModel);
            oPage.bindElement("/Data");
    
            return oPage;
        }
    });
    
    });