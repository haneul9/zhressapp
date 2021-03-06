sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_Payslip.m.fragment.Detail", {
        createContent: function (oController) {
            return new sap.m.VBox({
                height: "100%",
                items: [
                    this.getSearchHBox(oController),
                    new sap.m.FlexBox(oController.PAGEID + "_PDF", {}),
                    this.getInfoHBox(oController),
                    new sap.ui.core.HTML({ content: "<div style='height : 5px;'/>" }),
                    this.getAccountInfoBox(oController),
                    new sap.ui.core.HTML({ content: "<div style='height : 5px;'/>" }),
                    this.getMoney1InfoBox(oController),
                    new sap.ui.core.HTML({ content: "<div style='height : 5px;'/>" }),
                    this.getMoney2InfoBox(oController),
                    new sap.ui.core.HTML({ content: "<div style='height : 5px;'/>" }),
                    this.getMoney3InfoBox(oController),
                    new sap.ui.core.HTML({ content: "<div style='height : 5px;'/>" }),
                    this.getMoney4InfoBox(oController),
                    new sap.ui.core.HTML({ content: "<div style='height : 5px;'/>" }),
                    this.getMoney5InfoBox(oController),
                    new sap.ui.core.HTML({ content: "<div style='height : 5px;'/>" }),
                    this.getNoticeInfoBox(oController)
                ]
            }).addStyleClass("EmployeeLayout vbox-form-mobile-etc");
        },

        getSearchHBox: function (oController) {
            return new sap.m.FlexBox({
                fitContainer: true,
                items: [
                    new sap.m.FlexBox({
                        items: [
                            new sap.m.ComboBox({
                                width: "85px",
                                selectedKey: "{Year}",
                                items: {
                                    path: "/Year",
                                    templateShareable: false,
                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                },
                                change: function () {
                                    oController.getOcrsnList();
                                }
                            }),
                            new sap.m.ComboBox({
                                width: "70px",
                                selectedKey: "{Month}",
                                items: {
                                    path: "/Month",
                                    templateShareable: false,
                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                },
                                change: function () {
                                    oController.getOcrsnList();
                                }
                            }).addStyleClass("ml-4px"),
                            new sap.m.ComboBox(oController.PAGEID+"_Seqnr",{
                                selectedKey: "{Seqnr}",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                items: {
                                    path: "/Ocrsn",
                                    templateShareable: false,
                                    template: new sap.ui.core.ListItem({ key: "{Seqnr}", text: "{Ocrtx}" })
                                }
                            }).addStyleClass("ml-4px")
                        ]
                    }).addStyleClass("search-field-group pr-0"),
                    new sap.m.FlexBox({
                        //	width : "70px",
                        items: [
                            new sap.m.Button({
                                press: oController.onPressSearchDetail,
                                icon: "sap-icon://search"
                            }).addStyleClass("button-search")
                        ]
                    }).addStyleClass("button-group pl-0")
                ]
            })
                .addStyleClass("search-box-mobile h-auto")
                .setModel(oController._DetailJSonModel)
                .bindElement("/Data");
        },

        getInfoHBox: function (oController) {
            return new sap.m.VBox({
                items: [
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_54012}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // ????????????
                            new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                text: "{Zyymm}",
                                textAlign: "End",
                                width: "100%"
                            }).addStyleClass("sub-conRead-title")
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_54013}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // ??????
                            new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                text: "{Orgtx}",
                                textAlign: "End",
                                width: "100%"
                            }).addStyleClass("font-regular font-14px custom_conRead-title")
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_01303}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // ??????
                            new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                text: "{Ename}",
                                textAlign: "End",
                                width: "100%"
                            }).addStyleClass("sub-conRead-title")
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_54008}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // ???????????????
                            new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                text: "{Bet03}",
                                textAlign: "End",
                                width: "100%"
                            }).addStyleClass("color-icon-blue font-20px font-bold")
                        ]
                    })
                ],
                visible: {
                    path: "visibleYn",
                    formatter: function (v) {
                        if (v === "X") return true;
                        else return false;
                    }
                }
            })
                .setModel(oController._DetailJSonModel)
                .bindElement("/Data");
        },

        getAccountInfoBox: function (oController) {
            return new sap.m.VBox({
                items: [
                    new sap.m.HBox({
                        height: "55px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                //	  textAlign : "Center",
                                width: "100%",
                                text: "{i18n>LABEL_54014}"
                            }).addStyleClass("sub-title") // ????????????
                        ]
                    }).addStyleClass("sub-con-titleBar-both"),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "100px", text: "{i18n>LABEL_54017}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // ?????????
                            new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                textAlign: "End",
                                width: "100%",
                                text: "{Banka}"
                            }).addStyleClass("font-regular font-14px custom_conRead-title")
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "100px", text: "{i18n>LABEL_54018}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // ????????????
                            new sap.m.Text({
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                textAlign: "End",
                                width: "100%",
                                text: "{Bankn}"
                            }).addStyleClass("sub-conRead-title")
                        ]
                    })
                ],
                visible: {
                    path: "visibleYn",
                    formatter: function (v) {
                        if (v === "X") return true;
                        else return false;
                    }
                }
            })
                .setModel(oController._DetailJSonModel)
                .bindElement("/Data");
        },

        getMoney1InfoBox: function (oController) {
            return new sap.m.VBox(oController.PAGEID + "_Money1Layout", {});
            // .addStyleClass("vbox-form-mobile");
        },

        getMoney2InfoBox: function (oController) {
            return new sap.m.VBox(oController.PAGEID + "_Money2Layout", {});
            // .addStyleClass("vbox-form-mobile");
        },

        getMoney3InfoBox: function (oController) {
            return new sap.m.VBox(oController.PAGEID + "_Money3Layout", {});
            // .addStyleClass("vbox-form-mobile");
        },
        getMoney4InfoBox: function (oController) {
            return new sap.m.VBox(oController.PAGEID + "_Money4Layout", {});
            // .addStyleClass("vbox-form-mobile");
        },
        getMoney5InfoBox: function (oController) {
            return new sap.m.VBox(oController.PAGEID + "_Money5Layout", {});
            // .addStyleClass("vbox-form-mobile");
        },

        getNoticeInfoBox: function (oController) {
            return new sap.m.VBox({
                items: [
                    new sap.m.TextArea({
                        value: "{Ztitle}",
                        rows: 4,
                        editable: false,
                        width: "100%",
                        growing: true
                    })
                ],
                visible: {
                    path: "visibleYn",
                    formatter: function (v) {
                        if (v === "X") return true;
                        else return false;
                    }
                }
            })
                .addStyleClass("pb-20px sub-con-titleBar-both")
                .setModel(oController._DetailJSonModel)
                .bindElement("/Data");
        }
    });
});
