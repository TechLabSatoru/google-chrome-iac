import yaml from 'js-yaml';



export async function loadLocalFile(file) {

    let fileContent = await readFile(file);

    let jsonData = yaml.load(fileContent);

    return jsonData;
}

async function readFile(file) {

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        reader.onerror = function(event) {
            reject(new Error("Failed to read file"));
        };
        reader.readAsText(file);
    });

}

export async function loadFileFromGitHub(token, githubOrganizationName, githubRepositoryName) {

    let response = await fetch(`https://api.github.com/repos/${githubOrganizationName}/${githubRepositoryName}/contents/gciac.yaml`, {
        headers: {
            Authorization: `token ${token}`,
            'User-Agent': 'Chrome Extension'
        }
    });

    let data = await response.json();

    let jsonData = yaml.load(decodeURIComponent(escape(atob(data.content))));

    return jsonData;
}
