$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/PickOnlyDateRangeSelection"
], function (Common,PageHelper, PickOnlyDateRangeSelection) {
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
			var vMonth = new Date().getMonth();		
			
			var oSearchBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
                            new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
                                width: "80%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear, 0, 1),
								secondDateValue: new Date(vYear, vMonth+1, 0)
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
                    new sap.m.Label({text: "{i18n>LABEL_29002}", design: "Bold"}).addStyleClass("sub-title"),
                    new sap.m.Button({
                        press: oController.onPressReq.bind(oController),
                        text: "{i18n>LABEL_29044}",
                        visible: {
                            path: "/ExportData/EClose",
                            formatter: function(v) {
                                if(v === "X") return false;
                                else return true;
                            }
                        }
                    }).addStyleClass("button-light")
                ]
            })
            .addStyleClass("info-box mb-10px")
            .setModel(oController.TuitionSearchModel);

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
                        width: "60%",
                        hAlign: "Begin"
                    }),
                    new sap.m.Column ({
                        width: "40%",
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
                                    new sap.ui.commons.TextView({
                                        text: {
                                            parts: [{ path: "Lecbe" }, { path: "Lecen" }],
                                            formatter: function (v1, v2) {
                                                if (!v1 || !v2) {
                                                    return "";
                                                }
                                                return Common.DateFormatter(v1) + " ~ " + Common.DateFormatter(v2);
                                            }
                                        },
                                        textAlign: "Center"
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({
                                        text: "{ZltypeTxt}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font")
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({
                                        text: "{StatusT}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font"),
                                    new sap.m.Text({
                                        text: {
                                            path: "Suport",
                                            formatter: function(v) {
                                                if(v) return common.Common.numberWithCommas(v);
                                                else return "0";
                                            }
                                        },
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font")
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