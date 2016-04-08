/*global <%= appCamelCaseName %>, $*/

; (function($, window, document, undefined) {
    $.widget('ui.<%= appCamelCaseName %>', {

        options: {

        },

        _create: function() {
            var options = this.options;
        },

        _setOption: function(key, value) {
            this.options[key] = value;
        },

        _destroy: function() {
            $.Widget.prototype.destroy.apply(this, arguments);
        }
    });
})($, window, document);