sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Basic", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oZzbdate, oGbort, oFamst, oFamdt;

                oZzbdate = new sap.m.DatePicker({
                    width: "120px",
                    valueFormat: "yyyy-MM-dd",
                    displayFormat: gDtfmt,
                    value: "{Zzbdate}",
                    editable: {
                        path: "disyn",
                        formatter: function (v) {
                            if (v === "1") return true;
                            else return false;
                        }
                    }
                });
                oGbort = new sap.m.Input({
                    width: "100%",
                    value: "{Gbort}",
                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoBasicTab", "Gbort"),
                    editable: {
                        path: "disyn",
                        formatter: function (v) {
                            if (v === "1") return true;
                            else return false;
                        }
                    }
                });
                oFamst = new sap.m.ComboBox({
                    selectedKey: "{Famst}",
                    width: "50%",
                    editable: {
                        path: "disyn",
                        formatter: function (v) {
                            if (v === "1") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Famst",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });
                oFamdt = new sap.m.DatePicker({
                    width: "50%",
                    valueFormat: "yyyy-MM-dd",
                    displayFormat: gDtfmt,
                    value: "{Famdt}",
                    editable: {
                        path: "disyn",
                        formatter: function (v) {
                            if (v === "1") return true;
                            else return false;
                        }
                    }
                });

                var oRadioButton = new sap.ui.layout.HorizontalLayout({
                    content: [
                        oZzbdate,
                        new sap.m.RadioButtonGroup({
                            width: "100%",
                            editable: {
                                path: "disyn",
                                formatter: function (v) {
                                    if (v === "1") return true;
                                    else return false;
                                }
                            },
                            columns: 2,
                            selectedIndex: "{Zzclass}",
                            buttons: [
                                new sap.m.RadioButton({
                                    text: "{i18n>LABEL_02173}", // 양력
                                    width: "auto"
                                }),
                                new sap.m.RadioButton({
                                    text: "{i18n>LABEL_02304}", // 음력
                                    width: "auto"
                                })
                            ]
                        }).addStyleClass("mr-10px")
                    ]
                });

                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns: 5,
                    widths: ["", "", "30%", "", "30%"],
                    width: "100%",
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            content: [
                                                new sap.m.Text({ text: "{i18n>LABEL_37008}" }).addStyleClass("Font15 FontBold"), // 기본인적사항
                                                new sap.m.ToolbarSpacer(),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_37107}", // 사진저장
                                                    visible: {
                                                        parts: [{ path: "Auth" }, { path: "disyn" }],
                                                        formatter: function (v1, v2) {
                                                            if (v1 == "E" && v2 === "2") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: oController.changePicture
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_00102}", // 수정
                                                    visible: {
                                                        parts: [{ path: "Auth" }, { path: "disyn" }],
                                                        formatter: function (v1, v2) {
                                                            if (v1 == "E" && v2 === "2") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: function () {
                                                        oController._BasicJSonModel.setProperty("/Data/disyn", "1");
                                                    }
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_02152}", // 저장
                                                    visible: {
                                                        parts: [{ path: "Auth" }, { path: "disyn" }],
                                                        formatter: function (v1, v2) {
                                                            if (v1 == "E" && v2 === "1") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: oController.onSaveBasic
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_00119}", // 취소
                                                    visible: {
                                                        parts: [{ path: "Auth" }, { path: "disyn" }],
                                                        formatter: function (v1, v2) {
                                                            if (v1 == "E" && v2 === "1") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: function () {
                                                        oController.onPressSearchBasic(oController.getView().getModel("session").getData().Pernr);
                                                    }
                                                }).addStyleClass("button-light")
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine h-40px"),
                                        new sap.ui.core.HTML({ content: "<div style='height:5px' />" })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 5
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37010}" })], // 성명
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    rowSpan: 2
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37011}" })], // 한글
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{Ename1}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37013}" })], // 한자
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{Ename2}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37012}" })], // 영문
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{Ename3}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37014}" })], // 주민등록번호
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    colSpan: 2
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{Regno}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Label({
                                            text: "{i18n>LABEL_37015}",
                                            required: {
                                                path: "disyn",
                                                formatter: function (v1) {
                                                    if (v1 === "1") return true;
                                                    else return false;
                                                }
                                            }
                                        })
                                    ], // 실제생일
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [oRadioButton],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37016}" })], // 성별
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    colSpan: 2
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{GeschTx}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    //content : [oKonfe],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37018}" })], // 국적
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    colSpan: 2
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{Landx50}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37019}" })], // 출생지
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [oGbort],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37020}" })], // 결혼여부
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    colSpan: 2
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [oFamst],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37021}" })], // 결혼일
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [oFamdt],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_04304}" })], // 사번
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    colSpan: 2
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{Pernr}" })], // 사번
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37007}" })], // 부서명
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{Orgtx}" })], // 부서명
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_22004}" })], // 입사일
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    colSpan: 2
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{Dat01}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_22005}" })], // 그룹입사일
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{Dat02}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37005}" })], // Grade
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    colSpan: 2
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{PgradeT}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37006}" })], // 직책
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{ZpostT}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        })
                    ]
                });

                oMatrix.setModel(oController._BasicJSonModel);
                oMatrix.bindElement("/Data");
                return oMatrix;
            }
        });
    }
);
