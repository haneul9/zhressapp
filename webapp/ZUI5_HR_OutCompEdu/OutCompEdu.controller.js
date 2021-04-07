sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/AttachFileAction",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/EmployeeModel",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/util/File",
	], 
	function (Common, CommonController, AttachFileAction, JSONModelHelper, PageHelper, EmployeeModel, MessageBox, BusyIndicator, File) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "OutCompEdu",
		
		TableModel: new JSONModelHelper(),
		ApplyModel: new JSONModelHelper(),
		SearchModel: new JSONModelHelper(),
		AttModel: new JSONModelHelper(),
		EmployeeModel: new EmployeeModel(),
		
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
            
			this.EmployeeModel.retrieve(this.getSessionInfoByKey("name"));
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
			return "";
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
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vZyear1 = oController.SearchModel.getProperty("/Data/Zyear1");
			var vMonth1 = oController.SearchModel.getProperty("/Data/Zmonth1");
			var vGubun = oController.SearchModel.getProperty("/Data/Gubun");
			var vStatus = oController.SearchModel.getProperty("/Data/Status");
			var vIsReport = oController.SearchModel.getProperty("/Data/IsReport");

			oController.TableModel.setData({Data: []}); //직접적으로 화면 테이블에 셋팅하는 작업

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

			if (!oController._ApplyModel) {
				oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_OutCompEdu.fragment.ReportApp", oController);
				oView.addDependent(oController._ApplyModel);
			}

			oController.onBeforeOpenDetailDialog();
			oController._ApplyModel.open();
		},

		onPressAppBtn: function() {

		},

		onPressRepBtn: function() {

		},

		onPressReqBtn: function() {

		},

		onPressDelBtn: function() {

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

		onPressAddRow: function(oEvent) { // 참석자 추가

		},

		onPressDelRow: function(oEvent) { // 참석자 삭제

		},

		onChangeRadio: function(oEvent) {

		},

		ErrorCheck: function() {
			var oController = $.app.getController();
			var oCostCombo = $.app.byId(oController.PAGEID + "_CostCombo");

			if(Common.checkNull(oCostCombo.getSelectedKey())){
				MessageBox.error(oController.getBundleText("MSG_29007"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Lecen"))){
				MessageBox.error(oController.getBundleText("MSG_29008"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Zlaorg"))){
				MessageBox.error(oController.getBundleText("MSG_29010"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Latell"))){
				MessageBox.error(oController.getBundleText("MSG_29011"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Caldt"))){
				MessageBox.error(oController.getBundleText("MSG_29013"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.ApplyModel.getProperty("/FormData/Lecbet"))){
				MessageBox.error(oController.getBundleText("MSG_29015"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(AttachFileAction.getFileLength(oController) <= 1) {
				MessageBox.error(oController.getBundleText("MSG_29012"), { title: oController.getBundleText("MSG_08107")});
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

			if(oController.ErrorCheck()) return;
			
			oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");
			oSendData.Waers = "KRW";
			
			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				//신청 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_29044")) { //신청
					
					// 첨부파일 저장
					oSendData.Appnm = AttachFileAction.uploadFile.call(oController);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IConType = "3";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.LanguPayApplyTableIn = [
						$.extend(true, Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData), {
							Lecen: new Date(oController.ApplyModel.getProperty("/FormData/Lecen"))
						})
					];
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							Common.log(oData);
							sap.m.MessageBox.alert(oController.getBundleText("MSG_29019"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_29018"), {
				title: oController.getBundleText("LABEL_29001"),
				actions: [oController.getBundleText("LABEL_29044"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessApply
			});
		},
		
		onDialogSaveBtn: function(oEvent) { // Dialog 저장
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");

			if(oController.ErrorCheck()) return;
			
			oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");
			
			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				//저장 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_29026")) { //저장
					
					// 첨부파일 저장
					oSendData.Appnm = AttachFileAction.uploadFile.call(oController);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IConType = "2";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.LanguPayApplyExport = [];
					sendObject.LanguPayApplyTableIn = [Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData)];
					sendObject.LanguPayApplyTableIn3 = [];
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							Common.log(oData);
							oController.onTableSearch();
							BusyIndicator.hide();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_29004"), { title: oController.getBundleText("MSG_08107")});
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_29003"), {
				title: oController.getBundleText("LABEL_29001"),
				actions: [oController.getBundleText("LABEL_29026"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessSave
			});
		},

		onDialogDelBtn: function(oEvent) { // Dialog 삭제
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_TRAINING_SRV");
			var oSendData = oController.ApplyModel.getProperty("/FormData");
			
			oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");
			
			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				//삭제 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_29027")) { // 삭제
					
					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IConType = "4";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.LanguPayApplyTableIn = [Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData)];
					
					oModel.create("/TrainingOutApplySet", sendObject, {
						success: function(oData, oResponse) {
							Common.log(oData);
							oController.onTableSearch();
							BusyIndicator.hide();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_29006"), { title: oController.getBundleText("MSG_08107")});
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
				title: oController.getBundleText("LABEL_29001"),
				actions: [oController.getBundleText("LABEL_29027"), oController.getBundleText("LABEL_00119")],
				onClose: onProcessDelete
			});
		},

		onBeforeOpenDetailDialog: function() {
			var oController = $.app.getController();
			var vStatus = oController.ApplyModel.getProperty("/FormData/Status"),
				vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "";
			
			fragment.COMMON_ATTACH_FILES.setAttachFile(oController, {
				Label: oController.getBundleText("LABEL_40043"),
				Required : true,
				Appnm: vAppnm,
				Mode: "S",
				Editable: (!vStatus || vStatus === "AA") ? true : false,
			},"001");
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35129354"}); // 35129354
		} : null
	});
});