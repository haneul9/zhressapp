sap.ui.define([
	"../../common/PickOnlyDateRangeSelection",
	"../../common/EmpBasicInfoBox",
	"../../common/ZHR_TABLES",
	"../../common/PageHelper"
], function(
	PickOnlyDateRangeSelection,
	EmpBasicInfoBox,
	ZHR_TABLES,
	PageHelper
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_ReCertiApply.fragment.Main", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	
	_colModel: [
		{id: "Idx",  label: "{i18n>LABEL_68002}" /* 번호 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "80px"},
		{id: "Reqre",  label: "{i18n>LABEL_68003}" /* 정정신청일 */,  plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
		{id: "ApplyDt", 	 label: "{i18n>LABEL_68004}" /* 신청일 */,    plabel: "", resize: true, span: 0, type: "date",    sort: true,  filter: true,  width: "auto"},
		{id: "AptypT",  label: "{i18n>LABEL_68005}" /* 구분 */,  plabel: "", resize: true, span: 0, type: "string",     sort: true,  filter: true,  width: "auto"},
		{id: "Langtxt",  label: "{i18n>LABEL_68006}" /* 언어 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
		{id: "Reasn", 	 label: "{i18n>LABEL_68007}" /* 오류내용 */,    plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "300px"},
		{id: "Pernr",  label: "{i18n>LABEL_68008}" /* 사번 */,  plabel: "", resize: true, span: 0, type: "string",     sort: true,  filter: true,  width: "auto"},
		{id: "Ename",  label: "{i18n>LABEL_68009}" /* 성명 */,  plabel: "", resize: true, span: 0, type: "string",     sort: true,  filter: true,  width: "auto"},
	],

	createContent : function(oController) {
		
		var oSearchConditionBox = new sap.m.FlexBox({
			fitContainer: true,
			items: [ 
				new sap.m.HBox({						
					items: [
						new sap.m.Label({
							text: "{i18n>LABEL_19501}", // 기간						
						}),						
						new PickOnlyDateRangeSelection({
							displayFormat: "{Dtfmt}",
							secondDateValue: "{Endda}",
							dateValue: "{Begda}",
							delimiter: "~",
							width: "210px"
						}),
						new sap.m.Label({
							text: "{i18n>LABEL_49010}", // 부서/사원
						}), 
						new sap.m.Input({
							layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "140px" }),
							editable : false,
                            value: "{EnameOrOrgehTxt}",
                    	})
						.addStyleClass("field-min-width-50"),
					] 
				}).addStyleClass("search-field-group"),                    
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: oController.onPressSearch,
							text: "{i18n>LABEL_33005}", // 조회
						}).addStyleClass("button-search"),
					]
				})
				.addStyleClass("button-group")
			]
		}) 
		.addStyleClass("search-box search-bg pb-7px mt-16px")
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
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
			noData: "{i18n>LABEL_00901}"
		})
		.addStyleClass("mt-10px")
		.setModel(oController._TableModel)
		.bindRows("/Data");
		
		ZHR_TABLES.makeColumn(oController, oTable, this._colModel);

		return new sap.m.VBox({
			height: "100%",
			items: [
				oSearchConditionBox,
				oTable,
			]
		});
	},
	
});
});
