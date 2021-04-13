sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates",
	"../../common/ZHR_TABLES"
], function (Common, ViewTemplates, ZHR_TABLES) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_StudentFundsApply.fragment.BaseApply", {

		createContent: function (oController) {
			
            var oPayDate = new sap.m.DatePicker({ // 납부일자
				width: "180px",
				dateValue: "{Paydt}",
				displayFormat: oController.getSessionInfoByKey("Dtfmt"),
				valueFormat: "yyyy-MM-dd",
				placeholder: "yyyy-mm-dd",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				}
			})

			// 키보드 입력 방지
			oPayDate.addDelegate({
				onAfterRendering: function () {
					oPayDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oPayDate);

            var oNameCombo = new sap.m.ComboBox({ //성명
				width: "180px",
				change: oController.changeRelation.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/NameCombo",
					template: new sap.ui.core.ListItem({
						key: "{Fname}",
						text: "{Fname}"
					})
				},
				selectedKey: "{NameKor}"
			});
			
			// 키보드 입력 방지
			oNameCombo.addDelegate({
				onAfterRendering: function () {
					oNameCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oNameCombo);

            var oGubunCombo = new sap.m.ComboBox({ // 구분
				width: "180px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/GubunCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{SGubun}"
			});
			
			// 키보드 입력 방지
			oGubunCombo.addDelegate({
				onAfterRendering: function () {
					oGubunCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oGubunCombo);

            var oSchoolCombo = new sap.m.ComboBox({ // 학교구분
				width: "180px",
				change: oController.getBaseSupportList.bind(oController),
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

            var oYearCombo = new sap.m.ComboBox({ // 등록년도
				width: "180px",
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

            var oSemesterCombo = new sap.m.ComboBox({ // 등록학기/분기
				width: "180px",
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/SemesterCombo",
					template: new sap.ui.core.ListItem({
						key: "{Code}",
						text: "{Text}"
					})
				},
				selectedKey: "{Quart}"
			});
			
			// 키보드 입력 방지
			oSemesterCombo.addDelegate({
				onAfterRendering: function () {
					oSemesterCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oSemesterCombo);

			var oApplyBox = new sap.m.VBox({
				fitContainer: true,
				items: [
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
										else return Common.DateFormatter(new Date());	
									}
								},
                                textAlign: "Begin"
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38005}", "150px", "Right", true).addStyleClass("mr-8px"), // 성명
                            oNameCombo,
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38013}", "150px", "Right", true), // 구분
							oGubunCombo,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38006}", "150px", "Right", true).addStyleClass("mr-8px"), // 학교구분
                            oSchoolCombo,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38014}", "150px", "Right").addStyleClass("mr-8px"), // 등록년도
                            oYearCombo
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
							}),
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38015}", "150px", "Right"), // 등록학기/분기
                            oSemesterCombo,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38016}", "150px", "Right", true).addStyleClass("mr-8px"), // 납부일자
                            oPayDate,
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38017}", "150px", "Right").addStyleClass("mr-8px"), // 입학금
							new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "EreqAmt", false),
								liveChange: oController.getCost1.bind(oController),
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
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_38018}", "150px", "Right"), // 수업료
							new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "FreqAmt", false),
								liveChange: oController.getCost2.bind(oController),
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
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38019}", "150px", "Right").addStyleClass("mr-8px"), // 육성회비
                            new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "UreqAmt", false),
								liveChange: oController.getCost3.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "UreqAmt",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38021}", "150px", "Right").addStyleClass("mr-8px"), // 학교운영지원비
                            new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "DreqAmt", false),
								liveChange: oController.getCost4.bind(oController),
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
							ViewTemplates.getLabel("header", "{i18n>LABEL_38022}", "150px", "Right"), // 학생회비
							new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "SreqAmt", false),
								liveChange: oController.getCost5.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "SreqAmt",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38023}", "150px", "Right").addStyleClass("mr-8px"), // 자율학습비
                            new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "SsreqAmt", false),
								liveChange: oController.getCost6.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "SsreqAmt",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38024}", "150px", "Right").addStyleClass("mr-8px"), // 보충수업
                            new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "AreqAmt", false),
								liveChange: oController.getCost7.bind(oController),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: {
									path: "AreqAmt",
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
							new sap.m.Input({
								textAlign: "End",
								width: "180px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "ReqAmt1", false),
								liveChange: oController.getCost8.bind(oController),
								visible: false,
								value: {
									path: "ReqAmt1",
									formatter: function(v) {
										if(v) return Common.numberWithCommas(v);
										else return "0";
									}
								}
							}),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_38009}", "150px", "Right", true).addStyleClass("mr-8px"), // 신청금액
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
							})
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34021}", "150px", "Right", true), // 비고
							new sap.m.Input({
								textAlign: "Begin",
								width: "990px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "EducationfundApplyTableIn", "Remark", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: "{Remark}"
						 	}),
						]
					})
					.addStyleClass("search-field-group")
				]
			})
			.addStyleClass("search-inner-vbox tableMargin5");

			var oSupportTable = new sap.ui.table.Table({
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
						press: oController.onDialogApplyBtn.bind(oController),
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
						press: oController.onDialogSaveBtn.bind(oController),
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
						press: oController.onDialogDelBtn.bind(oController),
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
							fragment.COMMON_ATTACH_FILES.renderer(oController,"001")
						]
					})
                ]
			})
			.addStyleClass("custom-dialog-popup")
			.setModel(oController.ApplyModel)
			.bindElement("/FormData");

			return oDialog;
		}
	});
});