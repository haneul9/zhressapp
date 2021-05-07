sap.ui.define(
    [
        "common/makeTable", //
        "common/PageHelper"
    ],
    function (MakeTable, PageHelper) {
        "use strict";

        sap.ui.jsview("ZUI5_HR_Vacation.List", {
            getControllerName: function () {
                return "ZUI5_HR_Vacation.List";
            },

            createContent: function (oController) {
                $.app.setModel("ZHR_COMMON_SRV");
				$.app.setModel("ZHR_LEAVE_APPL_SRV");
				
				var oFilter = new sap.m.FlexBox({
					fitContainer: true,
					items: [
						new sap.m.FlexBox({
							// 검색
							items: [
								new sap.m.FlexBox({
									items: [
										new sap.m.Label({text: "{i18n>LABEL_48002}" }), // 부서/사원
										new sap.m.Input({
											width: "140px",
											value: "{Ename}",
											showValueHelp: true,
											valueHelpOnly: true,
											valueHelpRequest: oController.searchOrgehPernr,
											editable : {
												path : "Persa",
												formatter : function(fVal){
													if($.app.APP_AUTH == $.app.Auth.HASS) return true;
													else return (fVal && fVal.substring(0,1) == "D") ? false : true;
												}
											}
										}),
										new sap.m.Label({text: "{i18n>LABEL_48003}"}), // 대상기간
										new sap.m.DateRangeSelection({
											displayFormat: gDtfmt,
											dateValue: "{Begda}",
											secondDateValue: "{Endda}",
											delimiter: "~",
											width: "210px"
										})
									]
								}).addStyleClass("search-field-group"),
								new sap.m.FlexBox({
									items: [
										new sap.m.Button({
											press: oController.onPressSearch,
											text: "{i18n>LABEL_00100}" // 조회
										}).addStyleClass("button-search")
									]
								}).addStyleClass("button-group")
							]
						})
					]
				}).addStyleClass("search-box search-bg pb-7px mt-16px");
				
				var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
					selectionMode: "MultiToggle",
					enableSelectAll : false,
					enableColumnReordering: false,
					enableColumnFreeze: false,
					enableBusyIndicator: true,
					visibleRowCount: 1,
					showOverlay: false,
					showNoData: true,
					noData: "{i18n>LABEL_00901}", // No data found
					rowHeight: 37,
					columnHeaderHeight: 38,
					cellClick : oController.onPressTable,
					rowActionCount : 1,
					rowActionTemplate : [new sap.ui.table.RowAction({
											items : [new sap.ui.table.RowActionItem({
														type : "Navigation",
														customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
														press : function(oEvent){
																oController.onPressTable(oEvent, "X");
														}
													})]
										})],
					rowSettingsTemplate : [new sap.ui.table.RowSettings({
											highlight : {
													path : "Status1",
													formatter : function(fVal){
														if(fVal == "AA" || fVal == "JJ"){ // 작성중, 취소
															return "Indication01";
														} else if(fVal == "00"){ // 결재중
															return "Indication02";
														} else if(fVal == "88"){ // 반려
															return "Indication03";
														} else if(fVal == "99"){ // 결재완료
															return "Indication04";
														} else {
															return "None";
														}
													}
											}
										})],
					extension : [new sap.m.Toolbar({
									height : "52px",
									content : [new sap.m.ToolbarSpacer(),
												new sap.m.HBox({
													items: [
														new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
														new sap.m.Label({text: "{i18n>LABEL_00196}"}).addStyleClass("custom-legend-item"), // 미결재
														new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
														new sap.m.Label({text: "{i18n>LABEL_00197}"}).addStyleClass("custom-legend-item"), // 결재중
														new sap.m.Label().addStyleClass("custom-legend-color bg-signature-purple"),
														new sap.m.Label({text: "{i18n>LABEL_00201}"}).addStyleClass("custom-legend-item"), // 담당자확인
														new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
														new sap.m.Label({text: "{i18n>LABEL_00198}"}).addStyleClass("custom-legend-item"), // 반려
														new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
														new sap.m.Label({text: "{i18n>LABEL_00199}"}).addStyleClass("custom-legend-item") // 결재완료
													]
												}).addStyleClass("custom-legend-group mr-20px"),
												new sap.m.HBox({
													items: [
														new sap.m.Button({
															text: "{i18n>LABEL_00129}", // Excel
															press: oController.onExport
														}).addStyleClass("button-light"),
														new sap.m.Button({
															text: "{i18n>LABEL_48045}", // 신규신청
															press : oController.onPressNew
														}).addStyleClass("button-light"),
														new sap.m.Button({
															text: "{i18n>LABEL_48046}", // 삭제신청
															press : oController.onPressDelete
														}).addStyleClass("button-light")
													]
												}).addStyleClass("button-group")]
								}).addStyleClass("toolbarNoBottomLine")]
				}).addStyleClass("mt-10px");
				
				oTable.setModel(new sap.ui.model.json.JSONModel());
				oTable.bindRows("/Data");
				
								// 결재상태, 구분, 사번, 성명, 근태, 근태기간, 일수, 행선지, 연락처, 근태사유
				var col_info = [{id: "Stext1", label: "{i18n>LABEL_48012}", plabel: "", resize: true, span: 0, type: "link", sort: true, filter: true},
								{id: "Delapptx", label: "{i18n>LABEL_48047}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Pernr", label: "{i18n>LABEL_48004}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Ename", label: "{i18n>LABEL_48005}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Atext", label: "{i18n>LABEL_48006}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Period", label: "{i18n>LABEL_48007}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "15%"},
								{id: "Abrtg", label: "{i18n>LABEL_48008}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Desti", label: "{i18n>LABEL_48009}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Telnum", label: "{i18n>LABEL_48010}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
								{id: "Bigo", label: "{i18n>LABEL_48011}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "25%", align : "Begin"}];
				
				MakeTable.makeColumn(oController, oTable, col_info);
				
				oTable.addEventDelegate({
					onAfterRendering : function(){
						oController._Columns = [];
						for(var i=0; i<col_info.length; i++){
							var column = {};
								column.label = common.Common.stripI18nExpression(col_info[i].label);
								column.property = col_info[i].id;
								column.type = "string";
								column.width = 20;
							oController._Columns.push(column);
						}
					}
				});
				
				var oPage = new common.PageHelper({
					idPrefix : oController.PAGEID,
					contentItems: [oFilter, oTable]
				});
				oPage.setModel(oController._ListCondJSonModel);
				oPage.bindElement("/Data");
		
				return oPage;
            }
        });
    }
);
