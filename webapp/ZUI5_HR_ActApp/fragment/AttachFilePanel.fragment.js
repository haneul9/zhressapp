/* eslint-disable no-undef */
jQuery.sap.require("ZUI5_HR_ActApp.fragment.AttachFileAction");
jQuery.sap.require("sap.ui.unified.FileUploader");
jQuery.sap.require("control.ODataFileUploader");

sap.ui.jsfragment("ZUI5_HR_ActApp.fragment.AttachFilePanel", {
	createContent: function (oController) {

		var oFileUploader = new control.ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {
			name: oController.PAGEID + "UploadFile",
			modelName: "ZHR_ACTIONAPP_SRV",
			slug: "",
			maximumFileSize: 10,
			multiple: false,
			width: "100px",
			uploadOnChange: true,
			mimeType: [],
			fileType: [],
			buttonText: "{i18n>LABEL_02210}",
			icon: "sap-icon://upload",
			buttonOnly: true,
			uploadUrl: "/sap/opu/odata/sap/ZHR_ACTIONAPP_SRV/FileSet/",
			uploadComplete: ZUI5_HR_ActApp.fragment.AttachFileAction.uploadComplete,
			uploadAborted: ZUI5_HR_ActApp.fragment.AttachFileAction.uploadAborted,
			fileSizeExceed: ZUI5_HR_ActApp.fragment.AttachFileAction.fileSizeExceed,
			typeMissmatch: ZUI5_HR_ActApp.fragment.AttachFileAction.typeMissmatch,
			change: ZUI5_HR_ActApp.fragment.AttachFileAction.onFileChange
		});

		// eslint-disable-next-line no-unused-vars
		var oColumnList = new sap.m.ColumnListItem(oController.PAGEID + "_CAF_ColumnList", {
			counter: 10,
			cells: [
				new sap.m.Text({
					text: "{Numbr}"
				}).addStyleClass("L2PFontFamily"),
				new sap.m.Link({
					text: "{Fname}",
					href: "{Uri}",
					target: "_new"
				}).addStyleClass("L2PFontFamily")
			]
		});

		var oAttachFileList = new sap.m.Table(oController.PAGEID + "_CAF_Table", {
			inset: false,
			backgroundDesign: sap.m.BackgroundDesign.Translucent,
			showSeparators: sap.m.ListSeparators.All,
			showNoData: false,
			mode: sap.m.ListMode.MultiSelect,
			columns: [
				new sap.m.Column({
					header: new sap.m.Label({ text: "No." }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Center,
					width: "50px",
					minScreenWidth: "tablet"
				}),
				new sap.m.Column({
					header: new sap.m.Label({ text: "{i18n>LABEL_02042}" }).addStyleClass("L2PFontFamily"),
					demandPopin: true,
					hAlign: sap.ui.core.TextAlign.Begin,
					minScreenWidth: "tablet"
				})
			]
		});

		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa));
		oFilters.push(new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vReqno));

		oAttachFileList.setModel(sap.ui.getCore().getModel("ZHR_ACTIONAPP_SRV"));

		var oAttachFilePanel = new sap.m.Panel(oController.PAGEID + "_ATTACHFILE_PANEL", {
			visible: true,
			expandable: true,
			expanded: true,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					//new sap.ui.core.Icon({src : "sap-icon://excel-attachment", size : "1.0rem", color : "#666666"}),
					new sap.m.Label({ text: "{i18n>LABEL_02042}", design: "Bold" }).addStyleClass("L2PFontFamily"),
					new sap.m.ToolbarSpacer({ width: "10px" }),
					new sap.m.Label({ text: "{i18n>MSG_02011}" }).addStyleClass("L2PHelpfont12"),
					new sap.m.ToolbarSpacer(),
					oFileUploader,
					new sap.m.Button({
						text: "{i18n>LABEL_02058}",
						icon: "sap-icon://delete",
						press: ZUI5_HR_ActApp.fragment.AttachFileAction.onDeleteAttachFile
					})
				]
			}),
			content: [oAttachFileList]
		});

		return oAttachFilePanel;
	}
});
