
sap.ui.define(
    [
        "common/PageHelper",
        "common/Common"
    ],
    function (PageHelper, Common) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_PerinfoNewEmp.m.Detail_Career", {
            getControllerName: function () {
                return "ZUI5_HR_PerinfoNewEmp.m.Detail_Career";
            },

            createContent: function (oController) {
                var oContent = new sap.m.VBox({
					fitContainer: true,
					items: [
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76034}"}), // 입사일
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.DatePicker({
		                                            valueFormat: "yyyy-MM-dd",
		                                            displayFormat: gDtfmt,
		                                            value: "{Begda}",
		                                            width: "100%",
		                                            textAlign: "Begin",
		                                            change: oController.onChangeDate,
		                                            editable : "{Editable}" 
		                                        })
											]
										})
	                            	]
	                            })
							]
						}),
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76035}"}), // 퇴사일
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.DatePicker({
		                                            valueFormat: "yyyy-MM-dd",
		                                            displayFormat: gDtfmt,
		                                            value: "{Endda}",
		                                            width: "100%",
		                                            textAlign: "Begin",
		                                            change: oController.onChangeDate,
		                                            editable : "{Editable}" 
		                                        })
											]
										})
	                            	]
	                            })
							]
						}),
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76062}"}), // 국가
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.ComboBox(oController.PAGEID + "-Land1", {
		                                       	    width : "100%",
								                    selectedKey: "{Land1}",
		                                            editable : "{Editable}"
								                })
											]
										})
	                            	]
	                            })
							]
						}),
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76073}"}), // 회사명
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
		                                            value: "{Arbgb}",
		                                            width : "100%",
		                                            maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoCareer", "Arbgb"),
		                                            editable : "{Editable}" 
		                                        })
											]
										})
	                            	]
	                            })
							]
						}),
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76074}"}), // 근무지
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
		                                            value: "{Ort01}",
		                                            width : "100%",
		                                            maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoCareer", "Ort01"),
		                                            editable : "{Editable}" 
		                                        })
											]
										})
	                            	]
	                            })
							]
						}),
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76075}"}), // 직위
                                new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
		                                            value: "{Zztitle}",
		                                            width : "100%",
		                                            maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoCareer", "Zztitle"),
		                                            editable : "{Editable}" 
		                                        })
											]
										})
	                            	]
	                            })
							]
						}),
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76076}"}), // 담당업무
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
		                                            value: "{Zzjob}",
		                                            maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoCareer", "Zzjob"),
		                                            editable : "{Editable}" 
		                                        })
											]
										})
	                            	]
	                            })
							]
						}),
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
		                        new sap.m.VBox({
	                    	 		height : "45px",
		                            fitContainer: true,
		                            items: [
		                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "006")
		                            ]
		                        }).addStyleClass("custom-multiAttach-file-mobile")
							]
						})
					]
		        });
                
                return new PageHelper({
                	idPrefix : oController.PAGEID,
                	showNavButton: true,
					navBackFunc: oController.onBack,
                	contentStyleClass: "sub-app-content",
            		contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                    contentItems: [oContent],
                    headerButton : new sap.m.FlexBox({
	                                   items: [ 
	                                        new sap.m.Button({ 
	                                            text : "{i18n>LABEL_00101}",  // 저장
	                                            press : function(oEvent){
	                                            	oController.onPressSave(oEvent, "S5");
	                                            },
	                                            visible : "{Editable}"
	                                        }).addStyleClass("button-light"),
	                                        new sap.m.Button({ 
	                                            text : "{i18n>LABEL_00103}",  // 삭제
	                                            press : function(oEvent){
	                                            	oController.onPressSave(oEvent, "D5");
	                                            },
	                                            visible : {
	                                            	path : "Editable",
	                                            	formatter : function(fVal){
	                                            		return !fVal;
	                                            	}
	                                            }
	                                        }).addStyleClass("button-light")
	                                   ]
                                   }).addStyleClass("app-nav-button-right")

                })
                .setModel(oController._DetailJSonModel)
                .bindElement("/Data");
            },

            // Model 선언
            loadModel: function () {
                $.app.setModel("ZHR_PERS_INFO_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
