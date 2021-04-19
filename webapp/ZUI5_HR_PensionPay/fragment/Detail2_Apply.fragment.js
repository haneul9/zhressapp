sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PensionPay.fragment.Detail2_Apply", {
            createContent: function (oController) {
                // 1. 기본정보
                var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
                    columns: 6,
                    width: "100%",
                    widths: ["", "", "", "", "", ""],
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.FlexBox({
                                            justifyContent: "SpaceBetween",
                                            alignContent: "End",
                                            alignItems: "End",
                                            fitContainer: true,
                                            items: [
                                                new sap.m.FlexBox({
                                                    items: [
                                                        new sap.m.Label({
                                                            text: "{i18n>LABEL_17003}", // 기본정보
                                                            design: "Bold"
                                                        }).addStyleClass("sub-title")
                                                    ]
                                                })
                                            ]
                                        }).addStyleClass("info-box")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 6
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_17010}" })], // 가입기관
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{PeninT}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_17007}" })], // 개인부담금
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{SelfAmtT}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_17008}" })], // 회사지원금
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{SuppAmtT}" })],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        })
                    ]
                });

                // 2. 본인부담금 추가불입(증액/감액) 신청
                var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
                    columns: 4,
                    width: "100%",
                    widths: ["", "", "", ""],
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.FlexBox({
                                            justifyContent: "SpaceBetween",
                                            alignContent: "End",
                                            alignItems: "End",
                                            fitContainer: true,
                                            items: [
                                                new sap.m.FlexBox({
                                                    items: [
                                                        new sap.m.Label({
                                                            text: "{i18n>LABEL_17018}", // 본인부담금 추가불입(증액/감액) 신청
                                                            design: "Bold"
                                                        }).addStyleClass("sub-title")
                                                    ]
                                                })
                                            ]
                                        }).addStyleClass("info-box")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 4
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({ height: "5px" }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_17019}" })], // 신청기간
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{AppBeg} ~ {AppEnd}" })],
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_17020}" })], // 신청구분
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.RadioButtonGroup({
                                            columns: 2,
                                            selectedIndex: "{Etpay}",
                                            editable: {
                                                path: "Closed",
                                                formatter: function (fVal) {
                                                    return fVal == "" ? true : false;
                                                }
                                            },
                                            select: oController.onChangeData,
                                            buttons: [
                                                new sap.m.RadioButton({ text: "{i18n>LABEL_17021}", useEntireWidth: true, width: "150px" }), //
                                                new sap.m.RadioButton({ text: "{i18n>LABEL_17022}", useEntireWidth: true, width: "150px" })
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
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_17023}", required: true })], // 증/감액
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.ui.layout.HorizontalLayout({
                                            content: [
                                                new sap.m.Input({
                                                    value: "{DeamtT}",
                                                    width: "150px",
                                                    editable: {
                                                        path: "Closed",
                                                        formatter: function (fVal) {
                                                            return fVal == "" ? true : false;
                                                        }
                                                    },
                                                    textAlign: "End",
                                                    liveChange: oController.onChangeDeamtT,
                                                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "PensionPayTableIn", "DeamtT")
                                                }),
                                                new sap.ui.core.HTML({ content: "<div style='width:10px' />" }),
                                                new sap.m.Text({ text: "{i18n>LABEL_17024}" }).addStyleClass("pt-10px")
                                            ] // 원
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 3
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({ height: "10px" }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_17025}" })], // 구분
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_17007}" })], // 개인부담금
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_17008}" })], // 회사지원금
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_17009}" })], // 합계
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Label")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_17026}" })], // 변경 전
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{SelfAmtT}" })],
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{SuppAmtT}" })],
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{TotalAmtT}" })],
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{i18n>LABEL_17027}" })], // 변경 후
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{SelfAmtAT}" }).addStyleClass("color-signature-blue")],
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{SuppAmtAT}" })],
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Text({ text: "{TotalAmtAT}" })],
                                    hAlign: "End",
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        })
                    ]
                });

                // 3. 신청 전 메세지, 신청버튼, 안내메세지
                var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
                    columns: 2,
                    width: "100%",
                    widths: ["4px", ""],
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell(),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.ui.commons.layout.MatrixLayout({
                                            columns: 2,
                                            width: "100%",
                                            widths: ["90%", "10%"],
                                            visible: {
                                                path: "Closed",
                                                formatter: function (fVal) {
                                                    return fVal == "" ? true : false;
                                                }
                                            },
                                            rows: [
                                                new sap.ui.commons.layout.MatrixLayoutRow({
                                                    height: "35px",
                                                    cells: [
                                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                                            // 본인은 상기와 같이 기 가입되어 있는 개인연금(연금보험)에 대해 추가불입(증액/감액) 하는 것을 동의합니까?
                                                            content: [new sap.m.Text({ text: "{i18n>MSG_17001}" }).addStyleClass("bold")],
                                                            hAlign: "End",
                                                            vAlign: "Middle"
                                                        }),
                                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                                            content: [
                                                                new sap.m.CheckBox({
                                                                    selected: "{Checkbox}",
                                                                    text: "{i18n>LABEL_17028}" // 동의함
                                                                })
                                                            ],
                                                            hAlign: "End",
                                                            vAlign: "Middle"
                                                        })
                                                    ]
                                                }),
                                                new sap.ui.commons.layout.MatrixLayoutRow({ height: "20px" }),
                                                new sap.ui.commons.layout.MatrixLayoutRow({
                                                    cells: [
                                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                                            // 신청 이후에는 신청내역의 수정 및 취소가 불가하니 신중히 입력바랍니다.
                                                            content: [new sap.m.Text({ text: "{i18n>MSG_17002}" })],
                                                            hAlign: "End",
                                                            vAlign: "Middle"
                                                        }),
                                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                                            content: [
                                                                new sap.m.Button({
                                                                    type: "Default",
                                                                    text: "{i18n>LABEL_17029}", // 신청
                                                                    press: oController.onPressSave
                                                                }).addStyleClass("button-dark")
                                                            ],
                                                            hAlign: "End",
                                                            vAlign: "Middle"
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell(),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.ui.commons.layout.MatrixLayout({
                                            columns: 1,
                                            width: "100%",
                                            visible: {
                                                path: "Closed",
                                                formatter: function (fVal) {
                                                    return fVal == "X" ? true : false;
                                                }
                                            },
                                            rows: [
                                                new sap.ui.commons.layout.MatrixLayoutRow({
                                                    height: "40px",
                                                    cells: [
                                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                                            // 신청기간이 아니거나, 신청 건이 승인 대기 중입니다.
                                                            content: [new sap.m.Text({ text: "{i18n>MSG_17005}" }).addStyleClass("bold-700 color-info-red")],
                                                            hAlign: "Center",
                                                            vAlign: "Middle"
                                                        })
                                                    ]
                                                }),
                                                new sap.ui.commons.layout.MatrixLayoutRow({ height: "40px" })
                                            ]
                                        })
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell(),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.ui.layout.VerticalLayout({
                                            width: "100%",
                                            content: [
                                                new sap.m.Text({ text: "{i18n>MSG_17006}" }), // 전년도 증액인원은 증/감액 미신청 시 전년도 증액금액이 자동 반영됩니다.
                                                new sap.ui.layout.HorizontalLayout({
                                                    content: [
                                                        new sap.m.FormattedText({
                                                            htmlText: "<span>" + "{i18n>MSG_17007}" + "</span>" + "<span class=color-info-red'> " + "{i18n>MSG_17008}" + "</span>"
                                                        })
                                                    ]
                                                }),
                                                new sap.ui.layout.HorizontalLayout({
                                                    content: [
                                                        new sap.m.FormattedText({
                                                            htmlText: "<span>" + "{i18n>MSG_17009}" + "</span>" + "<span class=color-info-red'> " + "{i18n>MSG_17010}" + "</span>"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }).addStyleClass("custom-messagestrip")
                                    ]
                                })
                            ]
                        })
                    ]
                });

                ////////////////////////////////////////////////////////
                var oContent = new sap.ui.layout.VerticalLayout({
                    content: [oMatrix1, oMatrix2, new sap.ui.core.HTML({ content: "<div style='height:40px' />" }), oMatrix3]
                });

                oContent.setModel(oController._ListCondJSonModel);
                oContent.bindElement("/Data");

                return oContent;
            }
        });
    }
);
