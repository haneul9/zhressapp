/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"../common/OrgOfIndividualHandler",
	"../common/SearchUser1",
	"fragment/COMMON_ATTACH_FILES"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, OrgOfIndividualHandler, SearchUser1, FileHandler) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "OutCompEdu",
		
		TableModel: new JSONModelHelper(),
		ApplyModel: new JSONModelHelper(),
		SearchModel: new JSONModelHelper(),
		AttModel: new JSONModelHelper(),
		TraningModel: new JSONModelHelper(),
		g_IsNew: "",
		
		getUserId: function() {

			return this.getSessionInfoByKey("name");
		},
		
		getUserGubun  : function() {

			return this.getSessionInfoByKey("Bukrs3");
		},

		getUserGubun2  : function() {

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
            this.ApplyModel.setData({FormData: []});
            this.initDateCreate(this);
			this.getComboData();
			this.onTableSearch();
		},

		getCheckBox: function() {
			return new sap.m.CheckBox({ 
                visible: {
					parts : [{path: "Status1"},{path: "Edoty"}, {path: "RepstT"}],
					formatter: function(v1, v2, v3) {
						return (Common.checkNull(v3) && v1 === "99" && v2 === "1") || v1 === "AA";
					}
				},
                selected: "{Pchk}"
            });
		},

		getDCheckBox: function() {
			return new sap.m.CheckBox({
                visible: {
					path: "/Status",
					formatter: function(v) {
						return !v || v === "AA";
					}
				},
                selected: "{Pchk}"
            });
		},
		
		getDateFormatter1: function() {
			return new sap.ui.commons.TextView({
				text: {
					parts: [{ path: "Begdhb" }, { path: "Enddhe" }],
					formatter: function (v1, v2) {
						if (!v1 || !v2) {
							return "";
						}

						return Common.DateFormatter(v1) + " ~ " + Common.DateFormatter(v2);
					}
				},
				textAlign: "Center"
			});
		},

		getUrl: function() {
			var oController = $.app.getController();
			
			return 	new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.ui.commons.TextView({
							text : {
								path: "Status1",
								formatter: function(v) {
									var vText = "";
									switch(v){
										// ?????????
										case "00" : vText = oController.getBundleText("LABEL_40070"); break;
										// ?????????
										case "AA" : vText = oController.getBundleText("LABEL_40071"); break;
										// ????????????
										case "99" : vText = oController.getBundleText("LABEL_40069"); break;
										// ??????
										case "88" : vText = oController.getBundleText("LABEL_66004"); break;
										// 1???????????????
										case "01" : vText = oController.getBundleText("LABEL_40076"); break;
										// 2???????????????
										case "02" : vText = oController.getBundleText("LABEL_40077"); break;
										// 3???????????????
										case "03" : vText = oController.getBundleText("LABEL_40078"); break;
										// 4???????????????
										case "04" : vText = oController.getBundleText("LABEL_40079"); break;
										// ??????????????????
										case "10" : vText = oController.getBundleText("LABEL_40080"); break;
										// ???????????????
										case "90" : vText = oController.getBundleText("LABEL_40081"); break;
									}
									return vText;
								} 
							}, 
							textAlign : "Center",
							visible: {
								path: "UrlA1",
								formatter: function(v) {
									if(!v) return true;
									else return false;
								}
							}
						})
						.addStyleClass("font-14px font-regular mt-4px "),
						new sap.m.FormattedText({
							htmlText: {
								parts: [{ path: "UrlA1" }, { path: "Status1" }],
								formatter: function(v1, v2) {
									if(v2 === "99") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40069") + "</a>";
									if(v2 === "00") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40070") + "</a>";
									if(v2 === "88") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_66004") + "</a>";
									if(v2 === "01") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40076") + "</a>";
									if(v2 === "02") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40077") + "</a>";
									if(v2 === "03") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40078") + "</a>";
									if(v2 === "04") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40079") + "</a>";
									if(v2 === "10") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40080") + "</a>";
									if(v2 === "90") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40081") + "</a>";
								}
							}, 
							visible: {
								path: "UrlA1",
								formatter: function(v) {
									if(v) return true;
									else return false;
								}
							}
						})
					]
				});
		},
        
        initDateCreate: function(oController) { // ?????? ?????? ?????? ???????????????
            var vBukrs = oController.getUserGubun();
            
            oController.SearchModel.setData({
                        Data: { Zyear: "", Zmonth: "" },
                        Zyears: [],
                        Zmonths: [],
                        vBukrs: vBukrs
            });
            
            this.setZyears(this);
            this.setZmonths(this);
        },
        
        setZyears: function(oController) {
            var vZyear = new Date().getFullYear(),
                vConvertYear = "",
                aYears = [];

            Common.makeNumbersArray({length: 11}).forEach(function(idx) {
                vConvertYear = String(vZyear - idx);
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "???" });
			});

			oController.SearchModel.setProperty("/Data/Zyear1", vZyear);
			oController.SearchModel.setProperty("/Zyears1", aYears);
        },

        setZmonths: function(oController) {
            var vConvertMonth = "",
                aMonths = [];

			aMonths.push({ Code: "ALL", Text: oController.getBundleText("LABEL_40059") });

            Common.makeNumbersArray({length: 12, isZeroStart: false}).forEach(function(idx) {
                vConvertMonth = String(idx);
                aMonths.push({ Code: vConvertMonth, Text: vConvertMonth + "???" });
            });

            oController.SearchModel.setProperty("/Data/Zmonth1", "ALL");
			oController.SearchModel.setProperty("/Zmonths1", aMonths);
        },

		getAttTime: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d || ^\.]/g, '');

			this.ApplyModel.setProperty("/FormData/Trtim", Common.checkNull(convertValue) ? "" : convertValue);
			oEvent.getSource().setValue(Common.checkNull(convertValue) ? "" : convertValue);	
		},

		getMoneyComma1: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/Costp", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));	
		},

		getMoneyComma2: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			this.ApplyModel.setProperty("/FormData/Vatax", Common.checkNull(convertValue) ? "0" : convertValue);
			oEvent.getSource().setValue(Common.numberWithCommas(Common.checkNull(convertValue) ? "0" : convertValue));	
		},
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vZyear1 = Common.checkNull(oController.SearchModel.getProperty("/Data/Zyear1")) || oController.SearchModel.getProperty("/Data/Zyear1") === "ALL" ? "" : oController.SearchModel.getProperty("/Data/Zyear1");
			var vMonth1 = Common.checkNull(oController.SearchModel.getProperty("/Data/Zmonth1")) || oController.SearchModel.getProperty("/Data/Zmonth1") === "ALL" ? "" : oController.SearchModel.getProperty("/Data/Zmonth1");
			var vMonth2 = Common.checkNull(oController.SearchModel.getProperty("/Data/Zmonth1")) || oController.SearchModel.getProperty("/Data/Zmonth1") === "ALL" ? "" : oController.SearchModel.getProperty("/Data/Zmonth1");
			var vGubun = oController.SearchModel.getProperty("/Data/Gubun");
			var vStatus = oController.SearchModel.getProperty("/Data/Status");
			var vIsReport = oController.SearchModel.getProperty("/Data/IsReport");

			
			if(oController.SearchModel.getProperty("/Data/Zyear1") === "ALL" && oController.SearchModel.getProperty("/Data/Zmonth1") !== "ALL"){
				MessageBox.error(oController.getBundleText("MSG_40042"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}
			
			if(oController.SearchModel.getProperty("/Data/Zyear1") !== "ALL" && oController.SearchModel.getProperty("/Data/Zmonth1") === "ALL"){
				vMonth1 = "1";
				vMonth2 = "12";
			}
			
			oController.TableModel.setData({Data: []}); //??????????????? ?????? ???????????? ???????????? ??????
			
			var vBDate = new Date(vZyear1, vMonth1 - 1, 1);
			var vEDate = new Date(vZyear1, vMonth2, 0);

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IBukrs = vBukrs2;
			sendObject.IConType = "1";
			sendObject.IBegda = Common.checkNull(vZyear1) || Common.checkNull(vMonth1) ? undefined : moment(vBDate).hours(10).toDate();
			sendObject.IEndda = Common.checkNull(vZyear1) || Common.checkNull(vMonth1) ? undefined : moment(vEDate).hours(10).toDate();
			sendObject.IEdoty = vGubun === "ALL" ? "" : vGubun;
			sendObject.IRepst = vStatus === "ALL" ? "" : vStatus;
			sendObject.IEdsta = vIsReport === "ALL" ? "" : vIsReport;
			// Navigation property
			sendObject.TrainingOutApplyExport = [];
			sendObject.TrainingOutApplyTableIn1 = [];
			sendObject.TrainingOutApplyTableIn3 = [];
			
			oModel.create("/TrainingOutApplySet", sendObject, {
				// eslint-disable-next-line no-unused-vars
				success: function(oData, oResponse) {
					
					if (oData && oData.TrainingOutApplyTableIn1) { //?????? ????????? ?????? ?????? ???
						Common.log(oData);
						var rDatas1 = oData.TrainingOutApplyTableIn1.results;
						oController.TableModel.setData({Data: rDatas1}); //??????????????? ?????? ???????????? ???????????? ??????
					}

					oController.SearchModel.setProperty("/ExportData", oData.TrainingOutApplyExport.results[0]);
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
		
		onSelectedRow: function(oEvent) { // Row??????
			var oView = $.app.byId("ZUI5_HR_OutCompEdu.OutCompEdu"),
				oController = $.app.getController();
			var oPath = oEvent.mParameters.rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(oPath);
			
			var oCopyRow = $.extend(true, {}, oRowData);

			oController.g_IsNew = "D";

			if(oEvent.mParameters.columnIndex === "8" && Common.checkNull(!oRowData.UrlA1)) return;

			oController.ApplyModel.setProperty("/FormData", oCopyRow);
			oController.AttModel.setData({Data: []});
			
			if (!oController._ApplyModel) {
				oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ReportApp", oController);
				oView.addDependent(oController._ApplyModel);
			}

			if (!oController._ReportModel) {
				oController._ReportModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ResultReport", oController);
				oView.addDependent(oController._ReportModel);
			}

			if(Common.checkNull(oCopyRow.Course) || oCopyRow.Course === "00000000"){
				oController.ApplyModel.setProperty("/Checked", "X");
				oController.onDInput(true);
			}else {
				oController.ApplyModel.setProperty("/Checked", "");
			}

			if(oCopyRow.Edoty === "1"){
				oController._ApplyModel.open();
				oController._ApplyModel.setBusyIndicatorDelay(0).setBusy(true);
				$.app.byId(oController.PAGEID + "_FileFlexBox").setBusyIndicatorDelay(0).setBusy(true);
			}else {
				oController._ReportModel.open();
				oController._ReportModel.setBusyIndicatorDelay(0).setBusy(true);
				$.app.byId(oController.PAGEID + "_FileBox2").setBusyIndicatorDelay(0).setBusy(true);
				$.app.byId(oController.PAGEID + "_FileBox3").setBusyIndicatorDelay(0).setBusy(true);
				$.app.byId(oController.PAGEID + "_FileBox4").setBusyIndicatorDelay(0).setBusy(true);
			}
		},

		onPressAppBtn: function() { // ????????? ??????
			var oView = $.app.byId("ZUI5_HR_OutCompEdu.OutCompEdu");
			this.g_IsNew = "N";
			
			if (!this._ApplyModel) {
				this._ApplyModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ReportApp", this);
				oView.addDependent(this._ApplyModel);
			}
			
			this._ApplyModel.open();
			this._ApplyModel.setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_FileFlexBox").setBusyIndicatorDelay(0).setBusy(true);
		},

		onPressRepBtn: function() { // ????????????
			var oView = $.app.byId("ZUI5_HR_OutCompEdu.OutCompEdu");
			var oController = this;
			var oTableData = this.TableModel.getProperty("/Data");
			var oCopyRow = {};

			this.g_IsNew = "R";

			if(oTableData.every(function(e) {return e.Pchk !== true;})){
				MessageBox.error(oController.getBundleText("MSG_40031"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			var oList = [];

			oTableData.forEach(function(e){
				if(e.Pchk) {
					oList.push(e);
					oCopyRow = e;
				}	
			});

			if(oList.length > 1){
				MessageBox.error(oController.getBundleText("MSG_40030"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(Common.checkNull(!oCopyRow.RepstT) || oCopyRow.Status1 !== "99" || oCopyRow.Edoty !== "1"){
				MessageBox.error(oController.getBundleText("MSG_40037"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			oCopyRow = $.extend(true, {}, oCopyRow);
			oCopyRow.Appnm = "";

			if (!this._ReportModel) {
				this._ReportModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ResultReport", this);
				oView.addDependent(this._ReportModel);
			}
			
			this.ApplyModel.setProperty("/FormData", oCopyRow);
			
			this._ReportModel.open();
			this._ReportModel.setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_FileBox2").setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_FileBox3").setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_FileBox4").setBusyIndicatorDelay(0).setBusy(true);
		},

		onBeforeReportDialog: function() {
			
			if(this.g_IsNew === "N") {
				this.ApplyModel.setProperty("/FormData", {});
				this.ApplyModel.setProperty("/FileData", {});
				var oAttTable = $.app.byId(this.PAGEID + "_AttTable");
				
				this.ApplyModel.setProperty("/FormData/Planx", this.getBundleText("MSG_40004"));
				this.ApplyModel.setProperty("/FormData/Natio", "01");
				this.ApplyModel.setProperty("/Checked", "");
				this.ApplyModel.setProperty("/FormData/Zgtype", "Null");
				this.ApplyModel.setProperty("/FormData/Edgub", "Null");
				this.ApplyModel.setProperty("/FormData/Optin", "Null");
				this.ApplyModel.setProperty("/FormData/Rules", "Null");
				this.ApplyModel.setProperty("/TraningCheck", "");
				this.ApplyModel.setProperty("/Checked", "");
				this.AttModel.setData({
					Data: [{
						Stext1: this.getSessionInfoByKey("Stext"),
						PGradeTxt: this.getSessionInfoByKey("PGradeTxt"),
						Ename: this.getSessionInfoByKey("Ename"),
						Pernr: this.getSessionInfoByKey("name")
					}]
				});
				oAttTable.setVisibleRowCount(1);
			}
		},

		onAfterReportDialog: function() {
			var IsNew = this.g_IsNew;

			Common.getPromise(
				function () {
					this.getCodeList();

					if(IsNew === "N") {
						this.getTypeCombo(false);
					}else if(IsNew === "D") {
						var oCopyRow = this.ApplyModel.getProperty("/FormData");

						this.getAttTable(oCopyRow, "1");
					}
				}.bind(this)
			).then(
				function () {
					this._ApplyModel.setBusy(false);
				}.bind(this)
			);

			Common.getPromise(
				function () {
					this.onBeforeOpenDetailDialog("app");
				}.bind(this)
			).then(
				function () {
					$.app.byId(this.PAGEID + "_FileFlexBox").setBusyIndicatorDelay(0).setBusy(false);
				}.bind(this)
			);
		},

		onBeforeResultDialog: function() {
			if(this.g_IsNew === "D") {
				var oCopyRow = this.ApplyModel.getProperty("/FormData");

				if(Common.checkNull(oCopyRow.Course) || oCopyRow.Course === "00000000"){
					this.ApplyModel.setProperty("/Checked", "X");
					this.onDInput(true);
				}else {
					this.ApplyModel.setProperty("/Checked", "");
				}
			}
		},

		onAfterResultDialog: function() {
			var IsNew = this.g_IsNew;

			Common.getPromise(
				function () {
					var oCopyRow = this.ApplyModel.getProperty("/FormData");
					this.getAttTable(oCopyRow, "2");
					this.getCodeList();
					this.getCodeList2();

					if(IsNew === "R") {
						this.ApplyModel.setProperty("/FormData/Trnfb", "Null");
						this.ApplyModel.setProperty("/FormData/Evtfb", "Null");
					}
				}.bind(this)
			).then(
				function () {
					this._ReportModel.setBusy(false);
				}.bind(this)
			);

			Common.getPromise(
				function () {
					this.onBeforeOpenDetailDialog();
				}.bind(this)
			).then(
				function () {
					$.app.byId(this.PAGEID + "_FileBox2").setBusyIndicatorDelay(0).setBusy(false);
					$.app.byId(this.PAGEID + "_FileBox3").setBusyIndicatorDelay(0).setBusy(false);
					$.app.byId(this.PAGEID + "_FileBox4").setBusyIndicatorDelay(0).setBusy(false);
				}.bind(this)
			);
		},

		onDInput: function(oEvent) { // ???????????? CheckBox
			var vIs =  oEvent === true ? oEvent : oEvent.getSource().getSelected();

			if(vIs){
				this.ApplyModel.setProperty("/TraningCheck", "Y");
				this.ApplyModel.setProperty("/Checked", "X");
			}else{
				this.ApplyModel.setProperty("/TraningCheck", "X");
				this.ApplyModel.setProperty("/Checked", "");
				this.ApplyModel.setProperty("/FormData/Course", ""); // ????????????
				this.ApplyModel.setProperty("/FormData/Edkaj", ""); // ????????????
				this.ApplyModel.setProperty("/FormData/Zgtype", "Null"); // ????????????
				this.ApplyModel.setProperty("/FormData/Edgub", "Null"); // ????????????
				this.ApplyModel.setProperty("/FormData/Optin", "Null"); // ??????/??????
				this.ApplyModel.setProperty("/FormData/Rules", "Null"); // ??????/??????
			}
			if(oEvent !== true)
				this.getTypeCombo(vIs);
		},

		RegistTraning: function() { // ???????????? Dialog			
			var oView = $.app.byId("ZUI5_HR_OutCompEdu.OutCompEdu");
			
			if (!this._TraningModel) {
				this._TraningModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.TraningRegist", this);
				oView.addDependent(this._TraningModel);
			}
			// var oInput = $.app.byId(this.PAGEID + "DTrainingInput");

			// oInput.setValue("");
			this._TraningModel.open();
		},

		onTraningSearch: function() { // ???????????? ??????
			var oController = $.app.getController();
			var vBukrs2 = oController.getUserGubun2();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oTraningTable = $.app.byId(oController.PAGEID + "_TraningTable2");
			var oInput = $.app.byId(oController.PAGEID + "DTrainingInput");
			
			oController.TraningModel.setData({Data : []});

			if(Common.checkNull(oInput.getValue())) {
				MessageBox.error(oController.getBundleText("MSG_40043"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			var sendObject = {};
			// Header
			sendObject.IBukrs = vBukrs2;
			sendObject.IName = oInput.getValue();
			// Navigation property
			sendObject.TrainingEventtypeTableIn = [];
			
			oModel.create("/TrainingEventtypeSet", sendObject, {
				success: function(oData) {
					if(oData && oData.TrainingEventtypeTableIn){
						var dataLength = 10;
						var rDatas1 = oData.TrainingEventtypeTableIn.results;
						dataLength = rDatas1.length;
						oController.TraningModel.setData({Data : rDatas1});
						Common.log(oData);
					}

					oTraningTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
					BusyIndicator.hide();
				}
			});
		},

		onSelectedTraningRow: function(oEvent) {
			var oController = $.app.getController();
			var oPath = oEvent.mParameters.rowBindingContext.getPath();
			var oRowData = oController.TraningModel.getProperty(oPath);

			oController.ApplyModel.setProperty("/FormData/Course", oRowData.Objid ); // ????????????
			oController.ApplyModel.setProperty("/FormData/Edkaj", oRowData.Stext); // ????????????
			oController.ApplyModel.setProperty("/FormData/Zgtype", oRowData.Zgtype); // ????????????
			oController.ApplyModel.setProperty("/FormData/Edgub", oRowData.Edgub); // ????????????
			oController.ApplyModel.setProperty("/FormData/Optin", oRowData.Optin); // ??????/??????
			oController.ApplyModel.setProperty("/FormData/Rules", oRowData.Rules); // ??????/??????
			oController._TraningModel.close();
		},

		onPressReqBtn: function() { // ????????????
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oTableData = this.TableModel.getProperty("/Data");
			var oCopyRow = {};

			if(oTableData.every(function(e) {return e.Pchk !== true;})){
				MessageBox.error(oController.getBundleText("MSG_40035"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			var oList = [];

			oTableData.forEach(function(e){
				if(e.Pchk) {
					oList.push(e);
					oCopyRow = e;
				}	
			});

			if(oList.length > 1){
				MessageBox.error(oController.getBundleText("MSG_40034"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(oCopyRow.Status1 !== "AA") {
				MessageBox.error(oController.getBundleText("MSG_40036"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				//?????? ????????? ???????????? ?????????
				if (fVal && fVal == oController.getBundleText("LABEL_40010")) { // ????????????

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IConType = "P";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.TrainingOutApplyExport = [];
					sendObject.TrainingOutApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOutApplyTableIn1", oCopyRow)];
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						async: true,
						success: function(oData) {
							Common.log(oData);
							oController.onTableSearch();
							BusyIndicator.hide();
							var vUrl = oData.TrainingOutApplyExport.results[0].EUrl;

							if(vUrl) {
								Common.openPopup.call(oController, vUrl);
							}
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_40032"), {
				title: oController.getBundleText("LABEL_40001"),
				actions: [oController.getBundleText("LABEL_40010"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
		},

		getAttTable: function(oRowData, Gubun) { // ????????? ?????? ?????????
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vZyear1 = oController.SearchModel.getProperty("/Data/Zyear1");
			var vMonth1 = oController.SearchModel.getProperty("/Data/Zmonth1") === "ALL" ? "" : oController.SearchModel.getProperty("/Data/Zmonth1");
			var vGubun = oController.SearchModel.getProperty("/Data/Gubun");
			var vStatus = oController.SearchModel.getProperty("/Data/Status");
			var vIsReport = oController.SearchModel.getProperty("/Data/IsReport");
			var oAttTable = "";

			oController.AttModel.setData({Data: []});

			var vBDate = vMonth1 === "" ? new Date(vZyear1, 0, 1) : new Date(vZyear1, vMonth1 - 1, 1);
			var vEDate = vMonth1 === "" ? new Date(vZyear1, 12, 0) : new Date(vZyear1, vMonth1, 0);

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IBukrs = vBukrs2;
			sendObject.IConType = "1";
			sendObject.IBegda = moment(vBDate).hours(10).toDate();
			sendObject.IEndda = moment(vEDate).hours(10).toDate();
			sendObject.IEdoty = vGubun === "ALL" ? "" : vGubun;
			sendObject.IEdsta = vStatus === "ALL" ? "" : vStatus;
			sendObject.IRepst = vIsReport === "ALL" ? "" : vIsReport;
			// Navigation property
			sendObject.TrainingOutApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOutApplyTableIn1", oRowData)];
			sendObject.TrainingOutApplyTableIn2 = [];
			sendObject.TrainingOutApplyTableIn3 = [];
			
			oModel.create("/TrainingOutApplySet", sendObject, {
				success: function(oData) {
					if (oData && oData.TrainingOutApplyTableIn2) { 
						Common.log(oData);
						var vLength = 5;
						var rDatas1 = oData.TrainingOutApplyTableIn2.results;
						vLength = rDatas1.length;

						if(Gubun === "1"){
							oAttTable = $.app.byId(oController.PAGEID + "_AttTable");
							oController.AttModel.setData({Data: rDatas1});
							oController.AttModel.setProperty("/Status", oRowData.Status1);
						}else {
							oAttTable = $.app.byId(oController.PAGEID + "_AttTable2");
							rDatas1.forEach(function(e) {
								if(e.Pernr === vPernr)
									oController.AttModel.setProperty("/Data/0", e);
							});
						}
						oAttTable.setVisibleRowCount(vLength > 5 ? 5 : vLength);
					}

					oData.TrainingOutApplyTableIn3.results.forEach(function(e) {
						e.Url = e.Url.replace(/retriveScpAttach/, "retriveAttach");
					});
					
					oController.ApplyModel.setProperty("/FileData", oData.TrainingOutApplyTableIn3.results);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});			
		},

		onPressDelBtn: function() { // ??????
			var oController = this;
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oData = this.TableModel.getProperty("/Data");

			if(oData.every(function(e) {return e.Pchk !== true;})){
				MessageBox.error(oController.getBundleText("MSG_40026"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}
						
			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_40011")) { // ??????
					var sendObject = {};
					var vMsg = "N";

					oData.forEach(function(ele) {
						if(ele.Pchk){

							sendObject = {};
							// Header
							sendObject.IPernr = vPernr;
							sendObject.IEmpid = vPernr;
							sendObject.IConType = "4";
							sendObject.IEdoty = "1";
							sendObject.IBukrs = vBukrs2;
							// Navigation property
							sendObject.TrainingOutApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOutApplyTableIn1", ele)];
							
							oModel.create("/TrainingOutApplySet", sendObject, {
								success: function(oData) {
									Common.log(oData);
									vMsg = "Y";
								},
								error: function(oResponse) {
									Common.log(oResponse);
									sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
										title: oController.getBundleText("LABEL_09030")
									});
									BusyIndicator.hide();
								}
							});
						}
					});

					if(vMsg === "Y") sap.m.MessageBox.alert(oController.getBundleText("MSG_40012"), { title: oController.getBundleText("MSG_08107")});
					oController.onTableSearch();
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_29005"), {
				title: oController.getBundleText("LABEL_40001"),
				actions: [oController.getBundleText("LABEL_40011"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessDelete
			});
				
		},

		getComboData: function() {
			var oController = $.app.getController();
			var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZHRD_EDOTY";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // ??????
				success: function(oData) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "ALL", Text: oController.getBundleText("LABEL_40059") });
						oController.SearchModel.setProperty("/GubunCombo", oData.NavCommonCodeList.results);
						oController.SearchModel.setProperty("/Data/Gubun", "ALL");
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
					// sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
					// 	title: oController.getBundleText("LABEL_09030")
					// });
				}
			});

			sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZHRD_REPST";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // ????????????
				success: function(oData) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "ALL", Text: oController.getBundleText("LABEL_40059") });
						oController.SearchModel.setProperty("/StatusCombo", oData.NavCommonCodeList.results);
						oController.SearchModel.setProperty("/Data/Status", "ALL");
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});

			sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZHRD_EDSTA";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // ????????? ????????????
				success: function(oData) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "ALL", Text: oController.getBundleText("LABEL_40059") });
						oController.SearchModel.setProperty("/IsReportCombo", oData.NavCommonCodeList.results);
						oController.SearchModel.setProperty("/Data/IsReport", "ALL");
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});
		},

		getTypeCombo: function(IsVal) { // ???????????? ??????
			var oController = $.app.getController();

			if(IsVal){
				var oList2 = [];
				
				oController.ApplyModel.getProperty("/FullTypeCombo").forEach(function(e) {
					if(e.Sortk !== "999"){
						oList2.push(e);
					}
				});
				oController.ApplyModel.setProperty("/TypeCombo", oList2);
			}else
				oController.ApplyModel.setProperty("/TypeCombo", oController.ApplyModel.getProperty("/FullTypeCombo"));
						
		},

		getCodeList: function() { // Dialog ??????????????????
			var oController = $.app.getController();
			var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "036";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZGTYPE";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			if(!oController.ApplyModel.getProperty("/EduCombo")) {
				oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // ????????????
					success: function(oData) {
						if(oData && oData.NavCommonCodeList){
							oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
							oController.ApplyModel.setProperty("/EduCombo", oData.NavCommonCodeList.results);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			}

			sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZEDGUB";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			if(!oController.ApplyModel.getProperty("/FullTypeCombo")) {
				oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // ????????????
					success: function(oData) {
						if(oData && oData.NavCommonCodeList){
							oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
							oController.ApplyModel.setProperty("/FullTypeCombo", oData.NavCommonCodeList.results);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			}

			sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZOPTIN";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			if(!oController.ApplyModel.getProperty("/SelectCombo")) {
				oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // ??????/??????
					success: function(oData) {
						if(oData && oData.NavCommonCodeList){
							oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
							oController.ApplyModel.setProperty("/SelectCombo", oData.NavCommonCodeList.results);	
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			}

			sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZRULES";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			if(!oController.ApplyModel.getProperty("/NomalCombo")) {
				oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // ??????/??????
					success: function(oData) {
						if(oData && oData.NavCommonCodeList){
							oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
							oController.ApplyModel.setProperty("/NomalCombo", oData.NavCommonCodeList.results);	
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			}
		},

		getCodeList2: function() { // ?????????combo
			var oController = $.app.getController();
			var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZHRD_ESCAL";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			if(!oController.ApplyModel.getProperty("/SatisCombo") ||
			!oController.ApplyModel.getProperty("/EduEffectCombo")) {
				oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // ?????????
					success: function(oData) {
						if(oData && oData.NavCommonCodeList){
							oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
							oController.ApplyModel.setProperty("/SatisCombo", oData.NavCommonCodeList.results);
							oController.ApplyModel.setProperty("/EduEffectCombo", oData.NavCommonCodeList.results);
						}
					},
					error: function(oResponse) {
						Common.log(oResponse);
					}
				});
			}
		},

		getOrgOfIndividualHandler: function() {

			return OrgOfIndividualHandler;
		},

		onESSelectPerson: function(data) {
			var oController = $.app.getController();

                return oController.setSelectionTagets(data);
            },

		displayMultiOrgSearchDialog: function(oEvent) {
			return OrgOfIndividualHandler.openOrgSearchDialog(oEvent);
		},

		onPressAddRow: function() { // ????????? ??????
			SearchUser1.oController = this;
			SearchUser1.searchAuth = "A";
			SearchUser1.oTargetPaths = null;

			if (!this._AddPersonDialog) {
				this._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this);
				this.getView().addDependent(this._AddPersonDialog);
			}
	
			this._AddPersonDialog.open();
		},

		setSelectionTagets: function(data) {
			var oController = $.app.getController();

			var oAttTable = $.app.byId(oController.PAGEID + "_AttTable");
			var oAtt = oController.AttModel.getProperty("/Data");
			var vLength = 5;

			if(oAtt.some(function(e) {return e.Pernr === data.Pernr;}) || oController.getUserId() === data.Pernr) {
				MessageBox.error(oController.getBundleText("MSG_40006"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}
			
			data.Stext1 = data.Fulln;
			data.PGradeTxt = data.ZpGradetx;
			oAtt.push(data);
			
			oController.AttModel.setProperty("/Data", oAtt);
			vLength = oAtt.length;

			oAttTable.setVisibleRowCount(vLength > 5 ? 5 : vLength);
			oController._AddPersonDialog.close();
		},

		onPressDelRow: function() { // ????????? ??????
			var oController = this;
			var oAttTable = $.app.byId(this.PAGEID + "_AttTable");
			var oAttData = this.AttModel.getProperty("/Data");
			var oAttList = [];
			var vLength = 5;

			if(oAttData.every(function(e) {return e.Pchk !== true;})){
				MessageBox.error(oController.getBundleText("MSG_40005"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}
			
			oAttData.forEach(function(ele) {
				if(Common.checkNull(ele.Pchk)){
					oAttList.push(ele);
				}
			});
			
			oController.AttModel.setData({Data: oAttList});
			vLength = this.AttModel.getProperty("/Data").length;
			oAttTable.setVisibleRowCount(vLength > 5 ? 5 : vLength);
			oAttTable.clearSelection();
		},

		onChangeRadio: function(oEvent) {
			var vPath = oEvent.getSource().getBindingContext().getPath();

			if(oEvent.mParameters.selectedIndex === 0){
				this.ApplyModel.setProperty(vPath + "/Natio", "01");
			}else{
				this.ApplyModel.setProperty(vPath + "/Natio", "02");
			}
		},

		ErrorCheck: function() {
			var oController = $.app.getController();

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Edkaj"))){ // ????????????
				MessageBox.error(oController.getBundleText("MSG_40013"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}else if(oController.ApplyModel.getProperty("/Checked") === "X"){
				oController.ApplyModel.setProperty("/FormData/Course", "");
			}

			if(oController.ApplyModel.getProperty("/FormData/Zgtype") === "Null"){ // ????????????
				MessageBox.error(oController.getBundleText("MSG_40014"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.ApplyModel.getProperty("/FormData/Edgub") === "Null"){ // ????????????
				MessageBox.error(oController.getBundleText("MSG_40015"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.ApplyModel.getProperty("/FormData/Optin") === "Null"){ // ??????/??????
				MessageBox.error(oController.getBundleText("MSG_40016"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.ApplyModel.getProperty("/FormData/Rules") === "Null"){ // ??????/??????
				MessageBox.error(oController.getBundleText("MSG_40017"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.AttModel.getProperty("/Data").length === 0){ // ?????????
				MessageBox.error(oController.getBundleText("MSG_40018"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.ApplyModel.getProperty("/FormData/Begdhb") === "Null"){ // ????????????
				MessageBox.error(oController.getBundleText("MSG_40019"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Trtim"))){ // ????????????
				MessageBox.error(oController.getBundleText("MSG_40020"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Edsta"))){ // ????????????
				MessageBox.error(oController.getBundleText("MSG_40021"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Costp"))){ // ???????????????
				MessageBox.error(oController.getBundleText("MSG_40022"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Planx"))){ // ????????????
				MessageBox.error(oController.getBundleText("MSG_40024"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(FileHandler.getFileLength(oController, "001") === 0){
				MessageBox.error(oController.getBundleText("MSG_40025"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			return false;
		},

		onDialogApplyBtn: function() { // Dialog ?????? 
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			var oAttList2 = [];

			if(oController.ErrorCheck()) return;
			
			oController.AttModel.getProperty("/Data").forEach(function(e) {
				var oAttList1 = {};
				if(Common.checkNull(e.__metadata))
					oAttList1.Pernr = e.Pernr;
				else
					oAttList1.Pernr = e.Pernr;

				oAttList2.push(Common.copyByMetadata(oModel, "TrainingOutApplyTableIn2", oAttList1));
			});

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_40022")) { //??????
					
					// ???????????? ??????
					oSendData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);
					oSendData.Edoty = "1";
					oSendData.Pernr = vPernr;
					oSendData.Waers = "KRW";
					oSendData.Enddhe = Common.getUTCDateTime(oSendData.Enddhe);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IEdoty = "1";
					sendObject.IConType = "3";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.TrainingOutApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOutApplyTableIn1", oSendData)];
					sendObject.TrainingOutApplyTableIn2 = oAttList2;
					sendObject.TrainingOutApplyTableIn3 = [{Appnm: oSendData.Appnm}];
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						async: true,
						success: function(oData) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40010"), { title: oController.getBundleText("MSG_08107")});
							oController.onTableSearch();
							oController._ApplyModel.close();
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_40009"), {
				title: oController.getBundleText("LABEL_40001"),
				actions: [oController.getBundleText("LABEL_40022"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
		},
		
		onDialogSaveBtn: function() { // Dialog ??????
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			var oAttList2 = [];

			if(oController.ErrorCheck()) return;

			oController.AttModel.getProperty("/Data").forEach(function(e) {
				var oAttList1 = {};

				if(Common.checkNull(e.__metadata))
					oAttList1.Pernr = e.Pernr;
				else
					oAttList1.Pernr = e.Pernr;

				oAttList2.push(Common.copyByMetadata(oModel, "TrainingOutApplyTableIn2", oAttList1));
			});
			
			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				//?????? ????????? ???????????? ?????????
				if (fVal && fVal == oController.getBundleText("LABEL_40022")) { //??????
										
					// ???????????? ??????
					oSendData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);
					oSendData.Pernr = vPernr;
					oSendData.Enddhe = Common.getUTCDateTime(oSendData.Enddhe);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IEdoty = "1";
					sendObject.IConType = "2";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.TrainingOutApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOutApplyTableIn1", oSendData)];
					sendObject.TrainingOutApplyTableIn2 = oAttList2;
					sendObject.TrainingOutApplyTableIn3 = [{Appnm: oSendData.Appnm}];
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						async: true,
						success: function(oData) {
							Common.log(oData);
							oController.onTableSearch();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40010"), { title: oController.getBundleText("MSG_08107")});
							oController._ApplyModel.close();
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_40009"), {
				title: oController.getBundleText("LABEL_40001"),
				actions: [oController.getBundleText("LABEL_40022"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessSave
			});
		},

		onDialogDelBtn: function() { // Dialog ??????
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			
			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				//?????? ????????? ???????????? ?????????
				if (fVal && fVal == oController.getBundleText("LABEL_40011")) { // ??????

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IConType = "4";
					sendObject.IEdoty = "1";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.TrainingOutApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOutApplyTableIn1", oSendData)];
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						success: function(oData) {
							Common.log(oData);
							oController.onTableSearch();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40012"), { title: oController.getBundleText("MSG_08107")});
							oController._ApplyModel.close();
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_29005"), {
				title: oController.getBundleText("LABEL_40001"),
				actions: [oController.getBundleText("LABEL_40011"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessDelete
			});
		},

		onDialogResultBtn: function() { // Dialog ???????????? ??????
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			var oAttList2 = [];

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Plcon"))){ // ???????????? ????????????
				MessageBox.error(oController.getBundleText("MSG_40038"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Plimp"))){ // ???????????? ????????????
				MessageBox.error(oController.getBundleText("MSG_40039"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(FileHandler.getFileLength(oController, "003") === 0){
				MessageBox.error(oController.getBundleText("MSG_40041"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oSendData.Trnfb === "Null"){
				oSendData.Trnfb = "";
			}

			if(oSendData.Evtfb === "Null"){
				oSendData.Evtfb = "";
			}
			
			oController.AttModel.getProperty("/Data").forEach(function(e) {
				var oAttList1 = {};
				
				if(Common.checkNull(e.__metadata))
					oAttList1.Pernr = e.Pernr;
				else
					oAttList1.Pernr = e.Pernr;
					
				oAttList2.push(Common.copyByMetadata(oModel, "TrainingOutApplyTableIn2", oAttList1));
			});

			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_40022")) { // ??????
					
					// ???????????? ??????
					var uFiles = [];
					for(var i=2; i<4; i++)	uFiles.push("00" + i);

					if(FileHandler.getFileLength(oController, "004") !== 0) uFiles.push("004");
					
					oSendData.Appnm = FileHandler.uploadFiles.call(oController, uFiles);
					oSendData.Edoty = "2";
					oSendData.Pernr = vPernr;

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IEdoty = "2";
					sendObject.IConType = "3";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.TrainingOutApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOutApplyTableIn1", oSendData)];
					sendObject.TrainingOutApplyTableIn2 = oAttList2;
					sendObject.TrainingOutApplyTableIn3 = [{Appnm: oSendData.Appnm}];
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						async: true,
						success: function(oData) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40010"), { title: oController.getBundleText("MSG_08107")});
							oController.onTableSearch();
							oController._ReportModel.close();
							BusyIndicator.hide();
						},
						error: function(oResponse) {
							Common.log(oResponse);
							sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
								title: oController.getBundleText("LABEL_09030")
							});
							BusyIndicator.hide();
						}
					});
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_40009"), {
				title: oController.getBundleText("LABEL_40001"),
				actions: [oController.getBundleText("LABEL_40022"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessSave
			});
		},

		onBeforeOpenDetailDialog: function(AppType) {
			var oController = $.app.getController();
			var vStatus = oController.ApplyModel.getProperty("/FormData/Status1"),
				vEdoty = oController.ApplyModel.getProperty("/FormData/Edoty"),
				vRepstT = oController.ApplyModel.getProperty("/FormData/RepstT"),
				vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "",
				vInfoMessage = oController.getBundleText("MSG_40025");

			if(AppType === "app") {
				var vCntnm = oController.ApplyModel.getProperty("/FileData/0/Cntnm");
				var vAppnm1 = oController.ApplyModel.getProperty("/FileData/0/Appnm");
				var vList1 = oController.ApplyModel.getProperty("/FileData/0");
				
				FileHandler.setAttachFile(oController, { // ???????????????
					Required: true,
					Appnm: vCntnm === "001" && Common.checkNull(!vAppnm1) ? vAppnm1 : vAppnm,
					Mode: "S",
					InfoMessage: vInfoMessage,
					UseMultiCategories: true,
					CntnmDifferent: vCntnm === "001" && Common.checkNull(!vAppnm1) ? true : false,
					CntnmDifferentData: vCntnm === "001" && Common.checkNull(!vAppnm1) ? vList1 : {},
					Editable: (!vStatus || vStatus === "AA") ? true : false
				},"001");
			}else {
				var vAppnm2 = "",
					vAppnm3 = "",
					vAppnm4 = "",
					vList2 = {},
					vList3 = {},
					vList4 = {};

				oController.ApplyModel.getProperty("/FileData").forEach(function(e) {
					switch(e.Cntnm) {
						case "002" : vAppnm2 = e.Appnm; vList2 = e; break;
						case "003" : vAppnm3 = e.Appnm; vList3 = e; break;
						case "004" : vAppnm4 = e.Appnm; vList4 = e; break;
					}
				});

				setTimeout(function() {
					FileHandler.once.call(oController, vAppnm).then(function() {
						Promise.all([
							Common.getPromise(function() {
								FileHandler.setAttachFile(oController, { // ????????????
									Appnm: Common.checkNull(!vAppnm2) ? vAppnm2 : vAppnm,
									Mode: "S",
									UseMultiCategories: true,
									CntnmDifferent: Common.checkNull(!vAppnm2) ? true : false,
									CntnmDifferentData: Common.checkNull(!vAppnm2) ? vList2 : {},
									Editable: (Common.checkNull(vRepstT) && (((vStatus === "AA" || vStatus === "88") && vEdoty === "2") || (vStatus === "99" && vEdoty === "1"))) ? true : false
								},"002");
							}),
							Common.getPromise(function() {
								FileHandler.setAttachFile(oController, { // ????????????
									Required: true,
									Appnm: Common.checkNull(!vAppnm3) ? vAppnm3 : vAppnm,
									Mode: "S",
									UseMultiCategories: true,
									CntnmDifferent: Common.checkNull(!vAppnm2) ? true : false,
									CntnmDifferentData: Common.checkNull(!vAppnm2) ? vList3 : {},
									Editable: (Common.checkNull(vRepstT) && (((vStatus === "AA" || vStatus === "88") && vEdoty === "2") || (vStatus === "99" && vEdoty === "1"))) ? true : false
								},"003");
							}),
							Common.getPromise(function() {
								FileHandler.setAttachFile(oController, { // ?????????
									Appnm: Common.checkNull(!vAppnm4) ? vAppnm4 : vAppnm,
									Mode: "S",
									UseMultiCategories: true,
									CntnmDifferent: Common.checkNull(!vAppnm2) ? true : false,
									CntnmDifferentData: Common.checkNull(!vAppnm2) ? vList4 : {},
									Editable: (Common.checkNull(vRepstT) && (((vStatus === "AA" || vStatus === "88") && vEdoty === "2") || (vStatus === "99" && vEdoty === "1"))) ? true : false
								},"004");
							})
						]);
					});
				}, 100);
			}
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35129354"}); // 35129354
		} : null
	});
});