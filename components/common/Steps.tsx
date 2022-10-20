import classNames from "classnames";
import React, { HTMLAttributes } from "react";

function IconRight(p: HTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 11 9"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.4496 2.29301C10.8401 1.90248 10.8401 1.26932 10.4496 0.878796C10.0591 0.488271 9.42591 0.488271 9.03538 0.878796L4.08564 5.82854L1.96432 3.70722C1.57379 3.3167 0.940626 3.3167 0.550102 3.70722C0.159577 4.09775 0.159577 4.73091 0.550102 5.12144L3.37853 7.94986C3.76905 8.34039 4.40222 8.34039 4.79274 7.94986L10.4496 2.29301Z"
      />
    </svg>
  );
}
export interface StepProps {
  text: string;
  finish: boolean;
  active: boolean;
  type: "left" | "mid" | "right";
}
export const Step = React.memo((p: StepProps) => {
  const { finish, active, text, type } = p;
  return (
    <div className=" flex-1">
      <div className="flex items-center">
        <div
          className={classNames(" flex-1 h-[2px] ", {
            "bg-orange-15": (active || finish) && type !== "left",
            "bg-gray-16": !(active || finish) && type !== "left",
          })}
        />
        <div
          className={classNames(" w-4 h-4 rounded-lg bg-white flex items-center justify-center", {
            " !bg-orange-15": active || finish,
          })}
        >
          {finish ? (
            <IconRight className="text-xs relative text-white"/>
          ) : (
            <div
              className={classNames(" w-2 h-2 rounded bg-gray-16", {
                " !bg-white": active,
              })}
            />
          )}
        </div>
        <div
          className={classNames(" flex-1 h-[2px] ", {
            "bg-orange-15": finish && type !== "right",
            "bg-gray-16": !finish && type !== "right",
          })}
        />
      </div>
      <div
        className={classNames("text-center text-gray-8 mt-2", {
          " !text-orange-15": active,
        })}
      >
        {text}
      </div>
    </div>
  );
});

export const Steps = React.memo((p: { data: string[]; current: number }) => {
  const { data, current } = p;
  return (
    <div className=" flex">
      {data.map((text, index) => (
        <Step
          key={`steps_${index}`}
          text={text}
          type={index === 0 ? 'left' : index === data.length - 1 ? 'right' : 'mid'}
          finish={index < current}
          active={index == current || (index === data.length - 1 && index < current)}
        />
      ))}
    </div>
  );
});
