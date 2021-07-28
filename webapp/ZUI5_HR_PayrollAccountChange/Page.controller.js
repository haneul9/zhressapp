sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"common/OrgOfIndividualHandler",
    "common/DialogHandler",
	"common/SearchOrg",
	"common/SearchUser1",
    "sap/m/MessageBox",
	"sap/ui/export/Spreadsheet"
	], 
	function (Common, CommonController, JSONModelHelper, OrgOfIndividualHandler, DialogHandler, SearchOrg, SearchUser1, MessageBox, Spreadsheet) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		SearchModel : new JSONModelHelper(),
		TableModel: new JSONModelHelper(),
		
		_Columns: [],
		
		getUserId: function() {

			return this.SearchModel.getProperty("/User/Pernr") ? this.SearchModel.getProperty("/User/Pernr") : this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.SearchModel.getProperty("/User/Bukrs3") ? this.SearchModel.getProperty("/User/Bukrs3") : this.getSessionInfoByKey("Bukrs3");
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
			this.SearchModel.setData({ User: {}});
			this.onSetInfo(this.getSessionInfoByKey("Pernr"));
			this.setZyears();
			this.onTableSearch();
        },

		getPayDate: function() {
			return  new sap.ui.commons.TextView({
                text : {
                    path: "PayDate",
                    formatter: function(v) {
						return v === "0000000" ? null : v;
					}
                }, 
                textAlign : "Center"
            });
		},

		onPressSer: function() {
			var vGubun = "";
			if(this.SearchModel.getProperty("/User/Pernr") !== this.getSessionInfoByKey("name")){
				vGubun = this.SearchModel.getProperty("/User/Ename");
			}
			this.onTableSearch(vGubun);
		},
		
		onTableSearch: function(Objid) {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();

			oController.TableModel.setData({Data: []}); 
			
			var sendObject = {};
			// 조직으로 검색했을경우
			if(!Common.checkNull(Objid)) sendObject.IOrgeh = Objid;
			// Header
			sendObject.IPernr = Common.checkNull(Objid) ? vPernr : "";
			sendObject.IEmpid = oController.getSessionInfoByKey("name");
			sendObject.IBukrs = vBukrs;
			sendObject.IYear = oController.SearchModel.getProperty("/User/Zyear");
            sendObject.IConType = "1";
			// Navigation property
			sendObject.RoomChargeNav1 = [];
			
			oModel.create("/RoomChargeApplySet", sendObject, {
				success: function(oData) {
					if (oData && oData.RoomChargeNav1) {
						Common.log(oData);
						var rDatas = oData.RoomChargeNav1.results;
						oController.TableModel.setData({Data: rDatas}); 
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});

			Common.adjustAutoVisibleRowCount.call(oTable);
        },
		
		setZyears: function() {
            var oController = $.app.getController();
			var vZyear = new Date().getFullYear(),
                vConvertYear = "",
                aYears = [];

            Common.makeNumbersArray({length: 11}).forEach(function(idx) {
                vConvertYear = String(vZyear - idx);
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
			});

			oController.SearchModel.setProperty("/Zyears", aYears);
			oController.SearchModel.setProperty("/User/Zyear", String(vZyear));
		},

		onPressReq: function() { //신청
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
            });
		},
		
		onSelectedRow: function(oEvent) {
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(vPath);
			var oCopiedRow = $.extend(true, {}, oRowData);
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
				data: {
					RowData: oCopiedRow
				}
            });
		},

		searchOrgehPernr : function(oController){
			var oView = $.app.byId("ZUI5_HR_LodgingAmountSupport.Page");
			var oController = oView.getController();
			
			var initData = {
                Percod: $.app.getModel("session").getData().Percod,
                Bukrs: $.app.getModel("session").getData().Bukrs2,
                Langu: $.app.getModel("session").getData().Langu,
                Molga: $.app.getModel("session").getData().Molga,
                Datum: new Date(),
                Mssty: "",
            },
            callback = function(o) {
				if(o.Otype == "P"){
					oController.SearchModel.setProperty("/User/Pernr", o.Objid);
					oController.SearchModel.setProperty("/User/Ename", o.Stext.split("(")[0]);
					oController.onTableSearch();
                } else if(o.Otype == "O"){
					oController.SearchModel.setProperty("/User/Pernr", oController.getSessionInfoByKey("name"));
					oController.SearchModel.setProperty("/User/Ename", o.Stext);
					oController.onTableSearch(o.Objid);
                }
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},

		onSetInfo : function(Pernr){
			if(!Pernr) return;
			var oView = $.app.byId("ZUI5_HR_LodgingAmountSupport.Page");
			var oController = oView.getController();
		
			var oPhoto = "";
			new JSONModelHelper().url("/odata/v2/Photo?$filter=userId eq '" + Pernr + "' and photoType eq '1'")
				 .select("photo")
				 .setAsync(false)
				 .attachRequestCompleted(function(){
						var data = this.getData().d;
						
						if(data && data.results.length){
							oPhoto = "data:text/plain;base64," + data.results[0].photo;
						} else {
							oPhoto = "images/male.jpg";
						}
				 })
				 .attachRequestFailed(function() {
						oPhoto = "images/male.jpg";
				 })
				 .load();
				 
			var vData = {};
				vData.photo = oPhoto;

			var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
			var createData = {TableIn : []};
				createData.IPernr = Pernr;
				createData.ILangu = $.app.getModel("session").getData().Langu;
				
			oModel.create("/HeaderSet", createData, {
				success: function(data){
					if(data){
						if(data.TableIn && data.TableIn.results){
							var data1 = data.TableIn.results[0];
							
							if(data1){
								Object.assign(vData, data1);
							}
						}
					}
				},
				error: function (oResponse) {
			    	Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
			
			oController.SearchModel.setProperty("/User", vData);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
        
        /**
         * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
         */
        displayMultiOrgSearchDialog: function (oEvent) {
            SearchOrg.oController = this.oController;
            SearchOrg.vActionType = "Multi";
            SearchOrg.vCallControlId = oEvent.getSource().getId();
            SearchOrg.vCallControlType = "MultiInput";

            if (!this.oOrgSearchDialog) {
                this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this.oController);
                $.app.getView().addDependent(this.oOrgSearchDialog);
            }

            this.oOrgSearchDialog.open();
        },

		onESSelectPerson : function(data){
			var oView = $.app.byId("ZUI5_HR_LodgingAmountSupport.Page");
			var oController = oView.getController();

			// oController.onSetInfo(data.Pernr);
			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},

        onPressExcelDownload : function(){ // Excel 다운로드
			var oController = this;
			
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
			var oJSONModel = oTable.getModel();

            if (!oJSONModel.getProperty("/Data")) {
                MessageBox.warning(oController.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
                return;
            }
			
			var oSettings = {
				workbook: { columns: oController._Columns },
				dataSource: oJSONModel.getProperty("/Data"),
				worker: false, // We need to disable worker because we are using a MockServer as OData Service
			    fileName: oController.getBundleText("LABEL_74042") + ".xlsx" // 숙박비지원신청현황
			};
	
			var oSpreadsheet = new Spreadsheet(oSettings);
				oSpreadsheet.build();		
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20090028"});
		} : null
	});
});