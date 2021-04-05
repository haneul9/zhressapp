sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Table", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		// table column 설정
		var col_info;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
		
		if(vData.Data.Bukrs == "A100"){ // 첨단
						// 평가연도, 업적(상), 업적(하), 역량
			col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Apyear", label: oBundleText.getText("LABEL_07301"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "ApgrdTP1", label: oBundleText.getText("LABEL_07406"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "ApgrdTP2", label: oBundleText.getText("LABEL_07407"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "ApgrdTC1", label: oBundleText.getText("LABEL_07408"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
		} else { // 기초
						// 대상연도, 조직평가, 업적평가, 역량평가, 종합평가
			col_info = [{id: "Apyear", label: oBundleText.getText("LABEL_07401"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "ApOrgD", label: oBundleText.getText("LABEL_07402"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// {id: "ApOrkLd", label: oBundleText.getText("LABEL_07403"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						// {id: "ApAbiD", label: oBundleText.getText("LABEL_07404"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "ApTotD", label: oBundleText.getText("LABEL_07405"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
		}
		
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			noData: oBundleText.getText("LABEL_00901"), // No data found
		}).addStyleClass("mt-8px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		return oTable;
	}
});
