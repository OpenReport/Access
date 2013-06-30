/**
 * Open Report
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

        var template = _.template($("#reportForm").html(), this.model.attributes);
        $(this.el).html(template);
        $("#"+this.model.attributes.meta.name).buildForm(this.model.attributes.meta);

        $("#"+this.model.attributes.meta.name).append('<input id="submitForm" type="submit" value="Submit">');

        return this;
    },


    events: {
        "click #submitForm": "submit"
    },


    submit: function(){

        $.validateForm($("#"+this.model.attributes.meta.name),
            function(){  // success
                var reportData = new app.models.ReportRecord();
                reportData.save({
                    task_id:this.model.attributes.task_id,
                    form_id:this.model.attributes.id,
                    meta:$("#"+this.model.attributes.meta.name).serializeObject()
                }, console.log('saved'));

                 console.log('pass');
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
