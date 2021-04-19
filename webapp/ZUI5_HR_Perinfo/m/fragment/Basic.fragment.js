sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.Basic", {
    createContent: function (oController) {
        return new sap.m.VBox({
            height: "100%",
            items: [this.getInfoHBox(oController)]
        });
    },

    getInfoHBox: function (oController) {
        return new sap.m.VBox({
            items: [
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37010}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 성명
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Ename1}",
                            textAlign: "End",
                            width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37015}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 실제생일
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Zzbdate}",
                            textAlign: "End",
                            width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37016}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 성별
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{GeschTx}",
                            textAlign: "End",
                            width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_04304}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 사번
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Pernr}",
                            textAlign: "End",
                            width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37007}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 부서명
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Orgtx}",
                            textAlign: "End",
                            width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_22004}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 입사일
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Dat01}",
                            textAlign: "End",
                            width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_22005}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 그룹입사일
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Dat02}",
                            textAlign: "End",
                            width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37005}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // Grade
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{PgradeT}",
                            textAlign: "End",
                            width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37006}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 직책
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{ZpostT}",
                            textAlign: "End",
                            width: "100%"
                        })
                    ]
                })
            ]
        })
            .setModel(oController._BasicJSonModel)
            .bindElement("/Data");
    }
});
