sap.ui.define([
	"common/PageHelper"
], function (PageHelper) {
	"use strict";

	sap.ui.jsview($.app.APP_ID, {
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			return new PageHelper({
				contentContainerStyleClass: "app-content-container-mobile",
				contentItems: [
					this.buildInfoText(),
					this.buildTable(oController)
				]
			}).setModel(oController.oModel);
		},

		buildInfoText: function() {
			return new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.MessageStrip({
								text: "{i18n>MSG_07009}", // 해당 평가연도 클릭 시, 자세한 평가결과를 확인 가능합니다. (2020년 이후)
								customIcon: "sap-icon://information",
								showIcon: true,
								type: sap.ui.core.MessageType.Information
							}).addStyleClass("ml-0px")
						]
					})
				]
			}).addStyleClass("info-box");
		},
		
		buildTable: function(oController) {
			return new sap.m.Table("historyTable", {
				inset: false,
				rememberSelections: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 10,
				mode: sap.m.ListMode.SingleSelectMaster,
				itemPress: oController.onPressResvRow.bind(oController),
				columns: [
					new sap.m.Column({
						width: "20%",
						hAlign: sap.ui.core.TextAlign.Center,
						header: new sap.m.Text({text: "{i18n>LABEL_07310}"})
					}),
					new sap.m.Column({
						width: "20%",
						hAlign: sap.ui.core.TextAlign.Center,
						header: new sap.m.Text({text: "{i18n>LABEL_07306}"})
					}),
					new sap.m.Column({
						width: "20%",
						hAlign: sap.ui.core.TextAlign.Center,
						header: new sap.m.Text({text: "{i18n>LABEL_07308}"})
					}),
					new sap.m.Column({
						width: "20%",
						hAlign: sap.ui.core.TextAlign.Center,
						header: new sap.m.Text({text: "{i18n>LABEL_07307}"})
					}),
					new sap.m.Column({
						width: "20%",
						hAlign: sap.ui.core.TextAlign.Center,
						header: new sap.m.Text({text: "{i18n>LABEL_07309}"})
					})
				],
				items: {
					path: "/List",
					template: new sap.m.ColumnListItem({
						type: sap.m.ListType.Active,
						counter: 10,
						cells: [
							new sap.m.Text({ text: "{Appye}" }),
							new sap.m.Text({ text: "{Grade7}" }),
							new sap.m.Text({ text: "{Grade2}" }),
							new sap.m.Text({ text: "{Grade1}" }),
							new sap.m.Text({ text: "{Grade6}" })
						]
					})
				}
			});
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_COMMON_SRV");
			$.app.setModel("ZHR_APPRAISAL_SRV");
		}
	});
});
