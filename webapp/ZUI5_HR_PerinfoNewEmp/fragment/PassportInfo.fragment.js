sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.PassportInfo", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
                // 유형
                var oDocType = new sap.m.ComboBox({
                    selectedKey: "{DocType}",
                    editable: {
                        path: "actMode",
                        formatter: function (v) {
                            if (v === "2" || v === "3") return true;
                            else return false;
                        }
                    }
                });
                // 국가
                var oDocCountry = new sap.m.ComboBox({
                    selectedKey: "{DocCountry}",
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
                                ICodeT: "003",
                                ICodty: "702",
                                NavCommonCodeList: []
                            },
                            {
                                async: false,
                                success: function (data) {
                                    if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                        for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                            oDocType.addItem(new sap.ui.core.Item({ key: data.NavCommonCodeList.results[i].Code, text: data.NavCommonCodeList.results[i].Text }));
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
                                ICodeT: "009",
                                // ICodty : "02",
                                NavCommonCodeList: []
                            },
                            {
                                async: false,
                                success: function (data) {
                                    if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                        for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                            oDocCountry.addItem(new sap.ui.core.Item({ key: data.NavCommonCodeList.results[i].Code, text: data.NavCommonCodeList.results[i].Text }));
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_18026}" })], // 유형
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oDocType]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_19645}" })], // 국가
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [oDocCountry]
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
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_30009}" })], // 시작일
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
                                    vAlign: "Middle"
                                }).addStyleClass("Data"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Label({ text: "{i18n>LABEL_30010}" })], // 종료일
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }).addStyleClass("Label"),
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
                                        new sap.m.Toolbar({
                                            height: "45px",
                                            content: [
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
                                }).addStyleClass("Data")
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "10px",
                            cells: []
                        })
                    ]
                });

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1200px",
                    contentHeight: "",
                    draggable: false,
                    horizontalScrolling: false,
                    content: [oMatrix],
                    title: "{i18n>LABEL_37044}", // 여권/비자관리
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
                                oController.onSavePassport(oController._PassportJSonModel.getProperty("/Data/actMode"));
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
                oDialog.setModel(oController._PassportJSonModel);
                oDialog.bindElement("/Data");

                return oDialog;
            }
        });
    }
);
