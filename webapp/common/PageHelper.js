sap.ui.define([
	"sap/m/Page"
], function (Page) {
	"use strict";

	return Page.extend("common.PageHelper", {

/*
@param o = {
	contentContainerStyleClass
	contentHeaderLeft,
	contentHeaderMiddle,
	contentHeaderRight,
	contentItems,
	idPrefix
}

@example
new common.PageHelper({
	idPrefix: "grading-",
	contentStyleClass: "sub-app-content",
	contentContainerStyleClass: "app-content-container-wide",
	contentHeaderLeft: [
		new sap.m.Text({text: "평가"}).addStyleClass("bold"),
		new sap.m.Link({text: "팀 개요", href: "#"}),
		new sap.m.Link({text: "360도 임원 평가", href: "#"}),
		new sap.m.Link({text: "도움말 및 설명서", href: "#"})
	],
	contentItems: [
		oSearchBox,
		oInfoBox,
		oTable
	],
	footer: new sap.m.Bar()
});
*/
		constructor: function(o) {

			var prefix = o.idPrefix || "",
			originals = o.originals || {},
			items = !originals.title ? [
				new sap.m.FlexBox(prefix + "app-title-container", {
					justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
					alignContent: sap.m.FlexAlignContent.Start,
					alignItems: sap.m.FlexAlignItems.Center,
					fitContainer: true,
					items: [
						o.showNavButton
							? new sap.m.FlexBox({
								alignContent: sap.m.FlexAlignContent.Start,
								alignItems: sap.m.FlexAlignItems.Center,
								fitContainer: true,
								items: [
									new sap.ui.core.Icon({
										size: "1.3125rem",
										src: "sap-icon://navigation-left-arrow",										
										press: o.navBackFunc
									}).addStyleClass("app-nav-button"),
									new sap.m.Text(prefix + "app-title", {
										text: o.title ? o.title : $.app.APP_TILE
									}).addStyleClass("app-title-mobile")
								]
							})
							: new sap.m.Text(prefix + "app-title", { text: o.title ? o.title : $.app.APP_TILE }).addStyleClass("app-title"),
						new sap.m.FormattedText(prefix + "async-spinner", {width: "24px", height: "26px", htmlText: "<em>Loading...</em>"}).addStyleClass("spinner-container"),
						o.headerButton ? o.headerButton : null
					]
				})
				.addStyleClass("app-title-container")
			] : [];

			if (o.contentItems && o.contentItems.length) {
				o.contentItems[o.contentItems.length - 1].setLayoutData(new sap.m.FlexItemData({growFactor: 1}));

				items = items.concat(o.contentItems);
			}

			Page.apply(this, [prefix + "app-content", $.extend(true, originals, {
				content: [
					new sap.m.FlexBox(prefix + "app-content-body", {
						justifyContent: sap.m.FlexJustifyContent.Center,
						fitContainer: true,
						items: [
							new sap.m.FlexBox(prefix + "app-content-container", {
								direction: sap.m.FlexDirection.Column,
								items: items
							})
							.addStyleClass(o.contentContainerStyleClass || "app-content-container-wide")
						]
					})
					.addStyleClass("app-content-body")
				]
			})]);

			if ((o.contentHeaderLeft || []).length || (o.contentHeaderMiddle || []).length || (o.contentHeaderRight || []).length) {
				var contentHeader = new sap.m.Bar(prefix + "app-content-header", {
					design: sap.m.BarDesign.Header,
					enableFlexBox: true
				})
				.addStyleClass("app-content-header");

				if ((o.contentHeaderLeft || []).length) {
					contentHeader.addContentLeft(o.contentHeaderLeft);
				}
				if ((o.contentHeaderMiddle || []).length) {
					contentHeader.addContentMiddle(o.contentHeaderMiddle);
				}
				if ((o.contentHeaderRight || []).length) {
					contentHeader.addContentRight(o.contentHeaderRight);
				}

				this.setCustomHeader(contentHeader);
			} else {
				if (!originals.showNavButton && !originals.showHeader) {
					this.setShowHeader(false);
				}
			}

			if (o.footer) {
				this.setFooter(o.footer);
			}

			this.addStyleClass(o.contentStyleClass || "app-content");
		}

	});

});