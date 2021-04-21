﻿sap.ui.define([
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
							new sap.m.Input(oController.PAGEID + "_SearchInput",{
                                width: "110px",
                                value: "{ITitle}",
                                placeholder: "{i18n>LABEL_57003}" // 검색어(제목)
                            })
                            .addStyleClass("mr-5px"),
                            new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
								width: "220px",
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
						]
					})
					.addStyleClass("button-group pl-0")
                ]
            })
            .addStyleClass("search-box-mobile h-auto")
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
                                    new sap.m.Text({ // 제목
                                        textAlign: "Begin",
                                        text : "{Title}"
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
                                    new sap.m.Text({ // 등록자
                                        text: "{ApernTxt}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px")
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({ // 등록일
                                        text : {
                                            path : "Sdate",
                                            formatter : function(v){
                                                return v ? Common.DateFormatter(v) : "";
                                            }
                                        },
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font font-14px"),
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
                                        textAlign : "Center"
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
                    new sap.m.HBox({
						items: [
							new sap.m.Button(oController.PAGEID + "_ScriptBtn", {
								press: oController.onScript.bind(oController),
								text: "{i18n>LABEL_57006}", // 구독
                                visible: {
                                    path: "/Notice",
                                    formatter: function(v) {
                                        return Common.checkNull(v);
                                    }
                                }
							}).addStyleClass("button-light"),
							new sap.m.Button(oController.PAGEID + "_ScriptCancelBtn", {
								press: oController.onScriptCancel.bind(oController),
								text: "{i18n>LABEL_57007}", // 구독 취소
                                visible: {
                                    path: "/Notice",
                                    formatter: function(v) {
                                        return v === "X";
                                    }
                                }
							}).addStyleClass("button-light")
						]
					})
					.setModel(oController.TableModel)
					.addStyleClass("button-group-notice"),
                    oInfoBox,
                    oTable
                ]
            });
        }
    });
});