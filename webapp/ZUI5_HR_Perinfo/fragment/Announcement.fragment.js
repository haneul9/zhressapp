sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Announcement", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var col_info;
		var vIndex = -1;
		// 번호, 발령일, 발령명, 상세발령, 부서, Grade, 발령사항, 근거
		col_info = [{id: "Idx", label: "{i18n>LABEL_13005}" , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
					{id: "Begda", label: "{i18n>LABEL_02014}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Mntxt", label: "{i18n>LABEL_37084}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Mgtxt", label: "{i18n>LABEL_37085}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Stext2", label: "{i18n>LABEL_00155}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "PGradeTxt", label: "{i18n>LABEL_18015}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Zzmass", label: "{i18n>LABEL_18008}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "20%" , align : "Begin"},
					{id: "Zzreason", label: "{i18n>ZZREASON}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_AnnouncementTable", {
			selectionBehavior : sap.ui.table.SelectionBehavior.RowOnly,
			selectionMode: sap.ui.table.SelectionMode.Single,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			columnHeaderHeight : 38,
			rowHeight : 38,
			showOverlay: false,
			showNoData: true,
			noData: "{i18n>LABEL_00901}", // No data found
		}).addStyleClass("mt-8px");
		
		oTable.attachEvent("cellClick", function(oEvent) {
			oTable.clearSelection();
			vIndex = -1;
			vIndex = oEvent.getParameters().rowIndex;
		})
		
		oTable.attachBrowserEvent("dblclick", function(oEvent) {
			oTable.clearSelection();
			oTable.addSelectionInterval(vIndex, vIndex);
			// oController.onAnnouncementDblClick("1"); // only display mode
		});
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			widths : [""],
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [new sap.m.Toolbar({
											 	content : [new sap.m.Text({text : "{i18n>LABEL_18008}"}).addStyleClass("Font15 FontBold"), //발령사항
											 			   new sap.m.ToolbarSpacer(),
											 			   ] 
											}).setModel(oController._ListCondJSonModel)
								 			   .bindElement("/Data")
								 			   .addStyleClass("toolbarNoBottomLine h-40px"),
											new sap.ui.core.HTML({content : "<div style='height:5px' />"})],
								 hAlign : "Begin",
								 vAlign : "Middle",
							 })]
				}),
				new sap.ui.commons.layout.MatrixLayoutRow({
					cells : [new sap.ui.commons.layout.MatrixLayoutCell({
								 content : [oTable],
								 hAlign : "Center",
								 vAlign : "Middle",
							 })]
				}),
				]
		});
		
		return oMatrix;
	}
});
