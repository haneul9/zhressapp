sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();
			
			var searchBox = new sap.m.FlexBox({
			//	justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				width: {
					path: "/vBukrs",
					formatter: function(v) {
						if(v === "1000" || v === "H600") return "70%"; 
						return "1000px";
					}
				},
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								text: {
									path: "/vBukrs",
									formatter: function (v) {
										if(v === "1000" || v === "H600") return oController.getBundleText("LABEL_14003");
										return oController.getBundleText("LABEL_14004");
									}
								}, 
							}) // 급여공제 년월
						//	.addStyleClass("font-22px mr-200px sapUiTableTr")
						] 
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							new sap.m.FlexBox({
								items: [
									new sap.m.ComboBox({
										selectedKey: "{Zyear}",
										width: {
											path: "/vBukrs",
											formatter: function(v) {
												if(v === "1000" || v === "H600") return "200px"
												return "100px"
											}
										},
										items: {
											path: "/Zyears",
											template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
										}
									})
									.addStyleClass("mr-5px"),
									new sap.m.ComboBox({
										selectedKey: "{Zmonth}",
										width: "100px",
										visible: {
											path: "/vBukrs",
											formatter: function (v) {
												if(v === "1000" || v === "H600") return false;
												return true;
											}
											
										},
										items: {
											path: "/Zmonths",
											template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
										}
									})
								]
							}).addStyleClass("search-field-group"),
							new sap.m.FlexBox({
								items: [
									new sap.m.Button({
										press: oController.onPressSearchBtn,
										text: "{i18n>LABEL_14002}" // 조회
									}).addStyleClass("button-search")
								]
							}).addStyleClass("button-group")
						]
					})
				]
			})
			.addStyleClass("search-box search-bg pb-7px mt-26px w-100")
			.setModel(oController.UsageFeeSearchModel)
			.bindElement("/Data"); 
			
			return new PageHelper({
				contentItems: [
					searchBox,
					new sap.m.FlexBox(oController.PAGEID + "_ViewFlexBox", {
						fitContainer: true,
						items: []
					})
				]
			});
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_BENEFIT_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
