sap.ui.define(
    [
        "common/Common", //
        "../delegate/OvertimeWork"
    ],
    function (Common, OvertimeWork) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "Detail"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var PageHandler = oController.getPageHandler.call(oController);

                var oDialog = new sap.m.Dialog({
                    contentWidth: "800px",
                    title: "{i18n>LABEL_32018}",    // 연장근무 신청
                    content: [
                        this.buildInfoBox(PageHandler) //
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00152}", // 신청
                            visible: "{= ${/Detail/Status1} === 'AA' ? true : false }",
                            press: PageHandler.pressApprovalBtn.bind(PageHandler)
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00103}", // 삭제
                            visible: "{= ${/Detail/Status1} === 'AA' ? true : false }",
                            press: PageHandler.pressCancelApprovalBtn.bind(PageHandler)
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-light")
                    ]
                })
                .addStyleClass("custom-dialog-popup")
                .setModel(PageHandler.Model());

                return oDialog;
            },

            buildInfoBox: function(PageHandler) {
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "400px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.HBox({
                        items: [
                            new sap.m.VBox({
                                width: "50%",
                                items: [
                                    new sap.m.HBox({
                                        height: "40px",
                                        items: [
                                            this.getLabel("{i18n>LABEL_32009}", false), // 근무일
                                            new sap.m.Text({ 
                                                text: {
                                                    path: "/Detail/Begda",
                                                    formatter: function(v) {
                                                        return Common.checkNull(v) ? "" : Common.DateFormatter(v);
                                                    }
                                                }
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        height: "40px",
                                        items: [
                                            this.getLabel("{i18n>LABEL_32019}", false), // 종류
                                            new sap.m.Text({ text: "{/Detail/Atext}" })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        height: "40px",
                                        items: [
                                            this.getLabel("{i18n>LABEL_32012}", false), // 작업내용
                                            new sap.m.Text({ 
                                                width: "520px",
                                                text: "{/Detail/Jobco}" 
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        height: "40px",
                                        items: [
                                            this.getLabel("{i18n>LABEL_32008}", false), // 진행상태
                                            new sap.m.Text({ 
                                                text: "{/Detail/Stext1}",
                                                visible: {
                                                    path: "/Detail/Status1",
                                                    formatter: function(v) {
                                                        return v === OvertimeWork.Approval.NONE ? true : false;
                                                    }
                                                }
                                            }),
                                            new sap.m.Link({
                                                text: "{/Detail/Stext1}",
                                                press: PageHandler.pressSmoinLink.bind(PageHandler),
                                                visible: {
                                                    path: "/Detail/Status1",
                                                    formatter: function(v) {
                                                        return v === OvertimeWork.Approval.NONE ? false : true;
                                                    }
                                                },
                                                customData: [
                                                    new sap.ui.core.CustomData({key : "url", value : "{/Detail/UrlA1}"})
                                                ]
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group")
                                ]
                            }).addStyleClass("search-inner-vbox"),
                            new sap.m.VBox({
                                width: "50%",
                                items: [
                                    new sap.m.HBox({
                                        height: "40px",
                                        items: [
                                            this.getLabel("{i18n>LABEL_32014}", false), // 근무시간
                                            new sap.m.Text({ 
                                                text: {
                                                    parts: [
                                                        {path: "/Detail/Beguz"},
                                                        {path: "/Detail/Enduz"}
                                                    ],
                                                    formatter: function(v1, v2) {
                                                        if(!v1 || !v2) return "";
                                                        else return Common.timeFormatter(v1) + " ~ " + Common.timeFormatter(v2);
                                                    }
                                                }
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        height: "40px",
                                        items: [
                                            this.getLabel("{i18n>LABEL_32016}", false), // 대상자(부서)
                                            new sap.m.Text({ text: "{/Detail/Repla}" })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        height: "40px",
                                        items: []
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        height: "40px",
                                        items: [
                                            this.getLabel("{i18n>LABEL_32013}", false), // 결재상태(담당부서)
                                            new sap.m.Text({ text: "{/Detail/Stext}" })
                                        ]
                                    })
                                    .addStyleClass("search-field-group")
                                ]
                            }).addStyleClass("search-inner-vbox")
                        ]
                    }).addStyleClass("search-box panel-inner-box h-auto pt-5px pb-5px pl-0 pr-0")
                }).addStyleClass("custom-panel mt-6px");
            },

            getLabel: function(text, required) {

                return new sap.m.Label({
                    text: text,
                    width: "120px",
                    required: required,
                    design: sap.m.LabelDesign.Bold,
                    textAlign: sap.ui.core.TextAlign.Right,
                    vAlign: sap.ui.core.VerticalAlign.Middle
                });
            }
        });
    }
);
