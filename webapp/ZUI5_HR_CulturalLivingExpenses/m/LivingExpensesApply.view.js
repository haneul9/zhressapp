sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper"
], function (Common, PageHelper) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "LivingExpensesApply"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			var oListController = $.app.getController();
			
			return new PageHelper({
				idPrefix: "LivingExpensesApply-",
                title: "{i18n>LABEL_21001}", // 문화생활비 신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.FlexBox({
					items: [
						new sap.m.Button(oController.PAGEID + "_RewirteBtn", {
							press: $.proxy(oController.onPressRewrite, oController),
							text: "{i18n>LABEL_21013}", // 재작성
							visible: {
								parts: [
									{path: "Status"}, 
									{path: "/LogData/EButton"}
								],
								formatter: function(v, v1) {
									if(v === "15" && v1 === "X") return true;
									else return false; 
								}
							}
						}).addStyleClass("button-light"),
						new sap.m.Button(oController.PAGEID + "_SaveBtn", {
							press: $.proxy(oController.onPressSave, oController),
							text: "{i18n>LABEL_21029}", // 저장
							visible: {
								path: "Status",
								formatter: function(v) {
									if(!v || v === "10") return true;
									else return false; 
								}
							}
						}).addStyleClass("button-light"),
						new sap.m.Button(oController.PAGEID + "_DeleteBtn", {
							press: $.proxy(oController.onPressDelete, oController),
							text: "{i18n>LABEL_21010}", // 삭제
							visible: {
								path: "Status",
								formatter: function(v) {
									if(v === "10" || v === "15") return true;
									else return false; 
								}
							}
						}).addStyleClass("button-light"),
						new sap.m.Button(oController.PAGEID + "_RequestBtn", {
							press: $.proxy(oController.onPressReq, oController),
							text: "{i18n>LABEL_21009}", // 신청
							visible: {
								path: "Status",
								formatter: function(v) {
									if(v === "10" || !v) return true;
									else return false; 
								}
							}
						}).addStyleClass("button-dark"),
						new sap.m.Button(oController.PAGEID + "_CancelBtn", {
							press: $.proxy(oController.onPressCancel, oController),
							text: "{i18n>LABEL_21012}", // 신청취소
							visible: {
								path: "Status",
								formatter: function(v) {
									if(v === "20") return true;
									else return false; 
								}
							}
						}).addStyleClass("button-light")
					]
				}).addStyleClass("app-nav-button-right"),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.getApplyingBox(oController),
					this.getUsageHistory(oListController,oController),
					this.fileUpload(oController)
				]
			})
			.setModel(oListController.DetailModel)
			.bindElement("/FormData")
		},
		
		getApplyingBox: function(oController) {
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_21002}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 대상월
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: {
									path: "Spmon",
									formatter:  function(v) {
										if(v){
											var vDate = v;
											var vYear = vDate.slice(0,4);
											var vMonth = vDate.slice(4,6);
											
											return 	vYear + "년 " + vMonth + "월";
										}else return;
									} 
								},
								textAlign: "End",
								width: "100%"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_21003}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 신청일
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: {
									path: "Apdat",
									formatter: function (v) {
										if(v) return Common.DateFormatter(v);
										else {
											var vYear = new Date().getFullYear();
											var vMonth = new Date().getMonth();
											var vDate = new Date().getDate();
											return Common.DateFormatter(new Date(vYear, vMonth, vDate));
										}
									}
								},
								textAlign: "End",
								width: "100%"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_21030}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 신청금액
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: {
									path: "Betrg1",
									formatter: function(v) {
										if(v) return common.Common.numberWithCommas(v) + " 원";
										else return "0 원";
										
									}
								},
								textAlign: "End",
								width: "100%"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_21031}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 지원대상금액
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: {
									path: "Betrg2",
									formatter: function(v) {
										if(v) return common.Common.numberWithCommas(v) + " 원";
										else return "0 원";
									}
								},
								textAlign: "End",
								width: "100%"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_21006}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 처리상태
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: {
									path: "StatusT",
									formatter: function(v) {
										if(v) return v;
										else return "신규";
									} 
								},
								textAlign: "End",
								width: "100%"
							})
						]
					})
				]
			})
			.addStyleClass("vbox-form-mobile");
		},
		
		getUsageHistory: function(oListController, oController) {
			return new sap.m.FlexBox({
				direction: sap.m.FlexDirection.Column,
				items: [
					new sap.m.FlexBox({
						justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
						alignContent: sap.m.FlexAlignContent.End,
						alignItems: sap.m.FlexAlignItems.End,
						items: [
							new sap.m.Label({ width: "105px", required: true, text: "{i18n>LABEL_21014}", textAlign: "Begin" }).addStyleClass("sub-title"), // 사용내역
							new sap.m.FlexBox({
								items: [
									new sap.m.Button({
										icon: "sap-icon://add",
										press: oController.onPressAddRow,
										text: "{i18n>LABEL_21025}", // 추가
										visible: {
											path: "Status",
											formatter: function(v) {
												if(v === "10" || !v) return true;
												else return false; 
											}
										}
									}).addStyleClass("button-light-sm"),
									new sap.m.Button({
										icon: "sap-icon://less",
										press: oController.onPressDelRow,
										text: "{i18n>LABEL_21010}", // 삭제
										visible: {
											path: "Status",
											formatter: function(v) {
												if(v === "10" || !v) return true;
												else return false; 
											}
										}
									}).addStyleClass("button-light-sm")
								]
							})
							.addStyleClass("button-group")
						]
					}),
					new sap.m.Table(oController.PAGEID + "_UseTable", {
						inset: false,
						rememberSelections: false,
						noDataText: "{i18n>LABEL_00901}",
						growing: true,
						growingThreshold: 5,
						mode: sap.m.ListMode.SingleSelectMaster,
						columns: [
							new sap.m.Column({
								width: "10%",
								hAlign: sap.ui.core.TextAlign.Begin
							}),
							new sap.m.Column({
								width: "50%",
								hAlign: sap.ui.core.TextAlign.Begin
							}),
							new sap.m.Column({
								width: "auto",
								hAlign: sap.ui.core.TextAlign.End
							})
						],
						items: {
							path: "/TableData",
							template: new sap.m.ColumnListItem({
								type: sap.m.ListType.Active,
								counter: 5,
								cells: [
									new sap.m.CheckBox({ 
										selected: "{Checked}",
										visible: {
											path: "/FormData/Status",
											formatter: function(v) {
												if(v === "10" || !v) return true;
												else return false; 
											}
										}
									}).addStyleClass("custom-support"),
									new sap.m.FlexBox({
										direction: sap.m.FlexDirection.Column,
										items: [
											new sap.m.Text({
												text: {
													path: "Usedt",
													formatter: function(v) {
														if(v) return Common.DateFormatter(v);
													} 
												},
												textAlign: "Begin"
											}).addStyleClass("L2P13Font"),
											new sap.m.Text({
												text: "{Usetx}",
												textAlign: "Begin"
											}).addStyleClass("L2P13Font")
										]
									}),
									new sap.m.FlexBox({
										direction: sap.m.FlexDirection.Column,
										items: [
											new sap.m.Text({
												text: "{UsecdT}",
												textAlign: "End"
											}).addStyleClass("L2P13Font"),
											new sap.m.Text({
												text: {
													path: "Betrg",
													formatter: function(v) {
														return (v) ? Common.numberWithCommas(v) + " 원" : "0 원";
													}
												},
												textAlign: "End"
											}).addStyleClass("L2P13Font")
										]
									}),
								]
							})
						}
					})
					.setModel(oListController.DetailModel)
					.addStyleClass("mt-8px")
				]
			});
		},
		
		fileUpload: function(oController) {
			return new sap.m.FlexBox({
				items: [
					sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
				]
			})
		}
	});
});