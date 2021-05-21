sap.ui.define(["../common/PageHelper", "../common/ZHR_TABLES"], function (PageHelper, ZHR_TABLES) {
    "use strict";

    sap.ui.jsview($.app.APP_ID, {
        _colModel: [
            { id: "Appdt", label: "{i18n>LABEL_23001}" /* 신청일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "auto" },
            { id: "Sitxt", label: "{i18n>LABEL_23002}" /* 인감구분 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%" },
            { id: "Sidoc", label: "{i18n>LABEL_23004}" /* 문서명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%", align: sap.ui.core.HorizontalAlign.Left },
            { id: "Sito", label: "{i18n>LABEL_23005}" /* 제출처 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto", align: sap.ui.core.HorizontalAlign.Left },
            { id: "AppEname", label: "{i18n>LABEL_23006}" /* 승인자 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto" },
            { id: "StatusText", label: "{i18n>LABEL_23008}" /* 결재상태 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "auto", templateGetter: "getStatusTxt" },
            { id: "Sealdate", label: "{i18n>LABEL_23009}" /* 날인일자 */, plabel: "", resize: true, span: 0, type: "date", sort: false, filter: false, width: "auto" }
        ],

        getControllerName: function () {
            return $.app.APP_ID;
        },

        createContent: function (oController) {
            this.loadModel();

            var vYear = new Date().getFullYear();
            var vMonth = new Date().getMonth() + 1;
            var oApplyDate = new sap.m.DateRangeSelection(oController.PAGEID + "_ApplyDate", {
                width: "210px",
                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                delimiter: "~",
                dateValue: new Date(vYear, vMonth - 1, 1),
                secondDateValue: new Date(vYear, vMonth, 0)
                // eslint-disable-next-line semi
            });
            oApplyDate.addDelegate(
                {
                    onAfterRendering: function () {
                        oApplyDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
                    }
                },
                oApplyDate
            );

            var infoBox = new sap.m.HBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                items: [
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_23018}" // 신청 현황
                            }).addStyleClass("sub-title")
                        ]
                    }).addStyleClass("info-field-group"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Button({
                                press: oController.onPressReq,
                                text: "{i18n>LABEL_23011}" // 신청
                            }).addStyleClass("button-light")
                        ]
                    }).addStyleClass("button-group")
                ]
            }).addStyleClass("info-box");

            var oApplyDateBox = new sap.m.FlexBox({
                // justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                // alignContent: sap.m.FlexAlignContent.End,
                // alignItems: sap.m.FlexAlignItems.End,
                fitContainer: true,
                items: [
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_23001}" // 신청일
                            }),
                            oApplyDate
                        ]
                    }).addStyleClass("search-field-group"),

                    new sap.m.HBox({
                        items: [
                            new sap.m.Button({
                                press: oController.onPressSer,
                                text: "{i18n>LABEL_23010}" // 조회
                            }).addStyleClass("button-search")
                        ]
                    }).addStyleClass("button-group")
                ]
            }).addStyleClass("search-box search-bg pb-7px mt-16px");

            var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
                selectionMode: sap.ui.table.SelectionMode.None,
                enableColumnReordering: false,
                enableColumnFreeze: false,
                enableBusyIndicator: true,
                visibleRowCount: 1,
                showOverlay: false,
                showNoData: true,
                width: "auto",
                rowHeight: 37,
                columnHeaderHeight: 38,
                noData: "{i18n>LABEL_00901}"
            })
                .addStyleClass("mt-10px row-link")
                .setModel(oController.TableModel)
                .bindRows("/Data")
                .attachCellClick(oController.onSelectedRow);

            ZHR_TABLES.makeColumn(oController, oTable, this._colModel);

            return new PageHelper({
                contentItems: [oApplyDateBox, infoBox, oTable]
            });
        },

        loadModel: function () {
            // Model 선언
            $.app.setModel("ZHR_BENEFIT_SRV");
            $.app.setModel("ZHR_COMMON_SRV");
        }
    });
});
