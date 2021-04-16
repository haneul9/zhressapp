$.sap.require("common.Common");
$.sap.require("common.PageHelper");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.EmpBasicInfoBoxCustom");
$.sap.require("common.PickOnlyDateRangeSelection");
jQuery.sap.require("control.ODataFileUploader");
jQuery.sap.require("fragment.COMMON_ATTACH_FILES");
jQuery.sap.includeStyleSheet("ZUI5_HR_MedApply/css/MyCss.css");
sap.ui.jsview("ZUI5_HR_MedApply.MedApply", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_HR_MedApply.MedApply";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_BENEFIT_SRV");
		var oRow,oCell,oMat;
		var vYear = new Date().getFullYear();
		var vMonth = new Date().getMonth()+1;
		console.log("View");
		oMat=new sap.ui.commons.layout.MatrixLayout();

		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			content:[new sap.ui.core.HTML({content:"<span style='font-size:16px;font-weight:bold;'>"+oBundleText.getText("LABEL_47002")+"</span>"}),
			new HoverIcon({
				size : "14px",
				src: "sap-icon://information",
				hover: function(oEvent) {
					common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47001")); // 대리신청 등록된 사원만 출장자 변경 가능
				},
				leave: function(oEvent) {
					common.Common.onPressTableHeaderInformation.call(oController, oEvent);
				}
			})
			.addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue")]
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);

		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			content:new sap.ui.core.HTML({content:"<div style='height:5px;'/>"})
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			content:[new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_47003}", // 진료일								
							}),							
							new common.PickOnlyDateRangeSelection(oController.PAGEID + "_ApplyDate", {
//								displayFormat:$.app.getController().getSessionInfoByKey("Dtfmt"), 
								width: "210px",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear-1, vMonth, 1),
								secondDateValue: new Date(vYear, vMonth, 0)
							}),
							new sap.m.Label({
								text: "{i18n>LABEL_47004}", // 신청자 성명							
							}),
                            new sap.m.Select(oController.PAGEID + "_HeadSel",{
								width:"200px"
                            })
						]
                    }).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.Button({	
								press : oController.onSearch,							
								text: "{i18n>LABEL_23010}", // 조회
							}).addStyleClass("button-search"),
							new sap.m.Button(oController.PAGEID+"_NewBtn",{
								press: function(){oController.onDialog(null,"N3")},
								text: "{i18n>LABEL_47006}", // 신청
							}).addStyleClass("button-light")
						]
					})
					.addStyleClass("button-group")
				]
			}).addStyleClass("search-box search-bg pb-7px")]
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			content:new sap.ui.core.HTML({content:"<div style='height:5px;'/>"})
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		
		var oTable = new sap.ui.table.Table(oController.PAGEID+"_Table", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "auto",
			noData: "{i18n>MSG_05001}"
		}).addStyleClass("mt-8px").attachCellClick(oController.onSelectedRow);

		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			content:oTable
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);

		// var oContent = new sap.m.FlexBox({
		// 	  justifyContent: "Center",
		// 	  fitContainer: true,
		// 	  items: [new sap.m.FlexBox({
		// 				  direction: sap.m.FlexDirection.Column,
		// 				  items: [new sap.m.FlexBox({
		// 							  alignItems: "End",
		// 							  fitContainer: true,
		// 							  items: [new sap.m.Text({text: oBundleText.getText("LABEL_47001")}).addStyleClass("app-title")] // 사외위탁교육 신청
		// 						  }).addStyleClass("app-title-container"),
		// 						  common.EmpBasicInfoBoxCustom.renderHeader(),
		// 						  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
		// 						  oMat
		// 						  ]
		// 			  }).addStyleClass("app-content-container-wide")]
		// }).addStyleClass("app-content-body");
				
		/////////////////////////////////////////////////////////

		// var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
		// 	customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
		// 	content: [oContent]
		// }).addStyleClass("app-content");
		
		// oPage.addStyleClass("WhiteBackground");
		
		// oPage.setModel(oController._ListCondJSonModel);
		// oPage.bindElement("/Data");

		oMat.setModel(oController._ListCondJSonModel);
		oMat.bindElement("/Data");

		return new common.PageHelper({
			contentItems: [
				new sap.ui.core.HTML({content : "<div style='height:20px' />"}),oMat
			]
		});
	}

});