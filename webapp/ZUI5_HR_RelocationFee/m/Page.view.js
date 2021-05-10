sap.ui.define([
	"../../common/PageHelper",
    "../../common/PickOnlyDateRangeSelection"
], function (PageHelper, PickOnlyDateRangeSelection) {
"use strict";
    
    sap.ui.jsview($.app.APP_ID, {

        getControllerName: function() {
            return $.app.APP_ID;
        },

        createContent: function(oController) {
            // Model 선언
            $.app.setModel("ZHR_BENEFIT_SRV");
            $.app.setModel("ZHR_COMMON_SRV");

            var vYear = new Date().getFullYear();		
			
			var oSearchBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
                            new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear, 0, 1),
								secondDateValue: new Date()
							})
						]
                    }).addStyleClass("search-field-group pr-0"),
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressSer.bind(oController),
								icon: "sap-icon://search"
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group pl-0")
				]
			})
			.addStyleClass("search-box-mobile h-auto");

            var oInfoBox = new sap.m.HBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                fitContainer: true,
                items: [
                    // 신청현황
                    new sap.m.Label({text: "{i18n>LABEL_34002}", design: "Bold"}).addStyleClass("sub-title"),
                    new sap.m.Button({
                        press: oController.onPressReq.bind(oController),
                        text: "{i18n>LABEL_34022}", // 신청
                        visible: {
                            path: "/LogData/EClose",
                            formatter: function(v) {
                                if(v === "X") return false;
                                else return true;
                            }
                        }
                    }).addStyleClass("button-light")
                ]
            })
            .addStyleClass("info-box mb-10px")
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
                                    new sap.m.Text({
                                        textAlign: "Begin",
                                        text: {
                                            parts: [{ path: "ZfwkpsT" }, { path: "ZtwkpsT" }],
                                            formatter: function(v1, v2) {
                                                if(v1) return v1 + " → " + v2;
                                                else return "";
                                            }
                                        }
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({
                                        text: "{ZwtfmlT}",
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
                                    new sap.ui.commons.TextView({
                                        textAlign: "Begin",
                                        text: {
                                            path: "Ztstot",
                                            formatter: function(v) {
                                                if (v == null || v == "") return "";
                                                return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                            }
                                        }
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
                    oSearchBox,
                    oInfoBox,
                    oTable
                ]
            });
        }
    });
});