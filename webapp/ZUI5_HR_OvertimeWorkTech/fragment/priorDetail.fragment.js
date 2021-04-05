/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "common/HoverIcon",
        "common/PickOnlyDatePicker",
        "sap/m/InputBase",
        "common/moment-with-locales"
    ],
    function (Common, ZHR_TABLES, HoverIcon, PickOnlyDatePicker, InputBase) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "priorDetail"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var PriorHandler = oController.getPriorHandler.call(oController);

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1400px",
                    contentHeight: "65vh",
                    title: "{i18n>LABEL_32004}",    // 사전신청
                    content: [
                        this.buildInfoMessage(),
                        this.buildInfoBox(oController, PriorHandler),
                        this.buildTableBox(oController)
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            press: PriorHandler.pressSaveBtn.bind(PriorHandler),
                            enabled: "{/Detail/IsPossibleSave}",
                            visible: "{= !${/Detail/IsViewMode}}"
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00152}", // 신청
                            press: PriorHandler.pressApprovalBtn.bind(PriorHandler),
                            enabled: "{/Detail/IsPossibleApproval}",
                            visible: "{= !${/Detail/IsViewMode}}"
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00103}", // 삭제
                            press: PriorHandler.pressDeleteBtn.bind(PriorHandler),
                            enabled: "{/Detail/IsPossibleDelete}",
                            visible: "{= !${/Detail/IsViewMode}}"
                        }).addStyleClass("button-delete"),
                        new sap.m.Button({
                            text: oController.getBundleText("LABEL_00133"), // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-default custom-button-divide")
                    ]
                })
                .addStyleClass("custom-dialog-popup")
                .setModel(PriorHandler.Model());

                return oDialog;
            },

            buildInfoMessage: function () {

                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.Start,
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
                                                    text : "{i18n>MSG_32005}" // 근무시간은 출퇴근 기준으로 입력해주시기 바라며, 근로시간 산정 시 점심시간 한 시간은 자동으로 제외됩니다.
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
                                                    text : "{i18n>MSG_32006}" // 실제 근로 시간은 사후 신청 기준으로 반영됩니다.
                                                }).addStyleClass("ml-6px")
                                            ]
                                        })
                                    ]
                                }).addStyleClass("mb--10px")
                            ]
                        })
                    ]
                });
            },

            buildInfoBox: function (oController, PriorHandler) {

                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.VBox($.app.createId("PriorInputForm"), {
                        items: [
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        width: "45%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32025}", true), // 대상자
                                                    new sap.m.Input({
                                                        required: true,
                                                        width: "140px",
                                                        value: "{/Detail/Header/Ename}",
                                                        showValueHelp: true,
                                                        valueHelpOnly: true,
                                                        valueHelpRequest: PriorHandler.searchOrgehPernrByDetail.bind(PriorHandler),
                                                        editable: "{= !${/Detail/IsViewMode} && ${/Detail/Header/Bukrs3} !== 'A100' }",
                                                        change: PriorHandler.checkFormControl.bind(PriorHandler)
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32009}", true), // 근무일
                                                    new PickOnlyDatePicker({ 
                                                        required: true,
                                                        width: "228px",
                                                        dateValue: "{/Detail/Header/Begda}",
                                                        minDate: "{/Detail/Header/MinDate}",
                                                        valueFormat: "yyyy-MM-dd",
                                                        displayFormat: "{/Dtfmt}",
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PriorHandler.checkFormControl.bind(PriorHandler)
                                                    }),
                                                    new sap.m.CheckBox({
                                                        text: "{i18n>LABEL_32021}", // 휴일
                                                        selected: "{/Detail/Header/Holick}",
                                                        editable: false
                                                    }).addStyleClass("checkbox-label")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32014}", true), // 근무시간
                                                    new sap.m.Select({
                                                        required: true,
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/OtbetmT}",
                                                        items: {
                                                            path: "/Hours",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PriorHandler.checkFormControl.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                                    new sap.m.Select({
                                                        required: true,
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/OtbetmM}",
                                                        items: {
                                                            path: "/Minutes30",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PriorHandler.checkFormControl.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
                                                    new sap.m.Select({
                                                        required: true,
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/OtentmT}",
                                                        items: {
                                                            path: "/Hours",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PriorHandler.checkFormControl.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                                    new sap.m.Select({
                                                        required: true,
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/OtentmM}",
                                                        items: {
                                                            path: "/Minutes30",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PriorHandler.checkFormControl.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new HoverIcon({
                                                        src: "sap-icon://information",
                                                        hover: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_32003")); // 근무의 시작, 종료시간을 입력하세요.
                                                        },
                                                        leave: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                                        }
                                                    })
                                                    .addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue ml-20px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32027}", false), // 근태 인정시간
                                                    new sap.m.Text({
                                                        text: "{/Detail/Header/ComtmW}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox"),
                                    new sap.m.VBox({
                                        width: "55%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_00191}", false), // 사번
                                                    new sap.m.Text({
                                                        text: "{/Detail/Header/Pernr}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32028}", false), // 입문/출문시간
                                                    new sap.m.Text({
                                                        text: "{/Detail/Header/EntbeW}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32026}", false), // 예상 제외시간
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Brkhr1}",
                                                        items: {
                                                            path: "/Hours",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PriorHandler.checkFormControl.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: "{i18n>LABEL_32035}" }).addStyleClass("mx-4px"), // 시간
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Brkmm1}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PriorHandler.checkFormControl.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: "{i18n>LABEL_32036}" }).addStyleClass("mx-4px"), // 분
                                                    new HoverIcon({
                                                        src: "sap-icon://information",
                                                        hover: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_32004")); // 예상되는 식사, 웰리스 등 예상 근무 제외시간을 입력하세요.
                                                        },
                                                        leave: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                                        }
                                                    })
                                                    .addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue ml-20px")
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32029}", false), // 총 근로시간
                                                    new sap.m.Text({
                                                        width: "160px",
                                                        text: "{/Detail/Header/TottmW}"
                                                    }).addStyleClass("mx-10px"),
                                                    this.getLabel("{i18n>LABEL_32030}", false, "140px").addStyleClass("label-wrap"), // 월누적 연장근로시간\n(사후결재 기준)
                                                    new sap.m.Text({
                                                        text: "{/Detail/Header/MottmW}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox")
                                ]
                            }),
                            new sap.m.HBox({
                                items: [
                                    this.getLabel("{i18n>LABEL_32022}", true), // 신청사유
                                    new sap.m.Input({
                                        required: true,
                                        width: "760px",
                                        value: "{/Detail/Header/Horex}",
                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                        change: PriorHandler.checkFormControl.bind(PriorHandler)
                                    })
                                ]
                            }).addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("search-box h-auto p-0")
                }).addStyleClass("custom-panel");
            },

            buildTableBox: function (oController) {
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    headerText: "{i18n>LABEL_32031}",   // 결재정보
                    content: new sap.m.VBox({
                        width: "100%",
                        items: [
                            this.buildTableButtons(oController),
                            this.buildTable(oController)
                        ]
                    }).addStyleClass("pt-30px")
                }).addStyleClass("custom-panel mt-6px");
            },

            buildTableButtons: function(oController) {
                var PriorHandler = oController.getPriorHandler();

                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.End,
                    visible: "{/Header/Edtfg}",
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    press: PriorHandler.pressAddApprovalLine.bind(PriorHandler),
                                    icon: "sap-icon://add",
                                    visible: "{= !${/Detail/IsViewMode} && ${/Detail/Header/Pernr} !== '' && ${/Detail/Header/Pernr} !== null && ${/Detail/Header/Bukrs3} !== 'A100' }",
                                    text: "{i18n>LABEL_00153}" // 추가
                                })
                                .addStyleClass("button-light-sm")
                            ]
                        })
                        .addStyleClass("button-group")
                    ]
                });
            },

            buildTable: function (oController) {
                var oTable = new sap.ui.table.Table($.app.createId("PriorApprovalLineTable"), {
                    width: "100%",
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 2,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 38,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}",
                    layoutData: new sap.m.FlexItemData({ maxWidth: "100%" })
                })
                .addStyleClass("mt-8px")
                .bindRows("/Detail/List");

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "AprsqTx", label: "{i18n>LABEL_32032}" /* 결재단계 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "18%", templateGetter: "getApprovalLineFunc", templateGetterOwner: this },
                    { id: "ApstaT", label: "{i18n>LABEL_32024}" /* 결재상태 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "18%" },
                    { id: "Apper", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "16%" },
                    { id: "Apnam", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "16%" },
                    { id: "Aporx", label: "{i18n>LABEL_00156}" /* 부서명 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "16%" },
                    { id: "ApgrdT", label: "{i18n>LABEL_00124}" /* 직급 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "16%" }
                ]);

                return oTable;
            },

            getApprovalLineFunc: function(columnInfo, oController) {
                var PriorHandler = oController.getPriorHandler();

                return new sap.m.FlexBox({
					justifyContent: "Center",
                    alignItems: sap.m.FlexAlignItems.Center,
					items: [
                        new sap.ui.commons.TextView({
                            text : "{" + columnInfo.id + "}",
                            textAlign : "Center"
                        }).addStyleClass("table-font"),
						new sap.m.Button({
							press: PriorHandler.pressApprovalLineModify.bind(PriorHandler),
                            text: "{i18n>LABEL_00202}", // 변경
                            visible: "{= !${/Detail/IsViewMode} && ${/Detail/Header/Pernr} !== '' && ${/Detail/Header/Pernr} !== null && ${/Detail/Header/Bukrs3} !== 'A100' }"
						}).addStyleClass("ml-10px"),
						new sap.m.Button({
							press: PriorHandler.pressApprovalLineDelete.bind(PriorHandler),
                            text: "{i18n>LABEL_00103}", // 삭제
                            visible: "{= !${/Detail/IsViewMode} && ${/Detail/Header/Pernr} !== '' && ${/Detail/Header/Pernr} !== null && ${/Detail/Header/Bukrs3} !== 'A100' }"
						}).addStyleClass("ml-10px")
					]
				});
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
