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

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "MedApplyDet"].join($.app.getDeviceSuffix());

        sap.ui.jsview(SUB_APP_ID, {
            getControllerName: function () {
                return SUB_APP_ID;
            },

            createContent: function (oController) {
                return new PageHelper({
                    idPrefix: "MedApplyDet",
                    showNavButton: true,
                    navBackFunc: oController.navBack,
                    headerButton: new sap.m.FlexBox({
                        items: [
                            new sap.m.Button({
                                text: "{i18n>LABEL_47101}", // 저장
                                press: oController.onDialogBaseSaveBtn.bind(oController),
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
                                    oController.onSave("1000");
                                },
                                visible: {
                                    parts: [{ path: "Close" }, { path: "Status" }],
                                    formatter: function (fVal, fVal2) {
                                        return (fVal2 === "" && fVal !== "X") ? true : false;
                                    }
                                }
                            }).addStyleClass("button-dark"),
                            new sap.m.Button({
                                text: "{i18n>LABEL_47149}", // 삭제
                                press: oController.onDialogBaseDelBtn.bind(oController),
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
                    .bindElement("/Pop1/0"),
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
                            // 환자명
                            this.getLabel({ Text: "{i18n>LABEL_47009}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel1", {
                                    width: "100%",
                                    selectedKey: "{PatiName}",
                                    change: oController.changeSel,
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
                            // 관계
                            this.getLabel({ Text: "{i18n>LABEL_47010}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "100%",
                                    editable: false,
                                    maxLength: 13,
                                    value: "{RelationTx}",
                                    customData: new sap.ui.core.CustomData({ key: "Rel", value: "{Relation}" })
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 의료기관
                            this.getLabel({ Text: "{i18n>LABEL_47020}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Select(oController.PAGEID + "_dSel2", {
                                    width: "100%",
                                    selectedKey: "{HospType}",
                                    editable: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    },
                                    change: oController.changeSel2
                                }).addStyleClass("height38px")
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 의료기관명
                            this.getLabel({ Text: "{i18n>LABEL_47021}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    showValueHelp: true,
                                    width: "100%",
                                    valueHelpOnly: true,
                                    value: "{HospName}",
                                    valueHelpRequest: oController.onSearchMed,
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
                            // 사업자등록번호
                            this.getLabel({ Text: "{i18n>LABEL_47022}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.m.Input({
                                    width: "100%",
                                    editable: false,
                                    maxLength: 13,
                                    value: "{Comid}"
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 진료내용
                            this.getLabel({ Text: "{i18n>LABEL_47023}", Required: true }),
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
                            // 신청일
                            this.getLabel({ Text: "{i18n>LABEL_47024}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: new sap.ui.commons.TextView({
                                    text: {
                                        path: "Begda",
                                        type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
                                    },
                                    textAlign: "Center"
                                }).addStyleClass("FontFamily")
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 5대암 여부
                            this.getLabel({ Text: "{i18n>LABEL_47025}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    new sap.m.CheckBox(oController.PAGEID + "_Chk1", {
                                        selected: "{Chk1}",
                                        select: oController.onChk1,
                                        editable: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        }
                                    }),
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47002"));
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
                            // 난임 여부
                            this.getLabel({ Text: "{i18n>LABEL_47026}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    new sap.m.CheckBox(oController.PAGEID + "_Chk2", {
                                        selected: "{Chk2}",
                                        select: oController.onChk2,
                                        editable: {
                                            parts: [{ path: "Close" }, { path: "Status" }],
                                            formatter: function (fVal, fVal2) {
                                                return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                            }
                                        }
                                    }),
                                    new HoverIcon({
                                        src: "sap-icon://information",
                                        hover: function (oEvent) {
                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47003"));
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
                            // 비고
                            this.getLabel({ Text: "{i18n>LABEL_47027}", Required: false }),
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
                            // 치과(보철) 회사 양식
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: [
                                    new sap.ui.core.HTML({ content: "<a target='_blank' href='ZUI5_HR_MedApply/manual/MedApplyWay.pptx' style='font-size:14px;color:#0070bd !important;' download>" + oController.getBundleText("LABEL_47150") + "</a>" }),    // 의료비 신청 예시
                                    new sap.m.Text({ text: "│" }).addStyleClass("ml-0 mnw-0 font-14px color-blue"),
                                    new sap.ui.core.HTML({ content: "<a target='_blank' href='ZUI5_HR_MedApply/manual/MedApplyCalc.xls' style='font-size:14px;color:#0070bd !important;padding-right:15px;' download>" + oController.getBundleText("LABEL_47143") + "</a>" })    // 치과(보철) 회사 양식
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.ui.core.HTML({
                                    content: "<div style='height:10px;'/>"
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 급여 내역
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.ui.core.HTML({
                                    content: "<span class='med-subtitle'>" + oController.getBundleText("LABEL_47102") + "</span>"
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.ui.core.HTML({
                                    content: "<div style='height:10px;'/>"
                                })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 본인부담금
                            this.getLabel({ Text: "{i18n>LABEL_47037}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Id: "_Inp1", Path: "{Zkibbm}", Close: "{Close}", Status: "{Status}"}),
                                    this.getOnlyMoneyInput2(oController, { Path: "{Zkiobd}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 전액본인부담
                            this.getLabel({ Text: "{i18n>LABEL_47087}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Id: "_Inp2", Path: "{Zkijbm}", Close: "{Close}", Status: "{Status}"}),
                                    this.getOnlyMoneyInput2(oController, { Path: "{Zkijbd}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.ui.core.HTML({ content: "<div style='height:10px;'/>" })
                            })
                        ]
                    }),
                    // 비급여 내역
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.ui.core.HTML({ content: "<span class='med-subtitle'>" + oController.getBundleText("LABEL_47103") + "</span>" })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.ui.core.HTML({ content: "<div style='height:10px;'/>" })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // (입원)진찰료
                            this.getLabel({ Text: "{i18n>LABEL_47119}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Id: "_Inp3", Path: "{Znijcm}", Close: "{Close}", Status: "{Status}"}),
                                    this.getOnlyMoneyInput2(oController, { Path: "{Znijcd}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // (입원)입원료
                            this.getLabel({ Text: "{i18n>LABEL_47120}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Id: "_Inp4", Path: "{Zniiwm}", Close: "{Close}", Status: "{Status}"}),
                                    this.getOnlyMoneyInput2(oController, { Path: "{Zniiwd}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // (입원)식대
                            this.getLabel({ Text: "{i18n>LABEL_47121}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Id: "_Inp5", Path: "{Znisdm}", Close: "{Close}", Status: "{Status}"}),
                                    this.getOnlyMoneyInput2(oController, { Path: "{Znisdd}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // (입원)CT/MRI/초음파
                            this.getLabel({ Text: "{i18n>LABEL_47122}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Id: "_Inp6", Path: "{Znoctm}", Close: "{Close}", Status: "{Status}"}),
                                    this.getOnlyMoneyInput2(oController, { Path: "{Znoctd}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // (외래)선택진료료
                            this.getLabel({ Text: "{i18n>LABEL_47123}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Id: "_Inp7", Path: "{Znomrm}", Close: "{Close}", Status: "{Status}"}),
                                    this.getOnlyMoneyInput2(oController, { Path: "{Znomrd}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // (외래)CT/MRI/초음파
                            this.getLabel({ Text: "{i18n>LABEL_47124}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Id: "_Inp8", Path: "{Znocum}", Close: "{Close}", Status: "{Status}"}),
                                    this.getOnlyMoneyInput2(oController, { Path: "{Znocud}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // (외래)보철/기타
                            this.getLabel({ Text: "{i18n>LABEL_47125}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Id: "_Inp9", Path: "{Znobcm}", Close: "{Close}", Status: "{Status}"}),
                                    this.getOnlyMoneyInput2(oController, { Path: "{Znobcd}", Editable: false })
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 총 수납금액
                            this.getLabel({ Text: "{i18n>LABEL_47013}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput2(oController, { Path: "{Mycharge}", Editable: false }) //
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 할인금액
                            this.getLabel({ Text: "{i18n>LABEL_47118}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput1(oController, { Path: "{Zdsctm}", Close: "{Close}", Status: "{Status}"})
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 총 지원대상금액
                            this.getLabel({ Text: "{i18n>LABEL_47049}", Required: true }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput2(oController, { Path: "{BaseAmt}", Editable: false }) //
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 회사 지원금액
                            this.getLabel({ Text: "{i18n>LABEL_47050}", Required: false }),
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                content: [
                                    this.getOnlyMoneyInput2(oController, { Path: "{SuppAmt}", Editable: false }) //
                                ]
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 잔여한도확인
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.m.Button({
                                    text: "{i18n>LABEL_47051}",
                                    visible: {
                                        parts: [{ path: "Close" }, { path: "Status" }],
                                        formatter: function (fVal, fVal2) {
                                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                                        }
                                    },
                                    press: function () {
                                        oController.onCal("1000");
                                    }
                                }).addStyleClass("button-light")
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 일반 질병 잔여 한도
                            this.getLabel({ Text: "{i18n>LABEL_47052}", Required: false }), //
                            this.getMoneyField("Zmedrl")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 5대암 잔여 한도
                            this.getLabel({ Text: "{i18n>LABEL_47053}", Required: false }), //
                            this.getMoneyField("Zfvcrl")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 난임 잔여 한도
                            this.getLabel({ Text: "{i18n>LABEL_47054}", Required: false }), //
                            this.getMoneyField("Ziftrl")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 치과(보철) 잔여 한도
                            this.getLabel({ Text: "{i18n>LABEL_47055}", Required: false }), //
                            this.getMoneyField("Zdbcrl")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                colSpan: 2,
                                content: new sap.ui.core.HTML({ content: "<div style='height:8px;'></div>" })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // * CT 진단료, MRI 진단료, 초음파 진단료는 진단서 혹은 소견서 증빙 필수 (치료 목적 확인) : 단, 임신 관련한 초음파 진단료는 비 지원<br/>* 치과(보철) 진료비는 보철 회사 양식 증빙 필수 : 단, 뼈 이식 수술 비용, 교정, 불소, 라미네이트 등은 비 지원
                            new MatrixLayoutCell({
                                colSpan: 2,
                                content: new sap.m.VBox({
                                    fitContainer: true,
                                    width: "100%",
                                    items: [
                                        new sap.m.Text({ text: "{i18n>MSG_47038}", textAlign: "Begin", width: "auto" }),
                                        new sap.m.Text({ text: "{i18n>MSG_47047}", textAlign: "Begin", width: "auto" }),
                                        new sap.m.Text({ text: "{i18n>MSG_47048}", textAlign: "Begin", width: "auto" })
                                    ]
                                }).addStyleClass("msgBox mt-20px")
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.ui.core.HTML({ content: "<div style='height:10px;'/>" })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.ui.core.HTML({ content: "<span class='med-subtitle'>" + oController.getBundleText("LABEL_47104") + "</span>" })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            new MatrixLayoutCell({
                                hAlign: "Begin",
                                colSpan: 2,
                                content: new sap.ui.core.HTML({ content: "<div style='height:10px;'/>" })
                            })
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 5대암
                            this.getLabel({ Text: "{i18n>LABEL_47107}", Required: false }), //
                            this.getFileField(oController, "001")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 난임
                            this.getLabel({ Text: "{i18n>LABEL_47105}", Required: false }), //
                            this.getFileField(oController, "002")
                        ]
                    }),
                    new MatrixLayoutRow({
                        cells: [
                            // 기타
                            this.getLabel({ Text: "{i18n>LABEL_47106}", Required: false }), //
                            this.getFileField(oController, "009")
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
                                    widths: ["130px"],
                                    rows: aMatrixRows
                                })
                            ]
                        })
                    ]
                }).addStyleClass("vbox-form-mobile");
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
                return new sap.m.Input(param.Id ? oController.PAGEID + param.Id : "", {
                    width: "45%",
                    textAlign: "End",
                    liveChange: oController.onLiveMoney,
                    maxLength: 13,
                    value: param.Path,
                    editable: {
                        parts: [{ path: param.Close }, { path: param.Status }],
                        formatter: function (fVal, fVal2) {
                            return ((fVal2 === "AA" || fVal2 === "88" || Common.checkNull(fVal2)) && fVal !== "X") ? true : false;
                        }
                    }
                });
            },

            getOnlyMoneyInput2: function (oController, param) {
                return new sap.m.Input(param.Id ? oController.PAGEID + param.Id : "", {
                    width: "45%",
                    textAlign: "End",
                    liveChange: oController.onLiveMoney,
                    maxLength: 13,
                    value: param.Path,
                    editable: param.Editable
                });
            },

            getMoneyField: function (vPath) {
                return new MatrixLayoutCell({
                    hAlign: "Begin",
                    content: new sap.m.Input({
                        width: "45%",
                        textAlign: "Right",
                        editable: false,
                        maxLength: 13,
                        value: {
                            path: vPath,
                            formatter: function (fVal) {
                                if (Common.checkNull(!fVal)) {
                                    return Common.numberWithCommas(fVal.replace(/\,/g, "")).trim();
                                }
                            }
                        }
                    })
                });
            },

            getFileField: function (oController, vFieldNum) {
                return new MatrixLayoutCell({
                    hAlign: "Begin",
                    content: COMMON_ATTACH_FILES.renderer(oController, vFieldNum)
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
