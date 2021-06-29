sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
		"sap/ui/core/IconPool",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/ui/unified/library",
		"fragment/COMMON_ATTACH_FILES"
	],
	function (Common, CommonController, JSONModelHelper, IconPool, BusyIndicator, MessageBox, unifiedLibrary, FileHandler) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "OpenHelpRoomDetail"].join($.app.getDeviceSuffix());
		
		return CommonController.extend(SUB_APP_ID, {
			PAGEID: "OpenHelpRoomDetail",

			TreeModel: new JSONModelHelper(),
            OpenHelpModel: new JSONModelHelper(),

			getUserId: function() {
				
				return $.app.getController().getUserId();
			},
			
			getUserGubun  : function() {

				return $.app.getController().getUserGubun();
			},

			onInit: function () {
				this.setupView();

				this.getView()
					.addEventDelegate({
						onBeforeShow: this.onBeforeShow,
						onAfterShow: this.onAfterShow
					}, this);
				
				Common.log("onInit session", this.getView().getModel("session").getData());
			},

			onBeforeShow: function (oEvent) {
				var	oController = this.getView().getController();
				
				oController.OpenHelpModel.setData({ TopData: {} });
				oController.TreeModel.setData({ Data: {} });
				
				if(oEvent.data) {
					oController.TreeModel.setProperty("/Data/Title", oEvent.data.title);
					oController.OpenHelpModel.setProperty("/TopData", oEvent.data.TopData);
					oController.OpenHelpModel.setProperty("/MiddleData", oEvent.data.MiddleData);
					oController.OpenHelpModel.setProperty("/BottomData", oEvent.data.BottomData);
					oController.OpenHelpModel.setProperty("/FileData",  oEvent.data.FileData);
					oController.OpenHelpModel.setProperty("/PDFFileData", Common.checkNull(oEvent.data.PDFFileData) ? "" : oEvent.data.PDFFileData);
					oController.OpenHelpModel.setProperty("/UrlData",  oEvent.data.Url);
				}
				
				Common.log("onBeforeShow");
			},

			onAfterShow: function () {
				var	oController = this.getView().getController();
				
				oController.onTableSearch();
				oController.onBeforeOpenDetailDialog();
			},
			
			navBack: function() {
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "List"].join($.app.getDeviceSuffix())
				});
			},
			
			onTableSearch: function () {
                
            },
			
			onBeforeOpenDetailDialog: function(oEvent) {
				var oController = this.getView().getController();
				var vAppnm = oController.OpenHelpModel.getProperty("/FileData/0/Appnm") || "";
				var vPDFAppnm = oController.OpenHelpModel.getProperty("/PDFFileData");
				var oFileBox = $.app.byId(oController.PAGEID + "_FileBox");

				if(Common.checkNull(vAppnm)) oFileBox.setVisible(false);
				else oFileBox.setVisible(true);


				Common.getPromise(function() {
					if(Common.checkNull(!vPDFAppnm)){
						FileHandler.setAttachFile(oController, {
							Appnm: vPDFAppnm,
							Mode: "S",
							Max: 1,
							Editable: false
						},"001");
					}
				});
				
				Common.getPromise(function() {
					FileHandler.setAttachFile(oController, {
						Appnm: vAppnm,
						Mode: "M",
						Max: 3,
						Editable: false
					},"002");
				});
			},
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: "20200154"}); //35117893 20200154
			} : null
			 
		});
	}
);
