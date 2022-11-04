import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as style } from "react-syntax-highlighter/dist/esm/styles/prism";
import { pinUrl } from "@lib/http";

const code = `
**Upload** file with the standard [IPFS API](https://docs.ipfs.tech/reference/kubo/rpc/#api-v0-add) and get the CID:

~~~bash
curl -X POST 'https://<GATEWAY_HOST>/api/v0/add?pin=true' --header 'Authorization: Bearer <YOUR_W3AUTH_TOKEN>' --form 'path=@"<FILE_PATH>"'
~~~

**Pin** the CID with the standard [IPFS Pinning Service API](https://ipfs.github.io/pinning-services-api-spec/#operation/addPin):

~~~bash
curl -X POST '${pinUrl('/psa/pins')}' \
--header 'Authorization: Bearer <YOUR_W3AUTH_TOKEN>' \
--data-raw '{
    "cid": "<FILE_CID>",
    "name": "<FILE_NAME>"
}'
~~~
`;

export const BucketCode = React.memo(() => {
  return (
    <ReactMarkdown
      children={code}
      linkTarget="_blank"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              style={style}
              language={match[1]}
              PreTag="div"
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
      remarkPlugins={[remarkGfm]}
    />
  );
});
