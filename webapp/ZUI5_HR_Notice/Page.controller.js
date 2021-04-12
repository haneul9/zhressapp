sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "../common/AttachFileAction"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		RegistModel: new JSONModelHelper(),

		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

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
		
		onAfterShow: function(oEvent) {
			var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
			
			oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			this.onTableSearch();
        },

        getChangeDate: function() {
			return new sap.ui.commons.TextView({
                text : {
                    parts: [{path: "Aedtm"}, {path: "Aetim"}],
                    formatter: function(v1, v2) {
						if(v1 && v2){
							v1 = Common.DateFormatter(v1);
							v2 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm:ss" }).format(new Date(v2.ms), true);
						}
						return v1 + " " + v2; 
                    }
                }, 
                textAlign : "Center"
            })
        },
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
            var oSearchInput = $.app.byId(oController.PAGEID + "_SearchInput");
            var oSearchDate = $.app.byId(oController.PAGEID + "_SearchDate");
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();

            oController.TableModel.setData({Data: []}); 
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "0";
			sendObject.IBegda = Common.adjustGMTOdataFormat(oSearchDate.getDateValue());
			sendObject.IEndda = oSearchDate.getSecondDateValue();
            sendObject.ITitle = Common.checkNull(oSearchInput.getValue()) ? "" : oSearchInput.getValue();
			// Navigation property
			sendObject.Export = [];
			sendObject.TableIn1 = [];
			
			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
					var dataLength = 10;
					if (oData && oData.TableIn1) {
						Common.log(oData);
						var rDatas = oData.TableIn1.results;
						dataLength = rDatas.length;
						oController.TableModel.setData({Data: rDatas}); 
					}
                    
                    oController.TableModel.setProperty("/Notice", oData.Export.results[0].EIsubsc);

					oTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
        },

        onPressSer: function() { // 조회
            this.onTableSearch();
        },

        onScript: function() { // 구독버튼
            var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = this.getUserId();
			var vBukrs = this.getUserGubun();

            var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "4";
			sendObject.IIsubsc = "X";
			
			sendObject.Export = [];

			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
                    Common.log(oData);
					oController.TableModel.setProperty("/Notice", "X");
					sap.m.MessageBox.alert(oController.getBundleText("MSG_57007"), { title: oController.getBundleText("MSG_08107")});
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
        },

        onScriptCancel: function() { // 구독취소 버튼
            var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = this.getUserId();
			var vBukrs = this.getUserGubun();

            var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "4";
			sendObject.IIsubsc = "";
			
			sendObject.Export = [];

			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
                        oController.TableModel.setProperty("/Notice", "");
						sap.m.MessageBox.alert(oController.getBundleText("MSG_57008"), { title: oController.getBundleText("MSG_08107")});
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
        },
		
		onSelectedRow: function(oEvent) {
            var oController = $.app.getController();
			var oView = $.app.byId("ZUI5_HR_Notice.Page");
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var vSdate = oController.TableModel.getProperty(vPath).Sdate;
			var vSeqnr = oController.TableModel.getProperty(vPath).Seqnr;
			
			if (!oController._RegistModel) {
				oController._RegistModel = sap.ui.jsfragment("ZUI5_HR_Notice.fragment.Regist", oController);
				oView.addDependent(oController._RegistModel);
			};
			
			oController.getDetailData(vSdate, vSeqnr);
            oController.onBeforeOpenDetailDialog();
			oController._RegistModel.open();
		},

		getDetailData: function(Sdate, Seqnr) { // 상세정보
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
            var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.ISdate = Sdate;
			sendObject.ISeqnr = Seqnr;
            sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.TableIn2 = [];
			
			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn2) {
						Common.log(oData);
						var oCopiedRow = $.extend(true, {}, oData.TableIn2.results[0]);
						oController.RegistModel.setData({FormData: oCopiedRow});
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

        onBeforeOpenDetailDialog: function() {
			var oController = $.app.getController();
			var	vSdate = oController.RegistModel.getProperty("/FormData/Sdate"),
				vAppnm = oController.RegistModel.getProperty("/FormData/Appnm") || "";

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "5",
				Editable: !vSdate ? true : false,
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20050069"}); 
		} : null											 
	});
});