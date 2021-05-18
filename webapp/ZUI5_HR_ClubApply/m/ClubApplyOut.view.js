sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper"
], function (Common, PageHelper) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ClubApplyOut"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "ClubApplyOut-",
                // title: "{i18n>LABEL_10033}", // 동호회 가입현황
                showNavButton: true,
				navBackFunc: oController.navBack,
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile",
				contentItems: [
					this.getApplyOutInfoBox(oController)
				]
			})
		},
		
		getApplyOutInfoBox: function(oController) {
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10002}", design: "Bold", textAlign: "Begin" }).addStyleClass("sub-con-title"), // 동호회
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
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10034}", design: "Bold", textAlign: "Begin" }).addStyleClass("sub-con-title"), // 가입일
							new sap.ui.commons.TextView({
								text: {
									parts: [{ path: "Begda" }, { path: "Endda" }],
									formatter: function (v1, v2) {
										if (!v1 || !v2) {
											return "";
										}
										
										return Common.DateFormatter(v1) + " ~ " + Common.DateFormatter(v2);
									}
								},
								textAlign: "Center"
							}).addStyleClass("font-14px font-regular")
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10007}", design: "Bold", textAlign: "Begin" }).addStyleClass("sub-con-title"), // 월 회비
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
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10005}", design: "Bold", textAlign: "Begin" }).addStyleClass("sub-con-title"), // 관리자
							new sap.m.Text({
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								text: "{Manager}",
								textAlign: "End",
								width: "100%"
							}).addStyleClass("line-height-22px pt-10px") /* 2줄일 경우 적용 */
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10006}", design: "Bold", textAlign: "Begin" }).addStyleClass("sub-con-title"), // 연락처
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
							new sap.m.Label({ width: "105px", text: "{i18n>LABEL_10008}", design: "Bold", textAlign: "Begin" }).addStyleClass("sub-con-title"), // 상태
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