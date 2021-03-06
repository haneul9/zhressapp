/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-undef */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"./delegate/ViewTemplates",
	"fragment/COMMON_ATTACH_FILES"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, ViewTemplates, FileHandler) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		ApplyModel: new JSONModelHelper(),
		SearchModel: new JSONModelHelper(),
		AttModel: new JSONModelHelper(),
		TraningModel: new JSONModelHelper(),
		TeacherModel: new JSONModelHelper(),
		TeacherInfoModel: new JSONModelHelper(),
		AttSearchModel: new JSONModelHelper(),
		AttDetailModel: new JSONModelHelper(),

		g_TeacherType: "",
		g_IDelTeacherList: [],
		g_ODelTeacherList: [],
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
						return (Common.checkNull(v3) && v1 === "99" && v2 === "1") || (v1 === "AA" || v1 === "88");
					}
				},
                selected: "{Pchk}"
            });
		},

		getDCheckBox: function() {
			return new sap.m.CheckBox({
                visible: {
					parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
					formatter: function(v1, v2, v3) {
						return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
					}
				},
                selected: "{Pchk}"
            });
		},
		
		getTimeFormatter: function() {
			return new sap.ui.commons.TextView({
				text: {
					parts: [{ path: "Beguz" }, { path: "Enduz" }],
					formatter: function (v1, v2) {
						if (!v1 || !v2) {
							return "";
						}
						var vTime1 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm" }).format(new Date(v1.ms), true);
						var vTime2 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm" }).format(new Date(v2.ms), true);
						return vTime1 + " ~ " + vTime2;
					}
				},
				textAlign: "Center"
			});
		},

		getUrl1: function() {
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
										// 결재중
										case "00" : vText = oController.getBundleText("LABEL_40070"); break;
										// 미결재
										case "AA" : vText = oController.getBundleText("LABEL_40071"); break;
										// 결재완료
										case "99" : vText = oController.getBundleText("LABEL_40069"); break;
										// 반려
										case "88" : vText = oController.getBundleText("LABEL_66004"); break;
										// 1차결재완료
										case "01" : vText = oController.getBundleText("LABEL_40076"); break;
										// 2차결재완료
										case "02" : vText = oController.getBundleText("LABEL_40077"); break;
										// 3차결재완료
										case "03" : vText = oController.getBundleText("LABEL_40078"); break;
										// 4차결재완료
										case "04" : vText = oController.getBundleText("LABEL_40079"); break;
										// 현업결재완료
										case "10" : vText = oController.getBundleText("LABEL_40080"); break;
										// 담당자확인
										case "90" : vText = oController.getBundleText("LABEL_40081"); break;
									}
									return vText;
								} 
							}, 
							textAlign : "Center",
							visible: {
								path: "UrlA",
								formatter: function(v) {
									if(!v) return true;
									else return false;
								}
							}
						})
						.addStyleClass("font-14px font-regular mt-4px "),
						new sap.m.FormattedText({
							htmlText: {
								parts: [{ path: "UrlA" }, { path: "Status1" }],
								formatter: function(v1, v2) {
									if(v2 === "99") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40069") + "</a>";
									if(v2 === "00") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40070") + "</a>";
									if(v2 === "AA") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40071") + "</a>";
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
								path: "UrlA",
								formatter: function(v) {
									if(v) return true;
									else return false;
								}
							}
						})
					]
				});
		},

		getUrl2: function() {
			var oController = $.app.getController();
			
			return 	new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.ui.commons.TextView({
							text : {
								path: "Status",
								formatter: function(v) {
									var vText = "";
									switch(v){
										// 결재중
										case "00" : vText = oController.getBundleText("LABEL_40070"); break;
										// 미결재
										case "AA" : vText = oController.getBundleText("LABEL_40071"); break;
										// 결재완료
										case "99" : vText = oController.getBundleText("LABEL_40069"); break;
										// 반려
										case "88" : vText = oController.getBundleText("LABEL_66004"); break;
										// 1차결재완료
										case "01" : vText = oController.getBundleText("LABEL_40076"); break;
										// 2차결재완료
										case "02" : vText = oController.getBundleText("LABEL_40077"); break;
										// 3차결재완료
										case "03" : vText = oController.getBundleText("LABEL_40078"); break;
										// 4차결재완료
										case "04" : vText = oController.getBundleText("LABEL_40079"); break;
										// 현업결재완료
										case "10" : vText = oController.getBundleText("LABEL_40080"); break;
										// 담당자확인
										case "90" : vText = oController.getBundleText("LABEL_40081"); break;
									}
									return vText;
								} 
							}, 
							textAlign : "Center",
							visible: {
								path: "UrlA",
								formatter: function(v) {
									if(!v) return true;
									else return false;
								}
							}
						})
						.addStyleClass("font-14px font-regular mt-4px "),
						new sap.m.FormattedText({
							htmlText: {
								parts: [{ path: "UrlA" }, { path: "Status" }],
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
								path: "UrlA",
								formatter: function(v) {
									if(v) return true;
									else return false;
								}
							}
						})
					]
				});
		},

		getDeft: function() {
			return new sap.ui.commons.TextView({
				text: {
					parts: [{ path: "Orgtx1" }, { path: "Orgtx2" }],
					formatter: function (v1, v2) {
						if (!v1 && !v2) {
							return "";
						}
						var vOrgtx1 = Common.checkNull(v1) ? "" : v1;
						var vOrgtx2 = Common.checkNull(v2) ? "" : v2;
						return vOrgtx1 +  vOrgtx2;
					}
				},
				textAlign: "Center"
			});
		},
        
		getInputScore: function() {
			var oController = $.app.getController();

			return new sap.m.Input({
				textAlign: "End",
				width: "100%",
				maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOjtApplyLearner", "Valpt", false),
				liveChange: oController.getScoreComma2.bind(oController),
				editable: {
					parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
					formatter: function(v1, v2, v3) {
						return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
					}
				},
				value: {
					path: "Valpt",
					formatter: function(v) {
						if(v) return v;
						else return "";
					}
				}
			});
		},

		getInputTime: function() {
			var oController = $.app.getController();

			return new sap.m.Input({
				textAlign: "End",
				width: "100%",
				maxLength: Common.getODataPropertyLength("ZHR_TRAINING_SRV", "TrainingOjtApplyLearner", "Stdaz", false),
				liveChange: oController.getTimeComma2.bind(oController),
				editable: {
					parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
					formatter: function(v1, v2, v3) {
						return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
					}
				},
				value: {
					path: "Stdaz",
					formatter: function(v) {
						if(v) return v;
						else return "";
					}
				}
			});
		},

        initDateCreate: function(oController) { // 년과 월로 따로 셋팅하는곳
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
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
			});

			oController.SearchModel.setProperty("/Data/Zyear1", vZyear);
			oController.SearchModel.setProperty("/Zyears1", aYears);
        },

        setZmonths: function(oController) {
            var vConvertMonth = "",
                aMonths = [];

			aMonths.push({ Code: "ALL", Text: oController.getBundleText("LABEL_70004") });

            Common.makeNumbersArray({length: 12, isZeroStart: false}).forEach(function(idx) {
                vConvertMonth = String(idx);
                aMonths.push({ Code: vConvertMonth, Text: vConvertMonth + "월" });
            });

            oController.SearchModel.setProperty("/Data/Zmonth1", "ALL");
			oController.SearchModel.setProperty("/Zmonths1", aMonths);
        },

        setHour: function() {
			var oController = $.app.getController();
            var vConvertHour = "",
                aHours = [];

            Common.makeNumbersArray({length: 24, isZeroStart: false}).forEach(function(idx) {
                vConvertHour = String(idx);
                aHours.push({ Code: Common.lpad(vConvertHour, 2), Text: Common.lpad(vConvertHour, 2) + "시" });
			});

			oController.ApplyModel.setProperty("/BTime1", aHours);
			oController.ApplyModel.setProperty("/ETime1", aHours);
        },

        setMin: function() {
			var oController = $.app.getController();
            var vConvertMin = "",
                aMins = [];

            Common.makeNumbersArray({length: 60}).forEach(function(idx) {
                vConvertMin = String(idx);
                aMins.push({ Code: Common.lpad(vConvertMin, 2), Text: Common.lpad(vConvertMin, 2) + "분" });
            });

			oController.ApplyModel.setProperty("/BTime2", aMins);
			oController.ApplyModel.setProperty("/ETime2", aMins);
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
			
			oTable.setBusyIndicatorDelay(0).setBusy(true);
			if(oController.SearchModel.getProperty("/Data/Zmonth1") === "ALL"){
				vMonth1 = "1";
				vMonth2 = "12";
			}
			
			oController.TableModel.setData({Data: []}); //직접적으로 화면 테이블에 셋팅하는 작업
			
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
			sendObject.TrainingOjtApplyExport = [];
			sendObject.TrainingOjtApplyTableIn1 = [];
			
			oModel.create("/TrainingOjtApplySet", sendObject, {
				success: function(oData) {
					
					if (oData && oData.TrainingOjtApplyTableIn1) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						var rDatas1 = oData.TrainingOjtApplyTableIn1.results;
						oController.TableModel.setData({Data: rDatas1}); //직접적으로 화면 테이블에 셋팅하는 작업
					}

					oController.SearchModel.setProperty("/ExportData", oData.TrainingOjtApplyExport.results[0]);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});

			Common.adjustAutoVisibleRowCount.call(oTable);
			oTable.setBusyIndicatorDelay(0).setBusy(false);
		},

		onPressAppBtn: function() { // 신청서 작성
			var oView = $.app.byId("ZUI5_HR_JobTraining.Page");

			this.g_IsNew = "N";
			
			if (!this._ApplyModel) {
				this._ApplyModel = sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.OJTRegist", this);
				oView.addDependent(this._ApplyModel);
			}

			this._ApplyModel.setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_LearnFileBox").setBusyIndicatorDelay(0).setBusy(true);
			this._ApplyModel.open();
		},

		onPressRepBtn: function() { // 결과보고
			var oView = $.app.byId("ZUI5_HR_JobTraining.Page");
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

			if (!this._ApplyModel) {
				this._ApplyModel = sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.OJTRegist", this);
				oView.addDependent(this._ApplyModel);
			}

			oCopyRow = $.extend(true, {}, oCopyRow);
			this.ApplyModel.setProperty("/FormData", oCopyRow);

			this._ApplyModel.setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_LearnFileBox").setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_EvalFileBox").setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(this.PAGEID + "_ReceiptFileBox").setBusyIndicatorDelay(0).setBusy(true);
			this._ApplyModel.open();
		},
		
		onSelectedRow: function(oEvent) { // Row선택
			var oView = $.app.byId("ZUI5_HR_JobTraining.Page"),
				oController = $.app.getController();
			var oPath = oEvent.mParameters.rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(oPath);
			
			var oCopyRow = $.extend(true, {}, oRowData);

			oController.g_IsNew = "D";

			if(oEvent.mParameters.columnIndex === "8" && Common.checkNull(!oRowData.UrlA1)) return;
			if(oEvent.mParameters.columnIndex === "7" && Common.checkNull(!oRowData.UrlA1)) return;

			
			if (!oController._ApplyModel) {
				oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.OJTRegist", oController);
				oView.addDependent(oController._ApplyModel);
			}

			oController.ApplyModel.setProperty("/FormData", oCopyRow);
			oController.AttModel.setData({Data: []});

			oController._ApplyModel.setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(oController.PAGEID + "_LearnFileBox").setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(oController.PAGEID + "_EvalFileBox").setBusyIndicatorDelay(0).setBusy(true);
			$.app.byId(oController.PAGEID + "_ReceiptFileBox").setBusyIndicatorDelay(0).setBusy(true);
			
			oController._ApplyModel.open();
		},

		onBeforeDialog: function() {
			var oTeacherBox = $.app.byId(this.PAGEID + "_InTeacherBox");
			var oOutTeacherBox = $.app.byId(this.PAGEID + "_OutTeacherBox");
			this.g_IDelTeacherList = [];
			this.g_ODelTeacherList = [];
			oTeacherBox.destroyItems();
			oOutTeacherBox.destroyItems();
			this.TeacherInfoModel.setData({InData: [], OutData: []});

			if(this.g_IsNew === "N"){
				this.ApplyModel.setProperty("/FormData", {});
				
				this.ApplyModel.setProperty("/FormData/Descr", this.getBundleText("MSG_70001"));
				this.ApplyModel.setProperty("/Checked", "");
				this.ApplyModel.setProperty("/OJTResult", "");
				this.ApplyModel.setProperty("/FormData/Edgub", "Null");
				this.ApplyModel.setProperty("/FormData/Optin", "Null");
				this.ApplyModel.setProperty("/FormData/Rules", "Null");
				this.ApplyModel.setProperty("/TraningCheck", "X");
			}else if(this.g_IsNew === "R") {
				var vStatus1 = this.ApplyModel.getProperty("/FormData/Status1");
				var vEdoty = this.ApplyModel.getProperty("/FormData/Edoty");
				var oCopyRow = this.ApplyModel.getProperty("/FormData");
				
				this.TeacherInfoModel.setProperty("/Status1", vStatus1);
				this.TeacherInfoModel.setProperty("/Edoty", vEdoty);
				this.TeacherInfoModel.setProperty("/OJTResult", "X");
				
				this.AttModel.setData({Data: []});
				
				this.ApplyModel.setProperty("/OJTResult", "X");
				
				if(Common.checkNull(oCopyRow.Course) || oCopyRow.Course === "00000000"){
					this.ApplyModel.setProperty("/Checked", "X");
					this.onDInput(true);
				}else {
					this.ApplyModel.setProperty("/Checked", "");
				}
			}else if(this.g_IsNew === "D") {
				var vStatus1 = this.ApplyModel.getProperty("/FormData/Status1");
				var vEdoty = this.ApplyModel.getProperty("/FormData/Edoty");
				var vOJTResult = this.ApplyModel.getProperty("/OJTResult");
				var oCopyRow = this.ApplyModel.getProperty("/FormData");

				if(Common.checkNull(oCopyRow.Course) || oCopyRow.Course === "00000000"){
					this.ApplyModel.setProperty("/Checked", "X");
					this.onDInput(true);
				}else {
					this.ApplyModel.setProperty("/Checked", "");
				}
	
				this.TeacherInfoModel.setProperty("/Status1", vStatus1);
				this.TeacherInfoModel.setProperty("/Edoty", vEdoty);
				this.TeacherInfoModel.setProperty("/OJTResult", vOJTResult);
			}
		},

		onAfterDialog: function() {
			var IsNew = this.g_IsNew;
			
			Common.getPromise(
				function () {
					this.getCodeList();
					this.setHour();
					this.setMin();
					
					if(IsNew === "N") {
						this.ApplyModel.setProperty("/FormData/BTime1", "01");
						this.ApplyModel.setProperty("/FormData/ETime1", "01");
						this.ApplyModel.setProperty("/FormData/BTime2", "00");
						this.ApplyModel.setProperty("/FormData/ETime2", "00");
						this.getTypeCombo(false);
					}else {
						var oCopyRow = this.ApplyModel.getProperty("/FormData");
						var vTime1 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm" }).format(new Date(oCopyRow.Beguz.ms), true);
						var vTime2 = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "HH:mm" }).format(new Date(oCopyRow.Enduz.ms), true);
						vTime1 = vTime1.split(":");
						vTime2 = vTime2.split(":");
						
						this.ApplyModel.setProperty("/FormData/BTime1", vTime1[0]);
						this.ApplyModel.setProperty("/FormData/BTime2", vTime1[1]);
						this.ApplyModel.setProperty("/FormData/ETime1", vTime2[0]);
						this.ApplyModel.setProperty("/FormData/ETime2", vTime2[1]);
						this.getTeacherInfo(oCopyRow);

						if(IsNew === "D" && oCopyRow.Edoty === "2"){
							this.getAttTable(oCopyRow);
							this.ApplyModel.setProperty("/OJTResult", "X");
						}
					}
				}.bind(this)
			).then(
				function () {
					this._ApplyModel.setBusy(false);
				}.bind(this)
			);

			Common.getPromise(
				function () {
					this.onBeforeOpenDetailDialog();
				}.bind(this)
			).then(
				function () {
					$.app.byId(this.PAGEID + "_LearnFileBox").setBusyIndicatorDelay(0).setBusy(false);
					$.app.byId(this.PAGEID + "_EvalFileBox").setBusyIndicatorDelay(0).setBusy(false);
					$.app.byId(this.PAGEID + "_ReceiptFileBox").setBusyIndicatorDelay(0).setBusy(false);
				}.bind(this)
			);
		},

		getTeacherInfo: function(oRowData) { // 강사정보 받아옴
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vZyear1 = oController.SearchModel.getProperty("/Data/Zyear1");
			var vMonth1 = oController.SearchModel.getProperty("/Data/Zmonth1") === "ALL" ? "" : oController.SearchModel.getProperty("/Data/Zmonth1");
			var vGubun = oController.SearchModel.getProperty("/Data/Gubun");
			var vStatus = oController.SearchModel.getProperty("/Data/Status");
			var vIsReport = oController.SearchModel.getProperty("/Data/IsReport");


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
			sendObject.TrainingOjtApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOjtApplyTableIn1", oRowData)];
			sendObject.TrainingOjtApplyTeacher = [];
			sendObject.TrainingOjtApplyTableIn2 = [];
			
			oModel.create("/TrainingOjtApplySet", sendObject, {
				success: function(oData) {
					if (oData && oData.TrainingOjtApplyTeacher) { 
						Common.log(oData);
						var rDatas1 = oData.TrainingOjtApplyTeacher.results,
							oInList = [],
							oOutList = [];

						rDatas1.forEach(function(e) {
							if(e.Sclas === "P"){
								oInList.push(e);
							} else{
								oOutList.push(e);
							}
						});
						oController.TeacherInfoModel.setProperty("/InData", oInList);
						oController.TeacherInfoModel.setProperty("/OutData", oOutList);
						oController.setTeacherBox("I");
						oController.setTeacherBox("O");
					}
					oController.ApplyModel.setProperty("/FileData", oData.TrainingOjtApplyTableIn2.results);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
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
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 구분
				success: function(oData) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "ALL", Text: oController.getBundleText("LABEL_40059") });
						oController.SearchModel.setProperty("/GubunCombo", oData.NavCommonCodeList.results);
						oController.SearchModel.setProperty("/Data/Gubun", "ALL");
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
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZHRD_REPST";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 결재상태
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
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 보고서 제출여부
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

		getCodeList: function() { // Dialog 공통코드호출
			var oController = $.app.getController();
			var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZEDGUB";
			sendObject.ILangu =  "3";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			if(!oController.ApplyModel.getProperty("/FullTypeCombo")) {
				oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 교육유형
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
				oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 필수/선택
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
				oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 법정/일반
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

		getTypeCombo: function(IsVal) { // 교육유형만 가져오는곳
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

		onDInput: function(oEvent) { // 직접입력 CheckBox
			var vIs =  oEvent === true ? oEvent : oEvent.getSource().getSelected();
			if(vIs){
				this.ApplyModel.setProperty("/TraningCheck", "Y");
				this.ApplyModel.setProperty("/Checked", "X");
				
				if(oEvent !== true){
					this.ApplyModel.setProperty("/FormData/Edkaj", ""); // 교육과정
					this.ApplyModel.setProperty("/FormData/Edgub", "Null"); // 교육유형
					this.ApplyModel.setProperty("/FormData/Optin", "Null"); // 필수/선택
					this.ApplyModel.setProperty("/FormData/Rules", "Null"); // 법정/일반
					this.ApplyModel.setProperty("/FormData/Course", "Null"); // 교육코드
				}
			}else{
				this.ApplyModel.setProperty("/TraningCheck", "X");
				this.ApplyModel.setProperty("/Checked", "");
				this.ApplyModel.setProperty("/FormData/Edkaj", ""); // 교육과정
				this.ApplyModel.setProperty("/FormData/Edgub", oEvent === true ? "" : "Null"); // 교육유형
				this.ApplyModel.setProperty("/FormData/Optin", oEvent === true ? "" : "Null"); // 필수/선택
				this.ApplyModel.setProperty("/FormData/Rules", oEvent === true ? "" : "Null"); // 법정/일반
				this.ApplyModel.setProperty("/FormData/Course", oEvent === true ? "" : "Null"); // 교육코드
			}
			this.getTypeCombo(vIs);
		},

		RegistTraning: function() { // 교육과정 Dialog			
			var oView = $.app.byId("ZUI5_HR_JobTraining.Page");
			
			if (!this._TraningModel) {
				this._TraningModel = sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.TraningRegist", this);
				oView.addDependent(this._TraningModel);
			}

			this._TraningModel.open();
		},

		onTraningSearch: function() { // 교육과정 조회
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
			
			oTraningTable.setBusyIndicatorDelay(0).setBusy(true);
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

			oTraningTable.setBusyIndicatorDelay(0).setBusy(false);
		},

		onSelectedTraningRow: function(oEvent) {
			var oController = $.app.getController();
			var oPath = oEvent.mParameters.rowBindingContext.getPath();
			var oRowData = oController.TraningModel.getProperty(oPath);

			oController.ApplyModel.setProperty("/FormData/Course", oRowData.Objid ); // 교육코드
			oController.ApplyModel.setProperty("/FormData/Edkaj", oRowData.Stext); // 교육과정
			oController.ApplyModel.setProperty("/FormData/Edgub", oRowData.Edgub); // 교육유형
			oController.ApplyModel.setProperty("/FormData/Optin", oRowData.Optin); // 필수/선택
			oController.ApplyModel.setProperty("/FormData/Rules", oRowData.Rules); // 법정/일반
			oController._TraningModel.close();
		},

		onSelectedTeacherRow: function(oEvent) { // 강사검색에서 강사선택시
			var oController = $.app.getController();
			var oTeacherBox = $.app.byId(oController.PAGEID + "_InTeacherBox");
			var oOutTeacherBox = $.app.byId(oController.PAGEID + "_OutTeacherBox");
			var oPath = oEvent.mParameters.rowBindingContext.getPath();
			var oRowData = oController.TeacherModel.getProperty(oPath);
			var oList = [];

			if(oController.g_TeacherType === "P"){ // 사내강사
				oTeacherBox.getItems().forEach(function(e) {
					var oTeaList1 = {};
					oTeaList1.Pernr = e.getItems()[1].getText();
					oTeaList1.Ename = e.getItems()[3].getValue();
					oTeaList1.Times = e.getItems()[5].getValue();
					oTeaList1.Tepay = e.getItems()[7].getValue();
					oTeaList1.Sclas = "P";
					oList.push(oTeaList1);
				});
				
				oList.push(oRowData);
				oTeacherBox.destroyItems();

				oList.forEach(function(e) {
					oTeacherBox.addItem(
						new sap.m.HBox({
							fitContainer: true,
							items: [
								new sap.m.CheckBox({ 
									select: oController.onInCheck.bind(oController),
									visible: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									}
								}),
								new sap.m.Text({ visible:false, text: e.Pernr }),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70029}", "85px", "Right").addStyleClass(""), // 강사명
								new sap.m.Input({
									textAlign: "Begin",
									width: "85px",
									editable:false,
									value: e.Ename
								}).addStyleClass("mr-10px"),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70030}", "85px", "Right").addStyleClass(""), // 시간
								new sap.m.Input({
									editable: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									},
									textAlign: "End",
									liveChange: oController.getTimeComma.bind(oController),
									width: "85px",
									value: e.Times
								}).addStyleClass("mr-10px"),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70031}", "100px", "Right").addStyleClass("mr-5px"), // 강사료(단가)
								new sap.m.Input({
									editable: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									},
									textAlign: "End",
									width: "132px",
									liveChange: oController.getMoneyComma.bind(oController),
									value: e.Tepay
								})
							]
						}).addStyleClass("search-field-group")
					);
				});
			}else { // 사외강사
				
				oOutTeacherBox.getItems().forEach(function(e) {
					var oTeaList1 = {};
					oTeaList1.Pernr = e.getItems()[1].getText();
					oTeaList1.Ename = e.getItems()[3].getValue();
					oTeaList1.Times = e.getItems()[5].getValue();
					oTeaList1.Tepay = e.getItems()[7].getValue();
					oTeaList1.Sclas = "H";
					oList.push(oTeaList1);
				});
				
				oList.push(oRowData);
				oOutTeacherBox.destroyItems();
				
				oList.forEach(function(e) {
					oOutTeacherBox.addItem(
						new sap.m.HBox({
							fitContainer: true,
							items: [
								new sap.m.CheckBox({ 
									select: oController.onOutCheck.bind(oController),
									visible: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									}
								}),
								new sap.m.Text({ visible:false, text: e.Pernr }),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70029}", "85px", "Right").addStyleClass(""), // 강사명
								new sap.m.Input({
									textAlign: "Begin",
									width: "85px",
									liveChange: oController.getDyNameComma.bind(oController),
									editable:false,
									value: e.Ename
								}).addStyleClass("mr-10px"),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70030}", "85px", "Right").addStyleClass(""), // 시간
								new sap.m.Input({
									editable: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									},
									textAlign: "End",
									liveChange: oController.getDyTimeComma.bind(oController),
									width: "85px",
									value: e.Times
								}).addStyleClass("mr-10px"),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70031}", "100px", "Right").addStyleClass("mr-5px"), // 강사료(단가)
								new sap.m.Input({
									editable: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									},
									textAlign: "End",
									width: "132px",
									liveChange: oController.getDyMoneyComma.bind(oController),
									value: e.Tepay
								})
							]
						}).addStyleClass("search-field-group")
					);
				});
			}
			oController._TeacherModel.close();
		},

		onInCheck: function() {
			var oController = this;
			var oTeacherBox = $.app.byId(oController.PAGEID + "_InTeacherBox");
			oController.g_IDelTeacherList = [];

			oTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};

				if(!e.getItems()[0].getSelected()){
					oTeaList1.Pernr = e.getItems()[1].getText();
					oTeaList1.Ename = e.getItems()[3].getValue();
					oTeaList1.Times = e.getItems()[5].getValue();
					oTeaList1.Tepay = e.getItems()[7].getValue();
					oTeaList1.Sclas = "P";
					oController.g_IDelTeacherList.push(oTeaList1);
				}
			});
		},

		onOutCheck: function() {
			var oController = this;
			var oOutTeacherBox = $.app.byId(this.PAGEID + "_OutTeacherBox");
			oController.g_ODelTeacherList = [];

			oOutTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};

				if(!e.getItems()[0].getSelected()){
					oTeaList1.Pernr = e.getItems()[1].getText();
					oTeaList1.Ename = e.getItems()[3].getValue();
					oTeaList1.Times = e.getItems()[5].getValue();
					oTeaList1.Tepay = e.getItems()[7].getValue();
					oTeaList1.Sclas = "H";
					oController.g_ODelTeacherList.push(oTeaList1);
				}
			});
		},

		onPressAddRow: function() { // 참석자 추가
			var oView = $.app.byId("ZUI5_HR_JobTraining.Page"),
				oController = $.app.getController();

			if (!oController._AttDetailModel) {
				oController._AttDetailModel = sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.AttEmpRegist", oController);
				oView.addDependent(oController._AttDetailModel);
			}

			oController.AttSearchModel.setData({SearchData : []});
			var oTypeList = [];
			
			if(!oController.AttSearchModel.getProperty("/AttTypeCombo")){
				oTypeList.push(
					{Code: "Emp", Text: "사원"},
					{Code: "Dept", Text: "부서"}
				);

				oController.AttSearchModel.setProperty("/AttTypeCombo", oTypeList);
			}
			oController.AttSearchModel.setProperty("/SearchData/AttType", "Emp");

			oController._AttDetailModel.open();
		},

		onAttSearch: function() { // 사원검색 조회
			var oController = this;
			var vBukrs2 = this.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oAttTable = $.app.byId(this.PAGEID + "_AttTable2");
			var vAttTypeVal = this.AttSearchModel.getProperty("/SearchData/EmpValue");
			var vAttTypeCom = this.AttSearchModel.getProperty("/SearchData/AttType");
			
			
			if(Common.checkNull(vAttTypeVal)) {
				MessageBox.error(this.getBundleText("MSG_70017"), { title: this.getBundleText("MSG_08107")});
				return true;
			}

			this.AttDetailModel.setData({Data : []});
			
			var sendObject = {};

			if(vAttTypeCom === "Emp")
				sendObject.IText = vAttTypeVal;
			else
				sendObject.IOrgtx = vAttTypeVal;

			// Header
			sendObject.IBukrs = vBukrs2;
			// Navigation property
			sendObject.TrainingLearnerTableIn = [];
			
			oModel.create("/TrainingLearnerSet", sendObject, {
				success: function(oData) {
					if(oData && oData.TrainingLearnerTableIn){
						var dataLength = 10;
						var rDatas1 = oData.TrainingLearnerTableIn.results;
						dataLength = rDatas1.length;
						oController.AttDetailModel.setData({Data : rDatas1});
						Common.log(oData);
					}

					oAttTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		onSelectedAttRow: function(oEvent) { // 사원검색 선택
			var oController = $.app.getController();
			var oAttTable = $.app.byId(oController.PAGEID + "_AttTable");
			var oPath = oEvent.mParameters.rowBindingContext.getPath();
			var oRowData = oController.AttDetailModel.getProperty(oPath);
			var oAttData = oController.AttModel.getProperty("/Data");
			
			oAttData.push(oRowData);
			oController.AttModel.setData({Data: oAttData});
			oAttTable.setVisibleRowCount(oAttData.length > 5 ? 5 : oAttData.length);
			oController._AttDetailModel.close();
		},

		onPressDelRow: function() { // 참석자 삭제
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

		onPressReqBtn: function() { // 결재요청
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oTableData = this.TableModel.getProperty("/Data");
			var isReturn = false;

			if(oTableData.every(function(e) {return e.Pchk !== true;})){
				MessageBox.error(oController.getBundleText("MSG_40035"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			var oList = [];

			oTableData.forEach(function(e){
				if(e.Pchk) {
					oList.push(e);
				}	
			});

			// if(oList.length > 1){
			// 	MessageBox.error(oController.getBundleText("MSG_40034"), { title: oController.getBundleText("MSG_08107")});
			// 	return ;
			// }

			oList.forEach(function(ele) {			
				if(!((ele.Status1 === "AA" && ele.Edoty === "1") || (ele.Status1 === "AA" && ele.Edoty === "2"))){
					MessageBox.error(oController.getBundleText("MSG_40045"), { title: oController.getBundleText("MSG_08107")});
					// eslint-disable-next-line no-return-assign
					return isReturn = true;
				}
			});

			if(isReturn) return;

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				//신청 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_70054")) { // 결재요청

					var oSendList = [];

					oList.forEach(function(e){
						oSendList.push(Common.copyByMetadata(oModel, "TrainingOjtApplyTableIn1", e));
					});

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IConType = "P";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.TrainingOjtApplyExport = [];
					sendObject.TrainingOjtApplyTableIn1 = oSendList;
					
					oModel.create("/TrainingOjtApplySet", sendObject, {
						success: function(oData) {
							Common.log(oData);
							oController.onTableSearch();
							BusyIndicator.hide();
							var vUrl = oData.TrainingOjtApplyExport.results[0].EUrl;

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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_70016"), {
				title: oController.getBundleText("LABEL_70001"),
				actions: [oController.getBundleText("LABEL_70054"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
		},

		getAttTable: function(oRowData) { // 참석자 정보 받아옴
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vZyear1 = oController.SearchModel.getProperty("/Data/Zyear1");
			var vMonth1 = oController.SearchModel.getProperty("/Data/Zmonth1") === "ALL" ? "" : oController.SearchModel.getProperty("/Data/Zmonth1");
			var vGubun = oController.SearchModel.getProperty("/Data/Gubun");
			var vStatus = oController.SearchModel.getProperty("/Data/Status");
			var vIsReport = oController.SearchModel.getProperty("/Data/IsReport");
			var oAttTable = $.app.byId(oController.PAGEID + "_AttTable");

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
			sendObject.TrainingOjtApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOjtApplyTableIn1", oRowData)];
			sendObject.TrainingOjtApplyLearner = [];
			sendObject.TrainingOjtApplyTableIn2 = [];
			
			oModel.create("/TrainingOjtApplySet", sendObject, {
				success: function(oData) {
					if (oData && oData.TrainingOjtApplyLearner) { 
						Common.log(oData);
						var rDatas1 = oData.TrainingOjtApplyLearner.results;
						var vLength = rDatas1.length;

						oController.AttModel.setData({Data: rDatas1});
						oController.AttModel.setProperty("/Status1", oController.ApplyModel.getProperty("/FormData/Status1"));
						oController.AttModel.setProperty("/Edoty", oController.ApplyModel.getProperty("/FormData/Edoty"));
						oController.AttModel.setProperty("/OJTResult", oController.ApplyModel.getProperty("/OJTResult"));
						oAttTable.setVisibleRowCount(vLength > 5 ? 5 : vLength);
					}

					oData.TrainingOjtApplyTableIn2.results.forEach(function(e) {
						e.Url = e.Url.replace(/retriveScpAttach/, "retriveAttach");
					});
					oController.ApplyModel.setProperty("/FileData", oData.TrainingOjtApplyTableIn2.results);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});			
		},

		onPressDelBtn: function() { // 삭제
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
				if (fVal && fVal == oController.getBundleText("LABEL_40011")) { // 삭제
					var sendObject = {};
					var vMsg = "N";

					oData.forEach(function(ele) {
						if(ele.Pchk){
							sendObject = {};
							// Header
							sendObject.IPernr = vPernr;
							sendObject.IEmpid = vPernr;
							sendObject.IConType = "4";
							sendObject.IBukrs = vBukrs2;
							// Navigation property
							sendObject.TrainingOjtApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOjtApplyTableIn1", ele)];
							
							oModel.create("/TrainingOjtApplySet", sendObject, {
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

		onDirTeacher: function() { // 사외 강사 직접입력
			var oController = $.app.getController();
			var oOutTeacherBox = $.app.byId(oController.PAGEID + "_OutTeacherBox");

			oOutTeacherBox.addItem(
				new sap.m.HBox({
					fitContainer: true,
					items: [
						new sap.m.CheckBox({ 
							select: oController.onOutCheck.bind(oController),
							visible: {
								parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
								formatter: function(v1, v2, v3) {
									return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || (v1 === "AA" && v2 === "2");
								}
							}
						}),
						new sap.m.Text({ visible:false, text: "" }),
						ViewTemplates.getLabel("header", "{i18n>LABEL_70029}", "85px", "Right").addStyleClass(""), // 강사명
						new sap.m.Input({
							textAlign: "Begin",
							width: "85px",
							editable: {
								parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
								formatter: function(v1, v2, v3) {
									return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || (v1 === "AA" && v2 === "2");
								}
							},
							value: "",
							liveChange: oController.getDyNameComma.bind(oController)
						}).addStyleClass("mr-10px"),
						ViewTemplates.getLabel("header", "{i18n>LABEL_70030}", "85px", "Right").addStyleClass(""), // 시간
						new sap.m.Input({
							textAlign: "End",
							liveChange: oController.getDyTimeComma.bind(oController),
							width: "85px",
							value: "",
							editable: {
								parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
								formatter: function(v1, v2, v3) {
									return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || (v1 === "AA" && v2 === "2");
								}
							}
						}).addStyleClass("mr-10px"),
						ViewTemplates.getLabel("header", "{i18n>LABEL_70031}", "100px", "Right").addStyleClass("mr-5px"), // 강사료(단가)
						new sap.m.Input({
							textAlign: "End",
							width: "132px",
							value: "",
							editable: {
								parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
								formatter: function(v1, v2, v3) {
									return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || (v1 === "AA" && v2 === "2");
								}
							},
							liveChange: oController.getDyMoneyComma.bind(oController)
						})
					]
				}).addStyleClass("search-field-group")
			);
		},

		onTeacherSearch: function() { // 강사 조회
			var oController = this;
			var vBukrs2 = this.getUserGubun2();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oTeacherTable = $.app.byId(this.PAGEID + "_TeacherTable");
			var oInput = $.app.byId(this.PAGEID + "DTeacherInput");
			
			this.TeacherModel.setData({Data : []});

			if(Common.checkNull(oInput.getValue())) {
				MessageBox.error(this.getBundleText("MSG_70005"), { title: this.getBundleText("MSG_08107")});
				return true;
			}

			oTeacherTable.setBusyIndicatorDelay(0).setBusy(true);

			var sendObject = {};
			// Header
			sendObject.IBukrs = vBukrs2;
			sendObject.IName = oInput.getValue();
			sendObject.IOtype = this.g_TeacherType;
			// Navigation property
			sendObject.TrainingTeacherTableIn = [];
			
			oModel.create("/TrainingTeacherSet", sendObject, {
				success: function(oData) {
					if(oData && oData.TrainingTeacherTableIn){
						var dataLength = 10;
						var rDatas1 = oData.TrainingTeacherTableIn.results;
						dataLength = rDatas1.length;
						oController.TeacherModel.setData({Data : rDatas1});
						Common.log(oData);
					}

					oTeacherTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});

			oTeacherTable.setBusyIndicatorDelay(0).setBusy(false);
		},

		onInPressAddRow: function() { // 강사(내부)
			var oView = $.app.byId("ZUI5_HR_JobTraining.Page");

			this.TeacherModel.setData({FormData: []});
			
			if (!this._TeacherModel) {
				this._TeacherModel = sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.TeacherRegist", this);
				oView.addDependent(this._TeacherModel);
			}
			var oInput = $.app.byId(this.PAGEID + "DTeacherInput");

			oInput.setValue("");
			this.g_TeacherType = "P";
			this._TeacherModel.open();
		},

		onInPressDelRow: function() { // 강사(내부)
			var oController = this;

			if(Common.checkNull(this.g_IDelTeacherList)){
				MessageBox.error(oController.getBundleText("MSG_70004"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			this.TeacherInfoModel.setProperty("/InData", this.g_IDelTeacherList);
			this.setTeacherBox("I");
			this.g_IDelTeacherList = [];
		},

		onOutPressAddRow: function() { // 강사(외부)
			var oView = $.app.byId("ZUI5_HR_JobTraining.Page");

			this.TeacherModel.setData({FormData: []});
			
			if (!this._TeacherModel) {
				this._TeacherModel = sap.ui.jsfragment("ZUI5_HR_JobTraining.fragment.TeacherRegist", this);
				oView.addDependent(this._TeacherModel);
			}
			var oInput = $.app.byId(this.PAGEID + "DTeacherInput");

			oInput.setValue("");
			this.g_TeacherType = "H";
			this._TeacherModel.open();
		},

		onOutPressDelRow: function() { // 강사(외부)
			var oController = this;

			if(Common.checkNull(this.g_ODelTeacherList)){
				MessageBox.error(oController.getBundleText("MSG_70004"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			this.TeacherInfoModel.setProperty("/OutData", this.g_ODelTeacherList);
			this.setTeacherBox("O");
			this.g_ODelTeacherList = [];
		},

		setTeacherBox: function(IsType) {
			var oController = $.app.getController();
			var oTeacherBox = $.app.byId(oController.PAGEID + "_InTeacherBox");
			var oOutTeacherBox = $.app.byId(oController.PAGEID + "_OutTeacherBox");
			var oList = [];

			if(IsType === "I"){ // 사내강사
				oList = oController.TeacherInfoModel.getProperty("/InData");
				oTeacherBox.destroyItems();

				oList.forEach(function(e) {
					oTeacherBox.addItem(
						new sap.m.HBox({
							fitContainer: true,
							items: [
								new sap.m.CheckBox({ 
									select: oController.onInCheck.bind(oController),
									visible: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									}
								}),
								new sap.m.Text({ visible:false, text: e.Pernr }),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70029}", "85px", "Right").addStyleClass(""), // 강사명
								new sap.m.Input({
									textAlign: "Begin",
									width: "85px",
									editable:false,
									value: e.Ename
								}).addStyleClass("mr-10px"),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70030}", "85px", "Right").addStyleClass(""), // 시간
								new sap.m.Input({
									editable: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									},
									liveChange: oController.getTimeComma.bind(oController),
									textAlign: "End",
									width: "85px",
									value: e.Times
								}).addStyleClass("mr-10px"),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70031}", "100px", "Right").addStyleClass("mr-5px"), // 강사료(단가)
								new sap.m.Input({
									editable: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									},
									textAlign: "End",
									width: "132px",
									liveChange: oController.getMoneyComma.bind(oController),
									value: {
										path: e.Tepay,
										formatter: function() {
											return Common.checkNull(e.Tepay) ? e.Tepay : Common.numberWithCommas(e.Tepay);
										}
									}
								})
							]
						}).addStyleClass("search-field-group")
					);
				});
			}else { // 사외강사
				oList = oController.TeacherInfoModel.getProperty("/OutData");
				oOutTeacherBox.destroyItems();

				oList.forEach(function(e) {
					oOutTeacherBox.addItem(
						new sap.m.HBox({
							fitContainer: true,
							items: [
								new sap.m.CheckBox({ 
									select: oController.onOutCheck.bind(oController),
									visible: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									}
								}),
								new sap.m.Text({ visible:false, text: e.Pernr }),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70029}", "85px", "Right").addStyleClass(""), // 강사명
								new sap.m.Input({
									textAlign: "Begin",
									width: "85px",
									editable: {
										path: e.Ename,
										formatter: function() {
											return Common.checkNull(e.Ename);
										}
									},
									liveChange: oController.getDyNameComma.bind(oController),
									value: e.Ename
								}).addStyleClass("mr-10px"),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70030}", "85px", "Right").addStyleClass(""), // 시간
								new sap.m.Input({
									editable: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									},
									liveChange: oController.getDyTimeComma.bind(oController),
									textAlign: "End",
									width: "85px",
									value: e.Times
								}).addStyleClass("mr-10px"),
								ViewTemplates.getLabel("header", "{i18n>LABEL_70031}", "100px", "Right").addStyleClass("mr-5px"), // 강사료(단가)
								new sap.m.Input({
									editable: {
										parts: [{path: "/Status1"}, {path: "/Edoty"}, {path: "/OJTResult"}],
										formatter: function(v1, v2, v3) {
											return !v1 || (v1 === "AA" && v2 === "1") || (v1 === "99" && v2 === "1" && v3 === "X") || ((v1 === "AA" || v1 === "88") && v2 === "2");
										}
									},
									textAlign: "End",
									width: "132px",
									liveChange: oController.getDyMoneyComma.bind(oController),
									value: {
										path: e.Tepay,
										formatter: function() {
											return Common.checkNull(e.Tepay) ? e.Tepay : Common.numberWithCommas(e.Tepay);
										}
									}
								})
							]
						}).addStyleClass("search-field-group")
					);
				});
			}
		},
		
		getDyNameComma: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim();

			oEvent.getSource().setValue(Common.checkNull(inputValue) ? "" : inputValue);
		},

		getDyTimeComma: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d || ^\.]/g, '');

			oEvent.getSource().setValue(Common.checkNull(convertValue) ? "" : convertValue);
		},

		getDyMoneyComma: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oEvent.getSource().setValue(Common.checkNull(convertValue) ? "" : Common.numberWithCommas(convertValue));
		},
		
		getTimeComma: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d || ^\.]/g, '');

			oEvent.getSource().setValue(Common.checkNull(convertValue) ? "" : convertValue);
		},

		getScoreComma2: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d || ^\.]/g, '');
			var vPath = oEvent.getSource().getParent().getRowBindingContext().getPath();

			this.AttModel.setProperty(vPath + "/Valpt", Common.checkNull(convertValue) ? "" : convertValue);
			oEvent.getSource().setValue(Common.checkNull(convertValue) ? "" : convertValue);
		},
		
		getTimeComma2: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d || ^\.]/g, '');
			var vPath = oEvent.getSource().getParent().getRowBindingContext().getPath();

			this.AttModel.setProperty(vPath + "/Stdaz", Common.checkNull(convertValue) ? "" : convertValue);
			oEvent.getSource().setValue(Common.checkNull(convertValue) ? "" : convertValue);
		},

		getMoneyComma: function(oEvent) {
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			oEvent.getSource().setValue(Common.checkNull(convertValue) ? "0" : Common.numberWithCommas(convertValue));
		},

		ErrorCheck: function() {
			var oController = $.app.getController();
			var oOutTeacherBox = $.app.byId(oController.PAGEID + "_OutTeacherBox");
			var oTeacherBox = $.app.byId(oController.PAGEID + "_InTeacherBox");

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Edkaj"))){ // 교육과정
				MessageBox.error(oController.getBundleText("MSG_40013"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}else if(oController.ApplyModel.getProperty("/Checked") === "X"){
				oController.ApplyModel.setProperty("/FormData/Course", "");
			}

			if(oController.ApplyModel.getProperty("/FormData/Edgub") === "Null"){ // 교육유형
				MessageBox.error(oController.getBundleText("MSG_40015"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.ApplyModel.getProperty("/FormData/Optin") === "Null"){ // 필수/선택
				MessageBox.error(oController.getBundleText("MSG_40016"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.ApplyModel.getProperty("/FormData/Rules") === "Null"){ // 법정/일반
				MessageBox.error(oController.getBundleText("MSG_40017"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			var BTime1 = oController.ApplyModel.getProperty("/FormData/BTime1");
			var BTime2 = oController.ApplyModel.getProperty("/FormData/BTime2");
			var ETime1 = oController.ApplyModel.getProperty("/FormData/ETime1");
			var ETime2 = oController.ApplyModel.getProperty("/FormData/ETime2");

			var BTime="PT"+BTime1+"H"+BTime2+"M00S";
			var ETime="PT"+ETime1+"H"+ETime2+"M00S";

			oController.ApplyModel.setProperty("/FormData/Beguz", BTime);
			oController.ApplyModel.setProperty("/FormData/Enduz", ETime);

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Begda"))){ // 학습일자
				MessageBox.error(oController.getBundleText("MSG_70011"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			var oList2 = [],
				vError = "";

			if(Common.checkNull(oOutTeacherBox.getItems()[0]) && Common.checkNull(oTeacherBox.getItems()[0])) vError = "Y";
			else vError = "N";

			oOutTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};
				oTeaList1.Ename = e.getItems()[3].getValue();
				oTeaList1.Times = e.getItems()[5].getValue();
				oTeaList1.Tepay = e.getItems()[7].getValue();
				oList2.push(oTeaList1);
				if(Common.checkNull(oTeaList1.Ename) || Common.checkNull(oTeaList1.Times)) vError = "Y";
			});
			oController.TeacherInfoModel.setProperty("/OutData", oList2);

			oList2 = [];

			oTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};
				oTeaList1.Ename = e.getItems()[3].getValue();
				oTeaList1.Times = e.getItems()[5].getValue();
				oTeaList1.Tepay = e.getItems()[7].getValue();
				oList2.push(oTeaList1);
				if(Common.checkNull(oTeaList1.Ename) || Common.checkNull(oTeaList1.Times)) vError = "Y";
			});
			oController.TeacherInfoModel.setProperty("/InData", oList2);

			if(vError === "Y"){
				MessageBox.error(oController.getBundleText("MSG_70014"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Edpeo"))){ // 교육대상
				MessageBox.error(oController.getBundleText("MSG_70012"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Contt"))){ // 학습내용
				MessageBox.error(oController.getBundleText("MSG_70013"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(FileHandler.getFileLength(oController, "001") === 0){
				MessageBox.error(oController.getBundleText("MSG_70010"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			return false;
		},

		onDialogApplyBtn: function() { // Dialog 신청 
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			var oTeacherBox = $.app.byId(oController.PAGEID + "_InTeacherBox");
			var oOutTeacherBox = $.app.byId(oController.PAGEID + "_OutTeacherBox");
			var oTeaList2 = [];

			if(oController.ErrorCheck()) return;
			
			oTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};
				oTeaList1.Pernr = e.getItems()[1].getText();
				oTeaList1.Ename = e.getItems()[3].getValue();
				oTeaList1.Times = e.getItems()[5].getValue();
				oTeaList1.Tepay = e.getItems()[7].getValue().replace(/\,/gi, "");
				oTeaList1.Sclas = "P";
				oTeaList2.push(Common.copyByMetadata(oModel, "TrainingOjtApplyTeacher", oTeaList1));
			});

			oOutTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};
				oTeaList1.Pernr = e.getItems()[1].getText();
				oTeaList1.Ename = e.getItems()[3].getValue();
				oTeaList1.Times = e.getItems()[5].getValue();
				oTeaList1.Tepay = e.getItems()[7].getValue().replace(/\,/gi, "");
				oTeaList1.Sclas = "H";
				oTeaList2.push(Common.copyByMetadata(oModel, "TrainingOjtApplyTeacher", oTeaList1));
			});

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_70047")) { //저장
					
					// 첨부파일 저장
					oSendData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);
					oSendData.Edoty = "1";
					oSendData.Pernr = vPernr;

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IEdoty = "1";
					sendObject.IConType = "3";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.TrainingOjtApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOjtApplyTableIn1", oSendData)];
					sendObject.TrainingOjtApplyTeacher = oTeaList2;
					sendObject.TrainingOjtApplyTableIn2 = [{Appnm: oSendData.Appnm}];
					
					oModel.create("/TrainingOjtApplySet", sendObject, {
						async: true,
						success: function(oData) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_70007"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_70006"), {
				title: oController.getBundleText("LABEL_70001"),
				actions: [oController.getBundleText("LABEL_70047"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
		},
		
		onDialogSaveBtn: function() { // Dialog 저장
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			var oTeacherBox = $.app.byId(oController.PAGEID + "_InTeacherBox");
			var oOutTeacherBox = $.app.byId(oController.PAGEID + "_OutTeacherBox");
			var vEdoty = oController.ApplyModel.getProperty("/FormData/Edoty");
			var oTeaList2 = [];
			var oAttList2 = [];

			if(oController.ErrorCheck()) return;
			
			oTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};
				oTeaList1.Pernr = e.getItems()[1].getText();
				oTeaList1.Ename = e.getItems()[3].getValue();
				oTeaList1.Times = e.getItems()[5].getValue();
				oTeaList1.Tepay = e.getItems()[7].getValue().replace(/\,/gi, "");
				oTeaList1.Sclas = "P";
				oTeaList2.push(Common.copyByMetadata(oModel, "TrainingOjtApplyTeacher", oTeaList1));
			});

			oOutTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};
				oTeaList1.Pernr = e.getItems()[1].getText();
				oTeaList1.Ename = e.getItems()[3].getValue();
				oTeaList1.Times = e.getItems()[5].getValue();
				oTeaList1.Tepay = e.getItems()[7].getValue().replace(/\,/gi, "");
				oTeaList1.Sclas = "H";
				oTeaList2.push(Common.copyByMetadata(oModel, "TrainingOjtApplyTeacher", oTeaList1));
			});

			if(vEdoty === "2") {
				if(oController.AttModel.getProperty("/Data").length === 0){ // 참석자
					MessageBox.error(oController.getBundleText("MSG_70018"), { title: oController.getBundleText("MSG_08107")});
					return ;
				}

				if(FileHandler.getFileLength(oController, "002") === 0){
					MessageBox.error(oController.getBundleText("MSG_70020"), { title: oController.getBundleText("MSG_08107")});
					return true;
				}
	
				oController.AttModel.getProperty("/Data").forEach(function(e) {
					var oAttList1 = {};
					if(e.Pernr === oController.getSessionInfoByKey("name"))
						oAttList1.Sobid = e.Sobid;
					else
						oAttList1.Sobid = e.Pernr;

					oAttList1.Valpt = e.Valpt;
					oAttList1.Stdaz = e.Stdaz;
					oAttList2.push(Common.copyByMetadata(oModel, "TrainingOjtApplyLearner", oAttList1));
				});
			}
			
			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				//저장 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_70047")) { //저장
					var uFiles = [];
					var sendObject = {};

					uFiles.push("001");
		
					if(vEdoty === "2") {
						uFiles.push("002");
						
						if(FileHandler.getFileLength(oController, "003") !== 0) {
							uFiles.push("003");
						}
						sendObject.TrainingOjtApplyLearner = oAttList2;
					}
					
					// 첨부파일 저장
					oSendData.Appnm = FileHandler.uploadFiles.call(oController, uFiles);

					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IEdoty = vEdoty;
					sendObject.IConType = "2";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.TrainingOjtApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOjtApplyTableIn1", oSendData)];
					sendObject.TrainingOjtApplyTeacher = oTeaList2;
					sendObject.TrainingOjtApplyTableIn2 = [{Appnm: oSendData.Appnm}];
					
					oModel.create("/TrainingOjtApplySet", sendObject, {
						async: true,
						success: function(oData) {
							Common.log(oData);
							oController.onTableSearch();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_70007"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_70006"), {
				title: oController.getBundleText("LABEL_70001"),
				actions: [oController.getBundleText("LABEL_70047"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessSave
			});
		},

		onDialogDelBtn: function() { // Dialog 삭제
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			
			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				//삭제 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_70011")) { // 삭제

					oSendData.Edoty = "1";

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IConType = "4";
					sendObject.IEdoty = "1";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.TrainingOjtApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOjtApplyTableIn1", oSendData)];
					
					oModel.create("/TrainingOjtApplySet", sendObject, {
						success: function(oData) {
							Common.log(oData);
							oController.onTableSearch();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_70009"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_70008"), {
				title: oController.getBundleText("LABEL_70001"),
				actions: [oController.getBundleText("LABEL_70011"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessDelete
			});
		},

		onDialogResultBtn: function() { // Dialog 결과보고 신청
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			var oTeacherBox = $.app.byId(oController.PAGEID + "_InTeacherBox");
			var oOutTeacherBox = $.app.byId(oController.PAGEID + "_OutTeacherBox");
			var oTeaList2 = [];
			var oAttList2 = [];

			if(oController.ErrorCheck()) return;

			if(oController.AttModel.getProperty("/Data").length === 0){ // 참석자
				MessageBox.error(oController.getBundleText("MSG_70018"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(FileHandler.getFileLength(oController, "002") === 0){
				MessageBox.error(oController.getBundleText("MSG_70020"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			oTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};
				oTeaList1.Pernr = e.getItems()[1].getText();
				oTeaList1.Ename = e.getItems()[3].getValue();
				oTeaList1.Times = e.getItems()[5].getValue();
				oTeaList1.Tepay = e.getItems()[7].getValue().replace(/\,/gi, "");
				oTeaList1.Sclas = "P";
				oTeaList2.push(Common.copyByMetadata(oModel, "TrainingOjtApplyTeacher", oTeaList1));
			});

			oOutTeacherBox.getItems().forEach(function(e) {
				var oTeaList1 = {};
				oTeaList1.Pernr = e.getItems()[1].getText();
				oTeaList1.Ename = e.getItems()[3].getValue();
				oTeaList1.Times = e.getItems()[5].getValue();
				oTeaList1.Tepay = e.getItems()[7].getValue().replace(/\,/gi, "");
				oTeaList1.Sclas = "H";
				oTeaList2.push(Common.copyByMetadata(oModel, "TrainingOjtApplyTeacher", oTeaList1));
			});

			oController.AttModel.getProperty("/Data").forEach(function(e) {
				var oAttList1 = {};
				oAttList1.Sobid = e.Pernr;
				oAttList1.Valpt = e.Valpt;
				oAttList1.Stdaz = e.Stdaz;
				oAttList2.push(Common.copyByMetadata(oModel, "TrainingOjtApplyLearner", oAttList1));
			});

			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_70047")) { // 저장
					
					// 첨부파일 저장
					var uFiles = [];

					uFiles.push("001");
					uFiles.push("002");

					if(FileHandler.getFileLength(oController, "003") !== 0) {
						uFiles.push("003");
					}
					
					FileHandler.uploadFiles.call(oController, uFiles);
					
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
					sendObject.TrainingOjtApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOjtApplyTableIn1", oSendData)];
					sendObject.TrainingOjtApplyTeacher = oTeaList2;
					sendObject.TrainingOjtApplyLearner = oAttList2;
					sendObject.TrainingOjtApplyTableIn2 = [{Appnm: oSendData.Appnm}];
					
					oModel.create("/TrainingOjtApplySet", sendObject, {
						async: true,
						success: function(oData) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_70007"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_70006"), {
				title: oController.getBundleText("LABEL_70001"),
				actions: [oController.getBundleText("LABEL_70047"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessSave
			});
		},

		onBeforeOpenDetailDialog: function() {
			var oController = $.app.getController();
			var vStatus = oController.ApplyModel.getProperty("/FormData/Status1"),
				vEdoty = oController.ApplyModel.getProperty("/FormData/Edoty") || "",
				vResult = oController.ApplyModel.getProperty("/OJTResult") || "",
				vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "";

			var vCntnm = oController.ApplyModel.getProperty("/FileData/0/Cntnm");
			var vAppnm1 = oController.ApplyModel.getProperty("/FileData/0/Appnm");
			var vList1 = oController.ApplyModel.getProperty("/FileData/0");
			var vAppnm2 = "",
				vAppnm3 = "",
				vList2 = {},
				vList3 = {};

			if(Common.checkNull(!oController.ApplyModel.getProperty("/FileData"))){
				oController.ApplyModel.getProperty("/FileData").forEach(function(e) {
					switch(e.Cntnm) {
						case "002" : vAppnm2 = e.Appnm; vList2 = e; break;
						case "003" : vAppnm3 = e.Appnm; vList3 = e; break;
					}
				});
			}

			setTimeout(function() {
				FileHandler.once.call(oController, vAppnm).then(function() {
					Promise.all([
						Common.getPromise(function() {
							FileHandler.setAttachFile(oController, { // 학습내용
								Required: true,
								Appnm: vCntnm === "001" && Common.checkNull(!vAppnm1) ? vAppnm1 : vAppnm,
								Mode: "S",
								UseMultiCategories: true,
								CntnmDifferent: vCntnm === "001" && Common.checkNull(!vAppnm1) ? true : false,
								CntnmDifferentData: vCntnm === "001" && Common.checkNull(!vAppnm1) ? vList1 : {},
								Editable: !vStatus || (vStatus === "AA" && vEdoty === "1") || (vStatus === "99" && vEdoty === "1" && vResult === "X") || ((vStatus === "AA" || vStatus === "88") && vEdoty === "2") ? true : false
							},"001");
						}),
						Common.getPromise(function() {
							FileHandler.setAttachFile(oController, { // 평가서
								Appnm: Common.checkNull(!vAppnm2) ? vAppnm2 : vAppnm,
								Required: true,
								Mode: "S",
								UseMultiCategories: true,
								CntnmDifferent: Common.checkNull(!vAppnm2) ? true : false,
								CntnmDifferentData: Common.checkNull(!vAppnm2) ? vList2 : {},
								Editable: !vStatus || (vStatus === "AA" && vEdoty === "1") || (vStatus === "99" && vEdoty === "1" && vResult === "X") || ((vStatus === "AA" || vStatus === "88") && vEdoty === "2") ? true : false
							},"002");
						}),
						Common.getPromise(function() {
							FileHandler.setAttachFile(oController, { // 영수증
								Appnm: Common.checkNull(!vAppnm3) ? vAppnm3 : vAppnm,
								Mode: "S",
								UseMultiCategories: true,
								CntnmDifferent: Common.checkNull(!vAppnm2) ? true : false,
								CntnmDifferentData: Common.checkNull(!vAppnm2) ? vList3 : {},
								Editable: !vStatus || (vStatus === "AA" && vEdoty === "1") || (vStatus === "99" && vEdoty === "1" && vResult === "X") || ((vStatus === "AA" || vStatus === "88") && vEdoty === "2") ? true : false
							},"003");
						})
					]);
				});
			}, 100);
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20090003"}); // 20090003
		} : null
	});
});