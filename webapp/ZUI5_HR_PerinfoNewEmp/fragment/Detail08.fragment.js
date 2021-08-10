sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail08", {
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
	                                             				new sap.m.Text({text : "{i18n>LABEL_76009}"}).addStyleClass("sub-title") // 장애사항
	                                             			]
	                                             		}),
                                        				new sap.m.HBox({
                                        				 	justifyContent: "End",
                                        					items : [
                                            				 	new sap.m.Button({
									                                text: "{i18n>LABEL_00101}", // 저장
									                                press: function (oEvent) {
									                                    oController.onPressSave("S8");
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
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76056}"})], // 장애유형
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                                new sap.m.ComboBox(oController.PAGEID + "_Chaty", {
                                                    width : "100%",
                                                    selectedKey : "{Chaty}"
                                                })
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76057}"})], // 발급일
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                            	new sap.m.DatePicker({
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: gDtfmt,
                                                    value: "{Idate}",
                                                    width: "50%",
                                                    textAlign: "Begin",
                                                    change: oController.onChangeDate
                                                })
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76058}"})], // 장애등급
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label border-bottom-0"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                               new sap.m.ComboBox(oController.PAGEID + "_Discc", {
                                                   width : "100%",
                                                   selectedKey : "{Discc}"
                                               })
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data border-bottom-0"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76059}"})], // 장애인등록번호
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label border-bottom-0"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                             	new sap.m.Input({
                                                    width : "100%",
                                                    value : "{Chaid}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoDisable", "Chaid")
                                                })
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
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
						                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "009")
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
