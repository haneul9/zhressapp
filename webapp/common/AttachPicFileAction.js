jQuery.sap.declare("common.AttachPicFileAction");

jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

/**
 * �������� ���ε� ���� Function�� +JS
 * @Create By ������
 */

common.AttachPicFileAction = {
	oController: null,

	/**
	 * @memberOf common.AttachPicFileAction
	 */

	/*
	 * ����÷�� panel �� FileUploader Control�� ǥ�ÿ��� ���� ����
	 * �������� �� ÷������ ���ο� ���� Control�� ǥ�ÿ��θ� �����Ѵ�.
	 */
	setAttachFile: function (oController) {
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.setSlug(oController._vPernr);
		// Upload�� ������ ���ýÿ� ù��° index ��°��� ǥ��.
		oController.oFirstIndex = true;
	},

	/*
	 * ÷������ ����Ʈ�� Binding�Ѵ�.
	 */
	refreshAttachFileList: function (oController) {
		var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var oAttachFileColumn = sap.ui.getCore().byId(oController.PAGEID + "_CAF_ColumnList");
		var oAttachFileModel = sap.ui.getCore().getModel("ZHRXX_EMP_PHOTO_SRV");
		var mPhotoUploadResult = sap.ui.getCore().getModel("PhotoUploadResult");
		var vPhotoUploadResult = { PhotoUploadResultSet: [] };

		//		oAttachFileList.setModel(oAttachFileModel);
		//		var oFilters = [];
		//		oAttachFileList.bindItems("/PhotoUploadResultSet", oAttachFileColumn, null, oFilters);

		oAttachFileModel.read(
			"/PhotoUploadResultSet",
			null,
			null,
			false,
			function (oData, oResponse) {
				if (oData && oData.results) {
					for (var i = 0; i < oData.results.length; i++) {
						vPhotoUploadResult.PhotoUploadResultSet.push(oData.results[i]);
					}
				}
				mPhotoUploadResult.setData(vPhotoUploadResult);
			},
			function (oResponse) {
				common.Common.log(oResponse);
			}
		);

		oAttachFileList.setModel(sap.ui.getCore().getModel("PhotoUploadResult"));
		oAttachFileList.bindItems("/PhotoUploadResultSet", oAttachFileColumn);
	},

	/*
	 * ÷������ ũ�Ⱑ Max Size�� �Ѿ��� ����� ó������
	 */
	fileSizeExceed: function (oEvent) {
		var sName = oEvent.getParameter("fileName");
		var fSize = oEvent.getParameter("fileSize");
		var fLimit = this.getMaximumFileSize();

		var sMsg = "&sName 파일(&fSize MB)은 최대 허용 쿠기 &fLimit MB를 초과하였습니다.";
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&fSize", fSize);
		sMsg = sMsg.replace("&fLimit", fLimit);

		common.Common.showErrorMessage(sMsg);
	},

	/*
	 * ÷�������� ������ ���� ���������� �ƴ� ����� ó������
	 */
	typeMissmatch: function (oEvent) {
		var oController = common.AttachPicFileAction.oController;

		var sName = oEvent.getParameter("fileName");
		var sType = oEvent.getParameter("fileType");
		var sMimeType = this.getMimeType();
		if (!sMimeType) {
			var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
			sMimeType = oFileUploader.getFileType();
		}
		var sMsg = "&sName 파일의  &sType 은 허용된 파일 확장자가 아닙니다.";
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&sType", sType);

		common.Common.showErrorMessage(sMsg);
	},

	/*
	 * ÷�������� Upload�� �Ϸ�Ǿ����� ó�� ����
	 * refreshAttachFileList Function�� ȣ���Ѵ�.
	 */
	uploadComplete: function (oEvent) {
		var oController = common.AttachPicFileAction.oController;

		if (oController.BusyDialog && oController.BusyDialog.isOpen()) {
			oController.BusyDialog.close();
		}

		var sResponse = oEvent.getParameter("response");
		if (sResponse != "") {
			sap.m.MessageBox.alert(sResponse, { title: "안내" });
		}

		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.setValue("");

		common.AttachPicFileAction.refreshAttachFileList(oController);
	},

	/*
	 * ÷�������� Upload�� �����Ͽ����� ó�� ����
	 */
	uploadAborted: function (oEvent) {
		sap.m.MessageBox.alert("파일 업로드에 실패하였습니다.");
	},

	/*
	 * Upload�� ÷�������� �������� ��� ó�� ����
	 */
	onFileChange: function (oEvent) {
		var oController = common.AttachPicFileAction.oController;

		if (!oController.BusyDialog) {
			oController.BusyDialog = new sap.m.Dialog({ showHeader: false });
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: "파일 업로드 중입니다. 잠시만 기다려 주십시오." }));
			oController.getView().addDependent(oController.BusyDialog);
		} else {
			oController.BusyDialog.removeAllContent();
			oController.BusyDialog.destroyContent();
			oController.BusyDialog.addContent(new sap.m.BusyIndicator({ text: "파일 업로드 중입니다. 잠시만 기다려 주십시오." }));
		}
		if (!oController.BusyDialog.isOpen()) {
			oController.BusyDialog.open();
		}
	}
};
