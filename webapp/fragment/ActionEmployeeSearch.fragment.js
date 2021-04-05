jQuery.sap.require("common.ActionSearchUser");

sap.ui.jsfragment("fragment.ActionEmployeeSearch", {
	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fragment.ActionEmployeeSearch
	 */

	createContent: function (oController) {
		var oStat1 = new sap.m.Select(oController.PAGEID + "_AES_Stat1", {
			width: "200px"
		}).addStyleClass("L2P13Font");

		var oFilterLayout = new sap.m.ScrollContainer(oController.PAGEID + "_AES_LeftScrollContainer", {
			width: "100%",
			height: "500px",
			horizontal: false,
			vertical: true
		}).addStyleClass("");

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter1", {
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00106}" + ":" }),	// 인사영역
					new sap.m.Select(oController.PAGEID + "_AES_Persa", {
						width: "200px",
						change: common.ActionSearchUser.onChangePersa
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter2", {
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00121}" + ":" }),	// 성명
					new sap.m.Input(oController.PAGEID + "_AES_Ename", {
						width: "200px"
					})
						.addStyleClass("L2P13Font")
						.attachBrowserEvent("keyup", common.ActionSearchUser.onKeyUp)
				]
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_aES_Filter3", {
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00108}" + ":" }),	// 소속
					new sap.m.MultiInput(oController.PAGEID + "_AES_Fulln", {
						width: "200px",
						showValueHelp: true,
						enableMultiLineMode: true,
						valueHelpRequest: oController.displayMultiOrgSearchDialog
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout({
				content: [new sap.m.Label({ text: "{i18n>LABEL_00109}" + ":" }), oStat1]	// 재직구분
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter4", {
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00110}" + ":" }),	// 직군
					new sap.m.Select(oController.PAGEID + "_AES_Zzjobgr", {
						width: "200px"
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter5", {
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00111}" + ":" }),	// 사원그룹
					new sap.m.Select(oController.PAGEID + "_AES_Persg", {
						width: "200px",
						change: common.ActionSearchUser.onChangePersg
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter6", {
				visible: true,
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00112}" + ":" }),	// 급여유형
					new sap.m.Select(oController.PAGEID + "_AES_Persk", {
						width: "200px"
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter7", {
				visible: true,
				content: [
					new sap.m.Label({ text: "Role Level" + ":" }),
					new sap.m.Select(oController.PAGEID + "_AES_Zzrollv", {
						width: "200px"
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter8", {
				visible: true,
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00114}" + ":" }),	// 직위
					new sap.m.Select(oController.PAGEID + "_AES_Zzcaltl", {
						width: "200px"
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem")
		);

		oFilterLayout.addContent(
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_AES_Filter9", {
				visible: true,
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00115}" + ":" }),	// 직책
					new sap.m.Select(oController.PAGEID + "_AES_Zzpsgrp", {
						width: "200px"
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem")
		);

		var oFilterPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.ui.core.Icon({ src: "sap-icon://filter", size: "1.0rem", color: "#666666" }),
					new sap.m.Label({ text: "{i18n>LABEL_00116}", design: "Bold" }).addStyleClass("L2P13Font"),	// 검색조건
					new sap.m.ToolbarSpacer(),
					new sap.m.Button({
						text: "{i18n>LABEL_00104}",	// 검색
						type: sap.m.ButtonType.Emphasized,
						press: common.ActionSearchUser.searchFilterBar
					}).addStyleClass("L2P13Font"),
					new sap.m.ToolbarSpacer({ width: "10px" })
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oFilterLayout]
		});

		var oPersonList = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_AES_Table", {
			width: "925px"
		});

		var oResultPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.ui.core.Icon({ src: "sap-icon://table-chart", size: "1.0rem", color: "#666666" }),
					new sap.m.Label({ text: "{i18n>LABEL_00120}", design: "Bold" }).addStyleClass("L2P13Font"),	// 검색결과
					new sap.m.ToolbarSpacer()
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oPersonList]
		});

		var oMainLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 2,
			widths: ["270px", "930px"]
		});

		var oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: [oFilterPanel]
		}).addStyleClass("");

		var oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: [oResultPanel]
		}).addStyleClass("");

		oMainLayout.createRow(oCell1, oCell2);

		var vContentHeight = window.innerHeight - 200;

		oFilterLayout.setHeight(vContentHeight - 90 + "px");

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_AES_Dialog", {
			content: [oMainLayout],
			contentWidth: "1250px",
			contentHeight: vContentHeight + "px",
			showHeader: true,
			title: "{i18n>LABEL_00117}",	// 사원 검색
			afterOpen: common.ActionSearchUser.onAfterOpenSearchDialog,
			beforeClose: common.ActionSearchUser.onBeforeOpenSearchDialog,
			beginButton: new sap.m.Button({ text: "{i18n>LABEL_00118}", icon: "sap-icon://complete", press: common.ActionSearchUser.onAESSelectPerson }), // 선택
			endButton: new sap.m.Button({ text: "{i18n>LABEL_00119}", icon: "sap-icon://sys-cancel-2", press: common.ActionSearchUser.onClose })	// 취소
		});

		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact");
		}

		return oDialog;
	}
});
