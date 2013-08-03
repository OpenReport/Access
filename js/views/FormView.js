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
         options || (options = {});
         this.template = options.view;
        _.bind(this, 'render');
        this.listenTo(this.collection, 'reset', this.render);
    },

    render: function () {
        var params = { forms: this.collection.models };
        var template = _.template($(this.template).html(), params);
        $(this.el).html(template);

        $(".loader").hide();
        return this;

    },

    destroy: function(){
        $(this.el).unbind();
        $(this.el).empty();
    }

});

app.views.FormView = Backbone.View.extend({
    el: '#page-content',
    model: null,
    intentities: null,
    identity: '',
    initialize: function(options){
        options || (options = {});
        this.identity = options.identity;
        this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
        var base = this;

        // get geolocation
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(position){
                app.geo = {lon:position.coords.longitude, lat:position.coords.latitude}
            });
        }
        // build and display the form
        var template = _.template($("#reportForm").html(), this.model.attributes);
        $(this.el).html(template);
        $("#"+this.model.attributes.meta.name).buildForm(this.model.attributes.meta);
        // Does this form have an identity?
        if(typeof this.model.attributes.identity_name === 'string'){
            var identity_name = this.model.attributes.identity_name; // create shorthand

            // set idenity if any from assignments and lock down
            if(typeof this.identity !== 'undefined'){
                $("input#"+identity_name).val(this.identity);
            }
            else{
                // pull identity list for lookup GET: /api/identities/{apiKey}/{identity_name}
                $.ajax({
                    url: app.config.API+'identities/'+app.config.APIKey+'/'+identity_name,
                    type: 'get',
                    dataType:'json',
                    success: function(response){
                        base.intentities = response.data;
                        // assign click event for lookup
                        var params = {listId:'identities', list:response.data};
                        $("#hidden-content").html(_.template($("#identityList").html(), params));
                        $('#identities').on('change', function(){
                            $('#hidden-content').hide();
                            $("input#"+identity_name).val($('#identities').val());
                        });

                        $("input#"+identity_name).on('click', function(e){
                            e.preventDefault()
                            $('#hidden-content').show();
                            $('#identities').trigger('click');
                        });

                    },
                    failure: function(err){
                        console.log(err);
                        $('#errors').append(err);
                    }
                });


            }

        }
        // assign OTF Uploading
        $('img.capture-btn').each(function(){
            $(this).bind('click', function(e){
                $('#imageCapture-'+$(this).data('for')).trigger('click');
            });
            otfUpload($(this).data('for'));
        });
        // add the submit button
        $("#"+this.model.attributes.meta.name).append('<button id="submitForm" type="submit">Submit</button>');

        $(".loader").hide();
        return this;
    },

    events: {
        "click #submitForm": "submit"
    },

    submit: function(){
        $(".loader").show();
        $('#messages').hide();
        var base = this;
        var identity = '';
        // force all identites to uppercase
        if(base.model.attributes.identity_name !== ''){
            identity = $("input#"+this.model.attributes.identity_name).val().toUpperCase();
            $("input#"+this.model.attributes.identity_name).val(identity);
        }

        $.validateForm($("#"+this.model.attributes.meta.name),
            function(){  // success
                $('.imageCapture').remove();
                var reportData = new app.models.ReportRecord();console.log(reportData);
                var now = new Date();
                var tz = ""+now.toString().split("GMT")[1].split(" (")[0];
                reportData.save({
                    api_key:app.config.APIKey,
                    form_id:base.model.attributes.id,
                    report_version:base.model.attributes.report_version,
                    identity_name: base.model.attributes.identity_name,
                    identity: identity,
                    meta:$("#"+base.model.attributes.meta.name).serializeObject(),
                    user: localStorage["email"],
                    record_date: now,
                    record_time_offset: tz,
                    lon: app.geo.lon,
                    lat: app.geo.lat
                }, console.log('saved'));

                 window.location.replace('#menu');
             },
            function(cnt){  // failure
                 console.log('fail');
                 $('#messages').append('Error: Some Report Fields are Missing or Incorrect.').show();
                 $(".loader").hide();
             }
        );

    },

    destroy: function(){
        $('#hidden-content').unbind();
        $('#hidden-content').empty();
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
