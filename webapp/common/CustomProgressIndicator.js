sap.ui.define([
	"sap/m/FlexBox"
], function (FlexBox) {
	"use strict";

	return FlexBox.extend("common.CustomProgressIndicator", {

		/*
			@param o = {
				contentContainerStyleClass
				contentHeaderLeft,
				contentHeaderMiddle,
				contentHeaderRight,
				contentItems,
			}

			@example
			new common.PageHelper({
				contentContainerStyleClass: "app-content-container-wide",
				contentHeaderLeft: [
					new sap.m.Text({text: "평가"}).addStyleClass("bold"),
					new sap.m.Link({text: "팀 개요", href: "#"}),
					new sap.m.Link({text: "360도 임원 평가", href: "#"}),
					new sap.m.Link({text: "도움말 및 설명서", href: "#"})
				],
				contentItems: [
					searchBox,
					infoBox,
					oTable
				]
			});
		 */
		constructor: function(o) {

			FlexBox.apply(this, [{
				width: o.width || "220px",
				direction: sap.m.FlexDirection.Column,
				items: [
					new sap.m.Text({text: o.title})
					.addStyleClass("cpi-title ml-3px"),
					new sap.m.ProgressIndicator(o.id, {
						height: o.height || "20px",
						percentValue: o.percentValue,
						displayValue: o.displayValue
					})
					.addStyleClass("cpi-body " + (o.percentStyleClass || "")),
					new sap.m.FlexBox({
						alignItems: sap.m.FlexAlignItems.End,
						items: [
							new sap.m.Text({text: o.infoValue}).addStyleClass("cpi-info-value " + (o.infoValueStyleClass || "")),
							new sap.m.FormattedText({htmlText: o.infoText || ""}).addStyleClass("cpi-info-text ml-10px " + (o.infoTextStyleClass || ""))
						]
					})
					.addStyleClass("ml-3px")
				]
			}]);

			this.addStyleClass("custom-progress-indicator");
		}

	});

});