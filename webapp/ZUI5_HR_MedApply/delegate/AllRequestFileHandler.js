sap.ui.define(
    [
        "common/Common",  //
        "common/AttachFileAction",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, AttachFileAction, MessageBox, JSONModel) {
        "use strict";

        var Handler = {
			oController: null,
			oDialog: null,
            oModel: new JSONModel(),
			
			callback: null,
			autoClose: true,
			zFlag: false,	// 전문직 사원만 보여주는 flag
			Zshft: false,	// 교대근무자 보여주는 flag
            
            // DialogHandler 호출 function
			get: function(oController, initData, callback) {

				this.oController = oController;
				this.callback = callback;

                this.oController.SEQ = "_10_";

				this.oModel.setProperty("/IsBusy", false);
				this.oModel.setProperty("/List", initData.List || []);

				return this;
			},

			// DialogHandler 호출 function
			getLoadingProperties: function() {

				return {
					id: "AllRequestFileDialog",
					name: "ZUI5_HR_MedApply.fragment.allRequestFile",
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

			after: function() {
                
                AttachFileAction.setAttachFile(this.oController, {
                    Appnm: null,
                    Required: true,
                    Mode: "M",
                    Max: "5",
                    Editable: true
                });
            },
            
            onRequest: function() {
                
                if (AttachFileAction.getFileLength(this.oController) === 0) {
                    MessageBox.alert(this.oController.getBundleText("MSG_08114"), {  // // 증빙서류를 첨부하세요.
                        title: this.oController.getBundleText("MSG_08107")
                    });
                    
                    return;
                }

                var Process = function(fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    this.oModel.setProperty("/IsBusy", true);

                    setTimeout(function() {
                        var promises = [];

                        this.oModel.getProperty("/List").map(function(o) {
                            return AttachFileAction.uploadQueue.call(this.oController, o.Appnm);
                        }.bind(this)).forEach(function(p) {
                            promises = promises.concat(p);
                        });

                        Promise.all(promises).then(function() {
                            this.onApproval();

                            this.oModel.setProperty("/IsBusy", false);
                        }.bind(this)).catch(function(err) {
                            Common.log(err);
                            MessageBox.error("파일 업로드에 실패했습니다.");
                        });
                    }.bind(this), 100);
                };

                MessageBox.show(this.oController.getBundleText("MSG_00060"), {
                    // 신청하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            uploadFiles: function() {

                this.oModel.getProperty("/List").forEach(function(o) {
                    AttachFileAction.setSettingByKey("Appnm", o.Appnm || null);

                    o.Appnm = AttachFileAction.uploadFile.call(this.oController);
                }.bind(this));
            },

            onApproval: function() {
                
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");

                oModel.create(
                    "/MedicalApplySet",
                    {
                        IConType: "7",  // 일괄신청
                        IBukrs: this.oController.getSessionInfoByKey("Bukrs"),
                        IPernr: this.oController.getSessionInfoByKey("Pernr"),
                        ILangu: this.oController.getSessionInfoByKey("Langu"),
                        IEmpid: this.oController.getSessionInfoByKey("Pernr"),
                        IMolga: this.oController.getSessionInfoByKey("Molga"),
                        MedicalApplyExport: [],
                        MedicalApplyTableIn: this.oModel.getProperty("/List").map(function(o) {
                            return $.extend(true, Common.copyByMetadata(oModel, "MedicalApplyTableIn", o), { PayDate: "0000000" });
                        }),
                        MedicalApplyTableIn0: [],
                        MedicalApplyTableIn3: [],
                        MedicalApplyTableIn4: [],
                        MedicalApplyTableIn5: [],
                        MedicalApplyTableInH: []
                    },
                    {
                        success: function() {
                            if (this.callback) {
                                this.callback();
                            }
                        }.bind(this),
                        error: function (res) {
                            var errData = Common.parseError(res);
                            if (errData.Error && errData.Error === "E") {
                                MessageBox.error(errData.ErrorMessage, {
                                    title: this.oController.getBundleText("LABEL_00149")
                                });
                            }
                        }.bind(this)
                    }
                );
            }
        };

        return Handler;
    }
);
