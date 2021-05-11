sap.ui.define([
	"common/ZHR_TABLES"
], function(
	ZHR_TABLES
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.WBSDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19405"), // WBS 선택
			contentWidth: "850px",
			contentHeight: "420px",
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

		var oModel = oController.WBSDialogHandler.getModel();
		return [
			this.getSearchVBox(oController).setModel(oModel),
			this.getWBSTable(oController).setModel(oModel)
		];
	},

	getSearchVBox: function(oController) {

		var WBSDialogHandler = oController.WBSDialogHandler;
		
		return new sap.m.VBox({
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.VBox({
							// layoutData: new sap.m.FlexItemData({ minWidth: "230px" }),
							width: "42%",
							items: [
								new sap.m.HBox({
									items: [
										this.getLabel("{i18n>LABEL_19406}"), // 비용항목
										new sap.m.Input({											
											width: "100px",
											submit: WBSDialogHandler.onBeforeOpen.bind(WBSDialogHandler),
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											value: "{/WBS/SubCode}",
											editable: false
										})
									]
								})
								.addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [
										this.getLabel("{i18n>LABEL_19408}"), // WBS명
										new sap.m.Input({
											width: "200px",
											submit: WBSDialogHandler.onBeforeOpen.bind(WBSDialogHandler),
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											value: "{/WBS/Text}"
										})
									]									
								})
								.addStyleClass("search-field-group")
							]
						})
						.addStyleClass("search-inner-vbox"),
						new sap.m.VBox({
							// layoutData: new sap.m.FlexItemData({ minWidth: "375px" }),
							width: "48%",
							items: [
								new sap.m.HBox({
									items: [
										this.getLabel("{i18n>LABEL_19407}"), // WBS코드
										new sap.m.Input({
											width: "100px",
											submit: WBSDialogHandler.onBeforeOpen.bind(WBSDialogHandler),
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											value: "{/WBS/Code}"
										})
									]									
								})
								.addStyleClass("search-field-group"),
								new sap.m.HBox({
									items: [										
										/*this.getLabel(),*/ // dummy
										new sap.m.RadioButtonGroup("WBSGroup", {
											layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											width:"100%",
											columns: 2,
											selectedIndex: 0,
											buttons: [
												new sap.m.RadioButton({
													text: "{i18n>LABEL_19409}", // Department WBS
													customData: new sap.ui.core.CustomData({ key: "selectedWBSGroup", value: "003" })
												}),
												new sap.m.RadioButton({
													text: "{i18n>LABEL_19410}", // My WBS
													customData: new sap.ui.core.CustomData({ key: "selectedWBSGroup", value: "010" })
												})
											]
										}).addStyleClass("ml-10px")
									]
								})
								.addStyleClass("search-field-group"),
							]
						})
						.addStyleClass("search-inner-vbox"),
						new sap.m.VBox({
							// layoutData: new sap.m.FlexItemData({ minWidth: "100px" }),
							width: "10%",
							items: [
								new sap.m.Button({
									press: WBSDialogHandler.onBeforeOpen.bind(WBSDialogHandler),
									text: "{i18n>LABEL_00100}" // 조회
								})
								.addStyleClass("button-search")
							]
						})
						.addStyleClass("button-group-popup")
					]
				})
			]
		})		
		.addStyleClass("search-box search-bg pb-7px");
	},

	getWBSTable: function(oController) {

		var WBSDialogHandler = oController.WBSDialogHandler,
		oTable = new sap.ui.table.Table("WBSTable", {
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
			cellClick: WBSDialogHandler.clickTableCell.bind(WBSDialogHandler)
		})
		.addStyleClass("mt-30px row-link")
		.bindRows("/WBS/List");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Posid", label: "{i18n>LABEL_19407}"/* WBS코드    */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "25%"},
			{ id: "Post1", label: "{i18n>LABEL_19408}"/* WBS명      */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "25%"},
			{ id: "Fkstl", label: "{i18n>LABEL_19406}"/* 비용항목   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "25%"},
			{ id: "Ktext", label: "{i18n>LABEL_19403}"/* 코스트센터 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "25%"}
		]);

		return oTable;
	},

	getLabel: function(text) {

		return new sap.m.Label({
			text: text,
			width: "80px",
			design: sap.m.LabelDesign.Bold,
			textAlign: sap.ui.core.TextAlign.Right,
			vAlign: sap.ui.core.VerticalAlign.Middle
		});
	}

});

});