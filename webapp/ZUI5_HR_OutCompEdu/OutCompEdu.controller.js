/* eslint-disable no-undef */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"../common/DialogHandler",
	"../common/OrgOfIndividualHandler",
	"../common/SearchUser1"
	], 
	function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, DialogHandler, OrgOfIndividualHandler, SearchUser1) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "OutCompEdu",
		
		TableModel: new JSONModelHelper(),
		ApplyModel: new JSONModelHelper(),
		SearchModel: new JSONModelHelper(),
		AttModel: new JSONModelHelper(),
		TraningModel: new JSONModelHelper(),
		
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

			aMonths.push({ Code: "ALL", Text: oController.getBundleText("LABEL_40059") });

            Common.makeNumbersArray({length: 12, isZeroStart: false}).forEach(function(idx) {
                vConvertMonth = String(idx);
                aMonths.push({ Code: vConvertMonth, Text: vConvertMonth + "월" });
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
			sendObject.TrainingOutApplyTableIn3 = [];
			
			oModel.create("/TrainingOutApplySet", sendObject, {
				success: function(oData, oResponse) {
					
					if (oData && oData.TrainingOutApplyTableIn1) { //값을 제대로 받아 왔을 때
						var dataLength = 10;
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
				oController.getAttTable(oCopyRow, "1");
				oController.getCodeList(oCopyRow);
				oController.onBeforeOpenDetailDialog("app");
				oController._ApplyModel.open();
			}else {
				oController.getAttTable(oCopyRow, "2");
				oController.getCodeList(oCopyRow);
				oController.getCodeList2(oCopyRow);
				oController.onBeforeOpenDetailDialog();
				oController._ReportModel.open();
			}
		},

		onPressAppBtn: function() { // 신청서 작성
			var oView = $.app.byId("ZUI5_HR_OutCompEdu.OutCompEdu");

			this.ApplyModel.setData({FormData: []});
			
			if (!this._ApplyModel) {
				this._ApplyModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ReportApp", this);
				oView.addDependent(this._ApplyModel);
			}
			var oAttTable = $.app.byId(this.PAGEID + "_AttTable");
			
			this.ApplyModel.setProperty("/FormData/Planx", this.getBundleText("MSG_40004"));
			this.ApplyModel.setProperty("/FormData/Natio", "1");
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

			this.getCodeList();
			this.getTypeCombo(false);
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
			oCopyRow.Appnm = "";

			if (!this._ReportModel) {
				this._ReportModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ResultReport", this);
				oView.addDependent(this._ReportModel);
			}
			
			this.ApplyModel.setData({FormData: oCopyRow});
			this.getAttTable(oCopyRow, "2");
			this.getCodeList(oCopyRow);
			this.getCodeList2();
			this.onBeforeOpenDetailDialog();
			this._ReportModel.open();
		},

		onDInput: function(oEvent) { // 직접입력 CheckBox
			var vIs =  oEvent === true ? oEvent : oEvent.getSource().getSelected();
			if(vIs){
				this.ApplyModel.setProperty("/TraningCheck", "Y");
				this.ApplyModel.setProperty("/Checked", "X");
			}else{
				this.ApplyModel.setProperty("/TraningCheck", "X");
				this.ApplyModel.setProperty("/Checked", "");
				this.ApplyModel.setProperty("/FormData/Edkaj", ""); // 교육과정
				this.ApplyModel.setProperty("/FormData/Zgtype", ""); // 교육구분
				this.ApplyModel.setProperty("/FormData/Edgub", ""); // 교육유형
				this.ApplyModel.setProperty("/FormData/Optin", ""); // 필수/선택
				this.ApplyModel.setProperty("/FormData/Rules", ""); // 법정/일반
				this.ApplyModel.setProperty("/FormData/Course", ""); // 교육코드
			}
			this.getTypeCombo(vIs);
		},

		RegistTraning: function() { // 교육과정 Dialog			
			var oView = $.app.byId("ZUI5_HR_OutCompEdu.OutCompEdu");
			
			if (!this._TraningModel) {
				this._TraningModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.TraningRegist", this);
				oView.addDependent(this._TraningModel);
			}
			// var oInput = $.app.byId(this.PAGEID + "DTrainingInput");

			// oInput.setValue("");
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

			var sendObject = {};
			// Header
			sendObject.IBukrs = vBukrs2;
			sendObject.IName = oInput.getValue();
			// Navigation property
			sendObject.TrainingEventtypeTableIn = [];
			
			oModel.create("/TrainingEventtypeSet", sendObject, {
				success: function(oData, oResponse) {
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

			oController.ApplyModel.setProperty("/FormData/Course", oRowData.Objid ); // 교육코드
			oController.ApplyModel.setProperty("/FormData/Edkaj", oRowData.Stext); // 교육과정
			oController.ApplyModel.setProperty("/FormData/Zgtype", oRowData.Zgtype); // 교육구분
			oController.ApplyModel.setProperty("/FormData/Edgub", oRowData.Edgub); // 교육유형
			oController.ApplyModel.setProperty("/FormData/Optin", oRowData.Optin); // 필수/선택
			oController.ApplyModel.setProperty("/FormData/Rules", oRowData.Rules); // 법정/일반
			oController._TraningModel.close();
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
							oController.onTableSearch();
							BusyIndicator.hide();
							var vUrl = oData.TrainingOutApplyExport.results[0].EUrl;
							if(!Common.openPopup.call(oController, vUrl)) {
								window.open(
									vUrl,
									"_blank",
									"height = 600, width = 900"
								);
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

		getAttTable: function(oRowData, Gubun) { // 참석자 정보 받아옴
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
			sendObject.IBegda = Common.adjustGMTOdataFormat(vBDate);
			sendObject.IEndda = Common.adjustGMTOdataFormat(vEDate);
			sendObject.IEdoty = vGubun === "ALL" ? "" : vGubun;
			sendObject.IEdsta = vStatus === "ALL" ? "" : vStatus;
			sendObject.IRepst = vIsReport === "ALL" ? "" : vIsReport;
			// Navigation property
			sendObject.TrainingOutApplyTableIn1 = [Common.copyByMetadata(oModel, "TrainingOutApplyTableIn1", oRowData)];
			sendObject.TrainingOutApplyTableIn2 = [];
			sendObject.TrainingOutApplyTableIn3 = [];
			
			oModel.create("/TrainingOutApplySet", sendObject, {
				success: function(oData, oResponse) {
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

		getTypeCombo: function(IsVal) { // 교육유형만 가져오는곳
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
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 교육유형
				success: function(oData, oResponse) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });

						if(IsVal){
							var oList2 = [];
							
							oData.NavCommonCodeList.results.forEach(function(e, i) {
								if(e.Sortk !== "999"){
									oList2.push(e);
								}
							});
							oController.ApplyModel.setProperty("/TypeCombo", oList2);
						}else
							oController.ApplyModel.setProperty("/TypeCombo", oData.NavCommonCodeList.results);
						
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
						var vStatus = oController.ApplyModel.getProperty("/FormData/Status1");
						var vEdoty = oController.ApplyModel.getProperty("/FormData/Edoty");
						var vRepstT = oController.ApplyModel.getProperty("/FormData/RepstT");

						oData.NavCommonCodeList.results.unshift({ Code: "Null", Text: oController.getBundleText("LABEL_40062") });

						if((Common.checkNull(vStatus) || vStatus === "AA") && Common.checkNull(vRepstT) && (Common.checkNull(vEdoty) || vEdoty === "1")){
							var oList2 = [];
							
							oData.NavCommonCodeList.results.forEach(function(e, i) {
								if(e.Sortk !== "999"){
									oList2.push(e);
								}
							});
							oController.ApplyModel.setProperty("/TypeCombo", oList2);
						}else{
							oController.ApplyModel.setProperty("/TypeCombo", oData.NavCommonCodeList.results);
						}
						
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
			var oController = $.app.getController();

                return oController.setSelectionTagets(data);
            },

		displayMultiOrgSearchDialog: function(oEvent) {
			return OrgOfIndividualHandler.openOrgSearchDialog(oEvent);
		},

		onPressAddRow: function(oEvent) { // 참석자 추가
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

			if(oAtt.some(function(e) {return e.Pernr === data.Pernr}) || oController.getUserId() === data.Pernr) {
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
				this.ApplyModel.setProperty(vPath + "/Natio", "01");
			}else{
				this.ApplyModel.setProperty(vPath + "/Natio", "02");
			}
		},

		ErrorCheck: function() {
			var oController = $.app.getController();

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Edkaj"))){ // 교육과정
				MessageBox.error(oController.getBundleText("MSG_40013"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}else if(oController.ApplyModel.getProperty("/Checked") === "X"){
				oController.ApplyModel.setProperty("/FormData/Course", "");
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

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Trtim"))){ // 학습시간
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

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Planx"))){ // 전담교육
				MessageBox.error(oController.getBundleText("MSG_40024"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "001") === 0){
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
				if(Common.checkNull(e.__metadata))
					oAttList1.Pernr = e.Pernr;
				else
					oAttList1.Pernr = e.Pernr;

				oAttList2.push(Common.copyByMetadata(oModel, "TrainingOutApplyTableIn2", oAttList1));
			});

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_40022")) { //저장
					
					// 첨부파일 저장
					oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, ["001"]);
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
						success: function(oData, oResponse) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40010"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_40009"), {
				title: oController.getBundleText("LABEL_40001"),
				actions: [oController.getBundleText("LABEL_40022"), oController.getBundleText("LABEL_00119")],
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

				if(Common.checkNull(e.__metadata))
					oAttList1.Pernr = e.Pernr;
				else
					oAttList1.Pernr = e.Pernr;

				oAttList2.push(Common.copyByMetadata(oModel, "TrainingOutApplyTableIn2", oAttList1));
			});
			
			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				//저장 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_40022")) { //저장
										
					// 첨부파일 저장
					oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, ["001"]);
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

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Plcon"))){ // 전달교육 내용요약
				MessageBox.error(oController.getBundleText("MSG_40038"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Plimp"))){ // 직무개선 방안요약
				MessageBox.error(oController.getBundleText("MSG_40039"), { title: oController.getBundleText("MSG_08107")});
				return ;
			}

			if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "003") === 0){
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
				if (fVal && fVal == oController.getBundleText("LABEL_40022")) { // 저장
					
					// 첨부파일 저장
					var uFiles = [];
					for(var i=2; i<4; i++)	uFiles.push("00" + i);

					if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "004") !== 0) uFiles.push("004");
					
					oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);
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
						success: function(oData, oResponse) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_40010"), { title: oController.getBundleText("MSG_08107")});
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
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 교육안내문
					Required: true,
					Appnm: vAppnm,
					Mode: "S",
					InfoMessage: vInfoMessage,
					Editable: (!vStatus || vStatus === "AA") ? true : false
				},"001");
			}else {
				var vAppnm1 = "",
					vAppnm2 = "",
					vAppnm3 = "";

				oController.ApplyModel.getProperty("/FileData").forEach(function(e) {
					switch(e.Cntnm) {
						case "002" : vAppnm1 = e.Appnm; break;
						case "003" : vAppnm2 = e.Appnm; break;
						case "004" : vAppnm3 = e.Appnm; break;
					}
				});

				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 내용요약
					Appnm: Common.checkNull(!vAppnm1) ? vAppnm1 : vAppnm,
					Mode: "S",
					UseMultiCategories: true,
					Editable: (Common.checkNull(vRepstT) && ((vStatus === "AA" && vEdoty === "2") || (vStatus === "99" && vEdoty === "1"))) ? true : false
				},"002");
				
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 방안요약
					Required: true,
					Appnm: Common.checkNull(!vAppnm2) ? vAppnm2 : vAppnm,
					Mode: "S",
					UseMultiCategories: true,
					Editable: (Common.checkNull(vRepstT) && ((vStatus === "AA" && vEdoty === "2") || (vStatus === "99" && vEdoty === "1"))) ? true : false
				},"003");
	
				fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 수료증
					Appnm: Common.checkNull(!vAppnm3) ? vAppnm3 : vAppnm,
					Mode: "S",
					UseMultiCategories: true,
					Editable: (Common.checkNull(vRepstT) && ((vStatus === "AA" && vEdoty === "2") || (vStatus === "99" && vEdoty === "1"))) ? true : false
				},"004");
			}
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35129354"}); // 35129354
		} : null
	});
});