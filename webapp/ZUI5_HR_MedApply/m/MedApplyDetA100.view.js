sap.ui.define(
    [
        "common/Common", //
        "common/HoverIcon",
        "common/PickOnlyDatePicker",
        "common/PageHelper",
        "fragment/COMMON_ATTACH_FILES",
        "sap/ui/commons/layout/MatrixLayout",
        "sap/ui/commons/layout/MatrixLayoutRow",
        "sap/ui/commons/layout/MatrixLayoutCell"
    ],
    function (Common, HoverIcon, PickOnlyDatePicker, PageHelper, COMMON_ATTACH_FILES, MatrixLayout, MatrixLayoutRow, MatrixLayoutCell) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "MedApplyDetA100"].join($.app.getDeviceSuffix());

        sap.ui.jsview(SUB_APP_ID, {
            getControllerName: function () {
                return SUB_APP_ID;
            },

            createContent: function (oController) {
                return new PageHelper({
                    idPrefix: "MedApplyDetA100",
                    showNavButton: true,
                    navBackFunc: oController.navBack,
                    headerButton: new sap.m.FlexBox({
                        items: [
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
                                press: function () {
                                    oController.onSave("A100");
                                },
                                text: "{i18n>LABEL_47006}", // 신청
                                visible: {
                                    parts: [{ path: "Close" }, { path: "Status" }],
                                    formatter: function (fVal, fVal2) {
                                        return (fVal2 === "" && fVal !== "X") ? true : false;
                                    }
                                }
                            }).addStyleClass("button-dark"),
                            new sap.m.Button({
                                text: "{i18n>LABEL_47149}", // 삭제
                                press: oController.onDialogDelBtn.bind(oController),
                                visible: {
                                    parts: [{ path: "Close" }, { path: "Status" }],
                                    formatter: function (fVal, fVal2) {
                                        return ((fVal2 === "AA" || fVal2 === "88") && fVal !== "X") ? true : false;
                                    }
                                }
                            }).addStyleClass("button-light")
                        ]
                    })
                    .addStyleClass("app-nav-button-right")
                    .setModel(oController._DataModel)
                    .bindElement("/Pop2/0"),
                    contentStyleClass: "sub-app-content",
                    contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                    contentItems: [
                        this.buildDetailContent(oController)
                    ]
                });
            },

            buildDetailContent: function (oController) {
                var aMatrixRows = [
                    new MatrixLayoutRow({
                        cells: [
                            // 진료일
                            this.getLabel({ Text: "{i18n>LABEL_47003}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new PickOnlyDatePicker({
                                    width: "100%",
                                    displayFormat: gDtfmt,
                                    placeholder: gDtfmt,
                                    dateValue: "{MedDate}",
                                    valueFormat: "yyyy-MM-dd",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    },
                                    change: oController.getBukrs.bind(oController)
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 의료비구분
                            this.getLabel({ Text: "{i18n>LABEL_47064}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel3", {
                                    width: "100%",
                                    change: oController.onChange3,
                                    selectedKey: "{Gtz51}",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                }).addStyleClass("height38px")
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 진료항목
                            this.getLabel({ Text: "{i18n>LABEL_47065}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel4", {
                                    width: "100%",
                                    selectedKey: "{Gtz51s}",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                }).addStyleClass("height38px")
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 가족관계
                            this.getLabel({ Text: "{i18n>LABEL_47066}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel5", {
                                    width: "100%",
                                    change: oController.onChange5,
                                    selectedKey: "{Relation}",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                }).addStyleClass("height38px")
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 환자명
                            this.getLabel({ Text: "{i18n>LABEL_47067}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel6", {
                                    width: "100%",
                                    selectedKey: "{PatiName}",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                }).addStyleClass("height38px")
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 보험사지급일
                            this.getLabel({ Text: "{i18n>LABEL_47068}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new PickOnlyDatePicker({
                                    width: "100%",
                                    displayFormat: gDtfmt,
                                    placeholder: gDtfmt,
                                    dateValue: "{Inpdt}",
                                    valueFormat: "yyyy-MM-dd",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }, { path: "Gtz51" }],
                                        formatter: function (fVal, fVal2, fVal3) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X" && fVal3 !== 'C' && fVal3 !== 'D') ? true : false;
                                        }
                                    }
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 의료기관명
                            this.getLabel({ Text: "{i18n>LABEL_47069}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "100%",
                                    value: "{HospName}",
                                    maxLength: 50,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 영수증번호
                            this.getLabel({ Text: "{i18n>LABEL_47070}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "100%",
                                    value: "{Recno}",
                                    maxLength: 20,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 병명
                            this.getLabel({ Text: "{i18n>LABEL_47071}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "100%",
                                    value: "{DiseName}",
                                    maxLength: 50,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 투약일수
                            this.getLabel({ Text: "{i18n>LABEL_47072}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "45%",
                                    value: "{Pdcnt}",
                                    maxLength: 3,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 비고
                            this.getLabel({ Text: "{i18n>LABEL_47073}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "100%",
                                    value: "{Remark}",
                                    maxLength: 100,
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    }
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 신청일
                            this.getLabel({ Text: "{i18n>LABEL_47074}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Text({
                                    text: {
                                        path: "Begda",
                                        type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                                    }
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 치과(보철) 회사 양식
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: [
                                    new sap.ui.core.HTML({ content: "<a target='_blank' href='ZUI5_HR_MedApply/manual/MedApplyCalcHigh.xls' style='font-size:14px;color:#0070bd !important;padding-right:15px;' download>" + oController.getBundleText("LABEL_47143") + "</a>" })    // 첨단치과(보철) 회사 양식
                                ]
                            })
                        ]
                    }),
                    this.getRowSpace(),
                    new MatrixLayoutRow({
                        cells: [
                            // 진료비 내역
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: [
                                    new sap.ui.core.HTML({ content: "<span class='med-subtitle'>" + oController.getBundleText("LABEL_47028") + "</span>" }) //
                                ]
                            })
                        ]
					}),
					this.getRowSpace(),
                    new MatrixLayoutRow({
                        cells: [
                            // 환자부담 총액
                            this.getLabel({ Text: "{i18n>LABEL_47075}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput2(oController, { Path: "{Ptamt}", Close: "{Close}",
                                    Status: "{Status}",
                                    Gtz51: "{Gtz51}" }) //
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 급여 본인부담금
                            this.getLabel({ Text: "{i18n>LABEL_47076}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput2(oController, { Path: "{Medsp}",  Close: "{Close}",
                                    Status: "{Status}" }) //
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 비급여 본인부담금
                            this.getLabel({ Text: "{i18n>LABEL_47077}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput2(oController, { Path: "{Medpp}",Close: "{Close}",
                                    Status: "{Status}",
                                    Gtz51: "{Gtz51}" }) //
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 타사 보험금
                            this.getLabel({ Text: "{i18n>LABEL_47078}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput2(oController, { Path: "{Oiamt}", Close: "{Close}",
                                    Status: "{Status}",
                                    Gtz51: "{Gtz51}" }) //
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 보험사 비지급액
                            this.getLabel({ Text: "{i18n>LABEL_47079}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput2(oController, { Path: "{Insnp}", Close: "{Close}",
                                    Status: "{Status}",
                                    Gtz51: "{Gtz51}" })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 비급여 치과보철
                            this.getLabel({ Text: "{i18n>LABEL_47080}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput2(oController, { Path: "{Znobcm}", Close: "{Close}",
                                    Status: "{Status}",
                                    Gtz51: "{Gtz51}" }), //
                                    this.getOnlyMoneyInput1(oController, { Path: "{Znobcd}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 본인공제금액
                            this.getLabel({ Text: "{i18n>LABEL_47081}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Path: "{Medmp}", Editable: false }) //
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 보험사 지급액
                            this.getLabel({ Text: "{i18n>LABEL_47082}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Path: "{Inspp}", Editable: false }) //
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 회사 지원금액
                            this.getLabel({ Text: "{i18n>LABEL_47083}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Path: "{Framt}", Editable: false }) //
                                ]
                            })
                        ]
					}),
					this.getRowSpace(),
                    new MatrixLayoutRow({
                        cells: [
                            // 잔여한도
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: [
                                    new sap.ui.core.HTML({ content: "<span class='med-subtitle'>" + oController.getBundleText("LABEL_47130") + "</span>" }) //
                                ]
                            })
                        ]
					}),
					this.getRowSpace(),
                    new MatrixLayoutRow({
                        cells: [
                            // 치과보철 잔여 한도
                            this.getLabel({ Text: "{i18n>LABEL_47084}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Path: "{Zdbcrl}", Editable: false }), //
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            // * 보철 진료비는 보철 회사 양식 증빙 필수<br/> - 단 뼈이식 수술 비용, 교정, 불소, 라미네이트 등은 비지원
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47009"));
                                        },
                                        leave: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    }).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue")
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 난임 잔여 한도
                            this.getLabel({ Text: "{i18n>LABEL_47085}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Path: "{Ziftrl}", Editable: false }), //
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            // * 근속 1년 이상 재직 중인 무자녀 및 1자녀 임직원<br/>* 비급여 항목을 300만원 한도 내 지원<br/> - 난임치료비는 난임진단서 필수
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47010"));
                                        },
                                        leave: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                        }
                                    }).addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue")
                                ]
                            })
                        ]
					}),
					this.getRowSpace(),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: [
                                    // * 치과(보철) 잔여 한도 혹은 난임 잔여 한도가 0원인 경우, 의료비 구분에서 치과(보철) 혹은 난임치료를 선택하여 신청하실 수 없습니다.
                                    // * 치과(보철) 진료비는 보철 회사 양식 증빙 필수
                                    new sap.ui.core.HTML({ content: "<div style='height:3px;'></div><div class='msgBox'><span>" + oController.getBundleText("MSG_47042") + "<br/>" + oController.getBundleText("MSG_47043") + "</span></div>" }) //
                                ]
                            })
                        ]
					}),
					this.getRowSpace(),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: [
                                    // 증빙자료
                                    new sap.ui.core.HTML({ content: "<span class='med-subtitle'>" + oController.getBundleText("LABEL_47104") + "</span>" }) //
                                ]
                            })
                        ]
					}),
					this.getRowSpace(),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 2,
                                content: [
                                    COMMON_ATTACH_FILES.renderer(oController, "008") //
                                ]
                            })
                        ]
                    })
                ];

                return new sap.m.VBox({
                    justifyContent: "Center",
                    fitContainer: true,
                    items: [
                        new sap.ui.commons.layout.VerticalLayout({
                            content: [
                                new MatrixLayout({
                                    columns: 2,
                                    width: "100%",
                                    widths: ["130px", ""],
                                    rows: aMatrixRows
                                })
                            ]
                        })
                    ]
                })
                .setModel(oController._DataModel)
                .bindElement("/Pop2/0")
                .addStyleClass("vbox-form-mobile");
			},
			
			getRowSpace: function() {
				return new MatrixLayoutRow({
					cells: [
						new MatrixLayoutCell({
							colSpan: 2,
							content: [
								new sap.ui.core.HTML({ content: "<div style='height:10px;'/>" }) //
							]
						})
					]
				});
			},

            getLabel: function (param) {
                return new MatrixLayoutCell({
                    hAlign: "Begin",
                    content: new sap.m.Label({
                        textAlign: "Begin",
                        text: param.Text,
                        required: param.Required
                    })
                });
            },

            getOnlyMoneyInput1: function (oController, param) {
                return new sap.m.Input({
                    width: "45%",
                    textAlign: "End",
                    liveChange: oController.onLiveMoney,
                    maxLength: 13,
                    value: param.Path,
                    editable: param.Editable
                });
            },

            getOnlyMoneyInput2: function (oController, param) {
                return new sap.m.Input({
                    width: "45%",
                    textAlign: "End",
                    liveChange: oController.onLiveMoney,
                    maxLength: 13,
                    value: param.Path,
                    editable: {
                        parts: [{path: "Close"}, {path: "Status"}, {path: "Gtz51"}],
                        formatter: function(v1, v2, v3) {
                            var vClose = Common.checkNull(!v1) ? v1 : undefined,
                                vStatus = Common.checkNull(!v2) ? v2 : undefined,
                                vGtz51 = Common.checkNull(!v3) ? v3 : undefined;

                            if(param.Path === "{Ptamt}" || param.Path === "{Oiamt}" || param.Path === "{Insnp}"){
                                return vClose !== 'X' && (Common.checkNull(vStatus) || vStatus === 'AA' || vStatus === '88') && (vGtz51 !== 'C' && vGtz51 !== 'D');
                            }

                            if(param.Path === "{Znobcm}"){
                                return vClose !== 'X' && (Common.checkNull(vStatus) || vStatus === 'AA' || vStatus === '88') && vGtz51 === 'C';
                            }

                            if(param.Path === "{Medpp}"){
                                return vClose !== 'X' && (Common.checkNull(vStatus) || vStatus === 'AA' || vStatus === '88') && vGtz51 !== 'C';
                            }else {
                                return vClose !== 'X' && (Common.checkNull(vStatus) || vStatus === 'AA' || vStatus === '88');
                            }
                        }
                    }
                });
            },

            loadModel: function () {
                // Model 선언
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_BENEFIT_SRV");
            }
        });
    }
);
