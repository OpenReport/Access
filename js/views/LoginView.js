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
 */

/**
 * About: About Model
 *
 *
 */
app.views.LoginView = Backbone.View.extend({
    el: '#page-content',
    initialize:function () {
        // reset key
        app.config.APIKey = "";
        this.render();
    },

    events: {
        "click #loginButton": "login"
    },

    render:function () {
        var template = _.template($('#loginView').html(), {email:localStorage["email"], password:localStorage["password"]});
        $(this.el).html(template);
        return this;
    },

    login:function (event) {
        event.preventDefault(); // Don't let this button submit the form
        //$('.alert-error').hide(); // Hide any errors on a new submit
        var url = app.config.API+'login';

        var formValues = {
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val()
        };

        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (response) {


                if(response.status == 'ok') {  // Access Granted
                    // set access key
                    app.config.APIKey = response.data.apiKey;
                    localStorage["email"] = formValues.email;
                    localStorage["password"] = formValues.password;
                    window.location.replace('#menu');
                }
                else { // Access Failed
                    //window.location.replace('#menu');
                }
            }
        });
    },
    destroy: function(){
        $(this.el).unbind();
        $(this.el).empty();
    }

});
