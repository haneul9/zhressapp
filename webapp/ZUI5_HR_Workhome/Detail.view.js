jQuery.sap.require("common.TMEmpBasicInfoBox");

sap.ui.define(
    [
        "common/makeTable",
        "common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_Workhome.Detail", {
            getControllerName: function () {
                return "ZUI5_HR_Workhome.Detail";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
                $.app.setModel("ZHR_WORKTIME_APPL_SRV");
                
                var oHeader = new sap.m.HBox({
                    width : "100%",
                    justifyContent: "SpaceBetween",
                    items: [new sap.m.HBox({
                                justifyContent: "Start",
                                width : "100%",
                                items: [new common.TMEmpBasicInfoBox(oController._DetailJSonModel, "/Data").addStyleClass("ml-10px mt-15px")]
                            }),
                            new sap.m.HBox({
                                justifyContent: "End",
                                items: [new sap.m.Button({
                                              text : "{i18n>LABEL_48040}", // 대상자 변경
                                              press : oController.searchOrgehPernr,
                                              visible : {
                                                  // path : "Status",
                                                  // formatter : function(fVal){
                                                  // 	return fVal == "" ? true : false;
                                                  // }
                                                  parts : [{path : "Status"}, {path : "Werks"}],
                                                  formatter : function(fVal1, fVal2){
                                                      if(fVal2 && fVal2.substring(0,1) == "D"){
                                                          return false;
                                                      } else {
                                                          return fVal1 == "" ? true : false;
                                                      }
                                                  }
                                              }
                                         }).addStyleClass("button-light"),
                                         new sap.m.Button({
                                              text : "{i18n>LABEL_00152}", // 신청
                                              visible : {
                                                  path : "Status",
                                                  formatter : function(fVal){
                                                      return (fVal == "" || fVal == "AA") ? true : false;
                                                  }
                                              },
                                              press : function(oEvent){
                                                  oController.onPressSave(oEvent, "C");
                                              }
                                         }).addStyleClass("button-dark"),
                                         new sap.m.Button({
                                              text : "{i18n>LABEL_00103}", // 삭제
                                              visible : {
                                                  path : "Status",
                                                  formatter : function(fVal){
                                                      return fVal == "AA" ? true : false;
                                                  }
                                              },
                                              press : function(oEvent){
                                                  oController.onPressSave(oEvent, "D");
                                              }
                                         }).addStyleClass("button-delete"),
                                         new sap.m.Button({
                                              text : {
                                                  path : "Status",
                                                  formatter : function(fVal){  // 취소					        	 이전
                                                      return fVal == "" ? oController.getBundleText("LABEL_00119") : oController.getBundleText("LABEL_48053");
                                                  }
                                              },
                                              press : oController.onBack
                                         }).addStyleClass("button-delete")]
                            }).addStyleClass("button-group pt-53px pr-25px")]
                });
                
                // 신청안내
                var oInfo = new sap.ui.commons.layout.MatrixLayout({
                    columns : 1,
                    width : "100%",
                    rows : [new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_53008}"}).addStyleClass("sub-title")],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.FormattedText({
                                                             htmlText : "<span>" + "{i18n>MSG_53001}" + "</span><br/>" + // • 재택근무 1일 전까지 부서장 승인을 필수로 받아야 합니다.
                                                                        "<span class='color-info-red'>" + "{i18n>MSG_53002}" + "</span><br/>" + // • 기한 내 승인되지 않을 경우 TMS 사용이 불가합니다.
                                                                        "<span>" + "{i18n>MSG_53005}" + "</span><br/>" + // • 일정 변경을 희망할 경우 '삭제신청' 후 '신규신청'하시기 바랍니다.
                                                                        "<span class='color-info-red'>" + "{i18n>MSG_53004}" + "</span>" // • 단, 예정된 재택근무일 포함, 사후 일정 변경은 불가하므로 반드시 사전에 부서장 승인 필요합니다.
                                                         })],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("p-15px")]
                            }).addStyleClass("custom-OpenHelp-msgBox")]
                });
                
                var oPanel1 = new sap.m.Panel({
                    expandable : false,
                    expanded : true,
                    content : [oInfo]
                });
                
                // 재택근무일
                var oMatrix2 = new sap.ui.commons.layout.MatrixLayout({
                    columns : 5,
                    width : "100%",
                    widths : ["", "", "", "", ""],
                    rows : [new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_53002}"}).addStyleClass("sub-title")], // 재택근무일
                                             hAlign : "Begin",
                                             vAlign : "Middle",
                                             colSpan : 5
                                         })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_53002}" + "1"})], // 재택근무일1
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label2"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_53002}" + "2"})], // 재택근무일2
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label2"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_53002}" + "3"})], // 재택근무일3
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label2"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_53002}" + "4"})], // 재택근무일4
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label2"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_53002}" + "5"})], // 재택근무일5
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label2")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.DatePicker({
                                                            valueFormat : "yyyy-MM-dd",
                                                            displayFormat : gDtfmt,
                                                            value : "{Zdate1}",
                                                            width : "150px",
                                                            textAlign : "Begin",
                                                            change : oController.onChangeDate,
                                                             editable : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }),
                                                        new sap.m.Button({
                                                            icon : "sap-icon://decline",
                                                            press : function(oEvent){
                                                                oController.onDeleteDate(oEvent, "1");	
                                                            },
                                                            visible : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }).addStyleClass("pl-5px pt-3px button-default")],
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.DatePicker({
                                                            valueFormat : "yyyy-MM-dd",
                                                            displayFormat : gDtfmt,
                                                            value : "{Zdate2}",
                                                            width : "150px",
                                                            textAlign : "Begin",
                                                            change : oController.onChangeDate,
                                                             editable : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }),
                                                        new sap.m.Button({
                                                            icon : "sap-icon://decline",
                                                            press : function(oEvent){
                                                                oController.onDeleteDate(oEvent, "2");	
                                                            },
                                                            visible : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }).addStyleClass("pl-5px pt-3px button-default")],
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.DatePicker({
                                                            valueFormat : "yyyy-MM-dd",
                                                            displayFormat : gDtfmt,
                                                            value : "{Zdate3}",
                                                            width : "150px",
                                                            textAlign : "Begin",
                                                            change : oController.onChangeDate,
                                                             editable : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }),
                                                        new sap.m.Button({
                                                            icon : "sap-icon://decline",
                                                            press : function(oEvent){
                                                                oController.onDeleteDate(oEvent, "3");	
                                                            },
                                                            visible : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }).addStyleClass("pl-5px pt-3px button-default")],
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.DatePicker({
                                                            valueFormat : "yyyy-MM-dd",
                                                            displayFormat : gDtfmt,
                                                            value : "{Zdate4}",
                                                            width : "150px",
                                                            textAlign : "Begin",
                                                            change : oController.onChangeDate,
                                                             editable : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }),
                                                        new sap.m.Button({
                                                            icon : "sap-icon://decline",
                                                            press : function(oEvent){
                                                                oController.onDeleteDate(oEvent, "4");	
                                                            },
                                                            visible : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }).addStyleClass("pl-5px pt-3px button-default")],
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.DatePicker({
                                                            valueFormat : "yyyy-MM-dd",
                                                            displayFormat : gDtfmt,
                                                            value : "{Zdate5}",
                                                            width : "150px",
                                                            textAlign : "Begin",
                                                            change : oController.onChangeDate,
                                                             editable : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }),
                                                        new sap.m.Button({
                                                            icon : "sap-icon://decline",
                                                            press : function(oEvent){
                                                                oController.onDeleteDate(oEvent, "5");	
                                                            },
                                                            visible : {
                                                                  path : "Status",
                                                                      formatter : function(fVal){
                                                                          return (fVal == "" || fVal == "AA") ? true : false;
                                                                      }
                                                             }
                                                        }).addStyleClass("pl-5px pt-3px button-default")],
                                             hAlign : "Center",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data")]
                            })]
                });
                
                var oPanel2 = new sap.m.Panel({
                    expandable : false,
                    expanded : true,
                    content : [oMatrix2]
                });
                
                // 신청내용
                var oMatrix3 = new sap.ui.commons.layout.MatrixLayout({
                    columns : 2,
                    width : "100%",
                    widths : ["20%", "80%"],
                    rows : [new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Text({text : "{i18n>LABEL_53009}"}).addStyleClass("sub-title")], // 신청내용
                                             hAlign : "Begin",
                                             vAlign : "Middle",
                                             colSpan : 2
                                         })]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_53004}", required : true, textDirection : "RTL"})], // 연락처
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                              content : [new sap.m.Input({
                                                              value : "{Telnum}",
                                                              width : "100%",
                                                              maxLength : common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "WorkhomeApplyTab", "Telnum"),
                                                              editable : {
                                                                  path : "Status",
                                                                  formatter : function(fVal){
                                                                      return (fVal == "" || fVal == "AA") ? true : false;
                                                                  }
                                                              }
                                                         })],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data")]
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_53003}"})], // 신청사유
                                             hAlign : "End",
                                             vAlign : "Middle"
                                         }).addStyleClass("Label"),
                                         new sap.ui.commons.layout.MatrixLayoutCell({
                                              content : [new sap.m.Input({
                                                              value : "{Bigo}",
                                                              width : "100%",
                                                              maxLength : common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "WorkhomeApplyTab", "Bigo"),
                                                              editable : {
                                                                  path : "Status",
                                                                  formatter : function(fVal){
                                                                      return (fVal == "" || fVal == "AA") ? true : false;
                                                                  }
                                                              }
                                                         })],
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }).addStyleClass("Data")]
                            })]
                });
                
                var oPanel3 = new sap.m.Panel({
                    expandable : false,
                    expanded : true,
                    content : [oMatrix3]
                });
                
                var oContent = new sap.m.FlexBox({
                      justifyContent: "Center",
                      fitContainer: true,
                      items: [new sap.m.FlexBox({
                                  direction: sap.m.FlexDirection.Column,
                                  items: [new sap.m.FlexBox({
                                              alignItems: "End",
                                              fitContainer: true,
                                              items: [new sap.m.Button({
                                                            icon : "sap-icon://nav-back",
                                                            type : "Default",
                                                            press : oController.onBack,
                                                            visible : {
                                                                    path : "FromPageId",
                                                                    formatter : function(fVal){
                                                                        return (fVal && fVal != "") ? true : false;
                                                                    }
                                                            }
                                                      }),
                                                      new sap.ui.core.HTML({
                                                            content : "<div style='width:10px' />",
                                                            visible : {
                                                                    path : "FromPageId",
                                                                    formatter : function(fVal){
                                                                        return (fVal && fVal != "") ? true : false;
                                                                    }
                                                            }
                                                      }),
                                                      /*new sap.m.Text({
                                                          text : {
                                                                  path : "Status",
                                                                  formatter : function(fVal){ 			  // 근태신청 신규등록				  근태신청
                                                                      return (fVal == "" || fVal == "AA") ? oBundleText.getText("LABEL_48013") : oBundleText.getText("LABEL_48041")
                                                                  }
                                                          }
                                                      }).addStyleClass("app-title")*/
                                                      new sap.m.FormattedText({
                                                            htmlText : {
                                                                    parts : [{path : "Status"}],
                                                                    formatter : function(fVal1){
                                                                        if(fVal1 == "" || fVal1 == "AA"){
                                                                                    // 재택근무 신규신청
                                                                            return "<span class='app-title'>" + oController.getBundleText("LABEL_53010") + "</span>";
                                                                        } else {
                                                                                    // 재택근무 조회
                                                                            return "<span class='app-title'>" + oController.getBundleText("LABEL_53011") + "</span>";
                                                                        }
                                                                    }
                                                            }
                                                      })] 
                                          }).addStyleClass("app-title-container"),
                                          //new sap.ui.core.HTML({content : "<div style='height:20px' />"}),    
                                          oHeader,
                                          new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
                                          oPanel1, oPanel2, oPanel3,
                                          new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
                              }).addStyleClass("app-content-container-wide")]
                }).addStyleClass("app-content-body");
                        
                /////////////////////////////////////////////////////////
        
                var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
                    // customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
                    showHeader : false,
                    content: [oContent]
                }).addStyleClass("app-content");
                
                oPage.setModel(oController._DetailJSonModel);
                oPage.bindElement("/Data");
        
                return oPage;
            }
        });
    }
);
