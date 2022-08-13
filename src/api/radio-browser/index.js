import { Typography } from "@mui/material";
import { setAlertInfo } from "../../App";

export async function getSearchResult(radioName) {
  const init = {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    mode: "cors",
    cache: "default",
  };
  const response = await fetch(
    `https://de1.api.radio-browser.info/json/stations/byname/${radioName}`,
    init
  );

  return await response.json();
}

export async function playAudio(audio, radio, setIsAwatingAsyncEvent = null) {
  try {
    await audio.play();
    navigator.mediaSession.metadata = new MediaMetadata({
      title: radio.name,
      artwork: [{ src: radio.favicon }],
    });
  } catch (err) {
    if (
      err.message.startsWith(
        "The play() request was interrupted by a new load request."
      )
    )
      return;

    console.log(err);
    let attempts = 1;
    for (; attempts <= 10; attempts++) {
      try {
        await audio.play();
        navigator.mediaSession.metadata = new MediaMetadata({
          title: radio.name,
          artwork: [{ src: radio.favicon }],
        });
        break;
      } catch (err) {
        console.log(err);
      }
    }

    if (attempts > 10) {
      setAlertInfo({
        severity: "error",
        message: (
          <Typography>
            Falha ao tocar rádio. Para saber mais,{" "}
            <a
              href="https://github.com/RafaSantos484/react-radio#link-para-teste-da-aplica%C3%A7%C3%A3o-httpsreactradiovercelapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              clique aqui
            </a>
          </Typography>
        ),
      });
    }
  } finally {
    if (setIsAwatingAsyncEvent) setIsAwatingAsyncEvent(false);
  }
}
