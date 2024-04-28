
# MMM-MLB-Scoreboard

A [MagicMirror²](https://magicmirror.builders/) module that displays the days Major League Baseball games.

## Screenshot

![Screenshot](MMM-MLB-Scoreboard-Preview.png)

## Installation

1. Navigate to the modules folder:

```bash
cd ~/MagicMirror/modules
```

2. Clone the repository from Github:

```bash
git clone https://github.com/jclarke54/MMM-MLB-Scoreboard
```

3. Navigate to the module folder:

```bash
cd MagicMirror/modules/MMM-MLB-Scoreboard
```

4. Install the dependencies:

```bash
npm install 
```

## Configuration

Add the module to your `config.js` file array:

```js
modules: [
  ...
  {
    module: "MMM-MLB-Scoreboard",
    position: "top_left"
  },
  ...
]
```

There are no config options.

## Update

1. Navigate to the MagicMirror modules folder:

```bash
cd ~/MagicMirror/modules
```

2. Download the current version of the module:

```bash
git pull
```

3. Install the dependencies:

```bash
npm install
```
