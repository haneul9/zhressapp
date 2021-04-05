sap.ui.jsfragment("fragment.EmployeeProfile", {
	createContent: function (oController) {
		var oBasicInfoLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_BasicInfoLayout", {
			width: "100%",
			content: [new sap.m.Text({ text: "asfddsaf" })]
		});
		//
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
					icon: "sap-icon://full-screen"
					//							press : oController.onFullScreen
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

		var oHeaderTitle = new sap.uxap.ObjectPageHeader(oController.PAGEID + "_ObjectHeader", {
			isObjectIconAlwaysVisible: false,
			isObjectTitleAlwaysVisible: false,
			isObjectSubtitleAlwaysVisible: false,
			objectImageURI: "{Ephotourl}",
			objectImageDensityAware: false,
			//			objectTitle : "{Head1}",
			objectImageShape: sap.uxap.ObjectPageHeaderPictureShape.Circle
			//		    objectImageAlt : "{Head1}",
			//	    	objectSubtitle : "{Head1}"
		});

		var oHeaderContent1 = new sap.ui.layout.VerticalLayout({
			content: [
				new sap.m.Link({
					text: "+33 6 4512 5158"
				}),
				new sap.m.Link({
					text: "DeniseSmith@sap.com"
				})
			]
		});

		var oHeaderContent = new sap.uxap.ObjectPageHeaderContent({
			content: oHeaderContent1
		});

		var oSubSection1 = new sap.uxap.ObjectPageSubSection({
			title: "Connect",
			titleUppercase: true,
			mode: "Collapsed",
			blocks: [
				new sap.m.Text({ text: "test" }),
				new sap.m.Text({ text: "test" }),
				new sap.m.Text({ text: "test" }),
				new sap.m.Text({ text: "test" })
			]
		});

		var oSubSection2 = new sap.uxap.ObjectPageSubSection({
			title: "Connect2",
			titleUppercase: true,
			mode: "Collapsed",
			blocks: [new sap.m.Text({ text: "test2" })]
		});

		var oObjectSection1 = new sap.uxap.ObjectPageSection({
			title: "경력정보",
			importance: "Medium",
			subSections: [oSubSection1, oSubSection2]
		});

		var oSubSection3 = new sap.uxap.ObjectPageSubSection({
			title: "신상정보",
			titleUppercase: true,
			mode: "Collapsed",
			blocks: [new sap.m.Text({ text: "신상정보1" }), new sap.m.Text({ text: "신상정보2" })]
		});

		var oObjectSection2 = new sap.uxap.ObjectPageSection({
			title: "신상정보",
			importance: "Medium",
			subSections: [oSubSection3]
		});

		var oObjectSection3 = new sap.uxap.ObjectPageSection({
			title: "인재정보",
			importance: "Medium"
		});

		var oObjectPageLayout = new sap.uxap.ObjectPageLayout(oController.PAGEID + "_ObjectPageLayout", {
			enableLazyLoading: false,
			showTitleInHeaderContent: true,
			alwaysShowContentHeader: true,
			headerTitle: oHeaderTitle,
			headerContent: oHeaderContent,
			sections: [oObjectSection1, oObjectSection2, oObjectSection3]
		});

		return oObjectPageLayout;
	}
});
