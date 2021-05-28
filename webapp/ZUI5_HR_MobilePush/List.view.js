$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.PageHelper");

sap.ui.jsview("ZUI5_HR_MobilePush.List", {
	
	getControllerName: function() {
		return "ZUI5_HR_MobilePush.List";
	},

	createContent: function(oController) {
		$.app.setModel("ZHR_COMMON_SRV");

		var oHeader = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["20%", ""],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_72005}"})], // 전송대상
									 hAlign : "End",
									 vAlign : "Middle"
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.RadioButtonGroup({
													// selectedIndex : "{Key}",
													columns : 2,
													select : oController.onChangeKey,
													buttons : [new sap.m.RadioButton({text : "{i18n>LABEL_72006}", width : "100px"}), // 대상자 지정
															   new sap.m.RadioButton({text : "{i18n>LABEL_72007}", width : "100px"})] // 전체(주의!)
												})]
								 }).addStyleClass("Data")]	
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.m.Label({text : "{i18n>LABEL_72008}"})], // 전송내용
									 hAlign : "End",
									 vAlign : "Middle",
									 rowSpan : 2
								 }).addStyleClass("Label"),
								 new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [
										new sap.m.Label({text : "{i18n>LABEL_72003}", textAlign : "Center", width : "100px"}).addStyleClass("bold pr-5px pt-10px"), // 제목
										new sap.m.Input({
											value : "{HeadTxt}",
											maxLength : common.Common.getODataPropertyLength("ZHR_COMMON_SRV", "AppPushAlarmLog", "HeadTxt"),
											placeholder : "{i18n>MSG_72001}" // 최대 한글 24자, 영문 48자까지 가능
										}).addStyleClass("custom-input")
									 ]
								 }).addStyleClass("Data")]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						height : "45px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [
										new sap.m.Label({text : "{i18n>LABEL_72004}", textAlign : "Center", width : "100px"}).addStyleClass("bold pr-5px pt-10px"), // 본문
										new sap.m.Input({
											value : "{BodyTxt}",
											maxLength : common.Common.getODataPropertyLength("ZHR_COMMON_SRV", "AppPushAlarmLog", "BodyTxt"),
											placeholder : "{i18n>MSG_72001}" // 최대 한글 24자, 영문 48자까지 가능
										}).addStyleClass("custom-input")
									 ]
								 }).addStyleClass("Data")]
					})]
		}).addStyleClass("mt-15px");
		
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			selectionMode: "MultiToggle",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			noData: oBundleText.getText("LABEL_00901"), // No data found
			rowHeight: 37,
			columnHeaderHeight: 38,
			extension : [new sap.m.Toolbar({
							 height : "45px",
							 content : [new sap.m.Text({text : "{i18n>LABEL_72010}"}).addStyleClass("sub-title"), // 대상자
										new sap.m.ToolbarSpacer(),
										new sap.m.HBox({
											items: [
												new sap.m.Button({
													text : "{i18n>LABEL_72009}", // 내용 일괄적용
													press : oController.onSetText
												}).addStyleClass("button-light"),
												new sap.m.Button({
													text: "{i18n>LABEL_72011}", // 대상자 추가
													press : oController.onPressAddTarget
												}).addStyleClass("button-light"),
												new sap.m.Button({
													text: "{i18n>LABEL_72012}", // 삭제
													press : oController.onPressDeleteTarget
												}).addStyleClass("button-delete")
											]
										}).addStyleClass("button-group")]
						 }).addStyleClass("toolbarNoBottomLine")]
		}).addStyleClass("mt-10px");
		
		oTable.setModel(new sap.ui.model.json.JSONModel());
		oTable.bindRows("/Data");
		
						// 사번, 성명, 발송가능여부, 제목, 본문
		var col_info = [{id: "Pernr", label: "{i18n>LABEL_00191}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Ename", label: "{i18n>LABEL_00121}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "Tkchk", label: "{i18n>LABEL_72002}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true},
						{id: "HeadTxt", label: "{i18n>LABEL_72003}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "35%"},
						{id: "BodyTxt", label: "{i18n>LABEL_72004}", plabel: "", resize: true, span: 0, type: "formatter", sort: true, filter: true, width : "35%"}];
		
		common.makeTable.makeColumn(oController, oTable, col_info);

		var oContent = new sap.m.VBox({
			items : [oTable],
			visible : {
				path : "Key",
				formatter : function(fVal){
					return fVal == 0 ? true : false;
				}
			}
		});

		var oMessage = new sap.ui.commons.layout.MatrixLayout({
			columns : 1,
			width : "100%",
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [
										new sap.m.VBox({
											items : [
												new sap.m.Text({text : "{i18n>MSG_72002}"}),  // ※ 제목과 본문은 최대 한글 24자, 영문 48자까지 가능합니다.
												new sap.m.Text({text : "{i18n>MSG_72003}"}) // ※ 전체 전송 시 사용에 주의 바랍니다.
											]
										})
									 ],
									 hAlign : "Begin",
									 vAlign : "Middle"
								 }).addStyleClass("p-10px")]
					}).addStyleClass("custom-OpenHelp-msgBox")]
		}).addStyleClass("mt-10px");
		
		var oPage = new common.PageHelper({
						idPrefix : oController.PAGEID,
			            contentItems: [new sap.m.HBox({
											justifyContent : "End",
											items: [new sap.m.Button({
													text: "{i18n>LABEL_72013}", // 발송
													press : oController.onPressSave
												}).addStyleClass("button-dark")
											]
										}).addStyleClass("button-group mt-10px"),
										oHeader, oContent, oMessage]
			        });
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");
		
		return oPage;
	}
});