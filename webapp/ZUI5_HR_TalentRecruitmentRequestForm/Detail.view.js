sap.ui.define([
    "../common/Common",
    "./delegate/ViewTemplates",
    "../common/PageHelper",
    "../common/PickOnlyDatePicker"
], function (Common, ViewTemplates, PageHelper, PickOnlyDatePicker) {
	"use strict";

    var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {

            return new PageHelper({
				idPrefix: "Detail-",
                showHeader : false,
				hideEmpInfoBox: true,
                showNavButton: false,
				contentStyleClass: "app-content",
                contentContainerStyleClass: "app-content-container-wide custom-title-left",
				contentItems: [
					this.TApplyingBox(oController),
					this.MApplyingBox(oController),
					this.BApplyingBox(oController),
					this.RecstaBox(oController),
                    this.FileBox(oController)
				]
			});
		},

        TApplyingBox: function(oController) {

            var oReasonList = new sap.m.ComboBox({ // 충원사유
                selectedKey: "{Recrsn}",
                width: "250px",
                // change: oController.getBankName.bind(oController),
                editable: {
                    path: "Recsta",
                    formatter: function(v) {
                        return !v || v === "21" || v === "32";
                    }
                },
                items: {
                    path: "/ReasonList",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            });

			oReasonList.addDelegate({
				onAfterRendering: function () {
					oReasonList.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oReasonList);

            var oStaffingCombo = new sap.m.ComboBox({ // 충원채널
                selectedKey: "{Recchn}",
                width: "250px",
                // change: oController.getBankName.bind(oController),
                editable: {
                    path: "Recsta",
                    formatter: function(v) {
                        return !v || v === "21" || v === "32";
                    }
                },
                items: {
                    path: "/StaffingCombo",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            });

			oStaffingCombo.addDelegate({
				onAfterRendering: function () {
					oStaffingCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oStaffingCombo);

            var oPersonnelArea = new sap.m.ComboBox({ // 담당 인사영역
                selectedKey: "{Werks}",
                width: "250px",
                // change: oController.getBankName.bind(oController),
                editable: {
                    path: "Recsta",
                    formatter: function(v) {
                        return !v || v === "21" || v === "32";
                    }
                },
                items: {
                    path: "/PersonnelArea",
                    template: new sap.ui.core.ListItem({ key: "{Persa}", text: "{Pbtxt}" })
                }
            });

			oPersonnelArea.addDelegate({
				onAfterRendering: function () {
					oPersonnelArea.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oPersonnelArea);
            
			return new sap.m.VBox({
                width: "100%",
				fitContainer: true,
				items: [
                    new sap.m.HBox({
                        width : "100%",
                        justifyContent: sap.m.FlexJustifyContent.Start,
                        alignItems: sap.m.FlexAlignItems.Center,
                        items: [
                            new sap.m.Button({
                                icon : "sap-icon://nav-back",
                                type : "Default",
                                press : oController.navBack
                            }),
                            new sap.m.Label({
                                text : {
                                    path: "Recsta",
                                    formatter: function(v) {
                                        // 인재채용의뢰서 신규등록 else 인재채용의뢰서 조회
                                        return !v || v === "AA" ? oController.getBundleText("LABEL_77023") : oController.getBundleText("LABEL_77035") ;
                                    }
                                }
                            }).addStyleClass("app-title ml-10px")
                        ]
                    }),
                    new sap.m.VBox({
                        width: "100%",
                        fitContainer: true,
                        items: [
                            new sap.m.HBox({
                                width : "100%",
                                fitContainer: true,
                                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                                alignItems: sap.m.FlexAlignItems.End,
                                items: [
                                    new sap.m.HBox({
                                        width : "100%",
                                        justifyContent: sap.m.FlexJustifyContent.Start,
                                        alignItems: sap.m.FlexAlignItems.End,
                                        items: [
                                            ViewTemplates.getLabel("header", "{i18n>LABEL_77024}", "auto", "Left").addStyleClass("sub-title") // 신청안내
                                        ]
                                    }),
                                    new sap.m.HBox({
                                        justifyContent: sap.m.FlexJustifyContent.End,
                                        alignItems: sap.m.FlexAlignItems.End,
                                        items: [
                                            new sap.m.Button({
                                                press: oController.onDialogApplyBtn.bind(oController),
                                                text: "{i18n>LABEL_77014}", // 신청
                                                visible: {
                                                    path: "Recsta",
                                                    formatter: function(v) {
                                                        return !v;
                                                    }
                                                }
                                            }).addStyleClass("button-dark mr-8px"),
                                            new sap.m.Button({
                                                press: oController.onDialogReAplBtn.bind(oController),
                                                text: "{i18n>LABEL_77054}", // 재신청
                                                visible: {
                                                    path: "Recsta",
                                                    formatter: function(v) {
                                                        return v === "21" || v === "32";
                                                    }
                                                }
                                            }).addStyleClass("button-dark mr-8px"),
                                            new sap.m.Button({
                                                press: oController.onDialogDeleteBtn.bind(oController),
                                                text: "{i18n>LABEL_77043}", // 삭제
                                                visible: {
                                                    path: "Recsta",
                                                    formatter: function(v) {
                                                        return v === "10";
                                                    }
                                                }
                                            }).addStyleClass("button-dark mr-8px"),
                                            new sap.m.Button({
                                                text : "{i18n>LABEL_77044}", // 취소
                                                press : oController.navBack
                                            }).addStyleClass("button-delete ml-0")
                                        ]
                                    }).addStyleClass("button-group mb-5px")
                                ]
                            }).addStyleClass("mt-20px"),
                            new sap.m.VBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    new sap.m.Text({ text: "{i18n>MSG_77005}", textAlign: "Begin"}).addStyleClass("Bold")
                                ]
                            }).addStyleClass("MSGBox")
                        ]
                    }),
                    new sap.m.VBox({
                        width: "100%",
                        fitContainer: true,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77025}", "auto","Left").addStyleClass("sub-title"), // 채용개요
                            new sap.m.HBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_77016}", "130px", "Right", true), // 요청부서
                                    new sap.m.MultiInput(oController.PAGEID + "_Orgeh", {
                                        visible: {
                                            path: "Recsta",
                                            formatter: function (v) {
                                                return !v;
                                            }
                                        },
                                        width: "250px",
                                        showValueHelp: true,
                                        valueHelpOnly: true,
                                        valueHelpRequest: oController.displayMultiOrgSearchDialog
                                    }),
                                    new sap.m.Input({
                                        textAlign: "Begin",
                                        width: "250px",
                                        layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                        maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "Orgtx", false),
                                        visible: {
                                            path: "Recsta",
                                            formatter: function(v) {
                                                return !(!v || v === "21" || v === "32");
                                            }
                                        },
                                        editable: false,
                                        value: "{Orgtx}"
                                    })
                                ]
                            })
                            .addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("mt-20px"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_77045}", "130px", "Right", true), // 충원사유
							oReasonList
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77026}", "130px", "Right", true), // 상세사유
                            new sap.m.TextArea({
                                width: "100%",
                                value: "{Detrsn}",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
                                rows: 3,
                                editable: {
                                    path: "Recsta",
                                    formatter: function (v) {
                                        return !v || v === "21" || v === "32";
                                    }
                                }
                            })
						]
					})
					.addStyleClass("search-field-group h-auto"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77050}", "130px", "Right"), // 충원채널
                            oStaffingCombo,
							new sap.m.Input({
								textAlign: "Begin",
								width: "99%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
								editable: {
									path: "Recsta",
									formatter: function(v) {
										return !v || v === "21" || v === "32";
									}
								},
								value: "{Recchndet}"
							}).addStyleClass("ml-10px")
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77047}", "130px", "Right", true), // 담당 인사영역
                            oPersonnelArea
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77051}", "130px", "Right", true), // 채용 희망일
                            new PickOnlyDatePicker({
                                width: "250px",
                                dateValue: "{Recda}",
                                displayFormat: $.app.getController().getSessionInfoByKey("Dtfmt"),
                                valueFormat: "yyyy-MM-dd",
                                placeholder: "yyyy-mm-dd",
                                editable: {
                                    path: "Recsta",
									formatter: function(v) {
										return !v || v === "21" || v === "32";
									}
                                }
                            })
						]
					})
					.addStyleClass("search-field-group")
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox mt-16px BtNone");
		},

        MApplyingBox: function(oController) {
            var oWorkGroup = new sap.m.ComboBox({ // 직군
                selectedKey: "{Zhgrade}",
                width: "250px",
                // change: oController.getBankName.bind(oController),
                editable: {
                    path: "Recsta",
                    formatter: function(v) {
                        return !v || v === "21" || v === "32";
                    }
                },
                items: {
                    path: "/WorkGroup",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            });

			oWorkGroup.addDelegate({
				onAfterRendering: function () {
					oWorkGroup.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oWorkGroup);

            var oPersonnelCombo = new sap.m.ComboBox({ // 요청인원
                selectedKey: "{Reccnt}",
                width: "250px",
                // change: oController.getBankName.bind(oController),
                editable: {
                    path: "Recsta",
                    formatter: function(v) {
                        return !v || v === "21" || v === "32";
                    }
                },
                items: {
                    path: "/PersonnelCombo",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            });

			oPersonnelCombo.addDelegate({
				onAfterRendering: function () {
					oPersonnelCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oPersonnelCombo);
            
			return new sap.m.VBox({
                width: "100%",
				fitContainer: true,
				items: [
                    new sap.m.VBox({
                        width: "100%",
                        fitContainer: true,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77052}", "auto","Left").addStyleClass("sub-title"), // 충원 포지션
                            new sap.m.HBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_77046}", "130px", "Right", true), // 직군
                                    oWorkGroup
                                ]
                            })
                            .addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("mt-20px"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77018}", "130px", "Right"), // 직급
							new sap.m.Input({
                                textAlign: "Begin",
                                width: "250px",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
                                editable: {
                                    path: "Recsta",
                                    formatter: function(v) {
                                        return !v || v === "21" || v === "32";
                                    }
                                },
                                value: "{Recjikgb}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_77049}", "130px", "Right"), // 요청인원
							oPersonnelCombo
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_77019}", "130px", "Right", true), // 직무
							new sap.m.Input({
                                textAlign: "Begin",
                                width: "100%",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
                                editable: {
                                    path: "Recsta",
                                    formatter: function(v) {
                                        return !v || v === "21" || v === "32";
                                    }
                                },
                                value: "{Recjob}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77029}", "130px", "Right", true), // 수행업무
                            new sap.m.TextArea({
                                width: "100%",
                                value: "{Rectask}",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
                                rows: 10,
                                editable: {
                                    path: "Recsta",
                                    formatter: function (v) {
                                        return !v || v === "21" || v === "32";
                                    }
                                }
                            })
						]
					})
					.addStyleClass("search-field-group h-auto")
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox mt-16px BtNone");
		},

        BApplyingBox: function(oController) {
            
			return new sap.m.VBox({
                width: "100%",
				fitContainer: true,
				items: [
                    new sap.m.VBox({
                        width: "100%",
                        fitContainer: true,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77048}", "auto","Left").addStyleClass("sub-title"), // 인재 요건
                            new sap.m.HBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_77030}", "130px", "Right", true), // 학위
                                    new sap.m.Input({
                                        textAlign: "Begin",
                                        width: "250px",
                                        maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
                                        editable: {
                                            path: "Recsta",
                                            formatter: function(v) {
                                                return !v || v === "21" || v === "32";
                                            }
                                        },
                                        value: "{Recdegree}"
                                    })
                                ]
                            })
                            .addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("mt-20px"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_77053}", "130px", "Right", true), // 전공
							new sap.m.Input({
                                textAlign: "Begin",
                                width: "250px",
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
                                editable: {
                                    path: "Recsta",
                                    formatter: function(v) {
                                        return !v || v === "21" || v === "32";
                                    }
                                },
                                value: "{Recmajor}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            new sap.m.Label({ // 필수경력
                                layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }),
                                textAlign: "Right",
                                required: true,
                                wrapping: true,
                                text: "{i18n>LABEL_77031}",
                                width: "130px"
                            }),
                            new sap.m.TextArea({
                                width: "100%",
                                value: "{Reccareer}",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
                                rows: 3,
                                editable: {
                                    path: "Recsta",
                                    formatter: function (v) {
                                        return !v || v === "21" || v === "32";
                                    }
                                }
                            })
						]
					})
					.addStyleClass("search-field-group h-auto"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77032}", "130px", "Right"), // 어학
							new sap.m.Input({
								textAlign: "Begin",
								width: "250px",
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
								editable: {
									path: "Recsta",
									formatter: function(v) {
										return !v || v === "21" || v === "32";
									}
								},
								value: "{Reclang}"
							})
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77033}", "130px", "Right"), // 자격증
							new sap.m.Input({
								textAlign: "Begin",
								width: "250px",
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
								editable: {
									path: "Recsta",
									formatter: function(v) {
										return !v || v === "21" || v === "32";
									}
								},
								value: "{Reclic}"
							})
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77034}", "130px", "Right"), // 우대사항
							new sap.m.TextArea({
                                width: "100%",
                                value: "{Recfavor}",
                                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                                maxLength: Common.getODataPropertyLength("ZHR_HRDOC_SRV", "NewEmpRecruitTab", "SchcoT", false),
                                rows: 3,
                                editable: {
                                    path: "Recsta",
                                    formatter: function (v) {
                                        return !v || v === "21" || v === "32";
                                    }
                                }
                            })
						]
					})
					.addStyleClass("search-field-group h-auto")
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox mt-16px BtNone");
		},

        RecstaBox: function(oController) {
            
			return new sap.m.VBox({
                width: "100%",
				fitContainer: true,
                visible: {
                    path: "Recsta",
                    formatter: function(v) {
                        return Common.checkNull(!v);
                    }
                },
				items: [
                    new sap.m.VBox({
                        width: "100%",
                        fitContainer: true,
                        items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77036}", "auto","Left").addStyleClass("sub-title"), // 진행상태
                            new sap.m.HBox({
                                width: "100%",
                                fitContainer: true,
                                items: [
                                    ViewTemplates.getLabel("header", "{i18n>LABEL_77004}", "130px", "Right"), // 현업부서요청
                                    new sap.m.Text({
                                        width: "auto",
                                        textAlign: "Begin",
                                        text: "{Dat10}"
                                    })
                                ]
                            })
                            .addStyleClass("search-field-group")
                        ]
                    }).addStyleClass("mt-20px"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_77005}", "130px", "Right"), // 인사팀 검토중
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Dat20}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77006}", "130px", "Right"), // 인사팀 반송
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Dat21}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77037}", "130px", "Right"), // HR부문장 결재중
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Dat30}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77038}", "130px", "Right"), // HR부문장 승인
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Dat31}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77039}", "130px", "Right"), // HR부문장 반려
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Dat32}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77040}", "130px", "Right"), // 인재육성팀 채용중
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Dat40}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77041}", "130px", "Right"), // 인재육성팀 채용보류
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Dat41}"
                            })
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_77042}", "130px", "Right"), // 인재육성팀 채용완료
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{Dat42}"
                            })
						]
					})
					.addStyleClass("search-field-group")
				]
			})
			.setModel(oController.ApplyModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox mt-16px BtNone");
		},

        FileBox: function(oController) {
            return new sap.m.HBox({
                fitContainer: true,
                items: [sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)]
            }).addStyleClass("pb-40px");
        }
	});
});
