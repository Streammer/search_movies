const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
function apiSearch(e){
		e.preventDefault();
		const searchText = document.querySelector('.form-controll').value,
		server = 'https://api.themoviedb.org/3/search/multi?api_key=9d772a36570d0f5715543804d396c7a3&language=ru&query='+ searchText;
		movie.innerHTML = 'Загрузка';
		requestApi(server)
		.then((result)=>{
			const output = JSON.parse(result);
			console.log(output);
			let inner = '';
			output.results.forEach(item => {
			let nameItem = item.name || item.title;
			inner += `<div class = "col-3">${nameItem}</div>`;
		});
		movie.innerHTML = inner;
		})
		.catch((reason) =>{
			movie.innerHTML = 'Упс, что-то пошло не так';
			console.log('errpr: ' + reason.status);
		})
		;
};

searchForm.addEventListener('submit', apiSearch);
function requestApi(url){
	return new Promise ((resolve, reject) =>{
		const request = new XMLHttpRequest;
		request.open('GET', url);
		console.log('error')
		request.addEventListener('load', () =>{
			if(request.status !== 200){
				reject({status: request.status});
				return;
			}
			resolve(request.response);
		});
		request.addEventListener('error', () =>{
			reject({status: request.status});
		});
		request.send();
	});
};


