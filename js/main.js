"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");
  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
  if (currentUser) $('#nav-favorite').toggleClass('hidden');
  $('#nav-favorite').on('click',function(){
    $allStoriesList.empty();
    for(let story of currentUser.favorites){
      let newStory = generateStoryMarkup(story);
      $allStoriesList.append(newStory);
    }
    $('li').each(function(){
      let stringId = this.id.toString().substring(5);
      currentUser.favorites.map(function(v){
        if(v.storyId.toString()==stringId){
          $(`#story${v.storyId} input`).prop('checked',true);
          $(`#story${v.storyId} span`).toggleClass('large-star');
          $(`#story${v.storyId} span`).html('&#11088');
        }
      })
    })
  })
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
