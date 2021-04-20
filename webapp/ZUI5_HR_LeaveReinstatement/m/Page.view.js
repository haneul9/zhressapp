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
            $.app.setModel("ZHR_PERS_INFO_SRV");
            $.app.setModel("ZHR_COMMON_SRV");

            var oInfoBox = new sap.m.HBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                fitContainer: true,
                items: [
                    // 신청현황
                    new sap.m.Label({text: "{i18n>LABEL_42003}", design: "Bold"}).addStyleClass("sub-title"),
                    new sap.m.Button({
                        press: oController.onPressReq.bind(oController),
                        text: "{i18n>LABEL_38044}", // 신청
                        visible: {
							path: "ReqBtn",
							formatter: function(v) {
								return v === "X";
							}
						}
                    }).addStyleClass("button-light-sm")
                ]
            })
            .addStyleClass("info-box mb-10px")
            .setModel(oController.LogModel)
			.bindElement("/Data");

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
                        width: "45%",
                        hAlign: "Begin"
                    }),
                    new sap.m.Column ({
                        width: "55%",
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
                                    new sap.m.Text({ // 구분
                                        textAlign: "Begin",
                                        text : "{MassnT}"
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({ // 사유
                                        text: "{MassgT}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px")
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({ // 신청일
                                        text : {
                                            path : "Reqdt",
                                            formatter : function(v){
                                                return v ? Common.DateFormatter(v) : "";
                                            }
                                        },
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({ // 상태
                                        text: "{Status1T}",
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
                    oInfoBox,
                    oTable
                ]
            });
        }
    });
});