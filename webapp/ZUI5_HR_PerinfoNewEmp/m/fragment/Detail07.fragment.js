sap.ui.define([
		"common/Common"
	], function (Common) {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail07", {
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
                        height: "10px",
                        alignItems: sap.m.FlexAlignItems.Center,
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76051}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 채용방법
                            new sap.m.HBox({
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
			                            	new sap.m.ComboBox(oController.PAGEID + "_Recmd", {
		                                        width : "100%",
		                                        selectedKey : "{Recmd}"
		                                    })
										]
									})
                            	]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76052}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 유형
                            new sap.m.HBox({
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
			                            	new sap.m.ComboBox(oController.PAGEID + "_Conty", {
		                                        width : "100%",
		                                        selectedKey : "{Conty}"
		                                    })
										]
									})
                            	]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76053}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 관계
                            new sap.m.HBox({
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
			                            	new sap.m.ComboBox(oController.PAGEID + "_Relat", {
		                                        width : "100%",
		                                        selectedKey : "{Relat}"
		                                    })
										]
									})
                            	]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76054}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 국가유공증빙코드
                            new sap.m.HBox({
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
			                            	new sap.m.Input({
		                                        width : "100%",
		                                        value : "{Conid}",
		                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoVeteran", "Conid")
		                                    })
										]
									})
                            	]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76055}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 관할보훈청
                            new sap.m.HBox({
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
			                            	new sap.m.ComboBox(oController.PAGEID + "_Zzorg", {
		                                        width : "100%",
		                                        selectedKey : "{Zzorg}"
		                                    })
										]
									})
                            	]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "10px",
                        alignItems: sap.m.FlexAlignItems.Center,
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.VBox({
                    	 		height : "45px",
	                            fitContainer: true,
	                            items: [
	                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "008")
	                            ]
	                        }).addStyleClass("custom-multiAttach-file-mobile")
                        ]
                    })
                ]
            });
        }
    });
});
