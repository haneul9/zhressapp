sap.ui.define(
    [
        "common/makeTable",
        "common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_RetirementPay.List", {
            getControllerName: function () {
                return "ZUI5_HR_RetirementPay.List";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_PAY_RESULT_SRV");
                
                var oFilter = new sap.m.FlexBox({
                    fitContainer: true,
                    items: [
                        new sap.m.FlexBox({
                            // 검색
                            items: [
                                new sap.m.Label({text: "{i18n>LABEL_60008}"}), // 대상기간
                                new sap.m.DatePicker({
									valueFormat : "yyyy-MM-dd",
						            displayFormat : "yyyy.MM",
						            value : "{Datum}",
									width : "200px",
									textAlign : "Begin",
									change : oController.onChangeDate
								})
                            ]
                        }).addStyleClass("search-field-group"),
                        new sap.m.FlexBox({
                            items: [
                                new sap.m.Button({
                                    press: oController.onPressSearch,
                                    text: "{i18n>LABEL_00100}" // 조회
                                }).addStyleClass("button-search")
                            ]
                        }).addStyleClass("button-group")
                    ]
                }).addStyleClass("search-box search-bg pb-7px mt-16px");

                var oJSONModel = new sap.ui.model.json.JSONModel();
                
                var oTable1 = new sap.ui.table.Table(oController.PAGEID + "_Table1", {
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    noData: "{i18n>LABEL_00901}", // No data found
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    extension : [new sap.m.Toolbar({
                                     content : [new sap.m.Label({text : "{i18n>LABEL_73002}"}).addStyleClass("sub-title")] // 퇴직금 정보
                                 }).addStyleClass("toolbarNoBottomLine")]
                }).addStyleClass("mt-10px");
                
                oTable1.setModel(oJSONModel);
                oTable1.bindRows("/Data1");

                var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_Table2", {
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    noData: "{i18n>LABEL_00901}", // No data found
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    extension : [new sap.m.Toolbar({
                                     content : [new sap.m.Label({text : "{i18n>LABEL_73003}"}).addStyleClass("sub-title")] // 평균급여 상세내역
                                 }).addStyleClass("toolbarNoBottomLine")]
                }).addStyleClass("mt-10px");
                
                oTable2.setModel(oJSONModel);
                oTable2.bindRows("/Data2");

                // 급여연월, 금액
                var col_info = [{id: "Yyyymm", label: "{i18n>LABEL_73014}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "BetrgT", label: "{i18n>LABEL_73015}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];

                MakeTable.makeColumn(oController, oTable2, col_info);

                var oTable3 = new sap.ui.table.Table(oController.PAGEID + "_Table3", {
                    selectionMode: "None",
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    noData: "{i18n>LABEL_00901}", // No data found
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    extension : [new sap.m.Toolbar({
                                     content : [new sap.m.Label({text : "{i18n>LABEL_73004}"}).addStyleClass("sub-title")] // 평균상여 상세내역
                                 }).addStyleClass("toolbarNoBottomLine")]
                }).addStyleClass("mt-10px");
                
                oTable3.setModel(oJSONModel);
                oTable3.bindRows("/Data3");

                // 상여연월, 상여구분, 금액
                var col_info = [{id: "Yyyymm", label: "{i18n>LABEL_73016}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "Ocrtx", label: "{i18n>LABEL_73017}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
                                {id: "BetrgT", label: "{i18n>LABEL_73015}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];

                MakeTable.makeColumn(oController, oTable3, col_info);

                var oContent = new sap.m.HBox({
                    items : [oTable2, new sap.ui.core.HTML({content : "<div style='width:10px' />"}), oTable3]
                });
                
                // var oContent = new sap.m.FlexBox({
                //     justytifyContent : "SpaceBetween",
                //     items : [new sap.m.HBox({items : [oTable2]}),
                //              new sap.m.HBox({items : [oTable3]})]
                // });

                var oPage = new PageHelper({
                                idPrefix : oController.PAGEID,
                                contentItems: [oFilter, oTable1, oContent]
                            });
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");
                
                return oPage;
            }
        });
    }
);
