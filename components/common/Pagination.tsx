import _ from "lodash";
import {HTMLAttributes, useMemo} from "react";
import classnames from "classnames";
export interface Props {
  total: number;
  pgSize: number;
  pgNum: number;
  onChange?: (p: number) => void;
}

interface Item {
  name: string;
}

const omit = "...";
export function Pagination(p: Props & HTMLAttributes<HTMLDivElement>) {
  const { total,pgSize, pgNum, onChange,className } = p;
  const count = Math.ceil(total/pgSize)
  const items: Item[] = useMemo(() => {
    if (count <= 1) return [];
    if (count <= 6) return _.range(count).map((i) => ({ name: `${i + 1}` }));
    if (pgNum <= 3)
      return _.range(pgNum + 1)
        .map((i) => ({ name: `${i + 1}` }))
        .concat([{ name: omit }, { name: "" + count }]);
    if (pgNum >= count - 2)
      return [{ name: "1" }, { name: omit }].concat(
        _.range(pgNum - 2, count).map((i) => ({ name: `${i + 1}` }))
      );
    console.log([
      { name: "1" },
      { name: omit },
      { name: pgNum - 1 + "" },
      { name: pgNum + "" },
      { name: pgNum + 1 + "" },
      { name: omit },
      { name: count + "" },
    ])
    return [
      { name: "1" },
      { name: omit },
      { name: pgNum - 1 + "" },
      { name: pgNum + "" },
      { name: pgNum + 1 + "" },
      { name: omit },
      { name: count + "" },
    ];
  }, [count, pgNum]);
  const doNext = ()=>{
    onChange && pgNum<count && onChange(_.toNumber(pgNum+1))
  }
  const doPrev = ()=>{
    onChange && pgNum>1 && onChange(_.toNumber(pgNum-1))
  }
  return (
    <div className={classnames('flex justify-center text-gray-400 text-sm mt-10',className)}>
      <div className="flex">
        {
          count>3 &&
          <span onClick={doPrev} className="mr-8 cursor-pointer">&lt;</span>
        }
        {items.map((page, i) => (
          <div key={`key_page_${i}`}
            className={classnames({
              "text-black": page.name === "" + pgNum,
              omit: page.name === omit,
            },'mr-8 cursor-pointer')}
            onClick={() => {
              onChange && page.name !== omit && onChange(_.toNumber(page.name));
            }}
          >
            {page.name}
          </div>
        ))}
        {
          count>3 &&
          <span onClick={doNext} className="cursor-pointer">&gt;</span>
        }
      </div>
    </div>
  );
}
