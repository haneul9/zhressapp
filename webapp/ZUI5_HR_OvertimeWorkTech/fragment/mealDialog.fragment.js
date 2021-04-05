sap.ui.define([], function() {
    "use strict";
    
    sap.ui.jsfragment("ZUI5_HR_OvertimeWorkTech.fragment.mealDialog", {
    
        createContent: function(oController) {
    
            var MealDialogHandler = oController.MealDialogHandler;
    
            return  new sap.m.SelectDialog($.app.createId("MealTable"), {
                // contentWidth: "1600px",
                contentHeight: "50%",
                // noDataText: oController.getBundleText("MSG_19012"), // 조회된 출장자 목록이 없습니다.
                title: oController.getBundleText("LABEL_32046", " "), // {0} 이용내역
                // titleAlignment: sap.m.TitleAlignment.Auto,
                // search: MealDialogHandler.onSearch.bind(MealDialogHandler),
                // confirm: MealDialogHandler.onConfirm.bind(MealDialogHandler),
                // cancel: MealDialogHandler.onCancel,
                // showClearButton: true,
                draggable: true,
                resizable: true,
                growing: false,
                items: {
                    path: '/List',
                    template: new sap.m.StandardListItem({
                        title: "{TmctyT}",
                        description: "{BegdaTx} {BeguzTx}",
                        type: sap.m.ListType.Active
                    }),
                    sorter: {
                        path: 'Innam',
                        descending: false
                    }
                }			
            })
            .addStyleClass("remove-subheader-dialog")
            .setModel(MealDialogHandler.getModel());
        }
    
    });
    
});