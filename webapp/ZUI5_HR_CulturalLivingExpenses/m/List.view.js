sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();
			
			var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Column,
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_21020}" // 문화생활비 신청							
							})
							.addStyleClass("sub-title"),
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({										
										text: "{EMessage}",
										textAlign: "Begin"
									})
									.addStyleClass("color-info-red font-12px"),
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
									.addStyleClass("color-info-red font-12px")
								]
							})
						]
					}),
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
							})
						]
					})
					.addStyleClass("button-group")
				]
			})
			.setModel(oController.DetailModel)
			.bindElement("/LogData")
			.addStyleClass("info-box"); 
			
			var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
				inset: false,
				rememberSelections: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				mode: sap.m.ListMode.SingleSelectMaster,
				itemPress: oController.onSelectedRow.bind(oController),
				columns: [
					new sap.m.Column({
						width: "20%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "20%",
						hAlign: sap.ui.core.TextAlign.End
					}),
					new sap.m.Column({
						width: "auto",
						hAlign: sap.ui.core.TextAlign.Begin
					})
				],    
				items: {
					path: "/Data",
					template: new sap.m.ColumnListItem({
						type: sap.m.ListType.Active,
						counter: 5,
						cells: [
							new sap.m.Text({
								text: "{SpmonT}", //대상월
								textAlign: "Begin"
							}).addStyleClass("L2P13Font"),
							new sap.m.Text({
								text: {
									path: "Betrg2",
									formatter: function(v) {
										return (v) ? Common.numberWithCommas(v) + " 원" : "0 원";
									} 
								},
								textAlign: "End"
							}).addStyleClass("L2P13Font mr-10px"),
							new sap.m.Text({
								text: "{StatusT}",
								textAlign: "Begin"
							}).addStyleClass("L2P13Font")
						]
					})
				}
			})
			.addStyleClass("mt-8px")
			.setModel(oController.TableModel);
			
			return new PageHelper({
				contentContainerStyleClass: "app-content-container-mobile",
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
	});
});
