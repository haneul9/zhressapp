sap.ui.define([
	"../common/Common"
], function (Common) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActAppComplete"].join(".");

	sap.ui.jsview(SUB_APP_ID, {
		
		getControllerName: function () {
			return SUB_APP_ID;
		},
		
		createContent: function (oController) {
			var oListPanel = new sap.m.Panel({
				expandable: false,
				expanded: false,
				headerToolbar: new sap.m.Toolbar({
					design: sap.m.ToolbarDesign.Auto,
					content: [
						// new sap.ui.core.Icon({ src: "sap-icon://collaborate", size: "1.0rem", color: "#666666" }),
						new sap.m.Label({ text: "{i18n>MSG_02003}" }).addStyleClass("L2PFontFamily"),
						new sap.m.ToolbarSpacer({ width: "15px" }),
						new sap.ui.core.Icon({ src: "sap-icon://accept", size: "1.0rem", color: "#8DC63F" }),
						new sap.m.Label({ text: "{i18n>LABEL_02149}" }).addStyleClass("L2PFontFamily"),
						new sap.ui.core.Icon({ src: "sap-icon://error", size: "1.0rem", color: "#F45757" }),
						new sap.m.Label({ text: "{i18n>LABEL_02150}" }).addStyleClass("L2PFontFamily"),
						new sap.ui.core.Icon({ src: "sap-icon://locked", size: "1.0rem", color: "#54585A" }),
						new sap.m.Label({ text: "{i18n>LABEL_02151}" }).addStyleClass("L2PFontFamily")
					]
				}).addStyleClass("L2PToolbarNoBottomLine"),
				content: [sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActtionSubjectList", oController)]
			});

			var oLayout = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_LAYOUT", {
				width: "100%",
				content: [new sap.ui.core.HTML({ content: "<div style='height:5px'> </div>", preferDOM: false }), oListPanel]
			});

			var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
				contentRight: [
					new sap.m.Button(oController.PAGEID + "_COMPLETE_BTN", {
						text: "{i18n>LABEL_02052}",
						press: oController.onPressComplete
					}),
					new sap.m.Button(oController.PAGEID + "_CANCEL_BTN", {
						text: "{i18n>LABEL_02048}",
						press: oController.navToBack
					})
				]
			});

			var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
				content: [oLayout],
				customHeader: new sap.m.Bar({
					contentLeft: new sap.m.Button({
						icon: "sap-icon://nav-back",
						press: oController.navToBack
					}),
					contentMiddle: new sap.m.Text({
						text: "{i18n>LABEL_02186}"
					}).addStyleClass("L2PPageTitle"),
					contentRight: new sap.m.Button(oController.PAGEID + "_HELP", {
						icon: "sap-icon://question-mark",
						visible: false,
						press: Common.displayHelp
					})
				}).addStyleClass("L2PHeaderBar"),
				footer: oFooterBar
			});

			return oPage;
		}
	});
});
