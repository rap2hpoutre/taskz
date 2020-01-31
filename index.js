const chalk = require("chalk");
const Spinnies = require("spinnies");

function taskz(tasks, options = { parallel: false }) {
  return {
    run: async (
      ctx = {},
      level = 0,
      spinnies = new Spinnies({ succeedColor: "green", succeedPrefix: "✔" })
    ) =>
       (options.parallel ? runParallel : runSequence)(
        typeof tasks === 'function' ? tasks(ctx) : tasks,
        level,
        ctx,
        spinnies
      )
  };
}

async function runParallel(tasks, level, ctx, spinnies) {
  if (tasks.filter(t => t.stopOnError).length) {
    throw new Error("stopOnError is not compatible with runParallel");
  }
  const promises = tasks.map((t, i) => {
    return new Promise(async (resolve, reject) => {
      try {
        runTask({ t, i, level, ctx, spinnies, tasks });
        resolve();
      } catch (e) {
        reject();
      }
    });
  });
  try {
    await Promise.all(promises);
  } catch (e) {}
}

async function runSequence(tasks, level, ctx, spinnies) {
  for (let i = 0; i < tasks.length; i++) {
    try {
      await runTask({ t: tasks[i], i, level, ctx, spinnies, tasks });
    } catch (e) {
      break;
    }
  }
}

async function runTask({ t, i, level, ctx, spinnies, tasks }) {
  const id = String(i + Math.random());
  const counter = chalk.dim.grey(` [${i + 1}/${tasks.length}]`);
  const setText = val => {
    spinnies.update(id, { text: `${val}${counter}` });
  };

  spinnies.add(id, { text: `${t.text}${counter}`, indent: level });

  if (t.tasks) {
    // Subtasks
    spinnies.update(id, {
      text: `→ ${t.text}${counter}`,
      status: "stopped"
    });
    await t.tasks.run(ctx, level + 1, spinnies);
  } else {
    // Run one task
    try {
      await t.task(ctx, setText);
      spinnies.succeed(id, { text: chalk.reset(spinnies.pick(id).text) });
    } catch (e) {
      spinnies.fail(id, { text: chalk.reset(`${e.message}${counter}`) });
      if (t.stopOnError) {
        throw new Error("Stopped on error.");
      }
    }
  }
}

module.exports = taskz;
