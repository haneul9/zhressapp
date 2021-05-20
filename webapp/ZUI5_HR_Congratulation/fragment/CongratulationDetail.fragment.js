sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Congratulation.fragment.CongratulationDetail", {
            createContent: function (oController) {

                var oStartDatePicker = new sap.m.DatePicker(oController.PAGEID + "_StartDatePicker", {
                    change: $.proxy(oController.onSelectBox, oController),
                    dateValue: "{StartDate}",
                    width: "200px",
                    valueFormat: "yyyy-MM-dd",
                    placeholder: "yyyy-mm-dd",
                    displayFormat: oController.getSessionInfoByKey("Dtfmt"),
                    editable: {
                        path: "Status",
                        formatter: function (v) {
                            if (!v || v === "AA") return true;
                            return false;
                        }
                    }
                });

                // 키보드 입력 방지
                oStartDatePicker.addDelegate(
                    {
                        onAfterRendering: function () {
                            oStartDatePicker.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oStartDatePicker
                );

                var oTypeComboBox = new sap.m.ComboBox(oController.PAGEID + "_Type", {
                    change: $.proxy(oController.onSelectBox, oController),
                    items: {
                        path: "/MultiBoxData",
                        template: new sap.ui.core.ListItem({
                            key: "{Code}",
                            text: "{Text}"
                        })
                    },
                    selectedKey: "{Type}",
                    width: "200px",
                    editable: {
                        path: "Status",
                        formatter: function (v) {
                            if (!v || v === "AA") return true;
                            return false;
                        }
                    }
                });

                // 키보드 입력 방지
                oTypeComboBox.addDelegate(
                    {
                        onAfterRendering: function () {
                            oTypeComboBox.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oTypeComboBox
                );

                var oBirthDayDate = new sap.m.DatePicker(oController.PAGEID + "_BirthDay", {
                    width: "200px",
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    dateValue: "{Fgbdt}",
                    displayFormat: oController.getSessionInfoByKey("Dtfmt"),
                    valueFormat: "yyyy-MM-dd",
                    placeholder: "yyyy-mm-dd",
                    editable: {
                        path: "Status",
                        formatter: function (v) {
                            if (!v || v === "AA") return true;
                            return false;
                        }
                    }
                }).addStyleClass("font-14px mt-3px");

                // 키보드 입력 방지
                oBirthDayDate.addDelegate(
                    {
                        onAfterRendering: function () {
                            oBirthDayDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                        }
                    },
                    oBirthDayDate
                );

                var applyBox = new sap.m.FlexBox(oController.PAGEID + "_applyBox", {
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({
                                    // 신청일
                                    text: "{i18n>LABEL_08005}",
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "120px",
                                    textAlign: "End"
                                }),
                                new sap.m.DatePicker(oController.PAGEID + "_ADate", {
                                    dateValue: "{Begda}",
                                    width: "200px",
                                    displayFormat: oController.getSessionInfoByKey("Dtfmt"),
                                    valueFormat: "yyyy-MM-dd",
                                    placeholder: "yyyy-mm-dd",
                                    editable: false
                                }),
                                new sap.m.FlexBox(oController.PAGEID + "_WarningMsg", {
                                    visible: {
                                        path: "/Bukrs",
                                        formatter: function (v) {
                                            if (v === "A100") return false;
                                            return true;
                                        }
                                    },
                                    items: [
                                        new sap.ui.core.Icon({
                                            src: "sap-icon://information",
                                            color: "#da291c"
                                        }).addStyleClass("color-icon-blue ml-15px mt-8px"),
                                        new sap.m.Text({
                                            // 경고 문자
                                            text: "{i18n>MSG_08113}",
                                            textAlign: "Begin"
                                        }).addStyleClass("ml-3px mt-9px")
                                    ]
                                })
                            ]
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label(oController.PAGEID + "_StartD", {
                                    // 경조일
                                    text: "{i18n>LABEL_08008}",
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "120px",
                                    required: true,
                                    textAlign: "End"
                                }),
                                oStartDatePicker,
                                new sap.m.FlexBox(oController.PAGEID + "_StartDateIconText", {
                                    items: [
                                        new sap.ui.core.Icon({
                                            src: "sap-icon://information",
                                            color: "#da291c"
                                        }).addStyleClass("color-icon-blue ml-15px mt-8px"),
                                        new sap.m.Text({
                                            // 경고 문자
                                            text: "{i18n>MSG_08112}",
                                            textAlign: "Begin"
                                        }).addStyleClass("ml-3px mt-9px")
                                    ],
                                    visible: false
                                })
                            ]
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox({
                            items: [
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Label({
                                            text: "{i18n>LABEL_08007}",
                                            layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                            width: "120px",
                                            required: true,
                                            textAlign: "End"
                                        }), // 대상자
                                        new sap.m.Input(oController.PAGEID + "_Zname", {
                                            value: "{Zname}",
                                            width: "200px",
                                            maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CongratulationApplyTableIn", "Zname", false),
                                            editable: {
                                                path: "Status",
                                                formatter: function (v) {
                                                    if (!v || v === "AA") return true;
                                                    return false;
                                                }
                                            }
                                        }).addStyleClass("pt-4px")
                                    ]
                                }),
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.ui.core.Icon({
                                            src: "sap-icon://information"
                                        }).addStyleClass("color-icon-blue ml-15px mt-8px"),
                                        new sap.m.Text({
                                            // 경고 문자
                                            text: "{i18n>MSG_08101}",
                                            textAlign: "Begin"
                                        }).addStyleClass("ml-6px mt-6px")
                                    ]
                                })
                            ]
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox(oController.PAGEID + "_BirthDayBox", {
                            visible: {
                                path: "Fgbdt",
                                formatter: function (v) {
                                    if (v) return true;
                                    return false;
                                }
                            },
                            items: [
                                new sap.m.Label({
                                    // 생년월일
                                    text: "{i18n>LABEL_08029}",
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "120px",
                                    required: true,
                                    textAlign: "End"
                                }),
                                oBirthDayDate
                            ]
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox({
                            items: [
                                new sap.m.FlexBox({
                                    items: [
                                        new sap.m.Label({
                                            // 경조 유형
                                            text: "{i18n>LABEL_08006}",
                                            layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                            width: "120px",
                                            required: true,
                                            textAlign: "End"
                                        }),
                                        oTypeComboBox.addStyleClass("pt-4px")
                                    ]
                                }),
                                new sap.m.CheckBox(oController.PAGEID + "_TypeCheck", {
                                    text: "{i18n>LABEL_08026}", //상조도우미 사용
                                    select: $.proxy(oController.onCheckPress, oController),
                                    selected: {
                                        path: "Fmaid",
                                        formatter: function (v) {
                                            if (v === "X") return true;
                                            return false;
                                        }
                                    },
                                    visible: {
                                        parts: [{ path: "isVisibleType" }, { path: "/Bukrs" }],
                                        formatter: function (v1, v2) {
                                            if (v1 === true && v2 !== "A100") return true;
                                            else return false;
                                        }
                                    }
                                }).addStyleClass("ml-4px"),
                                new sap.m.CheckBox(oController.PAGEID + "_VehicleCheck", {
                                    text: "{i18n>LABEL_08028}", //차량지원 사용
                                    selected: {
                                        path: "Caaid",
                                        formatter: function (v) {
                                            if (v === "X") return true;
                                            return false;
                                        }
                                    },
                                    visible: {
                                        parts: [{ path: "isVisibleVehicle" }, { path: "/Bukrs" }],
                                        formatter: function (v1, v2) {
                                            if (v1 === true && v2 !== "A100") return true;
                                            else return false;
                                        }
                                    }
                                }).addStyleClass("ml-4px")
                            ]
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox(oController.PAGEID + "_BasicBox", {
                            items: [
                                new sap.m.Label({
                                    // 기본급
                                    text: "{i18n>LABEL_08010}",
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "120px",
                                    textAlign: "End"
                                }),
                                new sap.m.Text(oController.PAGEID + "_BasicT", {
                                    text: "{BasicT}",
                                    textAlign: "End",
                                    width: "200px"
                                }),
                                new sap.m.Label({
                                    // 경조율
                                    text: "{i18n>LABEL_08011}",
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "120px",
                                    textAlign: "End"
                                }).addStyleClass("ml-30px"),
                                new sap.ui.commons.TextView(oController.PAGEID + "_Rate", {
                                    text: {
                                        path: "Rate",
                                        formatter: function (v) {
                                            if (v) {
                                                return Number(v) + "%";
                                            } else {
                                                return;
                                            }
                                        }
                                    },
                                    textAlign: "End",
                                    width: "120px"
                                }).addStyleClass("font-14px mt-12px mb-17px")
                            ]
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox(oController.PAGEID + "_AmountTBox", {
                            items: [
                                new sap.m.Label({
                                    // 경조 금액
                                    text: "{i18n>LABEL_08012}",
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "120px",
                                    textAlign: "End"
                                }),
                                new sap.m.Text(oController.PAGEID + "_AmountT", {
                                    text: "{AmountT}",
                                    textAlign: "End",
                                    width: "200px"
                                })
                            ]
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({
                                    // 경조 지역
                                    text: "{i18n>LABEL_08009}",
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "120px",
                                    textAlign: "End"
                                }),
                                new sap.m.Input(oController.PAGEID + "_Zarea", {
                                    value: "{Zarea}",
                                    textAlign: "Begin",
                                    width: "200px",
                                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CongratulationApplyTableIn", "Zarea", false),
                                    editable: {
                                        path: "Status",
                                        formatter: function (v) {
                                            if (!v || v === "AA") return true;
                                            return false;
                                        }
                                    }
                                })
                            ]
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({
                                    // 비고
                                    text: "{i18n>LABEL_08015}",
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "120px",
                                    textAlign: "End"
                                }),
                                new sap.m.Input(oController.PAGEID + "_Zbigo", {
                                    value: "{Zbigo}",
                                    textAlign: "Begin",
                                    width: "38em",
                                    maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CongratulationApplyTableIn", "Zbigo", false),
                                    editable: {
                                        path: "Status",
                                        formatter: function (v) {
                                            if (!v || v === "AA") return true;
                                            return false;
                                        }
                                    }
                                })
                            ]
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({
                                    // 처리결과
                                    text: "{i18n>LABEL_08016}",
                                    layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                                    width: "120px",
                                    textAlign: "End"
                                }),
                                new sap.m.Text(oController.PAGEID + "_StatusText", {
                                    text: "{StatusText}",
                                    width: "10em"
                                })
                            ],
                            visible: {
                                path: "Status",
                                formatter: function (v) {
                                    if (v) return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("search-field-group"),

                        new sap.m.FlexBox(oController.PAGEID + "_FileUpload", {
                            items: [sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)]
                        }).addStyleClass("pl-10px pr-10px")
                    ],
                    direction: "Column" //세로 정렬
                }).addStyleClass("search-inner-vbox");

                var oDialog = new sap.m.Dialog(oController.PAGEID + "_CongratulationDetail_Dialog", {
                    title: "{i18n>LABEL_08022}",
                    contentWidth: "850px",
                    contentHeight: "580px",
                    beforeOpen: oController.onBeforeOpenDetailDialog.bind(oController),
                    buttons: [
                        new sap.m.Button(oController.PAGEID + "_SaveBtn", {
                            press: $.proxy(oController.onPressSave, oController),
                            text: "{i18n>LABEL_08002}", // 저장
                            visible: {
                                path: "Status",
                                formatter: function (v) {
                                    if (v === "AA") return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("button-light") /*
					new sap.m.Button(oController.PAGEID + "_DelBtn", {
						press: $.proxy(oController.onPressDelete, oController),
						text: "{i18n>LABEL_08004}", // 삭제
						visible: {
							path: "Status",
							formatter: function (v) {
								if (v === "AA") return true;
								return false;
							}
						}
					}),*/,
                        new sap.m.Button(oController.PAGEID + "_RequestBtn", {
                            press: $.proxy(oController.onPressApply, oController),
                            text: "{i18n>LABEL_08001}", // 신청
                            visible: {
                                path: "Status",
                                formatter: function (v) {
                                    if (!v) return true;
                                    return false;
                                }
                            }
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            press: function () {
                                oController.onCheckedBox(); //체크박스 체크
                                oDialog.close();
                            },
                            text: {
                                // 취소
                                path: "Status",
                                formatter: function (v) {
                                    if (!v) return oController.getBundleText("LABEL_08004");
                                    return oController.getBundleText("LABEL_08027");
                                }
                            }
                        }).addStyleClass("button-delete")
                    ],
                    content: [applyBox]
                })
                    .addStyleClass("custom-dialog-popup")
                    .setModel(oController.DetailModel)
                    .bindElement("/FormData");

                return oDialog;
            }
        });
    }
);
