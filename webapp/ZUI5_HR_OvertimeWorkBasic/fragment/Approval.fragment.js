/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "common/PickOnlyDatePicker"
    ],
    function (Common, ZHR_TABLES, PickOnlyDatePicker) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "Approval"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var ApprovalHandler = oController.getApprovalHandler.call(oController);

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1400px",
                    contentHeight: "96vh",
                    title: "{i18n>LABEL_32066}",    // 연장근무 신청
                    afterOpen: ApprovalHandler.load.bind(ApprovalHandler),
                    content: [
                        this.buildTemplateBox(ApprovalHandler),
                        this.buildTableBox(oController, ApprovalHandler)
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00152}", // 신청
                            press: ApprovalHandler.pressApprovalBtn.bind(ApprovalHandler),
                            enabled: "{/IsPossibleRowDelete}"
                        }).addStyleClass("button-dark"),
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
                .setModel(ApprovalHandler.Model());

                return oDialog;
            },

            buildTemplateBox: function (ApprovalHandler) {

                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.HBox({
                        items: [
                            new sap.m.VBox("TemplateArea", {
                                width: "80%",
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel("{i18n>LABEL_32009}", false), // 근무일
                                            new PickOnlyDatePicker({ 
                                                dateValue: "{/TemplateData/Begda}",
                                                valueFormat: "yyyy-MM-dd",
                                                displayFormat: "{/Dtfmt}",
                                                width: "300px",
                                                change: ApprovalHandler.changeBegda.bind(ApprovalHandler)
                                            }),
                                            this.getLabel("{i18n>LABEL_32014}", false), // 근무시간
                                            new sap.m.Select({
                                                width: "65px",
                                                selectedKey: "{/TemplateData/BeguzT}",
                                                items: {
                                                    path: "/Hours",
                                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                    templateShareable: true
                                                },
                                                change: ApprovalHandler.checkTemplateControl.bind(ApprovalHandler)
                                            }).addStyleClass("custom-select-time"),
                                            new sap.m.Text({ text: ":" }).addStyleClass("mx-px"),
                                            new sap.m.Select({
                                                width: "65px",
                                                selectedKey: "{/TemplateData/BeguzM}",
                                                items: {
                                                    path: "/Minutes",
                                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                    templateShareable: true
                                                },
                                                change: ApprovalHandler.checkTemplateMinute.bind(ApprovalHandler)
                                            }).addStyleClass("custom-select-time"),
                                            new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
                                            new sap.m.Select({
                                                width: "65px",
                                                selectedKey: "{/TemplateData/EnduzT}",
                                                items: {
                                                    path: "/Hours",
                                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                    templateShareable: true
                                                },
                                                change: ApprovalHandler.checkTemplateControl.bind(ApprovalHandler)
                                            }).addStyleClass("custom-select-time"),
                                            new sap.m.Text({ text: ":" }).addStyleClass("mx-px"),
                                            new sap.m.Select({
                                                width: "65px",
                                                selectedKey: "{/TemplateData/EnduzM}",
                                                items: {
                                                    path: "/Minutes",
                                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                    templateShareable: true
                                                },
                                                change: ApprovalHandler.checkTemplateMinute.bind(ApprovalHandler)
                                            }).addStyleClass("custom-select-time")
                                        ]
                                    }).addStyleClass("search-field-group custom-border-no"),
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel("{i18n>LABEL_32015}", false), // OT종류
                                            new sap.m.ComboBox({
                                                width: "300px",
                                                selectedKey: "{/TemplateData/Awart}",
                                                items: {
                                                    path: "/Awarts",
                                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                    templateShareable: true
                                                },
                                                change: ApprovalHandler.changeAwart.bind(ApprovalHandler)
                                            }),
                                            this.getLabel("{i18n>LABEL_32016}", false), // 대상자(부서)
                                            new sap.m.ComboBox({
                                                width: "290px",
                                                selectedKey: "{/TemplateData/Repla}",
                                                items: {
                                                    path: "/Replas",
                                                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                    templateShareable: true
                                                },
                                                change: ApprovalHandler.changeRepla.bind(ApprovalHandler)
                                            })
                                        ]
                                    }).addStyleClass("search-field-group custom-border-no"),
                                    new sap.m.HBox({
                                        items: [
                                            this.getLabel("{i18n>LABEL_32012}", false), // 작업내용
                                            new sap.m.Input({ 
                                                width: "776px",
                                                value: "{/TemplateData/Jobco}",
                                                maxLength: 70,
                                                change: ApprovalHandler.checkTemplateControl.bind(ApprovalHandler)
                                            })
                                        ]
                                    }).addStyleClass("search-field-group custom-border-no")
                                ]
                            }),
                            new sap.m.VBox({
                                justifyContent: sap.m.FlexJustifyContent.Center,
                                items: [
                                    new sap.m.HBox({
                                        items: [
                                            new sap.m.Button({
                                                press: ApprovalHandler.pressApplyTemplateBtn.bind(ApprovalHandler),
                                                text: "{i18n>LABEL_30016}", // 적용
                                                enabled: "{/IsPossibleTemplateApplyBtn}"
                                            }).addStyleClass("button-light")
                                        ]
                                    }).addStyleClass("button-group")
                                ]
                            })
                        ]
                    }).addStyleClass("search-box search-bg custom-bgBox mt-20px pb-7px h-auto")
                }).addStyleClass("custom-panel mt-20px");
            },

            buildTableBox: function (oController, ApprovalHandler) {
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.VBox({
                        width: "100%",
                        items: [
                            this.buildTableButtons(oController, ApprovalHandler), //
                            this.buildTable(oController, ApprovalHandler)
                        ]
                    })
                }).addStyleClass("custom-panel mt-20px");
            },

            buildTableButtons: function (oController, ApprovalHandler) {

                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    alignItems: sap.m.FlexAlignItems.End,
                    items: [
                        new sap.m.HBox({
                            height: "50px",
                            items: [
                                new sap.m.VBox({
                                    items: [
                                        new sap.m.HBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            items: [
                                                new sap.ui.core.Icon({
                                                    src : "sap-icon://information",
                                                    size : "14px",
                                                    color : "#0854a0"
                                                }).addStyleClass("mt-5px"),
                                                new sap.m.Text({ 
                                                    text : "{i18n>MSG_32001}" // 연장근무 상신시에는 연장/휴일/심야근무에 대해 동의한 것으로 간주합니다.
                                                }).addStyleClass("ml-6px")
                                            ]
                                        }),
                                        new sap.m.HBox({
                                            alignItems: sap.m.FlexAlignItems.Center,
                                            items: [
                                                new sap.ui.core.Icon({
                                                    src : "sap-icon://information",
                                                    size : "14px",
                                                    color : "#0854a0"
                                                }).addStyleClass("mt-5px"),
                                                new sap.m.Text({ 
                                                    text : "{i18n>MSG_32002}" // 임부의 경우 연장/휴일근무가 불가하며, 산부의 경우 1일 2시간, 1주일 6시간, 1년 150일을 초과하는 연장근무가 불가합니다.
                                                }).addStyleClass("ml-6px")
                                            ]
                                        })
                                    ]
                                }).addStyleClass("mb--10px")
                            ]
                        }),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    text: "{i18n>LABEL_32065}", // 대상자 추가
                                    press: ApprovalHandler.pressAddBtn.bind(oController)
                                }).addStyleClass("button-light"),
                                new sap.m.Button("TableIn03-remove", {
                                    text: "{i18n>LABEL_00103}", // 삭제
                                    press: ApprovalHandler.pressDeleteBtn.bind(ApprovalHandler),
                                    enabled: "{/IsPossibleRowDelete}"
                                }).addStyleClass("button-delete")
                            ]
                        }).addStyleClass("button-group")
                    ]
                });
            },

            buildTable: function (oController, ApprovalHandler) {
                var oTable = new sap.ui.table.Table($.app.createId("TargetBasicTable"), {
                    width: "100%",
                    selectionMode: "MultiToggle",
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
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "8%" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "6%" },
                    { id: "Begda", label: "{i18n>LABEL_32009}" /* 근무일 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "12%", templateGetter: "getWorkdate", templateGetterOwner: ApprovalHandler },
                    { id: "Beguz", label: "{i18n>LABEL_32014}" /* 근무시간 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "23%", templateGetter: "getWorktime", templateGetterOwner: ApprovalHandler },
                    { id: "Atext", label: "{i18n>LABEL_32015}" /* OT종류 */, plabel: "", resize: true, span: 0, type: "String", sort: false, filter: false, width: "11%" },
                    { id: "Repla", label: "{i18n>LABEL_32016}" /* 대상자(부서) */, plabel: "", resize: true, span: 0, type: "String", sort: false, filter: false, width: "11%" },
                    { id: "Jobco", label: "{i18n>LABEL_32012}" /* 작업내용 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "auto", templateGetter: "getWorkComment", templateGetterOwner: ApprovalHandler },
                    { id: "Comment", label: "{i18n>LABEL_32017}" /* 처리결과 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "14%", templateGetter: "getProcessResult", templateGetterOwner: ApprovalHandler }
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
