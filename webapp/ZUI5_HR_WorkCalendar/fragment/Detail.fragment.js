sap.ui.jsfragment("ZUI5_HR_WorkCalendar.fragment.Detail", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		// 비근무시간
		var oBrkbg = new sap.m.ComboBox({
			selectedKey : "{Brkbg}",
			width : "80px"
		});
		
		for(var i=0; i<=23; i++){
			oBrkbg.addItem(new sap.ui.core.Item({key : (i < 10 ? ("0"+i+"") : (i+"")), text : (i+"")}));
		}
		
		var oBrken = new sap.m.ComboBox({
			selectedKey : "{Brken}",
			width : "80px"
		});
		
		for(var i=0; i<=59; i++){
			oBrken.addItem(new sap.ui.core.Item({key : (i < 10 ? ("0"+i+"") : (i+"")), text : (i+"")}));
		}
		
		// 근태 table
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			noData: oBundleText.getText("LABEL_00901"), // No data found
			rowHeight: 37,
			columnHeaderHeight: 38
		}).addStyleClass("mt-10px mb-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// No, 구분, From, To, 시작시간, 종료시간, 인정시간, 사유
		var col_info = [{id: "Idx", label: "No.", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "50px"},
						{id: "Atext", label: oBundleText.getText("LABEL_63048"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Begda", label: "From", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width : "110px"},
						{id: "Endda", label: "To", plabel: "", resize: true, span: 0, type: "date", sort: true, filter: true, width : "110px"},
						{id: "Beguz", label: oBundleText.getText("LABEL_63049"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Enduz", label: oBundleText.getText("LABEL_63050"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Comtm", label: oBundleText.getText("LABEL_63051"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "80px"},
						{id: "Bigo", label: oBundleText.getText("LABEL_63052"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "230px", align : "Begin"}];
		
		common.makeTable.makeColumn(oController, oTable, col_info);
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 4,
			width : "100%",
			widths : ["20%", "30%", "20%", "30%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_00121")})], // 성명
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Ename}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_00191")})], // 사번
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Pernr}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_00156")})], // 부서명
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Stext}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_00124")})], // 직급
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{PGradeTxt}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63025")})], // 근로시간 제한대상자
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Tmlmt}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 	 colSpan : 3
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63026")})], // 근무유형
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Rtext}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63027")})], // 연차계산일
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Gendt}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63028")})], // 근태결재자
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Apper}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 	 colSpan : 3
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63029")})], // 일자
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Begda}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63030")})], // 요일
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Day}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63031")})], // 입문시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Entbg}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63032")})], // 적용출근시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Enfbg}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63033")})], // 출문시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Enten}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63034")})], // 적용퇴근시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Enfen}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63035")})], // 평일재근
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Norwk}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63036")})], // 비근무항목\n(조/중/석/야/팰리스)
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Mealb} / {Meall} / {Meald} / {Mealn} / {Welld}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63037")})], // 휴게시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Brktm}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63038")})], // 비근무시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.ui.layout.HorizontalLayout({
											 	 	content : [oBrkbg, 
											 	 			   new sap.m.Text({text : oBundleText.getText("LABEL_63053")}).addStyleClass("pl-5px pt-12px pr-5px"),
											 	 			   oBrken, 
											 	 			   new sap.m.Text({text : oBundleText.getText("LABEL_63054")}).addStyleClass("pl-5px pt-12px")]
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63039")})], // 연장신청 시작시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Otbet}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63040")})], // 연장신청 종료시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Otent}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63041")})], // 제근시간기준
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Workt2}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63042")})], // 근태인정시간
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Workt3}"})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63043")})], // 근태
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [oTable],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 	 colSpan : 3
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : oBundleText.getText("LABEL_63044")})], // 요청사유
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.TextArea({
											 	 	value : "{Reqrn}",
											 	 	width : "100%",
											 	 	rows : 3,
											 	 	maxLength : common.Common.getODataPropertyLength("ZHR_DASHBOARD_SRV", "WorkCalendarTab1", "Reqrn"),
											 	})],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle",
								 	 colSpan : 3
								 }).addStyleClass("Data")]
					})]
		});
		
		var oDialog = new sap.m.Dialog({
			contentWidth : "1200px",
			draggable : true,
			content : [oMatrix],
			title : oBundleText.getText("LABEL_63024"), // 근무현황 상세내역
			buttons : [new sap.m.Button({
						   text : oBundleText.getText("LABEL_63045"), // 비근무시간 저장
						   press : oController.onPressSave
					   }).addStyleClass("button-dark"),
					   new sap.m.Button({
						   text : oBundleText.getText("LABEL_63046"), // 철야근무
					   }).addStyleClass("button-dark"),
					   new sap.m.Button({
						   text : oBundleText.getText("LABEL_63047"), // 이상데이터 승인
					   }).addStyleClass("button-dark"),
					   new sap.m.Button({
						   text : oBundleText.getText("LABEL_00133"), // 닫기
						   press : function(){oDialog.close();}
					   }).addStyleClass("button-default custom-button-divide")]
		});
		
		oDialog.setModel(new sap.ui.model.json.JSONModel());
		oDialog.bindElement("/Data");
		oDialog.addStyleClass("custom-dialog-popup");
		
		return oDialog;
	}
});
