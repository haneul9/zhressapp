sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail03", {
	/** 국세청자료 **/
	createContent : function(oController) {
		jQuery.sap.require("sap.ui.unified.FileUploader");
		jQuery.sap.require("ZUI5_HR_Yeartax.control.ODataFileUploader");
		
		var oFileUploader = new ZUI5_HR_Yeartax.control.ODataFileUploader("yeaUploader", {
			name : "upload2",
			modelName : "ZHR_YEARTAX_SRV",
			slug : "",
			maximumFileSize: 3,
			multiple : false,
			width : "50%",
			uploadOnChange: true,
	//		mimeType: "application",
			fileType: ["pdf"],
			buttonText : "첨부파일",
			uploadUrl : "/sap/opu/odata/sap/ZHR_YEARTAX_SRV/YeartaxPdfFileAttachSet/",
			uploadComplete: oController.uploadComplete,
			uploadAborted : oController.uploadAborted,
			fileSizeExceed: oController.fileSizeExceed,
			typeMissmatch: oController.typeMissmatch,
			change : oController.onFileChange
		});
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 2,
			width : "100%",
			widths : ["90%", "10%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow({height : "10px"}),
					new sap.ui.commons.layout.MatrixLayoutRow({
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									content : [new sap.ui.layout.HorizontalLayout({
													allowWrapping : true,
													content : [
														new sap.m.Link({
															text : {
																path : "EFname",
																formatter : function(fVal) {
																	return fVal ? "첨부파일 : " + decodeURI(fVal) : "";
																}
															},
															customData : [new sap.ui.core.CustomData({key : "", value : "{}"})],
															press : oController.onDownloadPDFFile,
														}).addStyleClass("Font14 helpText PaddingRight10 PaddingTop6"),
														new sap.m.Button("yeaUploader_AttachFileDelete", {
															text : "파일삭제",
															press : oController.onDeleteAttachFile,
															visible : {
																parts : [{path : "EFname"}],
																formatter : function(fVal){
																	if(fVal){
																		var oPystat = oController._DetailJSonModel.getProperty("/Data/Pystat"),
																			oYestat = oController._DetailJSonModel.getProperty("/Data/Yestat");

																		return (oPystat == "1" && oYestat == "1") ? true : false;
																	} else {
																		return false;
																	}
																}
															}
														}).addStyleClass("button-delete")
													]
												})]
								 })]
					})]
		});
		
		var oAttachFileInfo = new sap.m.CustomListItem("yeaUploader_AttachFileInfo",{			
			content : [oMatrix]
		});
		
		var oAttachFileList = new sap.m.List("yeaUploader_AttachFileList", {
			showSeparators : sap.m.ListSeparators.None,
			showNoData : false,
			updateFinished : oController.onSetView,
			width : "80%"
		});
		
		oAttachFileList.setModel(sap.ui.getCore().getModel("ZHR_YEARTAX_SRV"));
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			content : [new sap.ui.core.HTML({content : "<div style='height:10px' />"}),
					   new sap.ui.layout.HorizontalLayout({
						   content : [//new sap.ui.core.Icon({src : "sap-icon://message-information", color : "#0a6ed1", size : "17px"}).addStyleClass("PaddingTop1 PaddingRight10"),
							   		  new sap.m.Text({text : "국세청 PDF자료 업로드 시 기존에 입력된 데이터가 삭제될 수 있습니다." +
							   		  						 "\n국세청 PDF자료는 한 개의 파일만 업로드 할 수 있습니다. 국세청 홈페이지에서 PDF 다운로드 시 모든 항목을 한 개의 파일로 다운로드하시기 바랍니다."})]
					   }).addStyleClass("custom-OpenHelp-msgBox")]
		});
		
		var oPanel = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								 content : [new sap.m.Text({text : "첨부파일"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [new sap.m.VBox({
						   items : [oFileUploader],
						   visible : {
								parts : [{path : "Pystat"}, {path : "Yestat"}],
								formatter : function(fVal1, fVal2){
									if(fVal1 == "1" && fVal2 == "1") 
										return true;
									else 
										return false;
								}
						   }
					   }), oAttachFileList, oLayout]
		});
		
		return oPanel;
	}

});
