sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.MailingList", {
	createContent: function (oController) {

		var oColumnList = new sap.m.ColumnListItem("MailligList_ColumnList", {
			counter: 10,
			cells: [
				new sap.m.Text({
					text: "{Numbr}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Ename}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Zzcaltltx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Fulln}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.CheckBox({
					selected: "{Rnoyn}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.CheckBox({
					selected: "{Pnryn}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.CheckBox({
					selected: "{Payyn}"
				}).addStyleClass("L2PFontFamily")
			]
		});

		var oTable = new sap.m.Table("MailingList_Table", {
			inset: false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText: "{i18n>MSG_02004}",
			showNoData: false,
			mode: "MultiSelect",
			columns: [
				new sap.m.Column({
					header: new sap.m.Label({ text: "No." }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					width: "30px",
					hAlign: sap.ui.core.TextAlign.Center,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02070}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					width: "150px",
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02219}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					width: "100px",
					hAlign: sap.ui.core.TextAlign.Begin
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02087}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Begin,
					width: "200px",
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02181}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02256}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02182}" }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				})
			]
		});
		oTable.setModel(sap.ui.getCore().getModel("ActionMailingList"));
		oTable.bindItems("/ActionMailingList", oColumnList, null, []);

		var oResultPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.ui.core.Icon({ src: "sap-icon://table-chart", size: "1.0rem", color: "#666666" }),
					new sap.m.Label({ text: "{i18n>LABEL_02006}", design: "Bold" }).addStyleClass("L2PFontFamily"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({ text: "{i18n>LABEL_02025}", icon: "sap-icon://add", press: oController.addPerson }),
					new sap.m.Button({ text: "{i18n>LABEL_02058}", icon: "sap-icon://delete", press: oController.delPerson })
				]
			}),
			content: [oTable]
		});

		var oDialog = new sap.m.Dialog("MailingList_Dialog", {
			content: oResultPanel,
			contentWidth: "1000px",
			contentHeight: "600px",
			showHeader: true,
			title: "{i18n>LABEL_02154}",
			beforeClose: oController.onBeforeCloseMailingListDialog,
			beginButton: new sap.m.Button({ text: "{i18n>LABEL_02183}", icon: "sap-icon://email", press: oController.onSendMail }), //
			endButton: new sap.m.Button({
				text: "{i18n>LABEL_02048}",
				icon: "sap-icon://sys-cancel-2",
				press: oController.onSendEmailClose
			})
		});

		if (!jQuery.support.touch) {
			// apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
