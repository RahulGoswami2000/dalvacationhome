/* eslint-disable */
import { Component } from "react";

interface KommunicateChatProps {}

class KommunicateChat extends Component<KommunicateChatProps> {
  constructor(props: KommunicateChatProps) {
    super(props);
  }

  componentDidMount() {
    if (!document.getElementById("kommunicate-script")) {
      (function (m: any) {
        var kommunicateSettings = {
          appId: "241e2cfc8048d38ff338c16c0cd09efee",
          popupWidget: true,
          automaticChatOpenOnNavigation: true,
        };
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
        (window as any).kommunicate = m;
        m._globals = kommunicateSettings;
      })((window as any).kommunicate || {});
    }
  }

  render() {
    return <div></div>;
  }
}

export default KommunicateChat;
