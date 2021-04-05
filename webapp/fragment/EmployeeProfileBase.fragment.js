sap.ui.jsfragment("commonFragment.EmployeeProfileBase", {
	createContent: function (oController) {
		var oRow, oCell;
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns: 4,
			widths: ["20%", "30%", "20%", "30%"]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "영문성명", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Enname}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "한자성명", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Cnname}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "직무", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Stelltx}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "코스트센터" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Kostltx}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "입사구분", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Zzenttx}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "사회진출일" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Sctda}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			hAlign : "Center",
		//			content : new sap.m.Label({text : "인정년차", required : false}).addStyleClass("L2PFontFamily")
		//		}).addStyleClass("L2PMatrixLabel2");
		//		oRow.addCell(oCell);
		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			content : new sap.m.Text({text : "{Zzappjg}"}).addStyleClass("L2PFontFamily")
		//		}).addStyleClass("L2PMatrixData");
		//		oRow.addCell(oCell);
		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			hAlign : "Center",
		//			content : new sap.m.Label({text : "현직급인정년차"}).addStyleClass("L2PFontFamily")
		//		}).addStyleClass("L2PMatrixLabel2");
		//		oRow.addCell(oCell);
		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			content :new sap.m.Text({text : "{Zzappjgc}"}).addStyleClass("L2PFontFamily")
		//		}).addStyleClass("L2PMatrixData");
		//		oRow.addCell(oCell);
		//		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "직급년차", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Wrkprd}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "P.G 승급년차" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Pgprd}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		//		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			hAlign : "Center",
		//			content : new sap.m.Label({text : "사업장", required : false}).addStyleClass("L2PFontFamily")
		//		}).addStyleClass("L2PMatrixLabel2");
		//		oRow.addCell(oCell);
		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			content : new sap.m.Text({text : "{Zzworkt}"}).addStyleClass("L2PFontFamily")
		//		}).addStyleClass("L2PMatrixData");
		//		oRow.addCell(oCell);
		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			hAlign : "Center",
		//			content : new sap.m.Label({text : ""}).addStyleClass("L2PFontFamily")
		//		}).addStyleClass("L2PMatrixLabel2");
		//		oRow.addCell(oCell);
		//		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
		//			content :new sap.m.Text({text : ""}).addStyleClass("L2PFontFamily")
		//		}).addStyleClass("L2PMatrixData");
		//		oRow.addCell(oCell);
		//		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "노조가입여부", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Unnyn}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "노조직책" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Unndutx}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "휴직사유", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Inacttx}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "휴직기간" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Inactprd}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "퇴직일", required: false }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Retda}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: "Center",
			content: new sap.m.Label({ text: "퇴직사유" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixLabel2");
		oRow.addCell(oCell);
		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			content: new sap.m.Text({ text: "{Retrsn}" }).addStyleClass("L2PFontFamily")
		}).addStyleClass("L2PMatrixData");
		oRow.addCell(oCell);
		oMatrix.addRow(oRow);

		oMatrix.addStyleClass("sapUiSizeCompact");
		oMatrix.bindElement("/Data/0");

		return oMatrix;
	}
});
