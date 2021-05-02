sap.ui.define(
    [
        "common/Common", //
        "common/Formatter",
        "common/PageHelper",
        "common/ZHR_TABLES"
    ],
    function (Common, Formatter, PageHelper, ZHR_TABLES) {
        "use strict";

        sap.ui.jsview($.app.APP_ID, {
            _ColModel: [
                { id: "Reqdt", label: "{i18n>LABEL_42004}" /* 신청일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "auto" },
                { id: "MassnT", label: "{i18n>LABEL_42005}" /* 구분 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto" },
                { id: "MassgT", label: "{i18n>LABEL_42006}" /* 사유 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto" },
                { id: "Zlowbd", label: "{i18n>LABEL_42007}" /* 휴직기간 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "25%", templateGetter: "getPeriod" },
                { id: "Zrhsdt", label: "{i18n>LABEL_42008}" /* 복직(예정)일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "auto" },
                { id: "Zfmlnm", label: "{i18n>LABEL_42009}" /* 가족 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto" },
                { id: "Zfgbdt", label: "{i18n>LABEL_42010}" /* 가족 생년월일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "auto" },
                { id: "Status1T", label: "{i18n>LABEL_42011}" /* 결제상태 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "15%", templateGetter: "getStatus" }
            ],

            getControllerName: function () {
                return $.app.APP_ID;
            },

            createContent: function (oController) {
                this.loadModel();

                var infoBox = new sap.m.FlexBox({
                    justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                    alignContent: sap.m.FlexAlignContent.End,
                    alignItems: sap.m.FlexAlignItems.End,
                    fitContainer: true,
                    items: [
                        new sap.m.HBox({
                            items: [
                                new sap.m.Label({
                                    text: "{i18n>LABEL_42003}" // 신청 현황
                                }).addStyleClass("sub-title")
                            ]
                        }).addStyleClass("info-field-group"),
                        new sap.m.Button({
                            press: oController.onPressReq,
                            visible: {
                                path: "ReqBtn",
                                formatter: function (v) {
                                    if (v === "X") return true;
                                    else return false;
                                }
                            },
                            text: "{i18n>LABEL_42030}" // 신청
                        }).addStyleClass("button-light")
                    ]
                })
                    .addStyleClass("mt-20px")
                    .setModel(oController.LogModel)
                    .bindElement("/Data");

                var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
                    selectionMode: sap.ui.table.SelectionMode.None,
                    enableColumnReordering: false,
                    enableColumnFreeze: false,
                    enableBusyIndicator: true,
                    visibleRowCount: 10,
                    showOverlay: false,
                    showNoData: true,
                    width: "auto",
                    rowHeight: 37,
                    columnHeaderHeight: 38,
                    noData: "{i18n>LABEL_00901}"
                })
                    .addStyleClass("mt-10px")
                    .setModel(oController.TableModel)
                    .bindRows("/Data")
                    .attachCellClick(oController.onSelectedRow);

                ZHR_TABLES.makeColumn(oController, oTable, this._ColModel);

                return new PageHelper({
                    contentItems: [infoBox, oTable]
                });
            },

            loadModel: function () {
                // Model 선언
                $.app.setModel("ZHR_PERS_INFO_SRV");
                $.app.setModel("ZHR_COMMON_SRV");
            }
        });
    }
);
