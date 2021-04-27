sap.ui.define(["common/ZHR_TABLES"], function (ZHR_TABLES) {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_Pass.fragment.FacilityList", {
        createContent: function (oController) {
            // init condo-handler
            var oModel = oController.getFacilityHandler.call(oController).Model();

            return new sap.m.FlexBox({
                direction: sap.m.FlexDirection.Column,
                items: [this.getSearchBox(oController), this.getRequestInfoBox(), this.getRequestTable(oController), this.getInfoBox(), this.getTable(oController)]
            }).setModel(oModel);
        },

        getSearchBox: function (oController) {
            var FacilityHandler = oController.FacilityHandler;

            return new sap.m.FlexBox({
                fitContainer: true,
                items: [
                    new sap.m.FlexBox({
                        // 검색
                        items: [
                            new sap.m.FlexBox({
                                items: [
                                    new sap.m.Label({
                                        width: "60px",
                                        text: "{i18n>LABEL_09010}"
                                    }), // 대상년도
                                    new sap.m.ComboBox({
                                        selectedKey: "{Zyear}",
                                        items: {
                                            path: "/Zyears",
                                            template: new sap.ui.core.ListItem({
                                                key: "{Code}",
                                                text: "{Text}"
                                            })
                                        }
                                    }),
                                    new sap.m.Label({
                                        width: "60px",
                                        text: "{i18n>LABEL_09011}"
                                    }), // 이용시설
                                    new sap.m.ComboBox({
                                        selectedKey: "{Facty}",
                                        items: {
                                            path: "/Factys",
                                            template: new sap.ui.core.ListItem({
                                                key: "{Code}",
                                                text: "{Text}"
                                            })
                                        }
                                    })
                                ]
                            }).addStyleClass("search-field-group"),
                            new sap.m.FlexBox({
                                items: [
                                    new sap.m.Button({
                                        press: FacilityHandler.search.bind(FacilityHandler),
                                        text: "{i18n>LABEL_09012}" // 조회
                                    }).addStyleClass("button-search")
                                ]
                            }).addStyleClass("button-group")
                        ]
                    }) // 검색
                ]
            })
                .addStyleClass("search-box search-bg pb-7px")
                .bindElement("/SearchConditions");
        },

        getRequestInfoBox: function () {
            return new sap.m.FlexBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                alignContent: sap.m.FlexAlignContent.End,
                alignItems: sap.m.FlexAlignItems.End,
                fitContainer: true,
                items: [
                    new sap.m.FlexBox({
                        items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_09014}"
                            }).addStyleClass("sub-title") // 신청내역
                        ]
                    })
                ]
            }).addStyleClass("info-box");
        },

        getRequestTable: function (oController) {
            var FacilityHandler = oController.FacilityHandler;

            var oRequestTable = new sap.ui.table.Table(oController.PAGEID + "_RequestMyTable", {
                selectionMode: sap.ui.table.SelectionMode.None,
                enableColumnReordering: false,
                enableColumnFreeze: false,
                enableBusyIndicator: true,
                visibleRowCount: 3,
                showOverlay: false,
                showNoData: true,
                width: "auto",
                rowHeight: 37,
                columnHeaderHeight: 38,
                noData: "{i18n>LABEL_00901}"
            })
                .addStyleClass("mt-10px")
                .bindRows("/MyList");

            var columnModels = [
                {
                    id: "Usday",
                    label: "{i18n>LABEL_09001}" /* 사용일    */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "date",
                    sort: true,
                    filter: true,
                    width: "8%"
                },
                {
                    id: "Reqno",
                    label: "{i18n>LABEL_09002}" /* 신청매수  */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: true,
                    filter: true,
                    width: "8%"
                },
                {
                    id: "Resno",
                    label: "{i18n>LABEL_09003}" /* 예약매수  */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: true,
                    filter: true,
                    width: "8%"
                },
                {
                    id: "Zbigo",
                    label: "{i18n>LABEL_09004}" /* 비고      */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: true,
                    filter: true,
                    width: "27%",
                    align: "Begin"
                },
                {
                    id: "Rettx",
                    label: "{i18n>LABEL_09005}" /* 회신사항  */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: true,
                    filter: true,
                    width: "27%",
                    align: "Begin"
                },
                {
                    id: "StatusT",
                    label: "{i18n>LABEL_09006}" /* 진행상태  */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: true,
                    filter: true,
                    width: "10%"
                },
                {
                    id: "procs",
                    label: "{i18n>LABEL_09007}" /* 처리      */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "template",
                    sort: false,
                    filter: false,
                    width: "12%",
                    templateGetter: "getProcessButtons",
                    templateGetterOwner: FacilityHandler
                }
            ];

            ZHR_TABLES.makeColumn(oController, oRequestTable, columnModels);

            return oRequestTable;
        },

        getInfoBox: function () {
            return new sap.m.FlexBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                alignContent: sap.m.FlexAlignContent.End,
                alignItems: sap.m.FlexAlignItems.End,
                fitContainer: true,
                items: [
                    new sap.m.FlexBox({
                        items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_09015}"
                            }).addStyleClass("sub-title") // 이용신청
                        ]
                    })
                ]
            }).addStyleClass("info-box");
        },

        getTable: function (oController) {
            var FacilityHandler = oController.FacilityHandler;

            var oTable = new sap.ui.table.Table(oController.PAGEID + "_RequestFacTable", {
                selectionMode: sap.ui.table.SelectionMode.None,
                enableColumnReordering: false,
                enableColumnFreeze: false,
                enableBusyIndicator: true,
                visibleRowCount: 6,
                showOverlay: false,
                showNoData: true,
                width: "auto",
                rowHeight: 37,
                columnHeaderHeight: 38,
                noData: "{i18n>LABEL_00901}"
            })
                .addStyleClass("mt-10px")
                .bindRows("/RequestList");

            var columnModels = [
                {
                    id: "Usday",
                    label: "{i18n>LABEL_09001}" /* 사용일          */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "date",
                    sort: true,
                    filter: true,
                    width: "10%"
                },
                {
                    id: "Usett",
                    label: "{i18n>LABEL_09016}" /* 배정매수        */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: true,
                    filter: true,
                    width: "10%"
                },
                {
                    id: "Reqno",
                    label: "{i18n>LABEL_09002}" /* 신청매수        */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: true,
                    filter: true,
                    width: "10%"
                },
                {
                    id: "Rescf",
                    label: "{i18n>LABEL_09017}" /* 승인완료 매수   */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: true,
                    filter: true,
                    width: "10%"
                },
                {
                    id: "Rvacf",
                    label: "{i18n>LABEL_09018}" /* 신청가능 매수   */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: true,
                    filter: true,
                    width: "10%"
                },
                {
                    id: "Canps",
                    label: "{i18n>LABEL_09019}" /* 취소 가능일     */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "date",
                    sort: true,
                    filter: true,
                    width: "10%"
                },
                {
                    id: "UstypT",
                    label: "{i18n>LABEL_09020}" /* 사용시기(시즌)  */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "string",
                    sort: false,
                    filter: false,
                    width: "10%"
                },
                {
                    id: "Coamt",
                    label: "{i18n>LABEL_09021}" /* 회사지원금      */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "money",
                    sort: false,
                    filter: false,
                    width: "10%"
                },
                {
                    id: "Cupbt",
                    label: "{i18n>LABEL_09022}" /* 쿠폰사용료      */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "money",
                    sort: false,
                    filter: false,
                    width: "10%"
                },
                {
                    id: "procs",
                    label: "{i18n>LABEL_09007}" /* 처리            */,
                    plabel: "",
                    resize: true,
                    span: 0,
                    type: "template",
                    sort: false,
                    filter: false,
                    width: "10%",
                    templateGetter: "getRequestButton",
                    templateGetterOwner: FacilityHandler
                }
            ];

            ZHR_TABLES.makeColumn(oController, oTable, columnModels);

            return oTable;
        }
    });
});
