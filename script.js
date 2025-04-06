//You can edit ALL of the code here

const state = {
  episodes: [],
  searchTerm: "",
};

const endpoint = "https://api.tvmaze.com/shows/82/episodes";

const fetchFilms = async () => {
  const response = await fetch(endpoint);
  return await response.json();

};

async function setup() {
  const allEpisodes = await fetchFilms(); // 🔄 заменяем getAllEpisodes()
  state.episodes = allEpisodes;
  makePageForEpisodes(allEpisodes);
  populateEpisodeSelect(allEpisodes);
}

setup();

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

// Populate the select dropdown with episodes
function populateEpisodeSelect(episodes) {
  const episodeList = document.getElementById("episodes");

  episodeList.innerHTML = "";

  if (episodes.length === 0) {
    console.log("No episodes available to populate the select.");
    return;
  }

  episodes.forEach((episode) => {
    let option = document.createElement("option");

    option.value = episode.id; // Use episode ID as the value
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")} - ${episode.name}`; // Use episode name as the text for the option
    episodeList.appendChild(option);
  });

  episodeList.removeEventListener("change", handleSelect); // clean preview event
  episodeList.addEventListener("change", handleSelect); // listen for a change event, not input
}

function allEpisodesButton() {
  const allEpButton = document.createElement("button");
  allEpButton.textContent = "All Episodes";
  allEpButton.id = "all-episodes-button";
  allEpButton.addEventListener("click", () => {
    makePageForEpisodes(state.episodes);
    allEpButton.remove();
  });
  rootElem.appendChild(allEpButton);
}

// Handle the selection of an episode from the dropdown
function handleSelect(ev) {
  let select = ev.target;

  // Find the selected episode by its ID and log the details
  const selectedEpisode = state.episodes.find(
    (episode) => episode.id === parseInt(select.value)
  );

  if (selectedEpisode) {
    makePageForEpisodes([selectedEpisode]);
    allEpisodesButton();
  }

}

window.onload = setup;
