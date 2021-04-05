sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES"
    ],
    function (Common, ZHR_TABLES) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "Detail"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var DetailHandler = oController.getDetailHandler.call(oController);

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1300px",
                    contentHeight: "96vh",
                    title: "{i18n>LABEL_31022}",    // 대체근무 신청
                    afterOpen: DetailHandler.load.bind(DetailHandler),
                    content: [
                        // this.buildActionButtons(DetailHandler), //
                        this.buildApprovalStatusBox(DetailHandler),
                        this.buildTemplateBox(DetailHandler),
                        this.buildTableBox(oController, DetailHandler)
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00152}", // 신청
                            press: DetailHandler.pressApprovalBtn.bind(DetailHandler),
                            visible: "{= !${/IsNew} || !${/IsViewMode}}"
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00194}", // 신청취소
                            press: DetailHandler.pressCancelApprovalBtn.bind(DetailHandler),
                            visible: "{= !${/IsNew} || (!${/IsViewMode} && ${/IsPossibleApprovalCancel})}"
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            type: sap.m.ButtonType.Default,
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-default custom-button-divide")
                    ]
                })
                .addStyleClass("custom-dialog-popup")
                .setModel(DetailHandler.Model());

                return oDialog;
            },

            buildApprovalStatusBox: function(DetailHandler) {
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.HBox({
                        items: [
                            new sap.m.VBox({
                                width: "50%",
                                items: [
                                    new sap.m.HBox({
                                        visible: {
                                            path: "/ApprInfo/Appkey1",
                                            formatter: function(v) {
                                                return Common.checkNull(v) ? false : true;
                                            }
                                        },
                                        items: [
                                            this.getLabel("{i18n>LABEL_31015}", false), // 결재번호
                                            new sap.m.Link({
                                                width: "300px",
                                                text: "{/ApprInfo/Appkey1}",
                                                textAlign: "Center",
                                                press: DetailHandler.pressAppkeyLink.bind(DetailHandler),
                                                customData: [ 
                                                    new sap.ui.core.CustomData({ key: "Url", value: "{/ApprInfo/EAppurl}" }) 
                                                ]
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel("{i18n>LABEL_31017}", false), // 신청자
                                            new sap.m.Text({
                                                width: "300px",
                                                text: "{/ApprInfo/Appcnt}"
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        visible: {
                                            path: "/ApprInfo/Rejtx",
                                            formatter: function(v) {
                                                return Common.checkNull(v) ? false : true;
                                            }
                                        },
                                        items: [
                                            this.getLabel("{i18n>LABEL_31018}", false), // 반려사유
                                            new sap.m.Text({
                                                width: "300px",
                                                text: "{/ApprInfo/Rejtx}"
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
                                        visible: {
                                            path: "/ApprInfo/Appkey1",
                                            formatter: function(v) {
                                                return Common.checkNull(v) ? false : true;
                                            }
                                        },
                                        items: [
                                            this.getLabel("{i18n>LABEL_31014}", false), // 진행상태
                                            new sap.m.Text({
                                                width: "250px",
                                                text: "{/ApprInfo/Status1Txt}"
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group"),
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel("{i18n>LABEL_31016}", false), // 신청일
                                            new sap.m.Text({
                                                width: "250px",
                                                text: {
                                                    path: "/ApprInfo/Appdt",
                                                    formatter: function(v) {
                                                        return v ? Common.DateFormatter(v) : "";
                                                    }
                                                }
                                            })
                                        ]
                                    })
                                    .addStyleClass("search-field-group")
                                ]
                            }).addStyleClass("search-inner-vbox")
                        ]
                    }).addStyleClass("search-box h-auto p-0")
                }).addStyleClass("custom-panel");
            },

            buildTemplateBox: function (DetailHandler) {

                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    visible: "{= !${/IsViewMode}}",
                    content: new sap.m.HBox({
                        items: [
                            new sap.m.VBox({
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            new sap.m.Label({ text: "{i18n>LABEL_31005}" }), // 근무일정
                                            new sap.m.ComboBox({
                                                width: "220px",
                                                selectedKey: "{/TemplateData/Tprog}",
                                                items: {
                                                    path: "/Tprogs",
                                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                    templateShareable: true
                                                }
                                            }),
                                            new sap.m.Label({text: "{i18n>LABEL_31007}"}), // 대상기간
                                            new sap.m.DateRangeSelection({
                                                displayFormat: "{/Dtfmt}",
                                                minDate: "{/MinDate}",
                                                dateValue: "{/TemplateData/Begda}",
                                                secondDateValue: "{/TemplateData/Endda}",
                                                delimiter: "~",
                                                width: "210px"
                                            }),
                                            new sap.m.Label({text: "{i18n>LABEL_31019}"}), // 신청사유
                                            new sap.m.ComboBox({
                                                width: "140px",
                                                selectedKey: "{/TemplateData/Reqrs}",
                                                items: {
                                                    path: "/Reqrss",
                                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                    templateShareable: true
                                                }
                                            })
                                        ]
                                    }).addStyleClass("search-field-group custom-border-no")
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            new sap.m.Button({
                                                press: DetailHandler.pressApplyTemplateBtn.bind(DetailHandler),
                                                text: "{i18n>LABEL_31020}", // 적용
                                                enabled: "{/IsPossibleRowDelete}"
                                            }).addStyleClass("button-light")
                                        ]
                                    }).addStyleClass("button-group")
                                ]
                            })
                        ]
                    }).addStyleClass("search-box search-bg custom-bgBox mt-20px pb-7px h-auto")
                }).addStyleClass("custom-panel mt-20px");
            },

            buildTableBox: function (oController, DetailHandler) {
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.VBox({
                        width: "100%",
                        items: [
                            this.buildTableButtons(oController, DetailHandler), //
                            this.buildTable(oController, DetailHandler)
                        ]
                    })
                }).addStyleClass("custom-panel mt-20px");
            },

            buildTableButtons: function (oController, DetailHandler) {

                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    visible: "{= !${/IsViewMode}}",
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.HBox({
                                    alignItems: sap.m.FlexAlignItems.Center,
                                    visible: {
                                        path: "/InfoMessage",
                                        formatter: function(v) {
                                            return Common.checkNull(v) ? false : true;
                                        }
                                    },
                                    items: [
                                        new sap.ui.core.Icon({
                                            src : "sap-icon://information",
                                            size : "14px",
                                            color : "#0854a0"
                                        }).addStyleClass("mt-5px"),
                                        new sap.m.Text({ 
                                            text : "{/InfoMessage}" // 현재일 -${v}일 부터 신청 가능합니다.
                                        }).addStyleClass("ml-6px")
                                    ]
                                }).addStyleClass("mb--10px")
                            ]
                        }),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    text: "{i18n>LABEL_00183}", // 등록
                                    press: DetailHandler.pressAddBtn.bind(oController)
                                }).addStyleClass("button-light"),
                                new sap.m.Button("TableIn03-remove", {
                                    text: "{i18n>LABEL_00103}", // 삭제
                                    press: DetailHandler.pressDeleteBtn.bind(DetailHandler),
                                    enabled: "{/IsPossibleRowDelete}"
                                }).addStyleClass("button-delete")
                            ]
                        }).addStyleClass("button-group")
                    ]
                });
            },

            buildTable: function (oController, DetailHandler) {
                var oTable = new sap.ui.table.Table("TargetTable", {
                    width: "100%",
                    selectionMode: "{= ${/IsViewMode} ? 'None' : 'MultiToggle' }",
                    enableSelectAll: true,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 5,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 38,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}",
                    layoutData: new sap.m.FlexItemData({ maxWidth: "100%" })
                })
                .addStyleClass("mt-8px")
                .bindRows("/List");

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "7%" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "6%" },
                    { id: "Orgtx", label: "{i18n>LABEL_00155}" /* 부서 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "10%", align: "Begin" },
                    { id: "PGradeTxt", label: "{i18n>LABEL_00124}" /* 직급 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "7%" },
                    { id: "Begda", label: "{i18n>LABEL_31007}" /* 대상기간 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "21%", required: true, templateGetter: "getTargetDateRange", templateGetterOwner: DetailHandler },
                    { id: "Tprog", label: "{i18n>LABEL_31010}" /* 대체근무일정 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "15%", required: true, templateGetter: "getTprogComboBox", templateGetterOwner: DetailHandler },
                    { id: "Reqrs", label: "{i18n>LABEL_31019}" /* 신청사유 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "15%", required: true, templateGetter: "getReasonComboBox", templateGetterOwner: DetailHandler },
                    { id: "Reqtx", label: "{i18n>LABEL_31021}" /* 상세사유 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "15%", templateGetter: "getReasonInput", templateGetterOwner: DetailHandler }
                ]);

                return oTable;
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
