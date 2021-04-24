sap.ui.define([
	"common/Common"
], function (Common) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_Pass.m.fragment.CondoList", {

		createContent: function (oController) {

			var oModel = oController.getCondoHandler().Model();

			return new sap.m.FlexBox({
				direction: sap.m.FlexDirection.Column,
				items: [
					this.getResvMyInfoBox(),
					this.getResvMyList(oController),
					this.getRequestInfoBox(oController),
					this.getRequestList(oController)
				]
			})
			.setModel(oModel);
		},	// --end createContent

		getResvMyInfoBox: function() {
			return new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_09038}"
							//	design: "Bold"
							}).addStyleClass("sub-title") // 나의 예약 현황
						]
					})
				]
			}).addStyleClass("info-box");
		},

		getResvMyList: function(oController) {
			var CondoHandler = oController.CondoHandler;

			return new sap.m.Table(oController.PAGEID + "_MyResvList", {
				inset: false,
				rememberSelections: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 2,
				mode: sap.m.ListMode.SingleSelectMaster,
				itemPress: CondoHandler.onPressResvRow.bind(CondoHandler),
				columns: [
					new sap.m.Column({
						width: "65%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						hAlign: sap.ui.core.TextAlign.End
					})
				],
				items: {
					path: "/MyResvList",
					template: new sap.m.ColumnListItem({
						type: sap.m.ListType.Active,
						counter: 5,
						cells: [
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({ text: "{Contx}" }),
									new sap.m.Text({ text: "{Loctx}" }),
									new sap.m.Text({ 
										text: {
											parts: [
												{path: "Begda"},
												{path: "Endda"}
											],
											formatter: function(v1, v2) {
												return Common.DateFormatter(v1) + " ~ " + Common.DateFormatter(v2);
											}
										} 
									})
								]
							}),
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({ text: "{SeasnT}" }),
									new sap.m.Text({ 
										text: {
											path: "Romno",
											formatter: function(v) {
												return oController.getBundleText("LABEL_09065").interpolate(v || "0");
											}
										}
									}),
									new sap.m.Text({ 
										text: {
											parts: [
												{path: "Statu"},
												{path: "StatusT"}
											],
											formatter: function(v1, v2) {
												if(v1 === "W") this.addStyleClass("color-red");
												else this.addStyleClass("color-blue");

												return v2;
											}
										} 
									})
								]
							})
						]
					})
				}
			});
		},	// --end getResvMyList

		getRequestInfoBox: function(oController) {
			var CondoHandler = oController.CondoHandler;

			return new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_09051}"
							//	design: "Bold"
							}).addStyleClass("sub-title") // 이용신청
						]
					}),
					new sap.m.HBox({
						items: [
							// new sap.m.Label({ text: "{i18n>LABEL_09033}" }),	// 콘도
							new sap.m.ComboBox({
								width: "200px",
								selectedKey: "{/filter/Condo}",
								items: {
									path: "/filter/CondoItems",
									template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
								},
								change: CondoHandler.setFilter.bind(CondoHandler)
							})
						]
					}).addStyleClass("search-field-group")
				]
			}).addStyleClass("info-box");
		},

		getRequestList: function(oController) {
			var CondoHandler = oController.CondoHandler;

			return new sap.m.Table(oController.PAGEID + "_RequestList", {
				inset: false,
				rememberSelections: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 10,
				mode: sap.m.ListMode.SingleSelectMaster,
				itemPress: CondoHandler.onPressRequestRow.bind(CondoHandler),
				columns: [
					new sap.m.Column({
						width: "45%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						hAlign: sap.ui.core.TextAlign.End
					})
				],
				items: {
					path: "/RequestList",
					template: new sap.m.ColumnListItem({
						type: sap.m.ListType.Active,
						counter: 5,
						cells: [
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({ text: "{Contx}" }),
									new sap.m.Text({ text: "{Loctx}" })
								]
							}),
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({ 
										text: {
											parts: [
												{path: "Begda"},
												{path: "Endda"}
											],
											formatter: function(v1, v2) {
												if (!v1 || !v2) {
													return "";
												}
												
												return Common.DateFormatter(v1) + " ~ " + Common.DateFormatter(v2);
											}
										}
									}),
									new sap.m.Text({ text: "{SeasnT}" })
								]
							})
						]
					})
				}
			});
		}	// --end getRequestList
	});
});