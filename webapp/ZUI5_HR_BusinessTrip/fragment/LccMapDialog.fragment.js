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
			width: "400px",
			height: "100%",
			content: new sap.m.VBox({
				width: "100%",
				height: "100%",
				items: [
					new sap.m.Label({ text: "{i18n>LABEL_19633}" }), // 출발지
					new sap.m.SearchField("LccMapDeparture", {
						maxLength: common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtSettlementTableIn05", "Startpl"),
						width: "100%",
						value: "{/LccMap/Departure}",
						placeholder: oController.getBundleText("MSG_19036", oController.getBundleText("LABEL_19633")), // 출발지를 검색하세요.
						search: LccMapDialogHandler.searchPlace.bind(LccMapDialogHandler)
					}),
					new sap.m.Label({ text: "{i18n>LABEL_19634}" }).addStyleClass("mt-16px"), // 도착지
					new sap.m.SearchField("LccMapDestination", {
						maxLength: common.Common.getODataPropertyLength("ZHR_WORKTIME_APPL_SRV", "BtSettlementTableIn05", "Destpl"),
						width: "100%",
						value: "{/LccMap/Destination}",
						placeholder: oController.getBundleText("MSG_19036", oController.getBundleText("LABEL_19634")), // 도착지를 검색하세요.
						search: LccMapDialogHandler.searchPlace.bind(LccMapDialogHandler)
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
					}),
					new sap.m.HBox({
						width: "100%",
						items: [
							new sap.m.Label({ layoutData: new sap.m.FlexItemData({ minWidth: "30%" }), text: "{i18n>LABEL_19625}" }), // 이동거리
							new sap.m.Label({ layoutData: new sap.m.FlexItemData({ minWidth: "70%" }), text: "{/LccMap/Distance}" })
						]
					})
					.addStyleClass("mt-16px"),
					new sap.m.HBox({
						width: "100%",
						items: [
							new sap.m.Label({ layoutData: new sap.m.FlexItemData({ minWidth: "30%" }), text: "{i18n>LABEL_19629}" }), // 톨게이트요금
							new sap.m.Label({ layoutData: new sap.m.FlexItemData({ minWidth: "70%" }), text: "{/LccMap/TollFare}" })
						]
					})
					.addStyleClass("mt-16px"),
					new sap.m.Button({
						press: LccMapDialogHandler.applyResult.bind(LccMapDialogHandler),
						text: "{i18n>LABEL_00204}", // 적용
						width: "100%"
					})
					.addStyleClass("button-search mt-16px"),
					new sap.m.Button({
						press: LccMapDialogHandler.clear.bind(LccMapDialogHandler),
						text: "{i18n>LABEL_19636}", // 경로 초기화
						width: "100%"
					})
					.addStyleClass("button-light mt-16px")
				]
			})
		})
		.addStyleClass("search-box search-bg");
	}

});

});