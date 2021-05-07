sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/EmpBasicInfoBox",
	"../../control/ODataFileUploader",
	"../../common/PickOnlyDateRangeSelection"
], function (Common, Formatter, PageHelper, EmpBasicInfoBox,ODataFileUploader,PickOnlyDateRangeSelection) {
	sap.ui.jsview($.app.APP_ID, {
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		getFilter : function(oController){
			var vYear = new Date().getFullYear();
			return new sap.m.FlexBox({
			fitContainer: true,
				items: [
					new sap.m.FlexBox({
						// 검색
						items: [
							new sap.m.FlexBox({
								items: [
									new PickOnlyDateRangeSelection(oController.PAGEID + "_ApplyDate", {
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										width : "162px",
										delimiter: "~",
										dateValue: new Date(vYear, new Date().getMonth(), 1),
										secondDateValue: new Date()
									}),
									new sap.m.Select(oController.PAGEID + "_HeadSel",{
									}).addStyleClass("height42px ml-10px")
								]
							}).addStyleClass("search-field-group"),
							new sap.m.FlexBox({
								items: [
									new sap.m.Button({	
										press : oController.onSearch,							
										icon: "sap-icon://search" // 조회
									}).addStyleClass("button-search")
								]
							}).addStyleClass("button-group")
						]
					}) // 검색
				]
			}).addStyleClass("search-box-mobile h-auto");
		},

		createContent: function (oController) {
			jQuery.sap.includeStyleSheet("ZUI5_HR_MedApply/css/MyCssMobile.css");
			this.loadModel();
			var oInfoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
					// new HoverIcon({
					// 	size : "14px",
					// 	src: "sap-icon://information",
					// 	hover: function(oEvent) {
					// 		common.Common.onPressTableHeaderInformation.call(oController, oEvent, oController.getBundleText("MSG_47001")); // 대리신청 등록된 사원만 출장자 변경 가능
					// 	},
					// 	leave: function(oEvent) {
					// 		common.Common.onPressTableHeaderInformation.call(oController, oEvent);
					// 	}
					// })
					// .addStyleClass(oController.InputBase.ICON_CSS_CLASS + " color-icon-blue"),
					new sap.m.FlexBox({
						items: [
							new sap.ui.core.HTML({content:"<span class='sub-title ml-6px' style='font-size:16px;font-weight:bold;'>"+oBundleText.getText("LABEL_47002")+"</span>"}),
						]
					}),
					new sap.m.FlexBox({
						items: [
							new sap.m.Button(oController.PAGEID+"_NewBtn",{
								press: function(){oController.onDialog(null,"N3")},
								text: "{i18n>LABEL_47006}", // 신청
							}).addStyleClass("button-light"),
							new sap.ui.commons.layout.HorizontalLayout(oController.PAGEID+"_NewIcon",{
								visible:false,
								content:[
									new sap.ui.core.Icon({src:"sap-icon://message-information",color:"red",size:"15px"}),
									new sap.ui.core.HTML({content:"<span style='font-size:14px;color:red;line-height:0px;'>&nbsp;"+oController.getBundleText('MSG_47040')+"</span>"})]
							})
						]
					}).addStyleClass("button-group"),
				]
			}).addStyleClass("info-box");
			
			
			var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
				inset: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				mode: "None",
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
								text: "{PatiName}",
								textAlign: "Begin"
							}),
							new sap.m.Text({
								text: "{HospName}",
								textAlign: "Begin"
							})
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
									path : "MedDate", 
									type : new sap.ui.model.type.Date({pattern: "yyyy-MM-dd"})
								},
								textAlign: "Begin"
							}),
							new sap.m.Text({
								text: "{StatusText}",
								textAlign: "Begin"
							})
						]
					})
				]
			});
					
			/////////////////////////////////////////////////////////
				
			return new PageHelper({
				contentContainerStyleClass: "app-content-container-mobile",
				contentItems: [
					oInfoBox,
					this.getFilter(oController),
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
