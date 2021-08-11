sap.ui.define([
		"common/Common"
	], function (Common) {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail01", {
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76010}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 한글성명(성/이름)
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.Input({
		                                // width : "50%",
		                                value : "{Lnmhg}",
		                                maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Lnmhg")
		                            }),
		                            new sap.m.Input({
		                                // width : "50%",
		                                value : "{Fnmhg}",
		                                maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Fnmhg")
		                            }).addStyleClass("pl-5px")
                            	]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76011}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 한자성명(성/이름)
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.Input({
                                        value : "{Lnmch}",
                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Lnmch")
                                    }),
                                    new sap.m.Input({
                                        value : "{Fnmch}",
                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Fnmch")
                                    }).addStyleClass("pl-5px")
                            	]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76012}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 영문성명(Last/First)
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.Input({
                                        value : "{Nachn}",
                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Fnmch")
                                    }),
                                    new sap.m.Input({
                                        value : "{Vorna}",
                                        maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Vorna")
                                    }).addStyleClass("pl-5px")
                            	]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76013}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 성별
                            new sap.m.VBox({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								items : [
									new sap.m.ComboBox(oController.PAGEID + "_Gesch", {
		                                selectedKey : "{Gesch}",
		                                width : "100%"
		                            })
								]
							})
                        ]
                    }),
                    new sap.m.HBox({
                        height: "40px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76014}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 주민등록번호
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.Input({
                                        value : "{Regno1}",
                                        maxLength : 6
                                    }),
                                    new sap.m.Input({
                                        value : "{Regno2}",
                                        type : "Password",
                                        liveChange : function(oEvent){
                                        	var value = oEvent.getSource().getValue();
                                        	
                                        	oEvent.getSource().setValue(value.replace(/[^0-9\.]/g, ""));
                                        },
                                        maxLength : 7
                                    }).addStyleClass("pl-5px")
                            	]
                            })
                        ]
                    }),
                    new sap.m.HBox({
                        height: "84px",
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76015}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 실제생일
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
											new sap.m.DatePicker({
		                                        valueFormat: "yyyy-MM-dd",
		                                        displayFormat: gDtfmt,
		                                        value: "{Zzbdate}",
		                                        textAlign: "Begin",
		                                        change: oController.onChangeDate
		                                    }),
		                                    new sap.m.ComboBox(oController.PAGEID + "_Zzclass", {
		                                        selectedKey : "{Zzclass}",
		                                        width : "100%"
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76016}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 결혼여부
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
											new sap.m.ComboBox(oController.PAGEID + "_Famst", {
		                                        selectedKey : "{Famst}",
		                                        width : "100%",
		                                        change : function(oEvent){
		                                        	oController._ListCondJSonModel.setProperty("/Data/Famdt", "");
		                                        }
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76017}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 결혼기념일
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
											new sap.m.DatePicker({
		                                        valueFormat: "yyyy-MM-dd",
		                                        displayFormat: gDtfmt,
		                                        value: "{Famdt}",
		                                        textAlign: "Begin",
		                                        editable : {
		                                        		path : "Famst",
		                                        		formatter : function(fVal){
		                                        			return fVal && fVal == "1" ? true : false;
		                                        		}
		                                        },
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
                            new sap.m.Label({ width: "150px", text: "{i18n>LABEL_76092}", textAlign: "Left" }).addStyleClass("sub-conRead-title"), // 국적
                            new sap.m.HBox({
                            	width : "100%",
                            	items : [
                            		new sap.m.VBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										items : [
											new sap.m.ComboBox(oController.PAGEID + "_Natio", {
                                                width : "100%",
                                                selectedKey : "{Natio}"
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
