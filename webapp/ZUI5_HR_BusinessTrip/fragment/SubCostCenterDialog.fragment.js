sap.ui.define([
	"common/ZHR_TABLES"
], function(ZHR_TABLES) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.SubCostCenterDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19401", " "), // {0} 코스트센터 선택
			contentWidth: "850px",
			contentHeight: "400px",
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

		var oModel = oController.SubCostCenterDialogHandler.getModel();
		return [
			this.getSearchVBox(oController).setModel(oModel),
			this.getSubCostCenterTable(oController).setModel(oModel)
		];
	},

	getSearchVBox: function(oController) {

		var SubCostCenterDialogHandler = oController.SubCostCenterDialogHandler;

		return new sap.m.HBox({
			fitContainer: true,
			items: [
				new sap.m.HBox({
					items: [						
						new sap.m.Label({text: "{i18n>LABEL_19402}"}), // 사업영역
						new sap.m.Input({
							submit: SubCostCenterDialogHandler.onBeforeOpen.bind(SubCostCenterDialogHandler),
							layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
							value: "{/SubCostCenter/SubCode}",
							width: "70px"
						}),						
						new sap.m.Label({text: "{i18n>LABEL_19403}"}), // 코스트센터						
						new sap.m.Input({
							submit: SubCostCenterDialogHandler.onBeforeOpen.bind(SubCostCenterDialogHandler),
							layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
							value: "{/SubCostCenter/Code}",
							width: "70px"
						}),						
						new sap.m.Label({text: "{i18n>LABEL_19404}"}), // 명칭						
						new sap.m.Input({
							submit: SubCostCenterDialogHandler.onBeforeOpen.bind(SubCostCenterDialogHandler),
							layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
							value: "{/SubCostCenter/Text}",
							width: "200px"
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: SubCostCenterDialogHandler.onBeforeOpen.bind(SubCostCenterDialogHandler),
							text: "{i18n>LABEL_00100}" // 조회
						})
						.addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			] 
		})
		.addStyleClass("search-box search-bg pb-7px");
	},

	getSubCostCenterTable: function(oController) {

		var SubCostCenterDialogHandler = oController.SubCostCenterDialogHandler,
		oTable = new sap.ui.table.Table("SubCostCenterTable", {
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
			cellClick: SubCostCenterDialogHandler.clickTableCell.bind(SubCostCenterDialogHandler)
		})
		.addStyleClass("mt-30px row-link") 
		.bindRows("/SubCostCenter/List");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Gsber",  label: "{i18n>LABEL_19402}"/* 사업영역   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%"},
			{ id: "Kostl",  label: "{i18n>LABEL_19403}"/* 코스트센터 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%"},
			{ id: "KostlT", label: "{i18n>LABEL_19404}"/* 명칭       */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "60%"}
		]);

		return oTable;
	},

	getLabel: function(text) {

		return new sap.m.Label({
			text: text,
			width: "65px",			
			design: sap.m.LabelDesign.Bold,
			textAlign: sap.ui.core.TextAlign.Right,
			vAlign: sap.ui.core.VerticalAlign.Middle
		});
	}

});

});