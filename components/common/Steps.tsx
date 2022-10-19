import classNames from "classnames";
import React from "react";

export const Step = React.memo(
  (p: { text: string; edge: -1 | 0 | 1; active: boolean, isCurrent: boolean }) => {
    const { edge, active, text, isCurrent } = p;
    return (
      <div className=" flex-1">
        <div className="flex items-center">
          <div
            className={classNames(" flex-1 h-[2px] ", {
              "bg-orange-15": active && edge >= 0,
              "bg-gray-16": !active && edge >= 0,
            })}
          />
          <div
            className={classNames(" w-4 h-4 rounded-lg bg-white", {
              " !bg-orange-15": active,
            })}
          >
            <div
              className={classNames(" w-2 h-2 ml-1 mt-1 rounded bg-gray-16", {
                " !bg-white": active,
              })}
            />
          </div>
          <div
            className={classNames(" flex-1 h-[2px] ", {
              "bg-orange-15": active && !isCurrent && edge <= 0,
              "bg-gray-16": (!active || isCurrent) && edge <= 0,
            })}
          />
        </div>
        <div
          className={classNames("text-center text-gray-8", {
            " !text-orange-15": active,
          })}
        >
          {text}
        </div>
      </div>
    );
  }
);

export const Steps = React.memo((p: { data: string[]; current: number }) => {
  const { data, current } = p;
  return (
    <div className=" flex">
      {data.map((text, index) => (
        <Step
          key={`steps_${index}`}
          text={text}
          edge={index === 0 ? -1 : index === data.length - 1 ? 1 : 0}
          isCurrent={index === current}
          active={index <= current}
        />
      ))}
    </div>
  );
});
