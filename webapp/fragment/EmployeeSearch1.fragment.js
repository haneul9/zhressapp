jQuery.sap.require("common.SearchUser1");

sap.ui.jsfragment("fragment.EmployeeSearch1", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fragment.EmployeeSearch
	 */
	createContent: function (oController) {
		var aFilterContents = [
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter1", {
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00106}" })
					.addStyleClass("mb--5px"),	// 인사영역
					new sap.m.Select(oController.PAGEID + "_ES_Persa", {
						width: "208px",
						change: common.SearchUser1.onChangePersa
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem"),
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter2", {
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00107}" }).addStyleClass("mb--5px"),	// 성명 또는 사번
					new sap.m.Input(oController.PAGEID + "_ES_Ename", {
						width: "208px"
					})
						.addStyleClass("L2P13Font")
						.attachBrowserEvent("keyup", common.SearchUser1.onKeyUp)
				]
			}).addStyleClass("L2PFilterItem"),
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter3", {
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00108}" }).addStyleClass("mb--5px"),	// 소속
					new sap.m.MultiInput(oController.PAGEID + "_ES_Fulln", {
						width: "208px",
						showValueHelp: true,
						valueHelpOnly : true,
						enableMultiLineMode: true,
						valueHelpRequest: oController.displayMultiOrgSearchDialog
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem"),
			new sap.ui.layout.VerticalLayout({
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00109}" }).addStyleClass("mb--5px "),	// 재직구분
					new sap.m.Select(oController.PAGEID + "_ES_Stat2", {
						width: "208px"
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem"),
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter5", {
				content: [
					new sap.m.Label({ text: "{i18n>LABEL_00111}" }).addStyleClass("mb--5px"),	// 사원그룹
					new sap.m.Select(oController.PAGEID + "_ES_Persg", {
						width: "208px"
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem"),
			new sap.ui.layout.VerticalLayout(oController.PAGEID + "_ES_Filter6", {
				content: [
					new sap.m.Label({ text: "{i18n>ZHGRADE}" }).addStyleClass("mb--5px"),	// 직급구분
					new sap.m.Select(oController.PAGEID + "_ES_Zhgrade", {
						width: "208px"
					}).addStyleClass("L2P13Font")
				]
			}).addStyleClass("L2PFilterItem"),
			new sap.m.Panel({
				content: [					
					new sap.m.Button({
						text: "{i18n>LABEL_00100}",
						type: sap.m.ButtonType.Emphasized,
						press: common.SearchUser1.searchFilterBar
					}).addStyleClass("button-search w-100 mt-10px")
				]
			}).addStyleClass("p-0")
		];

		var oFilterLayout = new sap.m.ScrollContainer(oController.PAGEID + "_ES_LeftScrollContainer", {
			width: "100%",
			// height: "500px", 
			horizontal: false,
			vertical: true,
			content: aFilterContents
		}).addStyleClass("mt-10px");

		var oFilterPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			// headerToolbar: new sap.m.Toolbar({
			// 	design: sap.m.ToolbarDesign.Auto,
			// 	content: [
			// 		new sap.ui.core.Icon({ src: "sap-icon://filter", size: "1.0rem", color: "#666666" }),
			// 		new sap.m.Label({ text: "{i18n>LABEL_00116}"}).addStyleClass("emp-title"),
			// 		new sap.m.ToolbarSpacer(),
			// 		new sap.m.Button({
			// 			text: "{i18n>LABEL_00100}",	
			// 			type: sap.m.ButtonType.Emphasized,
			// 			press: common.SearchUser1.searchFilterBar
			// 		}).addStyleClass("button-search w-100"),
			// 		new sap.m.ToolbarSpacer({ width: "10px" })
			// 	]
			// }).addStyleClass("h-45px"),
			content: [oFilterLayout]
		});

		var oTable = new sap.ui.table.Table(oController.PAGEID + "_EmpSearchResult_Table", {
			width: "100%",
			visibleRowCount: 10,
			selectionMode: sap.ui.table.SelectionMode.MultiToggle, //Use Singe or Multi
			fixedColumnCount: 3,
			rowHeight: 37,
			columnHeaderHeight: 38,
			showNoData: true
		});

		oTable.bindRows("/EmpSearchResultSet");
		oTable.attachCellClick(common.SearchUser1.onClick);
		oTable.attachBrowserEvent("dblclick", common.SearchUser1.onDblClick);

		var vColumns = [
			{ id: "Pernr", label: "{i18n>LABEL_02247}",/* 사번 */ control: "txt", width: "100px", align: "left" },
			{ id: "Ename", label: "{i18n>LABEL_00121}",/* 성명 */ control: "txt", width: "100px", align: "left" }, 
			{ id: "Fulln", label: "{i18n>LABEL_00122}",/* 소속부서 */ control: "txt", width: "180px", change: "OrgehC", align: "left" }, 
			{ id: "Zhgradetx", label: "{i18n>LABEL_00137}",/* 직급구분 */ control: "txt", width: "100px", change: "", align: "left" }, 
			{ id: "ZpGradetx", label: "{i18n>LABEL_00124}",/* 직급 */ control: "txt", width: "120px", change: "", align: "left" }, 
			{ id: "Ztitletx", label: "{i18n>LABEL_00114}",/* 직위 */ control: "txt", width: "80px", change: "", align: "left" }, 
			{ id: "Zposttx", label: "{i18n>LABEL_00115}",/* 직책 */ control: "txt", width: "80px", change: "", align: "left" }, 
			{ id: "Btrtx", label: "{i18n>LABEL_00126}",/* 사업장 */ control: "txt", width: "100px", change: "", align: "left" }, 
			{ id: "Stat2x", label: "{i18n>LABEL_00109}",/* 재직구분 */ control: "txt", width: "80px", change: "PersgC", align: "left" }, 
			{ id: "Entda", label: "{i18n>LABEL_00127}",/* 입사일 */ control: "date", width: "100px", align: "left" }, 
			{ id: "Retda", label: "{i18n>LABEL_00128}",/* 퇴사일 */ control: "date", width: "100px", align: "left" } 
		];

		for (var i = 0; i < vColumns.length; i++) {
			if (vColumns[i].control == "date") {
				oTable.addColumn(
					new sap.ui.table.Column({
						label: new sap.ui.commons.Label({ text: vColumns[i].label }).addStyleClass("emp-title"),
						template: new sap.ui.commons.TextView({
							text: { path: vColumns[i].id, type: new sap.ui.model.type.Date({ pattern: "yyyy.MM.dd" }), tooltip: new sap.ui.core.TooltipBase() }
						}).addStyleClass("L2PFontFamily"),
						width: vColumns[i].width,
						sortProperty: vColumns[i].id,
						filterProperty: vColumns[i].id
					})
				);
			} else {
				oTable.addColumn(
					new sap.ui.table.Column({
						label: new sap.ui.commons.Label({ text: vColumns[i].label }).addStyleClass("L2PFontFamily"),
						template: new sap.ui.commons.TextView().bindProperty("text", vColumns[i].id).addStyleClass("L2PFontFamily"),
						width: vColumns[i].width,
						sortProperty: vColumns[i].id,
						filterProperty: vColumns[i].id
					})
				);
			}
		}

		var oPersonList = new sap.ui.commons.layout.VerticalLayout(oController.PAGEID + "_ES_Table", {
			width: "940px",
			content: [oTable]
		});

		var oResultPanel = new sap.m.Panel({
			expandable: false,
			expanded: false,
			headerToolbar: new sap.m.Toolbar({
				design: sap.m.ToolbarDesign.Auto,
				content: [
				//	new sap.ui.core.Icon({ src: "sap-icon://table-chart", size: "1.0rem", color: "#666666" }), 
					new sap.m.Label({ text: "{i18n>LABEL_00120}"}).addStyleClass("L2P13Font"), 
					new sap.m.ToolbarSpacer()]
			}).addStyleClass("L2PToolbarNoBottomLine"),
			content: [oPersonList]
		});

		var oMainLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 2,
			widths: ["240px", "940px"]					
		});

		var oCell1 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: [oFilterPanel]
		}).addStyleClass("custom-employeeSearch-area");

		var oCell2 = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: [oResultPanel]
		});   

		oMainLayout.createRow(oCell1, oCell2);

		// var vContentHeight = window.innerHeight - 200;
		var vContentHeight = common.SearchUser1.dialogContentHeight || (window.innerHeight - 340);       

		// oFilterLayout.setHeight(vContentHeight - 90 + "px");   

		var oDialog = new sap.m.Dialog(oController.PAGEID + "_ES_Dialog", {
			content: [oMainLayout],
			contentWidth: "1220px",
		//	contentHeight: "520px",    
			// contentHeight: vContentHeight + "px",
			showHeader: true,
			title: "{i18n>LABEL_00117}",
			afterOpen: common.SearchUser1.onAfterOpenSearchDialog,
			beforeClose: common.SearchUser1.onBeforeCloseSearchDialog,
			beginButton: new sap.m.Button({ text: "{i18n>LABEL_00118}", press: common.SearchUser1.onESSelectPerson }).addStyleClass("button-light"), 
			endButton: new sap.m.Button({ text: "{i18n>LABEL_00119}", press: common.SearchUser1.onClose }).addStyleClass("button-delete")
		});

		if (!jQuery.support.touch) {
			oDialog.addStyleClass("sapUiSizeCompact custom-employee");
		}

		return oDialog;
	}
});
