sap.ui.define(
    [
        "common/makeTable",
        "common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_FlexworktimeStatus.m.List", {
            getControllerName: function () {
                return "ZUI5_HR_FlexworktimeStatus.m.List";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_FLEX_TIME_SRV");
                
                var oCalendar = new sap.m.VBox({
                    items : [new sap.m.Toolbar({
                                height : "40px",
                                content : [new sap.m.Button({
                                                type : "Transparent",
                                                icon : "sap-icon://nav-back",
                                                press : function(oEvent){
                                                        oController.onSetYearMonth(-1);
                                                },
                                                tooltip : " "
                                            }),
                                            new sap.m.ToolbarSpacer(),
                                            new sap.m.Text({
                                                text : {
                                                    parts : [{path : "Year"}, {path : "Month"}],
                                                    formatter : function(fVal1, fVal2){
                                                        return fVal1 + "." + (fVal2 < 10 ? "0" + fVal2 : fVal2);
                                                    }
                                                }
                                            }).addStyleClass("font-bold"),
                                            new sap.m.ToolbarSpacer(),
                                            new sap.m.Button({
                                                type : "Transparent",
                                                icon : "sap-icon://navigation-right-arrow",
                                                press : function(oEvent){
                                                        oController.onSetYearMonth(1);
                                                },
                                                tooltip : " "
                                            })]
                            }).addStyleClass("toolbarNoBottomLine"),
                            new sap.m.HBox({
                                justifyContent : "End",
                                fitContainer : true,
                                items: [
                                        new sap.m.ToolbarSpacer(),
                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                                        new sap.m.Label({text: "{i18n>LABEL_00197}"}).addStyleClass("custom-legend-item"), // 결재중
                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                                        new sap.m.Label({text: "{i18n>LABEL_00198}"}).addStyleClass("custom-legend-item"), // 반려
                                        new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
                                        new sap.m.Label({text: "{i18n>LABEL_00199}"}).addStyleClass("custom-legend-item"), // 결재완료
                                        new sap.m.Label().addStyleClass("custom-legend-color bg-yellow"),
                                        new sap.m.Label({text: "{i18n>LABEL_69057}"}).addStyleClass("custom-legend-item")
                                    ]
                            }).addStyleClass("custom-legend-group mt-5px mb-5px mr-5px"),
                            new sap.m.VBox(oController.PAGEID + "_Calendar")]
                });
                
                // 휴가쿼터 현황
                var oTable1 = new sap.m.Table(oController.PAGEID + "_Table1", {
                    inset: false,
                    rememberSelections: false,
                    noDataText: oBundleText.getText("LABEL_00901"),
                    growing: false,
                    // growingThreshold: 5,
                    mode: "None",
                    columns: [
                        new sap.m.Column ({
                            width: "30%",
                            hAlign: "Begin"
                        }),
                        new sap.m.Column ({
                            width: "70%",
                            hAlign: "End"
                        })
                    ],
                    items: {
                        path: "/Data",
                        template: new sap.m.ColumnListItem({
                            type: sap.m.ListType.Active,
                            counter: 5,
                            cells: [
                                new sap.m.VBox({
                                    items : [new sap.m.Text({ // 쿼터명
                                                textAlign: "Begin",
                                                text: "{Ktext}"
                                            })]
                                }),
                                new sap.m.VBox({
                                    items : [new sap.m.Text({ // 발생/사용/잔여
                                                textAlign: "Begin",
                                                text: {
                                                    parts : [{path : "Crecnt"}, {path : "Usecnt"}, {path : "Balcnt"}],
                                                    formatter : function(fVal1, fVal2, fVal3){
                                                        return  oController.getBundleText("LABEL_69023") + " " + parseFloat(fVal1) + " / " +
                                                                oController.getBundleText("LABEL_69024") + " " + parseFloat(fVal2) + " / " +
                                                                oController.getBundleText("LABEL_69025") + " " + parseFloat(fVal3)
                                                    }
                                                }
                                            })]
                                })
                            ]
                        })
                    }
                });
                
                oTable1.setModel(new sap.ui.model.json.JSONModel());
                
                var oLayout1 = new sap.m.VBox({
                    fitContainer: true,
                    items: [new sap.m.FlexBox({
                                items : [new sap.m.Label({
                                            text: "{i18n>LABEL_69020}", // 휴가쿼터 현황
                                            design: "Bold"
                                        }).addStyleClass("sub-title")]
                            }).addStyleClass("info-box pt-5px"),
                            new sap.ui.core.HTML({
                                content : '<canvas id="vacChart" class="ChartClass"></canvas>'
                            }),
                            oTable1]
                });
                
                // 근태수당 현황
                var oTable2 = new sap.m.Table(oController.PAGEID + "_Table2", {
                    inset: false,
                    rememberSelections: false,
                    noDataText: "{i18n>LABEL_00901}",
                    growing: false,
                    mode: "None",
                    columns: [
                        new sap.m.Column ({
                            width: "50%",
                            hAlign: "Begin"
                        }),
                        new sap.m.Column ({
                            width: "50%",
                            hAlign: "End"
                        })
                    ],
                    items: {
                        path: "/Data",
                        template: new sap.m.ColumnListItem({
                            type: sap.m.ListType.Active,
                            counter: 5,
                            cells: [
                                new sap.m.VBox({
                                    items : [new sap.m.Text({
                                                textAlign: "Begin",
                                                text: "{Lgtxt}"
                                            })]
                                }),
                                new sap.m.VBox({
                                    items : [new sap.m.Text({
                                                textAlign: "Begin",
                                                text: "{Anzhl}"
                                            })]
                                })
                            ]
                        })
                    }
                });
                
                oTable2.setModel(new sap.ui.model.json.JSONModel());
                
                var oLayout2 = new sap.m.VBox({
                    fitContainer: true,
                    items: [new sap.m.FlexBox({
                                items : [new sap.m.Label({
                                            text: "{i18n>LABEL_69021}", // 근태수당 현황
                                            design: "Bold"
                                        }).addStyleClass("sub-title")]
                            }).addStyleClass("info-box pt-5px"),
                            oTable2]
                });
                
                // 근무시간 현황
                var oTable3 = new sap.m.Table(oController.PAGEID + "_Table3", {
                    inset: false,
                    rememberSelections: false,
                    noDataText: "{i18n>LABEL_00901}",
                    growing: false,
                    mode: "None",
                    columns: [
                        new sap.m.Column ({
                            width: "50%",
                            hAlign: "Begin"
                        }),
                        new sap.m.Column ({
                            width: "50%",
                            hAlign: "End"
                        })
                    ],
                    items: {
                        path: "/Data",
                        template: new sap.m.ColumnListItem({
                            type: sap.m.ListType.Active,
                            counter: 5,
                            cells: [
                                new sap.m.VBox({
                                    items : [new sap.m.Text({
                                                textAlign: "Begin",
                                                text: "{Text}"
                                            })]
                                }),
                                new sap.m.VBox({
                                    items : [new sap.m.Text({
                                                textAlign: "Begin",
                                                text: {
                                                    parts : [{path : "Value"}, {path : "Style"}],
                                                    formatter : function(fVal1, fVal2){
                                                        this.removeStyleClass("color-blue color-info-red color-darkgreen");
                                                        
                                                        if(fVal2){
                                                            this.addStyleClass(fVal2);
                                                            this.addStyleClass("font-bold");
                                                        }
                                                        
                                                        return fVal1;
                                                    }
                                                }
                                            })]
                                })
                            ]
                        })
                    }
                });
                
                oTable3.setModel(new sap.ui.model.json.JSONModel());
                
                var oLayout3 = new sap.m.VBox({
                    fitContainer: true,
                    items: [new sap.m.FlexBox({
                                items : [new sap.m.Label({
                                            text: "{i18n>LABEL_69022}", // 근무시간 현황
                                            design: "Bold"
                                        }).addStyleClass("sub-title")]
                            }).addStyleClass("info-box pt-5px"),
                            new sap.ui.core.HTML({
                                content : '<div style="background-color: rgb(236,244,253);">' +
                                            '<div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 15px;">' +
                                                '<div style="font-size: 15px; color: rgb(4,62,127);">' + "{i18n>LABEL_69051}" + '</div>' + // 총 근로시간
                                                '<div style="font-size: 15px; font-weight: bold; color: rgb(4,62,127);">' + "{Tottmtx}" + '</div>' +
                                            '</div>' +
                                        '</div>'	
                            }),
                            new sap.ui.core.HTML({
                                content : '<div style="display: flex; flex-direction: column; align-items: center; width: 100%; margin-top: 10px; margin-bottom:10px">' +
                                            '<div class="progress" style="height: 20px; width: 100%; display: flex; position: relative;">' +
                                                '<div id="bar" style="height: 100%; position: absolute;" class="progress-bar bg-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">' +
                                                '</div>' +
                                                '<div style="height: 100%; position: absolute; background-color: transparent; border-right: solid; width: 80%;">' +
                                                '</div>' +
                                            '</div>' +
                                            '<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">' +
                                                '<div style="font-size: 14px; color: rgb(145,149,155)">' + "0h" + '</div>' +
                                                '<div style="font-size: 14px; color: rgb(145,149,155); margin-right: 55px;">' + '{CtrnmHH}' + "h" + '</div>' +
                                            '</div>' +
                                        '</div>'
                            }),
                            oTable3]
                });
                
                var oPage = new PageHelper({
                                idPrefix : oController.PAGEID,
                                contentContainerStyleClass: "app-content-container-mobile",
                                contentItems: [new sap.m.VBox({
                                                items : [oCalendar, oLayout3, oLayout1, oLayout2]
                                            }).addStyleClass("vbox-form-mobile")]
                            });
                    
                oPage.setModel(oController._ListCondJSonModel);
                oPage.bindElement("/Data");
                
                return oPage;
            }
        });
    }
);
