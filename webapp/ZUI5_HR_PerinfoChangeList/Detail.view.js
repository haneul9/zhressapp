sap.ui.define(
    [
        "common/Common", //
        "common/PageHelper",
        "common/ZHR_TABLES"
    ],
    function (Common, PageHelper, ZHR_TABLES) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_PerinfoChangeList.Detail", {
            getControllerName: function () {
                return "ZUI5_HR_PerinfoChangeList.Detail";
            },

            createContent: function (oController) {
                console.log(this);
                console.log(oController.PAGEID);
                return new PageHelper({
                    idPrefix: "Detail-",
                    // title: "{i18n>LABEL_66001}", // 개인정보 변경 신청
                    showNavButton: true,
                    navBackFunc: oController.navBack,
                    contentItems: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.VBox({
                                    width: "30%",
                                    items: [
                                        new sap.m.HBox({
                                            items: [
                                                this.getLabel("header", oController.getBundleText("LABEL_66009"), "200px", "Right"),
                                                new sap.m.Text({
                                                    // width: "300px",
                                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                    text: "학력사항"
                                                })
                                            ]
                                        }).addStyleClass("search-field-group")
                                    ]
                                }).addStyleClass("search-inner-vbox"),
                                new sap.m.VBox({
                                    width: "30%",
                                    items: [
                                        new sap.m.HBox({
                                            items: [
                                                this.getLabel("header", oController.getBundleText("LABEL_66011"), "200px", "Right"),
                                                new sap.m.Text({
                                                    // width: "300px",
                                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                    text: "학력사항"
                                                })
                                            ]
                                        }).addStyleClass("search-field-group")
                                    ]
                                }).addStyleClass("search-inner-vbox"),
                                new sap.m.VBox({
                                    width: "30%",
                                    items: [
                                        new sap.m.HBox({
                                            items: [
                                                this.getLabel("header", oController.getBundleText("LABEL_66012"), "200px", "Right"),
                                                new sap.m.Text({
                                                    // width: "300px",
                                                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                                    text: "학력사항"
                                                })
                                            ]
                                        }).addStyleClass("search-field-group")
                                    ]
                                }).addStyleClass("search-inner-vbox"),
                                new sap.m.VBox({
                                    width: "10%",
                                    items: [
                                        new sap.m.HBox({
                                            items: [
                                                new sap.m.Button({
                                                    press: oController.navBack.bind(oController),
                                                    text: oController.getBundleText("LABEL_66015") // 목록,
                                                }).addStyleClass("button-light")
                                            ]
                                        }).addStyleClass("search-field-group")
                                    ]
                                }).addStyleClass("search-inner-vbox")
                            ]
                        }).addStyleClass("search-box h-auto p-0"),
                        this.getTable(oController)
                    ]
                })
                    .setModel(oController.ApplyModel)
                    .bindElement("/Data");
            },

            getTable: function (oController) {
                var oTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
                    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    busyIndicatorDelay: 0,
                    visibleRowCount: 1,
                    showOverlay: false,
                    showNoData: true,
                    width: "100%",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                    .addStyleClass("mt-10px")
                    .setModel(oController._ApplyJSonModel)
                    .bindRows("/Data");

                // ZHR_TABLES.makeColumn(oController, oTable, [
                // 	{ id: "Idx",      label: oController.getBundleText("LABEL_66008") /* 번호     */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "8%" },
                // 	{ id: "ColName",  label: oController.getBundleText("LABEL_66009")/* 컬럼명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "33%" },
                // 	{ id: "AppBefore", label: oController.getBundleText("LABEL_66010") /* 신청전 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "33%" },
                // 	{ id: "AppAfter",  label: oController.getBundleText("LABEL_66011")/* 신청후     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "33%" }
                // ]);

                ZHR_TABLES.makeColumn(oController, oTable, [
                    { id: "Idx", label: "{i18n>LABEL_66008}" /* 번호     */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "8%" },
                    { id: "ReqName", label: "{i18n>LABEL_66009}" /* 신청내용 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" },
                    { id: "AppDate", label: "{i18n>LABEL_66010}" /* 신청일 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "18%" },
                    { id: "AppType", label: "{i18n>LABEL_66011}" /* 신청구분     */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" },
                    { id: "Status", label: "{i18n>LABEL_66012}" /* 진행상태   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" },
                    { id: "ReqDate", label: "{i18n>LABEL_66013}" /* 반영일   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "18%" },
                    { id: "Admin", label: "{i18n>LABEL_66014}" /* 담당자   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "16%" }
                ]);

                return oTable;
            },

            getLabel: function (type, labelText, wid, align, isReq) {
                if (type === "header") {
                    return new sap.m.Label({
                        layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
                        textAlign: Common.checkNull(align) ? "Center" : align,
                        required: Common.checkNull(isReq) ? false : isReq,
                        text: labelText,
                        width: Common.checkNull(wid) ? "100%" : wid
                    }).addStyleClass("flexbox-table-header");
                } else {
                    // type === "cell"
                    return new sap.m.Label({
                        layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                        textAlign: Common.checkNull(align) ? "Center" : align,
                        required: Common.checkNull(isReq) ? false : isReq,
                        text: labelText,
                        width: Common.checkNull(wid) ? "auto" : wid
                    });
                }
            }
        });
    }
);
