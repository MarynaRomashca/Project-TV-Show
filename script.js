//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  state.episodes = allEpisodes;
  makePageForEpisodes(allEpisodes);
}
const state = {
  episodes: [],
  searchTerm: "",
};

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    const episodeName = document.createElement("h3");
    const episodeCode = document.createElement("p");
    const episodeImage = document.createElement("img");
    const episodeText = document.createElement("div");

    episodeName.textContent = episode.name;
    episodeCode.textContent = `S${String(episode.season).padStart(
      2,
      "0"
    )}E${String(episode.number).padStart(2, "0")}`; // `S ${0,episode.number} E ${0,episode.season}`; //episode.id;
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

const input = document.querySelector("input");

input.addEventListener("keyup", function () {
  state.searchTerm = input.value.toLowerCase();
  const filteredEpisodes = state.episodes.filter(function (episode) {
    return (
      episode.name.toLowerCase().includes(state.searchTerm) ||
      episode.summary.toLowerCase().includes(state.searchTerm)
    );
  });

  const searchMessage = document.getElementById("search-message");
  if (state.searchTerm === "") {
    searchMessage.textContent = "";
  } else {
    searchMessage.textContent = `Displaying ${filteredEpisodes.length}/${state.episodes.length} episodes.`;
  }

  makePageForEpisodes(filteredEpisodes);
});
window.onload = setup;
