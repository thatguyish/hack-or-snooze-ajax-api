"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="story${story.storyId}">
        <label id="star-checkbox">
          <input type="checkbox" id="favorite-check"/>
          <span id="favorite-star" class="large-star">&#9734;</span>
        </label>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);

    $(`#story${story.storyId} input`).on('click', async function () {
      if ($(`#story${story.storyId} input`).is(":checked")) {
        $(`#story${story.storyId} span`).toggleClass('large-star');
        $(`#story${story.storyId} span`).html('&#11088');
        currentUser.addToFavorites(story);
        console.log(currentUser.favorites);
        await axios.post(`https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${story.storyId}?`,{"token": currentUser.loginToken});
      } else {
        $(`#story${story.storyId} span`).toggleClass('large-star');
        $(`#story${story.storyId} span`).html('&#9734');
        await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}/favorites/${story.storyId}?`,{data:{"token": currentUser.loginToken}});
      }
    });
  }

  $allStoriesList.show();
}
async function submitStoryForm() {
  let story = { author: $('#story-author').val(), title: $('#story-title').val(), url: $('#story-url').val() }
  await storyList.addStory(currentUser, story);

}
$('#story-submit-button').on('click', submitStoryForm)
