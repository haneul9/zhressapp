sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.Detail03", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oFilterBar = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true,
			content : [new sap.ui.layout.VerticalLayout({
						   content : [new sap.m.Text({text : "연도"}).addStyleClass("FontFamily"),
									  new sap.m.ComboBox({
									  	  selectedKey : "{Year}",
									  	  width : "175px",
									  	  items : [new sap.ui.core.Item({key : "2020", text : "2020"})]
									  })]
					   }).addStyleClass("paddingRight1"),
					   new sap.ui.layout.VerticalLayout({
					   	   content : [new sap.m.Text({text : "부문"}).addStyleClass("FontFamily"),
					   				  new sap.m.Input({
					   				  	  valueHelpOnly : true,
					   				  	  showValueHelp : true,
					   				  	  value : "{Orgtx}"
					   				  }).addStyleClass("FontFamily")]
					   }).addStyleClass("paddingRight1"),
					   new sap.ui.layout.VerticalLayout({
						   content : [new sap.m.Text({text : "팀"}).addStyleClass("FontFamily"),
									  new sap.m.Input({
									  	  valueHelpOnly : true,
									  	  showValueHelp : true,
									  	  value : "{Orgtx2}"
									  }).addStyleClass("FontFamily")]
					   }).addStyleClass("paddingRight1"),
					   new sap.ui.layout.VerticalLayout({
					   	   content : [new sap.m.Text(),
					   				  new sap.m.Button({
									   	  icon : "sap-icon://search",
									   	  text : "조회",
									   	  type : "Emphasized",
									   	  //press : oController.onPressSearch
									  })]
					   })]
		});
		
		var oSummary = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true,
			content : [new sap.ui.layout.VerticalLayout({
				   width : "120px",
						   content : [new sap.m.Text({text : "인원수"}).addStyleClass("FontFamily PaddingBottom5"),
									  new sap.m.ObjectNumber({
									  	  textAlign : "End",
									  	  state : "Error",
									  	  number : "{Count1}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.m.Text({text : "업적(본인)"}).addStyleClass("FontFamily PaddingBottom5"),
									  new sap.m.ObjectNumber({
									  	  textAlign : "End",
									  	  state : "Error",
									  	  number : "{Count2}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.m.Text({text : "역량(본인)"}).addStyleClass("FontFamily PaddingBottom5"),
									  new sap.m.ObjectNumber({
									  	  textAlign : "End",
									  	  state : "Error",
									  	  number : "{Count3}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.m.Text({text : "업적(1차)"}).addStyleClass("FontFamily PaddingBottom5"),
									  new sap.m.ObjectNumber({
									  	  textAlign : "End",
									  	  state : "Error",
									  	  number : "{Count4}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.m.Text({text : "역량(2차)"}).addStyleClass("FontFamily PaddingBottom5"),
									  new sap.m.ObjectNumber({
									  	  textAlign : "End",
									  	  state : "Error",
									  	  number : "{Count5}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout")]
		});
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table3", {
				enableColumnReordering : false,
				enableColumnFreeze : false,
				columnHeaderHeight : 35,
				showNoData : true,
				selectionMode: "None",	
				showOverlay : false,
				enableBusyIndicator : true,
				visibleRowCount : 1
		});
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindElement("/Data");
		
		var col_info = [{id: "Status", label : "상태", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "userId", label : "사번", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Ename", label : "성명", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Field1", label : "직위", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Field2", label : "직급", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "department", label : "부서", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Field4", label : "목표", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Field5", label : "활동", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Field6", label : "실적", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Field7", label : "Rating", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Field8", label : "본인평가", plabel : "업적점수", span : 2, type : "string", sort : true, filter : true},
						{id: "Field9", label : "본인평가", plabel : "역량점수", span : 0, type : "string", sort : true, filter : true},
						{id: "Field8", label : "1차평가", plabel : "업적점수", span : 3, type : "string", sort : true, filter : true},
						{id: "Field9", label : "1차평가", plabel : "역량점수", span : 0, type : "string", sort : true, filter : true},
						{id: "Field9", label : "1차평가", plabel : "평가등급", span : 0, type : "string", sort : true, filter : true},
						{id: "Field8", label : "평가", plabel : "", span : 0, type : "goal", sort : true, filter : true},
						{id: "Field8", label : "목표", plabel : "", span : 0, type : "goal", sort : true, filter : true},
						{id: "Field9", label : "활동", plabel : "", span : 0, type : "activity", sort : true, filter : true}];
						
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		oTable.addEventDelegate({
			onAfterRendering : function(){
				common.Common.setRowspan();
			}
		});
		
		///////////////////////////////////////////////////////
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["2rem", "", "2rem"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "15px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oFilterBar]}).addStyleClass("FilterLayout"),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "15px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oSummary]}),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oTable]}),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})]
		});
		
		var oDialog = new sap.m.Dialog({
			title : "평가관리",
			contentWidth : "",
			contentHeight : "",
			content : [oContent],
			endButton : [new sap.m.Button({
							 icon : "sap-icon://decline",
							 text : "닫기",
							 type : "Emphasized",
							 press : function(){oDialog.close();}
						 })]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact"); 
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
