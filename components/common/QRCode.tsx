import { QRCODE_STYLE } from "@lib/type";
import React, { HTMLAttributes } from "react";
import { QRNormal, QRLine, QRFunc, QRImage, QRResImage, QRDsj, QRRandRect, QRBubble } from "react-qrbtf";

export const QRCodeStyles: QRCODE_STYLE[] = [
//   "A-a1",
//   "A-a2",
  "A-b1",
//   "A-b2",
  "A1",
  "A2",
//   "A3",
//   "C1",
//   "C2",
//   "C3",
//   "SP-1",
//   "SP-2",
//   "SP-3",
];

export const QRCode = React.memo(
  (
    p: { type: QRCODE_STYLE; value?: string } & HTMLAttributes<HTMLDivElement>
  ) => {
    const { type, value, ...other } = p;
    if (!value) return null;
    return (
      <div {...other}>
        {type === "A1" && <QRNormal value={value} />}
        {type === "A2" && (
          <QRNormal value={value} type="round" posType="round" />
        )}
        {type === "A3" && (
          <QRNormal value={value} type="rand" posType="planet" />
        )}
        {type === "A-a1" && (
          <QRLine value={value} direction="h-v" posType="roundRect" />
        )}
        {type === "A-a2" && (
          <QRLine value={value} direction="cross" posType="rect" />
        )}
        {type === 'A-b1' && <QRFunc value={value} type="round" posType="round" />}
        {type === 'A-b2' && <QRFunc value={value} type="round" posType="round" funcType="B" />}
        {type === 'C1' && <QRImage value={value} size={150}/>}
        {type === 'C2' && <QRResImage value={value} alignType="bw" timingType="bw"/>}
        {type === 'SP-1' && <QRDsj value={value}/>}
        {type === 'SP-2' && <QRRandRect value={value}/>}
        {type === 'SP-3' && <QRBubble value={value}/>}
      </div>
    );
  }
);
