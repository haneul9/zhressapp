sap.ui.define([
	"common/ZHR_TABLES"
], function(ZHR_TABLES) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTripMap.fragment.CityDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19411"), // 도시 선택
			contentWidth: "1000px",
			contentHeight: "80%",
			content: this.getContent(oController),
			draggable: true,
			endButton: [
				new sap.m.Button({
					type: sap.m.ButtonType.Default,
					text: oController.getBundleText("LABEL_00133"), // 닫기
					press: function() {
						oDialog.close();
					}
				})
				.addStyleClass("button-default")
			]
		})
		.addStyleClass("custom-dialog-popup");

		return oDialog;
	},

	getContent: function(oController) {

		var oModel = oController.CityDialogHandler.getModel();

		return [
			this.getSearchVBox(oController).setModel(oModel),
			this.getCityTable(oController).setModel(oModel),
			this.getFavoriteCityList(oController).setModel(oModel)
		];
	},

	getSearchVBox: function(oController) {

		var CityDialogHandler = oController.CityDialogHandler;

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			items: [
				new sap.m.HBox({
					items: [
						this.getLabel("{i18n>LABEL_19412}"), // 국가명
						new sap.m.Input({
							layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
							valueHelpRequest: CityDialogHandler.helpCountryValue.bind(CityDialogHandler),
							value: {
								parts: [
									{ path: "/City/BtCrt" },
									{ path: "/City/BtCrtT" }
								],
								formatter: function(BtCrt, BtCrtT) {
									return BtCrt ? BtCrtT + " (" + BtCrt + ")" : "";
								}
							},
							valueHelpOnly: true,
							showValueHelp: true
						}),
						this.getLabel("{i18n>LABEL_19415}"), // 도시명
						new sap.m.Input({
							layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
							submit: CityDialogHandler.search.bind(CityDialogHandler),
							value: "{/City/CityName}"
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					justifyContent: sap.m.FlexJustifyContent.End,
					items: [
						new sap.m.Button({
							press: CityDialogHandler.search.bind(CityDialogHandler),
							text: "{i18n>LABEL_00100}" // 조회
						})
						.addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("search-box search-bg pb-7px")
	},

	getCityTable: function(oController) {

		var CityDialogHandler = oController.CityDialogHandler,
		oTable = new sap.ui.table.Table("CityTable", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			busyIndicatorDelay: 0,
			// fixedColumnCount: 6,
			visibleRowCount: 5,
			// visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
			// visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Interactive,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			cellClick: CityDialogHandler.clickTableCell.bind(CityDialogHandler)
		})
		.addStyleClass("mt-30px")
		.bindRows("/City/SearchList");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "BtCrt",    label: "{i18n>LABEL_19413}"/* 국가 코드 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%"},
			{ id: "BtCrtT",   label: "{i18n>LABEL_19412}"/* 국가명    */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%"},
			{ id: "BtCity",   label: "{i18n>LABEL_19414}"/* 도시 코드 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%"},
			{ id: "BtCityT",  label: "{i18n>LABEL_19415}"/* 도시명    */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "35%", align: sap.ui.core.HorizontalAlign.Left},
			{ id: "BtStateT", label: "{i18n>LABEL_19416}"/* 도시 검색 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "25%"}
		]);

		return oTable;
	},

	getFavoriteCityList: function(oController) {

		return new sap.m.VBox({
			items: {
				path: "/City/FavoriteList",
				factory: this.getFavoriteCityListFactory.bind(oController)
			}
		})
		.addStyleClass("custom-radio-button-group columns-4 mt-20px");
	},

	getFavoriteCityListFactory: function(sId, oContext) {

		var CityDialogHandler = this.CityDialogHandler,
		buttons = $.map(oContext.getProperty("List"), function(o) {
			return new sap.m.RadioButton({
				text: o.BtCityT,
				customData: new sap.ui.core.CustomData({ key: "selectedCity", value: o })
			});
		});

		return new sap.m.HBox({
			width: "100%",
			items: [
				new sap.m.Label({
					width: "120px",
					text: oContext.getProperty("Gtext"), // 대륙
					design: sap.m.LabelDesign.Bold,
					textAlign: sap.ui.core.TextAlign.Center,
					vAlign: sap.ui.core.VerticalAlign.Middle
				}),
				new sap.m.RadioButtonGroup("radio-button-group-" + oContext.getProperty("Gtext").toLowerCase().replace(/\s/g, ""), {
					layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
					select: CityDialogHandler.selectRadioButton.bind(CityDialogHandler),
					selectedIndex: -1,
					columns: 4,
					buttons: buttons
				})
			]
		});
	},

	getLabel: function(text) {

		return new sap.m.Label({
			text: text,
			design: sap.m.LabelDesign.Bold,
			textAlign: sap.ui.core.TextAlign.Right,
			vAlign: sap.ui.core.VerticalAlign.Middle
		});
	}

});

});