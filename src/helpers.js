const core = require("@actions/core");

function getActionConfiguration() {
  return {
    owner: core.getInput("repo_owner"),
    repo: core.getInput("repo_name"),
    issue_number: parseInt(core.getInput("pr_number")),
    commentSubtitle: core.getInput("comment_title"),
    commentContent: core.getInput("comment_content"),
  };
}

async function findComment(octokit, config) {
  const { owner, repo, issue_number } = config;
  for await (const { data: comments } of octokit.paginate.iterator(
    octokit.rest.issues.listComments,
    { owner, repo, issue_number }
  )) {
    const foundComment = comments.find((comment) =>
      comment.body.startsWith(prepareCommentTitle())
    );

    if (foundComment) {
      return {
        id: foundComment.id,
        body: foundComment.body,
      };
    }
  }

  return {
    id: -1,
    body: "",
  };
}

async function createComment(octokit, config) {
  const { owner, repo, issue_number, commentSubtitle, commentContent } = config;
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number,
    body: prepareTitledComment(commentSubtitle, commentContent),
  });
}

function prepareTitledComment(commentSubtitle, commentContent) {
  const body = `${prepareCommentTitle()}

${preparePipelineComment(commentSubtitle, commentContent)}`;

  return body;
}

function prepareCommentTitle() {
  return "## Pipelines results";
}

async function updateComment(octokit, comment, config) {
  const { owner, repo, commentSubtitle, commentContent } = config;
  const body = comment.body;
  const commentBody = reworkComment(body, commentSubtitle, commentContent);
  await octokit.rest.issues.updateComment({
    owner,
    repo,
    comment_id: comment.id,
    body: commentBody,
  });
}

function findResult(comment, commentSubtitle) {
  const commentStart = comment.indexOf(`**${commentSubtitle}`);
  const separator = "---";
  const commentEnd =
    comment.indexOf(separator, commentStart) + separator.length;

  return { commentStart, commentEnd };
}

function preparePipelineComment(rawCommentSubtitle, commentContent) {
  const comment = `${prepareCommentSubtitle(rawCommentSubtitle)}

${commentContent}

---`;

  return comment;
}

function prepareCommentSubtitle(rawCommentSubtitle) {
  return `**${rawCommentSubtitle}**`;
}

function reworkComment(body, commentSubtitle, commentContent) {
  const pipelineComment = preparePipelineComment(
    commentSubtitle,
    commentContent
  );

  const { commentStart, commentEnd } = findResult(body, commentSubtitle);

  if (commentStart === -1) {
    return `${body}

${pipelineComment}`;
  }

  return `${body.substr(0, commentStart)}${pipelineComment}${body.substr(
    commentEnd
  )}`;
}

exports.createComment = createComment;
exports.findComment = findComment;
exports.findResult = findResult;
exports.getActionConfiguration = getActionConfiguration;
exports.preparePipelineComment = preparePipelineComment;
exports.prepareTitledComment = prepareTitledComment;
exports.updateComment = updateComment;
exports.reworkComment = reworkComment;
