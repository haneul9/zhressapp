sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper"
], function (Common, PageHelper) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ClubApplyReturn"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "ClubApplyReturn-",
                // title: "{i18n>LABEL_10024}", // 동호회 가입신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile",
				contentItems: [
					this.getApplyReturnBox(oController)
				]
			})
		},
		
		getApplyReturnBox: function(oController) {
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10002}", design: "Bold", textAlign: "Begin" }), // 동호회
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Donghotx}",
								textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10007}", design: "Bold", textAlign: "Begin" }), // 월 회비
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Betrgtx}",
								textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10005}", design: "Bold", textAlign: "Begin" }), // 관리자
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Manager}",
								textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10006}", design: "Bold", textAlign: "Begin" }), // 연락처
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Phone}",
								textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10008}", design: "Bold", textAlign: "Begin" }), // 상태
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Statustx}",
								textAlign: "Begin"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10009}", design: "Bold", textAlign: "Begin" }), // 비고
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Bigo}",
								textAlign: "Begin"
							})
						]
					})
				]
			})
			.addStyleClass("vbox-form-mobile")
			.setModel(oController.DetailModel)
			.bindElement("/FormData");
		}
	});
});