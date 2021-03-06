sap.ui.define(
    [
        "common/ZHR_TABLES" //
    ],
    function (ZHR_TABLES) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PensionPay.fragment.Detail2", {
            createContent: function (oController) {
                var oHeader1 = new sap.m.FlexBox({
                    justifyContent: "SpaceBetween",
                    alignContent: "End",
                    alignItems: "End",
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({
                                    text: "{i18n>LABEL_17003}", // 기본정보
                                    design: "Bold"
                                }).addStyleClass("sub-title")
                            ]
                        })
                    ]
                }).addStyleClass("info-box");

                var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_Table2", {
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}" // No data found
                }).addStyleClass("mt-10px");

                oTable2.setModel(new sap.ui.model.json.JSONModel());
                oTable2.bindRows("/Data");

                // 가입기관, 가입구분, 등급, 취득일, 상실일, 개인부담금(원), 회사지원금(원), 현재상태
                var col_info = [
                    { id: "PeninT", label: "{i18n>LABEL_17010}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "PentyT", label: "{i18n>LABEL_17011}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Pengr", label: "{i18n>LABEL_17012}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Penbg", label: "{i18n>LABEL_17013}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "Penen", label: "{i18n>LABEL_17014}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "SelfAmtT", label: "{i18n>LABEL_17015}", plabel: "", resize: true, span: 0, type: "number", sort: true, filter: true, align: "End" },
                    { id: "SuppAmtT", label: "{i18n>LABEL_17016}", plabel: "", resize: true, span: 0, type: "number", sort: true, filter: true, align: "End" },
                    { id: "PensaT", label: "{i18n>LABEL_17017}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true }
                ];

                ZHR_TABLES.makeColumn(oController, oTable2, col_info);

                var oHeader2 = new sap.m.FlexBox({
                    justifyContent: "SpaceBetween",
                    alignContent: "End",
                    alignItems: "End",
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Label({
                                    text: "{i18n>LABEL_17004}", // 연도별 불입 내역
                                    design: "Bold"
                                }).addStyleClass("sub-title")
                            ]
                        })
                    ]
                }).addStyleClass("info-box");

                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}" // No data found
                }).addStyleClass("mt-10px");

                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");

                // 연도, 개인부담금, 회사지원금, 합계
                var col_info2 = [
                    { id: "Zyear", label: "{i18n>LABEL_17006}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "SelfAmtT", label: "{i18n>LABEL_17007}", plabel: "", resize: true, span: 0, type: "number", sort: true, filter: true, align: "End" },
                    { id: "SuppAmtT", label: "{i18n>LABEL_17008}", plabel: "", resize: true, span: 0, type: "number", sort: true, filter: true, align: "End" },
                    { id: "TotalAmtT", label: "{i18n>LABEL_17009}", plabel: "", resize: true, span: 0, type: "number", sort: true, filter: true, align: "End" }
                ];

                ZHR_TABLES.makeColumn(oController, oTable, col_info2);

                var oIconTabBar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
                    expandable: false,
                    select: oController.onSelectIcontabar,
                    items: [
                        new sap.m.IconTabFilter({
                            key: "1",
                            text: "{i18n>LABEL_17002}", // 현황
                            content: [
                                new sap.ui.layout.VerticalLayout({
                                    content: [oHeader1, oTable2, oHeader2, oTable]
                                })
                            ]
                        }),
                        new sap.m.IconTabFilter({
                            key: "2",
                            text: "{i18n>LABEL_17005}", // 추가불입 신청
                            content: [sap.ui.jsfragment("ZUI5_HR_PensionPay.fragment.Detail2_Apply", oController)]
                        })
                    ]
                }).addStyleClass("tab-group mt-16px");

                return oIconTabBar;
            }
        });
    }
);
