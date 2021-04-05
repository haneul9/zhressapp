sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.CompleteEMail", {
	createContent: function (oController) {

		var oToolbar = new sap.m.Toolbar({
			design: sap.m.ToolbarDesign.Auto,
			content: [new sap.m.Label({ text: "{i18n>MSG_02012}" }).addStyleClass("L2PFontFamily")]
		}).addStyleClass("L2PPaddingLeft10");

		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CE_ColumnList", {
			counter: 10,
			cells: [
				new sap.m.Text({
					text: "{Numbr}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Maltytx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Rcvidtx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Zzcaltltx}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Text({
					text: "{Stext}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.CheckBox({
					selected: "{Rnoyn}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.CheckBox({
					selected: "{Pnryn}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.CheckBox({
					selected: "{Payyn}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Link({
					text: "{Autho}",
					customData: [
						{ key: "Persa", value: "{Persa}" },
						{ key: "Rcvid", value: "{Rcvid}" },
						{ key: "Malty", value: "{Malty}" }
					]
				})
					.addStyleClass("L2PFontFamily")
					.attachBrowserEvent("click", oController.displayReceiveAuth)
			]
		});

		var oTable = new sap.m.Table(oController.PAGEID + "_CE_Table", {
			inset: false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			noDataText: "{i18n>MSG_02004}",
			showNoData: true,
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
					header: new sap.m.Label({ text: "{i18n>LABEL_02116}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					width: "100px",
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02148}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					width: "100px",
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
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: " " }).addStyleClass("L2PFontFamily"),
					hAlign: sap.ui.core.TextAlign.Center,
					demandPopin: true
				})
			]
		});
		oTable.setModel(sap.ui.getCore().getModel("ActionMailRecipientList"));
		oTable.bindItems("/ActionMailRecipientListSet", oColumnList, null, []);

		oTable.attachUpdateFinished(function () {
			oTable.selectAll();
		});

		var oResultPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.ui.core.Icon({ src: "sap-icon://table-chart", size: "1.0rem", color: "#666666" }),
					new sap.m.Label({ text: "{i18n>LABEL_02006}", design: "Bold" }).addStyleClass("L2PFontFamily"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({ text: "{i18n>LABEL_02058}", icon: "sap-icon://delete", press: oController.deletePerson })
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oTable]
		});

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_CE_Dialog", {
			content: [oToolbar, oResultPanel],
			contentWidth: "1200px",
			contentHeight: "600px",
			showHeader: true,
			title: "{i18n>LABEL_02204}",
			beforeOpen: oController.onBeforeOpenCompleteEMailDialog,
			beginButton: new sap.m.Button({ text: "{i18n>LABEL_02183}", icon: "sap-icon://email", press: oController.onSendMail }), //
			endButton: new sap.m.Button({
				text: "{i18n>LABEL_02048}",
				icon: "sap-icon://sys-cancel-2",
				press: oController.onCEClose
			})
		});

		if (!jQuery.support.touch) {
			// apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
