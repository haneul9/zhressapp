sap.ui.define(["common/SearchUser1"], function (SearchUser1) {
    "use strict";

    sap.ui.jsfragment("fragment.EmployeeSearchM", {
        createContent: function (oController) {
            return new sap.m.SelectDialog(oController.PAGEID + "_ESM_Dialog", {
                contentHeight: "50%",
                title: "결재자 선택",
                search: SearchUser1.onSearch.bind(SearchUser1),
                confirm: SearchUser1.onConfirm.bind(SearchUser1),
                draggable: false,
                resizable: false,
                growing: false,
                items: {
                    path: "/EmpSearchResultSet",
                    template: new sap.m.StandardListItem({
                        title: "{Ename}({Fulln}.{Ztitletx})",
                        description: "사번 : {Pernr}, 직급 : {ZpGradetx}",
                        type: sap.m.ListType.Active
                    }),
                    sorter: {
                        path: "Ename",
                        descending: false
                    }
                }
            }).setModel(SearchUser1.getModel());
        }
    });
});
