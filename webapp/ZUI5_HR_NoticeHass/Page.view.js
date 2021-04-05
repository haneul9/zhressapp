sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES",
    "../common/PickOnlyDateRangeSelection"
], function (PageHelper, ZHR_TABLES, PickOnlyDateRangeSelection) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
        
        _ColModel: [
            {id: "Title",    label: "{i18n>LABEL_57008}" /* 제목 */,          plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Left},
            {id: "Sdate",    label: "{i18n>LABEL_57004}" /* 등록일 */,        plabel: "", resize: true, span: 0, type: "date",    sort: true,  filter: true,  width: "15%"},
            {id: "Aedtm",    label: "{i18n>LABEL_57010}" /* 최종변경일/시 */, plabel: "", resize: true, span: 0, type: "template", sort: true,  filter: true,  width: "22%", templateGetter: "getChangeDate"},
            {id: "ApernTxt", label: "{i18n>LABEL_57011}" /* 등록자 */,        plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "15%"},
            {id: "Impor",    label: "{i18n>LABEL_57012}" /* 중요항목 */,      plabel: "", resize: true, span: 0, type: "template", sort: true,  filter: true,  width: "15%", templateGetter: "getImport"},
        ],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {

			$.app.setModel("ZHR_COMMON_SRV");

			var vYear = new Date().getFullYear();
			var vMonth = new Date().getMonth()+1;
			
			var oSearchBox = new sap.m.FlexBox({
                justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                alignContent: sap.m.FlexAlignContent.End,
                alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({text: "{i18n>LABEL_57003}"}), // 검색어(제목)
							new sap.m.Input(oController.PAGEID + "_SearchInput",{
                                width: "200px",
                                value: "{ITitle}"
                            }),
							new sap.m.Label({text: "{i18n>LABEL_57004}"}), // 등록일
                            new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
								width: "250px",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear, vMonth-2, 1),
								secondDateValue: new Date(vYear, vMonth, 0)
							})
						]
                    }).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressSer.bind(oController),
								text: "{i18n>LABEL_57005}", // 조회
							}).addStyleClass("button-search"),
							new sap.m.Button({
								press: oController.onPressRegi.bind(oController),
								text: "{i18n>LABEL_57009}", // 등록
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
			}).addStyleClass("search-box search-bg pb-7px mt-30px");

			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				cellClick: oController.onSelectedRow,
			    width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-10px")
			.setModel(oController.TableModel)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oTable, this._ColModel);
			
			return new PageHelper({
				contentItems: [
					oSearchBox,
					oTable
				]
			});
		}
	});
});
