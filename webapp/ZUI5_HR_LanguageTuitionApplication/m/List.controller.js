sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper"
	], 
	function (Common, CommonController,JSONModelHelper) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
        PAGEID: "List",

        TableModel: new JSONModelHelper(),
        TuitionSearchModel: new JSONModelHelper(),

        getUserId: function() {
            return this.getSessionInfoByKey("name");
        },

        getUserGubun: function() {
            return this.getSessionInfoByKey("Bukrs2");
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
            
			this.onTableSearch(this);
		},

        onTableSearch: function(oController) {
            var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
            var vPernr = oController.getUserId();
            var vBukrs2 = oController.getUserGubun();

            oController.TableModel.setData({Data: []});

            var oSendObject = {
                IPernr: vPernr,
                IEmpid: vPernr,
                IBukrs: vBukrs2,
                IConType: "1",
                IBegda: new Date(new Date().setYear(new Date().getFullYear()-100)),
                IEndda: new Date(new Date().setYear(new Date().getFullYear()+100)),
                LanguPayApplyExport: [],
                LanguPayApplyTableIn: [],
                LanguPayApplyTableIn3: []
            };

            oModel.create("/LanguPayApplySet", oSendObject, {
                success: function(oData) {
                    if(oData && oData.LanguPayApplyTableIn){
                        Common.log(oData);
                        var rDatas = oData.LanguPayApplyTableIn.results;
                        oController.TableModel.setData({Data: rDatas});
                    }

                    oController.TuitionSearchModel.setProperty("/ExportData", oData.LanguPayApplyExport.results[0]);
                },
                error: function(oResponse) {
                    Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
                }
            })
        },

        onPressReq: function() {
            var oExport = $.extend(true, {}, this.TuitionSearchModel.getProperty("/ExportData"));

            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "LanguageApply"].join($.app.getDeviceSuffix()),
                data: { 
                    Export: oExport
                }
            });
        },

        onSelectedRow: function(oEvent) {
            var oExport = $.extend(true, {}, this.TuitionSearchModel.getProperty("/ExportData"));
            var vPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
            var oRowData = $.extend(true, {}, this.TableModel.getProperty(vPath));

            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "LanguageApply"].join($.app.getDeviceSuffix()),
                data: {
                    RowData: oRowData,
                    Export: oExport
                }
            });
        },

        getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20075008"}); // 20075008 35117216 20130126
		} : null
    });
});