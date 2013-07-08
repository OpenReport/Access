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
app.views.FormListView = Backbone.View.extend({
    el: '#page-content',
    collection: null,
    initialize: function(options){
        _.bind(this, 'render');
        this.listenTo(this.collection, 'reset', this.render);
    },

    render: function () {
        var params = { forms: this.collection.models };
        var template = _.template($("#reportFormsView").html(), params);
        $(this.el).html(template);

        $(".loader").hide();
        return this;

    },


    //events: {
    //    "click #back-button": "back"
    //},
    //
    //back: function() {
    //    window.history.back();
    //    return false;
    //},
    destroy: function(){
        $(this.el).unbind();
        $(this.el).empty();
    }

});


app.views.FormView = Backbone.View.extend({
    el: '#page-content',
    model: null,
    initialize: function(options){
        //_.bind(this, 'render');
        //  this.listenTo(this.collection, 'reset', this.render);
    },

    render: function () {
        // get geolocation
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                app.geo = {lon:position.coords.longitude, lat:position.coords.latitude}

            });
        }
        else{
            app.geo = {lon:0, lat:0}
        }
        // display the form
        var template = _.template($("#reportForm").html(), this.model.attributes);
        $(this.el).html(template);
        $("#"+this.model.attributes.meta.name).buildForm(this.model.attributes.meta);
        // add the submit button
        $("#"+this.model.attributes.meta.name).append('<input id="submitForm" type="submit" value="Submit">');
        $(".loader").hide();
        return this;
    },


    events: {
        "click #submitForm": "submit"
    },


    submit: function(){
        $(".loader").show();
        var base = this;
        $.validateForm($("#"+this.model.attributes.meta.name),
            function(){  // success
                var reportData = new app.models.ReportRecord();
                var now = new Date();
                reportData.save({

                    api_key:base.model.attributes.api_key,
                    form_id:base.model.attributes.id,
                    meta:$("#"+base.model.attributes.meta.name).serializeObject(),
                    user: localStorage["email"],
                    record_date: now,
                    lon: app.geo.lon,
                    lat: app.geo.lat
                }, console.log('saved'));

                 console.log('pass');
                 window.history.back();
             },
            function(cnt){  // failure
                 console.log('fail');
             }
        );

    },
    //back: function() {
    //    window.history.back();
    //    return false;
    //},
    destroy: function(){
        $(this.el).unbind();
        $(this.el).empty();
    }

});
