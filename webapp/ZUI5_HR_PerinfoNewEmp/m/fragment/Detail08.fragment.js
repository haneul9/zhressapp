sap.ui.define([
		"common/Common"
	], function (Common) {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail08", {
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76056}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 장애유형
                            new sap.m.HBox({
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
			                            	new sap.m.ComboBox(oController.PAGEID + "_Chaty", {
			                                    width : "100%",
			                                    selectedKey : "{Chaty}"
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76057}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 발급일
                            new sap.m.HBox({
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
			                            	new sap.m.DatePicker({
		                                        valueFormat: "yyyy-MM-dd",
		                                        displayFormat: gDtfmt,
		                                        value: "{Idate}",
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76058}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 장애등급
                            new sap.m.HBox({
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
			                            	new sap.m.ComboBox(oController.PAGEID + "_Discc", {
		                                        width : "100%",
		                                        selectedKey : "{Discc}"
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76059}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 장애인등록번호
                            new sap.m.HBox({
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
			                            	new sap.m.Input({
		                                        width : "100%",
		                                        value : "{Chaid}",
		                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoDisable", "Chaid")
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
	                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "009")
	                            ]
	                        }).addStyleClass("custom-multiAttach-file-mobile")
                        ]
                    })
                ]
            });
        }
    });
});
