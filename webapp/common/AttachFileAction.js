jQuery.sap.declare("common.AttachFileAction");

jQuery.sap.require("sap.ui.core.util.File");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

/**
 * 결재문서의 파일첨부 관련 Function의 JS
 * @Create By 정명구
 */

common.AttachFileAction = {
	oController: null,
	fnChange: null,

	/**
	 * @memberOf common.AttachFileAction
	 */

	/*
	 * 파일첨부 panel 및 FileUploader Control의 표시여부 등을 설정
	 * 문서상태 및 첨부파일 여부에 따라 Control의 표시여부를 결정한다.
	 */
	setAttachFile: function (oController, opt) {
		var options = $.extend(
				true,
				{ 
					Editable: false, 
					FileTypes: [], 
					InfoMessage: "", 
					Appnm: "",
					Mode: "S",	// S: single file, M: multi file
					Max: 2,
					Required: false,
					HelpButton: false,
					HelpTextList: [],
					fnChange: null
				},
				opt
			),
			oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"),
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX");

		oFileUploader.setValue("");

		options.ListMode = options.Editable ? sap.m.ListMode.MultiSelect : sap.m.ListMode.None;
		options.FileTypes = ["ppt", "pptx", "doc", "docx", "xls", "xlsx", "jpg", "bmp", "gif", "png", "txt", "pdf", "zip", "jpeg"];
		if(typeof options.fnChange === "function") common.AttachFileAction.fnChange = options.fnChange;

		oAttachbox.getModel().setProperty("/Settings", options);
		oAttachbox.getModel().setProperty("/DelelteDatas", []);

		common.AttachFileAction.refreshAttachFileList(oController);
	},

	/*
	 * @param {key : {string}, value : {any}}
	 *
	 */
	setSettingByKey: function (oController, opt) {
		var options = $.extend(true, {}, opt),
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX");

		if (options.key) oAttachbox.getModel().setProperty("/Settings/" + options.key, options.value);
	},

	getFileLength: function (oController) {
		var vAttachDatas = sap.ui
			.getCore()
			.byId(oController.PAGEID + "_ATTACHBOX")
			.getModel()
			.getProperty("/Data");

		return vAttachDatas ? vAttachDatas.length : 0;
	},

	/*
	 * 첨부파일 리스트를 Binding한다.
	 */
	refreshAttachFileList: function (oController, vExistDataFlag) {
		var f1 = document.getElementById(oController.PAGEID + "_ATTACHFILE_BTN-fu_input-inner"),
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"),
			oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"),
			oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"),
			oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
			JSonModel = oAttachbox.getModel(),
			vAttachFileDatas = JSonModel.getProperty("/Data"),
			vAppnm = JSonModel.getProperty("/Settings/Appnm"),
			Datas = { Data: [] };

		if(!vAppnm) {
			JSonModel.setProperty("/Settings/Length", 0);
			JSonModel.setProperty("/Data", []);
			return;
		}

		if (f1) f1.setAttribute("value", "");

		oFileUploader.clear();
		oFileUploader.setValue("");
		oAttachFileList.removeSelections(true);

		oModel.read("/FileListSet", {
			async: false,
			filters: [
				new sap.ui.model.Filter("Appnm", sap.ui.model.FilterOperator.EQ, vAppnm)
			],
			success: function (data) {
				if (data && data.results.length) {
					data.results.forEach(function (elem) {
						elem.New = false;
						elem.Type = elem.Fname.substring(elem.Fname.lastIndexOf(".") + 1);
						elem.Url = elem.Url.replace(/retriveScpAttach/, "retriveAttach");

						Datas.Data.push(elem);
					});
				}
			},
			error: function (res) {
				common.Common.log(res);
			}
		});

		// DB저장 전 올린 File List 를 배열에 담는다. ( 이후에 DB에 저장 된 File List 와 결합하여 보여줌 )
		if (vExistDataFlag == "X" && vAttachFileDatas) {
			vAttachFileDatas.forEach(function (elem) {
				if(elem.New === true) Datas.Data.push(elem);
			});
		}

		JSonModel.setProperty("/Settings/Length", Datas.Data.length);
		JSonModel.setProperty("/Data", Datas.Data);
	},

	/*
	 * 업로드 옆에 안내 버튼을 클릭했을때 Message를 띄워줌
	 */
	onPressHelpBtn: function() {
		var oView = $.app.getView(),
			oController = this,
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"),
			JSonModel = oAttachbox.getModel(),
			oHelpTextList = JSonModel.getProperty("/Settings/HelpTextList");
		
		if (!oController._TextViewModel) {
			oController._TextViewModel = sap.ui.jsfragment("fragment.TextFlexBox", oController);
			oView.addDependent(oController._TextViewModel);
			
			var oTextFlexBox = sap.ui.getCore().byId(oController.PAGEID + "_TextFlexBox");
			var vLength = oHelpTextList.length;
			for(var i=0; i<vLength; i++){
				if(i === 0) {
					oTextFlexBox.addItem(
						new sap.m.Label({
							text: oHelpTextList[i].Text,
							textAlign: "Begin",
							design: "Bold"
						}).addStyleClass("color-info-red ml-4px mr-4px mt-4px")
					);
				}else{
					oTextFlexBox.addItem(
						new sap.m.Text({
							text: oHelpTextList[i].Text,
							textAlign: "Begin"
						}).addStyleClass("ml-4px mr-4px")
					);
				}
			}
		}
		
		oController._TextViewModel.open();
	},

	onDownload: function(oEvent) {
		var vFileInfo = oEvent.getSource().getBindingContext().getProperty();

		if(!vFileInfo) return;

		if(vFileInfo.Url) {
			if(common.Common.isExternalIP()) {
				sap.m.MessageBox.alert(this.getBundleText("MSG_00074"));	// 조회할 수 없습니다.
			} else {
				window.open(vFileInfo.Url, '_blank').focus();
			}
		} else {
			common.AttachFileAction.retrieveFile(vFileInfo);
		}
	},
	
	retrieveFile: function(vFileInfo) {
		// var vFileInfo = oEvent.getSource().getBindingContext().getProperty();

		if(!vFileInfo) return;

		sap.ui.core.util.File.save(
			atob(vFileInfo.Mresource),
			// vFileInfo.Mresource,
			vFileInfo.Fname.substring(0, vFileInfo.Fname.lastIndexOf(".")),
			vFileInfo.Fname.substring(vFileInfo.Fname.lastIndexOf(".") + 1),
			vFileInfo.Mimetype
		);
	},

	/*
	 * 첨부파의 크기가 Max Size를 넘었을 경우의 처리내역
	 */
	fileSizeExceed: function (oEvent) {
		var sName = oEvent.getParameter("fileName"),
			fSize = oEvent.getParameter("fileSize"),
			fLimit = oEvent.getSource().getMaximumFileSize(),
			sMsg = this.getBundleText("MSG_00030");

		sap.m.MessageBox.alert(sMsg.interpolate(sName, parseInt(fSize), fLimit));
	},

	/*
	 * 첨부파일의 유형이 허용된 파일유형이 아닌 경우의 처리내역
	 */
	typeMissmatch: function (oEvent) {
		var sName = oEvent.getParameter("fileName"),
			sType = oEvent.getParameter("fileType"),
			sMsg = this.getBundleText("MSG_00029"); // ${name} 파일의 ${type} 은 허용된 파일 확장자가 아닙니다.

		sap.m.MessageBox.alert(sMsg.interpolate(sName, sType));
	},

	/*
	 * 첨부파일의 Upload가 완료되었을때 처리 내역
	 * refreshAttachFileList Function을 호출한다.
	 */
	uploadComplete: function (oEvent) {
		var sResponse = oEvent.getParameter("response"),
			oFileUploader = sap.ui.getCore().byId(this.PAGEID + "_ATTACHFILE_BTN");

		sap.m.MessageBox.alert(sResponse, { title: this.getBundleText("LABEL_00149") }); // 안내

		oFileUploader.setValue("");

		common.AttachFileAction.refreshAttachFileList(this);
	},

	/*
	 * 첨부파일의 Upload가 실패하였을때 처리 내역
	 */
	uploadAborted: function () {
		sap.m.MessageBox.alert(this.getBundleText("MSG_00031"));
	},

	/*
	 * Upload할 첨부파일을 선택했을 경우 처리 내역
	 */
	onFileChange: function () {
		var oAttachbox = sap.ui.getCore().byId(this.PAGEID + "_ATTACHBOX"),
			oFileUploader = sap.ui.getCore().byId(this.PAGEID + "_ATTACHFILE_BTN"),
			f1 = document.getElementById(this.PAGEID + "_ATTACHFILE_BTN-fu_input-inner"),
			JSonModel = oAttachbox.getModel(),
			vFileData = JSonModel.getProperty("/Data"),
			aFileList = [],
			vMode = JSonModel.getProperty("/Settings/Mode"),
			vMax = JSonModel.getProperty("/Settings/Max"),
			files = jQuery.sap.domById(this.PAGEID + "_ATTACHFILE_BTN" + "-fu").files;

		if (files) {
			vFileData.forEach(function(elem) {
				aFileList.push(elem);
			});

			if(vMode === "M" && (vFileData.length + files.length) > vMax) {
				oFileUploader.clear();
				oFileUploader.setValue("");
				if (f1) f1.setAttribute("value", "");

				sap.m.MessageToast.show(this.getBundleText("MSG_00036").interpolate(vMax), { my: "center center", at: "center center"});

				return;
			}

			for (var i = 0; i < files.length; i++) {
				files[i].New = true;
				files[i].Fname = files[i].name;
				files[i].Type = files[i].type;

				aFileList.push(files[i]);
			}

			JSonModel.setProperty("/Settings/Length", aFileList.length);
			JSonModel.setProperty("/Data", aFileList);
		}

		oFileUploader.clear();
		oFileUploader.setValue("");
		if (f1) f1.setAttribute("value", "");

		if(typeof common.AttachFileAction.fnChange === "function") common.AttachFileAction.fnChange.call(this);
	},

	callDeleteSelectedFiles: function() {
		var oController = this,
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"),
			oJSonModel = oAttachbox.getModel(),
			aDeleteFiles = oJSonModel.getProperty("/DelelteDatas") || [];
			
		// 파일 삭제
		if(aDeleteFiles.length) {
			aDeleteFiles.forEach(function(elem) {
				common.AttachFileAction.callDeleteFileService(elem);
			});
		}
	},

	callDeleteFileService: function(fileInfo) {
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
			bReturnFlag = false,
			sPath = oModel.createKey("/FileListSet", {
				Appnm: fileInfo.Appnm,
				Docid: fileInfo.Docid,
				Cntnm: fileInfo.Cntnm
			});

		oModel.remove(sPath, {
			success: function () {
				bReturnFlag = true;
			},
			error: function (res) {
				bReturnFlag = false;

				var errData = common.Common.parseError(res);
				if(errData.Error && errData.Error === "E") {
					sap.m.MessageBox.error(errData.ErrorMessage, {
						title: this.getBundleText("LABEL_09029")
					});
				}
			}
		});

		return bReturnFlag;
	},

	/*
	 * 첨부된 파일을 삭제처리
	 */
	onDeleteAttachFile: function () {
		var oController = this,
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"),
			oJSonModel = oAttachbox.getModel(),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"),
			vContexts = oTable.getSelectedContexts(true);

		if (common.Common.isEmptyArray(vContexts)) {
			sap.m.MessageBox.alert(oController.getBundleText("MSG_00035")); // 삭제할 파일을 선택하세요.
			return;
		}

		oTable.removeSelections(true);

		var deleteProcess = function (fVal) {
			if(!fVal || fVal === sap.m.MessageBox.Action.NO) return;
			
			try {
				vContexts.slice().reverse().some(function(oRow) {
					var vRowData = oJSonModel.getProperty(oRow.getPath()),
						vIndex = parseInt(oRow.getPath().replace("/Data/", ""));

					// 기 저장된 파일
					if (vRowData.New === false) {
						var aDeleteFiles = oJSonModel.getProperty("/DelelteDatas") || [];

						aDeleteFiles.push(vRowData);
						oJSonModel.setProperty("/DelelteDatas", aDeleteFiles);
					}

					oJSonModel.getProperty("/Data").splice(vIndex, 1);
					oJSonModel.setProperty("/Settings/Length", oJSonModel.getProperty("/Data").length);
					oJSonModel.setProperty("/Data", oJSonModel.getProperty("/Data"));
				});

				sap.m.MessageToast.show(oController.getBundleText("MSG_00032"), { my: "center center", at: "center center"}); // 파일 삭제가 완료되었습니다.
			} catch (ex) {
				common.Common.log(ex);
			}
		};

		sap.m.MessageBox.show(oController.getBundleText("MSG_00033"), {
			title: oController.getBundleText("LABEL_00150"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: deleteProcess
		});
	},
	
	/*
	 * Row - 첨부된 파일을 삭제처리
	 */
	onDeleteAttachFileRow: function (oEvent) {
		var oController = this,
			oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"),
			oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"),
			oJSonModel = oAttachbox.getModel(),
			vPath = oEvent.getSource().getBindingContext().getPath(),
			vContexts = oJSonModel.getProperty(vPath),
			vIndex = vPath.replace("/Data/", "");

		if(!vContexts) return;

		oTable.removeSelections(true);

		var deleteProcess =	 function (fVal) {
			if(!fVal || fVal === sap.m.MessageBox.Action.NO) return;

			try {
				if(vContexts.New === false) {
					var aDeleteFiles = oJSonModel.getProperty("/DelelteDatas") || [];

					aDeleteFiles.push(vContexts);
					oJSonModel.setProperty("/DelelteDatas", aDeleteFiles);
				}

				oJSonModel.getProperty("/Data").splice(vIndex, 1);
				oJSonModel.setProperty("/Data", oJSonModel.getProperty("/Data"));
				oJSonModel.setProperty("/Settings/Length", oJSonModel.getProperty("/Data").length);

				sap.m.MessageToast.show(oController.getBundleText("MSG_00032"), { my: "center center", at: "center center"}); // 파일 삭제가 완료되었습니다.
			} catch (ex) {
				common.Common.log(ex);
			}

			if(typeof common.AttachFileAction.fnChange === "function") common.AttachFileAction.fnChange.call(this);
		}.bind(this);

		sap.m.MessageBox.show(oController.getBundleText("MSG_00033"), {
			title: oController.getBundleText("LABEL_00149"),
			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose: deleteProcess
		});
	},

	/*
	 * 첨부파일을 다운로드 한다.
	 */
	onDownloadAttachFile: function (oEvent) {
		var oSrc = oEvent.getSource(),
			vAseqn = "",
			vDocid = "",
			oCustomList = oSrc.getCustomData();

		if (oCustomList && oCustomList.length == 4) {
			vAseqn = oCustomList[0].getValue();
			vDocid = oCustomList[1].getValue();
		}

		document.iWorker.location.href = "/sap/bc/bsp/sap/ZUI5_HR_BSP/download.htm?ty=DOC&doc_id=" + vDocid + "&seq=" + vAseqn;
	},

	uploadFile: function () {
		var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
			oAttachbox = sap.ui.getCore().byId(this.PAGEID + "_ATTACHBOX"),
			vAttachDatas = oAttachbox.getModel().getProperty("/Data") || [],
			aDeleteFiles = oAttachbox.getModel().getProperty("/DelelteDatas") || [],
			vAppnm = oAttachbox.getModel().getProperty("/Settings/Appnm") || "",
			oController = this.oView.getController(),
			vPernr = oController.getSessionInfoByKey("Pernr");

		try {
			var _handleSuccess = function (data) {
				if(!vAppnm) vAppnm = $(data).find("content").next().children().eq(7).text();
				
				common.Common.log(this.getBundleText("MSG_00034") + ", " + data);
			};
			var _handleError = function (data) {
				vAppnm = null;
				var errorMsg = this.getBundleText("MSG_00031");

				common.Common.log("Error: " + data);
				sap.m.MessageToast.show(errorMsg, { my: "center center", at: "center center"});
			};

			// 파일 삭제
			if(aDeleteFiles.length) {
				var bDeleteFlag = true;
				aDeleteFiles.some(function(elem) {
					bDeleteFlag = common.AttachFileAction.callDeleteFileService(elem);

					return !bDeleteFlag;
				});

				if(!bDeleteFlag) {
					sap.m.MessageToast.show(this.getBundleText("MSG_00031"), { my: "center center", at: "center center"});
					return;
				}
			}

			// 신규 등록된 파일만 업로드
			if (common.Common.isEmptyArray(vAttachDatas)) return;

			vAttachDatas.forEach(function (elem) {
				if(elem.New === true) {
					oModel.refreshSecurityToken();
					var oRequest = oModel._createRequest();
					var oHeaders = {
						"x-csrf-token": oRequest.headers["x-csrf-token"],
						"slug": [vAppnm, vPernr, encodeURI(elem.Fname), vPernr].join("|")
					};
	
					common.Common.log(oHeaders.slug);
					
					jQuery.ajax({
						type: "POST",
						async: false,
						url: $.app.getDestination() + "/sap/opu/odata/sap/ZHR_COMMON_SRV/FileAttachSet/",
						headers: oHeaders,
						cache: false,
						contentType: elem.type,
						processData: false,
						data: elem,
						success: _handleSuccess.bind(this),
						error: _handleError.bind(this)
					});
				}
			}.bind(this));
		} catch (oException) {
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
		}

		return vAppnm;
	}
};
