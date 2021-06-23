sap.ui.define(
    [
        "common/PageHelper"
    ],
    function (PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_Workhome.m.Detail", {
            getControllerName: function () {
                return "ZUI5_HR_Workhome.m.Detail";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
				$.app.setModel("ZHR_LEAVE_APPL_SRV");
				
				// 신청안내
				var oLayout1 = new sap.m.VBox({
					fitContainer: true,
					items: [new sap.m.FlexBox({
								items : [new sap.m.Label({
											text: "{i18n>LABEL_53008}", // 신청안내
											design: "Bold"
										}).addStyleClass("sub-title")]
							}).addStyleClass("info-box"),
							new sap.m.FlexBox({
								items : [new sap.m.FormattedText({
											 htmlText : "<span>" + "{i18n>MSG_53001}" + "</span><br/>" + // • 재택근무 1일 전까지 부서장 승인을 필수로 받아야 합니다.
													"<span class='color-info-red'>" + "{i18n>MSG_53002}" + "</span><br/>" + // • 기한 내 승인되지 않을 경우 TMS 사용이 불가합니다.
													"<span>" + "{i18n>MSG_53005}" + "</span><br/>" + // •• 일정 변경을 희망할 경우 '삭제신청' 후 '신규신청'하시기 바랍니다.
													"<span class='color-info-red'>" + "{i18n>MSG_53004}" + "</span>" // • 단, 예정된 재택근무일 포함, 사후 일정 변경은 불가하므로 반드시 사전에 부서장 승인 필요합니다.
										 }).addStyleClass("p-5px")]
							}).addStyleClass("custom-OpenHelp-msgBox mt-0 p-7px")]
				});
		        
				// 신청내역
				var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
					inset: false,
					rememberSelections: false,
					noDataText: "{i18n>LABEL_00901}",
					growing: true,
					growingThreshold: 5,
					mode: "None",
					columns: [
						new sap.m.Column ({
							width: "45%",
							hAlign: "Begin"
						}),
						new sap.m.Column ({
							width: "",
							hAlign: "Begin"
						}),
						new sap.m.Column({
							width : "40px",
							hAlign : "Center",
							vAlign : "Top"
						})
					],
					items: {
						path: "/Data",
						template: new sap.m.ColumnListItem({
							type: sap.m.ListType.Active,
							counter: 5,
							customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
							cells: [
								new sap.m.VBox({
									items : [new sap.m.HBox({ // 재택근무일
												 items : [new sap.m.Text({text: "{Title}"})] 	
											 })]
								}),
								new sap.m.VBox({
									items : [new sap.m.HBox({
												 items : [new sap.m.DatePicker({
															  valueFormat : "yyyy-MM-dd",
															  displayFormat : gDtfmt,
															  value : "{Begda}",
															  width : "100%",
															  textAlign : "Begin",
															  change : oController.onChangeDate,
															  editable : {
																	path : "Status",
																	formatter : function(fVal){
																		return (fVal == "" || fVal == "AA") ? true : false;
																	}
															  }
														 })] 	
											 })]
								}),
								new sap.m.VBox({
									items : [new sap.m.HBox({  // 신청사유
												 items : [new sap.m.Button({
															  icon : "sap-icon://decline",
															  press : oController.onDeleteDate,
															  customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
															  visible : {
																  	path : "Status",
																	formatter : function(fVal){
																		return (fVal == "" || fVal == "AA") ? true : false;
																	}
															  }
														 }).addStyleClass("pl-5px pt-5px button-default")] 	
											 })]
								})
							]
						})
					}
				});
				
				oTable.setModel(new sap.ui.model.json.JSONModel());
		
				var oLayout2 = new sap.m.VBox({
					fitContainer: true,
					items: [new sap.m.FlexBox({
								justifyContent : "SpaceBetween",
								items : [new sap.m.FlexBox({
											 items : [new sap.m.Label({
														  text: "{i18n>LABEL_53002}", // 재택근무일
														  design: "Bold"
													  }).addStyleClass("sub-title")]
										 })]
							}).addStyleClass("info-box"),
							oTable]
				}).addStyleClass("pt-5px");

                // 신청내용
                var oContent = new sap.ui.commons.layout.MatrixLayout({
                    columns : 2,
                    width : "100%",
                    widths : ["105px", ""],
                    rows : [new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_53004}", required : true})], // 연락처
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }),
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
                                         })]        
                            }),
                            new sap.ui.commons.layout.MatrixLayoutRow({
                                height : "45px",
                                cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                                             content : [new sap.m.Label({text : "{i18n>LABEL_53003}"})], // 신청사유
                                             hAlign : "Begin",
                                             vAlign : "Middle"
                                         }),
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
                                         })] 
                            })]
							// new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_AppNameRow", {
                            //     height : "45px",
                            //     cells : [new sap.ui.commons.layout.MatrixLayoutCell({
                            //                  content : [new sap.m.Label({text : "{i18n>LABEL_48066}", required : true})], // 결재자
                            //                  hAlign : "Begin",
                            //                  vAlign : "Middle"
                            //             }),
                            //             new sap.ui.commons.layout.MatrixLayoutCell({
                            //                 content : [new sap.m.ComboBox(oController.PAGEID + "_AppName", {
                            //                                selectedKey : "{AppName}",
                            //                                width : "100%",
                            //                                editable : {
                            //                                        path : "Status",
                            //                                        formatter : function(fVal){
                            //                                             return (fVal == "" || fVal == "AA") ? true : false;
                            //                                        }
                            //                                }
                            //                            })],
                            //                 hAlign : "Begin",
                            //                 vAlign : "Middle"
                            //             })]
                            // }).addStyleClass("displayNone")]
                });

                var oLayout3 = new sap.m.VBox({
					fitContainer: true,
					items: [new sap.m.FlexBox({
								justifyContent : "SpaceBetween",
								items : [new sap.m.FlexBox({
											 items : [new sap.m.Label({
														  text: "{i18n>LABEL_53009}", // 신청내용
														  design: "Bold"
													  }).addStyleClass("sub-title")]
										 })]
							}).addStyleClass("info-box"),
							oContent]
				}).addStyleClass("pt-5px");
		
				var oPage = new PageHelper({
								idPrefix : oController.PAGEID,
								showNavButton: true,
								navBackFunc: oController.onBack,
								title : {
									path : "Status",
									formatter : function(fVal){
																			  // 재택근무 신규신청                         재택근무 조회
										return (fVal == "" || fVal == "AA") ? oController.getBundleText("LABEL_53010") : oController.getBundleText("LABEL_53011");
									}
								},
								headerButton : new sap.m.HBox({
												   items : [new sap.m.Button({
															   	text: "{i18n>LABEL_00152}", // 신청
															   	press : oController.onRequest.bind(oController),
															   	visible : {
															   		path : "Status",
																	formatter : function(fVal){
																		return fVal == "" ? true : false;
																	}
															   	}
															}).addStyleClass("button-dark")]
											   }).addStyleClass("app-nav-button-right"),
								contentStyleClass: "sub-app-content",
		                		contentContainerStyleClass: "app-content-container-mobile custom-title-left",
					            contentItems: [new sap.m.VBox({
									               items : [oLayout1, oLayout2, oLayout3]
									           }).addStyleClass("vbox-form-mobile")]
					        });
					        
				oPage.setModel(oController._DetailJSonModel);
				oPage.bindElement("/Data");
				
				return oPage;
            }
        });
    }
);
