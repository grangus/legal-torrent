import Link from "next/link";

interface InputProps {
  type: string;
  id: string;
  placeholder: string;
  name: string;
  autocomplete?: string;
  icon?: string;
}

interface SubmitProps {
  text: string;
}

interface FooterLinkProps {
  text: string;
  linkTitle: string;
  url: string;
  isLocal: boolean;
}

export function SubmitButton(props: SubmitProps) {
  return (
    <div className="text-center">
      <button className="button button--border-green mt-4" type="submit">
        {props.text}
      </button>
    </div>
  );
}

export function FormFooterLink(props: FooterLinkProps) {
  return (
    <div className="xs-desc2 text-center mb-5">
      Already have an account?{" "}
      {props.isLocal ? (
        <a href={props.url}>{props.linkTitle}</a>
      ) : (
        <Link href={props.url}>
          <a>{props.linkTitle}</a>
        </Link>
      )}
    </div>
  );
}

export function InputWithFloatingLabel(props: InputProps) {
  return (
    <div className="form-floating input-group">
      <input
        type={props.type}
        className="form-control"
        id={props.id}
        placeholder={props.placeholder}
        name={props.name}
        autoComplete={props.autocomplete}
      />
      <label htmlFor={props.id}>{props.placeholder}</label>
    </div>
  );
}

export function NormalInput(props: InputProps) {
  return (
    <div className="input-group mt-3">
      <input
        type={props.type}
        className="form-control"
        id={props.id}
        placeholder={props.placeholder}
        name={props.name}
        autoComplete={props.autocomplete}
      />
    </div>
  );
}

export function InputWithFloatingLabelAndIcon(props: InputProps) {
  return (
    <div className="form-floating w-icon input-group">
      <div className="input-group-text">
        <span className="xs-icon lock"></span>
      </div>
      <input
        type={props.type}
        className="form-control"
        id={props.id}
        placeholder={props.placeholder}
        name={props.name}
        autoComplete={props.autocomplete}
      />
      <label htmlFor="input3-password">{this.placeholder}</label>
    </div>
  );
}

export function InputWithIcon(props: InputProps) {
  return (
    <div className="input-group mt-3">
      <div className="input-group-text">
        <span className="xs-icon bolt"></span>
      </div>
      <input
        type={props.type}
        className="form-control"
        id={props.id}
        placeholder={props.placeholder}
        name={props.name}
        autoComplete={props.autocomplete}
      />
    </div>
  );
}
