/* eslint-disable no-undef */
sap.ui.define([
	"../../common/Common",
	"../../common/PageHelper"
], function (Common, PageHelper) {
"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "OpenHelpRoomDetail"].join($.app.getDeviceSuffix());
	
	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
        },
		
		createContent: function (oController) {
			
			return new PageHelper({
				idPrefix: "OpenHelpRoomDetail-",
                title: "{Title}",
                showNavButton: true,
				navBackFunc: oController.navBack,
				contentStyleClass: "sub-app-content",
                contentContainerStyleClass: "app-content-container-mobile custom-title-left",
				contentItems: [
					this.getDetailInputBox(oController)
				]
			})
			.setModel(oController.TreeModel)
			.bindElement("/Data")
        },
        
        getDetailInputBox: function(oController){
        	return new sap.m.FlexBox(oController.PAGEID + "_listBox", {
				width: "100%",
				direction: sap.m.FlexDirection.Column,
				fitContainer: true,
				items: [
					new sap.m.HBox({
						fitContainer: true,
						visible: {
							path: "/TopData/Zcomment",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						},
						items: [
							// 머리글
							new sap.m.Text(oController.PAGEID + "_TopText", {
								width: "100%",
								text:"{/TopData/Zcomment}",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 })
							}).addStyleClass("custom-OpenHelp-field")
						]
					}),
					new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Center,
						fitContainer: true,
						visible: {
							path: "/PDFFileData",
							formatter: function(v) {
								return Common.checkNull(!v);
							}
						},
						items: [
							fragment.COMMON_ATTACH_FILES.renderer(oController,"001")
						]
					}),
					new sap.m.HBox(oController.PAGEID + "_FileBox", {
						alignItems: sap.m.FlexAlignItems.Center,
						fitContainer: true,
						items: [
							fragment.COMMON_ATTACH_FILES.renderer(oController,"002")
						]
					}),
					new sap.m.FlexBox({
						fitContainer: true,
						direction: sap.m.FlexDirection.Column,
						alignItems: sap.m.FlexAlignItems.Start,
						visible: {
							path: "/MiddleData/Zcomment",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						},
						items: [
							// 담당자/연락처
							new sap.m.Label({ text: "{i18n>LABEL_28002}" }).addStyleClass("sub-title"),
							new sap.m.Text(oController.PAGEID + "_MiddleText", {
								width: "100%",
								text:"{/MiddleData/Zcomment}",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 })
							}).addStyleClass("pl-6px")
						]
					}).addStyleClass("mt-16px"),
					new sap.m.HBox({
						fitContainer: true,
						visible: {
							path: "/BottomData/Zcomment",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						},
						items: [
							// 바닥글
							new sap.m.Text(oController.PAGEID + "_BottomText", {
								width: "100%",
								text:"{/BottomData/Zcomment}",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 })
							}).addStyleClass("custom-OpenHelp-msgBox")
						]
					}),
					new sap.m.FlexBox({
						fitContainer: true,
						direction: sap.m.FlexDirection.Column,
						alignItems: sap.m.FlexAlignItems.Start,
						visible: {
							path: "/UrlData",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						},
						items: [
							// 화면 Link
							new sap.m.Label({ text: "{i18n>LABEL_25019}" }).addStyleClass("sub-title"),
							new sap.m.Link({
								width: "100%",
								text:"{/UrlData}",
								href:"{/UrlData}"
							}).addStyleClass("pl-6px")
						]
					}).addStyleClass("mt-16px")
				]
			})			
			.setModel(oController.OpenHelpModel);
        }
	});
});