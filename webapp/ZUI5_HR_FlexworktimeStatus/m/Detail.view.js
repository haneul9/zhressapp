sap.ui.define(
    [
        "common/PageHelper"
    ],
    function (PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_FlexworktimeStatus.m.Detail", {
            getControllerName: function () {
                return "ZUI5_HR_FlexworktimeStatus.m.Detail";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_FLEX_TIME_SRV");
                
                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns : 2,
                    width : "100%",
                    widths : ["30%", "70%"],
                    rows : [new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Label({text : "{i18n>LABEL_69032}"})], // 날짜
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({
                                                            text : {
                                                                parts : [{path : "Datum"}, {path : "Weektx"}],
                                                                formatter : function(fVal1, fVal2){
                                                                    if(fVal1){
                                                                        return fVal1.getFullYear() + oController.getBundleText("LABEL_69033") + " " +
                                                                                (fVal1.getMonth()+1) + oController.getBundleText("LABEL_69034") + " " +
                                                                                fVal1.getDate() + oController.getBundleText("LABEL_69035") + ", " +
                                                                                fVal2 + oController.getBundleText("LABEL_69036");
                                                                    }
                                                                }
                                                            }
                                                        })],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Label({text :  "{i18n>LABEL_69005}"})], // 근태
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Text({text : "{Atext}"})],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Label({text :  "{i18n>LABEL_69038}"})], // 근무일정
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.HBox({
                                                            items : [new sap.m.TimePicker({
                                                                        valueFormat : "HHmm",
                                                                        displayFormat : "HH:mm",
                                                                        value : "{Beguz}",
                                                                        minutesStep : 30,
                                                                        width : "100%", 
                                                                        textAlign : "Begin",
                                                                        editable : {
                                                                            path : "Offyn",
                                                                            formatter : function(fVal){
                                                                                if(fVal == "2"){ // 2021-05-26 현재일 06시 이전인 경우 시작시간 변경 가능
                                                                                    var hours = new Date().getHours();

                                                                                    return hours < 6 ? true : false;
                                                                                } else {
                                                                                    return (fVal == "" || fVal == "1") ? true : false;
                                                                                }                                                                                
                                                                            }
                                                                        },
                                                                        change : function(oEvent){
                                                                            oController.onSetLnctm(oEvent, "30");
                                                                            oController.setMonyn(oEvent, "1");
                                                                            
                                                                            // 시작시간이 13:30 이후인 경우 점심시간 변경처리
                                                                            if(oEvent.getParameters().value > "1330"){
                                                                                oController._DetailJSonModel.setProperty("/Data/Lnctm", "0");
                                                                            }
                                                                        }
                                                                    }),
                                                                    new sap.m.Text({text : " ~ "}).addStyleClass("pt-5px pr-5px pl-5px"),
                                                                    new sap.m.TimePicker({
                                                                        valueFormat : "HHmm",
                                                                        displayFormat : "HH:mm",
                                                                        value : "{Enduz}",
                                                                        minutesStep : 10,
                                                                        width : "100%", 
                                                                        textAlign : "Begin",
                                                                        editable : {
                                                                            path : "Offyn",
                                                                            formatter : function(fVal){
                                                                                return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
                                                                            }
                                                                        },
                                                                        change : function(oEvent){
                                                                            oController.onSetLnctm(oEvent, "10");
                                                                            oController.setMonyn(oEvent, "1");
                                                                        }
                                                                    })]
                                            })],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Label({text : "{i18n>LABEL_69008}"})], // 법정휴게
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.ComboBox({
                                                            selectedKey : "{Lnctm}",
                                                            width : "100%",
                                                            items : [new sap.ui.core.Item({key : "0", text : ""}),
                                                                    new sap.ui.core.Item({key : "1", text : "00:30"}),
                                                                    new sap.ui.core.Item({key : "2", text : "01:00"}),
                                                                    new sap.ui.core.Item({key : "3", text : "01:30"}),
                                                                    new sap.ui.core.Item({key : "4", text : "02:00"})],
                                                            editable : {
                                                                parts : [{path : "Offyn"}, {path : "Beguz"}],
                                                                formatter : function(fVal1, fVal2){
                                                                    if(fVal2 > "1330"){
                                                                        return false;
                                                                    } else {
                                                                        return (fVal1 == "" || fVal1 == "1" || fVal1 == "2") ? true : false;
                                                                    }
                                                                }
                                                            },
                                                            change : function(oEvent){
                                                                oController.setMonyn(oEvent, "1");
                                                            }
                                                        })],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Label({text : "{i18n>LABEL_69049}"})], // 변경사유
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        }),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.Input({
                                                            value : "{Chgrsn}",
                                                            width : "100%",
                                                            editable : {
                                                                path : "Offyn",
                                                                formatter : function(fVal){
                                                                    return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
                                                                }
                                                            },
                                                            change : function(oEvent){
                                                                oController.setMonyn(oEvent, "1");
                                                            },
                                                            maxLength : common.Common.getODataPropertyLength("ZHR_FLEX_TIME_SRV", "FlexworktimeDetail", "Chgrsn")
                                                        })],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_AppNameRow", {
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_48066}", required : true})], // 결재자
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                        }),
                                        new sap.ui.commons.layout.MatrixLayoutCell({
                                            content : [new sap.m.ComboBox(oController.PAGEID + "_AppName", {
                                                           selectedKey : "{AppName}",
                                                           width : "100%",
                                                           editable : {
                                                               path : "Offyn",
                                                               formatter : function(fVal){
                                                                   return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
                                                               }
                                                           },
                                                           change : function(oEvent){
                                                               oController.setMonyn(oEvent, "1");
                                                           }
                                                       })],
                                            hAlign : "Begin",
                                            vAlign : "Middle"
                                        })]
                            }).addStyleClass("displayNone")]
                });
                
                // 추가휴게시간
                var oTable1 = new sap.m.Table(oController.PAGEID + "_Table1", {
                    inset: false,
                    rememberSelections: false,
                    noDataText: "{i18n>LABEL_00901}", // No data found
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
                            vAlign : "Middle",
                            cells: [
                                new sap.m.VBox({
                                    items : [new sap.m.Text({
                                                textAlign: "Begin",
                                                text: {
                                                    path : "Idx",
                                                    formatter : function(fVal){
                                                        return oController.getBundleText("LABEL_69040") + (fVal+1); // 추가휴게
                                                    }
                                                }
                                            })]
                                }),
                                new sap.m.VBox({
                                    items : [new sap.m.HBox({
                                                items : [new sap.m.TimePicker({
                                                            valueFormat : "HHmm",
                                                            displayFormat : "HH:mm",
                                                            value : "{Beguz}",
                                                            minutesStep : 10,
                                                            width : "100%", 
                                                            textAlign : "Begin",
                                                            editable : {
                                                                path : "Offyn",
                                                                formatter : function(fVal){
                                                                    return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
                                                                }
                                                            },
                                                            customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
                                                            change : function(oEvent){
                                                                        oController.setMonyn(oEvent, "2");
                                                                        oController.onChangeTime(oEvent, "10");
                                                                    }
                                                        }),
                                                        new sap.m.Text({text : " ~ "}).addStyleClass("pt-5px pr-5px pl-5px"),
                                                        new sap.m.TimePicker({
                                                            valueFormat : "HHmm",
                                                            displayFormat : "HH:mm",
                                                            value : "{Enduz}",
                                                            minutesStep : 10,
                                                            width : "100%", 
                                                            textAlign : "Begin",
                                                            editable : {
                                                                path : "Offyn",
                                                                formatter : function(fVal){
                                                                    return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
                                                                }
                                                            },
                                                            customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
                                                            change : function(oEvent){
                                                                            oController.setMonyn(oEvent, "2");
                                                                            oController.onChangeTime(oEvent, "10");
                                                                    }
                                                        })]
                                            }),
                                            new sap.m.Input({
                                                value : "{Notes}",
                                                width : "100%",
                                                maxLength : common.Common.getODataPropertyLength("ZHR_FLEX_TIME_SRV", "AddBreakList", "Notes"),
                                                editable : {
                                                    path : "Offyn",
                                                    formatter : function(fVal){
                                                        return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
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
                                            text: "{i18n>LABEL_69015}", // 추가휴게시간
                                            design: "Bold"
                                        }).addStyleClass("sub-title")]
                            }).addStyleClass("info-box"),
                            oTable1]
                });
                
                // 근로시간현황
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
                                                text: "{Text}"
                                            })]
                                }),
                                new sap.m.VBox({
                                    items : [new sap.m.Text({
                                                textAlign: "Begin",
                                                text: "{Value}"
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
                                            text: "{i18n>LABEL_69039}", // 근로시간현황
                                            design: "Bold"
                                        }).addStyleClass("sub-title")]
                            }).addStyleClass("info-box"),
                            oTable2]
                });
                
                var oPage = new PageHelper({
                                idPrefix : oController.PAGEID,
                                showNavButton: true,
                                navBackFunc: oController.onBack,
                                title : {
                                    path : "Offyn",
                                    formatter : function(fVal){
                                                            // 과거근무 변경신청				   // 근무 변경
                                        return fVal == "1" ? oController.getBundleText("LABEL_69047") : oController.getBundleText("LABEL_69048");  
                                    }
                                },
                                headerButton : new sap.m.HBox({
                                                items : [new sap.m.Button({
                                                                text: {
                                                                    path : "Offyn",
                                                                    formatter : function(fVal){
                                                                        return fVal == "1" ? oController.getBundleText("LABEL_00152") : oController.getBundleText("LABEL_00101");
                                                                    }
                                                                },
                                                                press : oController.onPressSave,
                                                                visible : {
                                                                    path : "Offyn",
                                                                    formatter : function(fVal){
                                                                        return (fVal == "" || fVal == "1" || fVal == "2") ? true : false;
                                                                    }
                                                                }
                                                            }).addStyleClass("button-dark")]
                                            }).addStyleClass("app-nav-button-right"),
                                contentStyleClass: "sub-app-content",
                                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
                                contentItems: [new sap.m.VBox({
                                                items : [oMatrix, oLayout1, oLayout2]
                                            }).addStyleClass("vbox-form-mobile")]
                            });
                            
                oPage.setModel(oController._DetailJSonModel);
                oPage.bindElement("/Data");
                
                return oPage;
            }
        });
    }
);
