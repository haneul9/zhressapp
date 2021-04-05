sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.ActRecPInfo_Sub24_10", {
	
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * 은행 정보
	 * @memberOf fragment.ActRecPInfo_Sub24_10
	 */
	createContent: function (oController) {
		jQuery.sap.require("common.Common");

		// eslint-disable-next-line no-unused-vars
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_Sub24_COLUMNLIST", {
			type: sap.m.ListType.None,
			counter: 10,
			cells: [
				new sap.m.Text({
					text: "{Bnksatx}" //은행유형
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Emftx}" //예금주
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: {
						parts: [{ path: "Bkplz" }, { path: "Bkort" }],
						formatter: function (f1, f2) {
							return f1 + " / " + f2;
						} //우편번호/도시 Bkort
					}
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Bankstx}" //은행 국가명
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Bankltx}" //은행 코드
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Bankn}" //계좌번호
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: {
						path: "Bkont",
						formatter: function (f1) {
							if (f1 == "01") return "Checking Account";
							else if (f1 == "02") return "Savings  Account";
							else return "";
						}
					}
					//					    	text : "{Bkont}" //은행 관리 키
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Zlschtx}" //지급방법명
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Waers}" //지급 통화
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Betrg}" //표준 값
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Anzhl}" //표준 백분율
				}).addStyleClass("L2PFontFamily")
			]
		});

		var oTable = new sap.m.Table(oController.PAGEID + "_Sub24_TABLE", {
			inset: false,
			fixedLayout: false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText: "{i18n>MSG_02004}",
			columns: [
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02330}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02290}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Text({ text: "{i18n>LABEL_02132}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02331}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02291}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02292}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02293}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02332}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02294}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02334}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02335}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				})
			]
		});
		oTable.setModel(sap.ui.getCore().getModel("ZHR_ACTIONAPP_SRV"));

		return oTable;
	}
});
