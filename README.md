## Dev Setup

Now you can proceed to install dependencies. <br />
After that, we will compile our TypeScript code to JavaScript

> **Note**
> This project uses `bun` to manage dependencies. If you don't have `bun` installed, you can read [here](https://bun.sh/docs/installation) on how to install it.

```bash
bun install
```

### Setting token

1. Rename `.env.example` to `.env`
2. Add your token to the `.env` file in this format
3. Fill the required information.

### Starting the bot

Now we can start the bot using `bun run dev` script.

```bash
bun run dev
```

## Production Setup

To run in production environment, we use Docker. You can read more about it [here](https://docs.docker.com/get-started/).

### Building the image

```bash
docker build -t aurora-project .
```

### Running the image

```bash
docker run -d --name aurora --env-file .env aurora-project
```

[`prettier`]: https://prettier.io/
[`commit message conventions`]: https://conventionalcommits.org/en/v1.0.0/
[pr]: https://github.com/uzideath/aurora/pulls
