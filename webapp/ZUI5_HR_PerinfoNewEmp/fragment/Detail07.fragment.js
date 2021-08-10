sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail07", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns : 4,
                    width : "100%",
                    widths : ["313px", "", "313px", ""],
                    rows : [new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                             	new sap.m.HBox({
                                             		justifyContent : "SpaceBetween",
                                             		width : "100%",
                                            		items : [
                                            			new sap.m.HBox({
                                        					justifyContent: "Start",
	                                             			items : [
	                                             				new sap.m.Text({text : "{i18n>LABEL_76008}"}).addStyleClass("sub-title") // 보훈사항
	                                             			]
	                                             		}),
                                        				new sap.m.HBox({
                                        				 	justifyContent: "End",
                                        					items : [
                                            				 	new sap.m.Button({
									                                text: "{i18n>LABEL_00101}", // 저장
									                                press: function (oEvent) {
									                                    oController.onPressSave("S7");
									                                }
									                            }).addStyleClass("button-light")
							                               ]
                                        				}).addStyleClass("button-group")
                                            		]
                                             	})
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle",
                                             colSpan : 4
                                         })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76051}"})], // 채용방법
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                                new sap.m.ComboBox(oController.PAGEID + "_Recmd", {
                                                    width : "100%",
                                                    selectedKey : "{Recmd}"
                                                })
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76052}"})], // 유형
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                                new sap.m.ComboBox(oController.PAGEID + "_Conty", {
                                                    width : "100%",
                                                    selectedKey : "{Conty}"
                                                })
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76053}"})], // 관계
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                                new sap.m.ComboBox(oController.PAGEID + "_Relat", {
                                                    width : "100%",
                                                    selectedKey : "{Relat}"
                                                })
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76054}"})], // 국가유공증빙코드
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                            	new sap.m.Input({
                                                    width : "100%",
                                                    value : "{Conid}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoVeteran", "Conid")
                                                })
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76055}"})], // 관할보훈청
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label border-bottom-0"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                                new sap.m.ComboBox(oController.PAGEID + "_Zzorg", {
                                                    width : "100%",
                                                    selectedKey : "{Zzorg}"
                                                })
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data border-bottom-0"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [],
                                            hAlign : "End",
                                            vAlign : "Middle",
                                            colSpan : 2
                                        }).addStyleClass("Data border-bottom-0")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
		                                	 content : [
		                                	 	new sap.m.VBox({
		                                	 		height : "45px",
						                            fitContainer: true,
						                            items: [
						                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "008")
						                            ]
						                        }).addStyleClass("custom-multiAttach-file")
		                                	 ],
		                                	 hAlign : "Begin",
		                                	 vAlign : "Middle",
		                                	 colSpan : 4
		                                 })]
                            })]
                });
                
                return new sap.m.VBox({
                	width : "100%",
                	items : [oMatrix]
                });
            }
        });
    }
);
