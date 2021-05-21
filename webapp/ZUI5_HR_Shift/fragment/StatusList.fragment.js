sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "../delegate/Shift"
    ],
    function (Common, ZHR_TABLES, Shift) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, Shift.Tab.STATUS].join(".fragment.");

        sap.ui.jsfragment(TAB_PAGE_ID, {
            createContent: function (oController) {
                var StatusListHandler = oController.getStatusListHandler.call(oController);

                return new sap.m.VBox({
                    items: [
                        this.buildSearchBox(oController, StatusListHandler), //
                        this.buildInfoBox(oController, StatusListHandler),
                        this.buildTable(oController)
                    ]
                }).setModel(StatusListHandler.Model());
            },

            buildSearchBox: function(oController, StatusListHandler) {
                return new sap.m.HBox({
                    fitContainer: true,
                    items: [
                        new sap.m.VBox({
                            items: [
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.Label({ text: "{i18n>LABEL_30004}" }), // 부서/사원
                                        new sap.m.Input({
                                            width: "140px",
                                            value: "{EnameOrOrgehTxt}",
                                            showValueHelp: true,
                                            valueHelpOnly: true,
                                            valueHelpRequest: StatusListHandler.searchOrgehPernr.bind(oController),
                                            editable: "{/isEditOrgtree}"
                                        }),
                                        new sap.m.Label({ text: "{i18n>LABEL_30005}" }), // 근무일정
                                        new sap.m.ComboBox({
                                            width: "220px",
                                            selectedKey: "{Schkz}",
                                            items: {
                                                path: "/Schkzs",
                                                template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                                            }
                                        })
                                    ]
                                }).addStyleClass("search-field-group"),
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.CheckBox({ 
                                            text: "{i18n>LABEL_30006}",   // 하위부서 포함
                                            textAlign: sap.ui.core.TextAlign.Begin,
                                            selected: "{OrgDn}",
                                            visible: {
                                                path: "/SearchConditions/Orgeh",
                                                formatter: function(v) {
                                                    return (!Common.checkNull(v)) ? true : false;
                                                }
                                            }
                                        })
                                    ]
                                }).addStyleClass("custom-search-checkbox ml-77px")
                            ]
                        }),
                        new sap.m.VBox({
                            items: [
                                new sap.m.HBox({
                                    items: [
                                        new sap.m.Button({
                                            press: StatusListHandler.search.bind(StatusListHandler),
                                            text: "{i18n>LABEL_00100}" // 조회
                                        }).addStyleClass("button-search")
                                    ]
                                }).addStyleClass("button-group")
                            ]
                        })
                    ]
                })
                .addStyleClass("search-box search-bg pb-7px")
                .bindElement("/SearchConditions");
            },

            buildInfoBox: function(oController, StatusListHandler) {
                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.CheckBox({ 
                                    text: "{i18n>LABEL_30007}",   // 현재일 대상건만 조회
                                    textAlign: sap.ui.core.TextAlign.Begin,
                                    selected: "{/SearchConditions/Inday}",
                                    select: StatusListHandler.onSelectInday.bind(StatusListHandler)
                                })
                            ]
                        }).addStyleClass("info-field-group custom-checkbox"),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    press: StatusListHandler.pressChangeApprovalBtn.bind(StatusListHandler),
                                    text: "{i18n>LABEL_30008}", // 변경 신청
                                    visible: "{= ${/Bukrs} === 'A' || ${/Zfxck2} !== 'X' ? false : true }"
                                }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");
            },

            buildTable: function(oController) {
                var oTable = new sap.ui.table.Table("StatusListTable", {
                    selectionMode: sap.ui.table.SelectionMode.MultiToggle,
                    enableSelectAll: true,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 5,
                    showOverlay: false,
                    showNoData: true,
                    width: "100%",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                .addStyleClass("mt-15px")
                .bindRows("/List");

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                    { id: "Orgtx", label: "{i18n>LABEL_00155}" /* 부서 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto", align: sap.ui.core.HorizontalAlign.Begin },
                    { id: "PGradeTxt", label: "{i18n>LABEL_00124}" /* 직급 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%" },
                    { id: "Begda", label: "{i18n>LABEL_30009}" /* 시작일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "14%" },
                    { id: "Endda", label: "{i18n>LABEL_30010}" /* 종료일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "14%" },
                    { id: "BRtext", label: "{i18n>LABEL_30005}" /* 근무일정 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%", align: sap.ui.core.HorizontalAlign.Begin }
                ]);

                return oTable;
            }
        });
    }
);
