sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsfragment("ZUI5_HR_Companyhouse.fragment.HousingfeeUrl", {
		createContent: function (oController) {
			var oPDFView = new sap.m.FlexBox(oController.PAGEID + "_PDFFlexBox", {
			fitContainer: true,
			width: "100%",
			height: "1200px",
			items: [
				new sap.m.PDFViewer(oController.PAGEID + "_PDFViewer1", {
					source: "{rPDFView}",
					sourceValidationFailed: function(oEvent) {
						oEvent.preventDefault();
					},
					layoutData: new sap.m.FlexItemData({
						growFactor: 1
					})
				})
			]
		})
			.addStyleClass("mt-20px")
			.setModel(oController.PDFViewModel)
			.bindElement("/Data");
			
		return oPDFView;
		}
	});
});