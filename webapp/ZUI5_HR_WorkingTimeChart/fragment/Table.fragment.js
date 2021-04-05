sap.ui.jsfragment("ZUI5_HR_WorkingTimeChart.fragment.Table", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: oBundleText.getText("LABEL_00901"), // No data found
			// sort : oController.onTableSort
			sort : common.makeTable.onTableSort
		}); //.addStyleClass("mt-8px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info = [];
		
		if(oController._ListCondJSonModel.getProperty("/Data/Disty") == "1"){ // 부서별
						// No, 소속부서, 인원수
			col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Orgtx", label: oBundleText.getText("LABEL_00122"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Empcnt", label: oBundleText.getText("LABEL_41009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						// 한도(기본,연장)
						{id: "Hrs10", label: oBundleText.getText("LABEL_46014"), plabel: oBundleText.getText("LABEL_46015"), resize: true, span: 2, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Hrs11", label: oBundleText.getText("LABEL_46014"), plabel: oBundleText.getText("LABEL_46016"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						// 근무시간(기본,연장,소계)
						{id: "Hrs20", label: oBundleText.getText("LABEL_46018"), plabel: oBundleText.getText("LABEL_46015"), resize: true, span: 3, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Hrs21", label: oBundleText.getText("LABEL_46018"), plabel: oBundleText.getText("LABEL_46016"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Hrs22", label: oBundleText.getText("LABEL_46018"), plabel: oBundleText.getText("LABEL_46017"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						// 근무시간(평일)(기본,연장,소계)
						{id: "Hrs30", label: oBundleText.getText("LABEL_46019"), plabel: oBundleText.getText("LABEL_46015"), resize: true, span: 3, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Hrs31", label: oBundleText.getText("LABEL_46019"), plabel: oBundleText.getText("LABEL_46016"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Hrs32", label: oBundleText.getText("LABEL_46019"), plabel: oBundleText.getText("LABEL_46017"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						// 근무시간(휴일)(기본,연장,소계)
						{id: "Hrs40", label: oBundleText.getText("LABEL_46020"), plabel: oBundleText.getText("LABEL_46015"), resize: true, span: 3, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Hrs41", label: oBundleText.getText("LABEL_46020"), plabel: oBundleText.getText("LABEL_46016"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						{id: "Hrs42", label: oBundleText.getText("LABEL_46020"), plabel: oBundleText.getText("LABEL_46017"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"},
						// 심야
						{id: "Hrs50", label: oBundleText.getText("LABEL_46021"), plabel: oBundleText.getText("LABEL_41017"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "100px"}];
						
		} else { // 직원별
						// No, 사번, 성명, 직급, 직급구분, 소속부서, 
			col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Pernr", label: oBundleText.getText("LABEL_41016"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_41018"), plabel: "", resize: true, span: 6, type: "string", sort: true, filter: true},
						{id: "PgradeT", label: oBundleText.getText("LABEL_00124"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "HgradeT", label: oBundleText.getText("LABEL_00137"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Orgtx", label: oBundleText.getText("LABEL_00122"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "250px"},
						// 한도(기본,연장)
						{id: "Hrs10", label: oBundleText.getText("LABEL_46014"), plabel: oBundleText.getText("LABEL_46015"), resize: true, span: 2, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Hrs11", label: oBundleText.getText("LABEL_46014"), plabel: oBundleText.getText("LABEL_46016"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						// 근무시간(기본,연장,소계)
						{id: "Hrs20", label: oBundleText.getText("LABEL_46018"), plabel: oBundleText.getText("LABEL_46015"), resize: true, span: 3, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Hrs21", label: oBundleText.getText("LABEL_46018"), plabel: oBundleText.getText("LABEL_46016"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Hrs22", label: oBundleText.getText("LABEL_46018"), plabel: oBundleText.getText("LABEL_46017"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						// 근무시간(평일)(기본,연장,소계)
						{id: "Hrs30", label: oBundleText.getText("LABEL_46019"), plabel: oBundleText.getText("LABEL_46015"), resize: true, span: 3, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Hrs31", label: oBundleText.getText("LABEL_46019"), plabel: oBundleText.getText("LABEL_46016"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Hrs32", label: oBundleText.getText("LABEL_46019"), plabel: oBundleText.getText("LABEL_46017"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						// 근무시간(휴일)(기본,연장,소계)
						{id: "Hrs40", label: oBundleText.getText("LABEL_46020"), plabel: oBundleText.getText("LABEL_46015"), resize: true, span: 3, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Hrs41", label: oBundleText.getText("LABEL_46020"), plabel: oBundleText.getText("LABEL_46016"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Hrs42", label: oBundleText.getText("LABEL_46020"), plabel: oBundleText.getText("LABEL_46017"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						// 심야
						{id: "Hrs50", label: oBundleText.getText("LABEL_46021"), plabel: oBundleText.getText("LABEL_41017"), resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"}];
		}
		
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		oTable.addEventDelegate({
			onAfterRendering : function(){
				common.makeTable.setRowspan();
				
				oController._Columns = [];
				for(var i=0; i<col_info.length; i++){
					var column = {};
						column.label = col_info[i].plabel == "" ? col_info[i].label : (col_info[i].label + "-" + col_info[i].plabel);
						column.property = col_info[i].id;
						column.type = "string";
						column.width = 20;
					oController._Columns.push(column);
					
					var color = "";
					switch(col_info[i].id){
						case "Hrs22":
						case "Hrs32":
						case "Hrs42":
							color = "rgba(255, 250, 193, 0.4)";  
							break;
						case "Hrs10":
						case "Hrs11":
							color = "rgba(186, 238, 154, 0.4)";  
							break;
						default:
							color = "";
							break;
					}
					
					if(color == "") continue;
					
					$("tr[id^='" + oController.PAGEID + "_Table-rows'] > td[id$='col" + i +"']").css("background-color", color);
				}	
			}
		});
		
		return oTable;
	}
});
