sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.Address", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns: 2,
                    widths: ["200px", ""],
                    width: "100%",
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37022}" })], // 주소유형
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.ComboBox(oController.PAGEID + "_Adress-Anssa", {
                                        	width : "50%",
                                        	selectedKey : "{Anssa}",
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02165}" })], // 국가
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.ComboBox(oController.PAGEID + "_Address-Land1", {
						                   selectedKey: "{Land1}",
						                   width : "50%",
						                   change : oController.onChangeLand1,
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02132}", required: true })], // 우편번호
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                       new sap.m.HBox({
                                       	   width : "100%",
                                       	   items : [
                                       			new sap.m.Input({
		                                            value: "{Pstlz}",
		                                            width: "100%",
		                                            maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Pstlz"),
                                        		    editable : "{Editable}"
		                                         }).addStyleClass("pr-10px"),
		                                         new sap.m.Button({
		                                             text: "{i18n>LABEL_00104}", // 검색
		                                            // visible: {
		                                            //     path: "actMode",
		                                            //     formatter: function (v) {
		                                            //         if (v === "2" || v === "3") return true;
		                                            //         else return false;
		                                            //     }
		                                            // },
		                                             press: oController.onDisplaySearchZipcodeDialog,
		                                             visible : "{Editable}"
		                                         }).addStyleClass("button-search mt-3px")
                                       	   ]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_76088}", required: true })], // 구역
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.ComboBox(oController.PAGEID + "_Address-State", {
						                    selectedKey: "{State}",
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37097}", required: true })], // 시/구/군
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Input({
                                            value: "{Ort1k}",
                                            maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Ort1k"),
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37028}", required: true })], // 동/읍/명
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Input({
                                            value: "{Ort2k}",
                                            maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Ort2k"),
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02175}", required: true })], // 상세주소
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Input({
                                            value: "{Stras}",
                                            maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Stras"),
                                			editable : "{Editable}"
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_PhonRow", {
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_00165}", required: true })], // 전화번호
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Input({
                                            value: "{Telnr}",
                                            width: "100%",
                                            maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "NewEmpinfoAddr", "Telnr"),
                                			editable : "{Editable}"
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        })
                    ]
                }).addStyleClass("px-5px");

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1000px",
                    contentHeight: "",
                    draggable: false,
                    horizontalScrolling: false,
                    content: [oMatrix],
                    title: "{i18n>LABEL_76004}", // 주소정보
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            press : function(oEvent){
                            	oController.onPressSave("S3");
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
