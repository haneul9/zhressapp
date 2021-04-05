sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";
	sap.ui.jsfragment("ZUI5_HR_CulturalLivingExpenses.fragment.CulturalLivingExpensesDetail", {
		
		_colModel: [
			{id: "Usedt",	label: "{i18n>LABEL_21015}"/* 사용일 */,  plabel: "", resize: true, span: 0, type: "template", required: true, sort: false,  filter: false,  width: "20%", templateGetter: "getDatePicker"},
			{id: "Usetx", 	label: "{i18n>LABEL_21016}"/* 내용 */,	plabel: "", resize: true, span: 0, type: "template", required: true,  sort: false,  filter: false,  width: "33%", templateGetter: "getContents", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Betrg",	label: "{i18n>LABEL_21017}"/* 금액(원) */,plabel: "", resize: true, span: 0, type: "template",  required: true,  sort: false,  filter: false,  width: "15%", templateGetter: "getPrice", align: sap.ui.core.HorizontalAlign.Right},
			{id: "UsecdT",	label: "{i18n>LABEL_21018}"/* 현금/카드 */,plabel: "", resize: true, span: 0, type: "template", required: true, sort: false,  filter: false,  width: "auto", templateGetter: "getPayMethod"},
		],
		
		createContent: function (oController) {
			
			var applyBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						justifyContent: sap.m.FlexJustifyContent.SpaceBetween,

						items: [
							new sap.m.HBox({
								items: [
									new sap.m.Label({
										// 대상월
										text: "{i18n>LABEL_21002}",									
										width: "90px",
										textAlign: "End",
										layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch })
									}),
									new sap.m.Text(oController.PAGEID + "_SpmonT", {
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
										textAlign: "Begin",
										width: "140px"
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									new sap.m.Label({
										// 신청일
										text: "{i18n>LABEL_21003}",									
										width: "90px",
										textAlign: "End",
										layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch })
									}),
									new sap.m.Text({
										width: "140px",
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
										}
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.FlexBox({
								items: [
									new sap.m.Label({
										// 신청금액
										text: "{i18n>LABEL_21027}",										
										width: "90px",
										textAlign: "End",
										layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch })
									}),
									new sap.m.Text(oController.PAGEID + "_Betrg1", {
										text: {
											path: "Betrg1",
											formatter: function(v) {
												if(v) return common.Common.numberWithCommas(v) + " 원";
												else return "0 원";
											}
										},
										textAlign: "Begin",
										width: "140px"
									})
								]
							}).addStyleClass("search-field-group"),
						]
					}).addStyleClass("search-inner-vbox"),
					new sap.m.FlexBox({
					//	justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
						items: [
							new sap.m.HBox({
								items: [
									new sap.m.Label({
										// 처리상태
										text: "{i18n>LABEL_21006}",										
										width: "90px",
										textAlign: "End",
										layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch })
									}),
									new sap.m.Text(oController.PAGEID + "_StatusT", {
										text: {
											path: "StatusT",
											formatter: function(v) {
												if(v) return v;
												else return "신규";
											} 
										},
										textAlign: "Begin",
										width: "140px"
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									new sap.m.Label({
										// 지원대상금액
										text: "{i18n>LABEL_21028}",										
										width: "90px",
										textAlign: "End",
										layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch })
									}),
									new sap.m.Text(oController.PAGEID + "_Betrg2", {
										text: {
											path: "Betrg2",
											formatter: function(v) {
												if(v) return common.Common.numberWithCommas(v) + " 원";
												else return "0 원";
											}
										},
										textAlign: "Begin",
										width: "398px"										
									})
								]
							}).addStyleClass("search-field-group"),
						]
					})
				],
				direction: "Column" //세로 정렬
			})			


			
			
			var oUseHistory = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_21014}"							
							})
							.addStyleClass("sub-title"), // 사용내역
						]
					}).addStyleClass("info-field-group"),
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
					.addStyleClass("mr-10px button-group")
				]
			})
			.addStyleClass("mt-20px");
			
			var oFileUpload = new sap.m.VBox({
				width: "100%",
				items: [
					new sap.m.HBox({
						width: "100%",
						items: [
							sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
					}),
					new sap.m.HBox(oController.PAGEID + "_TextFlexBox", {
						width: "auto",
						direction: "Column", //세로 정렬
						items: []
					})
					.addStyleClass("mt-20px memo-background")
					.setModel(oController.TextViewModel)
					.bindElement("/Data")
				]
			});
			
			var oDetailTable = new sap.ui.table.Table(oController.PAGEID + "_DetailTable", {
				selectionMode: {
					path: "/FormData/Status",
					formatter: function(v) {
						if(v === "10" || !v) return sap.ui.table.SelectionMode.MultiToggle;
						else return sap.ui.table.SelectionMode.None; 
					}
				},
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 5,
				showOverlay: false,
				showNoData: true,
			    width: "100%",	
				rowHeight: 37,
				columnHeaderHeight: 38,		
				noData: "{i18n>LABEL_00901}"
			})			
			.setModel(oController.DetailModel)
			.bindRows("/TableData")
			.addStyleClass("mt-10px");
			
			oDetailTable.addEventDelegate({
				onAfterRendering : function(){
					// 키보드 입력 방지
					var vESpmon = oController.DetailModel.getProperty("/FormData/Spmon");
					if(vESpmon){
						var vYear = Number(vESpmon.slice(0,4));
						var vMonth = Number(vESpmon.slice(4,6));
						
						oDetailTable.getRows().forEach(function(elem,index) {
							oDetailTable.getRows()[index].getCells()[0].setMinDate(new Date(vYear, vMonth-1, 1));
							oDetailTable.getRows()[index].getCells()[0].setMaxDate(new Date(vYear, vMonth, 0));
							oDetailTable.getRows()[index].getCells()[0].$().find("INPUT").attr("disabled", true);
						});
					}

					var oBinding = oDetailTable.getBinding("rows");
					oBinding.attachChange(function() {
						oDetailTable.getRows().forEach(function(elem,index) {
							oDetailTable.getRows()[index].getCells()[0].$().find("INPUT").attr("disabled", true);
						});
					});
					
				}
			}, oDetailTable);
			
			common.ZHR_TABLES.makeColumn(oController, oDetailTable, this._colModel);
			
			
			var oDialog = new sap.m.Dialog(oController.PAGEID + "_CulturalLivingExpensesDetail_Dialog", {
				title: "{i18n>LABEL_21001}",
				contentWidth: "830px",
				contentHeight: "680px",
				beforeOpen: oController.onBeforeOpenDetailDialog.bind(oController),
				afterOpen: oController.onAfterOpenDetailDialog.bind(oController),
				buttons: [
					new sap.m.Button(oController.PAGEID + "_RewirteBtn", {
						press: $.proxy(oController.onPressDialogRewrite, oController),
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
					}),
					new sap.m.Button(oController.PAGEID + "_SaveBtn", {
						press: $.proxy(oController.onPressDialogSave, oController),
						text: "{i18n>LABEL_21029}", // 저장
						visible: {
							path: "Status",
							formatter: function(v) {
								if(!v || v === "10") return true;
								else return false; 
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: $.proxy(oController.onPressDialogDelete, oController),
						text: "{i18n>LABEL_21010}", // 삭제
						visible: {
							path: "Status",
							formatter: function(v) {
								if(v === "10" || v === "15") return true;
								else return false; 
							}
						}
					}).addStyleClass("button-delete"),
					new sap.m.Button(oController.PAGEID + "_RequestBtn", {
						press: $.proxy(oController.onPressDialogReq, oController),
						text: "{i18n>LABEL_21009}", // 신청
						visible: {
							path: "Status",
							formatter: function(v) {
								if(v === "10" || !v) return true;
								else return false; 
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: $.proxy(oController.onPressDialogCancel, oController),
						text: "{i18n>LABEL_21012}", // 신청취소
						visible: {
							path: "Status",
							formatter: function(v) {
								if(v === "20") return true;
								else return false; 
							}
						}
					}).addStyleClass("button-light"),					
					new sap.m.Button({
						press: function () {
							oController.onTableSearch();
							oDialog.close();
						},
						text: "{i18n>LABEL_21011}", // 닫기
					}).addStyleClass("button-default custom-button-divide"),
				],
				content: [
					new sap.m.FlexBox({
						justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
						direction: sap.m.FlexDirection.Column,
						items: [
							applyBox,
							oUseHistory,
							oDetailTable,
							oFileUpload
						]
					})
				]
			})
				.setModel(oController.DetailModel)
				.bindElement("/FormData")	
				.addStyleClass("custom-dialog-popup");		
	
			return oDialog;
		}
	})
});