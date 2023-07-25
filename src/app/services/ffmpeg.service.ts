import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isRunning = false;
  isReady = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
  }

  async init() {
    if (this.isReady) {
      return;
    }

    await this.ffmpeg.load();
    this.isReady = true;
  }

  async getScreenshots(file: File) {
    this.isRunning = true;
    const data = await fetchFile(file);

    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds = [1, 2, 3];
    const commands: string[] = [];

    seconds.forEach((sec) => {
      commands.push(
        // Input
        '-i',
        file.name,
        //Output options
        '-ss',
        `00:00:0${sec}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-1',
        //Output
        `output_0${sec}.png`
      );
    });

    await this.ffmpeg.run(...commands);

    const screenshots: string[] = [];

    seconds.forEach(sec => {
      const screenshotFile = this.ffmpeg.FS('readFile', `output_0${sec}.png`)
      const screenShotBlob = new Blob(
        [screenshotFile.buffer],
        {
          type: 'image/png'
        }
      );

      const screenShotUrl = URL.createObjectURL(screenShotBlob);
      screenshots.push(screenShotUrl);
    })

    this.isRunning = false;
    return screenshots;
  }

  async blobFromUrl(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}
