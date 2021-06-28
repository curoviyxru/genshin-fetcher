const API_URL = "https://sdk-os-static.mihoyo.com/hk4e_global/mdk/launcher/api/resource?key=gcStgarh&launcher_id=10";

function buildFile(latest, cell) {
    let pName = document.createElement("div");
    pName.appendChild(document.createTextNode(latest.name.length > 0 ? latest.name : "Without name"));
    if (latest.language) pName.appendChild(document.createTextNode(" / " + latest.language));
    if (latest.size) pName.appendChild(document.createTextNode(" (" + latest.size + " bytes)"));
    cell.appendChild(pName);

    if (latest.path) {
        let pURL = document.createElement("div");
        let a = document.createElement("a");
        a.href = latest.path;
        a.appendChild(document.createTextNode(latest.path));
        pURL.appendChild(a);
        cell.appendChild(pURL);
    }

    if (latest.md5) {
        let pHash = document.createElement("div");
        pHash.appendChild(document.createTextNode("MD5: " + latest.md5));
        cell.appendChild(pHash);
    }

    if (latest.entry) {
        let pEntry = document.createElement("div");
        pEntry.appendChild(document.createTextNode("Entry: " + latest.entry));
        cell.appendChild(pEntry);
    }
}

function buildGame(latest, table, gV) {
    let row = table.insertRow();
    let versionCell = row.insertCell();
    versionCell.rowSpan = latest.voice_packs.length + 1;
    versionCell.appendChild(document.createTextNode(latest.version));
    if (gV) versionCell.appendChild(document.createTextNode(" to " + gV));

    let filesCell = row.insertCell();
    buildFile(latest, filesCell);

    let recommendCell = row.insertCell();
    recommendCell.rowSpan = latest.voice_packs.length + 1;
    recommendCell.appendChild(document.createTextNode(gV ? latest.is_recommended_update ? "Yes" : "No" : "Yes"));

    latest.voice_packs.forEach((i) => {
        buildFile(i, table.insertRow().insertCell());
    });
}

function buildTable(data) {
    console.log(data);

    let table = document.getElementById("game-table");

    let latestCell = document.createElement("th");
    latestCell.colSpan = 3;
    latestCell.appendChild(document.createTextNode("Latest"));
    table.insertRow().appendChild(latestCell);
    buildGame(data.game.latest, table);

    latestCell = document.createElement("th");
    latestCell.colSpan = 3;
    latestCell.appendChild(document.createTextNode("Diffs"));
    table.insertRow().appendChild(latestCell);
    data.game.diffs.forEach((i) => {
        buildGame(i, table, data.game.latest.version);
    });

    let plTable = document.getElementById("plugins-table");

    data.plugin.plugins.forEach((i) => {
        buildFile(i, plTable.insertRow().insertCell());
    });

    let depTable = document.getElementById("deprecated-table");
    
    data.deprecated_packages.forEach((i) => {
        buildFile(i, depTable.insertRow().insertCell());
    });
}

async function loadFiles() {
    let files_response = await fetch(API_URL);

    let files_json = await files_response.json();
    
    document.body.removeChild(document.getElementById("fetching-block"));
    buildTable(files_json.data);
}

loadFiles();