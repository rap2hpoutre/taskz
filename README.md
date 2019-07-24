# Taskz

Simple sequential and parallel task list runner for terminal.

![render1563366532786](https://user-images.githubusercontent.com/1575946/61376196-03e43800-a8a1-11e9-9ac2-caff8e3c412a.gif)

## Install

```
npm i taskz
```

## Getting started

Create your task sequence then run it.

```js
const taskz = require("taskz");

taskz([
  {
    text: "first task - sleeps for 200ms",
    task: async () => await new Promise(resolve => setTimeout(resolve, 200));
  },
  {
    text: "this task will fail",
    task: async () => {
      throw new Error("this task failed");
    }
  }
]).run();
```

## Usage

### Create tasks

```js
// Create tasks
const myTasks = taskz([
  { text: "task 1", task: () => { /* ... */ } },
  { text: "task 2", task: () => { /* ... */ } }
]);

// Run it
myTasks.run()
```

### Subtasks

Replace `task` by `tasks` and call `taskz` function.

```js
const myTasks = taskz([
  { text: "task 1", task: () => { /* ... */ } },
  { 
    text: "task 2 with subtasks", 
    tasks: taskz([
      { text: "task 2.1", task: () => { /* ... */ } },
      { text: "task 2.2", task: () => { /* ... */ } }
    ]) 
  }
]);
```

### Concurrent tasks (parallelism)

Add `{ parallel: true }` as a second parameter in `taskz`. 

```js
const myTasks = taskz([
  { text: "task 1", task: () => { /* ... */ } },
  { text: "task 2", task: () => { /* ... */ } }
], { parallel: true });
```

You can mix parallel and sequencial tasks within the same scenario via subtasks.

### Fail

Fail and stop with `stopOnError` option. Does only work for sequencial tasks.

```js
const myTasks = taskz([
  {
    text: "this task will fail and stop",
    stopOnError: true,
    task: async () => {
      throw new Error("this task failed and stopped the whole process");
    }
  },
  { text: "this task will never be displayed", task: async () => {} }
]);
```

### Use context

```js
const myTasks = taskz([
  { 
    text: "task 1", 
    task: ctx => { ctx.val = "foo" } 
  },
  { 
    text: "task 2", 
    task: ctx => { doSomethingWith(ctx.val) } 
  }
]);
```

### Change text within a task during execution

```js
const myTasks = taskz([
  {
    text: "my subtask 2",
    task: async ctx => {
      ctx.text("my subtask 2 foo");
      await new Promise(resolve => setTimeout(resolve, 200));
      ctx.text("my subtask 2 bar");
    }
  }
]);
```

## Related

- [spinnies](https://github.com/jcarpanelli/spinnies) - Elegant terminal multiple spinners manager
- [cli-spinners](https://github.com/sindresorhus/cli-spinners) - Spinners for use in the terminal
- [listr](https://github.com/SamVerschueren/listr) - Terminal task list

## License

MIT © [rap2h](https://github.com/rap2hpoutre)
