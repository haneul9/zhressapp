$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
    "../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		_colModel: [
			{id: "ZlanguTxt", 	label: "{i18n>LABEL_29008}"/* 외국어 */,		plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "auto"},
			{id: "Begda", 		label: "{i18n>LABEL_29003}"/* 수강기간 */,		plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "20%", templateGetter:"getDateFormatter1"},
			{id: "Caldt", 		label: "{i18n>LABEL_29009}"/* 영수일자 */,	    plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true, width: "auto"},
			{id: "Zlaorg",  	label: "{i18n>LABEL_29010}"/* 수강학원 */,      plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "auto"},
			{id: "Zlangu2Txt",	label: "{i18n>LABEL_29011}"/* 수강중인 이름 */,	plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"}, 
			{id: "Suport",		label: "{i18n>LABEL_29012}"/* 지원금액 */,  	plabel: "", resize: true, span: 0, type: "money",   sort: false, filter: false, width: "auto", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Supbg",		label: "{i18n>LABEL_29013}"/* 지원기간 */,  	plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "20%", templateGetter:"getDateFormatter2"},
			{id: "StatusT",		label: "{i18n>LABEL_29014}"/* 결제상태 */,  	plabel: "", resize: true, span: 0, type: "template",  sort: false, filter: false, width: "auto", templateGetter:"getStatus"},
		],
		
		getControllerName: function() {
			return $.app.APP_ID;
		},
		
		createContent: function(oController) {
            this.loadModel();
                        
			var oApplyCombo1 = new sap.m.ComboBox(oController.PAGEID + "_YearCombo1", {
                selectedKey: "{Zyear1}",
                width: "100px",
                items: {
                    path: "/Zyears1",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-5px");

			oApplyCombo1.addDelegate({
				onAfterRendering: function () {
					oApplyCombo1.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oApplyCombo1);

			var oApplyCombo2 = new sap.m.ComboBox({
                selectedKey: "{Zmonth1}",
                width: "80px",
                items: {
                    path: "/Zmonths1",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-5px");

			oApplyCombo2.addDelegate({
				onAfterRendering: function () {
					oApplyCombo2.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oApplyCombo2);

			var oApplyCombo3 = new sap.m.ComboBox({
                selectedKey: "{Zyear2}",
                width: "100px",
                items: {
                    path: "/Zyears2",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-5px");

			oApplyCombo3.addDelegate({
				onAfterRendering: function () {
					oApplyCombo3.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oApplyCombo3);

			var oApplyCombo4 = new sap.m.ComboBox({
                selectedKey: "{Zmonth2}",
                width: "80px",
                items: {
                    path: "/Zmonths2",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-5px");

			oApplyCombo4.addDelegate({
				onAfterRendering: function () {
					oApplyCombo4.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oApplyCombo4);

			var infoBox = new sap.m.HBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				items: [
					new sap.m.HBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_29002}"
							}).addStyleClass("sub-title"), // 신청 현황																			
						] 
					}) 
					.addStyleClass("info-field-group"), 				
					new sap.m.HBox({
						items: [	
							new sap.m.Button(oController.PAGEID + "_onMenuBtn", {
								press: oController.onPressMenuBtn,
								text: "{i18n>LABEL_29006}", // 메뉴얼
							}).addStyleClass("button-light"),						
							new sap.m.Button(oController.PAGEID + "_onReqBtn", {
								press: oController.onPressReqBtn,
								text: "{i18n>LABEL_29005}", // 신청
								visible: {
									path: "/ExportData/EClose",
									formatter: function(v) {
										if(v === "X") return false;
										else return true;
									}
								}
							}).addStyleClass("button-light")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("info-box")
			.setModel(oController.TuitionSearchModel);

            
            var oApplyDateBox = new sap.m.FlexBox({
			//	justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			//	alignContent: sap.m.FlexAlignContent.End,
			//	alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.HBox({
						items: [
							//수강기간
							new sap.m.Label({ text: "{i18n>LABEL_29003}" }),
                            oApplyCombo1,
							oApplyCombo2,							
							new sap.m.Text({text : "~"}).addStyleClass("pr-12px pl-8px pt-8px"),
                            oApplyCombo3,
                            oApplyCombo4,
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [							
							new sap.m.Button(oController.PAGEID + "_onSearchBtn", {
								press: oController.onTableSearch,
								text: "{i18n>LABEL_29007}", // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
            })
			.addStyleClass("search-box search-bg pb-7px mt-16px")
            .setModel(oController.TuitionSearchModel)
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
			$.app.setModel("ZHR_BENEFIT_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	})
});