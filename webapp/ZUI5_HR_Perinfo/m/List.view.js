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
                var searchBox = new sap.m.HBox({
                    fitContainer: true,
                    height : "auto",
                    items: [
                        new sap.m.HBox({
                        	width : "120px", 
                            items: [
                               new sap.m.Image({
                               		src : "{photo}",
                               		height : "85px"
                               })
                            ]
                        }).addStyleClass("EmployeeLayoutPic"),
                        new sap.m.HBox({
                        	width : "100%",
                            items: [
                            	new sap.m.VBox({
                            		items : [new sap.m.Text({ text: "{Ename}" }).addStyleClass("EmployeeLayoutHeader"), 
                            				 new sap.m.Text({ 
                            				 	layoutData : new sap.m.FlexItemData({ lineHeight: "16px" }),
                            				 	text: "{Stext}" 
                            				 }).addStyleClass("EmployeeLayoutText"),
                            				 new sap.m.Text({ 
                            				 	text : {
                                                    parts: [{ path: "Pernr" },{ path: "PGradeTxt" },{ path: "ZtitleT" } ],
                                                    formatter: function (v1, v2, v3) {
                                                        if (v3 != "") return v1+ " / " + v2 + " / " + v3;
                                                        else return  v1+ " / " + v2 ;
                                                    }
                                                 }
                            				 }).addStyleClass("EmployeeLayoutText")
                            		]
                            	})
                            ]
                        }).addStyleClass("EmployeeLayoutPadding")
                    ]
                }).addStyleClass("EmployeeLayout");
                searchBox.setModel(oController._ListCondJSonModel);
                searchBox.bindElement("/Data");
                var tabBox = new sap.m.IconTabBar(oController.PAGEID + "_IconBar", {
                    expandable: false,
                    select: oController.handleTabBarSelect.bind(oController),
                    selectedKey: "Basic",
                    items: [
                        new sap.m.IconTabFilter(oController.PAGEID + "_Basic", {
                            key: "Basic",
                            text: "{i18n>LABEL_37008}", // ??????????????????
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.Basic", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_Address", {
                            key: "Address",
                            text: "{i18n>LABEL_37009}",
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.AddressList", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_Car", {
                            key: "Car",
                            text: "{i18n>LABEL_37029}", // ????????????
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.Car", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_School", {
                            key: "School",
                            text: "{i18n>LABEL_02194}", // ????????????
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.SchoolList", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_License", {
                            key: "License",
                            text: "{i18n>LABEL_02197}", // ????????????
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.LicenseList", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_Career", {
                            key: "Career",
                            text: "{i18n>LABEL_02195}", // ????????????
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.CareerList", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_Announcement", {
                            key: "Announcement",
                            text: "{i18n>LABEL_18008}", // ????????????
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.AnnouncementList", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_Eval", {
                            key: "Eval",
                            text: "{i18n>LABEL_37115}", // ????????????
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.Eval", oController)],
                            visible: {
                                path : "Chief",
                                formatter : function(v){
                                  return v === "X" ? true : false; 
                                }
                            } 
                        })
                    ]
                }).addStyleClass("tab-group");
				
                tabBox.addEventDelegate(
                    {
                        onAfterRendering: function () {
                        	if(oController.doubleRendering == "X"){
	                        	this.setSelectedKey("Basic");
	                            this.fireSelect();	
                        	}
                            oController.doubleRendering = "X";
                        }
                    },
                    tabBox
                );
                
                var oMainBox = new sap.m.VBox({
                    items:  [searchBox, tabBox]
                })
                .addStyleClass("vbox-form-mobile-etc pt-16px");
                
                return new PageHelper({
                	contentContainerStyleClass: "app-content-container-mobile",
                    contentItems: [oMainBox],
                    headerButton : new sap.m.FlexBox({
                                    items: [ 
                                        new sap.m.Button({ 
                                            press: oController.moveSearch,
                                            text : "{i18n>LABEL_00205}",  //????????????
                                            visible: {
                                                path : "Chief",
                                                formatter : function(v){
                                                  return v === "X" ? true : false; 
                                                }
                                            } 
                                        }).addStyleClass("button-light")
                                    ]
                                }).addStyleClass("app-nav-button-right")

                })
                .setModel(oController._ListCondJSonModel)
                .bindElement("/Data");
            },

            loadModel: function () {
                // Model ??????
                $.app.setModel("ZHR_PERS_INFO_SRV");
                $.app.setModel("ZHR_PERS_RECORD_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_APPRAISAL_SRV");
            }
        });
    }
);
