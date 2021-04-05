sap.ui.jsfragment("ZUI5_HR_LeaveUseChart.fragment.Table", {
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
		});//.addStyleClass("mt-8px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
		var col_info = [];
		
		if(oController._ListCondJSonModel.getProperty("/Data/Disty") == "1"){ // 부서별
						// No, 소속부서, 인원수, 당월 연차사용률(경영관리직, 연구전문직, 사무지원직, 지원직, 기타), 연간 연차사용률
			col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Orgtx", label: oBundleText.getText("LABEL_00122"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Empcnt", label: oBundleText.getText("LABEL_41009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Cur01", label: oBundleText.getText("LABEL_41010"), plabel: oBundleText.getText("LABEL_41011"), resize: true, span: 6, type: "link", sort: true, filter: true},
						{id: "Cur02", label: oBundleText.getText("LABEL_41010"), plabel: oBundleText.getText("LABEL_41012"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Cur03", label: oBundleText.getText("LABEL_41010"), plabel: oBundleText.getText("LABEL_41013"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Cur04", label: oBundleText.getText("LABEL_41010"), plabel: oBundleText.getText("LABEL_41014"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Cur05", label: oBundleText.getText("LABEL_41010"), plabel: oBundleText.getText("LABEL_41015"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Cur06", label: oBundleText.getText("LABEL_41010"), plabel: oBundleText.getText("LABEL_41017"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Cum01", label: oBundleText.getText("LABEL_41038"), plabel: oBundleText.getText("LABEL_41011"), resize: true, span: 6, type: "link", sort: true, filter: true},
						{id: "Cum02", label: oBundleText.getText("LABEL_41038"), plabel: oBundleText.getText("LABEL_41012"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Cum03", label: oBundleText.getText("LABEL_41038"), plabel: oBundleText.getText("LABEL_41013"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Cum04", label: oBundleText.getText("LABEL_41038"), plabel: oBundleText.getText("LABEL_41014"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Cum05", label: oBundleText.getText("LABEL_41038"), plabel: oBundleText.getText("LABEL_41015"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Cum06", label: oBundleText.getText("LABEL_41038"), plabel: oBundleText.getText("LABEL_41017"), resize: true, span: 0, type: "link", sort: true, filter: true}];
						
		} else { // 직원별
						// No, 사번, 성명, 직위, 직군, 소속부서, 발생개수, 사용개수(1월~12월, 합계), 잔여개수, 소진율(%)
			col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "60px"},
						{id: "Pernr", label: oBundleText.getText("LABEL_41016"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: oBundleText.getText("LABEL_41018"), plabel: "", resize: true, span: 6, type: "string", sort: true, filter: true},
						{id: "ZtitleT", label: oBundleText.getText("LABEL_41019"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "PgradeT", label: oBundleText.getText("LABEL_41020"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Orgtx", label: oBundleText.getText("LABEL_00122"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Crecnt", label: oBundleText.getText("LABEL_41021"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Usecnt01", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41023"), resize: true, span: 13, type: "link", sort: true, filter: true},
						{id: "Usecnt02", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41024"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt03", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41025"), resize: true, span: 6, type: "link", sort: true, filter: true},
						{id: "Usecnt04", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41026"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt05", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41027"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt06", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41028"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt07", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41029"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt08", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41030"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt09", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41031"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt10", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41032"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt11", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41033"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt12", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41034"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Usecnt", label: oBundleText.getText("LABEL_41022"), plabel: oBundleText.getText("LABEL_41035"), resize: true, span: 0, type: "link", sort: true, filter: true},
						{id: "Balcnt", label: oBundleText.getText("LABEL_41036"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Userte", label: oBundleText.getText("LABEL_41037"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
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
						case "Cur06":
						case "Crecnt":
						case "Balcnt":
							color = "rgba(255, 250, 193, 0.4)";  
							break;
						case "Cum06":
						case "Usecnt07":
							color = "rgba(255, 216, 216, 0.4)";  
							break;
						case "Usecnt":
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
