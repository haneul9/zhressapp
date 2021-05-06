sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Handicap", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                // 채용유형
                var oRecmd = new sap.m.ComboBox({
                    selectedKey: "{Recmd}",
                    editable: {
                        path: "disyn",
                        formatter: function (v) {
                            if (v === "1") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Recmd",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });
                // 국가유공 유형
                var oConty = new sap.m.ComboBox({
                    selectedKey: "{Conty}",
                    editable: {
                        path: "disyn",
                        formatter: function (v) {
                            if (v === "1") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Conty",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });
                // 관계
                var oRelat = new sap.m.ComboBox({
                    selectedKey: "{Relat}",
                    editable: {
                        path: "disyn",
                        formatter: function (v) {
                            if (v === "1") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Relat",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });
                // 보훈청
                var oZzorg = new sap.m.ComboBox({
                    selectedKey: "{Zzorg}",
                    editable: {
                        path: "disyn",
                        formatter: function (v) {
                            if (v === "1") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Zzorg",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });
                // 장애유형
                var oChaty = new sap.m.ComboBox({
                    selectedKey: "{Chaty}",
                    editable: {
                        path: "disyn",
                        formatter: function (v) {
                            if (v === "1") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Chaty",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });

                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns: 4,
                    widths: ["200px", "", "200px", ""],
                    width: "100%",
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Text({ text: "{i18n>LABEL_37086}" }).addStyleClass("sub-title"), // 보훈 및 장애
                                                new sap.m.ToolbarSpacer(),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_37042}", // 신규
                                                    visible: {
                                                        parts: [{ path: "Auth" }, { path: "disyn" }, { path: "actMode" }, { path: "Openf" }],
                                                        formatter: function (v1, v2, v3, v4) {
                                                            if (v1 == "E" && v2 === "2" && v3 === "3" && v4 === "Y") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: function () {
                                                        oController._HandicapJSonModel.setProperty("/Data/disyn", "1");
                                                    }
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_00102}", // 수정
                                                    visible: {
                                                        parts: [{ path: "Auth" }, { path: "disyn" }, { path: "actMode" }, { path: "Openf" }],
                                                        formatter: function (v1, v2, v3, v4) {
                                                            if (v1 == "E" && v2 === "2" && v3 === "2" && v4 === "Y") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: function () {
                                                        oController._HandicapJSonModel.setProperty("/Data/disyn", "1");
                                                    }
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_08003}", // 삭제
                                                    visible: {
                                                        parts: [{ path: "Auth" }, { path: "disyn" }, { path: "actMode" }, { path: "Openf" }],
                                                        formatter: function (v1, v2, v3, v4) {
                                                            if (v1 == "E" && v2 === "2" && v3 === "2" && v4 === "Y") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: function () {
                                                        oController.onSaveHandicap("D");
                                                    }
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_02152}", // 저장
                                                    visible: {
                                                        parts: [{ path: "Auth" }, { path: "disyn" }, { path: "Openf" }],
                                                        formatter: function (v1, v2, v3) {
                                                            if (v1 == "E" && v2 === "1" && v3 === "Y") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: function () {
                                                        oController.onSaveHandicap("A");
                                                    }
                                                }).addStyleClass("button-light"),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_08004}", // 취소
                                                    visible: {
                                                        parts: [{ path: "Auth" }, { path: "disyn" }, { path: "Openf" }],
                                                        formatter: function (v1, v2, v3) {
                                                            if (v1 == "E" && v2 === "1" && v3 === "Y") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: function () {
                                                        oController.onPressSearchHandicap(oController.getView().getModel("session").getData().Pernr);
                                                    }
                                                }).addStyleClass("button-light")
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine h-40px"),
                                        new sap.ui.core.HTML({ content: "<div style='height:5px' />" })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 4
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37087}" })], // 채용방법
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oRecmd]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 3
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37088}" })], // 국가유공 유형
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oConty]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37089}" })], // 국가유공 관계
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oRelat]
                                        }).addStyleClass("toolbarNoBottomLine")
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
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37090}" })], // 국가유공자 증빙코드
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Conid}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordHandicapTableIn", "Conid"),
                                                    width: "250px",
                                                    editable: {
                                                        path: "disyn",
                                                        formatter: function (v) {
                                                            if (v === "1") return true;
                                                            else return false;
                                                        }
                                                    }
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37098}" })], // 관련 보훈청
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oZzorg]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px"
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37092}" })], // 장애유형
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oChaty]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37093}" })], // 발행일
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.DatePicker({
                                                    value: "{Idate}",
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: gDtfmt,
                                                    width: "150px",
                                                    editable: {
                                                        path: "disyn",
                                                        formatter: function (v) {
                                                            if (v === "1") return true;
                                                            else return false;
                                                        }
                                                    }
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
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
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37094}" })], // 장애등급
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Chagr}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordHandicapTableIn", "Chagr"),
                                                    width: "250px",
                                                    editable: {
                                                        path: "disyn",
                                                        formatter: function (v) {
                                                            if (v === "1") return true;
                                                            else return false;
                                                        }
                                                    }
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_37095}" })], // 장애인 등록번호
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Chaid}",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordHandicapTableIn", "Chaid"),
                                                    width: "250px",
                                                    editable: {
                                                        path: "disyn",
                                                        formatter: function (v) {
                                                            if (v === "1") return true;
                                                            else return false;
                                                        }
                                                    }
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        })
                    ]
                });

                oMatrix.setModel(oController._HandicapJSonModel);
                oMatrix.bindElement("/Data");

                return oMatrix;
            }
        });
    }
);
