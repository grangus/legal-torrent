interface AlertProps {
  title?: string;
  text?: string;
}

export function AlertInfo(props: AlertProps) {
  return (
    <div className="alert alert-info alert-dismissible fade show" role="alert">
      {props.text}
      <button
        type="button"
        className="btn-close btn-close-white"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}

export function AlertDanger(props: AlertProps) {
  return (
    <div
      className="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      {props.text}
      <button
        type="button"
        className="btn-close btn-close-white"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}

export function AlertSuccess(props: AlertProps) {
  return (
    <div
      className="alert alert-success alert-dismissible fade show"
      role="alert"
    >
      {props.text}
      <button
        type="button"
        className="btn-close btn-close-white"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}

export function AlertWarning(props: AlertProps) {
  return (
    <div
      className="alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      {props.title}
      <hr />
      <p className="mb-0">{props.text}</p>
      <button
        type="button"
        className="btn-close btn-close-white"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}
