var url = document.URL;
if (url.indexOf('helpdesk.compassluxe') != -1) {
	if ((url.toLowerCase().indexOf('.txt') != -1) || (url.toLowerCase().indexOf('.log') != -1) || (url.toLowerCase().indexOf('.mp4') != -1) || (url.toLowerCase().indexOf('.jpg') != -1)|| (url.toLowerCase().indexOf('.png') != -1)){
		downloadURI(url)
		window.close();
	}
	
	if (url.indexOf('/browse/') != -1) {
		//отслеживание разворачивания ветки
		var lastCommentId = document.getElementById('issue_actions_container').children[document.getElementById('issue_actions_container').children.length - 1].getAttribute('id');
		var target = document.getElementById('issue-content');
		const config = {
			attributes: true,
		  characterData: true,
		  childList: true,
		  subtree: true,
		};

		// Колбэк-функция при срабатывании мутации
		const callback = function(mutationsList, observer) {
			let curCommentId = document.getElementById('issue_actions_container').children[document.getElementById('issue_actions_container').children.length - 1].getAttribute('id');
			for (let mutation of mutationsList) {
				if (mutation.type === 'attributes' && lastCommentId != curCommentId) {
					addButtons();
				}					
			}
			addButtons();
		};

		// Создаём экземпляр наблюдателя с указанной функцией колбэка
		const observer = new MutationObserver(callback);

		// Начинаем наблюдение за настроенными изменениями целевого элемента
		observer.observe(target, config);
		//--------------------------------------------------------------------
		
		addButtons();
	}	
}

function addButtons() {
	issue_actions_container = document.getElementById('issue_actions_container').children;
	for (let i = 0; i < issue_actions_container.length; i++) {
		if (issue_actions_container[i].className != 'message-container' && issue_actions_container[i].firstElementChild.firstElementChild.lastElementChild.innerHTML.indexOf('added a comment') != -1) {
			let parent = issue_actions_container[i].firstElementChild.firstElementChild.children[1];
			addButton(parent, issue_actions_container[i].firstElementChild.lastElementChild);
		}
	}
}

function addButton(addTo, commentBody) {
	if ((addTo.innerHTML.indexOf('<input type="image" src="https://i.ibb.co/RByGN1X/download.png"') == -1)) {
		let a = document.createElement("a");
		let share = document.createElement("input");
		share.type = "image";
		share.src = "https://i.ibb.co/RByGN1X/download.png";
		share.width = "20";
		share.height = "20";
		share.onclick = function () {
		  getAttachments(commentBody);
		};
		a.appendChild(share);
		addTo.insertBefore(a, addTo.firstElementChild)
	}
}

function getAttachments(commentBody) {
	for (let i = 0; i < commentBody.getElementsByTagName("p").length; i++) {
		for (let j = 0; j < commentBody.getElementsByTagName("p")[i].getElementsByClassName("nobr").length; j++) {
			downloadURI(commentBody.getElementsByTagName("p")[i].getElementsByClassName("nobr")[j].innerHTML.split('"')[1]);
		}
		//неоткрываемые картинки
		iwrap = commentBody.getElementsByTagName("p")[i].getElementsByClassName("image-wrap");
		for (let j = 0; j < iwrap.length; j++) {
			if (iwrap[j].innerHTML.indexOf('href') == -1) {
				downloadURI(iwrap[j].innerHTML.split('"')[1]);
			} else {
				downloadURI(iwrap[j].innerHTML.split('"')[3]);
			}
		}
	}
}

function downloadURI(uri) {
  var link = document.createElement('a');
			link.setAttribute('href', uri);
			link.setAttribute('download','download');
			onload=link.click();
	delete link;
}