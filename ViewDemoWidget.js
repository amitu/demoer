define(
    [
        "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
        "dojo/text!demoer/ViewDemoWidget.html", "dojo/_base/lang", 
        "dojo/dom-construct", "dojo/on", "dojo/dom-class", "dojo/request",
        "dojox/html/entities", "dojox/highlight", 
        "dojox/highlight/languages/_www"
    ], 
    function(
        declare, _WidgetBase, _TemplatedMixin, template, lang, domConstruct, on,
        domClass, request, entities, highlight
    ){
        return declare([_WidgetBase, _TemplatedMixin], {

            baseClass: "ViewDemoWidget",
            templateString: template,
            files: [],
            href: "",
            cache: {},

            select_view: function(item) {

                for (i = 0; i < this.list.children.length; i++) 
                {
                    var child = this.list.children[i];

                    if (child.innerHTML == item)
                        domClass.add(child, this.baseClass + "_active");
                    else
                        domClass.remove(child, this.baseClass + "_active");
                }

                if (item == "[DEMO]") 
                    this.show_iframe();
                else
                    this.show_file(item);
            },

            show_file: function(filename) {
                var self = this;
                domConstruct.empty(this.main);

                var div = domConstruct.create("div", {
                    innerHTML: "loading..."
                });

                div.style.width = this.WxH[0] - 200;
                div.style.height = this.WxH[1];

                domConstruct.place(div, this.main);

                if (this.cache[filename])
                {
                    div.innerHTML = this.cache[filename];
                }
                else
                {
                    request(this.baseUrl + filename).then(
                        function(text) {
                            self.cache[filename] = (
                                "<pre><code>" + highlight.processString(
                                    text
                                ).result + "</code></pre>"
                            );
                            div.innerHTML = self.cache[filename];
                        }, function(error) {
                            div.innerHTML = "Error: " + error;
                        }
                    );
                }

            },

            show_iframe: function() {
                domConstruct.empty(this.main);

                var iframe = domConstruct.create("iframe", {
                    src: this.href
                });

                iframe.style.width = this.WxH[0] - 200;
                iframe.style.height = this.WxH[1];

                domConstruct.place(iframe, this.main);
            },

            file_li_clicked: function(evt) {
                this.select_view(evt.target.innerHTML);
            },

            close_li_clicked: function(evt) {
                this.emit("close");
            },

            demo_li_clicked: function(evt) {
                this.select_view("[DEMO]");
            },

            postCreate: function() {

                this.inherited(arguments);
                
                this.baseUrl = this.href.split("demo.html")[0];
                this.WxH = this.WxH.split("x");

                this.sidebar.style.height = this.WxH[1];


                if (this.files)
                    this.files = this.files.split(",");

                this.files.unshift("demo.html");

                var demo_li = domConstruct.create("li", {
                    innerHTML: "[DEMO]"
                });

                on(demo_li, "click", lang.hitch(this, this.demo_li_clicked));
                domConstruct.place(demo_li, this.list);

                for (i = 0; i < this.files.length; i++) {
                    console.log(this.files[i]);
                    var li = domConstruct.create("li", {
                        innerHTML: this.files[i]
                    });

                    on(li, "click", lang.hitch(this, this.file_li_clicked));
                    domConstruct.place(li, this.list);
                }

                var close_li = domConstruct.create("li", {
                    innerHTML: "[close]"
                });

                on(close_li, "click", lang.hitch(this, this.close_li_clicked));
                domConstruct.place(close_li, this.list);

            }

        });
    }
);