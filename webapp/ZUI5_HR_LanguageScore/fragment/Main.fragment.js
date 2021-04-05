sap.ui.define([
	"../../common/EmpBasicInfoBox",
	"../../common/ZHR_TABLES",
	"../delegate/ViewTemplates",
	"../../common/PageHelper"
], function(
	EmpBasicInfoBox,
	ZHR_TABLES,
	ViewTemplates,
	PageHelper
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_LanguageScore.fragment.Main", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/
	// ESS 용
	_colModel1: [
		{id: "ZlanguTxt",  label: "{i18n>LABEL_49002}" /* 어학종류 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
		{id: "ZltypeTxt", 	 label: "{i18n>LABEL_49003}" /* 시험종류 */,    plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "auto"},
		{id: "Acqpot",  label: "{i18n>LABEL_49004}" /* 취득점수 */,  plabel: "", resize: true, span: 0, type: "string",     sort: true,  filter: true,  width: "auto"},
		{id: "Appdat", 	 label: "{i18n>LABEL_49005}" /* 응시일자 */,    plabel: "", resize: true, span: 0, type: "date",    sort: true,  filter: true,  width: "auto"},
		{id: "Endda",   label: "{i18n>LABEL_49006}" /* 유효일자 */,  plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
		{id: "TargetcT",   label: "{i18n>LABEL_49007}" /* 유효/만료 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"}
	],
	// MSS 용
	_colModel2: [
		{id: "Obj1t",  label: "{i18n>LABEL_49009}" /* 부 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
		{id: "Obj2t",  label: "{i18n>LABEL_49011}" /* 과 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
		{id: "Gradet", 	 label: "{i18n>LABEL_49003}" /* 직급 */,    plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "auto"},
		{id: "Ename",  label: "{i18n>LABEL_49004}" /* 성명 */,  plabel: "", resize: true, span: 0, type: "string",     sort: true,  filter: true,  width: "auto"},
		{id: "ZlanguTxt",  label: "{i18n>LABEL_49002}" /* 어학종류 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
		{id: "ZltypeTxt", 	 label: "{i18n>LABEL_49003}" /* 시험종류 */,    plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "200px"},
		{id: "IndexCo",  label: "{i18n>LABEL_49012}" /* 기준점수 */,  plabel: "", resize: true, span: 0, type: "string",     sort: true,  filter: true,  width: "auto"},
		{id: "Acqpot",  label: "{i18n>LABEL_49004}" /* 취득점수 */,  plabel: "", resize: true, span: 0, type: "string",     sort: true,  filter: true,  width: "auto"},
		{id: "Accept",  label: "{i18n>LABEL_49013}" /* 유효점수 */,  plabel: "", resize: true, span: 0, type: "string",     sort: true,  filter: true,  width: "auto"},
		{id: "Appdat", 	 label: "{i18n>LABEL_49005}" /* 응시일자 */,    plabel: "", resize: true, span: 0, type: "date",    sort: true,  filter: true,  width: "auto"},
		{id: "Endda",   label: "{i18n>LABEL_49006}" /* 유효일자 */,  plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
		{id: "TargetcT",   label: "{i18n>LABEL_49007}" /* 유효/만료 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"}
	],

	createContent : function(oController) {
		
		var oStatusCombo1 = new sap.m.ComboBox({ // 어학구분
			selectedKey: "{Langu}",
			items: {
				path: "/Langu",
				template: new sap.ui.core.ListItem({
					key: "{Code}",
					text: "{Text}"
				})
			},
			change : oController.onChangeLangu
		});  
		
		var oStatusCombo2 = new sap.m.ComboBox({ // 시험종류
			selectedKey: "{Ltype}",
			items: {
				path: "/Ltype",
				template: new sap.ui.core.ListItem({
					key: "{Code}",
					text: "{Text}"
				})
			}
		});  
		
		var oStatusCombo3 = new sap.m.ComboBox({ // 유효/만료
			width: "100px",
			selectedKey: "{Tepas}",
			items: {
				path: "/Tepas",
				template: new sap.ui.core.ListItem({
					key: "{Code}",
					text: "{Text}"
				})
			}
		});

		// // 키보드 입력 방지
		// oStatusCombo1.addDelegate({
		// 	onAfterRendering: function () {
		// 		oStatusCombo1.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
		// 	}
		// }, oStatusCombo1);
		
		// oStatusCombo2.addDelegate({
		// 	onAfterRendering: function () {
		// 		oStatusCombo2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
		// 	}
		// }, oStatusCombo2);
		
		// oStatusCombo3.addDelegate({
		// 	onAfterRendering: function () {
		// 		oStatusCombo3.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
		// 	}
		// }, oStatusCombo3);

		// oStatusCombo4.addDelegate({
		// 	onAfterRendering: function () {
		// 		oStatusCombo4.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
		// 	}
		// }, oStatusCombo4);
			
		var oSearchConditionBox = new sap.m.FlexBox({
			fitContainer: true,
			items: [ 
				new sap.m.HBox({						
					items: [
						new sap.m.Label({
							text: "{i18n>LABEL_49008}", // 어학구분						
						}),						
						oStatusCombo1,
						new sap.m.Label({
							text: "{i18n>LABEL_49003}", // 시험종류				
						}),                        
						oStatusCombo2,
						new sap.m.Label({
							text: "{i18n>LABEL_49007}", // 유효/만료
						}),                        
						oStatusCombo3,
						new sap.m.Label({
							text: "{i18n>LABEL_49010}", // 부서/사원
							visible : gAuth == "M" ? true : false			
						}), 
						new sap.m.Input({
							layoutData: new sap.m.FlexItemData({ growFactor: 1, minWidth: "140px" }),
							editable : false,
                            value: "{EnameOrOrgehTxt}",
                            visible : gAuth == "M" ? true : false
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
		
		if(gAuth == "M"){
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel2);
		}else if(gAuth == "E"){
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel1);
		}

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
