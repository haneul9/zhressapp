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
            $.app.setModel("ZHR_COMMON_SRV");

            var vYear = new Date().getFullYear();
			var vMonth = new Date().getMonth()+1;	

            var oInfoBox = new sap.m.HBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                fitContainer: true,
                items: [
                    new sap.m.HBox({
						items: [
							new sap.m.Input(oController.PAGEID + "_SearchInput", {
                                width: "110px",
                                value: "{ITitle}",
                                placeholder: "{i18n>LABEL_56002}" // 검색어(제목)
                            })
                            .addStyleClass("mr-5px"),
                            new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
							//	width: "220px",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear, vMonth-2, 1),
								secondDateValue: new Date(vYear, vMonth, 0)
							})
						]
                    }).addStyleClass("search-field-group pr-0"),
					new sap.m.HBox({
						items: [
                            new sap.m.Button({
								press: oController.onPressSer.bind(oController),
								icon: "sap-icon://search"
							}).addStyleClass("button-search")
                        //    new sap.m.Button({
						//		press: oController.onPressSer.bind(oController),
						//		icon : "sap-icon://bell" // 알림
						//	}).addStyleClass("button-light h-42px ml-8px")
						]
					})
                    .addStyleClass("button-group pl-0")
                ]
            })
            .addStyleClass("search-box-mobile h-auto")
            .setModel(oController.LogModel)
			.bindElement("/Data");

            var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.End,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.Button({
						press: oController.onPressRegi.bind(oController),
						text: "{i18n>LABEL_56005}" // 등록
					}).addStyleClass("button-light")
				]
            })
            .addStyleClass("button-group mt-5px mb-5px");

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
                        width: "100%",
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
                                fitContainer: true,
                                width: "100%",
                                items: [
                                    new sap.m.Text({
                                        text : "{Title}",
                                        textAlign : "Begin"
                                    }).addStyleClass("L2P13Font font-14px pb-8px"),
                                    new sap.m.HBox({
                                        justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                                        items: [
                                            new sap.ui.commons.TextView({
                                                text : {
                                                    parts: [{path: "Aedtm"}, {path: "Aetim"}],
                                                    formatter: function(v1, v2) {
                                                        if(v1 && v2){
                                                            v1 = Common.DateFormatter(v1);
                                                            v2 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" }).format(new Date(v2.ms), true);
                                                        }
                                                        return v1 + " " + v2; 
                                                    }
                                                }, 
                                                textAlign : "Begin"
                                            })
                                            .addStyleClass("L2P13Font font-14px"),
                                            new sap.m.HBox({
                                                justifyContent: sap.m.FlexJustifyContent.End,
                                                alignContent: sap.m.FlexAlignContent.End,
                                                alignItems: sap.m.FlexAlignItems.End,
                                                items: [
                                                    new sap.ui.core.Icon({
                                                        visible: {
                                                            path: "Zgood",
                                                            formatter: function(v) {
                                                                return v !== "0" && Common.checkNull(!v);
                                                            }
                                                        },
                                                        src: "sap-icon://thumb-up"
                                                    })
                                                    .addStyleClass("icon-HiTokTok ok"),
                                                    new sap.m.Text({
                                                        visible: {
                                                            path: "Zgood",
                                                            formatter: function(v) {
                                                                return v !== "0" && Common.checkNull(!v);
                                                            }
                                                        },
                                                        width: "auto",
                                                        text: "{Zgood}"
                                                    }).addStyleClass("mr-8px font-12px"),
                                                    new sap.ui.core.Icon({
                                                        visible: {
                                                            path: "Zbed",
                                                            formatter: function(v) {
                                                                return v !== "0" && Common.checkNull(!v);
                                                            }
                                                        },
                                                        src: "sap-icon://thumb-down"
                                                    })
                                                    .addStyleClass("icon-HiTokTok no"),
                                                    new sap.m.Text({
                                                        visible: {
                                                            path: "Zbed",
                                                            formatter: function(v) {
                                                                return v !== "0" && Common.checkNull(!v);
                                                            }
                                                        },
                                                        width: "auto",
                                                        text: "{Zbed}"
                                                    }).addStyleClass("font-12px")
                                                ]
                                            })
                                        ]
                                    })
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
                    infoBox,
                    oTable
                ]
            });
        }
    });
});