interface ButtonProps {
  text?: string;
  icon?: string;
  enableDot?: boolean;
  buttonSize?: "medium" | "large";
}

export function ButtonGreenOutline(props: ButtonProps) {
  return (
    <div
      className={`button ${
        props.buttonSize ? `button--${props.buttonSize}` : ""
      } button--border mb-2`}
    >
      {props.text}
    </div>
  );
}

export function ButtonOutline(props: ButtonProps) {
  return (
    <div
      className={`button ${
        props.buttonSize ? `button--${props.buttonSize}` : ""
      } button--border-green mb-2`}
    >
      {props.text}
    </div>
  );
}

export function Button(props: ButtonProps) {
  return (
    <div
      className={`button ${
        props.buttonSize ? `button--${props.buttonSize}` : ""
      } mb-2`}
    >
      {props.text}
    </div>
  );
}

export function ButtonNoBg(props: ButtonProps) {
  return <div className="button button--no-bg mb-2">{props.text}</div>;
}

export function DownloadButton(props: ButtonProps) {
  return (
    <div className="button button--large-w-arrow mb-5">
      <span className="text">
        Download<small>torrent</small>
      </span>
      <span className="arrow"></span>
    </div>
  );
}

export function IconButton(props: ButtonProps) {
  return (
    <div className={`button button--border ${props.enableDot ? "dot" : ""}`}>
      <div>
        <span className={`xs-icon ${props.icon}`}></span>
      </div>
    </div>
  );
}
