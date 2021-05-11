/* eslint-disable no-undef */
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

		var oHBox = new sap.m.HBox({
			items:[new sap.m.Label({
				textAlign:"Begin",
				text: oController.getBundleText("LABEL_47144")					
			}),new sap.m.Input({
				valueHelpRequest: function(oEvent){oController.searchOrgehPernr.call(oController,oEvent,"X");},
				valueHelpOnly: true,
				showValueHelp: true,
				width: "240px"
			})]
		});

		var oSearchBox = new sap.m.FlexBox({
			fitContainer: true,
			items: [ 
				new sap.m.HBox({
					items: [
						new sap.m.Label({
							textAlign:"Begin",
							text: oController.getBundleText("LABEL_47003")// 진료일								
						}),							
						new common.PickOnlyDateRangeSelection(oController.PAGEID + "_ApplyDate", {
							width: "250px",
							layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
							delimiter: "~",
							dateValue: new Date(vYear, new Date().getMonth(), 1),
							secondDateValue: new Date()
						}),
						oHBox
					]
				}).addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({	
							press : oController.onSearch,							
							text: oController.getBundleText("LABEL_23010") // 조회
						}).addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("search-box search-bg pb-7px mt-16px");


		oMat=new sap.ui.commons.layout.MatrixLayout({columns:2});

		var oTable = new sap.ui.table.Table(oController.PAGEID+"_Table", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "auto",
			noData: oController.getBundleText("MSG_05001")
		}).addStyleClass("mt-10px row-link");

		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:2,
			content:oTable
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);
		oMat.setModel(oController._ListCondJSonModel);
		oMat.bindElement("/Data");

		return new common.PageHelper({
			contentItems: [
				new sap.ui.core.HTML({content : "<div style='height:20px' />"}),oSearchBox,oMat
			]
		});
	}

});