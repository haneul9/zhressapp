$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");

sap.ui.jsview("ZUI5_SF_EvalCollFin.List", {
	
	getControllerName: function() {
		return "ZUI5_SF_EvalCollFin.List";
	},
	
	createContent: function(oController) {
		// 사용할 odata service 정의
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_APPRAISAL_SRV");
		
		var oAppye = new sap.m.ComboBox({
						 width: "250px",
						 selectedKey: "{Appye}"
					 });
		
		for(var i=2020; i<=(new Date().getFullYear()); i++){
			oAppye.addItem(new sap.ui.core.Item({key : (i + ""), text : i}));
		}
		
		var oSearchFlexBox = new sap.m.FlexBox({
			fitContainer: true,
			items: [new sap.m.FlexBox({
						items: [new sap.m.Label({text: oBundleText.getText("LABEL_20007")}), // 평가연도
								oAppye]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [new sap.m.Button({
									text: oBundleText.getText("LABEL_00100"), // 조회
									press : oController.onPressSearch
								}).addStyleClass("button-light")]
					}).addStyleClass("button-group")]
		}).addStyleClass("search-box");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight : 35,
			showNoData : true,
			selectionMode: "None",
			showOverlay : false,
			enableBusyIndicator : true,
			visibleRowCount : 1,
			rowSettingsTemplate : [new sap.ui.table.RowSettings({
									   highlight : {
										  path : "Evstaus",
										  formatter : function(fVal){
											  if(fVal == "35") return "Warning";
											  else if(fVal == "40") return "Success";
											  else if(fVal == "45") return "Error";
											  else if(fVal == "50") return "Information";
											  else return "None";
										  }
										}
								   })],
			extension : [new sap.m.Toolbar({
							 height : "45px",
							 content : [new sap.m.ToolbarSpacer(),
										new sap.m.Button({
											text: "Excel",
											press : oController.onExport
										}).addStyleClass("button-light")]
						 }).addStyleClass("table_toolbar")]
			// rowActionCount : 1,
			// rowActionTemplate : [new sap.ui.table.RowAction({
		 //                            items : [new sap.ui.table.RowActionItem({
			// 	                                   type : "Custom",
			// 	                                   icon : "sap-icon://edit",
			// 	                                   //visible : {
			// 	                                   //		path : "Button",
			// 	                                   //		formatter : function(fVal){
			// 	                                   //			return fVal == "X" ? true : false;
			// 	                                   //		}
			// 	                                   //},
			// 	                                   visible : {
			// 	                                   		path : "Isstxt",
			// 	                                   		formatter : function(fVal){
			// 	                                   			return fVal != "" ? true : false;
			// 	                                   		}
			// 	                                   },
			// 							  		   customData : new sap.ui.core.CustomData({key : "", value : "{}"}),
			// 							  		   press : oController.onPressDetail
			// 	                              })]
		 //                        })]
		}).addStyleClass("sapUiSizeCompact mainTable");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
								// 상태,사번,성명,직위,직급,직책,평가부서
		var col_info = [{id: "Idx", label : "No.", plabel : "", span : 0, type : "string", sort : true, filter : true, width : "50px"},
						{id: "Evstaustx", label : oBundleText.getText("LABEL_20026"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "110px"},
						// {id: "Pernr", label : oBundleText.getText("LABEL_20008"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Ename", label : oBundleText.getText("LABEL_20009"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						// {id: "Ztitletx", label : oBundleText.getText("LABEL_20010"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "ZpGradetx", label : oBundleText.getText("LABEL_20029"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Zposttx", label : oBundleText.getText("LABEL_20011"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Evorgtx", label : oBundleText.getText("LABEL_20012"), plabel : "", span : 0, type : "string", sort : true, filter : true, width : "180px"},
						// 1차평가(업적,역량,다면,등급)
						{id: "Pepnt", label : oBundleText.getText("LABEL_20013"), plabel : oBundleText.getText("LABEL_20014"), span : 4, type : "string", sort : true, filter : true, width : "70px"},
						{id: "Cepnt", label : oBundleText.getText("LABEL_20013"), plabel : oBundleText.getText("LABEL_20015"), span : 0, type : "string", sort : true, filter : true, width : "70px"},
						{id: "Mepnt", label : oBundleText.getText("LABEL_20013"), plabel : oBundleText.getText("LABEL_20016"), span : 0, type : "string", sort : true, filter : true, width : "70px"},
						{id: "Pegrade", label : oBundleText.getText("LABEL_20013"), plabel : oBundleText.getText("LABEL_20017"), span : 0, type : "string", sort : true, filter : true, width : "70px"},
						// 2차평가,종합등급,1차평가자,2차평가자,평가세션자
						{id: "Pegrade2", label : oBundleText.getText("LABEL_20018"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Cograde", label : oBundleText.getText("LABEL_20019"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Ename1st", label : oBundleText.getText("LABEL_20020"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Ename2st", label : oBundleText.getText("LABEL_20021"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						{id: "Ename3st", label : oBundleText.getText("LABEL_20022"), plabel : "", span : 0, type : "string", sort : true, filter : true},
						// 과거이력(...),평가결과,사원정보,이의제기 처리
						{id: "Pgrade1", label : oBundleText.getText("LABEL_20023"), plabel2 : oController.PAGEID + "_Year1", span : 3, type : "string", sort : true, filter : true, width : "70px"},
						{id: "Pgrade2", label : oBundleText.getText("LABEL_20023"), plabel2 : oController.PAGEID + "_Year2", span : 0, type : "string", sort : true, filter : true, width : "70px"},
						{id: "Pgrade3", label : oBundleText.getText("LABEL_20023"), plabel2 : oController.PAGEID + "_Year3", span : 0, type : "string", sort : true, filter : true, width : "70px"},
						{id: "Pernr", label : oBundleText.getText("LABEL_20024"), plabel : "", span : 0, type : "evalresult", sort : true, filter : true, width : "50px"},
						{id: "Pernr", label : oBundleText.getText("LABEL_20025"), plabel : "", span : 0, type : "empprofile", sort : true, filter : true, width : "50px"},
						{id: "Isstxt", label : oBundleText.getText("LABEL_20030"), plabel : "", span : 0, type : "collfin", sort : true, filter : true, width : "80px"}];
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		oTable.addEventDelegate({
			onAfterRendering : function(){
				setTimeout(function(){
					oController._Columns = [];
					
					for(var i=0; i<col_info.length-3; i++){
						// excel template
						var column = {};
							column.label = (col_info[i].plabel2 ? "" : (col_info[i].plabel == "" ? col_info[i].label : (col_info[i].label + "-" + col_info[i].plabel)));
							column.property = col_info[i].id;
							column.type = "string";
							
						oController._Columns.push(column);
						
						var color = "";
						switch(col_info[i].id){
							case "Cograde":
								color = "rgba(214, 239, 245, 0.4)";  
								break;
						}
						
						if(color == "") continue;
						$("tr[id^='" + oController.PAGEID + "_Table-rows'] > td[id$='col" + i +"']").css("background-color", color);
					}
					
					var oColspan = 1, oCount = 1;
					$("tr[role]").each(function(index, item){
						if($(item).hasClass("sapUiTableHeaderRow") == true){
							$(item).height(35);
						}
					});
					
				    $("td[data-sap-ui-colindex]").each(function(index, item){
						if(item.id.match(/_1/g)) return true;
						
						if(item.colSpan == 1){
							if(oColspan == 1){
								$("#" + item.id).attr("rowspan", "2");
								$("#" + item.id + "_1").css("display", "none");
							} else {
								oCount++;
			
								if(oColspan != oCount){
									return true;
								} else {
									oColspan = 1, oCount = 1;
								}
							}
						} else {
							oColspan = item.colSpan;
							$("#" + item.id).css("border-bottom", "1px solid #e4e4e4");
						}
					});
					
				}, 100);
			}
		});
		
		var oIconFilterAll = new sap.m.IconTabFilter(oController.PAGEID + "_IconFilterAll", {
			text : oBundleText.getText("LABEL_20002"),	// 전체
			key : "All",
			icon : "sap-icon://documents",
			design : "Vertical",
			iconColor : "Neutral",
			count : "{Count0}"
		});
		
		var oIconFilter1 = new sap.m.IconTabFilter(oController.PAGEID + "_IconFilter1", {
			text : oBundleText.getText("LABEL_20003"),	// 이의제기
			key : "35",
			icon : "sap-icon://user-edit",
			design : "Vertical",
			iconColor : "Critical",
			count : "{Count1}"
		});

		var oIconFilter2 = new sap.m.IconTabFilter(oController.PAGEID + "_IconFilter2", {
			text : oBundleText.getText("LABEL_20031"),	// 평가완료
			key : "20",
			icon : "sap-icon://complete",
			design : "Vertical",
			iconColor : "Neutral",
			count : "{Count2}"
		});

		var oIconFilter3 = new sap.m.IconTabFilter(oController.PAGEID + "_IconFilter3", {
			text : oBundleText.getText("LABEL_20005"),	// 인정
			key : "40",
			icon : "sap-icon://accept",
			design : "Vertical",
			iconColor : "Positive",
			count : "{Count3}"
		});
		
		var oIconFilter4 = new sap.m.IconTabFilter(oController.PAGEID + "_IconFilter4", {
			text : oBundleText.getText("LABEL_20006"),	// 결과합의
			key : "50",
			icon : "sap-icon://complete",
			design : "Vertical",
			iconColor : "Default",
			count : "{Count4}"
		});
		
		var oIcontabbar = new sap.m.IconTabBar(oController.PAGEID + "_Icontabbar", {
			expandable : false,
			expanded : true,
			backgroundDesign : "Transparent",
			items : [oIconFilterAll, new sap.m.IconTabSeparator(), 
					 oIconFilter2, new sap.m.IconTabSeparator({icon : "sap-icon://process"}), 
					 oIconFilter1, new sap.m.IconTabSeparator({icon : "sap-icon://process"}), 
					 oIconFilter3, new sap.m.IconTabSeparator({icon : "sap-icon://process"}),
					 oIconFilter4],
			select : oController.handleIconTabBarSelect,
			content : [oTable]
		}).addStyleClass("custom-icon-tab-bar mt-40px");
		
		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: "Column",
						  items: [new sap.m.FlexBox({
									  alignItems: "End",
									  fitContainer: true,
									  items: [new sap.m.Text({text: oBundleText.getText("LABEL_20001")}).addStyleClass("app-title")] // 결과조회
								  }).addStyleClass("app-title-container"),
								  oSearchFlexBox,
								  oIcontabbar]
					  }).addStyleClass("app-content-container-wide")]
		}).addStyleClass("app-content-body");
				
		/////////////////////////////////////////////////////////

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
			content: [oContent]
		}).addStyleClass("app-content");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});