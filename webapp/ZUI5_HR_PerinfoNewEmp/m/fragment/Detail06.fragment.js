sap.ui.define([
		"common/Common"
	], function (Common) {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail06", {
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
                        height: "84px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76041}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 복무기간
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
											new sap.m.DatePicker({
			                                    valueFormat: "yyyy-MM-dd",
			                                    displayFormat: "yyyy-MM-dd",
			                                    value: "{Begda}",
			                                    textAlign: "Begin",
			                                    width : "100%",
			                                    change: oController.onChangeDate
			                                }),
			                                new sap.m.DatePicker({
			                                    valueFormat: "yyyy-MM-dd",
			                                    displayFormat: "yyyy-MM-dd",
			                                    value: "{Endda}",
			                                    textAlign: "Begin",
			                                    width : "100%",
			                                    change: oController.onChangeDate
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76042}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 계급
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
											new sap.m.ComboBox(oController.PAGEID + "_Mrank", {
		                                        width : "100%",
		                                        selectedKey : "{Mrank}"
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76043}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 병역유형
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
		                            		new sap.m.ComboBox(oController.PAGEID + "_Serty", {
		                                        width : "100%",
		                                        selectedKey : "{Serty}"
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76044}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 보직분류
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
		                            		new sap.m.ComboBox(oController.PAGEID + "_Jobcl", {
		                                        width : "100%",
		                                        selectedKey : "{Jobcl}"
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76045}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 전역사유
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
		                            		new sap.m.ComboBox(oController.PAGEID + "_Earrt", {
		                                        width : "100%",
		                                        selectedKey : "{Earrt}"
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76046}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 역종
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
		                            		new sap.m.ComboBox(oController.PAGEID + "_Zzarmy", {
		                                        width : "100%",
		                                        selectedKey : "{Zzarmy}"
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76047}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 근무부대
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
		                            		new sap.m.Input({
		                                        width : "100%",
		                                        value : "{Serut}",
		                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoArmy", "Serut")
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76048}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 면제사유
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
		                            		new sap.m.Input({
		                                        width : "100%",
		                                        value : "{Rsexp}",
		                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoArmy", "Rsexp")
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76049}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 군번
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
		                            		new sap.m.Input({
		                                        width : "100%",
		                                        value : "{Idnum}",
		                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoArmy", "Idnum")
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76050}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // ROTC
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
		                            		new sap.m.CheckBox({
		                                        selected : "{Zrotc}"
		                                    })
										]
									})
                            	]
                            })
                        ]
                    })
                ]
            });
        }
    });
});
