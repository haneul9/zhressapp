/* eslint-disable no-empty */
/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
		"common/AttachFileAction",
        "./ODataService",
        "./OutLang",
		"sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, AttachFileAction, ODataService, OutLang, MessageBox, BusyIndicator, JSONModel) {
        "use strict";

        var Handler = {
			oController: null,
			oDialog: null,
            oModel: new JSONModel(),
			
            // DialogHandler 호출 function
			get: function(oController, initData) {

                this.oController = oController;
                this.oModel.setProperty("/IsViewMode", initData.IsViewMode);
                if(initData.Info) {
                    this.oModel.setProperty("/Info", $.extend(true, initData.Info, {
                        Lcsco: initData.Info.Lcsco === "-" ? "0" : initData.Info.Lcsco,
                        Rcsco: initData.Info.Rcsco === "-" ? "0" : initData.Info.Rcsco,
                        Wcsco: initData.Info.Wcsco === "-" ? "0" : initData.Info.Wcsco,
                        Ttsco: initData.Info.Ttsco === "-" ? "0" : initData.Info.Ttsco,
                        Tcsco: initData.Info.Tcsco === "-" ? "0" : initData.Info.Tcsco
                    }));
                } else {
                    this.oModel.setProperty("/Info", {});
                }

				return this;
			},

			// DialogHandler 호출 function
			getLoadingProperties: function() {

				return {
					id: "DetailDialog",
					name: [$.app.CONTEXT_PATH, "Detail"].join(".fragment."),
					type: "JS",
					controller: this.oController
				};
			},

			// DialogHandler 호출 function
			getParentView: function() {

				return this.oController.getView();
			},

			// DialogHandler 호출 function
			getModel: function() {

				return this.oModel;
			},

			// DialogHandler 호출 function
			getDialog: function() {

				return this.oDialog;
			},

			// DialogHandler 호출 function
			setDialog: function(oDialog) {

				this.oDialog = oDialog;

				return this;
            },
            
            once: function() {
                return Promise.all([
                    Common.getPromise(function() {
                        this.oModel.setProperty(
                            "/Langs", 
                            ODataService.CommonCodeListHeaderSet.call(this.oController, {
                                Pernr: this.oController.getSessionInfoByKey("Pernr"),
                                Bukrs: this.oController.getSessionInfoByKey("Bukrs2"),
                                Langu: this.oController.getSessionInfoByKey("Langu"),
                                CodeT: "055",
                                Codty: "",
                                IsContainsAll: true
                            })
                        );
                    }.bind(this)),
                    Common.getPromise(function() {
                        this.oModel.setProperty(
                            "/Exams", 
                            [{ Code: "ALL", Text: this.oController.getBundleText("LABEL_00118") }]
                        );
                    }.bind(this)),
                    Common.getPromise(function() {
                        this.oModel.setProperty(
                            "/Tesars", 
                            ODataService.CommonCodeListHeaderSet.call(this.oController, {
                                Pernr: this.oController.getSessionInfoByKey("Pernr"),
                                Bukrs: this.oController.getSessionInfoByKey("Bukrs2"),
                                Langu: this.oController.getSessionInfoByKey("Langu"),
                                CodeT: "001",
                                Codty: "EE330",
                                IsContainsAll: false
                            })
                        );
                    }.bind(this))
                ]);
            },

			onBeforeOpen: function() {
				return Common.getPromise(function() {
                    this.oModel.setProperty("/Info/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                    this.oModel.setProperty("/Info/Bukrs", this.oController.getSessionInfoByKey("Bukrs"));
                    if(!this.oModel.getProperty("/IsViewMode")) {
                        this.oModel.setProperty("/Info/Forcd", "ALL");
                        this.oModel.setProperty("/Info/Tescd", "ALL");
                        this.oModel.setProperty("/Info/Tesgr", "ALL");
                        this.oModel.setProperty("/Info/Tesar", "D");
                        this.oModel.setProperty("/Info/Certn", "");
                        this.oModel.setProperty("/Info/Ttsco", 0);
                    } else {
                        this.oModel.setProperty(
                            "/Exams", 
                            ODataService.CommonCodeListHeaderSet.call(this.oController, {
                                Pernr: this.oController.getSessionInfoByKey("Pernr"),
                                Bukrs: this.oController.getSessionInfoByKey("Bukrs2"),
                                Langu: this.oController.getSessionInfoByKey("Langu"),
                                CodeT: "056",
                                Codty: this.oModel.getProperty("/Info/Forcd"),
                                IsContainsAll: true
                            })
                        );

                        var vExamInfo = this.oModel.getProperty("/Exams").filter(function(item) {
                            return item.Code === this.oModel.getProperty("/Info/Tescd");
                        }.bind(this))[0];

                        this.oModel.setProperty("/Info/Codty", vExamInfo.Seqnr);
                        this.oModel.setProperty("/Info/TextA", vExamInfo.TextA);

                        this.oModel.setProperty(
                            "/Info/IsHSK",
                            (this.oController.getSessionInfoByKey("Bukrs") === "A100" || this.oController.getSessionInfoByKey("Bukrs") === "1000")
                                && this.oModel.getProperty("/Info/Forcd") === "0003" && this.oModel.getProperty("/Info/Tescd") === "01"
                                    ? true : false
                        );
                        this.oModel.setProperty(
                            "/Tesgrs", 
                            ODataService.CommonCodeListHeaderSet.call(this.oController, {
                                Pernr: this.oController.getSessionInfoByKey("Pernr"),
                                Bukrs: this.oController.getSessionInfoByKey("Bukrs2"),
                                Langu: this.oController.getSessionInfoByKey("Langu"),
                                CodeT: "033",
                                Codty: vExamInfo.Seqnr,
                                Code: this.oModel.getProperty("/Info/Forcd") + this.oModel.getProperty("/Info/Tescd"),
                                IsContainsAll: true
                            })
                        );
                    }

                    AttachFileAction.setAttachFile(this.oController, {
                        Editable: this.oModel.getProperty("/IsViewMode") === false || this.oModel.getProperty("/Info/Status") === "AA" ? true : false,
                        Appnm: this.oModel.getProperty("/IsViewMode") ? this.oModel.getProperty("/Info/Appnm") : "",
                        Mode: "M",
                        Max: 5,
                        FileTypes: ["ppt", "pptx", "doc", "docx", "xls", "xlsx", "jpg", "bmp", "gif", "png", "txt", "pdf", "zip", "heic", "jpeg"], 
                        InfoMessage: this.oController.getBundleText("MSG_51001"),   // 성적표의 스캔이미지 파일(jpg 또는 gif 포멧)을 첨부하시기 바랍니다.
                        fnChange: function() {
                            this.getDetailHandler().toggleIsPossibleSave.call(this.getDetailHandler());
                        }
                    });

                    this.toggleIsPossibleSave();
                }.bind(this));
            },

            onChangeInput: function() {
                this.toggleIsPossibleSave();
            },

            /**
             * @brief 저장/신청버튼 활성화 여부
             *        - 필수 항목이 모두 작성된 경우
             */
            toggleIsPossibleSave: function() {
                this.NOT_VALID_FORM_CONTROL_COUNT = 0;
                this.validControl($.app.byId("LanguageInputForm")); // recursive call

                this.oModel.setProperty(
                    "/IsPossibleSave",
                    (this.NOT_VALID_FORM_CONTROL_COUNT === 0) && $.app.byId("Page_CAF_Table").getModel().getProperty("/Data").length ? true : false
                );
            },

            validControl: function (oControl) {
                // base case
                var childItems = oControl.getAggregation("items");
                if (oControl === null || childItems === null) {return;}

                // Recursion
                childItems.forEach(function (control) {
                    try {
                        var constructorName = control.constructor.getMetadata().getName();
                        if(control.getParent().getVisible() && control.getVisible() && control.getRequired() 
                            && (control.getProperty(OutLang.ValidateProperties[constructorName]) === "" 
                                || control.getProperty(OutLang.ValidateProperties[constructorName]) === null
                                || control.getProperty(OutLang.ValidateProperties[constructorName]) === "ALL")) {
                            this.NOT_VALID_FORM_CONTROL_COUNT++;
                        }
                    } catch(ex) {}  // Not valid control
                    this.validControl(control);
                }, this);

                return;
            },

            onChangeLang: function(oEvent) {
                var vSelectedKey = oEvent.getSource().getSelectedKey();

                BusyIndicator.show(0);

                Common.getPromise(function() {
                    this.oModel.setProperty("/IsPossibleSave", false);
                    this.oModel.setProperty("/Info/Tescd", "ALL");
                    this.oModel.setProperty("/Info/Codty", undefined);
                    this.oModel.setProperty("/Info/TextA", undefined);
                    this.oModel.setProperty("/Info/IsHSK", undefined);
                    this.oModel.setProperty("/Info/Certn", "");
                    this.oModel.setProperty("/Info/Tesar", "D");
                    this.oModel.setProperty("/Info/Evldd", undefined);
                    this.oModel.setProperty("/Info/Tesgr", "ALL");
                    this.oModel.setProperty("/Info/Lcsco", undefined);
                    this.oModel.setProperty("/Info/Rcsco", undefined);
                    this.oModel.setProperty("/Info/Wcsco", undefined);
                    this.oModel.setProperty("/Info/Tcsco", undefined);
                    this.oModel.setProperty("/Info/Ttsco", 0);

                    this.oModel.setProperty(
                        "/Exams", 
                        ODataService.CommonCodeListHeaderSet.call(this.oController, {
                            Pernr: this.oController.getSessionInfoByKey("Pernr"),
                            Bukrs: this.oController.getSessionInfoByKey("Bukrs2"),
                            Langu: this.oController.getSessionInfoByKey("Langu"),
                            CodeT: "056",
                            Codty: vSelectedKey === "ALL" ? undefined : vSelectedKey,
                            IsContainsAll: true
                        })
                    );
                }.bind(this)).then(function() {
                    BusyIndicator.hide();
                });
            },

            onChangeExam: function(oEvent) {
                var vSelectedKey = oEvent.getSource().getSelectedKey(),
                    vSelectedItemInfo = this.oModel.getProperty("/Exams").filter(function(item) {
                        return item.Code === vSelectedKey;
                    });

                this.oModel.setProperty("/IsPossibleSave", false);
                this.oModel.setProperty("/Info/Codty", vSelectedItemInfo[0].Seqnr);
                this.oModel.setProperty("/Info/TextA", vSelectedItemInfo[0].TextA);
                this.oModel.setProperty("/Info/Certn", "");
                this.oModel.setProperty("/Info/Evldd", undefined);
                this.oModel.setProperty("/Info/Tesar", "D");
                this.oModel.setProperty("/Info/Tesgr", "ALL");
                this.oModel.setProperty("/Info/Lcsco", undefined);
                this.oModel.setProperty("/Info/Rcsco", undefined);
                this.oModel.setProperty("/Info/Wcsco", undefined);
                this.oModel.setProperty("/Info/Tcsco", undefined);
                this.oModel.setProperty("/Info/Ttsco", 0);

                if(vSelectedKey === "ALL") {return;}

                Common.getPromise(function() {
                    this.oModel.setProperty(
                        "/Info/IsHSK",
                        (this.oController.getSessionInfoByKey("Bukrs") === "A100" || this.oController.getSessionInfoByKey("Bukrs") === "1000")
                            && this.oModel.getProperty("/Info/Forcd") === "0003" && vSelectedKey === "01"
                                ? true : false
                    );
                    this.oModel.setProperty(
                        "/Tesgrs", 
                        ODataService.CommonCodeListHeaderSet.call(this.oController, {
                            Pernr: this.oController.getSessionInfoByKey("Pernr"),
                            Bukrs: this.oController.getSessionInfoByKey("Bukrs2"),
                            Langu: this.oController.getSessionInfoByKey("Langu"),
                            CodeT: "033",
                            Codty: vSelectedItemInfo[0].Seqnr,
                            Code: this.oModel.getProperty("/Info/Forcd") + vSelectedKey,
                            IsContainsAll: true
                        })
                    );
                }.bind(this));
            },

            calcTotScore: function(oEvent) {
                Common.setOnlyDigit(oEvent);

                this.oModel.setProperty(
                    "/Info/Ttsco", 
                    parseInt(this.oModel.getProperty("/Info/Lcsco") || 0)
                    + parseInt(this.oModel.getProperty("/Info/Rcsco") || 0)
                    + parseInt(this.oModel.getProperty("/Info/Wcsco") || 0)
                    + parseInt(this.oModel.getProperty("/Info/Tcsco") || 0)
                );

                this.onChangeInput.call(this);
            },

            onPressDeleteBtn: function() {
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oInputData = this.oModel.getProperty("/Info");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) {return;}

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.IConType = OutLang.ProcessType.DELETE;
                    payload.IBukrs = this.oController.getSessionInfoByKey("Bukrs");
                    payload.IPernr = this.oController.getSessionInfoByKey("Pernr");
                    payload.IEmpid = this.oController.getSessionInfoByKey("Pernr");
                    payload.ILangu = this.oController.getSessionInfoByKey("Langu");
                    payload.IDatum = moment().hours(10).toDate();

                    payload.LanguageApp1Nav = [
                        $.extend(true, Common.copyByMetadata(oModel, "LanguageApplyTab1", oInputData), {
                            Pernr: this.oController.getSessionInfoByKey("Pernr"),
                            Tescd: oInputData.Forcd + oInputData.Tescd,
                            Tesgr: oInputData.Tesgr === "ALL" ? null : oInputData.Tesgr
                        })
                    ];
                    payload.LanguageApp2Nav = [];

                    ODataService.LanguageApplySetByProcess.call(
                        this.oController, 
                        payload, 
                        function() {
                            var StatusHandler = this.oController.getStatusListHandler();

                            MessageBox.success(this.oController.getBundleText("MSG_00021"), {   // 삭제되었습니다.
                                title: this.oController.getBundleText("LABEL_00150"),
                                onClose: function () {
                                    StatusHandler.search.call(StatusHandler);
                                    this.oDialog.close();
                                }.bind(this)
                            });
                            
                            BusyIndicator.hide();
                        }.bind(this), 
                        function(res) {
                            var errData = Common.parseError(res);
                            if (errData.Error && errData.Error === "E") {
                                MessageBox.error(errData.ErrorMessage, {
                                    title: this.oController.getBundleText("LABEL_00149")
                                });
                            }

                            BusyIndicator.hide();
                        }.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_00059"), {
                    // 삭제하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            onPressSaveBtn: function() {
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oInputData = this.oModel.getProperty("/Info");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) {return;}

                    BusyIndicator.show(0);

                    // 첨부파일 저장
                    oInputData.Appnm = AttachFileAction.uploadFile.call(this.oController);

                    var payload = {};
                    payload.IConType = this.oModel.getProperty("/IsViewMode") ? OutLang.ProcessType.UPDATE : OutLang.ProcessType.CREATE;
                    payload.IBukrs = this.oController.getSessionInfoByKey("Bukrs");
                    payload.IPernr = this.oController.getSessionInfoByKey("Pernr");
                    payload.IEmpid = this.oController.getSessionInfoByKey("Pernr");
                    payload.ILangu = this.oController.getSessionInfoByKey("Langu");
                    payload.IDatum = moment().hours(10).toDate();

                    payload.LanguageApp1Nav = [
                        $.extend(true, Common.copyByMetadata(oModel, "LanguageApplyTab1", oInputData), {
                            Pernr: this.oController.getSessionInfoByKey("Pernr"),
                            Tescd: oInputData.Forcd + oInputData.Tescd,
                            Tesgr: oInputData.Tesgr === "ALL" ? null : oInputData.Tesgr
                        })
                    ];
                    payload.LanguageApp2Nav = [];

                    ODataService.LanguageApplySetByProcess.call(
                        this.oController, 
                        payload, 
                        function() {
                            var StatusHandler = this.oController.getStatusListHandler();

                            MessageBox.success(this.oController.getBundleText("MSG_00017"), {   // 저장되었습니다.
                                title: this.oController.getBundleText("LABEL_00150"),
                                onClose: function () {
                                    StatusHandler.search.call(StatusHandler);
                                    this.oDialog.close();
                                }.bind(this)
                            });
                            
                            BusyIndicator.hide();
                        }.bind(this), 
                        function(res) {
                            var errData = Common.parseError(res);
                            if (errData.Error && errData.Error === "E") {
                                MessageBox.error(errData.ErrorMessage, {
                                    title: this.oController.getBundleText("LABEL_00149")
                                });
                            }

                            BusyIndicator.hide();
                        }.bind(this)
                    );
                };

                MessageBox.show(this.oController.getBundleText("MSG_00058"), {
                    // 저장하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            }
        };

        return Handler;
    }
);
