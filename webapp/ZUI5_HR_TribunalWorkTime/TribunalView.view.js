/* eslint-disable no-undef */
$.sap.require("common.Common");
$.sap.require("common.PageHelper");
$.sap.require("common.Formatter");
$.sap.require("common.PickOnlyDatePicker");
jQuery.sap.includeStyleSheet("ZUI5_HR_TribunalWorkTime/css/MyCss.css");
sap.ui.jsview("ZUI5_HR_TribunalWorkTime.TribunalView", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf controller.main
	 */
	getControllerName: function () {
		return "ZUI5_HR_TribunalWorkTime.TribunalView";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf controller.main
	 */
	createContent: function (oController) {
		$.app.setModel("ZHR_COMMON_SRV");
		$.app.setModel("ZHR_WORKSCHEDULE_SRV");
		var vYear = new Date().getFullYear();
		var oHBox = new sap.m.HBox({
			items:[new sap.m.Label({
				textAlign:"Begin",
				text: oController.getBundleText("LABEL_71003")					
			}),new sap.m.Input(oController.PAGEID+"_searchOrgPer",{
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
							text: oController.getBundleText("LABEL_71002")		
						}),	
						new common.PickOnlyDatePicker(oController.PAGEID + "_Date1", {
							width: "160px",
							valueFormat : "yyyyMM",
                            displayFormat : "yyyy-MM",
							dateValue: new Date(vYear, new Date().getMonth())
						}),
						new sap.ui.core.HTML({content:"<span>&nbsp;</span>"}),
						new common.PickOnlyDatePicker(oController.PAGEID + "_Date2", {
							width: "160px",
							valueFormat : "yyyyMM",
                            displayFormat : "yyyy-MM",
							dateValue: new Date(vYear, new Date().getMonth())
						})
					]
				}).addStyleClass("search-field-group"),
				new sap.ui.core.HTML({content:"<span>&nbsp;&nbsp;</span>"}),
				new sap.m.HBox({
					items: oHBox
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

		var oTable = new sap.ui.table.Table(oController.PAGEID+"_Table", {
			selectionMode: "None",
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			rowHeight: 37,
			width: "auto",
			noData: oController.getBundleText("MSG_05001")
		}).addStyleClass("mt-10px");

		var oFields=["Wkym","Pernr","Ename","Orgtx","SumtmAlv","ExptmAlv","LawtmAlv","AvetmAlv","RsttmAlv","LawckT"];			
		var oWidths=['','','','','','','','','',''];			
		var oAligns=['Center','Center','Center','Center','Center','Center','Center','Center','Center','Center'];	
		var oLabels=new Array();		
		for(var i=4;i<(oFields.length+4);i++){
			i<10?i="0"+i:null;
			oLabels.push({Label:"LABEL_710"+i,Width:oWidths[i-4],Align:"Center"});
		}
		oLabels.forEach(function(e,i){
			var oCol=new sap.ui.table.Column({
				flexible : false,
				autoResizable : true,
				resizable : true,
				showFilterMenuEntry : true,
				filtered : false,
				sorted : false
			});
			oCol.setWidth(e.Width);
			oCol.setHAlign(e.Align);
			oCol.setLabel(new sap.m.Text({text:oController.getBundleText(e.Label),textAlign:e.Align}));	
			oCol.setTemplate(new sap.ui.commons.TextView({text:"{"+oFields[i]+"}",textAlign:oAligns[i]}).addStyleClass("FontFamily"));								
			oTable.addColumn(oCol);
		});

		return new common.PageHelper({
			contentItems: [
				new sap.ui.core.HTML({content : "<div style='height:20px' />"}),oSearchBox,oTable
			]
		});
	}
});