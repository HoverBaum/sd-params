# SD Param Explorer

Status: Proof of Concept

Simple web app to explore parameters used to create Stable Diffusion generated images. Under the hood this tool reads the exif data in image files and extracts the information from there.

## Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Resources

Color palette from home screen image: https://coolors.co/dd63be-853991-131a2a-2c4b54-faad30 

Exif library https://github.com/MikeKovarik/exifr undmaintained but gets the job done. Another, more maintained library https://github.com/mattiasw/ExifReader sadly doesn't support exif extraction from PNGs.
