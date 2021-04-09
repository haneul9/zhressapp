sap.ui.define([
	"common/Common"
], function (Common) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_Pass.m.fragment.FacilityList", {

		createContent: function (oController) {

			var oModel = oController.getFacilityHandler().Model();

			return new sap.m.FlexBox({
				direction: sap.m.FlexDirection.Column,
				items: [
					this.getSearchBox(oController),
					this.getRequestInfoBox(),
					this.getRequestList(oController),
					this.getInfoBox(),
					this.getList(oController)
				]
			})
			.setModel(oModel);
		},

		getSearchBox: function(oController) {
			var FacilityHandler = oController.getFacilityHandler();

			return new sap.m.FlexBox({
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						// 검색
						items: [
							new sap.m.FlexBox({
								items: [
									new sap.m.ComboBox({
										selectedKey: "{Zyear}",
										items: {
											path: "/Zyears",
											template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
										}
									}).addStyleClass("w-120px"),
									new sap.m.ComboBox({
										selectedKey: "{Facty}",
										items: {
											path: "/Factys",
											template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
										}
									}).addStyleClass("ml-10px")
								]
							}).addStyleClass("search-field-group"),
							new sap.m.FlexBox({
								items: [
									new sap.m.Button({
										press: FacilityHandler.search.bind(FacilityHandler),
										icon : "sap-icon://search"										
									//	text: "{i18n>LABEL_09012}" // 조회
									}).addStyleClass("button-search")
								]
							}).addStyleClass("button-group")
						]
					}) // 검색
				]
			})
			.addStyleClass("search-box-mobile h-auto")
			.bindElement("/SearchConditions");
		},

		getRequestInfoBox: function() {
			return new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_09014}"
							}).addStyleClass("sub-title") // 신청내역
						]
					})
				]
			}).addStyleClass("info-box");
		},

		getRequestList: function(oController) {
			return new sap.m.Table({
				inset: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				columns: [
					new sap.m.Column({
						width: "35%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "45%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						hAlign: sap.ui.core.TextAlign.Begin
					})
				],
				items: {
					path: "/MyList",
					template: new sap.m.ColumnListItem({
						counter: 5,
						cells: [
							new sap.m.Text({
								text: {
									path: "Usday",
									formatter: function(v) {
										return (v) ? Common.DateFormatter(v) : "";
									}
								},
								textAlign: "Begin"
							}).addStyleClass("L2P13Font"),
							new sap.m.Text({
								text: {
									parts: [
										{path: "Reqno"},
										{path: "Resno"}
									],
									formatter: function(v1, v2) {
										// 신청${v1}/예약${v2}
										return oController.getBundleText("LABEL_09061").interpolate(v1 || "0", v2 || "0");
									}
								},
								textAlign: "Begin"
							}).addStyleClass("L2P13Font"),
							new sap.m.Text({
								text: "{StatusT}",
								textAlign: "Begin"
							}).addStyleClass("L2P13Font")
						]
					})
				}
			});
		},

		getInfoBox: function() {
			return new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_09015}"
							}).addStyleClass("sub-title") // 이용신청
						]
					})
				]
			}).addStyleClass("info-box");
		},

		getList: function(oController) {
			var FacilityHandler = oController.getFacilityHandler();

			return new sap.m.Table({
				inset: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				columns: [
					new sap.m.Column({
						width: "35%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "45%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						hAlign: sap.ui.core.TextAlign.Begin
					})
				],
				items: {
					path: "/RequestList",
					template: new sap.m.ColumnListItem({
						counter: 5,
						cells: [
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({ 
										text: {
											path: "Usday",											
											formatter: function(v) {
												return (v) ? Common.DateFormatter(v) : "";
											}
										}
									}),
									new sap.m.Text({ text: "{UstypT}" })
								]
							}),
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({ 
										text: {
											path: "Rvacf",
											formatter: function(v) {
												// ${v}매 신청가능
												return oController.getBundleText("LABEL_09062").interpolate(v || "0");
											}
										}
									}),
									new sap.m.Text({ 
										text: {
											path: "Cupbt",
											formatter: function(v) {
												v = (v) ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
												// ${v}원/매
												return oController.getBundleText("LABEL_09063").interpolate(v);
											}
										}
									})
								]
							}),
							new sap.m.FlexBox({
								justifyContent: "End",
								items: [
									new sap.m.Button({
										press: FacilityHandler.onPressRowRequest.bind(FacilityHandler),
										text: "{i18n>LABEL_09023}" // 신청
									}).addStyleClass("button-default")
								]
							})
						]
					})
				}
			});
		}
	});
});