sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/AttachFileAction",
	"../common/JSONModelHelper",
	"../common/PageHelper",
	"../common/EmployeeModel",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator"
	], 
	function (Common, CommonController, AttachFileAction, JSONModelHelper, PageHelper, EmployeeModel, MessageBox, BusyIndicator) {
	"use strict";

	/*  */
	return CommonController.extend($.app.APP_ID, {
		
		PAGEID: "Page",
		
		TableModel: new JSONModelHelper(),
		DetailModel: new JSONModelHelper(),
		TextViewModel: new JSONModelHelper(),
		EmployeeModel: new EmployeeModel(),
		
		getUserId: function() {

			return this.getView().getModel("session").getData().name;
		},
		
		getUserGubun  : function() {

			return this.getView().getModel("session").getData().Bukrs;
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
			var	oController = this.getView().getController();
			var oApplyDate = sap.ui.getCore().byId(oController.PAGEID + "_ApplyDate");
			
			oApplyDate.setDisplayFormat(this.getSessionInfoByKey("Dtfmt"));
			
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			this.EmployeeModel.retrieve(this.getSessionInfoByKey("name"));
			this.onTableSearch();
		},
		
		getStatusTxt: function() {
			var oController = $.app.getController();
			
			return 	new sap.m.FlexBox({
					justifyContent: "Center",
					items: [
						new sap.ui.commons.TextView({ //반려사유
							text : {
								path: "Status1",
								formatter: function(v) {
									var vText = "";
									switch(v){
										//신청
										case "00" : vText = oController.getBundleText("LABEL_23011"); break;
										//반려 
										case "88" : vText = oController.getBundleText("LABEL_23023"); break;
										//담당자확인
										case "90" : vText = oController.getBundleText("LABEL_23024"); break;
										//저장
										case "AA" : vText = oController.getBundleText("LABEL_23012"); break;
										//저장
										case "99" : vText = oController.getBundleText("LABEL_23025"); break;
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
						.addStyleClass("font-14px font-regular mt-8px "),
						new sap.m.Button({
							text : oController.getBundleText("LABEL_23022"), //삭제 
							press : oController.onPressDelete,
							visible: {
								path: "Status1",
								formatter: function(v) {
									if(v === "AA") return true;
									else return false;
								}
							}
						}).addStyleClass("ml-10px button-light-sm"),
						new sap.m.FormattedText({
							htmlText: {
								parts: [{ path: "UrlA1" }, { path: "Status1" }],
								formatter: function(v1, v2) {
									if(v2 === "99") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_23025") + "</a>"
									if(v2 === "00") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_23011") + "</a>"
									if(v2 === "90") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_23024") + "</a>"
									if(v2 === "88") return "<a href='" + v1 + "' style='color:blue !important'>" + oController.getBundleText("LABEL_23023") + "</a>"
									
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
		
		onTableSearch: function() {
			var oController = $.app.getController();
			var oTable = $.app.byId(oController.PAGEID + "_Table");
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oApplyDate = $.app.byId(oController.PAGEID + "_ApplyDate");
			var vDate1 = oApplyDate.getDateValue();
			var vDate2 = oApplyDate.getSecondDateValue();

			oController.TableModel.setData({Data: []});
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs2;
			sendObject.IBegda = Common.adjustGMTOdataFormat(vDate1);
			sendObject.IEndda = Common.adjustGMTOdataFormat(vDate2);
			// Navigation property
			sendObject.RegalsealExport = [];
			sendObject.RegalsealTableIn1 = [];
			
			oModel.create("/RegalsealImportSet", sendObject, {
				success: function(oData, oResponse) {
					var dataLength = 10;
					if (oData && oData.RegalsealTableIn1) { //값을 제대로 받아 왔을 때
						Common.log(oData);
						var rDatas1 = oData.RegalsealTableIn1.results;
						dataLength = rDatas1.length;
						oController.TableModel.setData({Data: rDatas1}); //직접적으로 화면 테이블에 셋팅하는 작업
					}
					
					oTable.setVisibleRowCount(dataLength > 10 ? 10 : dataLength); //rowcount가 10개 미만이면 그 갯수만큼 row적용
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},
		
		onPressSer: function() { //조회
			var oController = $.app.getController();
			
			oController.onTableSearch();
		},
		
		onPressReq: function() { //신청
			var oView = $.app.byId("ZUI5_HR_SealManagement.Page");
			var oController = $.app.getController();
			
			if (!oController._DetailModel) {
				oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_SealManagement.fragment.Apply", oController);
				oView.addDependent(oController._DetailModel);
			}
			
			// Data setting
			oController.DetailModel.setProperty("/Data", []);
			oController.ComboData();
			
			oController._DetailModel.open();
		},
		
		onSelectedRow: function(oEvent) {
			var oView = $.app.byId("ZUI5_HR_SealManagement.Page");
			var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();
			var oRowData = oController.TableModel.getProperty(vPath);
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			
			if(oEvent.mParameters.columnIndex === "6" && Common.checkNull(!oRowData.UrlA1)) return;

			oController.DetailModel.setProperty("/Data", []);
			
			if (!oController._DetailModel) {
				oController._DetailModel = sap.ui.jsfragment("ZUI5_HR_SealManagement.fragment.Apply", oController);
				oView.addDependent(oController._DetailModel);
			}
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IEmpid = vPernr;
			sendObject.IBukrs = vBukrs2;
			sendObject.ISeqnr = oRowData.Seqnr;
			sendObject.IConType = "1";
			sendObject.IDatum = oRowData.Appdt;
			// Navigation property
			sendObject.RegalsealRExport = [];
			sendObject.RegalsealRTableIn1 = [];
			
			oModel.create("/RegalsealRImportSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						oController.DetailModel.setProperty("/Data", oData.RegalsealRTableIn1.results[0]);
						oController.ComboData();
						oController._DetailModel.open();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},
		
		ComboData: function() {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.IPernr = vPernr;
			sendObject.IConType = "0";
			// Navigation property
			sendObject.RegalsealRExport = [];
			sendObject.RegalsealRTableIn2 = [];
			sendObject.RegalsealRTableIn3 = [];
			
			oModel.create("/RegalsealRImportSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData) { //값을 제대로 받아 왔을 때
						Common.log(oData);

						oController.DetailModel.setProperty("/MultiBoxData", oData.RegalsealRTableIn2.results); 
						oController.DetailModel.setProperty("/MultiBoxData2", oData.RegalsealRTableIn3.results);
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
		
		onErrorCheckBox: function() {
			var oController = $.app.getController();
			var oData = oController.DetailModel.getProperty("/Data");
			
			if(!oData.Sigbn){
				MessageBox.error(oController.getBundleText("MSG_23010"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};
			
			if(!oData.Sitype){
				MessageBox.error(oController.getBundleText("MSG_23012"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};
			
			if(!oData.Sidoc){
				MessageBox.error(oController.getBundleText("MSG_23013"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};
			
			if(!oData.Sito){
				MessageBox.error(oController.getBundleText("MSG_23014"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};
			
			if(!oData.Sireqtxt){
				MessageBox.error(oController.getBundleText("MSG_23015"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			};
			
			return false;
		},

		onInGamCombo: function(oEvent) { //인감구분 선택
			var oController = this;

			oController.DetailModel.setProperty("/Img", "");
			oController.DetailModel.getProperty("/MultiBoxData").some(function(elem) {
				oController.DetailModel.setProperty("/Img", elem.Imgid);
				return elem.Sigbn === oEvent.getSource().getSelectedKey();
			})
		},
		
		onDialogRequestBtn: function() { //신청
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oData = oController.DetailModel.getProperty("/Data"),
				oCopiedData = {};
			
			if(oController.onErrorCheckBox()) return;
			
			oCopiedData = Object.assign({}, oData);
			oCopiedData.Appdt = new Date();
			
			var sendObject = {
				IPernr: vPernr,
				IEmpid: vPernr,
				IBukrs: vBukrs2,
				IReqes: "X",
				IConType: "3",
				IDatum: new Date(),
				RegalsealRExport: [],
				RegalsealRTableIn1: [oCopiedData]
			};
			
			BusyIndicator.show(0);
			var onProcessRequest = function (fVal) {
					if (fVal && fVal == "신청") {
						oModel.create("/RegalsealRImportSet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							if (oData) { //값을 제대로 받아 왔을 때
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_23003"));
								oController._DetailModel.close();
								oController.onTableSearch();
								window.open(
									oData.RegalsealRExport.results[0].EUrl,
									"_blank",
									"height = 600, width = 900"
								);
								BusyIndicator.hide();
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
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_23002"), {
				title: oController.getBundleText("LABEL_23019"),
				actions: ["신청", "취소"],
				onClose: onProcessRequest
			});
		},
		
		onDialogSaveBtn: function() { //저장
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var oData = oController.DetailModel.getProperty("/Data"),
				oCopiedData = {};
			if(oController.onErrorCheckBox()) return;

			oCopiedData = Object.assign({}, oData);
			if(Common.checkNull(oCopiedData.Status1)) oCopiedData.Appdt = new Date();

			var sendObject = {
				IPernr: vPernr,
				IEmpid: vPernr,
				IBukrs: vBukrs2,
				IConType: Common.checkNull(oCopiedData.Status1) ? "3" : "2",
				IDatum: new Date(),
				RegalsealRTableIn1: [oCopiedData]
			};
			
			BusyIndicator.show(0);
			var onProcessSave= function (fVal) {
					if (fVal && fVal == "저장") {
						oModel.create("/RegalsealRImportSet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							if (oData) { //값을 제대로 받아 왔을 때
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_23009"));
								oController._DetailModel.close();
								oController.onTableSearch();
								BusyIndicator.hide();
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
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_23008"), {
				title: oController.getBundleText("LABEL_23019"),
				actions: ["저장", "취소"],
				onClose: onProcessSave
			});
		},

		onDialogDelBtn: function() { // 삭제
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.DetailModel.getProperty("/Data");

			delete oRowData.Regno;

			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_38047")) { // 삭제

					var sendObject = {
						IPernr: vPernr,
						IEmpid: vPernr,
						IBukrs: vBukrs,
						IConType: "4",
						IDatum: new Date(),
						RegalsealRTableIn1: [
							{
								Pernr: oRowData.Pernr,
								Seqnr: oRowData.Seqnr,
								Appdt: oRowData.Appdt,
								Status1: oRowData.Status1
							}
						]
					};

					BusyIndicator.show(0);
					oModel.create("/RegalsealRImportSet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							sap.m.MessageBox.alert(oController.getBundleText("MSG_38006"), { title: oController.getBundleText("MSG_08107")});
							oController.onTableSearch();
							oController._DetailModel.close();
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
			}

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_23006"), {
				title: oController.getBundleText("LABEL_23019"),
				actions: ["삭제", "취소"],
				onClose: onProcessDelete
			});
        },
		
		onPressDelete: function(oEvent) {
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
			var vPernr = oController.getUserId();
			var vBukrs2 = oController.getUserGubun();
			var vPath = oEvent.getSource().oParent.oParent.getBindingContext().getPath();
			var oRowData = oController.TableModel.getProperty(vPath);
			
			var sendObject = {
				IPernr: vPernr,
				IEmpid: vPernr,
				IBukrs: vBukrs2,
				IConType: "4",
				IDatum: new Date(),
				RegalsealRTableIn1: [
					{
						Pernr: oRowData.Pernr,
						Seqnr: oRowData.Seqnr,
						Appdt: oRowData.Appdt,
						Status1: oRowData.Status1
					}
				]
			};
			
			BusyIndicator.show(0);
			var onProcessDelete = function (fVal) {
				if (fVal && fVal == "삭제") {
					oModel.create("/RegalsealRImportSet", sendObject, {
						async: true,
						success: function(oData, oResponse) {
							oController.onTableSearch();
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
			
			sap.m.MessageBox.confirm(oController.getBundleText("MSG_23006"), {
				title: oController.getBundleText("LABEL_23019"),
				actions: ["삭제", "취소"],
				onClose: onProcessDelete
			});
		},
		
		onBeforeOpenDetailDialog: function(oEvent) {
			var vStatus = this.DetailModel.getProperty("/FormData/Status"),
				vAppnm = this.TextViewModel.getProperty("/FileData/0/Appnm") || "";

			AttachFileAction.setAttachFile(this, {
				Appnm: vAppnm,
				Required: true,
				Mode: "M",
				Max: "100",
				Editable: (!vStatus || vStatus === "10") ? true : false,
				FileTypes: ["pdf", "jpg", "doc", "docx", "gif", "png", "zip"],
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "35117893"});
		} : null
	});
});