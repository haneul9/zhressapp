/* eslint-disable no-undef */
sap.ui.define(
    [
        "../../common/Common", //
        "sap/m/InputBase",
        "../delegate/ViewTemplates"
    ],
    function (Common, InputBase, ViewTemplates) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "RequestDialog"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
             
                var oDialog = new sap.m.Dialog({
                    contentWidth: "1400px",
                    contentHeight: "225px",
                    title: "{i18n>LABEL_50001}",    // 일회성 지급/공제 신청
                    content: [
                        this.buildInfoBox(oController)
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00152}", // 신청
                            press: oController.onSave.bind(oController, "I")
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-default custom-button-divide")
                    ]
                })
                .addStyleClass("custom-dialog-popup")
                .setModel(oController._ApplyJSonModel)
                .bindElement("/Data");

                return oDialog;
            },

            buildInfoBox: function (oController) {

                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.VBox({
                        items: [
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        width: "50%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32025}", true), // 대상자
                                                    ViewTemplates.getCustomInput(oController.PAGEID +"_DetailEname", {
                                                        layoutData: new sap.m.FlexItemData({ growFactor: 0, minWidth: "170px" }),
                                                        customData: [
                                                            
                                                        ],
                                                        width : "170px",
                                                        fieldWidth: "170px",
                                                        value: "{Pernr}",
                                                        showValueHelp: true,
                                                        valueHelpOnly: true,
                                                        valueHelpRequest: oController.searchOrgehPernrByDetail.bind(oController)
                                                    }, oController.clearDetailEname.bind(oController))
                                                    .addStyleClass("field-min-width-50"),
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_50003}",true), // 임금유형
                                                    new sap.m.ComboBox({
                                                	    required: true,
														width: "100%",
														selectedKey: "{Lgart}",
														items: {
															path: "/Lgart",
															templateShareable: false,
															template: new sap.ui.core.ListItem({key: "{Lgart}", text: "{Lgtxt2}"})
														}
													}).addStyleClass("custom-select-time"),
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_19612}", true), // 금액
                                                    new sap.m.Input({
                                                        required: true,
                                                        width: "100%",
                                                        value: "{Betrg}",
                                                        change : common.Common.onChangeMoneyInput
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group"),
                                        ]
                                    }).addStyleClass("search-inner-vbox"),
                                    new sap.m.VBox({
                                        width: "50%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_50009}", false), // 성명
                                                    new sap.m.Text({
                                                        text: "{Ename}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_50004}", false), // 지급/공제일
                                                    new sap.m.Text({
                                                        text : "{Begda}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_50010}", true), // 통화키
                                                    new sap.m.ComboBox({
                                                        width: "100%",
                                                        selectedKey: "{Waers}",
                                                        items: {
                                                            path: "/Waers",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                    }).addStyleClass("custom-select-time"),
                                                ]
                                            }).addStyleClass("search-field-group"),
                                        ]
                                    }).addStyleClass("search-inner-vbox")
                                ]
                            }),
                            new sap.m.HBox({
                                items: [
                                    this.getLabel("{i18n>LABEL_34021}", false), // 비고
                                    new sap.m.Input({
                                    	layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                        width: "100%",
                                        value: "{Notes}",
                                    })
                                ]
                            }).addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("search-box h-auto p-0")
                }).addStyleClass("custom-panel");
            },

            getLabel: function(text, required, width) {

                return new sap.m.Label({
                    text: text,
                    width: width ? width : "120px",
                    required: required,
                    wrapping: true,
                    design: sap.m.LabelDesign.Bold,
                    textAlign: sap.ui.core.TextAlign.Right,
                    vAlign: sap.ui.core.VerticalAlign.Middle
                });
            }
        });
    }
);
