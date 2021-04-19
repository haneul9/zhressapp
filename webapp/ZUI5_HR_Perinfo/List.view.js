sap.ui.define([], function () {
    "use strict";

    sap.ui.jsview("ZUI5_HR_Perinfo.List", {
        getControllerName: function () {
            return "ZUI5_HR_Perinfo.List";
        },

        createContent: function (oController) {
            $.app.setModel("ZHR_COMMON_SRV");
            $.app.setModel("ZHR_PERS_INFO_SRV");
            $.app.setModel("ZHR_PERS_RECORD_SRV");

            oController.setupView.call(oController);

            var oObjectPageLayout = new sap.uxap.ObjectPageLayout(oController.PAGEID + "_ObjectPageLayout", {
                enableLazyLoading: false,
                showTitleInHeaderContent: false,
                showHeaderContent: false,
                alwaysShowContentHeader: false,
                sections: [
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_37008}", // 기본인적사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Basic", oController, "2")]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_37009}", // 주소정보
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Address", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_37029}", // 차량관리
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Car", oController)]
                            })
                        ],
                        visible: {
                            path: "Auth",
                            formatter: function (v) {
                                if (v == "E") return true;
                                else return false;
                            }
                        }
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_37044}", // 여권/비자관리
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Passport", oController)]
                            })
                        ],
                        visible: {
                            path: "Auth",
                            formatter: function (v) {
                                if (v == "E") return true;
                                else return false;
                            }
                        }
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_02194}", // 학력사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.School", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_02198}", // 병역사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Military", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_02197}", // 자격면허
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.License", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_02195}", // 경력사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Career", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_18010}", // 포상
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Award", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_13040}", // 징계
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Punish", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_18008}", // 발령사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Announcement", oController)]
                            })
                        ]
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_37086}", // 보훈 및 장애
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Handicap", oController)]
                            })
                        ],
                        visible: {
                            path: "Auth",
                            formatter: function (v) {
                                if (v == "E") return true;
                                else return false;
                            }
                        }
                    }),
                    new sap.uxap.ObjectPageSection({
                        title: "{i18n>LABEL_37106}", // 가족사항
                        showTitle: false,
                        subSections: [
                            new sap.uxap.ObjectPageSubSection({
                                title: "",
                                blocks: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Family", oController)]
                            })
                        ],
                        visible: {
                            path: "Auth",
                            formatter: function (v) {
                                if (v == "M") return true;
                                else return false;
                            }
                        }
                    })
                ]
            });

            oObjectPageLayout.addStyleClass("sapUiSizeCompact");

            var oScrollContainer = new sap.m.ScrollContainer({
                vertical: true,
                content: []
            });

            if ($.app.getAuth() === "M") {
                oScrollContainer = new sap.m.ScrollContainer({
                    vertical: true,
                    content: [sap.ui.jsfragment("fragment.OrgOfIndividualForEP", oController)]
                });
            }

            var oSplitContainer = new sap.m.SplitContainer(oController.PAGEID + "_SplitContainer", {
                mode: {
                    path: "Auth",
                    formatter: function (fVal) {
                        return fVal == "M" ? "ShowHideMode" : "HideMode";
                    }
                },
                detailPages: [oObjectPageLayout],
                masterPages: [oScrollContainer]
            })
                // ;
                .setModel(oController._ListCondJSonModel)
                .bindElement("/Data");

            var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
                customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
                showHeader: false,
                enableScrolling: false,
                content: [
                    new sap.m.FlexBox({
                        direction: sap.m.FlexDirection.Column,
                        items: [
                            new sap.m.FlexBox({
                                alignItems: "End",
                                fitContainer: true,
                                items: [sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Header", oController), new sap.m.Text({ text: "{i18n>LABEL_37001}" }).addStyleClass("app-title")] // 사원 프로파일
                            }).addStyleClass("app-title-container")
                        ]
                    }).addStyleClass("app-content-container-wide"),
                    oSplitContainer
                ]
            }).addStyleClass("app-content");

            oPage.setModel(oController._ListCondJSonModel);
            oPage.bindElement("/Data");

            return oPage;
        }
    });
});
