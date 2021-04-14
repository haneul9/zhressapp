sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Family", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		// 번호, 구성원, 관계, 성명, 주민번호, 실제생일, 성별, 학력 , 건강보험 여부, 동거여부
		var col_info = [{id: "Idx", label: "{i18n>LABEL_13005}" , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
					{id: "Stext", label: "{i18n>LABEL_37099}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
					{id: "Atext", label: "{i18n>LABEL_37100}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
					{id: "Fname", label: "{i18n>LABEL_37101}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Regno", label: "{i18n>LABEL_37102}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Fgbdt", label: "{i18n>LABEL_37015}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "FasexT", label: "{i18n>LABEL_37016}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Fasin", label: "{i18n>LABEL_37103}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Helid", label: "{i18n>LABEL_37104}", plabel: "", resize: true, span: 0, type: "select", sort: true, filter: true},
					{id: "Livid", label: "{i18n>LABEL_37105}", plabel: "", resize: true, span: 0, type: "select", sort: true, filter: true}
					];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_FamilyTable", {
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
											 	content : [new sap.m.Text({text : "{i18n>LABEL_37106}"}).addStyleClass("Font15 FontBold") // 가족사항
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
