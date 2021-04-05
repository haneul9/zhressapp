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
		ChildrenModel: new JSONModelHelper(),

        g_ClickRow: "",

		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.getSessionInfoByKey("Bukrs");
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
            var vBukrs = this.getUserGubun();
            this.LogModel.setData({Bukrs: vBukrs});

			this.onTableSearch();
			this.onChildrenData(this);
        },

		onChildrenData: function(oController) {
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			
            oController.ChildrenModel.setData({Data: []});

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "0";
			// Navigation property
			sendObject.EducationFundApplyTableIn0 = [];
			
			oModel.create("/EducationfundApplySet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.EducationFundApplyTableIn0) {
						Common.log(oData);
						var rDatas = oData.EducationFundApplyTableIn0.results;
						oController.ChildrenModel.setData({Data: rDatas}); 
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
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			
            oController.TableModel.setData({Data: []});

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.EducationfundApplyTableIn = [];
			
			oModel.create("/EducationfundApplySet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.EducationfundApplyTableIn) {
						Common.log(oData);
						var rDatas = oData.EducationfundApplyTableIn.results;
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
            var oChild = $.extend(true, [], this.ChildrenModel.getProperty("/Data"));
            var oTarget = $.extend(true, {}, this.LogModel.getProperty("/Target"));
            var vBukrs = this.getUserGubun();
            var oDialogPath = "",
                oTargetChild = "";
            
            if(vBukrs !== "A100"){
                oDialogPath = "BaseApply";
                oTargetChild = oChild;
			}else {
                if(Common.checkNull(this.LogModel.getProperty("/Target/NameKor")) || this.g_ClickRow === "N")
                return sap.m.MessageBox.alert(this.getBundleText("MSG_38018"), { title: this.getBundleText("MSG_08107")});
                else{
                    oDialogPath = "HighApply";
                    oTargetChild = oTarget;
                }
            }

            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, oDialogPath].join($.app.getDeviceSuffix()),
                data: { 
                    Child: oTargetChild
                }
            });
		},

        onHighSelectedRow: function(oEvent) { // 첨단 학자금 대상자 클릭
			var vPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
			var oRowData = this.ChildrenModel.getProperty(vPath);

			this.g_ClickRow = "Y";
			this.LogModel.setProperty("/Target", []);
			this.LogModel.setProperty("/Target/SchcoT", this.getBundleText("LABEL_38051"));
			this.LogModel.setProperty("/Target/Schco", "KR");
            this.LogModel.setProperty("/Target/Reccn", "1");
			this.LogModel.setProperty("/Target/Relation", oRowData.Relation);
			this.LogModel.setProperty("/Target/NameKor", oRowData.Fname);
			this.LogModel.setProperty("/Target/RelationTx", oRowData.KdsvhT);
		},
		
		onSelectedRow: function(oEvent) {
            var oChild = $.extend(true, [], this.ChildrenModel.getProperty("/Data"));
			var vPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
			var oRowData = $.extend(true, {}, this.TableModel.getProperty(vPath));
            var vBukrs = oRowData.Bukrs;
            var oDialogPath = "";
            
            if(vBukrs !== "A100") oDialogPath = "BaseApply";
            else {
                this.LogModel.setProperty("/Target", []);
                oDialogPath = "HighApply";
                this.g_ClickRow = "N";
            }
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, oDialogPath].join($.app.getDeviceSuffix()),
                data: {
                    RowData: oRowData,
                    Child: oChild
                }
            });
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35111238"}); // 20190018 20063005 (기초) 35111238 35114489 35111012(첨단)
		} : null
	});
});