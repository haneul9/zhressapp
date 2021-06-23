sap.ui.define(
    [
        "common/Common",    //
        "common/HoverIcon",
        "common/PickOnlyDatePicker",
        "common/EmpBasicInfoBoxCustomHass",
        "fragment/COMMON_ATTACH_FILES",
        "sap/ui/commons/layout/MatrixLayout",
        "sap/ui/commons/layout/MatrixLayoutRow",
        "sap/ui/commons/layout/MatrixLayoutCell"
    ],
    function (Common, HoverIcon, PickOnlyDatePicker, EmpBasicInfoBoxCustomHass, COMMON_ATTACH_FILES, MatrixLayout, MatrixLayoutRow, MatrixLayoutCell) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_MedApply.fragment.popup2", {
            createContent: function (oController) {

                return new sap.m.Dialog(oController.PAGEID + "_Dialog2", {
                    title: "{i18n>LABEL_47001}",    // 의료비 신청
                    contentWidth: "1600px",
                    beforeOpen: oController.onAfterOpen2,
                    afterOpen: oController.onAfterLoad2,
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_47101}", // 저장
                            press: oController.onDialogSaveBtn.bind(oController),
                            visible: {
                                parts: [{ path: "Close" }, { path: "Status" }],
                                formatter: function (fVal, fVal2) {
                                    return ((fVal2 === "AA" || fVal2 === "88") && fVal !== "X") ? true : false;
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_47006}", // 신청
                            press: function () {
                                oController.onSave("A100");
                            },
                            visible: {
                                parts: [{ path: "Close" }, { path: "Status" }],
                                formatter: function (fVal, fVal2) {
                                    return (Common.checkNull(fVal2) && fVal !== "X") ? true : false;
                                }
                            }
                        }).addStyleClass("button-search"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_47149}", // 삭제
                            press: oController.onDialogDelBtn.bind(oController),
                            visible: {
                                parts: [{ path: "Close" }, { path: "Status" }],
                                formatter: function (fVal, fVal2) {
                                    return ((fVal2 === "AA" || fVal2 === "88") && fVal !== "X") ? true : false;
                                }
                            }
                        }).addStyleClass("button-delete"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00133}", // 닫기
                            press: oController.onClose2
                        }).addStyleClass("button-default")
                    ],
                    content: [
                        new sap.m.FlexBox({
                            justifyContent: "Center",
                            fitContainer: true,
                            items: [
                                new sap.ui.commons.layout.VerticalLayout({
                                    content: [
                                        this.buildPanelFirst(oController),  // sap.m.Panel
                                        this.buildPanelSecond(oController) // sap.m.Panel
                                    ]
                                })
                            ]
                        }).addStyleClass("paddingbody")
                    ]
                }).setModel(oController._DataModel)
                .bindElement("/Pop2/0");
            },

            buildPanelFirst: function(oController) {
                
                var aMatrixRows = [
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 6,
                                content: new sap.m.HBox(oController.PAGEID + "_PerInfo2", {
                                    justifyContent: "Start",
                                    width: "100%",
                                    visible: false,
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
                                content: new PickOnlyDatePicker({
                                    width: "99%",
                                    placeholder: gDtfmt,
                                    displayFormat: gDtfmt,
                                    valueFormat: "yyyy-MM-dd",
                                    value: {
                                        path: "MedDate",
                                        type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                                    },
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    },
                                    change: function (oEvent) {
                                        oController._MedDateChange = "O";
                                        oController.getBukrs(oEvent);
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 가족관계
                            new MatrixLayoutCell({ 
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47066}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel5", {
                                    width: "99%",
                                    selectedKey: "{Relation}",
                                    change: oController.onChange5,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 환자명
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47067}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel6", {
                                    width: "99%",
                                    selectedKey: "{PatiName}",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 보험사지급일
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47068}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new PickOnlyDatePicker({
                                    width: "99%",
                                    displayFormat: gDtfmt,
                                    placeholder: gDtfmt,
                                    valueFormat: "yyyy-MM-dd",
                                    value: {
                                        path: "Inpdt",
                                        type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                                    },
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Gtz51" }, { path: "Status" }],
                                        formatter: function (fVal1, fVal2, fVal3) {
                                            return (fVal1 !== "X" && (fVal3 === "AA" || fVal3 === "88" || Common.checkNull(fVal3)) && (fVal2 !== "C" && fVal2 !== "D")) ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 의료비구분
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47064}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel3", {
                                    width: "99%",
                                    selectedKey: "{Gtz51}",
                                    change: oController.onChange3,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 진료항목
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47065}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel4", {
                                    width: "99%",
                                    selectedKey: "{Gtz51s}",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 의료기관명
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47069}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                colSpan: 3,
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "99%",
                                    value: "{HospName}",
                                    maxLength: 50,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 영수증번호
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47070}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "99%",
                                    value: "{Recno}",
                                    maxLength: 20,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 병명
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47071}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                colSpan: 3,
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "99%",
                                    value: "{DiseName}",
                                    maxLength: 50,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 투약일수
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47072}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "99%",
                                    value: "{Pdcnt}",
                                    maxLength: 3,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 비고
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47073}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 3,
                                content: new sap.m.Input({
                                    width: "99%",
                                    value: "{Remark}",
                                    maxLength: 100,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            }).addStyleClass("DataCell"),
                            // 신청일
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47074}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Text({
                                    text: {
                                        path: "Begda",
                                        type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
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
                        widths: ["15%", "", "15%", "", "15%"],
                        rows: aMatrixRows
                    })
                });
            },

            buildPanelSecond: function(oController) {

                var aMatrixRows = [
                    new MatrixLayoutRow({
                        cells: [
                            // 환자부담 총액
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47131}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput2(oController, {
                                Id: "Ptamt", 
                                Close: "Close",
                                Status: "Status",
                                Gtz51: "Gtz51"
                            }),
                            // 급여 본인부담금
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47132}", textAlign: "End", required: true})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput2(oController, {
                                Id: "Medsp", 
                                Close: "Close",
                                Status: "Status"
                            }),
                            // 타사 보험금
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47133}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput2(oController, {
                                Id: "Oiamt", 
                                Close: "Close",
                                Status: "Status",
                                Gtz51: "Gtz51"
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // (비급여) 치과(보철)
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47134}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput2(oController, {
                                Id: "Znobcm", 
                                Close: "Close",
                                Status: "Status",
                                Gtz51: "Gtz51"
                            }),
                            // 비급여 본인부담금
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47135}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput2(oController, {
                                Id: "Medpp", 
                                Close: "Close",
                                Status: "Status",
                                Gtz51: "Gtz51"
                            }),
                            // 보험사 非지급액
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47136}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput2(oController, {
                                Id: "Insnp", 
                                Close: "Close",
                                Status: "Status",
                                Gtz51: "Gtz51"
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 치과(보철) 대상 금액(50%)
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47137}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput1(oController, {Id: "Znobcd", Editable: false}),
                            // 본인 공제금액
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47138}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput1(oController, {Id: "Medmp", Editable: false}),
                            // 보험사 지급액
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47139}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput1(oController, {Id: "Inspp", Editable: false})
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 치과(보철) 잔여 한도
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: [
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47009")); // * 보철 진료비는 보철 회사 양식 증빙 필수<br/> - 단 뼈이식 수술 비용, 교정, 불소, 라미네이트 등은 비지원
                                        },
                                        leave: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    }).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue"),
                                    new sap.m.Label({text: "{i18n>LABEL_47140}", textAlign: "End", required: false}).addStyleClass("label-wauto")
                                ]
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput1(oController, {Id: "Zdbcrl", Editable: false}),
                            // 난임 잔여 한도
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: [
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47010")); // * 근속 1년 이상 재직 중인 무자녀 및 1자녀 임직원<br/>* 비급여 항목을 300만원 한도 내 지원<br/> - 난임치료비는 난임진단서 필수
                                        },
                                        leave: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    }).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue"),
                                    new sap.m.Label({text: "{i18n>LABEL_47141}", textAlign: "End", required: false}).addStyleClass("label-wauto")
                                ]
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput1(oController, {Id: "Ziftrl", Editable: false}),
                            // 회사 지원금액
                            new MatrixLayoutCell({
                                hAlign: "Right",
                                content: new sap.m.Label({text: "{i18n>LABEL_47142}", textAlign: "End", required: false})
                            }).addStyleClass("LabelCell"),
                            this.getSupportAmountInput1(oController, {Id: "Framt", Editable: false})
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // * 치과(보철) 잔여 한도 혹은 난임 잔여 한도가 0원인 경우, 의료비 구분에서 치과(보철) 혹은 난임치료를 선택하여 신청하실 수 없습니다.
                            new MatrixLayoutCell({
                                colSpan: 6,
                                content: new sap.ui.core.HTML({
                                    content: "<div style='height:20px;'></div><div class='msgBox'><span>" + oController.getBundleText("MSG_47042") + "<br/>" + oController.getBundleText("MSG_47043") + "</span></div>" 
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 6,
                                content: new sap.ui.core.HTML({
                                    content: "<div style='height:10px;' />"
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 6,
                                content: COMMON_ATTACH_FILES.renderer(oController, "008")
                            })
                        ]
                    })
                ];

                return new sap.m.Panel({
                    expanded: true,
                    expandable: false,
                    headerToolbar: [
                        new sap.m.Toolbar({
                            content: [
                                new sap.ui.core.HTML({ content: "<span class='sub-title'>" + oController.getBundleText("LABEL_47028") + "</span>" }),   // 진료비 내역
                                new sap.m.ToolbarSpacer(),
                                new sap.ui.core.HTML({ content: "<a target='_blank' href='ZUI5_HR_MedApply/manual/1. 보철_신청서 양식(롯데케미칼_첨단소재).xls' style='font-size:14px;color:#0070bd !important;padding-right:15px;' download>" + oController.getBundleText("LABEL_47143") + "</a>" })    // 첨단 치과(보철) 회사 양식
                            ]
                        })
                    ],
                    content: new MatrixLayout({
                        columns: 6,
                        widths: ["15%", "", "15%", "", "15%"],
                        rows: aMatrixRows
                    })
                    .setModel(oController._DataModel)
                    .bindElement("/Pop2/0")
                });
            },

            getSupportAmountInput1: function(oController, param) {
                
                return new MatrixLayoutCell({
                    hAlign: "Begin",
                    content: new sap.m.Input({
                        width: "99%",
                        textAlign: "End",
                        liveChange: oController.onLiveMoney,
                        maxLength: 13,
                        value: "{${path}}".interpolate(param.Id),
                        editable: param.Editable
                    })
                }).addStyleClass("DataCell");
            },

            getSupportAmountInput2: function(oController, param) {
                
                return new MatrixLayoutCell({
                    hAlign: "Begin",
                    content: new sap.m.Input({
                        width: "99%",
                        textAlign: "End",
                        liveChange: oController.onLiveMoney,
                        maxLength: 13,
                        value: "{${path}}".interpolate(param.Id),
                        editable: {
                            parts: [{path: "Close"}, {path: "Status"}, {path: "Gtz51"}],
                            formatter: function(v1, v2, v3) {
                                var vClose = Common.checkNull(!v1) ? v1 : undefined,
                                    vStatus = Common.checkNull(!v2) ? v2 : undefined,
                                    vGtz51 = Common.checkNull(!v3) ? v3 : undefined;

                                if(param.Id === "Ptamt" || param.Id === "Oiamt" || param.Id === "Insnp"){
                                    return vClose !== 'X' && (Common.checkNull(vStatus) || vStatus === 'AA' || vStatus === '88') && (vGtz51 !== 'C' && vGtz51 !== 'D');
                                }

                                if(param.Id === "Znobcm"){
                                    return vClose !== 'X' && (Common.checkNull(vStatus) || vStatus === 'AA' || vStatus === '88') && vGtz51 === 'C';
                                }

                                if(param.Id === "Medpp"){
                                    return vClose !== 'X' && (Common.checkNull(vStatus) || vStatus === 'AA' || vStatus === '88') && vGtz51 !== 'C';
                                }else {
                                    return vClose !== 'X' && (Common.checkNull(vStatus) || vStatus === 'AA' || vStatus === '88');
                                }
                            }
                        }
                    })
                }).addStyleClass("DataCell");
            }
        });
    }
);
