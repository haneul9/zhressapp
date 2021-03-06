sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/AttachFileAction",
	"sap/base/util/UriParameters",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"./delegate/ViewTemplates"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, UriParameters, MessageBox, BusyIndicator, ViewTemplates) {
	"use strict";

	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		CodeModel: new JSONModelHelper(),
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
			// this.getCodeList();
			this.onTableSearch();

			if (this.getParameterByName("Sdate") && this.getParameterByName("Skey") && oEvent.data.New !== "X") {
				this.onSelectDetail(false);
			} else {
				if (localStorage && localStorage.getItem("ehr.suggestions.notice.confirmed") !== "Y") {
					this.onPressNotice();
				}
			}
		},

		getParameterByName: function(name) {
			return parent._gateway.isMobile() ? (UriParameters.fromQuery(document.location.search).get(name) || "") : (parent._gateway.parameter(name) || "");
		},

		setThumUp: function() {
			return new sap.m.HBox({
				justifyContent: sap.m.FlexJustifyContent.Center,
				width: "100%",
				fitContainer: true,
				items: [
					new sap.ui.core.Icon({
						src: "sap-icon://thumb-up"
					})
					.addStyleClass("icon-HiTokTok ok"),
					new sap.m.Text({
						width: "auto",
						text: "{Zgood}"
					}).addStyleClass("font-12px")
				]
			});
		},

		setThumDown: function() {
			return new sap.m.HBox({
				justifyContent: sap.m.FlexJustifyContent.Center,
				width: "100%",
				fitContainer: true,
				items: [
					new sap.ui.core.Icon({
						src: "sap-icon://thumb-down"
					})
					.addStyleClass("icon-HiTokTok no"),
					new sap.m.Text({
						width: "auto",
						text: "{Zbed}"
					}).addStyleClass("font-12px")
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
			sendObject.IApern = vPernr;
			sendObject.IBukrs = vBukrs;
			sendObject.IGubun = "E";
			sendObject.IConType = "0";
			// sendObject.ITgubun = oController.CodeModel.getProperty("/Data/ITgubun") === "Null" ? "" : oController.CodeModel.getProperty("/Data/ITgubun");
			sendObject.IBegda = moment(oSearchDate.getDateValue()).hours(10).toDate();
			sendObject.IEndda = moment(oSearchDate.getSecondDateValue()).hours(10).toDate();
			sendObject.ITitle = Common.checkNull(oSearchInput.getValue()) ? "" : oSearchInput.getValue();
			// Navigation property
			sendObject.TableIn1 = [];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					
					if (oData && oData.TableIn1) {
						Common.log(oData);
						var rDatas = oData.TableIn1.results.map(function(ele) {
							return $.extend(true, ele, {
								Znumb: Number(ele.Znumb),
								Zgood: Number(ele.Zgood),
								Zbed: Number(ele.Zbed),
								Zreply: Number(ele.Zreply),
								Zread: Number(ele.Zread)
							});
						});
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

		getCodeList: function() { // CodeList조회
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();

			oController.CodeModel.setData({Data: []});
			
			var sendObject = {};
			// Header
			sendObject.ICodeT = "002";
			sendObject.IBukrs = vBukrs;
			sendObject.ICode = "TLK_G";
			sendObject.ICodty = "EHR";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oModel.create("/CommonCodeListHeaderSet", sendObject, {
				success: function(oData, oResponse) {
					
					if (oData && oData.NavCommonCodeList) {
						Common.log(oData);
						var rDatas = oData.NavCommonCodeList.results;

						rDatas.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_09036") });

						oController.CodeModel.setProperty("/GubunCombo", rDatas);
						oController.CodeModel.setProperty("/Data/ITgubun", "Null");					}
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

		onPressNotice: function() {

			if (!this.oNoticeDialog) {
				this.oNoticeDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Notice"].join(".fragment."), this);
				$.app.getView().addDependent(this.oNoticeDialog);
			}

			this.oNoticeDialog.open();
		},

		onPressRegi: function() { // 등록
			var oController = this;

			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
                data: { 
					// GubunCombo: oController.CodeModel.getProperty("/GubunCombo"),
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
			vSeqnr = vSeqnr.slice(-5);
			
			sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix()),
                data: { 
					// GubunCombo: oController.CodeModel.getProperty("/GubunCombo"),
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