sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper",
    "../../common/PickOnlyDateRangeSelection",
    "../../common/PickOnlyDatePicker",
    "../delegate/ViewTemplates"
], function (Common, PageHelper, PickOnlyDateRangeSelection, PickOnlyDatePicker, ViewTemplates) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "TuitionSearch"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "TuitionSearch-",
                title: "{i18n>LABEL_29001}", // 어학비 신청
                showNavButton: true,
				navBackFunc: oController.navBack.bind(oController),
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
                            press: oController.onDialogSear.bind(oController),
							text: "{i18n>LABEL_29007}" // 조회
						}).addStyleClass("button-search")
					]
				}).addStyleClass("app-nav-button-right"),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.IngoBox(oController),
					this.ApplyingBox(oController)
				]
			})
			.setModel(oController.GradeModel)
			.bindElement("/TableData")
		},

		IngoBox: function(oController) {
			var oGubunCombo = new sap.m.ComboBox(oController.PAGEID + "_GubunCombo", { // 어학구분
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
                change: oController.onDialogGubun.bind(oController),
				items: {
					path: "/LanguCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Zlangu}"
			});
			// 키보드 입력 방지
			oGubunCombo.addDelegate({
				onAfterRendering: function () {
					oGubunCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oGubunCombo);
			
			
            var oExamCombo = new sap.m.ComboBox(oController.PAGEID + "_ExamCombo", { // 시험종류
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				items: {
					path: "/TestCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},  
				selectedKey: "{Zltype}"
			});
			// 키보드 입력 방지
			oExamCombo.addDelegate({
				onAfterRendering: function () {
					oExamCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oExamCombo);
            
            var oCompleteCombo = new sap.m.ComboBox(oController.PAGEID + "_CompleteCombo", { // 이수여부
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				width: "100%",
				items: {
					path: "/CompleteCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{ITepas}"
			});
			// 키보드 입력 방지
			oCompleteCombo.addDelegate({
				onAfterRendering: function () {
					oCompleteCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oCompleteCombo);

			return new sap.m.HBox({
                fitContainer: true,
                items: [
                    new sap.m.VBox({
                        fitContainer: true,
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_29042}",
                                design: "Bold" 
                            }),
                            oGubunCombo
                        ]
                    }),
                    new sap.m.VBox({
                        fitContainer: true,
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_29037}",
                                design: "Bold" 
                            }),
                            oExamCombo
                        ]
                    }),
                    new sap.m.VBox({
                        fitContainer: true,
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Label({
                                text: "{i18n>LABEL_29041}",
                                design: "Bold" 
                            }),
                            oCompleteCombo
                        ]
                    })                    
                ]
            })
            .addStyleClass("search-box-mobile h-auto")
            .setModel(oController.GradeModel)
            .bindElement("/Data");
		},
		
		ApplyingBox: function(oController) {
            var oTable = new sap.m.Table({
                inset: false,
				rememberSelections: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				mode: sap.m.ListMode.SingleSelectMaster,
				itemPress: oController.onSelectedGradeRow.bind(oController),
                columns: [
                    new sap.m.Column ({
                        width: "33%",
                        hAlign: "Begin"
                    }),
                    new sap.m.Column ({
                        width: "33%",
                        hAlign: "Begin"
                    }),
                    new sap.m.Column ({
                        width: "auto",
                        hAlign: "Begin"
                    })
                ],
                items: {
                    path: "/TableData",
                    template: new sap.m.ColumnListItem({
                        type: sap.m.ListType.Active,
                        counter: 5,
                        cells: [
                            new sap.m.VBox({
                                items: [
									new sap.m.Text({
                                        text: "{ZlanguTxt}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font"),
                                    new sap.m.Text({
                                        text: "{ZltypeTxt}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font")
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.HBox({
                                    items: [
                                        new sap.m.Label({ text: "●"}).addStyleClass("color-lcc-signature-green font-10px mr-2px mt-4px"),
                                        new sap.m.Text({
                                            text: {
                                                path: "Appdat",
                                                formatter: function(v) {
                                                    return v ? Common.DateFormatter(v) : "";
                                                }
                                            },
                                            textAlign: "Begin"
                                        })
                                        .addStyleClass("L2P13Font")
                                        ]
                                    }),
                                    new sap.m.HBox({
                                    items: [
                                        new sap.m.Label({ text: "●"}).addStyleClass("color-signature-cyanblue font-10px mr-2px mt-4px"),
                                        new sap.m.Text({
                                            text: {
                                                path: "Endda",
                                                formatter: function(v) {
                                                    return v ? Common.DateFormatter(v) : "";
                                                }
                                            },
                                            textAlign: "Begin"
                                        })
                                        .addStyleClass("L2P13Font")
                                        ]
                                    })
                                ]
                            }),
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Text({
                                        text: "{Acqpot}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font"),
                                    new sap.m.Text({
                                        text: "{TargetcT}",
                                        textAlign: "Begin"
                                    })
                                    .addStyleClass("L2P13Font")
                                ]
                            })
                        ]
                    })
                }
            })
            .setModel(oController.GradeModel);

            return  new sap.m.VBox({
                fitContainer: true,
                items: [
                    new sap.m.HBox({
                        justifyContent: sap.m.FlexJustifyContent.End,
                        items: [
                            new sap.m.Label({ text: "●"}).addStyleClass("color-lcc-signature-green font-10px mr-2px mt-4px"),
                            new sap.m.Label({ text: "{i18n>LABEL_29039}" }).addStyleClass("ml-3px mr-5px"), // 응시일자
                            new sap.m.Label({ text: "●"}).addStyleClass("color-signature-cyanblue font-10px mr-2px mt-4px"),
                            new sap.m.Label({ text: "{i18n>LABEL_29040}" }).addStyleClass("ml-3px"), // 유효일자
                        ]
                    }),
                    oTable
                ]
            })
		}
	});
});