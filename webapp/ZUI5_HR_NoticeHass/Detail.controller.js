sap.ui.define([
	"../common/Common",
	"../common/CommonController",
	"../common/JSONModelHelper",
    "../common/AttachFileAction",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"./delegate/ViewTemplates",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/ui/richtexteditor/EditorType"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, BusyIndicator, ViewTemplates, RTE, EditorType) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "Detail",
		
        TableModel: new JSONModelHelper(),
		RegistModel: new JSONModelHelper(),

		getUserId: function() {

			return $.app.getController().getUserId();
		},
		
		getUserGubun  : function() {

			return $.app.getController().getUserGubun();
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
		
		onBeforeShow: function(oEvent) {
            BusyIndicator.show(0);

            this.RegistModel.setData({FormData: []});

            if(oEvent.data){
				if(oEvent.data.New === "O") {
					this.getEmpInfo();
				}else {
					this.getDetailData(oEvent.data.vSdate, oEvent.data.vSeqnr);
				}
            }
			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
			this.onBeforeOpenDetailDialog();
            BusyIndicator.hide();
        },

		getParameterByName: function(name) {
			var regex = parent._gateway.parameter(name);
			
			return Common.checkNull(regex)? "" : regex;
		},

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix()),
				data: { 
                    New: "X"
                }
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
		
        getImport: function() {
			return new sap.m.CheckBox({ 
                editable: false,
                selected: {
                    path: "Impor",
                    formatter: function(v) {
                        return v === "X";
                    }
                }
            });
        },

		getEmpInfo: function() {
			var oController = this.getView().getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vPernr = oController.getUserId();
			var vBukrs = oController.getUserGubun();
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

		getDetailData: function(vSdate, vSeqnr) { // 상세정보
			var oController = this.getView().getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
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
			sendObject.TableIn3 = [];
			
			oModel.create("/NoticeManageSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn2) {
						Common.log(oData);
						var oCopiedRow = $.extend(true, {}, oData.TableIn2.results[0]);
						// oController.RegistModel.setData({FormData: oCopiedRow});
						oCopiedRow.Detail = "";
						
						oData.TableIn3.results.forEach(function(e) {
							oCopiedRow.Detail += e.Detail;
						});

						oController.RegistModel.setData({FormData: oCopiedRow });
						
						if(Common.checkNull(oCopiedRow.Hide)){
							if(vPernr === oCopiedRow.Apern){
								oController.RegistModel.setProperty("/Gubun", "Y");
							}else {
								oController.RegistModel.setProperty("/Gubun", "");
							}
						}else {
							if(vPernr === oCopiedRow.Apern){
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
			var oController = this.getView().getController();
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
			var oList = [],
				oDetailList = [];

			if(this.checkError()) return;

			oList = oRowData.Detail.match(new RegExp('.{1,' + 4000 + '}', 'g'));
			
			oList.forEach(function(e) {
				var oDetailObj = {};
				oDetailObj.Detail = e;
				oDetailList.push(Common.copyByMetadata(oModel, "NoticeManageTableIn3", oDetailObj));
			});

			BusyIndicator.show(0);
			var onPressRegist = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_57009")) { // 등록

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					oRowData.Sdate = Common.checkNull(oRowData.Sdate) ? new Date() : oRowData.Sdate;
					oRowData.Apern = vPernr;
					oRowData.Hide = "";
					delete oRowData.Detail;

					var sendObject = {};
					// Header
					sendObject.IConType = "2";
					sendObject.IBukrs = vBukrs;
					// Navigation property
					sendObject.TableIn2 = [Common.copyByMetadata(oModel, "NoticeManageTableIn2", oRowData)];
					sendObject.TableIn3 = oDetailList;
					
					oModel.create("/NoticeManageSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_57004"), { title: oController.getBundleText("MSG_08107")});
								oController.navBack();
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
			var oList = [],
				oDetailList = [];

			if(this.checkError()) return;

			oList = oRowData.Detail.match(new RegExp('.{1,' + 4000 + '}', 'g'));
			
			oList.forEach(function(e) {
				var oDetailObj = {};
				oDetailObj.Detail = e;
				oDetailList.push(Common.copyByMetadata(oModel, "NoticeManageTableIn3", oDetailObj));
			});

			BusyIndicator.show(0);
			var onPressSave = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_57015")) { // 저장

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					oRowData.Sdate = Common.checkNull(oRowData.Sdate) ? new Date() : oRowData.Sdate;
					oRowData.Apern = vPernr;
					oRowData.Hide = "X";
					delete oRowData.Detail;

					var sendObject = {};
					// Header
					sendObject.IConType = "2";
					sendObject.IBukrs = vBukrs;
					// Navigation property
					sendObject.TableIn2 = [Common.copyByMetadata(oModel, "NoticeManageTableIn2", oRowData)];
					sendObject.TableIn3 = oDetailList;
					
					oModel.create("/NoticeManageSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_57006"), { title: oController.getBundleText("MSG_08107")});
								oController.navBack();
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
			var oList = [],
				oDetailList = [];

			oList = oRowData.Detail.match(new RegExp('.{1,' + 4000 + '}', 'g'));
			
			oList.forEach(function(e) {
				var oDetailObj = {};
				oDetailObj.Detail = e;
				oDetailList.push(Common.copyByMetadata(oModel, "NoticeManageTableIn3", oDetailObj));
			});

			delete oRowData.Detail;

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_57017")) { // 삭제

					var sendObject = {};
					// Header
					sendObject.IConType = "3";
					sendObject.IBukrs = vBukrs;
					// Navigation property
					sendObject.TableIn2 = [Common.copyByMetadata(oModel, "NoticeManageTableIn2", oRowData)];
					sendObject.TableIn3 = oDetailList;
					
					oModel.create("/NoticeManageSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_57010"), { title: oController.getBundleText("MSG_08107")});
								oController.navBack();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_57009"), {
				title: oController.getBundleText("LABEL_57001"),
				actions: [oController.getBundleText("LABEL_57017"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
        },

        onBeforeOpenDetailDialog: function() {
			var oController = this.getView().getController();
			var	vSdate = oController.RegistModel.getProperty("/FormData/Sdate"),
				vGubun = oController.RegistModel.getProperty("/Gubun"),
				vAppnm = oController.RegistModel.getProperty("/FormData/Appnm") || "";

			if($.app.byId("myRTE")){
				$.app.byId("myRTE").destroy();
				$.app.byId(oController.PAGEID + "AreaHTML").destroy();
			}

			if(Common.checkNull(vSdate) || vGubun === "X"){
				$.app.byId("contentArea1").setVisible(true);
				$.app.byId("contentArea2").setVisible(false);
			}else{
				$.app.byId("contentArea1").setVisible(false);
				$.app.byId("contentArea2").setVisible(true);
			}

			var that = this;
				that.oRichTextEditor = new RTE("myRTE", {
					editorType: EditorType.TinyMCE4,
					layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
					width: "99.8%",
					height: "500px",
					customToolbar: true,
					showGroupFont: true,
					// showGroupLink: true,
					showGroupInsert: true,
					sanitizeValue: false,
					value: "{Detail}",
					editable: {
						parts: [{path: "Sdate"}, {path: "/Gubun"}],
						formatter: function(v1, v2) {
							return !v1 || v2 === "X";
						}
					},
					ready: function (oEvent) {
						this.addButtonGroup("styleselect").addButtonGroup("table");
					}
				});

			$.app.byId("contentArea1").addItem(that.oRichTextEditor);
			$.app.byId("contentArea2").addItem(
				new sap.ui.core.HTML(oController.PAGEID + "AreaHTML", {
					content: {
						path: "Detail",
						formatter: function(v) {
							if(!v){
								return "";
							}else{
								return /^</i.test(v) ? v : '<p style="font-size: 14px">${content}</p>'.interpolate(v);
							}
						}
					}
				})
			);

			$.app.byId("myRTE").addStyleClass("mxw-100");

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "5",
				Editable: vGubun === "X" ? true : false
			});
		},
		
		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: this.getView().getController().getUserId()}); 
		} : null
	});
});