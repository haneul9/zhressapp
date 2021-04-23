﻿sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
    "../../common/AttachFileAction",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "../delegate/ViewTemplates"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, BusyIndicator, ViewTemplates) {
	"use strict";

	var SUB_APP_ID = [$.app.CONTEXT_PATH, "Regist"].join($.app.getDeviceSuffix());

	return CommonController.extend(SUB_APP_ID, {
		
		PAGEID: "Regist",
		
		RegistModel: new JSONModelHelper(),
		CommentModel: new JSONModelHelper(),
		PWordModel: new JSONModelHelper(),

		g_ReGubun: "", 			// 댓글/대댓글 상세 수정/삭제 구분
		g_Pword: "",			// 톡톡 글의 수정/삭제 구분
		g_Input: "",			// 댓글 내용 Input
		g_HiInputPword: "",		// 해당 댓글의 비밀번호 Input
		g_HiPword: "",			// 해당 댓글의 비밀번호 Text
		g_HiSeqnr2: "",			// 해당 댓글의 시퀀스번호 Text
		g_HiBox: "",			// 해당 댓글의 비밀번호 HBox
		g_SaveBtn: "",			// 해당 댓글의 저장 Btn 
		g_ReBtn: "",			// 해당 댓글의 수정 Btn
		g_CanBtn: "",			// 해당 댓글의 취소 Btn
		g_ReCommBtn: "",		// 해당 댓글의 대댓글 Btn
		g_CoDate: "",	    	// 해당 댓글의 등록일자
		g_ReHiSeqnr2: "",		// 해당 대댓글의 시퀀스번호 Text
		g_ReDetail: "",			// 해당 대댓글의 신규작성시 내용
		g_ReHiPword: "",		// 해당 대댓글의 비밀번호 Text
		g_RePwordInput: "",		// 해당 대댓글의 비밀번호 Input
		g_RePwordBox: "",		// 해당 대댓글의 비밀번호 Box
		g_ReSaveBtn: "",		// 해당 대댓글의 저장 Btn
		g_ReWritBtn: "",		// 해당 대댓글의 수정 Btn
		g_ReCanBtn: "",			// 해당 대댓글의 취소 Btn
		g_ReDate: "",			// 해당 대댓글의 등록일자

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
            this.RegistModel.setData({FormData: []});
            var oDateBox = $.app.byId(this.PAGEID + "_RegistDateBox");
            var oIsHideBox = $.app.byId(this.PAGEID + "_IsHideBox");
            var oCommentBox = $.app.byId(this.PAGEID + "_CommentBox");

            if(oEvent.data){
                this.RegistModel.setData({ FormData: oEvent.data.RowData ? oEvent.data.RowData : [] });
                this.CommentModel.setData({Data: {}});
                if(Common.checkNull(oEvent.data.RowData)){
                    this.RegistModel.setData({FormData: []});
                    oCommentBox.destroyItems();
                    oDateBox.setVisible(false);
                    oIsHideBox.setVisible(true);
					this.CommentModel.setProperty("/HideComment", "X");
                }else{
                    oDateBox.setVisible(true);
                    oIsHideBox.setVisible(false);
                    this.getDetailData(this);
                }
            }

			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
            this.onBeforeOpenDetailDialog();
        },

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix())
            });
        },

        getDetailData: function(oController) { // 상세정보
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			
			var sendObject = {};
			// Header
			sendObject.ISdate = oController.RegistModel.getProperty("/FormData/Sdate");
			sendObject.ISeqnr = oController.RegistModel.getProperty("/FormData/Seqnr");
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.TableIn2 = [];
			sendObject.TableIn3 = [];
			sendObject.TableIn4 = [];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn2) {
						Common.log(oData);
						var oCopiedRow = $.extend(true, {}, oData.TableIn2.results[0]);
						var oCommentData = oData.TableIn3.results;
						var oSubCommentData = oData.TableIn4.results;
						oController.RegistModel.setData({FormData: oCopiedRow});
						oController.RegistModel.setProperty("/CommentData", oCommentData);
						oController.RegistModel.setProperty("/SubCommentData", oSubCommentData);
						oController.setComments();
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

        setComments: function() { // Comment Setting
			var oController = this.getView().getController();
			var oCommentBox = $.app.byId(oController.PAGEID + "_CommentBox");
			var vCommData = oController.RegistModel.getProperty("/CommentData");

			oCommentBox.destroyItems();

			vCommData.forEach(function(e, i) {
				oCommentBox.addItem(
					new sap.m.VBox({
						fitContainer: true,
						items: [
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.Start,
										fitContainer: true,
										visible: false,
										items: [
											ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "auto", "Right", true).addStyleClass("mr-8px mt-10px"), // 비밀번호
											new sap.m.Input({
												width: "100px",
												value: e.Pword,
												type: sap.m.InputType.Password
											})
										]
									}),
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.End,
										alignContent: sap.m.FlexAlignContent.End,
										alignItems: sap.m.FlexAlignItems.End,
										fitContainer: true,
										width: "100%",
										visible: {
											path: e.Zdel,
											formatter: function() {
												return e.Zdel !== "X";
											}
										},
										items: [
											new sap.m.Text({ 
												text: Common.DateFormatter(e.Adatl)
											}),
											new sap.m.Button({
												press: oController.onCommentSubBtn.bind(oController),
												text: "{i18n>LABEL_56017}" // 대댓글
											}).addStyleClass("button-light-sm"),
											new sap.m.Button({
												press: oController.onCommentReBtn.bind(oController),
												text: "{i18n>LABEL_56013}" // 수정
											}).addStyleClass("button-light-sm"),
											new sap.m.Button({
												press: oController.onCommentSaBtn.bind(oController),
												visible: false,
												text: "{i18n>LABEL_56016}" // 저장
											}).addStyleClass("button-light-sm"),
											new sap.m.Button({
												press: oController.onCommentDeBtn.bind(oController),
												text: "{i18n>LABEL_56014}" // 삭제
											}).addStyleClass("button-light-sm"),
											new sap.m.Button({
												press: oController.onCommentCanBtn.bind(oController),
												visible: false,
												text: "{i18n>LABEL_56019}" // 취소
											}).addStyleClass("button-light-sm")
										]
									})
									.addStyleClass("button-group")
								]
							}),
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.Text({ 
										text: e.Pword,
										visible: false
									}),
									new sap.m.Text({ 
										text: e.Seqnr2,
										visible: false
									}),
									new sap.m.TextArea({ 
										width: "375px",
										value: e.Detail,
										growing: true,
										editable: false
									})
								]
							}),
							new sap.m.VBox({
								fitContainer: true,
								visible: false,
								items: []
							})
							.addStyleClass("ml-20px")
						]
					})
				);
				oController.setSubComments(e, i);
			});
		},

        onChangeData: function(oEvent) { // 비공개 CheckBox
			var IsSelected = oEvent.getSource().getSelected();

			if(IsSelected)	this.RegistModel.setProperty("/FormData/Hide", "X");
			else this.RegistModel.setProperty("/FormData/Hide", "");
		},

        setSubComments: function(oEvent, index) { // SubComment Setting
			var oController = this.getView().getController();
			var vSubCommentData = oController.RegistModel.getProperty("/SubCommentData");
			var oCommentBox = $.app.byId(oController.PAGEID + "_CommentBox");

			if(Common.checkNull(!index) || index === 0){ // 저장된 대댓글 Setting
				vSubCommentData.forEach(function(e) {
					if(e.Seqnr2 === oEvent.Seqnr2) {
						oCommentBox.getItems()[index].getItems()[2].setVisible(true);
						oCommentBox.getItems()[index].getItems()[2].addItem(
							new sap.m.VBox({
								fitContainer: true,
								items: [
									new sap.m.HBox({
										fitContainer: true,
										items: [
											new sap.m.HBox({
												justifyContent: sap.m.FlexJustifyContent.Start,
												fitContainer: true,
												visible: false,
												items: [
													ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "auto", "Right", true).addStyleClass("mr-8px mt-10px"), // 비밀번호
													new sap.m.Input({
														width: "100px",
														value: e.Pword,
														type: sap.m.InputType.Password
													})
												]
											}),
											new sap.m.HBox({
												justifyContent: sap.m.FlexJustifyContent.End,
												alignContent: sap.m.FlexAlignContent.End,
												alignItems: sap.m.FlexAlignItems.End,
												fitContainer: true,
												width: "100%",
												visible: {
													path: e.Zdel,
													formatter: function() {
														return e.Zdel !== "X";
													}
												},
												items: [
													new sap.m.Text({ 
														text: Common.DateFormatter(e.Adatl)
													}),
													new sap.m.Button({
														press: oController.onSubCommentReBtn.bind(oController),
														text: "{i18n>LABEL_56013}" // 수정
													}).addStyleClass("button-light-sm"),
													new sap.m.Button({
														press: oController.onSubCommentSaBtn.bind(oController),
														visible: false,
														text: "{i18n>LABEL_56016}" // 저장
													}).addStyleClass("button-light-sm"),
													new sap.m.Button({
														press: oController.onSubCommentDeBtn.bind(oController),
														text: "{i18n>LABEL_56014}" // 삭제
													}).addStyleClass("button-light-sm"),
													new sap.m.Button({
														press: oController.onSubCommentCanBtn.bind(oController),
														visible: false,
														text: "{i18n>LABEL_56019}" // 취소
													}).addStyleClass("button-light-sm")
												]
											})
											.addStyleClass("button-group")
										]
									}),
									new sap.m.HBox({
										fitContainer: true,
										items: [
											new sap.m.TextArea({ 
												width: "355px",
												value: e.Detail,
												growing: true,
												editable: false
											}),
											new sap.m.Text({ 
												text: e.Pword,
												visible: false
											}),
											new sap.m.Text({ 
												text: e.Seqnr3,
												visible: false
											})
										]
									})
								]
							})
						);
					}
				});
			}else { // 신규 대댓글
				oController.g_ReCommBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[1];
				oEvent.getSource().oParent.oParent.oParent.getItems()[2].setVisible(true);
				oEvent.getSource().oParent.oParent.oParent.getItems()[2].addItem(
					new sap.m.VBox({
						fitContainer: true,
						items: [
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.Start,
										fitContainer: true,
										items: [
											ViewTemplates.getLabel("header", "{i18n>LABEL_56012}", "auto", "Right", true).addStyleClass("mr-8px mt-10px"), // 비밀번호
											new sap.m.Input({
												width: "100px",
												type: sap.m.InputType.Password
											})
										]
									}),
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.End,
										alignContent: sap.m.FlexAlignContent.End,
										alignItems: sap.m.FlexAlignItems.End,
										fitContainer: true,
										width: "100%",
										items: [
											new sap.m.Text({
												text: ""
											}),
											new sap.m.Button({
												press: oController.onSubCommentReBtn.bind(oController),
												visible: false,
												text: "{i18n>LABEL_56013}" // 수정
											}).addStyleClass("button-light-sm"),
											new sap.m.Button({
												press: oController.onSubCommentSaBtn.bind(oController),
												text: "{i18n>LABEL_56016}" // 저장
											}).addStyleClass("button-light-sm"),
											new sap.m.Button({
												press: oController.onSubCommentDeBtn.bind(oController),
												visible: false,
												text: "{i18n>LABEL_56014}" // 삭제
											}).addStyleClass("button-light-sm"),
											new sap.m.Button({
												press: oController.onSubCommentCanBtn.bind(oController),
												visible: true,
												text: "{i18n>LABEL_56019}" // 취소
											}).addStyleClass("button-light-sm")
										]
									})
									.addStyleClass("button-group")
								]
							}),
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.TextArea({ 
										width: "355px",
										growing: true
									}),
									new sap.m.Text({ 
										visible: false
									})
								]
							})
						]
					})
				);
			}
		},

        onSubCommentCanBtn: function(oEvent) { // 대댓글 취소
			this.setComments();
		},

		onCommentSubBtn: function(oEvent) { // 대댓글
			this.setSubComments(oEvent);
		},

		onSubCommentReBtn: function(oEvent) { // 대댓글 수정
			var oView = $.app.byId("ZUI5_HR_Suggestions.m.Regist");
			this.g_ReHiPword = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[1];
			this.g_ReWritBtn = oEvent.getSource().oParent.getItems()[1];
			this.g_ReSaveBtn = oEvent.getSource().oParent.getItems()[2];
			this.g_ReCanBtn = oEvent.getSource().oParent.getItems()[4];
			this.g_RePwordBox = oEvent.getSource().oParent.oParent.getItems()[0];
			this.g_RePwordInput = oEvent.getSource().oParent.oParent.getItems()[0].getItems()[1];
			this.g_ReDetail = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[0];
			this.g_ReDate = oEvent.getSource().oParent.getItems()[0];

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.m.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}
			
			this.g_ReGubun = "RR";
			this.PWordModel.setData({Data: {}});
			this._CommentModel.open();
		},

		onSubCommentSaBtn: function(oEvent) { // 저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var oCommData = {};

			this.g_ReDetail = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[0];
			this.g_RePwordInput = oEvent.getSource().oParent.oParent.getItems()[0].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[2];
			this.g_HiSeqnr2 = oEvent.getSource().oParent.oParent.oParent.oParent.oParent.getItems()[1].getItems()[1];

			// 비밀번호
			if(Common.checkNull(this.g_RePwordInput.getValue()) || 6 > this.g_RePwordInput.getValue().length || this.g_RePwordInput.getValue().length > 10){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			// 대댓글
			if(Common.checkNull(this.g_ReDetail.getValue())){
				MessageBox.error(oController.getBundleText("MSG_56010"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;
			oCommData.Detail = this.g_ReDetail.getValue();
			oCommData.Pword = this.g_RePwordInput.getValue();
			oCommData.Seqnr2 = this.g_HiSeqnr2.getText();
			oCommData.Seqnr3 = Common.checkNull(!this.g_ReHiSeqnr2) ? this.g_ReHiSeqnr2.getText() : "";

			var sendObject = {};
			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn4 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn4", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					Common.log(oData);
					oController.CommentModel.setData({Data: {}});
					oController.getDetailData(oController);
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
		},

		onSubCommentDeBtn: function(oEvent) { // 삭제
			var oController = this;
			var oView = $.app.byId("ZUI5_HR_Suggestions.m.Regist");
			this.g_RePwordInput = oEvent.getSource().oParent.oParent.getItems()[0].getItems()[1];
			this.g_HiSeqnr2 = oEvent.getSource().oParent.oParent.oParent.oParent.oParent.getItems()[1].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[2];
			this.g_ReHiPword = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[1];
			this.g_ReGubun = "RD";

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.m.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}

			BusyIndicator.show(0);
			var onPressDelete = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_56014")) { // 삭제
					oController.PWordModel.setData({Data: {}});
					oController._CommentModel.open();
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_56012"), {
				title: oController.getBundleText("LABEL_56001"),
				actions: [oController.getBundleText("LABEL_56014"), oController.getBundleText("LABEL_00119")],
				onClose: onPressDelete
			});
		},

		onSubCommentDelete : function() { // 대댓글 삭제
			var oController = this.getView().getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.RegistModel.getProperty("/FormData");
			var oCommData = {};

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;
			oCommData.Seqnr2 = oController.g_HiSeqnr2.getText();
			oCommData.Seqnr3 = oController.g_ReHiSeqnr2.getText();
			oCommData.Zdel = "X";

			var sendObject = {};

			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn4 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn4", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						sap.m.MessageBox.alert(oController.getBundleText("MSG_56009"), { title: oController.getBundleText("MSG_08107")});
						oController.CommentModel.setData({Data: {}});
						oController.getDetailData(oController);
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
			oController.PWordModel.setData({Data: {}});
		},
		
		onCommentSaBtn: function() { // 댓글저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var oCommData = {};

			// 비밀번호
			if(Common.checkNull(this.g_HiInputPword.getValue()) || 6 > this.g_HiInputPword.getValue().length || this.g_HiInputPword.getValue().length > 10){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;
			oCommData.Detail = this.g_Input.getValue();
			oCommData.Pword = this.g_HiInputPword.getValue();
			oCommData.Seqnr2 = this.g_HiSeqnr2.getText();

			var sendObject = {};
			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn2 = [];
			sendObject.TableIn3 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn3", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					Common.log(oData);
					oController.CommentModel.setData({Data: {}});
					oController.getDetailData(oController);
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
		},
		
		onCommentCanBtn: function(oEvent) { // 댓글 취소
			this.setComments();
		},

		onCommentReBtn: function(oEvent) { // 댓글 수정
			var oPWord = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[0];
			var oView = $.app.byId("ZUI5_HR_Suggestions.m.Regist");
			this.g_Input = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[2];
			this.g_HiSeqnr2 = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[1];
			this.g_ReCommBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[1];
			this.g_ReBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[2];
			this.g_SaveBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[3];
			this.g_CanBtn = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[1].getItems()[5];
			this.g_HiBox = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[0];
			this.g_HiInputPword = oEvent.getSource().oParent.oParent.oParent.getItems()[0].getItems()[0].getItems()[1];
			this.g_CoDate = oEvent.getSource().oParent.getItems()[0];
			this.g_HiPword = oPWord;
			this.g_ReGubun = "R";
			

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.m.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}
			
			this.PWordModel.setData({Data: {}});
			this._CommentModel.open();

		},

		onCommentDeBtn: function(oEvent) {
			var oController = this;
			var oView = $.app.byId("ZUI5_HR_Suggestions.m.Regist");
			this.g_HiPword = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[0];
			this.g_HiSeqnr2 = oEvent.getSource().oParent.oParent.oParent.getItems()[1].getItems()[1];
			this.g_ReGubun = "D";

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.m.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}

			BusyIndicator.show(0);
			var onPressRegist = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_56014")) { // 삭제
					oController.PWordModel.setData({Data: {}});
					oController._CommentModel.open();
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_56012"), {
				title: oController.getBundleText("LABEL_56001"),
				actions: [oController.getBundleText("LABEL_56014"), oController.getBundleText("LABEL_00119")],
				onClose: onPressRegist
			});
		},

		onCommentDelete: function() {
			var oController = this.getView().getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var oRowData = oController.RegistModel.getProperty("/FormData");
			var oCommData = {};

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;
			oCommData.Seqnr2 = oController.g_HiSeqnr2.getText();
			oCommData.Zdel = "X";

			var sendObject = {};

			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn3 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn3", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						sap.m.MessageBox.alert(oController.getBundleText("MSG_56009"), { title: oController.getBundleText("MSG_08107")});
						oController.CommentModel.setData({Data: {}});
						oController.getDetailData(oController);
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
			oController.PWordModel.setData({Data: {}});
		},

		checkError :function() { // Error Check
			var oController = this.getView().getController();
			var oFormData = oController.RegistModel.getProperty("/FormData");
			
			// 제목
			if(Common.checkNull(oFormData.Title)){
				MessageBox.error(oController.getBundleText("MSG_56001"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}
			// 내용
			if(Common.checkNull(oFormData.Detail)){
				MessageBox.error(oController.getBundleText("MSG_56002"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			// 비밀번호
			if(Common.checkNull(oFormData.Pword) || 6 > oFormData.Pword.length || oFormData.Pword.length > 10){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},

		ReCommentCheck: function() { // 대댓글 수정/삭제 비밀번호 확인
			var oController = this.getView().getController();
			var vPword = oController.PWordModel.getProperty("/Data/PassWord");
			

			// PassWord Check
			if(oController.g_ReHiPword.getText() !== vPword){
				return MessageBox.error(oController.getBundleText("MSG_56011"), { title: oController.getBundleText("LABEL_00149")});
			}

			if(oController.g_ReGubun === "RR"){
				this.g_ReWritBtn.setVisible(false);
				this.g_ReSaveBtn.setVisible(true);
				this.g_ReCanBtn.setVisible(true);
				this.g_RePwordBox.setVisible(true);
				this.g_ReDetail.setEditable(true);
				this.g_ReDate.setVisible(false);
			}else {
				oController.onSubCommentDelete();
			}

			oController.g_ReGubun = "";
			oController._CommentModel.close();
		},

		CommentUserCheck: function() { // 댓글 수정/삭제 비밀번호 확인
			var oController = this.getView().getController();
			var vPword = oController.PWordModel.getProperty("/Data/PassWord");
			
			if(this.g_ReGubun === "RR" || this.g_ReGubun === "RD")
				return oController.ReCommentCheck();

			// PassWord Check
			if(vPword !== this.g_HiPword.getText()){
				return MessageBox.error(oController.getBundleText("MSG_56011"), { title: oController.getBundleText("LABEL_00149")});
			}

			if(this.g_ReGubun === "R"){
				this.g_Input.setEditable(true);
				this.g_ReBtn.setVisible(false);
				this.g_ReCommBtn.setVisible(false);
				this.g_SaveBtn.setVisible(true);
				this.g_CanBtn.setVisible(true);
				this.g_HiBox.setVisible(true);
                this.g_CoDate.setVisible(false);
			}else {
				this.onCommentDelete();
			}

			this.g_ReGubun = "";
			this._CommentModel.close();
		},

		onDialogPwordBtn: function() { // PassWord Dialog 확인
			var vPassWord = this.RegistModel.getProperty("/FormData/Pword");
			var vPword = this.PWordModel.getProperty("/Data/PassWord");

			if(Common.checkNull(!this.g_ReGubun)){
				return this.CommentUserCheck();
			}
			// PassWord Check
			if(vPword !== vPassWord){
				return MessageBox.error(this.getBundleText("MSG_56011"), { title: this.getBundleText("LABEL_00149")});
			}

			if(this.g_Pword === "R")
				this.RegistModel.setProperty("/Gubun", "X");
			else if(this.g_Pword === "D")
				this.onDeleteData();
			
            this._CommentModel.close();

		},

        onDialogRegistBtn: function() { // 등록
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
            var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");

			if(this.checkError()) return;

			BusyIndicator.show(0);
			var onPressRegist = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_56005")) { // 등록

					// 첨부파일 저장
					oRowData.Appnm = AttachFileAction.uploadFile.call(oController);

					oRowData.Sdate = Common.checkNull(oRowData.Sdate) ? new Date() : oRowData.Sdate;

					var sendObject = {};
					// Header
					sendObject.IConType = "2";
					sendObject.IBukrs = vBukrs;
					// Navigation property
					sendObject.TableIn2 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn2", oRowData)];
					
					oModel.create("/SuggestionBoxSet", sendObject, {
						success: function(oData, oResponse) {
								Common.log(oData);
								sap.m.MessageBox.alert(oController.getBundleText("MSG_56004"), { title: oController.getBundleText("MSG_08107")});
								BusyIndicator.hide();
								oController.navBack();
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

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_56003"), {
				title: oController.getBundleText("LABEL_56001"),
				actions: [oController.getBundleText("LABEL_56005"), oController.getBundleText("LABEL_00119")],
				onClose: onPressRegist
			});
        },

		onDialogReBtn: function() { // 수정
			var oView = $.app.byId("ZUI5_HR_Suggestions.m.Regist");

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.m.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}

			this.g_Pword = "R";
			this.PWordModel.setData({Data: {}});
			this._CommentModel.open();
		},

		onDeleteData: function() {
			var oController = this.getView().getController();
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
            var vBukrs = oController.getUserGubun();
			var oRowData = oController.RegistModel.getProperty("/FormData");

			var sendObject = {};
			// Header
			sendObject.IConType = "3";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn2 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn2", oRowData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						sap.m.MessageBox.alert(oController.getBundleText("MSG_56009"), { title: oController.getBundleText("MSG_08107")});
						BusyIndicator.hide();
						oController.navBack();
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

		onDialogDeleteBtn: function() { // 삭제
			var oController = this;
			var oView = $.app.byId("ZUI5_HR_Suggestions.m.Regist");

			if (!this._CommentModel) {
				this._CommentModel = sap.ui.jsfragment("ZUI5_HR_Suggestions.m.fragment.PassWordCheck", this);
				oView.addDependent(this._CommentModel);
			}

			BusyIndicator.show(0);
			var onPressRegist = function (fVal) {
				if (fVal && fVal == oController.getBundleText("LABEL_56014")) { // 삭제
					oController.g_Pword = "D";
					oController.PWordModel.setData({Data: {}});
					oController._CommentModel.open();
				}
				BusyIndicator.hide();
			};

			sap.m.MessageBox.confirm(oController.getBundleText("MSG_56008"), {
				title: oController.getBundleText("LABEL_56001"),
				actions: [oController.getBundleText("LABEL_56014"), oController.getBundleText("LABEL_00119")],
				onClose: onPressRegist
			});
		},

		onDialogSaveBtn: function() { // 댓글 저장
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
            var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			var oCommData = this.CommentModel.getProperty("/Data");

			// 비밀번호
			if(Common.checkNull(oCommData.Pword) || 6 > oCommData.Pword.length || oCommData.Pword.length > 10){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			// 내용
			if(Common.checkNull(oCommData.Detail)){
				MessageBox.error(oController.getBundleText("MSG_56010"), { title: oController.getBundleText("LABEL_00149")});
				return ;
			}

			oCommData.Sdate = oRowData.Sdate;
			oCommData.Seqnr = oRowData.Seqnr;

			var sendObject = {};
			// Header
			sendObject.IConType = "2";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn2 = [];
			sendObject.TableIn3 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn3", oCommData)];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					Common.log(oData);
					oController.CommentModel.setData({Data: {}});
					oController.getDetailData(oController);
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
		},

        onBeforeOpenDetailDialog: function() {
			var oController = this.getView().getController();
			var	vSdate = oController.RegistModel.getProperty("/FormData/Sdate"),
				vAppnm = oController.RegistModel.getProperty("/FormData/Appnm") || "";

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "5",
				Editable: !vSdate ? true : false
			});
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: $.app.getController().getUserId()});
		} : null
	});
});