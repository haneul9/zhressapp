sap.ui.define([
	"../common/ZHR_TABLES",
	"../common/PickOnlyDateRangeSelection"
], function (ZHR_TABLES, PickOnlyDateRangeSelection) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_PreschoolersAllowance.Page", { // 미취학

		_colModel: [ 
			{id: "Begda", 	label: "{i18n>LABEL_22009}"/* 신청일 */,		 plabel: "", resize: true, span: 0, type: "date",    sort: true,  filter: true, width: "10%"},
			{id: "Zname", 	label: "{i18n>LABEL_22010}"/* 자녀명 */,		 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "8%"},
			{id: "Fgbdt",   label: "{i18n>LABEL_22011}"/* 생년월일 */,		 plabel: "", resize: true, span: 0, type: "date", 	 sort: true,  filter: true, width: "10%"},
			{id: "Period",  label: "{i18n>LABEL_22012}"/* 지원기간 */, 		 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "17%"},
			{id: "Zpaymm",	label: "{i18n>LABEL_22013}"/* 월 지원금액(원) */,plabel: "", resize: true, span: 0, type: "money",   sort: true,  filter: true, width: "10%"},
			{id: "Zpaytt",	label: "{i18n>LABEL_22014}"/* 총 지원금액(원) */,plabel: "", resize: true, span: 0, type: "money",   sort: true,  filter: true, width: "10%"},
			{id: "Status",	label: "{i18n>LABEL_22015}"/* 결재상태 */,  	 plabel: "", resize: true, span: 0, type: "template",sort: false, filter: true, width: "14%", templateGetter: "getStatus"},
			{id: "Notes",	label: "{i18n>LABEL_22016}"/* 반려사유 */,  	 plabel: "", resize: true, span: 0, type: "string",	 sort: true,  filter: true, align: "Begin"},
		],

		createContent: function(oController) {

			var vYear = new Date().getFullYear();	
			
			var oSearchBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({text: "{i18n>LABEL_22009}"}), // 신청일
                            new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
								width: "250px",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear, 0, 1),
								secondDateValue: new Date()
							})
						]
                    }).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressSer.bind(oController),
								text: "{i18n>LABEL_00100}" // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("search-box search-bg pb-7px mt-16px");

			var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						alignContent: sap.m.FlexAlignContent.Center,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ // 신청현황
								text: "{i18n>LABEL_22022}", 
							})    
							.addStyleClass("sub-title"), 
						//	new sap.m.Text({
						//		text: "{i18n>MSG_22001}",
						//		textAlign: "Begin",
						//	})
						//	.addStyleClass("ml-30px")
						]
					}).addStyleClass("info-field-group"),

					new sap.m.FlexBox({
						items: [
							new sap.m.Button({
								press: oController.onPressReqBtn.bind(oController),
								text: "{i18n>LABEL_22018}", // 신청
							}).addStyleClass("button-light")
						],
						visible: {
							path: "/ChildExport/0/EClose",
							formatter: function(v) {
								if(v === "X") return false;
								else return true;
							}
						}
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("info-box")
			.setModel(oController.PageModel);
			
			var oTable = new sap.ui.table.Table(this.createId("Table"), {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}",
				rowActionCount : 1,
				rowActionTemplate : new sap.ui.table.RowAction({
					items : [
						new sap.ui.table.RowActionItem({
							icon : "sap-icon://navigation-right-arrow",
							press : oController.onPressRow.bind(oController)
						})
					]
				})
			})
			.addStyleClass("mt-10px row-link")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow.bind(oController));
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel);

			return [
				oSearchBox,
				infoBox,
				oTable
			];
		}
	});

});