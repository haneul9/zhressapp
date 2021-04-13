/* eslint-disable no-undef */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/AttachFileAction",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"../common/DialogHandler",
	"../common/OrgOfIndividualHandler"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, BusyIndicator, DialogHandler, OrgOfIndividualHandler) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "OutCompEdu",
		
		TableModel: new JSONModelHelper(),
		ApplyModel: new JSONModelHelper(),
		SearchModel: new JSONModelHelper(),
		AttModel: new JSONModelHelper(),
		
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
            
            this.initDateCreate(this);
			this.onTableSearch();
			this.getComboData();
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
										// 결재중
										case "00" : vText = oController.getBundleText("LABEL_40070"); break;
										// 미결재
										case "AA" : vText = oController.getBundleText("LABEL_40071"); break;
										// 결재완료
										case "99" : vText = oController.getBundleText("LABEL_40069"); break;
									}
									return vText;
								} 
							}, 
							textAlign : "Center",
							visible: {
								path: "Url1",
								formatter: function(v) {
									if(!v) return true;
									else return false;
								}
							}
						})
						.addStyleClass("font-14px font-regular mt-8px "),
						new sap.m.FormattedText({
							htmlText: {
								parts: [{ path: "Url1" }, { path: "Status1" }],
								formatter: function(v1, v2) {
									if(v2 === "99") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40069") + "</a>";
									if(v2 === "00") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_40070") + "</a>";
								}
							}, 
							visible: {
								path: "Url1",
								formatter: function(v) {
									if(v) return true;
									else return false;
								}
							}
						})
					]
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

			aYears.push({ Code: "ALL", Text: oController.getBundleText("LABEL_40059") });

            Common.makeNumbersArray({length: 11}).forEach(function(idx) {
                vConvertYear = String(vZyear - idx);
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
			});

			oController.SearchModel.setProperty("/Data/Zyear1", "ALL");
			oController.SearchModel.setProperty("/Zyears1", aYears);
        },

        setZmonths: function(oController) {
            var vConvertMonth = "",
                aMonths = [];

			aMonths.push({ Code: "ALL", Text: oController.getBundleText("LABEL_40059") });

            Common.makeNumbersArray({length: 12, isZeroStart: false}).forEach(function(idx) {
                vConvertMonth = String(idx);
                aMonths.push({ Code: vConvertMonth, Text: vConvertMonth + "월" });
            });

            oController.SearchModel.setProperty("/Data/Zmonth1", "ALL");
			oController.SearchModel.setProperty("/Zmonths1", aMonths);
        },

        setTimeCombo1: function(oController) {
            var vTime = "",
                oTimes = [];

			oTimes.push({ Code: "Null", Text: "hh" });

            Common.makeNumbersArray({length: 24, isZeroStart: false}).forEach(function(idx) {
                vTime = String(idx);
				var hTime = Common.lpad(vTime, 2);
                oTimes.push({ Code: vTime, Text: hTime});
            });

            oController.ApplyModel.setProperty("/FormData/hTime", "Null");
			oController.ApplyModel.setProperty("/TimeCombo", oTimes);
        },

        setTimeCombo2: function(oController) {
            var vTime = "",
                oTimes = [];

			oTimes.push({ Code: "Null", Text: "mm" });

            Common.makeNumbersArray({length: 60}).forEach(function(idx) {
                vTime = String(idx);
				var mTime = Common.lpad(vTime, 2);
                oTimes.push({ Code: mTime, Text: mTime});
            });

            oController.ApplyModel.setProperty("/FormData/mTime", "Null");
			oController.ApplyModel.setProperty("/TimeCombo2", oTimes);
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
			
			oController.TableModel.setData({Data: []}); //직접적으로 화면 테이블에 셋팅하는 작업
			
			var vBDate = new Date(vZyear1, vMonth1 - 1, 1);
			var vEDate = new Date(vZyear1, vMonth2, 0);

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IBukrs = vBukrs2;
			sendObject.IConType = "1";
			sendObject.IBegda = Common.checkNull(vZyear1) || Common.checkNull(vMonth1) ? undefined : Common.adjustGMTOdataFormat(vBDate);
			sendObject.IEndda = Common.checkNull(vZyear1) || Common.checkNull(vMonth1) ? undefined : Common.adjustGMTOdataFormat(vEDate);
			sendObject.IEdoty = vGubun === "ALL" ? "" : vGubun;
			sendObject.IRepst = vStatus === "ALL" ? "" : vStatus;
			sendObject.IEdsta = vIsReport === "ALL" ? "" : vIsReport;
			// Navigation property
			sendObject.TrainingOutApplyExport = [];
			sendObject.TrainingOutApplyTableIn1 = [];
			
			oModel.create("/TrainingOutApplySet", sendObject, {
				success: function(oData, oResponse) {
					var dataLength = 10;
					if (oData && oData.TrainingOutApplyTableIn1) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						var rDatas1 = oData.TrainingOutApplyTableIn1.results;
						dataLength = rDatas1.length;
						oController.TableModel.setData({Data: rDatas1}); //직접적으로 화면 테이블에 셋팅하는 작업
					}
					
					oTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength); //rowcount가 10개 미만이면 그 갯수만큼 row적용

					oController.SearchModel.setProperty("/ExportData", oData.TrainingOutApplyExport.results[0]);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},
		
		onSelectedRow: function(oEvent) { // Row선택
			var oView = $.app.byId("ZUI5_HR_OutCompEdu.OutCompEdu"),
				oController = $.app.getController();
			var oPath = oEvent.mParameters.rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(oPath);
			
			var oCopyRow = $.extend(true, {}, oRowData);

			if(oEvent.mParameters.columnIndex === "8" && Common.checkNull(!oRowData.UrlA1)) return;

			oController.ApplyModel.setData({FormData: oCopyRow});
			oController.AttModel.setData({Data: []});
			
			if (!oController._ApplyModel) {
				oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ReportApp", oController);
				oView.addDependent(oController._ApplyModel);
			}
			oController.setTimeCombo1(oController);
			oController.setTimeCombo2(oController);
			oController.ApplyModel.setProperty("/FormData/hTime", oCopyRow.Trtim.split(".")[0]);
			oController.ApplyModel.setProperty("/FormData/mTime", oCopyRow.Trtim.split(".")[1]);
			oController.getCodeList(oCopyRow);
			oController.onBeforeOpenDetailDialog("app");
			oController.getAttTable(oCopyRow, "1");
			oController._ApplyModel.open();
		},

		onPressAppBtn: function() { // 신청서 작성
			var oView = $.app.byId("ZUI5_HR_OutCompEdu.OutCompEdu");

			this.ApplyModel.setData({FormData: []});
			this.AttModel.setData({Data: []});

			if (!this._ApplyModel) {
				this._ApplyModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ReportApp", this);
				oView.addDependent(this._ApplyModel);
			}

			this.ApplyModel.setProperty("/FormData/Planx", this.getBundleText("MSG_40004"));
			this.setTimeCombo1(this);
			this.setTimeCombo2(this);
			this.getCodeList();
			this.onBeforeOpenDetailDialog("app");
			this._ApplyModel.open();
		},

		onPressRepBtn: function() { // 결과보고
			var oView = $.app.byId("ZUI5_HR_OutCompEdu.OutCompEdu");
			var oController = this;
			var oTableData = this.TableModel.getProperty("/Data");
			var oCopyRow = {};

			if(oTableData.every(function(e) {return e.Pchk !== true})){
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
			
			if (!this._ReportModel) {
				this._ReportModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ResultReport", this);
				oView.addDependent(this._ReportModel);
			}
			
			this.ApplyModel.setData({FormData: oCopyRow});
			this.setTimeCombo1(this);
			this.setTimeCombo2(this);
			this.getCodeList(oCopyRow);
			this.getCodeList2();
			this.ApplyModel.setProperty("/FormData/hTime", oCopyRow.Trtim.split(".")[0]);
			this.ApplyModel.setProperty("/FormData/mTime", oCopyRow.Trtim.split(".")[1]);
			this.getAttTable(oCopyRow, "2");
			this.onBeforeOpenDetailDialog();
			this._ReportModel.open();
		},

		onPressReqBtn: function() { // 결재요청
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oTableData = this.TableModel.getProperty("/Data");
			var oCopyRow = {};

			if(oTableData.every(function(e) {return e.Pchk !== true})){
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
				//신청 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_40010")) { // 결재요청

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
						success: function(oData, oResponse) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40033"), { title: oController.getBundleText("MSG_08107")});
							oController.onTableSearch();
							BusyIndicator.hide();
							window.open(
								oData.TrainingOutApplyExport.results[0].EUrl,
								"_blank",
								"height = 600, width = 900"
							);
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

		getAttTable: function(oRowData, Gubun) { // 참석자 정보 받아옴
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vZyear1 = oController.SearchModel.getProperty("/Data/Zyear1");
			var vMonth1 = oController.SearchModel.getProperty("/Data/Zmonth1");
			var vGubun = oController.SearchModel.getProperty("/Data/Gubun");
			var vStatus = oController.SearchModel.getProperty("/Data/Status");
			var vIsReport = oController.SearchModel.getProperty("/Data/IsReport");
			var oAttTable = "";

			oController.AttModel.setData({Data: []});

			var vBDate = vZyear1 === "ALL" ? "" : new Date(vZyear1, vMonth1 - 1, 1);
			var vEDate = vMonth1 === "ALL" ? "" : new Date(vZyear1, vMonth1, 0);

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IBukrs = vBukrs2;
			sendObject.IConType = "1";
			sendObject.IBegda = Common.adjustGMTOdataFormat(vBDate);
			sendObject.IEndda = Common.adjustGMTOdataFormat(vEDate);
			sendObject.IEdoty = vGubun === "ALL" ? "" : vGubun;
			sendObject.IEdsta = vStatus === "ALL" ? "" : vStatus;
			sendObject.IRepst = vIsReport === "ALL" ? "" : vIsReport;
			// Navigation property
			sendObject.TrainingOutApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOutApplyTableIn1", oRowData)];
			sendObject.TrainingOutApplyTableIn2 = [];
			
			oModel.create("/TrainingOutApplySet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TrainingOutApplyTableIn2) { 
						Common.log(oData);
						var vLength = 5;
						var rDatas1 = oData.TrainingOutApplyTableIn2.results;
						oController.AttModel.setData({Data: rDatas1});
						vLength = rDatas1.length;

						if(Gubun === "1")
							oAttTable = $.app.byId(oController.PAGEID + "_AttTable");
						else 
							oAttTable = $.app.byId(oController.PAGEID + "_AttTable2");
						
						oAttTable.setVisibleRowCount(vLength > 5 ? 5 : vLength);
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

		onPressDelBtn: function() { // 삭제
			var oController = this;
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oData = this.TableModel.getProperty("/Data");

			if(oData.every(function(e) {return e.Pchk !== true})){
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
							ele.Edoty = "1";

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
								success: function(oData, oResponse) {
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

					if(vMsg = "Y") sap.m.MessageBox.alert(oController.getBundleText("MSG_40012"), { title: oController.getBundleText("MSG_08107")});
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
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 구분
				success: function(oData, oResponse) {
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
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 결재상태
				success: function(oData, oResponse) {
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
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 보고서 제출여부
				success: function(oData, oResponse) {
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

		getCodeList: function(oRowData) { // Dialog 공통코드호출
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
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 교육구분
				success: function(oData, oResponse) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
						oController.ApplyModel.setProperty("/EduCombo", oData.NavCommonCodeList.results);

						if(!oRowData) oController.ApplyModel.setProperty("/FormData/Zgtype", "Null");
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
			sendObject.ICodty = "ZEDGUB";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 교육유형
				success: function(oData, oResponse) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
						oController.ApplyModel.setProperty("/TypeCombo", oData.NavCommonCodeList.results);
						
						if(!oRowData) oController.ApplyModel.setProperty("/FormData/Edgub", "Null");
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
			sendObject.ICodty = "ZOPTIN";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 필수/선택
				success: function(oData, oResponse) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
						oController.ApplyModel.setProperty("/SelectCombo", oData.NavCommonCodeList.results);

						if(!oRowData) oController.ApplyModel.setProperty("/FormData/Optin", "Null");
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
			sendObject.ICodty = "ZRULES";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 법정/일반
				success: function(oData, oResponse) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
						oController.ApplyModel.setProperty("/NomalCombo", oData.NavCommonCodeList.results);

						if(!oRowData) oController.ApplyModel.setProperty("/FormData/Rules", "Null");
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});
		},

		getCodeList2: function(oRowData) { // 만족도combo
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
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 만족도
				success: function(oData, oResponse) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });
						oController.ApplyModel.setProperty("/SatisCombo", oData.NavCommonCodeList.results);
						oController.ApplyModel.setProperty("/EduEffectCombo", oData.NavCommonCodeList.results);

						if(!oRowData) {
							oController.ApplyModel.setProperty("/FormData/Trnfb", "Null");
							oController.ApplyModel.setProperty("/FormData/Evtfb", "Null");
						}
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

		getOrgOfIndividualHandler: function() {

			return OrgOfIndividualHandler;
		},

		onESSelectPerson: function(data) {
                return OrgOfIndividualHandler.setSelectionTagets(data);
            },

		displayMultiOrgSearchDialog: function(oEvent) {
			return $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent);
		},

		onPressAddRow: function(oEvent) { // 참석자 추가
			var oController = this;
			setTimeout(function() {
				var oLoadData = {
					Percod: this.getSessionInfoByKey("Percod"),
					Bukrs: this.getSessionInfoByKey("Bukrs2"),
					Langu: this.getSessionInfoByKey("Langu"),
					Molga: this.getSessionInfoByKey("Molga"),
					Datum: new Date(),
					Mssty: ""
				};
	
				var callback = function(o) {
					var oAttTable = $.app.byId(oController.PAGEID + "_AttTable");
					var oAtt = oController.AttModel.getProperty("/Data");
					var vLength = 5;

					if(oAtt.some(function(e) {return e === o})) {
						MessageBox.error(oController.getBundleText("MSG_40006"), { title: oController.getBundleText("MSG_08107")});
						return ;
					}
					
					o.Stext1 = o.PupStext;
					o.PGradeTxt = o.ZpGradeTxt;
					o.Ename = o.Stext;

					oAtt.push(o);

					oController.AttModel.setProperty("/Data", oAtt);
					vLength = oAtt.length;

					oAttTable.setVisibleRowCount(vLength > 5 ? 5 : vLength);
				};
	
				OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, oLoadData, callback);
				DialogHandler.open(OrgOfIndividualHandler);
			}.bind(this), 0);
		},

		onPressDelRow: function(oEvent) { // 참석자 삭제
			var oController = this;
			var oAttTable = $.app.byId(this.PAGEID + "_AttTable");
			var oAttData = this.AttModel.getProperty("/Data");
			var oAttList = [];
			var vLength = 5;

			if(oAttData.every(function(e) {return e.Pchk !== true})){
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
				this.ApplyModel.setProperty(vPath + "/Natio", "1");
			}else{
				this.ApplyModel.setProperty(vPath + "/Natio", "2");
			}
		},

		ErrorCheck: function() {
			var oController = $.app.getController();

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Edkaj"))){ // 교육과정
				MessageBox.error(oController.getBundleText("MSG_40013"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.ApplyModel.getProperty("/FormData/Zgtype") === "Null"){ // 교육구분
				MessageBox.error(oController.getBundleText("MSG_40014"), { title: oController.getBundleText("MSG_08107")});
				return true;
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

			if(oController.AttModel.getProperty("/Data").length === 0){ // 참석자
				MessageBox.error(oController.getBundleText("MSG_40018"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.ApplyModel.getProperty("/FormData/Begdhb") === "Null"){ // 학습기간
				MessageBox.error(oController.getBundleText("MSG_40019"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(oController.ApplyModel.getProperty("/FormData/hTime") === "Null" || oController.ApplyModel.getProperty("/FormData/mTime") === "Null"){ // 학습시간
				MessageBox.error(oController.getBundleText("MSG_40020"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Edsta"))){ // 교육기관
				MessageBox.error(oController.getBundleText("MSG_40021"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Costp"))){ // 인당교육비
				MessageBox.error(oController.getBundleText("MSG_40022"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Vatax"))){ // 부가세
				MessageBox.error(oController.getBundleText("MSG_40023"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Planx"))){ // 전담교육
				MessageBox.error(oController.getBundleText("MSG_40024"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(AttachFileAction.getFileLength(oController) === 0) {
				MessageBox.error(oController.getBundleText("MSG_40025"), { title: oController.getBundleText("MSG_08107")});
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
			var oAttList2 = [];

			if(oController.ErrorCheck()) return;
			
			oController.AttModel.getProperty("/Data").forEach(function(e) {
				var oAttList1 = {};
				oAttList1.Pernr = e.Objid;
				oAttList2.push(Common.copyByMetadata(oModel, "TrainingOutApplyTableIn2", oAttList1));
			});

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				//신청 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_40060")) { //신청
					var vTimeH = oController.ApplyModel.getProperty("/FormData/hTime");
					var vTimeM = oController.ApplyModel.getProperty("/FormData/mTime");
					
					// 첨부파일 저장
					oSendData.Appnm = AttachFileAction.uploadFile.call(oController);
					oSendData.Edoty = "1";
					oSendData.Pernr = vPernr;
					oSendData.Trtim = vTimeH + "." + vTimeM;

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
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40008"), { title: oController.getBundleText("MSG_08107")});
							oController.onTableSearch();
							BusyIndicator.hide();
							oController._ApplyModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_40007"), {
				title: oController.getBundleText("LABEL_40001"),
				actions: [oController.getBundleText("LABEL_40060"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
		},
		
		onDialogSaveBtn: function(oEvent) { // Dialog 저장
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			var oAttList2 = [];

			if(oController.ErrorCheck()) return;

			oController.AttModel.getProperty("/Data").forEach(function(e) {
				var oAttList1 = {};
				oAttList1.Pernr = e.Objid;
				oAttList2.push(Common.copyByMetadata(oModel, "TrainingOutApplyTableIn2", oAttList1));
			});
			
			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				//저장 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_40022")) { //저장
					
					var vTimeH = oController.ApplyModel.getProperty("/FormData/hTime");
					var vTimeM = oController.ApplyModel.getProperty("/FormData/mTime");
					
					// 첨부파일 저장
					oSendData.Appnm = AttachFileAction.uploadFile.call(oController);
					oSendData.Pernr = vPernr;
					oSendData.Trtim = vTimeH + "." + vTimeM;

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
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							Common.log(oData);
							oController.onTableSearch();
							BusyIndicator.hide();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40010"), { title: oController.getBundleText("MSG_08107")});
							oController._ApplyModel.close();
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

		onDialogDelBtn: function(oEvent) { // Dialog 삭제
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			
			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				//삭제 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_40011")) { // 삭제
					
					oSendData.Edoty = "1";

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
						success: function(oData, oResponse) {
							Common.log(oData);
							oController.onTableSearch();
							BusyIndicator.hide();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40012"), { title: oController.getBundleText("MSG_08107")});
							oController._ApplyModel.close();
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

		onDialogResultBtn: function() { // Dialog 결과보고 신청
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			var oAttList2 = [];

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Pltgt"))){ // 전달교육 내용요약
				MessageBox.error(oController.getBundleText("MSG_40038"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Plimp"))){ // 직무개선 방안요약
				MessageBox.error(oController.getBundleText("MSG_40039"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "001") === 0){
				MessageBox.error(oController.getBundleText("MSG_40040"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "002") === 0){
				MessageBox.error(oController.getBundleText("MSG_40041"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}
			
			oController.AttModel.getProperty("/Data").forEach(function(e) {
				var oAttList1 = {};
				oAttList1.Pernr = e.Objid;
				oAttList2.push(Common.copyByMetadata(oModel, "TrainingOutApplyTableIn2", oAttList1));
			});

			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_40060")) { // 신청
					
					// 첨부파일 저장
					var uFiles = [];
					for(var i=1; i<3; i++)	uFiles.push("00" + i);

					oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);

					if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "003") !== 0) uFiles.push("003");

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
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40008"), { title: oController.getBundleText("MSG_08107")});
							oController.onTableSearch();
							BusyIndicator.hide();
							oController._ReportModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_40007"), {
				title: oController.getBundleText("LABEL_40001"),
				actions: [oController.getBundleText("LABEL_40060"), oController.getBundleText("LABEL_00119")],
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
				AttachFileAction.setAttachFile(oController, {
					Appnm: vAppnm,
					Required: true,
					Mode: "M",
					Max: "10",
					InfoMessage: vInfoMessage,
					Editable: (!vStatus || vStatus === "AA") ? true : false,
				});
			}else {
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 내용요약
					Label: "",
					Appnm: vAppnm,
					Mode: "S",
					UseMultiCategories: true,
					Editable: (Common.checkNull(vRepstT) || vStatus === "99" || vEdoty === "1") ? true : false,
				},"001");
				
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 방안요약
					Label: "",
					Appnm: vAppnm,
					Mode: "S",
					UseMultiCategories: true,
					Editable: (Common.checkNull(vRepstT) || vStatus === "99" || vEdoty === "1") ? true : false,
				},"002");
	
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 수료증
					Label: "",
					Appnm: vAppnm,
					Mode: "S",
					UseMultiCategories: true,
					Editable: (Common.checkNull(vRepstT) || vStatus === "99" || vEdoty === "1") ? true : false,
				},"003");
			}
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35129354"}); // 35129354
		} : null
	});
});