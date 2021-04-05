sap.ui.define([
	"../../common/ZHR_TABLES",
	], function(
	ZHR_TABLES,
) {
"use strict";

sap.ui.jsfragment([$.app.CONTEXT_PATH, "fragment", "RequestList"].join("."), { 

	createContent: function(oController) {

		return new sap.m.VBox({
			height: "100%",
			items: [
				this.getSearchHBox(oController),
				this.getTable(oController)
			]
		});
	},

	getSearchHBox: function(oController) {

		return new sap.m.HBox({
			fitContainer: true,
			items: [
				new sap.m.HBox({
					items: [
					    new sap.m.Label({ text: "{i18n>LABEL_54010}" }), //대상 년도
                        new sap.m.Select({
							width: "120px",
							selectedKey: "{Year}",
							items: {
								path: "/Year",
								templateShareable: false,
								template: new sap.ui.core.ListItem({key: "{Code}", text: "{Text}"})
							},
							change : oController.onPressSearch
						}),
						new sap.m.Label({text: "{i18n>LABEL_54003}",
						                 textAlign: sap.ui.core.HorizontalAlign.Center,
						}).addStyleClass("mx-10px"), // 년
					]
				})
				.addStyleClass("search-field-group"),
			]
		})
		.addStyleClass("search-box search-bg pb-7px mt-16px")
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data");
	},

	getTable: function(oController) {

		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
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
			noData: "{i18n>LABEL_00901}",
			cellClick: oController.clickListCell
		})
		.addStyleClass("mt-10px")
		.setModel(oController._ListJSonModel)
		.bindRows("/Data");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Zyymm",      label: "{i18n>LABEL_54002}"/* 대상년월     */, plabel: "", resize: true, span: 0, type: "template",   sort: true, filter: true, width:  "14%", templateGetter: "getYYYYMMTemplate", templateGetterOwner: this},
			{ id: "Ocrtx",  	label: "{i18n>LABEL_54005}"/* 급여구분 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "14%" },
			{ id: "Bet01",      label: "{i18n>LABEL_54006}"/* 지급총액     */, plabel: "", resize: true, span: 0, type: "template",   sort: true, filter: true, width: "18%", templateGetter: "getMoneyTemplate1", templateGetterOwner: this},
			{ id: "Bet02",      label: "{i18n>LABEL_54007}"/* 공제총액     */, plabel: "", resize: true, span: 0, type: "template",   sort: true, filter: true, width: "18%", templateGetter: "getMoneyTemplate2", templateGetterOwner: this},
			{ id: "Bet03",      label: "{i18n>LABEL_54008}"/* 차감지급액     */, plabel: "", resize: true, span: 0, type: "template",   sort: true, filter: true, width: "18%", templateGetter: "getMoneyTemplate3", templateGetterOwner: this},
			{ id: "Bet04",      label: "{i18n>LABEL_54009}"/* 기지급액   */, plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width:  "18%"},
		]);

		return oTable;
	},

	getYYYYMMTemplate : function(columnInfo){
		return new sap.ui.commons.TextView({
					textAlign: sap.ui.core.HorizontalAlign.Center,
					text: {
						parts: [
							{ path: columnInfo.id },
						],
						formatter: function(v) {
							
							return v && v.length == 6 ? v.substring(0,4) + "." + v.substring(4,6) : v;
						}
					}
				});

	},

	getMoneyTemplate1: function(columnInfo) {

		return new sap.ui.commons.TextView({
			textAlign: sap.ui.core.HorizontalAlign.End,
			text: {
				parts: [
					{ path: columnInfo.id },
				],
				formatter : function(v) {
					this.addStyleClass("color-signature-blue"); // 지급총액
					this.addStyleClass("px-10px");
					return v;
				}
			}
		});
	},

	getMoneyTemplate2: function(columnInfo) {

		return new sap.ui.commons.TextView({
			textAlign: sap.ui.core.HorizontalAlign.End,
			text: {
				parts: [
					{ path: columnInfo.id },
				],
				formatter : function(v) {
					this.addStyleClass("color-signature-red");
					this.addStyleClass("px-10px");
					return v;
				}
			}
		});
	},

	getMoneyTemplate3: function(columnInfo) {

		return new sap.ui.commons.TextView({
			textAlign: sap.ui.core.HorizontalAlign.End,
			text: {
				parts: [
					{ path: columnInfo.id },
				],
				formatter : function(v) {
					this.addStyleClass("px-10px");
					this.addStyleClass("bold");
					return v;
				}
			}
		});
	}

});

});