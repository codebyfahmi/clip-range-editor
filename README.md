# Clip Range Editor

A small React component demo for selecting and previewing a precise range inside a video.

It is intentionally independent from any media-processing backend: the app loads a public demo video, loops playback inside the selected range, and lets users choose a visual output ratio.

## Features

- Start/end range controls with a minimum clip duration
- Playback that loops within the selected range
- Responsive timeline and clip-length readout
- 9:16, 1:1, and 16:9 preview modes
- Small, tested range-normalization utilities

## Run locally

```bash
npm install
npm run dev
```

Run the checks with:

```bash
npm test
npm run build
```

## Design notes

The video is a public MDN demo asset loaded at runtime. No uploaded media, credentials, analytics, AI service, licensing code, or proprietary media-processing logic is included.

## License

[MIT](LICENSE)
