sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "./HomeLoan",
        "./ODataService",
        "./BankDialogHandler",
        "fragment/COMMON_ATTACH_FILES",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, DialogHandler, HomeLoan, ODataService, BankDialogHandler, FileHandler, MessageBox, BusyIndicator, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),

            oDetailDialog: null,
            oDeedDialog: null,
            aColumnModel: null,

            Model: function () {
                return this.oModel;
            },

            /**
             * @brief constructor
             * 	- 최초 생성시 호출
             *
             * @this {Handler}
             *
             * @param {object} oController
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM-dd",
                    Auth: $.app.getAuth(),
                    IsSearch: false,
                    isVisibleApprovalBtn: false,
                    List: [],
                    Detail: {
                        Header: {},
                        AttachDomains: [], // 첨부파일
                        ZhltypDomains: [], // 대출유형
                        ZmrgfgDomains: [], // 결혼여부
                        BanklDomains: [] // 은행
                    } // 상세
                });

                return this;
            },

            load: function () {
                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));

                return this;
            },

            /**
             * @brief 검색
             *
             * @this {Handler}
             */
            search: function () {
                BusyIndicator.show(0);

                Common.getPromise(
                    function () {
                        this.loadTableData();
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            /**
             * @brief 목록 조회
             *
             * @this {Handler}
             */
            loadTableData: function () {
                var results = ODataService.HouseLoanRequestSet.call(this.oController, HomeLoan.ProcessType.LIST, {
                    Pernr: this.oController.getSessionInfoByKey("Pernr"),
                    Begda: moment().subtract(5, "years").hours(9).toDate(),
                    Endda: moment().hours(9).toDate(),
                    isErrorShow: false
                });

                this.oModel.setProperty("/IsSearch", true);
                this.oModel.setProperty("/isVisibleApprovalBtn", (results.Export[0] || {}).BtnActive === "X" ? true : false);
                this.oModel.setProperty(
                    "/List",
                    results.TableIn1.map(function (elem) {
                        return $.extend(true, elem, {
                            Zhlrat: elem.Zhlrat ? elem.Zhlrat : "0",
                            Zhlcat: elem.Zhlcat ? elem.Zhlcat : "0"
                        });
                    })
                );

                $.app.byViewId("ApprovalTable").setFirstVisibleRow(0);
                $.app.byViewId("ApprovalTable").clearSelection();
                Common.adjustAutoVisibleRowCount.call($.app.byViewId("ApprovalTable"));
            },

            pressOpenDeed: function () {
                var vZhlsdt = this.oModel.getProperty("/Detail/Header/Zhlsdt");

                this.oModel.setProperty("/Detail/Header/ZhlsdtTxt", vZhlsdt ? moment(vZhlsdt).format("YYYY년 MM월 DD일") : moment().format("YYYY년 MM월 DD일"));

                if (!this.oDeedDialog) {
                    this.oDeedDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "deed"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oDeedDialog);
                }

                this.oDeedDialog.open();
            },

            openDetailDialog: function () {
                if (!this.oDetailDialog) {
                    this.oDetailDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "detail"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oDetailDialog);
                }

                this.oDetailDialog.open();
                this.oDetailDialog.setBusyIndicatorDelay(0).setBusy(true);
            },

            onBeforeDetailDialog: function () {
                Common.getPromise(
                    function () {
                        var vTempData = this.oModel.getProperty("/Detail/TempData"),
                            results = ODataService.HouseLoanRequestSet.call(this.oController, HomeLoan.ProcessType.DETAIL, {
                                Pernr: this.oController.getSessionInfoByKey("Pernr"),
                                isErrorShow: true,
                                TableIn1: vTempData ? [vTempData] : null
                            });

                        var vDetailInfo = $.extend(true, results.TableIn2[0], this.oModel.getProperty("/Detail/Header")),
                            vDtfmt = this.oModel.getProperty("/Dtfmt").toUpperCase();

                        this.oModel.setProperty(
                            "/Detail/AttachDomains",
                            results.TableIn3.filter(function (o) {
                                return o.IKey === "4";
                            })
                        );
                        this.oModel.setProperty(
                            "/Detail/ZhltypDomains",
                            [{ Code: "", Text: "선택" }].concat(
                                results.TableIn3.filter(function (o) {
                                    return o.IKey === "1";
                                })
                            )
                        );
                        this.oModel.setProperty(
                            "/Detail/ZmrgfgDomains",
                            [{ Code: "", Text: "선택" }].concat(
                                results.TableIn3.filter(function (o) {
                                    return o.IKey === "2";
                                })
                            )
                        );
                        this.oModel.setProperty(
                            "/Detail/BanklDomains",
                            results.TableIn3.filter(function (o) {
                                return o.IKey === "3";
                            })
                        );
                        this.oModel.setProperty(
                            "/Detail/Header",
                            $.extend(true, vDetailInfo, {
                                Zdptfn: vDetailInfo.Zdptfn === "0" ? "" : vDetailInfo.Zdptfn,
                                Zhlrat: vDetailInfo.Zhlrat === "0" ? "" : Common.numberWithCommas(vDetailInfo.Zhlrat),
                                Bankn: vDetailInfo.Bankn ? vDetailInfo.Bankn.replace(/[^\d]/g, "") : "",
                                BanklTxt: vDetailInfo.Bankl
                                    ? this.oModel.getProperty("/Detail/BanklDomains").filter(function (o) {
                                          return o.Code === vDetailInfo.Bankl;
                                      })[0].Text
                                    : "",
                                Zhltat: vDetailInfo.Zhltat ? Common.numberWithCommas(vDetailInfo.Zhltat) : "",
                                Zhlpat: vDetailInfo.Zhlpat ? Common.numberWithCommas(vDetailInfo.Zhlpat) : "",
                                Zhlcat: vDetailInfo.Zhlcat ? Common.numberWithCommas(vDetailInfo.Zhlcat) : "",
                                ZentdtTxt: vDetailInfo.Zentdt ? moment(vDetailInfo.Zentdt).format(vDtfmt) : undefined,
                                ZbirthTxt: vDetailInfo.Zbirth ? moment(vDetailInfo.Zbirth).format(vDtfmt) : undefined,
                                Begda: vDetailInfo.Begda ? vDetailInfo.Begda : moment().hours(9).toDate(),
                                BegdaTxt: vDetailInfo.Begda ? moment(vDetailInfo.Begda).format(vDtfmt) : moment().format(vDtfmt)
                            })
                        );
                    }.bind(this)
                ).then(
                    function () {
                        this.oDetailDialog.setBusy(false);
                    }.bind(this)
                );
            },

            onAfterDetailDialog: function () {
                $.app.byViewId("FilePanel").setBusyIndicatorDelay(0).setBusy(true);

                var vAppnm = this.oModel.getProperty("/Detail/Header/Appnm"),
                    vStatus = this.oModel.getProperty("/Detail/Header/Status");

                setTimeout(function () {
                    FileHandler.once.call(this.oController, vAppnm).then(function() {
                        Promise.all(this.oModel.getProperty("/Detail/AttachDomains").map(
                            function (elem) {
                                return Common.getPromise(
                                    function () {
                                        FileHandler.setAttachFile(
                                            this.oController,
                                            {
                                                Label: elem.Text,
                                                Required: elem.Code === "6" ? false : true,
                                                Appnm: vAppnm,
                                                Mode: "S",
                                                ReadAsync: true,
                                                UseMultiCategories: true,
                                                Editable: !vStatus || vStatus === "AA" ? true : false
                                            },
                                            Common.lpad(elem.Code, 3)
                                        );
                                    }.bind(this)
                                );
                            }.bind(this)
                        )).then(function () {
                            $.app.byViewId("FilePanel").setBusy(false);
                        });
                    }.bind(this));
                }.bind(this), 100);
            },

            searchBank: function () {
                setTimeout(
                    function () {
                        var initData = {
                                List: this.oModel.getProperty("/Detail/BanklDomains") || []
                            },
                            callback = function (o) {
                                this.oModel.setProperty("/Detail/Header/Bankl", o.Code || "");
                                this.oModel.setProperty("/Detail/Header/BanklTxt", o.Text || "");
                            }.bind(this);

                        DialogHandler.open(BankDialogHandler.get(this.oController, initData, callback));
                    }.bind(this),
                    0
                );
            },

            onChangeZhlrat: function (oEvent) {
                Common.onChangeMoneyInput(oEvent);

                var vInputData = this.oModel.getProperty("/Detail/Header"),
                    vZhlrat = vInputData.Zhlrat, // 대출신청금액
                    vZhlpat = vInputData.Zhlpat, // 기 대출금액
                    vZhltat = Number(vZhlrat.replace(/[^\d]/g, "")) + Number(vZhlpat.replace(/[^\d]/g, ""));

                this.oModel.setProperty("/Detail/Header/Zhltat", Common.numberWithCommas(vZhltat));
            },

            /**
             * 신청 Dialog 호출 버튼 event
             *
             * @this {Handler}
             */
            pressOpenApprovalBtn: function () {
                this.oModel.setProperty("/Detail", {
                    IsNew: true,
                    Header: {
                        Edtfg: true
                    },
                    AttachDomains: [], // 첨부파일
                    ZhltypDomains: [], // 대출유형
                    ZmrgfgDomains: [], // 결혼여부
                    BanklDomains: [] // 은행
                });

                this.openDetailDialog();
            },

            /**
             * @brief 목록 row Click event handler
             *
             * @param rowData
             */
            pressSelectRowDetail: function (rowData) {
                this.loadApprovalDetail(rowData);
            },

            loadApprovalDetail: function (rowData) {
                this.oModel.setProperty("/Detail", {
                    IsNew: false,
                    TempData: $.extend(true, {}, rowData),
                    Header: {
                        Edtfg: rowData.Status === "AA" ? true : false
                    },
                    AttachDomains: [], // 첨부파일
                    ZhltypDomains: [], // 대출유형
                    ZmrgfgDomains: [], // 결혼여부
                    BanklDomains: [] // 은행
                });

                this.openDetailDialog();
            },

            inputValidation: function () {
                var vInputData = this.oModel.getProperty("/Detail/Header");

                if (Common.checkNull(vInputData.Zdptfn)) {
                    MessageBox.alert("부양가족을 입력하세요.", { title: "안내" });
                    return false;
                }
                if (Common.checkNull(vInputData.Zmrgfg)) {
                    MessageBox.alert("결혼여부를 선택하세요.", { title: "안내" });
                    return false;
                }
                if (Common.checkNull(vInputData.Zptadr)) {
                    MessageBox.alert("현 주소를 입력하세요.", { title: "안내" });
                    return false;
                }
                if (Common.checkNull(vInputData.Zhltyp)) {
                    MessageBox.alert("대출유형을 선택하세요.", { title: "안내" });
                    return false;
                }
                if (Common.checkNull(vInputData.Zhlrat)) {
                    MessageBox.alert("대출신청금액을 입력하세요.", { title: "안내" });
                    return false;
                }
                if (Common.checkNull(vInputData.Bankl)) {
                    MessageBox.alert("지급은행을 입력하세요.", { title: "안내" });
                    return false;
                }
                if (Common.checkNull(vInputData.Bankn)) {
                    MessageBox.alert("지급계좌번호를 입력하세요.", { title: "안내" });
                    return false;
                }
                if (FileHandler.getFileLength(this.oController, "001") === 0) {
                    MessageBox.alert("지방세에 관한 파일을 등록하세요.", { title: "안내" });
                    return false;
                }
                if (FileHandler.getFileLength(this.oController, "002") === 0) {
                    MessageBox.alert("계약서에 관한 파일을 등록하세요.", { title: "안내" });
                    return false;
                }
                if (FileHandler.getFileLength(this.oController, "003") === 0) {
                    MessageBox.alert("주민등록등본에 관한 파일을 등록하세요.", { title: "안내" });
                    return false;
                }
                if (FileHandler.getFileLength(this.oController, "004") === 0) {
                    MessageBox.alert("통장사본에 관한 파일을 등록하세요.", { title: "안내" });
                    return false;
                }
                if (FileHandler.getFileLength(this.oController, "005") === 0) {
                    MessageBox.alert("신분증에 관한 파일을 등록하세요.", { title: "안내" });
                    return false;
                }

                return true;
            },

            pressApprovalBtn: function () {
                if (!this.inputValidation()) return;

                this.pressOpenDeed();
            },

            pressSaveBtn: function () {
                if (!this.inputValidation()) return;

                this.onRequest(HomeLoan.ProcessType.SAVE);
            },

            pressDeleteBtn: function () {
                this.onRequest(HomeLoan.ProcessType.DELETE);
            },

            onRequest: function (processType) {
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");
                var oInputData = this.oModel.getProperty("/Detail/Header");
                var confirmMessage;

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    if (processType === HomeLoan.ProcessType.DELETE) {
                        FileHandler.deleteDocument.call(this.oController, ["001", "002", "003", "004", "005", "006"]);
                    } else {
                        oInputData.Appnm = this.uploadFiles();
                    }

                    var payload = {};
                    payload.Pernr = this.oController.getSessionInfoByKey("Pernr");
                    payload.TableIn2 = [
                        $.extend(true, Common.copyByMetadata(oModel, "HouseLoanRequestTableIn2", oInputData), {
                            Zhlcat: oInputData.Zhlcat.replace(/[^\d]/g, ""),
                            Zhlrat: oInputData.Zhlrat.replace(/[^\d]/g, ""),
                            Zhlpat: oInputData.Zhlpat.replace(/[^\d]/g, ""),
                            Zhltat: oInputData.Zhltat.replace(/[^\d]/g, ""),
                            Zhlsdt: oInputData.Zhlsdt ? oInputData.Zhlsdt : moment().hours(9).toDate()
                        })
                    ];

                    ODataService.HouseLoanRequestSetByProcess.call(
                        this.oController,
                        processType,
                        payload,
                        function () {
                            var successMessage;

                            switch (processType) {
                                case HomeLoan.ProcessType.APPROVAL:
                                    successMessage = "신청되었습니다.";

                                    // if(!Common.isExternalIP()) {
                                    //     if(!Common.openPopup.call(this.oController, data.Export.results[0].Url)) {
                                    //         BusyIndicator.hide();
                                    //         return;
                                    //     }
                                    // }

                                    break;
                                case HomeLoan.ProcessType.SAVE:
                                    successMessage = "저장되었습니다.";
                                    break;
                                case HomeLoan.ProcessType.DELETE:
                                    successMessage = "삭제되었습니다.";
                                    break;
                                default:
                                    break;
                            }

                            MessageBox.success(successMessage, {
                                title: "확인",
                                onClose: function () {
                                    this.search.call(this);

                                    if (processType === HomeLoan.ProcessType.APPROVAL) {
                                        this.oDeedDialog.close();
                                        this.oDetailDialog.close();
                                    } else if (processType === HomeLoan.ProcessType.DELETE) {
                                        this.oDetailDialog.close();
                                    }
                                }.bind(this)
                            });

                            BusyIndicator.hide();
                        }.bind(this),
                        this.ProcessOnFail.bind(this)
                    );
                }.bind(this);

                switch (processType) {
                    case HomeLoan.ProcessType.APPROVAL:
                        confirmMessage = "신청하시겠습니까?";
                        break;
                    case HomeLoan.ProcessType.SAVE:
                        confirmMessage = "저장하시겠습니까.";
                        break;
                    case HomeLoan.ProcessType.DELETE:
                        confirmMessage = "삭제하시겠습니까.";
                        break;
                    default:
                        break;
                }

                MessageBox.show(confirmMessage, {
                    title: "확인",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            uploadFiles: function () {
                return FileHandler.uploadFiles.call(this.oController, ["001", "002", "003", "004", "005", "006"]);
            },

            ProcessOnFail: function (res) {
                var errData = Common.parseError(res);
                if (errData.Error && errData.Error === "E") {
                    MessageBox.error(errData.ErrorMessage, {
                        title: "안내"
                    });
                }

                BusyIndicator.hide();
            }
        };

        return Handler;
    }
);
