jQuery.sap.declare("common.PersonCard");
/**
 * ����˻��� Dialog�� ���� JS �̴�.
 * @Create By ����
 */

common.PersonCard = {
	/**
	 * @memberOf common.PersonCard
	 */

	oPrintDialog: null,

	oColumnList: null,
	oItemList: null,

	_vBegda: null,
	_vPernr: "",
	_vSpras: "",
	_vCcntr: "",

	mPersonnelCardItemSet: null,

	popupPersonCardPrint: function (Pernr, Ename, Begda, Ccntr) {
		common.PersonCard.oPrintDialog = null;
		common.PersonCard.oColumnList = null;
		common.PersonCard.oItemList = null;

		common.PersonCard._vBegda = Begda;
		common.PersonCard._vPernr = Pernr;
		if (Ccntr == "ALL") common.PersonCard._vCcntr = "X";
		else common.PersonCard._vCcntr = "";
		common.PersonCard._vSpras = gLangu;

		common.PersonCard.mPersonnelCardItemSet = new sap.ui.model.json.JSONModel();

		common.PersonCard.getItemData(gLangu, Pernr);

		common.PersonCard.makeDialog();

		common.PersonCard.makePersonInfo(Ename, Begda);

		common.PersonCard.makeItemList();

		if (!common.PersonCard.oPrintDialog.isOpen()) {
			common.PersonCard.oPrintDialog.open();
		}
	},

	makeDialog: function () {
		if (common.PersonCard.oPrintDialog == null) {
			common.PersonCard.oPrintDialog = new sap.m.Dialog({
				contentWidth: "730px",
				contentHeight: "650px",
				showHeader: true,
				title: "인사기록카드",
				buttons: [
					new sap.m.Button({ text: "기본값", press: common.PersonCard.onSetBasicInfo }),
					new sap.m.Button({ text: "출력", press: common.PersonCard.onRDPrint }),
					new sap.m.Button({ text: "닫기", press: common.PersonCard.onClose })
				]
			});

			//if(!jQuery.support.touch) { // apply compact mode if touch is not supported
			common.PersonCard.oPrintDialog.addStyleClass("sapUiSizeCompact");
			//};
		} else {
			common.PersonCard.oPrintDialog.removeAllContent();
			common.PersonCard.oPrintDialog.destroyContent();
		}
	},

	onClose: function (oEvent) {
		if (common.PersonCard.oPrintDialog.isOpen()) {
			common.PersonCard.oPrintDialog.close();
		}
	},

	onSetBasicInfo: function (oEvent) {
		if (common.PersonCard.oItemList) {
			var vPersonnelCardItemSet = common.PersonCard.mPersonnelCardItemSet.getProperty("/PersonnelCardItemSet");
			var oItems = common.PersonCard.oItemList.getItems();

			if (vPersonnelCardItemSet && vPersonnelCardItemSet.length) {
				for (var i = 0; i < vPersonnelCardItemSet.length; i++) {
					if (vPersonnelCardItemSet[i].Defyn == "X") {
						common.PersonCard.oItemList.setSelectedItem(oItems[i], true);
					} else {
						common.PersonCard.oItemList.setSelectedItem(oItems[i], false);
					}
				}
			}
		}
	},

	onRDPrint: function (oEvent) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" });

		//"http://edut.corp.doosan.com/ReportingServer/ghris/profile.jsp?";

		if (common.PersonCard._vPernr == "" || common.PersonCard._vBegda == null) {
			console.log("Data Nothing !!!");
			return;
		}

		if (gPcurl == "") {
			console.log("RD Uri Nothing !!!");
			return;
		}

		var html_url = "http://" + location.host + "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/RDJump.html?";
		var vUrl = html_url;

		vUrl += "i_rdurl=" + gPcurl;
		vUrl += "&i_type=PROFILE";
		vUrl += "&i_pernr=" + common.PersonCard._vPernr;
		vUrl += "&i_date=" + dateFormat.format(common.PersonCard._vBegda);
		vUrl += "&i_spras=" + common.PersonCard._vSpras;
		vUrl += "&i_datfm=" + gDatfm;
		vUrl += "&i_dcpfc=" + gDcpfc;
		vUrl += "&i_disp01=X";
		vUrl += "&i_all=" + common.PersonCard._vCcntr;

		var vCheckedItems = [];
		var vPersonnelCardItemSet = common.PersonCard.mPersonnelCardItemSet.getProperty("/PersonnelCardItemSet");

		var oContexts = common.PersonCard.oItemList.getSelectedContexts(true);
		if (oContexts && oContexts.length) {
			for (var i = 0; i < oContexts.length; i++) {
				vCheckedItems.push(common.PersonCard.mPersonnelCardItemSet.getProperty(oContexts[i] + "/Dfara"));
			}

			for (var i = 0; i < vPersonnelCardItemSet.length; i++) {
				var isChecked = false;
				for (var j = 0; j < vCheckedItems.length; j++) {
					if (vCheckedItems[j] == vPersonnelCardItemSet[i].Dfara) {
						isChecked = true;
						break;
					}
				}
				if (isChecked) {
					vUrl += "&" + vPersonnelCardItemSet[i].Dfara + "=X";
				} else {
					vUrl += "&" + vPersonnelCardItemSet[i].Dfara + "=N";
				}
			}
		}

		if (vUrl.indexOf("i_disp10") < 0) {
			vUrl += "&i_disp10=N";
		}

		if (vUrl.indexOf("i_disp11") < 0) {
			vUrl += "&i_disp11=N";
		}

		console.log(vUrl);
		window.open(vUrl);
	},

	makePersonInfo: function (Ename, Begda) {
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: gDtfmt });

		var oSpras = new sap.m.Select({
			width: "100%",
			change: common.PersonCard.onChangeLanguage
		}).addStyleClass("L2P13Font");

		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");

		try {
			oModel.read(
				"/PersonnelCardLanguageSet",
				null,
				null,
				false,
				function (oData, oResponse) {
					if (oData && oData.results.length) {
						for (var i = 0; i < oData.results.length; i++) {
							oSpras.addItem(
								new sap.ui.core.Item({
									key: oData.results[i].Spras,
									text: oData.results[i].Sptxt
								})
							);
						}
					}
				},
				function (oResponse) {
					console.log(oResponse);
				}
			);
		} catch (ex) {
			console.log(ex);
		}

		oSpras.setSelectedKey(gLangu);

		var oCell = null,
			oRow = null;

		var oInfoLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 4,
			widths: ["15%", "40%", "15%", "30%"]
		});

		oRow = new sap.ui.commons.layout.MatrixLayoutRow();

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "대상자" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Text({ text: Ename }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [new sap.m.Label({ text: "출력언어" }).addStyleClass("L2P13Font")]
		}).addStyleClass("L2PInputTableLabel L2PPaddingLeft10");
		oRow.addCell(oCell);

		oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Middle,
			content: [oSpras]
		}).addStyleClass("L2PInputTableData L2PPaddingLeft10");
		oRow.addCell(oCell);

		oInfoLayout.addRow(oRow);

		var oInfoPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
					new sap.m.Label({ text: "출력옵션", design: "Bold" }).addStyleClass("L2P13Font"),
					new sap.m.ToolbarSpacer(),
					new sap.m.Label({ text: "기준일자" + " : " + dateFormat.format(Begda) }).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oInfoLayout]
		});

		if (common.PersonCard.oPrintDialog) common.PersonCard.oPrintDialog.addContent(oInfoPanel);
	},

	onChangeLanguage: function (oEvent) {
		var oItem = oEvent.getParameter("selectedItem");
		var sKey = oItem.getKey();

		common.PersonCard._vSpras = sKey;

		common.PersonCard.getItemData(sKey, common.PersonCard._vPernr);
	},

	getItemData: function (lang, pernr) {
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");

		var vPersonnelCardItemSet = { PersonnelCardItemSet: [] };
		common.PersonCard.mPersonnelCardItemSet.setData(vPersonnelCardItemSet);

		try {
			oModel.read(
				"/PersonnelCardItemSet/?$filter=Pernr%20eq%20%27" + pernr + "%27%20and%20Spras%20eq%20%27" + lang + "%27",
				null,
				null,
				false,
				function (oData, oResponse) {
					if (oData && oData.results.length) {
						for (var i = 0; i < oData.results.length; i++) {
							vPersonnelCardItemSet.PersonnelCardItemSet.push(oData.results[i]);
						}
						common.PersonCard.mPersonnelCardItemSet.setData(vPersonnelCardItemSet);
					}
				},
				function (oResponse) {
					console.log(oResponse);
				}
			);
		} catch (ex) {
			console.log(ex);
		}
	},

	makeItemList: function () {
		if (common.PersonCard.oColumnList == null) {
			common.PersonCard.oColumnList = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: "{Seqnr}"
					}).addStyleClass("L2P13Font"), //��������
					new sap.m.Text({
						text: "{Pitem}"
					}).addStyleClass("L2P13Font") //��������
				]
			});
		}

		if (common.PersonCard.oItemList == null) {
			common.PersonCard.oItemList = new sap.m.Table({
				inset: false,
				backgroundDesign: sap.m.BackgroundDesign.Translucent,
				showSeparators: sap.m.ListSeparators.All,
				noDataText: "해당하는 데이터가 없습니다.",
				mode: sap.m.ListMode.MultiSelect,
				updateFinished: common.PersonCard.setSelectedItem,
				fixedLayout: false,
				columns: [
					new sap.m.Column({
						header: new sap.m.Label({ text: "No." }).addStyleClass("L2P13Font"),
						demandPopin: true,
						width: "50px",
						hAlign: sap.ui.core.TextAlign.Center,
						minScreenWidth: "tablet"
					}),
					new sap.m.Column({
						header: new sap.m.Label({ text: "출력항목" }).addStyleClass("L2P13Font"),
						demandPopin: true,
						hAlign: sap.ui.core.TextAlign.Begin,
						minScreenWidth: "tablet"
					})
				]
			});
		}

		common.PersonCard.oItemList.setModel(common.PersonCard.mPersonnelCardItemSet);
		common.PersonCard.oItemList.bindItems("/PersonnelCardItemSet", common.PersonCard.oColumnList);

		var oListPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [new sap.m.Label({ text: "출력항목 선택", design: "Bold" }).addStyleClass("L2P13Font")]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [common.PersonCard.oItemList]
		});

		if (common.PersonCard.oPrintDialog) common.PersonCard.oPrintDialog.addContent(oListPanel);
	},

	setSelectedItem: function (oEvent) {
		if (common.PersonCard.oItemList && oEvent.getParameter("actual") > 0) {
			var vPersonnelCardItemSet = common.PersonCard.mPersonnelCardItemSet.getProperty("/PersonnelCardItemSet");
			var oItems = common.PersonCard.oItemList.getItems();

			if (vPersonnelCardItemSet && vPersonnelCardItemSet.length) {
				for (var i = 0; i < vPersonnelCardItemSet.length; i++) {
					if (vPersonnelCardItemSet[i].Defyn == "X") {
						common.PersonCard.oItemList.setSelectedItem(oItems[i], true);
					} else {
						common.PersonCard.oItemList.setSelectedItem(oItems[i], false);
					}
				}
			}
		}
	}
};
