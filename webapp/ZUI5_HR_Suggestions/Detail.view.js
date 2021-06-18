sap.ui.define([
    "../common/Common",
    "./delegate/ViewTemplates",
    "../common/PageHelper"
], function (Common, ViewTemplates, PageHelper) {
	"use strict";

    var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {

            return new PageHelper({
				idPrefix: "Detail-",
                showNavButton: true,
				hideEmpInfoBox: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.HBox({
					items: [
                        new sap.m.Button({
							press: oController.onDialogRegistBtn.bind(oController),
							text: "{i18n>LABEL_56005}", // 등록
							visible: {
								parts: [{path: "Sdate"}, {path: "/Gubun"}],
								formatter: function(v1, v2) {
									return !v1 || v2 === "X";
								}
							}
						}).addStyleClass("button-dark mr-8px"),
						new sap.m.Button({
							press: oController.onDialogReBtn.bind(oController),
							text: "{i18n>LABEL_56013}", // 수정
							visible: {
								parts: [{path: "Sdate"}, {path: "/Gubun"}],
								formatter: function(v1, v2) {
									return Common.checkNull(!v1) && Common.checkNull(v2);
								}
							}
						}).addStyleClass("button-light mr-8px"),
						new sap.m.Button({
							press: oController.onDialogDeleteBtn.bind(oController),
							text: "{i18n>LABEL_56014}", // 삭제
							visible: {
								parts: [{path: "Sdate"}, {path: "/Gubun"}],
								formatter: function(v1, v2) {
									return Common.checkNull(!v1) && Common.checkNull(v2);
								}
							}
						}).addStyleClass("button-delete")
					]
				})
				.setModel(oController.RegistModel)
				.bindElement("/FormData")
				.addStyleClass("app-nav-button-right"),
				contentStyleClass: "app-content",
                contentContainerStyleClass: "app-content-container-wide custom-title-left",
				contentItems: [
					this.ApplyingBox(oController),
					this.CommentBox(oController)
				]
			});
		},

        ApplyingBox: function(oController) {

			var oGubunCombo = new sap.m.ComboBox({ // 구분
				selectedKey: "{Tgubun}",
				width: "200px",
				editable: {
					parts: [{path: "Sdate"}, {path: "/Gubun"}],
					formatter: function(v1, v2) {
						return !v1 || v2 === "X";
					}
				},
				items: {
					path: "/GubunCombo",
					template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
				}
			})
			.addStyleClass("mr-5px");

			oGubunCombo.addDelegate({
				onAfterRendering: function () {
					oGubunCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oGubunCombo);

			return new sap.m.VBox({
                width: "100%",
				fitContainer: true,
				items: [
					// new sap.m.HBox({
					// 	width: "100%",
					// 	fitContainer: true,
					// 	items: [
                    //         ViewTemplates.getLabel("header", "{i18n>LABEL_09041}", "130px", "Right", true), // 구분
                    //         oGubunCombo
					// 	]
					// })
					// .addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						fitContainer: true,
						items: [
                            ViewTemplates.getLabel("header", "{i18n>LABEL_56006}", "130px", "Right", true), // 제목
                            new sap.m.Input({
								width: "100%",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),	
                                value: "{Title}",
                                maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "SuggestionBoxTableIn2", "Title", false),
                                editable: {
									parts: [{path: "Sdate"}, {path: "/Gubun"}],
									formatter: function(v1, v2) {
										return !v1 || v2 === "X";
									}
								}
                            })
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox(oController.PAGEID + "_RegistDateBox", {
						width: "100%",
						fitContainer: true,
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_56003}", "130px", "Right"), // 등록일
							new sap.m.Text({
                                width: "250px",
                                textAlign: "Begin",
                                text: {
                                    path: "Sdate",
                                    formatter: function(v) {
                                        return v ? Common.DateFormatter(v) : "";
                                    }
                                }
                            }),
                            ViewTemplates.getLabel("header", "{i18n>LABEL_56008}", "130px", "Right").addStyleClass("mr-8px"), // 최종변경일시
                            new sap.m.Text({
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
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox(oController.PAGEID + "_IsHideBox", {
						width: "100%",
						fitContainer: true,
						visible: {
							path: "/Gubun",
							formatter: function(v) {
								return v === "X";
							}
						},
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "130px", "Right", true), // 비밀번호
							new sap.m.Input({
                                width: "150px",
                                value: "{Pword}",
								type: sap.m.InputType.Password,
								maxLength: 10,
                                editable: {
									parts: [{path: "Sdate"}, {path: "/Gubun"}],
									formatter: function(v1, v2) {
										return !v1 || v2 === "X";
									}	
								}
                            }).addStyleClass("mr-8px"),
							new sap.m.Text({
                                width: "auto",
                                textAlign: "Begin",
                                text: "{i18n>MSG_56006}"
                            }).addStyleClass("pt-10px")
						]
					})
					.addStyleClass("search-field-group"),
                    new sap.m.HBox("contentArea1", {
						width: "100%",
						fitContainer: true,
						visible: {
							parts: [{path: "Sdate"}, {path: "/Gubun"}],
							formatter: function(v1, v2) {
								return Common.checkNull(v1) || v2 === "X";
							}	
						},
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_56010}", "130px", "Right", true) // 내용
                            // new sap.m.TextArea({
                            //     rows: 10,
							// 	width: "100%",
							// 	layoutData: new sap.m.FlexItemData({ growFactor: 1 }),	
							// 	value:"{Detail}",
							// 	maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "SuggestionBoxTableIn2", "Detail", false),
							// 	editable: {
							// 		parts: [{path: "Sdate"}, {path: "/Gubun"}],
							// 		formatter: function(v1, v2) {
							// 			return !v1 || v2 === "X";
							// 		}
							// 	}
							// }).addStyleClass("mt-8px mb-8px")
						]
					})
					.addStyleClass("search-field-group h-auto"),
                    new sap.m.HBox("contentArea2", {
						width: "100%",
						fitContainer: true,
						visible: {
							parts: [{path: "Sdate"}, {path: "/Gubun"}],
							formatter: function(v1, v2) {
								return Common.checkNull(!v1) && v2 !== "X";
							}	
						},
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_56010}", "130px", "Right", true) // 내용
							// new sap.ui.core.HTML(oController.PAGEID + "AreaHTML", { content: "{Detail}" })
						]
					})
					.addStyleClass("search-field-group h-auto"),
					new sap.m.HBox(oController.PAGEID + "_ThumsBox", {
						justifyContent: sap.m.FlexJustifyContent.End,
						alignContent: sap.m.FlexAlignContent.End,
						alignItems: sap.m.FlexAlignItems.End,
						width: "100%",
						fitContainer: true,
						items: [
							new sap.ui.core.Icon({
								src: "sap-icon://thumb-up"
							})
							.addStyleClass("icon-HiTokTok ok"),
							new sap.m.Text({
                                width: "auto",
                                text: "{Zgood}"
                            }).addStyleClass("mr-12px font-12px"),
							new sap.ui.core.Icon({
								src: "sap-icon://thumb-down"
							})
							.addStyleClass("icon-HiTokTok no"),
							new sap.m.Text({
                                width: "auto",
                                text: "{Zbed}"
                            }).addStyleClass("mr-12px font-12px"),
							new sap.m.Button(oController.PAGEID + "_ThumUp", { // 좋아요
								icon: "sap-icon://thumb-up",
								press: oController.OnThumbUp.bind(oController),
								text: "{i18n>LABEL_56020}" // 좋아요
							}).addStyleClass("button-light-sm mr-8px"),
							new sap.m.Button(oController.PAGEID + "_ThumDown", { // 싫어요
								icon: "sap-icon://thumb-down",
								press: oController.OnThumbDown.bind(oController),
								text: "{i18n>LABEL_56021}" // 싫어요
							}).addStyleClass("button-light-sm")
						]
					})
					.addStyleClass("custom-HiTokTok-group border-bottom-no"),
					new sap.m.HBox({
						fitContainer: true,
						visible: {
                            parts: [{path: "Appnm"}, {path: "/Gubun"}, {path: "Sdate"}],
                            formatter: function(v1, v2, v3) {
                                return Common.checkNull(!v1) || (Common.checkNull(v1) && v2 === "X") || Common.checkNull(v3);
                            }	
                        },
						items: [
                            sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
					})
				]
			})
			.setModel(oController.RegistModel)
			.bindElement("/FormData")
            .addStyleClass("search-inner-vbox mt-16px");
		},

        CommentBox: function(oController) {
            return new sap.m.VBox({
				visible: {
                    path: "/HideComment",
                    formatter: function(v) {
                        return v !== "X";
                    }
                },
				fitContainer: true,
				items: [
					new sap.m.HBox({
						justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
						fitContainer: true,
						items: [
							new sap.m.HBox({
								fitContainer: true,
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_56015}", "auto", "Left").addStyleClass("sub-title pt-9px mr-10px"), // 댓글
									// new sap.ui.core.Icon({
									// 	src: "sap-icon://information"
									// })
									// .addStyleClass("color-icon-blue mr-5px pt-14px"),
									// new sap.m.Text({
									// 	width: "auto",
									// 	textAlign: "Begin",
									// 	text: "{i18n>MSG_56006}"
									// }).addStyleClass("pt-12px")
								]
							})
						]
					})
					.addStyleClass("custom-HiTokTok-line mt-10px"),
					new sap.m.VBox(oController.PAGEID + "_CommentBox", {
						fitContainer: true,
						items: []
					}),


					new sap.m.VBox({
						fitContainer: true,
						items: [
							new sap.m.HBox({
							//	justifyContent: sap.m.FlexJustifyContent.End,
								fitContainer: true,
								items: [
									new sap.m.Input({
										width: "160px",
										value: "{Pword}",
										maxLength: 10,
										type: sap.m.InputType.Password,
										placeholder: "{i18n>MSG_56013}"
									}).addStyleClass("mr-5px custom-input"),
									new sap.m.Button({
										press: oController.onDialogSaveBtn.bind(oController),
										text: "{i18n>LABEL_56016}" // 저장
									}).addStyleClass("button-dark mt-4px"),
									new sap.ui.core.Icon({
										src: "sap-icon://information"
									})
									.addStyleClass("color-icon-blue ml-20px mr-5px pt-14px"),
									new sap.m.Text({
										width: "auto",
										textAlign: "Begin",
										text: "{i18n>MSG_56006}"
									}).addStyleClass("pt-12px")
								]
							}).addStyleClass("custom-comment"),
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.TextArea({
										rows: 2,
										width: "100%",
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										value:"{Detail}",
										maxLength: Common.getODataPropertyLength("ZHR_COMMON_SRV", "SuggestionBoxTableIn3", "Detail", false)
									})
								]
							}).addStyleClass("mt-8px")
						]
					}).addStyleClass("custom-HiTokTok-write")
				]
			})
			.setModel(oController.CommentModel)
			.bindElement("/Data");
        }
	});
});
