const program = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const shell = require('shelljs');

let token;
program.version('1.0.0');
program.name('branch-status');
program.arguments('<token>');
program.action((arg) => {
    token = arg;
});
program.parse(process.argv);


function tokenMissingBanner() {
    console.log(chalk.red('[ERROR] Please provide your token to access YouTack!'));
    console.log('See: https://www.jetbrains.com/help/youtrack/incloud/Manage-Permanent-Token.html');
    console.log(`Example: ${program.name()} perm:AMGuaGHuTGlua593.UMAtMTY2MA==.hkjh123123JJLKjl`);
    process.exit(255);
}

function tryReadFromFile() {
    return fs.readFileSync('.token', { encoding: 'utf8' });
}

if (token === undefined) {
    try {
        token = tryReadFromFile();
    } catch (e) {
        tokenMissingBanner();
        console.log(chalk.red('[ERROR] Failed to read token from file .token'));
        process.exit(255);
    }
}

const {code, stdout} = shell.exec('git branch -r --sort=committerdate', { silent: true, fatal: true });
if(code !== 0) {
    console.log(chalk.red('[ERROR] Failed to run git branch'));
}


console.log(gitBranchOutput);


// ISSUES=($( | grep -i -o 'JPF-[0-9]\+'))
// ACCESS_TOKEN=$1
// API_URL="https://youtrack.jetbrains.com/api"
//
// # Convert epoch millis to readable date yyyy-MM-dd
// function toHumanReadableDate() {
//     if [ "$1" == "null" ]; then
//     echo "----------"
// else
//     date -r "$(($1 / 1000))" +'%Y-%m-%d'
//     fi
// }
//
// # Perform GET-request to the specified URL
// function doGetRequest() {
//     curl -s -X GET \
//     -H "Authorization:Bearer $ACCESS_TOKEN" \
//     -H "Accept:application/json" \
//     -H "Content-Type:application/json" \
//     -H "Cache-Control:no-cache" \
//     "$1"
// }
//
// function formatString() {
//     printf '%-20s' "$1"
// }
//
// echo "Fetching YT issue statuses for ${#ISSUES[@]} branches..."
//
// for issueId in "${ISSUES[@]}"; do
//     URL="$API_URL/issues/${issueId}?fields=summary,resolved,customFields(id,projectCustomField(field(name)),value(name))"
//
//     FIELD_VALUES=$(doGetRequest "$URL")
// summary=$(echo "$FIELD_VALUES" | jq '.summary' | tr -d '\"')
// resolvedEpoch=$(echo "$FIELD_VALUES" | jq '.resolved')
// resolvedDate=$(toHumanReadableDate "$resolvedEpoch")
// state=$(echo "$FIELD_VALUES" | jq '.customFields[] | select (.id == "123-1006") | .value.name' | tr -d '\"')
// stateFormatted=$(formatString "$state")
//
// echo -e "[$issueId]\tResolved: $resolvedDate\tState: $stateFormatted Summary: $summary"
// done
