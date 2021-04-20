sap.ui.define([], function() {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.LccMapDialog", {

	createContent: function(oController) {

		var LccMapDialogHandler = oController.LccMapDialogHandler,
		oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19632"), // 출장 경로 탐색
			stretch: true,
			contentWidth: "100%",
			contentHeight: "100%",
			content: this.getContent(oController),
			horizontalScrolling: false,
			verticalScrolling: false,
			endButton: new sap.m.Button({
				text: oController.getBundleText("LABEL_00133"), // 닫기
				press: LccMapDialogHandler.close.bind(LccMapDialogHandler)
			})
			.addStyleClass("button-default custom-button-divide"),
			afterOpen: LccMapDialogHandler.onAfterOpen.bind(LccMapDialogHandler)
		})
		.addStyleClass("custom-dialog-popup lcc-map-dialog-popup");

		return oDialog;
	},

	getContent: function(oController) {

		var LccMapDialogHandler = oController.LccMapDialogHandler;
		return new sap.m.HBox({
			width: "100%",
			height: "100%",
			items: [
				this.getSearchVBox(oController).setModel(LccMapDialogHandler.getModel()),
				new sap.ui.core.HTML({
					layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
					content: "<div id=\"${map-id}\" class=\"lcc-map\"></div>".interpolate(LccMapDialogHandler.getMapId())
				})
			]
		});
	},

	getSearchVBox: function(oController) {

		var LccMapDialogHandler = oController.LccMapDialogHandler;

		return new sap.m.ScrollContainer({
			layoutData: new sap.m.FlexItemData({ minHeight: "100%", alignSelf: sap.m.FlexAlignSelf.Stretch }),
			horizontal: false,
			vertical: true,
			width: "360px",
			height: "100%",
			content: new sap.m.VBox({
				width: "100%",
				height: "100%",
				items: [
					new sap.m.Label({ text: "{i18n>LABEL_19633}" }), // 출발지
					new sap.m.Input("LccMapDeparture", {
						maxLength: 30,
						width: "100%",
						value: "{/LccMap/Departure}",
						submit: LccMapDialogHandler.searchPlace.bind(LccMapDialogHandler)
					}),
					new sap.m.Label({ text: "{i18n>LABEL_19634}" }).addStyleClass("mt-16px"), // 도착지
					new sap.m.Input("LccMapDestination", {
						maxLength: 30,
						width: "100%",
						value: "{/LccMap/Destination}",
						submit: LccMapDialogHandler.searchPlace.bind(LccMapDialogHandler)
					}),
					new sap.m.Label({ text: "{i18n>LABEL_00120}" }).addStyleClass("mt-16px"), // 검색결과
					new sap.m.List("LccMapPlaceList", {
						items: {
							path: "/LccMap/PlaceList",
							templateShareable: false,
							template: new sap.m.StandardListItem({
								title: "{title}",
								description: "{address/roadAddress}"
							})
						},
						mode: sap.m.ListMode.SingleSelectMaster,
						selectionChange: LccMapDialogHandler.selectPlace.bind(LccMapDialogHandler)
					}).addStyleClass("mt-16px"),
					new sap.m.Label({ text: "{i18n>LABEL_19625}" }).addStyleClass("mt-16px"), // 이동거리
					new sap.m.Label({ text: "{/LccMap/Distance}" }),
					new sap.m.Label({ text: "{i18n>LABEL_19629}" }).addStyleClass("mt-16px"), // 톨게이트요금
					new sap.m.Label({ text: "{/LccMap/TollFare}" }),
					new sap.m.Button({
						press: LccMapDialogHandler.clear.bind(LccMapDialogHandler),
						text: "{i18n>LABEL_19636}", // 경로 초기화
						width: "100%"
					})
					.addStyleClass("button-light mt-16px"),
					new sap.m.Button({
						press: LccMapDialogHandler.applyResult.bind(LccMapDialogHandler),
						text: "{i18n>LABEL_00204}", // 적용
						width: "100%"
					})
					.addStyleClass("button-search mt-16px mb-40px")
				]
			})
		})
		.addStyleClass("search-box search-bg");
	}

});

});