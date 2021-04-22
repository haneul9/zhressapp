sap.ui.jsfragment("ZUI5_HR_FlexworktimeStatus.fragment.Calendar", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		
		var oRow, oCell;
		var vHeader = [{title:oBundleText.getText("LABEL_48057"), width:"", noCalDay:"", sunday:"", saturday:""}, // 월
		               {title:oBundleText.getText("LABEL_48058"), width:"", noCalDay:"", sunday:"", saturday:""}, // 화
		               {title:oBundleText.getText("LABEL_48059"), width:"", noCalDay:"", sunday:"", saturday:""}, // 수
		               {title:oBundleText.getText("LABEL_48060"), width:"", noCalDay:"", sunday:"", saturday:""}, // 목
		               {title:oBundleText.getText("LABEL_48061"), width:"", noCalDay:"", sunday:"", saturday:""}, // 금
		               {title:oBundleText.getText("LABEL_48062"), width:"", noCalDay:"", sunday:"", saturday:"X"}, // 토
		               {title:oBundleText.getText("LABEL_48056"), width:"", noCalDay:"", sunday:"X", saturday:""}]; // 일
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyyMMdd"});
		var currDate = dateFormat.format(new Date()); 
		
		var oData = oController._ListCondJSonModel.getProperty("/Data");
		
		var y = oData.Year;
		var m = parseInt(oData.Month) - 1;

		var getLastDate = function(y, m) {
			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
			if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) last[1] = 29;

			return last[m];
		};
		
		// 현재 년(y)월(m)의 1일(1)의 요일을 구합니다.
		var theDate = new Date(y,m,1);
		var preDate = new Date(y,m-1,1);
		
		// 그 날의 요일은? (월요일을 주의 시작일로 지정하기 위하여 계산)
		var theDay = ( theDate.getDay() + 6 ) % 7;
		var preLastDate = getLastDate(preDate.getFullYear(), preDate.getMonth());

		var lastDate;
		var row;
		var startPreDate;
		var calDate;
		var nextDate;
		
		// 현재 월의 마지막 일이 며칠인지 구합니다.
		lastDate = getLastDate(y, m);
		
		/* 현재 월의 달력에 필요한 행의 개수를 구합니다. */
		// theDay(빈 칸의 수), lastDate(월의 전체 일수)
		row = Math.ceil((theDay+lastDate)/7); 
		startPreDate = preLastDate - theDay + 1;
		calDate = 1;
		nextDate = 1;
		
		var vWidths = [];
		for(var i=0; i<vHeader.length; i++){
			vWidths.push(vHeader[i].width);
		}
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 7,
			widths : vWidths,
			width : "100%"
		});
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height:"25px"});
		for(var i=0; i<vHeader.length; i++){
			oCell = new sap.ui.commons.layout.MatrixLayoutCell(oController.PAGEID + "_CalHeadCell_" + i, {
				hAlign : "Center",
				vAlign : "Middle",
				content : [new sap.m.Text({text:vHeader[i].title})]
			});
			
			if(i == 0) oCell.addStyleClass("calendar-TableHeader2-Start"); 
			else oCell.addStyleClass("calendar-TableHeader2");
			
			oRow.addCell(oCell);
		}
		oMatrix.addRow(oRow);
		
		for(var i=0; i<row; i++) {
			oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "80px"});
			
			for (var j=0; j<vHeader.length; j++) {
				var vCellId = oController.PAGEID;
				if(vHeader[j].noCalDay) {
					vCellId += "_0" + i;
				} else {
//					if(i == 0 && preLastDate >= startPreDate) {
					if(preLastDate >= startPreDate) {
						var toDay = dateFormat.format(new Date(y,m-1,startPreDate));
						vCellId += "_" + toDay;
					} else {
						if(lastDate >= calDate) {
							var toDay = dateFormat.format(new Date(y,m,calDate));
							vCellId += "_" + toDay;
						} else {
							var toDay = dateFormat.format(new Date(y,(m * 1)+1,nextDate));
							vCellId += "_" + toDay;
						}
					}
				}
				
				var oCellid = new sap.m.ScrollContainer(vCellId, {
					width : "100%",
					height : "100%",
					horizontal : false,
					vertical : false,
					focusable : false
				});
				
				oCell = new sap.ui.commons.layout.MatrixLayoutCell({
					hAlign : "Left",
					vAlign : "Top",
					content : oCellid
				}).addStyleClass("calendar-Padding0");
				
				if(j==0) oCell.addStyleClass("calendar-TableData-Start");
				else oCell.addStyleClass("calendar-TableData");
				
				if(vHeader[j].noCalDay) {
					// 달력날짜 이외의 필드
				} else {
					if(preLastDate >= startPreDate) {
						// 이전달 필드
						oCell.addStyleClass("calendar-other-month");
						startPreDate++;
					} else {
						if(lastDate >= calDate) {
							var toDay = dateFormat.format(new Date(y,m,calDate));
							// 현재달 필드
							if(toDay === currDate) {
								oCell.addStyleClass("background-color-lightorange");
							}
							
							calDate++;
						} else {
							// 다음달 필드
							oCell.addStyleClass("calendar-other-month");
							nextDate++;
						}
					}
				}
				
				oRow.addCell(oCell);
			}
			
			oMatrix.addRow(oRow);
		};
		
		return oMatrix;
	}
});
