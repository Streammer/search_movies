const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';
function apiSearch(e){
		e.preventDefault();
		const searchText = document.querySelector('.form-controll').value;
		if(searchText.trim().length === 0){
			movie.innerHTML = '<h2 class = "col-12">Поле поиска не должно быть пустым</h2>';
			return;
		}
		const server = `https://api.themoviedb.org/3/search/multi?api_key=9d772a36570d0f5715543804d396c7a3&language=ru&query=+ ${searchText}`;
		movie.innerHTML = '<div class="spinner"></div>';
		
		fetch(server)
			.then((value) => {
				if(value.status !== 200){
					return Promise.reject(value);
				}
				return value.json();
			})
			.then((output) => {
				let inner = '';
				if(output.results.length === 0){
					inner = '<h2 class = "col-12">По вашему запросу ничего не найдено</h2>'
				};
				output.results.forEach(item => {
					let nameItem = item.name || item.title;
					const poster = item.poster_path ? urlPoster + item.poster_path : './images/noPoster.jpg';
					let dataInfo = '';
					if(item.media_type !== 'person'){
						dataInfo = `data-id="${item.id}" data-type = "${item.media_type}"`;
					}
					inner += 
					`<div class = "col-3 item">
						<img src = '${poster}' class = "img-poster" alt = '${nameItem}' ${dataInfo}>
						<h5 class = "name-of-movie">${nameItem}</h5>
					</div>`;
				});
				movie.innerHTML = inner;
				addEventMedia();
			})
			.catch((reason) => {
				movie.innerHTML = 'Упс, что-то пошло не так';
				console.error('err: ' + reason.status);
			});
};

searchForm.addEventListener('submit', apiSearch);

function addEventMedia(){
	const media = movie.querySelectorAll('img[data-id]');
				media.forEach(function(elem) {
					elem.style.cursor = 'pointer';
					elem.addEventListener('click', showFullInfo);
				})
}

function showFullInfo(){
	let url = '';
	if(this.dataset.type === 'movie'){
		url = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=9d772a36570d0f5715543804d396c7a3&language=ru`;
	}else if (this.dataset.type === 'tv'){
		url = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=9d772a36570d0f5715543804d396c7a3&language=ru`;
	}else{
		movie.innerHTML = `<h2 class = "col-12">Произошла ошибка. Повторите позже</h2>`;
	}
	fetch(url)
		.then((value) => {
			if(value.status !== 200){
				return Promise.reject(value);
			}
			return value.json();
		})
		.then((output) => {
			console.log(output);
			movie.innerHTML = `
			<h4 class = "full-movie-name full-movie_style">${output.name || output.title}</h4>
			<div class = "poster-cover poster-cover_style">
				<img src = '${ output.poster_path ? urlPoster + output.poster_path : './images/noPoster.jpg'}' alt = '${output.name || output.title}'>
			</div>
			<div class = "description description_style">
				${(output.homepage) ? `<p class = "description__paragraph"><a href ="${output.homepage}" target = "_blank">Официальная страница</a></p>`: ''}
				${(output.imdb_id) ? `<p class = "description__paragraph"><a href = "https://imdb.com/title/${output.imdb_id}" target = "_blank">Страница на imdb.com</a></p>`: ''}
				<p >Рейтинг: ${output.vote_average}</p>
				<p>Статус: ${output.status}</p>
				<p>Дата релиза: ${output.first_air_date || output.release_date}</p>
				${(output.last_episode_to_air)? `<p>${output.number_of_seasons} Сезон ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}
				<p class = "description__content">Описание: ${output.overview}</p>
			</div>
			<div class = 'youtube'>
			</div>
			`;
			getVideo(this.dataset.type, this.dataset.id);
		})
		.catch((reason) => {
			movie.innerHTML = 'Упс, что-то пошло не так';
			console.error('err: ' + reason.status);
		});
}

document.addEventListener('DOMContentLoaded', function(){
	fetch('https://api.themoviedb.org/3/trending/all/week?api_key=9d772a36570d0f5715543804d396c7a3&language=ru')
			.then((value) => {
				if(value.status !== 200){
					return Promise.reject(value);
				}
				return value.json();
			})
			.then((output) => {
				let inner = '<h4 class = "movies__movies-popular movies__movies-popular_style">Популярные за неделю</h4>';
				if(output.results.length === 0){
					inner = '<h2 class = "col-12">По вашему запросу ничего не найдено</h2>'
				};
				output.results.forEach(item => {
					let nameItem = item.name || item.title;
					let mediaType = item.title ? 'movie': 'tv';
					const poster = item.poster_path ? urlPoster + item.poster_path : './images/noPoster.jpg';
					let dataInfo = `data-id="${item.id}" data-type = "${mediaType}"`;
					inner += 
					`<div class = "popular popular_style item">
						<img src = '${poster}' class = "img-poster" alt = '${nameItem}' ${dataInfo}>
						<h5 class = "popular__caption popular__caption_styles">${nameItem}</h5>
					</div>`;
				});
				movie.innerHTML = inner;
				addEventMedia();
			})
			.catch((reason) => {
				movie.innerHTML = 'Упс, что-то пошло не так';	
			});
})

function getVideo(type, id){
	let youtube = movie.querySelector('.youtube');
	fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=9d772a36570d0f5715543804d396c7a3&language=ru`)
	.then((value) => {
		if(value.status !== 200){
			return Promise.reject(value);
		}
		return value.json();
	})
	.then((output) =>{
		console.log(output);
		let videoFrame = '<h5 class = "youtube__trailer-caption youtube__trailer-caption_style">Трейлеры</h5>';
		if(output.results.length === 0){
			videoFrame = '<p>К сожалению видео отсутствует.</p>';
		};
		output.results.forEach((item) =>{
			videoFrame += `<iframe  src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class = "preview preview_style"></iframe>`;
		});

		youtube.innerHTML = videoFrame;
		})
		.catch((reason) =>{
			youtube.innerHTML = 'Видео отсутствует';
			
		});

}