$(document).ready(function () {

	youtubeData = {}

	$("#searchBtn").on('click', function (e) {
		e.preventDefault();
		if ($("#inputSearch").val() == "") {
			alert("Please write an item to search videos");
		} else {
			handleFetch($('#inputSearch').val(), displayAPI);
		}

	});

	$("#container").on('click', '.change', function (e) {
		e.preventDefault();
		if ($(this).text() == "Previous Page") {
			handleNewFetch($('#inputSearch').val(), displayAPI, youtubeData, "previousPage")
		} else {
			handleNewFetch($('#inputSearch').val(), displayAPI, youtubeData, "nextPage")
		}
	});

	function displayAPI(data) {
		youtubeData = data
		console.log(youtubeData)
		$('#container').empty();
		data.items.forEach((item, index) => {
			$('#container').append(`<a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank"><h2>${item.snippet.title}</h2></a> <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank"><img alt="News Image" src="${item.snippet.thumbnails.medium.url}" /></a> <hr/>`);
		});

	}

	function handleFetch(object, callback) {
		$.ajax({
			url: 'https://www.googleapis.com/youtube/v3/search',
			method: 'GET',
			data: {
				key: 'AIzaSyD6Ccp76zdcFcagdcikDT5-5zZQLCgXV8o',
				maxResults: '10',
				part: 'snippet',
				q: object,
				type: 'video',
			},
			dataType: "json",
			success: myJson => callback(myJson),
			error: error => alert(error)
		}).done(() => {
			$('#container').append(`<button class="change">Previous Page</button> <button class="change" id="next">Next Page</button>`);
		});

	}

	function handleNewFetch(object, callback, data, page) {
		if (page == "nextPage") {
			$.ajax({
				url: 'https://www.googleapis.com/youtube/v3/search',
				method: 'GET',
				data: {
					key: 'AIzaSyD6Ccp76zdcFcagdcikDT5-5zZQLCgXV8o',
					maxResults: '10',
					part: 'snippet',
					q: object,
					type: 'video',
					pageToken: `${data.nextPageToken}`
				},
				dataType: "json",
				success: myJson => callback(myJson),
				error: error => alert(error)
			}).done(() => {
				$('#container').append(`<button class="change">Previous Page</button> <button class="change" id="next">Next Page</button>`);
				window.scrollTo(0, 0);
			});
		} else {
			if (data.prevPageToken == undefined) {
				alert("Already in the first page")
			} else {
				$.ajax({
					url: 'https://www.googleapis.com/youtube/v3/search',
					method: 'GET',
					data: {
						key: 'AIzaSyD6Ccp76zdcFcagdcikDT5-5zZQLCgXV8o',
						maxResults: '10',
						part: 'snippet',
						q: object,
						type: 'video',
						pageToken: `${data.prevPageToken}`
					},
					dataType: "json",
					success: myJson => callback(myJson),
					error: error => alert(error)
				}).done(() => {
					$('#container').append(`<button class="change">Previous Page</button> <button class="change" id="next">Next Page</button>`);
					window.scrollTo(0, 0);
				});
			}

		}

	}
});