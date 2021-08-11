sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Detail01", {
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
	                                             				new sap.m.Text({text : "{i18n>LABEL_76002}"}).addStyleClass("sub-title") // 인적사항
	                                             			]
	                                             		}),
                                        				new sap.m.HBox({
                                        				 	justifyContent: "End",
                                        					items : [
                                            				 	new sap.m.Button({
									                                text: "{i18n>LABEL_00101}", // 저장
									                                press: function (oEvent) {
									                                    oController.onPressSave("S1");
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
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76010}"})], // 한글성명(성/이름)
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                                new sap.m.Input({
                                                    width : "50%",
                                                    value : "{Lnmhg}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Lnmhg")
                                                }),
                                                new sap.m.Input({
                                                    width : "50%",
                                                    value : "{Fnmhg}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Fnmhg")
                                                }).addStyleClass("pl-5px")
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76011}"})], // 한자성명(성/이름)
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                                new sap.m.Input({
                                                    width : "50%",
                                                    value : "{Lnmch}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Lnmch")
                                                }),
                                                new sap.m.Input({
                                                    width : "50%",
                                                    value : "{Fnmch}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Fnmch")
                                                }).addStyleClass("pl-5px")
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76012}"})], // 영문성명(Last/First)
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                                new sap.m.Input({
                                                    width : "50%",
                                                    value : "{Nachn}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Fnmch")
                                                }),
                                                new sap.m.Input({
                                                    width : "50%",
                                                    value : "{Vorna}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoBasic", "Vorna")
                                                }).addStyleClass("pl-5px")
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76013}"})], // 성별
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.ComboBox(oController.PAGEID + "_Gesch", {
                                                          width : "50%",
                                                          selectedKey : "{Gesch}"
                                                      })],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76014}"})], // 주민등록번호
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [
                                                new sap.m.Input({
                                                    width : "50%",
                                                    value : "{Regno1}",
                                                    maxLength : 6
                                                }),
                                                new sap.m.Input({
                                                    width : "50%",
                                                    value : "{Regno2}",
                                                    type : "Password",
                                                    liveChange : function(oEvent){
                                                    	var value = oEvent.getSource().getValue();
                                                    	
                                                    	oEvent.getSource().setValue(value.replace(/[^0-9\.]/g, ""));
                                                    },
                                                    maxLength : 7
                                                }).addStyleClass("pl-5px")
                                             ],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76015}"})], // 실제생일
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [
                                                new sap.m.DatePicker({
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: gDtfmt,
                                                    value: "{Zzbdate}",
                                                    width: "50%",
                                                    textAlign: "Begin",
                                                    change: oController.onChangeDate
                                                }),
                                                new sap.m.ComboBox(oController.PAGEID + "_Zzclass", {
                                                    width: "50%",
                                                    selectedKey : "{Zzclass}"
                                                }).addStyleClass("pl-5px")
                                            ],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76016}"})], // 결혼여부
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.ComboBox(oController.PAGEID + "_Famst", {
                                                            width : "50%",
                                                            selectedKey : "{Famst}",
                                                            change : function(oEvent){
                                                            	oController._ListCondJSonModel.setProperty("/Data/Famdt", "");
                                                            }
                                                        })],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{i18n>LABEL_76017}"})], // 결혼기념일
                                            hAlign : "End",
                                            vAlign : "Middle"
                                        }).addStyleClass("Label"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.DatePicker({
                                                           valueFormat: "yyyy-MM-dd",
                                                           displayFormat: gDtfmt,
                                                           value: "{Famdt}",
                                                           width: "50%",
                                                           textAlign: "Begin",
                                                           editable : {
                                                           		path : "Famst",
                                                           		formatter : function(fVal){
                                                           			return fVal && fVal == "1" ? true : false;
                                                           		}
                                                           },
                                                           change: oController.onChangeDate
                                                        })],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_76092}"})], // 국적
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.ComboBox(oController.PAGEID + "_Natio", {
                                                            width : "50%",
                                                            selectedKey : "{Natio}"
                                                        })],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [],
                                            hAlign : "Begin",
                                            vAlign : "Middle",
                                            colSpan : 2
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
