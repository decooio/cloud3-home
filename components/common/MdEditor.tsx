import { css } from "@emotion/css";
import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  ToggleBlockquoteButton,
  ToggleBoldButton,
  ToggleBulletListButton,
  ToggleCodeBlockButton,
  ToggleHeadingButton,
  ToggleItalicButton,
  ToggleOrderedListButton,
  ToggleStrikeButton,
  Toolbar,
  useRemirror
} from "@remirror/react";
import "@remirror/styles/all.css";
import { RemirrorThemeType } from "@remirror/theme";
import axios from "axios";
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
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

import { pinCID, upload } from "@lib/files";
import { shortStr } from "@lib/utils";
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

const gateway = "https://ipfs.io" ;// GatewayBase;
const fileMap = new Map();

const defContent = ``;
const mThemeClass = css`
  width: 100%;
  height: 100%;
  padding: 80px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
    overflow-y: auto;
    height: 447px;
    max-height: 447px;
    .ProseMirror {
      overflow: hidden;
      min-height: 100%;
      padding: "1rem";
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
        height: 72px !important;
        background-color: #f4f5f7 !important;
        padding: 24px !important;
        border: 1px solid #dfe3e7 !important;
        overflow: hidden !important;
        button {
          padding: unset !important;
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
  placeholder = "Please input text...",
  initialContent = defContent,
  editorUpdate,
  onUpFinish,
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
  const [MDText, setMDText] = useState("");
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
      console.info("pro:", provider);
      const msg = `You are signing thie message for DEMO purpose only.
      Sign this message to prove you own this account and you will be able to publish your Web3 content.`;
      const signature = await signer._signTypedData(
        { name: "Cloud3.cc" },
        { Message: [{ name: "Message", type: "string" }] },
        { Message: msg }
      );
      console.info("sig", signature);
      // const signature = await signer.signMessage(addr);
      return Buffer.from(`eth-${addr}:${signature}`).toString("base64");
    }
    return "";
  };

  const up2Gateway = async (form: FormData, onProgress?: (p: number) => void) => {
    try {
      const cancel = axios.CancelToken.source();
      onProgress && onProgress(0);
      const upResult = await upload({
        data: form,
        cancelToken: cancel.token,
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
      const auth = await getAuth();
      if (!auth) return;
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
      await pinCID(cid, name);
      setMDCid(cid);
      setProgress(-1);
      onUpFinish && onUpFinish(upResult);
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
                let imgCid = fileMap.get(file.name);
                if (!imgCid) {
                  const form = new FormData();
                  form.append("file", file, file.name);
                  const upResult = await up2Gateway(form);
                  if (upResult !== null) {
                    // try {
                    //   await pinCID(upResult.Hash, file.name);
                    //   const success = await loopCheckCID(upResult.Hash, 10000, 15);
                    //   if (success) {
                    //     imgCid = upResult.Hash;
                    //     fileMap.set(file.name, upResult.Hash);
                    //   } else {
                    //     throw 'timeout'
                    //   }
                    // } catch (error) {
                    //   console.error(error);
                    //   // resolve({ src: `https://ipfs.io/ipfs/${upResult.Hash}`, fileName: file.name });
                    // }
                    await pinCID(upResult.Hash, file.name);
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
      linkExtension,
      new BoldExtension({}),
      new StrikeExtension(),
      new ImageExtension({
        uploadHandler,
        createPlaceholder: () => {
          const place = document.createElement("div");
          place.style.height = "100px";
          place.style.padding = "30px";
          const anim = document.createElement("div");
          anim.className = "animate-spin transition-all";
          anim.style.width = "40px";
          anim.style.height = "40px";
          anim.style.borderRadius = "20px";
          anim.style.border = "dashed 4px black";
          place.appendChild(anim);
          return place;
        },
        enableResizing: true,
      }),
      new ItalicExtension(),
      new HeadingExtension({}),
      new HorizontalRuleExtension(),
      new BlockquoteExtension(),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new ListItemExtension({ priority: ExtensionPriority.High, enableCollapsible: true }),
      new CodeExtension(),
      new CodeBlockExtension({ supportedLanguages: [jsx, typescript] }),
      new TrailingNodeExtension(),
      new MarkdownExtension({ copyAsMarkdown: false }),
      new HardBreakExtension(),
    ],
    [placeholder]
  );

  const { manager } = useRemirror({
    extensions,
    stringHandler: "markdown",
    content: initialContent,
  });

  const changeHandler = (parameter: RemirrorEventListenerProps<Extension>) => {
    // Update the state to the latest value.
    if (parameter.tr?.docChanged) {
      // console.log("before onChange:", parameter);
      editorUpdate?.(parameter);
    }
    console.info("p:", parameter.helpers.getMarkdown());
    // setState(parameter.state);
    // setMDText(parameter.helpers.getMarkdown());
  };

  useEffect(() => {
    const task = setInterval(() => {
      setMDText(manager.extensionStore.helpers.getMarkdown());
    }, 500);
    return () => clearInterval(task);
  }, [manager]);
  return (
    <ThemeProvider as={ThemeDiv} theme={theme}>
      {status == "edit" && (
        <Remirror manager={manager} autoFocus onBlur={changeHandler} onChange={changeHandler}>
          <MdToolbar />
          <EditorComponent />

          <div className="flex justify-center">
            <Button disabled={!MDText} className="btn-173 mt-4" text="Publish" onClick={pinMarkdonw} />
          </div>
        </Remirror>
      )}
      {status == "uping" && (
        <div className="mb-[3.5rem] font-WorkSans px-14 flex flex-col items-center">
          <p className="w-[24rem] text-black-3 text-2xl text-center mb-10">
            Publishing & Uploading to IPFS Please wait...
          </p>
          <ProgressBar value={progress} />
        </div>
      )}
      {status == "finish" && (
        <>
          <div className="mb-[3.5rem] text-center font-WorkSans text-black-3 flex flex-col items-center">
            <Icon className="text-[3.125rem] text-black mb-4" icon={AiOutlineCheckCircle} />
            <div className="text-[1.375rem] text-black font-semibold mb-4">Publish successfully！</div>
            <p className="mb-14 text-lg">This content has been published and decentralized stored on IPFS.</p>
            <div className="mb-2 text-lg">Your content's IPFS CID:</div>
            <div className="text-sm text-gray-7 mb-8">{MDCid}</div>
            <div className="mb-2 text-lg">Storage Manager Tx No:</div>
            <p className="text-sm text-gray-7">
              {shortStr("0x69b9f8cf491b55c485dbb43a86a7e48f7649aa45c958cd245461d04c3146bd91", 23, 23)}
            </p>
          </div>
        </>
      )}
    </ThemeProvider>
  );
};
