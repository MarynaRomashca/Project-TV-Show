//You can edit ALL of the code here

const state = {
  shows: [],
  episodes: [],
  searchTerm: "",
  cache: {}, // to store feched episodes by show id
};

const showEndpoint = "https://api.tvmaze.com/shows";
const episodesEndpoint = (showId) =>
  `https://api.tvmaze.com/shows/${showId}/episodes`;

const showsList = document.getElementById("shows");
const episodesList = document.getElementById("episodes"); // select element defined globally
const rootElem = document.getElementById("root");
const input = document.querySelector("input");
const searchMessage = document.getElementById("search-message");

const fetchShows = async () => {
  try {
    const response = await fetch(showEndpoint);
    if (!response.ok)
      throw new Error(`HTTP error! Status: ${response.status} `);
    return await response.json();
  } catch (error) {
    console.error("Error fetching shows:", error);
    return [];
  }
};

// fetch episodes for a given show
const fetchEpisodes = async (showId) => {
  if (state.cache[showId]) return state.cache[showId]; // Use cached data if available

  try {
    const response = await fetch(episodesEndpoint(showId));
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const episodes = await response.json();
    state.cache[showId] = episodes; // Cache the episodes
    return episodes;
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return [];
  }
};

// populate dropdown with shows
const populateShowsList = (shows) => {
  showsList.innerHTML =
    "<option value='' disabled selected>Select a show</option>";

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showsList.appendChild(option);
  });
};

// Populate the select dropdown with episodes
const populateEpisodesList = (episodes) => {
  // const episodeList = document.getElementById("episodes");  // moved up to use it globally

  episodesList.innerHTML =
    "<option value='' disabled selected>Select an episode</option>";

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id; // Use episode ID as the value
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")} - ${episode.name}`; // Use episode name as the text for the option
    episodesList.appendChild(option);
  });
};

// to display episodes
function makePageForEpisodes(episodes) {
  rootElem.innerHTML = "";

  episodes.forEach((episode) => {
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

const allEpisodesButton = () => {
  const allEpButton =
    document.getElementById("all-episodes-button") ||
    document.createElement("button");

  allEpButton.textContent = "Show all episodes";
  allEpButton.id = "all-episodes-button";
  allEpButton.onclick = () => {
    makePageForEpisodes(state.episodes);
    episodesList.selectedIndex = 0; // Reset the list to the default
    input.value = "";
    searchMessage.textContent = `Displaying ${state.episodes.length}/${state.episodes.length} episodes`;
  };
  rootElem.before(allEpButton);
};

// to handle show selection
showsList.addEventListener("change", async (event) => {
  const showId = parseInt(event.target.value);
  const episodes = await fetchEpisodes(showId);

  state.episodes = episodes;
  makePageForEpisodes(episodes);
  populateEpisodesList(episodes);
  allEpisodesButton();

  searchMessage.textContent = `Displaying ${episodes.length}/${episodes.length} episodes`;
});

// to handle episode selection
episodesList.addEventListener("change", (event) => {
  const episodeId = parseInt(event.target.value);
  const selectedEpisode = state.episodes.find((ep) => ep.id === episodeId);
  if (selectedEpisode) {
    makePageForEpisodes([selectedEpisode]);
  }
});

// to handle search
input.addEventListener("input", () => {
  const searchTerm = input.value.toLowerCase();

  const filteredEpisodes = state.episodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
  );

  searchMessage.textContent = `Displaying ${filteredEpisodes.length}/${state.episodes.length} episodes.`;
  makePageForEpisodes(filteredEpisodes);
});

const setup = async () => {
  const shows = await fetchShows();
  state.shows = shows.sort((a, b) => a.name.localeCompare(b.name)); // Sort show alphabetically

  populateShowsList(state.shows);

  showsList.selectedIndex = 1;
  showsList.dispatchEvent(new Event("change"));
};

window.onload = setup;
