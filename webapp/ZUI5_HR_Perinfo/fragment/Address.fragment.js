sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Address", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var col_info;
		var vIndex = -1;
		// 번호, 주소유형, 우편번호, 주소, 전화번호, 핸드폰번호, 내선번호
		col_info = [{id: "Idx", label: "{i18n>LABEL_13005}" , plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
					{id: "Stext", label: "{i18n>LABEL_37022}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Pstlz", label: "{i18n>LABEL_02132}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
					{id: "Addrs", label: "{i18n>LABEL_00168}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "40%"},
					{id: "Telnr", label: "{i18n>LABEL_02201}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "Usrid", label: "{i18n>LABEL_37023}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
					{id: "UsridLong", label: "{i18n>LABEL_37024}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_AddressTable", {
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
			oController.onAddressDblClick("1"); // only display mode
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
											 	content : [new sap.m.Text({text : "{i18n>LABEL_37009}"}).addStyleClass("Font15 FontBold"), // 주소
											 			   new sap.m.ToolbarSpacer(),
											 			   new sap.m.Button({
											 			   	text : "{i18n>LABEL_00102}",
											 			   	press : function(){
											 			   			oController.onAddressDblClick("2");
											 			   		},
										 			   		visible: {
															    parts : [{path: "Auth"}],
																formatter: function(v1) {
																	if(v1 == "E") return true;
																	else return false;
																}
												    	     }, 
											 			   }).addStyleClass("button-light")] // 수정
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
