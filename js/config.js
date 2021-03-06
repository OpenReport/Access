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

app.config.Version = "1.0";
/** SETTINGS **/
app.config.API = "http://m.openreport.local/api/";
app.config.Media = !!app.userMedia;
app.config.GPS = 'geolocation' in navigator;
app.config.PagingSize = 10;
/** NEED TO BE LOGGED IN TO SET THE FOLLOWING **/
app.config.APIKey = "";
app.config.AccountName = "";
app.config.UserId = 0;
app.config.UserRoles = "";
