```
docker run --rm -it -e RTSP_PROTOCOLS=tcp -p 8554:8554 aler9/rtsp-simple-server
docker build -t chrome-rtsp-streamer . && docker run --rm -it chrome-rtsp-streamer rtsp://10.0.0.2:8554/stream
ffplay -rtsp_transport tcp rtsp://10.0.0.2:8554/stream
```
