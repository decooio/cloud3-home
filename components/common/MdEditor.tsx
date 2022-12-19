import { css } from "@emotion/css";
import {
  EditorComponent,
  Remirror,
  ThemeProvider, ToggleBlockquoteButton, ToggleBoldButton, ToggleBulletListButton, ToggleCodeBlockButton, ToggleHeadingButton, ToggleItalicButton, ToggleOrderedListButton, ToggleStrikeButton, Toolbar, useRemirror
} from "@remirror/react";
import "@remirror/styles/all.css";
import { RemirrorThemeType } from "@remirror/theme";
import axios from "axios";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import jsx from "refractor/lang/jsx";
import typescript from "refractor/lang/typescript";
import { Extension, ExtensionPriority, getThemeVar, RemirrorEventListenerProps } from "remirror";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  CodeExtension,
  EmojiExtension,
  HardBreakExtension,
  HeadingExtension,
  HorizontalRuleExtension,
  ImageExtension,
  ImageOptions,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  // TableExtension,
  TrailingNodeExtension
} from "remirror/extensions";

import data from "svgmoji/emoji.json";

import { upload } from "@lib/files";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { ProgressBar } from "./ProgressBar";

type Language = "zh_hant" | "zh_hans" | "en";

type Params = { [key: string]: any };

type ResultData = { [key: string]: any };

export interface MarkdownEditorProps {
  placeholder?: string;
  initialContent?: string;
  editorUpdate?: (params: Params) => void;

  editorContent?: string;
  editorContentId?: string;
  editorUpload?: (params: Params) => Promise<ResultData>;
  enableReviseMode?: boolean;
  enableSummary?: boolean;
  enableToolbar?: boolean;
  eventName?: string;
  language?: Language;

  onUpFinish?: (res?: any) => void;
}

const ipfsPinningService = "https://pin.crustcode.com/psa";
const gateway = "https://crustipfs.live";
const fileMap = new Map();

const defContent = `
**Markdown** content is the _best_
<br>

# Heading 1
<br>

## Code support
\`\`\`ts
const a = 'asdf';
\`\`\`

## List support

- an unordered
  - list is a thing
    - of beauty

1. As is
2. An ordered
3. List

`;
const mThemeClass = css`
  width: 100%;
  padding: 80px 24px 24px 24px;
  ol,
  ul {
    list-style: revert !important;
    margin: revert !important;
    padding: revert !important;
  }
  .remirror-editor-wrapper {
    padding-top: unset;
    border-radius: 0;
    border: 1px solid #dfe3e7 !important;
    outline: unset !important;
    .ProseMirror {
      padding: "1rem";
      height: calc(80vh - 300px);
      overflow-y: auto;
      box-shadow: unset !important;
      pre {
        padding: ${getThemeVar("space", 3)};
        margin: 0;
      }
    }
  }
`;

const ThemeDiv = ({ style, className, children }: any) => {
  return (
    <div style={style} className={`${mThemeClass} ${className} w-full`}>
      {children}
    </div>
  );
};

const theme: RemirrorThemeType = {
  color: {
    primary: "#FC7823",
    primaryText: "#FC7823",
    outline: "transparent",
    background: "transparent",
    hover: {
      primary: "#FC7823",
      primaryText: "#FC7823",
    },
  },
};
/**
 * Toolbar
 */

export const MdToolbar = () => {
  return (
    <Toolbar
      className={css`
        height: 72px;
        background-color: #f4f5f7;
        padding: 24px;
        border: 1px solid #dfe3e7;
        overflow-x: auto;
        button {
          padding: unset;
          width: 24px !important;
          height: 24px !important;
          /* font-size: 22px; */
          margin-right: 18px !important;
          outline: unset !important;
          border: unset !important;
          background-color: transparent !important;
        }
      `}
    >
      <ToggleHeadingButton attrs={{ level: 1 }} />
      <ToggleHeadingButton attrs={{ level: 2 }} />
      <ToggleHeadingButton attrs={{ level: 3 }} />
      <ToggleBoldButton />
      <ToggleItalicButton />
      <ToggleStrikeButton />
      <ToggleBlockquoteButton />
      <ToggleBulletListButton />
      <ToggleOrderedListButton />
      <ToggleCodeBlockButton />
    </Toolbar>
  );
};

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const MdEditor: FC<MarkdownEditorProps> = ({
  placeholder = "Loading...",
  initialContent = defContent,
  editorUpdate,
  onUpFinish
}) => {
  const linkExtension = useMemo(() => {
    const extension = new LinkExtension({ autoLink: true });
    extension.addHandler("onClick", (_, data) => {
      console.log(`You clicked link: ${JSON.stringify(data)}`);
      return true;
    });
    return extension;
  }, []);

  const authHeaderRef = useRef("");
  const [MDCid, setMDCid] = useState("");
  const [MDText, setMDText] = useState(initialContent);
  const [showWarning, setShowWarning] = useState(false);
  const [warningInfo, setWarningInfo] = useState("");
  const [progress, setProgress] = useState(-1);
  const status: "edit" | "uping" | "finish" = useMemo(() => {
    if (progress !== -1) return "uping";
    if (!MDCid) return "edit";
    return "finish";
  }, [progress, MDCid]);

  const getAuth = async () => {
    const provider: any = await detectEthereumProvider();
    if (provider && provider.isMetaMask) {
      await provider.request({ method: "eth_requestAccounts" });
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const addr = await signer.getAddress();
      const signature = await signer.signMessage(addr);
      return Buffer.from(`eth-${addr}:${signature}`).toString("base64");
    }
    return "";
  };
  const pin = async (cid: string, name: string) => {
    //if (cid.length !== 46) {
    if (cid.length === 0) {
      throw new Error("CID len err");
    }
    //const { body } = await axios.post(
    const res = await axios.post(
      `${ipfsPinningService}/pins`,
      JSON.stringify({
        cid: cid,
        name,
      }),
      {
        headers: {
          authorization: "Bearer " + authHeaderRef.current,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
  };

  const up2Gateway = async (form: FormData, onProgress?: (p: number) => void) => {
    if (!authHeaderRef.current || authHeaderRef.current === "") {
      authHeaderRef.current = await getAuth();
    }
    if (authHeaderRef.current === "") {
      return null;
    }
    try {
      const cancel = axios.CancelToken.source();
      onProgress && onProgress(0);
      const upResult = await upload({
        data: form,
        cancelToken: cancel.token,
        authBasic: `Basic ${authHeaderRef.current}`,
        onProgress,
      });
      console.log(upResult);
      return upResult;
    } catch (e: any) {
      console.error(e.message);
    }
    return null;
  };

  const pinMarkdonw = async () => {
    try {
      const form = new FormData();
      const name = "text.md";
      form.append("file", MDText);
      const upResult = await up2Gateway(form, (p) => setProgress(Math.round(p * 99)));
      if (upResult === null) {
        setWarningInfo("Cannot save markdown file.");
        setShowWarning(true);
        setMDCid("Save markdown failed.");
        return;
      }
      const cid = upResult.Hash;
      await pin(cid, name);
      setMDCid(cid);
      setProgress(-1);
      onUpFinish && onUpFinish(upResult)
    } catch (error) {
      console.error(error);
    }
  };

  const uploadHandler: ImageOptions["uploadHandler"] = (files) => {
    let completed = 0;
    const promises = [];
    for (const { file, progress } of files) {
      promises.push(
        () =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener(
              "load",
              async (readerEvent) => {
                console.log(file);
                completed += 1;
                progress(completed / files.length);
                // Upload data to IPFS gateway
                //let imgSrc = readerEvent.target?.result as string;
                let imgCid = fileMap.get(file.name);
                if (!fileMap.has(file.name)) {
                  const form = new FormData();
                  form.append("file", file, file.name);
                  const upResult = await up2Gateway(form);
                  if (upResult !== null) {
                    imgCid = upResult.Hash;
                    fileMap.set(file.name, upResult.Hash);
                  }
                }
                imgCid ? resolve({ src: `${gateway}/ipfs/${imgCid}`, fileName: file.name }) : reject();
              },
              { once: true }
            );

            reader.readAsDataURL(file);
          })
      );
    }

    return promises as any;
  };

  const extensions = useCallback(
    () => [
      new PlaceholderExtension({ placeholder }),
      new EmojiExtension({
        data,
        plainText: true,
        // moji: 'noto'
      }),
      // new LinkExtension({ autoLink: true }),
      new BoldExtension({}),
      new StrikeExtension(),
      new ImageExtension({ uploadHandler: uploadHandler, enableResizing: true }),
      new ItalicExtension(),
      new HeadingExtension({}),
      new HorizontalRuleExtension(),

      // new LinkExtension(),
      linkExtension,
      new BlockquoteExtension(),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new ListItemExtension({ priority: ExtensionPriority.High, enableCollapsible: true }),
      new CodeExtension(),
      new CodeBlockExtension({ supportedLanguages: [jsx, typescript] }),
      new TrailingNodeExtension(),

      // new TableExtension(),

      new MarkdownExtension({ copyAsMarkdown: false }),
      /**
       * `HardBreakExtension` allows us to create a newline inside paragraphs.
       * e.g. in a list item
       */
      new HardBreakExtension(),
    ],
    [placeholder]
  );

  const { manager, state, setState } = useRemirror({
    extensions,
    stringHandler: "markdown",
    content: initialContent,
  });

  const changeHandler = (parameter: RemirrorEventListenerProps<Extension>) => {
    // Update the state to the latest value.
    if (parameter.tr?.docChanged) {
      console.log("before onChange:", parameter);
      editorUpdate?.(parameter);
    }
    setState(parameter.state);
    setMDText(parameter.helpers.getMarkdown());
  };

  return (
    <ThemeProvider as={ThemeDiv} theme={theme}>
      {status == "edit" && (
        <Remirror manager={manager} autoFocus state={state} onChange={changeHandler}>
          <MdToolbar />
          <EditorComponent />
          <div className="flex justify-center">
            <Button className="mt-4" text="Publish" onClick={pinMarkdonw} />
          </div>
        </Remirror>
      )}
      {status == "uping" && (
        <div className="flex flex-col items-center">
          <p className="w-[26rem] text-2xl text-center mb-10">Publishing & Uploading to IPFS Please wait...</p>
          <ProgressBar value={progress} />
        </div>
      )}
      {status == "finish" && (
        <>
          <div className="text-center text-lg text-black-3 flex flex-col items-center">
            <Icon className="text-5xl mb-4" icon={AiOutlineCheckCircle} />
            <h4 className="text-2xl font-semibold mb-4">Publish successfully！</h4>
            <p className="mb-14">This content has been published and decentralized stored on IPFS.</p>
            <h5 className="mb-2">Your content's IPFS CID:</h5>
            <p className="text-sm text-gray-7 mb-8">{MDCid}</p>
            {/*<h5 className="mb-2">Storage Manager Tx No:</h5>*/}
            {/*<p className="text-sm text-gray-7">QmZAtHgtRuaH7smYsllzlbv86GYSajkxwKUL95UAoahEs7S</p>*/}
          </div>
        </>
      )}
    </ThemeProvider>
  );
};
