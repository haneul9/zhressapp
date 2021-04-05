jQuery.sap.require("common.Formatter");
jQuery.sap.require("common.Common");

sap.ui.jsfragment("fragment.EmpProfilePopover", {
	createContent: function (oController) {
		var oProfileMatrix = new sap.ui.commons.layout.MatrixLayout({
			width: "320px",
			columns: 2,
			widths: ["3.5rem"]
		}).addStyleClass("L2PBackgroundWhite L2PMarginTop10");

		var oCell0 = null,
			oCell1 = null,
			oRow = null;

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: new sap.m.Image(oController.PAGEID + "_EP_PHOTO", { src: "", width: "3rem", height: "3rem" })
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");

		oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: [
				new sap.m.Text(oController.PAGEID + "_EP_ENAME", { text: "" }).addStyleClass(
					"L2PQViewEmpName sapMTextLineClamp sapMTextMaxLine"
				)
			]
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0, oCell1);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Text(oController.PAGEID + "_EP_FULLN", { text: "" }).addStyleClass("L2PQViewData1")]
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height: "55px" });
		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Bottom,
			colSpan: 2,
			content: [new sap.m.Text({ text: "{i18n>LABEL_00163}" }).addStyleClass("L2PQViewSubTitle")]	// 연락처 세부사항
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oRow.addCell(oCell0);
		oProfileMatrix.addRow(oRow);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Text({ text: "{i18n>LABEL_00164}" }).addStyleClass("L2PQViewLabel")]	// 휴대폰
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Link(oController.PAGEID + "_EP_CELNO", { text: "" }).addStyleClass("L2PQViewData")]
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Text({ text: "{i18n>LABEL_00165}" }).addStyleClass("L2PQViewLabel")]	// 전화번호
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Text(oController.PAGEID + "_EP_TELNO", { text: "" }).addStyleClass("L2PQViewData")]
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Text({ text: "개인e-mail" }).addStyleClass("L2PQViewLabel")]
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Link(oController.PAGEID + "_EP_EMAIL", { text: "" }).addStyleClass("L2PQViewData")]
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height: "45px" });
		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Bottom,
			colSpan: 2,
			content: [new sap.m.Text({ text: "{i18n>LABEL_00166}" }).addStyleClass("L2PQViewSubTitle")]	// 회사
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oRow.addCell(oCell0);
		oProfileMatrix.addRow(oRow);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Text({ text: "{i18n>LABEL_00167}" }).addStyleClass("L2PQViewLabel")]	// 회사명
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Text(oController.PAGEID + "_EP_PBTXT", { text: "" }).addStyleClass("L2PQViewData")]
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Text({ text: "{i18n>LABEL_00168}" }).addStyleClass("L2PQViewLabel")]	// 주소
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		oCell0 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			colSpan: 2,
			content: [new sap.m.Text(oController.PAGEID + "_EP_ZZEMPWPTX", { text: "" }).addStyleClass("L2PQViewData1")]
		}).addStyleClass("L2PQViewCell L2PPaddingLeft10");
		oProfileMatrix.createRow(oCell0);

		var oPopover = new sap.m.Popover(oController.PAGEID + "_EP_Popover", {
			title: "{i18n>LABEL_00169}",	// 사원요약프로파일
			placement: sap.m.PlacementType.Auto,
			content: oProfileMatrix,
			contentWidth: "450px",
			beforeOpen: oController.onBeforeOpenPopoverEmpProfile,
			beginButton: null,
			endButton: new sap.m.Button({
				icon: "sap-icon://sys-cancel-2",
				press: function (oEvent) {
					oEvent.getSource().getParent().getParent().close();
				}
			})
		});

		if (!jQuery.support.touch) {
			// apply compact mode if touch is not supported
			oPopover.addStyleClass("sapUiSizeCompact");
		}

		return oPopover;
	}
});
