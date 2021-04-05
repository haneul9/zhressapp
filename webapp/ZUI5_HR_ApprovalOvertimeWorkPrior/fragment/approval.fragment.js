sap.ui.define(
    [
        "../../common/Common", //
        "../../common/ZHR_TABLES",
        "../delegate/OvertimeWork"
    ],
    function (Common, ZHR_TABLES, OvertimeWork) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, OvertimeWork.Tab.APPROVAL].join(".fragment.");

        sap.ui.jsfragment(TAB_PAGE_ID, {
            createContent: function (oController) {
                var ApprovalHandler = oController.getApprovalHandler.call(oController);

                return new sap.m.VBox({
                    items: [
                        this.buildInfoBox(oController, ApprovalHandler), //
                        this.buildTable(oController, ApprovalHandler)
                    ]
                }).setModel(ApprovalHandler.Model());
            },

            buildInfoBox: function(oController, ApprovalHandler) {
                return new sap.m.HBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.Text({
                                    text: {
                                        path: "/ListSize",
                                        formatter: function(v) {
                                            return oController.getBundleText("LABEL_32056", v); // 결재 건수 {0} 건
                                        }
                                    },
                                    visible: "{= ${/ListSize} > 0 }"
                                })
                            ]
                        }),
                        new sap.m.HBox({
                            items: [
                                new sap.m.Button({
                                    press: ApprovalHandler.pressApproveBtn.bind(ApprovalHandler),
                                    text: "{i18n>LABEL_00203}", // 승인
                                    enabled: "{/IsPossibleExcelButton}"
                                }).addStyleClass("button-dark"),
                                new sap.m.Button({
                                    press: ApprovalHandler.pressRejectBtn.bind(ApprovalHandler),
                                    text: "{i18n>LABEL_00198}", // 반려
                                    enabled: "{/IsPossibleExcelButton}"
                                }).addStyleClass("button-delete"),
                                new sap.m.Button({
                                    press: ApprovalHandler.pressExcelDownloadBtn.bind(ApprovalHandler),
                                    text: "{i18n>LABEL_00129}", // Excel
                                    enabled: "{/IsPossibleExcelButton}"
                                }).addStyleClass("button-light")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("info-box");
            },

            buildTable: function(oController, ApprovalHandler) {
                var oTable = new sap.ui.table.Table($.app.createId("ApprovalTable"), {
                    selectionMode: sap.ui.table.SelectionMode.MultiToggle,
                    enableSelectAll: true,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 5,
                    fixedColumnCount: 5,
                    showOverlay: false,
                    showNoData: true,
                    width: "100%",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                .addStyleClass("mt-8px")
                .bindRows("/List");

                ZHR_TABLES.makeColumn(oController, oTable, this.getColumnModel.call(ApprovalHandler));
                ApprovalHandler.aColumnModel = Common.convertColumnArrayForExcel(this.oController, this.getColumnModel.call(ApprovalHandler));

                return oTable;
            },

            getColumnModel: function() {
                return [
                    { id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "50px" },
                    { id: "Otdat", label: "{i18n>LABEL_32009}" /* 근무일 */, plabel: "", resize: true, span: 0, type: "date", sort: false, filter: false, width: "100px" },
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "120px" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "120px" },
                    { id: "HgradeT", label: "{i18n>LABEL_02273}" /* 직급명 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "100px" },
                    { id: "Holick", label: "{i18n>LABEL_32021}" /* 휴일 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "80px", templateGetter: "getCheckboxTemplate", templateGetterOwner: this },
                    { id: "Otbet", label: "{i18n>LABEL_32010}" /* 시작시간 */, plabel: "", resize: true, span: 0, type: "time", sort: false, filter: false, width: "100px" },
                    { id: "Otent", label: "{i18n>LABEL_32011}" /* 종료시간 */, plabel: "", resize: true, span: 0, type: "time", sort: false, filter: false, width: "100px" },
                    { id: "Brkhm1W", label: "{i18n>LABEL_32026}" /* 예상제외시간 */, plabel: "", resize: true, span: 0, type: "time", sort: false, filter: false, width: "120px" },
                    { id: "ComtmW", label: "{i18n>LABEL_32027}" /* 근태인정시간 */, plabel: "", resize: true, span: 0, type: "time", sort: false, filter: false, width: "120px" },
                    { id: "TottmW", label: "{i18n>LABEL_32029}" /* 총근로시간 */, plabel: "", resize: true, span: 0, type: "time", sort: false, filter: false, width: "120px" },
                    { id: "MottmW", label: "{i18n>LABEL_32053}" /* 월누적연장근로 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "120px" },
                    { id: "Horex", label: "{i18n>LABEL_32054}" /* 사유 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "200px", align: sap.ui.core.HorizontalAlign.Begin },
                    { id: "Rjres", label: "{i18n>LABEL_32023}" /* 반려사유 */, plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "200px", align: sap.ui.core.HorizontalAlign.Begin }
                ];
            }
        });
    }
);
