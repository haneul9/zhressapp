sap.ui.define([
	"../../common/PageHelper",
    "../../common/Common"
], function (PageHelper, Common) {
"use strict";
    
    sap.ui.jsview($.app.APP_ID, {

        getControllerName: function() {
            return $.app.APP_ID;
        },

        createContent: function(oController) {
            // Model 선언
            $.app.setModel("ZHR_BENEFIT_SRV");
            $.app.setModel("ZHR_COMMON_SRV");

            var oInfoBox = new sap.m.HBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                fitContainer: true,
                items: [
                    // 신청현황
                    new sap.m.Label({text: "{i18n>LABEL_38002}", design: "Bold"}).addStyleClass("sub-title"),
                    new sap.m.Button({
                        press: oController.onPressReq.bind(oController),
                        text: "{i18n>LABEL_38044}", // 신청
                        visible: {
                            path: "/Bukrs",
                            formatter: function(v) {
                                if(v !== "A100") return true;
                                else return false;
                            }
                        }
                    }).addStyleClass("button-light")
                ]
            })
            .addStyleClass("info-box mb-10px")
            .setModel(oController.LogModel);

            var oHighTable = new sap.m.Table(oController.PAGEID + "_HighTable", {
                inset: false,
				rememberSelections: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				mode: sap.m.ListMode.SingleSelectMaster,
				itemPress: oController.onHighSelectedRow.bind(oController),
                columns: [
                    new sap.m.Column ({
                        width: "50%",
                        hAlign: "Begin"
                    }),
                    new sap.m.Column ({
                        width: "50%",
                        hAlign: "Begin"
                    })
                ],
                items: {
                    path: "/Data",
                    template: new sap.m.ColumnListItem({
                        type: sap.m.ListType.Active,
                        counter: 5,
                        cells: [
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({ // 성명
                                        textAlign: "Begin",
                                        text: "{Fname}"
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({ // 가족관계
                                        text: "{Atext}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px")
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({ // 생년월일
                                        text : {
                                            path : "Fgbdt",
                                            formatter : function(v){
                                                return v ? Common.DateFormatter(v) : "";
                                            }
                                        },
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({ // 나이
                                        text: "{Krage}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px")
                                ]
                            })
                        ]
                    })
                }
            })
            .setModel(oController.ChildrenModel);

            var targetBox = new sap.m.VBox({
				fitContainer: true,
                visible: {
                    path: "/Bukrs",
                    formatter: function(v) {
                        if(v === "A100") return true;
                        else return false;
                    }
                },
				items: [
                    new sap.m.FlexBox({
                        justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                        alignContent: sap.m.FlexAlignContent.End,
                        alignItems: sap.m.FlexAlignItems.End,
                        fitContainer: true,
                        items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_38027}", // 학자금 대상자
                                design: "Bold"
                            })
                            .addStyleClass("app-title"),
                            new sap.m.Button({
                                press: oController.onPressReq.bind(oController),
                                text: "{i18n>LABEL_38044}", // 신청
                                visible: {
                                    path: "/LogData/EClose",
                                    formatter: function(v) {
                                        if(v === "X") return false;
                                        else return true;
                                    }
                                }
                            })
                            .addStyleClass("button-light-sm")
                        ]
                    }),
                    oHighTable
				]
            })
            .setModel(oController.LogModel);

            var oTable = new sap.m.Table({
                inset: false,
				rememberSelections: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				mode: sap.m.ListMode.SingleSelectMaster,
				itemPress: oController.onSelectedRow.bind(oController),
                columns: [
                    new sap.m.Column ({
                        width: "55%",
                        hAlign: "Begin"
                    }),
                    new sap.m.Column ({
                        width: "45%",
                        hAlign: "Begin"
                    })
                ],
                items: {
                    path: "/Data",
                    template: new sap.m.ColumnListItem({
                        type: sap.m.ListType.Active,
                        counter: 5,
                        cells: [
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({ // 신청일
                                        textAlign: "Begin",
                                        text : {
                                            path : "Begda",
                                            formatter : function(v){
                                                return v ? Common.DateFormatter(v) : "";
                                            }
                                        },
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({ // 학교구분
                                        text: "{SchoolText}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px")
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({
                                        text: "{StatusT}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({ // 신청금액
                                        text : {
                                            path : "ReqSum",
                                            formatter : function(v){
                                                return v ? Common.numberWithCommas(v) : "0";
                                            }
                                        },
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px")
                                ]
                            })
                        ]
                    })
                }
            })
            .setModel(oController.TableModel);

            return new PageHelper({
                contentContainerStyleClass: "app-content-container-mobile",
                contentItems: [
                    targetBox,
                    oInfoBox,
                    oTable
                ]
            });
        }
    });
});