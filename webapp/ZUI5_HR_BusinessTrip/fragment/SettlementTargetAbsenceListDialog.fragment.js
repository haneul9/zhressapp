sap.ui.define([
	"../../common/PickOnlyDateRangeSelection",
	"../../common/ZHR_TABLES"
], function(PickOnlyDateRangeSelection, ZHR_TABLES) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.SettlementTargetAbsenceListDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19005"), // 출장정산 대상 근태정보 선택
			contentWidth: "1200px",
			contentHeight: "400px",
			content: this.getContent(oController),
			draggable: true,
			endButton: [
				new sap.m.Button({
					type: sap.m.ButtonType.Default,
					text: oController.getBundleText("LABEL_00119"), // 취소
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

		var oModel = oController.SettlementTargetAbsenceListDialogHandler.getModel();
		return [
			this.getSearchHBox(oController).setModel(oModel),
			this.getTable(oController).setModel(oModel),
			this.getInfoHBox()
		];
	},

	getSearchHBox: function(oController) {

		var handler = oController.SettlementTargetAbsenceListDialogHandler;

		return new sap.m.HBox({
			fitContainer: true,
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.Label({text: "{i18n>LABEL_19501}"}), // 기간
						new PickOnlyDateRangeSelection({
							change: handler.onBeforeOpen.bind(handler),
							displayFormat: "{/Absence/Dtfmt}",
							secondDateValue: "{/Absence/IEndda}",
							dateValue: "{/Absence/IBegda}",
							delimiter: "~",
							width: "210px"
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: handler.onBeforeOpen.bind(handler),
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

	getTable: function(oController) {

		var handler = oController.SettlementTargetAbsenceListDialogHandler,
		oTable = new sap.ui.table.Table("SettlementTargetAbsenceListTable", {
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
			cellClick: handler.clickTableCell.bind(handler)
		})
		.addStyleClass("mt-20px")
		.bindRows("/Absence/List");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Pernr",    label: "{i18n>LABEL_19507}"/* 사번   */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width:  "9%" },
			{ id: "Ename",    label: "{i18n>LABEL_19508}"/* 성명   */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" },
			{ id: "Orgtx",    label: "{i18n>LABEL_19509}"/* 소속   */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "16%", align: sap.ui.core.HorizontalAlign.Left },
			{ id: "AwartTxt", label: "{i18n>LABEL_19502}"/* 유형   */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "13%", align: sap.ui.core.HorizontalAlign.Left },
			{ id: "Begda",    label: "{i18n>LABEL_19503}"/* 시작일 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "10%", templateGetter: "getDateTextTemplate", templateGetterOwner: this },
			{ id: "Endda",    label: "{i18n>LABEL_19504}"/* 종료일 */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "10%", templateGetter: "getDateTextTemplate", templateGetterOwner: this },
			{ id: "Desti",    label: "{i18n>LABEL_19505}"/* 행선지 */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "16%", align: sap.ui.core.HorizontalAlign.Left },
			{ id: "Bigo",     label: "{i18n>LABEL_19506}"/* 비고   */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "16%", align: sap.ui.core.HorizontalAlign.Left }
		]);

		return oTable;
	},

	getInfoHBox: function() {

		return new sap.m.HBox({
			items: [
				new sap.m.HBox({
					items: [
						new sap.m.MessageStrip({
							text: "{i18n>MSG_19021}", // 사전 출장신청이 되지 않은 출장 근태만 선택가능합니다.
							customIcon: "sap-icon://information",
							showIcon: true,
							type: sap.ui.core.MessageType.Information
						})
					]
				})
				.addStyleClass("info-field-group message-strip"),
			]
		})
		.addStyleClass("info-box mt-8px");
	},

	getDateTextTemplate: function(columnInfo, oController) {

		return new sap.m.Text({
			text: {
				path: columnInfo.id,
				type: new sap.ui.model.type.Date({ pattern: oController.getSessionInfoByKey("Dtfmt") })
			}
		});
	}

});

});