sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.Notice1Dialog", {
	/**
	 * @memberOf zui5_hrxx_actapp2.fragment.Notice1Dialog
	 */

	createContent: function (oController) {
		var oCell = null;

		var oNoticeLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 1
		});

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>MSG_02135}" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oNoticeLayout.createRow(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>MSG_02136}" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oNoticeLayout.createRow(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oNoticeLayout.createRow(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "{i18n>LABEL_02336}" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft10");
		oNoticeLayout.createRow(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "- °ËÁø : ¾ÈÀüº¸°ÇÆÀ ÇÏÁÖÇö ´ë¸®(032-211-1345)" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft2rem");
		oNoticeLayout.createRow(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "- ±³À° : ¾ÈÀüº¸°ÇÆÀ ½Å±¤½Ä Â÷Àå(032-211-1332)" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PPaddingLeft2rem");
		oNoticeLayout.createRow(oCell);

		var oDialog = new sap.m.Dialog({
			content: oNoticeLayout,
			contentWidth: "500px",
			contentHeight: "200px",
			showHeader: true,
			title: "{i18n>LABEL_02093}",
			beginButton: new sap.m.Button({
				text: "{i18n>LABEL_02053}",
				icon: "sap-icon://accept",
				press: oController.onConfirmNotice
			}),
			endButton: new sap.m.Button({
				text: "{i18n>LABEL_02048}",
				icon: "sap-icon://sys-cancel-2",
				press: oController.onNDClose
			})
		});

		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
