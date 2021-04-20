/* global moment:true */
sap.ui.define([
	"common/CommaInteger",
	"common/Common",
	"common/Formatter",
	"common/moment-with-locales",
	"common/PickOnlyDatePicker",
	"common/PickOnlyDateRangeSelection",
	"common/ZHR_TABLES",
	"../delegate/ViewTemplates"
], function(
	CommaInteger,
	Common,
	Formatter,
	momentjs,
	PickOnlyDatePicker,
	PickOnlyDateRangeSelection,
	ZHR_TABLES,
	ViewTemplates
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTripMap.fragment.ExpenseDetailDialog", {

	createContent: function(oController) {

		var ExpenseDetailDialogHandler = oController.ExpenseDetailDialogHandler,
		oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19571"), // 비용 정산 항목
			contentWidth: "1200px",
			contentHeight: "180px",
			content: this.getContent(oController),
			draggable: true,
			verticalScrolling: false,
			beginButton: new sap.m.Button({
				visible: "{/Header/Edtfg}",
				text: oController.getBundleText("LABEL_00101"), // 저장
				press: ExpenseDetailDialogHandler.setExpenseData.bind(ExpenseDetailDialogHandler)
			}).addStyleClass("button-light"),
			endButton: new sap.m.Button({
				text: oController.getBundleText("LABEL_00133"), // 닫기
				press: function() {
					oDialog.close();
					ExpenseDetailDialogHandler.changeToCloseState.call(ExpenseDetailDialogHandler);
				}
			})
			.addStyleClass("button-default custom-button-divide")
		})
		.setModel(ExpenseDetailDialogHandler.getModel())
		.addStyleClass("custom-dialog-popup");

		return oDialog;
	},

	getContent: function(oController) {

		return [
			this.getCommonDataHBox(oController),
			this.getForm01(oController), // 숙박비
			this.getForm02(oController), // 교통비
			this.getForm03(oController), // 교통비 - 승용차
			this.getForm04(oController), // 항공료
			this.getExpenseAndTaxTable(oController) // 결제금액 및 세금 Table
		];
	},

	getCommonDataHBox: function(oController) {

		var Dtfmt = oController.getSessionInfoByKey("Dtfmt"),
		ExpenseDetailDialogHandler = oController.ExpenseDetailDialogHandler;

		return new sap.m.HBox({
			items: [
				new sap.m.VBox({
					layoutData: new sap.m.FlexItemData({ minWidth: "500px" }),
					width: "50%",
					items: [
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19603}", false, "110px"), // 출장일정
								new sap.m.Select("ExpenseDetailBtCity", {
									layoutData: new sap.m.FlexItemData({ minWidth: "300px" }),
									change: ExpenseDetailDialogHandler.changeBtCity.bind(ExpenseDetailDialogHandler),
									width: "300px",
									editable: "{= ${/ExpenseDetail/Edtfg} && ${/ExpenseDetail/RowIndex} === -1 }",
									selectedKey: "{/ExpenseDetail/BtCityKey}",
									items: {
										path: "/SettlementTableIn04",
										templateShareable: false,
										template: new sap.ui.core.ListItem({
											key: "{BtCityKey}", text: "{BtCityKeyText}"
										})
									}
								})
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19601}", false, "110px"), // 비용구분 BtCodeSet ICodeT:005
								new sap.m.Select("ExpenseDetailCategory", {
									layoutData: new sap.m.FlexItemData({ minWidth: "300px" }),
									change: ExpenseDetailDialogHandler.changeCategory.bind(ExpenseDetailDialogHandler),
									width: "300px",
									editable: "{= ${/ExpenseDetail/Edtfg} && ${/ExpenseDetail/RowIndex} === -1 }",
									selectedKey: "{/ExpenseDetail/Category}",
									items: {
										path: "/CategorySelectList",
										templateShareable: false,
										template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
									}
								})
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19604}", false, "110px"), // 거래일자
								new PickOnlyDatePicker("ExpenseDetailAppDate", {
									layoutData: new sap.m.FlexItemData({ minWidth: "300px" }),
									change: ExpenseDetailDialogHandler.changeAppDate.bind(ExpenseDetailDialogHandler),
									width: "300px",
									displayFormat: Dtfmt,
									placeholder: Dtfmt,
									editable: "{= ${/ExpenseDetail/Edtfg} && ${/ExpenseDetail/CardPy} === '1' }",
									dateValue: "{/ExpenseDetail/AppDate}"
								})
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.HBox({
							visible: "{= ${/ExpenseDetail/CardPy} === '5' }",
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19587}", false, "110px"), // 승인번호
								new sap.m.Text({
									text: "{/ExpenseDetail/ApprNo}"
								})
							]
						})
						.addStyleClass("search-field-group")
					]
				})
				.addStyleClass("search-inner-vbox"),
				new sap.m.VBox({
					layoutData: new sap.m.FlexItemData({ minWidth: "500px" }),
					width: "50%",
					items: [
						new sap.m.HBox({
							items: [
								new sap.m.Label({
									text: "{i18n>LABEL_19583}", // 국내외 구분
									width: "110px",
									design: sap.m.LabelDesign.Bold,
									textAlign: sap.ui.core.TextAlign.Right,
									layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }),
									visible: "{= ${/VisibleFactor/Category} === '5' && ${/VisibleFactor/Subcategory} === '01' }"
								}),
								new sap.m.RadioButtonGroup("ExpenseDetailClDmtr", {
									visible: "{= ${/VisibleFactor/Category} === '5' && ${/VisibleFactor/Subcategory} === '01' }",
									selectedIndex: "{= ${/ExpenseDetail/ClDmtr} === '1' ? 0 : (${/ExpenseDetail/ClDmtr} === '2' ? 1 : -1) }",
									editable: false,
									columns: 2,
									buttons: [
										new sap.m.RadioButton({
											text: "{i18n>LABEL_19584}", // 국내
											customData: new sap.ui.core.CustomData({ key: "selectedClDmtr", value: "1" })
										}),
										new sap.m.RadioButton({
											text: "{i18n>LABEL_19585}", // 해외
											customData: new sap.ui.core.CustomData({ key: "selectedClDmtr", value: "2" })
										})
									]
								})
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19602}", false, "110px"), // 하위구분 BtCodeSet ICodeT:006, ISubCode:/ExpenseDetail/Category
								new sap.m.Select("ExpenseDetailSubcategory", {
									layoutData: new sap.m.FlexItemData({ minWidth: "300px" }),
									change: ExpenseDetailDialogHandler.changeSubcategory.bind(ExpenseDetailDialogHandler),
									width: "300px",
									editable: "{= ${/ExpenseDetail/Edtfg} && ${/ExpenseDetail/RowIndex} === -1 }",
									selectedKey: "{/ExpenseDetail/Subcategory}",
									items: {
										path: "/SubcategorySelectList",
										templateShareable: false,
										template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
									}
								})
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19605}", false, "110px"), // 거래금액
								new sap.m.Text({
									text: {
										path: "/ExpenseDetail/PayAmtTr",
										formatter: Common.toCurrency
									},
									textAlign: sap.ui.core.TextAlign.Right
								}),
								new sap.m.Text({
									text: "{/ExpenseDetail/ZtcWaers}"
								})
								.addStyleClass("ml-10px")
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.HBox({
							visible: "{= ${/ExpenseDetail/CardPy} === '5' }"
						}).addStyleClass("search-field-group") // dummy
					]
				})
				.addStyleClass("search-inner-vbox")
			]
		})
		.addStyleClass("search-box p-0 mnw-1000px");
	},

	// 숙박비 Form01
	getForm01: function(oController) {

		var Dtfmt = oController.getSessionInfoByKey("Dtfmt");

		return new sap.m.HBox("Form01", {
			visible: "{= ${/VisibleFactor/Category} === '1' && ${/VisibleFactor/Subcategory} === '01' }",
			items: [
				new sap.m.VBox({
					layoutData: new sap.m.FlexItemData({ minWidth: "500px" }),
					width: "50%",
					items: [
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19621}", false, "110px"), // 숙박기간
								new PickOnlyDateRangeSelection("LodgePeriod", {
									layoutData: new sap.m.FlexItemData({ minWidth: "300px" }),
									displayFormat: Dtfmt,
									secondDateValue: "{/ExpenseDetail/LodgeEnddat}",
									dateValue: "{/ExpenseDetail/LodgeStartdat}",
									editable: "{/ExpenseDetail/Edtfg}",
									delimiter: "~",
									width: "300px"
								})
							]
						})
						.addStyleClass("search-field-group")
					]
				}),
				new sap.m.VBox({
					layoutData: new sap.m.FlexItemData({ minWidth: "500px" }),
					width: "50%",
					items: [
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19622}", false, "110px"), // 숙박비 한도액
								new sap.m.Text({
									text: {
										path: "/ExpenseDetail/Zzsucbacbil",
										formatter: Common.toCurrency
									},
									textAlign: sap.ui.core.TextAlign.Right
								}),
								new sap.m.Text({
									text: "{/ExpenseDetail/ZlcWaers}"
								})
								.addStyleClass("ml-10px")
							]
						})
						.addStyleClass("search-field-group")
					]
				})
			]
		})
		.addStyleClass("search-box p-0 mnw-1000px");
	},

	// 교통비 - 이동구간 및 시간 Form02
	getForm02: function(oController) {

		var ExpenseDetailDialogHandler = oController.ExpenseDetailDialogHandler,
		conditions = $.map("01,02,03,04,05,06,07,08,09,11,12".split(/,/), function(v) {
			return "${/VisibleFactor/Subcategory} === '" + v +"'";
		}).join(" || ");

		return new sap.m.HBox("Form02", {
			visible: "{= ${/VisibleFactor/Category} === '2' && (" + conditions + ") }",
			items: [
				new sap.m.VBox({
					layoutData: new sap.m.FlexItemData({ minWidth: "500px" }),
					width: "50%",
					items: [
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19623}", false, "110px"), // 이동구간
								new sap.m.Input("ExpenseDetailStartpl", {
									width: "136px",
									value: "{/ExpenseDetail/Startpl}",
									editable: "{/ExpenseDetail/Edtfg}",
									maxLength: common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtSettlementTableIn05", "Startpl"),
									showValueHelp: "{= ${/ExpenseDetail/Edtfg} && ${/ExpenseDetail/Category} === '2' && ${/ExpenseDetail/Subcategory} === '09' }",
									valueHelpRequest: ExpenseDetailDialogHandler.searchTripPlace.bind(ExpenseDetailDialogHandler),
									change: ExpenseDetailDialogHandler.changeTripPlace.bind(ExpenseDetailDialogHandler)
								}),
								new sap.m.Text({ text: "~" }).addStyleClass("mx-10px"),
								new sap.m.Input("ExpenseDetailDestpl", {
									width: "136px",
									value: "{/ExpenseDetail/Destpl}",
									editable: "{/ExpenseDetail/Edtfg}",
									maxLength: common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtSettlementTableIn05", "Destpl"),
									showValueHelp: "{= ${/ExpenseDetail/Edtfg} && ${/ExpenseDetail/Category} === '2' && ${/ExpenseDetail/Subcategory} === '09' }",
									valueHelpRequest: ExpenseDetailDialogHandler.searchTripPlace.bind(ExpenseDetailDialogHandler),
									change: ExpenseDetailDialogHandler.changeTripPlace.bind(ExpenseDetailDialogHandler)
								})
							]
						})
						.addStyleClass("search-field-group")
					]
				}),
				new sap.m.VBox({
					layoutData: new sap.m.FlexItemData({ minWidth: "500px" }),
					width: "50%",
					items: [
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19624}", false, "110px"), // 이동시간
								new sap.m.Select("ExpenseDetailStartTmHour", {
									change: ExpenseDetailDialogHandler.changeTripTime.bind(ExpenseDetailDialogHandler),
									editable: "{/ExpenseDetail/Edtfg}",
									selectedKey: "{/ExpenseDetail/StartTmHour}",
									items: {
										path: "/HourSelectList",
										templateShareable: true,
										template: new sap.ui.core.ListItem({ key: "{value}", text: "{text}" })
									},
									width: "65px"
								})
								.addStyleClass("custom-select-time"),
								new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
								new sap.m.Select("ExpenseDetailStartTmMinute", {
									change: ExpenseDetailDialogHandler.changeTripTime.bind(ExpenseDetailDialogHandler),
									editable: "{/ExpenseDetail/Edtfg}",
									selectedKey: "{/ExpenseDetail/StartTmMinute}",
									items: {
										path: "/MinuteSelectList",
										templateShareable: true,
										template: new sap.ui.core.ListItem({ key: "{value}", text: "{text}" })
									},
									width: "65px"
								})
								.addStyleClass("custom-select-time"),
								new sap.m.Text({ text: "~" }).addStyleClass("mx-7px"),
								new sap.m.Select("ExpenseDetailDestTmHour", {
									change: ExpenseDetailDialogHandler.changeTripTime.bind(ExpenseDetailDialogHandler),
									editable: "{/ExpenseDetail/Edtfg}",
									selectedKey: "{/ExpenseDetail/DestTmHour}",
									items: {
										path: "/HourSelectList",
										templateShareable: true,
										template: new sap.ui.core.ListItem({ key: "{value}", text: "{text}" })
									},
									width: "65px"
								})
								.addStyleClass("custom-select-time"),
								new sap.m.Text({ text: ":" }).addStyleClass("mx-2px"),
								new sap.m.Select("ExpenseDetailDestTmMinute", {
									change: ExpenseDetailDialogHandler.changeTripTime.bind(ExpenseDetailDialogHandler),
									editable: "{/ExpenseDetail/Edtfg}",
									selectedKey: "{/ExpenseDetail/DestTmMinute}",
									items: {
										path: "/MinuteSelectList",
										templateShareable: true,
										template: new sap.ui.core.ListItem({ key: "{value}", text: "{text}" })
									},
									width: "65px"
								})
								.addStyleClass("custom-select-time")
							]
						})
						.addStyleClass("search-field-group")
					]
				})
			]
		})
		.addStyleClass("search-box my-0 p-0 mnw-1000px");
	},

	// 교통비 - 승용차 비용 Form03
	getForm03: function(oController) {

		var ExpenseDetailDialogHandler = oController.ExpenseDetailDialogHandler;

		return new sap.m.HBox("Form03", {
			visible: "{= ${/VisibleFactor/Category} === '2' && ${/VisibleFactor/Subcategory} === '09' }",
			items: [
				new sap.m.VBox({
					layoutData: new sap.m.FlexItemData({ minWidth: "500px" }),
					width: "50%",
					items: [
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19625}", false, "110px"), // 이동거리
								new sap.m.Button({
									press: ExpenseDetailDialogHandler.pressGIS.bind(ExpenseDetailDialogHandler),
									visible: "{/ExpenseDetail/UseGis}",
									icon: "sap-icon://map",
									width: "65px",
									text: "GIS"
								})
								.addStyleClass("mr-10px"),
								new sap.m.Input("ExpenseDetailZzkm", {
									change: ExpenseDetailDialogHandler.calculateCarExpenses.bind(ExpenseDetailDialogHandler),
									editable: "{/ExpenseDetail/Edtfg}",
									visible: "{= !${/ExpenseDetail/UseGis} }",
									textAlign: sap.ui.core.TextAlign.Right,
									value: {
										path: "/ExpenseDetail/Zzkm",
										type: new CommaInteger({
											maxNumberLength: 4,
											defaultValue: ""
										})
									},
									maxLength: 5, // maxNumberLength + (comma 가능 개수)
									width: "300px",
									description: "km",
									fieldWidth: "136px"
								})
								.addStyleClass("custom-description-input measurement-unit"),
								new sap.m.Text({
									visible: "{/ExpenseDetail/UseGis}",
									text: {
										path: "/ExpenseDetail/Zzkm",
										formatter: Common.toCurrency
									},
									textAlign: sap.ui.core.TextAlign.Right
								}),
								new sap.m.Text({
									visible: "{/ExpenseDetail/UseGis}",
									text: "km"
								})
								.addStyleClass("ml-5px")
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19627}", false, "110px"), // 연료종류
								new sap.m.Select("ExpenseDetailZzgasname", {
									layoutData: new sap.m.FlexItemData({ minWidth: "300px" }),
									change: ExpenseDetailDialogHandler.calculateCarExpenses.bind(ExpenseDetailDialogHandler),
									editable: "{/ExpenseDetail/Edtfg}",
									width: "300px",
									selectedKey: "{/ExpenseDetail/Zzgasname}",
									items: {
										path: "/GasTypeSelectList",
										templateShareable: false,
										template: new sap.ui.core.ListItem({ key: "{Zzgasgb}", text: "{Zzgasname}" })
									}
								})
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19629}", false, "110px"), // 톨게이트요금
								new sap.m.Input({
									change: ExpenseDetailDialogHandler.calculateCarExpenses.bind(ExpenseDetailDialogHandler),
									editable: "{/ExpenseDetail/Edtfg}",
									value: {
										path: "/ExpenseDetail/TollTr",
										type: new CommaInteger({
											maxNumberLength: 7,
											defaultValue: ""
										})
									},
									maxLength: 9, // maxNumberLength + (comma 가능 개수)
									textAlign: sap.ui.core.TextAlign.Right,
									width: "300px"
								})
							]
						})
						.addStyleClass("search-field-group")
					]
				}),
				new sap.m.VBox({
					layoutData: new sap.m.FlexItemData({ minWidth: "500px" }),
					width: "50%",
					items: [
						new sap.m.HBox().addStyleClass("search-field-group"), // dummy
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19628}", false, "110px"), // 연료비
								new sap.m.Text({
									text: {
										path: "/ExpenseDetail/GasTr",
										formatter: Common.toCurrency
									},
									textAlign: sap.ui.core.TextAlign.Right
								})
							]
						})
						.addStyleClass("search-field-group"),
						new sap.m.HBox({
							items: [
								ViewTemplates.getHeaderLabel("{i18n>LABEL_19630}", false, "110px"), // 주차요금
								new sap.m.Input({
									change: ExpenseDetailDialogHandler.calculateCarExpenses.bind(ExpenseDetailDialogHandler),
									editable: "{/ExpenseDetail/Edtfg}",
									value: {
										path: "/ExpenseDetail/ParkingTr",
										type: new CommaInteger({
											maxNumberLength: 7,
											defaultValue: ""
										})
									},
									maxLength: 9, // maxNumberLength + (comma 가능 개수)
									textAlign: sap.ui.core.TextAlign.Right,
									width: "300px"
								})
							]
						})
						.addStyleClass("search-field-group")
					]
				})
			]
		})
		.addStyleClass("search-box my-0 p-0 mnw-1000px");
	},

	// 항공료 Form04
	getForm04: function(oController) {

		var oTable = new sap.ui.table.Table("Form04", {
			layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
			visible: "{= ${/VisibleFactor/Category} === '5' && ${/VisibleFactor/Subcategory} === '01' }",
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			busyIndicatorDelay: 0,
			visibleRowCount: 2,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}"
		})
		.addStyleClass("mt-30px")
		.bindRows("/Form04");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "DepartDest", label: "{i18n>LABEL_19641}"/* 비행일자 */, plabel: "", resize: true, span: 2, type: "string",   sort: false, filter: false, width: "60px" },
			{ id: "FlightDate", label: "{i18n>LABEL_19641}"/* 비행일자 */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "150px", templateGetterOwner: this, templateGetter: "getDatePickerTemplate" },
			{ id: "Airport",    label: "{i18n>LABEL_19644}"/* 공항     */, plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "450px", align: sap.ui.core.HorizontalAlign.Left, templateGetterOwner: this, templateGetter: "getAirportInputTemplate" },
			{ id: "CountryT",   label: "{i18n>LABEL_19645}"/* 국가     */, plabel: "", resize: true, span: 0, type: "string",   sort: false, filter: false, align: sap.ui.core.HorizontalAlign.Left },
			{ id: "CityT",      label: "{i18n>LABEL_19646}"/* 도시     */, plabel: "", resize: true, span: 0, type: "string",   sort: false, filter: false, align: sap.ui.core.HorizontalAlign.Left }
		]);

		return oTable;
	},

	// 결제금액 및 세금 Table
	getExpenseAndTaxTable: function(oController) {

		var oTable = new sap.ui.table.Table("ExpenseAndTaxTable", {
			layoutData: new sap.m.FlexItemData({ minWidth: "1000px" }),
			visible: "{= (!!${/VisibleFactor/Category} && ${/VisibleFactor/Category} !== '2') || (!!${/VisibleFactor/Subcategory} && ${/VisibleFactor/Subcategory} !== '09') }",
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
		.addStyleClass("mt-30px")
		.bindRows("/ExpenseAndTaxTable");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "ZscWaers",    label: "{i18n>LABEL_19611}"/* 거래통화     */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "12%", templateGetterOwner: this, templateGetter: "getCurrencyInputTemplate" },
			{ id: "BtExpenseTr", label: "{i18n>LABEL_19612}"/* 금액         */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "12%", templateGetterOwner: this, templateGetter: "getBtExpenseTrInputTemplate", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "Mwskz",       label: "{i18n>LABEL_19613}"/* 세금코드     */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "20%", align: sap.ui.core.HorizontalAlign.Left, templateGetterOwner: this, templateGetter: "getTaxSelectTemplate" },
			{ id: "BtTaxbaseTr", label: "{i18n>LABEL_19614}"/* 공급가액     */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "12%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "BtTaxTr",     label: "{i18n>LABEL_19615}"/* 세금         */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "12%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "Sgtxt",       label: "{i18n>LABEL_19616}"/* 비고         */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "20%", align: sap.ui.core.HorizontalAlign.Left, templateGetterOwner: this, templateGetter: "getTextInputTemplate" },
			{ id: "IndExpdTr",   label: "{i18n>LABEL_19617}"/* 개인부담금액 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "12%", templateGetterOwner: this, templateGetter: "getIndExpdTrInputTemplate", align: sap.ui.core.HorizontalAlign.Right }
		]);

		return oTable;
	},

	// Form04 비행일자
	getDatePickerTemplate: function(columnInfo, oController) {

		var Dtfmt = oController.getSessionInfoByKey("Dtfmt");
		return new PickOnlyDatePicker("ExpenseAndTaxTable" + columnInfo.id, {
			editable: "{/ExpenseDetail/Edtfg}",
			dateValue: "{" + columnInfo.id + "}",
			displayFormat: Dtfmt,
			placeholder: Dtfmt,
			width: "100%"
		});
	},

	// Form04 공항
	getAirportInputTemplate: function(columnInfo, oController) {

		var ExpenseDetailDialogHandler = oController.ExpenseDetailDialogHandler;

		return new sap.m.Input({
			valueHelpRequest: ExpenseDetailDialogHandler.searchAirport.bind(ExpenseDetailDialogHandler),
			layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
			customData: new sap.ui.core.CustomData({
				key: "target",
				value: {
					ZtcWaers: "/ExpenseDetail/ZtcWaers",
					ZscWaers: "/ExpenseDetail/ZscWaers",
					Kursf: "/ExpenseDetail/Kursf"
				}
			}),
			editable: "{/ExpenseDetail/Edtfg}",
			description: "{AirportT}",
			value: "{" + columnInfo.id + "}",
			valueHelpOnly: true,
			showValueHelp: true,
			fieldWidth: "100px"
		})
		.addStyleClass("field-min-width-100px");
	},

	// ExpenseAndTaxTable 현지통화
	getCurrencyInputTemplate: function(columnInfo, oController) {

		var ExpenseDetailDialogHandler = oController.ExpenseDetailDialogHandler;

		return new sap.m.Input({
			valueHelpRequest: ExpenseDetailDialogHandler.searchCurrency.bind(ExpenseDetailDialogHandler),
			customData: new sap.ui.core.CustomData({
				key: "target",
				value: {
					ZtcWaers: "/ExpenseDetail/ZtcWaers",
					ZscWaers: "/ExpenseDetail/ZscWaers",
					Kursf: "/ExpenseDetail/Kursf"
				}
			}),
			editable: "{/ExpenseDetail/Edtfg}",
			value: "{" + columnInfo.id + "}",
			valueHelpOnly: true,
			showValueHelp: true
		});
	},

	// ExpenseAndTaxTable 결제금액
	getBtExpenseTrInputTemplate: function(columnInfo, oController) {

		var ExpenseDetailDialogHandler = oController.ExpenseDetailDialogHandler;

		var oInput = new sap.m.Input({
			change: ExpenseDetailDialogHandler.changeBtExpenseTr.bind(ExpenseDetailDialogHandler),
			value: {
				path: columnInfo.id,
				type: new CommaInteger({
					maxNumberLength: 7,
					defaultValue: ""
				})
			},
			maxLength: 9, // maxNumberLength + (comma 가능 개수)
			textAlign: sap.ui.core.TextAlign.Right,
			editable: "{= ${/ExpenseDetail/Edtfg} && ${/ExpenseDetail/CardPy} === '1' }",
			width: "100%"
		});

		oInput.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("plain-text-mimic", !this.getEditable());
			}
		}, oInput);

		return oInput;
	},

	// ExpenseAndTaxTable 개인부담금액
	getIndExpdTrInputTemplate: function(columnInfo, oController) {

		var ExpenseDetailDialogHandler = oController.ExpenseDetailDialogHandler,
		oInput = new sap.m.Input({
			change: ExpenseDetailDialogHandler.changeIndExpdTr.bind(ExpenseDetailDialogHandler),
			value: {
				path: columnInfo.id,
				type: new CommaInteger({
					maxNumberLength: 7,
					defaultValue: ""
				})
			},
			maxLength: 9, // maxNumberLength + (comma 가능 개수)
			textAlign: sap.ui.core.TextAlign.Right,
			editable: "{= ${/ExpenseDetail/Edtfg} && ${/ExpenseDetail/CardPy} === '5' }",
			width: "100%"
		});

		oInput.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("plain-text-mimic", !this.getEditable());
			}
		}, oInput);

		return oInput;
	},

	// ExpenseAndTaxTable 세금코드
	getTaxSelectTemplate: function(columnInfo, oController) {

		var ExpenseDetailDialogHandler = oController.ExpenseDetailDialogHandler;

		return new sap.m.Select({
			change: ExpenseDetailDialogHandler.calculateTax.bind(ExpenseDetailDialogHandler),
			editable: "{/ExpenseDetail/Edtfg}",
			width: "100%",
			selectedKey: "{" + columnInfo.id + "}",
			items: {
				path: "/TaxSelectList",
				templateShareable: false,
				template: new sap.ui.core.ListItem({ key: "{Mwskz}", text: "{Mwskz} ({Text1})" })
			}
		});
	},
	
	// ExpenseAndTaxTable 비고
	getTextInputTemplate: function(columnInfo) {
		
		return new sap.m.Input({
			maxLength: common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtSettlementTableIn05", columnInfo.id),
			editable: "{/ExpenseDetail/Edtfg}",
			value: "{" + columnInfo.id + "}",
			width: "100%"
		});
	}

});

});