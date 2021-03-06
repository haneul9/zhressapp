sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "../common/AttachFileAction",
	"sap/base/util/UriParameters"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, UriParameters) {
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
				}, this);
		},
		
		onBeforeShow: function() {
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function(oEvent) {
			var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
			
			oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			this.onTableSearch();

			if (this.getParameterByName("Sdate") && this.getParameterByName("Seqnr") && oEvent.data.New !== "X") {
				this.onSelectDetail(false);
			}
        },

		getParameterByName: function(name) {
			return parent._gateway.isMobile() ? (UriParameters.fromQuery(document.location.search).get(name) || "") : (parent._gateway.parameter(name) || "");
		},

		getTitle: function() {
			return new sap.m.HBox({
				fitContainer: true,
				items: [
					new sap.ui.core.HTML({
						content: {
							parts: [{path : "Title"}, {path: "Newitem"}, {path: "Impor"}],
							formatter: function(v1, v2, v3) {
								if(Common.checkNull(v1)){
									return "";
								}else{
									var oList = [
										'<span class="font14px">' + v1 + '</span>',
										v2 === 'X' ? '<span class="IconNPosition">N</span>' : '',
										v3 === 'X' ? '<i class="FontRed-Ml3px fas fa-exclamation-circle"></i>' : ''
									].join("");
									return oList;
								}
							}
						}
					})
				]
			});
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
			sendObject.IBegda = moment(oSearchDate.getDateValue()).hours(10).toDate();
			sendObject.IEndda = moment(oSearchDate.getSecondDateValue()).hours(10).toDate();
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

			Common.adjustAutoVisibleRowCount.call(oTable);
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
			var vPath = oEvent.getParameters().rowBindingContext.getPath();

			oController.onSelectDetail(true, vPath);
		},

		onSelectDetail: function(Gubun, Path){
			var oController = $.app.getController();
			var vSdate = Gubun ? oController.TableModel.getProperty(Path).Sdate : moment(oController.getParameterByName("Sdate")).hours(9).toDate();
			var vSeqnr = Gubun ? oController.TableModel.getProperty(Path).Seqnr : oController.getParameterByName("Seqnr");
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
                data: { 
                    vSdate: vSdate,
                    vSeqnr: vSeqnr
                }
            });
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20050069"}); 
		} : null											 
	});
});