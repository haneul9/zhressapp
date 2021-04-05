$.sap.require("common.Common");
$.sap.require("common.Formatter");
$.sap.require("common.makeTable");
$.sap.require("common.EmpBasicInfoBox");
sap.ui.jsview("ZUI5_HR_OutCompEdu.OutCompEduDet", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_HR_OutCompEdu.OutCompEduDet";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		// 사원정보
		var oHeader = new common.EmpBasicInfoBox(oController.EmployeeModel);

		var oRow,oCell;
		var oTable = new sap.ui.table.Table(oController.PAGEID+"_Table", {
			selectionMode: sap.ui.table.SelectionMode.None,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "auto",
			noData: "{i18n>MSG_05001}"
		}).addStyleClass("mt-8px");

		var oMat=new sap.ui.commons.layout.MatrixLayout({
			columns:4,
			widths:['20%','','20%','']
		});
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:4,
			hAlign:"Right",
			content:[new sap.m.Button({icon:"sap-icon://save",text:oBundleText.getText("LABEL_40022")}).addStyleClass("button-light"),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),
			new sap.m.Button({icon:"sap-icon://arrow-left",text:oBundleText.getText("LABEL_40023"),press:oController.onBack}).addStyleClass("button-light")]
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40024")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Input({width:"80%"})],
			colSpan:3
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40025")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Select({width:"80%"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40026")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Select({width:"80%"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40027")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Select({width:"80%"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40058")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Select({width:"80%"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:[new sap.ui.core.HTML({content:"<div><span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40028")+"</span></div>"}),
						new sap.m.Button({icon:"sap-icon://add",text:oBundleText.getText("LABEL_40034"),press:oController.onAddPerson.bind(oController)}).addStyleClass("button-light-sm")
					]
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			content:oTable,
			colSpan:3
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40035")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.DatePicker({
				width : "40%",
				valueFormat : "yyyy-MM-dd",
				displayFormat : gDtfmt
			}), new sap.ui.core.HTML({content:"<span style='line-height:33px;font-size:14px;'>&nbsp;~&nbsp;</span>"}),new sap.m.DatePicker({
				width : "40%",
				valueFormat : "yyyy-MM-dd",
				displayFormat : gDtfmt
			})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40036")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Input({width:"80%"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40037")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			colSpan:3,
			content:[new sap.m.Input({width:"80%"}),new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),new sap.m.RadioButton({groupName:oController.PAGEID+"_Rid"}),
			new sap.m.RadioButton({groupName:oController.PAGEID+"_Rid"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40040")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			colSpan:3,
			content:[new sap.m.Input({width:"80%"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40041")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Input({width:"80%"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40042")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Input({width:"80%"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		var oFileUploader1 = new sap.m.HBox(oController.PAGEID + "_FileUploadBox", {
			alignItems: sap.m.FlexAlignItems.Center,
			fitContainer: true,
			items: [
				sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
			]
		})
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40043")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			colSpan:3,
			content:[oFileUploader1]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40044")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			colSpan:3,
			content:[new sap.m.TextArea({rows:3,width:"80%"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40048")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			colSpan:3,
			content:[new sap.m.Text()]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40049")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Text()]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40050")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Text()]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40051")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Text()]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40052")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Text()]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40053")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Text()]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40054")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			content:[new sap.m.Text()]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40055")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			colSpan:3,
			content:[new sap.m.Text()]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Center",
			content:new sap.ui.core.HTML({content:"<span style='font-weight:bold;font-size:15px;'>"+oBundleText.getText("LABEL_40056")+"</span>"})
		}).addStyleClass("LabelCell");
		oRow.addCell(oCell);
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			colSpan:3,
			content:[new sap.m.TextArea({rows:3,width:"80%",value:"{test}"})]
		}).addStyleClass("DataCell");
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Begin",
			colSpan:4,
			content:new sap.ui.core.HTML({content:"<span style='font-size:14px;'>"+oBundleText.getText("LABEL_40057")+"</span>"})
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);


		oMat.setModel(oController.TestModel);
		oMat.bindElement("/MyData/0");


	//	oController.getSelctor();
		oController.oTableInit();

		var oContent = new sap.m.FlexBox({
			  justifyContent: "Center",
			  fitContainer: true,
			  items: [new sap.m.FlexBox({
						  direction: sap.m.FlexDirection.Column,
						  items: [new sap.m.FlexBox({
									  alignItems: "End",
									  fitContainer: true,
									  items: [new sap.m.Text({text: oBundleText.getText("LABEL_40001")}).addStyleClass("app-title")] // 사외위탁교육 신청
								  }).addStyleClass("app-title-container"),
								  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  oHeader,
								  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  oMat,
								  new sap.ui.core.HTML({content : "<div style='height:20px' />"}),
								  ]
					  }).addStyleClass("app-content-container-wide")]
		}).addStyleClass("app-content-body");
				
		/////////////////////////////////////////////////////////

		var oPage = new sap.m.Page(oController.PAGEID + "_PAGE", {
			customHeader: [new sap.m.Bar().addStyleClass("app-content-header")],
			content: [oContent]
		}).addStyleClass("app-content");
		
		oPage.addStyleClass("WhiteBackground");
		
		oPage.setModel(oController._ListCondJSonModel);
		oPage.bindElement("/Data");

		return oPage;
	}

});