import { getGitHubAccessToken } from './auth/github.js';
import { loadLocalFile, loadFileFromGitHub } from './yaml/load.js'
import { applyGCIaC } from './gciac/apply.js';

let githubAccessToken = null; // GitHub Access Token

/* Menu */
let loginSession = document.getElementById('login_session');
let githubMenu = document.getElementById('github_menu');
let localFileMenu = document.getElementById('local_file_menu');

/* ==============================
| Login session
==============================*/
let uploadLocalFileButton = document.getElementById('upload_local_file');
let loginGitHubButton = document.getElementById('login_github');

/* When the user press the "Upload local file" button. */
if (uploadLocalFileButton != null) {
    uploadLocalFileButton.addEventListener('click', async function() {
        /* Transision if the login is successful */
        loginSession.style.display = 'none';
        localFileMenu.style.display = 'block';
    });
}
else {
    console.error('\"Upload local file\" button counld not be found.')
}

/* When the user press the "Login with GitHub" button. */
if (loginGitHubButton != null) {
    loginGitHubButton.addEventListener('click', async function() {

        githubAccessToken = await getGitHubAccessToken();

        /* Transision if the login is successful */
        loginSession.style.display = 'none';
        githubMenu.style.display = 'block';
    });
}
else {
    console.error('\"Login with GitHub\" button counld not be found.')
}

/*==============================
| Local file menu
==============================*/
let applyOnLocalFileMenuButton = document.getElementById('apply_on_local_file_menu');

if (applyOnLocalFileMenuButton != null) {
    applyOnLocalFileMenuButton.addEventListener('click', async function() {

        event.preventDefault();

        let localFileInput = document.getElementById('local_file');
        let file = localFileInput.files[0];

        let jsonData = await loadLocalFile(file);

        await applyGCIaC(jsonData);
    });
}

/*==============================
| GitHub menu
==============================*/
let applyOnGitHubMenuButton = document.getElementById('apply_on_github_menu');

if (applyOnGitHubMenuButton != null) {
    applyOnGitHubMenuButton.addEventListener('click', async function() {
        /* Prevent page transition
            If there is not `event.preventDefault()`, the page transition occured because of `submit` form.
        */
        event.preventDefault();

        let githubOrganizationName = document.getElementById('github_organization_name').value;
        let githubRepositoryName = document.getElementById('github_repository_name').value;

        let jsonData = await loadFileFromGitHub(githubAccessToken, githubOrganizationName, githubRepositoryName);

        await applyGCIaC(jsonData);
    });
}
