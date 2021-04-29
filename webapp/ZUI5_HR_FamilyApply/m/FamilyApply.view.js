sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/EmpBasicInfoBox",
	"../../control/ODataFileUploader"
], function (Common, Formatter, PageHelper, EmpBasicInfoBox,ODataFileUploader) {

	sap.ui.jsview($.app.APP_ID, {
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			var oInfoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.m.Label({
								design: "Bold"
							})
							.addStyleClass("sub-title ml-6px")
						]
					}),
					new sap.m.FlexBox({
						items: [
							new sap.m.Button({text:oBundleText.getText("LABEL_00153"),press:function(oEvent){oController.onDialog("N")}}).addStyleClass("button-light"),
						new sap.m.Button({text:oBundleText.getText("LABEL_44042"),press:oController.onModLines}).addStyleClass("button-light"),
						new sap.m.Button({text:oBundleText.getText("LABEL_00103"),
						press : oController.onDeleteLines
					}).addStyleClass("button-light")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("info-box");
			
			
			var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
				inset: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				mode: "SingleSelectLeft",
				columns: [
					new sap.m.Column({
						width: "30%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "40%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "30%",
						hAlign: sap.ui.core.TextAlign.Begin
					})
				]
			}).addStyleClass("mt-4px");

			var oColumn = new sap.m.ColumnListItem(oController.PAGEID + "_Column",{
				counter: 5,
				press: oController.onSelectedRow,
				type:"Active",
				cells: [
					new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Column,
						items: [
							new sap.m.Text({
								text: "{Fcnam}",
								textAlign: "Begin"
							}),
							new sap.m.Text({
								text: "{Kdsvht}",
								textAlign: "Begin"
							}).addStyleClass("L2P13Font")
						]
					}),
					new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Column,
						items: [
							new sap.m.Text({
								text: "{Regnot}",
								textAlign: "Begin"
							})
						]
					}),
					new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Column,
						items: [
							new sap.m.Text({
								text : {
									path : "Apdat", 
									type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
								},
								textAlign: "Begin"
							}),
							new sap.m.Text({
								text: "{StatusText}",
								textAlign: "Begin"
							}).addStyleClass("L2P13Font")
						]
					})
				]
			});
					
			/////////////////////////////////////////////////////////
				
			return new PageHelper({
				contentContainerStyleClass: "app-content-container-mobile",
				contentItems: [
					oInfoBox,
					oTable
				]
			});
		},
			
			loadModel: function () {
				// Model 선언
				$.app.setModel("ZHR_COMMON_SRV");
				$.app.setModel("ZHR_BENEFIT_SRV");
			}
		});
});
