sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("fragment.OrgOfIndividual", {
        createContent: function (oController) {
            var OrgOfIndividualHandler = oController.getOrgOfIndividualHandler();

            return new sap.m.Dialog("OrgOfIndividualDialog", {
				showHeader: true,
				title: "{i18n>LABEL_00195}",	// 조직도
                contentWidth: "500px",
                contentHeight: "48%",
				draggable: true,
				verticalScrolling: false,
                content: [
					new sap.m.VBox({
						items: [
							new sap.m.HBox({
								height: "20%",														
								items: [
									new sap.m.Button({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										icon: "sap-icon://search",
										press: OrgOfIndividualHandler.pressEmployeeSearch.bind(OrgOfIndividualHandler)
									}).addStyleClass("button-search-icon"),
									new sap.m.ComboBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 15 }),
										width: "100%",
										selectedKey: "{/Orgeh}",
										selectionChange: OrgOfIndividualHandler.selectOrgeh.bind(OrgOfIndividualHandler),
										items: {
											path: "/MyOrgeh",
											template: new sap.ui.core.ListItem({ key: "{Orgeh}", text: "{Orgtx}" })
										}
									})
								]
							}).addStyleClass("custom-org-bg"),
							
							new sap.m.ScrollContainer({
								width: "100%",
								height: "41vh",   
								vertical: true,
								content: [
									new sap.m.Tree("OrganizationTree", {
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										mode: sap.m.ListMode.SingleSelectMaster,
										toggleOpenState: OrgOfIndividualHandler.onToggleOpenState.bind(OrgOfIndividualHandler),
										selectionChange: OrgOfIndividualHandler.selectTreeItem.bind(OrgOfIndividualHandler),
										items: {
											path: "/TreeData",
											template: new sap.m.StandardTreeItem({ icon: "{ref}", title: "{Stext}" })
										}
									})
								]
							}).addStyleClass("custom-org-tree")
						]
					})
				],
				// beginButton: [
				// 	new sap.m.Button({
				// 		type: sap.m.ButtonType.Ghost,
				// 		icon: "sap-icon://collapse-all",
				// 		press: function () {
				// 			OrgOfIndividualHandler.getTree().removeSelections().collapseAll().expandToLevel(1);
				// 		}
				// 	})
				// ],
				endButton: [
					new sap.m.Button({
						type: sap.m.ButtonType.Default,
						text: oController.getBundleText("LABEL_00133"), // 닫기
						press: function () {
							OrgOfIndividualHandler.getDialog().close();
						}
					}).addStyleClass("button-default")
				]
			})		
			.addStyleClass("custom-org-area")	
			.setModel(OrgOfIndividualHandler.getModel())
			.addDelegate({
				onAfterRendering: function () {
					$("#sap-ui-blocklayer-popup").hide();
				}
			});
        }
    });
});
