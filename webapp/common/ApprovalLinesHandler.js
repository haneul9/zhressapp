/* eslint-disable no-extend-native */
Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

sap.ui.define(
    [
        "./Common", //
        "./SearchUser1",
        "./SearchOrg",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    function (Common, SearchUser1, SearchOrg, JSONModel, MessageBox) {
        "use strict";

        var Handler = {
            oController: null,
            oDialog: null,
            oModel: new JSONModel(),

            callback: null,

            Mode: {
                PC: "P",
                MOBILE: "M"
            },

            View: {
                P: {
                    Approval: "fragment.ApprovalLines",
                    Employee: "fragment.EmployeeSearch1",
                    Organization: "fragment.COMMON_SEARCH_ORG"
                },
                M: {
                    Approval: "fragment.ApprovalLinesM",
                    Employee: "fragment.EmployeeSearchM",
                    Organization: "fragment.COMMON_SEARCH_ORG"
                }
            },

            // DialogHandler 호출 function
            get: function (oController, initData, callback) {
                this.oController = oController;
                this.callback = callback;

                this.oModel.setProperty("/Mode", initData.Mode || this.Mode.PC);
                this.oModel.setProperty("/Pernr", initData.Pernr || "");
                this.oModel.setProperty("/Empid", initData.Empid || "");
                this.oModel.setProperty("/Bukrs", initData.Bukrs || "");
                this.oModel.setProperty("/ZappSeq", initData.ZappSeq || "");
                this.oModel.setProperty("/List", []);

                return this;
            },

            // DialogHandler 호출 function
            getLoadingProperties: function () {
                return {
                    id: "ApprovalLinesDialog",
                    name: this.View[this.oModel.getProperty("/Mode")].Approval,
                    type: "JS",
                    controller: this.oController
                };
            },

            // DialogHandler 호출 function
            getParentView: function () {
                return this.oController.getView();
            },

            // DialogHandler 호출 function
            getModel: function () {
                return this.oModel;
            },

            // DialogHandler 호출 function
            getDialog: function () {
                return this.oDialog;
            },

            // DialogHandler 호출 function
            setDialog: function (oDialog) {
                this.oDialog = oDialog;

                return this;
            },

            onBeforeOpen: function () {
                return Common.getPromise(
                    function () {
                        var oModel = this.getModel(),
                            oPayload = {
                                IZappSeq: oModel.getProperty("/ZappSeq"),
                                IBukrs: oModel.getProperty("/Bukrs"),
                                IPernr: oModel.getProperty("/Pernr"),
                                IEmpid: oModel.getProperty("/Empid"),
                                IDatum: moment().hours(9).toDate(),
                                ILangu: this.oController.getSessionInfoByKey("/Langu"),
                                IExtryn: "X",   // 외부망에서만 호출된다.(추후 내부망 호출시 공백으로 변경해야 함)
                                ApprlistMultiNav: []
                            };

                        if (!oModel.getProperty("/ZappSeq")) return;

                        $.app.getModel("ZHR_BATCHAPPROVAL_SRV").create("/ApprListMultiSet", oPayload, {
                            success: function (data) {
                                if (data.ApprlistMultiNav.results.length) {
                                    oModel.setProperty(
                                        "/List",
                                        data.ApprlistMultiNav.results.map(function (elem) {
                                            return $.extend(true, elem, {
                                                AprsqTx: "${seq}차 결재자".interpolate(elem.Aprsq),
                                                EditFlag: false
                                            });
                                        })
                                    );
                                }
                            },
                            error: function (error) {
                                Common.log(error);
                            }
                        });
                    }.bind(this)
                );
            },

            onRequest: function () {
                if (this.callback) {
                    var vApprovalLines = this.oModel.getProperty("/List");

                    if (!vApprovalLines.length) {
                        MessageBox.alert("결재자를 지정하시기 바랍니다.");
                        return;
                    }

                    this.callback(
                        vApprovalLines.map(function (elem) {
                            return Common.copyByMetadata("ZHR_BATCHAPPROVAL_SRV", "entityType", "ApprListMultiTab", elem);
                        })
                    );
                }

                this.getDialog().close();
            },

            /**
             * @brief 공통-사원검색 callback function
             */
            setSelectionTagets: function (data) {
                var vApprovalLines = this.oModel.getProperty("/List"),
                    oTargetPaths = SearchUser1.oTargetPaths;

                if (
                    vApprovalLines.some(function (elem) {
                        return elem.Apper === data.Pernr;
                    })
                ) {
                    MessageBox.warning("중복된 결재자입니다.");
                    return;
                }

                if (Common.checkNull(oTargetPaths)) {
                    // Line add
                    vApprovalLines.push({
                        Aprsq: String(vApprovalLines.length + 1),
                        AprsqTx: "${v}차 결재자".interpolate(vApprovalLines.length + 1), // ${v}차 결재자
                        Apper: data.Pernr,
                        Apnam: data.Ename,
                        Aporx: data.Fulln,
                        ApgrdT: data.ZpGradetx,
                        Ztitletx: data.Ztitletx,
                        EditFlag: true
                    });
                    this.oModel.refresh();

                    if (this.oModel.getProperty("/Mode") === this.Mode.PC) {
                        Common.adjustVisibleRowCount($.app.byId("CommonApprovalLineTable"), 5, vApprovalLines.length);
                    }
                } else {
                    // Line modify
                    this.oModel.setProperty(oTargetPaths.sPath + "/Apper", data.Pernr);
                    this.oModel.setProperty(oTargetPaths.sPath + "/Apnam", data.Ename);
                    this.oModel.setProperty(oTargetPaths.sPath + "/Aporx", data.Fulln);
                    this.oModel.setProperty(oTargetPaths.sPath + "/ApgrdT", data.ZpGradetx);
                    this.oModel.setProperty(oTargetPaths.sPath + "/Ztitletx", data.Ztitletx);
                    this.oModel.setProperty(oTargetPaths.sPath + "/EditFlag", true);
                }

                this.oController.EmployeeSearchCallOwner = null;
                SearchUser1.oTargetPaths = null;
                SearchUser1.onClose();
            },

            onLineAdd: function () {
                this.oController.EmployeeSearchCallOwner = this;

                SearchUser1.oController = this.oController;
                SearchUser1.searchAuth = "A";   // 전체 검색 권한 flag
                SearchUser1.oTargetPaths = null;

                if (!this.oController._AddPersonDialog) {
                    this.oController._AddPersonDialog = sap.ui.jsfragment(this.View[this.oModel.getProperty("/Mode")].Employee, this.oController);
                    this.oController.getView().addDependent(this.oController._AddPersonDialog);
                }

                this.oController._AddPersonDialog.open();
            },

            onLineModify: function (oEvent) {
                this.oController.EmployeeSearchCallOwner = this;

                SearchUser1.oController = this.oController;
                SearchUser1.searchAuth = "A";   // 전체 검색 권한 flag
                SearchUser1.oTargetPaths = {
                    sPath: oEvent.getSource().getBindingContext().getPath()
                };

                if (!this.oController._AddPersonDialog) {
                    this.oController._AddPersonDialog = sap.ui.jsfragment(this.View[this.oModel.getProperty("/Mode")].Employee, this.oController);
                    this.oController.getView().addDependent(this.oController._AddPersonDialog);
                }

                this.oController._AddPersonDialog.open();
            },

            onLineDelete: function (oEvent) {
                this.oModel.setProperty(
                    "/List",
                    this.oModel
                        .getProperty("/List")
                        .filter(function (elem) {
                            return elem.Apper !== oEvent.getSource().getBindingContext().getProperty().Apper;
                        })
                        .map(function (elem, idx) {
                            return $.extend(true, elem, {
                                AprsqTx: "${v}차 결재자".interpolate(idx + 1)
                            });
                        })
                );

                if (this.oModel.getProperty("/Mode") === "P") {
                    Common.adjustVisibleRowCount($.app.byId("CommonApprovalLineTable"), 5, this.oModel.getProperty("/List").length);
                }
            },

            /**
             * 공통 사원검색에서 사용되는 조직검색 호출 function
             *
             * @param {Object} oEvent
             */
            openOrgSearchDialog: function (oEvent) {
                SearchOrg.oController = this.oController;
                SearchOrg.vActionType = "Multi";
                SearchOrg.vCallControlId = oEvent.getSource().getId();
                SearchOrg.vCallControlType = "MultiInput";

                if (!this.oController.oOrgSearchDialog) {
                    this.oController.oOrgSearchDialog = sap.ui.jsfragment(this.View[this.oModel.getProperty("/Mode")].Organization, this.oController);
                    $.app.getView().addDependent(this.oController.oOrgSearchDialog);
                }

                this.oController.oOrgSearchDialog.open();
            }
        };

        return Handler;
    }
);
