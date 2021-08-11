/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common",
        "common/CommonController",
        "common/JSONModelHelper",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
        "fragment/COMMON_ATTACH_FILES"
    ],
    function (Common, CommonController, JSONModelHelper, MessageBox, BusyIndicator, FileHandler) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "Detail"].join($.app.getDeviceSuffix());

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "Detail",

            TableModel: new JSONModelHelper(),
            ApplyModel: new JSONModelHelper(),

            getUserId: function () {
                return $.app.getController().getUserId();
            },

            getUserGubun: function () {
                return $.app.getController().getUserGubun();
            },

            onInit: function () {
                this.setupView();

                this.getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );
            },

            onBeforeShow: function (oEvent) {
                BusyIndicator.show(0);

                this.ApplyModel.setData({FormData: []});
                
                if(oEvent.data.RowData){
                    this.ApplyModel.setData({FormData: oEvent.data.RowData});
                }else {
                    this.ApplyModel.setData({
                        FormData: {
                            Banka2: oEvent.data.User.IBanka,
                            Bankn2: oEvent.data.User.IBankn,
                            Bankl2: oEvent.data.User.IBankl
                        }
                    });
                }

                this.ApplyModel.setProperty("/BankList", oEvent.data.BankList);
            },

            onAfterShow: function () {
                this.onBeforeOpenDetailDialog();
                // $("#Detail-app-title-container").remove();
                BusyIndicator.hide();
            },

            navBack: function () {
                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: [$.app.CONTEXT_PATH, "Page"].join($.app.getDeviceSuffix())
                    });
            },

            checkError :function() { // Error Check
                var oController = this.getView().getController();
                var oFormData = oController.ApplyModel.getProperty("/FormData");
    
                // 은행(변경후)
                if(Common.checkNull(oFormData.Bankl)){
                    MessageBox.error(oController.getBundleText("MSG_75006"), { title: oController.getBundleText("LABEL_00149")});
                    return true;
                }

                // 계좌번호(변경후)
                if(Common.checkNull(oFormData.Bankn)){
                    MessageBox.error(oController.getBundleText("MSG_75007"), { title: oController.getBundleText("LABEL_00149")});
                    return true;
                }

                // if(FileHandler.getFileLength(oController, "001") === 0){
                // 	MessageBox.error(oController.getBundleText("MSG_75008"), { title: oController.getBundleText("MSG_08107")});
                // 	return true;
                // }
    
                return false;
            },

            getBankName: function(oEvent) {
                var vBankName = oEvent.getSource().getValue();
                this.ApplyModel.setProperty("/FormData/Banka", vBankName);
            },

            setAccountNumber: function(oEvent) {
                var inputValue = oEvent.getParameter('value').trim(),
                    convertValue = inputValue.replace(/[^\d]/g, '');
    
                oEvent.getSource().setValue(convertValue);
                this.ApplyModel.setProperty("/FormData/Bankn", convertValue);
            },
            
            onDialogApplyBtn: function() { // 신청
                var oController = this;
                var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
                var vBukrs = this.getUserGubun();
                var vPernr = this.getUserId();
                var oRowData = this.ApplyModel.getProperty("/FormData");
    
                if(this.checkError()) return;
                
                BusyIndicator.show(0);
                var onPressApply = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_75012")) { // 신청
                        
                        // 첨부파일 저장
                        oRowData.Appnm = FileHandler.uploadFiles.call(oController, ["001"]);
                        oRowData.Pernr = vPernr;
                                            
                        var sendObject = {};
                        // Header
                        sendObject.IPernr = vPernr;
                        sendObject.IEmpid = vPernr;
                        sendObject.IBukrs = vBukrs;
                        sendObject.IConType = "3";
                        // Navigation property
                        sendObject.BankAccountApplyNav1 = [Common.copyByMetadata(oModel, "BankAccountApplyTab1", oRowData)];
                        
                        oModel.create("/BankAccountApplySet", sendObject, {
                            success: function(oData) {
                                if (oData && oData.BankAccountApplyNav1) {
                                    Common.log(oData);
                                    sap.m.MessageBox.alert(oController.getBundleText("MSG_75003"), { title: oController.getBundleText("MSG_08107")});
                                    oController.navBack();
                                    BusyIndicator.hide();
                                }
                            },
                            error: function(oResponse) {
                                Common.log(oResponse);

                                sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                            }
                        });
                    }
                    BusyIndicator.hide();
                };
    
                sap.m.MessageBox.confirm(oController.getBundleText("MSG_75002"), {
                    title: oController.getBundleText("LABEL_75001"),
                    actions: [oController.getBundleText("LABEL_75012"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressApply
                });
            },
    
            onDialogDeleteBtn: function() { // 삭제
                var oController = this;
                var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
                var vBukrs = this.getUserGubun();
                var vPernr = this.getUserId();
                var oRowData = this.ApplyModel.getProperty("/FormData");
    
                BusyIndicator.show(0);
                var onPressDelete = function (fVal) {
                    if (fVal && fVal == oController.getBundleText("LABEL_75022")) { // 삭제
                                            
                        var sendObject = {};
                        // Header
                        sendObject.IPernr = vPernr;
                        sendObject.IEmpid = vPernr;
                        sendObject.IBukrs = vBukrs;
                        sendObject.IConType = "4";
                        // Navigation property
                        sendObject.BankAccountApplyNav1 = [Common.copyByMetadata(oModel, "BankAccountApplyTab1", oRowData)];
                        
                        oModel.create("/BankAccountApplySet", sendObject, {
                            success: function(oData) {
                                if (oData && oData.BankAccountApplyNav1) {
                                    Common.log(oData);
                                    sap.m.MessageBox.alert(oController.getBundleText("MSG_75005"), { title: oController.getBundleText("MSG_08107")});
                                    oController.navBack();
                                    BusyIndicator.hide();
                                }
                            },
                            error: function(oResponse) {
                                Common.log(oResponse);

                                sap.m.MessageBox.alert(Common.parseError(oResponse).ErrorMessage, {
                                    title: oController.getBundleText("LABEL_09030")
                                });
                            }
                        });
                    }
                    BusyIndicator.hide();
                };
    
                sap.m.MessageBox.confirm(oController.getBundleText("MSG_75004"), {
                    title: oController.getBundleText("LABEL_75001"),
                    actions: [oController.getBundleText("LABEL_75022"), oController.getBundleText("LABEL_00119")],
                    onClose: onPressDelete
                });
            },
    
            onBeforeOpenDetailDialog: function() {
                var oController = this.getView().getController();
                var	vAppnm = oController.ApplyModel.getProperty("/FormData/Appnm") || "",
                    vStatus = oController.ApplyModel.getProperty("/FormData/Status");
    
                FileHandler.setAttachFile(oController, { // 통장사본
                    Label: oController.getBundleText("LABEL_75023"),
                    // Required: true,
                    Appnm: vAppnm,
                    Mode: "S",
                    Editable: !vStatus
                },"001");
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: $.app.getController().getUserId() });
                  }
                : null
        });
    }
);
