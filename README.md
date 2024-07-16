<div align="center">

## Alya

Alya is a Discord Music Application, based on Lavalink with [Kazagumo Wrapper](https://github.com/Takiyo0/Kazagumo).

![AppVeyor](https://img.shields.io/appveyor/build/Takiyo0/kazagumo) 
![Downloads](https://img.shields.io/npm/dm/kazagumo) 
![npm](https://img.shields.io/npm/v/kazagumo) 
![GitHub contributors](https://img.shields.io/github/contributors/arestosora/Alya) 
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/arestosora/Alya) 
![GitHub last commit](https://img.shields.io/github/last-commit/arestosora/Alya) 

<p>
  <img src=".github/assets/image.png" alt="Alya sometimes hides her feelings in russian.">
</p>

</div>

- **Spotify and Youtube Support**

## Self host.

You must have [Docker](https://www.docker.com/) installed in your system. Once this is covered, you just need to run the following commands.

```bash
git clone https://github.com/arestosora/Alya.git
```
> [!TIP]
> I recommend using yarn, but you can still use npm to install the dependencies.
```bash
yarn install
```
Then we must create our .env file, you can run the following command.
```bash
cp .env.example .env
```

Fill the required fields.
> [!WARNING]
> You must have a Spotify application, you can create one [here](https://developer.spotify.com/documentation/web-api)

With everything complete, we must run docker and then 
```bash
docker compose up --build
```
or if you want to run it on the background

```bash
docker compose up -d --build
```
