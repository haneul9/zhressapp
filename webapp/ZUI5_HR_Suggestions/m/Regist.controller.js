sap.ui.define([
	"../../common/Common",
	"../../common/CommonController",
	"../../common/JSONModelHelper",
    "../../common/AttachFileAction",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "../delegate/ViewTemplates",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/ui/richtexteditor/EditorType"
	], 
	function (Common, CommonController, JSONModelHelper, AttachFileAction, MessageBox, BusyIndicator, ViewTemplates, RTE, EditorType) {
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
		g_CommGood: "",			// 해당 댓글의 좋아요 Btn
		g_CommBed: "",			// 해당 댓글의 싫어요 Btn 
		g_CommGoodText: "",		// 해당 댓글의 좋아요 Text
		g_CommBedText: "",		// 해당 댓글의 싫어요 Text
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
		g_ReCommGood: "",		// 해당 대댓글의 좋아요 Btn
		g_ReCommBed: "",		// 해당 대댓글의 싫어요 Btn
		g_ReCommGoodText: "",	// 해당 대댓글의 좋아요 Text
		g_ReCommBedText: "",	// 해당 대댓글의 싫어요 Text

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
            var oDateBox = $.app.byId(this.PAGEID + "_RegistDateBox");
            var oIsHideBox = $.app.byId(this.PAGEID + "_IsHideBox");
            var oCommentBox = $.app.byId(this.PAGEID + "_CommentBox");
			var oThumsBox = $.app.byId(this.PAGEID + "_ThumsBox");

            if(oEvent.data){
                this.RegistModel.setData({ FormData: oEvent.data.RowData ? oEvent.data.RowData : [] });
                this.CommentModel.setData({Data: {}});
                if(Common.checkNull(oEvent.data.RowData)){
                    this.RegistModel.setData({FormData: []});
                    oCommentBox.destroyItems();
                    oDateBox.setVisible(false);
                    oIsHideBox.setVisible(true);
					oThumsBox.setVisible(false);
					this.CommentModel.setProperty("/HideComment", "X");
					this.RegistModel.setProperty("/Gubun", "");
                }else{
                    oDateBox.setVisible(true);
                    oIsHideBox.setVisible(false);
					oThumsBox.setVisible(true);
                    this.getDetailData(this, "O");
                }
            }

			Common.log("onBeforeShow");
		},
		
		onAfterShow: function() {
            this.onBeforeOpenDetailDialog();
			BusyIndicator.hide();
        },

        navBack: function() {
            sap.ui.getCore().getEventBus().publish("nav", "to", {
                id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix()),
				data: { 
                    New: "X"
                }
            });
        },

        getDetailData: function(oController, New) { // 상세정보
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = oController.getUserGubun();
			var vThumUp = $.app.byId(oController.PAGEID + "_ThumUp");
			var vThumDown = $.app.byId(oController.PAGEID + "_ThumDown");
			
			var sendObject = {};

			if(New === "O")	sendObject.IEss = "X";

			// Header
			sendObject.ISdate = oController.RegistModel.getProperty("/FormData/Sdate");
			sendObject.ISeqnr = oController.RegistModel.getProperty("/FormData/Seqnr");
			sendObject.IBukrs = vBukrs;
            sendObject.IConType = "1";
			// Navigation property
			sendObject.TableIn2 = [];
			sendObject.TableIn3 = [];
			sendObject.TableIn4 = [];
			sendObject.TableIn6 = [];
			
			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
					if (oData && oData.TableIn2) {
						Common.log(oData);
						var oCopiedRow = $.extend(true, {}, oData.TableIn2.results[0]);
						oCopiedRow.Detail = "";
						
						oData.TableIn6.results.forEach(function(e) {
							oCopiedRow.Detail += e.Detail;
						});
						
						var oCommentData = oData.TableIn3.results;
						var oSubCommentData = oData.TableIn4.results;
						oController.RegistModel.setData({FormData: oCopiedRow});
						oController.RegistModel.setProperty("/CommentData", oCommentData);
						oController.RegistModel.setProperty("/SubCommentData", oSubCommentData);

						if(localStorage && localStorage.getItem("ehr.suggestions." + oCopiedRow.Sdate + oCopiedRow.Seqnr + ".goodconfirmed") === "Y") {
							vThumUp.toggleStyleClass("button-HiTokTok-check", true);
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
							vThumUp.setEnabled(true);
							vThumDown.setEnabled(false);
						}else {
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.setEnabled(true);
						}
						
						if(localStorage && localStorage.getItem("ehr.suggestions." + oCopiedRow.Sdate + oCopiedRow.Seqnr + ".bedconfirmed") === "N") {
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.toggleStyleClass("button-HiTokTok-check", true);
							vThumUp.setEnabled(false);
							vThumDown.setEnabled(true);
						}else {
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
							vThumUp.setEnabled(true);
						}

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

        setComments: function() { // Comment Setting (댓글)
			var oController = this.getView().getController();
			var oCommentBox = $.app.byId(oController.PAGEID + "_CommentBox");
			var vCommData = oController.RegistModel.getProperty("/CommentData");
			var vIndex = 0;
			var vGood = false, vBed = false;

			oCommentBox.destroyItems();

			vCommData.forEach(function(e, i) {

				if(localStorage) {
					vGood = localStorage.getItem("ehr.suggestions." + oController.RegistModel.getProperty("/FormData/Sdate") + oController.RegistModel.getProperty("/FormData/Seqnr") + e.Seqnr2 + ".goodconfirmed") === "Y";
					vBed = localStorage.getItem("ehr.suggestions." + oController.RegistModel.getProperty("/FormData/Sdate") + oController.RegistModel.getProperty("/FormData/Seqnr") + e.Seqnr2 + ".bedconfirmed") === "N";
				}

				if((Common.checkNull(e.Zdel) && oController.RegistModel.getProperty("/SubCommentData").length === 0) || oController.RegistModel.getProperty("/SubCommentData").some(function(ele) { return ele.Seqnr2 === e.Seqnr2 || (ele.Seqnr2 !== e.Seqnr2 && Common.checkNull(e.Zdel)); })) {
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
													width: "170px",
													maxLength: 10,
													layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
													value: e.Pword,
													type: sap.m.InputType.Password
												})
											]
										}).addStyleClass("custom-HiTokTok-group"),
										new sap.m.HBox({
											justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
											alignContent: sap.m.FlexAlignContent.End,
											alignItems: sap.m.FlexAlignItems.End,
											fitContainer: true,
											width: "100%",
											items: [
												new sap.m.Text({
													width: "100px",
													text: Common.DateFormatter(e.Adatl)
												}).addStyleClass("custom-HiTokTok-group pt-6px"),
												new sap.m.HBox({
													justifyContent: sap.m.FlexJustifyContent.End,
													alignContent: sap.m.FlexAlignContent.End,
													alignItems: sap.m.FlexAlignItems.End,
													width: "100%",
													fitContainer: true,
													items: [
														new sap.ui.core.Icon({
															src: "sap-icon://thumb-up"
														})
														.addStyleClass("icon-HiTokTok ok mr-1px"),
														new sap.m.Text({
															width: "auto",
															text: e.Zgood
														}).addStyleClass("mr-12px font-12px"),
														new sap.ui.core.Icon({
															src: "sap-icon://thumb-down"
														})
														.addStyleClass("icon-HiTokTok no mr-1px"),
														new sap.m.Text({
															width: "auto",
															text: e.Zbed
														}).addStyleClass("font-12px")
													]
												}).addStyleClass("custom-HiTokTok-group")
											]
										})
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
											width: "100%",
											value: e.Detail,
											// layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
											growing: true,
											// height: "100px",
											editable: false
										})
									]
								}),
								new sap.m.HBox({
									justifyContent: sap.m.FlexJustifyContent.End,
									alignContent: sap.m.FlexAlignContent.End,
									alignItems: sap.m.FlexAlignItems.End,
									fitContainer: true,
									visible: {
										path: e.Zdel,
										formatter: function() {
											return e.Zdel !== "X";
										}
									},
									items: [
										new sap.m.Button({ 
											icon: "sap-icon://thumb-up",
											text: "{i18n>LABEL_56020}", // 좋아요
											enabled: (vGood === false && vBed === false) || vGood,
											press: oController.OnCommThumbUp.bind(oController)
										}).addStyleClass("button-light-sm")
										.toggleStyleClass("button-HiTokTok-check", vGood),
										new sap.m.Button({ 
											icon: "sap-icon://thumb-down",
											text: "{i18n>LABEL_56021}", // 싫어요
											enabled: (vGood === false && vBed === false) || vBed,
											press: oController.OnCommThumbDown.bind(oController)
										}).addStyleClass("button-light-sm")
										.toggleStyleClass("button-HiTokTok-check", vBed),
										new sap.m.Button({
											press: oController.onCommentSubBtn.bind(oController),
											icon: "sap-icon://comment",
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
								.addStyleClass("button-group custom-HiTokTok-group"),
								new sap.m.VBox({
									fitContainer: true,
									visible: false,
									items: []
								})
								.addStyleClass("ml-16px gcomment")
							]
						})
						.addStyleClass("custom-HiTokTok-comment mt-5px")
					);
	
					oController.setSubComments(e, vIndex);
					vIndex = vIndex + 1;
				}
			});
		},

        setSubComments: function(oEvent, index) { // SubComment Setting (대댓글)
			var oController = this.getView().getController();
			var vSubCommentData = oController.RegistModel.getProperty("/SubCommentData");
			var oCommentBox = $.app.byId(oController.PAGEID + "_CommentBox");
			var vGood = false;
			var vBed = false;

			if(Common.checkNull(!index) || index === 0){ // 저장된 대댓글 Setting
				vSubCommentData.forEach(function(e) {
					if(e.Seqnr2 === oEvent.Seqnr2) {
						if(localStorage) {
							vGood = localStorage.getItem("ehr.suggestions." + oController.RegistModel.getProperty("/FormData/Sdate") + oController.RegistModel.getProperty("/FormData/Seqnr") + oEvent.Seqnr2 + e.Seqnr3 + ".goodconfirmed") === "Y";
							vBed = localStorage.getItem("ehr.suggestions." + oController.RegistModel.getProperty("/FormData/Sdate") + oController.RegistModel.getProperty("/FormData/Seqnr") + oEvent.Seqnr2 + e.Seqnr3 + ".bedconfirmed") === "N";
						}

						oCommentBox.getItems()[index].getItems()[3].setVisible(true);
						oCommentBox.getItems()[index].getItems()[3].addItem(
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
														width: "170px",
														layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
														maxLength: 10,
														value: e.Pword,
														type: sap.m.InputType.Password
													})
												]
											}).addStyleClass("custom-HiTokTok-group"),
											new sap.m.HBox({
												justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
												alignContent: sap.m.FlexAlignContent.End,
												alignItems: sap.m.FlexAlignItems.End,
												fitContainer: true,
												width: "100%",
												items: [
													new sap.m.Text({ 
														width: "100px",
														text: Common.DateFormatter(e.Adatl)
													}).addStyleClass("custom-HiTokTok-group pt-6px"),
													new sap.m.HBox({
														justifyContent: sap.m.FlexJustifyContent.End,
														alignContent: sap.m.FlexAlignContent.End,
														alignItems: sap.m.FlexAlignItems.End,
														width: "100%",
														fitContainer: true,
														items: [
															new sap.ui.core.Icon({
																src: "sap-icon://thumb-up"
															})
															.addStyleClass("icon-HiTokTok ok"),
															new sap.m.Text({
																width: "auto",
																text: e.Zgood
															}).addStyleClass("mr-8px font-12px"),
															new sap.ui.core.Icon({
																src: "sap-icon://thumb-down"
															})
															.addStyleClass("icon-HiTokTok no"),
															new sap.m.Text({
																width: "auto",
																text: e.Zbed
															}).addStyleClass("font-12px")
														]
													}).addStyleClass("custom-HiTokTok-group")
												]
											})
										]
									}),
									new sap.m.HBox({
										fitContainer: true,
										items: [
											new sap.m.TextArea({ 
												width: "100%",
												value: e.Detail,
												// layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
												growing: true,
												editable: false
											}),
											new sap.m.Text({ 
												text: e.Pword,
												visible: false
											}),
											new sap.m.Text({ 
												text: e.Seqnr3,
												layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
												visible: false
											})
										]
									}),
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.End,
										alignContent: sap.m.FlexAlignContent.End,
										alignItems: sap.m.FlexAlignItems.End,
										fitContainer: true,
										visible: {
											path: e.Zdel,
											formatter: function() {
												return e.Zdel !== "X";
											}
										},
										items: [
											new sap.m.Button({ // 좋아요
												icon: "sap-icon://thumb-up",
												text: "{i18n>LABEL_56020}",
												enabled: (vGood === false && vBed === false) || vGood,
												press: oController.OnReCommThumbUp.bind(oController)
											}).addStyleClass("button-light-sm")
											.toggleStyleClass("button-HiTokTok-check", vGood),
											new sap.m.Button({ // 싫어요
												icon: "sap-icon://thumb-down",
												text: "{i18n>LABEL_56021}",
												enabled: (vGood === false && vBed === false) || vBed,
												press: oController.OnReCommThumbDown.bind(oController)
											}).addStyleClass("button-light-sm")
											.toggleStyleClass("button-HiTokTok-check", vBed),
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
									.addStyleClass("button-group custom-HiTokTok-content mt--2px")
								]
							})
							.addStyleClass("custom-HiTokTok-comment")
						);
					}
				});
			}else { // 신규 대댓글
				oController.g_ReCommBtn = oEvent.getSource().getParent().getItems()[6];
				oEvent.getSource().getParent().getParent().getItems()[3].setVisible(true);
				oEvent.getSource().getParent().getParent().getItems()[3].addItem(
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
												width: "170px",
												layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
												maxLength: 10,
												type: sap.m.InputType.Password
											})
										]
									}).addStyleClass("custom-HiTokTok-group"),
									new sap.m.HBox({
										justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
										alignContent: sap.m.FlexAlignContent.End,
										alignItems: sap.m.FlexAlignItems.End,
										fitContainer: true,
										width: "100%",
										items: [
											new sap.m.Text({
												text: ""
											}).addStyleClass("custom-HiTokTok-group pt-6px"),
											new sap.m.HBox({
												justifyContent: sap.m.FlexJustifyContent.End,
												alignContent: sap.m.FlexAlignContent.End,
												alignItems: sap.m.FlexAlignItems.End,
												width: "100%",
												fitContainer: true,
												items: [
													new sap.ui.core.Icon({
														visible: false,
														src: "sap-icon://thumb-up"
													})
													.addStyleClass("icon-HiTokTok ok mr-1px"),
													new sap.m.Text({
														visible: false,
														width: "auto",
														text: "{Zgood}"
													}),
													new sap.ui.core.Icon({
														visible: false,
														src: "sap-icon://thumb-down"
													})
													.addStyleClass("icon-HiTokTok no mr-1px"),
													new sap.m.Text({
														visible: false,
														width: "auto",
														text: "{Zbed}"
													})
												]
											}).addStyleClass("custom-HiTokTok-group")
										]
									})
								]
							}),
							new sap.m.HBox({
								fitContainer: true,
								items: [
									new sap.m.TextArea({ 
										width: "100%",
										layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										growing: true
									}),
									new sap.m.Text({ 
										visible: false
									})
								]
							}),
							new sap.m.HBox({
								justifyContent: sap.m.FlexJustifyContent.End,
								alignContent: sap.m.FlexAlignContent.End,
								alignItems: sap.m.FlexAlignItems.End,
								fitContainer: true,
								items: [
									new sap.m.Button({ // 좋아요
										visible: false,
										icon: "sap-icon://thumb-up",
										text: "{i18n>LABEL_56020}",
										press: oController.OnReCommThumbUp.bind(oController)
									}).addStyleClass("button-light-sm"),
									new sap.m.Button({ // 싫어요
										visible: false,
										icon: "sap-icon://thumb-down",
										text: "{i18n>LABEL_56021}",
										press: oController.OnReCommThumbDown.bind(oController)
									}).addStyleClass("button-light-sm"),
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
							.addStyleClass("button-group custom-HiTokTok-content mt--2px")
						]
					})
					.addStyleClass("custom-HiTokTok-comment")
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
			if(Common.checkNull(!this.g_HiSeqnr2)) this.g_HiSeqnr2 = "";
			if(Common.checkNull(!this.g_ReHiSeqnr2)) this.g_ReHiSeqnr2 = "";
			this.g_ReHiPword = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReWritBtn = oEvent.getSource().getParent().getItems()[2];
			this.g_ReSaveBtn = oEvent.getSource().getParent().getItems()[3];
			this.g_ReCanBtn = oEvent.getSource().getParent().getItems()[5];
			this.g_RePwordBox = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[0];
			this.g_RePwordInput = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[0].getItems()[1];
			this.g_ReDetail = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[0];
			this.g_ReDate = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[1].getItems()[0];
			this.g_ReHiSeqnr2 = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[2];
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];

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

			if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
			if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";

			this.g_ReDetail = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[0];
			this.g_RePwordInput = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[0].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[2];
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];

			// 비밀번호
			if(!/(?=.*\d{1,10})(?=.*[~`!@#$%\^&*()-+=]{1,10})(?=.*[a-zA-Z]{1,10}).{6,10}$/.test(this.g_RePwordInput.getValue())){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
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
					if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
					if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";
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
			if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
			if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";
			this.g_RePwordInput = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[0].getItems()[1];
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[2];
			this.g_ReHiPword = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[1];
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
						if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
						if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";
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
			if(!/(?=.*\d{1,10})(?=.*[~`!@#$%\^&*()-+=]{1,10})(?=.*[a-zA-Z]{1,10}).{6,10}$/.test(this.g_HiInputPword.getValue())){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
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
					if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
					if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";
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
			var oPWord = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[0];
			var oView = $.app.byId("ZUI5_HR_Suggestions.m.Regist");
			if(Common.checkNull(!this.g_HiSeqnr2)) this.g_HiSeqnr2 = "";
			if(Common.checkNull(!this.g_ReHiSeqnr2)) this.g_ReHiSeqnr2 = "";
			this.g_Input = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[2];
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReCommBtn = oEvent.getSource().getParent().getItems()[2];
			this.g_ReBtn = oEvent.getSource().getParent().getItems()[3];
			this.g_SaveBtn = oEvent.getSource().getParent().getItems()[4];
			this.g_CanBtn = oEvent.getSource().getParent().getItems()[6];
			this.g_HiBox = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[0];
			this.g_HiInputPword = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[0].getItems()[1];
			this.g_CoDate = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[1].getItems()[0];
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
			if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
			if(Common.checkNull(!this.g_ReHiSeqnr2)) this.g_ReHiSeqnr2 = "";
			this.g_HiPword = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[0];
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[1];
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
						if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
						if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";
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
			if(!/(?=.*\d{1,10})(?=.*[~`!@#$%\^&*()-+=]{1,10})(?=.*[a-zA-Z]{1,10}).{6,10}$/.test(oFormData.Pword)){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
			}

			return false;
		},

		ReCommentCheck: function() { // 대댓글 수정/삭제 비밀번호 확인
			var oController = this.getView().getController();

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
			
			if(this.g_ReGubun === "RR" || this.g_ReGubun === "RD")
				return oController.ReCommentCheck();

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
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var oRowData = this.RegistModel.getProperty("/FormData");
			var vBukrs = this.getUserGubun();

			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : Common.checkNull(this.g_HiSeqnr2) ? undefined : this.g_HiSeqnr2.getText(),
				Seqnr3 : Common.checkNull(this.g_ReHiSeqnr2) ? undefined : this.g_ReHiSeqnr2.getText(),
				Pword : oController.PWordModel.getProperty("/Data/PassWord")
			};

			var sendObject = {};
			// Header
			sendObject.IConType = "5";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(Common.checkNull(!oController.g_ReGubun)){
							return oController.CommentUserCheck();
						}
			
						if(oController.g_Pword === "R"){
							oController.RegistModel.setProperty("/Gubun", "X");
							oController.onBeforeOpenDetailDialog();
						}else if(oController.g_Pword === "D")
							oController.onDeleteData();
						
						if(Common.checkNull(!oController.g_HiSeqnr2)) oController.g_HiSeqnr2 = "";
						if(Common.checkNull(!oController.g_ReHiSeqnr2)) oController.g_ReHiSeqnr2 = "";

						oController._CommentModel.close();
				},
				error: function(oResponse) {
					Common.log(oResponse);
					sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
						title: oController.getBundleText("LABEL_09030")
					});
				}
			});
		},

		OnThumbUp: function() { // 좋아요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var vThumUp = $.app.byId(oController.PAGEID + "_ThumUp");
			var vThumDown = $.app.byId(oController.PAGEID + "_ThumDown");
			var oRowData = this.RegistModel.getProperty("/FormData");
			
			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Zgood : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".goodconfirmed") === "Y") {
				oSendData.Zcanc = "X";
			}

			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".goodconfirmed") !== "Y") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".goodconfirmed", "Y");
							vThumUp.setEnabled(true);
							vThumDown.setEnabled(false);
							oController.RegistModel.setProperty("/FormData/Zgood", parseInt(oController.RegistModel.getProperty("/FormData/Zgood")) + 1);
							vThumUp.toggleStyleClass("button-HiTokTok-check", true);
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".goodconfirmed", "");
							vThumUp.setEnabled(true);
							vThumDown.setEnabled(true);
							oController.RegistModel.setProperty("/FormData/Zgood", parseInt(oController.RegistModel.getProperty("/FormData/Zgood")) - 1);
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
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

		OnThumbDown: function() { // 싫어요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var vThumUp = $.app.byId(oController.PAGEID + "_ThumUp");
			var vThumDown = $.app.byId(oController.PAGEID + "_ThumDown");
			var oRowData = this.RegistModel.getProperty("/FormData");
			
			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Zbed : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".bedconfirmed") === "N") 
				oSendData.Zcanc = "X";

			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".bedconfirmed") !== "N") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".bedconfirmed", "N");
							vThumUp.setEnabled(false);
							vThumDown.setEnabled(true);
							oController.RegistModel.setProperty("/FormData/Zbed", parseInt(oController.RegistModel.getProperty("/FormData/Zbed")) + 1);
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.toggleStyleClass("button-HiTokTok-check", true);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + ".bedconfirmed", "");
							vThumUp.setEnabled(true);
							vThumDown.setEnabled(true);
							oController.RegistModel.setProperty("/FormData/Zbed", parseInt(oController.RegistModel.getProperty("/FormData/Zbed")) - 1);
							vThumUp.toggleStyleClass("button-HiTokTok-check", false);
							vThumDown.toggleStyleClass("button-HiTokTok-check", false);
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

		OnCommThumbUp: function(oEvent) { // 댓글 좋아요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[1];
			this.g_CommGoodText = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[1].getItems()[1].getItems()[1];
			this.g_CommGood = oEvent.getSource();
			this.g_CommBed = oEvent.getSource().getParent().getItems()[1];

			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : this.g_HiSeqnr2.getText(),
				Zgood : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + this.g_HiSeqnr2.getText() + ".goodconfirmed") === "Y") 
				oSendData.Zcanc = "X";

			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".goodconfirmed") !== "Y") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".goodconfirmed", "Y");
							oController.g_CommGood.setEnabled(true);
							oController.g_CommBed.setEnabled(false);
							oController.g_CommGoodText.setText(parseInt(oController.g_CommGoodText.getText()) + 1);
							oController.g_CommGood.toggleStyleClass("button-HiTokTok-check", true);
							oController.g_CommBed.toggleStyleClass("button-HiTokTok-check", false);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".goodconfirmed", "");
							oController.g_CommGood.setEnabled(true);
							oController.g_CommBed.setEnabled(true);
							oController.g_CommGoodText.setText(parseInt(oController.g_CommGoodText.getText()) - 1);
							oController.g_CommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_CommBed.toggleStyleClass("button-HiTokTok-check", false);
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

		OnCommThumbDown: function(oEvent) { // 댓글 싫어요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[1];
			this.g_CommBedText = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[1].getItems()[1].getItems()[3];
			this.g_CommGood = oEvent.getSource().getParent().getItems()[0];
			this.g_CommBed = oEvent.getSource();
			
			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : this.g_HiSeqnr2.getText(),
				Zbed : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + this.g_HiSeqnr2.getText() + ".bedconfirmed") === "N") 
				oSendData.Zcanc = "X";

			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".bedconfirmed") !== "N") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".bedconfirmed", "N");
							oController.g_CommGood.setEnabled(false);
							oController.g_CommBed.setEnabled(true);
							oController.g_CommBedText.setText(parseInt(oController.g_CommBedText.getText()) + 1);
							oController.g_CommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_CommBed.toggleStyleClass("button-HiTokTok-check", true);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + ".bedconfirmed", "");
							oController.g_CommGood.setEnabled(true);
							oController.g_CommBed.setEnabled(true);
							oController.g_CommBedText.setText(parseInt(oController.g_CommBedText.getText()) - 1);
							oController.g_CommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_CommBed.toggleStyleClass("button-HiTokTok-check", false);
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

		OnReCommThumbUp: function(oEvent) { // 대댓글 좋아요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[2];
			this.g_ReCommGoodText = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[1].getItems()[1].getItems()[1];
			this.g_ReCommGood = oEvent.getSource();
			this.g_ReCommBed = oEvent.getSource().getParent().getItems()[1];

			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : this.g_HiSeqnr2.getText(),
				Seqnr3 : this.g_ReHiSeqnr2.getText(),
				Zgood : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + this.g_HiSeqnr2.getText() + this.g_ReHiSeqnr2.getText() + ".goodconfirmed") === "Y") 
				oSendData.Zcanc = "X";

			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".goodconfirmed") !== "Y") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".goodconfirmed", "Y");
							oController.g_ReCommGood.setEnabled(true);
							oController.g_ReCommBed.setEnabled(false);
							oController.g_ReCommGoodText.setText(parseInt(oController.g_ReCommGoodText.getText()) + 1);
							oController.g_ReCommGood.toggleStyleClass("button-HiTokTok-check", true);
							oController.g_ReCommBed.toggleStyleClass("button-HiTokTok-check", false);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".goodconfirmed", "");
							oController.g_ReCommGood.setEnabled(true);
							oController.g_ReCommBed.setEnabled(true);
							oController.g_ReCommGoodText.setText(parseInt(oController.g_ReCommGoodText.getText()) - 1);
							oController.g_ReCommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_ReCommBed.toggleStyleClass("button-HiTokTok-check", false);
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

		OnReCommThumbDown: function(oEvent) { // 대댓글 싫어요
			var oController = this;
			var oModel = $.app.getModel("ZHR_COMMON_SRV");
			var vBukrs = this.getUserGubun();
			var oRowData = this.RegistModel.getProperty("/FormData");
			this.g_HiSeqnr2 = oEvent.getSource().getParent().getParent().getParent().getParent().getItems()[1].getItems()[1];
			this.g_ReHiSeqnr2 = oEvent.getSource().getParent().getParent().getItems()[1].getItems()[2];
			this.g_ReCommBedText = oEvent.getSource().getParent().getParent().getItems()[0].getItems()[1].getItems()[1].getItems()[3];
			this.g_ReCommGood = oEvent.getSource().getParent().getItems()[0];
			this.g_ReCommBed = oEvent.getSource();
			
			var oSendData = {
				Sdate : oRowData.Sdate,
				Seqnr : oRowData.Seqnr,
				Seqnr2 : this.g_HiSeqnr2.getText(),
				Seqnr3 : this.g_ReHiSeqnr2.getText(),
				Zbed : "X"
			};
			
			if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + this.g_HiSeqnr2.getText() + this.g_ReHiSeqnr2.getText() + ".bedconfirmed") === "N") 
				oSendData.Zcanc = "X";

			var sendObject = {};
			// Header
			sendObject.IConType = "4";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn5 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn5", oSendData)];

			oModel.create("/SuggestionBoxSet", sendObject, {
				success: function(oData, oResponse) {
						Common.log(oData);
						if(localStorage && localStorage.getItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".bedconfirmed") !== "N") {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".bedconfirmed", "N");
							oController.g_ReCommBed.setEnabled(true);
							oController.g_ReCommGood.setEnabled(false);
							oController.g_ReCommBedText.setText(parseInt(oController.g_ReCommBedText.getText()) + 1);
							oController.g_ReCommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_ReCommBed.toggleStyleClass("button-HiTokTok-check", true);
						}else {
							localStorage.setItem("ehr.suggestions." + oRowData.Sdate + oRowData.Seqnr + oController.g_HiSeqnr2.getText() + oController.g_ReHiSeqnr2.getText() + ".bedconfirmed", "");
							oController.g_ReCommBed.setEnabled(true);
							oController.g_ReCommGood.setEnabled(true);
							oController.g_ReCommBedText.setText(parseInt(oController.g_ReCommBedText.getText()) - 1);
							oController.g_ReCommGood.toggleStyleClass("button-HiTokTok-check", false);
							oController.g_ReCommBed.toggleStyleClass("button-HiTokTok-check", false);
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
			var oList = [],
				oDetailList = [];

			oList = oRowData.Detail.match(new RegExp('.{1,' + 4000 + '}', 'g'));
			
			oList.forEach(function(e) {
				var oDetailObj = {};
				oDetailObj.Detail = e;
				oDetailList.push(Common.copyByMetadata(oModel, "SuggestionBoxTableIn6", oDetailObj));
			});

			delete oRowData.Detail;

			var sendObject = {};
			// Header
			sendObject.IConType = "3";
			sendObject.IBukrs = vBukrs;
			// Navigation property
			sendObject.TableIn2 = [Common.copyByMetadata(oModel, "SuggestionBoxTableIn2", oRowData)];
			sendObject.TableIn6 = oDetailList;
			
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
			if(!/(?=.*\d{1,10})(?=.*[~`!@#$%\^&*()-+=]{1,10})(?=.*[a-zA-Z]{1,10}).{6,10}$/.test(oCommData.Pword)){
				MessageBox.error(oController.getBundleText("MSG_56007"), { title: oController.getBundleText("LABEL_00149")});
				return true;
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
				vAppnm = oController.RegistModel.getProperty("/FormData/Appnm") || "",
				vGubun = oController.RegistModel.getProperty("/Gubun") || "";

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
					// layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
					width: "100%",
					height: "350px",
					customToolbar: true,
					showGroupFont: true,
					// showGroupLink: true,
					// showGroupInsert: true,
					value: "{Detail}",
					editable: {
						parts: [{path: "Sdate"}, {path: "/Gubun"}],
						formatter: function(v1, v2) {
							return !v1 || v2 === "X";
						}
					},
					ready: function () {
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
								var vDetailList = v.split("<img");
								if(vDetailList.length === 1) {
									return /^</i.test(v) ? v : "<p>${content}</p>".interpolate(v);
								}

								var vHtml = [];
								vDetailList.forEach(function(ele, index) {
									if(index === 0){
										vHtml.push(ele);
									}else{
										vHtml.push(ele.replace(" src=", '<img style="max-width: 100%;" src='));
									}
								});
								
								return vHtml.join("");
							}
						}
					}
				})
				.addStyleClass("w-100")
			);

			$.app.byId("myRTE").addStyleClass("mxw-100");

			AttachFileAction.setAttachFile(oController, {
				Appnm: vAppnm,
				Mode: "M",
				Max: "5",
				Editable: Common.checkNull(vSdate) || (Common.checkNull(!vSdate) && vGubun === "X") ? true : false
			});
		},

		getLocalSessionModel: Common.isLOCAL() ? function() {
			return new JSONModelHelper({name: $.app.getController().getUserId()});
		} : null
	});
});