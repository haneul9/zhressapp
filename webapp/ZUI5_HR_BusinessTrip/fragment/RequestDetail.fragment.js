/* global moment:true */
sap.ui.define([
	"../../common/CommaInteger",
	"../../common/Common",
	"../../common/Formatter",
	"../../common/HoverIcon",
	"../../common/moment-with-locales",
	"../../common/PickOnlyDatePicker",
	"../../common/ZHR_TABLES",
	"../delegate/OnRequest",
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
	OnRequest,
	ViewTemplates,
	InputBase
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.RequestDetail", {

	createContent: function(oController) {

		var oModel = oController.RequestDetailDialogHandler.getModel();
		return [
			this.getHeaderPanel(oController).setModel(oModel),
			this.getSchedulePanel(oController).setModel(oModel),
//			this.getAddedPanel(oController).setModel(oModel)
		];
	},

	getAddedPanel : function(oController){
		var Dtfmt = oController.getSessionInfoByKey("Dtfmt"),c=sap.ui.commons,
		oRow,oCell,oMat=new sap.ui.commons.layout.MatrixLayout(oController.PAGEID+"_Mat",{
			width:"100%",
			columns:10
		});
		oRow=new c.layout.MatrixLayoutRow();
		oCell=new c.layout.MatrixLayoutCell({
			hAlign:"Right",
			colSpan:10,
			content:[
			new sap.ui.core.HTML({
				preferDOM:false,
				content:"<span style='font-weight:bold;font-size:13px;color:blue;line-height:33px;'>"+oController.getBundleText("LABEL_19813")+"&nbsp;</span>"
			}),				
			new sap.m.Button({
				enabled: "{/Header/Btact}",
				text: "{i18n>LABEL_19802}",
				press : function(){oController.RequestDetailDialogHandler.onShow.bind(oController.RequestDetailDialogHandler);} // 대근자체크
			})
			.addStyleClass("button-light-sm"),new sap.m.Button({
				enabled: "{/Header/Btact}",
				text: "{i18n>LABEL_19811}",
				press : function(){oController.RequestDetailDialogHandler.onLimit.bind(oController);}  // 한도체크
			})
			.addStyleClass("button-light-sm")]
		}).addStyleClass("button-group");
		oRow.addCell(oCell);
		oMat.addRow(oRow);

		oRow=new c.layout.MatrixLayoutRow();
		for(var i=3;i<13;i++){
			i<10?i="0"+i:null;
			oCell=new c.layout.MatrixLayoutCell({
				hAlign:"Center",
				content:new sap.m.Label({
					text:oController.getBundleText("LABEL_198"+i)
				}).addStyleClass("sapUiTv")
			}).addStyleClass("headercell");
			oRow.addCell(oCell);
		}
		oMat.addRow(oRow);

		var oCol=new c.layout.MatrixLayout(oController.PAGEID+"_Col",{
			width:"100%",
			columns : 10,
		});
		var oScrCon=new sap.m.ScrollContainer({
			content : [oCol],
			width:"100%",
			vertical : true,
			height:"350px"
		});
		oRow=new c.layout.MatrixLayoutRow();
		var vCell=new c.layout.MatrixLayoutCell(oController.PAGEID+"_Cell",{
			colSpan:10,
			content:oScrCon
		});
		oRow.addCell(vCell);
		oMat.addRow(oRow);

		return new sap.m.Panel({
			expanded: true,
			expandable: true,
			headerText: "{i18n>LABEL_19801}", // 대근자
			content: new sap.m.VBox({
				width: "100%",
				items: [
					oMat
				]
			})
			.addStyleClass("panel-inner-box")
		})
		.addStyleClass("custom-panel mt-15px mnw-1188px");
	},

	getHeaderPanel: function(oController) {

		var Dtfmt = oController.getSessionInfoByKey("Dtfmt"),
		oPanel = new sap.m.Panel({
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
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19302}", false), // 신청일
									new sap.m.Text({
										layoutData: new sap.m.FlexItemData({ minWidth: "150px" }),
										text: {
											path: "/Header/DtRqst",
											formatter: function(pV) {
												return moment(pV).format(Dtfmt.toUpperCase());
											}
										}
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19304}", false), // 신청번호
									new sap.m.Text({
										layoutData: new sap.m.FlexItemData({ minWidth: "150px" }),
										text: "{/Header/Zzdocno}"
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19306}", false), // 출장자
									ViewTemplates.getCustomInput("HeaderEname", {
										layoutData: new sap.m.FlexItemData({ minWidth: "342px" }),
										fieldWidth: "250px",
										editable: "{= ${/Header/Edtfg} && ${/Header/isEnameDialogAvailable} }",
										description: "{/Header/Pernr}",
										showValueHelp: "{/Header/isEnameDialogAvailable}",
										value: "{/Header/Ename}",
										valueHelpOnly: true,
										valueHelpRequest: OnRequest.searchEname.bind(oController)
									}, OnRequest.clearEname.bind(oController))
									.addStyleClass("field-min-width-50"),
									new HoverIcon({
										visible: "{= ${/Header/Edtfg} && ${/Header/isEnameDialogAvailable} }",
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
									new sap.m.Select("HeaderBtPurpose1", {
										layoutData: new sap.m.FlexItemData({ minWidth: "250px" }),
										change: OnRequest.changeBtPurpose.bind(oController),
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
												oController.getBundleText("MSG_19003", " "), // 2) 근거리 출장 : 사업장-목적지 간 거리가 편도 40km 이상 ~ 100km 미만인 경우 {0}
												oController.getBundleText("MSG_19004")  // 3) 인재개발원 교육출장 : 롯데인재개발원에서 진행되는 교육을 이수하기 위한 출장의 경우
											]);
										},
										leave: function (oEvent) {
											Common.onPressTableHeaderInformation.call(oController, oEvent);
										}
									})
									.addStyleClass(InputBase.ICON_CSS_CLASS + " color-icon-blue")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								// visible: "{= ${/Header/Bukrs} === '1000' }", // 기초 1000, 첨단 A100
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19310}", "{/Header/Edtfg}"), // 근태유형
									new sap.m.Select("HeaderSubty", {
										layoutData: new sap.m.FlexItemData({ minWidth: "250px" }),
										change: OnRequest.changeSubty.bind(oController),
										width: "250px",
										editable: "{/Header/Edtfg}",
										selectedKey: "{/Header/Subty}",
										items: {
											path: "/SubtySelectList",
											templateShareable: false,
											template: new sap.ui.core.ListItem({ key: "{Subty}", text: "{Subtx1}" })
										}
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19312}", "{/Header/Edtfg}"), // 출장명
									new sap.m.Input("HeaderTitle", {
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
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19314}", "{/Header/Edtfg}"), // 출장목적
									new sap.m.TextArea("HeaderBtPurpose2", {
										maxLength: Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtRequestTableIn02", "BtPurpose2", false),
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "250px" }),
										width: "95%",
										editable: "{/Header/Edtfg}",
										value: "{/Header/BtPurpose2}",
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
										layoutData: new sap.m.FlexItemData({ minWidth: "250px" }),
										width: "250px",
										editable: "{/Header/Edtfg}",
										displayFormat: Dtfmt,
										valueFormat: Dtfmt,
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
									ViewTemplates.getCustomInput("HeaderCdIndpt", {
										layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "350px" }),
										fieldWidth: "250px",
										editable: "{/Header/Edtfg}",
										showValueHelp: "{/Header/Edtfg}",
										description: "{/Header/CdIndpt}",
										value: "{/Header/CdIndptText}",
										valueHelpOnly: true,
										valueHelpRequest: OnRequest.searchMainCostCenter.bind(oController)
									}, OnRequest.clearMainCostCenter.bind(oController))
									.addStyleClass("field-min-width-50")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19307}", "{/Header/Edtfg}"), // 비용귀속부서
									ViewTemplates.getCustomInput("HeaderZsendKostl", {
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
										valueHelpRequest: OnRequest.searchSubCostCenter.bind(oController)
									}, OnRequest.clearSubCostCenter.bind(oController))
									.addStyleClass("field-min-width-50")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19309}", false), // WBS
									ViewTemplates.getCustomInput("HeaderPsPosid", {
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
										valueHelpRequest: OnRequest.searchWBS.bind(oController)
									}, OnRequest.clearWBS.bind(oController))
									.addStyleClass("field-min-width-50")
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								visible: "{= ${/Header/SubtyUseyn} === 'Y' }",
								items: [
									ViewTemplates.getHeaderLabel("{i18n>LABEL_19311}", false), // 출입카드 신청
									new sap.m.Select("HeaderEncard", {
										layoutData: new sap.m.FlexItemData({ minWidth: "250px" }),
										width: "250px",
										editable: "{/Header/Edtfg}",
										selectedKey: "{/Header/Encard}",
										items: {
											path: "/EncardSelectList",
											templateShareable: false,
											template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
										}
									})
								]
							})
							.addStyleClass("search-field-group"),
							new sap.m.HBox({
								items: [
									new sap.m.Label({
										text: "{i18n>LABEL_19313}", // 총 정산액
										width: "130px",
										design: sap.m.LabelDesign.Bold,
										textAlign: sap.ui.core.TextAlign.Right,
										layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch })
									}),
									new sap.m.Text({
										text: {
											path: "/Header/BtAdvanceLc",
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
			onAfterRendering: function () {
				this.$().find(".sapMPanelWrappingDiv .sapUiIcon").attr("data-sap-ui-icon-content", this.getExpanded() ? "" : ""); // navigation-up-arrow : navigation-down-arrow
			}
		}, oPanel);

		return oPanel;
	},

	getSchedulePanel: function(oController) {

		return new sap.m.Panel({
			expanded: true,
			expandable: false,
			headerText: "{i18n>LABEL_19330}", // 출장 일정
			content: new sap.m.VBox({
				width: "100%",
				items: [
					this.getTableIn03Buttons(oController), // 출장 일정 Buttons
					this.getTableIn03(oController),        // 출장 일정 Title
					this.getTableIn02Title(),              // 출장비 합계 Title
					this.getTableIn02(oController),        // 출장비 합계 Table
					this.getTableIn04Buttons(oController), // 동반출장자 Title & Buttons
					this.getTableIn04(oController)         // 동반출장자 Table
				]
			})
			.addStyleClass("panel-inner-box")
		})
		.addStyleClass("custom-panel mt-15px mnw-1188px");
	},

	// 출장 일정 Buttons
	getTableIn03Buttons: function(oController) {

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.End,
			visible: "{/Header/Edtfg}",
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.Button("TableIn03-add", {
							press: OnRequest.pressAddSchedule.bind(oController),
							icon: "sap-icon://add",
							enabled: "{/Header/Btact}",
							text: "{i18n>LABEL_00153}" // 추가
						})
						.addStyleClass("button-light-sm"),
						new sap.m.Button("TableIn03-remove", {
							press: OnRequest.pressRemoveSchedule.bind(oController),
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
	getTableIn03: function(oController) {

		var oTable = new sap.ui.table.Table("TableIn03", {
			layoutData: new sap.m.FlexItemData({ maxWidth: "100%" }),
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
			noData: "{i18n>LABEL_00901}"
		})
		.addStyleClass("thead-cell-border tbody-cell-border fix-header-height-38px mt-8px")
		.bindRows("/TableIn03");

		oTable.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("required-blind", !this.getEnableSelectAll()).$().find("td[data-sap-ui-colid=\"TableIn03BtPeriod\"] input").prop("readonly", true);
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

		if (screen.availWidth <= 1280) {
			oTable.setFixedColumnCount(3);

			ZHR_TABLES.makeColumn(oController, oTable, [
				{ id: "ClDmtrT",     label: "{i18n>LABEL_19332}"/* 출장지        */, plabel: "{i18n>LABEL_19333}"/* 국내외 구분     */, resize: true, span: 3, type: "string",   sort: true,  filter: true, width: "105px" },
				{ id: "BtCrtT",      label: "{i18n>LABEL_19332}"/* 출장지        */, plabel: "{i18n>LABEL_19334}"/* 국가            */, resize: true, span: 0, type: "string",   sort: true,  filter: true, width: "135px" },
				{ id: "BtCityT",     label: "{i18n>LABEL_19332}"/* 출장지        */, plabel: "{i18n>LABEL_19335}"/* 도시            */, resize: true, span: 0, type: "template", sort: true,  filter: true, width: "195px", templateGetter: "getCityInputTemplate",          templateGetterOwner: this, required: true },
				{ id: "BtPeriod",    label: "{i18n>LABEL_19336}"/* 출장 기간     */, plabel: "{i18n>LABEL_19337}"/* 시작일 ~ 종료일 */, resize: true, span: 2, type: "template", sort: true,  filter: true, width: "285px", templateGetter: "getDateRangeSelectionTemplate", templateGetterOwner: this, required: true },
				{ id: "Prestart",    label: "{i18n>LABEL_19336}"/* 출장 기간     */, plabel: "{i18n>LABEL_19338}"/* 전일 출발       */, resize: true, span: 0, type: "template", sort: false, filter: true, width:  "90px", templateGetter: "getCheckboxTemplate",           templateGetterOwner: this, ptooltip: PrestartPTooltip },
				{ id: "ReLodging",   label: "{i18n>LABEL_19339}"/* 제공받는 일수 */, plabel: "{i18n>LABEL_19340}"/* 숙박            */, resize: true, span: 2, type: "template", sort: true,  filter: true, width: "105px", templateGetter: "getDescriptionInputTemplate",   templateGetterOwner: this, tooltip: ReLodgingTooltip },
				{ id: "ReMeal",      label: "{i18n>LABEL_19339}"/* 제공받는 일수 */, plabel: "{i18n>LABEL_19341}"/* 식사            */, resize: true, span: 0, type: "template", sort: true,  filter: true, width: "105px", templateGetter: "getDescriptionInputTemplate",   templateGetterOwner: this },
				{ id: "ExptDailyTr", label: "{i18n>LABEL_19342}"/* 한도금액      */, plabel: "{i18n>LABEL_19343}"/* 일비            */, resize: true, span: 3, type: "currency", sort: true,  filter: true, width: "105px", align: sap.ui.core.HorizontalAlign.Right },
				{ id: "ExptLodgeTr", label: "{i18n>LABEL_19342}"/* 한도금액      */, plabel: "{i18n>LABEL_19344}"/* 숙박비          */, resize: true, span: 0, type: "currency", sort: true,  filter: true, width: "105px", align: sap.ui.core.HorizontalAlign.Right },
				{ id: "ZtcWaers",    label: "{i18n>LABEL_19342}"/* 한도금액      */, plabel: "{i18n>LABEL_19345}"/* 거래통화        */, resize: true, span: 0, type: "string",   sort: true,  filter: true, width:  "90px" },
				{ id: "ExptTotAmt",  label: "{i18n>LABEL_19346}"/* 국내통화금액  */, plabel: "{i18n>LABEL_19347}"/* 예상금액        */, resize: true, span: 2, type: "currency", sort: true,  filter: true, width: "105px", align: sap.ui.core.HorizontalAlign.Right },
				{ id: "ZlcWaers",    label: "{i18n>LABEL_19346}"/* 국내통화금액  */, plabel: "{i18n>LABEL_19348}"/* 통화            */, resize: true, span: 0, type: "string",   sort: true,  filter: true, width:  "75px" }
			]);
		} else {
			ZHR_TABLES.makeColumn(oController, oTable, [
				{ id: "ClDmtrT",     label: "{i18n>LABEL_19332}"/* 출장지        */, plabel: "{i18n>LABEL_19333}"/* 국내외 구분     */, resize: true, span: 3, type: "string",   sort: true,  filter: true, width:  "7%" },
				{ id: "BtCrtT",      label: "{i18n>LABEL_19332}"/* 출장지        */, plabel: "{i18n>LABEL_19334}"/* 국가            */, resize: true, span: 0, type: "string",   sort: true,  filter: true, width:  "9%" },
				{ id: "BtCityT",     label: "{i18n>LABEL_19332}"/* 출장지        */, plabel: "{i18n>LABEL_19335}"/* 도시            */, resize: true, span: 0, type: "template", sort: true,  filter: true, width: "13%", align: sap.ui.core.HorizontalAlign.Left, templateGetter: "getCityInputTemplate", templateGetterOwner: this, required: true },
				{ id: "BtPeriod",    label: "{i18n>LABEL_19336}"/* 출장 기간     */, plabel: "{i18n>LABEL_19337}"/* 시작일 ~ 종료일 */, resize: true, span: 2, type: "template", sort: true,  filter: true, width: "18%", templateGetter: "getDateRangeSelectionTemplate", templateGetterOwner: this, required: true },
				{ id: "Prestart",    label: "{i18n>LABEL_19336}"/* 출장 기간     */, plabel: "{i18n>LABEL_19338}"/* 전일 출발       */, resize: true, span: 0, type: "template", sort: false, filter: true, width:  "7%", templateGetter: "getCheckboxTemplate",           templateGetterOwner: this, ptooltip: PrestartPTooltip },
				{ id: "ReLodging",   label: "{i18n>LABEL_19339}"/* 제공받는 일수 */, plabel: "{i18n>LABEL_19340}"/* 숙박            */, resize: true, span: 2, type: "template", sort: true,  filter: true, width:  "7%", templateGetter: "getDescriptionInputTemplate",   templateGetterOwner: this, tooltip: ReLodgingTooltip },
				{ id: "ReMeal",      label: "{i18n>LABEL_19339}"/* 제공받는 일수 */, plabel: "{i18n>LABEL_19341}"/* 식사            */, resize: true, span: 0, type: "template", sort: true,  filter: true, width:  "7%", templateGetter: "getDescriptionInputTemplate",   templateGetterOwner: this },
				{ id: "ExptDailyTr", label: "{i18n>LABEL_19342}"/* 한도금액      */, plabel: "{i18n>LABEL_19343}"/* 일비            */, resize: true, span: 3, type: "currency", sort: true,  filter: true, width:  "7%", align: sap.ui.core.HorizontalAlign.Right },
				{ id: "ExptLodgeTr", label: "{i18n>LABEL_19342}"/* 한도금액      */, plabel: "{i18n>LABEL_19344}"/* 숙박비          */, resize: true, span: 0, type: "currency", sort: true,  filter: true, width:  "7%", align: sap.ui.core.HorizontalAlign.Right },
				{ id: "ZtcWaers",    label: "{i18n>LABEL_19342}"/* 한도금액      */, plabel: "{i18n>LABEL_19345}"/* 거래통화        */, resize: true, span: 0, type: "string",   sort: true,  filter: true, width:  "6%"},
				{ id: "ExptTotAmt",  label: "{i18n>LABEL_19346}"/* 국내통화금액  */, plabel: "{i18n>LABEL_19347}"/* 예상금액        */, resize: true, span: 2, type: "currency", sort: true,  filter: true, width:  "7%", align: sap.ui.core.HorizontalAlign.Right },
				{ id: "ZlcWaers",    label: "{i18n>LABEL_19346}"/* 국내통화금액  */, plabel: "{i18n>LABEL_19348}"/* 통화            */, resize: true, span: 0, type: "string",   sort: true,  filter: true, width:  "5%"}
			]);
		}
		
		return oTable;
	},

	// 출장비 합계 Title
	getTableIn02Title: function() {

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.End,
			items: [
				new sap.m.HBox({
					width: "100%",
					items: [
						new sap.m.Label({ text: "{i18n>LABEL_19361}" }).addStyleClass("sub-title") // 출장비 합계
					]
				})
				.addStyleClass("info-field-group")
			]
		})
		.addStyleClass("info-box");
	},

	// 출장비 합계 Table
	getTableIn02: function(oController) {

		var oTable = new sap.ui.table.Table("TableIn02", {
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
		.addStyleClass("thead-cell-border tbody-cell-border mt-8px")
		.bindRows("/TableIn02");

		// var AdvtotTooltip = [
		// 	oController.getBundleText("MSG_19009"), // 가지급금 한도 = 일비 금액
		// 	oController.getBundleText("MSG_19010")  // • 가지급금 신청이 한도 초과할 경우 상신시에 초과사유 입력
		// ],
		var AdvtotTooltip = oController.getBundleText("MSG_19009"), // 가지급금 한도 = 일비 금액
		DifamtTooltip = oController.getBundleText("MSG_19011");     // 차액 = 예상금액 - 가지급금 - 숙박비

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "ExptTotTotAmt", label: "{i18n>LABEL_19362}"/* 예상금액 */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "16.6666667%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "ExptTotDaily",  label: "{i18n>LABEL_19363}"/* 일비     */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "16.6666667%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "Advtot",        label: "{i18n>LABEL_19364}"/* 가지급금 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "16.6666667%", align: sap.ui.core.HorizontalAlign.Right, templateGetter: "getCurrencyAmountInputTemplate", templateGetterOwner: this, tooltip: AdvtotTooltip},
			{ id: "ExptTotLodge",  label: "{i18n>LABEL_19365}"/* 숙박비   */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "16.6666667%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "Difamt",        label: "{i18n>LABEL_19366}"/* 차액     */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "16.6666667%", align: sap.ui.core.HorizontalAlign.Right, tooltip: DifamtTooltip },
			{ id: "ZlcWaers",      label: "{i18n>LABEL_19367}"/* 통화     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "16.6666667%"}
		]);

		return oTable;
	},

	// 동반출장자 Title
	getTableIn04Buttons: function(oController) {

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			width: "100%",
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.Label({ text: "{i18n>LABEL_19381}" }).addStyleClass("sub-title") // 동반출장자
					]
				})
				.addStyleClass("info-field-group"),
				new sap.m.HBox({
					visible: "{/Header/Edtfg}",
					items: [
						new sap.m.Button("TableIn04-add", {
							press: OnRequest.pressAddAccompanier.bind(oController),
							icon: "sap-icon://add",
							enabled: "{/Header/Btact}",
							text: "{i18n>LABEL_00153}" // 추가
						})
						.addStyleClass("button-light-sm"),
						new sap.m.Button("TableIn04-remove", {
							press: OnRequest.pressRemoveAccompanier.bind(oController),
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

	// 동반출장자 Table
	getTableIn04: function(oController) {

		var oTable = new sap.ui.table.Table("TableIn04", {
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
			noData: "{i18n>LABEL_00901}"
		})
		.addStyleClass("thead-cell-border tbody-cell-border mt-8px")
		.bindRows("/TableIn04");

		oTable.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("required-blind", !this.getEnableSelectAll());
			}
		}, oTable);

		// var AdvtotTooltip = [
		// 	oController.getBundleText("MSG_19009"), // • 가지급금 한도 = 일비 금액
		// 	oController.getBundleText("MSG_19010")  // • 가지급금 신청이 한도 초과할 경우 상신시에 초과사유 입력
		// ],
		var AdvtotTooltip = oController.getBundleText("MSG_19009"), // 가지급금 한도 = 일비 금액
		DifamtTooltip = oController.getBundleText("MSG_19011");     // 차액 = 예상금액 - 가지급금 - 숙박비

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Ename",         label: "{i18n>LABEL_19382}"/* 출장자   */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "10%", templateGetter: "getPernrInputTemplate",   templateGetterOwner: this, required: true },
			{ id: "Kostl",         label: "{i18n>LABEL_19383}"/* 비용항목 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "10%", templateGetter: "getKostlInputTemplate",   templateGetterOwner: this, required: true },
			{ id: "PsPosid",       label: "{i18n>LABEL_19384}"/* WBS      */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "10%", templateGetter: "getPsPosidInputTemplate", templateGetterOwner: this },
			{ id: "ExptTotDaily",  label: "{i18n>LABEL_19385}"/* 일비     */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "ExptTotLodge",  label: "{i18n>LABEL_19386}"/* 숙박비   */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "ExptTotTotAmt", label: "{i18n>LABEL_19387}"/* 예상금액 */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.Right },
			{ id: "BtAdvanceLc",   label: "{i18n>LABEL_19388}"/* 가지급금 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.Right, templateGetter: "getCurrencyAmountInputTemplate", templateGetterOwner: this, tooltip: AdvtotTooltip },
			{ id: "Difamt",        label: "{i18n>LABEL_19389}"/* 차액     */, plabel: "", resize: true, span: 0, type: "currency", sort: true, filter: true, width: "10%", align: sap.ui.core.HorizontalAlign.Right, tooltip: DifamtTooltip },
			{ id: "ZlcWaers",      label: "{i18n>LABEL_19390}"/* 국내통화 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" },
			{ id: "Zzdocno",       label: "{i18n>LABEL_19391}"/* 신청번호 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" }
		]);

		return oTable;
	},

	// TableIn03 출장지 - 도시
	getCityInputTemplate: function(columnInfo, oController) {

		var oInput = new sap.m.Input(columnInfo.id, {
			valueHelpRequest: OnRequest.searchCity.bind(oController),
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

	// TableIn03 출장 기간 - 시작일 ~ 종료일
	getDateRangeSelectionTemplate: function(columnInfo, oController) {

		var oDRS = new sap.m.DateRangeSelection(columnInfo.id, {
			displayFormat: oController.getSessionInfoByKey("Dtfmt"),
			change: OnRequest.changeScheduleDate.bind(oController),
			editable: "{/Header/Edtfg}",
			secondDateValue: "{BtEnddat}",
			dateValue: "{BtStartdat}",
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

	// TableIn03 출장 기간 - 전일 출발
	getCheckboxTemplate: function(columnInfo, oController) {

		var oCheckBox = new sap.m.CheckBox({
			select: OnRequest.selectEarlierDeparture.bind(oController),
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

	// TableIn03 제공받는 일수 - 숙박, 식사
	getDescriptionInputTemplate: function(columnInfo, oController) {

		var oInput = new sap.m.Input({
			change: OnRequest.changeLodgingAndMeal.bind(oController),
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
	},

	// TableIn02/TableIn04 가지급금
	getCurrencyAmountInputTemplate: function(columnInfo, oController) {

		var oInput = new sap.m.Input({
			change: OnRequest.changeAdvancePaymentAmount.bind(oController),
			value: {
				path: columnInfo.id,
				type: new CommaInteger({
					maxNumberLength: 6,
					defaultValue: ""
				})
			},
			maxLength: 7, // maxNumberLength + (comma 가능 개수)
			textAlign: sap.ui.core.TextAlign.Right,
			editable: "{= ${/Header/BtPurpose1} !== '5' && ${/Header/EnableAdvtot} && ${/Header/Edtfg} }",
			width: "100%"
		});

		oInput.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("plain-text-mimic", !this.getEditable());
			}
		}, oInput);

		return oInput;
	},

	// TableIn04 출장자
	getPernrInputTemplate: function(columnInfo, oController) {

		var oInput = new sap.m.Input(columnInfo.id, {
			customData: new sap.ui.core.CustomData({
				key: "target",
				value: {
					pernr: "/TableIn04/${rowIndex}/Pernr",
					ename: "/TableIn04/${rowIndex}/Ename"
				}
			}),
			valueHelpRequest: OnRequest.searchAccompanier.bind(oController),
			editable: "{/Header/Edtfg}",
			value: "{" + columnInfo.id + "}",
			placeholder: "{Pernr}",
			valueHelpOnly: true,
			showValueHelp: true,
			width: "100%"
		});

		oInput.addEventDelegate({
			onAfterRendering: function() {
				var editable = this.getEditable();
				this.toggleStyleClass("plain-text-mimic", !editable).$().find("input").toggleClass("text-center", !editable);
			}
		}, oInput);

		return oInput;
	},

	// TableIn04 비용항목
	getKostlInputTemplate: function(columnInfo, oController) {

		var oInput = new sap.m.Input(columnInfo.id, {
			customData: [
				new sap.ui.core.CustomData({
					key: "dialogTitle",
					value: " "
				}),	
				new sap.ui.core.CustomData({
					key: "search",
					value: {
						subCode: "/Header/ZsendGsber"
					}
				}),
				new sap.ui.core.CustomData({
					key: "target",
					value: {
						code: "/TableIn04/${rowIndex}/Kostl",
						text: "/TableIn04/${rowIndex}/KostlT"
					}
				})
			],
			valueHelpRequest: OnRequest.searchSubCostCenter.bind(oController),
			editable: "{/Header/Edtfg}",
			value: "{" + columnInfo.id + "}",
			valueHelpOnly: true,
			showValueHelp: true,
			width: "100%"
		});

		oInput.addEventDelegate({
			onAfterRendering: function() {
				var editable = this.getEditable();
				this.toggleStyleClass("plain-text-mimic", !editable).$().find("input").toggleClass("text-center", !editable);
			}
		}, oInput);

		return oInput;
	},

	// TableIn04 WBS
	getPsPosidInputTemplate: function(columnInfo, oController) {

		var oInput = new sap.m.Input({
			customData: [
				new sap.ui.core.CustomData({
					key: "search",
					value: {
						subCode: "/TableIn04/${rowIndex}/Kostl"
					}
				}),
				new sap.ui.core.CustomData({
					key: "target",
					value: {
						code: "/TableIn04/${rowIndex}/PsPosid",
						text: "/TableIn04/${rowIndex}/PsPosidT"
					}
				})
			],
			valueHelpRequest: OnRequest.searchWBS.bind(oController),
			editable: "{/Header/Edtfg}",
			value: "{" + columnInfo.id + "}",
			valueHelpOnly: true,
			showValueHelp: true,
			width: "100%"
		});

		oInput.addEventDelegate({
			onAfterRendering: function() {
				var editable = this.getEditable();
				this.toggleStyleClass("plain-text-mimic", !editable).$().find("input").toggleClass("text-center", !editable);
			}
		}, oInput);

		return oInput;
	}

});

});