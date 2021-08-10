
sap.ui.define(
    [
        "common/PageHelper",
        "common/Common"
    ],
    function (PageHelper, Common) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_PerinfoNewEmp.m.Detail_Address", {
            getControllerName: function () {
                return "ZUI5_HR_PerinfoNewEmp.m.Detail_Address";
            },

            createContent: function (oController) {
                var oContent = new sap.m.VBox({
					fitContainer: true,
					items: [
						new sap.m.HBox({
							height : "42px",
							alignItems : "Center",
							items : [
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_37022}"}), // 주소유형
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.ComboBox(oController.PAGEID + "-Anssa", {
				                                	width : "100%",
				                                	selectedKey : "{Anssa}",
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_02165}"}), // 국가
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.ComboBox(oController.PAGEID + "-Land1", {
								                    selectedKey: "{Land1}",
								                    width : "100%",
								                    change : oController.onChangeLand1,
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_02132}"}), // 우편번호
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
				                                    value: "{Pstlz}",
				                                    width: "50%",
				                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Pstlz"),
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_76088}"}), // 구역
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.ComboBox(oController.PAGEID + "-State", {
								                    selectedKey: "{State}",
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_37097}"}), // 시/구/군
                                new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
				                                    value: "{Ort1k}",
				                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Ort1k"),
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_37028}"}), // 동/읍/명
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
				                                    value: "{Ort2k}",
				                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Ort2k"),
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_02175}"}), // 상세주소
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
				                                    value: "{Stras}",
				                                    width : "100%",
				                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Stras"),
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
								new sap.m.Label({width : "105px", text : "{i18n>LABEL_00165}"}), // 전화번호
								new sap.m.HBox({
									width : "100%",
	                            	items : [
	                            		new sap.m.VBox({
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											items : [
				                            	new sap.m.Input({
				                                    value: "{Telnr}",
				                                    width: "100%",
				                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Telnr"),
				                        			editable : "{Editable}"
				                                })
											]
										})
	                            	]
	                            })
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
	                                            	oController.onPressSave(oEvent, "S3");
	                                            },
	                                            visible : "{Editable}"
	                                        }).addStyleClass("button-light"),
	                                        new sap.m.Button({ 
	                                            text : "{i18n>LABEL_00103}",  // 삭제
	                                            press : function(oEvent){
	                                            	oController.onPressSave(oEvent, "D3");
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
