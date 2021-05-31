sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "../common/AttachFileAction",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, BusyIndicator) {
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

		getUserDetail: function(info) {

			return this.getSessionInfoByKey(info);
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

			if(Common.checkNull(!this.getParameterByName("Sdate")) && Common.checkNull(!this.getParameterByName("Seqnr")))
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
		
        getImport: function() {
			return new sap.m.CheckBox({ 
                editable: false,
                selected: {
                    path: "Impor",
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
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "0";
            sendObject.IHass = "X";
			sendObject.IBegda = moment(oSearchDate.getDateValue()).hours(10).toDate();
			sendObject.IEndda = moment(oSearchDate.getSecondDateValue()).hours(10).toDate();
            sendObject.ITitle = Common.checkNull(oSearchInput.getValue()) ? "" : oSearchInput.getValue();
			// Navigation property
			sendObject.TableIn1 = [];
			
			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
					
					if (oData && oData.TableIn1) {
						Common.log(oData);
						var rDatas = oData.TableIn1.results;
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

        onPressSer: function() { // 조회
            this.onTableSearch();
        },

		onPressRegi: function() { // 등록
			var oView = $.app.byId("ZUI5_HR_NoticeHass.Page");
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var oController = this;
			var vBukrs = this.getUserGubun();
			var vPernr = this.getUserId();
			
            this.RegistModel.setData({FormData: []});
			
			if (!this._RegistModel) {
				this._RegistModel = sap.ui.jsfragment("ZUI5_HR_NoticeHass.fragment.Regist", this);
				oView.addDependent(this._RegistModel);
			}
				
			var sendObject = {};
			// Header
            sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.TableIn2 = [];
			
			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn2) {
						Common.log(oData);
						var oCopiedRow = $.extend(true, {}, oData.TableIn2.results[0]);
						oController.RegistModel.setData({FormData: oCopiedRow});
						oController.RegistModel.setProperty("/Gubun", "X");
						oController.onBeforeOpenDetailDialog();
						oController._RegistModel.open();
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
		
		onSelectedRow: function(oEvent) {
            var oController = $.app.getController();
			var vPath = oEvent.getParameters().rowBindingContext.getPath();

			oController.onSelectDetail(true, vPath);
		},

		onSelectDetail: function(Gubun, Path){
			var oController = $.app.getController();
			var oView = $.app.byId("ZUI5_HR_NoticeHass.Page");
			
			if (!oController._RegistModel) {
				oController._RegistModel = sap.ui.jsfragment("ZUI5_HR_NoticeHass.fragment.Regist", oController);
				oView.addDependent(oController._RegistModel);
			}
			
			oController.getDetailData(Path, Gubun);
            oController.onBeforeOpenDetailDialog();
			oController._RegistModel.open();
		},

		getDetailData: function(Path, Gubun) { // 상세정보
			var oController = $.app.getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vSdate = Gubun ? oController.TableModel.getProperty(Path).Sdate : oController.getParameterByName("Sdate");
			var vSeqnr = Gubun ? oController.TableModel.getProperty(Path).Seqnr : oController.getParameterByName("Seqnr");
			var vBukrs = oController.getUserGubun();
            var vPernr = oController.getUserId();
			
			var sendObject = {};
			// Header
			sendObject.ISdate = vSdate;
			sendObject.ISeqnr = vSeqnr;
            sendObject.IPernr = vPernr;
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.TableIn2 = [];
			
			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn2) {
						Common.log(oData);
						var oCopiedRow = $.extend(true, {}, oData.TableIn2.results[0]);
						oController.RegistModel.setData({FormData: oCopiedRow});
						
						if(Common.checkNull(oCopiedRow.Hide)){
							if(vPernr === oController.TableModel.getProperty(Path).Apern){
								oController.RegistModel.setProperty("/Gubun", "Y");
							}else {
								oController.RegistModel.setProperty("/Gubun", "");
							}
						}else {
							if(vPernr === oController.TableModel.getProperty(Path).Apern){
								oController.RegistModel.setProperty("/Gubun", oCopiedRow.Hide);
							}else {
								oController.RegistModel.setProperty("/Gubun", "");
							}
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

		onChangeData: function(oEvent) { // 중요항목 CheckBox
			var IsSelected = oEvent.getSource().getSelected();

			if(IsSelected)	this.RegistModel.setProperty("/FormData/Impor", "X");
			else this.RegistModel.setProperty("/FormData/Impor", "");
		},

		checkError :function() { // Error Check
			var oController = $.app.getController();
			var oFormData = oController.RegistModel.getProperty("/FormData");
			
			// 제목
			if(Common.checkNull(oFormData.Title)){
				MessageBox.error(oController.getBundleText("MSG_57001"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}
			// 내용
			if(Common.checkNull(oFormData.Detail)){
				MessageBox.error(oController.getBundleText("MSG_57002"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},

		onDialogReBtn: function() { // 수정
			this.RegistModel.setProperty("/Gubun", "X");
			this.onBeforeOpenDetailDialog();
		},

        onDialogRegistBtn: function() { // 등록
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
            var vBukrs = this.getUserGubun();
            var vPernr = oController.getUserId();
			var oRowData = this.RegistModel.getProperty("/FormData");

			if(this.checkError()) return;

			BusyIndicator.show(0);
			var onPressRegist = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_57009")) { // 등록

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					oRowData.Sdate = Common.checkNull(oRowData.Sdate) ? new Date() : oRowData.Sdate;
					oRowData.Apern = vPernr;
					oRowData.Hide = "";

					var sendObject = {};
					// Header
					sendObject.IConType = "2";
					sendObject.IBukrs = vBukrs;
					// Navigation property
					sendObject.TableIn2 = [Common.copyByMetadata(oModel, "NoticeManageTableIn2", oRowData)];
					
					oModel.create("/NoticeManageSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_57004"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._RegistModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_57003"), {
				title: oController.getBundleText("LABEL_57001"),
				actions: [oController.getBundleText("LABEL_57009"), oController.getBundleText("LABEL_00119")],
				onClose: onPressRegist
			});
        },

        onDialogSaveBtn: function() { // 임시저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
            var vBukrs = this.getUserGubun();
            var vPernr = oController.getUserId();
			var oRowData = this.RegistModel.getProperty("/FormData");

			if(this.checkError()) return;

			BusyIndicator.show(0);
			var onPressSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_57015")) { // 저장

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					oRowData.Sdate = Common.checkNull(oRowData.Sdate) ? new Date() : oRowData.Sdate;
					oRowData.Apern = vPernr;
					oRowData.Hide = "X";

					var sendObject = {};
					// Header
					sendObject.IConType = "2";
					sendObject.IBukrs = vBukrs;
					// Navigation property
					sendObject.TableIn2 = [Common.copyByMetadata(oModel, "NoticeManageTableIn2", oRowData)];
					
					oModel.create("/NoticeManageSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_57006"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._RegistModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_57005"), {
				title: oController.getBundleText("LABEL_57001"),
				actions: [oController.getBundleText("LABEL_57015"), oController.getBundleText("LABEL_00119")],
				onClose: onPressSave
			});
        },
		
        onDialogDeleteBtn: function() { // 삭제
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
            var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_57017")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IConType = "3";
					sendObject.IBukrs = vBukrs;
					// Navigation property
					sendObject.TableIn2 = [Common.copyByMetadata(oModel, "NoticeManageTableIn2", oRowData)];
					
					oModel.create("/NoticeManageSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_57010"), { title: oController.getBundleText("MSG_08107")});
								oController.onTableSearch();
								BusyIndicator.hide();
								oController._RegistModel.close();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_57009"), {
				title: oController.getBundleText("LABEL_57001"),
				actions: [oController.getBundleText("LABEL_57017"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
        },

        onBeforeOpenDetailDialog: function() {
			var oController = $.app.getController();
			var	vGubun = oController.RegistModel.getProperty("/Gubun"),
				vAppnm = oController.RegistModel.getProperty("/FormData/Appnm") || "";

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "5",
				Editable: vGubun === "X" ? true : false
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: "20050069"}); 
		} : null											 
	});
});