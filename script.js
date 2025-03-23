



//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  episodeList.forEach((episode) => {
    
    const card = document.createElement("div");
    card.className = "episode-card";

    const episodeName = document.createElement("h3");
    const episodeCode = document.createElement("p");
    const episodeImage = document.createElement("img");
    const episodeText = document.createElement("div");

    episodeName.textContent = episode.name;
    episodeCode.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`; // `S ${0,episode.number} E ${0,episode.season}`; //episode.id;
    episodeImage.src = episode.image.medium;
    episodeText.innerHTML = episode.summary;

    rootElem.appendChild(episodeName);
    rootElem.appendChild(episodeCode);
    rootElem.appendChild(episodeImage);
    rootElem.appendChild(episodeText);

    card.appendChild(episodeName);
    card.appendChild(episodeCode);
    card.appendChild(episodeImage);
    card.appendChild(episodeText);

    rootElem.appendChild(card);
  });
}





window.onload = setup;
