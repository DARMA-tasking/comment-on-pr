const helpers = require("../src/helpers");

describe("preparePipelineComment function", () => {
  it("prepares pipeline comment based on pipeline name and comment content", () => {
    const commentSubtitle = "PR tests (clang-5.0, ubuntu, mpich)";
    const commentContent = `Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36432&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)`;

    const expected = `**PR tests (clang-5.0, ubuntu, mpich)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36432&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---`;

    expect(
      helpers.preparePipelineComment(commentSubtitle, commentContent)
    ).toEqual(expected);
  });
});

describe("prepareTitledComment function", () => {
  it("prepares correctly comment with the main title", () => {
    const commentSubtitle = "PR tests (gcc-5, ubuntu, mpich)";
    const commentContent = `Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36429&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)`;

    const expected = `## Pipelines results

**PR tests (gcc-5, ubuntu, mpich)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36429&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---`;

    expect(
      helpers.prepareTitledComment(commentSubtitle, commentContent)
    ).toEqual(expected);
  });
});

describe("findResult function", () => {
  it("finds beginning and the end of given result inside whole comment", () => {
    const comment = `## Pipelines results

**PR tests (gcc-10, ubuntu, openmpi, no LB)**

---`;

    const commentSubtitle = "PR tests (gcc-10, ubuntu, openmpi, no LB)";
    const expected = { commentStart: 22, commentEnd: 72 };

    expect(helpers.findResult(comment, commentSubtitle)).toEqual(expected);
  });
});

describe("reworkComment function", () => {
  it("changes given pipeline section of existing comment with new content", () => {
    const body = `## Pipelines results

**PR tests (gcc-7, ubuntu, mpich, trace runtime, LB)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36434&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---

**PR tests (gcc-6, ubuntu, mpich)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36433&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---`;

    const commentSubtitle =
      "PR tests (gcc-7, ubuntu, mpich, trace runtime, LB)";
    const commentContent = `Build for 25c7cac9875f864de14feb37a42a929be3799355

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36040&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)`;
    const expected = `## Pipelines results

**PR tests (gcc-7, ubuntu, mpich, trace runtime, LB)**

Build for 25c7cac9875f864de14feb37a42a929be3799355

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36040&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---

**PR tests (gcc-6, ubuntu, mpich)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36433&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---`;

    expect(
      helpers.reworkComment(body, commentSubtitle, commentContent)
    ).toEqual(expected);
  });

  it("adds given pipeline results at the end of comment, if there is no existing results for that pipeline", () => {
    const body = `## Pipelines results

**PR tests (clang-3.9, ubuntu, mpich)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36430&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---

**PR tests (clang-9, ubuntu, mpich)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36440&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---`;

    const commentSubtitle = "PR tests (nvidia cuda 10.1, ubuntu, mpich)";
    const commentContent = `Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36437&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)`;

    const expected = `## Pipelines results

**PR tests (clang-3.9, ubuntu, mpich)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36430&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---

**PR tests (clang-9, ubuntu, mpich)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36440&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---

**PR tests (nvidia cuda 10.1, ubuntu, mpich)**

Build for 59f440d3e4cc006d0faa45da4ca5ae21c4464c19

\`\`\`
Compilation - successful

Testing - passed
\`\`\`

[Build log](https://dev.azure.com/DARMA-tasking/DARMA/_build/results?buildId=36437&view=logs&j=3dc8fd7e-4368-5a92-293e-d53cefc8c4b3&t=28db5144-7e5d-5c90-2820-8676d630d9d2)

---`;

    expect(
      helpers.reworkComment(body, commentSubtitle, commentContent)
    ).toEqual(expected);
  });
});
