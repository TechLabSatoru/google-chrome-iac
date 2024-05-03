/* Define variables for OAuth App on GitHub. */
const CLIENT_ID = '<YOUR CLIENT ID>';
const CLIENT_SECRET = '<YOUR CLIENT SECRET>';
const REDIRECT_URI = chrome.identity.getRedirectURL(); // https://developer.chrome.com/docs/extensions/reference/api/identity?hl=ja#method-getRedirectURL

/* Get access token of GitHub to request GitHub API. */
export async function getGitHubAccessToken() {

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo,user&state=1234`;

    let redirectUri = await loginGitHub(authUrl);

    const urlParams = new URLSearchParams(new URL(redirectUri).search);
    const code = urlParams.get('code');
    if (!code) {
        console.error('No code received.');
        alert('Authentication failed. Please try again.');
        return;
    }
    let response =  await fetch(`https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI
        })
    })

    let data = await response.json()

    let access_token = data.access_token

    return access_token
}

/* Login GitHub */
function loginGitHub(url) {

    return new Promise(function (resolve, reject) {
        chrome.identity.launchWebAuthFlow({
            url: url,
            interactive: true
        }, function (result) {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message))
            }
            else {
                resolve(result);
            }
        });
    });

}
