sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.AddressList", {
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
                        hAlign: sap.ui.core.TextAlign.Begin
                    }),
                    new sap.m.Column({
                        hAlign: sap.ui.core.TextAlign.Begin
                    })
                ],
                items: {
                    path: "/Data",
                    template: new sap.m.ColumnListItem({
                        counter: 5,
                        cells: [
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Stext}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [
                                	new sap.m.VBox({
		            					 items: [
			            					 new sap.m.Text({text : "{Addrs}", textAlign : "Begin", maxLines : 3}), 	// 주소
			            					 new sap.m.Text({text : "{Telnr}", textAlign : "Begin"}),   // 전화번호
			            					 new sap.m.Text({text : "{Usrid}", textAlign : "Begin"})   // 핸드폰 번호
		            					 ]
			                        })
			                    ]
                            }),
                        ]
                    })
                }
            }).setModel(oController._AddressJSonModel);
        }
    });
});
