sap.ui.jsview("ZUI5_HR_EvalComp.Detail", {
	
	getControllerName: function() {
		return "ZUI5_HR_EvalComp.Detail";
	},

	createContent: function(oController) {
		
		var oSummary = new sap.ui.commons.layout.MatrixLayout({
			columns : 7,
			width : "100%",
			widths : ["", "", "", "", "", "", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_26003}"})], // 대상연도
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_26004}"})], // 평가유형
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_26009}"})], // 단계
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_26014}"})], // 사번
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_26005}"})], // 성명
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_26015}"})], // 부서
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label2"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_26016}"})], // 직급
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label2")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{Apyear}"})], // 대상연도
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{Aptypet}"})], // 평가유형
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{Apstatt}"})], // 단계
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{EePernr}"})], // 사번
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{EeEname}"})], // 성명
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{Stext1}"})], // 부서
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Text({text : "{ZzpGradet}"})], // 직급
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_26017}"})], // 평가실시기간
									 hAlign : "Center",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Text({text : "{Period}"})],
								 	 hAlign : "Center",
								 	 vAlign : "Middle",
								 	 colSpan : 2
								 }).addStyleClass("Data"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.Label({text : "{i18n>LABEL_26018}"})], // 평가자 의견
								 	 hAlign : "Center",
								 	 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [new sap.m.TextArea({
											 	 	value : "{Zeropn}",
											 	 	width : "100%",
											 	 	rows : 4,
											 	 	maxLength : common.Common.getODataPropertyLength("ZHR_APPRAISAL2_SRV", "ApAppCompTableIn5", "Zeropn"),
											 	 	editable : "{Editable}"
											 	})],
									 hAlign : "Begin",
									 vAlign : "Middle",
									 colSpan : 3
								 }).addStyleClass("Data paddingTop10 paddingBottom10")]
					})]
		}).addStyleClass("mt-20px");
		
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
			noData: "{i18n>LABEL_00901}", // No data found
			extension : [new sap.m.Toolbar({
							 height : "50px",
							 content : [new sap.m.Text({
										 	text : {
										 		parts : [{path : "Ylgupt"}, {path : "Weight"}],
										 		formatter : function(fVal1, fVal2){
										 			if(fVal2 && fVal2 != ""){
										 				return fVal1 + " (" + fVal2 + ")";
										 			} else {
										 				return fVal1;
										 			}
										 		}
										 	}
										}).addStyleClass("Font16 FontBold"),
										new sap.m.ToolbarSpacer(),
										new sap.m.Text({text : oController.getBundleText("LABEL_26028") + " {Point1}"}), // 전체합계
										new sap.m.Button({
											text : "{i18n>LABEL_00101}", // 저장
											visible : "{Editable}",
											press : function(oEvent){
												oController.onPressSave(oEvent, "S");
											}
										}).addStyleClass("button-dark"),
										new sap.m.Button({
											text : "{i18n>LABEL_00138}", // 완료
											visible : "{Editable}",
											press : function(oEvent){
												oController.onPressSave(oEvent, "C");
											}
										}).addStyleClass("button-dark")]
										// new sap.m.Button({
										// 	text : oBundleText.getText("LABEL_00119"), // 취소
										// 	press : oController.onBack
										// }).addStyleClass("button-dark")]
						 }).addStyleClass("toolbarNoBottomLine")
						   .setModel(oController._DetailJSonModel)
						   .bindElement("/Data")]
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 역량명, 정의, 행동지침, 평가점수
		var col_info = [{id: "Zobjtx", label: "{i18n>LABEL_26019}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width : "300px"},
						{id: "Text1", label: "{i18n>LABEL_26020}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, align : "Begin"},
						{id: "Text2", label: "{i18n>LABEL_26021}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, align : "Begin"},
						{id: "Goal2", label: "{i18n>LABEL_26022}", plabel: "", resize: true, span: 0, type: "select", sort: true, filter: true, width : "300px"}];
				
		oController.makeColumn(oController, oTable, col_info);
		
		var titleitem = [
			new sap.m.FlexBox({
			  	 justifyContent : "Start",
				 alignItems: "End",
				 fitContainer: true,
			  	 items : [
			  	  	new sap.m.Button({
					  	  icon : "sap-icon://nav-back",
					  	  type : "Default",
					  	  press : oController.onBack
					  }),
					  new sap.ui.core.HTML({
					  	  content : "<div style='width:10px' />",
					  	  visible : {
					  	  		path : "FromPageId",
					  	  		formatter : function(fVal){
					  	  			return (fVal && fVal != "") ? true : false;
					  	  		}
					  	  }
					  }),
					  new sap.m.Text({text: oBundleText.getText("LABEL_26000")}).addStyleClass("app-title pl-10px") // 역량평가
			  	  ]
			  })
		];
			  
		if((!sap.ui.Device.system.phone && !sap.ui.Device.system.tablet) && parent && window._use_emp_info_box === true) {
			window._CommonEmployeeModel = new common.EmployeeModel();
			window._CommonEmployeeModel.retrieve(parent._gateway.pernr());

			titleitem.push(new common.EmpBasicInfoBox(window._CommonEmployeeModel));
		};
		
		var title = new sap.m.FlexBox({
			justifyContent : "SpaceBetween",
			alignContent : "Start",
			alignItems : "Center",
			fitContainer: true,
			items : titleitem
		}).addStyleClass("app-title-container");
			
		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: sap.m.FlexDirection.Column,
						  items: [title,
								  oSummary, oTable, new sap.ui.core.HTML({content : "<div style='height:10px' />"})]
					  }).addStyleClass("app-content-container-wide")]
		}).addStyleClass("app-content-body");
		
		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			showHeader : false,
			content: [oContent]
		}).addStyleClass("app-content");
		
		// var oPage = new common.PageHelper({
		// 			idPrefix : oController.PAGEID,
		// 			showNavButton: true,
		// 			navBackFunc: oController.onBack,
		// 			contentItems: [oSummary, oTable]
		// 		});
				
		oPage.setModel(oController._DetailJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}
});