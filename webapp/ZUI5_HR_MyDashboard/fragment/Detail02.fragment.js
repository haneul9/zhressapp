sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.Detail02", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oFilterBar = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true,
			content : [new sap.ui.layout.HorizontalLayout({
						   allowWrapping : false,
						   content : [new sap.m.Text({text : "연도"}).addStyleClass("FilterText"),
									  new sap.m.ComboBox({
										  selectedKey : "{Year}",
									  	  width : "150px",
									  	  items : [new sap.ui.core.Item({key : "2020", text : "2020"})]
									  })]
					   }).addStyleClass("Filter"),
					   new sap.ui.layout.HorizontalLayout({
						   allowWrapping : false,
						   content : [new sap.m.Text({text : "부문"}).addStyleClass("FilterText"),
								      new sap.m.Input({
				   				  	      valueHelpOnly : true,
				   				  		  showValueHelp : true,
				   				  	      value : "{Orgtx}"
				   				      })]
					   }).addStyleClass("Filter"),
					   new sap.ui.layout.HorizontalLayout({
						   allowWrapping : false,
						   content : [new sap.m.Text({text : "팀"}).addStyleClass("FilterText"),
				   				      new sap.m.Input({
								          valueHelpOnly : true,
									      showValueHelp : true,
								  	      value : "{Orgtx2}"
								      })]
					   }).addStyleClass("Filter"),
					   new sap.m.Button({
					   	   icon : "sap-icon://search",
				   		   text : "조회",
				   		   type : "Reject",
					   	   //press : oController.onPressSearch3
					   }).addStyleClass("Filter")]
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
						   content : [new sap.m.Text({text : "목표(평균건수)"}).addStyleClass("FontFamily PaddingBottom5"),
									  new sap.m.ObjectNumber({
									  	  textAlign : "End",
									  	  state : "Error",
									  	  number : "{Count2}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.m.Text({text : "활동(평균건수)"}).addStyleClass("FontFamily PaddingBottom5"),
									  new sap.m.ObjectNumber({
									  	  textAlign : "End",
									  	  state : "Error",
									  	  number : "{Count3}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.m.Text({text : "실적(평균건수)"}).addStyleClass("FontFamily PaddingBottom5"),
									  new sap.m.ObjectNumber({
									  	  textAlign : "End",
									  	  state : "Error",
									  	  number : "{Count4}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.m.Text({text : "Rating(평균점수)"}).addStyleClass("FontFamily PaddingBottom5"),
									  new sap.m.ObjectNumber({
									  	  textAlign : "End",
									  	  state : "Error",
									  	  number : "{Count5}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout")]
		});
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_GoalTable", {
				enableColumnReordering : false,
				enableColumnFreeze : false,
				columnHeaderHeight : 35,
				showNoData : true,
				selectionMode: "None",	
				showOverlay : false,
				enableBusyIndicator : true,
				visibleRowCount : 1,
				extension : [new sap.m.Toolbar({
								 content : [new sap.m.Text({text : "목표관리"}).addStyleClass("FontFamily FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")]
		});
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info = [{id: "currentStep", label : "상태", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "userId", label : "사번", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Ename", label : "성명", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "title", label : "직위", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "custom01", label : "직급", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "department", label : "부서", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Count1", label : "목표", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Count2", label : "활동", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Count3", label : "실적", plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "rating", label : "Rating", plabel : "", span : 0, type : "progress", sort : true, filter : true},
						{id: "Field8", label : "목표", plabel : "", span : 0, type : "goal", sort : true, filter : true, width : "100px"},
						{id: "Field9", label : "활동", plabel : "", span : 0, type : "activity", sort : true, filter : true, width : "100px"}];
						
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oLayout2 = new sap.ui.layout.VerticalLayout({
			content : [oSummary, 
					   new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
					   oTable]
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
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oLayout2]}).addStyleClass("ContentLayout"),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"})]
		});
		
		var oDialog = new sap.m.Dialog({
			title : "목표관리",
			contentWidth : "",
			contentHeight : "",
			content : [oContent],
			endButton : [new sap.m.Button({
							 icon : "sap-icon://decline",
							 text : "닫기",
							 type : "Negative",
							 press : function(){oDialog.close();}
						 })]
		});
		
		oDialog.addStyleClass("sapUiSizeCompact"); 
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
