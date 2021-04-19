sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Pregnant.fragment.Detail", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns: 6,
                    width: "100%",
                    widths: ["", "", "", "", "", ""],
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_39004}" })], // 신청일
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Text({
                                            text: {
                                                path: "Reqdt",
                                                formatter: function (fVal) {
                                                    if (fVal && fVal != "") {
                                                        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });

                                                        return dateFormat.format(fVal);
                                                    } else {
                                                        return "";
                                                    }
                                                }
                                            }
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_39013}" })], // 진행상태
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{StatusT}" })],
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_39007}", required: true })], // 출산(예정)일
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.DatePicker({
                                            valueFormat: "yyyy-MM-dd",
                                            displayFormat: gDtfmt,
                                            value: "{Preen}",
                                            width: "100%",
                                            textAlign: "Begin",
                                            change: function (oEvent) {
                                                oController.onChangeDate(oEvent, "Preen");
                                            },
                                            editable: {
                                                path: "Status1",
                                                formatter: function (fVal) {
                                                    return fVal == "" || fVal == "AA" ? true : false;
                                                }
                                            }
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_39006}", required: true })], // 임신시작일
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.DatePicker({
                                            valueFormat: "yyyy-MM-dd",
                                            displayFormat: gDtfmt,
                                            value: "{Prebg}",
                                            width: "100%",
                                            textAlign: "Begin",
                                            change: function (oEvent) {
                                                oController.onChangeDate(oEvent, "Prebg");
                                            },
                                            editable: {
                                                parts: [{ path: "Status1" }, { path: "EditFalse" }, { path: "Prebgyn" }, { path: "Eretcode" }],
                                                formatter: function (fVal1, fVal2, fVal3, fVal4) {
                                                    if (fVal1 == "" || fVal1 == "AA") {
                                                        if (fVal4 && fVal4 == "X") {
                                                            return false;
                                                        } else {
                                                            if (fVal3 == "Y") {
                                                                if (fVal2 && fVal2 == "X") {
                                                                    return false;
                                                                } else {
                                                                    return true;
                                                                }
                                                            } else {
                                                                return false;
                                                            }
                                                        }
                                                    } else {
                                                        return false;
                                                    }
                                                }
                                            }
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_39014}", required: true })], // 태아수
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Input({
                                            value: "{Prebn}",
                                            width: "100%",
                                            liveChange: function (oEvent) {
                                                var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");

                                                oEvent.getSource().setValue(value);
                                            },
                                            maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "PregnantApplyTableIn", "Prebn"),
                                            editable: {
                                                parts: [{ path: "Status1" }, { path: "Eretcode" }],
                                                formatter: function (fVal1, fVal2) {
                                                    if (fVal2 && fVal2 == "X") {
                                                        return false;
                                                    } else {
                                                        return fVal1 == "" || fVal1 == "AA" ? true : false;
                                                    }
                                                }
                                            }
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_39008}", required: true })], // 단축근무시간
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.ComboBox(oController.PAGEID + "_Pampm", {
                                            selectedKey: "{Pampm}",
                                            width: "100%",
                                            change: oController.onChangePampm,
                                            editable: {
                                                parts: [{ path: "Status1" }, { path: "EditFalse" }],
                                                formatter: function (fVal1, fVal2) {
                                                    if (fVal1 == "" || fVal1 == "AA") {
                                                        if (fVal2 && fVal2 == "X") {
                                                            return false;
                                                        } else {
                                                            return true;
                                                        }
                                                    } else {
                                                        return false;
                                                    }
                                                }
                                            }
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_39015}" })], // 단축근무기간(12주이내)
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.ui.layout.HorizontalLayout({
                                            content: [
                                                new sap.m.DatePicker({
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: gDtfmt,
                                                    value: "{Begsh}",
                                                    width: "130px",
                                                    textAlign: "Begin",
                                                    change: function (oEvent) {
                                                        oController.onChangeDate(oEvent, "Begsh");
                                                    },
                                                    editable: {
                                                        parts: [{ path: "Status1" }, { path: "Pampm" }, { path: "EditFalse" }, { path: "Begshp" }, { path: "Endshp" }],
                                                        formatter: function (fVal1, fVal2, fVal3, fVal4, fVal5) {
                                                            if (fVal1 == "" || fVal1 == "AA") {
                                                                if (fVal3 && fVal3 == "X") {
                                                                    return false;
                                                                } else {
                                                                    if (!fVal2 || fVal2 == "" || fVal2 == "9") {
                                                                        return false;
                                                                    } else {
                                                                        if (fVal4 && fVal5) {
                                                                            return true;
                                                                        } else {
                                                                            return false;
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                }),
                                                new sap.m.Text({ text: "~" }).addStyleClass("pr-9px pl-9px pt-11px"),
                                                new sap.m.DatePicker({
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: gDtfmt,
                                                    value: "{Endsh}",
                                                    width: "130px",
                                                    textAlign: "Begin",
                                                    change: function (oEvent) {
                                                        oController.onChangeDate(oEvent, "Endsh");
                                                    },
                                                    editable: {
                                                        parts: [{ path: "Status1" }, { path: "Pampm" }, { path: "EditFalse" }, { path: "Begshp" }, { path: "Endshp" }],
                                                        formatter: function (fVal1, fVal2, fVal3, fVal4, fVal5) {
                                                            if (fVal1 == "" || fVal1 == "AA") {
                                                                if (fVal3 && fVal3 == "X") {
                                                                    return false;
                                                                } else {
                                                                    if (!fVal2 || fVal2 == "" || fVal2 == "9") {
                                                                        return false;
                                                                    } else {
                                                                        if (fVal4 && fVal5) {
                                                                            return true;
                                                                        } else {
                                                                            return false;
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                }),
                                                new sap.m.Text({
                                                    text: {
                                                        parts: [{ path: "Begshp" }, { path: "Endshp" }],
                                                        formatter: function (fVal1, fVal2) {
                                                            if (fVal1 && fVal2) {
                                                                return "{i18n>LABEL_39019}" + " " + fVal1 + " ~ " + fVal2;
                                                            } else {
                                                                return "";
                                                            }
                                                        }
                                                    }
                                                }).addStyleClass("pr-9px pl-15px pt-11px")
                                            ]
                                        })
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
                                new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell().addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_39016}" })], // 단축근무기간(36주이후)
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.ui.layout.HorizontalLayout({
                                            content: [
                                                new sap.m.DatePicker({
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: gDtfmt,
                                                    value: "{Begsh2}",
                                                    width: "130px",
                                                    textAlign: "Begin",
                                                    change: function (oEvent) {
                                                        oController.onChangeDate(oEvent, "Begsh2");
                                                    },
                                                    editable: {
                                                        parts: [{ path: "Status1" }, { path: "Pampm" }, { path: "EditFalse" }, { path: "Begsh2p" }, { path: "Endsh2p" }],
                                                        formatter: function (fVal1, fVal2, fVal3, fVal4, fVal5) {
                                                            if (fVal1 == "" || fVal1 == "AA") {
                                                                if (fVal3 && fVal3 == "X") {
                                                                    return false;
                                                                } else {
                                                                    if (!fVal2 || fVal2 == "" || fVal2 == "9") {
                                                                        return false;
                                                                    } else {
                                                                        if (fVal4 && fVal5) {
                                                                            return true;
                                                                        } else {
                                                                            return false;
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                }),
                                                new sap.m.Text({ text: "~" }).addStyleClass("pr-9px pl-9px pt-11px"),
                                                new sap.m.DatePicker({
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: gDtfmt,
                                                    value: "{Endsh2}",
                                                    width: "130px",
                                                    textAlign: "Begin",
                                                    change: function (oEvent) {
                                                        oController.onChangeDate(oEvent, "Endsh2");
                                                    },
                                                    editable: {
                                                        parts: [{ path: "Status1" }, { path: "Pampm" }, { path: "EditFalse" }, { path: "Begsh2p" }, { path: "Endsh2p" }],
                                                        formatter: function (fVal1, fVal2, fVal3, fVal4, fVal5) {
                                                            if (fVal1 == "" || fVal1 == "AA") {
                                                                if (fVal3 && fVal3 == "X") {
                                                                    return false;
                                                                } else {
                                                                    if (!fVal2 || fVal2 == "" || fVal2 == "9") {
                                                                        return false;
                                                                    } else {
                                                                        if (fVal4 && fVal5) {
                                                                            return true;
                                                                        } else {
                                                                            return false;
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                }),
                                                new sap.m.Text({
                                                    text: {
                                                        parts: [{ path: "Begsh2p" }, { path: "Endsh2p" }],
                                                        formatter: function (fVal1, fVal2) {
                                                            if (fVal1 && fVal2) {
                                                                return "{i18n>LABEL_39019}" + " " + fVal1 + " ~ " + fVal2;
                                                            } else {
                                                                return "";
                                                            }
                                                        }
                                                    }
                                                }).addStyleClass("pr-9px pl-15px pt-11px")
                                            ]
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 3
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_39017}" })], // 요청사항
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.TextArea({
                                            value: "{Reque}",
                                            width: "100%",
                                            rows: 2,
                                            growing: false,
                                            maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "PregnantApplyTableIn", "Reque"),
                                            editable: {
                                                path: "Status1",
                                                formatter: function (fVal) {
                                                    return fVal == "" || fVal == "AA" ? true : false;
                                                }
                                            }
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 5
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_FileRow", {
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 6
                                })
                            ]
                        })
                    ]
                });

                var oLayout = new sap.ui.layout.VerticalLayout({
                    width: "100%",
                    content: [
                        new sap.m.Toolbar({
                            height: "40px",
                            content: [
                                new sap.m.ToolbarSpacer(),
                                new sap.m.Button({
                                    text: "{i18n>LABEL_00101}", // 저장
                                    press: function (oEvent) {
                                        oController.onPressSave(oEvent, "S");
                                    },
                                    visible: {
                                        path: "Status1",
                                        formatter: function (fVal) {
                                            return fVal == "" || fVal == "AA" ? true : false;
                                        }
                                    }
                                }).addStyleClass("button-light"),
                                new sap.m.Button({
                                    text: "{i18n>LABEL_39018}", // 신청
                                    press: function (oEvent) {
                                        oController.onPressSave(oEvent, "C");
                                    },
                                    visible: {
                                        path: "Status1",
                                        formatter: function (fVal) {
                                            return fVal == "" || fVal == "AA" ? true : false;
                                        }
                                    }
                                }).addStyleClass("button-light"),
                                new sap.m.Button({
                                    text: "{i18n>LABEL_00103}", // 삭제
                                    press: function (oEvent) {
                                        oController.onPressSave(oEvent, "D");
                                    },
                                    visible: {
                                        path: "Status1",
                                        formatter: function (fVal) {
                                            return fVal == "AA" ? true : false;
                                        }
                                    }
                                }).addStyleClass("button-light")
                            ],
                            visible: {
                                path: "Status1",
                                formatter: function (fVal) {
                                    return fVal == "" || fVal == "AA" ? true : false;
                                }
                            }
                        }).addStyleClass("toolbarNoBottomLine"),
                        new sap.ui.core.HTML({ content: "<div style='height:5px' />" }),
                        oMatrix
                    ]
                });

                oLayout.setModel(oController._ListCondJSonModel);
                oLayout.bindElement("/Data");

                return oLayout;
            }
        });
    }
);
