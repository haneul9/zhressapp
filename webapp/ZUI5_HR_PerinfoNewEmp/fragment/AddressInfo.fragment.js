sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.AddressInfo", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                // 국가
                var oCountry = new sap.m.ComboBox({
                    selectedKey: "{Land1}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    change: oController.onChangeCountry
                });
                // 주소-시
                var oState = new sap.m.ComboBox({
                    selectedKey: "{State}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/State",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });

                Promise.all([
                    Common.getPromise(function () {
                        $.app.getModel("ZHR_COMMON_SRV").create(
                            "/CommonCodeListHeaderSet",
                            {
                                IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                IMolga: oController.getView().getModel("session").getData().Molga,
                                ILangu: oController.getView().getModel("session").getData().Langu,
                                ICodeT: "009",
                                NavCommonCodeList: []
                            },
                            {
                                async: false,
                                success: function (data) {
                                    if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                        for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                            if (data.NavCommonCodeList.results[i].Code == "KR") {
                                                oCountry.addItem(new sap.ui.core.Item({ key: data.NavCommonCodeList.results[i].Code, text: data.NavCommonCodeList.results[i].Text }));
                                                break;
                                            }
                                        }
                                        for (var j = 0; j < data.NavCommonCodeList.results.length; j++) {
                                            if (data.NavCommonCodeList.results[j].Code != "KR") {
                                                oCountry.addItem(new sap.ui.core.Item({ key: data.NavCommonCodeList.results[j].Code, text: data.NavCommonCodeList.results[j].Text }));
                                            }
                                        }
                                    }
                                },
                                error: function (oResponse) {
                                    Common.log(oResponse);
                                }
                            }
                        );
                    })
                ]);

                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns: 4,
                    widths: ["200px", "50%", "200px", "50%"],
                    width: "100%",
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "10px",
                            cells: []
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37022}" })], // 주소유형
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Text({
                                                    text: "{Stext}"
                                                })
                                            ]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37025}" })], // 변경일자
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.DatePicker({
                                                    value: "{Begda}",
                                                    valueFormat: "yyyy-MM-dd",
                                                    displayFormat: gDtfmt,
                                                    width: "150px",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    }
                                                })
                                            ]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02165}" })], // 국가
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oCountry]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02132}", required: true })], // 우편번호
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Pstlz}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    width: "200px",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoAddressTab", "Pstlz")
                                                }),
                                                new sap.m.Button({
                                                    text: "{i18n>LABEL_00104}", // 검색
                                                    visible: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    press: oController.onDisplaySearchZipcodeDialog
                                                    // press : function(){
                                                    // 	// window.open("https://www.epost.go.kr/search.RetrieveIntegrationNewZipCdList.comm", "", 'resizable=yes,height=600,widht=400');
                                                    // }
                                                }).addStyleClass("button-search")
                                            ]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_00168}", required: true })], // 주소
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                oState,
                                                new sap.m.ToolbarSpacer({ width: "15px" }),
                                                new sap.m.Text({ text: "{i18n>LABEL_37097}", width: "100px", textAlign: "Center" }), // 시/구/군
                                                new sap.m.Input({
                                                    value: "{Ort01}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoAddressTab", "Ort01")
                                                }),
                                                new sap.m.Text({ text: "{i18n>LABEL_37028}", width: "100px", textAlign: "Center" }), // 동/읍/명
                                                new sap.m.Input({
                                                    value: "{Ort02}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoAddressTab", "Ort02")
                                                })
                                            ]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02175}", required: true })], // 상세주소
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Stras}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoAddressTab", "Stras")
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 3
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_PhonRow", {
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37024}" })], // 내선번호
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{UsridLong}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    width: "300px",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoAddressTab", "UsridLong")
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37023}", required: true })], // 핸드폰번호
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Usrid}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    width: "300px",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoAddressTab", "Usrid")
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_00165}", required: true })], // 전화번호
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Telnr}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    width: "300px",
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_INFO_SRV", "PerinfoAddressTab", "Telnr")
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 3
                                }).addStyleClass("Data")
                            ]
                        }),

                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "10px",
                            cells: []
                        })
                    ]
                }).addStyleClass("px-5px");

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1200px",
                    contentHeight: "",
                    draggable: false,
                    horizontalScrolling: false,
                    content: [oMatrix],
                    title: "{i18n>LABEL_37009}", // 주소정보
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            visible: {
                                path: "actMode",
                                formatter: function (v) {
                                    if (v === "2" || v === "3") return true;
                                    else return false;
                                }
                            },
                            press: function () {
                                oController.onSaveAddress(oController._AddressJSonModel.getProperty("/Data/actMode"));
                            }
                        }),
                        new sap.m.Button({
                            type: "Default",
                            text: "{i18n>LABEL_06122}", // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        })
                    ]
                });

                oDialog.addStyleClass("sapUiSizeCompact");
                oDialog.setModel(oController._AddressJSonModel);
                oDialog.bindElement("/Data");

                return oDialog;
            }
        });
    }
);
