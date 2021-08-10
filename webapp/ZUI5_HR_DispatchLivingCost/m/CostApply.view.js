sap.ui.define(
    [
        "common/Common",
        "common/PageHelper",
        "common/PickOnlyDatePicker",
        "../delegate/ViewTemplates",
        "common/HoverIcon",
        "sap/m/InputBase"
    ],
    function (Common, PageHelper, PickOnlyDatePicker, ViewTemplates, HoverIcon, InputBase) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "CostApply"].join($.app.getDeviceSuffix());

        sap.ui.jsview(SUB_APP_ID, {
            getControllerName: function () {
                return SUB_APP_ID;
            },

            createContent: function (oController) {
                return new PageHelper({
                    idPrefix: "CostApply-",
                    // title: "{i18n>LABEL_59013}", // 파견자 생활경비 신청
                    showNavButton: true,
                    navBackFunc: oController.navBack,
                    headerButton: new sap.m.HBox({
                        items: [
                            new sap.m.Button({
                                press: oController.onDialogSaveBtn.bind(oController),
                                text: "{i18n>LABEL_59029}", // 저장
                                visible: {
                                    parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                    formatter: function (v1, v2) {
                                        return !v2 && v1 === "AA";
                                    }
                                }
                            }).addStyleClass("button-light"),
                            new sap.m.Button({
                                press: oController.onDialogApplyBtn.bind(oController),
                                text: "{i18n>LABEL_59026}", // 신청
                                visible: {
                                    parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                    formatter: function (v1, v2) {
                                        return !v1 || v2 === "X";
                                    }
                                }
                            }).addStyleClass("button-dark"),
                            new sap.m.Button({
                                press: oController.onDialogDelBtn.bind(oController),
                                text: "{i18n>LABEL_59028}", // 삭제
                                visible: {
                                    parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                    formatter: function (v1, v2) {
                                        return !v2 && v1 === "AA";
                                    }
                                }
                            }).addStyleClass("button-light")
                        ]
                    }).addStyleClass("app-nav-button-right"),
                    contentStyleClass: "sub-app-content",
                    contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                    contentItems: [this.ApplyingBox(oController)]
                })
                    .setModel(oController.ApplyModel)
                    .bindElement("/FormData");
            },

            ApplyingBox: function (oController) {
                var oLocationCombo1 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo1", {
                    // 파견지
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    width: "100%",
                    change: oController.checkLocation1.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/LocationCombo1",
                        template: new sap.ui.core.ListItem({
                            key: "{Subcd}",
                            text: "{Subtx1}"
                        })
                    },
                    selectedKey: "{Zfwkps}"
                });

                // 키보드 입력 방지
                oLocationCombo1.addDelegate(
                    {
                        onAfterRendering: function () {
                            oLocationCombo1.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oLocationCombo1
                );

                var oLocationCombo2 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo2", {
                    // 파견지
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    width: "97%",
                    change: oController.checkLocation2.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/LocationCombo2",
                        template: new sap.ui.core.ListItem({
                            key: "{Subcd}",
                            text: "{Subtx1}"
                        })
                    },
                    selectedKey: "{Ztwkps}"
                });

                // 키보드 입력 방지
                oLocationCombo2.addDelegate(
                    {
                        onAfterRendering: function () {
                            oLocationCombo2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oLocationCombo2
                );

                var oLocationCombo3 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo3", {
                    // 기준지
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    width: "100%",
                    change: oController.checkLocation3.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/LocationCombo3",
                        template: new sap.ui.core.ListItem({
                            key: "{Subcd}",
                            text: "{Subtx1}"
                        })
                    },
                    selectedKey: "{Zwkpls}"
                });

                // 키보드 입력 방지
                oLocationCombo3.addDelegate(
                    {
                        onAfterRendering: function () {
                            oLocationCombo3.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oLocationCombo3
                );

                var oLocationCombo4 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo4", {
                    // 기준지
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    width: "100%",
                    change: oController.checkLocation4.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/LocationCombo4",
                        template: new sap.ui.core.ListItem({
                            key: "{Subcd}",
                            text: "{Subtx1}"
                        })
                    },
                    selectedKey: "{Zlfpls}"
                });

                // 키보드 입력 방지
                oLocationCombo4.addDelegate(
                    {
                        onAfterRendering: function () {
                            oLocationCombo4.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oLocationCombo4
                );

                var oRangYearsB = new sap.m.ComboBox({
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    width: "100%",
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/RangYearsB",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    selectedKey: "{RangYearB}"
                });

                // 키보드 입력 방지
                oRangYearsB.addDelegate(
                    {
                        onAfterRendering: function () {
                            oRangYearsB.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oRangYearsB
                );

                var oRangMonthB = new sap.m.ComboBox({
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    width: "95%",
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/RangMonthB",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    selectedKey: "{RangMonthB}"
                });

                // 키보드 입력 방지
                oRangMonthB.addDelegate(
                    {
                        onAfterRendering: function () {
                            oRangMonthB.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oRangMonthB
                );

                var oRangYearsE = new sap.m.ComboBox({
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    width: "100%",
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/RangYearsE",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    selectedKey: "{RangYearsE}"
                });

                // 키보드 입력 방지
                oRangYearsE.addDelegate(
                    {
                        onAfterRendering: function () {
                            oRangYearsE.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oRangYearsE
                );

                var oRangMonthE = new sap.m.ComboBox({
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    width: "95%",
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/RangMonthE",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    selectedKey: "{RangMonthE}"
                });

                // 키보드 입력 방지
                oRangMonthE.addDelegate(
                    {
                        onAfterRendering: function () {
                            oRangMonthE.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oRangMonthE
                );

                var oTargetYears = new sap.m.ComboBox({
                    width: "100%",
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    change: oController.TargetYears.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return v2 === "X" || Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/TargetYears",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    selectedKey: "{TargetYears}"
                });

                // 키보드 입력 방지
                oTargetYears.addDelegate(
                    {
                        onAfterRendering: function () {
                            oTargetYears.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oTargetYears
                );

                var oTargetMonth = new sap.m.ComboBox({
                    width: "auto",
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    change: oController.TargetMonth.bind(oController),
                    editable: {
                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                        formatter: function (v1, v2) {
                            return v2 === "X" || Common.checkNull(v2) && (!v1 || v1 === "AA");
                        }
                    },
                    items: {
                        path: "/TargetMonth",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    selectedKey: "{TargetMonth}"
                });

                // 키보드 입력 방지
                oTargetMonth.addDelegate(
                    {
                        onAfterRendering: function () {
                            oTargetMonth.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oTargetMonth
                );

                return new sap.m.VBox({
                    items: [
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59005}", "105px", "Left", true).addStyleClass("sub-con-title"), // 파견지
                                oLocationCombo1,
                                new sap.ui.core.Icon({ src: "sap-icon://arrow-right" }).addStyleClass("mx-3px"),
                                oLocationCombo2
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59011}", "105px", "Left", true).addStyleClass("sub-con-title"), // 발령일자
                                new PickOnlyDatePicker(oController.PAGEID + "_AppDate", {
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    dateValue: "{Zactdt}",
                                    displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                    valueFormat: "yyyy-MM-dd",
                                    placeholder: "yyyy-mm-dd",
                                    editable: {
                                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                        formatter: function (v1, v2) {
                                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                                        }
                                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59006}", "105px", "Left", true).addStyleClass("sub-con-title"), // 기혼/미혼 여부
                                new sap.m.RadioButtonGroup(oController.PAGEID + "_RadioGroup", {
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "100%",
                                    editable: {
                                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                        formatter: function (v1, v2) {
                                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                                        }
                                    },
                                    columns: 2,
                                    select: oController.onChangeRadio.bind(oController),
                                    selectedIndex: 0,
                                    buttons: [
                                        new sap.m.RadioButton({
                                            text: "{i18n>LABEL_59030}", // 기혼
                                            width: "auto",
                                            selected: {
                                                path: "Zmuflg",
                                                formatter: function (v) {
                                                    return v === "1";
                                                }
                                            }
                                        }),
                                        new sap.m.RadioButton({
                                            text: "{i18n>LABEL_59031}", // 미혼
                                            width: "auto",
                                            selected: {
                                                path: "Zmuflg",
                                                formatter: function (v) {
                                                    return v === "2";
                                                }
                                            }
                                        })
                                    ]
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59015}", "105px", "Left", true).addStyleClass("sub-con-title"), // 거주지
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zadres", false),
                                    editable: {
                                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                        formatter: function (v1, v2) {
                                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                                        }
                                    },
                                    value: "{Zadres}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Label({
                                    // 교통비 지급 기준지
                                    text: "{i18n>LABEL_59007}",
                                    width: "105px",
                                    textAlign: "Left",
                                    required: true,
                                    wrapping: true
                                }),
                                oLocationCombo3,
                                new sap.ui.core.Icon({ src: "sap-icon://arrow-right" }).addStyleClass("mx-5px"),
                                oLocationCombo4
                            ]
                        }),
                        new sap.m.HBox({
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59008}", "105px", "Left", true).addStyleClass("sub-con-title"), // 숙소 계약기간
                                new sap.m.VBox({
                                    items: [
                                        new sap.m.HBox({
                                            height: "40px",
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            items: [oRangYearsB, oRangMonthB.addStyleClass("ml-5px")]
                                        }),
                                        new sap.m.HBox({
                                            height: "40px",
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            items: [new sap.m.Text({ text: "~" }), oRangYearsE, oRangMonthE.addStyleClass("ml-5px")]
                                        })
                                    ]
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59032}", "105px", "Left", true).addStyleClass("sub-con-title"), // 보증금
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    liveChange: oController.getCost1.bind(oController),
                                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zdpamt", false),
                                    editable: {
                                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                        formatter: function (v1, v2) {
                                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                                        }
                                    },
                                    value: {
                                        path: "Zdpamt",
                                        formatter: function(v) {
                                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                                        }
                                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59036}", "105px", "Left", true).addStyleClass("sub-con-title"), // 월세
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    liveChange: oController.getCost2.bind(oController),
                                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zmnamt", false),
                                    editable: {
                                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                        formatter: function (v1, v2) {
                                            return Common.checkNull(v2) && (!v1 || v1 === "AA");
                                        }
                                    },
                                    value: {
                                        path: "Zmnamt",
                                        formatter: function(v) {
                                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                                        }
                                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59016}", "105px", "Left", true).addStyleClass("sub-con-title"), // 비고
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Remark", false),
                                    editable: {
                                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                        formatter: function (v1, v2) {
                                            return v2 === "X" || Common.checkNull(v2) && (!v1 || v1 === "AA");
                                        }
                                    },
                                    value: "{Remark}"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            // height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59041}", "auto", "Left").addStyleClass("app-title"), // 월 생활경비 내역
                                new HoverIcon({
                                    src: "sap-icon://information",
                                    hover: function (oEvent) {
                                        Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_59003") + oController.getBundleText("MSG_59004") + oController.getBundleText("MSG_59005") + oController.getBundleText("MSG_59006") + oController.getBundleText("MSG_59007"));
                                    },
                                    leave: function (oEvent) {
                                        Common.onPressTableHeaderInformation.call(oController, oEvent);
                                    }
                                }).addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue")
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59035}", "105px", "Left", true).addStyleClass("sub-con-title"), // 대상년월
                                oTargetYears,
                                oTargetMonth.addStyleClass("ml-3px")
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59036}", "105px", "Left").addStyleClass("sub-con-title"), // 월세
                                new sap.m.Text({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    text: {
                                        path: "Zmnamt",
                                        formatter: function(v) {
                                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                                        }
                                    },
                                    textAlign: "Begin"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59037}", "105px", "Left", true).addStyleClass("sub-con-title"), // 관리비
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Ztramt", false),
                                    liveChange: oController.getCost3.bind(oController),
                                    editable: {
                                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                        formatter: function (v1, v2) {
                                            return v2 === "X" || Common.checkNull(v2) && (!v1 || v1 === "AA");
                                        }
                                    },
                                    value: {
                                        path: "Zaeamt",
                                        formatter: function(v) {
                                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                                        }
                                    }
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59019}", "105px", "Left").addStyleClass("sub-con-title"), // 교통비
                                new sap.m.Text({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    text: {
                                        path: "Ztramt",
                                        formatter: function(v) {
                                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                                        }
                                    },
                                    textAlign: "Begin"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59038}", "105px", "Left").addStyleClass("sub-con-title"), // 보증금지원
                                new sap.m.Text({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    text: {
                                        path: "Zdsamt",
                                        formatter: function(v) {
                                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                                        }
                                    },
                                    textAlign: "Begin"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59025}", "105px", "Left").addStyleClass("sub-con-title"), // 기타
                                new sap.m.Input({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zetamt", false),
                                    liveChange: oController.getCost4.bind(oController),
                                    width: "100%",
                                    editable: {
                                        parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                        formatter: function (v1, v2) {
                                            return v2 === "X" || Common.checkNull(v2) && (!v1 || v1 === "AA");
                                        }
                                    },
                                    value: {
                                        path: "Zetamt",
                                        formatter: function(v) {
                                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                                        }
                                    },
                                    textAlign: "Begin"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59010}", "105px", "Left").addStyleClass("sub-con-title"), // 회사지원금
                                new sap.m.Text({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    text: {
                                        path: "Zcoamt",
                                        formatter: function(v) {
                                            return Common.checkNull(v) ? "0" : Common.numberWithCommas(v);
                                        }
                                    },
                                    textAlign: "Begin"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            height: "40px",
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59039}", "105px", "Left").addStyleClass("sub-con-title"), // 지급년월
                                new sap.m.Text({
                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                    width: "100%",
                                    text: {
                                        path: "PayDate",
                                        formatter: function (v) {
                                            if (!v || v === "000000") return "";
                                            v = v.substr(0, 4) + "-" + v.substr(4);

                                            return v;
                                        }
                                    },
                                    textAlign: "Begin"
                                })
                            ]
                        }),
                        ViewTemplates.getLabel("header", "{i18n>LABEL_59034}", "auto", "Left").addStyleClass("app-title mt-10px"), // 증빙서류 안내
                        new sap.m.VBox({
                            height: "auto",
                            items: [
                                new sap.m.Text({
                                    text: "{i18n>MSG_59028}",
                                    textAlign: "Begin"
                                }).addStyleClass("line-height-24"),
                                new sap.m.Text({
                                    text: "{i18n>MSG_59029}",
                                    textAlign: "Begin"
                                }).addStyleClass("line-height-24"),
                                new sap.m.Text({
                                    text: "{i18n>MSG_59030}",
                                    textAlign: "Begin"
                                }).addStyleClass("line-height-24 ml-10px"),
                                new sap.m.Text({
                                    text: "{i18n>MSG_59031}",
                                    textAlign: "Begin"
                                }).addStyleClass("line-height-24 ml-10px")
                            ]
                        }),
                        new sap.m.HBox(oController.PAGEID + "_FileFlexBox", {
                            fitContainer: true,
                            items: [sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)]
                        }).addStyleClass("mt-8px")
                    ]
                }).addStyleClass("vbox-form-mobile");
            }
        });
    }
);
