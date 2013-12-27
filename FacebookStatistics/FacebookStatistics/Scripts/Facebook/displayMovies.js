// Response from FaceBook




$(document).ready(function () {
    $("#testButton").click(function() {
        FB.api('/me', function (response) {
            alert(response.name);
        });
    });
});


var movieList = new Array();
var movieListSorted = new Array();
var friendCount = 0;
function showMovies() {
    alert(movieList.length);
}
function compareMovies(movieA, movieB) {
    if (movieA.name === movieB.name) return 0;
    if (movieA.name > movieB.name) return 1;
    return -1;
}
function popularMovies(movieA, movieB) {
    return movieB.mCount - movieA.mCount;
}
function data_fetch_postproc() {
    document.getElementById('test').innerHTML
      = "Generating recommendations ... ";
    movieList.sort(compareMovies);
    // Now we have sorted list, dedupe and count
    mCtr = 0;
    for (i = 0; i < movieList.length; i++) {
        var count = 0;
        movieListSorted[mCtr] = movieList[i];
        for (j = i; j < movieList.length; j++) {
            if (movieList[i].name === movieList[j].name) {
                count++;
            } else {
                break;
            }
        }
        i = i + count - 1;
        movieListSorted[mCtr++].mCount = count;
    }
    var maxResults = 10;
    if (movieListSorted.length < 10) {
        maxResults = movieListSorted.length;
    }
    movieListSorted.sort(popularMovies);
    document.getElementById('test').innerHTML = "";
    for (i = 0; i < maxResults; i++) {
        var newDiv = document.createElement("DIV");
        newDiv.id = movieListSorted[i].id;
        newDiv.innerHTML = movieListSorted[i].name + ' : Likes - '
          + movieListSorted[i].mCount;
        document.getElementById("movies").appendChild(newDiv);
        FB.api('/' + movieListSorted[i].id, function (response) {
            var newDiv = document.createElement("DIV");
            newDiv.innerHTML = "<img src='" + response.picture + "'>"
              + "</img><br/>";
            if (response.link) {
                newDiv.innerHTML += "<a href='" + response.link + "'>"
                  + response.link + "</a><br/>";
                newDiv.innerHTML += '<iframe src='
                  + '"http://www.facebook.com/plugins/like.php?'
                  + 'href=' + response.link + '&amp;layout=standard'
                  + '&amp;show_faces=true&amp;'
                  + 'width=450&amp;action=like&amp;'
                  + 'colorscheme=light&amp;height=80"'
                  + 'scrolling="no" frameborder="0" style="'
                  + 'border:none; overflow:hidden;'
                  + 'width:450px; height:80px;"'
                  + 'allowTransparency="true"></iframe><br/>';
            }
            document.getElementById(response.id).appendChild(newDiv);
        });
    }
}
function get_friend_likes() {
    document.getElementById('test').innerHTML = "Requesting "
      + "data from Facebook ... ";
    FB.api('/me/friends', function (response) {
        friendCount = response.data.length;
        for (i = 0; i < response.data.length; i++) {
            friendId = response.data[i].id;
            FB.api('/' + friendId + '/movies', function (response) {
                movieList = movieList.concat(response.data);
                friendCount--;
                document.getElementById('test').innerHTML = friendCount
                  + " friends to go ... ";
                if (friendCount === 0) { data_fetch_postproc(); };
            });
        }
    });
}

//window.fbAsyncInit = function () {
//    FB.init({
//        appId: '367702730013608',
//        status: true, // check login status
//        cookie: true, // enable cookies to allow the server to access the session
//        xfbml: true  // parse XFBML
//    });

//    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
//    // for any authentication related change, such as login, logout or session refresh. This means that
//    // whenever someone who was previously logged out tries to log in again, the correct case below 
//    // will be handled. 
//    FB.Event.subscribe('auth.authResponseChange', function (response) {
//        // Here we specify what we do with the response anytime this event occurs. 
//        if (response.status === 'connected') {
//            // The response object is returned with a status field that lets the app know the current
//            // login status of the person. In this case, we're handling the situation where they 
//            // have logged in to the app.
//            testAPI();
//        } else if (response.status === 'not_authorized') {
//            // In this case, the person is logged into Facebook, but not into the app, so we call
//            // FB.login() to prompt them to do so. 
//            // In real-life usage, you wouldn't want to immediately prompt someone to login 
//            // like this, for two reasons:
//            // (1) JavaScript created popup windows are blocked by most browsers unless they 
//            // result from direct interaction from people using the app (such as a mouse click)
//            // (2) it is a bad experience to be continually prompted to login upon page load.
//            FB.login();
//        } else {
//            // In this case, the person is not logged into Facebook, so we call the login() 
//            // function to prompt them to do so. Note that at this stage there is no indication
//            // of whether they are logged into the app. If they aren't then they'll see the Login
//            // dialog right after they log in to Facebook. 
//            // The same caveats as above apply to the FB.login() call here.
//            FB.login();
//        }
//    });
//};

//// Load the SDK asynchronously
//(function (d) {
//    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//    if (d.getElementById(id)) { return; }
//    js = d.createElement('script'); js.id = id; js.async = true;
//    js.src = "//connect.facebook.net/en_US/all.js";
//    ref.parentNode.insertBefore(js, ref);
//}(document));

//// Here we run a very simple test of the Graph API after login is successful. 
//// This testAPI() function is only called in those cases. 
//function testAPI() {
//    console.log('Welcome!  Fetching your information.... ');
//    FB.api('/me', function (response) {
//        console.log('Good to see you, ' + response.name + '.');
//    });
//}

////window.fbAsyncInit = function () {
////    FB.init({
////        appId: '367702730013608',
////        status: true,
////        cookie: true,
////        xfbml: true,
////        oauth: true
////    });

////    showLoader(true);

////    function updateButton(response) {
////        button = document.getElementById('fb-auth');
////        userInfo = document.getElementById('user-info');

////        if (response.authResponse) {
////            //user is already logged in and connected
////            FB.api('/me', function (info) {
////                login(response, info);
////            });

////            button.onclick = function () {
////                FB.logout(function (response) {
////                    logout(response);
////                });
////            };
////        } else {
////            //user is not connected to your app or logged out
////            button.innerHTML = 'Login';
////            button.onclick = function() {
////                showLoader(true);
////                FB.login(function(response) {
////                    if (response.authResponse) {
////                        FB.api('/me', function(info) {
////                            login(response, info);
////                        });
////                    } else {
////                        //user cancelled login or did not grant authorization
////                        showLoader(false);
////                    }
////                }, { scope: 'email,user_birthday,status_update,publish_stream,user_about_me' });
////            }
////        }
////    }

////    // run once with current status and whenever the status changes
////    FB.getLoginStatus(updateButton);
////    FB.Event.subscribe('auth.statusChange', updateButton);
////};
////(function () {
////    var e = document.createElement('script'); e.async = true;
////    e.src = document.location.protocol
////        + '//connect.facebook.net/en_US/all.js';
////    document.getElementById('fb-root').appendChild(e);
////}());