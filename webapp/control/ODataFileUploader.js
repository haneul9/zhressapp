/**
	OData File Uploader Control

	Extends FileUploader replacing the Form.Submit with an AJAX call, 
	the logic should work with any <input type="file"
**/
jQuery.sap.declare("control.ODataFileUploader");

jQuery.sap.require("sap.ui.unified.FileUploader");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.unified.FileUploader.extend("control.ODataFileUploader", {
	metadata: {
		properties: {
			modelName: "string",
			slug: "string"
		}
	},
	upload: function () {
		var fCheckBrowser = function () {
			try {
				var ua = navigator.userAgent,
					tem,
					M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
				if (/trident/i.test(M[1])) {
					tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
					return "IE " + (tem[1] || "");
				}
				if (M[1] === "Chrome") {
					tem = ua.match(/\bOPR\/(\d+)/);
					if (tem != null) return "Opera " + tem[1];
				}
				M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
				if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
				return M.join(" ");
			} catch (ex) {
				return "";
			}
		};

		var vBrowserInfo = fCheckBrowser();
		if (vBrowserInfo != "") {
			var vTemp = vBrowserInfo.split(" ");

			if (vTemp[0].toLowerCase() == "msie") {
				if (parseInt(vTemp[1]) < 10) {
					this.fireUploadComplete({ response: "Error: 파일 업로드 기능은 IE10 이상 또는 Chrome 등을 사용 바랍니다." });
					return;
				}
			}
		}

		// var files = jQuery.sap.domById(this.getId() + "-fu").files;
		// var that = this;

		// var _handleSuccess = function (data) {
		// 	//			console.log(data);
		// 	that.fireUploadComplete({ response: "파일 업로드를 완료하였습니다." });
		// 	that._bUploading = false;
		// };
		// var _handleError = function (data) {
		// 	var errorMsg = null;
		// 	if (data.responseText) {
		// 		//				errorMsg = /<message xml:lang="ko">(.*?)<\/message>/.exec(data.responseText);
		// 		errorMsg = /<message>(.*?)<\/message>/.exec(data.responseText);
		// 	} else {
		// 		errorMsg = "파일 업로드에 실패하였습니다.";
		// 	}
		// 	if (errorMsg && errorMsg.length) {
		// 		that.fireUploadComplete({ response: "Error: " + errorMsg[1] });
		// 	} else {
		// 		that.fireUploadComplete({ response: "Error: " + errorMsg });
		// 	}

		// 	that._bUploading = false;
		// };

		// try {
		// 	if (files && files.length) {
		// 		for (var i = 0; i < files.length; i++) {
		// 			var file = files[i];
		// 			if (file) {
		// 				this._bUploading = true;

		// 				sap.ui.getCore().getModel(this.getModelName()).refreshSecurityToken();
		// 				var oRequest = sap.ui.getCore().getModel(this.getModelName())._createRequest();
		// 				var oHeaders = {
		// 					"x-csrf-token": oRequest.headers["x-csrf-token"],
		// 					slug: this.getSlug() + "|" + encodeURI(file.name)
		// 				};

		// 				jQuery.ajax({
		// 					type: "POST",
		// 					url: this.getUploadUrl(),
		// 					headers: oHeaders,
		// 					cache: false,
		// 					contentType: file.type,
		// 					processData: false,
		// 					data: file,
		// 					success: _handleSuccess,
		// 					error: _handleError
		// 				});
		// 			}
		// 		}
		// 	} else {
		// 		that.fireUploadComplete({ response: "Error: " + "업로드 파일을 가져오지 못했습니다." });
		// 		that._bUploading = false;
		// 	}
		// } catch (oException) {
		// 	that.fireUploadComplete({ response: "파일 업로드에 실패하였습니다." + " :\n" + oException.message });
		// 	that._bUploading = false;
		// 	jQuery.sap.log.error("File upload failed:\n" + oException.message);
		// }
	},

	renderer: {}
});
