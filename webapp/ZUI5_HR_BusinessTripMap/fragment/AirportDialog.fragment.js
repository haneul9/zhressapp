sap.ui.define([
	"common/Common",
	"common/ZHR_TABLES"
], function(Common, ZHR_TABLES) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTripMap.fragment.AirportDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19681"), // 공항 검색
			contentWidth: "800px",
			contentHeight: "580px",
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
			]
		})
		.addStyleClass("custom-dialog-popup");

		return oDialog;
	},

	getContent: function(oController) {

		var oModel = oController.AirportDialogHandler.getModel();
		return [
			this.getSearchVBox(oController).setModel(oModel),
			this.getAirportTable(oController).setModel(oModel)
		];
	},

	getSearchVBox: function(oController) {

		var AirportDialogHandler = oController.AirportDialogHandler;

		return new sap.m.VBox({
			width: "100%",
			items: [
				new sap.m.HBox({
					items: [
						this.getLabel("{i18n>LABEL_19682}"), // 공항(IATA)
						new sap.m.Input({
							submit: AirportDialogHandler.onBeforeOpen.bind(AirportDialogHandler),
							layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
							value: "{/Airport/Iatacode}"
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						this.getLabel("{i18n>LABEL_19683}"), // 공항명
						new sap.m.Input({
							submit: AirportDialogHandler.onBeforeOpen.bind(AirportDialogHandler),
							layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
							value: "{/Airport/IataTxt}"
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						this.getLabel("{i18n>LABEL_19684}"), // 국가
						new sap.m.Input({
							valueHelpRequest: AirportDialogHandler.helpCountryValue.bind(AirportDialogHandler),
							value: "{/Airport/BtCrt}",
							description: "{/Airport/BtCrtTxt}",
							valueHelpOnly: true,
							showValueHelp: true,
							fieldWidth: "80px"
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						this.getLabel("{i18n>LABEL_19685}"), // 도시
						new sap.m.Input({
							submit: AirportDialogHandler.onBeforeOpen.bind(AirportDialogHandler),
							layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
							value: "{/Airport/BtCityTxt}"
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					justifyContent: sap.m.FlexJustifyContent.End,
					items: [
						new sap.m.Button({
							press: AirportDialogHandler.onBeforeOpen.bind(AirportDialogHandler),
							text: "{i18n>LABEL_00100}" // 조회
						})
						.addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group mt-8px")
			]
		}).addStyleClass("search-box search-bg")
	},

	getAirportTable: function(oController) {

		var AirportDialogHandler = oController.AirportDialogHandler,
		oTable = new sap.ui.table.Table("AirportTable", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			busyIndicatorDelay: 0,
			visibleRowCount: 5,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			cellClick: AirportDialogHandler.clickTableCell.bind(AirportDialogHandler)
		})
		.addStyleClass("mt-30px") 
		.bindRows("/Airport/SearchList");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Iatacode",  label: "{i18n>LABEL_19682}"/* 공항(IATA) */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" },
			{ id: "IataTxt",   label: "{i18n>LABEL_19683}"/* 공항명     */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "40%", align: sap.ui.core.HorizontalAlign.Left },
			{ id: "BtCrtTxt",  label: "{i18n>LABEL_19684}"/* 국가       */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%", align: sap.ui.core.HorizontalAlign.Left},
			{ id: "BtCityTxt", label: "{i18n>LABEL_19685}"/* 도시       */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "25%", align: sap.ui.core.HorizontalAlign.Left }
		]);

		return oTable;
	},

	getLabel: function(text) {

		return new sap.m.Label({
			text: text,
			width: "100px",
			design: sap.m.LabelDesign.Bold,
			textAlign: sap.ui.core.TextAlign.Right,
			vAlign: sap.ui.core.VerticalAlign.Middle
		});
	}

});

});