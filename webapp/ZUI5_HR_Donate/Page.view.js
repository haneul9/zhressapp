sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		_colModel: [
			{id: "StatusT",  label: "{i18n>LABEL_33004}" /* 처리상태 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
			{id: "Reqdt", 	 label: "{i18n>LABEL_33007}" /* 신청일 */,    plabel: "", resize: true, span: 0, type: "date",    sort: true,  filter: true,  width: "auto"},
			{id: "ApplyTm",  label: "{i18n>LABEL_33008}" /* 신청시간 */,  plabel: "", resize: true, span: 0, type: "template",sort: true,  filter: true,  width: "auto", templateGetter: "getTime"},
			{id: "Chdat", 	 label: "{i18n>LABEL_33009}" /* 적용일 */,    plabel: "", resize: true, span: 0, type: "date",    sort: true,  filter: true,  width: "auto"},
			{id: "DoamtT",   label: "{i18n>LABEL_33010}" /* 기부금액 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"}
		],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			// 시작
			this.loadModel();
			
			var oApplyDate = new sap.m.DateRangeSelection(oController.PAGEID + "_ApplyDate", { //신청기간
                width: "210px",
                layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                delimiter: "~",
                dateValue: "{EBegda}",
                secondDateValue: "{EEndda}"
            })
			oApplyDate.addDelegate({
				onAfterRendering: function () {
					oApplyDate.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oApplyDate);
            
            var oStatusCombo = new sap.m.ComboBox({ // 처리상태
				width: "100px",
				selectedKey: "{Status}",
				items: {
					path: "/StatusCombo",
					template: new sap.ui.core.ListItem({
						key: "{Status}",
						text: "{StatusText}"
					})
				}
			});  
			
			// 키보드 입력 방지
			oStatusCombo.addDelegate({
				onAfterRendering: function () {
					oStatusCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oStatusCombo);


			var infoBox = new sap.m.HBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				items: [
					new sap.m.HBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_33002}"
							}).addStyleClass("sub-title"), // 신청 현황																			
						] 
					}) 
					.addStyleClass("info-field-group"), 				
					new sap.m.HBox({
						items: [							
							new sap.m.Button({
								press: oController.onPressReq,
								text: "{i18n>LABEL_33006}" // 신청
							})
							.addStyleClass("button-light")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("info-box");
			 
			var oApplyDateBox = new sap.m.FlexBox({
			//	justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			//	alignContent: sap.m.FlexAlignContent.End,
			//	alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [ 
					new sap.m.HBox({						
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_33003}", // 신청기간						
							}),						
							oApplyDate,
							new sap.m.Label({
								text: "{i18n>LABEL_33004}", // 처리상태				
							}),                        
                            oStatusCombo
						] 
                    }).addStyleClass("search-field-group"),                    
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressSer,
								text: "{i18n>LABEL_33005}", // 조회
							}).addStyleClass("button-search"),
						]
					})
					.addStyleClass("button-group")
				]
            }) 
			.addStyleClass("search-box search-bg pb-7px mt-16px")
            .setModel(oController.InitModel)
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
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
			
			return new PageHelper({
					contentItems: [				
					oApplyDateBox,
					infoBox,
					oTable
				]
			});
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_WORKTIME_APPL_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
