sap.ui.define([
	"common/EmpBasicInfoBox",
	"common/EmployeeModel",
	"sap/m/Page"
], function(
	EmpBasicInfoBox,
	EmployeeModel,
	Page
) {
"use strict";

return Page.extend("common.PageHelper", {

/*
@param o = {
	idPrefix,
	hideEmpInfoBox,
	contentContainerStyleClass,
	contentHeaderLeft,
	contentHeaderMiddle,
	contentHeaderRight,
	contentItems
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
		items;

		if (!originals.title) {
			var titleItems;
			if (o.showNavButton) {
				titleItems = [
					new sap.m.FlexBox({
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
				];
			} else {
				titleItems = [
					new sap.m.Text(prefix + "app-title", { text: o.title ? o.title : $.app.APP_TILE }).addStyleClass("app-title")
				];
			}

			titleItems.push(new sap.m.FormattedText(prefix + "async-spinner", {width: "24px", height: "26px", htmlText: "<em>Loading...</em>"}).addStyleClass("spinner-container"));

			if (o.headerButton) {
				titleItems.push(o.headerButton);
			}

			try {
				o.hideEmpInfoBox = typeof o.hideEmpInfoBox !== 'undefined' ? o.hideEmpInfoBox : false;

				if ((!sap.ui.Device.system.phone && !sap.ui.Device.system.tablet) && parent && window._use_emp_info_box === true && !o.hideEmpInfoBox) {
					window._CommonEmployeeModel = new EmployeeModel();
					window._CommonEmployeeModel.retrieve();

					titleItems.push(new EmpBasicInfoBox(window._CommonEmployeeModel));
				}
			} catch(e) {
				// SF 평가 메뉴 접속시 parent 객체 참조시 cross-origin 오류 발생
			}

			items = [
				new sap.m.FlexBox(prefix + "app-title-container", {
					justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
					alignContent: sap.m.FlexAlignContent.Start,
					alignItems: sap.m.FlexAlignItems.Center,
					fitContainer: true,
					items: titleItems
				})
				.addStyleClass("app-title-container")
			];
		} else {
			items = [];
		}

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