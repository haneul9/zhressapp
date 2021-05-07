sap.ui.define(
	[
		"../../common/Common",
		"../../common/CommonController",
		"../../common/JSONModelHelper",
        "sap/ui/core/BusyIndicator"
	],
	function (Common, CommonController, JSONModelHelper, BusyIndicator) {
		"use strict";

		var SUB_APP_ID = [$.app.CONTEXT_PATH, "TuitionSearch"].join($.app.getDeviceSuffix());
		
		return CommonController.extend(SUB_APP_ID, {
            
			PAGEID: "TuitionSearch",

			TableModel: new JSONModelHelper(),
			GradeModel: new JSONModelHelper(),

			getUserId: function() {
				
				return $.app.getController().getUserId();
			},
			
			getUserGubun: function() {
				
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
                BusyIndicator.show(0);
				Common.log("onBeforeShow");
			},

			onAfterShow: function () {
                this.onTableSearch(this);
                BusyIndicator.hide();
			},
			
			navBack: function() {
                var oController = $.app.getView("ZUI5_HR_LanguageTuitionApplication.m.TuitionSearch").getController();
                var oTableData = oController.TableModel.getProperty("/FormData");
                
				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "LanguageApply"].join($.app.getDeviceSuffix()),
                    data: {
                        oTableData: oTableData ? oTableData : "",
                        vGubun: "Y"
                    }
				});
			},

            onTableSearch: function(oController) {
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                // Navigation property
                sendObject.LanguScoreTableIn = [];
                
                oModel.create("/LanguScoreImportSet", sendObject, {
                    success: function(oData, oResponse) {
                        if(oData && oData.LanguScoreTableIn){
                            oController.GradeModel.setProperty("/TableData", oData.LanguScoreTableIn.results);
                            oController.onDialogCode(oController);
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

            onDialogSear: function() {
                var oController = this;
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = this.getUserId();
                var vBukrs2 = this.getUserGubun();
                var vZlangu = this.GradeModel.getProperty("/Data/Zlangu");
                var vZltype = this.GradeModel.getProperty("/Data/Zltype");
                var vITepas = this.GradeModel.getProperty("/Data/ITepas");

                this.GradeModel.setProperty("/TableData", []);

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IBukrs = vBukrs2;
                sendObject.IZlangu = (vZlangu === "ALL") ? "" : vZlangu;
                sendObject.IZltype = (vZltype === "ALL") ? "" : vZltype;
                sendObject.ITepas = (vITepas === "ALL") ? "" : vITepas;
                // Navigation property
                sendObject.LanguScoreTableIn = [];
                
                oModel.create("/LanguScoreImportSet", sendObject, {
                    success: function(oData, oResponse) {
                        Common.log(oData);
                        if(oData && oData.LanguScoreTableIn){
                            oController.GradeModel.setProperty("/TableData", oData.LanguScoreTableIn.results); 
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

            onDialogGubun: function(oEvent) { // Dialog 어학구분
                var oController = this;
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = this.getUserId();
                
                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.ICodeT = "2";
                sendObject.ICode = this.GradeModel.getProperty("/Data/Zlangu");
                // Navigation property
                sendObject.LanguPayApplyF4TableIn = [];
                
                oModel.create("/LanguPayApplyF4ImportSet", sendObject, {
                    success: function(oData, oResponse) {
                        if(oData && oData.LanguPayApplyF4TableIn){
                            oController.GradeModel.setProperty("/TestCombo", oData.LanguPayApplyF4TableIn.results);
                            oController.GradeModel.getProperty("/TestCombo").unshift({Code: "ALL", Text: oController.getBundleText("LABEL_29043")});
                            oController.GradeModel.setProperty("/TestCombo", oController.GradeModel.getProperty("/TestCombo"));
                            oController.GradeModel.setProperty("/Data/Zltype","ALL");
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

            onDialogCode: function(oController) {
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = oController.getUserId();
                var vBukrs2 = oController.getUserGubun();
                var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
    
                oController.GradeModel.setProperty("/TestCombo", []);
                oController.GradeModel.setProperty("/Data", { Zlangu: null, Zltype: null, ITepas: null });
    
                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.ICodeT = "004";
                sendObject.IBukrs = vBukrs2;
                sendObject.ICodty = "ZHRD_TEPAS";
                sendObject.ILangu =  "3";
                // Navigation property
                sendObject.NavCommonCodeList = [];
                
                oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 이수여부
                    success: function(oData, oResponse) {
                        if(oData && oData.NavCommonCodeList){
                            oData.NavCommonCodeList.results.unshift({Code: "ALL", Text: oController.getBundleText("LABEL_29043")});
                            oController.GradeModel.setProperty("/CompleteCombo", oData.NavCommonCodeList.results);
                        }
                    },
                    error: function(oResponse) {
                        Common.log(oResponse);
                        sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                            title: oController.getBundleText("LABEL_09030")
                        });
                    }
                });
                
                sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.ICodeT = "1";
                // Navigation property
                sendObject.LanguPayApplyF4TableIn = [];
                
                oModel.create("/LanguPayApplyF4ImportSet", sendObject, { // 어학구분
                    success: function(oData, oResponse) {
                        if(oData && oData.LanguPayApplyF4TableIn){
                            oData.LanguPayApplyF4TableIn.results.unshift({Code: "ALL", Text: oController.getBundleText("LABEL_29043")});
                            oController.GradeModel.setProperty("/LanguCombo", oData.LanguPayApplyF4TableIn.results);
                            oController.GradeModel.setProperty("/TestCombo", [{Code: "ALL", Text: oController.getBundleText("LABEL_29043")}]);
                            
                            oController.GradeModel.setProperty("/Data/Zlangu", "ALL");
                            oController.GradeModel.setProperty("/Data/Zltype", "ALL");
                            oController.GradeModel.setProperty("/Data/ITepas", "ALL");
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

            onSelectedGradeRow: function(oEvent) {
                var oController = this;
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var vPernr = this.getUserId();
                var vBukrs2 = this.getUserGubun();
                var oPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
    
                if(this.GradeModel.getProperty(oPath).Targetc === "N") return;
    
                oController.TableModel.setData({FormData: []});

                var sendObject = {};
                // Header
                sendObject.IPernr = vPernr;
                sendObject.IEmpid = vPernr;
                sendObject.IConType = "7";
                sendObject.IBukrs = vBukrs2;
                // Navigation property
                sendObject.LanguPayApplyTableIn = [];
                sendObject.LanguPayApplyTableIn4 = [Common.copyByMetadata(oModel, "LanguPayApplyTableIn4", oController.GradeModel.getProperty(oPath))];
                
                oModel.create("/LanguPayApplySet", sendObject, {
                    success: function(oData, oResponse) {
                        if (oData && oData.LanguPayApplyTableIn) { //값을 제대로 받아 왔을 때
                            Common.log(oData);
                            oController.TableModel.setData({FormData: oData.LanguPayApplyTableIn.results[0]});
                            oController.TableModel.setProperty("/FormData/AcqgrdT", oData.LanguPayApplyTableIn4.results[0].AcqgrdTxt ? oData.LanguPayApplyTableIn4.results[0].AcqgrdTxt : "");
                            oController.navBack();
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
			
			getLocalSessionModel: Common.isLOCAL() ? function() {
				return new JSONModelHelper({name: $.app.getController().getUserId()}); // 20075008 35117216 20130126
			} : null
			 
		});
	}
);
