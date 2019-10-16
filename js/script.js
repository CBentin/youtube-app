let nextToken;
let lastToken;
let listV;



function callVideos(val, callback){
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search",
        data:{
            q: val,
            part: 'snippet',
            key: 'AIzaSyAT3roeRr42-u48NZdxyXWRYSp5lGzGKm8',
            maxResults: 10
        },
        method: "GET",
        dataType: "json",
        success: function (responseJSON){
            callback(responseJSON.items, responseJSON.nextPageToken, responseJSON.prevPageToken);   
        }
    });
}

function callOtherVideos(val, token, callback){
    console.log("here")
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search",
        data:{
            q: val,
            part: 'snippet',
            key: 'AIzaSyAT3roeRr42-u48NZdxyXWRYSp5lGzGKm8',
            maxResults: 10,
            pageToken: token
        },
        method: "GET",
        dataType: "json",
        success: function (responseJSON){
            callback(responseJSON.items, responseJSON.nextPageToken, responseJSON.prevPageToken);   
        }
    });
}

function videoSearch(){
    $('#videoSearch').on('submit', function(event){
        event.preventDefault();
        $('#container').html("");
        callVideos( $('#searchBar').val(), function(videos, n, l){
            for(let i = 0; i < videos.length; i++){
                $('#container').append(`<div class = "item">
                                            <img src = "${videos[i].snippet.thumbnails.medium.url}"/>
                                            <div><p>${videos[i].snippet.title}</p></div>
                                        </div>
                                       `);
            }
            $('main').css('visibility', 'visible');
            nextToken = n;
            lastToken = l;
            listV = videos;
        });
        $('#bttnContainer').on('submit', function(next){
            next.preventDefault();
            if (typeof nextToken !== 'undefined'){
                $('#container').html("");
                callOtherVideos($('#searchBar').val(), nextToken, function(videos1, n1, l1){
                    for(let i = 0; i < videos1.length; i++){
                        $('#container').append(`<div class = "item">
                                                    <img src = "${videos1[i].snippet.thumbnails.medium.url}"/>
                                                    <div><p>${videos1[i].snippet.title}</p></div>
                                                </div>
                                               `);
                    }
                    nextToken = n1;
                    lastToken = l1;
                    listV = videos1;
                });
            }
        });
        $('#bttnContainer').on('reset', function(last){
            last.preventDefault();
            if (typeof lastToken !== 'undefined'){
                $('#container').html("");
                callOtherVideos($('#searchBar').val(), lastToken,function(videos2, n2, l2){
                    for(let i = 0; i < videos2.length; i++){
                        $('#container').append(`<div class = "item">
                                                    <img src = "${videos2[i].snippet.thumbnails.medium.url}"/>
                                                    <div><p>${videos2[i].snippet.title}</p></div>
                                                </div>
                                               `);
                    }
                    nextToken = n2;
                    lastToken = l2;
                    listV = videos2;
                });
            }
        });
        $('#container').on("click", 'img',function(clickEvent){
            clickEvent.preventDefault();
            let i = 0;
            while(listV[i].snippet.thumbnails.medium.url != $(this).attr('src')){
                i++;
            }
            window.open("https://www.youtube.com/watch?v="+listV[i].id.videoId);
        });
        $('#container').on("click", 'p',function(clickEvent){
            clickEvent.preventDefault();
            let i = 0;
            while(listV[i].snippet.title != $(this).html()){
                i++;
            }
            window.open("https://www.youtube.com/watch?v="+listV[i].id.videoId);
        });
    });
}

videoSearch();


