var forum = document.getElementById("ctl00_cphRoblox_PostView1_ctl00_PostList");
var preview = document.getElementById("ctl00_cphRoblox_Createeditpost1_PostForm_PreviewBody");

if (forum) {
	/*
	var posts = document.getElementsByClassName("normalTextSmall notranslate linkify");
	for (var i = 0; i < posts.length; i++) {
		var pre = document.createElement("PRE");
		pre.innerHTML = posts[i].innerHTML.split("<br>").join("\n");
		posts[i].innerHTML = "";
		posts[i].appendChild(pre);
		
		renderCodeInElement(pre);
		renderMathInElement(pre, {
			delimiters: [
				{left: "$$", right: "$$", display: false},
				{left: "\\(", right: "\\)", display: false},
				{left: "\\[", right: "\\]", display: true}
			]
		});
	}
	*/
	
	forum.innerHTML = forum.innerHTML.split("<br>").join("\n");
	renderCodeInElement(forum);
	renderMathInElement(forum, {
		delimiters: [
			{left: "$$", right: "$$", display: false},
			{left: "\\(", right: "\\)", display: false},
			{left: "\\[", right: "\\]", display: true}
		]
	});
}


if (preview) {
	var pre = document.createElement("PRE");
	pre.innerHTML = preview.innerHTML.split("<br>").join("\n");
	preview.innerHTML = "";
	preview.appendChild(pre); 

	renderCodeInElement(pre);
	renderMathInElement(pre, {
		delimiters: [
			{left: "$$", right: "$$", display: false},
			{left: "\\(", right: "\\)", display: false},
			{left: "\\[", right: "\\]", display: true}
		]
	});
}