/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common",
        "common/HoverIcon",
        "sap/m/InputBase",
        "../delegate/ViewTemplates",
        "common/ZHR_TABLES",
        "common/PickOnlyDatePicker"
    ],
    function (Common, HoverIcon, InputBase, ViewTemplates, ZHR_TABLES, PickOnlyDatePicker) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_DispatchLivingCost.fragment.CostApply", {
            createContent: function (oController) {
                var oLocationCombo1 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo1", {
                    // 파견지
                    width: "140px",
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
                    width: "140px",
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
                    width: "150px",
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
                    width: "150px",
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
                    width: "130px",
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
                    width: "90px",
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
                    width: "130px",
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
                    width: "90px",
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

                var oTopFlexBox = new sap.m.VBox({
                    layoutData: new sap.m.FlexItemData({ minWidth: "593px" }),
                    items: [
                        new sap.m.HBox({
                            width: "100%",
                            items: [
                                new sap.m.HBox({
                                    width: "57%",
                                    items: [
                                        ViewTemplates.getLabel("header", "{i18n>LABEL_59005}", "150px", "Right", true), // 파견지
                                        oLocationCombo1,
                                        new sap.ui.core.Icon({ src: "sap-icon://arrow-right" }).addStyleClass("ml-5px mr-5px "),
                                        oLocationCombo2,
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
                                }).addStyleClass("search-field-group"),
                                new sap.m.HBox({
                                    width: "43%",
                                    items: [
                                        ViewTemplates.getLabel("header", "{i18n>LABEL_59014}", "150px", "Right", true), // 신청일자
                                        new sap.m.Text({
                                            width: "180px",
                                            text: {
                                                path: "Begda",
                                                formatter: function (v) {
                                                    if (v) return Common.DateFormatter(moment(v).hours(10).toDate());
                                                }
                                            },
                                            textAlign: "Begin"
                                        })
                                    ]
                                }).addStyleClass("search-field-group")
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.HBox({
                            width: "100%",
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59006}", "150px", "Right", true), // 기혼/미혼 여부
                                new sap.m.RadioButtonGroup(oController.PAGEID + "_RadioGroup", {
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "250px",
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
                                }).addStyleClass("mr-91px"),
                                new sap.m.HBox({
                                    items: [
                                        ViewTemplates.getLabel("header", "{i18n>LABEL_59011}", "150px", "Right", true), // 발령일자
                                        new PickOnlyDatePicker(oController.PAGEID + "_AppDate", {
                                            width: "200px",
                                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
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
                                }).addStyleClass("search-field-group")
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.HBox({
                            width: "100%",
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59015}", "150px", "Right", true), // 원생활근거지
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    width: "715px",
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
                        }).addStyleClass("search-field-group"),
                        new sap.m.HBox({
                            width: "100%",
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59007}", "150px", "Right", true), // 교통비 지급 기준지
                                oLocationCombo3,
                                new sap.ui.core.Icon({ src: "sap-icon://arrow-right" }).addStyleClass("mx-5px"),
                                oLocationCombo4.addStyleClass("mr-5px"),
                                new sap.m.Text({
                                    text: "{i18n>MSG_59002}",
                                    textAlign: "Begin"
                                })
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.HBox({
                            width: "100%",
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59008}", "150px", "Right", true), // 숙소 계약기간
                                oRangYearsB,
                                oRangMonthB.addStyleClass("mx-5px"),
                                new sap.m.Text({
                                    text: "~"
                                }),
                                oRangYearsE.addStyleClass("mx-5px"),
                                oRangMonthE, // Zscsym Zsceym
                                new HoverIcon({
                                    src: "sap-icon://information",
                                    hover: function (oEvent) {
                                        Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_59008")); // 계약 시작일이 속하는 달부터 계약기간 개월 수까지
                                    },
                                    leave: function (oEvent) {
                                        Common.onPressTableHeaderInformation.call(oController, oEvent);
                                    }
                                }).addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue")
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.HBox({
                            width: "100%",
                            justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                            items: [
                                new sap.m.HBox({
                                    items: [
                                        ViewTemplates.getLabel("header", "{i18n>LABEL_59032}", "150px", "Right", true), // 보증금
                                        new sap.m.Input({
                                            textAlign: "End",
                                            width: "150px",
                                            maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zdpamt", false),
                                            liveChange: oController.getCost1.bind(oController),
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
                                }).addStyleClass("search-field-group"),
                                new sap.m.HBox({
                                    items: [
                                        ViewTemplates.getLabel("header", "{i18n>LABEL_59033}", "150px", "Right", true), // 월세
                                        new sap.m.Input({
                                            textAlign: "End",
                                            width: "150px",
                                            maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "DispatchApplyTableIn1", "Zmnamt", false),
                                            liveChange: oController.getCost2.bind(oController),
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
                                }).addStyleClass("search-field-group mr-65px")
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.HBox({
                            width: "100%",
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59016}", "150px", "Right"), // 비고
                                new sap.m.Input({
                                    textAlign: "Begin",
                                    width: "715px",
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
                        }).addStyleClass("search-field-group")
                    ]
                }).addStyleClass("search-inner-vbox");

                var oMidTable = new sap.ui.table.Table({
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    width: "auto",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                .addStyleClass("mt-8px")
                .setModel(oController.CostModel)
                .bindRows("/Data");

                ZHR_TABLES.makeColumn(oController, oMidTable, [
                    { id: "Ztrgym",  label: "{i18n>LABEL_59035}" /* 대상년월 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "25%", required: true, templateGetter: "getTargetDate" },
                    { id: "Zmnamt",  label: "{i18n>LABEL_59036}" /* 월세 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "auto", templateGetter: "getMoneyInput1" },
                    { id: "Zaeamt",  label: "{i18n>LABEL_59037}" /* 관리비 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "auto", templateGetter: "getMoneyInput2" },
                    { id: "Ztramt",  label: "{i18n>LABEL_59019}" /* 교통비 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "auto", templateGetter: "getMoneyInput3" },
                    { id: "Zdsamt",  label: "{i18n>LABEL_59038}" /* 보증금 지원 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "auto", templateGetter: "getMoneyInput4" },
                    { id: "Zetamt",  label: "{i18n>LABEL_59025}" /* 기타 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "auto", templateGetter: "getMoneyInput5" },
                    { id: "Zcoamt",  label: "{i18n>LABEL_59010}" /* 회사 지원금 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "auto", required: true, templateGetter: "getMoneyInput6" },
                    { id: "PayDate", label: "{i18n>LABEL_59039}" /* 지급년월 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "auto", templateGetter: "getPayDate"}
                ]);

                var oMidFlexBox = new sap.m.VBox({
                    width: "100%",
                    fitContainer: true,
                    items: [
                        new sap.m.HBox({
                            height: "auto",
                            fitContainer: true,
                            items: [
                                ViewTemplates.getLabel("header", "{i18n>LABEL_59034}", "150px", "Right"), // 증빙서류 안내
                                new sap.m.VBox({
                                    fitContainer: true,
                                    items: [
                                        new sap.m.Text({
                                            text: "{i18n>MSG_59028}",
                                            textAlign: "Begin"
                                        }),
                                        new sap.m.Text({
                                            text: "{i18n>MSG_59029}",
                                            textAlign: "Begin"
                                        }),
                                        new sap.m.Text({
                                            text: "{i18n>MSG_59030}",
                                            textAlign: "Begin"
                                        }).addStyleClass("ml-10px"),
                                        new sap.m.Text({
                                            text: "{i18n>MSG_59031}",
                                            textAlign: "Begin"
                                        }).addStyleClass("ml-10px")
                                    ]
                                })
                            ]
                        }).addStyleClass("search-field-group")
                    ]
                }).addStyleClass("search-inner-vbox mt-10px");

                var oBotFlexBox = new sap.m.HBox(oController.PAGEID + "_FilesBox", {
                    fitContainer: true,
                    items: [fragment.COMMON_ATTACH_FILES.renderer(oController, "001")]
                }).addStyleClass("mt-8px");

                var oDialog = new sap.m.Dialog({
                    title: "{i18n>LABEL_59013}", // 파견자 생활경비 신청
                    contentWidth: "980px",
                    contentHeight: "650px",
                    afterOpen: oController.onAfterCostApply.bind(oController),
                    buttons: [
                        new sap.m.Button({
                            press: oController.onDialogApplyBtn.bind(oController),
                            text: "{i18n>LABEL_59026}", // 신청,
                            visible: {
                                parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                formatter: function (v1, v2) {
                                    return !v1 || v2 === "X";
                                }
                            }
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            press: oController.onDialogSaveBtn.bind(oController),
                            text: "{i18n>LABEL_59029}", // 저장,
                            visible: {
                                parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                formatter: function (v1, v2) {
                                    return !v2 && v1 === "AA";
                                }
                            }
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            press: oController.onDialogDelBtn.bind(oController),
                            text: "{i18n>LABEL_59028}", // 삭제
                            visible: {
                                parts: [{ path: "Status" }, { path: "/MonExpenses" }],
                                formatter: function (v1, v2) {
                                    return !v2 && v1 === "AA";
                                }
                            }
                        }).addStyleClass("button-delete"),
                        new sap.m.Button({
                            press: function () {
                                oDialog.close();
                            },
                            text: "{i18n>LABEL_00133}" // 닫기
                        }).addStyleClass("button-default custom-button-divide")
                    ],
                    content: [oTopFlexBox, oMidTable, oMidFlexBox, oBotFlexBox]
                })
                    .setModel(oController.ApplyModel)
                    .bindElement("/FormData")
                    .addStyleClass("custom-dialog-popup");

                return oDialog;
            }
        });
    }
);
