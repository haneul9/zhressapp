/* global moment:true */
sap.ui.define([
	"common/CommaInteger",
	"common/Common",
	"common/Formatter",
	"common/HoverIcon",
	"common/moment-with-locales",
	"common/PickOnlyDatePicker",
	"common/ZHR_TABLES",
	"../delegate/OnSettlement",
	"../delegate/ViewTemplates",
	"sap/m/InputBase"
], function(
	CommaInteger,
	Common,
	Formatter,
	HoverIcon,
	momentjs,
	PickOnlyDatePicker,
	ZHR_TABLES,
	OnSettlement,
	ViewTemplates,
	InputBase
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTripMap.fragment.SettlementDetail", {

	createContent: function(oController) {

		var oModel = oController.SettlementDetailDialogHandler.getModel();
		return [
			this.getHeaderPanel(oController).setModel(oModel),
			this.getScheduleAndSettlementPanel(oController).setModel(oModel)
		];
	},

	getHeaderPanel: function(oController) {

		var Dtfmt = oController.getSessionInfoByKey("Dtfmt"),
		oPanel = new sap.m.Panel("header-panel", {
			expanded: true,
			expandable: true,
			headerText: "{i18n>LABEL_19301}", // 출장 개요
			content: new sap.m.HBox({
				items: [
					new sap.m.VBox({
						layoutData: new sap.m.FlexItemData({ minWidth: "593px" }),
						width: "50%",
						items: [
							new sap.m.HBox({
								width: "100%",
								items: [
									new sap.m.HBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "297px" }),
										width: "50%",
										items: [
											ViewTemplates.getHeaderLabel("{i18n>LABEL_19302}", false), // 신청일
											new sap.m.Text({
												layoutData: new sap.m.FlexItemData({ minWidth: "150px" }),
												text: {
													path: "/Header/DtRqst",
													type: new sap.ui.model.type.Date({ pattern: Dtfmt })
												}
											})
										]
									})
									.addStyleClass("search-field-group"),
									new sap.m.HBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "297px" }),
										width: "50%",
										items: [
											ViewTemplates.getHeaderLabel("{i18n>LABEL_19304}", false), // 신청번호
											new sap.m.Text({
												layoutData: new sap.m.FlexItemData({ minWidth: "150px" }),
												text: "{/Header/ZzdocnoApp}"
											})
										]
									})
									.addStyleClass("search-field-group mt-0")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								width: "100%",
								items: [
									new sap.m.HBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "297px" }),
										width: "50%",
										items: [
											ViewTemplates.getHeaderLabel("{i18n>LABEL_19316}", false), // 정산일
											new sap.m.Text({
												layoutData: new sap.m.FlexItemData({ minWidth: "150px" }),
												text: {
													path: "/Header/BtSettledat",
													type: new sap.ui.model.type.Date({ pattern: Dtfmt })
												}
											}),
										]
									})
									.addStyleClass("search-field-group"),
									new sap.m.HBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "297px" }),
										width: "50%",
										items: [
											ViewTemplates.getHeaderLabel("{i18n>LABEL_19317}", false), // 정산번호
											new sap.m.Text({
												layoutData: new sap.m.FlexItemData({ minWidth: "150px" }),
												text: "{/Header/Zzdocno}"
											})
										]
									})
									.addStyleClass("search-field-group mt-0")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19306}", false), // 출장자
									ViewTemplates.getCustomInput("SettlementHeaderEname", {
										layoutData: new sap.m.FlexItemData({ minWidth: "342px" }),
										fieldWidth: "250px",
										editable: "{= ${/Header/Edtfg} && ${/Header/isEnameDialogAvailable} && ${/Header/isEnameEditable} }",
										description: "{/Header/Pernr}",
										showValueHelp: "{= ${/Header/Edtfg} && ${/Header/isEnameDialogAvailable} && ${/Header/isEnameEditable} }",
										value: "{/Header/Ename}",
										valueHelpOnly: true,
										valueHelpRequest: OnSettlement.searchEname.bind(oController)
									}, OnSettlement.clearEname.bind(oController))
									.addStyleClass("field-min-width-50"),
									new HoverIcon({
										visible: "{= ${/Header/Edtfg} && ${/Header/isEnameDialogAvailable} && ${/Header/isEnameEditable} }",
										src: "sap-icon://information",
										hover: function(oEvent) {
											Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_19001")); // 대리신청 등록된 사원만 출장자 변경 가능
										},
										leave: function(oEvent) {
											Common.onPressTableHeaderInformation.call(oController, oEvent);
										}
									})
									.addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19308}", "{/Header/Edtfg}"), // 출장구분
									new sap.m.Select("SettlementHeaderBtPurpose1", {
										layoutData: new sap.m.FlexItemData({ minWidth: "250px" }),
										change: OnSettlement.changeBtPurpose.bind(oController),
										width: "250px",
										editable: "{/Header/Edtfg}",
										selectedKey: "{/Header/BtPurpose1}",
										items: {
											path: "/BtPurpose1SelectList",
											templateShareable: false,
											template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
										}
									}),
									new HoverIcon({
										src: "sap-icon://information",
										hover: function(oEvent) {
											Common.onPressTableHeaderInformation.call(oController, oEvent, [
												oController.getBundleText("MSG_19002"), // 1) 일반 출장 : 사업장-목적지 간 거리가 편도 100km 이상인 경우
												oController.getBundleText("MSG_19003", oController.getBundleText("MSG_19029")), // 2) 근거리 출장 : 사업장-목적지 간 거리가 편도 40km 이상 ~ 100km 미만인 경우 (일비 없음)
												oController.getBundleText("MSG_19004")  // 3) 인재개발원 교육출장 : 롯데인재개발원에서 진행되는 교육을 이수하기 위한 출장의 경우
											]);
										},
										leave: function(oEvent) {
											Common.onPressTableHeaderInformation.call(oController, oEvent);
										}
									})
									.addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19312}", "{/Header/Edtfg}"), // 출장명
									new sap.m.Input("SettlementHeaderTitle", {
										maxLength: Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtRequestTableIn02", "Title", false),
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "250px" }),
										width: "95%",
										editable: "{/Header/Edtfg}",
										value: "{/Header/Title}"
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									new sap.m.Label({
										text: "{i18n>LABEL_19314}", // 출장목적
										width: "130px",
										required: "{/Header/Edtfg}",
										design: sap.m.LabelDesign.Bold,
										textAlign: sap.ui.core.TextAlign.Right,
										layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch, minHeight: "120px" })
									}),
									new sap.m.TextArea("SettlementHeaderBtPurpose2", {
										maxLength: Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtRequestTableIn02", "BtPurpose2", false),
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "250px" }),
										width: "95%",
										editable: "{/Header/Edtfg}",
										value: "{/Header/BtPurpose2}",
										rows: 5
									})
								]
							})
							.addStyleClass("search-field-group textarea-row"),
							new sap.m.HBox({
								items: [
									new sap.m.Label({
										text: "{i18n>LABEL_19319}", // 출장결과
										width: "130px",
										required: "{/Header/Edtfg}",
										design: sap.m.LabelDesign.Bold,
										textAlign: sap.ui.core.TextAlign.Right,
										layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch, minHeight: "120px" })
									}),
									new sap.m.TextArea("SettlementHeaderBtResult", {
										maxLength: Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtRequestTableIn02", "BtResult", false),
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "250px" }),
										width: "95%",
										editable: "{/Header/Edtfg}",
										value: "{/Header/BtResult}",
										rows: 5
									})
								]
							})
							.addStyleClass("search-field-group textarea-row")
						]
					})
					.addStyleClass("search-inner-vbox"),
					new sap.m.VBox({
						layoutData: new sap.m.FlexItemData({ minWidth: "593px" }),
						width: "50%",
						items: [
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19303}", false), // 전기일
									new PickOnlyDatePicker({
										width: "250px",
										editable: "{/Header/Edtfg}",
										displayFormat: Dtfmt,
										placeholder: Dtfmt,
										minDate: new Date(2020, 0, 1),
										dateValue: "{/Header/Budat}"
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19305}", "{/Header/Edtfg}"), // 소속부서
									ViewTemplates.getCustomInput("SettlementHeaderCdIndpt", {
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "350px" }),
										fieldWidth: "250px",
										editable: "{= ${/Header/Edtfg} && ${/Header/isEnameEditable} }",
										showValueHelp: "{= ${/Header/Edtfg} && ${/Header/isEnameEditable} }",
										description: "{/Header/CdIndpt}",
										value: "{/Header/CdIndptText}",
										valueHelpOnly: true,
										valueHelpRequest: OnSettlement.searchMainCostCenter.bind(oController)
									}, OnSettlement.clearMainCostCenter.bind(oController))
									.addStyleClass("field-min-width-50")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19307}", "{/Header/Edtfg}"), // 비용귀속부서
									ViewTemplates.getCustomInput("SettlementHeaderZsendKostl", {
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "350px" }),
										customData: [
											new sap.ui.core.CustomData({
												key: "dialogTitle",
												value: "{i18n>LABEL_19307}"
											}),
											new sap.ui.core.CustomData({
												key: "search",
												value: {
													subCode: "/Header/ZsendGsber",
													code: "/Header/ZsendKostl"
												}
											}),
											new sap.ui.core.CustomData({
												key: "target",
												value: {
													code: "/Header/ZsendKostl",
													text: "/Header/ZsendKostlT"
												}
											})
										],
										fieldWidth: "250px",
										editable: "{/Header/Edtfg}",
										showValueHelp: "{/Header/Edtfg}",
										description: "{/Header/ZsendKostl}",
										value: "{/Header/ZsendKostlT}",
										valueHelpOnly: true,
										valueHelpRequest: OnSettlement.searchSubCostCenter.bind(oController)
									}, OnSettlement.clearSubCostCenter.bind(oController))
									.addStyleClass("field-min-width-50")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19309}", false), // WBS
									ViewTemplates.getCustomInput("SettlementHeaderPsPosid", {
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "350px" }),
										customData: [
											new sap.ui.core.CustomData({
												key: "search",
												value: {
													subCode: "/Header/ZsendKostl",
													code: "/Header/PsPosid"
												}
											}),
											new sap.ui.core.CustomData({
												key: "target",
												value: {
													code: "/Header/PsPosid",
													text: "/Header/PsPosidT"
												}
											})
										],
										fieldWidth: "250px",
										editable: "{/Header/Edtfg}",
										showValueHelp: "{/Header/Edtfg}",
										description: "{/Header/PsPosid}",
										value: "{/Header/PsPosidT}",
										valueHelpOnly: true,
										valueHelpRequest: OnSettlement.searchWBS.bind(oController)
									}, OnSettlement.clearWBS.bind(oController))
									.addStyleClass("field-min-width-50")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19318}", false), // 총 지급액
									new sap.m.Text({
										text: {
											path: "/Header/Apamt",
											formatter: Common.toCurrency
										},
										textAlign: sap.ui.core.TextAlign.Right
									}),
									new sap.m.Text({
										text: "{/Header/ZlcWaers}"
									})
									.addStyleClass("ml-10px")
								]
							})
							.addStyleClass("search-field-group")
						]
					})
					.addStyleClass("search-inner-vbox")
				]
			})
			.addStyleClass("search-box panel-inner-box h-auto")
		})
		.addStyleClass("custom-panel mnw-1188px");

		oPanel.addEventDelegate({
			onAfterRendering: function() {
				this.$().find(".sapMPanelWrappingDiv .sapUiIcon").attr("data-sap-ui-icon-content", this.getExpanded() ? "" : ""); // navigation-up-arrow : navigation-down-arrow
			}
		}, oPanel);

		return oPanel;
	},

	getScheduleAndSettlementPanel: function(oController) {

		return new sap.m.Panel({
			expanded: true,
			expandable: false,
			headerText: "{i18n>LABEL_19331}", // 출장 일정 및 정산
			content: new sap.m.VBox({
				width: "100%",
				items: [
					this.getTableIn04Buttons(oController), // 출장 일정 Buttons
					this.getTableIn04(oController),        // 출장 일정 Table
					this.getTableIn05Buttons(oController), // 비용정산항목 Title & Buttons
					this.getTableIn05(oController),        // 비용정산항목 Table
					this.getTableIn03Title(),              // 경비현황 Title & Summary
					this.getTableIn03(oController)         // 경비현황 Table
				]
			})
			.addStyleClass("panel-inner-box px-30px")
		})
		.addStyleClass("custom-panel mt-15px mnw-1188px");
	},

	// 출장 일정 Buttons
	getTableIn04Buttons: function(oController) {

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.End,
			visible: "{/Header/Edtfg}",
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.CheckBox({
							select: OnSettlement.selectExceptDailyAmount.bind(oController),
							editable: "{= ${/Header/Edtfg} && ${/Header/BtPurpose1} !== '5' }", // 출장구분 '근거리 출장'의 경우 항상 일비 제외
							selected: "{= ${/Header/ChkPer} || ${/Header/BtPurpose1} === '5' }",
							text: "{i18n>LABEL_19353}" // 일비 제외
						})
						.addStyleClass("custom-checkbox"),
						new HoverIcon({
							src: "sap-icon://information",
							hover: function(oEvent) {
								Common.onPressTableHeaderInformation.call(oController, oEvent, [
									oController.getBundleText("MSG_19022"), // • 교육 출장, 근거리 출장 등 일비 예외 지급 출장 건은 일비 제외 후 기타 비용으로 정산하시기 바랍니다.
									oController.getBundleText("MSG_19023")  // • 일비 제외 체크시 일비가 정산금액에 포함되지 않습니다.
								]);
							},
							leave: function(oEvent) {
								Common.onPressTableHeaderInformation.call(oController, oEvent);
							}
						})
						.addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue mr-26px line-height-31px"),
						new sap.m.Button("SettlementTableIn04-add", {
							press: OnSettlement.pressAddSchedule.bind(oController),
							icon: "sap-icon://add",
							enabled: "{/Header/Btact}",
							text: "{i18n>LABEL_00153}" // 추가
						})
						.addStyleClass("button-light-sm"),
						new sap.m.Button("SettlementTableIn04-remove", {
							press: OnSettlement.pressRemoveSchedule.bind(oController),
							icon: "sap-icon://less",
							enabled: "{/Header/Btact}",
							text: "{i18n>LABEL_00103}" // 삭제
						})
						.addStyleClass("button-light-sm")
					]
				})
				.addStyleClass("button-group")
			]
		});
	},

	// 출장 일정 Table
	getTableIn04: function(oController) {

		var oTable = new sap.ui.table.Table("SettlementTableIn04", {
			layoutData: new sap.m.FlexItemData({ maxWidth: "100%" }),
			selectionMode: "{= ${/Header/Edtfg} ? '" + sap.ui.table.SelectionMode.MultiToggle + "' : '" + sap.ui.table.SelectionMode.None + "' }",
			enableSelectAll: "{/Header/Edtfg}",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			busyIndicatorDelay: 0,
			fixedColumnCount: 3,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}"
		})
		.addStyleClass("thead-cell-border tbody-cell-border fix-header-height-38px mt-8px")
		.bindRows("/SettlementTableIn04");

		oTable.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("required-blind", !this.getEnableSelectAll()).$().find("td[data-sap-ui-colid=\"SettlementTableIn04BtPeriod\"] input").prop("readonly", true);
			}
		}, oTable);

		var PrestartPTooltip = [
			oController.getBundleText("MSG_19005"), // • 출장 기본 스케줄에서 부득이하게 전일출발하는 경우 체크해줍니다.
			oController.getBundleText("MSG_19006")  // • 체크할 경우 일당은 변경사항이 없고, 숙박비 한도가 증가하여 정산시 스케줄+1일 만큼 정산이 가능하도록 한도금액이 증가합니다.
		],
		ReLodgingTooltip = [
			oController.getBundleText("MSG_19007"), // • 숙박 : 총 제공 숙박일수(숙박비 한도 차감)
			oController.getBundleText("MSG_19008")  // • 식사 : 총 제공 식사일수(출장목적에 따라 일당 차감 발생. 출장기준서 참조)
		];

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "ClDmtrT",     label: "{i18n>LABEL_19332}"/* 출장지           */, plabel: "{i18n>LABEL_19333}"/* 국내외 구분     */, resize: true, span: 3, type: "string",   sort: true,  filter: true, width: "105px" },
			{ id: "BtCrtT",      label: "{i18n>LABEL_19332}"/* 출장지           */, plabel: "{i18n>LABEL_19334}"/* 국가            */, resize: true, span: 0, type: "string",   sort: true,  filter: true, width: "170px" },
			{ id: "BtCityT",     label: "{i18n>LABEL_19332}"/* 출장지           */, plabel: "{i18n>LABEL_19335}"/* 도시            */, resize: true, span: 0, type: "template", sort: true,  filter: true, width: "225px", align: sap.ui.core.HorizontalAlign.Left, templateGetter: "getCityInputTemplate", templateGetterOwner: this, required: true },
			{ id: "BtPeriod",    label: "{i18n>LABEL_19336}"/* 출장 기간        */, plabel: "{i18n>LABEL_19337}"/* 시작일 ~ 종료일 */, resize: true, span: 2, type: "template", sort: true,  filter: true, width: "250px", templateGetter: "getDateRangeSelectionTemplate", templateGetterOwner: this, required: true },
			{ id: "Prestart",    label: "{i18n>LABEL_19336}"/* 출장 기간        */, plabel: "{i18n>LABEL_19338}"/* 전일 출발       */, resize: true, span: 0, type: "template", sort: false, filter: true, width: "110px", templateGetter: "getCheckboxTemplate",           templateGetterOwner: this, ptooltip: PrestartPTooltip },
			{ id: "ReLodging",   label: "{i18n>LABEL_19339}"/* 제공받는 일수    */, plabel: "{i18n>LABEL_19340}"/* 숙박            */, resize: true, span: 2, type: "template", sort: true,  filter: true, width:  "90px", templateGetter: "getDescriptionInputTemplate",   templateGetterOwner: this, tooltip: ReLodgingTooltip },
			{ id: "ReMeal",      label: "{i18n>LABEL_19339}"/* 제공받는 일수    */, plabel: "{i18n>LABEL_19341}"/* 식사            */, resize: true, span: 0, type: "template", sort: true,  filter: true, width:  "90px", templateGetter: "getDescriptionInputTemplate",   templateGetterOwner: this },
			{ id: "ExptDailyTr", label: "{i18n>LABEL_19342}"/* 한도금액         */, plabel: "{i18n>LABEL_19343}"/* 일비            */, resize: true, span: 5, type: "currency", sort: true,  filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "ExptLodgeTr", label: "{i18n>LABEL_19342}"/* 한도금액         */, plabel: "{i18n>LABEL_19344}"/* 숙박비          */, resize: true, span: 0, type: "currency", sort: true,  filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "ExptAmtTr",   label: "{i18n>LABEL_19342}"/* 한도금액         */, plabel: "{i18n>LABEL_19349}"/* 합계            */, resize: true, span: 0, type: "currency", sort: true,  filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "ZtcWaers",    label: "{i18n>LABEL_19342}"/* 한도금액         */, plabel: "{i18n>LABEL_19345}"/* 거래통화        */, resize: true, span: 0, type: "string",   sort: true,  filter: true, width:  "80px" },
			{ id: "ExptAmtLc",   label: "{i18n>LABEL_19342}"/* 한도금액         */, plabel: "{i18n>LABEL_19346}"/* 국내통화금액    */, resize: true, span: 0, type: "currency", sort: true,  filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "BtDailyLc",   label: "{i18n>LABEL_19350}"/* 정산액(국내통화) */, plabel: "{i18n>LABEL_19343}"/* 일비            */, resize: true, span: 4, type: "currency", sort: true,  filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "BtLodgeLc",   label: "{i18n>LABEL_19350}"/* 정산액(국내통화) */, plabel: "{i18n>LABEL_19344}"/* 숙박비          */, resize: true, span: 0, type: "currency", sort: true,  filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "BtEtcLc",     label: "{i18n>LABEL_19350}"/* 정산액(국내통화) */, plabel: "{i18n>LABEL_19351}"/* 항공료/기타     */, resize: true, span: 0, type: "currency", sort: true,  filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "BtSettleAmt", label: "{i18n>LABEL_19350}"/* 정산액(국내통화) */, plabel: "{i18n>LABEL_19352}"/* 총액            */, resize: true, span: 0, type: "currency", sort: true,  filter: true, width: "100px", align: sap.ui.core.HorizontalAlign.Right }
		]);

		return oTable;
	},

	// 비용정산항목 Title & Buttons
	getTableIn05Buttons: function(oController) {

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			width: "100%",
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.Label({ text: "{i18n>LABEL_19521}" }).addStyleClass("sub-title") // 비용정산항목
					]
				})
				.addStyleClass("info-field-group"),
				new sap.m.HBox({
					visible: "{/Header/Edtfg}",
					items: [
						new sap.m.Button("SettlementTableIn05-add-card", {
							press: OnSettlement.pressAddExpense.bind(oController),
							icon: "sap-icon://add",
							enabled: "{/Header/Btact}",
							text: "{i18n>LABEL_00153}({i18n>LABEL_19573})", // 추가(법인카드)
							customData: new sap.ui.core.CustomData({ key: "CardPy", value: "5" })
						})
						.addStyleClass("button-light-sm"),
						new sap.m.Button("SettlementTableIn05-add-cash", {
							press: OnSettlement.pressAddExpense.bind(oController),
							icon: "sap-icon://add",
							enabled: "{/Header/Btact}",
							text: "{i18n>LABEL_00153}({i18n>LABEL_19574})", // 추가(현금/기타)
							customData: new sap.ui.core.CustomData({ key: "CardPy", value: "1" })
						})
						.addStyleClass("button-light-sm"),
						new sap.m.Button("SettlementTableIn05-remove", {
							press: OnSettlement.pressRemoveExpense.bind(oController),
							icon: "sap-icon://less",
							enabled: "{/Header/Btact}",
							text: "{i18n>LABEL_00103}" // 삭제
						})
						.addStyleClass("button-light-sm")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("info-box");
	},

	// 비용정산항목 Table
	getTableIn05: function(oController) {

		var oTable = new sap.ui.table.Table("SettlementTableIn05", {
			selectionMode: "{= ${/Header/Edtfg} ? '" + sap.ui.table.SelectionMode.MultiToggle + "' : '" + sap.ui.table.SelectionMode.None + "' }",
			enableSelectAll: "{/Header/Edtfg}",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			busyIndicatorDelay: 0,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			cellClick: OnSettlement.clickSettlementTableIn05Cell.bind(oController)
		})
		.addStyleClass("thead-cell-border tbody-cell-border mt-8px")
		.bindRows("/SettlementTableIn05");

		oTable.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("required-blind", !this.getEnableSelectAll());
			}
		}, oTable);

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "CardPyT",      label: "{i18n>LABEL_19523}"/* 결제방식     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" },
			{ id: "CategoryT",    label: "{i18n>LABEL_19524}"/* 비용구분     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "15%" },
			{ id: "SubcategoryT", label: "{i18n>LABEL_19525}"/* 하위구분     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "15%" },
			{ id: "AppDate",      label: "{i18n>LABEL_19526}"/* 거래일자     */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "10%", templateGetter: "getDateTextTemplate", templateGetterOwner: ViewTemplates },
			{ id: "BtExpenseTr",  label: "{i18n>LABEL_19527}"/* 거래금액     */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "ZtcWaers",     label: "{i18n>LABEL_19528}"/* 거래통화     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" },
			{ id: "PayAmtLc",     label: "{i18n>LABEL_19529}"/* 국내통화금액 */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "Sgtxt",        label: "{i18n>LABEL_19530}"/* 비고         */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "20%", align: sap.ui.core.HorizontalAlign.Left }
		]);

		return oTable;
	},

	// 경비현황 Title
	getTableIn03Title: function() {

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			width: "100%",
			items: [
				new sap.m.HBox({
					layoutData: new sap.m.FlexItemData({ minWidth: "80px" }),
					width: "10%",
					items: [
						new sap.m.Label({ text: "{i18n>LABEL_19541}" }).addStyleClass("sub-title") // 경비현황
					]
				})
				.addStyleClass("info-field-group"),
				new sap.m.HBox({
					items: [
						ViewTemplates.getFlexTableHeader("{i18n>LABEL_19549}"), // 가지급금
						ViewTemplates.getFlexTableCell("/Header/Advtot"),
						ViewTemplates.getFlexTableHeader("{i18n>LABEL_19550}"), // 총 지급액
						ViewTemplates.getFlexTableCell("/Header/Apamt"),
						ViewTemplates.getFlexTableHeader("{i18n>LABEL_19551}"), // 초과숙박비
						ViewTemplates.getFlexTableCell("/Header/Olamt"),
						ViewTemplates.getFlexTableHeader("{i18n>LABEL_19548}"), // 통화
						ViewTemplates.getFlexTableCell("{/Header/ZlcWaers}", true)
					]
				})
				.addStyleClass("mutant-flexbox-table mb--8px")
			]
		})
		.addStyleClass("info-box");
	},

	// 경비현황 Table
	getTableIn03: function(oController) {

		var oTable = new sap.ui.table.Table("SettlementTableIn03", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			busyIndicatorDelay: 0,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}"
		})
		.addStyleClass("thead-cell-border tbody-cell-border fix-header-height-38px mt-8px")
		.bindRows("/SettlementTableIn03");

		oTable.addEventDelegate({
			onAfterRendering: function() {
				Common.generateRowspan({ selector: this, colIndexes: [0, 1, 5] });
			}
		}, oTable);

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "CategoryT", label: "{i18n>LABEL_19542}"/* 비용구분 */, plabel: "{i18n>LABEL_19542}"/* 비용구분 */, resize: true, span: 0, type: "string",   sort: true, filter: true, width: "12%" },
			{ id: "Limitamt",  label: "{i18n>LABEL_19543}"/* 한도금액 */, plabel: "{i18n>LABEL_19543}"/* 한도금액 */, resize: true, span: 0, type: "currency", sort: true, filter: true, width: "19%", headerAlign: sap.ui.core.HorizontalAlign.Right },
			{ id: "Cardamt",   label: "{i18n>LABEL_19544}"/* 거래금액 */, plabel: "{i18n>LABEL_19545}"/* 카드     */, resize: true, span: 3, type: "currency", sort: true, filter: true, width: "19%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "Cashamt",   label: "{i18n>LABEL_19544}"/* 거래금액 */, plabel: "{i18n>LABEL_19546}"/* 현금     */, resize: true, span: 0, type: "currency", sort: true, filter: true, width: "19%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "Totamt",    label: "{i18n>LABEL_19544}"/* 거래금액 */, plabel: "{i18n>LABEL_19547}"/* 합계     */, resize: true, span: 0, type: "currency", sort: true, filter: true, width: "19%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "Waers",     label: "{i18n>LABEL_19548}"/* 통화     */, plabel: "{i18n>LABEL_19548}"/* 통화     */, resize: true, span: 0, type: "string",   sort: true, filter: true, width: "12%" }
		]);

		return oTable;
	},

	// TableIn04 출장지 - 도시
	getCityInputTemplate: function(columnInfo, oController) {

		var oInput = new sap.m.Input("Settlement" + columnInfo.id, {
			valueHelpRequest: OnSettlement.searchCity.bind(oController),
			value: "{" + columnInfo.id + "}",
			valueHelpOnly: true,
			showValueHelp: true,
			placeholder: "{BtCity}",
			editable: "{/Header/Edtfg}",
			width: "100%"
		});

		oInput.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("plain-text-mimic", !this.getEditable());
			}
		}, oInput);

		return oInput;
	},

	// TableIn04 출장 기간 - 시작일 ~ 종료일
	getDateRangeSelectionTemplate: function(columnInfo, oController) {

		var oDRS = new sap.m.DateRangeSelection("Settlement" + columnInfo.id, {
			displayFormat: oController.getSessionInfoByKey("Dtfmt"),
			change: OnSettlement.changeScheduleDate.bind(oController),
			editable: "{/Header/Edtfg}",
			secondDateValue: "{BtEnddat}",
			dateValue: "{BtStartdat}",
			maxDate: new Date(),
			delimiter: "~",
			width: "100%"
		});

		oDRS.addEventDelegate({
			onAfterRendering: function() {
				var editable = this.getEditable();
				this.toggleStyleClass("plain-text-mimic", !editable)
					.$().find("input").prop("readonly", true).toggleClass("text-center", !editable).off("click").on("click", function() {
						this.toggleOpen(this.isOpen());
					}.bind(this));
			}
		}, oDRS);

		return oDRS;
	},

	// TableIn04 출장 기간 - 전일 출발
	getCheckboxTemplate: function(columnInfo, oController) {

		var oCheckBox = new sap.m.CheckBox({
			select: OnSettlement.selectEarlierDeparture.bind(oController),
			useEntireWidth: true,
			editable: "{/Header/Edtfg}",
			selected: "{" + columnInfo.id + "}"
		});

		oCheckBox.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("plain-text-mimic", !this.getEditable());
			}
		}, oCheckBox);

		return oCheckBox;
	},

	// TableIn04 제공받는 일수 - 숙박, 식사
	getDescriptionInputTemplate: function(columnInfo, oController) {

		var oInput = new sap.m.Input({
			change: OnSettlement.changeLodgingAndMeal.bind(oController),
			value: {
				path: columnInfo.id,
				type: new CommaInteger({
					maxNumberLength: 3,
					defaultValue: ""
				})
			},
			maxLength: 3, // maxNumberLength + (comma 가능 개수)
			textAlign: sap.ui.core.TextAlign.Right,
			description: "{i18n>LABEL_00145}", // 일
			editable: "{/Header/Edtfg}",
			fieldWidth: "40px"
		});

		oInput.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("plain-text-mimic", !this.getEditable());
			}
		}, oInput);

		return oInput;
	}

});

});