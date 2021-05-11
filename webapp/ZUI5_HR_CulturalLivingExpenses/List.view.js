sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		 
		_colModel: [
			{id: "SpmonT", 	label: "{i18n>LABEL_21002}"/* 대상월 */,		 plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
			{id: "Apdat", 	label: "{i18n>LABEL_21003}"/* 신청일 */,		 plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
			{id: "Betrg1", label: "{i18n>LABEL_21004}"/* 신청금액(원) */,	 plabel: "", resize: true, span: 0, type: "money",  sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
			{id: "Betrg2", label: "{i18n>LABEL_21005}"/* 지원대상금액(원) */,plabel: "", resize: true, span: 0, type: "money", sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Right},
			{id: "StatusT",	label: "{i18n>LABEL_21006}"/* 처리상태 */,	  	 plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
			{id: "Notes",	label: "{i18n>LABEL_21007}"/* 반려사유 */,  	 plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "30%"},
		],
		
		getControllerName: function() {
			return $.app.APP_ID;
		},
		
		createContent: function(oController) {
			this.loadModel();
			
			var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [ 
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_21020}", 							
							})
							.addStyleClass("sub-title"), // 신청현황							

							new sap.m.HBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.HBox({
										items: [
											new sap.ui.core.Icon({
												src: "sap-icon://information"
											})
											.addStyleClass("color-icon-blue mt-1px"),
											new sap.m.Text({									
												text: {
													parts: [{ path: "EMessage" }, { path: "EMessage1" }],
													formatter: function(v1, v2) {
														if(Common.checkNull(v2)) this.addStyleClass("");
														
														return v1;
													}
												},										
												textAlign: "Begin",										
											})
											.addStyleClass("color-info-red font-14px")
										]
									}),
									new sap.m.HBox({
										items: [
											new sap.ui.core.Icon({
												src: "sap-icon://information",
												visible: {
													path: "EMessage1",
													formatter: function(v) {
														if(v) return true;
														else return false;
													}
												}
											})
											.addStyleClass("color-icon-blue mt-1px"),
											new sap.m.Text({
												text: "{EMessage1}",										
												textAlign: "Begin",										
												visible: {
													path: "EMessage1",
													formatter: function(v) {
														if(v) return true;
														else return false;
													}
												}
											})
											.addStyleClass("color-info-red font-14px message-strip")
										]
									})
									.addStyleClass("ml-0 mt-5px")
								]
							})
							.addStyleClass("ml-10px")
						]
					}).addStyleClass("info-field-group"),
					new sap.m.FlexBox({
						items: [
							new sap.m.Button(oController.PAGEID + "_onPressReqBtn", {
								press: oController.onPressReqBtn,
								text: "{i18n>LABEL_21009}", // 신청
								visible: {
									path: "EButton",
									formatter: function(v) {
										return v === "X";
									}
								}
							}).addStyleClass("button-light")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.setModel(oController.DetailModel)
			.bindElement("/LogData")
			.addStyleClass("info-box");			
			
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
			.addStyleClass("mt-10px row-link")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel); 
	
			return new PageHelper({
				contentItems: [				
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