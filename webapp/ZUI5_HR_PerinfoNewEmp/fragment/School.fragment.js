sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.School", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns: 2,
                    widths: ["313px", ""],
                    width: "100%",
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76060}" })], // 학교구분
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.ComboBox(oController.PAGEID + "_School-Slart", {
                                        	width : "50%",
						                    selectedKey: "{Slart}",
						                    change : oController.onChangeSlart,
						                    editable : "{Editable}"
						                })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76061}" })], // 입학일/졸업일
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.DatePicker({
                                            valueFormat: "yyyy-MM-dd",
                                            displayFormat: gDtfmt,
                                            value: "{Begda}",
                                            width: "50%",
                                            textAlign: "Begin",
                                            change: oController.onChangeDate,
						                    editable : "{Editable}"
                                        }),
                                        new sap.m.DatePicker({
                                            valueFormat: "yyyy-MM-dd",
                                            displayFormat: gDtfmt,
                                            value: "{Endda}",
                                            width: "50%",
                                            textAlign: "Begin",
                                            change: oController.onChangeDate,
						                    editable : "{Editable}"
                                        }).addStyleClass("pl-5px")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76062}" })], // 국가
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.ComboBox(oController.PAGEID + "_School-Sland", {
						                   selectedKey: "{Sland}",
						                   width : "50%",
						                   editable : "{Editable}"
						               })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76063}" })], // 교육기관구분
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
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
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76064}" })], // 학교
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
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
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76065}" })], // 전공
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
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
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76066}" })], // 학위
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.ComboBox(oController.PAGEID + "_School-Slabs", {
						                   selectedKey: "{Slabs}",
						                   width : "50%",
						                   editable : "{Editable}"
						               })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76067}" })], // 최종학력
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label border-bottom-0"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.CheckBox({
	                                       selected: "{Zzlmark}",
						                   editable : "{Editable}"
	                                   })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data border-bottom-0")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            // height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                    	new sap.m.VBox({
				                            fitContainer: true,
				                            items: [
				                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "007")
				                            ]
				                        }).addStyleClass("custom-multiAttach-file")
                                    ],
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    colSpan : 2
                                })
                            ]
                        }).addStyleClass("sapUiSizeCompact")
                    ]
                });

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1000px",
                    contentHeight: "",
                    draggable: false,
                    horizontalScrolling: false,
                    content: [oMatrix],
                    title: "{i18n>LABEL_76005}", // 학력사항
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            press : function(oEvent){
                            	oController.onPressSave("S4");
                            },
                            visible : "{Editable}"
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            type: "Default",
                            text: "{i18n>LABEL_06122}", // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-default custom-button-divide")
                    ]
                }).addStyleClass("custom-dialog-popup");

                oDialog.setModel(new sap.ui.model.json.JSONModel());
                oDialog.bindElement("/Data");

                return oDialog;
            }
        });
    }
);
