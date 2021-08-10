sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Career", {
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76072}" })], // 입사일/퇴사일
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
                                       new sap.m.ComboBox(oController.PAGEID + "_Career-Land1", {
                                       	   width : "100%",
						                   selectedKey: "{Land1}",
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76073}" })], // 회사명
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.Input({
                                           value: "{Arbgb}",
                                           maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoCareer", "Arbgb"),
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76074}" })], // 근무지
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.Input({
                                           value: "{Ort01}",
                                           maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoCareer", "Ort01"),
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76075}" })], // 직위
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.Input({
                                           value: "{Zztitle}",
                                           maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoCareer", "Zztitle"),
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76076}" })], // 담당업무
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label border-bottom-0"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.Input({
                                           value: "{Zzjob}",
                                           maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoCareer", "Zzjob"),
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
				                            	fragment.COMMON_ATTACH_FILES.renderer(oController, "006")
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
                }).addStyleClass("px-5px");

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1000px",
                    contentHeight: "",
                    draggable: false,
                    horizontalScrolling: false,
                    content: [oMatrix],
                    title: "{i18n>LABEL_76006}", // 경력사항
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            press : function(oEvent){
                            	oController.onPressSave("S5");
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
