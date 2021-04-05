sap.ui.define(
    [
        "common/Common", //
        "common/ZHR_TABLES",
        "../delegate/WorkSchedule"
    ],
    function (Common, ZHR_TABLES, WorkSchedule) {
        "use strict";

        var TAB_PAGE_ID = [$.app.CONTEXT_PATH, WorkSchedule.Tab.APPROVAL].join(".fragment.");

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
                                            return oController.getBundleText("LABEL_55048", v); // 결재 건수 {0} 건
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
                var oTable = new sap.ui.table.Table("ApprovalTable", {
                    selectionMode: sap.ui.table.SelectionMode.MultiToggle,
                    enableSelectAll: true,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 5,
                    fixedColumnCount: 7,
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
                    { id: "Schda", label: "{i18n>LABEL_55003}" /* 근무일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "120px" },
                    { id: "Pernr", label: "{i18n>LABEL_00191}" /* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Ename", label: "{i18n>LABEL_00121}" /* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Rtext", label: "{i18n>LABEL_55004}" /* 근무조 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "Atext", label: "{i18n>LABEL_55005}" /* 근태 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "100px" },
                    { id: "TprogT", label: "{i18n>LABEL_55006}" /* 일근유형 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "PlanTime", label: "{i18n>LABEL_55007}" /* 계획근무 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "InoutTime", label: "{i18n>LABEL_55008}" /* 입/출문 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "WorkTime", label: "{i18n>LABEL_55009}" /* 근무시간 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "AddTime1", label: "{i18n>LABEL_55010}" /* 추가시간1 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "AddTime2", label: "{i18n>LABEL_55035}" /* 추가시간2 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "120px" },
                    { id: "FaprsT", label: "{i18n>LABEL_55011}" /* 사유구분 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "140px", align: "Begin" },
                    { id: "Ovres", label: "{i18n>LABEL_55012}" /* 사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "180px", align: "Begin" },
                    { id: "Tim00", label: "{i18n>LABEL_55013}" /* 정상 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Tim01", label: "{i18n>LABEL_55014}" /* 연장 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Tim07", label: "{i18n>LABEL_55015}" /* 심야 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Tim05", label: "{i18n>LABEL_55016}" /* 휴일 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Tim02", label: "{i18n>LABEL_55017}" /* 주휴 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Wt40", label: "{i18n>LABEL_55043}" /* 소정근로 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Wt12", label: "{i18n>LABEL_55044}" /* 연장근로(산정기준) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" },
                    { id: "Wtsum", label: "{i18n>LABEL_55025}" /* 계 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "80px" }
                ];
            }
        });
    }
);
