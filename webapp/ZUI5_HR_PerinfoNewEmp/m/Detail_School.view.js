
sap.ui.define(
    [
        "common/PageHelper",
        "common/Common"
    ],
    function (PageHelper, Common) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_PerinfoNewEmp.m.Detail_School", {
            getControllerName: function () {
                return "ZUI5_HR_PerinfoNewEmp.m.Detail_School";
            },

            createContent: function (oController) {
                var oContent = new sap.m.VBox({
					fitContainer: true,
					items: [
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76060}"}), // 학교구분
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.ComboBox(oController.PAGEID + "-Slart", {
		                                        	width : "100%",
								                    selectedKey: "{Slart}",
								                    change : oController.onChangeSlart,
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76027}"}), // 입학일
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76028}"}), // 졸업일
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
				                            	new sap.m.ComboBox(oController.PAGEID + "-Sland", {
								                    selectedKey: "{Sland}",
								                    width : "100%",
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76063}"}), // 교육기관구분
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
		                                            value: "{Ausbi}",
		                                            width : "100%",
		                                            valueHelpOnly : true,
		                                            showValueHelp : true,
		                                            valueHelpRequest : function(oEvent){
		                                            	oController.onSearchSchoolCode(oEvent, "Ausbi");
		                                            },
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76064}"}), // 학교
                                new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
								                    value: "{Insti}",
								                    width : "100%",
								                    editable : {
							                    		path : "Slart",
							                    		parts : [{path : "Slart"}, {path : "Editable"}],
							                    		formatter : function(fVal, fVal2){
								                    			if(fVal2 == true){
							                   		 			return fVal && (fVal == "H4" || fVal == "H5" || fVal == "H6") ? false : true;
								                   	 	 	} else {
								                   				return fVal2;
								                   			}
									                   	}
								                   },
								                   maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoEdu", "Insti")
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76065}"}), // 전공
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
								                    value : "{Ftext1}",
								                    width : "100%",
								                    valueHelpOnly : true,
		                                            showValueHelp : true,
		                                            valueHelpRequest : function(oEvent){
		                                           		oController.onSearchSchoolCode(oEvent, "Sltp1");
		                                            },
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76066}"}), // 학위
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.ComboBox(oController.PAGEID + "-Slabs", {
								                    selectedKey: "{Slabs}",
								                    width : "100%",
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76067}"}), // 최종학력
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.CheckBox({
			                                        selected: "{Zzlmark}",
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
		                            fitContainer: true,
		                            items: [
		                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "007")
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
	                                            	oController.onPressSave(oEvent, "S4");
	                                            },
	                                            visible : "{Editable}"
	                                        }).addStyleClass("button-light"),
	                                        new sap.m.Button({ 
	                                            text : "{i18n>LABEL_00103}",  // 삭제
	                                            press : function(oEvent){
	                                            	oController.onPressSave(oEvent, "D4");
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
