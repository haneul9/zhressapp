sap.ui.jsfragment("ZUI5_HR_EvalComp.fragment.content02", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		// var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table2", {
		// 	selectionMode: "None",
		// 	enableColumnReordering: false,
		// 	enableColumnFreeze: false,
		// 	enableBusyIndicator: true,
		// 	visibleRowCount: 1,
		// 	showOverlay: false,
		// 	showNoData: true,
		// 	noData: oBundleText.getText("LABEL_00901"), // No data found
		// 	extension : [new sap.m.Toolbar({
		// 					 height : "45px",
		// 					 content : [/*new sap.m.MessageStrip({
		// 								 	type : "Information",
		// 									customIcon : "sap-icon://alert",
		// 									showIcon : true,
		// 								 	text : oBundleText.getText("MSG_26004")
		// 								}),*/
		// 								new sap.ui.layout.HorizontalLayout({
		// 									content : [new sap.ui.core.Icon({
		// 												   src : "sap-icon://alert",
		// 												   size : "14px",
		// 												   color : "#0a6ed1"
		// 											   }).addStyleClass("paddingTop4 paddingRight10"),
		// 											   new sap.m.Text({text : oBundleText.getText("MSG_26004")})] // 등급부여기준 : 아래와 같은 기준으로 인원수를 분배하여 부여해 주시기 바랍니다.
		// 								}).addStyleClass("custom-messagestrip")]
		// 				 }).addStyleClass("toolbarNoBottomLine")]
		// }).addStyleClass("mt-8px");
		
		// oTable.setModel(new sap.ui.model.json.JSONModel());
		// oTable.bindRows("/Data");
		
		// 				// 평가 인원, 배분율 인원, 등급 부여 인원
		// var col_info = [{id: "Percn", label: oBundleText.getText("LABEL_26023"), plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false},
		// 				{id: "Clas5", label: oBundleText.getText("LABEL_26024"), plabel: "S", resize: true, span: 5, type: "string", sort: false, filter: false},
		// 				{id: "Clas4", label: oBundleText.getText("LABEL_26024"), plabel: "A", resize: true, span: 0, type: "string", sort: false, filter: false},
		// 				{id: "Clas3", label: oBundleText.getText("LABEL_26024"), plabel: "B", resize: true, span: 0, type: "string", sort: false, filter: false},
		// 				{id: "Clas2", label: oBundleText.getText("LABEL_26024"), plabel: "C", resize: true, span: 0, type: "string", sort: false, filter: false},
		// 				{id: "Clas1", label: oBundleText.getText("LABEL_26024"), plabel: "D", resize: true, span: 0, type: "string", sort: false, filter: false},
		// 				{id: "Clas5A", label: oBundleText.getText("LABEL_26025"), plabel: "S", resize: true, span: 5, type: "string2", sort: false, filter: false},
		// 				{id: "Clas4A", label: oBundleText.getText("LABEL_26025"), plabel: "A", resize: true, span: 0, type: "string2", sort: false, filter: false},
		// 				{id: "Clas3A", label: oBundleText.getText("LABEL_26025"), plabel: "B", resize: true, span: 0, type: "string2", sort: false, filter: false},
		// 				{id: "Clas2A", label: oBundleText.getText("LABEL_26025"), plabel: "C", resize: true, span: 0, type: "string2", sort: false, filter: false},
		// 				{id: "Clas1A", label: oBundleText.getText("LABEL_26025"), plabel: "D", resize: true, span: 0, type: "string2", sort: false, filter: false}];
				
		// oController.makeColumn(oController, oTable, col_info);
		
		// oTable.addEventDelegate({
		// 	onAfterRendering : function(){
		// 		common.Common.setRowspan();
		// 	}
		// });
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout(oController.PAGEID + "_Table2", {
			columns : 11,
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
													content : [new sap.ui.core.Icon({
																   src : "sap-icon://alert",
																   size : "14px",
																   color : "#0a6ed1"
															   }).addStyleClass("paddingTop4 paddingRight10"),
															   new sap.m.Text({text : "{i18n>MSG_26004}"})] // 등급부여기준 : 아래와 같은 기준으로 인원수를 분배하여 부여해 주시기 바랍니다.
												}).addStyleClass("custom-messagestrip")],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 11
								})]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{i18n>LABEL_26023}"})], // 평가대상인원
									 hAlign : "Center",
									 vAlign : "Middle",
									 rowSpan : 2
 								 }).addStyleClass("Label2"),
 								 new sap.ui.commons.layout.MatrixLayoutCell({
 								 	 content : [new sap.m.Text({text : "{i18n>LABEL_26024}"})], // 기준 인원
 								 	 hAlign : "Center",
 								 	 vAlign : "Middle",
 								 	 colSpan : 5
 								 }).addStyleClass("Label2"),
 								 new sap.ui.commons.layout.MatrixLayoutCell({
 								 	 content : [new sap.m.Text({text : "{i18n>LABEL_26025}"})], // 현재 인원
 								 	 hAlign : "Center",
 								 	 vAlign : "Middle",
 								 	 colSpan : 5
 								 }).addStyleClass("Label2 evalcomp_label")]
					})]
		});
		
		oMatrix.setModel(new sap.ui.model.json.JSONModel());
		oMatrix.bindElement("/Data/0");
		
		var oRow, oCell;
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "35px"});
		var label = ["S", "A", "B", "C", "D", "S", "A", "B", "C", "D"];
		for(var i=0; i<label.length; i++){
			var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
							content : [new sap.m.Text({text : label[i]})],
							hAlign : "Center",
							vAlign : "Middle"
						}).addStyleClass("Label2");
			
			if(i>4){
				oCell.addStyleClass("evalcomp_label");
			}
			
			oRow.addCell(oCell);
		}
		oMatrix.addRow(oRow);
		
		oRow = new sap.ui.commons.layout.MatrixLayoutRow({height : "45px"});
		var field = ["Percn", "Clas5", "Clas4", "Clas3", "Clas2", "Clas1", "Clas5A", "Clas4A", "Clas3A", "Clas2A", "Clas1A"];
		for(var i=0; i<field.length; i++){
			var oTemplate;
			
			switch(field[i]){
				case "Clas5A":
				case "Clas4A":
				case "Clas3A":
				case "Clas2A":
					oTemplate = new sap.m.Text({
							    text : {
									parts : [{path : field[i]}, {path : (field[i].substring(0, field[i].length-1))}],
									formatter : function(fVal1, fVal2){
										this.removeStyleClass("FontRed");
										
										if(fVal1 > fVal2){
											this.addStyleClass("FontRed");
										}
										
										return fVal1;
									}
							    }
							}).addStyleClass("FontBold");
					break;
				case "Clas1A":
					// D: 배분율인원이 0인 경우, 초과여부 상관없이 기본으로 표기
					//    0이 아닌 경우, 초과 시 빨강으로 표기
					oTemplate = new sap.m.Text({
									text : {
										parts : [{path : field[i]}, {path : (field[i].substring(0, field[i].length-1))}],
										formatter : function(fVal1, fVal2){
											this.removeStyleClass("FontRed");
											
											if(fVal2 != 0 && (fVal1 > fVal2)){
												this.addStyleClass("FontRed");
											}
											
											return fVal1;
										}
									}
								}).addStyleClass("FontBold");
					break;
				case "Clas1":
					oTemplate = new sap.m.Text({
									text : {
										path : field[i],
										formatter : function(fVal){ // 절대
											return fVal == 0 ? oBundleText.getText("LABEL_26029") : fVal;
										}
									}
								});
					break;
				default:
					oTemplate = new sap.m.Text({text : "{" + field[i] + "}"});
			}
			
			oCell = new sap.ui.commons.layout.MatrixLayoutCell({
						content : [oTemplate],
						hAlign : "Center",
						vAlign : "Middle"
					}).addStyleClass("Data");
			
			oRow.addCell(oCell);
		}
		oMatrix.addRow(oRow);
		
		var oTable2 = new sap.ui.table.Table(oController.PAGEID + "_Table3", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}", // No data found
			extension : [new sap.m.Toolbar({
							 height : "50px",
							 content : [new sap.m.Text({
										 	text : oController.getBundleText("LABEL_26017") + " : {Begda}  ~ {Endda}", // 평가실시기간
										 	visible : {
										 		parts : [{path : "Begda"}, {path : "Endda"}],
										 		formatter : function(fVal1, fVal2){
										 			return fVal1 && fVal2 ? true : false;
										 		}
										 	}
										}),
										new sap.m.ToolbarSpacer(),
										new sap.m.Button({
											text : "{i18n>LABEL_00101}", // 저장
											press : function(oEvent){
												oController.onPressSave2(oEvent, "S");
											},
											visible : {
												path : "EditMode",
												formatter : function(fVal){
													return fVal == "X" ? true : false;
												}
											}
										}).addStyleClass("button-dark"),
										new sap.m.Button({
											text : "{i18n>LABEL_00138}", // 완료
											press : function(oEvent){
												oController.onPressSave2(oEvent, "C");
											},
											visible : {
												path : "EditMode",
												formatter : function(fVal){
													return fVal == "X" ? true : false;
												}
											}
										}).addStyleClass("button-dark")]
						 }).addStyleClass("toolbarNoBottomLine")
						   .setModel(oController._ListCondJSonModel)
						   .bindElement("/Data")]
		}).addStyleClass("mt-10px");
		
		oTable2.setModel(new sap.ui.model.json.JSONModel());
		oTable2.bindRows("/Data");
		
						// 대상연도, 평가유형, 평가그룹, 성명, 부서, 직급, 1차점수, 2차등급, 단계
		var col_info = [{id: "Apyear", label: oBundleText.getText("LABEL_26003"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Aptypet", label: oBundleText.getText("LABEL_26004"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Apgupt", label: oBundleText.getText("LABEL_26007"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "EeName", label: oBundleText.getText("LABEL_26005"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Stext1", label: oBundleText.getText("LABEL_26015"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "ZzpGradet", label: oBundleText.getText("LABEL_26016"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "CalcP1", label: oBundleText.getText("LABEL_26008"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "CalcD", label: oBundleText.getText("LABEL_26026"), plabel: "", resize: true, span: 0, type: "select", sort: true, filter: true},
						{id: "Apstatt", label: oBundleText.getText("LABEL_26009"), plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true}];
				
		oController.makeColumn(oController, oTable2, col_info);
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			content : [oMatrix, oTable2]
		});
		
		return oLayout;
	}
});
