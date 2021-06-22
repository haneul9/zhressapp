sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "../common/AttachFileAction",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, BusyIndicator) {
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

		getUserDetail: function(info) {

			return this.getSessionInfoByKey(info);
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
		
		onAfterShow: function(oEvent) {
			var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
			
			oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			this.onTableSearch();

			if(Common.checkNull(!this.getParameterByName("Sdate")) && Common.checkNull(!this.getParameterByName("Seqnr")) && oEvent.data.New !== "X")
				this.onSelectDetail(false);
        },

		getParameterByName: function(name) {
			var regex = parent._gateway.parameter(name);
			
			return Common.checkNull(regex)? "" : regex;
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
            });
        },
		
        getImport: function() {
			return new sap.m.CheckBox({ 
                editable: false,
                selected: {
                    path: "Impor",
                    formatter: function(v) {
                        return v === "X";
                    }
                }
            });
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
            sendObject.IHass = "X";
			sendObject.IBegda = moment(oSearchDate.getDateValue()).hours(10).toDate();
			sendObject.IEndda = moment(oSearchDate.getSecondDateValue()).hours(10).toDate();
            sendObject.ITitle = Common.checkNull(oSearchInput.getValue()) ? "" : oSearchInput.getValue();
			// Navigation property
			sendObject.TableIn1 = [];
			
			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
					
					if (oData && oData.TableIn1) {
						Common.log(oData);
						var rDatas = oData.TableIn1.results;
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

			Common.adjustAutoVisibleRowCount.call(oTable);
        },

        onPressSer: function() { // 조회
            this.onTableSearch();
        },

		onPressRegi: function() { // 등록
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
                data: { 
                    New: "O"
                }
            });				
		},
		
		onSelectedRow: function(oEvent) {
            var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();

			oController.onSelectDetail(true, vPath);
		},

		onSelectDetail: function(Gubun, Path){
			var oController = $.app.getController();
			var vSdate = Gubun ? oController.TableModel.getProperty(Path).Sdate : moment(oController.getParameterByName("Sdate")).hours(9).toDate();
			var vSeqnr = Gubun ? oController.TableModel.getProperty(Path).Seqnr : oController.getParameterByName("Skey");
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
                data: { 
                    vSdate: vSdate,
                    vSeqnr: vSeqnr,
					New: "X"
                }
            });
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20050069"}); 
		} : null											 
	});
});