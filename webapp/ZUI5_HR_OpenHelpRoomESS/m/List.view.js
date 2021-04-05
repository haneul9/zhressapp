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
            
            var TreeBox = new sap.m.ScrollContainer(oController.PAGEID + "_TreeScroll", {
				width: "auto",
				height: "100%",
				vertical: true,
				content: [
					new sap.m.Tree(oController.PAGEID + "_Tree", {
						width: "auto",
						selectionChange: oController.onSelectTree.bind(oController),
						mode: sap.m.ListMode.SingleSelectMaster,
						items: {
							path: "/Data",
							template: new sap.m.StandardTreeItem(oController.PAGEID + "_TreeItem", {
								title: "{title}"
							}).addStyleClass("font-15px")
						}
					})
					.addStyleClass("side-navi-group")
				]
			})
			.setModel(oController.TreeModel)
			
			return new PageHelper({
				contentContainerStyleClass: "app-content-container-mobile",
				contentItems: [
					TreeBox
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
