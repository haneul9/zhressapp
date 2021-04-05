sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper"
], function (Common, PageHelper) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ClubApplying"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "ClubApplying-",
                title: "{i18n>LABEL_10024}", // 동호회 가입신청
                showNavButton: true,
				navBackFunc: oController.navBack,
				headerButton: new sap.m.FlexBox({
					items: [
						new sap.m.Button({
							press: $.proxy(oController.onPressCancel, oController),
							text: "{i18n>LABEL_10035}", // 신청취소
						}).addStyleClass("button-light app-nav-button-right")
					]
				}),
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile",
				contentItems: [
					this.getApplyingBox(oController)
				]
			})
		},
		
		getApplyingBox: function(oController) {
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10002}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 동호회
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Donghotx}",
								textAlign: "End",
								width: "100%"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10007}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 월 회비
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Betrgtx}",
								textAlign: "End",
								width: "100%"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10005}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 관리자
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Manager}",
								textAlign: "End",
								width: "100%"
							}).addStyleClass("line-height-22px")
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10006}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 연락처
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Phone}",
								textAlign: "End",
								width: "100%"
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10008}", textAlign: "Begin" }).addStyleClass("sub-conRead-title"), // 상태
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Statustx}",
								textAlign: "End",
								width: "100%"
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