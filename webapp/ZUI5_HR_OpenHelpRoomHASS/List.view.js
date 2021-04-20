sap.ui.define([
	"../common/Common",
	"../common/PageHelper",
	"../common/HoverIcon",
	"../common/ZHR_TABLES"
], function (Common, PageHelper, HoverIcon, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
	
		getControllerName: function () {
			return $.app.APP_ID;
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_COMMON_SRV");
			$.app.setModel("ZHR_BENEFIT_SRV");
		},

		createContent: function (oController) {
			
			this.loadModel();

			return new PageHelper({
				contentItems: [
					this.getMenuBox(oController)
				]
			})
		},

		getMenuBox: function(oController) {
			var TreeBox = new sap.m.ScrollContainer(oController.PAGEID + "_TreeScroll", {
				width: "auto",
				height: "100%",
				vertical: true,
				content: [
					new sap.m.Tree(oController.PAGEID + "_Tree", {
						width: "300px",
						headerText: "{i18n>LABEL_25002}",
						selectionChange: oController.onSelectTree.bind(oController),
						toggleOpenState: oController.onItemPress.bind(oController),
						mode: sap.m.ListMode.SingleSelectMaster,
						items: {
							path: "/Data",
							template: new sap.m.StandardTreeItem(oController.PAGEID + "_TreeItem", {
								title: "{title}"/*{
									parts: [
										{ path: "title" }, 
										{ path: "/FullData/isGubun"}
									],
									formatter: function (v1, v2) {
										if(v2 === "Y") {
											this.toggleStyleClass("color-signature-blue", true);
										} else {
											this.toggleStyleClass("color-signature-blue", false);
										}
										
										return v1;
									}
								}*/
							})
						}
					})
				]
			})
			.setModel(oController.TreeModel)
			.addStyleClass("side-navigation-box");

			var ListBox = new sap.m.FlexBox(oController.PAGEID + "_listBox", {
				width: "100%",
				direction: sap.m.FlexDirection.Column,
				fitContainer: true,
				items: [
					new sap.m.HBox({
						fitContainer: true,
						items: [
							// 메뉴
							new sap.m.Label({ 
								text: "{i18n>LABEL_25002}", 
								width: "130px",
								layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) 
							}),
							new sap.m.Text({
								width: "auto",
								text: {
									parts: [
										{ path: "/Route/L1id" },
										{ path: "/Route/L2id" },
										{ path: "/Route/L3id" },
										{ path: "/Route/L4id" }
									],
									formatter: function (v1, v2, v3, v4) {
										var oData = oController.TreeModel.getProperty("/FullData");
										var v1Txt = "", v2Txt = "", v3Txt = "", v4Txt = "", vTotal = "";
										if(Common.checkNull(!oData)){
											oData.forEach(function(ele) {
												if(ele.L1id === v1 && ele.L2id === v2 && ele.L3id === v3 && ele.L4id === v4){
													v1Txt = ele.L1txt;
													v2Txt = ele.L2txt;
													v3Txt = ele.L3txt;
													v4Txt = ele.L4txt;
												}
											});
											
											if(Common.checkNull(!v1Txt)) vTotal = v1Txt;
											if(Common.checkNull(!v2Txt)) vTotal += ">" + v2Txt;
											if(Common.checkNull(!v3Txt)) vTotal += ">" + v3Txt;
											if(Common.checkNull(!v4Txt)) vTotal += ">" + v4Txt;
											
											if(Common.checkNull(!vTotal)) return vTotal;
											else return ""; 
										}else{
											return "";
										}
									}
								}
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						fitContainer: true,
						items: [
							// 최종변경자
							new sap.m.Label({ 
								text: "{i18n>LABEL_25006}", 
								width: "130px", 
								layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch })
							}),
							new sap.m.Text({
								width: "250px",
								text: "{/Export/ChInfo}"
							})
						]         
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({ 
						justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
						alignContent: sap.m.FlexAlignContent.End,
						alignItems: sap.m.FlexAlignItems.End,
						fitContainer: true,						
						items: [
							new sap.m.HBox({
								fitContainer: true,
								height:	"44px",					
								items: [
									// 최종변경일
									new sap.m.Label({ 
										text: "{i18n>LABEL_25007}", 
										width: "130px",
										layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch })
									}),
									new sap.m.Text({
										width: "250px",
										text: {
											parts: [
												{ path: "/TopData/Aedtm" },
												{ path: "/TopData/Aetim" }
											],
											formatter: function (v1, v2) {
												if(v1 && v2){
													var vFullDate = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-dd" }).format(v1);
													var vFullTime = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" }).format(new Date(v2.ms), true);

													return vFullDate + ", " + vFullTime;
												}else{
													return "";
												}
											}
										}
									})
								]
							}),
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.Button(oController.PAGEID + "_SearchBtn", {
										press: oController.onSearchBtn.bind(oController),
										text: "{i18n>LABEL_25003}", // 관리자 조회,
									}).addStyleClass("button-light-sm"),
									new sap.m.Button(oController.PAGEID + "_ModifiedBtn", {
										press: oController.onModifiedBtn.bind(oController),
										visible: false,
										text: "{i18n>LABEL_25004}" // 수정
									}).addStyleClass("button-light-sm"),
									new sap.m.Button(oController.PAGEID + "_SaveBtn", {
										press: oController.onSaveBtn.bind(oController),
										text: "{i18n>LABEL_25011}", // 저장
										visible: false
									}).addStyleClass("button-light-sm"),
									new sap.m.Button(oController.PAGEID + "_CancelBtn", {
										press: oController.onCancelBtn.bind(oController),
										text: "{i18n>LABEL_00119}", // 취소
										visible: false
									}).addStyleClass("button-light-sm")
								]
							}).addStyleClass("button-group")
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						height: "90px",
						fitContainer: true,
						items: [
							// 머리글    
							new sap.m.Label({ 
								text: "{i18n>LABEL_25008}", 
								width: "130px",
								layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) 
							}),
							new sap.m.TextArea(oController.PAGEID + "_TopText", {
								width: "90%",
								value:"{/TopData/Zcomment}",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "OpenhelpTableIn2", "Zcomment", false),
								placeholder: "{i18n>MSG_25001}",
								editable: false,
								rows: 3,
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						height: "90px",
						fitContainer: true,
						items: [
							// 담당자/연락처
							new sap.m.Label({ 
								text: "{i18n>LABEL_25009}", 
								width: "130px",
								layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) 
							}),
							new sap.m.TextArea(oController.PAGEID + "_MiddleText", {
								width: "90%",
								value:"{/MiddleData/Zcomment}",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "OpenhelpTableIn2", "Zcomment", false),
								placeholder: "{i18n>MSG_25001}",
								editable: false,
								rows: 3,
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						height: "90px",
						fitContainer: true,
						items: [
							// 바닥글
							new sap.m.Label({ 
								text: "{i18n>LABEL_25010}", 
								width: "130px",
								layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) 
							}),
							new sap.m.TextArea(oController.PAGEID + "_BottomText", {
								width: "90%",
								value:"{/BottomData/Zcomment}",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "OpenhelpTableIn2", "Zcomment", false),
								placeholder: "{i18n>MSG_25001}",
								editable: false,
								rows: 3,
							})
						] 
					}).addStyleClass("search-field-group")
				]
			})    
			.setModel(oController.OpenHelpModel)
			.addStyleClass("side-table-box");
			
			var FileUpload =  new sap.m.FlexBox(oController.PAGEID + "_FileBox", {
				width: "100%",
				direction: sap.m.FlexDirection.Column,
				fitContainer: true,
				items: [    
					new sap.m.HBox({
					//	height: "40px",
						fitContainer: true,
						items: [
							// 업로드용 File
							new sap.m.Label({ 
								text: "{i18n>LABEL_25013}", 
								width: "130px",
								layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) 
							}),
							new sap.ui.unified.FileUploader(oController.PAGEID + "_FileUpload", {
								fileType: ["pdf"],
								enabled: false,
								width: "500px",
								value: {
									path: "Fname",
									formatter: function(v) {
										if(Common.checkNull(v)) return "";
										else return v;
									} 
								},
								change: oController.onFileChange2.bind(oController),
								buttonText: "{i18n>LABEL_25014}" // 업로드
							}).addStyleClass("button-light-sm mt-8px"),
							new sap.m.Button(oController.PAGEID + "_FileDelBtn", {
								press: oController.onFileDelBtn.bind(oController),
								enabled: false,    
								text: "{i18n>LABEL_25005}", // 삭제
							}).addStyleClass("button-light-sm ml-5px mt-5px")
						]
					})
					.setModel(oController.UploadFileModel)
					.bindElement("/PDFFile")
					.addStyleClass("search-field-group"),
					new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Center,
						fitContainer: true,
						items: [
							sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", oController)
						]
					})
				]
			})
			.addStyleClass("side-table-box no-line");

			return new sap.m.FlexBox({
				fitContainer: true,
				items: [
					TreeBox,
					new sap.m.ScrollContainer(oController.PAGEID + "_MenuScroll", {
						width: "auto",
						visible: false,
						height: "100%",
						vertical: true,
						content: [
							ListBox,
							FileUpload
						]
					}).addStyleClass("search-box pt-20px")
				]
			}).addStyleClass("side-navi-group h-80");
		}
	});
});
