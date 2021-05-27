sap.ui.define(
    [
		"common/makeTable", //
		"common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_Pregnant.List", {
            getControllerName: function () {
                return "ZUI5_HR_Pregnant.List";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_BENEFIT_SRV");

                oController.setupView();

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
                    noData: "{i18n>LABEL_00901}", // No data found
                    extension: [
                        new sap.m.Toolbar({
                            height: "45px",
                            content: [
                                new sap.m.ToolbarSpacer(),
                                new sap.m.Button({
                                    text: "{i18n>LABEL_00152}", // 신청
                                    press: oController.onPressApply
                                }).addStyleClass("button-light")
                            ]
                        })
                    ],
                    cellClick: oController.onSelectTable,
                    rowActionCount: 1,
                    rowActionTemplate: [
                        new sap.ui.table.RowAction({
                            items: [
                                new sap.ui.table.RowActionItem({
                                    type: "Navigation",
                                    customData: [new sap.ui.core.CustomData({ key: "", value: "{}" })],
                                    press: function (oEvent) {
                                        oController.onSelectTable(oEvent, "X");
                                    }
                                })
                            ]
                        })
                    ]
                }).addStyleClass("mt-10px row-link");

                oTable.setModel(new sap.ui.model.json.JSONModel());
                oTable.bindRows("/Data");

                // 신청일, 법정관리유형, 임신시작일, 출산(예정)일, 단축근무시간, 단축근무시작(12주이하), 단축근무종료(12주이하), 단축근무시작(36주이후), 단축근무종료(36주이후), 진행상태
                var col_info = [
                    { id: "Reqdt", label: "{i18n>LABEL_39004}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "MptypT", label: "{i18n>LABEL_39005}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Prebg", label: "{i18n>LABEL_39006}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "Preen", label: "{i18n>LABEL_39007}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "PampmT", label: "{i18n>LABEL_39008}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true },
                    { id: "Begsh", label: "{i18n>LABEL_39009}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "Endsh", label: "{i18n>LABEL_39010}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "Begsh2", label: "{i18n>LABEL_39011}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "Endsh2", label: "{i18n>LABEL_39012}", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true },
                    { id: "StatusT", label: "{i18n>LABEL_39013}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true }
                ];

                MakeTable.makeColumn(oController, oTable, col_info);

                var oIcontabbar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
                    expandable: false,
                    expanded: true,
                    backgroundDesign: "Transparent",
                    items: [
                        new sap.m.IconTabFilter({
                            key: "1",
                            text: "{i18n>LABEL_39002}", // 신청내역
                            design: "Vertical",
                            content: [oTable, new sap.ui.core.HTML({ content: "<div style='height:10px' />" }), sap.ui.jsfragment("ZUI5_HR_Pregnant.fragment.Message", oController)]
                        }),
                        new sap.m.IconTabFilter({
                            key: "2",
                            text: "{i18n>LABEL_39003}", // 등록신청
                            design: "Vertical",
                            content: [sap.ui.jsfragment("ZUI5_HR_Pregnant.fragment.Detail", oController), new sap.ui.core.HTML({ content: "<div style='height:10px' />" }), sap.ui.jsfragment("ZUI5_HR_Pregnant.fragment.Message", oController)]
                        })
                    ],
                    select: oController.handleIconTabBarSelect,
                    content: []
                }).addStyleClass("tab-group mt-16px");

                var oPage = new PageHelper({
                    idPrefix: oController.PAGEID,
                    contentItems: [oIcontabbar]
                });
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");

                // var oContent = new sap.m.FlexBox({
                // 	  justifyContent: "Center",
                // 	  fitContainer: true,
                // 	  items: [new sap.m.FlexBox({
                // 				  direction: sap.m.FlexDirection.Column,
                // 				  items: [new sap.m.FlexBox({
                // 							  alignItems: "End",
                // 							  fitContainer: true,
                // 							  items: [new sap.m.Text({text: oBundleText.getText("LABEL_39001")}).addStyleClass("app-title")] // 임산부 등록
                // 						  }).addStyleClass("app-title-container"),
                // 						  oIcontabbar,
                // 						  new sap.ui.core.HTML({content : "<div style='height:20px' />"})]
                // 			  }).addStyleClass("app-content-container-wide")]
                // }).addStyleClass("app-content-body");

                // /////////////////////////////////////////////////////////

                // var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
                // 	// customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
                // 	showHeader : false,
                // 	content: [oContent]
                // }).addStyleClass("app-content");

                // oPage.setModel(oController._ListCondJSonModel);
                // oPage.bindElement("/Data");

                return oPage;
            }
        });
    }
);
