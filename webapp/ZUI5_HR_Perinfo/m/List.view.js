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
                // var searchBox = new sap.m.FlexBox({
                //     fitContainer: true,
                //     items: [
                //         new sap.m.FlexBox({
                //             items: [
                //                 new sap.m.Button({
                //                     press: oController.moveSearch,
                //                     icon: "sap-icon://search"
                //                 }).addStyleClass("button-search")
                //                 // new sap.m.Link({
                //                 // 	text :"이동하기",
                //                 // 	href : "bizx://?urlType=deeplink&deeplinkType=orgChart"
                //                 // })
                //             ]
                //         }).addStyleClass("button-group pl-0"),
                //         new sap.m.FlexBox({
                //             // 검색
                //             items: [
                //                 new sap.m.Input({
                //                     value: "{Ename}",
                //                     editable: false,
                //                     width: "200px"
                //                 })
                //             ]
                //         }).addStyleClass("search-field-group pl-0")
                //     ],
                //  //   visible: {
                //  //       path: "Auth",
                //  //   	formatter: function(v) {
                //  //   		if(v == "E" ) return false;
                //  //   		else return true;
                //  //   	}
        	       // // }
                // }).addStyleClass("search-box-mobile h-auto");
                
                // var searchBox = new sap.m.Vertical({
                //     fitContainer: true,
                //     height : "130px",
                //     items: [
                //         new sap.m.FlexBox({
                //         	height : "130px",
                //             items: [
                                
                //             ]
                //         }).addStyleClass("button-group pl-0"),
                //         new sap.m.FlexBox({
                //             // 검색
                //             items: [
                           
                //             ]
                //         }).addStyleClass("search-field-group pl-0")
                //     ],
                // }).addStyleClass("search-box-mobile h-auto");
                
                
                var searchBox = new sap.m.HBox({
                    fitContainer: true,
                    height : "130px",
                    items: [
                        new sap.m.HBox({
                        	width : "100%",
                            items: [
                            	new sap.m.VBox({
                            		items : [new sap.m.Text({ text: "김성준" }).addStyleClass("EmployeeLayoutHeader"), 
                            				 new sap.m.Text({ text: "인재육성팀" }).addStyleClass("EmployeeLayoutText"),
                            				 new sap.m.Text({ text: "20001003/S1/팀장" }).addStyleClass("EmployeeLayoutText")
                            		]
                            	})
                            ]
                        }).addStyleClass("EmployeeLayoutPadding"),
                        new sap.m.HBox({
                        	width : "120px",
                            items: [
                               new sap.m.Image({
                               		src : "{photo}",
                               		height : "85px"
                               })
                            ]
                        }).addStyleClass("EmployeeLayoutPic"),
                    ]
                }).addStyleClass("EmployeeLayout");
                
    //             var searchBox = new sap.ui.core.HTML({
				// 	// content : "{html}",
				// 	content : "<div style='height:130px' />",
				// 	preferDOM : false
				// });
                searchBox.setModel(oController._ListCondJSonModel);
                searchBox.bindElement("/Data");
                var tabBox = new sap.m.IconTabBar(oController.PAGEID + "_IconBar", {
                    expandable: false,
                    select: oController.handleTabBarSelect.bind(oController),
                    selectedKey: "Basic",
                    items: [
                        new sap.m.IconTabFilter(oController.PAGEID + "_Basic", {
                            key: "Basic",
                            text: "{i18n>LABEL_37008}", // 기본인적사항
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.Basic", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_Address", {
                            key: "Address",
                            text: "{i18n>LABEL_37009}",
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.AddressList", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_Car", {
                            key: "Car",
                            text: "{i18n>LABEL_37029}", // 차량관리
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.Car", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_School", {
                            key: "School",
                            text: "{i18n>LABEL_02194}", // 학력사항
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.SchoolList", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_License", {
                            key: "License",
                            text: "{i18n>LABEL_02197}", // 자격면허
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.LicenseList", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_Career", {
                            key: "Career",
                            text: "{i18n>LABEL_02195}", // 경력사항
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.CareerList", oController)]
                        }),
                        new sap.m.IconTabFilter(oController.PAGEID + "_Announcement", {
                            key: "Announcement",
                            text: "{i18n>LABEL_18008}", // 발령사항
                            content: [sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.AnnouncementList", oController)]
                        })
                    ]
                }).addStyleClass("tab-group");

                tabBox.addEventDelegate(
                    {
                        onAfterRendering: function () {
                            this.setSelectedKey("Basic");
                            this.fireSelect();
                        }
                    },
                    tabBox
                );

                return new PageHelper({
                	contentContainerStyleClass: "app-content-container-mobile",
                    contentItems: [searchBox, tabBox],
                    // contentHeaderRight : [ new sap.m.Button({
		                  //                  press: oController.moveSearch,
		                  //                  icon: "sap-icon://search",
		                  //                  text : "{i18n>LABEL_00205}"  //사원검색
		                  //              })]
                });
            },

            loadModel: function () {
                // Model 선언
                $.app.setModel("ZHR_PERS_INFO_SRV");
                $.app.setModel("ZHR_PERS_RECORD_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
