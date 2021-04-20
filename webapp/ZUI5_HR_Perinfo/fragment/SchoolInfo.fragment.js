sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.SchoolInfo", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                // 유형
                var oSlart = new sap.m.ComboBox({
                    selectedKey: "{Slart}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    change: function () {
                        oController.onChangeSlart();
                    }
                });
                // 국가
                var oCountry = new sap.m.ComboBox({
                    selectedKey: "{Sland}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    }
                });
                // 학위
                var oSlabs = new sap.m.ComboBox({
                    selectedKey: "{Slabs}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Slabs",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });
                // 학교명
                var oAusbi = new sap.m.ComboBox({
                    selectedKey: "{Ausbi}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    visible: {
                        path: "Slart",
                        formatter: function (v) {
                            if (v === "H4" || v === "H5" || v === "H6") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Ausbi",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });

                var oInsti = new sap.m.Input({
                    value: "{Insti}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    visible: {
                        path: "Slart",
                        formatter: function (v) {
                            if (v === "H4" || v === "H5" || v === "H6") return false;
                            else return true;
                        }
                    },
                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordScholarship", "Insti")
                });
                // 전공
                var oZzmajor = new sap.m.Input({
                    value: "{Zzmajor}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    visible: {
                        path: "Slart",
                        formatter: function (v) {
                            if (v === "H4" || v === "H5" || v === "H6") return false;
                            else return true;
                        }
                    }
                });

                var oSltp1 = new sap.m.ComboBox({
                    selectedKey: "{Sltp1}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Sltp",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    },
                    visible: {
                        path: "Slart",
                        formatter: function (v) {
                            if (v === "H4" || v === "H5" || v === "H6") return true;
                            else return false;
                        }
                    }
                });

                // 복수전공1
                var oMiny1 = new sap.m.ComboBox({
                    selectedKey: "{Miny1}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Sltp",
                        template: new sap.ui.core.Item({ key: "{Code}", text: "{Text}" })
                    }
                });
                // 복수전공2
                var oMiny2 = new sap.m.ComboBox({
                    selectedKey: "{Miny2}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    },
                    items: {
                        path: "/Sltp",
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
                                            oCountry.addItem(new sap.ui.core.Item({ key: data.NavCommonCodeList.results[i].Code, text: data.NavCommonCodeList.results[i].Text }));
                                        }
                                    }
                                },
                                error: function (oResponse) {
                                    Common.log(oResponse);
                                }
                            }
                        );
                    }),
                    Common.getPromise(function () {
                        $.app.getModel("ZHR_COMMON_SRV").create(
                            "/CommonCodeListHeaderSet",
                            {
                                IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                IMolga: oController.getView().getModel("session").getData().Molga,
                                ILangu: oController.getView().getModel("session").getData().Langu,
                                ICodeT: "999",
                                ICodty: "01",
                                NavCommonCodeList: []
                            },
                            {
                                async: false,
                                success: function (data) {
                                    if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                        for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                            oSlart.addItem(new sap.ui.core.Item({ key: data.NavCommonCodeList.results[i].Code, text: data.NavCommonCodeList.results[i].Text }));
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

                var oMatrix1 = new sap.ui.commons.layout.MatrixLayout({
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_19501}", required: true })], // 기간
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
                                                }),
                                                // new sap.m.Text({text : " ~ ", textAlign = "Center"}),
                                                new sap.m.DatePicker({
                                                    value: "{Endda}",
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
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_19502}", required: true })], // 유형
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oSlart]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02166}", required: true })], // 학교
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oAusbi, oInsti]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Label({
                                            text: "{i18n>LABEL_02170}",
                                            required: {
                                                path: "Slart",
                                                formatter: function (v) {
                                                    if (v === "H5" || v === "H6") return true;
                                                    else return false;
                                                }
                                            }
                                        })
                                    ], // 전공
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oZzmajor, oSltp1]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02168}", required: true })], // 학위
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oSlabs]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02231}" })], // 최종학력
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.CheckBox({
                                                    selected: "{Zzlmark}",
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
                                    vAlign: "Middle"
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_19334}", required: true })], // 국가
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
                            height: "10px",
                            cells: []
                        })
                    ]
                });

                var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37045}" })], // 전공논문
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Majth}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordScholarship", "Majth")
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37054}" })], // 학위번호
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Degno}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordScholarship", "Degno")
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37046}" })], // 지도교수
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Proff}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordScholarship", "Proff")
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37049}" })], // 전공1
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            content: [oMiny1]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37050}" })], // 전공2
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            content: [oMiny2]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37051}" })], // 학위번호1
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Degn1}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordScholarship", "Degno")
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37052}" })], // 학위번호2
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Degn2}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordScholarship", "Proff")
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37053}" })], // 변경사유
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Aprsn}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordScholarship", "Proff")
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
                    ],
                    visible: {
                        path: "Slart",
                        formatter: function (v) {
                            if (v === "H4" || v === "H5" || v === "H6") return true;
                            else return false;
                        }
                    }
                });

                var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
                    columns: 1,
                    width: "100%",
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)],
                                    hAlign: "Begin",
                                    vAlign: "Middle",
                                    colSpan: 4
                                })
                            ]
                        })
                    ]
                });

                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns: 3,
                    widths: ["10px", "", "10px"],
                    width: "100%",
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({}),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [oMatrix1],
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({}),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [oMatrix2],
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({}),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [oMatrix3],
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                })
                            ]
                        })
                    ]
                });

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1200px",
                    contentHeight: "",
                    draggable: false,
                    horizontalScrolling: false,
                    content: [oMatrix],
                    title: "{i18n>LABEL_02194}", // 학력사항
                    beforeClose: function () {
                        oController.PAGEID = "Perinfo"; // PAGE ID 변경 - 첨부파일 공통 사용 위함
                    },
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
                                oController.onSaveSchool(oController._SchoolJSonModel.getProperty("/Data/actMode"));
                            }
                        }),
                        new sap.m.Button({
                            type: "Default",
                            text: "{i18n>LABEL_06122}", // 닫기
                            press: function () {
                                oController.PAGEID = "Perinfo";
                                oDialog.close();
                            }
                        })
                    ]
                });

                oDialog.addStyleClass("sapUiSizeCompact");
                oDialog.setModel(oController._SchoolJSonModel);
                oDialog.bindElement("/Data");

                return oDialog;
            }
        });
    }
);
