sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail06", {
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
	                                             				new sap.m.Text({text : "{i18n>LABEL_76007}"}).addStyleClass("sub-title") // 병역사항
	                                             			]
	                                             		}),
                                        				new sap.m.HBox({
                                        				 	justifyContent: "End",
                                        					items : [
                                            				 	new sap.m.Button({
									                                text: "{i18n>LABEL_00101}", // 저장
									                                press: function (oEvent) {
									                                    oController.onPressSave("S6");
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
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76041}"})], // 복무기간
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                                new sap.m.DatePicker({
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: "yyyy-MM-dd",
                                                    value: "{Begda}",
                                                    width: "50%",
                                                    textAlign: "Begin",
                                                    change: oController.onChangeDate
                                                }),
                                                new sap.m.DatePicker({
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: "yyyy-MM-dd",
                                                    value: "{Endda}",
                                                    width: "50%",
                                                    textAlign: "Begin",
                                                    change: oController.onChangeDate
                                                }).addStyleClass("pl-5px")
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76042}"})], // 계급
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                                new sap.m.ComboBox(oController.PAGEID + "_Mrank", {
                                                    width : "100%",
                                                    selectedKey : "{Mrank}"
                                                })
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76043}"})], // 병역유형
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                                new sap.m.ComboBox(oController.PAGEID + "_Serty", {
                                                    width : "100%",
                                                    selectedKey : "{Serty}"
                                                })
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76044}"})], // 보직분류
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                            	new sap.m.ComboBox(oController.PAGEID + "_Jobcl", {
                                                    width : "100%",
                                                    selectedKey : "{Jobcl}"
                                                })
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76045}"})], // 전역사유
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                               new sap.m.ComboBox(oController.PAGEID + "_Earrt", {
                                                   width : "100%",
                                                   selectedKey : "{Earrt}"
                                               })
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76046}"})], // 역종
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                                new sap.m.ComboBox(oController.PAGEID + "_Zzarmy", {
                                                    width : "100%",
                                                    selectedKey : "{Zzarmy}"
                                                })
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76047}"})], // 근무부대
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                             	new sap.m.Input({
                                                    width : "100%",
                                                    value : "{Serut}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoArmy", "Serut")
                                                })
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76048}"})], // 면제사유
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                            	new sap.m.Input({
                                                    width : "100%",
                                                    value : "{Rsexp}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoArmy", "Rsexp")
                                                })
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76049}"})], // 군번
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                             	new sap.m.Input({
                                                    width : "100%",
                                                    value : "{Idnum}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoArmy", "Idnum")
                                                })
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76050}"})], // ROTC
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                            	new sap.m.CheckBox({
                                                    selected : "{Zrotc}"
                                                })
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
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
