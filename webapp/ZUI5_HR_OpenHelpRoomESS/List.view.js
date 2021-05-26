sap.ui.define([
	"../common/Common",
	"../common/PageHelper"
], function (Common, PageHelper) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
	
		getControllerName: function () {
			return $.app.APP_ID;
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_COMMON_SRV");
			$.app.setModel("ZHR_BENEFIT_SRV");
		},

		createContent: function (oController) {
			
			this.loadModel();

			return new PageHelper({
				contentItems: [
					this.getMenuBox(oController)
				]
			});
		},   

		getMenuBox: function(oController) {
			var TreeBox = new sap.m.ScrollContainer(oController.PAGEID + "_TreeScroll", {
				width: "auto",
				height: "100%",
				vertical: true,
				content: [
					new sap.m.Tree(oController.PAGEID + "_Tree", {
						width: "300px",
						headerText: "{i18n>LABEL_25002}",
						selectionChange: oController.onSelectTree.bind(oController),
						//toggleOpenState: oController.onItemPress.bind(oController),
						mode: sap.m.ListMode.SingleSelectMaster,
						items: {
							path: "/Data",
							template: new sap.m.StandardTreeItem(oController.PAGEID + "_TreeItem", {
								title: "{title}"
							})
						}
					})
				]
			})
			.setModel(oController.TreeModel)
			.addStyleClass("side-navigation-box");

			var ListBox = new sap.m.FlexBox(oController.PAGEID + "_listBox", {
				width: "100%",
				direction: sap.m.FlexDirection.Column,
				fitContainer: true,
				items: [
					new sap.m.HBox({
						visible: {
							path: "/TopData/Zcomment",
							formatter: function(v) {
								return Common.checkNull(!v);
							}
						},
						fitContainer: true,
						items: [
							// 머리글
							new sap.m.Text(oController.PAGEID + "_TopText", {
								width: "100%",
								text: "{/TopData/Zcomment}",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 })
							})
						]
					}).addStyleClass("custom-OpenHelp-field"),
					// new sap.m.HBox(oController.PAGEID + "_NoDataBox", {
					// 	fitContainer: true,
					// 	visible: false,
					// 	items: [
					// 		new sap.m.Text({
					// 			width: "100%",
					// 			text: "{i18n>MSG_28001}", // 저장된 내용이 없습니다.
					// 			layoutData: new sap.m.FlexItemData({ growFactor: 1 })
					// 		})
					// 	]
					// }),
					new sap.m.FlexBox(oController.PAGEID + "_PDFBox", {
						fitContainer: true,
						width: "auto",
						// height: "600px",
						visible: {
							path: "/PDFData/Url",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						},
						items: [
							new sap.m.PDFViewer({
								displayType: sap.m.PDFViewerDisplayType.Embedded,
								source: "{/PDFData/Url}",
								sourceValidationFailed: function(oEvent) {
									oEvent.preventDefault();
								},
								layoutData: new sap.m.FlexItemData({
									growFactor: 1
								})
							})
						]
					}).addStyleClass("mt-20px"),
					new sap.m.HBox(oController.PAGEID + "_FileUploadBox", {
						alignItems: sap.m.FlexAlignItems.Center,
						fitContainer: true,
						visible: false,
						items: [
							sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
					}),
					new sap.m.FlexBox({
					//	height: "110px",
						direction: sap.m.FlexDirection.Column,
						alignItems: sap.m.FlexAlignItems.Start,
						fitContainer: true,
						visible: {
							path: "/MiddleData/Zcomment",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						},
						items: [
							// 담당자/연락처
							new sap.m.Label({ text: "{i18n>LABEL_28002}" }).addStyleClass("sub-title mt-20px"),
							new sap.m.Text(oController.PAGEID + "_MiddleText", {
								width: "100%",
								text:"{/MiddleData/Zcomment}",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 })
							}).addStyleClass("pl-6px")
						]
					}),
					new sap.m.HBox({
					//	height: "90px",
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
							}).addStyleClass("ml-5px")
						]
					}).addStyleClass("custom-OpenHelp-msgBox")
				]
			})
			.setModel(oController.OpenHelpModel)
			.addStyleClass("side-table-box");

			return new sap.m.FlexBox({
				width: "100%",				
				fitContainer: true,
				items: [    					
					TreeBox,
					new sap.m.ScrollContainer(oController.PAGEID + "_MenuScroll", {
						visible: false,		
						layoutData: new sap.m.FlexItemData({ growFactor: 1 }),									
						height: "94%",
						vertical: true,
						content: [
							ListBox
						]
					}).addStyleClass("side-contents-box")    
				]
			}).addStyleClass("side-navi-group h-90");
		}
	});
});
