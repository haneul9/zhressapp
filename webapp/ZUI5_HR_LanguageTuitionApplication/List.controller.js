/* eslint-disable no-undef */
sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/util/File"
	], 
	function (Common, CommonController, JSONModelHelper, PageHelper, MessageBox, BusyIndicator, File) {
	"use strict";

	
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "List",
		
		TableModel: new JSONModelHelper(),
		DetailModel: new JSONModelHelper(),
		GradeModel: new JSONModelHelper(),
		UploadFileModel: new JSONModelHelper(),
		TuitionSearchModel: new JSONModelHelper(),
		
		getUserId: function() {

			return this.getView().getModel("session").getData().name;
		},
		
		getUserGubun  : function() {

			return this.getView().getModel("session").getData().Bukrs2;
		},

		getUserGubun3  : function() {

			return this.getView().getModel("session").getData().Bukrs3;
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
			this.onTableSearch();
		},
		
		getDateFormatter1: function() {
			return new sap.ui.commons.TextView({
				text: {
					parts: [{ path: "Lecbe" }, { path: "Lecen" }],
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

		getDateFormatter2: function() {
			return new sap.ui.commons.TextView({
				text: {
					parts: [{ path: "Supbg" }, { path: "Supen" }],					
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

		getStatus: function() {
			var oController = $.app.getController();

				return 	new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.ui.commons.TextView({ //처리결과에 결재완료
							text : "{StatusT}", 
							textAlign : "Center",
							visible : {
								path : "Status", 
								formatter : function(fVal){
									if(fVal !== "AA") return true;
									else return false;
								}
							}
						})
						.addStyleClass("font-14px font-regular mt-4px"),
						new sap.m.FlexBox({
							justifyContent: "Center",
							items: [
								new sap.ui.commons.TextView({ //처리결과에 Text
									text : "{StatusT}", 
									textAlign : "Center"
								})
								.addStyleClass("font-14px font-regular mt-7px"),
								new sap.m.Button({ //처리결과에 삭제 버튼
									text: "{i18n>LABEL_29027}",
									press : oController.onPressCancel
								})
								.addStyleClass("button-light-sm ml-10px")
							],
							visible : {
								path : "Status", 
								formatter : function(fVal){
									if(fVal === "AA") return true;
									else return false;
								}
							}
						})
					]
				});
		},
        
        initDateCreate: function(oController) { // 년과 월로 따로 셋팅하는곳
            var vBukrs = oController.getUserGubun();
            
            oController.TuitionSearchModel.setData({
                        Data: { Zyear: "", Zmonth: "" },
                        Zyears: [],
                        Zmonths: [],
                        vBukrs: vBukrs
            });
            
            this.setTuitionZyears(this);
            this.setTuitionZmonths(this);
        },
        
        setTuitionZyears: function(oController) {
            var vZyear = new Date().getFullYear(),
                vConvertYear = "",
                aYears = [];

            vConvertYear = String(vZyear + 1);
            aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });

            Common.makeNumbersArray({length: 11}).forEach(function(idx) {
                vConvertYear = String(vZyear - idx);
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
			});

			oController.TuitionSearchModel.setProperty("/Data/Zyear1", vZyear-1);
			oController.TuitionSearchModel.setProperty("/Zyears1", aYears);
			
			vZyear = new Date().getFullYear(),
			vConvertYear = "",
			aYears = [];

            vConvertYear = String(vZyear + 1);
            aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });

            Common.makeNumbersArray({length: 11}).forEach(function(idx) {
                vConvertYear = String(vZyear - idx);
                aYears.push({ Code: vConvertYear, Text: vConvertYear + "년" });
            });

            oController.TuitionSearchModel.setProperty("/Data/Zyear2", vZyear);
            oController.TuitionSearchModel.setProperty("/Zyears2", aYears);
        },

        setTuitionZmonths: function(oController) {
            var vZmonth = new Date().getMonth() + 1,
                vConvertMonth = "",
                aMonths = [];

            Common.makeNumbersArray({length: 12, isZeroStart: false}).forEach(function(idx) {
                vConvertMonth = String(idx);
                aMonths.push({ Code: vConvertMonth, Text: vConvertMonth + "월" });
            });

            oController.TuitionSearchModel.setProperty("/Data/Zmonth1", vZmonth+1);
			oController.TuitionSearchModel.setProperty("/Zmonths1", aMonths);

			vZmonth = new Date().getMonth() + 1,
			vConvertMonth = "",
			aMonths = [];
			
            Common.makeNumbersArray({length: 12, isZeroStart: false}).forEach(function(idx) {
                vConvertMonth = String(idx);
                aMonths.push({ Code: vConvertMonth, Text: vConvertMonth + "월" });
            });

            oController.TuitionSearchModel.setProperty("/Data/Zmonth2", vZmonth);
            oController.TuitionSearchModel.setProperty("/Zmonths2", aMonths);
        },
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vZyear1 = oController.TuitionSearchModel.getProperty("/Data/Zyear1");
			var vZyear2 = oController.TuitionSearchModel.getProperty("/Data/Zyear2");
			var vMonth1 = oController.TuitionSearchModel.getProperty("/Data/Zmonth1");
			var vMonth2 = oController.TuitionSearchModel.getProperty("/Data/Zmonth2");
			
			var bDate = new Date(vZyear1, vMonth1-1, 1);
			var eDate = new Date(vZyear2, vMonth2, 0);

			oController.TableModel.setData({Data: []}); //직접적으로 화면 테이블에 셋팅하는 작업

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IConType = "1";
			sendObject.IBegda = new Date(bDate.setDate(bDate.getDate()+1));
			sendObject.IEndda = new Date(eDate.setDate(eDate.getDate()+1));
			sendObject.IBukrs = vBukrs2;
			// Navigation property
			sendObject.LanguPayApplyExport = [];
			sendObject.LanguPayApplyTableIn = [];
			sendObject.LanguPayApplyTableIn3 = [];
			
			oModel.create("/LanguPayApplySet", sendObject, {
				success: function(oData, oResponse) {
					
					if (oData && oData.LanguPayApplyTableIn) { //값을 제대로 받아 왔을 때
						var dataLength = 10;
						Common.log(oData);
						var rDatas1 = oData.LanguPayApplyTableIn.results;
						dataLength = rDatas1.length;
						oController.TableModel.setData({Data: rDatas1}); //직접적으로 화면 테이블에 셋팅하는 작업
					}
					
					oTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength); //rowcount가 10개 미만이면 그 갯수만큼 row적용

					oController.TuitionSearchModel.setProperty("/ExportData", oData.LanguPayApplyExport.results[0]);
					oController.UploadFileModel.setProperty("/FileData", oData.LanguPayApplyTableIn3.results);
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
			var oView = $.app.byId("ZUI5_HR_LanguageTuitionApplication.List"),
				oController = $.app.getController();
			var oPath = oEvent.mParameters.rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(oPath);
			
			var oCopyRow = $.extend(true, {}, oRowData);

			if (!oController._ApplyModel) {
				oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_LanguageTuitionApplication.fragment.TuitionApply", oController);
				oView.addDependent(oController._ApplyModel);
			}

			var oPeriodDate = $.app.byId(oController.PAGEID + "_PeriodDate");
			
			oPeriodDate.setEditable(false);

			oController.DetailModel.setData({FormData: oCopyRow});
			oController.DetailModel.setProperty("/FormData/Lecbet", Common.numberWithCommas(oCopyRow.Lecbet));
			
			oController.getComboData();

			oController.onBeforeOpenDetailDialog();
			oController._ApplyModel.open();
		},
		
		onPressCancel: function(oEvent) { // Row삭제
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oPath = oEvent.getSource().oParent.oParent.oParent.oBindingContexts.undefined.getPath();
			var oRowData = oController.TableModel.getProperty(oPath);

			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_29027")) { //삭제
					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IConType = "4";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.LanguPayApplyExport = [];
					sendObject.LanguPayApplyTableIn = [Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oRowData)];
					sendObject.LanguPayApplyTableIn3 = [];
					
					oModel.create("/LanguPayApplySet", sendObject, {
						success: function(oData, oResponse) {
							Common.log(oData);
							oController.onTableSearch();
							BusyIndicator.hide();
							sap.m.MessageBox.alert(oController.getBundleText("MSG_29006"), { title: oController.getBundleText("MSG_08107")});
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
				onClose: onProcessApply
			});
		},

		onPressMenuBtn: function(oEvent) { // 메뉴얼 (가이드 문서 다운로드)
			var vBukrs3 = this.getUserGubun3();

			if(vBukrs3 === "A100")
				window.open("./ZUI5_HR_LanguageTuitionApplication/manual/LCC_FOREIGNLANG_MANUAL.pptx");
			else
				window.open("./ZUI5_HR_LanguageTuitionApplication/manual/LCC_FOREIGNLANG_MANUAL.pptx");
        },
        onPressReqBtn: function(oEvent) { // 신청 
			var oView = $.app.byId("ZUI5_HR_LanguageTuitionApplication.List"),
				oController = $.app.getController();

			oController.DetailModel.setData({FormData: []});
			oController.DetailModel.setProperty("/FormData/Kostl", "");
			oController.DetailModel.setProperty("/FormData/Suport", oController.TuitionSearchModel.getProperty("/ExportData/EPay"));

			if (!oController._ApplyModel) {
				oController._ApplyModel = sap.ui.jsfragment("ZUI5_HR_LanguageTuitionApplication.fragment.TuitionApply", oController);
				oView.addDependent(oController._ApplyModel);
			}

			var oPeriodDate = $.app.byId(oController.PAGEID + "_PeriodDate");
			oPeriodDate.setEditable(true);

			oController.getComboData();
			oController.onBeforeOpenDetailDialog();
			
			oController._ApplyModel.open();
		},

		getComboData: function() {
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();

			oController.DetailModel.setProperty("/CostCombo", []);
			oController.DetailModel.setProperty("/WBSCombo", []);

			var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "998";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "16";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 원가코드
				success: function(oData, oResponse) {
					if(oData && oData.NavCommonCodeList){
						oController.DetailModel.setProperty("/CostCombo", oData.NavCommonCodeList.results);
						oController.DetailModel.setProperty("/FormData/Kostl", oData.NavCommonCodeList.results[0].Code);
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
			sendObject.ICodeT = "998";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "17";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // WBS
				success: function(oData, oResponse) {
					if(oData && oData.NavCommonCodeList){
						oController.DetailModel.setProperty("/WBSCombo", oData.NavCommonCodeList.results);
						oController.DetailModel.setProperty("/FormData/Plstx", oData.NavCommonCodeList.results[0].Code);
					}
				},
				error: function(oResponse) {
					Common.log(oResponse);
				}
			});
		},

		getSupPeriod: function() { // 지원기간값 가져옴
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();

			var oSendDate = {};
			oSendDate.Lecbe =  Common.adjustGMTOdataFormat(oController.DetailModel.getProperty("/FormData/Lecbe"));
			oSendDate.Lecen =  Common.adjustGMTOdataFormat(oController.DetailModel.getProperty("/FormData/Lecen"));
			
			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Zlangu"))) return;

			var	sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IConType = "5";
			sendObject.IZlangu = oController.DetailModel.getProperty("/FormData/Zlangu");
			// Navigation property
			sendObject.LanguPayApplyExport = [];
			sendObject.LanguPayApplyTableIn = [oSendDate];
			
			oModel.create("/LanguPayApplySet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.LanguPayApplyExport) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						oController.DetailModel.setProperty("/FormData/Supbg", oData.LanguPayApplyExport.results[0].ESupbg);
						oController.DetailModel.setProperty("/FormData/Supen", oData.LanguPayApplyExport.results[0].ESupen);
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

		getSuportPrice: function(oEvent) { //지원금액 Change
			var oController = $.app.getController();
			var inputValue = oEvent.getParameter('value').trim(),
				convertValue = inputValue.replace(/[^\d]/g, '');

			//oController.DetailModel.setProperty("/FormData/Lecbet", convertValue);
			oEvent.getSource().setValue(common.Common.numberWithCommas(convertValue));

			var vClassPay = Number(oController.DetailModel.getProperty("/FormData/Lecbet").replace(/,/g, "")); // 수강금액
			var vPay = Number(oController.TuitionSearchModel.getProperty("/ExportData/EPay")); // 사번의 지원금액
			
			if(vClassPay > vPay || vClassPay === 0) oController.DetailModel.setProperty("/FormData/Suport", String(vPay));
			else oController.DetailModel.setProperty("/FormData/Suport", String(vClassPay));
		},

		ErrorCheck: function() {
			var oController = $.app.getController();
			var oCostCombo = $.app.byId(oController.PAGEID + "_CostCombo");

			if(Common.checkNull(oCostCombo.getSelectedKey())){
				MessageBox.error(oController.getBundleText("MSG_29007"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Lecen"))){
				MessageBox.error(oController.getBundleText("MSG_29008"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Zlaorg"))){
				MessageBox.error(oController.getBundleText("MSG_29010"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Latell"))){
				MessageBox.error(oController.getBundleText("MSG_29011"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Caldt"))){
				MessageBox.error(oController.getBundleText("MSG_29013"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Lecbet"))){
				MessageBox.error(oController.getBundleText("MSG_29015"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "001") === 0) {
				MessageBox.error(oController.getBundleText("MSG_29017"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			if(fragment.COMMON_ATTACH_FILES.getFileLength(oController, "002") === 0) {
				MessageBox.error(oController.getBundleText("MSG_29021"), { title: oController.getBundleText("MSG_08107")});
				return true;
			}

			return false;
		},
		
		onDialogSearchBtn: function() { //Dialog 어학성적 조회
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oGradeTable = $.app.byId(oController.PAGEID + "_GradeTable");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vZlangu = oController.GradeModel.getProperty("/Data/Zlangu");
			var vZltype = oController.GradeModel.getProperty("/Data/Zltype");
			var vITepas = oController.GradeModel.getProperty("/Data/ITepas");

			oController.GradeModel.setProperty("/TableData", []);

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs2;
			sendObject.IZlangu = (vZlangu === "ALL") ? "" : vZlangu;
			sendObject.IZltype = (vZltype === "ALL") ? "" : vZltype;
			sendObject.ITepas = (vITepas === "ALL") ? "" : vITepas;
			// Navigation property
			sendObject.LanguScoreTableIn = [];
			
			oModel.create("/LanguScoreImportSet", sendObject, {
				success: function(oData, oResponse) {
					Common.log(oData);
					var dataLength = 10;
					if(oData && oData.LanguScoreTableIn){
						var rDatas1 = oData.LanguScoreTableIn.results;
						dataLength = rDatas1.length;
						oController.GradeModel.setProperty("/TableData", oData.LanguScoreTableIn.results); 
					}
					// oController.onDialogCode();
					oGradeTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		onGradeVal: function(oEvent) { // Dialog 어학성적
			var oView = $.app.byId("ZUI5_HR_LanguageTuitionApplication.List"),
				oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			
			oController.GradeModel.setProperty("/TableData", []);
			
			if(Common.checkNull(oController.DetailModel.getProperty("/FormData/Lecbe"))){
				MessageBox.error(oController.getBundleText("MSG_29008"), { title: oController.getBundleText("MSG_08107")});
				return;
			}

			if (!oController._GradeModel) {
				oController._GradeModel = sap.ui.jsfragment("ZUI5_HR_LanguageTuitionApplication.fragment.TuitionSearch", oController);
				oView.addDependent(oController._GradeModel);
			}
			var oGradeTable = $.app.byId(oController.PAGEID + "_GradeTable");
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			// Navigation property
			sendObject.LanguScoreTableIn = [];
			
			oModel.create("/LanguScoreImportSet", sendObject, {
				success: function(oData, oResponse) {
					if(oData && oData.LanguScoreTableIn){
						var dataLength = 10;
						var rDatas1 = oData.LanguScoreTableIn.results;
						dataLength = rDatas1.length;
						oController.GradeModel.setProperty("/TableData", oData.LanguScoreTableIn.results);
						oController.onDialogCode();
						oController._GradeModel.open();
					}
					oGradeTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength);
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		onSelectedGradeRow: function(oEvent) {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oPath = oEvent.mParameters.rowBindingContext.getPath();
			var vZyear1 = oController.TuitionSearchModel.getProperty("/Data/Zyear1");
			var vZyear2 = oController.TuitionSearchModel.getProperty("/Data/Zyear2");
			var vMonth1 = oController.TuitionSearchModel.getProperty("/Data/Zmonth1");
			var vMonth2 = oController.TuitionSearchModel.getProperty("/Data/Zmonth2");
			
			var bDate = new Date(vZyear1, vMonth1-1, 1);
			var eDate = new Date(vZyear2, vMonth2, 0);

			if(oController.GradeModel.getProperty(oPath).Targetc === "N") return;

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IConType = "7";
			sendObject.IBegda = new Date(bDate.setDate(bDate.getDate()+1));
			sendObject.IEndda = new Date(eDate.setDate(eDate.getDate()+1));
			sendObject.IBukrs = vBukrs2;
			// Navigation property
			sendObject.LanguPayApplyTableIn = [];
			sendObject.LanguPayApplyTableIn4 = [Common.copyByMetadata(oModel, "LanguPayApplyTableIn4", oController.GradeModel.getProperty(oPath))];
			
			oModel.create("/LanguPayApplySet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.LanguPayApplyTableIn) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						oController.DetailModel.setProperty("/FormData/ZlanguTxt", oData.LanguPayApplyTableIn.results[0].ZlanguTxt);
						oController.DetailModel.setProperty("/FormData/Zlangu", oData.LanguPayApplyTableIn.results[0].Zlangu);
						oController.DetailModel.setProperty("/FormData/Zlangu2Txt", oData.LanguPayApplyTableIn.results[0].ZlanguTxt);
						oController.DetailModel.setProperty("/FormData/Zlangu2", oData.LanguPayApplyTableIn.results[0].Zlangu);
						oController.DetailModel.setProperty("/FormData/ZltypeTxt", oData.LanguPayApplyTableIn.results[0].ZltypeTxt);
						oController.DetailModel.setProperty("/FormData/Zltype", oData.LanguPayApplyTableIn.results[0].Zltype);
						oController.DetailModel.setProperty("/FormData/Acqpot", oData.LanguPayApplyTableIn.results[0].Acqpot ? oData.LanguPayApplyTableIn.results[0].Acqpot : "");
						oController.DetailModel.setProperty("/FormData/AcqgrdT", oData.LanguPayApplyTableIn4.results[0].AcqgrdTxt ? oData.LanguPayApplyTableIn4.results[0].AcqgrdTxt : "");
						oController.DetailModel.setProperty("/FormData/Acqgrd", oData.LanguPayApplyTableIn.results[0].Acqgrd ? oData.LanguPayApplyTableIn.results[0].Acqgrd : "");
						oController.getSupPeriod();
						oController._GradeModel.close();
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

		onDialogCode: function() {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oCommonModel = $.app.getModel("ZHR_COMMON_SRV");

			oController.GradeModel.setProperty("/TestCombo", []);
			oController.GradeModel.setProperty("/Data", { Zlangu: null, Zltype: null, ITepas: null });

			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "004";
			sendObject.IBukrs = vBukrs2;
			sendObject.ICodty = "ZHRD_TEPAS";
			// Navigation property
			sendObject.NavCommonCodeList = [];
			
			oCommonModel.create("/CommonCodeListHeaderSet", sendObject, { // 이수여부
				success: function(oData, oResponse) {
					if(oData && oData.NavCommonCodeList){
						oData.NavCommonCodeList.results.unshift({Code: "ALL", Text: oController.getBundleText("LABEL_29043")});
						oController.GradeModel.setProperty("/CompleteCombo", oData.NavCommonCodeList.results);
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
			sendObject.ICodeT = "1";
			// Navigation property
			sendObject.LanguPayApplyF4TableIn = [];
			
			oModel.create("/LanguPayApplyF4ImportSet", sendObject, { // 어학구분
				success: function(oData, oResponse) {
					if(oData && oData.LanguPayApplyF4TableIn){
						oData.LanguPayApplyF4TableIn.results.unshift({Code: "ALL", Text: oController.getBundleText("LABEL_29043")});
						oController.GradeModel.setProperty("/LanguCombo", oData.LanguPayApplyF4TableIn.results);
						oController.GradeModel.setProperty("/TestCombo", [{Code: "ALL", Text: oController.getBundleText("LABEL_29043")}]);
						
						oController.GradeModel.setProperty("/Data/Zlangu", "ALL");
						oController.GradeModel.setProperty("/Data/Zltype", "ALL");
						oController.GradeModel.setProperty("/Data/ITepas", "ALL");
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

		onDialogGubun: function(oEvent) { // Dialog 어학구분
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.ICodeT = "2";
			sendObject.ICode = oController.GradeModel.getProperty("/Data/Zlangu");
			// Navigation property
			sendObject.LanguPayApplyF4TableIn = [];
			
			oModel.create("/LanguPayApplyF4ImportSet", sendObject, {
				success: function(oData, oResponse) {
					if(oData && oData.LanguPayApplyF4TableIn){
						oController.GradeModel.setProperty("/TestCombo", oData.LanguPayApplyF4TableIn.results);
						oController.GradeModel.getProperty("/TestCombo").unshift({Code: "ALL", Text: oController.getBundleText("LABEL_29043")});
						oController.GradeModel.setProperty("/TestCombo", oController.GradeModel.getProperty("/TestCombo"));
						oController.GradeModel.setProperty("/Data/Zltype","ALL");
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

		onDialogApplyBtn: function() { // Dialog 신청 
			var oController = $.app.getController();
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oSendData = oController.DetailModel.getProperty("/FormData");

			if(oController.ErrorCheck()) return;
			
			oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");
			oSendData.Waers = "KRW";
			
			BusyIndicator.show(0);
			var onProcessApply = function (fVal) {
				//신청 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_29044")) { //신청
					
					// 첨부파일 저장
					var uFiles = [];
					for(var i=1; i<3; i++)	uFiles.push("00" + i);

					oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);

					var sendObject = {};
					// Header
					sendObject.IPernr = vPernr;
					sendObject.IEmpid = vPernr;
					sendObject.IConType = "3";
					sendObject.IBukrs = vBukrs2;
					// Navigation property
					sendObject.LanguPayApplyTableIn = [
						$.extend(true, Common.copyByMetadata(oModel, "LanguPayApplyTableIn", oSendData), {
							Lecen: new Date(oController.DetailModel.getProperty("/FormData/Lecen"))
						})
					];
					
					oModel.create("/LanguPayApplySet", sendObject, {
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
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oSendData = oController.DetailModel.getProperty("/FormData");

			if(oController.ErrorCheck()) return;
			
			oSendData.Lecbet = oSendData.Lecbet.replace(/,/g, "");
			
			BusyIndicator.show(0);
			var onProcessSave = function (fVal) {
				//저장 클릭시 발생하는 이벤트
				if (fVal && fVal == oController.getBundleText("LABEL_29026")) { //저장
					
					// 첨부파일 저장
					var uFiles = [];
					for(var i=1; i<3; i++)	uFiles.push("00" + i);

					oSendData.Appnm = fragment.COMMON_ATTACH_FILES.uploadFiles.call(oController, uFiles);

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
					
					oModel.create("/LanguPayApplySet", sendObject, {
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
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var oSendData = oController.DetailModel.getProperty("/FormData");
			
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
					
					oModel.create("/LanguPayApplySet", sendObject, {
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
			var vStatus = oController.DetailModel.getProperty("/FormData/Status"),
				vAppnm = oController.DetailModel.getProperty("/FormData/Appnm") || "";
			
			fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 영수증
				Label: oController.getBundleText("LABEL_29020"),
				Required : true,
				Appnm: vAppnm,
				Mode: "S",
				UseMultiCategories: true,
				Editable: (!vStatus || vStatus === "AA") ? true : false
			},"001");
			
			fragment.COMMON_ATTACH_FILES.setAttachFile(oController, { // 수강학원증
				Label: oController.getBundleText("LABEL_29021"),
				Required : true,
				Appnm: vAppnm,
				Mode: "S",
				UseMultiCategories: true,
				Editable: (!vStatus || vStatus === "AA") ? true : false
			},"002");
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35117216"}); // 20075008 35117216
		} : null
	});
});