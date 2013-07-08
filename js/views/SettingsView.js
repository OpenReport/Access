/**
 * OpenReport
 *
 * Copyright 2013, The Austin Conner Group
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */
app.views.SettingsView = Backbone.View.extend({
    el: '#page-content',
    initialize: function(options){
        this.render();
    },


    render: function () {
        var template = _.template($("#settingsView").html(), {});
            $(this.el).html(template);
            $(".loader").hide();
        return this;
    },


    events: {
        "click #back-button": "back"
    },

    back: function() {
        window.history.back();
        return false;
    },
    destroy: function(){
        $(this.el).unbind();
        $(this.el).empty();
    }

});
