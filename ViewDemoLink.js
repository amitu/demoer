define(
    [
        "dojo/_base/declare", "dijit/_WidgetBase", "dojo/on", "dojo/_base/lang",
        "demoer/ViewDemoWidget", "dojo/aspect"
    ], 
    function(declare, _WidgetBase, on, lang, ViewDemoWidget, aspect){

        return declare(_WidgetBase, {
                files: "",
                WxH: "1000x300",

                handler_close: function(evt) {
                    this.widget.destroy();
                    this.widget = null;
                    this.domNode.style.display = "inline";
                },

                handler_click: function(evt) {
                    if (evt)
                        evt.preventDefault();

                    this.domNode.style.display = "none";

                    this.widget = new ViewDemoWidget({
                        href: this.domNode.href,
                        files: this.files, 
                        WxH: this.WxH
                    });

                    this.widget.placeAt(this.domNode, "after");
                    this.widget.on(
                        "close", lang.hitch(this, this.handler_close)
                    );
                    this.widget.startup();

                    if (this.initial)
                        this.widget.select_view(this.initial);
                    else
                        this.widget.select_view("[DEMO]");
                },

                postCreate: function() {
                    this.inherited(arguments);
                    on(
                        this.domNode, "click", 
                        lang.hitch(this, this.handler_click)
                    );

                    if (this.initial) 
                    {
                        this.handler_click();
                    }
                }

            }
        );
    }
);
