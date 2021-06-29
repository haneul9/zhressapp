sap.ui.define([], function () {
    "use strict";

    sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.m.fragment.EmployeePortlet", {
        createContent: function (oController) {
            return new sap.m.VBox({
                height: "100%",
                items: [this.getInfoHBox(oController)]
            });
        },
	});
});
