const taskz = require("../index.js");
const kleur = require('kleur')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const tasks = taskz([
  {
    text: "first task",
    task: async () => {
      await sleep(2000);
    }
  },
  {
    text: "this task will fail and continue",
    task: async () => {
      await sleep(2500);
      throw new Error("this task failed");
    }
  },
  {
    text: "start running sub tasks",
    tasks: taskz([
      {
        text: "my subtask 1",
        task: async () => {
          await sleep(1000);
        }
      },
      {
        text: "",
        task: async (ctx, setText) => {
          const frames = ["cyan", "red", "magenta"];
          for (let i in frames) {
            const colour = frames[i]

            setText(kleur[colour](`my subtask 2 now in ${colour}`));
            await sleep(750);
          }
          setText("my subtask 2 done");
        }
      }
    ])
  },
  {
    text: "this task will fail and stop",
    stopOnError: true,
    task: async () => {
      await sleep(2500);
      throw new Error("this task failed and stopped the whole process");
    }
  },
  {
    text: "this one will never be displayed",
    task: async () => {
      await sleep(2000);
    }
  }
]);

tasks.run();
