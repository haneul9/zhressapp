sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates",
    "../../common/ZHR_TABLES"
], function (Common, ViewTemplates, ZHR_TABLES) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_StudentFundsApplyHASS.fragment.HighApply", {

		createContent: function (oController) {

            var oSchoolCombo = new sap.m.ComboBox({ // 학교구분
				width: "180px",
                change: oController.getSupportList.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/SchoolCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{SchoolType}"
			});
			
			// 키보드 입력 방지
			oSchoolCombo.addDelegate({
				onAfterRendering: function () {
					oSchoolCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oSchoolCombo);

            var oSupportCombo = new sap.m.ComboBox({ // 지원유형
				width: "180px",
                change: oController.onChangeSupport.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/SupportCombo",
					template: new sap.ui.core.ListItem({
						key: "{Schsb}",
						text: "{SchsbT}"
					})
				},
				selectedKey: "{SGubun}"
			});
			
			// 키보드 입력 방지
			oSupportCombo.addDelegate({
				onAfterRendering: function () {
					oSupportCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oSupportCombo);

            var oGradeCombo = new sap.m.ComboBox({ // 학년
				width: "180px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/GradeCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Grade}"
			});
			
			// 키보드 입력 방지
			oGradeCombo.addDelegate({
				onAfterRendering: function () {
					oGradeCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oGradeCombo);

            var oGradeCombo2 = new sap.m.ComboBox(oController.PAGEID + "_GradeCombo2", { // 학년제
				width: "180px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/GradeCombo2",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Grdrl}"
			});
			
			// 키보드 입력 방지
			oGradeCombo2.addDelegate({
				onAfterRendering: function () {
					oGradeCombo2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oGradeCombo2);

            var oYearCombo = new sap.m.ComboBox({ // 수혜주기(년도)
				width: "140px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/YearCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Zyear}"
			});
			
			// 키보드 입력 방지
			oYearCombo.addDelegate({
				onAfterRendering: function () {
					oYearCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oYearCombo);

            var oCycleCombo = new sap.m.ComboBox({ // 수혜주기(분기)
				width: "220px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/CycleCombo",
					template: new sap.ui.core.ListItem({
						key: "{Reccl}",
						text: "{RecclT}"
					})
				},
				selectedKey: "{Reccl}"
			})
            .addStyleClass("ml-5px");
			
			// 키보드 입력 방지
			oCycleCombo.addDelegate({
				onAfterRendering: function () {
					oCycleCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oCycleCombo);

			var oApplyBox = new sap.m.VBox({
				fitContainer: true,
				items: [
					new sap.m.HBox({
	                	justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
						alignItems: sap.m.FlexAlignItems.End,
	                	width : "100%",
	                    items: [
							new common.TMEmpBasicInfoBox(oController.SearchModel).addStyleClass("ml-10px mt-15px"),
							new sap.m.Button({
								text : "{i18n>LABEL_48040}", // 대상자 변경
								press : oController.searchOrgehPernr,
								visible: false
						   }).addStyleClass("button-light")
						]
	                }),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38003}", "150px", "Right"), // 신청일
							new sap.m.Text({
								width: "180px",
								text: {
									path: "Begda",
									formatter: function(v) {
										if(v) return Common.DateFormatter(v);
										else 	return Common.DateFormatter(new Date());	
									}
								},
                                textAlign: "Begin"
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38005}", "150px", "Right", true).addStyleClass("mr-8px"), // 성명
                            new sap.m.Text({
								width: "180px",
								text: "{NameKor}",
                                textAlign: "Begin"
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38004}", "150px", "Right", true).addStyleClass("mr-8px"), // 관계
                            new sap.m.Text({
								width: "180px",
								text: "{RelationTx}",
                                textAlign: "Begin"
							})
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38006}", "150px", "Right", true), // 학교구분
                            oSchoolCombo,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38031}", "150px", "Right", true).addStyleClass("mr-8px"), // 지원유형
                            oSupportCombo,
							ViewTemplates.getLabel("header", "{i18n>LABEL_38032}", "150px", "Right").addStyleClass("mr-8px"), // 국가(검색)
							new sap.m.Input({ // 국가 Input
								textAlign: "Begin",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "SchcoT", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								showValueHelp: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: "{SchcoT}",
								valueHelpOnly: true,
								valueHelpRequest: oController.onSearchNation.bind(oController)
							})
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38008}", "150px", "Right", true), // 학년
                            oGradeCombo,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38007}", "150px", "Right", true).addStyleClass("mr-8px"), // 학교명
							new sap.m.Input({
								textAlign: "Begin",
								width: "585px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "SchoolName", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: "{SchoolName}"
							})
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38033}", "150px", "Right", true), // 학년제
                            oGradeCombo2,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38034}", "150px", "Right", true).addStyleClass("mr-8px"), // 전공명
							new sap.m.Input(oController.PAGEID + "_MajorInput", {
								textAlign: "Begin",
								width: "585px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "Majcd", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (v === "AA") return true;
										return false;
									}
								},
								value: "{Majcd}"
							})
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38035}", "150px", "Right"), // 수혜횟수
							new sap.m.Text({
								width: "180px",
								text: "{Reccn}",
                                textAlign: "Begin"
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38036}", "150px", "Right").addStyleClass("mr-8px"), // 수혜주기
                            new sap.m.HBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    oYearCombo,
                                    oCycleCombo
                                ]
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38017}", "150px", "Right"), // 입학금
							new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "EreqAmt", false),
								liveChange: oController.getHighCost1.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "EreqAmt",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38018}", "150px", "Right").addStyleClass("mr-8px"), // 수업료
                            new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "FreqAmt", false),
								liveChange: oController.getHighCost2.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "FreqAmt",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38037}", "150px", "Right").addStyleClass("mr-8px"), // 운영회비
                            new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "DreqAmt", false),
								liveChange: oController.getHighCost3.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "DreqAmt",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							})
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38038}", "150px", "Right"), // 장학금
							new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "Scham", false),
                                liveChange: oController.getScholarship.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "Scham",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(String(parseInt(v)));
										else return "0";
									}
								}
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38039}", "150px", "Right").addStyleClass("mr-8px"), // 기타금액
                            new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "ReqAmt1", false),
                                liveChange: oController.getExcepAmount.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "ReqAmt1",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							}),
                            ViewTemplates.getLabel("header", "", "150px"), // 빈칸
							new sap.m.Text({text: ""})
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38009}", "150px", "Right", true), // 신청금액
							new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "ReqSum", false),
								editable: false,
								value: {
									path: "ReqSum",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
						 	}),
							ViewTemplates.getLabel("header", "{i18n>LABEL_38010}", "150px", "Right").addStyleClass("mr-8px"), // 지원금액
							new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "AdmSum", false),
								editable: false,
								value: {
									path: "AdmSum",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
						 	}),
							ViewTemplates.getLabel("header", "", "150px"), // 빈칸
							new sap.m.Text({text: ""})
						]
					})
					.addStyleClass("search-field-group"),
				]
			})
			.addStyleClass("search-inner-vbox tableMargin5");

            var oSupportTable = new sap.ui.table.Table(oController.PAGEID + "_SupportTable", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 1,
				showOverlay: false,
				showNoData: true,
				width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("tableMargin5 thead-cell-border tbody-cell-border fix-header-height-38px mt-8px")
			.setModel(oController.SupportModel)
			.bindRows("/Data");

            ZHR_TABLES.makeColumn(oController, oSupportTable, [
				{id: "TotguT",  label: "{i18n>LABEL_38049}" /* 학력 */,      plabel: "" , resize: true, span: 0, type: "string",	sort: true,  filter: true,  width: "auto" },
				{id: "Totyr",   label: "{i18n>LABEL_38041}" /* 총지원년도 */, plabel: "" ,resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto" },
				{id: "Totcn",   label: "{i18n>LABEL_38042}" /* 총지원횟수 */, plabel: "" , resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto" },
				{id: "Totsp", 	label: "{i18n>LABEL_38043}" /* 총지원금액 */, plabel: "" , resize: true, span: 0, type: "template", sort: true,  filter: true,  width: "auto", templateGetter: "getSupportCost" }
			]);
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_38001}",    // 학자금 신청
				contentWidth: "1280px",
				contentHeight: "640px",
				buttons: [
					new sap.m.Button({
						press: oController.onHighDialogSaveBtn.bind(oController),
						text: "{i18n>LABEL_38048}", // 저장,
						visible: {
							path: "Status",
							formatter: function (v) {
								if (v === "AA") return true;
								return false;
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: oController.onHighDialogApplyBtn.bind(oController),
						text: "{i18n>LABEL_38044}", // 신청,
						visible: {
							path: "Status",
							formatter: function (v) {
								if (!v) return true;
								return false;
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: oController.onHighDialogDelBtn.bind(oController),
						text: "{i18n>LABEL_38047}", // 삭제
						visible: {
							path: "Status",
							formatter: function (v) {
								if (v === "AA") return true;
								return false;
							}
						}
					}).addStyleClass("button-delete"),
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_38046}" // 닫기
					}).addStyleClass("button-default custom-button-divide")
				],
				content: [
					oApplyBox,
                    new sap.m.Label({
                        text: "{i18n>LABEL_38040}" // 해당 학력 지원이력                        
                    })
                    .addStyleClass("sub-title mt-20px"),
                    oSupportTable,
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							fragment.COMMON_ATTACH_FILES.renderer(oController,"002")
						]
					})
                ]
			})
			.addStyleClass("custom-dialog-popup")
			.setModel(oController.HighApplyModel)
			.bindElement("/FormData");

			return oDialog;
		}
	});
});