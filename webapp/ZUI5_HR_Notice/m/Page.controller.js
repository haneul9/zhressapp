sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
    "../../common/AttachFileAction",
	"sap/base/util/UriParameters"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, UriParameters) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		alreadyDetailShown: false,

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
				}, this);
		},
		
		onBeforeShow: function() {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
            var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
			
			oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			this.onTableSearch();

			var Sdate = this.getParameterByName("Sdate"),
				Seqnr = this.getParameterByName("Seqnr");

			if (!this.alreadyDetailShown && Sdate && Seqnr) {
				var oList = {
					Sdate: Sdate,
					Seqnr: Seqnr
				};

				sap.ui.getCore().getEventBus().publish("nav", "to", {
					id: [$.app.CONTEXT_PATH, "Regist"].join($.app.getDeviceSuffix()),
					data: {
						RowData: oList
					}
				});

				this.alreadyDetailShown = true;
			}
        },

		getParameterByName: function(name) {
			return parent._gateway.isMobile() ? (UriParameters.fromQuery(document.location.search).get(name) || "") : (parent._gateway.parameter(name) || "");
		},
		
		onTableSearch: function() {
			var oController = $.app.getController();
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
					if (oData && oData.TableIn1) {
						Common.log(oData);
						var rDatas = oData.TableIn1.results;
						oController.TableModel.setData({Data: rDatas}); 
					}
                    
                    oController.TableModel.setProperty("/Notice", oData.Export.results[0].EIsubsc);
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
			var vPath = oEvent.mParameters.srcControl.getBindingContext().getPath();
			var oRowData = $.extend(true, {}, this.TableModel.getProperty(vPath));
            
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Regist"].join($.app.getDeviceSuffix()),
                data: {
                    RowData: oRowData
                }
            });
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20050069"}); 
		} : null
	});
});