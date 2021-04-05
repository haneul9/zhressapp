sap.ui.jsfragment("fragment.informationPopover", {
	createContent: function () {
        
        return new sap.m.Popover({
            showHeader: false,
            placement: sap.m.PlacementType.Auto,
            content: new sap.m.List({
                items: {
                    path: "/messages",
                    template: new sap.m.StandardListItem({
                        title: "{message}"
                    })
                }
            })
        });
	}
});
