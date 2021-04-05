/* eslint-disable no-undef */
jQuery.sap.declare("ZUI5_HR_ActApp.fragment.AttachFileAction");

jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

/**
 * 결재문서의 파일첨부 관련 Function의 JS
 * @Create By 정명구
 */
ZUI5_HR_ActApp.fragment = {};
ZUI5_HR_ActApp.fragment.AttachFileAction = {
	oController: null,

	/**
	 * @memberOf ZUI5_HR_ActApp.fragment.AttachFileAction
	 */

	/*
	 * 파일첨부 panel 및 FileUploader Control의 표시여부 등을 설정
	 * 문서상태 및 첨부파일 여부에 따라 Control의 표시여부를 결정한다.
	 */
	setAttachFile: function (oController) {
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");

		oFileUploader.setSlug(oController._vDocno + "|" + encodeURI(oController._vPersa) + "|" + encodeURI(oController._vReqno) + "|01");
	},

	/*
	 * 첨부파일 리스트를 Binding한다.
	 */
	refreshAttachFileList: function (oController) {
		var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var oAttachFileColumn = sap.ui.getCore().byId(oController.PAGEID + "_CAF_ColumnList");
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oController._vPersa));
		oFilters.push(new sap.ui.model.Filter("Reqno", sap.ui.model.FilterOperator.EQ, oController._vReqno));
		oFilters.push(new sap.ui.model.Filter("Docno", sap.ui.model.FilterOperator.EQ, oController._vDocno));
		oAttachFileList.bindItems("/ActionReqFileSet", oAttachFileColumn, null, oFilters);
	},

	/*
	 * 첨부파의 크기가 Max Size를 넘었을 경우의 처리내역
	 */
	fileSizeExceed: function (oEvent) {
		var sName = oEvent.getParameter("fileName");
		var fSize = oEvent.getParameter("fileSize");
		var fLimit = this.getMaximumFileSize();

		var sMsg = oController.getBundleText("MSG_02102");
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&fSize", fSize);
		sMsg = sMsg.replace("&fLimit", fLimit);

		sap.m.MessageBox.alert(sMsg);
	},

	/*
	 * 첨부파일의 유형이 허용된 파일유형이 아닌 경우의 처리내역
	 */
	typeMissmatch: function (oEvent) {
		var oController = ZUI5_HR_ActApp.fragment.AttachFileAction.oController;

		var sName = oEvent.getParameter("fileName");
		var sType = oEvent.getParameter("fileType");
		var sMimeType = this.getMimeType();
		if (!sMimeType) {
			var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
			sMimeType = oFileUploader.getFileType();
		}
		var sMsg = oController.getBundleText("MSG_02103");
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&sType", sType);

		sap.m.MessageBox.alert(sMsg);
	},

	/*
	 * 첨부파일의 Upload가 완료되었을때 처리 내역
	 * refreshAttachFileList Function을 호출한다.
	 */
	uploadComplete: function (oEvent) {
		var oController = ZUI5_HR_ActApp.fragment.AttachFileAction.oController;

		if (oController.BusyDialog && oController.BusyDialog.isOpen()) {
			oController.BusyDialog.close();
		}

		var sResponse = oEvent.getParameter("response");
		sap.m.MessageBox.alert(sResponse, { title: "{i18n>LABEL_02093}" });

		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.setValue("");

		ZUI5_HR_ActApp.fragment.AttachFileAction.refreshAttachFileList(oController);
	},

	/*
	 * 첨부파일의 Upload가 실패하였을때 처리 내역
	 */
	uploadAborted: function () {
		sap.m.MessageBox.alert(oController.getBundleText("MSG_02104"));
	},

	/*
	 * Upload할 첨부파일을 선택했을 경우 처리 내역
	 */
	onFileChange: function () {
		var oController = ZUI5_HR_ActApp.fragment.AttachFileAction.oController;

		if (!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({ showHeader: false });
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: oController.getBundleText("MSG_02105") }));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: oController.getBundleText("MSG_02105") }));
		}
		if (!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
	},

	/*
	 * 첨부된 파일을 삭제처리
	 */
	onDeleteAttachFile: function () {
		var oController = ZUI5_HR_ActApp.fragment.AttachFileAction.oController;

		var oModel = sap.ui.getCore().getModel("ZHR_ACTIONAPP_SRV");

		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var vContexts = oTable.getSelectedContexts(true);

		var fProcessFlag = true;

		if (vContexts && vContexts.length) {
			try {
				if (!oController.BusyDialog) {
					oController.BusyDialog = new sap.m.Dialog({ showHeader: false });
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_02010}" }));
					oController.getView().addDependent(oController.BusyDialog);
				} else {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: "{i18n>MSG_02010}" }));
				}
				if (!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}

				for (var i = 0; i < vContexts.length; i++) {
					oModel.remove(
						"/ActionReqFileSet(Docno='" + vContexts[i].getProperty("Docno") + "',Fnumr='" + vContexts[i].getProperty("Fnumr") + "')",
						null,
						function () {
							fProcessFlag = true;
						},
						function (oError) {
							fProcessFlag = false;
							var Err = {};
							if (oError.response) {
								Err = window.JSON.parse(oError.response.body);
								common.Common.showErrorMessage(Err.error.message.value);
							} else {
								sap.m.MessageBox.alert(rError2);
							}
							rError = oError;
						}
					);
					if (!fProcessFlag) {
						break;
					}
				}

				ZUI5_HR_ActApp.fragment.AttachFileAction.refreshAttachFileList(oController);

				if (oController.BusyDialog && oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}

				if (!fProcessFlag) {
					return;
				}
				sap.m.MessageBox.alert(oController.getBundleText("MSG_02106"));
			} catch (ex) {
				common.Common.log(ex);
			}
		}
	},

	/*
	 * 첨부파일을 다운로드 한다.
	 */
	onDownloadAttachFile: function (oEvent) {
		var oSrc = oEvent.getSource();
		var vAseqn = "",
			vDocid = "";
		var oCustomList = oSrc.getCustomData();
		if (oCustomList && oCustomList.length == 4) {
			vAseqn = oCustomList[0].getValue();
			vDocid = oCustomList[1].getValue();
		}
		document.iWorker.location.href = "/sap/bc/bsp/sap/z_hr_ui5_bsp/download.htm?ty=DOC&doc_id=" + vDocid + "&seq=" + vAseqn;
	}
};
