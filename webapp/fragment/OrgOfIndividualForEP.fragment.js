// sap.ui.define([], function () {
//     "use strict";

    sap.ui.jsfragment("fragment.OrgOfIndividualForEP", {
    	
        createContent: function (oController) {
        	
        	// oController.searchOrgehPernr.call(this.oController, function(o) {
         //           this.oModel.setProperty("/SearchConditions/Pernr", oController.getView().getModel("session").getData().Pernr);
         //           this.oModel.setProperty("/SearchConditions/Orgeh", "");
         //           this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt","");
         //       }.bind(this));
            oController.searchOrgehPernr(oController);
            var OrgOfIndividualHandler = oController.getOrgOfIndividualHandler();
	
            return new sap.m.VBox({
						items: [
							new sap.m.HBox({
								height: "50px",
							}),
							new sap.m.HBox({
								height: "20%",
								items: [
									new sap.m.Button({
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										icon: "sap-icon://search",
										press: OrgOfIndividualHandler.pressEmployeeSearch.bind(OrgOfIndividualHandler)
									}).addStyleClass("pl-5px"),
									new sap.m.ComboBox({
										layoutData: new sap.m.FlexItemData({ growFactor: 6 }),
										width: "98%",
										selectedKey: "{/Orgeh}",
										selectionChange: OrgOfIndividualHandler.selectOrgeh.bind(OrgOfIndividualHandler),
										items: {
											path: "/MyOrgeh",
											template: new sap.ui.core.ListItem({ key: "{Orgeh}", text: "{Orgtx}" })
										}
									}),
									new sap.m.Button({
										type: sap.m.ButtonType.Ghost,
										icon: "sap-icon://collapse-all",
										press: function () {
											OrgOfIndividualHandler.getTree().removeSelections().collapseAll().expandToLevel(1);
										}
									}),
								]
							}),
							new sap.m.ScrollContainer({
								width: "100%",
								height: "80vh",
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
							}),
						]
					})
					.setModel(OrgOfIndividualHandler.getModel());
	    }
	});
// });
