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
const rootElem = document.getElementById("root");
const input = document.querySelector("input");
const searchMessage = document.getElementById("search-message");

function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    const episodeName = document.createElement("h3");
    const episodeImage = document.createElement("img");
    const episodeSummary = document.createElement("p");

    episodeName.textContent = `${episode.name} - S${String(
      episode.season
    ).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;

    episodeImage.src = episode.image.medium;
    episodeSummary.innerHTML = episode.summary;

    card.appendChild(episodeName); // appended name, image and summary to the card
    card.appendChild(episodeImage);
    card.appendChild(episodeSummary);

    rootElem.appendChild(card);
  });
}

input.addEventListener("keyup", function () {
  state.searchTerm = input.value.toLowerCase();
  const filteredEpisodes = state.episodes.filter(function (episode) {
    return (
      episode.name.toLowerCase().includes(state.searchTerm) ||
      episode.summary.toLowerCase().includes(state.searchTerm)
    );
  });

  if (state.searchTerm === "") {
    searchMessage.textContent = "";
  } else {
    searchMessage.textContent = `Displaying ${filteredEpisodes.length}/${state.episodes.length} episodes.`;
  }

  makePageForEpisodes(filteredEpisodes);
});
window.onload = setup;
