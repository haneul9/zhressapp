/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "common/HoverIcon",
        "common/PickOnlyDatePicker",
        "sap/m/InputBase"
    ],
    function (Common, ZHR_TABLES, HoverIcon, PickOnlyDatePicker, InputBase) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "priorDetail"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var PriorHandler = oController.getPriorHandler.call(oController);

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1400px",
                    // contentHeight: "65vh",
                    title: "{i18n>LABEL_32004}",    // 사전신청
                    content: [
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
                            visible: "{= (${/Detail/Header/Status} === 'AA' || ${/Detail/Header/Status} === 'JJ') }"
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

            buildInfoBox: function (oController, PriorHandler) {

                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    headerText: "{i18n>LABEL_55018}",   // 근무정보
                    content: new sap.m.VBox($.app.createId("PriorInputForm"), {
                        items: [
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        width: "40%",
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
                                                        editable: "{= ${/Auth} === 'H' }",
                                                        change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32009}", true), // 근무일
                                                    new PickOnlyDatePicker({ 
                                                        required: true,
                                                        width: "140px",
                                                        dateValue: "{/Detail/Header/Schda}",
                                                        minDate: "{/Detail/Header/MinDate}",
                                                        valueFormat: "yyyy-MM-dd",
                                                        displayFormat: "{/Dtfmt}",
                                                        editable: "{= ${/Detail/Header/IsPossibleBegda} }",
                                                        change: PriorHandler.changeSchda.bind(PriorHandler)
                                                    }),
                                                    new sap.m.Text({
                                                        text: "{/Detail/Header/WeekName}"
                                                    }).addStyleClass("ml-10px font-medium font-14px"),
                                                    new sap.m.ObjectStatus({
                                                        layoutData: new sap.m.FlexItemData({ styleClass: "lh-1px" }),
                                                        text: {
                                                            path: "/Detail/Header/TmstaT",
                                                            formatter: function(v) {
                                                                return oController.getBundleText("MSG_55004").interpolate(v ? v : oController.getBundleText("LABEL_55036")); // 신규작성
                                                            }
                                                        },
                                                        state: {
                                                            path: "/Detail/Header/Status",
                                                            formatter: function(v) {
                                                                return v === "" ? sap.ui.core.ValueState.Warning 
                                                                    : v === "AA" ? sap.ui.core.ValueState.Information
                                                                        : v === "00" ? sap.ui.core.ValueState.Information
                                                                            : v === "88" ? sap.ui.core.ValueState.Error
                                                                                : v === "99" ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.None;
                                                            }
                                                        }
                                                    }).addStyleClass("ml-10px font-medium font-14px")
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox"),
                                    new sap.m.VBox({
                                        width: "60%",
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
                                                    this.getLabel("{i18n>LABEL_55021}", false), // 근무일정
                                                    new sap.m.ComboBox({
                                                        width: "185px",
                                                        selectedKey: "{/Detail/Header/Tprog}",
                                                        editable: "{= !${/Detail/IsViewMode} }",
                                                        items: {
                                                            path: "/Tprogs",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        change: PriorHandler.changeTprog.bind(PriorHandler)
                                                    }).addStyleClass("mx-10px"),
                                                    new sap.m.Text({
                                                        text: "{/Detail/Header/Beguzc} ~ {/Detail/Header/Enduzc}"
                                                    }).addStyleClass("mx-10px"),
                                                    this.getLabel("{i18n>LABEL_55022}", false), // 출입정보
                                                    new sap.m.Text({
                                                        text: "{/Detail/Header/Enttmc} ~ {/Detail/Header/Outtmc}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox")
                                ]
                            }),
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        width: "40%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32014}", true), // 근무시간
                                                    new sap.m.Select({
                                                        required: true,
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/WkbuzT}",
                                                        items: {
                                                            path: "/Hours",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }",
                                                        change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                                    new sap.m.Select({
                                                        required: true,
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/WkbuzM}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }",
                                                        change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
                                                    new sap.m.Select({
                                                        required: true,
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/WkeuzT}",
                                                        items: {
                                                            path: "/Hours",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }",
                                                        change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                                    new sap.m.Select({
                                                        required: true,
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/WkeuzM}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }",
                                                        change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new HoverIcon({
                                                        src: "sap-icon://information",
                                                        hover: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_55001")); // 잔업에 포함한 실제근무시간을 입력하세요.
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
                                                    this.getLabel("{i18n>LABEL_55020}1", false), // 추가근무1
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/TrbuzT}",
                                                        items: {
                                                            path: "/Hours",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }"
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/TrbuzM}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }"
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/TreuzT}",
                                                        items: {
                                                            path: "/Hours",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }"
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/TreuzM}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }"
                                                    }).addStyleClass("custom-select-time"),
                                                    new HoverIcon({
                                                        src: "sap-icon://information",
                                                        hover: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_55002")); // 잔업 시작시간이 근무시간의 종료시간과 다른 경우 입력하세요.
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
                                                    this.getLabel("{i18n>LABEL_55020}2", false), // 추가근무2
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Trbu1T}",
                                                        items: {
                                                            path: "/Hours",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }"
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Trbu1M}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }"
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Treu1T}",
                                                        items: {
                                                            path: "/Hours",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }"
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Treu1M}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= !${/Detail/IsViewMode} }"
                                                    }).addStyleClass("custom-select-time"),
                                                    new HoverIcon({
                                                        src: "sap-icon://information",
                                                        hover: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_55002")); // 잔업 시작시간이 근무시간의 종료시간과 다른 경우 입력하세요.
                                                        },
                                                        leave: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                                        }
                                                    })
                                                    .addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue ml-20px")
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("vbox-border-right"),
                                    new sap.m.VBox({
                                        width: "60%",
                                        items: [
                                            this.buildTimeTable(oController)
                                        ]
                                    }).addStyleClass("vbox-border-bottom")
                                ]
                            }),
                            new sap.m.HBox({
                                items: [
                                    this.getLabel("{i18n>LABEL_55027}", true), // 근무사유
                                    new sap.m.ComboBox({
                                        width: "225px",
                                        required: true,
                                        selectedKey: "{/Detail/Header/Faprs}",
                                        editable: "{= !${/Detail/IsViewMode} }",
                                        items: {
                                            path: "/Faprss",
                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                            templateShareable: true
                                        },
                                        change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                                    }),
                                    new sap.m.Input({
                                        required: true,
                                        width: "907px",
                                        value: "{/Detail/Header/Ovres}",
                                        editable: "{= !${/Detail/IsViewMode} }",
                                        change: PriorHandler.toggleIsPossibleSave.bind(PriorHandler)
                                    }).addStyleClass("ml-10px")
                                ]
                            }).addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("search-box h-auto p-0")
                }).addStyleClass("custom-panel");
            },

            buildTimeTable: function(oController) {
                var oTimeTable = new sap.ui.table.Table({
                    width: "90%",
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 38,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}",
                    layoutData: new sap.m.FlexItemData({ maxWidth: "100%" })
                })
                .addStyleClass("thead-cell-border tbody-cell-border ml-30px mt-25px")
                .bindRows("/Detail/Header/List");

                ZHR_TABLES.makeColumn(oController, oTimeTable, [
                    { id: "Tim00", label: "{i18n>LABEL_55013}" /* 정상 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "11%" },
                    { id: "Tim01", label: "{i18n>LABEL_55014}" /* 연장 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "11%" },
                    { id: "Tim07", label: "{i18n>LABEL_55015}" /* 심야 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "11%" },
                    { id: "Tim05", label: "{i18n>LABEL_55016}" /* 휴일 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "11%" },
                    { id: "Tim02", label: "{i18n>LABEL_55017}" /* 주휴 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "11%" },
                    { id: "Wt40", label: "{i18n>LABEL_55023}" /* 소정근로(계획근무) */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "11%" },
                    { id: "Wt12", label: "{i18n>LABEL_55024}" /* 연장근로(한도체크) */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "11%" },
                    { id: "Wtsum", label: "{i18n>LABEL_55025}" /* 계 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "11%" },
                    { id: "LigbnTx", label: "{i18n>LABEL_55026}" /* 한도체크 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "11%", templateGetter: "getLigbnText", templateGetterOwner: this }
                ]);

                return oTimeTable;
            },

            buildTableBox: function (oController) {
                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    headerText: "{i18n>LABEL_55019}",   // 결재정보
                    content: new sap.m.VBox({
                        width: "100%",
                        items: [
                            this.buildTableButtons(oController),
                            this.buildTable(oController)
                        ]
                    }).addStyleClass("pt-30px"),
                    visible: "{/Detail/VisibleApprs}"
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

            getLigbnText: function() {
                return new sap.m.ObjectStatus({
                    text: "{LigbnTx}",
                    state: {
                        path: "Ligbn",
                        formatter: function(v) {
                            return v === "2" || v === "3" ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.None;
                        }
                    }
                }).addStyleClass("color-black");
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
