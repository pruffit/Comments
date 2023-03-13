(function() {
	let comments = [];

	const loadComments = () => {
		if(localStorage.getItem('comments')) comments = JSON.parse(localStorage.getItem('comments'));
		showComments();
	}

	const showComments = () => {
		let commentField = document.getElementById('comment-field');
		let out = '';
		let i = 0;
		comments.forEach( item => {
			out += `
			<div class="comment__item">
				<div class="date">
					${timeConverter(item.time)}
				</div>
				<div class="name">
					${item.name}
				</div>
				<div class="text">
					${item.text}
				</div>
				<div class="control">
					<a href="#" class='link likeBtn ${item.liked ? 'not' : ''}' data-id='${i}'>
						<svg>
							<use xlink:href="images/icons/sprite.svg#notlike"></use>
						</svg>
					</a>
					<a href="#" class='link unLikeBtn ${item.liked ? '' : 'not'}' data-id='${i}'>
						<svg>
							<use xlink:href="images/icons/sprite.svg#like"></use>
						</svg>
					</a>
					<a href="#" class='link delete' data-id='${i++}'>
						<svg>
							<use xlink:href="images/icons/sprite.svg#trash"></use>
						</svg>
					</a>
				</div>
			</div>
			`;
		});
		commentField.innerHTML = out;

		const deleteButtons = document.querySelectorAll('.delete');
		for (let i = 0; i < deleteButtons.length; i++) {
			deleteButtons[i].addEventListener('click', e => {
				e.preventDefault;
				const This = e.currentTarget;
				console.log(This);
				let elementId = This.dataset.id;
				removeComment(elementId);
			});
		}

		const likeButtons = document.querySelectorAll('.likeBtn');
		for (let i = 0; i < likeButtons.length; i++) {
			likeButtons[i].addEventListener('click', e => {
				e.preventDefault;
				const This = e.currentTarget;
				let elementId = This.dataset.id;
				comments[elementId].liked = true;
				saveComments();
				loadComments();
			});
		}

		const unLikeButtons = document.querySelectorAll('.unLikeBtn');
		for (let i = 0; i < unLikeButtons.length; i++) {
			unLikeButtons[i].addEventListener('click', e => {
				e.preventDefault;
				const This = e.currentTarget;
				let elementId = This.dataset.id;
				comments[elementId].liked = false;
				saveComments();
				loadComments();
			});
		}
	}

	const timeConverter = (UNIX_timestamp) => {
		const a = new Date(UNIX_timestamp * 1000);
		const b = new Date(Math.floor(Date.now()));
		const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
		const year = a.getUTCFullYear();
		const yearNow = b.getUTCFullYear()
		const month = months[a.getMonth()];
		const monthNow = months[b.getMonth()];
		const date = a.getDate();
		const dateNow = b.getDate();
		const hour = a.getHours();
		const min = a.getMinutes();
		console.log(+date);
		const time = date + ' ' + month + ' ' + year;
		if((date === dateNow) && (month === monthNow) && (year === yearNow)) {
			return `сегодня, ${hour}:${min}`;
		} else if(((+date + 1) === +dateNow) && (month === monthNow) && (year === yearNow)) {
			return `вчера, ${hour}:${min}`;
		} else {
			return time;
		}
	}

	const saveComments = () => {
		localStorage.setItem('comments', JSON.stringify(comments));
	}

	const removeComment = (elementId) => {
		comments.splice(elementId, 1);
		saveComments();
		loadComments();
	}

	loadComments();

	document.getElementById('add').onclick = e => {
		e.preventDefault;
		let commentName = document.getElementById('name');
		let commentText = document.getElementById('text');
		let commentDate = document.getElementById('date');
		let newDate = new Date(commentDate.value)
		let comment = {
			name: commentName.value,
			text: commentText.value,
			time: commentDate.value ? Math.floor(Date.parse(newDate)/1000) : Math.floor(Date.now()/1000),
			liked: false
		}
		commentName.value = '';
		commentText.value = '';
		commentDate.value = '';
		comments.push(comment);
		saveComments();
		showComments();
	}
})()