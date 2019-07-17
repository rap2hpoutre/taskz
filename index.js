const ora = require("ora");
const chalk = require("chalk");

function taskz(tasks) {
  return {
    run: async (level = 0, ctx = {}) => {
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        const counter = chalk.dim.grey(` [${i + 1}/${tasks.length}]`);
        const spinner = ora({
          text: `${t.text}${counter}`,
          indent: level
        }).start();
        ctx.text = val => {
          spinner.text = `${val}${counter}`;
        }
        if (t.tasks) {
          // Subtasks
          spinner.stopAndPersist({ symbol: "→" });
          await t.tasks.run(level + 1, ctx);
        } else {
          // Run one task
          try {
            await t.task(ctx);
            spinner.stopAndPersist({ symbol: chalk.green("✔") });
          } catch (e) {
            spinner.stopAndPersist({
              symbol: chalk.red("✖"),
              text: `${e.message}${counter}`
            });
            if (t.stopOnError) {
              break;
            }
          }
        }
      }
    }
  };
}

module.exports = taskz;
