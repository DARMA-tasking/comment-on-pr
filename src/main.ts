import * as core from '@actions/core'
import {getOctokit} from '@actions/github'
import type {GitHub} from '@actions/github/lib/utils'

type Octokit = InstanceType<typeof GitHub>

interface ActionConfig {
  owner: string
  repo: string
  issue_number: number
  commitSha: string
  commentTitle: string
  commentContent: string
}

commentPr()

async function commentPr(): Promise<void> {
  const githubToken = core.getInput('github_token')
  const octokit = getOctokit(githubToken)

  const config = getActionConfiguration()

  const commentId = await findComment(octokit, config)
  if (commentId === -1) {
    await createComment(octokit, config)
  } else {
    await updateComment(octokit, config, commentId)
  }
}

function getActionConfiguration(): ActionConfig {
  return {
    owner: core.getInput('repo_owner'),
    repo: core.getInput('repo_name'),
    issue_number: parseInt(core.getInput('pr_number')),
    commitSha: core.getInput('commit_sha'),
    commentTitle: core.getInput('comment_title'),
    commentContent: core.getInput('comment_content')
  }
}

async function findComment(
  octokit: Octokit,
  config: ActionConfig
): Promise<number> {
  const {owner, repo, issue_number} = config
  for await (const {data: comments} of octokit.paginate.iterator(
    octokit.issues.listComments,
    {owner, repo, issue_number}
  )) {
    const foundComment = comments.find(comment =>
      comment.body?.startsWith(prepareCommentTitle(config.commentTitle))
    )

    if (foundComment) {
      return foundComment.id
    }
  }

  return -1
}

async function createComment(
  octokit: Octokit,
  config: ActionConfig
): Promise<void> {
  const {owner, repo, issue_number} = config
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number,
    body: getCommentBody(config)
  })
}

async function updateComment(
  octokit: Octokit,
  config: ActionConfig,
  commentId: number
): Promise<void> {
  const {owner, repo} = config
  await octokit.issues.updateComment({
    owner,
    repo,
    comment_id: commentId,
    body: getCommentBody(config)
  })
}

function getCommentBody(config: ActionConfig): string {
  return `${prepareCommentTitle(config.commentTitle)}

${prepareCommitSha(config.commitSha)}

${prepareCommentContent(config.commentContent)}`
}

function prepareCommentTitle(rawCommentTitle: string): string {
  return `**${rawCommentTitle}**`
}

function prepareCommitSha(rawSha: string): string {
  return `Build for ${rawSha}`
}

function prepareCommentContent(rawCommentContent: string): string {
  return `\`\`\`
${rawCommentContent}
\`\`\``
}
