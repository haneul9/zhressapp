sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.CareerInfo", {
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_37073}", required: true })], // 근무기간
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
                                                new sap.m.Text({ text: "~", textAlign: "Center" }),
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
                                    vAlign: "Middle",
                                    colSpan: 3
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_00166}", required: true })], // 회사
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Arbgb}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordCareer", "Arbgb")
                                                })
                                            ]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_02214}", required: true })], // 근무지
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Ort01}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordCareer", "Ort01")
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_19334}" })], // 국가
                                    hAlign: "Center",
                                    vAlign: "Middle",
                                    required: true
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oCountry]
                                        }).addStyleClass("toolbarNoBottomLine")
                                    ],
                                    hAlign: "Begin",
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_20010}" })], // 직위
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Zztitle}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordCareer", "Zztitle")
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_18050}", required: true })], // 담당업무
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
                                                new sap.m.Input({
                                                    value: "{Zzjob}",
                                                    editable: {
                                                        path: "actMode",
                                                        formatter: function (v) {
                                                            if (v === "2" || v === "3") return true;
                                                            else return false;
                                                        }
                                                    },
                                                    maxLength: Common.getODataPropertyLength("ZHR_PERS_RECORD_SRV", "PerRecordCareer", "Zzjob")
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
                    content: [oMainMatrix],
                    horizontalScrolling: false,
                    title: "{i18n>LABEL_02195}", // 경력사항
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
                                oController.onSaveCareer(oController._CareerJSonModel.getProperty("/Data/actMode"));
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
                oDialog.setModel(oController._CareerJSonModel);
                oDialog.bindElement("/Data");

                return oDialog;
            }
        });
    }
);
