/* eslint-disable no-undef */
$.sap.require("common.Common");
$.sap.require("common.PageHelper");
$.sap.require("common.Formatter");
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

		var oHBox = new sap.m.HBox(oController.PAGEID+"_HassPer",{
			items:[new sap.m.Label({
				textAlign:"Begin",
				text: oController.getBundleText("LABEL_47144")// 진료일								
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
						oHBox,
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
						new sap.m.Label({
							textAlign:"Begin",
							text: oController.getBundleText("LABEL_47004") // 신청자 성명							
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
							text: oController.getBundleText("LABEL_23010") // 조회
						}).addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("search-box search-bg pb-7px mt-16px");


		oMat=new sap.ui.commons.layout.MatrixLayout({columns:2});
		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:2,
			content:new sap.ui.core.HTML({content:"<div style='height:5px;'/>"})
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);

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
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign:"Right",
			content:[new sap.m.Button(oController.PAGEID+"_NewBtn",{
				press: function(){oController.onDialog(null,"N3");},
				text: "{i18n>LABEL_47006}" // 신청 
			}).addStyleClass("button-light"),
			new sap.ui.commons.layout.HorizontalLayout(oController.PAGEID+"_NewIcon",{
				visible:false,
				content:[
					new sap.ui.core.Icon({src:"sap-icon://message-information",color:"red",size:"15px"}),
					new sap.ui.core.HTML({content:"<span style='font-size:14px;color:red;line-height:0px;'>&nbsp;"+oController.getBundleText('MSG_47040')+"</span>"})]
			})]
		});
		oRow.addCell(oCell);
		oMat.addRow(oRow);

		oRow=new sap.ui.commons.layout.MatrixLayoutRow();
		oCell=new sap.ui.commons.layout.MatrixLayoutCell({
			colSpan:2,
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
			noData: oController.getBundleText("MSG_05001")
		}).addStyleClass("mt-10px row-link").attachCellClick(oController.onSelectedRow);

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