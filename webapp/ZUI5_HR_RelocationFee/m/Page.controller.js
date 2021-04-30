sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper"
	], 
	function (Common, CommonController, JSONModelHelper) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		LogModel: new JSONModelHelper(),
		
		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.getSessionInfoByKey("Bukrs3");
        },
		
		onInit: function () {

			this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this)
		},
		
		onBeforeShow: function() {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			this.onTableSearch();
			this.onInitData(this);
        },

		onInitData: function(oController) {
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "0";
			// Navigation property
			sendObject.NewPostExport = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					var LogData = oData.NewPostExport.results[0];
					oController.LogModel.setData({LogData: LogData});
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			
			oController.TableModel.setData({Data: []}); 

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
            sendObject.IGubun = "1";
			// Navigation property
			sendObject.NewPostTableIn1 = [];
			
			oModel.create("/NewPostImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.NewPostTableIn1) {
						Common.log(oData);
						var rDatas = oData.NewPostTableIn1.results;
						oController.TableModel.setData({Data: rDatas}); 
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
        },
		
		onPressReq: function() { //신청
            var oLog = $.extend(true, {}, this.LogModel.getProperty("/LogData"));
            
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "RelocationApply"].join($.app.getDeviceSuffix()),
                data: { 
                    Logi: oLog
                }
            });
		},
		
		onSelectedRow: function(oEvent) {
            var oLog = $.extend(true, {}, this.LogModel.getProperty("/LogData"));
			var vPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
			var oRowData = $.extend(true, {}, this.TableModel.getProperty(vPath));

			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "RelocationApply"].join($.app.getDeviceSuffix()),
                data: {
                    RowData: oRowData,
                    Logi: oLog
                }
            });
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20190204"}); // 20001008 20190204
		} : null
	});
});