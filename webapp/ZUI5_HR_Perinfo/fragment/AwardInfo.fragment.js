sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.AwardInfo", {
    /** Specifies the Controller belonging to this View.
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf fragment.SelectMassn
     */

    createContent: function (oController) {
        // 포상유형
        var oAwdtp = new sap.m.ComboBox({
            selectedKey: "{Awdtp}",
            editable: {
                path: "actMode",
                formatter: function (v) {
                    if (v === "2" || v === "3") return true;
                    else return false;
                }
            }
        });
        //포상사유
        var oZzcause = new sap.m.ComboBox({
            selectedKey: "{Zzcause}",
            editable: {
                path: "actMode",
                formatter: function (v) {
                    if (v === "2" || v === "3") return true;
                    else return false;
                }
            }
        });

        Promise.all([
            common.Common.getPromise(function () {
                $.app.getModel("ZHR_COMMON_SRV").create(
                    "/CommonCodeListHeaderSet",
                    {
                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                        IMolga: oController.getView().getModel("session").getData().Molga,
                        ILangu: oController.getView().getModel("session").getData().Langu,
                        ICodeT: "014",
                        ICodty: "06",
                        NavCommonCodeList: []
                    },
                    {
                        async: false,
                        success: function (data) {
                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                    oAwdtp.addItem(new sap.ui.core.Item({ key: data.NavCommonCodeList.results[i].Code, text: data.NavCommonCodeList.results[i].Text }));
                                }
                            }
                        },
                        error: function (oResponse) {
                            common.Common.log(oResponse);
                        }
                    }
                );
            }),
            common.Common.getPromise(function () {
                $.app.getModel("ZHR_COMMON_SRV").create(
                    "/CommonCodeListHeaderSet",
                    {
                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                        IMolga: oController.getView().getModel("session").getData().Molga,
                        ILangu: oController.getView().getModel("session").getData().Langu,
                        ICodeT: "015",
                        // ICodty : "02",
                        NavCommonCodeList: []
                    },
                    {
                        async: false,
                        success: function (data) {
                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                    oZzcause.addItem(new sap.ui.core.Item({ key: data.NavCommonCodeList.results[i].Code, text: data.NavCommonCodeList.results[i].Text }));
                                }
                            }
                        },
                        error: function (oResponse) {
                            common.Common.log(oResponse);
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
                            content: [new sap.m.Label({ text: "{i18n>LABEL_37078}", required: true })], // 포상일
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
                                                    if (v === "3") return true;
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
                            content: [new sap.m.Label({ text: "{i18n>LABEL_37079}", required: true })], // 포상유형
                            hAlign: "Center",
                            vAlign: "Middle"
                        }).addStyleClass("Label"),
                        new sap.ui.commons.layout.MatrixLayoutCell({
                            content: [
                                new sap.m.Toolbar({
                                    height: "45px",
                                    content: [oAwdtp]
                                }).addStyleClass("toolbarNoBottomLine")
                            ],
                            hAlign: "Begin",
                            vAlign: "Middle"
                        }).addStyleClass("Data"),
                        new sap.ui.commons.layout.MatrixLayoutCell({
                            content: [new sap.m.Label({ text: "{i18n>LABEL_37080}", required: true })], // 포상사유
                            hAlign: "Center",
                            vAlign: "Middle"
                        }).addStyleClass("Label"),
                        new sap.ui.commons.layout.MatrixLayoutCell({
                            content: [
                                new sap.m.Toolbar({
                                    height: "45px",
                                    content: [oZzcause]
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
                            content: [new sap.m.Label({ text: "{i18n>ZZREASON}" })], // 근거
                            hAlign: "Center",
                            vAlign: "Middle"
                        }).addStyleClass("Label"),
                        new sap.ui.commons.layout.MatrixLayoutCell({
                            content: [
                                new sap.m.Toolbar({
                                    height: "45px",
                                    content: [
                                        new sap.m.Input({
                                            value: "{Zzreason}",
                                            editable: {
                                                path: "actMode",
                                                formatter: function (v) {
                                                    if (v === "2" || v === "3") return true;
                                                    else return false;
                                                }
                                            },
                                            maxLength: common.Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordAward", "Zzreason")
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
                            content: [new sap.m.Label({ text: "{i18n>LABEL_37081}", required: true })], // 표창기관
                            hAlign: "Center",
                            vAlign: "Middle"
                        }).addStyleClass("Label"),
                        new sap.ui.commons.layout.MatrixLayoutCell({
                            content: [
                                new sap.m.Toolbar({
                                    height: "45px",
                                    content: [
                                        new sap.m.Input({
                                            value: "{Prins}",
                                            editable: {
                                                path: "actMode",
                                                formatter: function (v) {
                                                    if (v === "2" || v === "3") return true;
                                                    else return false;
                                                }
                                            },
                                            maxLength: common.Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordAward", "Prins")
                                        })
                                    ]
                                }).addStyleClass("toolbarNoBottomLine")
                            ],
                            hAlign: "Begin",
                            vAlign: "Middle"
                        }).addStyleClass("Data"),
                        new sap.ui.commons.layout.MatrixLayoutCell({
                            content: [new sap.m.Label({ text: "{i18n>LABEL_37082}" })], // 표창분류
                            hAlign: "Center",
                            vAlign: "Middle"
                        }).addStyleClass("Label"),
                        new sap.ui.commons.layout.MatrixLayoutCell({
                            content: [
                                new sap.m.Toolbar({
                                    content: [
                                        new sap.m.Input({
                                            value: "{Prtyp}",
                                            editable: {
                                                path: "actMode",
                                                formatter: function (v) {
                                                    if (v === "2" || v === "3") return true;
                                                    else return false;
                                                }
                                            },
                                            maxLength: common.Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordAward", "Prtyp")
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

        var oMainMatrix = new sap.ui.commons.layout.MatrixLayout({
            columns: 3,
            widths: ["10px", "", "10px"],
            width: "100%",
            rows: [
                new sap.ui.commons.layout.MatrixLayoutRow({
                    cells: [
                        new sap.ui.commons.layout.MatrixLayoutCell({}),
                        new sap.ui.commons.layout.MatrixLayoutCell({
                            content: [oMatrix],
                            hAlign: "Begin",
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
            content: [oMainMatrix],
            title: "{i18n>LABEL_18010}", // 포상
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
                        oController.onSaveAward(oController._AwardJSonModel.getProperty("/Data/actMode"));
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
        oDialog.setModel(oController._AwardJSonModel);
        oDialog.bindElement("/Data");

        return oDialog;
    }
});
