sap.ui.define(
    [
        "common/Common",
        "common/HoverIcon",
        "common/PickOnlyDatePicker",
        "common/EmpBasicInfoBoxCustomHass",
        "sap/ui/commons/layout/MatrixLayout",
        "sap/ui/commons/layout/MatrixLayoutRow",
        "sap/ui/commons/layout/MatrixLayoutCell"
    ],
    function (Common, HoverIcon, PickOnlyDatePicker, EmpBasicInfoBoxCustomHass, MatrixLayout, MatrixLayoutRow, MatrixLayoutCell) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.popup", {
            createContent: function (oController) {

                var oDialog = new sap.m.Dialog(oController.PAGEID + "_Dialog", {
                    title: "{i18n>LABEL_47001}",  // 의료비 신청
                    contentWidth: "1700px",
                    beforeOpen: oController.onAfterOpen,
                    afterOpen: oController.onAfterLoad,
                    content: [
                        new sap.m.FlexBox({
                            justifyContent: "Center",
                            fitContainer: true,
                            items: [
                                new sap.ui.commons.layout.VerticalLayout({
                                    content: [
                                        this.buildPanelFirst(oController),  // sap.m.Panel
                                        this.buildPanelSecond(oController)  // sap.m.Panel
                                    ]
                                })
                            ]
                        }).addStyleClass("paddingbody")
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_47101}", // 저장
                            press: oController.onDialogBaseSaveBtn.bind(oController, "2"),
                            busyIndicatorDelay: 0,
                            busy: "{= !${/IsFileLoaded}}",
                            visible: {
                                parts: [{ path: "Close" }, { path: "Status" }],
                                formatter: function (fVal, fVal2) {
                                    return ((fVal2 === "AA" || fVal2 === "88") && fVal !== "X") ? true : false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_47101}", // 저장
                            press: oController.onDialogBaseSaveBtn.bind(oController, "6"),
                            busyIndicatorDelay: 0,
                            busy: "{= !${/IsFileLoaded}}",
                            visible: {
                                parts: [{ path: "Close" }, { path: "Status" }],
                                formatter: function (fVal, fVal2) {
                                    return (fVal2 === "ZZ" && fVal !== "X") ? true : false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_47151}", // 추가
                            press: oController.onDialogBaseSaveBtn.bind(oController, "5"),
                            busyIndicatorDelay: 0,
                            busy: "{= !${/IsFileLoaded}}",
                            visible: {
                                parts: [{ path: "Close" }, { path: "Status" }],
                                formatter: function (fVal, fVal2) {
                                    return (Common.checkNull(fVal2) && fVal !== "X") ? true : false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_47006}", // 신청
                            press: function () {
                                oController.onSave("1000");
                            },
                            busyIndicatorDelay: 0,
                            busy: "{= !${/IsFileLoaded}}",
                            visible: {
                                parts: [{ path: "Close" }, { path: "Status" }],
                                formatter: function (fVal, fVal2) {
                                    return ((Common.checkNull(fVal2) || fVal2 === "ZZ") && fVal !== "X") ? true : false;
                                }
                            }
                        }).addStyleClass("button-search"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_47149}", // 삭제
                            press: oController.onDialogBaseDelBtn.bind(oController),
                            busyIndicatorDelay: 0,
                            busy: "{= !${/IsFileLoaded}}",
                            visible: {
                                parts: [{ path: "Close" }, { path: "Status" }],
                                formatter: function (fVal, fVal2) {
                                    return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88") && fVal !== "X") ? true : false;
                                }
                            }
                        }).addStyleClass("button-delete"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00133}",   // 닫기
                            busyIndicatorDelay: 0,
                            busy: "{= !${/IsFileLoaded}}",
                            press: oController.onClose
                        }).addStyleClass("button-default")
                    ]
                }).setModel(oController._DataModel);

                return oDialog;
            },

            buildPanelFirst: function(oController) {

                var aMatrixRows = [
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 6,
                                content: new sap.m.HBox(oController.PAGEID + "_PerInfo", {
                                    justifyContent: "Start",
                                    visible: false,
                                    width: "100%",
                                    items: [
                                        EmpBasicInfoBoxCustomHass.renderHeader()
                                    ]
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 6,
                                content: new sap.ui.core.HTML({ content: "<div style='height:5px;'/>" })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 진료일
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47003}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    new PickOnlyDatePicker({
                                        width: "50%",
                                        displayFormat: gDtfmt,
                                        placeholder: gDtfmt,
                                        value: {
                                            path: "MedDate",
                                            type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                                        },
                                        valueFormat: "yyyy-MM-dd",
                                        editable: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        },
                                        change: function (oEvent) {
                                            oController._MedDateChange = "O";
                                            oController.getBukrs(oEvent);
                                        }
                                    })
                                ]
                            }).addStyleClass("DataCell"),
                            // 환자명
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47009}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    new sap.m.Select(oController.PAGEID + "_dSel1", {
                                        width: "80%",
                                        selectedKey: "{PatiName}",
                                        change: oController.changeSel,
                                        editable: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        }
                                    })
                                ]
                            }).addStyleClass("DataCell"),
                            // 관계
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47010}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    new sap.m.Input({
                                        width: "80%",
                                        editable: false,
                                        maxLength: 13,
                                        value: "{RelationTx}",
                                        customData: new sap.ui.core.CustomData({ key: "Rel", value: "{Relation}" })
                                    })
                                ]
                            }).addStyleClass("DataCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 의료기관
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47020}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    new sap.m.Select(oController.PAGEID + "_dSel2", {
                                        width: "80%",
                                        selectedKey: "{HospType}",
                                        editable: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        },
                                        change: oController.changeSel2
                                    }),
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47039"));  // * 치과(보철)의 급여 진료비는 치과(일반)으로 신청하시기 바랍니다.
                                        },
                                        leave: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    }).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue font-14px pt-5px")
                                ]
                            }).addStyleClass("DataCell"),
                            // 의료기관명
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47021}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    showValueHelp: true,
                                    width: "80%",
                                    valueHelpOnly: true,
                                    value: "{HospName}",
                                    valueHelpRequest: oController.onSearchMed,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 사업자등록번호
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47022}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "80%",
                                    editable: false,
                                    maxLength: 13,
                                    value: "{Comid}"
                                })
                            }).addStyleClass("DataCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 진료내용
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47023}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 3,
                                content: new sap.m.Input({
                                    width: "100%",
                                    value: "{DiseName}",
                                    maxLength: 50,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 신청일
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47024}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.ui.commons.TextView({
                                    text: {
                                        path: "Begda",
                                        type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                                    },
                                    textAlign: "Center"
                                }).addStyleClass("FontFamily")
                            }).addStyleClass("DataCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 5대암 여부
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: [
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47002")); // ο 위, 간, 폐, 대장, 유방 / 심근경색, 뇌졸증 : 비급여 부분 500만원/年 추가 지원
                                        },
                                        leave: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    }).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue"),
                                    new sap.m.Label({text: "{i18n>LABEL_47025}", textAlign: "End", required: false}).addStyleClass("label-wauto")
                                ]
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    new MatrixLayout({
                                        columns: 2,
                                        widths: ["20%"],
                                        rows: [
                                            new MatrixLayoutRow({
                                                cells: [
                                                    new MatrixLayoutCell({
                                                        content: new sap.m.CheckBox(oController.PAGEID + "_Chk1", {
                                                            selected: "{Chk1}",
                                                            select: oController.onChk1,
                                                            editable: {
                                                                parts: [{ path: "Status" }, { path: "Relation" }],
                                                                formatter: function (fVal2, fVal3) {
                                                                    return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && (fVal3 === "01" || fVal3 === "02")) ? true : false;
                                                                }
                                                            }
                                                        })
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }).addStyleClass("DataCell"),
                            // 난임 여부
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: [
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47003"));
                                        },
                                        leave: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    }).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue"),
                                    new sap.m.Label({text: "{i18n>LABEL_47026}", textAlign: "End", required: false}).addStyleClass("label-wauto")
                                ]
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 3,
                                content: new MatrixLayout({
                                    columns: 2,
                                    widths: ["20%"],
                                    rows: [
                                        new MatrixLayoutRow({
                                            cells: [
                                                new MatrixLayoutCell({
                                                    content: new sap.m.CheckBox(oController.PAGEID + "_Chk2", {
                                                        selected: "{Chk2}",
                                                        select: oController.onChk2,
                                                        editable: {
                                                            parts: [{ path: "Status" }, { path: "Relation" }],
                                                            formatter: function (fVal2, fVal3) {
                                                                return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && (fVal3 === "01" || fVal3 === "02")) ? true : false;
                                                            }
                                                        }
                                                    })
                                                })
                                            ]
                                        })
                                    ]
                                })
                            }).addStyleClass("DataCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 비고
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47027}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 5,
                                content: new sap.m.Input({
                                    width: "100%",
                                    value: "{Remark}",
                                    maxLength: 100,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell")
                        ]
                    })
                ];

                return new sap.m.Panel({
                    expanded: true,
                    expandable: false,
                    content: new MatrixLayout({
                        columns: 6,
                        widths: ["140px", "", "140px", "", "140px", ""],
                        rows: aMatrixRows
                    })
                });
            },

            buildPanelSecond: function(oController) {

                var aFirstRows = [
                    new MatrixLayoutRow({
                        cells: [
                            // 구분
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47030}", textAlign: "Center", required: false}),
                                rowSpan: 2
                            }).addStyleClass("LabelCell"),
                            // 급여
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47031}", textAlign: "Center", required: false}),
                                colSpan: 2
                            }).addStyleClass("LabelCell"),
                            // 비급여
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47032}", textAlign: "Center", required: false}),
                                colSpan: 6
                            }).addStyleClass("LabelCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 입원/외래
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47033}", textAlign: "Center", required: false}),
                                colSpan: 2
                            }).addStyleClass("LabelCell"),
                            // 입원
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47034}", textAlign: "Center", required: false}),
                                colSpan: 4
                            }).addStyleClass("LabelCell"),
                            // 외래
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47035}", textAlign: "Center", required: false}),
                                colSpan: 2
                            }).addStyleClass("LabelCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 진료항목
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47036}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            // 본인부담금
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47037}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            // 전액본인부담
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47087}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            // 진찰료
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47038}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            // 입원료
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47039}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            // 식대
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47040}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            // CT/MRI/초음파
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47041}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            // 선택진료료
                            // new MatrixLayoutCell({
                            //     hAlign: "Center",
                            //     content: new sap.m.Label({text: "{i18n>LABEL_47042}", textAlign: "Center", required: false})
                            // }).addStyleClass("LabelCell"),
                            // CT/MRI/초음파
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47041}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            // 보철/기타
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47044}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 진료비
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47045}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getExpensesInput(oController, {Id: oController.PAGEID + "_Inp1", Path: "Zkibbm"}),
                            this.getExpensesInput(oController, {Id: oController.PAGEID + "_Inp2", Path: "Zkijbm"}),
                            this.getExpensesInput(oController, {Id: oController.PAGEID + "_Inp3", Path: "Znijcm"}),
                            this.getExpensesInput(oController, {Id: oController.PAGEID + "_Inp4", Path: "Zniiwm"}),
                            this.getExpensesInput(oController, {Id: oController.PAGEID + "_Inp5", Path: "Znisdm"}),
                            this.getExpensesInput(oController, {Id: oController.PAGEID + "_Inp6", Path: "Znoctm"}),
                            // this.getExpensesInput(oController, {Id: oController.PAGEID + "_Inp7", Path: "Znomrm"}),
                            this.getExpensesInput(oController, {Id: oController.PAGEID + "_Inp8", Path: "Znocum"}),
                            this.getExpensesInput(oController, {Id: oController.PAGEID + "_Inp9", Path: "Znobcm"})
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 지원대상금액
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47046}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput("Zkiobd"),
                            this.getSupportAmountInput("Zkijbd"),
                            this.getSupportAmountInput("Znijcd"),
                            this.getSupportAmountInput("Zniiwd"),
                            this.getSupportAmountInput("Znisdd"),
                            this.getSupportAmountInput("Znoctd"),
                            // this.getSupportAmountInput("Znomrd"),
                            this.getSupportAmountInput("Znocud"),
                            this.getSupportAmountInput("Znobcd")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 총 수납금액
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47048}", textAlign: "Center", required: true})
                            }).addStyleClass("LabelCell totalLine"),
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Input({
                                    width: "90%",
                                    textAlign: "Right",
                                    editable: false,
                                    maxLength: 13,
                                    value: {
                                        path: "Mycharge",
                                        formatter: function (fVal) {
                                            if (fVal != "" && fVal != null) {
                                                return common.Common.numberWithCommas(fVal.replace(/\,/g, "")).trim();
                                            } else {
                                                return fVal;
                                            }
                                        },
                                        editable: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell totalLine"),
                            // 할인금액
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47118}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell totalLine"),
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Input({
                                    width: "90%",
                                    textAlign: "Right",
                                    liveChange: oController.onLiveMoney,
                                    maxLength: 13,
                                    value: "{Zdsctm}",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell totalLine"),
                            // 총 지원대상금액
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47049}", textAlign: "Center", required: true})
                            }).addStyleClass("LabelCell totalLine"),
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Input({
                                    width: "90%",
                                    textAlign: "Right",
                                    editable: false,
                                    maxLength: 13,
                                    value: {
                                        path: "BaseAmt",
                                        formatter: function (fVal) {
                                            if (fVal != "" && fVal != null) {
                                                return common.Common.numberWithCommas(fVal.replace(/\,/g, "")).trim();
                                            }
                                        },
                                        editable: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell totalLine"),
                            // 회사 지원금액
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47050}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell totalLine"),
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Input({
                                    width: "90%",
                                    textAlign: "Right",
                                    editable: false,
                                    maxLength: 13,
                                    value: {
                                        path: "SuppAmt",
                                        formatter: function (fVal) {
                                            if (fVal != "" && fVal != null) {
                                                return common.Common.numberWithCommas(fVal.replace(/\,/g, "")).trim();
                                            }
                                        },
                                        editable: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell totalLine"),
                            new MatrixLayoutCell().addStyleClass("DataCell totalLine")
                        ]
                    })
                ];

                var aSecondRows = [
                    new MatrixLayoutRow({
                        cells: [
                            // 잔여한도확인
                            new MatrixLayoutCell(oController.PAGEID + "_HideBtn", {
                                hAlign: "Center",
                                content: [
                                    new sap.m.Button({
                                        text: "{i18n>LABEL_47051}",
                                        press: function () {
                                            oController.onCal("1000");
                                        },
                                        visible: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        }
                                    }).addStyleClass("button-light"),
                                    new sap.m.Label({
                                        text: "{i18n>LABEL_47051}",
                                        textAlign: "Center",
                                        required: false,
                                        visible: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return !((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        }
                                    })
                                ]
                            }),
                            // 일반 질병 잔여 한도
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47052}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell border-left-no"),
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Input({
                                    width: "90%",
                                    textAlign: "Right",
                                    editable: false,
                                    maxLength: 13,
                                    value: {
                                        path: "Zmedrl",
                                        formatter: function (fVal) {
                                            if (fVal != "" && fVal != null) {
                                                return common.Common.numberWithCommas(fVal.replace(/\,/g, "")).trim();
                                            }
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 5대암 잔여 한도
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47053}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell border-left-no"),
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Input({
                                    width: "90%",
                                    textAlign: "Right",
                                    editable: false,
                                    maxLength: 13,
                                    value: {
                                        path: "Zfvcrl",
                                        formatter: function (fVal) {
                                            if (fVal != "" && fVal != null) {
                                                return common.Common.numberWithCommas(fVal.replace(/\,/g, "")).trim();
                                            }
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 난임 잔여 한도
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47054}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell border-left-no"),
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Input({
                                    width: "90%",
                                    textAlign: "Right",
                                    editable: false,
                                    maxLength: 13,
                                    value: {
                                        path: "Ziftrl",
                                        formatter: function (fVal) {
                                            if (fVal != "" && fVal != null) {
                                                return common.Common.numberWithCommas(fVal.replace(/\,/g, "")).trim();
                                            }
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 치과(보철) 잔여 한도
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Label({text: "{i18n>LABEL_47055}", textAlign: "Center", required: false})
                            }).addStyleClass("LabelCell border-left-no"),
                            new MatrixLayoutCell({
                                hAlign: "Center",
                                content: new sap.m.Input({
                                    width: "90%",
                                    textAlign: "Right",
                                    editable: false,
                                    maxLength: 13,
                                    value: {
                                        path: "Zdbcrl",
                                        formatter: function (fVal) {
                                            if (fVal != "" && fVal != null) {
                                                return common.Common.numberWithCommas(fVal.replace(/\,/g, "")).trim();
                                            }
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell")
                        ]
                    })
                ];

                return new sap.m.Panel({
                    expanded: true,
                    expandable: false,
                    headerToolbar: [
                        new sap.m.Toolbar({
                            content: [
                                new sap.ui.core.HTML({ content: "<span class='sub-title'>" + oController.getBundleText("LABEL_47028") + "</span>" }), // 진료비 내역
                                new sap.m.ToolbarSpacer({ width: "20px" }),
                                new sap.ui.core.HTML({ content: "<span style='font-size:14px;color:#da291c;'>" + oController.getBundleText("LABEL_47029") + "</span>" }), // ※ 진료일자별 건건이 입력 (일자 별 영수증 첨부), 잔여 한도가 0원인 경우 해당 진료항목으로 의료비를 신청하실 수 없습니다.
                                new sap.m.ToolbarSpacer(),
                                new sap.ui.core.HTML({ content: "<a target='_blank' href='ZUI5_HR_MedApply/manual/MedApplyWay.pptx' style='font-size:14px;color:#0070bd !important;' download>" + oController.getBundleText("LABEL_47150") + "</a>" }),    // 의료비 신청 예시
                                new sap.m.Text({ text: "│" }).addStyleClass("ml-0 mnw-0 font-14px color-blue"),
                                new sap.ui.core.HTML({ content: "<a target='_blank' href='ZUI5_HR_MedApply/manual/MedApplyCalc.xls' style='font-size:14px;color:#0070bd !important;padding-right:15px;' download>" + oController.getBundleText("LABEL_47143") + "</a>" })    // 치과(보철) 회사 양식
                            ]
                        })
                    ],
                    content: [
                        new MatrixLayout({
                            columns: 9,
                            width : "100%",
                            widths: ["140px", "", "", "", "", "", "", "", ""],
                            rows: aFirstRows
                        }),
                        new sap.ui.core.HTML({ content: "<div style='height:20px;'/>" }),
                        new MatrixLayout({
                            columns: 9,
                            width : "100%",
                            widths: ["140px", "140px", "", "140px", "", "140px", "", "140px", ""],
                            rows: aSecondRows
                        }),
                        new sap.m.VBox({
                            fitContainer: true,
                            width: "100%",
                            items: [
                                new sap.m.VBox({
                                    fitContainer: true,
                                    width: "100%",
                                    items: [
                                        new sap.m.Text({ text: "{i18n>MSG_47038}", textAlign: "Begin", width: "auto" }),
                                        new sap.m.Text({ text: "{i18n>MSG_47047}", textAlign: "Begin", width: "auto" }),
                                        new sap.m.Text({ text: "{i18n>MSG_47048}", textAlign: "Begin", width: "auto" })
                                    ]
                                }).addStyleClass("msgBox mt-20px"),
                                sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
                            ]
                        })
                    ]
                });
            },

            getExpensesInput: function(oController, param) {
                
                return new MatrixLayoutCell({
                    hAlign: "Center",
                    content: new sap.m.Input(param.Id, {
                        width: "90%",
                        textAlign: "Right",
                        liveChange: oController.onLiveMoney,
                        maxLength: 13,
                        value: "{${path}}".interpolate(param.Path),
                        editable: {
                            parts: [{ path: "Close" }, { path: "Status" }],
                            formatter: function (fVal, fVal2) {
                                return ((fVal2 === "ZZ" || fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                            }
                        }
                    })
                }).addStyleClass("DataCell");
            },

            getSupportAmountInput: function(path) {

                return new MatrixLayoutCell({
                    hAlign: "Center",
                    content: new sap.m.Input({
                        width: "90%",
                        textAlign: "Right",
                        editable: false,
                        maxLength: 13,
                        value: "{${path}}".interpolate(path)
                    })
                }).addStyleClass("DataCell");
            }
        });
    }
);
