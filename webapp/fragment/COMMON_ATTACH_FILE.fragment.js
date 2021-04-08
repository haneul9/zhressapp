sap.ui.define([
	"../common/Common", 
	"../common/AttachFileAction", 
	"../control/ODataFileUploader", 
	"sap/ui/unified/FileUploader"
], function (Common, AttachFileAction, ODataFileUploader) {
	"use strict";

	sap.ui.jsfragment("fragment.COMMON_ATTACH_FILE", {
		createContent: function (oController) {
			var oFileUploader = new ODataFileUploader(oController.PAGEID + "_ATTACHFILE_BTN", {				
				name: oController.PAGEID + "UploadFile",
				modelName: "ZHR_COMMON_SRV",
				slug: "",
				maximumFileSize: 20,
				multiple: true,
				uploadOnChange: false,
				mimeType: [], //["image","text","application"],
				fileType: "{/Settings/FileTypes}", //["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf"]
				buttonText: "{i18n>LABEL_00134}", // 업로드
				buttonOnly: true,
				//uploadUrl : "/sap/opu/odata/sap/ZL2P01GW0001_SRV/FileSet/",
				uploadComplete: $.proxy(AttachFileAction.uploadComplete, oController),
				uploadAborted: $.proxy(AttachFileAction.uploadAborted, oController),
				fileSizeExceed: $.proxy(AttachFileAction.fileSizeExceed, oController),
				typeMissmatch: $.proxy(AttachFileAction.typeMissmatch, oController),
				change: $.proxy(AttachFileAction.onFileChange, oController),
				visible: {
					parts: [
						{path: "/Settings/Editable"},
						{path: "/Settings/Mode"},
						{path: "/Settings/Length"}
					],
					formatter: function(v1, v2, v3) {
						if(v1 === true) {
							if(v2 === "S") {
								if(v3 < 1) {
									return true;
								} else {
									return false;
								}
							} else {
								return true;
							}
						} else {
							return false;
						}
					}
				}
			});

			var FileInfoBox = new sap.m.FlexBox({								
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.Center,
				alignItems: sap.m.FlexAlignItems.Center,
				fitContainer: true,				
				items: [
					new sap.m.FlexBox({
						alignContent: sap.m.FlexAlignContent.Center,
						alignItems: sap.m.FlexAlignItems.Center,						
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_00135}",
								required: {
									path: "/Settings/Required",
									formatter: function(v) {
										if(v === true) return true;
										else return false;
									}
								}			
							}).addStyleClass("sub-title pt-9px"), // 첨부파일
							new sap.m.MessageStrip({								
								text: "{/Settings/InfoMessage}",
								enableFormattedText: true,
								showIcon: true,
								showCloseButton: false,
								visible: {
									path: "/Settings/InfoMessage",
									formatter: function(v) {
										if(v) return true;
										else return false;
									}
								}
							}).addStyleClass("ml-8px")
						]
					}),
					new sap.m.FlexBox({
						items: [
							new sap.m.Button({
								press: $.proxy(AttachFileAction.onPressHelpBtn, oController),
								text: "{i18n>LABEL_00149}", // 안내								
								visible: {
									path: "/Settings/HelpButton",
									formatter: function(v) {
										if(v === true) return true;
										else return false;
									}
								}
							}).addStyleClass("button-default"),
							oFileUploader
						],
						visible: {
							path: "/Settings/Editable",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						}   
					})
				]
			}).addStyleClass("mt-10px");
			
			var oColumns = new sap.m.ColumnListItem({
				cells: [
					new sap.m.FlexBox({
						items: [
							new sap.ui.core.Icon({
								size: "1.0rem",
								src: {
									path: "Type",
									formatter: function(v) {
										return Common.FileTypeIcon(v);
									}
								},
								color: "#005f28"
							}),
							new sap.m.Link({
								text: "{Fname}",
								wrapping: true,
								textAlign: "Begin",
								href: "{Url}",
								target: "_new"
							}).addStyleClass("ml-5px")
						] 
					}),
					new sap.m.Button({    
						icon: "sap-icon://decline",						
						press: $.proxy(AttachFileAction.onDeleteAttachFileRow, oController),
						visible: {
							path: "/Settings/Editable",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						}
					}).addStyleClass("button-light-sm")
				]
			});    

			var oAttachFileTable = new sap.m.Table(oController.PAGEID + "_CAF_Table", {
				inset: false,
				showNoData: false,
				// mode: "{/Settings/ListMode}",
				mode: sap.m.ListMode.None,
				columns: [
					new sap.m.Column({
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "8em",
						hAlign: sap.ui.core.TextAlign.Right,
						visible: {
							path: "/Settings/Editable",
							formatter: function(v) {
								if(v === true) {
									return true;
								} else {
									return false;
								}
							}
						}
					})
				]
			})
			.addStyleClass("mt-4px")
			.bindItems("/Data", oColumns);

			return new sap.m.FlexBox(oController.PAGEID + "_ATTACHBOX", {
				width: "100%",
				direction: sap.m.FlexDirection.Column,				
				items: [FileInfoBox, oAttachFileTable]
			})	  		
			.setModel(new sap.ui.model.json.JSONModel());
		}
	});
});
