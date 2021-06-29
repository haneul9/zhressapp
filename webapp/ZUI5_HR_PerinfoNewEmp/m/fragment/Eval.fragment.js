sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Eval", {
        createContent: function (oController) {
            return new sap.m.FlexBox({
                direction: sap.m.FlexDirection.Column,
                items: [this.getList(oController)]
            });
        },

        getList: function (oController) {
        	
        	return new sap.m.Table({
                inset: false,
                noDataText: "{i18n>LABEL_00901}",
                growing: true,
                growingThreshold: 5,
                columns: [
                    new sap.m.Column({
                        width: "20%",
                        hAlign: sap.ui.core.TextAlign.Begin,
                        header: new sap.m.Label({text : oBundleText.getText("LABEL_37116"), textAlign : "Center"}),	// 평가년도
                    }),
                    new sap.m.Column({
                        width: "20%",
                        hAlign: sap.ui.core.TextAlign.Begin,
                        header: new sap.m.Label({text : oBundleText.getText("LABEL_37117"), textAlign : "Center"}),	// 조직평가
                    }),
                    new sap.m.Column({
                        width: "20%",
                        hAlign: sap.ui.core.TextAlign.Begin,
                        header: new sap.m.Label({text : oBundleText.getText("LABEL_37118"), textAlign : "Center"}),	// 업적평가
                    }),
                    new sap.m.Column({
                        width: "20%",
                        hAlign: sap.ui.core.TextAlign.Begin,
                        header: new sap.m.Label({text : oBundleText.getText("LABEL_37119"), textAlign : "Center"}),	// 역량평가
                    }),
                    new sap.m.Column({
                        width: "20%",
                        hAlign: sap.ui.core.TextAlign.Begin,
                        header: new sap.m.Label({text : oBundleText.getText("LABEL_37120"), textAlign : "Center"}),	// 종합평가
                    })
                ],
                items: {
                    path: "/Data",
                    template: new sap.m.ColumnListItem({
                        counter: 5,
                        cells: [
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Appye}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Grade7}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Grade1}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Grade2}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Grade6}" })]
                            })
                        ]
                    })
                }
            }).setModel(oController._EvalJSonModel);
        }
    });
});
