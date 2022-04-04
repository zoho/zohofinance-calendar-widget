## Calendervue

To send your invoice faster, pull event and description from Google calendar and charge for those events directly in ZohoBooks. 

App developed by Vue Js Framework.

## Prerequesties

In this repository , It have a source code of widgets only. This widget uses connections. To make this widget work in Development mode, you need to create connections.

<ol>
 <li>Create a connections for books and googlecalender as like mentioned in <a href="https://github.com/zoho/zohofinance-calendar-widget/blob/8b8da74b00e6495783e78299f2cb1e204b1c5fcf/calendervue/widget/plugin-manifest.json#L19">plugin-manifest.json</a>.</li>
</ol>

## Development

<li> Clone this Repository </li>
<li> cd calendervue </li>
<li> Run yarn </li>
<li> Run yarn serve </li>
<li> Copy the app running port url and paste it in the plugin-manifest.json's widget url. (ex. widget/plugin-manifest.json) </li>
<li> cd widget </li>
<li> Run zet run. It will run your app in https://localhost:5000 </li>
<li> Enable Developement mode in books app. </li>
<li> Note, In Invoice creation page, you have a charge event option in add line item section </li>
 
## Build

<li> Run yarn prodBuild. (It builds the assets and move it to widget directory) </li>

## Upload Widget

<li> Run <b>yarn zetpack</b> from calendarvue directory or Run <b>zet pack</b> from widget directory. (It will generate the widget zip.) </li>
<li> Upload the created zip in books application </li>



