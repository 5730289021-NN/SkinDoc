



function api(url,picUrl) {
    fetch(url, {
        method: 'post',

        headers: {
            'Prediction-Key': '9ba907306c8740cea52aabd508df5c94',
            'content-type': 'application/json'
        },
            body: JSON.stringify({Url: picUrl})
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

// var picUrl = "http://www.9thaihealth.com/wp-content/uploads/2014/07/%E0%B9%82%E0%B8%A3%E0%B8%8" +
//         "4%E0%B8%AB%E0%B8%B4%E0%B8%941.jpg";
// api("https://southcentralus.api.cognitive.microsoft.com/customvision/v1.1/Prediction/" +
//         "1ad8ba80-bd73-4e09-b185-260423589f69/url",picUrl);
