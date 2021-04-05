sap.ui.jsfragment("ZUI5_HR_EvalComp.fragment.Search", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["150px", "", "100px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "35px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : oBundleText.getText("LABEL_00104")})], // 검색
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label border_left0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.HorizontalLayout({
											 	 	content : [new sap.m.Select({
														 	 	   selectedKey : "{Key}",
														 	 	   width : "150px",
														 	 	   change : function(oEvent){
														 	 	   		oDialog.getModel().setProperty("/Data/Text", "");	
														 	 	   },
														 	 	   items : [new sap.ui.core.Item({key : "1", text : oBundleText.getText("LABEL_26027")}), // 사원
														 	 				new sap.ui.core.Item({key : "2", text : oBundleText.getText("LABEL_26015")})] // 부서
														 	   }),
														 	   new sap.ui.core.HTML({content : "<div style='width:10px' />"}),
														 	   new sap.m.Input({
														 	   	   value : "{Text}",
														 	   	   width : "335px",
														 	   	   submit : oController.onSearch,
														 	   	   maxLength : common.Common.getODataPropertyLength("ZHR_COMMON_SRV", "F4PernrAuth", "IText")
														 	   })]
											 	})],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("Data border_right0"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Button({
											 	 	text : oBundleText.getText("LABEL_00104"), // 조회
											 	 	type : "Emphasized",
											 	 	width : "80px",
											 	 	press : oController.onSearch
											 	})],
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("paddingLeft10")]
					})]
		});
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_SearchTable", {
			selectionMode: "MultiToggle",
			enableSelectAll : false,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			noData: oBundleText.getText("LABEL_00901"), // No data found
			extension : [new sap.m.Toolbar({
							 height : "35px",
							 content : [new sap.m.ToolbarSpacer(),
										new sap.m.Button({
											text : oBundleText.getText("LABEL_00118"), // 선택
											type : "Emphasized",
											width : "80px",
											press : oController.onSaveSearch
										}),
										new sap.m.Button({
											text : oBundleText.getText("LABEL_00133"), // 닫기
											type : "Emphasized",
											width : "80px",
											press : function(oEvent){oDialog.close();}
										})]
						 }).addStyleClass("toolbarNoBottomLine paddingRight0")]
		}).addStyleClass("mt-5px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 사번, 성명, 부서, 직급
		var col_info = [{id: "Pernr", label: oBundleText.getText("LABEL_26014"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_26005"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Orgtx1", label: oBundleText.getText("LABEL_26015"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "ZpGradeTxt", label: oBundleText.getText("LABEL_26016"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
				
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oPanel = new sap.m.Panel({
			expandable : false,
			expanded : false,
			content : [oMatrix, oTable]
		});
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "800px",
			contentHeight : "",
			draggable : false,
			content : [oPanel],
			title : oBundleText.getText("LABEL_26013"), // 사원/부서 검색
			beginButton : [],			
			endButton : []
		});
		
		oDialog.addStyleClass("sapUiSizeCompact");
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
