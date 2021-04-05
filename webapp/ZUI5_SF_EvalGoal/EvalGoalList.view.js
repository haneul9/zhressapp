sap.ui.jsview("ZUI5_SF_EvalGoal.EvalGoalList", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_SF_EvalGoal.EvalGoalList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		var oFilterBar = new sap.ui.layout.HorizontalLayout({
			allowWrapping : true,
			content : [new sap.m.Text({text : oBundleText.getText("LABEL_05102")}).addStyleClass("FilterText"), // 평가연도 
					   new sap.m.ComboBox({
						   selectedKey : "{Year}",
					  	   width : "150px",
					  	   editable : {
					  	   		path : "Edit",
					  	   		formatter : function(fVal){
					  	   			return fVal == "X" ? false : true;
					  	   		}
					  	   },
					  	   items : [new sap.ui.core.Item({key : "2020", text : "2020"})]
					   }),
					   //new sap.m.Text({text : oBundleText.getText("LABEL_05119")}).addStyleClass("FilterText paddingLeft20"), // 부문
					   //new sap.m.Input({
	   				//       valueHelpOnly : true,
	   				//   	   showValueHelp : true,
	   				//   	   width : "200px",
	   				//   	   value : "{Orgtx}"
	   				//   }),
					   new sap.m.Text({text : oBundleText.getText("LABEL_05120")}).addStyleClass("FilterText paddingLeft20"), // 팀
					   new sap.m.ComboBox(oController.PAGEID + "_Department", {
						   width : "250px",
						   value : "{department}",
						   change : oController.onChangeDepartment,
						   editable : {
						   		path : "Edit",
						   		formatter : function(fVal){
						   			return fVal == "X" ? false : true;
						   		}
						   }
					   }).addStyleClass("paddingRigh20"),
					   new sap.m.Button({
					       text : oBundleText.getText("LABEL_00100"), // 조회
					   	   type : "Default",
					   	   width : "70px",
					 	   press : oController.onPressSearch,
					 	   enabled : {
					 	   		path : "Edit",
					 	   		formatter : function(fVal){
					 	   			return fVal == "X" ? false : true;
					 	   		}
					 	   }
					   }).addStyleClass("button_search")]
		}).addStyleClass("paddingLeft5");
		
		var oFilter = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["", "45px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [oFilterBar],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.FormattedText(oController.PAGEID + "_Status", {width: "42px", height: "42px", htmlText: "<em>Loading</em>"}).addStyleClass("spinner-container")]
								 })]
					})]
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
				visibleRowCount : 1
		}).addStyleClass("sapUiSizeCompact");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		// 상태, 사번, 성명, 직위, 직급, 부서, 목표, 활동, 실적, Rating, 목표, 활동
		var col_info = [{id: "currentStep", label : oBundleText.getText("LABEL_05127"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "userId", label : oBundleText.getText("LABEL_05128"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Ename", label : oBundleText.getText("LABEL_05129"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "title", label : oBundleText.getText("LABEL_05130"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "custom01", label : oBundleText.getText("LABEL_05131"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "department", label : oBundleText.getText("LABEL_05132"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "230px", align : "Begin"},
						{id: "Count1", label : oBundleText.getText("LABEL_05133"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},
						{id: "Count2", label : oBundleText.getText("LABEL_05134"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},
						{id: "Count3", label : oBundleText.getText("LABEL_05135"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "100px"},
						{id: "rating", label : oBundleText.getText("LABEL_05136"), plabel : "", span : 0, type : "progress", sort : true, filter : true, width : "230px"},
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
			widths : ["40px", "", "40px"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : oBundleText.getText("LABEL_05106")}).addStyleClass("title paddingtop12 paddingLeft5")] // 목표관리
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({content : [oFilter]}),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.VerticalLayout({
											 	 	content : [oSummary, 
											 	 			   new sap.m.Toolbar({
											 	 			   	   content : [new sap.m.ToolbarSpacer(),
											 	 			   				  new sap.m.Button({
																				  text : "Excel",
																				  type : "Default",
																				  press : oController.onExport
																			  }).addStyleClass("button-light")]
											 	 			   }).addStyleClass("toolbarNoBottomLine"),
											 	 			   new sap.ui.core.HTML({content : "<div style='height:5px' />"}),
											 	 			   oTable]
											 	})]
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell()]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "40px"})]
		});
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			title : "목표관리",
			showHeader : false,
			content: [oContent],
			footer : []
		});
		
		oPage.addStyleClass("WhiteBackground");
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}

});