import { Howl } from "howler";

export const FADE_DURATION = 600;
export const VOLUME = 0.35;

export const sound = new Howl({
    src: ["/stardust.mp3"],
    loop: true,
    volume: VOLUME,
    onloaderror: (_, error) => {
        console.error('Error loading sound:', error);
    },
    onplayerror: (_, error) => {
        console.error('Error playing sound:', error);
    }
});

export const whooshSound = new Howl({
    src: ["/whoosh-motion.mp3"],
    volume: 0.5,
    onloaderror: (_, error) => {
        console.error('Error loading whoosh sound:', error);
    },
    onplayerror: (_, error) => {
        console.error('Error playing whoosh sound:', error);
    }
});
