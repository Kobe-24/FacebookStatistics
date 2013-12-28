$(document).ready(function () {
    $("#movieButton").click(function() {
        $("#" + "orderedList").empty();
        get_friend_likes();
    });
});


var movieList = new Array();
var movieListSorted = new Array();
var friendCount = 0;

function compareMovies(movieA, movieB) {
    if (movieA.name === movieB.name) return 0;
    if (movieA.name > movieB.name) return 1;
    return -1;
}
function popularMovies(movieA, movieB) {
    return movieB.mCount - movieA.mCount;
}
function data_fetch_postproc() {
    document.getElementById('temporaryOutput').innerHTML
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
    var maxResults = 100;
    if (movieListSorted.length < maxResults) {
        maxResults = movieListSorted.length;
    }
    movieListSorted.sort(popularMovies);
    document.getElementById('temporaryOutput').innerHTML = "";
    
    for (i = 0; i < maxResults; i++) {
        var newElement = document.createElement("LI");
        newElement.id = movieListSorted[i].id;
        newElement.innerHTML = '<h5>'+ movieListSorted[i].name + '</h5>' + 'Likes: '
          + movieListSorted[i].mCount;
        document.getElementById("orderedList").appendChild(newElement);
        
        FB.api('/' + movieListSorted[i].id, function (response) {
            var element = document.getElementById(response.id);
            element.innerHTML += "<img src='" + response.picture + "'>"
              + "</img><br/>";
            if (response.link) {
                element.innerHTML += "<a href='" + response.link + "'>"
                  + response.link + "</a><br/>";
                element.innerHTML += '<iframe src='
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
        });
    }
}
function get_friend_likes() {
    document.getElementById('temporaryOutput').innerHTML = "Requesting "
      + "data from Facebook ... ";
    FB.api('/me/friends', function (response) {
        friendCount = response.data.length;
        for (i = 0; i < response.data.length; i++) {
            friendId = response.data[i].id;
            FB.api('/' + friendId + '/movies', function (response) {
                movieList = movieList.concat(response.data);
                friendCount--;
                document.getElementById('temporaryOutput').innerHTML = friendCount
                  + " friends to go ... ";
                if (friendCount === 0) { data_fetch_postproc(); };
            });
        }
    });
}
