import dotprop from "dot-prop";
import { Context } from "joi";
import * as en from "./en";
import * as es from "./es";
import * as fr from "./fr";

interface Translation {
  joi_errors: object;
  unknown: string;
}

//TODO: check this and make sure adding the key to the beginning of every string is okay.
//I think it needs to be replaced with label if it exists since the key won't be translated.
export class Language {
  private lang: Translation;

  constructor(code: string) {
    switch (code) {
      case "en":
        this.lang = en.lang;
        break;
      case "es":
        this.lang = es.lang;
        break;
      case "fr":
        this.lang = fr.lang;
        break;
      default:
        this.lang = en.lang;
    }
  }

  getTranslation(code: string) {
    let translation = dotprop.get(this.lang, code);

    return translation || this.lang.unknown;
  }

  getJoiTranslation(code: string, context: Context | undefined) {
    let translation: string | undefined = dotprop.get(
      this.lang.joi_errors,
      code
    );

    if (context) {
      Object.keys(context).forEach((k) => {
        translation?.replace(
          new RegExp(`/{{${k == "value" || k == "key" ? "!" : ""}${k}}}/`, "g"),
          context[k]
        );
      });
    }

    return translation ? `"${context?.key}" ${translation}` : this.lang.unknown;
  }
}
