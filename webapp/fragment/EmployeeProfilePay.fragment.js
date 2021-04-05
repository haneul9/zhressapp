sap.ui.jsfragment("commonFragment.EmployeeProfilePay", {
	createContent: function (oController) {
		var oRow, oCell;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns: 4,
			widths: ["20%", "30%", "20%", "30%"]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "통상시수", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Paytx}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "급여계좌", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Acctno1}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "비용계좌", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Acctno2}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "법인카드" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Cardno}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "수습율(%)", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Prbrt}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "고용보험" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Lbiyn}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "상여예외자", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Exbontx}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "주재원구분" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Resyntx}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "근속수당기준일", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Srvda}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "연차기준일" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Holda}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "노조회비공제", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Unded}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "우수리공제" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Wooded}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "중도입사연차", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Midhq}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "국민연금퇴직전환금" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Nappr}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "퇴직금기산일", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Recda}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "중간정산횟수" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Midadj}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oMatrix.addStyleClass("sapUiSizeCompact");
		oMatrix.bindElement("/Data/0");

		return oMatrix;
	}
});
