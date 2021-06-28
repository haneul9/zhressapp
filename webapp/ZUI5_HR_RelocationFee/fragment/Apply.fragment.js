sap.ui.define([
    "../../common/Common",
    "../delegate/ViewTemplates",
	"../../common/ZHR_TABLES",
	"../../common/HoverIcon",
	"sap/m/InputBase"
], function (Common, ViewTemplates, ZHR_TABLES, HoverIcon, InputBase) {
	"use strict";

    sap.ui.jsfragment("ZUI5_HR_RelocationFee.fragment.Apply", {

		createContent: function (oController) {
			
            var oLocationCombo1 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo1", {
				width: "150px",
				change: oController.checkLocation1.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/LocationCombo1",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Zfwkps}"
			}).addStyleClass("ml-5px ");
			
			// 키보드 입력 방지
			oLocationCombo1.addDelegate({
				onAfterRendering: function () {
					oLocationCombo1.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oLocationCombo1);

            var oLocationCombo2 = new sap.m.ComboBox(oController.PAGEID + "_LocationCombo2", {
				width: "150px",
				change: oController.checkLocation2.bind(oController),
				editable: {
					path: "Status",
					formatter: function(v) {
						if (!v || v === "AA") return true;
						return false;
					}
				},
				items: {
					path: "/LocationCombo2",
					template: new sap.ui.core.ListItem({
						key: "{Subcd}",
						text: "{Subtx1}"
					})
				},
				selectedKey: "{Ztwkps}"
			}).addStyleClass("ml-5px");
			
			// 키보드 입력 방지
			oLocationCombo2.addDelegate({
				onAfterRendering: function () {
					oLocationCombo2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oLocationCombo2);

            var oAppDate = new sap.m.DatePicker(oController.PAGEID + "_AppDate", { // 발령일자
				width: "150px",
				layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
				change: oController.getCriteria.bind(oController),
				dateValue: "{Zactdt}",
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
			});
			// 키보드 입력 방지
			oAppDate.addDelegate({
				onAfterRendering: function () {
					oAppDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oAppDate);

            var oFamilyBox = new sap.m.HBox(oController.PAGEID + "_CheckHBox", {
				visible: false,
				items: [
					new sap.m.Text({ // 6세 이상
						text: "{i18n>LABEL_34010}"
					})
					.addStyleClass("mr-10px"),
					new sap.m.Input({
						width: "50px",
						textAlign: "End",
						value: {
							path: "Zolda6",
							formatter: function(v) {
								if(v) return parseInt(v);
								else return "0";
							}
						},
						liveChange: oController.getCostSum1.bind(oController),
						maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Zolda6", false),
						editable: {
							path: "Status",
							formatter: function(v) {
								return !v || v === "AA";
							}
						}
					})
					.addStyleClass("mr-3px"),
					new sap.m.Text({ // 명
						text: "{i18n>LABEL_34011}"
					})
					.addStyleClass("mr-10px"),
					new sap.m.Text({ // 6세 미만
						text: "{i18n>LABEL_34012}"
					})
					.addStyleClass("mr-10px"),
					new sap.m.Input({
						width: "50px",
						textAlign: "End",
						value: {
							path: "Zunda6",
							formatter: function(v) {
								if(v) return parseInt(v);
								else return "0";
							}
						},
						liveChange: oController.getCostSum2.bind(oController),
						maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Zunda6", false),
						editable: {
							path: "Status",
							formatter: function(v) {
								return !v || v === "AA";
							}
						}
					})
					.addStyleClass("mr-3px"),
					new sap.m.Text({ // 명
						text: "{i18n>LABEL_34011}"
					})
					.addStyleClass("mr-10px"),
					new sap.ui.core.Icon({
						src: "sap-icon://alert",
						color: "#da291c"
					})
					.addStyleClass("mr-5px mt-10px"),
					new sap.m.Text({ // 만 6세 기준:
						text: "{i18n>LABEL_34013}"
					})
					.addStyleClass("mr-10px"),
					new sap.m.Text({
						text: {
							path: "/CriAge",
							formatter: function(v) {
								if(v) return Common.DateFormatter(v);
								else return "";
							}
						}
					})
				]
			})
			.addStyleClass("search-field-group");
            
            var oTopFlexBox = new sap.m.VBox({
				layoutData: new sap.m.FlexItemData({ minWidth: "593px" }),
                items: [
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							new sap.m.HBox({
								width: "57%",
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_34003}", "150px", "Right", true ), // 부임지									
									oLocationCombo1,
									new sap.ui.core.Icon({ src: "sap-icon://arrow-right" }).addStyleClass("ml-5px mr-5px "),
									oLocationCombo2
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								width: "43%",
								items: [
									ViewTemplates.getLabel("header", "{i18n>LABEL_34006}", "150px", "Right", true ), // 발령일자
                                    oAppDate
								]
							})
							.addStyleClass("search-field-group")
                        ]
                    }),
                    new sap.m.HBox({
                        width: "100%",
                        items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34004}", "150px", "Right", true ),  // 가족동반 여부
							new HoverIcon({
								src: "sap-icon://information",
								hover: function(oEvent) {
									Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_34016")); // 부임이전비 신청은 동일한 발령일에 한번 신청이 가능합니다. 가족동반 여부를 신중히 선택하시기 바랍니다.
								},
								leave: function(oEvent) {
									Common.onPressTableHeaderInformation.call(oController, oEvent);
								}
							})
							.addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue"),
							new sap.m.RadioButtonGroup(oController.PAGEID + "_RadioGroup", {
								layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
								width: "250px",
								editable: {
									path: "Status",
									formatter: function(v) {
										return !v || v === "AA";
									}
								},
								columns: 2,
								select: oController.onChangeRadio.bind(oController),
								selectedIndex: 0,
								buttons: [
									new sap.m.RadioButton({
										text: "{i18n>LABEL_34008}", // 단신
										width: "auto",
										selected: {
											path: "Zwtfml",
											formatter: function(v) {
												return v === "1";
											}
										}
									}),
									new sap.m.RadioButton({
										text: "{i18n>LABEL_34009}", // 가족동반
										width: "auto",
										selected: {
											path: "Zwtfml",
											formatter: function(v) {
												return v === "2";
											}
										}
									})
								]
							}).addStyleClass("mr-10px"),
                            oFamilyBox
                        ]
                    })
					.addStyleClass("search-field-group")
                ]
            })
			.addStyleClass("search-inner-vbox");
			
			var oMidTable = new sap.ui.table.Table(oController.PAGEID + "_MidTable", {
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
			.addStyleClass("thead-cell-border tbody-cell-border fix-header-height-38px mt-8px")
			.setModel(oController.CostModel)
			.bindRows("/Data");

			var oMidTable2 = new sap.ui.table.Table(oController.PAGEID + "_MidTable2", {
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
			.addStyleClass("thead-cell-border tbody-cell-border fix-header-height-38px mt-8px")
			.setModel(oController.CostModel)
			.bindRows("/Data");

			oMidTable.addEventDelegate({
				onAfterRendering: function() {
					Common.generateRowspan({ selector: this, colIndexes: [6, 7, 8] });
				}
			}, oMidTable);
				
			ZHR_TABLES.makeColumn(oController, oMidTable, [
				{id: "Ztexme",  label: "{i18n>LABEL_34014}" /* 여비 */,     plabel: "{i18n>LABEL_34019}" /* 본인 */, 	  resize: true, span: 3, type: "currency",	sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Ztexo6",  label: "{i18n>LABEL_34014}" /* 여비 */,  	plabel: "{i18n>LABEL_34010}" /* 6세 이상 */,resize: true, span: 0, type: "currency", sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Ztexu6",  label: "{i18n>LABEL_34014}" /* 여비 */,     plabel: "{i18n>LABEL_34012}" /* 6세 미만 */,resize: true, span: 0, type: "currency", sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Zdexme", 	label: "{i18n>LABEL_34015}" /* 일비 */,     plabel: "{i18n>LABEL_34019}" /* 본인 */, 	  resize: true, span: 3, type: "currency", sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Zdexo6",  label: "{i18n>LABEL_34015}" /* 일비 */,      plabel: "{i18n>LABEL_34010}" /* 6세 이상 */, resize: true, span: 0, type: "currency", sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Zdexu6",  label: "{i18n>LABEL_34015}" /* 일비 */,      plabel: "{i18n>LABEL_34012}" /* 6세 미만 */, resize: true, span: 0, type: "currency", sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Ztsrsv",  label: "{i18n>LABEL_34016}" /* 이전준비금 */, plabel: "{i18n>LABEL_34016}", /* 이전준비금 */ resize: true, span: 0, type: "currency",  sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Zmvcst",  label: "{i18n>LABEL_34017}" /* 가재운송비 */, plabel: "{i18n>LABEL_34017}", /* 가재운송비 */ resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "15%", templateGetter: "inputCost"},
				{id: "Ztstot",  label: "{i18n>LABEL_34018}" /* 합계 */,      plabel: "{i18n>LABEL_34018}", /* 합계 */ resize: true, span: 0, type: "currency",  sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right}
			]);
			oMidTable2.addEventDelegate({
				onAfterRendering: function() {
					Common.generateRowspan({ selector: this, colIndexes: [0, 4, 5, 6] });
				}
			}, oMidTable2);

			ZHR_TABLES.makeColumn(oController, oMidTable2, [
				{id: "Ztexme",  label: "{i18n>LABEL_34014}" /* 여비 */,     plabel: "{i18n>LABEL_34014}" /* 여비 */, 	  resize: true, span: 0, type: "template",	sort: true,  filter: true,  width: "15%", templateGetter: "inputCost2"},
				{id: "Zdexme", 	label: "{i18n>LABEL_34015}" /* 일비 */,     plabel: "{i18n>LABEL_34019}" /* 본인 */, 	  resize: true, span: 3, type: "currency", sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Zdexo6",  label: "{i18n>LABEL_34015}" /* 일비 */,      plabel: "{i18n>LABEL_34010}" /* 6세 이상 */, resize: true, span: 0, type: "currency", sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Zdexu6",  label: "{i18n>LABEL_34015}" /* 일비 */,      plabel: "{i18n>LABEL_34012}" /* 6세 미만 */, resize: true, span: 0, type: "currency", sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Ztsrsv",  label: "{i18n>LABEL_34016}" /* 이전준비금 */, plabel: "{i18n>LABEL_34016}", /* 이전준비금 */ resize: true, span: 0, type: "currency",  sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
				{id: "Zmvcst",  label: "{i18n>LABEL_34017}" /* 가재운송비 */, plabel: "{i18n>LABEL_34017}", /* 가재운송비 */ resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "15%", templateGetter: "inputCost"},
				{id: "Ztstot",  label: "{i18n>LABEL_34018}" /* 합계 */,      plabel: "{i18n>LABEL_34018}", /* 합계 */ resize: true, span: 0, type: "currency",  sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right}
			]);

			var oBotFlexBox = new sap.m.VBox({
				items: [
					new sap.m.HBox({
						width: "100%",
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34020}", "150px", "Right"), // 인사발령
							new sap.m.Input({
								textAlign: "Begin",
								width: "500px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Zactnm", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: "{Zactnm}"
							})
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						width: "100%",
						items: [
							ViewTemplates.getLabel("header", "{i18n>LABEL_34021}", "150px", "Right"), // 비고
							new sap.m.Input({
								textAlign: "Begin",
								width: "500px",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "NewPostTableIn1", "Remark", false),
								editable: {
									path: "Status",
									formatter: function(v) {
										if (!v || v === "AA") return true;
										return false;
									}
								},
								value: "{Remark}"
							})
						]
					})
					.addStyleClass("search-field-group"),
					new sap.m.VBox({
						items: [
							new sap.m.HBox({
								items: [
									new sap.m.MessageStrip({
										text: "{i18n>MSG_34001}", // 가족동반 부임: 주민등록 등본 첨부
										customIcon: "sap-icon://information",										
										showIcon: true,
										type: sap.ui.core.MessageType.Information
									}).addStyleClass("ml-0px")
								]
							}).addStyleClass("info-field-group message-strip mb-3px mt-20px"),
							new sap.m.HBox({
								items: [
									new sap.m.MessageStrip({
										text: "{i18n>MSG_34014}", // 가재 운송비: 주민등록 등본(실제 주소 이전 확인 용도), 거래명세서 혹은 견적서, 카드 혹은 현금영수증 증빙
										customIcon: "sap-icon://information",
										showIcon: true,
										type: sap.ui.core.MessageType.Information
									}).addStyleClass("ml-0px")
								]
							}).addStyleClass("info-field-group message-strip"),
							new sap.m.HBox(oController.PAGEID + "_FileBox", {
								items: [
									sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
								]
							}).addStyleClass("ml-0px mt-0px")
						]
					})
				]
			})
			.addStyleClass("search-inner-vbox mt-8px");
				
			var oDialog = new sap.m.Dialog({
				title: "{i18n>LABEL_34001}",    // 부임이전비 신청
				contentWidth: "980px",
				contentHeight: "560px",
				beforeOpen: oController.onBeforeDialog.bind(oController),
				afterOpen: oController.onAfterDialog.bind(oController),
				buttons: [
					new sap.m.Button({
						press: oController.onDialogApplyBtn.bind(oController),
						text: "{i18n>LABEL_34022}", // 신청,
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
						text: "{i18n>LABEL_34026}", // 저장,
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
						text: "{i18n>LABEL_34025}", // 삭제
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
						text: "{i18n>LABEL_34023}" // 닫기
					}).addStyleClass("button-default custom-button-divide")
				],
				content: [
					oTopFlexBox,
					oMidTable,
					oMidTable2,
					oBotFlexBox
                ]
			})
			.setModel(oController.DetailModel)
			.bindElement("/FormData")
			.addStyleClass("custom-dialog-popup");

			return oDialog;
		}
	});
});