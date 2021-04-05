sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.Detail02", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		// var oFilterBar = new sap.ui.layout.HorizontalLayout({
		// 	allowWrapping : true,
		// 	content : [new sap.ui.layout.HorizontalLayout({
		// 				   content : [new sap.m.Text({text : oBundleText.getText("LABEL_05102")}).addStyleClass("FilterText"), // 평가연도
		// 							  new sap.m.ComboBox({
		// 								  selectedKey : "{Year}",
		// 							  	  width : "150px",
		// 							  	  items : [new sap.ui.core.Item({key : "2020", text : "2020"})]
		// 							  })]
		// 			   }).addStyleClass("Filter"),
		// 			   new sap.ui.layout.HorizontalLayout({
		// 				   content : [new sap.m.Text({text : oBundleText.getText("LABEL_05119")}).addStyleClass("FilterText paddingLeft5"), // 부문
		// 						      new sap.m.Input({
		// 		   				  	      valueHelpOnly : true,
		// 		   				  		  showValueHelp : true,
		// 		   				  	      value : "{Orgtx}"
		// 		   				      })]
		// 			   }).addStyleClass("Filter"),
		// 			   new sap.ui.layout.HorizontalLayout({
		// 				   content : [new sap.m.Text({text : oBundleText.getText("LABEL_05120")}).addStyleClass("FilterText paddingLeft5"), // 팀
		// 		   				      new sap.m.Input({
		// 						          valueHelpOnly : true,
		// 							      showValueHelp : true,
		// 						  	      value : "{Orgtx2}"
		// 						      })]
		// 			   }).addStyleClass("Filter"),
		// 			   new sap.ui.layout.HorizontalLayout({
		// 			   	   content : [new sap.m.Button({
		// 					   		      text : oBundleText.getText("LABEL_00100"), // 조회
		// 				   				  type : "Default",
		// 				   				  width : "70px",
		// 						   		  press : oController.onPressSearch2
		// 						      }).addStyleClass("button_search")]
		// 			   }).addStyleClass("Filter")]
		// });
		
		var oFilterBar = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true,
			content : [new sap.m.Text({text : oBundleText.getText("LABEL_05102")}).addStyleClass("FilterText"), // 평가연도
					   new sap.m.ComboBox({
						   selectedKey : "{Year}",
					  	   width : "150px",
					  	   items : [new sap.ui.core.Item({key : "2020", text : "2020"})]
					   }),
					   new sap.m.Text({text : oBundleText.getText("LABEL_05119")}).addStyleClass("FilterText paddingLeft20"), // 부문
					   new sap.m.Input({
	   				       valueHelpOnly : true,
	   				  	   showValueHelp : true,
	   				  	   width : "200px",
	   				  	   value : "{Orgtx}"
	   				   }),
					   new sap.m.Text({text : oBundleText.getText("LABEL_05120")}).addStyleClass("FilterText paddingLeft20"), // 팀
					   new sap.m.Input({
				           valueHelpOnly : true,
						   showValueHelp : true,
						   width : "200px",
						   value : "{Orgtx2}"
					   }).addStyleClass("paddingRigh20"),
					   new sap.m.Button({
					       text : oBundleText.getText("LABEL_00100"), // 조회
					   	   type : "Default",
					   	   width : "70px",
					 	   press : oController.onPressSearch2
					   }).addStyleClass("button_search")]
		});
		
		var oSummary = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true,
			content : [new sap.ui.layout.VerticalLayout({
				   width : "90px",
						   content : [new sap.ui.layout.HorizontalLayout({
									  	  content : [new sap.m.Text({text : oBundleText.getText("LABEL_05121")}).addStyleClass("info1 paddingBottom5")] // 인원
									  }),
									  new sap.m.ObjectNumber({
									  	  textAlign : "Begin",
									  	  state : "Information",
									  	  number : "{Count1}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.ui.layout.HorizontalLayout({
									  	  content : [new sap.m.Text({text : oBundleText.getText("LABEL_05122")}).addStyleClass("info1 paddingBottom5"), // 목표
									  				 new sap.m.Text({text : oBundleText.getText("LABEL_05142")}).addStyleClass("info2 paddingLeft1 paddingTop4")] // (평균건수)
									  }),
									  new sap.m.ObjectNumber({
									  	  textAlign : "Begin",
									  	  state : "Information",
									  	  number : "{Count2}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.ui.layout.HorizontalLayout({
									  	  content : [new sap.m.Text({text : oBundleText.getText("LABEL_05123")}).addStyleClass("info1 paddingBottom5"), // 활동
									  				 new sap.m.Text({text : oBundleText.getText("LABEL_05142")}).addStyleClass("info2 paddingLeft1 paddingTop4")] // (평균건수)
									  }),
									  new sap.m.ObjectNumber({
									  	  textAlign : "Begin",
									  	  state : "Information",
									  	  number : "{Count3}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.ui.layout.HorizontalLayout({
									  	  content : [new sap.m.Text({text : oBundleText.getText("LABEL_05124")}).addStyleClass("info1 paddingBottom5"), // 실적
									  				 new sap.m.Text({text : oBundleText.getText("LABEL_05142")}).addStyleClass("info2 paddingLeft1 paddingTop4")] // (평균건수)
									  }),
									  new sap.m.ObjectNumber({
									  	  textAlign : "Begin",
									  	  state : "Information",
									  	  number : "{Count4}"
									  }).addStyleClass("sapMObjectNumberLarge")]	
					   }).addStyleClass("TileContentLayout"),
					   new sap.ui.layout.VerticalLayout({
					   	   width : "120px",
						   content : [new sap.ui.layout.HorizontalLayout({
									  	  content : [new sap.m.Text({text : oBundleText.getText("LABEL_05125")}).addStyleClass("info1 paddingBottom5"), // Rating
									  				 new sap.m.Text({text : oBundleText.getText("LABEL_05143")}).addStyleClass("info2 paddingLeft1 paddingTop4")] // (평균점수)
									  }),
									  new sap.m.ObjectNumber({
									  	  textAlign : "Begin",
									  	  state : "Information",
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
								 height : "40px",
								 content : [new sap.m.ToolbarSpacer(),
											new sap.ui.core.Icon({
												src : "sap-icon://excel-attachment",
												size : "16px",
												color : "#333333",
												press : oController.onExport
											}).addStyleClass("cursorPointer")]
							 }).addStyleClass("toolbarNoBottomLine")]
		}).addStyleClass("sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		// 상태, 사번, 성명, 직위, 직급, 부서, 목표, 활동, 실적, Rating, 목표, 활동
		var col_info = [{id: "currentStep", label : oBundleText.getText("LABEL_05127"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "userId", label : oBundleText.getText("LABEL_05128"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Ename", label : oBundleText.getText("LABEL_05129"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "title", label : oBundleText.getText("LABEL_05130"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "custom01", label : oBundleText.getText("LABEL_05131"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "department", label : oBundleText.getText("LABEL_05132"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Count1", label : oBundleText.getText("LABEL_05133"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},
						{id: "Count2", label : oBundleText.getText("LABEL_05134"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},
						{id: "Count3", label : oBundleText.getText("LABEL_05135"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},
						{id: "rating", label : oBundleText.getText("LABEL_05136"), plabel : "", span : 0, type : "progress", sort : true, filter : true},
						{id: "Field8", label : oBundleText.getText("LABEL_05133"), plabel : "", span : 0, type : "goal", sort : true, filter : true, width : "80px"},
						{id: "Field9", label : oBundleText.getText("LABEL_05134"), plabel : "", span : 0, type : "activity", sort : true, filter : true, width : "80px"}];
						
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		oTable.addEventDelegate({
			onAfterRendering : function(){
				oController._Columns = [];
				
				for(var i=0; i<col_info.length-2; i++){ // 목표,활동으로 연결되는 부분 빼고 만들어준다.
					var column = {};
						column.label = col_info[i].label;
						column.property = col_info[i].id;
						column.type = "string";
						
					oController._Columns.push(column);
				}
			}
		});
		
		///////////////////////////////////////////////////////
		var oContent = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["2rem", "", "2rem"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oFilterBar]}),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.VerticalLayout({
											 	 	content : [oSummary, oTable]
											 	})]
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"})]
		});
		
		// var oContent = new sap.ui.layout.VerticalLayout({
		// 	content : [new sap.ui.core.HTML({content : "<div style='height:40px' />"}),
		// 			   oFilterBar,
		// 			   new sap.ui.core.HTML({content : "<div style='height:40px' />"}),
		// 			   oSummary,
		// 			   oTable,
		// 			   new sap.ui.core.HTML({content : "<div style='height:40px' />"})]
		// })
		
		var oDialog = new sap.m.Dialog({
			title : oBundleText.getText("LABEL_05126"), // 목표관리
			contentWidth : "1500px",
			contentHeight : "",
			content : [oContent],
			endButton : [new sap.m.Button({
							 //icon : "sap-icon://decline",
							 text : oBundleText.getText("LABEL_05137"), // 닫기
							 type : "Emphasized",
							 width : "70px",
							 press : function(){oDialog.close();}
						 })]
		});
		
		// oDialog.addStyleClass("sapUiSizeCompact"); 
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		
		return oDialog;
	}
});
