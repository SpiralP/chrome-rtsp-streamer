# chrome-rtsp-streamer

Launches chrome in a docker container then streams audio/video to an rtsp server!

### Usage

```sh
# start an rtsp server
docker run --rm -it -e RTSP_PROTOCOLS=tcp -p 8554:8554 aler9/rtsp-simple-server

# build and launch our chrome streamer!
docker build -t chrome-rtsp-streamer .
docker run --rm -it chrome-rtsp-streamer rtsp://10.0.0.2:8554/stream https://www.youtube.com/watch?v=AB6sOhQan9Y

# on a client, play the stream
ffplay -rtsp_transport tcp rtsp://10.0.0.2:8554/stream
```

### References

- https://github.com/suchipi/spotify-player
- https://github.com/suchipi/discord-spotify-bot
- https://github.com/vkanduri/avcapture
- https://stackoverflow.com/a/43368617/2780398
