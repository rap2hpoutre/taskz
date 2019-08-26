const taskz = require("../index.js");

test("taskz runs its 3 tasks", async () => {
  let counter = 0;
  const tasks = taskz(
    [1, 2, 3].map(i => ({
      text: `test ${i}`,
      task: () => ++counter
    }))
  );
  await tasks.run();
  expect(counter).toBe(3);
});

test("stops on fail", async () => {
  let counter = 0;
  const tasks = taskz([
    { text: "test 1", task: () => ++counter },
    {
      text: "test 2", 
      stopOnError: true,
      task: () => {
        throw new Error("test 2 fails");
      }
    },
    { text: "test 3",  task: () => ++counter }
  ]);
  await tasks.run();
  expect(counter).toBe(1);
});
