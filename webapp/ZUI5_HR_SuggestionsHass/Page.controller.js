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
		
		onAfterShow: function() {
			var oSearchDate = sap.ui.getCore().byId(this.PAGEID + "_SearchDate");
			
			oSearchDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			this.onTableSearch();

			if(Common.checkNull(!this.getParameterByName("Sdate")) && Common.checkNull(!this.getParameterByName("Skey")))
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
            })
        },

        getHide: function() {
			return new sap.m.CheckBox({ 
                editable: false,
                selected: {
                    path: "Hide",
                    formatter: function(v) {
                        return v === "X";
                    }
                }
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
			sendObject.IApern = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IGubun = "H";
            sendObject.IConType = "0";
			sendObject.IBegda = Common.adjustGMTOdataFormat(oSearchDate.getDateValue());
			sendObject.IEndda = oSearchDate.getSecondDateValue();
            sendObject.ITitle = Common.checkNull(oSearchInput.getValue()) ? "" : oSearchInput.getValue();
			// Navigation property
			sendObject.TableIn1 = [];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					var dataLength = 10;
					
					if (oData && oData.TableIn1) {
						Common.log(oData);
						var rDatas = oData.TableIn1.results;
						dataLength = rDatas.length;
						oController.TableModel.setData({Data: rDatas}); 
					}

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
		
		onSelectedRow: function(oEvent) {
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			
			oController.onSelectDetail(true, vPath);
		},

		onSelectDetail: function(Gubun, Path){
			var oController = $.app.getController();
			var oView = $.app.byId("ZUI5_HR_Suggestions.Page");
			var vSdate = Gubun ? oController.TableModel.getProperty(Path).Sdate : oController.getParameterByName("Sdate");
			var vSeqnr = Gubun ? oController.TableModel.getProperty(Path).Seqnr : oController.getParameterByName("Skey");
			vSeqnr = vSeqnr.slice(-5);
			
			if (!oController._RegistModel) {
				oController._RegistModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.fragment.Regist", oController);
				oView.addDependent(oController._RegistModel);
			}

			var oDateBox = $.app.byId(oController.PAGEID + "_RegistDateBox");
			var oIsHideBox = $.app.byId(oController.PAGEID + "_IsHideBox");
			oDateBox.setVisible(true);
			oIsHideBox.setVisible(false);
			
			oController.CommentModel.setData({Data: {}});
			oController.getDetailData(vSdate, vSeqnr);
            oController.onBeforeOpenDetailDialog();
			oController._RegistModel.open();
		},

		getDetailData: function(Sdate, Seqnr) { // 상세정보
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			
			var sendObject = {};
			// Header
			sendObject.ISdate = Sdate;
			sendObject.ISeqnr = Seqnr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.TableIn2 = [];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
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
			var	vAppnm = oController.RegistModel.getProperty("/FormData/Appnm") || "";

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "5",
				Editable: false,
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20050069"}); 
		} : null											 
	});
});