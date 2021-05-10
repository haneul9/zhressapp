sap.ui.define([
	"common/ZHR_TABLES"
], function(ZHR_TABLES) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_OvertimeWorkTech.fragment.priorOverWorkDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_32043"), // 연장근무 사전신청 승인내역
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

		var oModel = oController.PriorOverWorkDialogHandler.getModel();
		return [
			this.getSearchVBox(oController).setModel(oModel),
			this.getSubCostCenterTable(oController).setModel(oModel)
		];
	},

	getSearchVBox: function(oController) {

		var PriorOverWorkDialogHandler = oController.PriorOverWorkDialogHandler;

		return new sap.m.HBox({
			fitContainer: true,
			items: [
				new sap.m.HBox({
					items: [						
                        new sap.m.Label({text: "{i18n>LABEL_32009}"}), // 근무일
                        new sap.m.DateRangeSelection({
                            displayFormat: "{/Dtfmt}",
                            dateValue: "{/SearchConditions/Begda}",
                            secondDateValue: "{/SearchConditions/Endda}",
                            delimiter: "~",
                            width: "210px"
                        })
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: PriorOverWorkDialogHandler.onBeforeOpen.bind(PriorOverWorkDialogHandler, "X"),
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

		var PriorOverWorkDialogHandler = oController.PriorOverWorkDialogHandler,
		oTable = new sap.ui.table.Table($.app.createId("PriorOverWorkTable"), {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 5,
			busyIndicatorDelay: 0,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			cellClick: PriorOverWorkDialogHandler.clickTableCell.bind(PriorOverWorkDialogHandler)
		})
		.addStyleClass("mt-30px row-link") 
		.bindRows("/List");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Otdat", label: "{i18n>LABEL_32009}"/* 근무일 */, plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width: "25%"},
			{ id: "Otbetm", label: "{i18n>LABEL_32010}"/* 시작 시간 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "25%"},
			{ id: "Otentm", label: "{i18n>LABEL_32011}"/* 종료 시간 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "25%"},
			{ id: "Afreq", label: "{i18n>LABEL_32006}"/* 사후신청 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "25%", templateGetter: "getCheckboxTemplate", templateGetterOwner: this}
		]);

		return oTable;
    },
    
    getCheckboxTemplate: function(columnInfo) {
        var oCheckBox = new sap.m.CheckBox({
			useEntireWidth: true,
			editable: false,
			selected: {
				path: columnInfo.id,
				formatter: function(v) {
					return v === "X" ? true : false;
				}
			}
		});

		oCheckBox.addEventDelegate({
			onAfterRendering: function() {
				this.toggleStyleClass("plain-text-mimic", !this.getEditable());
			}
		}, oCheckBox);

		return oCheckBox;
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