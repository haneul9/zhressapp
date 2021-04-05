sap.ui.define([
	"../common/Common"
], function (Common) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "ActRecPInfo"].join(".");

	sap.ui.jsview(SUB_APP_ID, {
		getControllerName: function () {
			return SUB_APP_ID;
		},

		createContent: function (oController) {
			var oNameLayout = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_NameLayout", {
				width: "100%",
				layoutFixed: false,
				visible: false,
				columns: 1
			});
			var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
				hAlign: sap.ui.commons.layout.HAlign.Begin,
				vAlign: sap.ui.commons.layout.VAlign.Middle,
				content: [new sap.m.Label(oController.PAGEID + "_NameLayoutText", { text: "" }).addStyleClass("L2P22Font L2PFontFamilyBold")]
			}).addStyleClass("L2PPaddingHeader");
			oRow.addCell(oCell);
			oNameLayout.addRow(oRow);

			var oIconTabBar = new sap.m.IconTabBar(oController.PAGEID + "_TABBAR", {
				upperCase: true,
				select: oController.onTabSelected,
				showSelection: false,
				items: [
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub01", {
						key: "Sub01",
						text: "{i18n>LABEL_02193}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub01", oController)
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub02", {
						key: "Sub02",
						text: "{i18n>LABEL_02194}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub02", oController)
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub03", {
						key: "Sub03",
						text: "{i18n>LABEL_02195}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub03", oController)
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub04", {
						key: "Sub04",
						text: "{i18n>LABEL_02196}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub04", oController)
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub06", {
						key: "Sub06",
						text: "{i18n>LABEL_02197}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub06", oController)
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub07", {
						key: "Sub07",
						text: "{i18n>LABEL_02198}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub07", oController)
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub21", {
						key: "Sub21",
						text: "{i18n>LABEL_02281}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub21", oController)
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub22", {
						key: "Sub22",
						text: "{i18n>LABEL_02282}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub22", oController)
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub23", {
						key: "Sub23",
						text: "{i18n>LABEL_02283}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub23", oController)
					}),
					new sap.m.IconTabFilter(oController.PAGEID + "_TABFILTER_Sub24", {
						key: "Sub24",
						text: "{i18n>LABEL_02284}",
						content: sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub24", oController)
					})
				]
			});
			var oFooterBar = new sap.m.Bar(oController.PAGEID + "_FooterBar", {
				contentLeft: [
					new sap.m.Button(oController.PAGEID + "_REHIRE_BTN", {
						text: "{i18n>LABEL_02145}",
						press: oController.onPressRehireSearch,
						visible: false
					})
				],
				contentRight: [
					new sap.m.Button(oController.PAGEID + "_SAVE_BTN", {
						text: "{i18n>LABEL_02152}",
						icon: "sap-icon://save",
						press: oController.onPressSave,
						visible: false
					}),
					new sap.m.Button(oController.PAGEID + "_ADD_BTN", {
						text: "{i18n>LABEL_02025}",
						press: oController.onPressAdd,
						icon: "sap-icon://create",
						visible: false
					}),
					new sap.m.Button(oController.PAGEID + "_MODIFY_BTN", {
						text: "{i18n>LABEL_02100}",
						press: oController.onPressModify,
						icon: "sap-icon://edit",
						visible: false
					}),
					new sap.m.Button(oController.PAGEID + "_DELETE_BTN", {
						text: "{i18n>LABEL_02058}",
						press: oController.onPressDelete,
						icon: "sap-icon://delete",
						visible: false
					}),
					new sap.m.Button(oController.PAGEID + "_SINGLE_DELETE_BTN", {
						text: "{i18n>LABEL_02058}",
						icon: "sap-icon://delete",
						press: oController.onPressSingleDelete,
						visible: false
					})
				]
			});

			var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
				content: [oNameLayout, oIconTabBar],
				customHeader: new sap.m.Bar({
					contentLeft: new sap.m.Button({
						icon: "sap-icon://nav-back",
						press: oController.navToBack
					}),
					contentMiddle: new sap.m.Text(oController.PAGEID + "_PAGETITLE", {
						text: "{i18n>LABEL_02027}"
					}).addStyleClass("TitleFont"),
					contentRight: new sap.m.Button(oController.PAGEID + "_HELP", {
						icon: "sap-icon://question-mark",
						visible: false,
						press: Common.displayHelp
					})
				}).addStyleClass("L2PHeader L2pHeaderPadding"),
				footer: oFooterBar
			}).addStyleClass("WhiteBackground");

			return oPage;
		}
	});
});
