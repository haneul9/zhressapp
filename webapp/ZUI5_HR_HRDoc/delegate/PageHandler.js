/* eslint-disable no-empty */
/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "./ODataService",
        "common/SearchUser1",
        "common/SearchOrg",
        "./HRDoc",
        "./Signature",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, ODataService, SearchUser1, SearchOrg, HRDoc, Signature, MessageBox, MessageToast, BusyIndicator, JSONModel) {
        "use strict";

        var PageHandler = {
            oController: null,
            oModel: new JSONModel(),
            Signature: null,

            NOT_VALID_SUMMARY_CONTROL_COUNT: 0,

            oDetailDialog: null,
            oAddPersonDialog: null,
            oOrgSearchDialog: null,
            oFormDialog: null,
            oSignatureDialog: null,

            noImgPath: "images/no-image.png",

            Model: function () {
                return this.oModel;
            },

            /**
             * constructor
             * 	- 최초 생성시 호출
             *
             * @param {object} oController
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM-dd",
                    Auth: $.app.getAuth(),
                    IsHassView: $.app.getAuth() === $.app.Auth.HASS ? true : false,
                    SearchConditions: {
                        Persa: "ALL",
                        Hrdoc: "ALL",
                        Doctl: "",
                        Begda: null,
                        Endda: null
                    },
                    Persas: [],
                    Hrdocs: [],
                    List: [],
                    Detail: {
                        IsNew: true, // 신규 작성 여부
                        IsFinish: false, // 완료 여부
                        IsPossibleSave: false, // 저장 가능 여부
                        IsPossibleDelete: false, // 삭제 가능 여부
                        IsPossibleMail: false, // 메일발송 가능 여부
                        IsPossibleTargetDelete: false,
                        Summary: {},
                        List: [],
                        Persas: [],
                        Hrdocs: []
                    },
                    WriteForm: {
                        Data: {},
                        isFinish: false,
                        isSigned: false,
                        signatureImg: null
                    }
                });

                return this;
            },

            load: function () {
                BusyIndicator.show(0);

                Common.getPromise(
                    function () {
                        this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                        this.oModel.setProperty("/SearchConditions/Persa", this.oController.getSessionInfoByKey("Persa"));
                        this.oModel.setProperty("/Persas", ODataService.HrDocumentsPersaSet.call(this.oController));
                        this.oModel.setProperty("/Hrdocs", ODataService.HrDocumentsTypeSet.call(this.oController));
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            /**
             * @brief 검색
             *
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
             */
            loadTableData: function () {
                var results = ODataService.HrDocumentsHeaderSet.call(this.oController, this.oModel.getProperty("/SearchConditions"));

                this.oModel.setProperty(
                    "/List",
                    results.map(function (elem, idx) {
                        return $.extend(true, elem, {
                            Idx: ++idx
                        });
                    })
                );

                Common.adjustViewHeightRowCount({
                    tableControl: $.app.getView().byId("Table"),
                    viewHeight: 68,
                    dataCount: results.length
                });

                // sort, filter 제거
                var oTable = $.app.getView().byId("Table");
                var oColumn = oTable.getColumns();
                for (var i = 0; i < oColumn.length; i++) {
                    oColumn[i].setSorted(false);
                    oColumn[i].setFiltered(false);
                }

                oTable.bindRows("/List");
            },

            /**
             * @brief 신규발송 Button event handler
             *
             */
            pressMakeNewDocument: function () {
                this.setDetailComboData();

                this.oModel.setProperty("/Detail/IsNew", true);
                this.oModel.setProperty("/Detail/IsFinish", false);
                this.oModel.setProperty("/Detail/IsPossibleSave", false);
                this.oModel.setProperty("/Detail/IsPossibleDelete", false);
                this.oModel.setProperty("/Detail/IsPossibleMail", false);
                this.oModel.setProperty("/Detail/IsPossibleTargetDelete", false);
                this.oModel.setProperty("/Detail/List", []);
                this.oModel.setProperty("/Detail/Summary", {});
                this.oModel.setProperty("/Detail/Summary/RmprdIdx", 0);
                this.oModel.setProperty("/Detail/Summary/TargetCnt", 0); // 대상인원
                this.oModel.setProperty("/Detail/Summary/CompleteCnt", 0); // 제출인원
                this.oModel.setProperty("/Detail/Summary/MailCnt", 0); // 메일발송인원
                this.oModel.setProperty("/Detail/Summary/ViewCnt", 0); // 문서조회한 사람

                this.setDetailSummaryRmprdValue();

                if ($.app.byId("TargetTable")) {
                    $.app.byId("TargetTable").setVisibleRowCount(1);
                }

                this.openDetailDialog();
            },

            /**
             * @brief HASS 상세조회 함수
             *
             * @param rowData
             */
            loadDetailDataForHASS: function (rowData) {
                // Load detail data
                var results = ODataService.HrDocumentsDetailHeaderSet.call(this.oController, rowData);

                this.oModel.setProperty(
                    "/Detail/List",
                    results.HrDocumentsDetailSet.map(function (elem, idx) {
                        return $.extend(true, elem, {
                            Idx: ++idx
                        });
                    })
                );
                this.oModel.setProperty(
                    "/Detail/Summary",
                    $.extend(true, results.HrDocumentsDetailOutlineSet, {
                        RmprdIdx: this.getRMPRDIndexByValue(results.HrDocumentsDetailOutlineSet.Rmprd)
                    })
                );

                this.oModel.setProperty("/Detail/IsNew", false);
                this.oModel.setProperty("/Detail/IsFinish", rowData.Docst === HRDoc.DocumentStatus.SUBMISSION_COMPLETED ? true : false);
                this.oModel.setProperty("/Detail/IsPossibleSave", true);
                this.oModel.setProperty("/Detail/IsPossibleDelete", rowData.Docst === HRDoc.DocumentStatus.NOT_SEND ? true : false);

                this.setDetailComboData();
                this.setDetailSummaryDateRangeTime();
                this.setToggleSendMailButton();
                this.setToggleTargetDeleteButton();
                this.setTargetCountFiled();

                this.openDetailDialog();

                $.app.byId("TargetTable").bindRows("/Detail/List");

                Common.adjustViewHeightRowCount({
                    tableControl: $.app.byId("TargetTable"),
                    // viewHeight: 34,
                    viewHeight: 45,
                    dataCount: results.HrDocumentsDetailSet.length
                });
            },

            pressTest: function () {
                this.oModel.setProperty("/WriteForm/signatureImg", this.noImgPath);
                this.oModel.setProperty("/WriteForm/isFinish", false);

                this.openFormDialog("10");
            },

            /**
             * @brief ESS 상세조회 함수
             *
             * @param rowData
             */
            loadDetailDataForEss: function (rowData) {
                // if (rowData.Docst === HRDoc.DocumentStatus.SUBMISSION_COMPLETED) {
                //     sap.m.URLHelper.redirect(rowData.Hdurl, true);
                //     return;
                // }

                // Load detail data
                var results = ODataService.HrDocumentsDetailHeaderSet.call(this.oController, rowData).HrDocumentsDetailSet[0] || [];

                this.oModel.setProperty("/WriteForm/signatureImg", this.noImgPath);
                this.oModel.setProperty(
                    "/WriteForm/Data",
                    $.extend(true, results, {
                        Entda: Common.DateFormatter(results.Entda)
                    })
                );
                this.oModel.setProperty("/WriteForm/isFinish", rowData.Docst === HRDoc.DocumentStatus.SUBMISSION_COMPLETED ? true : false);

                // 선택된 데이터
                this.oModel.setProperty("/Data", rowData);

                this.openFormDialog(rowData.Hrdoc);
            },

            /**
             * @brief 문서 저장 후 호출되는 함수
             *
             * @param data
             */
            updateDocDataAfterSave: function (data) {
                var updateData = data.HrDocumentsDetailOutlineSet.results[0] || {};

                this.oModel.setProperty("/Detail/IsNew", false);
                this.oModel.setProperty("/Detail/IsPossibleDelete", updateData.Docst === HRDoc.DocumentStatus.NOT_SEND ? true : false);
                this.oModel.setProperty("/Detail/Hrdno", updateData.Hrdno);
                this.oModel.setProperty("/Detail/Summary/Hrdno", updateData.Hrdno);
                this.oModel.setProperty("/Detail/Summary/Docst", updateData.Docst);
            },

            /**
             * @brief 메일 발송 후 호출되는 함수
             *
             */
            updateDocDataAfterSendMail: function () {
                this.oModel.setProperty("/Detail/Summary/Docst", HRDoc.DocumentStatus.SEND_COMPLETED);
                this.oModel.setProperty("/Detail/IsPossibleDelete", false);
            },

            /**
             * @brief 상세조회 Dialog에서 사용되는 인사영역, HR서류 ComboBox를 만든다.
             *
             */
            setDetailComboData: function () {
                if (!this.oModel.getProperty("/Detail/Persas").length) {
                    var tmpPersas = this.oModel.getProperty("/Persas").slice();
                    tmpPersas.shift();
                    this.oModel.setProperty("/Detail/Persas", tmpPersas);
                }
                if (!this.oModel.getProperty("/Detail/Hrdocs").length) {
                    var tmpHrdocs = this.oModel.getProperty("/Hrdocs").slice();
                    tmpHrdocs.shift();
                    this.oModel.setProperty("/Detail/Hrdocs", tmpHrdocs);
                }
            },

            /**
             * @brief 상세조회 - 대상자 등록 Button event handler
             *
             */
            pressAddTarget: function () {
                SearchUser1.oController = this.oController;
                SearchUser1.dialogContentHeight = 480;

                if (!this.oAddPersonDialog) {
                    this.oAddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", this.oController);
                    $.app.getView().addDependent(this.oAddPersonDialog);
                }

                this.oAddPersonDialog.open();
                $.app.byId("TargetTable").clearSelection();
            },

            /**
             * @brief 상세조회 - 대상자 삭제 Button의 사용가능 여부를 판단한다.
             *
             */
            setToggleTargetDeleteButton: function () {
                this.oModel.setProperty(
                    "/Detail/IsPossibleTargetDelete",
                    this.oModel.getProperty("/Detail/List").some(function (elem) {
                        return Common.checkNull(elem.Smtda);
                    })
                );
            },

            /**
             * @brief 상세조회 - 메일발송 Button의 사용가능 여부를 판단한다.
             *
             */
            setToggleSendMailButton: function () {
                this.oModel.setProperty(
                    "/Detail/IsPossibleMail",
                    this.oModel.getProperty("/Detail/List").some(function (elem) {
                        return Common.checkNull(elem.Smtda);
                    })
                );
            },

            /**
             * @brief 상세조회 - 제출인원과 대상인원을 카운트한다.
             * 메일발송인원, 조회인원 카운트 로직 추가
             */
            setTargetCountFiled: function () {
                this.oModel.setProperty("/Detail/Summary/TargetCnt", this.oModel.getProperty("/Detail/List").length);

                this.oModel.setProperty(
                    "/Detail/Summary/CompleteCnt",
                    this.oModel.getProperty("/Detail/List").filter(function (elem) {
                        return elem.Smtda;
                    }).length
                );

                this.oModel.setProperty(
                    "/Detail/Summary/MailCnt",
                    this.oModel.getProperty("/Detail/List").filter(function (elem) {
                        return elem.Mailk;
                    }).length
                );

                this.oModel.setProperty(
                    "/Detail/Summary/ViewCnt",
                    this.oModel.getProperty("/Detail/List").filter(function (elem) {
                        return elem.Viewk;
                    }).length
                );
            },

            // sort, filter 제거
            setSortFilterFalse: function () {
                var oTable = $.app.byId("TargetTable");
                var oColumn = oTable.getColumns();

                for (var i = 0; i < oColumn.length; i++) {
                    oColumn[i].setSorted(false);
                    oColumn[i].setFiltered(false);
                }
            },

            /**
             * @brief 대상자 사원검색 팝업에서 호출되는 callback 함수
             *
             */
            setSelectionTagets: function () {
                var EmpSearchResultModel = sap.ui.getCore().getModel("EmpSearchResult"),
                    oTable = $.app.byId(this.oController.PAGEID + "_EmpSearchResult_Table"),
                    sIndexes = oTable.getSelectedIndices(),
                    vDetailList = this.oModel.getProperty("/Detail/List") || [],
                    sIdx = vDetailList.length;

                if (!sIndexes.length) {
                    MessageBox.alert(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                sIndexes.forEach(function (Idx) {
                    var rowData = EmpSearchResultModel.getProperty(oTable.getContextByIndex(Idx).getPath());

                    if (
                        !vDetailList.some(function (elem) {
                            return elem.Pernr === rowData.Pernr;
                        })
                    ) {
                        vDetailList.push(
                            $.extend(true, rowData, {
                                Idx: ++sIdx
                            })
                        );
                    }
                });

                this.oModel.refresh();
                this.setToggleSendMailButton();
                this.setToggleTargetDeleteButton();
                this.setTargetCountFiled();

                Common.adjustViewHeightRowCount({
                    tableControl: $.app.byId("TargetTable"),
                    viewHeight: 34,
                    dataCount: vDetailList.length
                });

                SearchUser1.onClose();
            },

            /**
             * @brief 목록 row Click event handler
             *
             * @param rowData
             */
            pressSelectRowDetail: function (rowData) {
                if ($.app.getAuth() === $.app.Auth.HASS) {
                    this.loadDetailDataForHASS(rowData);
                } else {
                    this.loadDetailDataForEss(rowData);
                }
            },

            /**
             * @brief 상세조회 - 대상자 삭제 Button event handler
             *
             */
            pressDeleteTarget: function () {
                var oTable = $.app.byId("TargetTable");
                var oIndices = oTable.getSelectedIndices();

                if (oIndices.length == 0) {
                    sap.m.MessageBox.error(this.oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                var oData = this.oModel.getProperty("/Detail/List");
                var oNewData = [];
                var tmp = ""; // 제출일 데이터 존재여부

                for (var i = 0; i < oData.length; i++) {
                    var check = "";

                    for (var j = 0; j < oIndices.length; j++) {
                        var sPath = oTable.getContextByIndex(oIndices[j]).sPath;
                        var detail = this.oModel.getProperty(sPath);

                        if (detail.Smtda && detail.Smtda != "") {
                            // 선택된 데이터에 제출일이 존재하는 경우 삭제 불가
                            tmp = "X";
                            continue;
                        }

                        if (oData[i].Idx == detail.Idx) {
                            check = "X";
                        }
                    }

                    if (check == "") {
                        oData[i].Idx = oNewData.length + 1;
                        oNewData.push(oData[i]);
                    }
                }

                if (tmp == "X") {
                    MessageToast.show(this.oController.getBundleText("MSG_27003"), {
                        // 이미 제출한 대상은 삭제할 수 없습니다.
                        my: sap.ui.core.Popup.Dock.CenterCenter,
                        at: sap.ui.core.Popup.Dock.CenterCenter
                    });
                }

                this.oModel.setProperty("/Detail/List", oNewData);

                oTable.clearSelection();
                this.oModel.refresh();
                this.setToggleSendMailButton();
                this.setToggleTargetDeleteButton();
                this.setTargetCountFiled();

                Common.adjustViewHeightRowCount({
                    tableControl: $.app.byId("TargetTable"),
                    // viewHeight: 34,
                    viewHeight: 45,
                    dataCount: oNewData.length
                });

                // var oTable = $.app.byId("TargetTable"),
                //     sIndexes = oTable.getSelectedIndices(),
                //     vDetailList = this.oModel.getProperty("/Detail/List") || [],
                //     deleteCount = 0;

                // if (!sIndexes.length) {
                //     MessageBox.alert(this.oController.getBundleText("MSG_02050")); // 대상자를 선택해 주시기 바랍니다.
                //     return;
                // }

                // // 제출된 대상 제외 후 테이블에서 삭제(인덱스 변조방지를 위해 후방 탐색한다.)
                // sIndexes
                //     .filter(function (sIdx) {
                //         return Common.checkNull(vDetailList[sIdx].Smtda);
                //     })
                //     .reverse()
                //     .forEach(function (Idx) {
                //         ++deleteCount;
                //         vDetailList.splice(Idx, 1);
                //     });

                // // 새로운 No. 부여
                // vDetailList.map(function (elem, idx) {
                //     return $.extend(true, elem, {
                //         Idx: ++idx
                //     });
                // });

                // if (sIndexes.length !== deleteCount) {
                //     MessageToast.show(this.oController.getBundleText("MSG_27003"), {
                //         // 이미 제출한 대상은 삭제할 수 없습니다.
                //         my: sap.ui.core.Popup.Dock.CenterCenter,
                //         at: sap.ui.core.Popup.Dock.CenterCenter
                //     });
                // }

                // oTable.clearSelection();
                // this.oModel.refresh();
                // this.setToggleSendMailButton();
                // this.setToggleTargetDeleteButton();
                // this.setTargetCountFiled();

                // Common.adjustViewHeightRowCount({
                //     tableControl: $.app.byId("TargetTable"),
                //     // viewHeight: 34,
                //     viewHeight: 45,
                //     dataCount: vDetailList.length
                // });
            },

            /**
             * @brief 사원검색 팝업에서 호출되는 조직검색 팝업 호출 함수
             *
             * @param oEvent
             */
            openOrgSearchDialog: function (oEvent) {
                SearchOrg.oController = this.oController;
                SearchOrg.vActionType = "Multi";
                SearchOrg.vCallControlId = oEvent.getSource().getId();
                SearchOrg.vCallControlType = "MultiInput";

                if (!this.oOrgSearchDialog) {
                    this.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", this.oController);
                    $.app.getView().addDependent(this.oOrgSearchDialog);
                }

                this.oOrgSearchDialog.open();
            },

            /**
             * @brief 상세조회 팝업 호출
             *
             */
            openDetailDialog: function () {
                if (!this.oDetailDialog) {
                    this.oDetailDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Detail"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oDetailDialog);
                }

                this.oDetailDialog.open();
                this.setSortFilterFalse();
            },

            /**
             * @brief 문서 양식 팝업 호출
             *
             * @param Hrdoc     문서 양식 번호
             */
            openFormDialog: function (Hrdoc) {
                if (!Hrdoc) return;

                // if (this.oFormDialog) this.oFormDialog.destroy();

                // this.oFormDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Form" + Hrdoc].join(".fragment."), this.oController);
                // this.oFormDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Form"].join(".fragment."), this.oController);
                // $.app.getView().addDependent(this.oFormDialog);

                if (!this.oFormDialog) {
                    this.oFormDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Form"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oFormDialog);
                }

                // 데이터 생성
                this.oFormDialog.destroyContent();

                var oData = this.oModel.getProperty("/Data"),
                    oContent = "";
                if (oData.Docst === HRDoc.DocumentStatus.SUBMISSION_COMPLETED) {
                    oContent = this.oModel.getProperty("/WriteForm/Data/Mailc");
                } else {
                    oContent = this.makeHtml(Hrdoc);
                }

                if (oContent == "") return;

                this.oFormDialog.addContent(
                    new sap.ui.core.HTML({
                        content: [oContent],
                        preferDOM: false
                    })
                );

                this.oFormDialog.open();

                // 	if(oData.Docst === HRDoc.DocumentStatus.NOT_SEND){
                // 		document.getElementById("signature").src = this.oModel.getProperty("/WriteForm/signatureImg");
                // 	} else {
                // document.getElementById("signature").src = oData.Hdurl;
                // 	}
            },

            /**
             * @brief 서명패드 팝업 호출
             *
             */
            openSignaturePad: function () {
                if (!this.oSignatureDialog) {
                    this.oSignatureDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Signature"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oSignatureDialog);
                }

                this.oSignatureDialog.open();
            },

            /**
             * @brief 서명 패드 초기화
             *
             */
            initSignaturePad: function () {
                this.Signature = Signature.initialize(this, document.getElementById("signature-pad"), {
                    width: 510,
                    height: 200
                });
            },

            /**
             * @brief 서명패드 재작성 Button event handler
             *
             */
            clearSignaturePad: function () {
                this.Signature.clear.call(this.Signature);
            },

            /**
             * @brief 서명패드 제출 Button event handler
             *
             */
            transformSignatureToImage: function () {
                this.oModel.setProperty("/WriteForm/signatureImg", this.Signature.getDataUrl.call(this.Signature));
                this.oModel.setProperty("/WriteForm/isFinish", true);
                this.oSignatureDialog.close();

                this.oFormDialog.setBusyIndicatorDelay(0);
                this.oFormDialog.setBusy(true);

                // 서명 파일 변경
                document.getElementById("signature").src = this.oModel.getProperty("/WriteForm/signatureImg");

                // PDF 변환 후 저장
                // setTimeout(this.transformHtmlToPdf.bind(this), 500);
                // 서명 이미지 저장
                var vAppnm = this.uploadFormPDF("signature.png", this.Signature.dataURItoBlob.call(this.Signature));

                // HrDocumentsDetailHeaderSet 저장
                this.onSaveForm(vAppnm);

                this.oFormDialog.setBusy(false);
            },

            // 안내확인
            onPressSave: function () {
                var PageHandler = this;

                var onProcess = function () {
                    BusyIndicator.show(0);

                    var oInputData = PageHandler.oModel.getProperty("/WriteForm/Data");
                    var payload = {};
                    payload.Hrdno = oInputData.Hrdno || "";
                    payload.Summary = [];
                    payload.List = [
                        {
                            Persa: oInputData.Persa,
                            Hrdno: oInputData.Hrdno,
                            Pernr: oInputData.Pernr,
                            Actty: $.app.getAuth(),
                            // Appnm: vAppnm,
                            Mailc: PageHandler.makeHtml(PageHandler.oModel.getProperty("/Data/Hrdoc")).replace(/\n/g, "")
                        }
                    ];

                    var _success = function () {
                        MessageBox.success(PageHandler.oController.getBundleText("MSG_27005"), {
                            // 제출되었습니다.
                            // title: PageHandler.oController.getBundleText("LABEL_00149"),
                            onClose: function () {
                                PageHandler.search();
                                PageHandler.oFormDialog.close();
                            }.bind(PageHandler)
                        });

                        BusyIndicator.hide();
                    };

                    ODataService.HrDocumentsDetailHeaderSetByProcess.call(PageHandler.oController, HRDoc.ProcessType.SAVE, payload, _success.bind(PageHandler), PageHandler.ProcessOnFail.bind(PageHandler));
                };

                var onConfirm = function (fVal) {
                    if (fVal && fVal == "YES") {
                        PageHandler.oFormDialog.setBusyIndicatorDelay(0);
                        PageHandler.oFormDialog.setBusy(true);

                        // HrDocumentsDetailHeaderSet 저장
                        // PageHandler.onSaveForm();
                        onProcess();

                        PageHandler.oFormDialog.setBusy(false);
                    }
                };

                sap.m.MessageBox.confirm(this.oController.getBundleText("MSG_27004"), {
                    // 제출하시겠습니까?
                    actions: ["YES", "NO"],
                    onClose: onConfirm
                });
            },

            /**
             * @brief 문서 양식을 PDF파일로 변환 후 서버에 저장.
             *
             */
            transformHtmlToPdf: function () {
                // html2canvas(document.getElementById("Form10").parentNode.parentNode.parentNode, {

                // 원래로직 여기부터
                //          html2canvas(document.getElementById("FormContent").parentNode, {
                //          	width: canvas.width,
                //          	height : document.getElementById("FormContent").parentNode.offsetHeight,
                //          	scrollY: document.getElementById("FormContent").parentNode.offsetHeight,
                //              onrendered: function (canvas) {
                //                  // 캔버스를 이미지로 변환
                //                  var imgData = canvas.toDataURL("image/png");

                //                  var IMAGE_WIDTH = 210; // 이미지 가로 길이(mm) A4 기준
                //                  var PAGE_HEIGHT = IMAGE_WIDTH * 1.414; // 출력 페이지 세로 길이 계산 A4 기준
                //                  var imgHeight = (canvas.height * IMAGE_WIDTH) / canvas.width;
                //                  var heightLeft = imgHeight;

                //                  var doc = new jsPDF("p", "mm", "a4");
                //                  var position = 0;

                //                  // 첫 페이지 출력
                //                  doc.addImage(imgData, "PNG", 0, position, IMAGE_WIDTH, imgHeight);
                //                  heightLeft -= PAGE_HEIGHT;

                //                  // 한 페이지 이상일 경우 루프 돌면서 출력
                //                  while (heightLeft >= 20) {
                //                      position = heightLeft - imgHeight;
                //                      doc.addPage();
                //                      doc.addImage(imgData, "PNG", 0, position, IMAGE_WIDTH, imgHeight);
                //                      heightLeft -= PAGE_HEIGHT;
                //                  }

                //                  // 파일 저장
                //                  var fileName = "근로계약서(${name})_${today}.pdf".interpolate(this.oController.getSessionInfoByKey("name"), Common.DateFormatter(new Date()));
                //                  // var vAppnm = this.uploadFormPDF(fileName, doc.output("blob"));

                //                  // HrDocumentsDetailHeaderSet 저장
                //                  // this.onSaveForm(vAppnm);
                // doc.save('file-name.pdf');
                //                  this.oFormDialog.setBusy(false);
                //              }.bind(this)
                //          });
                // 여기까지

                // 	  var doc = new jsPDF();
                //var elementHTML = $('#__dialog1-cont').html();
                //var specialElementHandlers = {
                //  '#__dialog1-footer': function (element, renderer) {
                //    return true;
                //  }
                //};
                //doc.fromHTML(elementHTML, 15, 15, {
                //      'width': 170,
                //      'elementHandlers': specialElementHandlers
                //  });

                //// Save the PDF
                //doc.save('sample-document.pdf');

                //         document.getElementById("FormContent").parentNode.parentNode.parentNode.scrollTop = 0;

                // html2canvas(document.getElementById("FormContent"), {
                // 	scrollY: document.getElementById("FormContent").parentNode.offsetHeight

                // }).then(function(canvas){
                // 	var imgData = canvas.toDataURL("image/png");
                // 	console.log(imgData)
                // });

                //var doc = new jsPDF();
                //var elementHTML = document.getElementById("FormContent");
                //var specialElementHandlers = {
                // '#elementH': function (element, renderer) {
                //   return true;
                // }
                //};
                //doc.fromHTML(elementHTML, 15, 15, {
                //     'width': 170,
                //     'elementHandlers': specialElementHandlers
                // });
                // doc.save('file-name.pdf')
                this.oFormDialog.setBusy(false);
            },

            /**
             * @brief Remind 주기 그룹의 인덱스 값을 변환하여 Rmprd update.
             *
             */
            setDetailSummaryRmprdValue: function () {
                this.oModel.setProperty("/Detail/Summary/Rmprd", this.getRMPRDValueByIndex(this.oModel.getProperty("/Detail/Summary/RmprdIdx")));
            },

            /**
             * @brief 제출기간에 선택된 Date의 시간을 9시로 변경한다.
             *
             */
            setDetailSummaryDateRangeTime: function () {
                var vSummary = this.oModel.getProperty("/Detail/Summary");

                if (vSummary.Smbda) this.oModel.setProperty("/Detail/Summary/Smbda", new Date(vSummary.Smbda.setHours(9)));
                if (vSummary.Smeda) this.oModel.setProperty("/Detail/Summary/Smeda", new Date(vSummary.Smeda.setHours(9)));
            },

            /**
             * @brief 상세 - 인사영역, HR서류, 제목, 제출기간, Remind 주기 Control change event handler
             *
             * @param oEvent
             */
            checkSummaryControl: function (oEvent) {
                var Control = oEvent.getSource();

                switch (Control.constructor) {
                    case sap.m.RadioButtonGroup:
                        // Remind 주기 값 갱신(선택된 인덱스로 Rmprd값 입력)
                        this.setDetailSummaryRmprdValue();
                        break;
                    case sap.m.DateRangeSelection:
                        // 선택된 Date의 시간을 9시로 변경
                        this.setDetailSummaryDateRangeTime();
                        break;
                    default:
                        break;
                }

                this.NOT_VALID_SUMMARY_CONTROL_COUNT = 0; // 미입력된 Control count 초기화
                this.validSummary(Control.getParent().getParent().getParent()); // recursive call
                this.oModel.setProperty("/Detail/IsPossibleSave", this.NOT_VALID_SUMMARY_CONTROL_COUNT > 0 ? false : true); // 저장가능여부 판단
            },

            /**
             * @brief Items를 재귀탐색하여 Required가 true로 설정된 Input, ComboBox, DateRangeSelection를 찾아 validation한다.
             *
             * @param oControl      ui5 control
             */
            validSummary: function (oControl) {
                // base case
                var childItems = oControl.getAggregation("items");
                if (oControl === null || childItems === null) return;

                // Recursion
                childItems.forEach(function (control) {
                    try {
                        var constructorName = control.constructor.getMetadata().getName();
                        if (Object.keys(HRDoc.ValidateProperties).indexOf(constructorName) > -1
                            && control.getRequired() 
                            && control.getProperty(HRDoc.ValidateProperties[constructorName]) === ""
                        ) {
                            this.NOT_VALID_SUMMARY_CONTROL_COUNT++;
                        }
                    } catch (ex) {
                        Common.log(ex);
                    } // Not valid control
                    this.validSummary(control);
                }, this);

                return;
            },

            uploadSignature: function () {
                var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
                    vPernr = this.oController.getSessionInfoByKey("Pernr"),
                    imageData = this.Signature.dataURItoBlob(),
                    ret = "";

                try {
                    oModel.refreshSecurityToken();

                    var FILE_UPLOAD_URL = "/sap/opu/odata/sap/ZHR_COMMON_SRV/FileAttachSet/";
                    var oRequest = oModel._createRequest();
                    var oHeaders = {
                        "x-csrf-token": oRequest.headers["x-csrf-token"],
                        slug: ["", vPernr, encodeURI(fileName), vPernr].join("|")
                    };

                    jQuery.ajax({
                        type: "POST",
                        async: false,
                        url: $.app.getDestination() + FILE_UPLOAD_URL,
                        headers: oHeaders,
                        cache: false,
                        contentType: "pdf",
                        processData: false,
                        data: imageData,
                        success: function (data) {
                            ret = $(data).find("content").next().children().eq(7).text();
                        },
                        error: function () {
                            sap.m.MessageToast.show(this.oController.getBundleText("MSG_00031"), {
                                my: sap.ui.core.Popup.Dock.CenterCenter,
                                at: sap.ui.core.Popup.Dock.CenterCenter
                            });
                        }.bind(this)
                    });
                } catch (error) {
                    Common.log(error);
                }

                return ret;
            },

            /**
             * @brief PDF파일을 파일서버에 저장 후 서버에서 받은 Appnm를 return.
             *
             * @param fileName    파일 이름
             * @param pdfFile     PDF 파일 object
             *
             * @return Appnm
             */
            uploadFormPDF: function (fileName, pdfFile) {
                var oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
                    vPernr = this.oController.getSessionInfoByKey("Pernr"),
                    ret = "";

                try {
                    oModel.refreshSecurityToken();

                    var FILE_UPLOAD_URL = "/sap/opu/odata/sap/ZHR_COMMON_SRV/FileAttachSet/";
                    var oRequest = oModel._createRequest();
                    var oHeaders = {
                        "x-csrf-token": oRequest.headers["x-csrf-token"],
                        slug: ["", vPernr, encodeURI(fileName), vPernr].join("|")
                    };

                    jQuery.ajax({
                        type: "POST",
                        async: false,
                        url: $.app.getDestination() + FILE_UPLOAD_URL,
                        headers: oHeaders,
                        cache: false,
                        contentType: "pdf",
                        processData: false,
                        data: pdfFile,
                        success: function (data) {
                            ret = $(data).find("content").next().children().eq(7).text();
                        },
                        error: function () {
                            sap.m.MessageToast.show(this.oController.getBundleText("MSG_00031"), {
                                my: sap.ui.core.Popup.Dock.CenterCenter,
                                at: sap.ui.core.Popup.Dock.CenterCenter
                            });
                        }.bind(this)
                    });
                } catch (error) {
                    Common.log(error);
                }

                return ret;
            },

            /**
             * @brief PDF download url call
             *
             * @param oEvent
             */
            onDownloadPDF: function (oEvent) {
                sap.m.URLHelper.redirect(oEvent.getSource().getParent().getBindingContext().getProperty().Hdurl, true);
            },

            /**
             * @brief 문서 양식 제출
             *
             * @param vAppnm     PDF파일 서버KEY
             */
            onSaveForm: function (vAppnm) {
                var oInputData = this.oModel.getProperty("/WriteForm/Data");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Hrdno = oInputData.Hrdno || "";
                    payload.Summary = [];
                    payload.List = [
                        {
                            Persa: oInputData.Persa,
                            Hrdno: oInputData.Hrdno,
                            Pernr: oInputData.Pernr,
                            Actty: $.app.getAuth(),
                            Appnm: vAppnm,
                            Mailc: this.makeHtml(this.oModel.getProperty("/Data/Hrdoc")).replace(/\n/g, "")
                        }
                    ];

                    var _success = function () {
                        MessageBox.success(this.oController.getBundleText("MSG_27005"), {
                            // 제출되었습니다.
                            title: this.oController.getBundleText("LABEL_00149"),
                            onClose: function () {
                                this.search();
                                this.oFormDialog.close();
                            }.bind(this)
                        });

                        BusyIndicator.hide();
                    };

                    ODataService.HrDocumentsDetailHeaderSetByProcess.call(this.oController, HRDoc.ProcessType.SAVE, payload, _success.bind(this), this.ProcessOnFail.bind(this));
                };

                MessageBox.confirm(this.oController.getBundleText("MSG_27004"), {
                    // 제출하시겠습니까?
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            /**
             * @brief 문서 저장
             *
             */
            onSaveDoc: function () {
                var oModel = $.app.getModel("ZHR_HRDOC_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Hrdno = oInputData.Hrdno || "";
                    payload.Summary = [Common.copyByMetadata(oModel, "HrDocumentsDetailOutline", oInputData.Summary)];
                    payload.List = oInputData.List.map(function (elem) {
                        return Common.copyByMetadata(oModel, "HrDocumentsDetail", elem);
                    });

                    ODataService.HrDocumentsDetailHeaderSetByProcess.call(this.oController, HRDoc.ProcessType.SAVE, payload, this.ProcessOnSuccess.bind(this), this.ProcessOnFail.bind(this));
                };

                MessageBox.show(this.oController.getBundleText("MSG_00058"), {
                    // 저장하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            /**
             * @brief 메일 발송
             *
             */
            pressSendMail: function () {
                var oModel = $.app.getModel("ZHR_HRDOC_SRV");
                var oInputData = this.oModel.getProperty("/Detail");

                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Hrdno = oInputData.Hrdno || "";
                    payload.Summary = [Common.copyByMetadata(oModel, "HrDocumentsDetailOutline", oInputData.Summary)];
                    // payload.List = oInputData.List.filter(function (elem) {
                    //     return elem.Smtda !== null || elem.Smtda !== undefined;
                    // }).map(function (elem) {
                    //     return Common.copyByMetadata(oModel, "HrDocumentsDetail", elem);
                    // });

                    // 선택된 데이터만 전송, 선택한게 없으면 전체 전송
                    payload.List = [];

                    var oTable = $.app.byId("TargetTable");
                    var oIndices = oTable.getSelectedIndices();
                    var oData = null;
                    var detail = null;
                    if (oIndices.length == 0) {
                        oData = this.oModel.getProperty("/Detail/List");
                        for (var i = 0; i < oData.length; i++) {
                            if (!oData[i].Asbeg) {
                                oData[i].Asbeg = new Date(new Date().getFullYear(), 1, 1);
                            }

                            detail = {};
                            detail.Pernr = oData[i].Pernr;
                            detail.Fulln = oData[i].Fulln;
                            detail.Asbeg = Common.adjustGMTOdataFormat(new Date(oData[i].Asbeg));

                            payload.List.push(detail);
                        }
                    } else {
                        for (var j = 0; j < oIndices.length; j++) {
                            var sPath = oTable.getContextByIndex(oIndices[j]).sPath;

                            oData = this.oModel.getProperty(sPath);
                            if (!oData.Asbeg) {
                                oData.Asbeg = new Date(new Date().getFullYear(), 1, 1);
                            }

                            detail = {};
                            detail.Pernr = oData.Pernr;
                            detail.Fulln = oData.Fulln;
                            detail.Asbeg = Common.adjustGMTOdataFormat(new Date(oData.Asbeg));

                            payload.List.push(detail);
                        }
                    }

                    ODataService.HrDocumentsDetailHeaderSetByProcess.call(this.oController, HRDoc.ProcessType.MAIL, payload, this.ProcessOnSuccess.bind(this), this.ProcessOnFail.bind(this));

                    this.loadDetailDataForHASS(this.oModel.getData().Detail.Summary);
                };

                MessageBox.confirm(this.oController.getBundleText("MSG_27002"), {
                    // 메일 발송하시겠습니까?
                    // title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            /**
             * @brief 문서 삭제
             *
             */
            onDeleteDoc: function () {
                var Process = function (fVal) {
                    if (!fVal || fVal === MessageBox.Action.NO) return;

                    BusyIndicator.show(0);

                    var payload = {};
                    payload.Hrdno = this.oModel.getProperty("/Detail/Summary/Hrdno") || "";
                    payload.Summary = [];
                    payload.List = [];

                    ODataService.HrDocumentsDetailHeaderSetByProcess.call(this.oController, HRDoc.ProcessType.DELETE, payload, this.ProcessOnSuccess.bind(this), this.ProcessOnFail.bind(this));
                };

                MessageBox.show(this.oController.getBundleText("MSG_00059"), {
                    // 삭제하시겠습니까?
                    title: this.oController.getBundleText("LABEL_00149"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: Process.bind(this)
                });
            },

            getRMPRDIndexByValue: function (value) {
                return Object.keys(HRDoc.RemindCycle).findIndex(function (key) {
                    return HRDoc.RemindCycle[key] === value;
                });
            },

            getRMPRDValueByIndex: function (index) {
                return HRDoc.RemindCycle[Object.keys(HRDoc.RemindCycle)[index]];
            },

            ProcessOnSuccess: function (data, conType) {
                var successMessage = "";

                switch (conType) {
                    case HRDoc.ProcessType.SAVE:
                        this.updateDocDataAfterSave(data);
                        successMessage = this.oController.getBundleText("MSG_00017"); // 저장되었습니다.
                        break;
                    case HRDoc.ProcessType.DELETE:
                        successMessage = this.oController.getBundleText("MSG_00021"); // 삭제되었습니다.
                        break;
                    case HRDoc.ProcessType.MAIL:
                        this.updateDocDataAfterSendMail();
                        successMessage = this.oController.getBundleText("MSG_27001"); // 메일이 발송되었습니다.
                        break;
                    default:
                        break;
                }

                MessageBox.success(successMessage, {
                    title: this.oController.getBundleText("LABEL_00149"),
                    onClose: function () {
                        this.search();
                        if (conType === HRDoc.ProcessType.DELETE) {
                            this.oDetailDialog.close();
                        }
                    }.bind(this)
                });

                BusyIndicator.hide();
            },

            ProcessOnFail: function (res) {
                var errData = Common.parseError(res);
                if (errData.Error && errData.Error === "E") {
                    MessageBox.error(errData.ErrorMessage, {
                        title: this.oController.getBundleText("LABEL_00149")
                    });
                }

                BusyIndicator.hide();
            },

            getDateRangeText: function () {
                return new sap.ui.commons.TextView({
                    text: {
                        parts: [
                            {
                                path: "Smbda"
                            }, //
                            {
                                path: "Smeda"
                            }
                        ],
                        formatter: function (v1, v2) {
                            return !v1 && !v2 ? "" : [Common.DateFormatter(v1), Common.DateFormatter(v2)].join(" ~ ");
                        }
                    },
                    textAlign: "Center"
                }).addStyleClass("FontFamily");
            },

            getProcessChart: function (columnInfo) {
                return new sap.m.ProgressIndicator({
                    displayOnly: true,
                    displayAnimation: false,
                    height: "24px",
                    percentValue: "{${columnInfo.id}}".interpolate(columnInfo.id),
                    state: {
                        path: "Docst",
                        formatter: function (v) {
                            switch (v) {
                                case HRDoc.DocumentStatus.NOT_SEND:
                                    return sap.ui.core.ValueState.None;
                                case HRDoc.DocumentStatus.SEND_COMPLETED:
                                    return sap.ui.core.ValueState.Information;
                                case HRDoc.DocumentStatus.SUBMISSION_DELAY:
                                    return sap.ui.core.ValueState.Error;
                                case HRDoc.DocumentStatus.SUBMISSION_COMPLETED:
                                    return sap.ui.core.ValueState.Success;
                                default:
                                    return sap.ui.core.ValueState.None;
                            }
                        }
                    },
                    displayValue: {
                        path: columnInfo.id,
                        formatter: function (v) {
                            return parseFloat(v || 0).toFixed(2);
                        }
                    }
                }).addStyleClass("cpi-body");
            },

            getLinkFileIcon: function () {
                // var PageHandler = oController.PageHandler;

                return new sap.ui.core.Icon({
                    src: "sap-icon://pdf-attachment",
                    color: sap.ui.core.IconColor.Critical,
                    tooltip: "{Fname}",
                    visible: {
                        // path: "Hdurl",
                        path: "Mailc",
                        formatter: function (v) {
                            return Common.checkNull(v) ? false : true;
                        }
                    },
                    // press: PageHandler.onDownloadPDF.bind(PageHandler)
                    customData: [new sap.ui.core.CustomData({ key: "", value: "{}" })],
                    press: function (oEvent) {
                        var oData = oEvent.getSource().getCustomData()[0].getValue();

                        var PageHandler = $.app.getController().PageHandler;
                        PageHandler.oFormDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Form"].join(".fragment."), PageHandler.oController);

                        if (!PageHandler.oFormDialog) {
                            PageHandler.oFormDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Form"].join(".fragment."), this.oController);
                            $.app.getView().addDependent(PageHandler.oFormDialog);
                        }

                        PageHandler.oFormDialog.destroyContent();
                        PageHandler.oFormDialog.addContent(
                            new sap.ui.core.HTML({
                                content: [oData.Mailc],
                                preferDOM: false
                            })
                        );

                        // 서명 버튼 비활성화
                        PageHandler.oModel.setProperty("/WriteForm/isFinish", true);

                        PageHandler.oFormDialog.open();
                    }
                });
            },

            changeViewK: function () {
                // var PageHandler = oController.PageHandler;

                return new sap.m.Text({
                    text: {
                        path: "Viewk",
                        formatter: function (fVal) {
                            return fVal == "X" ? "O" : "";
                        }
                    }
                }).addStyleClass("pb-2px");
            },

            changeMiewK: function () {
                // var PageHandler = oController.PageHandler;

                return new sap.m.Text({
                    text: {
                        path: "Mailk",
                        formatter: function (fVal) {
                            return fVal == "X" ? "O" : "";
                        }
                    }
                }).addStyleClass("pb-2px");
            },

            makeHtml: function (Hrdoc) {
                var oController = $.app.getController();
                var oHtml = "";
                // var request = $.ajax({
                
                $.ajax({
                    url: "ZUI5_HR_HRDoc/html/Form" + Hrdoc + ".html",
                    cache: false,
                    async: false
                }).done(function (html) {
                    oHtml = html;
                }).fail(function (res) {
                    Common.log(res);
                });

                if (oHtml == "") {
                    sap.m.MessageBox.error(oController.getBundleText("MSG_27006")); // 오류가 발생하였습니다.
                    return "";
                }

                switch (Hrdoc) {
                    case "10": // 근로계약서
                        break;
                    case "20": // 연봉계약서
                        var oData = this.oModel.getProperty("/WriteForm/Data");

                        // 인적사항
                        var textReplace = [
                            { label: "[ORGTX]", data: oData.Fulln },
                            { label: "[GRADE]", data: oData.ZpGradetx },
                            { label: "[ENAME]", data: oData.Ename }
                        ];

                        for (var i = 0; i < textReplace.length; i++) {
                            oHtml = eval("oHtml.replace('" + textReplace[i].label + "', '" + textReplace[i].data + "');");
                        }

                        // 대상기간
                        oHtml = oHtml.replace(/\[ZYEAR\]/g, oData.Ayear);
                        var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: $.app.getView().getModel("session").getData().Dtfmt });
                        oHtml = oHtml.replace(/\[BEGDA\]/g, dateFormat.format(new Date(common.Common.setTime(oData.Asbeg))));
                        oHtml = oHtml.replace("[ENDDA]", dateFormat.format(new Date(common.Common.setTime(oData.Asend))));

                        // 연봉내역
                        var table_start = "[TABLE_START]",
                            table_end = "[TABLE_END]";
                        var table_html = oHtml.substring(oHtml.indexOf(table_start) + table_start.length, oHtml.indexOf(table_end));
                        var table_data = "";

                        // 직급구분 별로 연봉내역 detail 세팅
                        var detail = "";
                        switch (oData.Zhgrade) {
                            case "02": // 경영관리직
                            case "03": // 연구전문직
                                detail = "① 상기 연봉은 당해년도 임금인상(Base-Up) 미반영 금액입니다.<br/>" + "② 기본급은 전년도 개인평가결과에 따라 차등 반영됩니다.<br/>" + "③ 성과상여는 전년도 개인평가 및 조직평가 결과에 따라 차등 반영됩니다.<br/>" + "④ 직책수당은 급여지급 시점 직책보임 여부에 따라 변동됩니다.<br/>";

                                // 첨단 구분D
                                if ($.app.getModel("session").getData().Persa.substring(0, 1) == "D") {
                                    detail += "<span class='fontFamily' style='color:#0070bd;'>⑤ 복지포인트, 개인연금, 식비수당 등 복리후생성 수당은 제외한 금액입니다.</span>";
                                } else {
                                    detail += "<span class='fontFamily' style='color:#bd0000;'>⑤ 복지포인트, 개인연금, 변동수당은 제외한 금액입니다.</span>";
                                }

                                break;
                            case "05": // 사무영업직
                                detail = "① 상기 연봉은 당해년도 임금인상(Base-Up) 미반영 금액입니다.<br/>" + "② 성과상여는 전년도 개인평가 및 조직평가 결과에 따라 차등 반영됩니다.<br/>" + "③ 직책수당은 급여지급 시점 직책보임 여부에 따라 변동됩니다.<br/>";

                                // 첨단 구분D
                                if ($.app.getModel("session").getData().Persa.substring(0, 1) == "D") {
                                    detail += "<span class='fontFamily' style='color:#0070bd;'>④ 복지포인트, 개인연금, 식비수당 등 복리후생성 수당은 제외한 금액입니다.</span>";
                                } else {
                                    detail += "<span class='fontFamily' style='color:#bd0000;'>④ 복지포인트, 개인연금, 변동수당은 제외한 금액입니다.</span>";
                                }

                                break;
                            case "11": // 지원직
                                detail = "① 상기 연봉은 당해년도 임금인상(Base-Up) 미반영 금액입니다.<br/>" + "② 역량급은 전년도 인사평가결과에 따라 차등 반영됩니다.<br/>";

                                // 첨단 구분D
                                if ($.app.getModel("session").getData().Persa.substring(0, 1) == "D") {
                                    detail += "<span class='fontFamily' style='color:#0070bd;'>③ 복지포인트, 개인연금, 식비수당 등 복리후생성 수당은 제외한 금액입니다.</span>";
                                } else {
                                    detail += "<span class='fontFamily' style='color:#bd0000;'>③ 복지포인트, 개인연금, 변동수당은 제외한 금액입니다.</span>";
                                }
                                break;
                            default:
                        }
                        oHtml = oHtml.replace("[DETAIL]", detail);

                        var oModel = $.app.getModel("ZHR_HRDOC_SRV");
                        // var oPath = "/HrdocYearSalarySet?$filter=Hrdno eq '" + oData.Hrdno + "'";

                        // 사번 암호화
                        // var oPercod = "";
                        // var oModel2 = $.app.getModel("ZHR_COMMON_SRV");
                        // var createData = {Pernr : oData.Pernr, PernrEncodeNav : [{Pernr : oData.Pernr}]};

                        // oModel2.create("/PernrEncodingSet", createData, null,
                        // 		function(data,res){
                        // 			if(data) {
                        // 				oPercod = data.Percod;
                        // 			}
                        // 		},
                        // 		function (oError) {
                        // 	    	var Err = {};
                        // 	    	oController.Error = "E";

                        // 			if (oError.response) {
                        // 				Err = window.JSON.parse(oError.response.body);
                        // 				var msg1 = Err.error.innererror.errordetails;
                        // 				if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                        // 				else oController.ErrorMessage = Err.error.message.value;
                        // 			} else {
                        // 				oController.ErrorMessage = oError.toString();
                        // 			}
                        // 	}
                        // );

                        // if(oController.Error == "E"){
                        // 	oController.Error = "";
                        // 	sap.m.MessageBox.error(oController.rrorMessage);
                        // 	return "";
                        // }

                        // oPath += " and Percod eq '" + common.Common.encryptPernr(oPercod) + "'";

                        // 연봉내역 데이터 생성
                        // oModel.read(oPath, null, null, false,
                        // 		function(data,res){
                        // 			if(data && data.results.length){
                        // 				for(var i=0; i<data.results.length; i++){
                        // 					if(i == data.results.length - 1){ // 총계
                        // 						oHtml = oHtml.replace("[TOTAL1]", data.results[i].BetrgM.trim());
                        // 						oHtml = oHtml.replace("[TOTAL2]", data.results[i].BetrgY.trim());
                        // 						oHtml = oHtml.replace("[TOTAL3]", data.results[i].Notes);
                        // 					} else {
                        // 						var tmp = table_html;
                        // 							tmp = tmp.replace("[DATA1]", data.results[i].Lgtxt);
                        // 							tmp = tmp.replace("[DATA2]", data.results[i].BetrgM.trim());
                        // 							tmp = tmp.replace("[DATA3]", data.results[i].BetrgY.trim());
                        // 							tmp = tmp.replace("[DATA4]", data.results[i].Notes);

                        // 						table_data += tmp;
                        // 					}
                        // 				}
                        // 			}
                        // 		}, function(Res){
                        // 			if(Res.response.body){
                        // 				var ErrorMessage = Res.response.body;
                        // 				var ErrorJSON = JSON.parse(ErrorMessage);

                        // 				oController.Error = "E";

                        // 				if(ErrorJSON.error.innererror.errordetails && ErrorJSON.error.innererror.errordetails.length){
                        // 					oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                        // 				} else {
                        // 					oController.ErrorMessage = ErrorMessage;
                        // 				}
                        // 			}
                        // 		}
                        // );

                        oModel.read("/HrdocYearSalarySet", {
                            async: false,
                            filters: [new sap.ui.model.Filter("Hrdno", sap.ui.model.FilterOperator.EQ, oData.Hrdno), new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, common.Common.encryptPernr(oData.Pernr))],
                            success: function (data) {
                                if (data && data.results.length) {
                                    for (var i = 0; i < data.results.length; i++) {
                                        if (i == data.results.length - 1) {
                                            // 총계
                                            oHtml = oHtml.replace("[TOTAL1]", data.results[i].BetrgM.trim());
                                            oHtml = oHtml.replace("[TOTAL2]", data.results[i].BetrgY.trim());
                                            oHtml = oHtml.replace("[TOTAL3]", data.results[i].Notes);
                                        } else {
                                            if ($.app.getModel("session").getData().Persa.substring(0, 1) != "D") {
                                                // 기초 성과상여 비고란 수정
                                                if (data.results[i].Lgtxt == "성과상여" || data.results[i].Lgtxt == "역량급") {
                                                    switch (oData.Zhgrade) {
                                                        case "02": // 경영관리직
                                                            data.results[i].Notes = "평가결과 BB기준 300%(사원 220%)";
                                                            break;
                                                        case "05": // 사무영업직
                                                            data.results[i].Notes = "평가결과 BB기준 300%(사원 220%)";
                                                            break;
                                                        case "11": // 지원직
                                                            data.results[i].Notes = "평가결과 B기준 240%";
                                                            break;
                                                        default:
                                                    }
                                                }

                                                // 지원직 누적급 비고란 삭제
                                                if (oData.Zhgrade == "11" && data.results[i].Lgtxt == "누적급") {
                                                    data.results[i].Notes = "";
                                                }
                                            }

                                            var tmp = table_html;
                                            tmp = tmp.replace("[DATA1]", data.results[i].Lgtxt);
                                            tmp = tmp.replace("[DATA2]", data.results[i].BetrgM.trim());
                                            tmp = tmp.replace("[DATA3]", data.results[i].BetrgY.trim());
                                            tmp = tmp.replace("[DATA4]", data.results[i].Notes);

                                            table_data += tmp;
                                        }
                                    }
                                }
                            },
                            error: function (Res) {
                                if (Res.response.body) {
                                    var ErrorMessage = Res.response.body;
                                    var ErrorJSON = JSON.parse(ErrorMessage);

                                    oController.Error = "E";

                                    if (ErrorJSON.error.innererror.errordetails && ErrorJSON.error.innererror.errordetails.length) {
                                        oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                                    } else {
                                        oController.ErrorMessage = ErrorMessage;
                                    }
                                }
                            }
                        });

                        if (oController.Error == "E") {
                            oController.Error = "";
                            sap.m.MessageBox.error(oController.ErrorMessage);
                            return "";
                        }

                        var item_replace = oHtml.substring(oHtml.indexOf(table_start), oHtml.indexOf(table_end) + table_end.length);
                        oHtml = oHtml.replace(item_replace, table_data);

                        // 서명
                        // if(oData.Mailc == "" && this.oModel.getProperty("/WriteForm/signatureImg") == "images/no-image.png"){
                        // 	oHtml = oHtml.replace("[SIGNATURE]", "<img id='signature' src='images/no-image.png' style='width:200px; height:100px'/>");
                        // } else {
                        // 	// oHtml = oHtml.replace("[SIGNATURE]", "<img id='signature' src='" + this.oModel.getProperty("/WriteForm/signatureImg") +
                        // 	// 									 "' style='width:200px; height:100px; border: 1px solid #ccc'/>");

                        // 	oHtml = oHtml.replace("[SIGNATURE]", "<img id='signature' src='cid:signature.png' alt='' style='width:200px; height:100px;'/>");
                        // }

                        // ip
                        // oHtml = oHtml.replace("[IP]", oData.Seals);

                        break;
                    default:
                }

                return oHtml;
            }
        };

        return PageHandler;
    }
);
