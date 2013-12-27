<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="FacebookStatistics._Default" %>

<asp:Content runat="server" ID="FeaturedContent" ContentPlaceHolderID="FeaturedContent">
    <section class="featured">
        <div class="content-wrapper">
            <hgroup class="title">
                <h1><%: Title %>.</h1>
                <h2>Test Facebook API</h2>
            </hgroup>
            <p>
                Test Facebook API. Test Facebook API. Test Facebook API
                Test Facebook API. Test Facebook API. Test Facebook API

            </p>
        </div>
    </section>
</asp:Content>
<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <h3>Movies</h3>
    <ol class="round">
        <li class="one">
            <h5>Getting Started</h5>
            ASP.NET Web Forms lets you build dynamic websites using a familiar drag-and-drop, event-driven model.
            A design surface and hundreds of controls and components let you rapidly build sophisticated, powerful UI-driven sites with data access.
            <a href="http://go.microsoft.com/fwlink/?LinkId=245146">Learn more…</a>
        </li>
        <li class="one">
            <h5>Add NuGet packages and jump-start your coding</h5>
            NuGet makes it easy to install and update free libraries and tools.
            <a href="http://go.microsoft.com/fwlink/?LinkId=245147">Learn more…</a>
        </li>
        <li class="one">
            <h5>Find Web Hosting</h5>
            You can easily find a web hosting company that offers the right mix of features and price for your applications.
            <a href="http://go.microsoft.com/fwlink/?LinkId=245143">Learn more…</a>
        </li>
    </ol>
    
    <input id="testButton" type="button" value="Test API"/>
     <div id="fb-root"></div> 
<div id="login"></div> 
<div id="test"></div> 
<div id="movies"></div> 
    
<script src="Scripts/Facebook/displayMovies.js"  type="text/javascript"></script>  
<script src="Scripts/Facebook/loadFaceBookSDK.js"  type="text/javascript"></script>   
 <script>
     window.fbAsyncInit = function () {
         // init the FB JS SDK
         FB.init({
             appId: '367702730013608',
             status: true, // check login status
             cookie: true, // enable cookies 
             xfbml: true, // parse XFBML
             oauth: true
         });

         // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
         // for any authentication related change, such as login, logout or session refresh. This means that
         // whenever someone who was previously logged out tries to log in again, the correct case below 
         // will be handled. 
         FB.getLoginStatus(function (response) {
             if (response.status == "connected") {
                 // logged in and connected user, someone you know
                 get_friend_likes();
                 document.getElementById('login').innerHTML
                   = '<a href="#" onclick="FB.logout();">Logout</a><br/>';
             } else {
                 document.getElementById('login').innerHTML
                   = '<fb:login-button show-faces="true" width="200"'
                   + ' max-rows="1" perms="user_likes, friends_likes">'
                   + '</fb:login-button>';
                 FB.XFBML.parse();
             }
         });

         FB.Event.subscribe('auth.login', function (response) {
             if (response.status == "connected") {
                 // logged in and connected user, someone you know
                 get_friend_likes();
                 document.getElementById('login').innerHTML
                   = '<a href="#" onclick="FB.logout();">Logout</a><br/>';
             } else {
                 document.getElementById('login').innerHTML
                   = '<fb:login-button show-faces="true" width="200"'
                   + ' max-rows="1" perms="user_likes, friends_likes">'
                   + '</fb:login-button>';
                 FB.XFBML.parse();
             }
         });
     };
 </script>
            <!--
  Below we include the Login Button social plugin. This button uses the JavaScript SDK to
  present a graphical Login button that triggers the FB.login() function when clicked. -->
<%--<fb:login-button show-faces="true" width="200" max-rows="1" 
perms="user_likes, friends_likes"></fb:login-button>--%>
</asp:Content>
