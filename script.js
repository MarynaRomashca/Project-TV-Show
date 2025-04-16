//You can edit ALL of the code here

const state = {
  shows: [],
  episodes: [],
  searchTerm: "",
  cache: {}, // to store feched episodes by show id
};
let show 

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
  //if (showId === "") return state.cache;
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
  //showsList.innerHTML =
    //"<option value='' disabled selected>Select a show</option>";

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
  //input.value = ""
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
  
  if (event.target.value==="") return makePageForShows(state.shows);
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
    searchMessage.textContent = `Displaying 1/${state.episodes.length} episodes.`;
    input.value = "";
  }
});

input.addEventListener("input", () => {
  const searchTerm = input.value.toLowerCase();

  // "Select all shows"
  if (showsList.value === "") {
    const filteredShows = state.shows.filter(
      (show) =>
        show.name.toLowerCase().includes(searchTerm) ||
        (show.summary && show.summary.toLowerCase().includes(searchTerm))
    );

    makePageForShows(filteredShows);
    searchMessage.textContent = `Displaying ${filteredShows.length}/${state.shows.length} shows.`;
    
  } else {
    // Select one show
    const selectedShowId = parseInt(showsList.value);
    const currentEpisodes = state.cache[selectedShowId] || [];

    const filteredEpisodes = currentEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
    );

    makePageForEpisodes(filteredEpisodes);
    searchMessage.textContent = `Displaying ${filteredEpisodes.length}/${currentEpisodes.length} episodes.`;
    episodesList.value = ""
   
  }
});

function makePageForShows(shows) {
  rootElem.innerHTML = "";

  shows.forEach((show) => {
    const card = document.createElement("div");
    card.className = "show-card";

    const showName = document.createElement("h3");
    const showImage = document.createElement("img");
    const showSummary = document.createElement("p");
    const showRating = document.createElement("p");
    const showGenre = document.createElement("p");
    const showStatus = document.createElement("p");
    const showRuntime = document.createElement("p");
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper"
    const extraInfo = document.createElement("div");
    extraInfo.className = "extraInfo"
    showName.textContent = `${show.name}`;
    

    showImage.src = show.image.medium;
    showSummary.innerHTML = show.summary;
    showStatus.innerHTML = `Status: ${show.status}`;
    showGenre.innerHTML = `Genres: ${show.genres}`;
    showRating.innerHTML = `Rated: ${show.rating.average}`;
    showRuntime.innerHTML = `Runtime: ${show.runtime}`;
    
    card.appendChild(showName); // appended name, image and summary to the card
    card.appendChild(wrapper);
    wrapper.appendChild(showImage);
    wrapper.appendChild(showSummary);
    wrapper.appendChild(extraInfo);
    extraInfo.appendChild(showRating);
    extraInfo.appendChild(showGenre);
    extraInfo.appendChild(showStatus);
    extraInfo.appendChild(showRuntime);
    

    rootElem.appendChild(card);
  });
}

const setup = async () => {
  const shows = await fetchShows();
  state.shows = shows.sort((a, b) => a.name.localeCompare(b.name)); // Sort show alphabetically

  populateShowsList(state.shows);
  makePageForShows(state.shows);

};

window.onload = setup;
