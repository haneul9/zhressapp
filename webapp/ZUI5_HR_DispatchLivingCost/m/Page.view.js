$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../../common/PageHelper",
    "../../common/Common",
    "../../common/PickOnlyDateRangeSelection"
], function (PageHelper, Common, PickOnlyDateRangeSelection) {
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
			var vDate = new Date().getDate();		
			
			var oSearchBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
                            new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear, 0, 1),
								secondDateValue: new Date(vYear, vMonth, vDate)
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
                    new sap.m.Label({text: "{i18n>LABEL_59002}", design: "Bold"}).addStyleClass("sub-title"),
                    new sap.m.HBox({
						items: [
							new sap.m.Button({ // 신청
								press: oController.onPressReq.bind(oController),
								text: "{i18n>LABEL_59026}",
                                visible: {
                                    path: "EClose",
                                    formatter: function(v) {
                                        return v !== "X";
                                    }
                                }
							}).addStyleClass("button-light mr-10px"),
							new sap.m.Button({ // 계약기간 조기 종료 신청
								press: oController.onPressEnd.bind(oController),
								text: "{i18n>LABEL_59027}",
                                visible: {
                                    path: "EClose",
                                    formatter: function(v) {
                                        return v !== "X";
                                    }
                                }
							}).addStyleClass("button-light")
						]
					})
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
                        width: "7%",
                        hAlign: "Begin"
                    }),
                    new sap.m.Column ({
                        width: "55%",
                        hAlign: "Begin"
                    }),
                    new sap.m.Column ({
                        width: "auto",
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
                                    new sap.m.CheckBox({ // 선택
                                        select: oController.onChecked.bind(oController),
                                        selected: {
                                            path: "Check",
                                            formatter: function(v) {
                                                return v === "X";
                                            }
                                        },
                                        visible : {
                                            path : "Zflag", 
                                            formatter : function(v){
                                                return v === "X";
                                            }
                                        }
                                    })
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({ // 파견지
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
                                    new sap.m.Text({ // 계약기간
                                        text: {
                                            parts: [{ path: "Zscsym" }, { path: "Zsceym" }],
                                            formatter: function (v1, v2) {
                                                if (!v1 || !v2) return "";
                        
                                                v1 = v1.substr(0,4) + "-" + v1.substr(4);
                                                v2 = v2.substr(0,4) + "-" + v2.substr(4);
                        
                                                return v1 + " ~ " + v2;
                                            }
                                        },
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px")
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({ // 신청일
                                        text : {
                                            path : "Begda",
                                            formatter : function(v){
                                                return v ? Common.DateFormatter(v) : "";
                                            }
                                        },
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({ // 상태
                                        text: "{StatusT}",
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
                    oSearchBox,
                    oInfoBox,
                    oTable
                ]
            });
        }
    });
}); 