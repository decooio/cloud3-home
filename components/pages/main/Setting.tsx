import { Select } from "@components/common/Select";
import { AuthIpfsEndpoint } from "@lib/config";
import { useOn } from "@lib/hooks/tools";
import { useGateway } from "@lib/hooks/useGateway";
import React, { useMemo, useState } from "react";
import { MainLayout } from "./MainLayout";

export const Setting = React.memo(() => {
  const { list, current, setCurrent } = useGateway();
  const optionsGateway: (AuthIpfsEndpoint & { text: string })[] =
    useMemo(() => {
      return list.map((item) => ({
        ...item,
        text: `${item.name} ${item.location}`,
      }));
    }, [list]);

  const optionsStrategy: any[] = useMemo(() => {
    return [
      { text: "Random" },
      // { text: "77777" },
      // { text: "88888" },
      // { text: "99999" },
    ];
  }, []);

  const [currentGateway, setGateway] = useState(() =>
    optionsGateway.find((item) => item.value === current.value)
  );
  const onGatewayChange = useOn((item) => {
    setGateway(item);
    setCurrent(list.find((l) => l.value === (item as AuthIpfsEndpoint).value));
  });
  const [currentStrategy, setStrategy] = useState(optionsStrategy[0]);

  return (
    <MainLayout menuId={2}>
      <div className="flex-1 w-full h-full overflow-y-auto">
        <div className=" m-8 px-8 py-[1.5625rem] border-solid border-black-1 border min-w-[35rem]">
          <div className=" font-medium text-xl">Preferences</div>
          <div className=" mt-4 whitespace-nowrap flex items-center">
            <span className="font-medium text-lg">
              Choose preferred gateway :
            </span>
            <Select
              className=" ml-2"
              options={optionsGateway}
              current={currentGateway}
              onOptionChange={onGatewayChange}
            />
          </div>
          <div className=" mt-4 whitespace-nowrap flex items-center">
            <span className="font-medium text-lg">
              Gateway Match Strategy :
            </span>
            <Select
              className=" ml-2"
              options={optionsStrategy}
              current={currentStrategy}
              onOptionChange={setStrategy}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
});
