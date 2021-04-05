sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES",
	"../common/EmpBasicInfoBox"
], function (Common, Formatter, PageHelper, ZHR_TABLES, EmpBasicInfoBox) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		_colModel: [
			{id: "Appdt", 	  label: "{i18n>LABEL_23001}" /* 신청일 */,  plabel: "", resize: true, span: 0, type: "date",	 sort: true,  filter: true,  width: "auto"},
			{id: "Ename",	  label: "{i18n>LABEL_23028}" /* 신청자 */,	 plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
			{id: "Sitxt", 	  label: "{i18n>LABEL_23002}" /* 인감구분 */,plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "20%"},
			{id: "Sidoc", 	  label: "{i18n>LABEL_23004}" /* 문서명 */,  plabel: "", resize: true, span: 0, type: "string",	 sort: true,  filter: true,  width: "25%", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Sito", 	  label: "{i18n>LABEL_23005}" /* 제출처 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "20%", align: sap.ui.core.HorizontalAlign.Left},
			{id: "StatusText",label: "{i18n>LABEL_23008}" /* 결재상태 */,plabel: "", resize: true, span: 0, type: "template",  sort: false, filter: false, width: "10%", templateGetter: "getStatusTxt"},
		],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			var vYear = new Date().getFullYear();
			var vMonth = new Date().getMonth()+1;
			var oApplyDate = new sap.m.DateRangeSelection(oController.PAGEID + "_ApplyDate", {
                width: "210px",
                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                delimiter: "~",
                dateValue: new Date(vYear, vMonth-1, 1),
                secondDateValue: new Date(vYear, vMonth, 0)
            })
			oApplyDate.addDelegate({
				onAfterRendering: function () {
					oApplyDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oApplyDate);
			
			var oApplyDateBox = new sap.m.FlexBox({
			//	justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			//	alignContent: sap.m.FlexAlignContent.End,
			//	alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_23001}", // 신청일								
							}),							
							oApplyDate,
							new sap.m.Label({
								text: "{i18n>LABEL_23031}", // 신청자 성명							
							}),
                            new sap.m.Input(oController.PAGEID + "_EnameInput",{
                                width: "200px",
                                value: "{Ename}"
                            })
						]
                    }).addStyleClass("search-field-group"),
                    // new sap.m.FlexBox({
					// 	items: [
					// 		new sap.m.Label({
					// 			text: "{i18n>LABEL_23031}", // 신청자 성명							
					// 		}),
                    //         new sap.m.Input(oController.PAGEID + "_EnameInput",{
                    //             width: "250px",
                    //             value: "{Ename}"
                    //         })
					// 	]
					// }),
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressSer,
								text: "{i18n>LABEL_23010}", // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
			}).addStyleClass("search-box search-bg pb-7px mt-16px");
			
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
			.addStyleClass("mt-30px")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
			
			return new PageHelper({
				contentItems: [
					oApplyDateBox,
					oTable
				]
			});
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_BENEFIT_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
