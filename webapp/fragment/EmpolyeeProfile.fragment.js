sap.ui.jsfragment("fragment.EmpolyeeProfile", {
	createContent: function (oController) {
		var oBasicInfoLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_BasicInfoLayout", {
			width: "100%",
			content: []
		});

		var oMasterTabMenuLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_MasterTabMenuLayout", {
			width: "100%",
			content: []
		}).addStyleClass("L2PDisplayBlock");

		var oSubTabMenuLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_SubTabMenuLayout", {
			width: "100%",
			visible: false,
			content: []
		});

		//		var oPersonListToolbar = new sap.m.Toolbar(oController.PAGEID + "_DHtmlxTableToolBar", {
		//			width : "100%",
		//			content : [new sap.m.Button({
		//							icon : "sap-icon://full-screen",
		//							press : oController.onFullScreen
		//						})],
		//	    }).addStyleClass("L2PToolbarNoBottomLine");

		var oSubLayout = new sap.m.Toolbar({
			width: "100%",
			content: [
				oSubTabMenuLayout,
				new sap.m.ToolbarSpacer(),
				new sap.m.Button(oController.PAGEID + "_DHtmlxTableToolBar", {
					icon: "sap-icon://full-screen",
					press: oController.onFullScreen
				})
			]
		}).addStyleClass("L2PToolbarNoBottomLine");

		var oDHtmlxTable = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_DHtmlxTable", {
			width: "100%"
		});

		var oDataSetLayout = new sap.m.ScrollContainer(oController.PAGEID + "_DataSetLayout", {
			width: "100%",
			vertical: true,
			height: window.innerHeight - 430 + "px"
		});

		var oDetailInfoLayout = new sap.m.Panel(oController.PAGEID + "_DetailInfoLayout", {
			expandable: false,
			expanded: false,
			content: [
				oSubLayout,
				new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
				oDHtmlxTable,
				oDataSetLayout
			]
		});

		var oEmployeeLayout = new sap.m.Panel(oController.PAGEID + "_EmployeeLayout", {
			expandable: false,
			expanded: false,
			content: [
				oBasicInfoLayout,
				new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }),
				oMasterTabMenuLayout,
				oDetailInfoLayout
			]
		});

		return oEmployeeLayout;
	}
});
