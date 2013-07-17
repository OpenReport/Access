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
    identity: '',
    initialize: function(options){
        options || (options = {});
        this.identity = options.identity;
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

        // display the form
        var template = _.template($("#reportForm").html(), this.model.attributes);
        $(this.el).html(template);
        $("#"+this.model.attributes.meta.name).buildForm(this.model.attributes.meta);
        // add the submit button
        $("#"+this.model.attributes.meta.name).append('<button id="submitForm" type="submit">Submit</button>');

        console.log(this.identity);

        $("input#"+this.model.attributes.identity).val(this.identity);

        // assign OTF Uploading
        $('img.capture-btn').each(function(){
            $(this).bind('click', function(e){
                $('#imageCapture-'+$(this).data('for')).trigger('click');
            });
            otfUpload($(this).data('for'));
        });


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
                $('.imageCapture').remove();
                var reportData = new app.models.ReportRecord();
                var now = new Date();
                var tz = ""+now.toString().split("GMT")[1].split(" (")[0];

                reportData.save({
                    api_key:base.model.attributes.api_key,
                    form_id:base.model.attributes.id,
                    report_version:base.model.attributes.report_version,
                    identity: $('#'+base.model.attributes.identity).val(),
                    meta:$("#"+base.model.attributes.meta.name).serializeObject(),
                    user: localStorage["email"],
                    record_date: now,
                    record_time_offset: tz,
                    lon: app.geo.lon,
                    lat: app.geo.lat
                }, console.log('saved'));

                 console.log('pass');
                 window.history.back();
             },
            function(cnt){  // failure
                 console.log('fail');
                 $(".loader").hide();
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


function attachPhoto(id, src){

    ul = $('ul#capture-img-'+id);
    console.log(ul);
    var li = document.createElement('li');
    var img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('class', 'capture-img');

    $(li).append(img);
    $(ul).prepend(li);
    //$('img#'+id+'-img').attr('src', src);
}

function otfUpload(id){
    var fInput = document.getElementById('imageCapture-'+id);
    //fInput.style.display = "none";
    // Create a FormData Object
    var formData = false;
    fInput.addEventListener('change', function(e){
        formData = new FormData;
        var i=0, l = this.files.length,img,reader,file;

        for(;i<l;i++){
            file = this.files[i];
            if(file.size > 2100000 || file.type !== "image/jpeg") continue;
            reader = new FileReader();
            reader.onloadend = function(e){

                attachPhoto(id, e.target.result);
            };
            //
            reader.readAsDataURL(file);
            formData.append('images[]', file);
            formData.append('form_id',99);
            formData.append('column',id);
            $.ajax({
                contentType: false,
                processData: false,
                url: app.config.API+'media/upload/'+app.config.APIKey,
                type: 'post',
                dataType:'json',
                data: formData,
                success: function(response){
                    console.log(response);
                    if(response.status === 'ok' && response.count > 0){
                        value = $('#'+id).val();
                        value = value+(value === ''? '':',')+response.data[0];
                        $('#'+id).val(value);
                    }

                },
                failure: function(err){
                    console.log(err);
                    $('#errors').append(err);
                }
            });

        }
    });
}
