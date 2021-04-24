sap.ui.define(
    [
        "common/Common" ,
    	"control/ODataFileUploader", 
    ],
    function (Common, ODataFileUploader ) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.PictureInfo", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
               
                var oMatrix = new sap.ui.commons.layout.MatrixLayout({
                    columns: 1,
                    width: "100%",
                    rows: [
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "10px",
                            cells: []
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                            	new sap.ui.commons.layout.MatrixLayoutCell({ 
		                            	content : new sap.m.Text({ text: "{i18n>MSG_37037}" }).addStyleClass("px-10") //JPG/JPEG/PNG 형식으로 사진을 업로드하십시오. 파일 크기는 2MB를 넘지 않아야 하며 가로 세로 비율은 3 : 4가 권장됩니다.
	                            })]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "280px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [new sap.m.Image({
                                    	    		src :"{photo}",
			                                    	height : "250px", 
			                                    	width :  "280px"
			                                   }).addStyleClass("EmployeePic")
			                        ],
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                })
                            ]
                        }),
                        new sap.ui.commons.layout.MatrixLayoutRow({
                            height: "45px",
                            cells: [
                                new sap.ui.commons.layout.MatrixLayoutCell({
                                    content: [
            								new ODataFileUploader(oController.PAGEID + "_PIC_ATTACHFILE_BTN", {				
												name: oController.PAGEID + "PICUploadFile",
												modelName: "ZHR_COMMON_SRV",
												slug: "",
												maximumFileSize: 1,
												multiple: false,
												uploadOnChange: false,
												mimeType: ["image"], //["image","text","application"],
												fileType: ["jpg","png","jpeg"], //["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf"]
												buttonText: "{i18n>LABEL_37108}", // 업로드
												buttonOnly: true,
												// uploadComplete: $.proxy(AttachFileAction.uploadComplete, oController),
												// uploadAborted: $.proxy(AttachFileAction.uploadAborted, oController),
												// fileSizeExceed: $.proxy(AttachFileAction.fileSizeExceed, oController),
												// typeMissmatch: $.proxy(AttachFileAction.typeMissmatch, oController),
												change: oController.onFileChange,
											})  	
                                    ], 
                                    hAlign: "Center",
                                    vAlign: "Middle"
                                }),
                            ]
                        }),
                    ]
                }).addStyleClass("px-5px");

                var oDialog = new sap.m.Dialog({
                    contentWidth: "600px",
                    contentHeight: "350px",
                    draggable: false,
                    horizontalScrolling: false,
                    content: [oMatrix],
                    title: "{i18n>LABEL_37107}", // 사진정보
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00101}", // 저장
                            // visible: {
                            //     path: "actMode",
                            //     formatter: function (v) {
                            //         if (v === "2" || v === "3") return true;
                            //         else return false;
                            //     }
                            // },
                            press: oController.onSavePicture
                        }),
                        new sap.m.Button({
                            type: "Default",
                            text: "{i18n>LABEL_06122}", // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        })
                    ]
                });

                oDialog.addStyleClass("sapUiSizeCompact");
                oDialog.setModel(oController._PictureJSonModel);
                oDialog.bindElement("/Data");

                return oDialog;
            }
        });
    }
);
