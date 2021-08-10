$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define(
    [
        "common/PageHelper" //
    ],
    function (PageHelper) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();
                
                var tabBox = new sap.m.IconTabBar(oController.PAGEID + "_IconBar", {
                    expandable: false,
                    select: oController.handleTabBarSelect.bind(oController),
                    selectedKey: "01",
                    items: [
                        new sap.m.IconTabFilter({
                            key: "01",
                            text: "{i18n>LABEL_76002}", // 인적사항
                            content: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail01", oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: "02",
                            text: "{i18n>LABEL_76003}", // 입사서류
                            content: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail02", oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: "03",
                            text: "{i18n>LABEL_76004}", // 주소정보
                            content: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail03", oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: "04",
                            text: "{i18n>LABEL_76005}", // 학력사항
                            content: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail04", oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: "05",
                            text: "{i18n>LABEL_76006}", // 경력사항
                            content: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail05", oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: "06",
                            text: "{i18n>LABEL_76007}", // 병역사항
                            content: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail06", oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: "07",
                            text: "{i18n>LABEL_76008}", // 보훈사항
                            content: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail07", oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: "08",
                            text: "{i18n>LABEL_76009}", // 장애사항
                            content: [sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.Detail08", oController)]
                        })
                    ]
                }).addStyleClass("tab-group");
				
                tabBox.addEventDelegate(
                    {
                        onAfterRendering: function () {
                        	if(oController.doubleRendering == "X"){
                        		var sKey = oController._ListCondJSonModel.getProperty("/Data/Key");
                        			
	                        	this.setSelectedKey(sKey ? sKey : "01");
	                            this.fireSelect();	
                        	} 
                            oController.doubleRendering = "X";
                        }
                    },
                    tabBox
                );
                
                var oMainBox = new sap.m.VBox({
                    items:  [tabBox]
                }).addStyleClass("vbox-form-mobile-etc pt-16px");
                
                return new PageHelper({
                	idPrefix : oController.PAGEID,
                	contentContainerStyleClass: "app-content-container-mobile",
                    contentItems: [oMainBox],
                    headerButton : new sap.m.FlexBox({
                                    items: [ 
                                        new sap.m.Button({ 
                                            text : "{i18n>LABEL_00101}",  // 저장
                                            press : oController.onPressSave,
                                            visible : {
                                            	path : "Key",
                                            	formatter : function(fVal){
                                            		return (fVal == "03" || fVal == "04" || fVal == "05") ? false : true;
                                            	}
                                            }
                                        }).addStyleClass("button-light"),
                                        new sap.m.Button({ 
                                            text : "{i18n>LABEL_00153}",  // 추가
                                            press : function(oEvent){
                                            	oController.onSelectTable();
                                            },
                                            visible : {
                                            	path : "Key",
                                            	formatter : function(fVal){
                                            		return (fVal == "03" || fVal == "04" || fVal == "05") ? true : false;
                                            	}
                                            }
                                        }).addStyleClass("button-light")
                                    ]
                                }).addStyleClass("app-nav-button-right")

                })
                .setModel(oController._ListCondJSonModel)
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
