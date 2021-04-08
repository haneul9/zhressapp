/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "common/HoverIcon",
        "common/PickOnlyDatePicker",
        "../delegate/OvertimeWork",
        "sap/m/InputBase",
        "common/moment-with-locales"
    ],
    function (Common, ZHR_TABLES, HoverIcon, PickOnlyDatePicker, OvertimeWork, InputBase) {
        "use strict";

        var DIALOG_DETAIL_ID = [$.app.CONTEXT_PATH, "postDetail"].join(".fragment.");

        sap.ui.jsfragment(DIALOG_DETAIL_ID, {
            createContent: function (oController) {
                var PostHandler = oController.getPostHandler.call(oController);

                var oDialog = new sap.m.Dialog({
                    contentWidth: "1400px",
                    contentHeight: "70vh",
                    title: "{i18n>LABEL_32006}",    // 사후신청
                    content: [
                        this.buildInfoBox(oController, PostHandler),
                        this.buildTableBox(oController)
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            press: PostHandler.pressSaveBtn.bind(PostHandler),
                            enabled: "{/Detail/IsPossibleSave}",
                            visible: "{= !${/Detail/IsViewMode}}"
                        }).addStyleClass("button-light"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00152}", // 신청
                            press: PostHandler.pressApprovalBtn.bind(PostHandler),
                            enabled: "{/Detail/IsPossibleApproval}",
                            visible: "{= !${/Detail/IsViewMode}}"
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            text: "{i18n>LABEL_00103}", // 삭제
                            press: PostHandler.pressDeleteBtn.bind(PostHandler),
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
                .setModel(PostHandler.Model());

                return oDialog;
            },

            buildInfoBox: function (oController, PostHandler) {

                return new sap.m.Panel({
                    layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
                    expanded: true,
                    expandable: false,
                    content: new sap.m.VBox($.app.createId("PostInputForm"), {
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
                                                        valueHelpRequest: PostHandler.searchOrgehPernrByDetail.bind(PostHandler),
                                                        editable: "{= !${/Detail/IsViewMode} && ${/Detail/Header/Bukrs3} !== 'A100' }",
                                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                                    })
                                                ]
                                            }).addStyleClass("search-field-group"),
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32009}", true), // 근무일
                                                    new sap.m.Button({
                                                        width: "140px",
                                                        type: sap.m.ButtonType.Emphasized,
                                                        text: "{i18n>LABEL_32041}",    // 사전신청일 선택
                                                        enabled: "{= ${/Detail/Header/Pernr} === '' ? false : true }",
                                                        visible: "{= !${/Detail/IsViewMode} }",
                                                        press: PostHandler.pressSelectPriorBtn.bind(PostHandler)
                                                    }).addStyleClass("mr-10px"),
                                                    new PickOnlyDatePicker({ 
                                                        required: true,
                                                        dateValue: "{/Detail/Header/Begda}",
                                                        valueFormat: "yyyy-MM-dd",
                                                        displayFormat: "{/Dtfmt}",
                                                        editable: false,
                                                        width: "140px",
                                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                                    }),
                                                    new sap.m.CheckBox({
                                                        text: "{i18n>LABEL_32021}", // 휴일
                                                        selected: "{/Detail/Header/Holick}",
                                                        editable: false
                                                    }).addStyleClass("checkbox-label")
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
                                                    this.getLabel("{i18n>LABEL_32028}", false), // 입문/출문시간
                                                    new sap.m.Text({
                                                        text: "{/Detail/Header/EntbeW}"
                                                    }).addStyleClass("mx-10px")
                                                ]
                                            }).addStyleClass("search-field-group")
                                        ]
                                    }).addStyleClass("search-inner-vbox")
                                ]
                            }),
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
                                        change: PostHandler.checkFormControl.bind(PostHandler)
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
                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                    }).addStyleClass("custom-select-time"),
                                    new sap.m.Text({ text: "~" }).addStyleClass("mx-3px"),
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
                                        change: PostHandler.checkFormControl.bind(PostHandler)
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
                                        change: PostHandler.checkFormControl.bind(PostHandler)
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
                            }).addStyleClass("search-field-group border-bt-none"),
                            new sap.m.HBox({
                                items: [
                                    new sap.m.VBox({
                                        width: "40%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32034}", false), // 제외시간(휴게)
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/BrktmHr}",
                                                        items: {
                                                            path: "/Hours",
                                                            templateShareable: true,
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        },
                                                        // editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }"
                                                        editable: false
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ 
                                                        text: "{i18n>LABEL_32035}"   // 시간
                                                    }).addStyleClass("mx-5px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/BrktmMm}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        // editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }"
                                                        editable: false
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ 
                                                        text: "{i18n>LABEL_32036}"   // 분
                                                    }).addStyleClass("ml-5px"),
                                                    new HoverIcon({
                                                        src: "sap-icon://information",
                                                        hover: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_32008")); // 9시간 초과 근무 시 법정 휴게 시간 1시간 제외(점심시간)
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
                                                    this.getLabel("{i18n>LABEL_32037}", false), // 제외시간(식사)
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Brkhr1}",
                                                        items: {
                                                            path: "/Hours",
                                                            templateShareable: true,
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ 
                                                        text: "{i18n>LABEL_32035}"   // 시간
                                                    }).addStyleClass("mx-5px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Brkmm1}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ 
                                                        text: "{i18n>LABEL_32036}"   // 분
                                                    }).addStyleClass("ml-5px"),
                                                    new HoverIcon({
                                                        src: "sap-icon://information",
                                                        hover: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_32009")); // 사내(식당이용내역 참조) 또는 사외 식당 이용 시 이용시간을 모두 반영 해야 합니다.(조식, 석식 기본 30분)
                                                        },
                                                        leave: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                                        }
                                                    })
                                                    .addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue ml-20px"),
                                                    new sap.m.Button({
                                                        type: sap.m.ButtonType.Emphasized,
                                                        icon: "sap-icon://inspection",
                                                        tooltip: "{i18n>LABEL_32047}",  // 식사내역 조회
                                                        enabled: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/Header/Begda} === null ? false : true }",
                                                        visible: "{= !${/Detail/IsViewMode} }",
                                                        press: PostHandler.pressSelectMealBtn.bind(PostHandler),
                                                        customData: [
                                                            new sap.ui.core.CustomData({
                                                                key: "dialogTitle",
                                                                value: "{i18n>LABEL_32044}" // 식사
                                                            }),
                                                            new sap.ui.core.CustomData({
                                                                key: "type",
                                                                value: OvertimeWork.MealType.MEAL
                                                            }),
                                                            new sap.ui.core.CustomData({
                                                                key: "target",
                                                                value: {
                                                                    time: "/Detail/Header/Brkhr1",
                                                                    minute: "/Detail/Header/Brkmm1"
                                                                }
                                                            })
                                                        ]
                                                    })
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
                                        width: "60%",
                                        items: [
                                            new sap.m.HBox({
                                                items: [
                                                    this.getLabel("{i18n>LABEL_32039}", false), // 제외시간(기타)
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Brkhr3}",
                                                        items: {
                                                            path: "/Hours",
                                                            templateShareable: true,
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ 
                                                        text: "{i18n>LABEL_32035}"   // 시간
                                                    }).addStyleClass("mx-5px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Brkmm3}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ 
                                                        text: "{i18n>LABEL_32036}"   // 분
                                                    }).addStyleClass("ml-5px"),
                                                    new HoverIcon({
                                                        src: "sap-icon://information",
                                                        hover: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_32011")); // 어학, 수면, 동우회, 휴게시간, 근무 전 휴게시간 등 기타 제외시간이 있는 경우 시간을 반영 해야합니다.
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
                                                    this.getLabel("{i18n>LABEL_32038}", false), // 제외시간(웰리스)
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Brkhr2}",
                                                        items: {
                                                            path: "/Hours",
                                                            templateShareable: true,
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ 
                                                        text: "{i18n>LABEL_32035}"   // 시간
                                                    }).addStyleClass("mx-5px"),
                                                    new sap.m.Select({
                                                        width: "65px",
                                                        selectedKey: "{/Detail/Header/Brkmm2}",
                                                        items: {
                                                            path: "/Minutes",
                                                            template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" }),
                                                            templateShareable: true
                                                        },
                                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                                    }).addStyleClass("custom-select-time"),
                                                    new sap.m.Text({ 
                                                        text: "{i18n>LABEL_32036}"   // 분
                                                    }).addStyleClass("ml-5px"),
                                                    new HoverIcon({
                                                        src: "sap-icon://information",
                                                        hover: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_32010")); // 웰리스 이용 시 이용시간을 반영 해야 합니다.(웰리스 기본 1시간)
                                                        },
                                                        leave: function(oEvent) {
                                                            Common.onPressTableHeaderInformation.call(oController, oEvent);
                                                        }
                                                    })
                                                    .addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue ml-20px"),
                                                    new sap.m.Button({
                                                        type: sap.m.ButtonType.Emphasized,
                                                        icon: "sap-icon://inspection",
                                                        tooltip: "{i18n>LABEL_32048}",  // 웰리스내역 조회
                                                        enabled: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/Header/Begda} === null ? false : true }",
                                                        visible: "{= !${/Detail/IsViewMode} }",
                                                        press: PostHandler.pressSelectMealBtn.bind(PostHandler),
                                                        customData: [
                                                            new sap.ui.core.CustomData({
                                                                key: "dialogTitle",
                                                                value: "{i18n>LABEL_32045}" // 웰리스
                                                            }),
                                                            new sap.ui.core.CustomData({
                                                                key: "type",
                                                                value: OvertimeWork.MealType.WELLIS
                                                            }),
                                                            new sap.ui.core.CustomData({
                                                                key: "target",
                                                                value: {
                                                                    time: "/Detail/Header/Brkhr2",
                                                                    minute: "/Detail/Header/Brkmm2"
                                                                }
                                                            })
                                                        ]
                                                    })
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
                                        width: "740px",
                                        value: "{/Detail/Header/Horex}",
                                        editable: "{= ${/Detail/Header/Pernr} === '' || ${/Detail/IsViewMode} ? false : true }",
                                        change: PostHandler.checkFormControl.bind(PostHandler)
                                    })
                                ]
                            }).addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("search-box h-auto p-0")
                }).addStyleClass("custom-panel mt-6px");
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
                var PostHandler = oController.getPostHandler();

                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.End,
                    visible: "{/Header/Edtfg}",
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    press: PostHandler.pressAddApprovalLine.bind(PostHandler),
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
                var oTable = new sap.ui.table.Table($.app.createId("PostApprovalLineTable"), {
                    width: "100%",
                    selectionMode: "None",
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
                var PostHandler = oController.getPostHandler();

                return new sap.m.FlexBox({
					justifyContent: "Center",
                    alignItems: sap.m.FlexAlignItems.Center,
					items: [
                        new sap.ui.commons.TextView({
                            text : "{" + columnInfo.id + "}",
                            textAlign : "Center"
                        }).addStyleClass("table-font"),
						new sap.m.Button({
							press: PostHandler.pressApprovalLineModify.bind(PostHandler),
                            text: "{i18n>LABEL_00202}", // 변경
                            visible: "{= !${/Detail/IsViewMode} && ${/Detail/Header/Pernr} !== '' && ${/Detail/Header/Pernr} !== null && ${/Detail/Header/Bukrs3} !== 'A100' }"
						}).addStyleClass("ml-10px"),
						new sap.m.Button({
							press: PostHandler.pressApprovalLineDelete.bind(PostHandler),
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
