const core = require("@actions/core");
const github = require("@actions/github");

const helpers = require("./src/helpers");

async function comment() {
  try {
    const githubToken = core.getInput("github_token");
    const octokit = github.getOctokit(githubToken);
    const config = helpers.getActionConfiguration();
    const comment = await helpers.findComment(octokit, config);
    if (comment.id === -1) {
      await helpers.createComment(octokit, config);
    } else {
      await helpers.updateComment(octokit, config, comment);
    }
  } catch (error) {
    core.error(error);
    throw error;
  }
}

(async () => {
  try {
    await comment();
  } catch (error) {
    core.setFailed(error.message);
  }
})();
