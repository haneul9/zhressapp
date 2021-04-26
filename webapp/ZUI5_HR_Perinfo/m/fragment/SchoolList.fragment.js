sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.SchoolList", {
        createContent: function (oController) {
            return new sap.m.FlexBox({
                direction: sap.m.FlexDirection.Column,
                items: [this.getList(oController)]
            });
        },

        getList: function (oController) {
        	
        	var oZzmajor = new sap.m.Text({ text: "{Zzmajor}",
        									visible: {
						                        path: "Slart",
						                        formatter: function (v) {
						                            if (v === "H4" || v === "H5" || v === "H6") return true;
						                            else return false;
						                        }
						                    },
        								  });
    	  								
            return new sap.m.Table({
                inset: false,
                noDataText: "{i18n>LABEL_00901}",
                growing: true,
                growingThreshold: 5,
                columns: [
                    new sap.m.Column({
                        width: "40%",
                        hAlign: sap.ui.core.TextAlign.Begin
                    }),
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
                                items: [new sap.m.Text({ text: "{Period}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Etext}" })]
                            }),
                            new sap.m.FlexBox({
                                direction: sap.m.FlexDirection.Column,
                                items: [new sap.m.Text({ text: "{Insti}" }), 
                                	    new sap.m.Text({ text: "{Zzmajor}",
        									visible: {
						                        path: "Slart",
						                        formatter: function (v) {
						                            if (v === "H4" || v === "H5" || v === "H6") return true;
						                            else return false;
						                        }
						                    },
        								  })
                                       ]
                            })
                        ]
                    })
                }
            }).setModel(oController._SchoolJSonModel);
        }
    });
});
