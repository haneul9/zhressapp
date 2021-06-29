sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.AnnouncementList", {
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
                        width: "30%",
                        hAlign: sap.ui.core.TextAlign.Begin,
                  //      header: new sap.m.VBox({
            					 //items: [
	            					//  new sap.m.Label({text : oBundleText.getText("LABEL_18025"), textAlign : "Center"}), // 발령일
	            					//  new sap.m.Label({text : oBundleText.getText("LABEL_37084"), textAlign : "Center"})  // 발령명
            					 //],
                  //      })
                    }),
                    new sap.m.Column({
                        hAlign: sap.ui.core.TextAlign.Begin,
                        // header: new sap.m.Label({text : oBundleText.getText("LABEL_18008"), textAlign : "Center"}),	// 발령사항
                    }),
                    new sap.m.Column({
                        width: "25%",
                        hAlign: sap.ui.core.TextAlign.Begin,
                  //      header: new sap.m.VBox({
            					 //items: [
	            					//  new sap.m.Label({text : oBundleText.getText("LABEL_37007"), textAlign : "Center"}), 	// 부서 
	            					//  new sap.m.Label({text : oBundleText.getText("LABEL_37005"), textAlign : "Center"})     // Grade 
            					 //],
                  //      })
                    })
                    
                ],
                items: {
                    path: "/Data",
                    template: new sap.m.ColumnListItem({
                        counter: 5,
                        cells: [
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Begda}" }), new sap.m.Text({ text: "{Mntxt}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Zzmass}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Stext2}" }), new sap.m.Text({ text: "{PGradeTxt}" })]
                            })
                        ]
                    })
                }
            }).setModel(oController._AnnouncementJSonModel);
        }
    });
});
